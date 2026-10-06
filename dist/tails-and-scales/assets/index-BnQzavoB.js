(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ja="160",Zn={ROTATE:0,DOLLY:1,PAN:2},Ki={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},nd=0,Xc=1,id=2,hu=1,uu=2,Jn=3,Mi=0,sn=1,un=2,gi=0,ws=1,$c=2,jc=3,qc=4,sd=5,Di=100,rd=101,od=102,Yc=103,Kc=104,ad=200,cd=201,ld=202,hd=203,Da=204,Ia=205,ud=206,fd=207,dd=208,pd=209,md=210,gd=211,_d=212,vd=213,xd=214,Md=0,yd=1,Sd=2,io=3,bd=4,Ed=5,wd=6,Td=7,Za=0,Ad=1,Rd=2,_i=0,Cd=1,Pd=2,Ld=3,fu=4,Dd=5,Id=6,du=300,Ps=301,Ls=302,Ua=303,Na=304,xo=306,so=1e3,Tn=1001,Oa=1002,Be=1003,Jc=1004,ko=1005,nn=1006,Ud=1007,ur=1008,vi=1009,Nd=1010,Od=1011,Qa=1012,pu=1013,pi=1014,mi=1015,fr=1016,mu=1017,gu=1018,Ui=1020,zd=1021,_n=1023,Fd=1024,Bd=1025,Ni=1026,Ds=1027,kd=1028,_u=1029,Hd=1030,vu=1031,xu=1033,Ho=33776,Go=33777,Vo=33778,Wo=33779,Zc=35840,Qc=35841,tl=35842,el=35843,Mu=36196,nl=37492,il=37496,sl=37808,rl=37809,ol=37810,al=37811,cl=37812,ll=37813,hl=37814,ul=37815,fl=37816,dl=37817,pl=37818,ml=37819,gl=37820,_l=37821,Xo=36492,vl=36494,xl=36495,Gd=36283,Ml=36284,yl=36285,Sl=36286,yu=3e3,Oi=3001,Vd=3200,Wd=3201,tc=0,Xd=1,vn="",Te="srgb",si="srgb-linear",ec="display-p3",Mo="display-p3-linear",ro="linear",fe="srgb",oo="rec709",ao="p3",Ji=7680,bl=519,$d=512,jd=513,qd=514,Su=515,Yd=516,Kd=517,Jd=518,Zd=519,El=35044,Qd=35048,wl="300 es",za=1035,ei=2e3,co=2001;class Wi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zr=Math.PI/180,Fa=180/Math.PI;function _r(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ge[i&255]+Ge[i>>8&255]+Ge[i>>16&255]+Ge[i>>24&255]+"-"+Ge[t&255]+Ge[t>>8&255]+"-"+Ge[t>>16&15|64]+Ge[t>>24&255]+"-"+Ge[e&63|128]+Ge[e>>8&255]+"-"+Ge[e>>16&255]+Ge[e>>24&255]+Ge[n&255]+Ge[n>>8&255]+Ge[n>>16&255]+Ge[n>>24&255]).toLowerCase()}function Ie(i,t,e){return Math.max(t,Math.min(e,i))}function tp(i,t){return(i%t+t)%t}function $o(i,t,e){return(1-e)*i+e*t}function Tl(i){return(i&i-1)===0&&i!==0}function Ba(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function $s(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function en(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ep={DEG2RAD:Zr};class ut{constructor(t=0,e=0){ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,n,s,r,o,a,c,h){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,h)}set(t,e,n,s,r,o,a,c,h){const l=this.elements;return l[0]=t,l[1]=s,l[2]=a,l[3]=e,l[4]=r,l[5]=c,l[6]=n,l[7]=o,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],h=n[1],l=n[4],u=n[7],f=n[2],p=n[5],g=n[8],_=s[0],m=s[3],d=s[6],v=s[1],x=s[4],M=s[7],P=s[2],w=s[5],T=s[8];return r[0]=o*_+a*v+c*P,r[3]=o*m+a*x+c*w,r[6]=o*d+a*M+c*T,r[1]=h*_+l*v+u*P,r[4]=h*m+l*x+u*w,r[7]=h*d+l*M+u*T,r[2]=f*_+p*v+g*P,r[5]=f*m+p*x+g*w,r[8]=f*d+p*M+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8];return e*o*l-e*a*h-n*r*l+n*a*c+s*r*h-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8],u=l*o-a*h,f=a*c-l*r,p=h*r-o*c,g=e*u+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*h-l*n)*_,t[2]=(a*n-s*o)*_,t[3]=f*_,t[4]=(l*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=p*_,t[7]=(n*c-h*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*o+h*a)+o+t,-s*h,s*c,-s*(-h*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(jo.makeScale(t,e)),this}rotate(t){return this.premultiply(jo.makeRotation(-t)),this}translate(t,e){return this.premultiply(jo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const jo=new Jt;function bu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function lo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function np(){const i=lo("canvas");return i.style.display="block",i}const Al={};function ir(i){i in Al||(Al[i]=!0,console.warn(i))}const Rl=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Cl=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),wr={[si]:{transfer:ro,primaries:oo,toReference:i=>i,fromReference:i=>i},[Te]:{transfer:fe,primaries:oo,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Mo]:{transfer:ro,primaries:ao,toReference:i=>i.applyMatrix3(Cl),fromReference:i=>i.applyMatrix3(Rl)},[ec]:{transfer:fe,primaries:ao,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Cl),fromReference:i=>i.applyMatrix3(Rl).convertLinearToSRGB()}},ip=new Set([si,Mo]),he={enabled:!0,_workingColorSpace:si,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!ip.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=wr[t].toReference,s=wr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return wr[i].primaries},getTransfer:function(i){return i===vn?ro:wr[i].transfer}};function Ts(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function qo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Zi;class Eu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Zi===void 0&&(Zi=lo("canvas")),Zi.width=t.width,Zi.height=t.height;const n=Zi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Zi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=lo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ts(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ts(e[n]/255)*255):e[n]=Ts(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let sp=0;class wu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:sp++}),this.uuid=_r(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Yo(s[o].image)):r.push(Yo(s[o]))}else r=Yo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Yo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Eu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let rp=0;class Ze extends Wi{constructor(t=Ze.DEFAULT_IMAGE,e=Ze.DEFAULT_MAPPING,n=Tn,s=Tn,r=nn,o=ur,a=_n,c=vi,h=Ze.DEFAULT_ANISOTROPY,l=vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=_r(),this.name="",this.source=new wu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof l=="string"?this.colorSpace=l:(ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=l===Oi?Te:vn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==du)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case so:t.x=t.x-Math.floor(t.x);break;case Tn:t.x=t.x<0?0:1;break;case Oa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case so:t.y=t.y-Math.floor(t.y);break;case Tn:t.y=t.y<0?0:1;break;case Oa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Te?Oi:yu}set encoding(t){ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Oi?Te:vn}}Ze.DEFAULT_IMAGE=null;Ze.DEFAULT_MAPPING=du;Ze.DEFAULT_ANISOTROPY=1;class pe{constructor(t=0,e=0,n=0,s=1){pe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,h=c[0],l=c[4],u=c[8],f=c[1],p=c[5],g=c[9],_=c[2],m=c[6],d=c[10];if(Math.abs(l-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(h+1)/2,M=(p+1)/2,P=(d+1)/2,w=(l+f)/4,T=(u+_)/4,N=(g+m)/4;return x>M&&x>P?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=w/n,r=T/n):M>P?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=w/s,r=N/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=T/r,s=N/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-l)*(f-l));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-_)/v,this.z=(f-l)/v,this.w=Math.acos((h+p+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class op extends Wi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(ir("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Oi?Te:vn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ze(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new wu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ki extends op{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Tu extends Ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Be,this.minFilter=Be,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ap extends Ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Be,this.minFilter=Be,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],h=n[s+1],l=n[s+2],u=n[s+3];const f=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==f||h!==p||l!==g){let m=1-a;const d=c*f+h*p+l*g+u*_,v=d>=0?1:-1,x=1-d*d;if(x>Number.EPSILON){const P=Math.sqrt(x),w=Math.atan2(P,d*v);m=Math.sin(m*w)/P,a=Math.sin(a*w)/P}const M=a*v;if(c=c*m+f*M,h=h*m+p*M,l=l*m+g*M,u=u*m+_*M,m===1-a){const P=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=P,h*=P,l*=P,u*=P}}t[e]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],h=n[s+2],l=n[s+3],u=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+l*u+c*p-h*f,t[e+1]=c*g+l*f+h*u-a*p,t[e+2]=h*g+l*p+a*f-c*u,t[e+3]=l*g-a*u-c*f-h*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,h=a(n/2),l=a(s/2),u=a(r/2),f=c(n/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*l*u+h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u-f*p*g;break;case"YXZ":this._x=f*l*u+h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u+f*p*g;break;case"ZXY":this._x=f*l*u-h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u-f*p*g;break;case"ZYX":this._x=f*l*u-h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u+f*p*g;break;case"YZX":this._x=f*l*u+h*p*g,this._y=h*p*u+f*l*g,this._z=h*l*g-f*p*u,this._w=h*l*u-f*p*g;break;case"XZY":this._x=f*l*u-h*p*g,this._y=h*p*u-f*l*g,this._z=h*l*g+f*p*u,this._w=h*l*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],h=e[2],l=e[6],u=e[10],f=n+a+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(o-s)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+h)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(r-h)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+l)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,h=e._z,l=e._w;return this._x=n*l+o*a+s*h-r*c,this._y=s*l+o*c+r*a-n*h,this._z=r*l+o*h+n*c-s*a,this._w=o*l-n*a-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const h=Math.sqrt(c),l=Math.atan2(h,a),u=Math.sin((1-e)*l)/h,f=Math.sin(e*l)/h;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Pl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Pl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,h=2*(o*s-a*n),l=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*h+o*u-a*l,this.y=n+c*l+a*h-r*u,this.z=s+c*u+r*l-o*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ko.copy(this).projectOnVector(t),this.sub(Ko)}reflect(t){return this.sub(Ko.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ko=new R,Pl=new zn;class Xi{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(yn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(yn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=yn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,yn):yn.fromBufferAttribute(r,o),yn.applyMatrix4(t.matrixWorld),this.expandByPoint(yn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Tr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Tr.copy(n.boundingBox)),Tr.applyMatrix4(t.matrixWorld),this.union(Tr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,yn),yn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(js),Ar.subVectors(this.max,js),Qi.subVectors(t.a,js),ts.subVectors(t.b,js),es.subVectors(t.c,js),ai.subVectors(ts,Qi),ci.subVectors(es,ts),Ei.subVectors(Qi,es);let e=[0,-ai.z,ai.y,0,-ci.z,ci.y,0,-Ei.z,Ei.y,ai.z,0,-ai.x,ci.z,0,-ci.x,Ei.z,0,-Ei.x,-ai.y,ai.x,0,-ci.y,ci.x,0,-Ei.y,Ei.x,0];return!Jo(e,Qi,ts,es,Ar)||(e=[1,0,0,0,1,0,0,0,1],!Jo(e,Qi,ts,es,Ar))?!1:(Rr.crossVectors(ai,ci),e=[Rr.x,Rr.y,Rr.z],Jo(e,Qi,ts,es,Ar))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,yn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(yn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Xn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Xn=[new R,new R,new R,new R,new R,new R,new R,new R],yn=new R,Tr=new Xi,Qi=new R,ts=new R,es=new R,ai=new R,ci=new R,Ei=new R,js=new R,Ar=new R,Rr=new R,wi=new R;function Jo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){wi.fromArray(i,r);const a=s.x*Math.abs(wi.x)+s.y*Math.abs(wi.y)+s.z*Math.abs(wi.z),c=t.dot(wi),h=e.dot(wi),l=n.dot(wi);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>a)return!1}return!0}const cp=new Xi,qs=new R,Zo=new R;class zs{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):cp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;qs.subVectors(t,this.center);const e=qs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(qs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Zo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(qs.copy(t.center).add(Zo)),this.expandByPoint(qs.copy(t.center).sub(Zo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const $n=new R,Qo=new R,Cr=new R,li=new R,ta=new R,Pr=new R,ea=new R;class yo{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,$n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=$n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):($n.copy(this.origin).addScaledVector(this.direction,e),$n.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Qo.copy(t).add(e).multiplyScalar(.5),Cr.copy(e).sub(t).normalize(),li.copy(this.origin).sub(Qo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Cr),a=li.dot(this.direction),c=-li.dot(Cr),h=li.lengthSq(),l=Math.abs(1-o*o);let u,f,p,g;if(l>0)if(u=o*c-a,f=o*a-c,g=r*l,u>=0)if(f>=-g)if(f<=g){const _=1/l;u*=_,f*=_,p=u*(u+o*f+2*a)+f*(o*u+f+2*c)+h}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+h):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Qo).addScaledVector(Cr,f),p}intersectSphere(t,e){$n.subVectors(t.center,this.origin);const n=$n.dot(this.direction),s=$n.dot($n)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(n=(t.min.x-f.x)*h,s=(t.max.x-f.x)*h):(n=(t.max.x-f.x)*h,s=(t.min.x-f.x)*h),l>=0?(r=(t.min.y-f.y)*l,o=(t.max.y-f.y)*l):(r=(t.max.y-f.y)*l,o=(t.min.y-f.y)*l),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,$n)!==null}intersectTriangle(t,e,n,s,r){ta.subVectors(e,t),Pr.subVectors(n,t),ea.crossVectors(ta,Pr);let o=this.direction.dot(ea),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;li.subVectors(this.origin,t);const c=a*this.direction.dot(Pr.crossVectors(li,Pr));if(c<0)return null;const h=a*this.direction.dot(ta.cross(li));if(h<0||c+h>o)return null;const l=-a*li.dot(ea);return l<0?null:this.at(l/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class le{constructor(t,e,n,s,r,o,a,c,h,l,u,f,p,g,_,m){le.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,h,l,u,f,p,g,_,m)}set(t,e,n,s,r,o,a,c,h,l,u,f,p,g,_,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=h,d[6]=l,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new le().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ns.setFromMatrixColumn(t,0).length(),r=1/ns.setFromMatrixColumn(t,1).length(),o=1/ns.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*l,p=o*u,g=a*l,_=a*u;e[0]=c*l,e[4]=-c*u,e[8]=h,e[1]=p+g*h,e[5]=f-_*h,e[9]=-a*c,e[2]=_-f*h,e[6]=g+p*h,e[10]=o*c}else if(t.order==="YXZ"){const f=c*l,p=c*u,g=h*l,_=h*u;e[0]=f+_*a,e[4]=g*a-p,e[8]=o*h,e[1]=o*u,e[5]=o*l,e[9]=-a,e[2]=p*a-g,e[6]=_+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*l,p=c*u,g=h*l,_=h*u;e[0]=f-_*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*l,e[9]=_-f*a,e[2]=-o*h,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*l,p=o*u,g=a*l,_=a*u;e[0]=c*l,e[4]=g*h-p,e[8]=f*h+_,e[1]=c*u,e[5]=_*h+f,e[9]=p*h-g,e[2]=-h,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,p=o*h,g=a*c,_=a*h;e[0]=c*l,e[4]=_-f*u,e[8]=g*u+p,e[1]=u,e[5]=o*l,e[9]=-a*l,e[2]=-h*l,e[6]=p*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=o*c,p=o*h,g=a*c,_=a*h;e[0]=c*l,e[4]=-u,e[8]=h*l,e[1]=f*u+_,e[5]=o*l,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*l,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(lp,t,hp)}lookAt(t,e,n){const s=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),hi.crossVectors(n,an),hi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),hi.crossVectors(n,an)),hi.normalize(),Lr.crossVectors(an,hi),s[0]=hi.x,s[4]=Lr.x,s[8]=an.x,s[1]=hi.y,s[5]=Lr.y,s[9]=an.y,s[2]=hi.z,s[6]=Lr.z,s[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],h=n[12],l=n[1],u=n[5],f=n[9],p=n[13],g=n[2],_=n[6],m=n[10],d=n[14],v=n[3],x=n[7],M=n[11],P=n[15],w=s[0],T=s[4],N=s[8],y=s[12],b=s[1],H=s[5],G=s[9],J=s[13],D=s[2],F=s[6],W=s[10],Y=s[14],j=s[3],q=s[7],K=s[11],at=s[15];return r[0]=o*w+a*b+c*D+h*j,r[4]=o*T+a*H+c*F+h*q,r[8]=o*N+a*G+c*W+h*K,r[12]=o*y+a*J+c*Y+h*at,r[1]=l*w+u*b+f*D+p*j,r[5]=l*T+u*H+f*F+p*q,r[9]=l*N+u*G+f*W+p*K,r[13]=l*y+u*J+f*Y+p*at,r[2]=g*w+_*b+m*D+d*j,r[6]=g*T+_*H+m*F+d*q,r[10]=g*N+_*G+m*W+d*K,r[14]=g*y+_*J+m*Y+d*at,r[3]=v*w+x*b+M*D+P*j,r[7]=v*T+x*H+M*F+P*q,r[11]=v*N+x*G+M*W+P*K,r[15]=v*y+x*J+M*Y+P*at,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],h=t[13],l=t[2],u=t[6],f=t[10],p=t[14],g=t[3],_=t[7],m=t[11],d=t[15];return g*(+r*c*u-s*h*u-r*a*f+n*h*f+s*a*p-n*c*p)+_*(+e*c*p-e*h*f+r*o*f-s*o*p+s*h*l-r*c*l)+m*(+e*h*u-e*a*p-r*o*u+n*o*p+r*a*l-n*h*l)+d*(-s*a*l-e*c*u+e*a*f+s*o*u-n*o*f+n*c*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8],u=t[9],f=t[10],p=t[11],g=t[12],_=t[13],m=t[14],d=t[15],v=u*m*h-_*f*h+_*c*p-a*m*p-u*c*d+a*f*d,x=g*f*h-l*m*h-g*c*p+o*m*p+l*c*d-o*f*d,M=l*_*h-g*u*h+g*a*p-o*_*p-l*a*d+o*u*d,P=g*u*c-l*_*c-g*a*f+o*_*f+l*a*m-o*u*m,w=e*v+n*x+s*M+r*P;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return t[0]=v*T,t[1]=(_*f*r-u*m*r-_*s*p+n*m*p+u*s*d-n*f*d)*T,t[2]=(a*m*r-_*c*r+_*s*h-n*m*h-a*s*d+n*c*d)*T,t[3]=(u*c*r-a*f*r-u*s*h+n*f*h+a*s*p-n*c*p)*T,t[4]=x*T,t[5]=(l*m*r-g*f*r+g*s*p-e*m*p-l*s*d+e*f*d)*T,t[6]=(g*c*r-o*m*r-g*s*h+e*m*h+o*s*d-e*c*d)*T,t[7]=(o*f*r-l*c*r+l*s*h-e*f*h-o*s*p+e*c*p)*T,t[8]=M*T,t[9]=(g*u*r-l*_*r-g*n*p+e*_*p+l*n*d-e*u*d)*T,t[10]=(o*_*r-g*a*r+g*n*h-e*_*h-o*n*d+e*a*d)*T,t[11]=(l*a*r-o*u*r-l*n*h+e*u*h+o*n*p-e*a*p)*T,t[12]=P*T,t[13]=(l*_*s-g*u*s+g*n*f-e*_*f-l*n*m+e*u*m)*T,t[14]=(g*a*s-o*_*s-g*n*c+e*_*c+o*n*m-e*a*m)*T,t[15]=(o*u*s-l*a*s+l*n*c-e*u*c-o*n*f+e*a*f)*T,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,h=r*o,l=r*a;return this.set(h*o+n,h*a-s*c,h*c+s*a,0,h*a+s*c,l*a+n,l*c-s*o,0,h*c-s*a,l*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,h=r+r,l=o+o,u=a+a,f=r*h,p=r*l,g=r*u,_=o*l,m=o*u,d=a*u,v=c*h,x=c*l,M=c*u,P=n.x,w=n.y,T=n.z;return s[0]=(1-(_+d))*P,s[1]=(p+M)*P,s[2]=(g-x)*P,s[3]=0,s[4]=(p-M)*w,s[5]=(1-(f+d))*w,s[6]=(m+v)*w,s[7]=0,s[8]=(g+x)*T,s[9]=(m-v)*T,s[10]=(1-(f+_))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ns.set(s[0],s[1],s[2]).length();const o=ns.set(s[4],s[5],s[6]).length(),a=ns.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Sn.copy(this);const h=1/r,l=1/o,u=1/a;return Sn.elements[0]*=h,Sn.elements[1]*=h,Sn.elements[2]*=h,Sn.elements[4]*=l,Sn.elements[5]*=l,Sn.elements[6]*=l,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,e.setFromRotationMatrix(Sn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=ei){const c=this.elements,h=2*r/(e-t),l=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let p,g;if(a===ei)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===co)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=ei){const c=this.elements,h=1/(e-t),l=1/(n-s),u=1/(o-r),f=(e+t)*h,p=(n+s)*l;let g,_;if(a===ei)g=(o+r)*u,_=-2*u;else if(a===co)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ns=new R,Sn=new le,lp=new R(0,0,0),hp=new R(1,1,1),hi=new R,Lr=new R,an=new R,Ll=new le,Dl=new zn;class Fs{constructor(t=0,e=0,n=0,s=Fs.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],h=s[5],l=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ie(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(Ie(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ll.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ll,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Dl.setFromEuler(this),this.setFromQuaternion(Dl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fs.DEFAULT_ORDER="XYZ";class nc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let up=0;const Il=new R,is=new zn,jn=new le,Dr=new R,Ys=new R,fp=new R,dp=new zn,Ul=new R(1,0,0),Nl=new R(0,1,0),Ol=new R(0,0,1),pp={type:"added"},mp={type:"removed"};class Ue extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=_r(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ue.DEFAULT_UP.clone();const t=new R,e=new Fs,n=new zn,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new le},normalMatrix:{value:new Jt}}),this.matrix=new le,this.matrixWorld=new le,this.matrixAutoUpdate=Ue.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.multiply(is),this}rotateOnWorldAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.premultiply(is),this}rotateX(t){return this.rotateOnAxis(Ul,t)}rotateY(t){return this.rotateOnAxis(Nl,t)}rotateZ(t){return this.rotateOnAxis(Ol,t)}translateOnAxis(t,e){return Il.copy(t).applyQuaternion(this.quaternion),this.position.add(Il.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ul,t)}translateY(t){return this.translateOnAxis(Nl,t)}translateZ(t){return this.translateOnAxis(Ol,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Dr.copy(t):Dr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(Ys,Dr,this.up):jn.lookAt(Dr,Ys,this.up),this.quaternion.setFromRotationMatrix(jn),s&&(jn.extractRotation(s.matrixWorld),is.setFromRotationMatrix(jn),this.quaternion.premultiply(is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(pp)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(mp)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),jn.multiply(t.parent.matrixWorld)),t.applyMatrix4(jn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,t,fp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,dp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){const u=c[h];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,h=this.material.length;c<h;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),h=o(t.textures),l=o(t.images),u=o(t.shapes),f=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const h in a){const l=a[h];delete l.metadata,c.push(l)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ue.DEFAULT_UP=new R(0,1,0);Ue.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bn=new R,qn=new R,na=new R,Yn=new R,ss=new R,rs=new R,zl=new R,ia=new R,sa=new R,ra=new R;let Ir=!1;class wn{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),bn.subVectors(t,e),s.cross(bn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){bn.subVectors(s,e),qn.subVectors(n,e),na.subVectors(t,e);const o=bn.dot(bn),a=bn.dot(qn),c=bn.dot(na),h=qn.dot(qn),l=qn.dot(na),u=o*h-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(h*c-a*l)*f,g=(o*l-a*c)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getUV(t,e,n,s,r,o,a,c){return Ir===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ir=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Yn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Yn.x),c.addScaledVector(o,Yn.y),c.addScaledVector(a,Yn.z),c)}static isFrontFacing(t,e,n,s){return bn.subVectors(n,e),qn.subVectors(t,e),bn.cross(qn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return bn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),bn.cross(qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return wn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Ir===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ir=!0),wn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return wn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;ss.subVectors(s,n),rs.subVectors(r,n),ia.subVectors(t,n);const c=ss.dot(ia),h=rs.dot(ia);if(c<=0&&h<=0)return e.copy(n);sa.subVectors(t,s);const l=ss.dot(sa),u=rs.dot(sa);if(l>=0&&u<=l)return e.copy(s);const f=c*u-l*h;if(f<=0&&c>=0&&l<=0)return o=c/(c-l),e.copy(n).addScaledVector(ss,o);ra.subVectors(t,r);const p=ss.dot(ra),g=rs.dot(ra);if(g>=0&&p<=g)return e.copy(r);const _=p*h-c*g;if(_<=0&&h>=0&&g<=0)return a=h/(h-g),e.copy(n).addScaledVector(rs,a);const m=l*g-p*u;if(m<=0&&u-l>=0&&p-g>=0)return zl.subVectors(r,s),a=(u-l)/(u-l+(p-g)),e.copy(s).addScaledVector(zl,a);const d=1/(m+_+f);return o=_*d,a=f*d,e.copy(n).addScaledVector(ss,o).addScaledVector(rs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Au={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ui={h:0,s:0,l:0},Ur={h:0,s:0,l:0};function oa(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class jt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Te){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=he.workingColorSpace){if(t=tp(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=oa(o,r,t+1/3),this.g=oa(o,r,t),this.b=oa(o,r,t-1/3)}return he.toWorkingColorSpace(this,s),this}setStyle(t,e=Te){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Te){const n=Au[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ts(t.r),this.g=Ts(t.g),this.b=Ts(t.b),this}copyLinearToSRGB(t){return this.r=qo(t.r),this.g=qo(t.g),this.b=qo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Te){return he.fromWorkingColorSpace(Ve.copy(this),t),Math.round(Ie(Ve.r*255,0,255))*65536+Math.round(Ie(Ve.g*255,0,255))*256+Math.round(Ie(Ve.b*255,0,255))}getHexString(t=Te){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace(Ve.copy(this),e);const n=Ve.r,s=Ve.g,r=Ve.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,h;const l=(a+o)/2;if(a===o)c=0,h=0;else{const u=o-a;switch(h=l<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=h,t.l=l,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace(Ve.copy(this),e),t.r=Ve.r,t.g=Ve.g,t.b=Ve.b,t}getStyle(t=Te){he.fromWorkingColorSpace(Ve.copy(this),t);const e=Ve.r,n=Ve.g,s=Ve.b;return t!==Te?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ui),this.setHSL(ui.h+t,ui.s+e,ui.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ui),t.getHSL(Ur);const n=$o(ui.h,Ur.h,e),s=$o(ui.s,Ur.s,e),r=$o(ui.l,Ur.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ve=new jt;jt.NAMES=Au;let gp=0;class $i extends Wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gp++}),this.uuid=_r(),this.name="",this.type="Material",this.blending=ws,this.side=Mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Da,this.blendDst=Ia,this.blendEquation=Di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new jt(0,0,0),this.blendAlpha=0,this.depthFunc=io,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ws&&(n.blending=this.blending),this.side!==Mi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Da&&(n.blendSrc=this.blendSrc),this.blendDst!==Ia&&(n.blendDst=this.blendDst),this.blendEquation!==Di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==io&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ke extends $i{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const we=new R,Nr=new ut;class pn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=El,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Nr.fromBufferAttribute(this,e),Nr.applyMatrix3(t),this.setXY(e,Nr.x,Nr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=$s(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=en(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=$s(e,this.array)),e}setX(t,e){return this.normalized&&(e=en(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=$s(e,this.array)),e}setY(t,e){return this.normalized&&(e=en(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=$s(e,this.array)),e}setZ(t,e){return this.normalized&&(e=en(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=$s(e,this.array)),e}setW(t,e){return this.normalized&&(e=en(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=en(e,this.array),n=en(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=en(e,this.array),n=en(n,this.array),s=en(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=en(e,this.array),n=en(n,this.array),s=en(s,this.array),r=en(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==El&&(t.usage=this.usage),t}}class Ru extends pn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Cu extends pn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends pn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let _p=0;const gn=new le,aa=new Ue,os=new R,cn=new Xi,Ks=new Xi,De=new R;class be extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_p++}),this.uuid=_r(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bu(t)?Cu:Ru)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return gn.makeRotationFromQuaternion(t),this.applyMatrix4(gn),this}rotateX(t){return gn.makeRotationX(t),this.applyMatrix4(gn),this}rotateY(t){return gn.makeRotationY(t),this.applyMatrix4(gn),this}rotateZ(t){return gn.makeRotationZ(t),this.applyMatrix4(gn),this}translate(t,e,n){return gn.makeTranslation(t,e,n),this.applyMatrix4(gn),this}scale(t,e,n){return gn.makeScale(t,e,n),this.applyMatrix4(gn),this}lookAt(t){return aa.lookAt(t),aa.updateMatrix(),this.applyMatrix4(aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(os).negate(),this.translate(os.x,os.y,os.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new re(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Xi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];cn.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(cn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Ks.setFromBufferAttribute(a),this.morphTargetsRelative?(De.addVectors(cn.min,Ks.min),cn.expandByPoint(De),De.addVectors(cn.max,Ks.max),cn.expandByPoint(De)):(cn.expandByPoint(Ks.min),cn.expandByPoint(Ks.max))}cn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)De.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(De));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let h=0,l=a.count;h<l;h++)De.fromBufferAttribute(a,h),c&&(os.fromBufferAttribute(t,h),De.add(os)),s=Math.max(s,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pn(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,h=[],l=[];for(let b=0;b<a;b++)h[b]=new R,l[b]=new R;const u=new R,f=new R,p=new R,g=new ut,_=new ut,m=new ut,d=new R,v=new R;function x(b,H,G){u.fromArray(s,b*3),f.fromArray(s,H*3),p.fromArray(s,G*3),g.fromArray(o,b*2),_.fromArray(o,H*2),m.fromArray(o,G*2),f.sub(u),p.sub(u),_.sub(g),m.sub(g);const J=1/(_.x*m.y-m.x*_.y);isFinite(J)&&(d.copy(f).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(J),v.copy(p).multiplyScalar(_.x).addScaledVector(f,-m.x).multiplyScalar(J),h[b].add(d),h[H].add(d),h[G].add(d),l[b].add(v),l[H].add(v),l[G].add(v))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let b=0,H=M.length;b<H;++b){const G=M[b],J=G.start,D=G.count;for(let F=J,W=J+D;F<W;F+=3)x(n[F+0],n[F+1],n[F+2])}const P=new R,w=new R,T=new R,N=new R;function y(b){T.fromArray(r,b*3),N.copy(T);const H=h[b];P.copy(H),P.sub(T.multiplyScalar(T.dot(H))).normalize(),w.crossVectors(N,H);const J=w.dot(l[b])<0?-1:1;c[b*4]=P.x,c[b*4+1]=P.y,c[b*4+2]=P.z,c[b*4+3]=J}for(let b=0,H=M.length;b<H;++b){const G=M[b],J=G.start,D=G.count;for(let F=J,W=J+D;F<W;F+=3)y(n[F+0]),y(n[F+1]),y(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new pn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new R,r=new R,o=new R,a=new R,c=new R,h=new R,l=new R,u=new R;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,m),a.add(l),c.add(l),h.add(l),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),n.setXYZ(f+0,l.x,l.y,l.z),n.setXYZ(f+1,l.x,l.y,l.z),n.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(a,c){const h=a.array,l=a.itemSize,u=a.normalized,f=new h.constructor(c.length*l);let p=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*l;for(let d=0;d<l;d++)f[g++]=h[p++]}return new pn(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new be,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],h=t(c,n);e.setAttribute(a,h)}const r=this.morphAttributes;for(const a in r){const c=[],h=r[a];for(let l=0,u=h.length;l<u;l++){const f=h[l],p=t(f,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const h=o[a];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],l=[];for(let u=0,f=h.length;u<f;u++){const p=h[u];l.push(p.toJSON(t.data))}l.length>0&&(s[c]=l,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const l=s[h];this.setAttribute(h,l.clone(e))}const r=t.morphAttributes;for(const h in r){const l=[],u=r[h];for(let f=0,p=u.length;f<p;f++)l.push(u[f].clone(e));this.morphAttributes[h]=l}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let h=0,l=o.length;h<l;h++){const u=o[h];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Fl=new le,Ti=new yo,Or=new zs,Bl=new R,as=new R,cs=new R,ls=new R,ca=new R,zr=new R,Fr=new ut,Br=new ut,kr=new ut,kl=new R,Hl=new R,Gl=new R,Hr=new R,Gr=new R;class Ht extends Ue{constructor(t=new be,e=new Ke){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){zr.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const l=a[c],u=r[c];l!==0&&(ca.fromBufferAttribute(u,t),o?zr.addScaledVector(ca,l):zr.addScaledVector(ca.sub(e),l))}e.add(zr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(r),Ti.copy(t.ray).recast(t.near),!(Or.containsPoint(Ti.origin)===!1&&(Ti.intersectSphere(Or,Bl)===null||Ti.origin.distanceToSquared(Bl)>(t.far-t.near)**2))&&(Fl.copy(r).invert(),Ti.copy(t.ray).applyMatrix4(Fl),!(n.boundingBox!==null&&Ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ti)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=v,P=x;M<P;M+=3){const w=a.getX(M),T=a.getX(M+1),N=a.getX(M+2);s=Vr(this,d,t,n,h,l,u,w,T,N),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const v=a.getX(m),x=a.getX(m+1),M=a.getX(m+2);s=Vr(this,o,t,n,h,l,u,v,x,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let M=v,P=x;M<P;M+=3){const w=M,T=M+1,N=M+2;s=Vr(this,d,t,n,h,l,u,w,T,N),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const v=m,x=m+1,M=m+2;s=Vr(this,o,t,n,h,l,u,v,x,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function vp(i,t,e,n,s,r,o,a){let c;if(t.side===sn?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Mi,a),c===null)return null;Gr.copy(a),Gr.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(Gr);return h<e.near||h>e.far?null:{distance:h,point:Gr.clone(),object:i}}function Vr(i,t,e,n,s,r,o,a,c,h){i.getVertexPosition(a,as),i.getVertexPosition(c,cs),i.getVertexPosition(h,ls);const l=vp(i,t,e,n,as,cs,ls,Hr);if(l){s&&(Fr.fromBufferAttribute(s,a),Br.fromBufferAttribute(s,c),kr.fromBufferAttribute(s,h),l.uv=wn.getInterpolation(Hr,as,cs,ls,Fr,Br,kr,new ut)),r&&(Fr.fromBufferAttribute(r,a),Br.fromBufferAttribute(r,c),kr.fromBufferAttribute(r,h),l.uv1=wn.getInterpolation(Hr,as,cs,ls,Fr,Br,kr,new ut),l.uv2=l.uv1),o&&(kl.fromBufferAttribute(o,a),Hl.fromBufferAttribute(o,c),Gl.fromBufferAttribute(o,h),l.normal=wn.getInterpolation(Hr,as,cs,ls,kl,Hl,Gl,new R),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));const u={a,b:c,c:h,normal:new R,materialIndex:0};wn.getNormal(as,cs,ls,u.normal),l.face=u}return l}class Fn extends be{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],h=[],l=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new re(h,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(u,2));function g(_,m,d,v,x,M,P,w,T,N,y){const b=M/T,H=P/N,G=M/2,J=P/2,D=w/2,F=T+1,W=N+1;let Y=0,j=0;const q=new R;for(let K=0;K<W;K++){const at=K*H-J;for(let lt=0;lt<F;lt++){const X=lt*b-G;q[_]=X*v,q[m]=at*x,q[d]=D,h.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[d]=w>0?1:-1,l.push(q.x,q.y,q.z),u.push(lt/T),u.push(1-K/N),Y+=1}}for(let K=0;K<N;K++)for(let at=0;at<T;at++){const lt=f+at+F*K,X=f+at+F*(K+1),Z=f+(at+1)+F*(K+1),mt=f+(at+1)+F*K;c.push(lt,X,mt),c.push(X,Z,mt),j+=6}a.addGroup(p,j,y),p+=j,f+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Is(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ye(i){const t={};for(let e=0;e<i.length;e++){const n=Is(i[e]);for(const s in n)t[s]=n[s]}return t}function xp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Pu(i){return i.getRenderTarget()===null?i.outputColorSpace:he.workingColorSpace}const Mp={clone:Is,merge:Ye};var yp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Hi extends $i{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yp,this.fragmentShader=Sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Is(t.uniforms),this.uniformsGroups=xp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Lu extends Ue{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new le,this.projectionMatrix=new le,this.projectionMatrixInverse=new le,this.coordinateSystem=ei}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class ln extends Lu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Fa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Zr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Fa*2*Math.atan(Math.tan(Zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Zr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,h=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/h,s*=o.width/c,n*=o.height/h}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const hs=-90,us=1;class bp extends Ue{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(hs,us,t,e);s.layers=this.layers,this.add(s);const r=new ln(hs,us,t,e);r.layers=this.layers,this.add(r);const o=new ln(hs,us,t,e);o.layers=this.layers,this.add(o);const a=new ln(hs,us,t,e);a.layers=this.layers,this.add(a);const c=new ln(hs,us,t,e);c.layers=this.layers,this.add(c);const h=new ln(hs,us,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const h of e)this.remove(h);if(t===ei)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===co)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,h,l]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,l),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Du extends Ze{constructor(t,e,n,s,r,o,a,c,h,l){t=t!==void 0?t:[],e=e!==void 0?e:Ps,super(t,e,n,s,r,o,a,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ep extends ki{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(ir("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Oi?Te:vn),this.texture=new Du(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:nn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Fn(5,5,5),r=new Hi({name:"CubemapFromEquirect",uniforms:Is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:gi});r.uniforms.tEquirect.value=e;const o=new Ht(s,r),a=e.minFilter;return e.minFilter===ur&&(e.minFilter=nn),new bp(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const la=new R,wp=new R,Tp=new Jt;class di{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=la.subVectors(n,e).cross(wp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(la),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Tp.getNormalMatrix(t),s=this.coplanarPoint(la).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ai=new zs,Wr=new R;class ic{constructor(t=new di,e=new di,n=new di,s=new di,r=new di,o=new di){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ei){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],h=s[4],l=s[5],u=s[6],f=s[7],p=s[8],g=s[9],_=s[10],m=s[11],d=s[12],v=s[13],x=s[14],M=s[15];if(n[0].setComponents(c-r,f-h,m-p,M-d).normalize(),n[1].setComponents(c+r,f+h,m+p,M+d).normalize(),n[2].setComponents(c+o,f+l,m+g,M+v).normalize(),n[3].setComponents(c-o,f-l,m-g,M-v).normalize(),n[4].setComponents(c-a,f-u,m-_,M-x).normalize(),e===ei)n[5].setComponents(c+a,f+u,m+_,M+x).normalize();else if(e===co)n[5].setComponents(a,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ai.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ai.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ai)}intersectsSprite(t){return Ai.center.set(0,0,0),Ai.radius=.7071067811865476,Ai.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ai)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Wr.x=s.normal.x>0?t.max.x:t.min.x,Wr.y=s.normal.y>0?t.max.y:t.min.y,Wr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Iu(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Ap(i,t){const e=t.isWebGL2,n=new WeakMap;function s(h,l){const u=h.array,f=h.usage,p=u.byteLength,g=i.createBuffer();i.bindBuffer(l,g),i.bufferData(l,u,f),h.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:h.version,size:p}}function r(h,l,u){const f=l.array,p=l._updateRange,g=l.updateRanges;if(i.bindBuffer(u,h),p.count===-1&&g.length===0&&i.bufferSubData(u,0,f),g.length!==0){for(let _=0,m=g.length;_<m;_++){const d=g[_];e?i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}l.clearUpdateRanges()}p.count!==-1&&(e?i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),l.onUploadCallback()}function o(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function a(h){h.isInterleavedBufferAttribute&&(h=h.data);const l=n.get(h);l&&(i.deleteBuffer(l.buffer),n.delete(h))}function c(h,l){if(h.isGLBufferAttribute){const f=n.get(h);(!f||f.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);const u=n.get(h);if(u===void 0)n.set(h,s(h,l));else if(u.version<h.version){if(u.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,h,l),u.version=h.version}}return{get:o,remove:a,update:c}}class yi extends be{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),h=a+1,l=c+1,u=t/a,f=e/c,p=[],g=[],_=[],m=[];for(let d=0;d<l;d++){const v=d*f-o;for(let x=0;x<h;x++){const M=x*u-r;g.push(M,-v,0),_.push(0,0,1),m.push(x/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let v=0;v<a;v++){const x=v+h*d,M=v+h*(d+1),P=v+1+h*(d+1),w=v+1+h*d;p.push(x,M,w),p.push(M,P,w)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(_,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yi(t.width,t.height,t.widthSegments,t.heightSegments)}}var Rp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Cp=`#ifdef USE_ALPHAHASH
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
#endif`,Pp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Dp=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Ip=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Up=`#ifdef USE_AOMAP
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
#endif`,Np=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Op=`#ifdef USE_BATCHING
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
#endif`,zp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Fp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,kp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Hp=`#ifdef USE_IRIDESCENCE
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
#endif`,Gp=`#ifdef USE_BUMPMAP
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
#endif`,Vp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Xp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,$p=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Yp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Kp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Jp=`#define PI 3.141592653589793
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
} // validated`,Zp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Qp=`vec3 transformedNormal = objectNormal;
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
#endif`,tm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,em=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,nm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,im=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sm="gl_FragColor = linearToOutputTexel( gl_FragColor );",rm=`
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
}`,om=`#ifdef USE_ENVMAP
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
#endif`,am=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cm=`#ifdef USE_ENVMAP
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
#endif`,lm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hm=`#ifdef USE_ENVMAP
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
#endif`,um=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mm=`#ifdef USE_GRADIENTMAP
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
}`,gm=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,_m=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mm=`uniform bool receiveShadow;
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
#endif`,ym=`#ifdef USE_ENVMAP
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
#endif`,Sm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,bm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Em=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tm=`PhysicalMaterial material;
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
#endif`,Am=`struct PhysicalMaterial {
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
}`,Rm=`
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
#endif`,Cm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Pm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Dm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Im=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Um=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Nm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Om=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Fm=`#if defined( USE_POINTS_UV )
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
#endif`,Bm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,km=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gm=`#ifdef USE_MORPHNORMALS
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
#endif`,Vm=`#ifdef USE_MORPHTARGETS
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
#endif`,Wm=`#ifdef USE_MORPHTARGETS
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
#endif`,Xm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,$m=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,jm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ym=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Km=`#ifdef USE_NORMALMAP
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
#endif`,Jm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,t0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,e0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,n0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,i0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,s0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,r0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,o0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,a0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,c0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,l0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,h0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,u0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,f0=`float getShadowMask() {
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
}`,d0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,p0=`#ifdef USE_SKINNING
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
#endif`,m0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,g0=`#ifdef USE_SKINNING
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
#endif`,_0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,v0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,x0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,M0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,y0=`#ifdef USE_TRANSMISSION
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
#endif`,S0=`#ifdef USE_TRANSMISSION
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
#endif`,b0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,E0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,w0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,T0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const A0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,R0=`uniform sampler2D t2D;
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
}`,C0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,P0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,L0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,D0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,I0=`#include <common>
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
}`,U0=`#if DEPTH_PACKING == 3200
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
}`,N0=`#define DISTANCE
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
}`,O0=`#define DISTANCE
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
}`,z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,F0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B0=`uniform float scale;
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
}`,k0=`uniform vec3 diffuse;
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
}`,H0=`#include <common>
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
}`,G0=`uniform vec3 diffuse;
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
}`,V0=`#define LAMBERT
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
}`,W0=`#define LAMBERT
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
}`,X0=`#define MATCAP
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
}`,$0=`#define MATCAP
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
}`,j0=`#define NORMAL
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
}`,q0=`#define NORMAL
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
}`,Y0=`#define PHONG
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
}`,K0=`#define PHONG
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
}`,J0=`#define STANDARD
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
}`,Z0=`#define STANDARD
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
}`,Q0=`#define TOON
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
}`,tg=`#define TOON
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
}`,eg=`uniform float size;
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
}`,ng=`uniform vec3 diffuse;
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
}`,ig=`#include <common>
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
}`,sg=`uniform vec3 color;
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
}`,rg=`uniform float rotation;
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
}`,og=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:Rp,alphahash_pars_fragment:Cp,alphamap_fragment:Pp,alphamap_pars_fragment:Lp,alphatest_fragment:Dp,alphatest_pars_fragment:Ip,aomap_fragment:Up,aomap_pars_fragment:Np,batching_pars_vertex:Op,batching_vertex:zp,begin_vertex:Fp,beginnormal_vertex:Bp,bsdfs:kp,iridescence_fragment:Hp,bumpmap_pars_fragment:Gp,clipping_planes_fragment:Vp,clipping_planes_pars_fragment:Wp,clipping_planes_pars_vertex:Xp,clipping_planes_vertex:$p,color_fragment:jp,color_pars_fragment:qp,color_pars_vertex:Yp,color_vertex:Kp,common:Jp,cube_uv_reflection_fragment:Zp,defaultnormal_vertex:Qp,displacementmap_pars_vertex:tm,displacementmap_vertex:em,emissivemap_fragment:nm,emissivemap_pars_fragment:im,colorspace_fragment:sm,colorspace_pars_fragment:rm,envmap_fragment:om,envmap_common_pars_fragment:am,envmap_pars_fragment:cm,envmap_pars_vertex:lm,envmap_physical_pars_fragment:ym,envmap_vertex:hm,fog_vertex:um,fog_pars_vertex:fm,fog_fragment:dm,fog_pars_fragment:pm,gradientmap_pars_fragment:mm,lightmap_fragment:gm,lightmap_pars_fragment:_m,lights_lambert_fragment:vm,lights_lambert_pars_fragment:xm,lights_pars_begin:Mm,lights_toon_fragment:Sm,lights_toon_pars_fragment:bm,lights_phong_fragment:Em,lights_phong_pars_fragment:wm,lights_physical_fragment:Tm,lights_physical_pars_fragment:Am,lights_fragment_begin:Rm,lights_fragment_maps:Cm,lights_fragment_end:Pm,logdepthbuf_fragment:Lm,logdepthbuf_pars_fragment:Dm,logdepthbuf_pars_vertex:Im,logdepthbuf_vertex:Um,map_fragment:Nm,map_pars_fragment:Om,map_particle_fragment:zm,map_particle_pars_fragment:Fm,metalnessmap_fragment:Bm,metalnessmap_pars_fragment:km,morphcolor_vertex:Hm,morphnormal_vertex:Gm,morphtarget_pars_vertex:Vm,morphtarget_vertex:Wm,normal_fragment_begin:Xm,normal_fragment_maps:$m,normal_pars_fragment:jm,normal_pars_vertex:qm,normal_vertex:Ym,normalmap_pars_fragment:Km,clearcoat_normal_fragment_begin:Jm,clearcoat_normal_fragment_maps:Zm,clearcoat_pars_fragment:Qm,iridescence_pars_fragment:t0,opaque_fragment:e0,packing:n0,premultiplied_alpha_fragment:i0,project_vertex:s0,dithering_fragment:r0,dithering_pars_fragment:o0,roughnessmap_fragment:a0,roughnessmap_pars_fragment:c0,shadowmap_pars_fragment:l0,shadowmap_pars_vertex:h0,shadowmap_vertex:u0,shadowmask_pars_fragment:f0,skinbase_vertex:d0,skinning_pars_vertex:p0,skinning_vertex:m0,skinnormal_vertex:g0,specularmap_fragment:_0,specularmap_pars_fragment:v0,tonemapping_fragment:x0,tonemapping_pars_fragment:M0,transmission_fragment:y0,transmission_pars_fragment:S0,uv_pars_fragment:b0,uv_pars_vertex:E0,uv_vertex:w0,worldpos_vertex:T0,background_vert:A0,background_frag:R0,backgroundCube_vert:C0,backgroundCube_frag:P0,cube_vert:L0,cube_frag:D0,depth_vert:I0,depth_frag:U0,distanceRGBA_vert:N0,distanceRGBA_frag:O0,equirect_vert:z0,equirect_frag:F0,linedashed_vert:B0,linedashed_frag:k0,meshbasic_vert:H0,meshbasic_frag:G0,meshlambert_vert:V0,meshlambert_frag:W0,meshmatcap_vert:X0,meshmatcap_frag:$0,meshnormal_vert:j0,meshnormal_frag:q0,meshphong_vert:Y0,meshphong_frag:K0,meshphysical_vert:J0,meshphysical_frag:Z0,meshtoon_vert:Q0,meshtoon_frag:tg,points_vert:eg,points_frag:ng,shadow_vert:ig,shadow_frag:sg,sprite_vert:rg,sprite_frag:og},ht={common:{diffuse:{value:new jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new jt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Un={basic:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new jt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Ye([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new jt(0)},specular:{value:new jt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Ye([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Ye([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new jt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Ye([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Ye([ht.points,ht.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Ye([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Ye([ht.common,ht.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Ye([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Ye([ht.sprite,ht.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Ye([ht.common,ht.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Ye([ht.lights,ht.fog,{color:{value:new jt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Un.physical={uniforms:Ye([Un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new jt(0)},specularColor:{value:new jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const Xr={r:0,b:0,g:0};function ag(i,t,e,n,s,r,o){const a=new jt(0);let c=r===!0?0:1,h,l,u=null,f=0,p=null;function g(m,d){let v=!1,x=d.isScene===!0?d.background:null;x&&x.isTexture&&(x=(d.backgroundBlurriness>0?e:t).get(x)),x===null?_(a,c):x&&x.isColor&&(_(x,1),v=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===xo)?(l===void 0&&(l=new Ht(new Fn(1,1,1),new Hi({name:"BackgroundCubeMaterial",uniforms:Is(Un.backgroundCube.uniforms),vertexShader:Un.backgroundCube.vertexShader,fragmentShader:Un.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(P,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),l.material.uniforms.envMap.value=x,l.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=he.getTransfer(x.colorSpace)!==fe,(u!==x||f!==x.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null)):x&&x.isTexture&&(h===void 0&&(h=new Ht(new yi(2,2),new Hi({name:"BackgroundMaterial",uniforms:Is(Un.background.uniforms),vertexShader:Un.background.vertexShader,fragmentShader:Un.background.fragmentShader,side:Mi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=x,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=he.getTransfer(x.colorSpace)!==fe,x.matrixAutoUpdate===!0&&x.updateMatrix(),h.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null))}function _(m,d){m.getRGB(Xr,Pu(i)),n.buffers.color.setClear(Xr.r,Xr.g,Xr.b,d,o)}return{getClearColor:function(){return a},setClearColor:function(m,d=1){a.set(m),c=d,_(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(a,c)},render:g}}function cg(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null);let h=c,l=!1;function u(D,F,W,Y,j){let q=!1;if(o){const K=_(Y,W,F);h!==K&&(h=K,p(h.object)),q=d(D,Y,W,j),q&&v(D,Y,W,j)}else{const K=F.wireframe===!0;(h.geometry!==Y.id||h.program!==W.id||h.wireframe!==K)&&(h.geometry=Y.id,h.program=W.id,h.wireframe=K,q=!0)}j!==null&&e.update(j,i.ELEMENT_ARRAY_BUFFER),(q||l)&&(l=!1,N(D,F,W,Y),j!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(D){return n.isWebGL2?i.bindVertexArray(D):r.bindVertexArrayOES(D)}function g(D){return n.isWebGL2?i.deleteVertexArray(D):r.deleteVertexArrayOES(D)}function _(D,F,W){const Y=W.wireframe===!0;let j=a[D.id];j===void 0&&(j={},a[D.id]=j);let q=j[F.id];q===void 0&&(q={},j[F.id]=q);let K=q[Y];return K===void 0&&(K=m(f()),q[Y]=K),K}function m(D){const F=[],W=[],Y=[];for(let j=0;j<s;j++)F[j]=0,W[j]=0,Y[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:W,attributeDivisors:Y,object:D,attributes:{},index:null}}function d(D,F,W,Y){const j=h.attributes,q=F.attributes;let K=0;const at=W.getAttributes();for(const lt in at)if(at[lt].location>=0){const Z=j[lt];let mt=q[lt];if(mt===void 0&&(lt==="instanceMatrix"&&D.instanceMatrix&&(mt=D.instanceMatrix),lt==="instanceColor"&&D.instanceColor&&(mt=D.instanceColor)),Z===void 0||Z.attribute!==mt||mt&&Z.data!==mt.data)return!0;K++}return h.attributesNum!==K||h.index!==Y}function v(D,F,W,Y){const j={},q=F.attributes;let K=0;const at=W.getAttributes();for(const lt in at)if(at[lt].location>=0){let Z=q[lt];Z===void 0&&(lt==="instanceMatrix"&&D.instanceMatrix&&(Z=D.instanceMatrix),lt==="instanceColor"&&D.instanceColor&&(Z=D.instanceColor));const mt={};mt.attribute=Z,Z&&Z.data&&(mt.data=Z.data),j[lt]=mt,K++}h.attributes=j,h.attributesNum=K,h.index=Y}function x(){const D=h.newAttributes;for(let F=0,W=D.length;F<W;F++)D[F]=0}function M(D){P(D,0)}function P(D,F){const W=h.newAttributes,Y=h.enabledAttributes,j=h.attributeDivisors;W[D]=1,Y[D]===0&&(i.enableVertexAttribArray(D),Y[D]=1),j[D]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,F),j[D]=F)}function w(){const D=h.newAttributes,F=h.enabledAttributes;for(let W=0,Y=F.length;W<Y;W++)F[W]!==D[W]&&(i.disableVertexAttribArray(W),F[W]=0)}function T(D,F,W,Y,j,q,K){K===!0?i.vertexAttribIPointer(D,F,W,j,q):i.vertexAttribPointer(D,F,W,Y,j,q)}function N(D,F,W,Y){if(n.isWebGL2===!1&&(D.isInstancedMesh||Y.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const j=Y.attributes,q=W.getAttributes(),K=F.defaultAttributeValues;for(const at in q){const lt=q[at];if(lt.location>=0){let X=j[at];if(X===void 0&&(at==="instanceMatrix"&&D.instanceMatrix&&(X=D.instanceMatrix),at==="instanceColor"&&D.instanceColor&&(X=D.instanceColor)),X!==void 0){const Z=X.normalized,mt=X.itemSize,wt=e.get(X);if(wt===void 0)continue;const bt=wt.buffer,Bt=wt.type,kt=wt.bytesPerElement,Lt=n.isWebGL2===!0&&(Bt===i.INT||Bt===i.UNSIGNED_INT||X.gpuType===pu);if(X.isInterleavedBufferAttribute){const Zt=X.data,z=Zt.stride,ze=X.offset;if(Zt.isInstancedInterleavedBuffer){for(let Rt=0;Rt<lt.locationSize;Rt++)P(lt.location+Rt,Zt.meshPerAttribute);D.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=Zt.meshPerAttribute*Zt.count)}else for(let Rt=0;Rt<lt.locationSize;Rt++)M(lt.location+Rt);i.bindBuffer(i.ARRAY_BUFFER,bt);for(let Rt=0;Rt<lt.locationSize;Rt++)T(lt.location+Rt,mt/lt.locationSize,Bt,Z,z*kt,(ze+mt/lt.locationSize*Rt)*kt,Lt)}else{if(X.isInstancedBufferAttribute){for(let Zt=0;Zt<lt.locationSize;Zt++)P(lt.location+Zt,X.meshPerAttribute);D.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Zt=0;Zt<lt.locationSize;Zt++)M(lt.location+Zt);i.bindBuffer(i.ARRAY_BUFFER,bt);for(let Zt=0;Zt<lt.locationSize;Zt++)T(lt.location+Zt,mt/lt.locationSize,Bt,Z,mt*kt,mt/lt.locationSize*Zt*kt,Lt)}}else if(K!==void 0){const Z=K[at];if(Z!==void 0)switch(Z.length){case 2:i.vertexAttrib2fv(lt.location,Z);break;case 3:i.vertexAttrib3fv(lt.location,Z);break;case 4:i.vertexAttrib4fv(lt.location,Z);break;default:i.vertexAttrib1fv(lt.location,Z)}}}}w()}function y(){G();for(const D in a){const F=a[D];for(const W in F){const Y=F[W];for(const j in Y)g(Y[j].object),delete Y[j];delete F[W]}delete a[D]}}function b(D){if(a[D.id]===void 0)return;const F=a[D.id];for(const W in F){const Y=F[W];for(const j in Y)g(Y[j].object),delete Y[j];delete F[W]}delete a[D.id]}function H(D){for(const F in a){const W=a[F];if(W[D.id]===void 0)continue;const Y=W[D.id];for(const j in Y)g(Y[j].object),delete Y[j];delete W[D.id]}}function G(){J(),l=!0,h!==c&&(h=c,p(h.object))}function J(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:G,resetDefaultState:J,dispose:y,releaseStatesOfGeometry:b,releaseStatesOfProgram:H,initAttributes:x,enableAttribute:M,disableUnusedAttributes:w}}function lg(i,t,e,n){const s=n.isWebGL2;let r;function o(l){r=l}function a(l,u){i.drawArrays(r,l,u),e.update(u,r,1)}function c(l,u,f){if(f===0)return;let p,g;if(s)p=i,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,l,u,f),e.update(u,r,f)}function h(l,u,f){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<f;g++)this.render(l[g],u[g]);else{p.multiDrawArraysWEBGL(r,l,0,u,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=h}function hg(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const h=o||t.has("WEBGL_draw_buffers"),l=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,M=o||t.has("OES_texture_float"),P=x&&M,w=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:l,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:M,floatVertexTextures:P,maxSamples:w}}function ug(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new di,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=l(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{const v=r?0:n,x=v*4;let M=d.clippingState||null;c.value=M,M=l(g,f,x,p);for(let P=0;P!==x;++P)M[P]=e[P];d.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function l(u,f,p,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const d=p+_*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<d)&&(m=new Float32Array(d));for(let x=0,M=p;x!==_;++x,M+=4)o.copy(u[x]).applyMatrix4(v,a),o.normal.toArray(m,M),m[M+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function fg(i){let t=new WeakMap;function e(o,a){return a===Ua?o.mapping=Ps:a===Na&&(o.mapping=Ls),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ua||a===Na)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const h=new Ep(c.height/2);return h.fromEquirectangularTexture(i,o),t.set(o,h),o.addEventListener("dispose",s),e(h.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Uu extends Lu{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=l*this.view.offsetY,c=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const bs=4,Vl=[.125,.215,.35,.446,.526,.582],Ii=20,ha=new Uu,Wl=new jt;let ua=null,fa=0,da=0;const Li=(1+Math.sqrt(5))/2,fs=1/Li,Xl=[new R(1,1,1),new R(-1,1,1),new R(1,1,-1),new R(-1,1,-1),new R(0,Li,fs),new R(0,Li,-fs),new R(fs,0,Li),new R(-fs,0,Li),new R(Li,fs,0),new R(-Li,fs,0)];class $l{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ua=this._renderer.getRenderTarget(),fa=this._renderer.getActiveCubeFace(),da=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ql(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ua,fa,da),t.scissorTest=!1,$r(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ps||t.mapping===Ls?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ua=this._renderer.getRenderTarget(),fa=this._renderer.getActiveCubeFace(),da=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:fr,format:_n,colorSpace:si,depthBuffer:!1},s=jl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=jl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=dg(r)),this._blurMaterial=pg(r,t,e)}return s}_compileMaterial(t){const e=new Ht(this._lodPlanes[0],t);this._renderer.compile(e,ha)}_sceneToCubeUV(t,e,n,s){const a=new ln(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(Wl),l.toneMapping=_i,l.autoClear=!1;const p=new Ke({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),g=new Ht(new Fn,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(Wl),_=!0);for(let d=0;d<6;d++){const v=d%3;v===0?(a.up.set(0,c[d],0),a.lookAt(h[d],0,0)):v===1?(a.up.set(0,0,c[d]),a.lookAt(0,h[d],0)):(a.up.set(0,c[d],0),a.lookAt(0,0,h[d]));const x=this._cubeSize;$r(s,v*x,d>2?x:0,x,x),l.setRenderTarget(s),_&&l.render(g,a),l.render(t,a)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=f,l.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ps||t.mapping===Ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ql());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ht(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;$r(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ha)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Xl[(s-1)%Xl.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,u=new Ht(this._lodPlanes[s],h),f=h.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Ii-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):Ii;m>Ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ii}`);const d=[];let v=0;for(let T=0;T<Ii;++T){const N=T/_,y=Math.exp(-N*N/2);d.push(y),T===0?v+=y:T<m&&(v+=2*y)}for(let T=0;T<d.length;T++)d[T]=d[T]/v;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=g,f.mipInt.value=x-n;const M=this._sizeLods[s],P=3*M*(s>x-bs?s-x+bs:0),w=4*(this._cubeSize-M);$r(e,P,w,3*M,2*M),c.setRenderTarget(e),c.render(u,ha)}}function dg(i){const t=[],e=[],n=[];let s=i;const r=i-bs+1+Vl.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-bs?c=Vl[o-i+bs-1]:o===0&&(c=0),n.push(c);const h=1/(a-2),l=-h,u=1+h,f=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,g=6,_=3,m=2,d=1,v=new Float32Array(_*g*p),x=new Float32Array(m*g*p),M=new Float32Array(d*g*p);for(let w=0;w<p;w++){const T=w%3*2/3-1,N=w>2?0:-1,y=[T,N,0,T+2/3,N,0,T+2/3,N+1,0,T,N,0,T+2/3,N+1,0,T,N+1,0];v.set(y,_*g*w),x.set(f,m*g*w);const b=[w,w,w,w,w,w];M.set(b,d*g*w)}const P=new be;P.setAttribute("position",new pn(v,_)),P.setAttribute("uv",new pn(x,m)),P.setAttribute("faceIndex",new pn(M,d)),t.push(P),s>bs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function jl(i,t,e){const n=new ki(i,t,e);return n.texture.mapping=xo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $r(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function pg(i,t,e){const n=new Float32Array(Ii),s=new R(0,1,0);return new Hi({name:"SphericalGaussianBlur",defines:{n:Ii,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:sc(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function ql(){return new Hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:sc(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Yl(){return new Hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function sc(){return`

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
	`}function mg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,h=c===Ua||c===Na,l=c===Ps||c===Ls;if(h||l)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new $l(i)),u=h?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(h&&u&&u.height>0||l&&u&&s(u)){e===null&&(e=new $l(i));const f=h?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let c=0;const h=6;for(let l=0;l<h;l++)a[l]!==void 0&&c++;return c===h}function r(a){const c=a.target;c.removeEventListener("dispose",r);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function gg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function _g(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,d=_.length;m<d;m++)t.remove(_[m])}f.removeEventListener("dispose",o),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const _=p[g];for(let m=0,d=_.length;m<d;m++)t.update(_[m],i.ARRAY_BUFFER)}}function h(u){const f=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const v=p.array;_=p.version;for(let x=0,M=v.length;x<M;x+=3){const P=v[x+0],w=v[x+1],T=v[x+2];f.push(P,w,w,T,T,P)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,M=v.length/3-1;x<M;x+=3){const P=x+0,w=x+1,T=x+2;f.push(P,w,w,T,T,P)}}else return;const m=new(bu(f)?Cu:Ru)(f,1);m.version=_;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function l(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:l}}function vg(i,t,e,n){const s=n.isWebGL2;let r;function o(p){r=p}let a,c;function h(p){a=p.type,c=p.bytesPerElement}function l(p,g){i.drawElements(r,g,a,p*c),e.update(g,r,1)}function u(p,g,_){if(_===0)return;let m,d;if(s)m=i,d="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](r,g,a,p*c,_),e.update(g,r,_)}function f(p,g,_){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<_;d++)this.render(p[d]/c,g[d]);else{m.multiDrawElementsWEBGL(r,g,0,a,p,0,_);let d=0;for(let v=0;v<_;v++)d+=g[v];e.update(d,r,1)}}this.setMode=o,this.setIndex=h,this.render=l,this.renderInstances=u,this.renderMultiDraw=f}function xg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Mg(i,t){return i[0]-t[0]}function yg(i,t){return Math.abs(t[1])-Math.abs(i[1])}function Sg(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,o=new pe,a=[];for(let h=0;h<8;h++)a[h]=[h,0];function c(h,l,u){const f=h.morphTargetInfluences;if(t.isWebGL2===!0){const g=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,_=g!==void 0?g.length:0;let m=r.get(l);if(m===void 0||m.count!==_){let F=function(){J.dispose(),r.delete(l),l.removeEventListener("dispose",F)};var p=F;m!==void 0&&m.texture.dispose();const x=l.morphAttributes.position!==void 0,M=l.morphAttributes.normal!==void 0,P=l.morphAttributes.color!==void 0,w=l.morphAttributes.position||[],T=l.morphAttributes.normal||[],N=l.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),P===!0&&(y=3);let b=l.attributes.position.count*y,H=1;b>t.maxTextureSize&&(H=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const G=new Float32Array(b*H*4*_),J=new Tu(G,b,H,_);J.type=mi,J.needsUpdate=!0;const D=y*4;for(let W=0;W<_;W++){const Y=w[W],j=T[W],q=N[W],K=b*H*4*W;for(let at=0;at<Y.count;at++){const lt=at*D;x===!0&&(o.fromBufferAttribute(Y,at),G[K+lt+0]=o.x,G[K+lt+1]=o.y,G[K+lt+2]=o.z,G[K+lt+3]=0),M===!0&&(o.fromBufferAttribute(j,at),G[K+lt+4]=o.x,G[K+lt+5]=o.y,G[K+lt+6]=o.z,G[K+lt+7]=0),P===!0&&(o.fromBufferAttribute(q,at),G[K+lt+8]=o.x,G[K+lt+9]=o.y,G[K+lt+10]=o.z,G[K+lt+11]=q.itemSize===4?o.w:1)}}m={count:_,texture:J,size:new ut(b,H)},r.set(l,m),l.addEventListener("dispose",F)}let d=0;for(let x=0;x<f.length;x++)d+=f[x];const v=l.morphTargetsRelative?1:1-d;u.getUniforms().setValue(i,"morphTargetBaseInfluence",v),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const g=f===void 0?0:f.length;let _=n[l.id];if(_===void 0||_.length!==g){_=[];for(let M=0;M<g;M++)_[M]=[M,0];n[l.id]=_}for(let M=0;M<g;M++){const P=_[M];P[0]=M,P[1]=f[M]}_.sort(yg);for(let M=0;M<8;M++)M<g&&_[M][1]?(a[M][0]=_[M][0],a[M][1]=_[M][1]):(a[M][0]=Number.MAX_SAFE_INTEGER,a[M][1]=0);a.sort(Mg);const m=l.morphAttributes.position,d=l.morphAttributes.normal;let v=0;for(let M=0;M<8;M++){const P=a[M],w=P[0],T=P[1];w!==Number.MAX_SAFE_INTEGER&&T?(m&&l.getAttribute("morphTarget"+M)!==m[w]&&l.setAttribute("morphTarget"+M,m[w]),d&&l.getAttribute("morphNormal"+M)!==d[w]&&l.setAttribute("morphNormal"+M,d[w]),s[M]=T,v+=T):(m&&l.hasAttribute("morphTarget"+M)===!0&&l.deleteAttribute("morphTarget"+M),d&&l.hasAttribute("morphNormal"+M)===!0&&l.deleteAttribute("morphNormal"+M),s[M]=0)}const x=l.morphTargetsRelative?1:1-v;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function bg(i,t,e,n){let s=new WeakMap;function r(c){const h=n.render.frame,l=c.geometry,u=t.get(c,l);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function o(){s=new WeakMap}function a(c){const h=c.target;h.removeEventListener("dispose",a),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:o}}class Nu extends Ze{constructor(t,e,n,s,r,o,a,c,h,l){if(l=l!==void 0?l:Ni,l!==Ni&&l!==Ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&l===Ni&&(n=pi),n===void 0&&l===Ds&&(n=Ui),super(null,s,r,o,a,c,l,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Be,this.minFilter=c!==void 0?c:Be,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Ou=new Ze,zu=new Nu(1,1);zu.compareFunction=Su;const Fu=new Tu,Bu=new ap,ku=new Du,Kl=[],Jl=[],Zl=new Float32Array(16),Ql=new Float32Array(9),th=new Float32Array(4);function Bs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Kl[s];if(r===void 0&&(r=new Float32Array(s),Kl[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Re(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ce(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function So(i,t){let e=Jl[t];e===void 0&&(e=new Int32Array(t),Jl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Eg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2fv(this.addr,t),Ce(e,t)}}function Tg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;i.uniform3fv(this.addr,t),Ce(e,t)}}function Ag(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4fv(this.addr,t),Ce(e,t)}}function Rg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;th.set(n),i.uniformMatrix2fv(this.addr,!1,th),Ce(e,n)}}function Cg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;Ql.set(n),i.uniformMatrix3fv(this.addr,!1,Ql),Ce(e,n)}}function Pg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;Zl.set(n),i.uniformMatrix4fv(this.addr,!1,Zl),Ce(e,n)}}function Lg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Dg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2iv(this.addr,t),Ce(e,t)}}function Ig(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3iv(this.addr,t),Ce(e,t)}}function Ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4iv(this.addr,t),Ce(e,t)}}function Ng(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Og(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2uiv(this.addr,t),Ce(e,t)}}function zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3uiv(this.addr,t),Ce(e,t)}}function Fg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4uiv(this.addr,t),Ce(e,t)}}function Bg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?zu:Ou;e.setTexture2D(t||r,s)}function kg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Bu,s)}function Hg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ku,s)}function Gg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Fu,s)}function Vg(i){switch(i){case 5126:return Eg;case 35664:return wg;case 35665:return Tg;case 35666:return Ag;case 35674:return Rg;case 35675:return Cg;case 35676:return Pg;case 5124:case 35670:return Lg;case 35667:case 35671:return Dg;case 35668:case 35672:return Ig;case 35669:case 35673:return Ug;case 5125:return Ng;case 36294:return Og;case 36295:return zg;case 36296:return Fg;case 35678:case 36198:case 36298:case 36306:case 35682:return Bg;case 35679:case 36299:case 36307:return kg;case 35680:case 36300:case 36308:case 36293:return Hg;case 36289:case 36303:case 36311:case 36292:return Gg}}function Wg(i,t){i.uniform1fv(this.addr,t)}function Xg(i,t){const e=Bs(t,this.size,2);i.uniform2fv(this.addr,e)}function $g(i,t){const e=Bs(t,this.size,3);i.uniform3fv(this.addr,e)}function jg(i,t){const e=Bs(t,this.size,4);i.uniform4fv(this.addr,e)}function qg(i,t){const e=Bs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Yg(i,t){const e=Bs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Kg(i,t){const e=Bs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Jg(i,t){i.uniform1iv(this.addr,t)}function Zg(i,t){i.uniform2iv(this.addr,t)}function Qg(i,t){i.uniform3iv(this.addr,t)}function t_(i,t){i.uniform4iv(this.addr,t)}function e_(i,t){i.uniform1uiv(this.addr,t)}function n_(i,t){i.uniform2uiv(this.addr,t)}function i_(i,t){i.uniform3uiv(this.addr,t)}function s_(i,t){i.uniform4uiv(this.addr,t)}function r_(i,t,e){const n=this.cache,s=t.length,r=So(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Ou,r[o])}function o_(i,t,e){const n=this.cache,s=t.length,r=So(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Bu,r[o])}function a_(i,t,e){const n=this.cache,s=t.length,r=So(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ku,r[o])}function c_(i,t,e){const n=this.cache,s=t.length,r=So(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Fu,r[o])}function l_(i){switch(i){case 5126:return Wg;case 35664:return Xg;case 35665:return $g;case 35666:return jg;case 35674:return qg;case 35675:return Yg;case 35676:return Kg;case 5124:case 35670:return Jg;case 35667:case 35671:return Zg;case 35668:case 35672:return Qg;case 35669:case 35673:return t_;case 5125:return e_;case 36294:return n_;case 36295:return i_;case 36296:return s_;case 35678:case 36198:case 36298:case 36306:case 35682:return r_;case 35679:case 36299:case 36307:return o_;case 35680:case 36300:case 36308:case 36293:return a_;case 36289:case 36303:case 36311:case 36292:return c_}}class h_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Vg(e.type)}}class u_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=l_(e.type)}}class f_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const pa=/(\w+)(\])?(\[|\.)?/g;function eh(i,t){i.seq.push(t),i.map[t.id]=t}function d_(i,t,e){const n=i.name,s=n.length;for(pa.lastIndex=0;;){const r=pa.exec(n),o=pa.lastIndex;let a=r[1];const c=r[2]==="]",h=r[3];if(c&&(a=a|0),h===void 0||h==="["&&o+2===s){eh(e,h===void 0?new h_(a,i,t):new u_(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new f_(a),eh(e,u)),e=u}}}class Qr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);d_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function nh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const p_=37297;let m_=0;function g_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function __(i){const t=he.getPrimaries(he.workingColorSpace),e=he.getPrimaries(i);let n;switch(t===e?n="":t===ao&&e===oo?n="LinearDisplayP3ToLinearSRGB":t===oo&&e===ao&&(n="LinearSRGBToLinearDisplayP3"),i){case si:case Mo:return[n,"LinearTransferOETF"];case Te:case ec:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function ih(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+g_(i.getShaderSource(t),o)}else return s}function v_(i,t){const e=__(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function x_(i,t){let e;switch(t){case Cd:e="Linear";break;case Pd:e="Reinhard";break;case Ld:e="OptimizedCineon";break;case fu:e="ACESFilmic";break;case Id:e="AgX";break;case Dd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function M_(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Es).join(`
`)}function y_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Es).join(`
`)}function S_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function b_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Es(i){return i!==""}function sh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const E_=/^[ \t]*#include +<([\w\d./]+)>/gm;function ka(i){return i.replace(E_,T_)}const w_=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function T_(i,t){let e=$t[t];if(e===void 0){const n=w_.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ka(e)}const A_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function oh(i){return i.replace(A_,R_)}function R_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ah(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function C_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===hu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===uu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Jn&&(t="SHADOWMAP_TYPE_VSM"),t}function P_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ps:case Ls:t="ENVMAP_TYPE_CUBE";break;case xo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function L_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ls:t="ENVMAP_MODE_REFRACTION";break}return t}function D_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Za:t="ENVMAP_BLENDING_MULTIPLY";break;case Ad:t="ENVMAP_BLENDING_MIX";break;case Rd:t="ENVMAP_BLENDING_ADD";break}return t}function I_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function U_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=C_(e),h=P_(e),l=L_(e),u=D_(e),f=I_(e),p=e.isWebGL2?"":M_(e),g=y_(e),_=S_(r),m=s.createProgram();let d,v,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Es).join(`
`),d.length>0&&(d+=`
`),v=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Es).join(`
`),v.length>0&&(v+=`
`)):(d=[ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Es).join(`
`),v=[p,ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==_i?"#define TONE_MAPPING":"",e.toneMapping!==_i?$t.tonemapping_pars_fragment:"",e.toneMapping!==_i?x_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,v_("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Es).join(`
`)),o=ka(o),o=sh(o,e),o=rh(o,e),a=ka(a),a=sh(a,e),a=rh(a,e),o=oh(o),a=oh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===wl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===wl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=x+d+o,P=x+v+a,w=nh(s,s.VERTEX_SHADER,M),T=nh(s,s.FRAGMENT_SHADER,P);s.attachShader(m,w),s.attachShader(m,T),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function N(G){if(i.debug.checkShaderErrors){const J=s.getProgramInfoLog(m).trim(),D=s.getShaderInfoLog(w).trim(),F=s.getShaderInfoLog(T).trim();let W=!0,Y=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,w,T);else{const j=ih(s,w,"vertex"),q=ih(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+J+`
`+j+`
`+q)}else J!==""?console.warn("THREE.WebGLProgram: Program Info Log:",J):(D===""||F==="")&&(Y=!1);Y&&(G.diagnostics={runnable:W,programLog:J,vertexShader:{log:D,prefix:d},fragmentShader:{log:F,prefix:v}})}s.deleteShader(w),s.deleteShader(T),y=new Qr(s,m),b=b_(s,m)}let y;this.getUniforms=function(){return y===void 0&&N(this),y};let b;this.getAttributes=function(){return b===void 0&&N(this),b};let H=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return H===!1&&(H=s.getProgramParameter(m,p_)),H},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=m_++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=w,this.fragmentShader=T,this}let N_=0;class O_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new z_(t),e.set(t,n)),n}}class z_{constructor(t){this.id=N_++,this.code=t,this.usedTimes=0}}function F_(i,t,e,n,s,r,o){const a=new nc,c=new O_,h=[],l=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return y===0?"uv":`uv${y}`}function m(y,b,H,G,J){const D=G.fog,F=J.geometry,W=y.isMeshStandardMaterial?G.environment:null,Y=(y.isMeshStandardMaterial?e:t).get(y.envMap||W),j=Y&&Y.mapping===xo?Y.image.height:null,q=g[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const K=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,at=K!==void 0?K.length:0;let lt=0;F.morphAttributes.position!==void 0&&(lt=1),F.morphAttributes.normal!==void 0&&(lt=2),F.morphAttributes.color!==void 0&&(lt=3);let X,Z,mt,wt;if(q){const ye=Un[q];X=ye.vertexShader,Z=ye.fragmentShader}else X=y.vertexShader,Z=y.fragmentShader,c.update(y),mt=c.getVertexShaderID(y),wt=c.getFragmentShaderID(y);const bt=i.getRenderTarget(),Bt=J.isInstancedMesh===!0,kt=J.isBatchedMesh===!0,Lt=!!y.map,Zt=!!y.matcap,z=!!Y,ze=!!y.aoMap,Rt=!!y.lightMap,Ut=!!y.bumpMap,Mt=!!y.normalMap,ue=!!y.displacementMap,Vt=!!y.emissiveMap,A=!!y.metalnessMap,S=!!y.roughnessMap,O=y.anisotropy>0,it=y.clearcoat>0,tt=y.iridescence>0,st=y.sheen>0,St=y.transmission>0,dt=O&&!!y.anisotropyMap,xt=it&&!!y.clearcoatMap,Pt=it&&!!y.clearcoatNormalMap,Wt=it&&!!y.clearcoatRoughnessMap,Q=tt&&!!y.iridescenceMap,oe=tt&&!!y.iridescenceThicknessMap,qt=st&&!!y.sheenColorMap,Nt=st&&!!y.sheenRoughnessMap,At=!!y.specularMap,gt=!!y.specularColorMap,C=!!y.specularIntensityMap,rt=St&&!!y.transmissionMap,Et=St&&!!y.thicknessMap,vt=!!y.gradientMap,et=!!y.alphaMap,L=y.alphaTest>0,ot=!!y.alphaHash,ft=!!y.extensions,Dt=!!F.attributes.uv1,Ct=!!F.attributes.uv2,Qt=!!F.attributes.uv3;let te=_i;return y.toneMapped&&(bt===null||bt.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:l,shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:X,fragmentShader:Z,defines:y.defines,customVertexShaderID:mt,customFragmentShaderID:wt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:kt,instancing:Bt,instancingColor:Bt&&J.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:bt===null?i.outputColorSpace:bt.isXRRenderTarget===!0?bt.texture.colorSpace:si,map:Lt,matcap:Zt,envMap:z,envMapMode:z&&Y.mapping,envMapCubeUVHeight:j,aoMap:ze,lightMap:Rt,bumpMap:Ut,normalMap:Mt,displacementMap:f&&ue,emissiveMap:Vt,normalMapObjectSpace:Mt&&y.normalMapType===Xd,normalMapTangentSpace:Mt&&y.normalMapType===tc,metalnessMap:A,roughnessMap:S,anisotropy:O,anisotropyMap:dt,clearcoat:it,clearcoatMap:xt,clearcoatNormalMap:Pt,clearcoatRoughnessMap:Wt,iridescence:tt,iridescenceMap:Q,iridescenceThicknessMap:oe,sheen:st,sheenColorMap:qt,sheenRoughnessMap:Nt,specularMap:At,specularColorMap:gt,specularIntensityMap:C,transmission:St,transmissionMap:rt,thicknessMap:Et,gradientMap:vt,opaque:y.transparent===!1&&y.blending===ws,alphaMap:et,alphaTest:L,alphaHash:ot,combine:y.combine,mapUv:Lt&&_(y.map.channel),aoMapUv:ze&&_(y.aoMap.channel),lightMapUv:Rt&&_(y.lightMap.channel),bumpMapUv:Ut&&_(y.bumpMap.channel),normalMapUv:Mt&&_(y.normalMap.channel),displacementMapUv:ue&&_(y.displacementMap.channel),emissiveMapUv:Vt&&_(y.emissiveMap.channel),metalnessMapUv:A&&_(y.metalnessMap.channel),roughnessMapUv:S&&_(y.roughnessMap.channel),anisotropyMapUv:dt&&_(y.anisotropyMap.channel),clearcoatMapUv:xt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Wt&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:qt&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&_(y.sheenRoughnessMap.channel),specularMapUv:At&&_(y.specularMap.channel),specularColorMapUv:gt&&_(y.specularColorMap.channel),specularIntensityMapUv:C&&_(y.specularIntensityMap.channel),transmissionMapUv:rt&&_(y.transmissionMap.channel),thicknessMapUv:Et&&_(y.thicknessMap.channel),alphaMapUv:et&&_(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Mt||O),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Dt,vertexUv2s:Ct,vertexUv3s:Qt,pointsUvs:J.isPoints===!0&&!!F.attributes.uv&&(Lt||et),fog:!!D,useFog:y.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:J.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:at,morphTextureStride:lt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&H.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Lt&&y.map.isVideoTexture===!0&&he.getTransfer(y.map.colorSpace)===fe,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===un,flipSided:y.side===sn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:ft&&y.extensions.derivatives===!0,extensionFragDepth:ft&&y.extensions.fragDepth===!0,extensionDrawBuffers:ft&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:ft&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ft&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:l||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:l||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:l||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function d(y){const b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(const H in y.defines)b.push(H),b.push(y.defines[H]);return y.isRawShaderMaterial===!1&&(v(b,y),x(b,y),b.push(i.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function v(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function x(y,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),y.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),y.push(a.mask)}function M(y){const b=g[y.type];let H;if(b){const G=Un[b];H=Mp.clone(G.uniforms)}else H=y.uniforms;return H}function P(y,b){let H;for(let G=0,J=h.length;G<J;G++){const D=h[G];if(D.cacheKey===b){H=D,++H.usedTimes;break}}return H===void 0&&(H=new U_(i,b,y,r),h.push(H)),H}function w(y){if(--y.usedTimes===0){const b=h.indexOf(y);h[b]=h[h.length-1],h.pop(),y.destroy()}}function T(y){c.remove(y)}function N(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:M,acquireProgram:P,releaseProgram:w,releaseShaderCache:T,programs:h,dispose:N}}function B_(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function k_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function ch(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function lh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,p,g,_,m){let d=i[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),t++,d}function a(u,f,p,g,_,m){const d=o(u,f,p,g,_,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(u,f,p,g,_,m){const d=o(u,f,p,g,_,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function h(u,f){e.length>1&&e.sort(u||k_),n.length>1&&n.sort(f||ch),s.length>1&&s.sort(f||ch)}function l(){for(let u=t,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:l,sort:h}}function H_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new lh,i.set(n,[o])):s>=r.length?(o=new lh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function G_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new jt};break;case"SpotLight":e={position:new R,direction:new R,color:new jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new jt,groundColor:new jt};break;case"RectAreaLight":e={color:new jt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function V_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let W_=0;function X_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function $_(i,t){const e=new G_,n=V_(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)s.probe.push(new R);const r=new R,o=new le,a=new le;function c(l,u){let f=0,p=0,g=0;for(let G=0;G<9;G++)s.probe[G].set(0,0,0);let _=0,m=0,d=0,v=0,x=0,M=0,P=0,w=0,T=0,N=0,y=0;l.sort(X_);const b=u===!0?Math.PI:1;for(let G=0,J=l.length;G<J;G++){const D=l[G],F=D.color,W=D.intensity,Y=D.distance,j=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)f+=F.r*W*b,p+=F.g*W*b,g+=F.b*W*b;else if(D.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(D.sh.coefficients[q],W);y++}else if(D.isDirectionalLight){const q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity*b),D.castShadow){const K=D.shadow,at=n.get(D);at.shadowBias=K.bias,at.shadowNormalBias=K.normalBias,at.shadowRadius=K.radius,at.shadowMapSize=K.mapSize,s.directionalShadow[_]=at,s.directionalShadowMap[_]=j,s.directionalShadowMatrix[_]=D.shadow.matrix,M++}s.directional[_]=q,_++}else if(D.isSpotLight){const q=e.get(D);q.position.setFromMatrixPosition(D.matrixWorld),q.color.copy(F).multiplyScalar(W*b),q.distance=Y,q.coneCos=Math.cos(D.angle),q.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),q.decay=D.decay,s.spot[d]=q;const K=D.shadow;if(D.map&&(s.spotLightMap[T]=D.map,T++,K.updateMatrices(D),D.castShadow&&N++),s.spotLightMatrix[d]=K.matrix,D.castShadow){const at=n.get(D);at.shadowBias=K.bias,at.shadowNormalBias=K.normalBias,at.shadowRadius=K.radius,at.shadowMapSize=K.mapSize,s.spotShadow[d]=at,s.spotShadowMap[d]=j,w++}d++}else if(D.isRectAreaLight){const q=e.get(D);q.color.copy(F).multiplyScalar(W),q.halfWidth.set(D.width*.5,0,0),q.halfHeight.set(0,D.height*.5,0),s.rectArea[v]=q,v++}else if(D.isPointLight){const q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity*b),q.distance=D.distance,q.decay=D.decay,D.castShadow){const K=D.shadow,at=n.get(D);at.shadowBias=K.bias,at.shadowNormalBias=K.normalBias,at.shadowRadius=K.radius,at.shadowMapSize=K.mapSize,at.shadowCameraNear=K.camera.near,at.shadowCameraFar=K.camera.far,s.pointShadow[m]=at,s.pointShadowMap[m]=j,s.pointShadowMatrix[m]=D.shadow.matrix,P++}s.point[m]=q,m++}else if(D.isHemisphereLight){const q=e.get(D);q.skyColor.copy(D.color).multiplyScalar(W*b),q.groundColor.copy(D.groundColor).multiplyScalar(W*b),s.hemi[x]=q,x++}}v>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ht.LTC_FLOAT_1,s.rectAreaLTC2=ht.LTC_FLOAT_2):(s.rectAreaLTC1=ht.LTC_HALF_1,s.rectAreaLTC2=ht.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ht.LTC_FLOAT_1,s.rectAreaLTC2=ht.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ht.LTC_HALF_1,s.rectAreaLTC2=ht.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=p,s.ambient[2]=g;const H=s.hash;(H.directionalLength!==_||H.pointLength!==m||H.spotLength!==d||H.rectAreaLength!==v||H.hemiLength!==x||H.numDirectionalShadows!==M||H.numPointShadows!==P||H.numSpotShadows!==w||H.numSpotMaps!==T||H.numLightProbes!==y)&&(s.directional.length=_,s.spot.length=d,s.rectArea.length=v,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=P,s.pointShadowMap.length=P,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=P,s.spotLightMatrix.length=w+T-N,s.spotLightMap.length=T,s.numSpotLightShadowsWithMaps=N,s.numLightProbes=y,H.directionalLength=_,H.pointLength=m,H.spotLength=d,H.rectAreaLength=v,H.hemiLength=x,H.numDirectionalShadows=M,H.numPointShadows=P,H.numSpotShadows=w,H.numSpotMaps=T,H.numLightProbes=y,s.version=W_++)}function h(l,u){let f=0,p=0,g=0,_=0,m=0;const d=u.matrixWorldInverse;for(let v=0,x=l.length;v<x;v++){const M=l[v];if(M.isDirectionalLight){const P=s.directional[f];P.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(d),f++}else if(M.isSpotLight){const P=s.spot[g];P.position.setFromMatrixPosition(M.matrixWorld),P.position.applyMatrix4(d),P.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(d),g++}else if(M.isRectAreaLight){const P=s.rectArea[_];P.position.setFromMatrixPosition(M.matrixWorld),P.position.applyMatrix4(d),a.identity(),o.copy(M.matrixWorld),o.premultiply(d),a.extractRotation(o),P.halfWidth.set(M.width*.5,0,0),P.halfHeight.set(0,M.height*.5,0),P.halfWidth.applyMatrix4(a),P.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const P=s.point[p];P.position.setFromMatrixPosition(M.matrixWorld),P.position.applyMatrix4(d),p++}else if(M.isHemisphereLight){const P=s.hemi[m];P.direction.setFromMatrixPosition(M.matrixWorld),P.direction.transformDirection(d),m++}}}return{setup:c,setupView:h,state:s}}function hh(i,t){const e=new $_(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function c(u){e.setup(n,u)}function h(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a}}function j_(i,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let c;return a===void 0?(c=new hh(i,t),e.set(r,[c])):o>=a.length?(c=new hh(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class q_ extends $i{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Y_ extends $i{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const K_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,J_=`uniform sampler2D shadow_pass;
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
}`;function Z_(i,t,e){let n=new ic;const s=new ut,r=new ut,o=new pe,a=new q_({depthPacking:Wd}),c=new Y_,h={},l=e.maxTextureSize,u={[Mi]:sn,[sn]:Mi,[un]:un},f=new Hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:K_,fragmentShader:J_}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new be;g.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ht(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hu;let d=this.type;this.render=function(w,T,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const y=i.getRenderTarget(),b=i.getActiveCubeFace(),H=i.getActiveMipmapLevel(),G=i.state;G.setBlending(gi),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const J=d!==Jn&&this.type===Jn,D=d===Jn&&this.type!==Jn;for(let F=0,W=w.length;F<W;F++){const Y=w[F],j=Y.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;s.copy(j.mapSize);const q=j.getFrameExtents();if(s.multiply(q),r.copy(j.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/q.x),s.x=r.x*q.x,j.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/q.y),s.y=r.y*q.y,j.mapSize.y=r.y)),j.map===null||J===!0||D===!0){const at=this.type!==Jn?{minFilter:Be,magFilter:Be}:{};j.map!==null&&j.map.dispose(),j.map=new ki(s.x,s.y,at),j.map.texture.name=Y.name+".shadowMap",j.camera.updateProjectionMatrix()}i.setRenderTarget(j.map),i.clear();const K=j.getViewportCount();for(let at=0;at<K;at++){const lt=j.getViewport(at);o.set(r.x*lt.x,r.y*lt.y,r.x*lt.z,r.y*lt.w),G.viewport(o),j.updateMatrices(Y,at),n=j.getFrustum(),M(T,N,j.camera,Y,this.type)}j.isPointLightShadow!==!0&&this.type===Jn&&v(j,N),j.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(y,b,H)};function v(w,T){const N=t.update(_);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ki(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(T,null,N,f,_,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(T,null,N,p,_,null)}function x(w,T,N,y){let b=null;const H=N.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(H!==void 0)b=H;else if(b=N.isPointLight===!0?c:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const G=b.uuid,J=T.uuid;let D=h[G];D===void 0&&(D={},h[G]=D);let F=D[J];F===void 0&&(F=b.clone(),D[J]=F,T.addEventListener("dispose",P)),b=F}if(b.visible=T.visible,b.wireframe=T.wireframe,y===Jn?b.side=T.shadowSide!==null?T.shadowSide:T.side:b.side=T.shadowSide!==null?T.shadowSide:u[T.side],b.alphaMap=T.alphaMap,b.alphaTest=T.alphaTest,b.map=T.map,b.clipShadows=T.clipShadows,b.clippingPlanes=T.clippingPlanes,b.clipIntersection=T.clipIntersection,b.displacementMap=T.displacementMap,b.displacementScale=T.displacementScale,b.displacementBias=T.displacementBias,b.wireframeLinewidth=T.wireframeLinewidth,b.linewidth=T.linewidth,N.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const G=i.properties.get(b);G.light=N}return b}function M(w,T,N,y,b){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&b===Jn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,w.matrixWorld);const J=t.update(w),D=w.material;if(Array.isArray(D)){const F=J.groups;for(let W=0,Y=F.length;W<Y;W++){const j=F[W],q=D[j.materialIndex];if(q&&q.visible){const K=x(w,q,y,b);w.onBeforeShadow(i,w,T,N,J,K,j),i.renderBufferDirect(N,null,J,K,w,j),w.onAfterShadow(i,w,T,N,J,K,j)}}}else if(D.visible){const F=x(w,D,y,b);w.onBeforeShadow(i,w,T,N,J,F,null),i.renderBufferDirect(N,null,J,F,w,null),w.onAfterShadow(i,w,T,N,J,F,null)}}const G=w.children;for(let J=0,D=G.length;J<D;J++)M(G[J],T,N,y,b)}function P(w){w.target.removeEventListener("dispose",P);for(const N in h){const y=h[N],b=w.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}}function Q_(i,t,e){const n=e.isWebGL2;function s(){let L=!1;const ot=new pe;let ft=null;const Dt=new pe(0,0,0,0);return{setMask:function(Ct){ft!==Ct&&!L&&(i.colorMask(Ct,Ct,Ct,Ct),ft=Ct)},setLocked:function(Ct){L=Ct},setClear:function(Ct,Qt,te,xe,ye){ye===!0&&(Ct*=xe,Qt*=xe,te*=xe),ot.set(Ct,Qt,te,xe),Dt.equals(ot)===!1&&(i.clearColor(Ct,Qt,te,xe),Dt.copy(ot))},reset:function(){L=!1,ft=null,Dt.set(-1,0,0,0)}}}function r(){let L=!1,ot=null,ft=null,Dt=null;return{setTest:function(Ct){Ct?kt(i.DEPTH_TEST):Lt(i.DEPTH_TEST)},setMask:function(Ct){ot!==Ct&&!L&&(i.depthMask(Ct),ot=Ct)},setFunc:function(Ct){if(ft!==Ct){switch(Ct){case Md:i.depthFunc(i.NEVER);break;case yd:i.depthFunc(i.ALWAYS);break;case Sd:i.depthFunc(i.LESS);break;case io:i.depthFunc(i.LEQUAL);break;case bd:i.depthFunc(i.EQUAL);break;case Ed:i.depthFunc(i.GEQUAL);break;case wd:i.depthFunc(i.GREATER);break;case Td:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ft=Ct}},setLocked:function(Ct){L=Ct},setClear:function(Ct){Dt!==Ct&&(i.clearDepth(Ct),Dt=Ct)},reset:function(){L=!1,ot=null,ft=null,Dt=null}}}function o(){let L=!1,ot=null,ft=null,Dt=null,Ct=null,Qt=null,te=null,xe=null,ye=null;return{setTest:function(ne){L||(ne?kt(i.STENCIL_TEST):Lt(i.STENCIL_TEST))},setMask:function(ne){ot!==ne&&!L&&(i.stencilMask(ne),ot=ne)},setFunc:function(ne,Ee,Dn){(ft!==ne||Dt!==Ee||Ct!==Dn)&&(i.stencilFunc(ne,Ee,Dn),ft=ne,Dt=Ee,Ct=Dn)},setOp:function(ne,Ee,Dn){(Qt!==ne||te!==Ee||xe!==Dn)&&(i.stencilOp(ne,Ee,Dn),Qt=ne,te=Ee,xe=Dn)},setLocked:function(ne){L=ne},setClear:function(ne){ye!==ne&&(i.clearStencil(ne),ye=ne)},reset:function(){L=!1,ot=null,ft=null,Dt=null,Ct=null,Qt=null,te=null,xe=null,ye=null}}}const a=new s,c=new r,h=new o,l=new WeakMap,u=new WeakMap;let f={},p={},g=new WeakMap,_=[],m=null,d=!1,v=null,x=null,M=null,P=null,w=null,T=null,N=null,y=new jt(0,0,0),b=0,H=!1,G=null,J=null,D=null,F=null,W=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,q=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(K)[1]),j=q>=1):K.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),j=q>=2);let at=null,lt={};const X=i.getParameter(i.SCISSOR_BOX),Z=i.getParameter(i.VIEWPORT),mt=new pe().fromArray(X),wt=new pe().fromArray(Z);function bt(L,ot,ft,Dt){const Ct=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(L,Qt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<ft;te++)n&&(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)?i.texImage3D(ot,0,i.RGBA,1,1,Dt,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(ot+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return Qt}const Bt={};Bt[i.TEXTURE_2D]=bt(i.TEXTURE_2D,i.TEXTURE_2D,1),Bt[i.TEXTURE_CUBE_MAP]=bt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Bt[i.TEXTURE_2D_ARRAY]=bt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Bt[i.TEXTURE_3D]=bt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),h.setClear(0),kt(i.DEPTH_TEST),c.setFunc(io),Vt(!1),A(Xc),kt(i.CULL_FACE),Mt(gi);function kt(L){f[L]!==!0&&(i.enable(L),f[L]=!0)}function Lt(L){f[L]!==!1&&(i.disable(L),f[L]=!1)}function Zt(L,ot){return p[L]!==ot?(i.bindFramebuffer(L,ot),p[L]=ot,n&&(L===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=ot),L===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=ot)),!0):!1}function z(L,ot){let ft=_,Dt=!1;if(L)if(ft=g.get(ot),ft===void 0&&(ft=[],g.set(ot,ft)),L.isWebGLMultipleRenderTargets){const Ct=L.texture;if(ft.length!==Ct.length||ft[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=Ct.length;Qt<te;Qt++)ft[Qt]=i.COLOR_ATTACHMENT0+Qt;ft.length=Ct.length,Dt=!0}}else ft[0]!==i.COLOR_ATTACHMENT0&&(ft[0]=i.COLOR_ATTACHMENT0,Dt=!0);else ft[0]!==i.BACK&&(ft[0]=i.BACK,Dt=!0);Dt&&(e.isWebGL2?i.drawBuffers(ft):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ft))}function ze(L){return m!==L?(i.useProgram(L),m=L,!0):!1}const Rt={[Di]:i.FUNC_ADD,[rd]:i.FUNC_SUBTRACT,[od]:i.FUNC_REVERSE_SUBTRACT};if(n)Rt[Yc]=i.MIN,Rt[Kc]=i.MAX;else{const L=t.get("EXT_blend_minmax");L!==null&&(Rt[Yc]=L.MIN_EXT,Rt[Kc]=L.MAX_EXT)}const Ut={[ad]:i.ZERO,[cd]:i.ONE,[ld]:i.SRC_COLOR,[Da]:i.SRC_ALPHA,[md]:i.SRC_ALPHA_SATURATE,[dd]:i.DST_COLOR,[ud]:i.DST_ALPHA,[hd]:i.ONE_MINUS_SRC_COLOR,[Ia]:i.ONE_MINUS_SRC_ALPHA,[pd]:i.ONE_MINUS_DST_COLOR,[fd]:i.ONE_MINUS_DST_ALPHA,[gd]:i.CONSTANT_COLOR,[_d]:i.ONE_MINUS_CONSTANT_COLOR,[vd]:i.CONSTANT_ALPHA,[xd]:i.ONE_MINUS_CONSTANT_ALPHA};function Mt(L,ot,ft,Dt,Ct,Qt,te,xe,ye,ne){if(L===gi){d===!0&&(Lt(i.BLEND),d=!1);return}if(d===!1&&(kt(i.BLEND),d=!0),L!==sd){if(L!==v||ne!==H){if((x!==Di||w!==Di)&&(i.blendEquation(i.FUNC_ADD),x=Di,w=Di),ne)switch(L){case ws:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $c:i.blendFunc(i.ONE,i.ONE);break;case jc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case qc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case ws:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $c:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case jc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case qc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}M=null,P=null,T=null,N=null,y.set(0,0,0),b=0,v=L,H=ne}return}Ct=Ct||ot,Qt=Qt||ft,te=te||Dt,(ot!==x||Ct!==w)&&(i.blendEquationSeparate(Rt[ot],Rt[Ct]),x=ot,w=Ct),(ft!==M||Dt!==P||Qt!==T||te!==N)&&(i.blendFuncSeparate(Ut[ft],Ut[Dt],Ut[Qt],Ut[te]),M=ft,P=Dt,T=Qt,N=te),(xe.equals(y)===!1||ye!==b)&&(i.blendColor(xe.r,xe.g,xe.b,ye),y.copy(xe),b=ye),v=L,H=!1}function ue(L,ot){L.side===un?Lt(i.CULL_FACE):kt(i.CULL_FACE);let ft=L.side===sn;ot&&(ft=!ft),Vt(ft),L.blending===ws&&L.transparent===!1?Mt(gi):Mt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),c.setFunc(L.depthFunc),c.setTest(L.depthTest),c.setMask(L.depthWrite),a.setMask(L.colorWrite);const Dt=L.stencilWrite;h.setTest(Dt),Dt&&(h.setMask(L.stencilWriteMask),h.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),h.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),O(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?kt(i.SAMPLE_ALPHA_TO_COVERAGE):Lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Vt(L){G!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),G=L)}function A(L){L!==nd?(kt(i.CULL_FACE),L!==J&&(L===Xc?i.cullFace(i.BACK):L===id?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Lt(i.CULL_FACE),J=L}function S(L){L!==D&&(j&&i.lineWidth(L),D=L)}function O(L,ot,ft){L?(kt(i.POLYGON_OFFSET_FILL),(F!==ot||W!==ft)&&(i.polygonOffset(ot,ft),F=ot,W=ft)):Lt(i.POLYGON_OFFSET_FILL)}function it(L){L?kt(i.SCISSOR_TEST):Lt(i.SCISSOR_TEST)}function tt(L){L===void 0&&(L=i.TEXTURE0+Y-1),at!==L&&(i.activeTexture(L),at=L)}function st(L,ot,ft){ft===void 0&&(at===null?ft=i.TEXTURE0+Y-1:ft=at);let Dt=lt[ft];Dt===void 0&&(Dt={type:void 0,texture:void 0},lt[ft]=Dt),(Dt.type!==L||Dt.texture!==ot)&&(at!==ft&&(i.activeTexture(ft),at=ft),i.bindTexture(L,ot||Bt[L]),Dt.type=L,Dt.texture=ot)}function St(){const L=lt[at];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function dt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Pt(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Wt(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Q(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function oe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function qt(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Nt(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function At(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function gt(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function C(L){mt.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),mt.copy(L))}function rt(L){wt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),wt.copy(L))}function Et(L,ot){let ft=u.get(ot);ft===void 0&&(ft=new WeakMap,u.set(ot,ft));let Dt=ft.get(L);Dt===void 0&&(Dt=i.getUniformBlockIndex(ot,L.name),ft.set(L,Dt))}function vt(L,ot){const Dt=u.get(ot).get(L);l.get(ot)!==Dt&&(i.uniformBlockBinding(ot,Dt,L.__bindingPointIndex),l.set(ot,Dt))}function et(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},at=null,lt={},p={},g=new WeakMap,_=[],m=null,d=!1,v=null,x=null,M=null,P=null,w=null,T=null,N=null,y=new jt(0,0,0),b=0,H=!1,G=null,J=null,D=null,F=null,W=null,mt.set(0,0,i.canvas.width,i.canvas.height),wt.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),h.reset()}return{buffers:{color:a,depth:c,stencil:h},enable:kt,disable:Lt,bindFramebuffer:Zt,drawBuffers:z,useProgram:ze,setBlending:Mt,setMaterial:ue,setFlipSided:Vt,setCullFace:A,setLineWidth:S,setPolygonOffset:O,setScissorTest:it,activeTexture:tt,bindTexture:st,unbindTexture:St,compressedTexImage2D:dt,compressedTexImage3D:xt,texImage2D:At,texImage3D:gt,updateUBOMapping:Et,uniformBlockBinding:vt,texStorage2D:qt,texStorage3D:Nt,texSubImage2D:Pt,texSubImage3D:Wt,compressedTexSubImage2D:Q,compressedTexSubImage3D:oe,scissor:C,viewport:rt,reset:et}}function tv(i,t,e,n,s,r,o){const a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,S){return p?new OffscreenCanvas(A,S):lo("canvas")}function _(A,S,O,it){let tt=1;if((A.width>it||A.height>it)&&(tt=it/Math.max(A.width,A.height)),tt<1||S===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const st=S?Ba:Math.floor,St=st(tt*A.width),dt=st(tt*A.height);u===void 0&&(u=g(St,dt));const xt=O?g(St,dt):u;return xt.width=St,xt.height=dt,xt.getContext("2d").drawImage(A,0,0,St,dt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+St+"x"+dt+")."),xt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function m(A){return Tl(A.width)&&Tl(A.height)}function d(A){return a?!1:A.wrapS!==Tn||A.wrapT!==Tn||A.minFilter!==Be&&A.minFilter!==nn}function v(A,S){return A.generateMipmaps&&S&&A.minFilter!==Be&&A.minFilter!==nn}function x(A){i.generateMipmap(A)}function M(A,S,O,it,tt=!1){if(a===!1)return S;if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let st=S;if(S===i.RED&&(O===i.FLOAT&&(st=i.R32F),O===i.HALF_FLOAT&&(st=i.R16F),O===i.UNSIGNED_BYTE&&(st=i.R8)),S===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(st=i.R8UI),O===i.UNSIGNED_SHORT&&(st=i.R16UI),O===i.UNSIGNED_INT&&(st=i.R32UI),O===i.BYTE&&(st=i.R8I),O===i.SHORT&&(st=i.R16I),O===i.INT&&(st=i.R32I)),S===i.RG&&(O===i.FLOAT&&(st=i.RG32F),O===i.HALF_FLOAT&&(st=i.RG16F),O===i.UNSIGNED_BYTE&&(st=i.RG8)),S===i.RGBA){const St=tt?ro:he.getTransfer(it);O===i.FLOAT&&(st=i.RGBA32F),O===i.HALF_FLOAT&&(st=i.RGBA16F),O===i.UNSIGNED_BYTE&&(st=St===fe?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(st=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(st=i.RGB5_A1)}return(st===i.R16F||st===i.R32F||st===i.RG16F||st===i.RG32F||st===i.RGBA16F||st===i.RGBA32F)&&t.get("EXT_color_buffer_float"),st}function P(A,S,O){return v(A,O)===!0||A.isFramebufferTexture&&A.minFilter!==Be&&A.minFilter!==nn?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function w(A){return A===Be||A===Jc||A===ko?i.NEAREST:i.LINEAR}function T(A){const S=A.target;S.removeEventListener("dispose",T),y(S),S.isVideoTexture&&l.delete(S)}function N(A){const S=A.target;S.removeEventListener("dispose",N),H(S)}function y(A){const S=n.get(A);if(S.__webglInit===void 0)return;const O=A.source,it=f.get(O);if(it){const tt=it[S.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&b(A),Object.keys(it).length===0&&f.delete(O)}n.remove(A)}function b(A){const S=n.get(A);i.deleteTexture(S.__webglTexture);const O=A.source,it=f.get(O);delete it[S.__cacheKey],o.memory.textures--}function H(A){const S=A.texture,O=n.get(A),it=n.get(S);if(it.__webglTexture!==void 0&&(i.deleteTexture(it.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(O.__webglFramebuffer[tt]))for(let st=0;st<O.__webglFramebuffer[tt].length;st++)i.deleteFramebuffer(O.__webglFramebuffer[tt][st]);else i.deleteFramebuffer(O.__webglFramebuffer[tt]);O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer[tt])}else{if(Array.isArray(O.__webglFramebuffer))for(let tt=0;tt<O.__webglFramebuffer.length;tt++)i.deleteFramebuffer(O.__webglFramebuffer[tt]);else i.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&i.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let tt=0;tt<O.__webglColorRenderbuffer.length;tt++)O.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(O.__webglColorRenderbuffer[tt]);O.__webglDepthRenderbuffer&&i.deleteRenderbuffer(O.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let tt=0,st=S.length;tt<st;tt++){const St=n.get(S[tt]);St.__webglTexture&&(i.deleteTexture(St.__webglTexture),o.memory.textures--),n.remove(S[tt])}n.remove(S),n.remove(A)}let G=0;function J(){G=0}function D(){const A=G;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),G+=1,A}function F(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function W(A,S){const O=n.get(A);if(A.isVideoTexture&&ue(A),A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){const it=A.image;if(it===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{mt(O,A,S);return}}e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+S)}function Y(A,S){const O=n.get(A);if(A.version>0&&O.__version!==A.version){mt(O,A,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+S)}function j(A,S){const O=n.get(A);if(A.version>0&&O.__version!==A.version){mt(O,A,S);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+S)}function q(A,S){const O=n.get(A);if(A.version>0&&O.__version!==A.version){wt(O,A,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+S)}const K={[so]:i.REPEAT,[Tn]:i.CLAMP_TO_EDGE,[Oa]:i.MIRRORED_REPEAT},at={[Be]:i.NEAREST,[Jc]:i.NEAREST_MIPMAP_NEAREST,[ko]:i.NEAREST_MIPMAP_LINEAR,[nn]:i.LINEAR,[Ud]:i.LINEAR_MIPMAP_NEAREST,[ur]:i.LINEAR_MIPMAP_LINEAR},lt={[$d]:i.NEVER,[Zd]:i.ALWAYS,[jd]:i.LESS,[Su]:i.LEQUAL,[qd]:i.EQUAL,[Jd]:i.GEQUAL,[Yd]:i.GREATER,[Kd]:i.NOTEQUAL};function X(A,S,O){if(O?(i.texParameteri(A,i.TEXTURE_WRAP_S,K[S.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,K[S.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,K[S.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,at[S.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,at[S.minFilter])):(i.texParameteri(A,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(A,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(S.wrapS!==Tn||S.wrapT!==Tn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(A,i.TEXTURE_MAG_FILTER,w(S.magFilter)),i.texParameteri(A,i.TEXTURE_MIN_FILTER,w(S.minFilter)),S.minFilter!==Be&&S.minFilter!==nn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,lt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const it=t.get("EXT_texture_filter_anisotropic");if(S.magFilter===Be||S.minFilter!==ko&&S.minFilter!==ur||S.type===mi&&t.has("OES_texture_float_linear")===!1||a===!1&&S.type===fr&&t.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(i.texParameterf(A,it.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function Z(A,S){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",T));const it=S.source;let tt=f.get(it);tt===void 0&&(tt={},f.set(it,tt));const st=F(S);if(st!==A.__cacheKey){tt[st]===void 0&&(tt[st]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),tt[st].usedTimes++;const St=tt[A.__cacheKey];St!==void 0&&(tt[A.__cacheKey].usedTimes--,St.usedTimes===0&&b(S)),A.__cacheKey=st,A.__webglTexture=tt[st].texture}return O}function mt(A,S,O){let it=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(it=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(it=i.TEXTURE_3D);const tt=Z(A,S),st=S.source;e.bindTexture(it,A.__webglTexture,i.TEXTURE0+O);const St=n.get(st);if(st.version!==St.__version||tt===!0){e.activeTexture(i.TEXTURE0+O);const dt=he.getPrimaries(he.workingColorSpace),xt=S.colorSpace===vn?null:he.getPrimaries(S.colorSpace),Pt=S.colorSpace===vn||dt===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Wt=d(S)&&m(S.image)===!1;let Q=_(S.image,Wt,!1,s.maxTextureSize);Q=Vt(S,Q);const oe=m(Q)||a,qt=r.convert(S.format,S.colorSpace);let Nt=r.convert(S.type),At=M(S.internalFormat,qt,Nt,S.colorSpace,S.isVideoTexture);X(it,S,oe);let gt;const C=S.mipmaps,rt=a&&S.isVideoTexture!==!0&&At!==Mu,Et=St.__version===void 0||tt===!0,vt=P(S,Q,oe);if(S.isDepthTexture)At=i.DEPTH_COMPONENT,a?S.type===mi?At=i.DEPTH_COMPONENT32F:S.type===pi?At=i.DEPTH_COMPONENT24:S.type===Ui?At=i.DEPTH24_STENCIL8:At=i.DEPTH_COMPONENT16:S.type===mi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===Ni&&At===i.DEPTH_COMPONENT&&S.type!==Qa&&S.type!==pi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=pi,Nt=r.convert(S.type)),S.format===Ds&&At===i.DEPTH_COMPONENT&&(At=i.DEPTH_STENCIL,S.type!==Ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=Ui,Nt=r.convert(S.type))),Et&&(rt?e.texStorage2D(i.TEXTURE_2D,1,At,Q.width,Q.height):e.texImage2D(i.TEXTURE_2D,0,At,Q.width,Q.height,0,qt,Nt,null));else if(S.isDataTexture)if(C.length>0&&oe){rt&&Et&&e.texStorage2D(i.TEXTURE_2D,vt,At,C[0].width,C[0].height);for(let et=0,L=C.length;et<L;et++)gt=C[et],rt?e.texSubImage2D(i.TEXTURE_2D,et,0,0,gt.width,gt.height,qt,Nt,gt.data):e.texImage2D(i.TEXTURE_2D,et,At,gt.width,gt.height,0,qt,Nt,gt.data);S.generateMipmaps=!1}else rt?(Et&&e.texStorage2D(i.TEXTURE_2D,vt,At,Q.width,Q.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Q.width,Q.height,qt,Nt,Q.data)):e.texImage2D(i.TEXTURE_2D,0,At,Q.width,Q.height,0,qt,Nt,Q.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){rt&&Et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,At,C[0].width,C[0].height,Q.depth);for(let et=0,L=C.length;et<L;et++)gt=C[et],S.format!==_n?qt!==null?rt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,et,0,0,0,gt.width,gt.height,Q.depth,qt,gt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,et,At,gt.width,gt.height,Q.depth,0,gt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):rt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,et,0,0,0,gt.width,gt.height,Q.depth,qt,Nt,gt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,et,At,gt.width,gt.height,Q.depth,0,qt,Nt,gt.data)}else{rt&&Et&&e.texStorage2D(i.TEXTURE_2D,vt,At,C[0].width,C[0].height);for(let et=0,L=C.length;et<L;et++)gt=C[et],S.format!==_n?qt!==null?rt?e.compressedTexSubImage2D(i.TEXTURE_2D,et,0,0,gt.width,gt.height,qt,gt.data):e.compressedTexImage2D(i.TEXTURE_2D,et,At,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):rt?e.texSubImage2D(i.TEXTURE_2D,et,0,0,gt.width,gt.height,qt,Nt,gt.data):e.texImage2D(i.TEXTURE_2D,et,At,gt.width,gt.height,0,qt,Nt,gt.data)}else if(S.isDataArrayTexture)rt?(Et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,At,Q.width,Q.height,Q.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,qt,Nt,Q.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,At,Q.width,Q.height,Q.depth,0,qt,Nt,Q.data);else if(S.isData3DTexture)rt?(Et&&e.texStorage3D(i.TEXTURE_3D,vt,At,Q.width,Q.height,Q.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,qt,Nt,Q.data)):e.texImage3D(i.TEXTURE_3D,0,At,Q.width,Q.height,Q.depth,0,qt,Nt,Q.data);else if(S.isFramebufferTexture){if(Et)if(rt)e.texStorage2D(i.TEXTURE_2D,vt,At,Q.width,Q.height);else{let et=Q.width,L=Q.height;for(let ot=0;ot<vt;ot++)e.texImage2D(i.TEXTURE_2D,ot,At,et,L,0,qt,Nt,null),et>>=1,L>>=1}}else if(C.length>0&&oe){rt&&Et&&e.texStorage2D(i.TEXTURE_2D,vt,At,C[0].width,C[0].height);for(let et=0,L=C.length;et<L;et++)gt=C[et],rt?e.texSubImage2D(i.TEXTURE_2D,et,0,0,qt,Nt,gt):e.texImage2D(i.TEXTURE_2D,et,At,qt,Nt,gt);S.generateMipmaps=!1}else rt?(Et&&e.texStorage2D(i.TEXTURE_2D,vt,At,Q.width,Q.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,qt,Nt,Q)):e.texImage2D(i.TEXTURE_2D,0,At,qt,Nt,Q);v(S,oe)&&x(it),St.__version=st.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function wt(A,S,O){if(S.image.length!==6)return;const it=Z(A,S),tt=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+O);const st=n.get(tt);if(tt.version!==st.__version||it===!0){e.activeTexture(i.TEXTURE0+O);const St=he.getPrimaries(he.workingColorSpace),dt=S.colorSpace===vn?null:he.getPrimaries(S.colorSpace),xt=S.colorSpace===vn||St===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Pt=S.isCompressedTexture||S.image[0].isCompressedTexture,Wt=S.image[0]&&S.image[0].isDataTexture,Q=[];for(let et=0;et<6;et++)!Pt&&!Wt?Q[et]=_(S.image[et],!1,!0,s.maxCubemapSize):Q[et]=Wt?S.image[et].image:S.image[et],Q[et]=Vt(S,Q[et]);const oe=Q[0],qt=m(oe)||a,Nt=r.convert(S.format,S.colorSpace),At=r.convert(S.type),gt=M(S.internalFormat,Nt,At,S.colorSpace),C=a&&S.isVideoTexture!==!0,rt=st.__version===void 0||it===!0;let Et=P(S,oe,qt);X(i.TEXTURE_CUBE_MAP,S,qt);let vt;if(Pt){C&&rt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,gt,oe.width,oe.height);for(let et=0;et<6;et++){vt=Q[et].mipmaps;for(let L=0;L<vt.length;L++){const ot=vt[L];S.format!==_n?Nt!==null?C?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,L,0,0,ot.width,ot.height,Nt,ot.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,L,gt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,L,0,0,ot.width,ot.height,Nt,At,ot.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,L,gt,ot.width,ot.height,0,Nt,At,ot.data)}}}else{vt=S.mipmaps,C&&rt&&(vt.length>0&&Et++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Et,gt,Q[0].width,Q[0].height));for(let et=0;et<6;et++)if(Wt){C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Q[et].width,Q[et].height,Nt,At,Q[et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,gt,Q[et].width,Q[et].height,0,Nt,At,Q[et].data);for(let L=0;L<vt.length;L++){const ft=vt[L].image[et].image;C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,L+1,0,0,ft.width,ft.height,Nt,At,ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,L+1,gt,ft.width,ft.height,0,Nt,At,ft.data)}}else{C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Nt,At,Q[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,gt,Nt,At,Q[et]);for(let L=0;L<vt.length;L++){const ot=vt[L];C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,L+1,0,0,Nt,At,ot.image[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,L+1,gt,Nt,At,ot.image[et])}}}v(S,qt)&&x(i.TEXTURE_CUBE_MAP),st.__version=tt.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function bt(A,S,O,it,tt,st){const St=r.convert(O.format,O.colorSpace),dt=r.convert(O.type),xt=M(O.internalFormat,St,dt,O.colorSpace);if(!n.get(S).__hasExternalTextures){const Wt=Math.max(1,S.width>>st),Q=Math.max(1,S.height>>st);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,st,xt,Wt,Q,S.depth,0,St,dt,null):e.texImage2D(tt,st,xt,Wt,Q,0,St,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,tt,n.get(O).__webglTexture,0,Ut(S)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,it,tt,n.get(O).__webglTexture,st),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(A,S,O){if(i.bindRenderbuffer(i.RENDERBUFFER,A),S.depthBuffer&&!S.stencilBuffer){let it=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(O||Mt(S)){const tt=S.depthTexture;tt&&tt.isDepthTexture&&(tt.type===mi?it=i.DEPTH_COMPONENT32F:tt.type===pi&&(it=i.DEPTH_COMPONENT24));const st=Ut(S);Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,st,it,S.width,S.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,st,it,S.width,S.height)}else i.renderbufferStorage(i.RENDERBUFFER,it,S.width,S.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,A)}else if(S.depthBuffer&&S.stencilBuffer){const it=Ut(S);O&&Mt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,it,i.DEPTH24_STENCIL8,S.width,S.height):Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,i.DEPTH24_STENCIL8,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,A)}else{const it=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let tt=0;tt<it.length;tt++){const st=it[tt],St=r.convert(st.format,st.colorSpace),dt=r.convert(st.type),xt=M(st.internalFormat,St,dt,st.colorSpace),Pt=Ut(S);O&&Mt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Pt,xt,S.width,S.height):Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Pt,xt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,xt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function kt(A,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),W(S.depthTexture,0);const it=n.get(S.depthTexture).__webglTexture,tt=Ut(S);if(S.depthTexture.format===Ni)Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0);else if(S.depthTexture.format===Ds)Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function Lt(A){const S=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!S.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");kt(S.__webglFramebuffer,A)}else if(O){S.__webglDepthbuffer=[];for(let it=0;it<6;it++)e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[it]),S.__webglDepthbuffer[it]=i.createRenderbuffer(),Bt(S.__webglDepthbuffer[it],A,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=i.createRenderbuffer(),Bt(S.__webglDepthbuffer,A,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Zt(A,S,O){const it=n.get(A);S!==void 0&&bt(it.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Lt(A)}function z(A){const S=A.texture,O=n.get(A),it=n.get(S);A.addEventListener("dispose",N),A.isWebGLMultipleRenderTargets!==!0&&(it.__webglTexture===void 0&&(it.__webglTexture=i.createTexture()),it.__version=S.version,o.memory.textures++);const tt=A.isWebGLCubeRenderTarget===!0,st=A.isWebGLMultipleRenderTargets===!0,St=m(A)||a;if(tt){O.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(a&&S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer[dt]=[];for(let xt=0;xt<S.mipmaps.length;xt++)O.__webglFramebuffer[dt][xt]=i.createFramebuffer()}else O.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(a&&S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer=[];for(let dt=0;dt<S.mipmaps.length;dt++)O.__webglFramebuffer[dt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(st)if(s.drawBuffers){const dt=A.texture;for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Wt=n.get(dt[xt]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&Mt(A)===!1){const dt=st?S:[S];O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let xt=0;xt<dt.length;xt++){const Pt=dt[xt];O.__webglColorRenderbuffer[xt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[xt]);const Wt=r.convert(Pt.format,Pt.colorSpace),Q=r.convert(Pt.type),oe=M(Pt.internalFormat,Wt,Q,Pt.colorSpace,A.isXRRenderTarget===!0),qt=Ut(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,oe,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,O.__webglColorRenderbuffer[xt])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Bt(O.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,it.__webglTexture),X(i.TEXTURE_CUBE_MAP,S,St);for(let dt=0;dt<6;dt++)if(a&&S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)bt(O.__webglFramebuffer[dt][xt],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,xt);else bt(O.__webglFramebuffer[dt],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);v(S,St)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(st){const dt=A.texture;for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Wt=dt[xt],Q=n.get(Wt);e.bindTexture(i.TEXTURE_2D,Q.__webglTexture),X(i.TEXTURE_2D,Wt,St),bt(O.__webglFramebuffer,A,Wt,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,0),v(Wt,St)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?dt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(dt,it.__webglTexture),X(dt,S,St),a&&S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)bt(O.__webglFramebuffer[xt],A,S,i.COLOR_ATTACHMENT0,dt,xt);else bt(O.__webglFramebuffer,A,S,i.COLOR_ATTACHMENT0,dt,0);v(S,St)&&x(dt),e.unbindTexture()}A.depthBuffer&&Lt(A)}function ze(A){const S=m(A)||a,O=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let it=0,tt=O.length;it<tt;it++){const st=O[it];if(v(st,S)){const St=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,dt=n.get(st).__webglTexture;e.bindTexture(St,dt),x(St),e.unbindTexture()}}}function Rt(A){if(a&&A.samples>0&&Mt(A)===!1){const S=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],O=A.width,it=A.height;let tt=i.COLOR_BUFFER_BIT;const st=[],St=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=n.get(A),xt=A.isWebGLMultipleRenderTargets===!0;if(xt)for(let Pt=0;Pt<S.length;Pt++)e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let Pt=0;Pt<S.length;Pt++){st.push(i.COLOR_ATTACHMENT0+Pt),A.depthBuffer&&st.push(St);const Wt=dt.__ignoreDepthValues!==void 0?dt.__ignoreDepthValues:!1;if(Wt===!1&&(A.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),xt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Pt]),Wt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[St]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[St])),xt){const Q=n.get(S[Pt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Q,0)}i.blitFramebuffer(0,0,O,it,0,0,O,it,tt,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),xt)for(let Pt=0;Pt<S.length;Pt++){e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Pt]);const Wt=n.get(S[Pt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,Wt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}}function Ut(A){return Math.min(s.maxSamples,A.samples)}function Mt(A){const S=n.get(A);return a&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ue(A){const S=o.render.frame;l.get(A)!==S&&(l.set(A,S),A.update())}function Vt(A,S){const O=A.colorSpace,it=A.format,tt=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===za||O!==si&&O!==vn&&(he.getTransfer(O)===fe?a===!1?t.has("EXT_sRGB")===!0&&it===_n?(A.format=za,A.minFilter=nn,A.generateMipmaps=!1):S=Eu.sRGBToLinear(S):(it!==_n||tt!==vi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),S}this.allocateTextureUnit=D,this.resetTextureUnits=J,this.setTexture2D=W,this.setTexture2DArray=Y,this.setTexture3D=j,this.setTextureCube=q,this.rebindTextures=Zt,this.setupRenderTarget=z,this.updateRenderTargetMipmap=ze,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=Mt}function ev(i,t,e){const n=e.isWebGL2;function s(r,o=vn){let a;const c=he.getTransfer(o);if(r===vi)return i.UNSIGNED_BYTE;if(r===mu)return i.UNSIGNED_SHORT_4_4_4_4;if(r===gu)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Nd)return i.BYTE;if(r===Od)return i.SHORT;if(r===Qa)return i.UNSIGNED_SHORT;if(r===pu)return i.INT;if(r===pi)return i.UNSIGNED_INT;if(r===mi)return i.FLOAT;if(r===fr)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===zd)return i.ALPHA;if(r===_n)return i.RGBA;if(r===Fd)return i.LUMINANCE;if(r===Bd)return i.LUMINANCE_ALPHA;if(r===Ni)return i.DEPTH_COMPONENT;if(r===Ds)return i.DEPTH_STENCIL;if(r===za)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===kd)return i.RED;if(r===_u)return i.RED_INTEGER;if(r===Hd)return i.RG;if(r===vu)return i.RG_INTEGER;if(r===xu)return i.RGBA_INTEGER;if(r===Ho||r===Go||r===Vo||r===Wo)if(c===fe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Ho)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Go)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Vo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Wo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Ho)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Go)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Vo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Wo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Zc||r===Qc||r===tl||r===el)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Zc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Qc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===tl)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===el)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Mu)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===nl||r===il)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===nl)return c===fe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===il)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===sl||r===rl||r===ol||r===al||r===cl||r===ll||r===hl||r===ul||r===fl||r===dl||r===pl||r===ml||r===gl||r===_l)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===sl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===rl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===ol)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===al)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===cl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ll)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===hl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===ul)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===fl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===dl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===pl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ml)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===gl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===_l)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Xo||r===vl||r===xl)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Xo)return c===fe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===vl)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===xl)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Gd||r===Ml||r===yl||r===Sl)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Xo)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Ml)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===yl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Sl)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ui?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class nv extends ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class zt extends Ue{constructor(){super(),this.isGroup=!0,this.type="Group"}}const iv={type:"move"};class ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),d=this._getHandJoint(h,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=l.position.distanceTo(u.position),p=.02,g=.005;h.inputState.pinching&&f>p+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&f<=p-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(iv)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new zt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class sv extends Wi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,h=null,l=null,u=null,f=null,p=null,g=null;const _=e.getContextAttributes();let m=null,d=null;const v=[],x=[],M=new ut;let P=null;const w=new ln;w.layers.enable(1),w.viewport=new pe;const T=new ln;T.layers.enable(2),T.viewport=new pe;const N=[w,T],y=new nv;y.layers.enable(1),y.layers.enable(2);let b=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Z=v[X];return Z===void 0&&(Z=new ma,v[X]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(X){let Z=v[X];return Z===void 0&&(Z=new ma,v[X]=Z),Z.getGripSpace()},this.getHand=function(X){let Z=v[X];return Z===void 0&&(Z=new ma,v[X]=Z),Z.getHandSpace()};function G(X){const Z=x.indexOf(X.inputSource);if(Z===-1)return;const mt=v[Z];mt!==void 0&&(mt.update(X.inputSource,X.frame,h||o),mt.dispatchEvent({type:X.type,data:X.inputSource}))}function J(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",D);for(let X=0;X<v.length;X++){const Z=x[X];Z!==null&&(x[X]=null,v[X].disconnect(Z))}b=null,H=null,t.setRenderTarget(m),p=null,f=null,u=null,s=null,d=null,lt.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(X){h=X},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",J),s.addEventListener("inputsourceschange",D),_.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Z={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,Z),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new ki(p.framebufferWidth,p.framebufferHeight,{format:_n,type:vi,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let Z=null,mt=null,wt=null;_.depth&&(wt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=_.stencil?Ds:Ni,mt=_.stencil?Ui:pi);const bt={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(bt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),d=new ki(f.textureWidth,f.textureHeight,{format:_n,type:vi,depthTexture:new Nu(f.textureWidth,f.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Bt=t.properties.get(d);Bt.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await s.requestReferenceSpace(a),lt.setContext(s),lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function D(X){for(let Z=0;Z<X.removed.length;Z++){const mt=X.removed[Z],wt=x.indexOf(mt);wt>=0&&(x[wt]=null,v[wt].disconnect(mt))}for(let Z=0;Z<X.added.length;Z++){const mt=X.added[Z];let wt=x.indexOf(mt);if(wt===-1){for(let Bt=0;Bt<v.length;Bt++)if(Bt>=x.length){x.push(mt),wt=Bt;break}else if(x[Bt]===null){x[Bt]=mt,wt=Bt;break}if(wt===-1)break}const bt=v[wt];bt&&bt.connect(mt)}}const F=new R,W=new R;function Y(X,Z,mt){F.setFromMatrixPosition(Z.matrixWorld),W.setFromMatrixPosition(mt.matrixWorld);const wt=F.distanceTo(W),bt=Z.projectionMatrix.elements,Bt=mt.projectionMatrix.elements,kt=bt[14]/(bt[10]-1),Lt=bt[14]/(bt[10]+1),Zt=(bt[9]+1)/bt[5],z=(bt[9]-1)/bt[5],ze=(bt[8]-1)/bt[0],Rt=(Bt[8]+1)/Bt[0],Ut=kt*ze,Mt=kt*Rt,ue=wt/(-ze+Rt),Vt=ue*-ze;Z.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Vt),X.translateZ(ue),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const A=kt+ue,S=Lt+ue,O=Ut-Vt,it=Mt+(wt-Vt),tt=Zt*Lt/S*A,st=z*Lt/S*A;X.projectionMatrix.makePerspective(O,it,tt,st,A,S),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function j(X,Z){Z===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Z.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;y.near=T.near=w.near=X.near,y.far=T.far=w.far=X.far,(b!==y.near||H!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),b=y.near,H=y.far);const Z=X.parent,mt=y.cameras;j(y,Z);for(let wt=0;wt<mt.length;wt++)j(mt[wt],Z);mt.length===2?Y(y,w,T):y.projectionMatrix.copy(w.projectionMatrix),q(X,y,Z)};function q(X,Z,mt){mt===null?X.matrix.copy(Z.matrixWorld):(X.matrix.copy(mt.matrixWorld),X.matrix.invert(),X.matrix.multiply(Z.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Fa*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(X){c=X,f!==null&&(f.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)};let K=null;function at(X,Z){if(l=Z.getViewerPose(h||o),g=Z,l!==null){const mt=l.views;p!==null&&(t.setRenderTargetFramebuffer(d,p.framebuffer),t.setRenderTarget(d));let wt=!1;mt.length!==y.cameras.length&&(y.cameras.length=0,wt=!0);for(let bt=0;bt<mt.length;bt++){const Bt=mt[bt];let kt=null;if(p!==null)kt=p.getViewport(Bt);else{const Zt=u.getViewSubImage(f,Bt);kt=Zt.viewport,bt===0&&(t.setRenderTargetTextures(d,Zt.colorTexture,f.ignoreDepthValues?void 0:Zt.depthStencilTexture),t.setRenderTarget(d))}let Lt=N[bt];Lt===void 0&&(Lt=new ln,Lt.layers.enable(bt),Lt.viewport=new pe,N[bt]=Lt),Lt.matrix.fromArray(Bt.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(Bt.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(kt.x,kt.y,kt.width,kt.height),bt===0&&(y.matrix.copy(Lt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),wt===!0&&y.cameras.push(Lt)}}for(let mt=0;mt<v.length;mt++){const wt=x[mt],bt=v[mt];wt!==null&&bt!==void 0&&bt.update(wt,Z,h||o)}K&&K(X,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const lt=new Iu;lt.setAnimationLoop(at),this.setAnimationLoop=function(X){K=X},this.dispose=function(){}}}function rv(i,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Pu(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,v,x,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),l(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,M)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,v,x):d.isSpriteMaterial?h(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===sn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===sn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const v=t.get(d).envMap;if(v&&(m.envMap.value=v,m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*x,e(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,v,x){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*v,m.scale.value=x*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),t.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,v){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===sn&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){const v=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ov(i,t,e,n){let s={},r={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,x){const M=x.program;n.uniformBlockBinding(v,M)}function h(v,x){let M=s[v.id];M===void 0&&(g(v),M=l(v),s[v.id]=M,v.addEventListener("dispose",m));const P=x.program;n.updateUBOMapping(v,P);const w=t.render.frame;r[v.id]!==w&&(f(v),r[v.id]=w)}function l(v){const x=u();v.__bindingPointIndex=x;const M=i.createBuffer(),P=v.__size,w=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,P,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,M),M}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const x=s[v.id],M=v.uniforms,P=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,T=M.length;w<T;w++){const N=Array.isArray(M[w])?M[w]:[M[w]];for(let y=0,b=N.length;y<b;y++){const H=N[y];if(p(H,w,y,P)===!0){const G=H.__offset,J=Array.isArray(H.value)?H.value:[H.value];let D=0;for(let F=0;F<J.length;F++){const W=J[F],Y=_(W);typeof W=="number"||typeof W=="boolean"?(H.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,G+D,H.__data)):W.isMatrix3?(H.__data[0]=W.elements[0],H.__data[1]=W.elements[1],H.__data[2]=W.elements[2],H.__data[3]=0,H.__data[4]=W.elements[3],H.__data[5]=W.elements[4],H.__data[6]=W.elements[5],H.__data[7]=0,H.__data[8]=W.elements[6],H.__data[9]=W.elements[7],H.__data[10]=W.elements[8],H.__data[11]=0):(W.toArray(H.__data,D),D+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,H.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,x,M,P){const w=v.value,T=x+"_"+M;if(P[T]===void 0)return typeof w=="number"||typeof w=="boolean"?P[T]=w:P[T]=w.clone(),!0;{const N=P[T];if(typeof w=="number"||typeof w=="boolean"){if(N!==w)return P[T]=w,!0}else if(N.equals(w)===!1)return N.copy(w),!0}return!1}function g(v){const x=v.uniforms;let M=0;const P=16;for(let T=0,N=x.length;T<N;T++){const y=Array.isArray(x[T])?x[T]:[x[T]];for(let b=0,H=y.length;b<H;b++){const G=y[b],J=Array.isArray(G.value)?G.value:[G.value];for(let D=0,F=J.length;D<F;D++){const W=J[D],Y=_(W),j=M%P;j!==0&&P-j<Y.boundary&&(M+=P-j),G.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=M,M+=Y.storage}}}const w=M%P;return w>0&&(M+=P-w),v.__size=M,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function d(){for(const v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:h,dispose:d}}class Hu{constructor(t={}){const{canvas:e=np(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;const p=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const d=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Te,this._useLegacyLights=!1,this.toneMapping=_i,this.toneMappingExposure=1;const x=this;let M=!1,P=0,w=0,T=null,N=-1,y=null;const b=new pe,H=new pe;let G=null;const J=new jt(0);let D=0,F=e.width,W=e.height,Y=1,j=null,q=null;const K=new pe(0,0,F,W),at=new pe(0,0,F,W);let lt=!1;const X=new ic;let Z=!1,mt=!1,wt=null;const bt=new le,Bt=new ut,kt=new R,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Zt(){return T===null?Y:1}let z=n;function ze(E,I){for(let k=0;k<E.length;k++){const V=E[k],B=e.getContext(V,I);if(B!==null)return B}return null}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ja}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",ot,!1),z===null){const I=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&I.shift(),z=ze(I,E),z===null)throw ze(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&z instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),z.getShaderPrecisionFormat===void 0&&(z.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Rt,Ut,Mt,ue,Vt,A,S,O,it,tt,st,St,dt,xt,Pt,Wt,Q,oe,qt,Nt,At,gt,C,rt;function Et(){Rt=new gg(z),Ut=new hg(z,Rt,t),Rt.init(Ut),gt=new ev(z,Rt,Ut),Mt=new Q_(z,Rt,Ut),ue=new xg(z),Vt=new B_,A=new tv(z,Rt,Mt,Vt,Ut,gt,ue),S=new fg(x),O=new mg(x),it=new Ap(z,Ut),C=new cg(z,Rt,it,Ut),tt=new _g(z,it,ue,C),st=new bg(z,tt,it,ue),qt=new Sg(z,Ut,A),Wt=new ug(Vt),St=new F_(x,S,O,Rt,Ut,C,Wt),dt=new rv(x,Vt),xt=new H_,Pt=new j_(Rt,Ut),oe=new ag(x,S,O,Mt,st,f,c),Q=new Z_(x,st,Ut),rt=new ov(z,ue,Ut,Mt),Nt=new lg(z,Rt,ue,Ut),At=new vg(z,Rt,ue,Ut),ue.programs=St.programs,x.capabilities=Ut,x.extensions=Rt,x.properties=Vt,x.renderLists=xt,x.shadowMap=Q,x.state=Mt,x.info=ue}Et();const vt=new sv(x,z);this.xr=vt,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const E=Rt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Rt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(E){E!==void 0&&(Y=E,this.setSize(F,W,!1))},this.getSize=function(E){return E.set(F,W)},this.setSize=function(E,I,k=!0){if(vt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=E,W=I,e.width=Math.floor(E*Y),e.height=Math.floor(I*Y),k===!0&&(e.style.width=E+"px",e.style.height=I+"px"),this.setViewport(0,0,E,I)},this.getDrawingBufferSize=function(E){return E.set(F*Y,W*Y).floor()},this.setDrawingBufferSize=function(E,I,k){F=E,W=I,Y=k,e.width=Math.floor(E*k),e.height=Math.floor(I*k),this.setViewport(0,0,E,I)},this.getCurrentViewport=function(E){return E.copy(b)},this.getViewport=function(E){return E.copy(K)},this.setViewport=function(E,I,k,V){E.isVector4?K.set(E.x,E.y,E.z,E.w):K.set(E,I,k,V),Mt.viewport(b.copy(K).multiplyScalar(Y).floor())},this.getScissor=function(E){return E.copy(at)},this.setScissor=function(E,I,k,V){E.isVector4?at.set(E.x,E.y,E.z,E.w):at.set(E,I,k,V),Mt.scissor(H.copy(at).multiplyScalar(Y).floor())},this.getScissorTest=function(){return lt},this.setScissorTest=function(E){Mt.setScissorTest(lt=E)},this.setOpaqueSort=function(E){j=E},this.setTransparentSort=function(E){q=E},this.getClearColor=function(E){return E.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor.apply(oe,arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha.apply(oe,arguments)},this.clear=function(E=!0,I=!0,k=!0){let V=0;if(E){let B=!1;if(T!==null){const _t=T.texture.format;B=_t===xu||_t===vu||_t===_u}if(B){const _t=T.texture.type,Tt=_t===vi||_t===pi||_t===Qa||_t===Ui||_t===mu||_t===gu,It=oe.getClearColor(),Ot=oe.getClearAlpha(),Yt=It.r,Gt=It.g,Xt=It.b;Tt?(p[0]=Yt,p[1]=Gt,p[2]=Xt,p[3]=Ot,z.clearBufferuiv(z.COLOR,0,p)):(g[0]=Yt,g[1]=Gt,g[2]=Xt,g[3]=Ot,z.clearBufferiv(z.COLOR,0,g))}else V|=z.COLOR_BUFFER_BIT}I&&(V|=z.DEPTH_BUFFER_BIT),k&&(V|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",ot,!1),xt.dispose(),Pt.dispose(),Vt.dispose(),S.dispose(),O.dispose(),st.dispose(),C.dispose(),rt.dispose(),St.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",ye),vt.removeEventListener("sessionend",ne),wt&&(wt.dispose(),wt=null),Ee.stop()};function et(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const E=ue.autoReset,I=Q.enabled,k=Q.autoUpdate,V=Q.needsUpdate,B=Q.type;Et(),ue.autoReset=E,Q.enabled=I,Q.autoUpdate=k,Q.needsUpdate=V,Q.type=B}function ot(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ft(E){const I=E.target;I.removeEventListener("dispose",ft),Dt(I)}function Dt(E){Ct(E),Vt.remove(E)}function Ct(E){const I=Vt.get(E).programs;I!==void 0&&(I.forEach(function(k){St.releaseProgram(k)}),E.isShaderMaterial&&St.releaseShaderCache(E))}this.renderBufferDirect=function(E,I,k,V,B,_t){I===null&&(I=Lt);const Tt=B.isMesh&&B.matrixWorld.determinant()<0,It=Zf(E,I,k,V,B);Mt.setMaterial(V,Tt);let Ot=k.index,Yt=1;if(V.wireframe===!0){if(Ot=tt.getWireframeAttribute(k),Ot===void 0)return;Yt=2}const Gt=k.drawRange,Xt=k.attributes.position;let Se=Gt.start*Yt,on=(Gt.start+Gt.count)*Yt;_t!==null&&(Se=Math.max(Se,_t.start*Yt),on=Math.min(on,(_t.start+_t.count)*Yt)),Ot!==null?(Se=Math.max(Se,0),on=Math.min(on,Ot.count)):Xt!=null&&(Se=Math.max(Se,0),on=Math.min(on,Xt.count));const Le=on-Se;if(Le<0||Le===1/0)return;C.setup(B,V,It,k,Ot);let Wn,ge=Nt;if(Ot!==null&&(Wn=it.get(Ot),ge=At,ge.setIndex(Wn)),B.isMesh)V.wireframe===!0?(Mt.setLineWidth(V.wireframeLinewidth*Zt()),ge.setMode(z.LINES)):ge.setMode(z.TRIANGLES);else if(B.isLine){let Kt=V.linewidth;Kt===void 0&&(Kt=1),Mt.setLineWidth(Kt*Zt()),B.isLineSegments?ge.setMode(z.LINES):B.isLineLoop?ge.setMode(z.LINE_LOOP):ge.setMode(z.LINE_STRIP)}else B.isPoints?ge.setMode(z.POINTS):B.isSprite&&ge.setMode(z.TRIANGLES);if(B.isBatchedMesh)ge.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else if(B.isInstancedMesh)ge.renderInstances(Se,Le,B.count);else if(k.isInstancedBufferGeometry){const Kt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Oo=Math.min(k.instanceCount,Kt);ge.renderInstances(Se,Le,Oo)}else ge.render(Se,Le)};function Qt(E,I,k){E.transparent===!0&&E.side===un&&E.forceSinglePass===!1?(E.side=sn,E.needsUpdate=!0,Er(E,I,k),E.side=Mi,E.needsUpdate=!0,Er(E,I,k),E.side=un):Er(E,I,k)}this.compile=function(E,I,k=null){k===null&&(k=E),m=Pt.get(k),m.init(),v.push(m),k.traverseVisible(function(B){B.isLight&&B.layers.test(I.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),E!==k&&E.traverseVisible(function(B){B.isLight&&B.layers.test(I.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights(x._useLegacyLights);const V=new Set;return E.traverse(function(B){const _t=B.material;if(_t)if(Array.isArray(_t))for(let Tt=0;Tt<_t.length;Tt++){const It=_t[Tt];Qt(It,k,B),V.add(It)}else Qt(_t,k,B),V.add(_t)}),v.pop(),m=null,V},this.compileAsync=function(E,I,k=null){const V=this.compile(E,I,k);return new Promise(B=>{function _t(){if(V.forEach(function(Tt){Vt.get(Tt).currentProgram.isReady()&&V.delete(Tt)}),V.size===0){B(E);return}setTimeout(_t,10)}Rt.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let te=null;function xe(E){te&&te(E)}function ye(){Ee.stop()}function ne(){Ee.start()}const Ee=new Iu;Ee.setAnimationLoop(xe),typeof self<"u"&&Ee.setContext(self),this.setAnimationLoop=function(E){te=E,vt.setAnimationLoop(E),E===null?Ee.stop():Ee.start()},vt.addEventListener("sessionstart",ye),vt.addEventListener("sessionend",ne),this.render=function(E,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(I),I=vt.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,I,T),m=Pt.get(E,v.length),m.init(),v.push(m),bt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),X.setFromProjectionMatrix(bt),mt=this.localClippingEnabled,Z=Wt.init(this.clippingPlanes,mt),_=xt.get(E,d.length),_.init(),d.push(_),Dn(E,I,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(j,q),this.info.render.frame++,Z===!0&&Wt.beginShadows();const k=m.state.shadowsArray;if(Q.render(k,E,I),Z===!0&&Wt.endShadows(),this.info.autoReset===!0&&this.info.reset(),oe.render(_,E),m.setupLights(x._useLegacyLights),I.isArrayCamera){const V=I.cameras;for(let B=0,_t=V.length;B<_t;B++){const Tt=V[B];Bc(_,E,Tt,Tt.viewport)}}else Bc(_,E,I);T!==null&&(A.updateMultisampleRenderTarget(T),A.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(x,E,I),C.resetDefaultState(),N=-1,y=null,v.pop(),v.length>0?m=v[v.length-1]:m=null,d.pop(),d.length>0?_=d[d.length-1]:_=null};function Dn(E,I,k,V){if(E.visible===!1)return;if(E.layers.test(I.layers)){if(E.isGroup)k=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(I);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||X.intersectsSprite(E)){V&&kt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(bt);const Tt=st.update(E),It=E.material;It.visible&&_.push(E,Tt,It,k,kt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||X.intersectsObject(E))){const Tt=st.update(E),It=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),kt.copy(E.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),kt.copy(Tt.boundingSphere.center)),kt.applyMatrix4(E.matrixWorld).applyMatrix4(bt)),Array.isArray(It)){const Ot=Tt.groups;for(let Yt=0,Gt=Ot.length;Yt<Gt;Yt++){const Xt=Ot[Yt],Se=It[Xt.materialIndex];Se&&Se.visible&&_.push(E,Tt,Se,k,kt.z,Xt)}}else It.visible&&_.push(E,Tt,It,k,kt.z,null)}}const _t=E.children;for(let Tt=0,It=_t.length;Tt<It;Tt++)Dn(_t[Tt],I,k,V)}function Bc(E,I,k,V){const B=E.opaque,_t=E.transmissive,Tt=E.transparent;m.setupLightsView(k),Z===!0&&Wt.setGlobalState(x.clippingPlanes,k),_t.length>0&&Jf(B,_t,I,k),V&&Mt.viewport(b.copy(V)),B.length>0&&br(B,I,k),_t.length>0&&br(_t,I,k),Tt.length>0&&br(Tt,I,k),Mt.buffers.depth.setTest(!0),Mt.buffers.depth.setMask(!0),Mt.buffers.color.setMask(!0),Mt.setPolygonOffset(!1)}function Jf(E,I,k,V){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const _t=Ut.isWebGL2;wt===null&&(wt=new ki(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")?fr:vi,minFilter:ur,samples:_t?4:0})),x.getDrawingBufferSize(Bt),_t?wt.setSize(Bt.x,Bt.y):wt.setSize(Ba(Bt.x),Ba(Bt.y));const Tt=x.getRenderTarget();x.setRenderTarget(wt),x.getClearColor(J),D=x.getClearAlpha(),D<1&&x.setClearColor(16777215,.5),x.clear();const It=x.toneMapping;x.toneMapping=_i,br(E,k,V),A.updateMultisampleRenderTarget(wt),A.updateRenderTargetMipmap(wt);let Ot=!1;for(let Yt=0,Gt=I.length;Yt<Gt;Yt++){const Xt=I[Yt],Se=Xt.object,on=Xt.geometry,Le=Xt.material,Wn=Xt.group;if(Le.side===un&&Se.layers.test(V.layers)){const ge=Le.side;Le.side=sn,Le.needsUpdate=!0,kc(Se,k,V,on,Le,Wn),Le.side=ge,Le.needsUpdate=!0,Ot=!0}}Ot===!0&&(A.updateMultisampleRenderTarget(wt),A.updateRenderTargetMipmap(wt)),x.setRenderTarget(Tt),x.setClearColor(J,D),x.toneMapping=It}function br(E,I,k){const V=I.isScene===!0?I.overrideMaterial:null;for(let B=0,_t=E.length;B<_t;B++){const Tt=E[B],It=Tt.object,Ot=Tt.geometry,Yt=V===null?Tt.material:V,Gt=Tt.group;It.layers.test(k.layers)&&kc(It,I,k,Ot,Yt,Gt)}}function kc(E,I,k,V,B,_t){E.onBeforeRender(x,I,k,V,B,_t),E.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),B.onBeforeRender(x,I,k,V,E,_t),B.transparent===!0&&B.side===un&&B.forceSinglePass===!1?(B.side=sn,B.needsUpdate=!0,x.renderBufferDirect(k,I,V,B,E,_t),B.side=Mi,B.needsUpdate=!0,x.renderBufferDirect(k,I,V,B,E,_t),B.side=un):x.renderBufferDirect(k,I,V,B,E,_t),E.onAfterRender(x,I,k,V,B,_t)}function Er(E,I,k){I.isScene!==!0&&(I=Lt);const V=Vt.get(E),B=m.state.lights,_t=m.state.shadowsArray,Tt=B.state.version,It=St.getParameters(E,B.state,_t,I,k),Ot=St.getProgramCacheKey(It);let Yt=V.programs;V.environment=E.isMeshStandardMaterial?I.environment:null,V.fog=I.fog,V.envMap=(E.isMeshStandardMaterial?O:S).get(E.envMap||V.environment),Yt===void 0&&(E.addEventListener("dispose",ft),Yt=new Map,V.programs=Yt);let Gt=Yt.get(Ot);if(Gt!==void 0){if(V.currentProgram===Gt&&V.lightsStateVersion===Tt)return Gc(E,It),Gt}else It.uniforms=St.getUniforms(E),E.onBuild(k,It,x),E.onBeforeCompile(It,x),Gt=St.acquireProgram(It,Ot),Yt.set(Ot,Gt),V.uniforms=It.uniforms;const Xt=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Xt.clippingPlanes=Wt.uniform),Gc(E,It),V.needsLights=td(E),V.lightsStateVersion=Tt,V.needsLights&&(Xt.ambientLightColor.value=B.state.ambient,Xt.lightProbe.value=B.state.probe,Xt.directionalLights.value=B.state.directional,Xt.directionalLightShadows.value=B.state.directionalShadow,Xt.spotLights.value=B.state.spot,Xt.spotLightShadows.value=B.state.spotShadow,Xt.rectAreaLights.value=B.state.rectArea,Xt.ltc_1.value=B.state.rectAreaLTC1,Xt.ltc_2.value=B.state.rectAreaLTC2,Xt.pointLights.value=B.state.point,Xt.pointLightShadows.value=B.state.pointShadow,Xt.hemisphereLights.value=B.state.hemi,Xt.directionalShadowMap.value=B.state.directionalShadowMap,Xt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Xt.spotShadowMap.value=B.state.spotShadowMap,Xt.spotLightMatrix.value=B.state.spotLightMatrix,Xt.spotLightMap.value=B.state.spotLightMap,Xt.pointShadowMap.value=B.state.pointShadowMap,Xt.pointShadowMatrix.value=B.state.pointShadowMatrix),V.currentProgram=Gt,V.uniformsList=null,Gt}function Hc(E){if(E.uniformsList===null){const I=E.currentProgram.getUniforms();E.uniformsList=Qr.seqWithValue(I.seq,E.uniforms)}return E.uniformsList}function Gc(E,I){const k=Vt.get(E);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function Zf(E,I,k,V,B){I.isScene!==!0&&(I=Lt),A.resetTextureUnits();const _t=I.fog,Tt=V.isMeshStandardMaterial?I.environment:null,It=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:si,Ot=(V.isMeshStandardMaterial?O:S).get(V.envMap||Tt),Yt=V.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Gt=!!k.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Xt=!!k.morphAttributes.position,Se=!!k.morphAttributes.normal,on=!!k.morphAttributes.color;let Le=_i;V.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Le=x.toneMapping);const Wn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ge=Wn!==void 0?Wn.length:0,Kt=Vt.get(V),Oo=m.state.lights;if(Z===!0&&(mt===!0||E!==y)){const mn=E===y&&V.id===N;Wt.setState(V,E,mn)}let Me=!1;V.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==Oo.state.version||Kt.outputColorSpace!==It||B.isBatchedMesh&&Kt.batching===!1||!B.isBatchedMesh&&Kt.batching===!0||B.isInstancedMesh&&Kt.instancing===!1||!B.isInstancedMesh&&Kt.instancing===!0||B.isSkinnedMesh&&Kt.skinning===!1||!B.isSkinnedMesh&&Kt.skinning===!0||B.isInstancedMesh&&Kt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Kt.instancingColor===!1&&B.instanceColor!==null||Kt.envMap!==Ot||V.fog===!0&&Kt.fog!==_t||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==Wt.numPlanes||Kt.numIntersection!==Wt.numIntersection)||Kt.vertexAlphas!==Yt||Kt.vertexTangents!==Gt||Kt.morphTargets!==Xt||Kt.morphNormals!==Se||Kt.morphColors!==on||Kt.toneMapping!==Le||Ut.isWebGL2===!0&&Kt.morphTargetsCount!==ge)&&(Me=!0):(Me=!0,Kt.__version=V.version);let Si=Kt.currentProgram;Me===!0&&(Si=Er(V,I,B));let Vc=!1,Xs=!1,zo=!1;const He=Si.getUniforms(),bi=Kt.uniforms;if(Mt.useProgram(Si.program)&&(Vc=!0,Xs=!0,zo=!0),V.id!==N&&(N=V.id,Xs=!0),Vc||y!==E){He.setValue(z,"projectionMatrix",E.projectionMatrix),He.setValue(z,"viewMatrix",E.matrixWorldInverse);const mn=He.map.cameraPosition;mn!==void 0&&mn.setValue(z,kt.setFromMatrixPosition(E.matrixWorld)),Ut.logarithmicDepthBuffer&&He.setValue(z,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&He.setValue(z,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Xs=!0,zo=!0)}if(B.isSkinnedMesh){He.setOptional(z,B,"bindMatrix"),He.setOptional(z,B,"bindMatrixInverse");const mn=B.skeleton;mn&&(Ut.floatVertexTextures?(mn.boneTexture===null&&mn.computeBoneTexture(),He.setValue(z,"boneTexture",mn.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}B.isBatchedMesh&&(He.setOptional(z,B,"batchingTexture"),He.setValue(z,"batchingTexture",B._matricesTexture,A));const Fo=k.morphAttributes;if((Fo.position!==void 0||Fo.normal!==void 0||Fo.color!==void 0&&Ut.isWebGL2===!0)&&qt.update(B,k,Si),(Xs||Kt.receiveShadow!==B.receiveShadow)&&(Kt.receiveShadow=B.receiveShadow,He.setValue(z,"receiveShadow",B.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(bi.envMap.value=Ot,bi.flipEnvMap.value=Ot.isCubeTexture&&Ot.isRenderTargetTexture===!1?-1:1),Xs&&(He.setValue(z,"toneMappingExposure",x.toneMappingExposure),Kt.needsLights&&Qf(bi,zo),_t&&V.fog===!0&&dt.refreshFogUniforms(bi,_t),dt.refreshMaterialUniforms(bi,V,Y,W,wt),Qr.upload(z,Hc(Kt),bi,A)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Qr.upload(z,Hc(Kt),bi,A),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&He.setValue(z,"center",B.center),He.setValue(z,"modelViewMatrix",B.modelViewMatrix),He.setValue(z,"normalMatrix",B.normalMatrix),He.setValue(z,"modelMatrix",B.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const mn=V.uniformsGroups;for(let Bo=0,ed=mn.length;Bo<ed;Bo++)if(Ut.isWebGL2){const Wc=mn[Bo];rt.update(Wc,Si),rt.bind(Wc,Si)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Si}function Qf(E,I){E.ambientLightColor.needsUpdate=I,E.lightProbe.needsUpdate=I,E.directionalLights.needsUpdate=I,E.directionalLightShadows.needsUpdate=I,E.pointLights.needsUpdate=I,E.pointLightShadows.needsUpdate=I,E.spotLights.needsUpdate=I,E.spotLightShadows.needsUpdate=I,E.rectAreaLights.needsUpdate=I,E.hemisphereLights.needsUpdate=I}function td(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,I,k){Vt.get(E.texture).__webglTexture=I,Vt.get(E.depthTexture).__webglTexture=k;const V=Vt.get(E);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=k===void 0,V.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(E,I){const k=Vt.get(E);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(E,I=0,k=0){T=E,P=I,w=k;let V=!0,B=null,_t=!1,Tt=!1;if(E){const Ot=Vt.get(E);Ot.__useDefaultFramebuffer!==void 0?(Mt.bindFramebuffer(z.FRAMEBUFFER,null),V=!1):Ot.__webglFramebuffer===void 0?A.setupRenderTarget(E):Ot.__hasExternalTextures&&A.rebindTextures(E,Vt.get(E.texture).__webglTexture,Vt.get(E.depthTexture).__webglTexture);const Yt=E.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(Tt=!0);const Gt=Vt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Gt[I])?B=Gt[I][k]:B=Gt[I],_t=!0):Ut.isWebGL2&&E.samples>0&&A.useMultisampledRTT(E)===!1?B=Vt.get(E).__webglMultisampledFramebuffer:Array.isArray(Gt)?B=Gt[k]:B=Gt,b.copy(E.viewport),H.copy(E.scissor),G=E.scissorTest}else b.copy(K).multiplyScalar(Y).floor(),H.copy(at).multiplyScalar(Y).floor(),G=lt;if(Mt.bindFramebuffer(z.FRAMEBUFFER,B)&&Ut.drawBuffers&&V&&Mt.drawBuffers(E,B),Mt.viewport(b),Mt.scissor(H),Mt.setScissorTest(G),_t){const Ot=Vt.get(E.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+I,Ot.__webglTexture,k)}else if(Tt){const Ot=Vt.get(E.texture),Yt=I||0;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ot.__webglTexture,k||0,Yt)}N=-1},this.readRenderTargetPixels=function(E,I,k,V,B,_t,Tt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=Vt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Tt!==void 0&&(It=It[Tt]),It){Mt.bindFramebuffer(z.FRAMEBUFFER,It);try{const Ot=E.texture,Yt=Ot.format,Gt=Ot.type;if(Yt!==_n&&gt.convert(Yt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Xt=Gt===fr&&(Rt.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&Rt.has("EXT_color_buffer_float"));if(Gt!==vi&&gt.convert(Gt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Gt===mi&&(Ut.isWebGL2||Rt.has("OES_texture_float")||Rt.has("WEBGL_color_buffer_float")))&&!Xt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=E.width-V&&k>=0&&k<=E.height-B&&z.readPixels(I,k,V,B,gt.convert(Yt),gt.convert(Gt),_t)}finally{const Ot=T!==null?Vt.get(T).__webglFramebuffer:null;Mt.bindFramebuffer(z.FRAMEBUFFER,Ot)}}},this.copyFramebufferToTexture=function(E,I,k=0){const V=Math.pow(2,-k),B=Math.floor(I.image.width*V),_t=Math.floor(I.image.height*V);A.setTexture2D(I,0),z.copyTexSubImage2D(z.TEXTURE_2D,k,0,0,E.x,E.y,B,_t),Mt.unbindTexture()},this.copyTextureToTexture=function(E,I,k,V=0){const B=I.image.width,_t=I.image.height,Tt=gt.convert(k.format),It=gt.convert(k.type);A.setTexture2D(k,0),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,k.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,k.unpackAlignment),I.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,V,E.x,E.y,B,_t,Tt,It,I.image.data):I.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,V,E.x,E.y,I.mipmaps[0].width,I.mipmaps[0].height,Tt,I.mipmaps[0].data):z.texSubImage2D(z.TEXTURE_2D,V,E.x,E.y,Tt,It,I.image),V===0&&k.generateMipmaps&&z.generateMipmap(z.TEXTURE_2D),Mt.unbindTexture()},this.copyTextureToTexture3D=function(E,I,k,V,B=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const _t=E.max.x-E.min.x+1,Tt=E.max.y-E.min.y+1,It=E.max.z-E.min.z+1,Ot=gt.convert(V.format),Yt=gt.convert(V.type);let Gt;if(V.isData3DTexture)A.setTexture3D(V,0),Gt=z.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)A.setTexture2DArray(V,0),Gt=z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,V.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,V.unpackAlignment);const Xt=z.getParameter(z.UNPACK_ROW_LENGTH),Se=z.getParameter(z.UNPACK_IMAGE_HEIGHT),on=z.getParameter(z.UNPACK_SKIP_PIXELS),Le=z.getParameter(z.UNPACK_SKIP_ROWS),Wn=z.getParameter(z.UNPACK_SKIP_IMAGES),ge=k.isCompressedTexture?k.mipmaps[B]:k.image;z.pixelStorei(z.UNPACK_ROW_LENGTH,ge.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ge.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,E.min.x),z.pixelStorei(z.UNPACK_SKIP_ROWS,E.min.y),z.pixelStorei(z.UNPACK_SKIP_IMAGES,E.min.z),k.isDataTexture||k.isData3DTexture?z.texSubImage3D(Gt,B,I.x,I.y,I.z,_t,Tt,It,Ot,Yt,ge.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),z.compressedTexSubImage3D(Gt,B,I.x,I.y,I.z,_t,Tt,It,Ot,ge.data)):z.texSubImage3D(Gt,B,I.x,I.y,I.z,_t,Tt,It,Ot,Yt,ge),z.pixelStorei(z.UNPACK_ROW_LENGTH,Xt),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Se),z.pixelStorei(z.UNPACK_SKIP_PIXELS,on),z.pixelStorei(z.UNPACK_SKIP_ROWS,Le),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Wn),B===0&&V.generateMipmaps&&z.generateMipmap(Gt),Mt.unbindTexture()},this.initTexture=function(E){E.isCubeTexture?A.setTextureCube(E,0):E.isData3DTexture?A.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?A.setTexture2DArray(E,0):A.setTexture2D(E,0),Mt.unbindTexture()},this.resetState=function(){P=0,w=0,T=null,Mt.reset(),C.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===ec?"display-p3":"srgb",e.unpackColorSpace=he.workingColorSpace===Mo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Te?Oi:yu}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Oi?Te:si}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class av extends Hu{}av.prototype.isWebGL1Renderer=!0;class rc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new jt(t),this.near=e,this.far=n}clone(){return new rc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class cv extends Ue{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class lv extends Ze{constructor(t=null,e=1,n=1,s,r,o,a,c,h=Be,l=Be,u,f){super(null,o,a,c,h,l,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class uh extends pn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ds=new le,fh=new le,jr=[],dh=new Xi,hv=new le,Js=new Ht,Zs=new zs;class sr extends Ht{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new uh(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,hv)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Xi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ds),dh.copy(t.boundingBox).applyMatrix4(ds),this.boundingBox.union(dh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new zs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ds),Zs.copy(t.boundingSphere).applyMatrix4(ds),this.boundingSphere.union(Zs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Js.geometry=this.geometry,Js.material=this.material,Js.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Zs.copy(this.boundingSphere),Zs.applyMatrix4(n),t.ray.intersectsSphere(Zs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ds),fh.multiplyMatrices(n,ds),Js.matrixWorld=fh,Js.raycast(t,jr);for(let o=0,a=jr.length;o<a;o++){const c=jr[o];c.instanceId=r,c.object=this,e.push(c)}jr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new uh(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class oc extends $i{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new jt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ph=new R,mh=new R,gh=new le,ga=new yo,qr=new zs;class Gu extends Ue{constructor(t=new be,e=new oc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)ph.fromBufferAttribute(e,s-1),mh.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=ph.distanceTo(mh);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qr.copy(n.boundingSphere),qr.applyMatrix4(s),qr.radius+=r,t.ray.intersectsSphere(qr)===!1)return;gh.copy(s).invert(),ga.copy(t.ray).applyMatrix4(gh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=new R,l=new R,u=new R,f=new R,p=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const d=Math.max(0,o.start),v=Math.min(g.count,o.start+o.count);for(let x=d,M=v-1;x<M;x+=p){const P=g.getX(x),w=g.getX(x+1);if(h.fromBufferAttribute(m,P),l.fromBufferAttribute(m,w),ga.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const N=t.ray.origin.distanceTo(f);N<t.near||N>t.far||e.push({distance:N,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const d=Math.max(0,o.start),v=Math.min(m.count,o.start+o.count);for(let x=d,M=v-1;x<M;x+=p){if(h.fromBufferAttribute(m,x),l.fromBufferAttribute(m,x+1),ga.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const w=t.ray.origin.distanceTo(f);w<t.near||w>t.far||e.push({distance:w,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const _h=new R,vh=new R;class uv extends Gu{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)_h.fromBufferAttribute(e,s),vh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+_h.distanceTo(vh);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ac extends Ze{constructor(t,e,n,s,r,o,a,c,h){super(t,e,n,s,r,o,a,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Gn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,h;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),h=n[s]-o,h<0)a=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const l=n[s],f=n[s+1]-l,p=(o-l)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new ut:new R);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new R,s=[],r=[],o=[],a=new R,c=new le;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new R)}r[0]=new R,o[0]=new R;let h=Number.MAX_VALUE;const l=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);l<=h&&(h=l,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),f<=h&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Ie(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Ie(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class cc extends Gn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){const n=e||new ut,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),h=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=h-this.aY;c=f*l-p*u+this.aX,h=f*u+p*l+this.aY}return n.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class fv extends cc{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function lc(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,h){s(o,a,h*(a-r),h*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,h,l,u){let f=(o-r)/h-(a-r)/(h+l)+(a-o)/l,p=(a-o)/l-(c-o)/(l+u)+(c-a)/u;f*=l,p*=l,s(o,a,f,p)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Yr=new R,_a=new lc,va=new lc,xa=new lc;class hc extends Gn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new R){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let h,l;this.closed||a>0?h=s[(a-1)%r]:(Yr.subVectors(s[0],s[1]).add(s[0]),h=Yr);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?l=s[(a+2)%r]:(Yr.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=Yr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(h.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(l),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),_a.initNonuniformCatmullRom(h.x,u.x,f.x,l.x,g,_,m),va.initNonuniformCatmullRom(h.y,u.y,f.y,l.y,g,_,m),xa.initNonuniformCatmullRom(h.z,u.z,f.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(_a.initCatmullRom(h.x,u.x,f.x,l.x,this.tension),va.initCatmullRom(h.y,u.y,f.y,l.y,this.tension),xa.initCatmullRom(h.z,u.z,f.z,l.z,this.tension));return n.set(_a.calc(c),va.calc(c),xa.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function xh(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function dv(i,t){const e=1-i;return e*e*t}function pv(i,t){return 2*(1-i)*i*t}function mv(i,t){return i*i*t}function rr(i,t,e,n){return dv(i,t)+pv(i,e)+mv(i,n)}function gv(i,t){const e=1-i;return e*e*e*t}function _v(i,t){const e=1-i;return 3*e*e*i*t}function vv(i,t){return 3*(1-i)*i*i*t}function xv(i,t){return i*i*i*t}function or(i,t,e,n,s){return gv(i,t)+_v(i,e)+vv(i,n)+xv(i,s)}class Vu extends Gn{constructor(t=new ut,e=new ut,n=new ut,s=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(or(t,s.x,r.x,o.x,a.x),or(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Mv extends Gn{constructor(t=new R,e=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new R){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(or(t,s.x,r.x,o.x,a.x),or(t,s.y,r.y,o.y,a.y),or(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Wu extends Gn{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class yv extends Gn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xu extends Gn{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(rr(t,s.x,r.x,o.x),rr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sv extends Gn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(rr(t,s.x,r.x,o.x),rr(t,s.y,r.y,o.y),rr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class $u extends Gn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],h=s[o],l=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(xh(a,c.x,h.x,l.x,u.x),xh(a,c.y,h.y,l.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ut().fromArray(s))}return this}}var Mh=Object.freeze({__proto__:null,ArcCurve:fv,CatmullRomCurve3:hc,CubicBezierCurve:Vu,CubicBezierCurve3:Mv,EllipseCurve:cc,LineCurve:Wu,LineCurve3:yv,QuadraticBezierCurve:Xu,QuadraticBezierCurve3:Sv,SplineCurve:$u});class bv extends Gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Mh[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),h=c===0?0:1-o/c;return a.getPointAt(h,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let h=0;h<c.length;h++){const l=c[h];n&&n.equals(l)||(e.push(l),n=l)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Mh[s.type]().fromJSON(s))}return this}}class Ev extends bv{constructor(t){super(),this.type="Path",this.currentPoint=new ut,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Wu(this.currentPoint.clone(),new ut(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Xu(this.currentPoint.clone(),new ut(t,e),new ut(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Vu(this.currentPoint.clone(),new ut(t,e),new ut(n,s),new ut(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new $u(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(t+h,e+l,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const h=new cc(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class uc extends be{constructor(t=[new ut(0,-.5),new ut(.5,0),new ut(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Ie(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],h=[],l=1/e,u=new R,f=new ut,p=new R,g=new R,_=new R;let m=0,d=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,d=t[v+1].y-t[v].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:m=t[v+1].x-t[v].x,d=t[v+1].y-t[v].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let v=0;v<=e;v++){const x=n+v*l*s,M=Math.sin(x),P=Math.cos(x);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*M,u.y=t[w].y,u.z=t[w].x*P,o.push(u.x,u.y,u.z),f.x=v/e,f.y=w/(t.length-1),a.push(f.x,f.y);const T=c[3*w+0]*M,N=c[3*w+1],y=c[3*w+0]*P;h.push(T,N,y)}}for(let v=0;v<e;v++)for(let x=0;x<t.length-1;x++){const M=x+v*t.length,P=M,w=M+t.length,T=M+t.length+1,N=M+1;r.push(P,w,N),r.push(T,N,w)}this.setIndex(r),this.setAttribute("position",new re(o,3)),this.setAttribute("uv",new re(a,2)),this.setAttribute("normal",new re(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uc(t.points,t.segments,t.phiStart,t.phiLength)}}class fc extends uc{constructor(t=1,e=1,n=4,s=8){const r=new Ev;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new fc(t.radius,t.length,t.capSegments,t.radialSegments)}}class Gi extends be{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],h=new R,l=new ut;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*s;h.x=t*Math.cos(p),h.y=t*Math.sin(p),o.push(h.x,h.y,h.z),a.push(0,0,1),l.x=(o[f]/t+1)/2,l.y=(o[f+1]/t+1)/2,c.push(l.x,l.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(a,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class rn extends be{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const l=[],u=[],f=[],p=[];let g=0;const _=[],m=n/2;let d=0;v(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(l),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(f,3)),this.setAttribute("uv",new re(p,2));function v(){const M=new R,P=new R;let w=0;const T=(e-t)/n;for(let N=0;N<=r;N++){const y=[],b=N/r,H=b*(e-t)+t;for(let G=0;G<=s;G++){const J=G/s,D=J*c+a,F=Math.sin(D),W=Math.cos(D);P.x=H*F,P.y=-b*n+m,P.z=H*W,u.push(P.x,P.y,P.z),M.set(F,T,W).normalize(),f.push(M.x,M.y,M.z),p.push(J,1-b),y.push(g++)}_.push(y)}for(let N=0;N<s;N++)for(let y=0;y<r;y++){const b=_[y][N],H=_[y+1][N],G=_[y+1][N+1],J=_[y][N+1];l.push(b,H,J),l.push(H,G,J),w+=6}h.addGroup(d,w,0),d+=w}function x(M){const P=g,w=new ut,T=new R;let N=0;const y=M===!0?t:e,b=M===!0?1:-1;for(let G=1;G<=s;G++)u.push(0,m*b,0),f.push(0,b,0),p.push(.5,.5),g++;const H=g;for(let G=0;G<=s;G++){const D=G/s*c+a,F=Math.cos(D),W=Math.sin(D);T.x=y*W,T.y=m*b,T.z=y*F,u.push(T.x,T.y,T.z),f.push(0,b,0),w.x=F*.5+.5,w.y=W*.5*b+.5,p.push(w.x,w.y),g++}for(let G=0;G<s;G++){const J=P+G,D=H+G;M===!0?l.push(D,D+1,J):l.push(D+1,D,J),N+=3}h.addGroup(d,N,M===!0?1:2),d+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Bn extends rn{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Bn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vr extends be{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),h(n),l(),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(r.slice(),3)),this.setAttribute("uv",new re(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const x=new R,M=new R,P=new R;for(let w=0;w<e.length;w+=3)p(e[w+0],x),p(e[w+1],M),p(e[w+2],P),c(x,M,P,v)}function c(v,x,M,P){const w=P+1,T=[];for(let N=0;N<=w;N++){T[N]=[];const y=v.clone().lerp(M,N/w),b=x.clone().lerp(M,N/w),H=w-N;for(let G=0;G<=H;G++)G===0&&N===w?T[N][G]=y:T[N][G]=y.clone().lerp(b,G/H)}for(let N=0;N<w;N++)for(let y=0;y<2*(w-N)-1;y++){const b=Math.floor(y/2);y%2===0?(f(T[N][b+1]),f(T[N+1][b]),f(T[N][b])):(f(T[N][b+1]),f(T[N+1][b+1]),f(T[N+1][b]))}}function h(v){const x=new R;for(let M=0;M<r.length;M+=3)x.x=r[M+0],x.y=r[M+1],x.z=r[M+2],x.normalize().multiplyScalar(v),r[M+0]=x.x,r[M+1]=x.y,r[M+2]=x.z}function l(){const v=new R;for(let x=0;x<r.length;x+=3){v.x=r[x+0],v.y=r[x+1],v.z=r[x+2];const M=m(v)/2/Math.PI+.5,P=d(v)/Math.PI+.5;o.push(M,1-P)}g(),u()}function u(){for(let v=0;v<o.length;v+=6){const x=o[v+0],M=o[v+2],P=o[v+4],w=Math.max(x,M,P),T=Math.min(x,M,P);w>.9&&T<.1&&(x<.2&&(o[v+0]+=1),M<.2&&(o[v+2]+=1),P<.2&&(o[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function p(v,x){const M=v*3;x.x=t[M+0],x.y=t[M+1],x.z=t[M+2]}function g(){const v=new R,x=new R,M=new R,P=new R,w=new ut,T=new ut,N=new ut;for(let y=0,b=0;y<r.length;y+=9,b+=6){v.set(r[y+0],r[y+1],r[y+2]),x.set(r[y+3],r[y+4],r[y+5]),M.set(r[y+6],r[y+7],r[y+8]),w.set(o[b+0],o[b+1]),T.set(o[b+2],o[b+3]),N.set(o[b+4],o[b+5]),P.copy(v).add(x).add(M).divideScalar(3);const H=m(P);_(w,b+0,v,H),_(T,b+2,x,H),_(N,b+4,M,H)}}function _(v,x,M,P){P<0&&v.x===1&&(o[x]=v.x-1),M.x===0&&M.z===0&&(o[x]=P/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function d(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vr(t.vertices,t.indices,t.radius,t.details)}}class ho extends vr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ho(t.radius,t.detail)}}class kn extends vr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new kn(t.radius,t.detail)}}class bo extends vr{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new bo(t.radius,t.detail)}}class ji extends be{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],h=[],l=[];let u=t;const f=(e-t)/s,p=new R,g=new ut;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const d=r+m/n*o;p.x=u*Math.cos(d),p.y=u*Math.sin(d),c.push(p.x,p.y,p.z),h.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,l.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){const m=_*(n+1);for(let d=0;d<n;d++){const v=d+m,x=v,M=v+n+1,P=v+n+2,w=v+1;a.push(x,M,w),a.push(M,P,w)}}this.setIndex(a),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ji(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class fn extends be{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let h=0;const l=[],u=new R,f=new R,p=[],g=[],_=[],m=[];for(let d=0;d<=n;d++){const v=[],x=d/n;let M=0;d===0&&o===0?M=.5/e:d===n&&c===Math.PI&&(M=-.5/e);for(let P=0;P<=e;P++){const w=P/e;u.x=-t*Math.cos(s+w*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(s+w*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(w+M,1-x),v.push(h++)}l.push(v)}for(let d=0;d<n;d++)for(let v=0;v<e;v++){const x=l[d][v+1],M=l[d][v],P=l[d+1][v],w=l[d+1][v+1];(d!==0||o>0)&&p.push(x,M,w),(d!==n-1||c<Math.PI)&&p.push(M,P,w)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(_,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class En extends be{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],h=[],l=new R,u=new R,f=new R;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const _=g/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),l.x=t*Math.cos(_),l.y=t*Math.sin(_),f.subVectors(u,l).normalize(),c.push(f.x,f.y,f.z),h.push(g/s),h.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,v=(s+1)*p+g;o.push(_,m,v),o.push(m,d,v)}this.setIndex(o),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new En(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Cn extends $i{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new jt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tc,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class wv extends $i{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tc,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class dc extends Ue{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new jt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class Tv extends dc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.groundColor=new jt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ma=new le,yh=new R,Sh=new R;class ju{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.map=null,this.mapPass=null,this.matrix=new le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ic,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;yh.setFromMatrixPosition(t.matrixWorld),e.position.copy(yh),Sh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Sh),e.updateMatrixWorld(),Ma.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ma),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ma)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const bh=new le,Qs=new R,ya=new R;class Av extends ju{constructor(){super(new ln(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ut(4,2),this._viewportCount=6,this._viewports=[new pe(2,1,1,1),new pe(0,1,1,1),new pe(3,1,1,1),new pe(1,1,1,1),new pe(3,0,1,1),new pe(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Qs.setFromMatrixPosition(t.matrixWorld),n.position.copy(Qs),ya.copy(n.position),ya.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ya),n.updateMatrixWorld(),s.makeTranslation(-Qs.x,-Qs.y,-Qs.z),bh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bh)}}class Rv extends dc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Av}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Cv extends ju{constructor(){super(new Uu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class qu extends dc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.target=new Ue,this.shadow=new Cv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Pv{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Eh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Eh();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Eh(){return(typeof performance>"u"?Date:performance).now()}class Lv{constructor(t,e,n=0,s=1/0){this.ray=new yo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new nc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Ha(t,this,n,e),n.sort(wh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Ha(t[s],this,n,e);return n.sort(wh),n}}function wh(i,t){return i.distance-t.distance}function Ha(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)Ha(s[r],t,e,!0)}}class Th{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ie(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ja}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ja);const Ah={type:"change"},Sa={type:"start"},Rh={type:"end"},Kr=new yo,Ch=new di,Dv=Math.cos(70*ep.DEG2RAD);class Iv extends Wi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Zn.ROTATE,MIDDLE:Zn.DOLLY,RIGHT:Zn.PAN},this.touches={ONE:Ki.ROTATE,TWO:Ki.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(C){C.addEventListener("keydown",Pt),this._domElementKeyEvents=C},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Pt),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Ah),n.update(),r=s.NONE},this.update=function(){const C=new R,rt=new zn().setFromUnitVectors(t.up,new R(0,1,0)),Et=rt.clone().invert(),vt=new R,et=new zn,L=new R,ot=2*Math.PI;return function(Dt=null){const Ct=n.object.position;C.copy(Ct).sub(n.target),C.applyQuaternion(rt),a.setFromVector3(C),n.autoRotate&&r===s.NONE&&G(b(Dt)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let Qt=n.minAzimuthAngle,te=n.maxAzimuthAngle;isFinite(Qt)&&isFinite(te)&&(Qt<-Math.PI?Qt+=ot:Qt>Math.PI&&(Qt-=ot),te<-Math.PI?te+=ot:te>Math.PI&&(te-=ot),Qt<=te?a.theta=Math.max(Qt,Math.min(te,a.theta)):a.theta=a.theta>(Qt+te)/2?Math.max(Qt,a.theta):Math.min(te,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(l,n.dampingFactor):n.target.add(l),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&w||n.object.isOrthographicCamera?a.radius=K(a.radius):a.radius=K(a.radius*h),C.setFromSpherical(a),C.applyQuaternion(Et),Ct.copy(n.target).add(C),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,l.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),l.set(0,0,0));let xe=!1;if(n.zoomToCursor&&w){let ye=null;if(n.object.isPerspectiveCamera){const ne=C.length();ye=K(ne*h);const Ee=ne-ye;n.object.position.addScaledVector(M,Ee),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const ne=new R(P.x,P.y,0);ne.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),xe=!0;const Ee=new R(P.x,P.y,0);Ee.unproject(n.object),n.object.position.sub(Ee).add(ne),n.object.updateMatrixWorld(),ye=C.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ye!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ye).add(n.object.position):(Kr.origin.copy(n.object.position),Kr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Kr.direction))<Dv?t.lookAt(n.target):(Ch.setFromNormalAndCoplanarPoint(n.object.up,n.target),Kr.intersectPlane(Ch,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),xe=!0);return h=1,w=!1,xe||vt.distanceToSquared(n.object.position)>o||8*(1-et.dot(n.object.quaternion))>o||L.distanceToSquared(n.target)>0?(n.dispatchEvent(Ah),vt.copy(n.object.position),et.copy(n.object.quaternion),L.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",oe),n.domElement.removeEventListener("pointerdown",A),n.domElement.removeEventListener("pointercancel",O),n.domElement.removeEventListener("wheel",st),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",O),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Pt),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new Th,c=new Th;let h=1;const l=new R,u=new ut,f=new ut,p=new ut,g=new ut,_=new ut,m=new ut,d=new ut,v=new ut,x=new ut,M=new R,P=new ut;let w=!1;const T=[],N={};let y=!1;function b(C){return C!==null?2*Math.PI/60*n.autoRotateSpeed*C:2*Math.PI/60/60*n.autoRotateSpeed}function H(C){const rt=Math.abs(C*.01);return Math.pow(.95,n.zoomSpeed*rt)}function G(C){c.theta-=C}function J(C){c.phi-=C}const D=function(){const C=new R;return function(Et,vt){C.setFromMatrixColumn(vt,0),C.multiplyScalar(-Et),l.add(C)}}(),F=function(){const C=new R;return function(Et,vt){n.screenSpacePanning===!0?C.setFromMatrixColumn(vt,1):(C.setFromMatrixColumn(vt,0),C.crossVectors(n.object.up,C)),C.multiplyScalar(Et),l.add(C)}}(),W=function(){const C=new R;return function(Et,vt){const et=n.domElement;if(n.object.isPerspectiveCamera){const L=n.object.position;C.copy(L).sub(n.target);let ot=C.length();ot*=Math.tan(n.object.fov/2*Math.PI/180),D(2*Et*ot/et.clientHeight,n.object.matrix),F(2*vt*ot/et.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(D(Et*(n.object.right-n.object.left)/n.object.zoom/et.clientWidth,n.object.matrix),F(vt*(n.object.top-n.object.bottom)/n.object.zoom/et.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Y(C){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function j(C){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(C,rt){if(!n.zoomToCursor)return;w=!0;const Et=n.domElement.getBoundingClientRect(),vt=C-Et.left,et=rt-Et.top,L=Et.width,ot=Et.height;P.x=vt/L*2-1,P.y=-(et/ot)*2+1,M.set(P.x,P.y,1).unproject(n.object).sub(n.object.position).normalize()}function K(C){return Math.max(n.minDistance,Math.min(n.maxDistance,C))}function at(C){u.set(C.clientX,C.clientY)}function lt(C){q(C.clientX,C.clientX),d.set(C.clientX,C.clientY)}function X(C){g.set(C.clientX,C.clientY)}function Z(C){f.set(C.clientX,C.clientY),p.subVectors(f,u).multiplyScalar(n.rotateSpeed);const rt=n.domElement;G(2*Math.PI*p.x/rt.clientHeight),J(2*Math.PI*p.y/rt.clientHeight),u.copy(f),n.update()}function mt(C){v.set(C.clientX,C.clientY),x.subVectors(v,d),x.y>0?Y(H(x.y)):x.y<0&&j(H(x.y)),d.copy(v),n.update()}function wt(C){_.set(C.clientX,C.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),W(m.x,m.y),g.copy(_),n.update()}function bt(C){q(C.clientX,C.clientY),C.deltaY<0?j(H(C.deltaY)):C.deltaY>0&&Y(H(C.deltaY)),n.update()}function Bt(C){let rt=!1;switch(C.code){case n.keys.UP:C.ctrlKey||C.metaKey||C.shiftKey?J(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,n.keyPanSpeed),rt=!0;break;case n.keys.BOTTOM:C.ctrlKey||C.metaKey||C.shiftKey?J(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,-n.keyPanSpeed),rt=!0;break;case n.keys.LEFT:C.ctrlKey||C.metaKey||C.shiftKey?G(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(n.keyPanSpeed,0),rt=!0;break;case n.keys.RIGHT:C.ctrlKey||C.metaKey||C.shiftKey?G(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(-n.keyPanSpeed,0),rt=!0;break}rt&&(C.preventDefault(),n.update())}function kt(C){if(T.length===1)u.set(C.pageX,C.pageY);else{const rt=gt(C),Et=.5*(C.pageX+rt.x),vt=.5*(C.pageY+rt.y);u.set(Et,vt)}}function Lt(C){if(T.length===1)g.set(C.pageX,C.pageY);else{const rt=gt(C),Et=.5*(C.pageX+rt.x),vt=.5*(C.pageY+rt.y);g.set(Et,vt)}}function Zt(C){const rt=gt(C),Et=C.pageX-rt.x,vt=C.pageY-rt.y,et=Math.sqrt(Et*Et+vt*vt);d.set(0,et)}function z(C){n.enableZoom&&Zt(C),n.enablePan&&Lt(C)}function ze(C){n.enableZoom&&Zt(C),n.enableRotate&&kt(C)}function Rt(C){if(T.length==1)f.set(C.pageX,C.pageY);else{const Et=gt(C),vt=.5*(C.pageX+Et.x),et=.5*(C.pageY+Et.y);f.set(vt,et)}p.subVectors(f,u).multiplyScalar(n.rotateSpeed);const rt=n.domElement;G(2*Math.PI*p.x/rt.clientHeight),J(2*Math.PI*p.y/rt.clientHeight),u.copy(f)}function Ut(C){if(T.length===1)_.set(C.pageX,C.pageY);else{const rt=gt(C),Et=.5*(C.pageX+rt.x),vt=.5*(C.pageY+rt.y);_.set(Et,vt)}m.subVectors(_,g).multiplyScalar(n.panSpeed),W(m.x,m.y),g.copy(_)}function Mt(C){const rt=gt(C),Et=C.pageX-rt.x,vt=C.pageY-rt.y,et=Math.sqrt(Et*Et+vt*vt);v.set(0,et),x.set(0,Math.pow(v.y/d.y,n.zoomSpeed)),Y(x.y),d.copy(v);const L=(C.pageX+rt.x)*.5,ot=(C.pageY+rt.y)*.5;q(L,ot)}function ue(C){n.enableZoom&&Mt(C),n.enablePan&&Ut(C)}function Vt(C){n.enableZoom&&Mt(C),n.enableRotate&&Rt(C)}function A(C){n.enabled!==!1&&(T.length===0&&(n.domElement.setPointerCapture(C.pointerId),n.domElement.addEventListener("pointermove",S),n.domElement.addEventListener("pointerup",O)),qt(C),C.pointerType==="touch"?Wt(C):it(C))}function S(C){n.enabled!==!1&&(C.pointerType==="touch"?Q(C):tt(C))}function O(C){Nt(C),T.length===0&&(n.domElement.releasePointerCapture(C.pointerId),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",O)),n.dispatchEvent(Rh),r=s.NONE}function it(C){let rt;switch(C.button){case 0:rt=n.mouseButtons.LEFT;break;case 1:rt=n.mouseButtons.MIDDLE;break;case 2:rt=n.mouseButtons.RIGHT;break;default:rt=-1}switch(rt){case Zn.DOLLY:if(n.enableZoom===!1)return;lt(C),r=s.DOLLY;break;case Zn.ROTATE:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enablePan===!1)return;X(C),r=s.PAN}else{if(n.enableRotate===!1)return;at(C),r=s.ROTATE}break;case Zn.PAN:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enableRotate===!1)return;at(C),r=s.ROTATE}else{if(n.enablePan===!1)return;X(C),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Sa)}function tt(C){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Z(C);break;case s.DOLLY:if(n.enableZoom===!1)return;mt(C);break;case s.PAN:if(n.enablePan===!1)return;wt(C);break}}function st(C){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(C.preventDefault(),n.dispatchEvent(Sa),bt(St(C)),n.dispatchEvent(Rh))}function St(C){const rt=C.deltaMode,Et={clientX:C.clientX,clientY:C.clientY,deltaY:C.deltaY};switch(rt){case 1:Et.deltaY*=16;break;case 2:Et.deltaY*=100;break}return C.ctrlKey&&!y&&(Et.deltaY*=10),Et}function dt(C){C.key==="Control"&&(y=!0,document.addEventListener("keyup",xt,{passive:!0,capture:!0}))}function xt(C){C.key==="Control"&&(y=!1,document.removeEventListener("keyup",xt,{passive:!0,capture:!0}))}function Pt(C){n.enabled===!1||n.enablePan===!1||Bt(C)}function Wt(C){switch(At(C),T.length){case 1:switch(n.touches.ONE){case Ki.ROTATE:if(n.enableRotate===!1)return;kt(C),r=s.TOUCH_ROTATE;break;case Ki.PAN:if(n.enablePan===!1)return;Lt(C),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Ki.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;z(C),r=s.TOUCH_DOLLY_PAN;break;case Ki.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ze(C),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Sa)}function Q(C){switch(At(C),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Rt(C),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Ut(C),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;ue(C),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Vt(C),n.update();break;default:r=s.NONE}}function oe(C){n.enabled!==!1&&C.preventDefault()}function qt(C){T.push(C.pointerId)}function Nt(C){delete N[C.pointerId];for(let rt=0;rt<T.length;rt++)if(T[rt]==C.pointerId){T.splice(rt,1);return}}function At(C){let rt=N[C.pointerId];rt===void 0&&(rt=new ut,N[C.pointerId]=rt),rt.set(C.pageX,C.pageY)}function gt(C){const rt=C.pointerId===T[0]?T[1]:T[0];return N[rt]}n.domElement.addEventListener("contextmenu",oe),n.domElement.addEventListener("pointerdown",A),n.domElement.addEventListener("pointercancel",O),n.domElement.addEventListener("wheel",st,{passive:!1}),document.addEventListener("keydown",dt,{passive:!0,capture:!0}),this.update()}}function Yu(i){return{a:i>>>0,n:0,h:0,locked:!1}}function ar(i){if(i.locked)throw new Error("a dice draw while the rng is locked (a preview or legality check must never roll)");let t=i.a|0;t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);e=e+Math.imul(e^e>>>7,61|e)^e;const n=((e^e>>>14)>>>0)/4294967296;return i.a=t,i.n++,i.h=Math.imul(i.h,31)+Math.floor(n*4294967296)>>>0,n}const pc=i=>`${i.n}#${i.h.toString(36)}`,dn=Object.freeze({W:40,H:28,deploy:8}),zi=1,Eo=12,uo=3,Uv=5,wo=6,Ku=Object.freeze([{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}].map(Object.freeze)),mc=i=>1+Math.floor(ar(i.rng)*6),$e=(i,t)=>Array.from({length:t},()=>mc(i)),ii=(i,t)=>i.filter(e=>e>=t).length,Nv=(i,t,e)=>i<t?t:i>e?e:i,to=i=>i>6?0:i<=1?1:(7-i)/6;function Vi(i){let t=0;for(let e=1;e<=6;e++)for(let n=1;n<=6;n++)e+n>=i&&t++;return t/36}function xr(i,t,e){let n;return i>=2*t?n=2:i>t?n=3:i===t?n=4:2*i<=t?n=6:n=5,e?Math.min(n,e):n}function Mr(i,t,e){return Math.max(2,i+t-(e?1:0))}const dr=(i,t)=>Nv(i+t,2,6);function Us(i,t,e){const n=i.alive;return e?n*i.t.A:t.blast?Math.min(t.shots,n):n*t.shots}function fo(i,t,e,n,s){const r=n.t,o=to(t),a=to(xr(e.S,r.T,e.poison)),c=1-to(Mr(r.Sv,e.AP,s)),h=i*o*a*c,l=Math.min(e.D,r.W)/r.W,u=Math.min(n.alive,h*l);return{wounds:h,kills:u,value:u*r.pts}}function Ju(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const On=(i,t,e)=>i+(t-i)*e,Qe=(i,t)=>i[Math.floor(t()*i.length)],ie=(i,t,e)=>t+i()*(e-t);function Mn(i){if(i&&typeof i=="object"&&!Object.isFrozen(i)){Object.freeze(i);for(const t of Object.values(i))Mn(t)}return i}const Ph={name:"Twig knives",S:3,AP:0,D:1},Ov={key:"squirrel",name:"Bushtail Clans",short:"Bushtails",icon:"🐿️",look:{team:"#ec8a34",dark:"#7a3d12",alt:"#c75ad6",gore:["#cf6d2a","#f1dcb5"],voice:"squeak",models:"squirrel",anim:"squirrel"},army:["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],units:{nutkin:{name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",ai:"shooter",models:6,base:.3,pts:7,stats:"M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2",ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:Ph,abilities:["Scurry — may shoot after Advancing."]},grenadier:{name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",ai:"shooter",models:5,base:.3,pts:11,stats:"M6 WS4 BS4 S3 T3 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:Ph,abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{name:"Oak Guard",short:"Oak Guard",role:"Elite",ai:"melee",models:5,base:.34,pts:22,stats:"M5 WS3 BS5 S4 T4 W2 A2 Ld8 Sv3 OC1",ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{name:"Glider Wing",short:"Gliders",role:"Fast",ai:"raider",models:4,base:.32,pts:15,fly:!0,stats:"M12 WS3 BS4 S3 T3 W1 A2 Ld7 Sv5 OC1",ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:95,big:!0,stats:"M3 WS6 BS4 S3 T5 W7 A2 Ld7 Sv4 OC0",ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{name:"Elder Chitterwick",short:"Elder",role:"Hero",ai:"hero",models:1,base:.42,pts:80,hero:!0,stats:"M6 WS3 BS3 S4 T4 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${wo}" use his Ld 9.`]}}},zv={key:"serpent",name:"Coil of Ssithra",short:"Serpents",icon:"🐍",look:{team:"#46c27a",dark:"#14532d",alt:"#4aa8e8",gore:["#3f8f4a","#d9cf86"],voice:"hiss",models:"serpent",anim:"serpent"},army:["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"],units:{scaleguard:{name:"Scaleguard",short:"Scaleguard",role:"Troops",ai:"line",models:6,base:.32,pts:10,stats:"M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2",ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{name:"Venom Spitters",short:"Spitters",role:"Troops",ai:"shooter",models:5,base:.32,pts:12,stats:"M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",ai:"melee",models:4,base:.34,pts:24,chargeAfterAdvance:!0,stats:"M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1",ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{name:"Constrictor Brute",short:"Brute",role:"Monster",ai:"melee",models:1,base:.95,pts:125,big:!0,wrecker:!0,stats:"M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4",ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."]},engine:{name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:100,big:!0,stats:"M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0",ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,corrodes:!0,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",ai:"hero",models:1,base:.45,pts:85,hero:!0,stats:"M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${wo}" use her Ld 9.`]}}},Lh=Object.freeze(["M","WS","BS","S","T","W","A","Ld","Sv","OC"]),Dh=Object.freeze(["Troops","Elite","Fast","Hero","Monster","Artillery"]),Ih=Object.freeze(["melee","raider","line","shooter","hero","artillery"]),Zu=Object.freeze(["fly","big","hero","wrecker","burrow","chargeAfterAdvance","noCharge","brawler"]),Fv=new Set(["name","short","role","ai","models","base","pts","stats","ranged","melee","abilities",...Zu,"move","deployRow","eye","chest","swarm","swoop"]),Qu=["range","shots","S","AP","D","blast","scenery","poison","spell"],tf=["assault","heavy","indirect","corrodes","mesmerize"],Bv=new Set(["name","fx",...Qu,...tf]),Uh=["walk","fly","wreck","burrow"],Nh=["front","mid","back"],Oh=/^#[0-9a-f]{6}$/i,zh=/^[a-z][a-z0-9-]*$/;function kv(i){const t={};for(const n of String(i).trim().split(/\s+/)){const s=/^([A-Za-z]+)(\d+)$/.exec(n);if(!s||!Lh.includes(s[1]))throw new Error(`bad stat "${n}" in "${i}"`);if(s[1]in t)throw new Error(`${s[1]} given twice in "${i}"`);t[s[1]]=Number(s[2])}const e=Lh.filter(n=>!(n in t));if(e.length)throw new Error(`"${i}" lacks ${e.join(", ")}`);return t}function Fh(i,t,e){const n=r=>new Error(`${t}: ${r}`);if(!i||typeof i!="object")throw n("must be a weapon object");for(const r of Object.keys(i))if(!Bv.has(r))throw n(`unknown field "${r}"`);if(typeof i.name!="string"||!i.name)throw n("needs a name");if(i.fx!==void 0&&typeof i.fx!="string")throw n("fx is a string");for(const r of Qu)if(i[r]!==void 0&&!(Number.isFinite(i[r])&&i[r]>=0))throw n(`${r} must be a number ≥ 0`);for(const r of tf)if(i[r]!==void 0&&typeof i[r]!="boolean")throw n(`${r} must be true or false`);for(const r of["shots","S","AP","D","scenery","poison","spell"])if(i[r]!==void 0&&!Number.isInteger(i[r]))throw n(`${r} must be a whole number`);const s=["S","AP","D"];if(e){for(const r of s)if(i[r]===void 0)throw n(`a melee weapon needs ${r}`);for(const r of["range","shots","blast","spell","mesmerize","indirect","heavy","assault"])if(i[r]!==void 0)throw n(`a melee weapon has no ${r}`)}else{if(i.range===void 0)throw n("a ranged weapon needs a range");if(!i.mesmerize){for(const r of["shots",...s])if(i[r]===void 0)throw n(`a ranged weapon needs ${r}`)}if(i.mesmerize&&!i.spell)throw n("mesmerize is a spell: give it a cast value")}return{...i}}function Hv(i,t,e){var _,m;const n=`race ${i}, unit ${t}`,s=d=>new Error(`${n}: ${d}`);if(!e||typeof e!="object")throw s("must be an object");for(const d of Object.keys(e))if(!Fv.has(d))throw s(`unknown field "${d}"`);for(const d of["name","short"])if(typeof e[d]!="string"||!e[d])throw s(`needs a ${d}`);if(!Dh.includes(e.role))throw s(`role must be one of ${Dh.join(", ")}`);if(!Ih.includes(e.ai))throw s(`ai must be one of ${Ih.join(", ")}`);if(!Number.isInteger(e.models)||e.models<1)throw s("models must be a whole number ≥ 1");if(!(Number.isFinite(e.base)&&e.base>0))throw s("base must be a radius > 0");if(!Number.isInteger(e.pts)||e.pts<0)throw s("pts must be a whole number ≥ 0");if(!Array.isArray(e.abilities)||e.abilities.some(d=>typeof d!="string"))throw s("abilities is a list of card text");for(const d of Zu)if(e[d]!==void 0&&typeof e[d]!="boolean")throw s(`${d} must be true or false`);if(e.move!==void 0&&!Uh.includes(e.move))throw s(`move must be one of ${Uh.join(", ")}`);if(e.deployRow!==void 0&&!Nh.includes(e.deployRow))throw s(`deployRow must be one of ${Nh.join(", ")}`);for(const d of["eye","chest"])if(e[d]!==void 0&&!(Number.isFinite(e[d])&&e[d]>0))throw s(`${d} must be a height > 0`);if(e.swarm!==void 0&&!Number.isInteger((_=e.swarm)==null?void 0:_.min))throw s("swarm is { min }");if(e.swoop!==void 0&&!Number.isInteger((m=e.swoop)==null?void 0:m.chargeS))throw s("swoop is { chargeS }");let r;try{r=kv(e.stats)}catch(d){throw s(d.message)}const o=e.ranged===null?null:Fh(e.ranged,`${n}, ranged`,!1),a=Fh(e.melee,`${n}, melee`,!0),c=(d,v)=>e[d]===void 0?v:e[d],h=c("fly",!1),l=c("big",!1),u=c("wrecker",!1),f=c("burrow",!1),p=c("hero",e.role==="Hero"),g={key:t,race:i,name:e.name,short:e.short,role:e.role,ai:e.ai,models:e.models,base:e.base,pts:e.pts,...r,ranged:o,melee:a,abilities:[...e.abilities],fly:h,big:l,hero:p,wrecker:u,burrow:f,chargeAfterAdvance:c("chargeAfterAdvance",!1),noCharge:c("noCharge",e.role==="Artillery"),brawler:c("brawler",!o||u),move:e.move??(h?"fly":u?"wreck":f?"burrow":"walk"),deployRow:e.deployRow??(e.role==="Artillery"?"back":p?"mid":"front"),eye:e.eye??(l?1.9:h?1.5:.95),chest:e.chest??(l||h?1:.55)};return e.swarm&&(g.swarm={min:e.swarm.min}),e.swoop&&(g.swoop={chargeS:e.swoop.chargeS}),g}function Gv(i){if(!i||typeof i!="object")throw new Error("defineRace needs a race object");const{key:t}=i;if(typeof t!="string"||!zh.test(t))throw new Error(`race key "${t}" must be lower-case letters, digits and dashes`);const e=r=>new Error(`race ${t}: ${r}`);for(const r of Object.keys(i))if(!["key","name","short","icon","look","army","units"].includes(r))throw e(`unknown field "${r}"`);for(const r of["name","short","icon"])if(typeof i[r]!="string"||!i[r])throw e(`needs a ${r}`);const n=i.look;if(!n||typeof n!="object")throw e("needs a look");for(const r of["team","dark","alt"])if(!Oh.test(n[r]??""))throw e(`look.${r} must be a #rrggbb colour`);if(!Array.isArray(n.gore)||n.gore.length!==2||!n.gore.every(r=>Oh.test(r)))throw e("look.gore is two #rrggbb colours");for(const r of["voice","models","anim"])if(typeof n[r]!="string"||!n[r])throw e(`look.${r} must be named`);if(!i.units||typeof i.units!="object"||!Object.keys(i.units).length)throw e("needs units");const s=Object.create(null);for(const[r,o]of Object.entries(i.units)){if(!zh.test(r))throw e(`unit key "${r}" must be lower-case letters, digits and dashes`);s[r]=Hv(t,r,o)}if(!Array.isArray(i.army)||!i.army.length)throw e("needs an army list");for(const r of i.army)if(!s[r])throw e(`army lists "${r}", which is not one of its units`);return Mn({key:t,name:i.name,short:i.short,icon:i.icon,look:{...n,gore:[...n.gore]},army:[...i.army],units:s})}function Vv(i){const t=i.map(s=>Gv(s)),e=t.map(s=>s.key),n=e.find((s,r)=>e.indexOf(s)!==r);if(n!==void 0)throw new Error(`two races use the key "${n}"`);return Mn(Object.assign(Object.create(null),Object.fromEntries(t.map(s=>[s.key,s]))))}const ri=Vv([Ov,zv]),po=Object.freeze(["squirrel","serpent"]),Ga=Object.values(ri).flatMap(i=>Object.values(i.units));if(new Set(Ga.map(i=>i.key)).size!==Ga.length)throw new Error("two races share a unit key: look their types up by race");Object.freeze(Object.assign(Object.create(null),Object.fromEntries(Ga.map(i=>[i.key,i]))));Object.freeze(po.map(i=>ri[i].army));const ef=i=>i.length===2&&i[0].race===i[1].race;function gc(i){const t=ef(i);return Object.freeze(i.map(({seat:e,race:n})=>{const s=ri[n];return Object.freeze({name:s.name,short:s.short,icon:s.icon,color:t&&e===1?s.look.alt:s.look.team,dark:s.look.dark})}))}gc(po.map((i,t)=>({seat:t,race:i})));function Ft(i,t){const e=Math.abs(i),n=Math.abs(t);if(e===1/0||n===1/0)return 1/0;const s=Math.max(e,n);return s!==s?NaN:s===0?0:Math.sqrt(e/s*(e/s)+n/s*(n/s))*s}function Wv(i,t,e){const n=Math.abs(i),s=Math.abs(t),r=Math.abs(e);if(n===1/0||s===1/0||r===1/0)return 1/0;const o=Math.max(Math.max(n,s),r);if(o!==o)return NaN;if(o===0)return 0;const a=n/o*(n/o),c=s/o*(s/o),h=a+c-a-c,l=r/o*(r/o)-h;return Math.sqrt(a+c+l)*o}const Bh=Math.SQRT2,nf=(i,t,e)=>({nx:Math.round(i/e),nz:Math.round(t/e)});class Xv{constructor(t,e,n=.5){this.W=t,this.H=e,this.cell=n;const{nx:s,nz:r}=nf(t,e,n);this.nx=s,this.nz=r;const o=this.N=this.nx*this.nz;this.hard=new Uint8Array(o),this.soft=new Uint8Array(o),this.diff=new Uint8Array(o),this.cover=new Uint8Array(o),this.clearAll=new Float32Array(o),this.clearHard=new Float32Array(o),this.tmp=new Float32Array(o)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const n=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const n=e.nav||e.shape;e.navKind==="hard"?this.raster(n,.1,this.hard):e.navKind==="soft"?this.raster(n,.1,this.soft):e.navKind==="diff"&&this.raster(n,.15,this.diff),e.cover&&this.raster(e.coverShape||n,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,n){const s=Ft(t.hx,t.hz)+e,r=Math.cos(t.yaw),o=Math.sin(t.yaw),a=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),c=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),h=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),l=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=h;u<=l;u++)for(let f=a;f<=c;f++){const p=u*this.nx+f,g=this.x(p)-t.x,_=this.z(p)-t.z,m=g*r-_*o,d=g*o+_*r;Math.abs(m)<=t.hx+e&&Math.abs(d)<=t.hz+e&&(n[p]=1)}}field(t,e,n){const{nx:s,nz:r,cell:o}=this,a=1e6,c=o,h=o*Bh;for(let l=0;l<this.N;l++)n[l]=t[l]||e&&e[l]?0:a;for(let l=0;l<r;l++)for(let u=0;u<s;u++){const f=l*s+u;let p=n[f];u>0&&(p=Math.min(p,n[f-1]+c)),l>0&&(p=Math.min(p,n[f-s]+c),u>0&&(p=Math.min(p,n[f-s-1]+h)),u<s-1&&(p=Math.min(p,n[f-s+1]+h))),n[f]=p}for(let l=r-1;l>=0;l--)for(let u=s-1;u>=0;u--){const f=l*s+u;let p=n[f];u<s-1&&(p=Math.min(p,n[f+1]+c)),l<r-1&&(p=Math.min(p,n[f+s]+c),u<s-1&&(p=Math.min(p,n[f+s+1]+h)),u>0&&(p=Math.min(p,n[f+s-1]+h))),n[f]=p}for(let l=0;l<this.N;l++){const u=this.x(l),f=this.z(l),p=Math.min(u+this.W/2,this.W/2-u,f+this.H/2,this.H/2-f);n[l]=Math.min(n[l]>0?n[l]-o*.5:0,p)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,n,s){return t<0||s&&s[t]?!1:this.clearance(t,n==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:n,max:s,mode:r="walk",forbid:o=null}){const a=this.N,c=new Float64Array(a).fill(1/0),h=new Int32Array(a).fill(-1),l=this.index(t,e),u={dist:c,prev:h,start:l,mode:r,sx:t,sz:e};if(l<0)return u;if(r==="fly"){for(let v=0;v<a;v++){const x=Ft(this.x(v)-t,this.z(v)-e);x<=s&&(c[v]=x)}return u}const f=Ft(t-this.x(l),e-this.z(l));c[l]=f;const p=new jv;p.push(l,f);const{nx:g,nz:_,cell:m}=this,d=this.clearance(l,r==="wreck"?"wreck":"all")<n-.06?n*1.5:0;for(;p.size;){const[v,x]=p.pop();if(x>c[v])continue;const M=v%g,P=v/g|0;for(let w=-1;w<=1;w++)for(let T=-1;T<=1;T++){if(!T&&!w)continue;const N=M+T,y=P+w;if(N<0||y<0||N>=g||y>=_)continue;const b=y*g+N;if(o&&o[b])continue;const H=this.clearance(b,r==="wreck"?"wreck":"all");if(H<n-.06&&!(d&&H>.05&&Ft(this.x(b)-t,this.z(b)-e)<d))continue;let G=this.diff[b]?2:1;r==="wreck"&&this.clearAll[b]<n-.06&&(G=2);const J=x+(T&&w?Bh:1)*m*G;J<=s&&J<c[b]&&(c[b]=J,h[b]=v,p.push(b,J))}}return u}path(t,e,n,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let h=e;h!==-1&&(r.push(h),h!==t.start);h=t.prev[h]);r.reverse();const o=r.map(h=>({x:this.x(h),z:this.z(h)}));if(o[0]={x:t.sx,z:t.sz},o.length<3)return o;const a=[o[0]];let c=0;for(;c<o.length-1;){let h=c+1;for(let l=o.length-1;l>c+1;l--)if(this.walkable(o[c],o[l],n,t.mode,s)){h=l;break}a.push(o[h]),c=h}return a}walkable(t,e,n,s,r){const o=Ft(e.x-t.x,e.z-t.z),a=Math.ceil(o/(this.cell*.5)),c=this.diff[this.index(t.x,t.z)];for(let h=1;h<a;h++){const l=h/a,u=this.index(t.x+(e.x-t.x)*l,t.z+(e.z-t.z)*l);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<n-.06||this.diff[u]!==c||s==="wreck"&&this.clearAll[u]<n-.06)return!1}if(r!=null&&r.discs){for(const h of r.discs)if($v(t,e,h)<h.R)return!1}return!0}}function $v(i,t,e){const n=t.x-i.x,s=t.z-i.z,r=n*n+s*s;let o=r>0?((e.x-i.x)*n+(e.z-i.z)*s)/r:0;return o=o<0?0:o>1?1:o,Ft(i.x+n*o-e.x,i.z+s*o-e.z)}const sf=i=>{let t=0;for(let e=1;e<i.length;e++)t+=Ft(i[e].x-i[e-1].x,i[e].z-i[e-1].z);return t};class jv{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:n,keys:s}=this;let r=n.length;for(n.push(t),s.push(e);r>0;){const o=r-1>>1;if(s[o]<=e)break;n[r]=n[o],s[r]=s[o],r=o}n[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,n=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let o=0;const a=t.length;for(;;){let c=2*o+1;if(c>=a||(c+1<a&&e[c+1]<e[c]&&c++,e[c]>=r))break;t[o]=t[c],e[o]=e[c],o=c}t[o]=s,e[o]=r}return n}}const rf=Mn({stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}}),qv=Mn({oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]}),Yv=Mn(["#7a5232","#5f3e24","#9a7048","#b08a5a"]),Kv=Object.freeze(["#6b4a2e","#5a3d24","#7a5638"]),Jv=Object.freeze(["#3f7a34","#4a8a3a","#386c2e"]),Zv=Object.freeze(["#4f8f3e","#5c9a46","#3f7a34"]),Qv=Object.freeze(["#3f7a34","#5c9a46","#2f5f28"]),tx=Object.freeze(["#7d7a74","#8c8880","#6e6b66","#96918a"]),ex=Object.freeze(["#9a7048","#8a6038","#a77d50"]),nx=Object.freeze(["#8a5a34","#7a4c2a"]),ix=Object.freeze(["#c0392b","#d35a1f","#8e44ad","#b03050"]),kh=22;function cr(i,t,e,n){const s=Ju(n),r=Math.cos(e.yaw),o=Math.sin(e.yaw),a={p:(c,h)=>({x:e.x+r*c+o*h,z:e.z-o*c+r*h}),yaw:(c=0)=>e.yaw+c};eo[t](i,a,s)}function pr(i,t,e,n,s,r,o,a,{holes:c=[],cap:h=!1,bw:l,bt:u}={}){const f=rf[a],p=l??f.bw,g=u??f.bt,_=t.p(n,s),m=t.yaw(r),d={blocks:[],x:_.x,z:_.z,yaw:m,style:a,by:f.by,rubble:null,w:p,t:g};for(let v=0;v<o;v++){if(c.includes(v))continue;const x=Qe(f.colors,e),M=m+(e()-.5)*.06,P=f.look==="log"?[p*1.02,f.by,g]:[p*(.95+e()*.04),f.by*.96,g*(.9+e()*.1)],w=i.add({kind:"block",hp:f.hp,shape:{x:_.x,y:f.by*(v+.5),z:_.z,hx:p/2,hy:f.by/2,hz:g/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:d,level:v,look:{piece:f.look,color:x,chip:x,scale:P,yaw:M}});d.blocks.push(w)}if(h&&o>0){const v=Qe(f.colors,e),x=f.by*o+p*.55,M=i.add({kind:"block",hp:f.hp,shape:{x:_.x,y:x,z:_.z,hx:p/2,hy:p*.55,hz:p/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:d,level:o,look:{piece:"cap",color:v,chip:v,r:p*.72,h:p*1.1,yaw:m}});d.blocks.push(M)}return d}function sx(i,t,e,n,s,r){const o=t.p(n,s),a=ie(e,1.5,2.4),c=ie(e,.17,.26),h=Qe(Kv,e),l=qv[r],u=[];let f;if(r==="pine"){for(let g=0;g<3;g++){const _=1.05-g*.26,m=1.3-g*.15;u.push({cone:!0,r:_,h:m,color:Qe(l,e),y:a*.45+g*.75+m/2,yaw:e()*3})}f=a*.45+2.5}else{const g=3+Math.floor(e()*3);for(let _=0;_<g;_++){const m=ie(e,.55,.9);u.push({r:m,color:Qe(l,e),pos:[ie(e,-.5,.5),a+ie(e,-.1,.6),ie(e,-.5,.5)]})}f=a+1.2}const p=e()*6;return i.add({kind:"tree",hp:3,shape:{x:o.x,y:f/2,z:o.z,hx:.7,hy:f/2,hz:.7,yaw:0},nav:{x:o.x,z:o.z,hx:c+.12,hz:c+.12,yaw:0},coverShape:{x:o.x,z:o.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0,trunkH:a,trunkR:c,look:{piece:"tree",trunk:{h:a,r:c},bark:h,canopy:u,yaw:p,leaves:l}})}function rx(i,t,e,n,s,r){const o=t.p(n,s),a=t.yaw(r),c=Qe(Jv,e),h=[];for(let u=0;u<3;u++)h.push({color:Qe(Zv,e),pos:[-.4+u*.4,.62+e()*.08,ie(e,-.08,.08)]});const l=[];if(e()<.4)for(let u=0;u<4;u++)l.push([ie(e,-.5,.5),ie(e,.35,.75),.29]);return i.add({kind:"hedge",hp:1,shape:{x:o.x,y:.42,z:o.z,hx:.6,hy:.42,hz:.3,yaw:a},navKind:"diff",los:"obscure",cover:!0,look:{piece:"hedge",color:c,tufts:h,berries:l,yaw:a,leaves:Qv}})}function Va(i,t,e,n,s,r){const o=t.p(n,s),a=ie(e,.65,1.25),c=Qe(tx,e),h=[1,a,ie(e,.75,1.1)],l=[e()*.6,e()*6,e()*.6],u=r*a,f=e()<.6,p=u*1.5;return i.add({kind:"rock",hp:1/0,shape:{x:o.x,y:p/2,z:o.z,hx:r*.85,hy:p/2,hz:r*.85,yaw:0},navKind:"hard",los:p>1.2?"block":"obscure",cover:!0,look:{piece:"boulder",size:r,color:c,scale:h,rot:l,y:u*.55,moss:f}})}function _c(i,t,e,n,s){const r=t.p(n,s),o=t.yaw(e()*6),a=e();let c,h;if(a<.45){const l=ie(e,.55,.75),u=Qe(ex,e),f=e()<.4;c={piece:"crate",s:l,color:u,stacked:f},h=f?l*1.7:l}else if(a<.8)c={piece:"barrel",color:Qe(nx,e)},h=.75;else{const l=[];for(let u=0;u<4;u++)l.push([ie(e,-.12,.12),ie(e,-.12,.12)]);c={piece:"sack",acorns:l},h=.78}return i.add({kind:"crate",hp:1,shape:{x:r.x,y:h/2,z:r.z,hx:.36,hy:h/2,hz:.36,yaw:o},navKind:"diff",los:"obscure",cover:!0,look:{...c,yaw:o,chip:"#9a7048"}})}function ox(i,t,e,n,s){const r=t.p(n,s),o=ie(e,.9,1.9),a=ie(e,.5,.95),c=ie(e,.12,.2),h=Qe(ix,e),l=[];for(let p=0;p<6;p++){const g=e()*6,_=ie(e,.25,1.1);l.push([g,_])}const u=ie(e,-.12,.12),f=o+a*.7;return i.add({kind:"mushroom",hp:2,shape:{x:r.x,y:f/2,z:r.z,hx:a*.6,hy:f/2,hz:a*.6,yaw:0},nav:{x:r.x,z:r.z,hx:c+.12,hz:c+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0,look:{piece:"mushroom",h:o,r:a,sr:c,cap:h,dots:l,tilt:u,leaves:[h,"#fff6e0","#efe6d0"]}})}function ax(i,t,e,n,s){const r=t.p(0,0),o=[];for(let a=1;a<kh+2;a++)o.push(.78+e()*.3);return i.add({kind:"floor",hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:n*.75,hy:.01,hz:n*.75,yaw:0},navKind:"diff",cover:!0,look:{piece:"floor",r:n,segments:kh,color:s,rim:o}})}function cx(i,t,e){const n=Qe(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),o=-s/2+.5,a=-r/2+.5,c=1+Math.floor(e()*(s-2));for(let l=0;l<s;l++){if(l===c)continue;let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)-(e()<.3?1:0)));const f=u===3&&e()<.35?[1]:[];pr(i,t,e,o+l,a,0,u,n,{holes:f})}for(let l=1;l<=r;l++){let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)));if(e()<.15)continue;const f=u===3&&e()<.35?[1]:[];pr(i,t,e,o,a+.3+.5+(l-1),Math.PI/2,u,n,{holes:f})}const h=Math.floor(e()*3);for(let l=0;l<h;l++)_c(i,t,e,o+ie(e,1.5,s-1),a+ie(e,1.6,r-.5))}function lx(i,t,e){const n=Qe(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let o=0;o<s;o++){if(o===r&&s>5)continue;const a=1+Math.floor(e()*3);pr(i,t,e,o-(s-1)/2,0,0,a,n,{holes:a===3&&e()<.4?[1]:[]})}e()<.6&&_c(i,t,e,ie(e,-2,2),ie(e,.9,1.4))}function hx(i,t,e){const n=Qe(["stone","sand"],e),s=18,r=3.4,o=[];for(let h=0;h<s/2;h++)o.push(1+Math.floor(e()*3));const a=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),c=o.map(h=>h===3&&e()<.4);for(let h=0;h<s;h++){const l=h%(s/2);if(a.has(l))continue;const u=h/s*Math.PI*2,f=Math.atan2(-Math.cos(u),-Math.sin(u));pr(i,t,e,Math.cos(u)*r,Math.sin(u)*r,f,o[l],n,{holes:c[l]?[1]:[],bw:1.12})}}function ux(i,t,e){const n=e()<.3?"pine":e()<.4?"autumn":"oak";ax(i,t,e,3,n==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let o=0;o<60&&s.length<r;o++){const a=e()*Math.PI*2,c=Math.sqrt(e())*2.2,h=Math.cos(a)*c,l=Math.sin(a)*c;s.some(u=>Ft(u.x-h,u.z-l)<1.55)||s.push({x:h,z:l})}for(const o of s)sx(i,t,e,o.x,o.z,n)}function fx(i,t,e){const n=5+Math.floor(e()*3),s=ie(e,-.12,.12),r=1+Math.floor(e()*(n-2));for(let o=0;o<n;o++){if(o===r&&e()<.7)continue;const a=(o-(n-1)/2)*1.12,c=s*a*a;rx(i,t,e,a,c,-Math.atan(2*s*a))}}function dx(i,t,e){const n=2+Math.floor(e()*3);Va(i,t,e,0,0,ie(e,.8,1.15));for(let s=1;s<n;s++){const r=e()*6;Va(i,t,e,Math.cos(r)*ie(e,.9,1.4),Math.sin(r)*ie(e,.9,1.4),ie(e,.35,.7))}}function px(i,t,e){const n=3+Math.floor(e()*3);for(let s=0;s<n;s++)_c(i,t,e,(s-(n-1)/2)*.8+ie(e,-.1,.1),ie(e,-.3,.3))}function mx(i,t,e){const n=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<n;r++){const o=e()*6,a=Math.sqrt(e())*1.5,c=Math.cos(o)*a,h=Math.sin(o)*a;s.some(l=>Ft(l.x-c,l.z-h)<.9)||(s.push({x:c,z:h}),ox(i,t,e,c,h))}}function gx(i,t,e){pr(i,t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&Va(i,t,e,1,.4,.4)}const eo=Mn(Object.assign(Object.create(null),{ruin:cx,wall:lx,tower:hx,forest:ux,hedgerow:fx,rocks:dx,barricade:px,mushrooms:mx,obelisk:gx})),Wa=Mn(Object.assign(Object.create(null),{tower(i,t,e){cr(i,"tower",{x:0,z:0,yaw:t()*Math.PI},t()*1e9|0),e.push({x:0,z:0,r:4.6,hollow:!0})},rockbox(i,t,e){const n=t()*Math.PI;for(const s of[0,1]){const r=n+s*(Math.PI/2),o=Math.cos(r)*4.2,a=Math.sin(r)*4.2,c=t()*1e9|0;cr(i,"rocks",{x:o,z:a,yaw:r},c),cr(i,"rocks",{x:-o,z:-a,yaw:r+Math.PI},c),e.push({x:o,z:a,r:1.8},{x:-o,z:-a,r:1.8})}}}));function _x(i,t,e,n,s){const r=Ju(e),{W:o,H:a}=i,c=[],h=r(),l=t.centre.find(([,_])=>h<_);l&&Wa[l[0]](i,r,c);const u=t.kinds,f=u.reduce((_,m)=>_+m[2],0),p=t.pairs[0]+Math.floor(r()*t.pairs[1]);let g=0;for(let _=0;_<t.attempts&&g<p;_++){let m=r()*f,d=u[0];for(const b of u)if((m-=b[2])<=0){d=b;break}const[v,x]=d,M=ie(r,-o/2+x+t.margin,o/2-x-t.margin),P=ie(r,-a/2+x+t.margin,a/2-x-t.margin);if(Ft(M,P)<x+t.selfGap||Math.abs(M)>o/2-s-t.deployMargin&&(x>t.bigNotInDeploy||t.notInDeploy.includes(v))||n.some(b=>Ft(b.x-M,b.z-P)<x+t.objectiveGap))continue;const T=t.gap;if(c.some(b=>Ft(b.x-M,b.z-P)<b.r+x+T||Ft(b.x+M,b.z+P)<b.r+x+T))continue;const N=r()*Math.PI*2,y=r()*1e9|0;cr(i,v,{x:M,z:P,yaw:N},y),cr(i,v,{x:-M,z:-P,yaw:N+Math.PI},y),c.push({x:M,z:P,r:x},{x:-M,z:-P,r:x}),g++}return c}const Hh=Object.freeze(["centre","kinds","pairs","attempts","mirror","margin","selfGap","deployMargin","bigNotInDeploy","notInDeploy","objectiveGap","gap"]),Gh=Object.freeze(["point"]);function vx(i,t){const e=r=>{throw new Error(`terrain set "${i}": ${r}`)},n=r=>typeof r=="number"&&Number.isFinite(r),s=r=>Number.isInteger(r)&&r>=0;(!t||typeof t!="object")&&e("is not a table");for(const r of Object.keys(t))Hh.includes(r)||e(`unknown field "${r}"`);for(const r of Hh)r in t||e(`no "${r}"`);(!Array.isArray(t.kinds)||!t.kinds.length)&&e("kinds must list at least one feature"),t.kinds.forEach((r,o)=>{(!Array.isArray(r)||r.length!==3)&&e(`kinds[${o}] must be [feature, radius, weight]`),r[0]in eo||e(`kinds[${o}]: no feature "${r[0]}" (there are ${Object.keys(eo).join(", ")})`),(!n(r[1])||r[1]<=0)&&e(`kinds[${o}] (${r[0]}): radius ${r[1]} must be a number above 0`),(!n(r[2])||r[2]<=0)&&e(`kinds[${o}] (${r[0]}): weight ${r[2]} must be a number above 0`)}),Array.isArray(t.centre)||e("centre must be a list of [piece, threshold]"),t.centre.forEach((r,o)=>{(!Array.isArray(r)||r.length!==2)&&e(`centre[${o}] must be [piece, threshold]`),r[0]in Wa||e(`centre[${o}]: no centre piece "${r[0]}" (there are ${Object.keys(Wa).join(", ")})`),(!n(r[1])||r[1]<=0||r[1]>1)&&e(`centre[${o}] (${r[0]}): threshold ${r[1]} must be in (0, 1]`),o&&r[1]<=t.centre[o-1][1]&&e(`centre[${o}] (${r[0]}): thresholds must rise (the first one above the draw wins)`)}),(!Array.isArray(t.pairs)||t.pairs.length!==2||!t.pairs.every(s))&&e("pairs must be two whole numbers, 0 or more"),s(t.attempts)||e(`attempts ${t.attempts} must be a whole number, 0 or more`),Gh.includes(t.mirror)||e(`mirror "${t.mirror}" is not one scatter knows (${Gh.join(", ")})`);for(const r of["margin","selfGap","deployMargin","bigNotInDeploy","objectiveGap","gap"])n(t[r])||e(`${r} ${t[r]} must be a finite number`);Array.isArray(t.notInDeploy)||e("notInDeploy must be a list of features");for(const r of t.notInDeploy)r in eo||e(`notInDeploy: no feature "${r}"`);return t}const lr=Mn(Object.assign(Object.create(null),{classic:{centre:[["tower",.55],["rockbox",.8]],kinds:[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],pairs:[6,3],attempts:1200,mirror:"point",margin:.5,selfGap:1.4,deployMargin:1,bigNotInDeploy:2.1,notInDeploy:["forest"],objectiveGap:2.2,gap:2.1}}));for(const i of Object.keys(lr))vx(i,lr[i]);function xx(i,t,e,n,s){const r=Math.cos(s.yaw),o=Math.sin(s.yaw),a=i.x-s.x,c=i.y-s.y,h=i.z-s.z,l=[a*r-h*o,c,a*o+h*r],u=[t*r-n*o,e,t*o+n*r],f=[s.hx,s.hy,s.hz];let p=0,g=1;for(let _=0;_<3;_++)if(Math.abs(u[_])<1e-9){if(Math.abs(l[_])>f[_])return!1}else{let m=(-f[_]-l[_])/u[_],d=(f[_]-l[_])/u[_];if(m>d&&([m,d]=[d,m]),m>p&&(p=m),d<g&&(g=d),p>g)return!1}return!0}function Mx(i,t,e,n){const s=Math.cos(n.yaw),r=Math.sin(n.yaw),o=i-n.x,a=t-n.y,c=e-n.z,h=o*s-c*r,l=o*r+c*s,u=Math.max(0,Math.abs(h)-n.hx),f=Math.max(0,Math.abs(a)-n.hy),p=Math.max(0,Math.abs(l)-n.hz);return Wv(u,f,p)}function ps(i,t,e){i&&i.push({t,...e})}const Vh=i=>({x:i.shape.x,y:i.shape.y,z:i.shape.z});class yx{constructor(t,e){this.W=t,this.H=e,this.chunks=[],this.features=[],this.dirty=!0,this.nextId=1}clear(t=null){this.chunks=[],this.features=[],this.nextId=1,this.dirty=!0,ps(t,"terrain.clear",{})}add(t,e=null){const n={id:this.nextId++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},s=n.shape;return s.reach=Ft(s.hx,s.hz)+.05,this.chunks.push(n),ps(e,"terrain.add",{c:n}),n}generate(t,e,n,s="classic",r=null){if(!(s in lr))throw new Error(`no terrain set "${s}" (there are ${Object.keys(lr).join(", ")})`);this.clear(r);const o={W:this.W,H:this.H,add:a=>this.add(a,r)};this.features=_x(o,lr[s],t,e,n),this.dirty=!0}los(t,e,n=1.3){let s=0;const r=e.x-t.x,o=e.y-t.y,a=e.z-t.z,c=r*r+a*a;for(const h of this.chunks){if(!h.alive||!h.los)continue;const l=h.shape;let u=c>0?((l.x-t.x)*r+(l.z-t.z)*a)/c:0;u=u<0?0:u>1?1:u;const f=t.x+r*u-l.x,p=t.z+a*u-l.z;if(!(f*f+p*p>l.reach*l.reach)&&xx(t,r,o,a,l)){if(h.los==="block")return{blocked:!0,obscure:s};Ft(l.x-t.x,l.z-t.z)<n+l.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,n,s,{acid:r=!1}={},o=null){const a=[];for(const c of[...this.chunks]){if(!c.alive||!c.destructible)continue;const h=Mx(t,.5,e,c.shape);if(h>n)continue;let l=h<n*.6?s:Math.ceil(s/2);r&&c.kind==="block"&&(l+=1),this.hurt(c,l,{x:t,z:e},o,a)}return a}hurt(t,e,n,s=null,r=[]){return!t.alive||!t.destructible||(t.hp-=e,t.hp<=0?(this.destroy(t,n,s),r.push(t)):ps(s,"terrain.hurt",{c:t,from:n,at:Vh(t)})),r}destroy(t,e,n=null){switch(t.alive=!1,this.dirty=!0,ps(n,"terrain.destroy",{c:t,from:e,at:Vh(t)}),t.kind){case"block":this.collapse(t.col,n),this.rubble(t.col,e,n);break;case"tree":this.topple(t,e,n);break}}collapse(t,e=null){t.blocks=t.blocks.filter(r=>r.alive).sort((r,o)=>r.level-o.level);const n=[];let s=0;for(const r of t.blocks){if(r.level>s){const o=(r.level-s)*t.by;r.level=s,r.shape.y-=o,n.push({c:r,dy:o})}s=r.level+1}n.length&&ps(e,"terrain.collapse",{drops:n,by:t.by})}rubble(t,e,n=null){let s=t.rubble;if(!s){const r=t.style;s=t.rubble=this.add({kind:"rubble",hp:1/0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0,look:{piece:"rubble",style:r}},n),this.dirty=!0}ps(n,"terrain.rubble",{c:s,from:e})}topple(t,e,n=null){const s=t.shape;let r=s.x-((e==null?void 0:e.x)??s.x-1),o=s.z-((e==null?void 0:e.z)??s.z);const a=Ft(r,o)||1;r/=a,o/=a;const c=t.trunkH,h=this.add({kind:"log",hp:2,shape:{x:s.x+r*c*.5,y:t.trunkR,z:s.z+o*c*.5,hx:c*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Math.atan2(-o,r)},navKind:"diff",los:"obscure",cover:!0,look:{piece:"fallen",tree:t.id,dx:r,dz:o}},n);return this.dirty=!0,h}}function Sx(i,t){const e=t*2+.16;if(i===1)return[[0,0]];if(i<=4){const r=i===2?e/2:e/(2*Math.sin(Math.PI/i));return Array.from({length:i},(o,a)=>[Math.cos(a/i*Math.PI*2+.4)*r,Math.sin(a/i*Math.PI*2+.4)*r])}const n=i-1,s=Math.max(e,e/(2*Math.sin(Math.PI/n)));return[[0,0],...Array.from({length:n},(r,o)=>[Math.cos(o/n*Math.PI*2+.3)*s,Math.sin(o/n*Math.PI*2+.3)*s])]}function bx(i,t,e){const n=ff(i,e),s=n.units[t],r={id:i.nextUnitId++,key:t,t:s,side:e,race:n.key,pos:{x:0,z:0},models:[],alive:s.models,r:0,flags:{},lost:0,mesmerized:!1};for(let o=0;o<s.models;o++)r.models.push({w:s.W,alive:!0,ox:0,oz:0});return of(r),r}function of(i){const t=i.models.filter(n=>n.alive),e=Sx(t.length,i.t.base);t.sort((n,s)=>Math.atan2(n.oz,n.ox)-Math.atan2(s.oz,s.ox)),e.forEach(([n,s],r)=>{t[r].ox=n,t[r].oz=s}),i.r=e.reduce((n,[s,r])=>Math.max(n,Ft(s,r)),0)+i.t.base}function af(i,t,e){i.pos.x=t,i.pos.z=e}function vc(i,t,e,n,s,r){const{W:o}=dn,a=i.nav;let c=null,h=1/0;const l=To(i,s),u=l*(o/2),f=l*(o/2-dn.deploy),p=Math.min(u,f),g=Math.max(u,f);for(let _=0;_<a.N;_++){const m=a.x(_),d=a.z(_);if(m-t.r<p-.01||m+t.r>g+.01||!a.standable(_,t.r,"walk")||r.some(x=>Ft(x.pos.x-m,x.pos.z-d)<x.r+t.r+.4))continue;const v=Ft(m-e,d-n);v<h&&(h=v,c={x:m,z:d})}return c}function Ex(i){const{W:t,H:e}=dn;for(const n of[0,1]){const s=To(i,n),r=i.units.filter(u=>u.side===n),o=[],a=r.filter(u=>u.t.deployRow==="back"),c=r.filter(u=>u.t.deployRow==="mid"),l=[[r.filter(u=>u.t.deployRow==="front"),t/2-dn.deploy+1.8],[c,t/2-dn.deploy+3.6],[a,t/2-2.4]];for(const[u,f]of l)u.forEach((p,g)=>{const _=((g+.5)/u.length-.5)*(e-6)*-s,m=vc(i,p,s*f,_,n,o)||{x:s*f,z:_};af(p,m.x,m.z),o.push(p)})}}const cf=Object.freeze([-1,1]),lf=Mn([{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}]),hf=.5;function xc(i,t){if(i.length!==2||t.length!==2)throw new Error("a match has two seats");return i.map((e,n)=>{if(typeof e!="string"||!ri[e])throw new Error(`seat ${n}: no race "${e}" (there are ${Object.keys(ri).join(", ")})`);if(t[n]!=="human"&&t[n]!=="ai")throw new Error(`seat ${n}: controller "${t[n]}" is neither human nor ai`);return{seat:n,race:e,edge:cf[n],ctrl:t[n]}})}const uf=i=>({...i,seats:i.seats.map(t=>({...t}))}),ff=(i,t)=>ri[i.seats[t].race],To=(i,t)=>i.seats[t].edge,Xa=(i,t)=>i.seats[t].ctrl;function wx(i,{out:t=null,onTrace:e=null}={}){const{W:n,H:s}=dn,r={setup:Mn(uf(i)),rng:Yu(i.dice),seats:xc(i.seats.map(o=>o.race),i.seats.map(o=>o.ctrl)),units:[],nextUnitId:1,objectives:lf.map((o,a)=>({i:a,x:o.x,z:o.z})),terrain:new yx(n,s),nav:new Xv(n,s,hf),turn:{stage:"title",round:1,active:0,first:0,phase:"move",vp:[0,0],wiped:-1},journal:{trace:[],pendingLog:[]},out:t,onTrace:e};r.terrain.generate(i.board,r.objectives,dn.deploy,i.terrain,t),qi(r);for(const o of[0,1])for(const a of ff(r,o).army)r.units.push(bx(r,a,o));return Ex(r),r}function Tx(i,{dice:t,ctrl:e}){if(i.turn.stage!=="title")throw new Error(`this table's battle has begun already (stage ${i.turn.stage})`);i.setup=Mn({...uf(i.setup),dice:t,seats:i.setup.seats.map((n,s)=>({...n,ctrl:e[s]}))}),i.rng=Yu(t),i.seats=xc(i.setup.seats.map(n=>n.race),e)}function qi(i){i.terrain.dirty&&(i.terrain.dirty=!1,i.nav.rebuild(i.terrain.chunks))}function mo(i,t){const e=t.t.ranged;return!(!e||!ee(t)||t.flags.shot||t.mesmerized||t.flags.fellBack||tn(i,t)||t.flags.advanced&&!e.assault)}function ks(i,t,e){const n=t.t.ranged,s=xi(t,e);if(s>n.range)return{ok:!1,why:`out of range (${s.toFixed(1)}" / ${n.range}")`};if(tn(i,e)&&!n.spell)return{ok:!1,why:"locked in combat"};const r=vf(i,t,e);if(!r.visible&&!n.indirect)return{ok:!1,why:"no line of sight"};let o=0;return n.heavy&&t.flags.moved&&o++,n.indirect&&!r.visible&&o++,{ok:!0,range:s,...r,mod:o,need:dr(t.t.BS,o)}}function Mc(i,t){return mo(i,t)?oi(i,t).filter(e=>ks(i,t,e).ok):[]}function df(i){return i.t.move}function $a(i,t,e,n=[]){const{W:s,H:r}=dn,o=i.nav,a=new Uint8Array(o.N);a.discs=[];for(const c of oi(i,t)){const h=c.r+t.r+(n.includes(c)?.02:e);a.discs.push({x:c.pos.x,z:c.pos.z,R:h-.02});const l=Math.max(0,Math.floor((c.pos.x-h+s/2)/o.cell)),u=Math.min(o.nx-1,Math.floor((c.pos.x+h+s/2)/o.cell)),f=Math.max(0,Math.floor((c.pos.z-h+r/2)/o.cell)),p=Math.min(o.nz-1,Math.floor((c.pos.z+h+r/2)/o.cell));for(let g=f;g<=p;g++)for(let _=l;_<=u;_++){const m=g*o.nx+_;Ft(o.x(m)-c.pos.x,o.z(m)-c.pos.z)<h&&(a[m]=1)}}return a}function hr(i,t,e=0){qi(i);const n=tn(i,t),s=t.t.M+e,r=df(t),o=oi(i,t),a=$a(i,t,zi+.05,n?o:[]),c=$a(i,t,zi+.05),h=i.nav.reach(t.pos.x,t.pos.z,{r:t.r,max:s,mode:r==="fly"?"fly":r,forbid:r==="fly"?null:a});return{u:t,res:h,max:s,mode:r,forbid:a,endForbid:c,fallback:n}}function Ao(i,t,e){const{u:n,res:s,mode:r,endForbid:o}=t,a=i.nav;if(e<0||!isFinite(s.dist[e])||!a.standable(e,n.r,r==="wreck"?"wreck":"walk",o))return!1;const c=a.x(e),h=a.z(e);for(const l of i.units)if(l!==n&&ee(l)&&Ft(l.pos.x-c,l.pos.z-h)<l.r+n.r+.08)return!1;return!0}function pf(i,t,e,n,s=2.4){const r=i.nav;let o=-1,a=s;const c=r.index(e,n);if(c<0)return-1;const h=Math.ceil(s/r.cell),l=c%r.nx,u=c/r.nx|0;for(let f=-h;f<=h;f++)for(let p=-h;p<=h;p++){const g=l+p,_=u+f;if(g<0||_<0||g>=r.nx||_>=r.nz)continue;const m=_*r.nx+g,d=Ft(r.x(m)-e,r.z(m)-n);d<a&&Ao(i,t,m)&&(a=d,o=m)}return o}function go(i,t){return!(!ee(t)||t.flags.charged||t.flags.chargeTried||t.t.noCharge||t.mesmerized||t.flags.fellBack||tn(i,t)||t.flags.advanced&&!t.t.chargeAfterAdvance)}function Hs(i,t){return go(i,t)?oi(i,t).filter(e=>xi(t,e)<=Eo):[]}function yr(i,t,e){qi(i);const n=i.nav,s=oi(i,t).filter(m=>m!==e),r=df(t),o=$a(i,t,zi+.05,[e]),a=n.reach(t.pos.x,t.pos.z,{r:t.r,max:Eo+.5,mode:r,forbid:r==="fly"?null:o}),c=[];let h=-1,l=1/0;const u=e.r+t.r+zi-.08,f=Math.ceil((u+1)/n.cell),p=n.index(e.pos.x,e.pos.z),g=p%n.nx,_=p/n.nx|0;for(let m=-f;m<=f;m++)for(let d=-f;d<=f;d++){const v=g+d,x=_+m;if(v<0||x<0||v>=n.nx||x>=n.nz)continue;const M=x*n.nx+v,P=a.dist[M];if(!isFinite(P))continue;const w=Ft(n.x(M)-e.pos.x,n.z(M)-e.pos.z);w>u||w<e.r+t.r+.02||n.standable(M,t.r,r==="wreck"?"wreck":"walk",o)&&(s.some(T=>Ft(n.x(M)-T.pos.x,n.z(M)-T.pos.z)<T.r+t.r+zi)||i.units.some(T=>T!==t&&T!==e&&ee(T)&&T.side===t.side&&Ft(T.pos.x-n.x(M),T.pos.z-n.z(M))<T.r+t.r+.05)||(c.push({i:M,d:P}),P<l&&(h=M,l=P)))}return h<0?null:{cell:h,need:Math.max(2,Math.ceil(l-.01)),res:a,forbid:o,mode:r,dist:l,spots:c}}const ee=i=>i.alive>0,oi=(i,t)=>i.units.filter(e=>e.side!==t.side&&ee(e)),mf=(i,t)=>i.units.filter(e=>e.side===t.side&&ee(e)&&e!==t),yc=(i,t)=>Ft(i.pos.x-t.pos.x,i.pos.z-t.pos.z),xi=(i,t)=>yc(i,t)-i.r-t.r,Ro=(i,t)=>oi(i,t).filter(e=>xi(t,e)<=zi+.05),Gs=(i,t)=>i.pos.x+t.ox,Vs=(i,t)=>i.pos.z+t.oz,tn=(i,t)=>Ro(i,t).length>0,gf=i=>i.t.eye,_f=i=>i.t.chest;function Sc(i,t){const e=t.models.filter(s=>s.alive);if(t.t.fly)return!1;let n=0;for(const s of e)i.nav.cover[i.nav.index(Gs(t,s),Vs(t,s))]&&n++;return n*2>=e.length&&n>0}function vf(i,t,e,n=t.pos){const s={x:n.x,y:gf(t),z:n.z};let r=0,o=0,a=0;for(const c of e.models){if(!c.alive)continue;a++;const h=i.terrain.los(s,{x:Gs(e,c),y:_f(e),z:Vs(e,c)});h.blocked||(r++,h.obscure&&o++)}return{visible:r>0,cover:r>0&&(o>0||r<a||Sc(i,e)),seen:r,total:a}}function Ax(i,t){let e=t.t.Ld;for(const n of mf(i,t))n.t.hero&&yc(t,n)<=wo+t.r&&(e=Math.max(e,n.t.Ld));return e}function bc(i,t){const e=[0,0];for(const n of i.units)if(ee(n))for(const s of n.models)s.alive&&Ft(Gs(n,s)-t.x,Vs(n,s)-t.z)<=uo+n.t.base&&(e[n.side]+=n.t.OC);return e[0]>e[1]?0:e[1]>e[0]?1:-1}function Sr(i,t){if(!ee(t)||t.side!==i.turn.active)return!1;switch(i.turn.phase){case"move":return!t.flags.moved;case"shoot":return mo(i,t)&&Mc(i,t).length>0;case"charge":return go(i,t)&&Hs(i,t).length>0}return!1}const Rx=(i,t)=>i.units.some(e=>e.side===t&&Sr(i,e));function xf(i,t){var e;i.journal.trace.push(t),(e=i.onTrace)==null||e.call(i,t,i)}function Co(i,t){const e=i.units.map(n=>`${n.id}:${n.pos.x.toFixed(3)},${n.pos.z.toFixed(3)},${n.models.map(s=>s.w).join("/")}`).join(" ");xf(i,`${t} ${e} chunks:${i.terrain.chunks.filter(n=>n.alive).length} vp:${i.turn.vp.join("-")} rng:${pc(i.rng)}`)}function Cx(i,t,e){xf(i,`log ${t} ${e.replace(/<[^>]+>/g,"")} rng:${pc(i.rng)}`)}const Px=(i,t=Math.random)=>Qe(i,t),Ns=i=>1-Math.pow(1-i,3),Lx=i=>i*i*i,Ec=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,Dx=i=>Math.atan2(Math.sin(i),Math.cos(i));function Ix(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375}const hn={speed:1,time:0},ja=new Set;function Ae(i,t,e=n=>n){return new Promise(n=>{ja.add({t:0,duration:Math.max(1e-4,i),fn:t,ease:e,resolve:n})})}const je=i=>Ae(i,()=>{});function Ux(i){for(const t of[...ja]){t.t+=i;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(ja.delete(t),t.resolve())}}const xs=new Fn(1,1,1),Nx=new rn(.5,.5,1,8).rotateZ(Math.PI/2),ba=new Map;function _e(i,t={}){const e=i+JSON.stringify(t);return ba.has(e)||ba.set(e,new Cn({color:i,roughness:.9,flatShading:!0,...t})),ba.get(e)}function ve(i,t,{shadow:e=!0}={}){const n=new Ht(i,t);return n.castShadow=e,n.receiveShadow=!0,n}const Ox={box:i=>Wh(i,xs),log:i=>Wh(i,Nx),cap(i){const{look:t,shape:e}=i,n=ve(new Bn(t.r,t.h,4).rotateY(Math.PI/4),_e(t.color));return n.position.set(e.x,e.y,e.z),n.rotation.y=t.yaw,{obj:n}},tree(i){const{look:t,shape:e}=i,{h:n,r:s}=t.trunk,r=new zt;r.position.set(e.x,0,e.z);const o=ve(new rn(s*.75,s,n,7).translate(0,n/2,0),_e(t.bark));r.add(o);const a=new zt;r.add(a);for(const c of t.canopy)if(c.cone){const h=ve(new Bn(c.r,c.h,8),_e(c.color));h.position.y=c.y,h.rotation.y=c.yaw,a.add(h)}else{const h=ve(new kn(c.r,1),_e(c.color));h.position.set(...c.pos),h.scale.y=.8,a.add(h)}return r.rotation.y=t.yaw,{obj:r,canopy:a}},hedge(i){const{look:t,shape:e}=i,n=new zt;n.position.set(e.x,0,e.z),n.rotation.y=t.yaw;const s=ve(xs,_e(t.color));s.scale.set(1.15,.62,.55),s.position.y=.31,n.add(s);for(const r of t.tufts){const o=ve(new kn(.3,0),_e(r.color));o.position.set(...r.pos),n.add(o)}for(const r of t.berries){const o=ve(new fn(.05,5,4),_e("#c0302a"),{shadow:!1});o.position.set(...r),n.add(o)}return{obj:n}},boulder(i){const{look:t,shape:e}=i,n=ve(new ho(t.size,0),_e(t.color));if(n.scale.set(...t.scale),n.rotation.set(...t.rot),n.position.set(e.x,t.y,e.z),t.moss){const s=ve(new ho(t.size*.55,0),_e("#5d7a3a"),{shadow:!1});s.position.set(0,t.size*.55,0),s.scale.set(1.1,.4,1.1),n.add(s)}return{obj:n}},crate(i){const{look:t}=i,e=new zt,n=t.s,s=ve(xs,_e(t.color));s.scale.setScalar(n),s.position.y=n/2;const r=ve(xs,_e("#5f3e24"));if(r.scale.set(n*1.02,n*.14,n*1.02),r.position.y=n/2,e.add(s,r),t.stacked){const o=ve(xs,_e("#9a7048"));o.scale.setScalar(n*.7),o.position.set(0,n+n*.35,0),o.rotation.y=.5,e.add(o)}return Ea(i,e)},barrel(i){const t=new zt,e=ve(new rn(.28,.24,.75,10),_e(i.look.color));e.position.y=.375;const n=ve(new En(.29,.025,4,14).rotateX(Math.PI/2),_e("#3a3a3a",{metalness:.4}));return n.position.y=.55,t.add(e,n),Ea(i,t)},sack(i){const t=new zt,e=ve(new fn(.34,9,7),_e("#c2a77a"));e.scale.set(1,1.15,.9),e.position.y=.36,t.add(e);for(const[n,s]of i.look.acorns){const r=ve(new fn(.08,6,5),_e("#8a5a2a"));r.position.set(n,.72,s),t.add(r)}return Ea(i,t)},mushroom(i){const{look:t,shape:e}=i,{h:n,r:s,sr:r}=t,o=new zt;o.position.set(e.x,0,e.z);const a=ve(new rn(r*.8,r*1.2,n,8).translate(0,n/2,0),_e("#efe6d0")),c=ve(new fn(s,14,8,0,Math.PI*2,0,Math.PI/2),_e(t.cap));c.position.y=n-.05,c.scale.y=.7;const h=ve(new Gi(s,14).rotateX(Math.PI/2),_e("#e9dcc0"));h.position.y=n-.05,o.add(a,c,h);for(const[l,u]of t.dots){const f=ve(new fn(s*.12,5,4),_e("#fff6e0"),{shadow:!1});f.position.set(Math.cos(l)*Math.sin(u)*s,n-.05+Math.cos(u)*s*.7,Math.sin(l)*Math.sin(u)*s),o.add(f)}return o.rotation.z=t.tilt,{obj:o}},floor(i){const{look:t,shape:e}=i,n=new Gi(t.r,t.segments),s=n.attributes.position;if(t.rim.length!==s.count-1)throw new Error(`a forest floor of ${s.count} vertices with ${t.rim.length} rim draws`);for(let o=1;o<s.count;o++){const a=t.rim[o-1];s.setXY(o,s.getX(o)*a,s.getY(o)*a)}n.rotateX(-Math.PI/2);const r=ve(n,_e(t.color,{flatShading:!1}),{shadow:!1});return r.position.set(e.x,.012,e.z),{obj:r}},rubble(i){const t=new zt;return t.position.set(i.shape.x,0,i.shape.z),{obj:t,pieces:0}}};function Wh(i,t){const{look:e,shape:n}=i,s=ve(t,_e(e.color));return s.scale.set(...e.scale),s.position.set(n.x,n.y,n.z),s.rotation.y=e.yaw,{obj:s}}function Ea(i,t){return t.position.set(i.shape.x,0,i.shape.z),t.rotation.y=i.look.yaw,{obj:t}}class zx{constructor(t,e){this.scene=t,this.fx=e,this.group=new zt,t.add(this.group),this.items=new Map,this.onBreak=null}object(t){var e;return(e=this.items.get(t))==null?void 0:e.obj}play(t){for(const e of t)this.apply(e)}apply(t){switch(t.t){case"terrain.clear":return this.clear();case"terrain.add":return this.add(t.c);case"terrain.hurt":return this.hurt(t.c,t.from,t.at);case"terrain.destroy":return this.destroy(t.c,t.from,t.at);case"terrain.collapse":return this.collapse(t.drops,t.by);case"terrain.rubble":return this.rubble(t.c,t.from)}throw new Error(`TerrainView: no handler for ${t.t}`)}clear(){this.scene.remove(this.group),this.group=new zt,this.scene.add(this.group),this.items.clear()}add(t){if(t.look.piece==="fallen")return this.fell(t);const e={c:t,...Ox[t.look.piece](t)};this.items.set(t.id,e),this.group.add(e.obj)}hurt(t,e,n){const s=this.items.get(t.id),r=s.obj;r.isMesh&&(s.ownMat||(r.material=r.material.clone(),s.ownMat=!0),r.material.color.multiplyScalar(.8));const o=r.position.clone();Ae(.25,a=>{const c=(1-a)*.06;r.position.set(o.x+(Math.random()-.5)*c,o.y,o.z+(Math.random()-.5)*c)}).then(()=>r.position.copy(o)),this.fx.debris(n.x,n.y,n.z,[t.look.chip||"#888","#666"],3,{from:e,power:3,size:.08})}destroy(t,e,n){var a;const s=this.items.get(t.id),r=n,o=this.fx;switch(t.kind){case"block":{this.group.remove(s.obj),o.debris(r.x,r.y,r.z,[t.look.chip,t.look.chip,"#5a5650"],12,{from:e,power:6}),o.smoke({x:r.x,y:r.y,z:r.z,size:.4,color:"#a09a8a",life:1.5});break}case"tree":{for(const c of s.canopy.children){const h=new R;c.getWorldPosition(h),o.leaves(h.x,h.y,h.z,t.look.leaves,14,1)}s.obj.remove(s.canopy);break}case"hedge":case"mushroom":if(this.group.remove(s.obj),o.leaves(r.x,r.y,r.z,t.look.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let c=0;c<16;c++)o.mote({x:r.x,y:r.y*1.5,z:r.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(s.obj),o.debris(r.x,r.y,r.z,Yv,14,{from:e,power:6,size:.12});break}(a=this.onBreak)==null||a.call(this,t)}collapse(t,e){for(const{c:n,dy:s}of t){const r=this.items.get(n.id).obj,o=r.position.y,a=o-s;Ae(.18+s*.15,c=>r.position.y=o+(a-o)*c,Ix).then(()=>{this.fx.debris(n.shape.x,n.shape.y-e/2,n.shape.z,["#8a8478"],3,{power:2,size:.07})})}}rubble(t,e){const n=this.items.get(t.id),s=n.obj,r=rf[t.look.style],o=4+Math.floor(Math.random()*3);for(let a=0;a<o;a++){const c=ve(xs,_e(Px(r.colors))),h=.18+Math.random()*.22;c.scale.set(h*(r.look==="log"?2.4:1.2),h*.7,h);const l=Math.random()*6,u=Math.random()*.6,f=e?t.shape.x-e.x:0,p=e?t.shape.z-e.z:0,g=Math.hypot(f,p)||1;c.position.set(Math.cos(l)*u+f/g*.25,h*.3+Math.min(.2,n.pieces*.012),Math.sin(l)*u+p/g*.25),c.rotation.set(Math.random(),Math.random()*6,Math.random()),s.add(c)}n.pieces+=o}fell(t){const e=this.items.get(t.look.tree),n=e.c,s=n.shape,r=n.look.trunk,{dx:o,dz:a}=t.look,c=e.obj,h=new R(a,0,-o).normalize(),l=c.quaternion.clone(),u=new zn;Ae(.9,f=>{u.setFromAxisAngle(h,(Math.PI/2-.12)*f),c.quaternion.copy(l).premultiply(u),c.position.y=Math.sin(f*Math.PI)*.05+r.r*f},Lx).then(()=>{this.fx.debris(s.x+o*r.h,.2,s.z+a*r.h,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.fx.shake=Math.max(this.fx.shake,.05)}),this.items.set(t.id,{c:t,obj:c}),this.group.add(c)}}const Xh=900,$h=700,jh=260,ms=new le,qh=new zn,Fx=new Fs,no=new R,Bx=new R,Yh=new jt;class wa{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let n=e-1;n>=0;n--)this.free.push(n);t.instanceMatrix.setUsage(Qd),t.frustumCulled=!1,ms.makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,ms),t.setColorAt(n,Yh.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,Yh.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const n of this.items){if(n.age+=t,n.age>=n.life){ms.makeScale(0,0,0),this.mesh.setMatrixAt(n.i,ms),this.free.push(n.i);continue}n.vy-=n.g*t;const s=Math.exp(-n.drag*t);n.vx*=s,n.vz*=s,n.g<0&&(n.vy*=s),n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.y<n.floor&&(n.y=n.floor,n.vy=-n.vy*n.bounce,n.vx*=.55,n.vz*=.55,n.spin*=.5),n.rx+=n.spin*t,n.ry+=n.spin*.7*t;const r=n.age/n.life,o=n.size*(n.grow?.4+r*n.grow:1)*(r>n.fadeAt?1-(r-n.fadeAt)/(1-n.fadeAt):1);qh.setFromEuler(Fx.set(n.rx,n.ry,0)),ms.compose(no.set(n.x,n.y,n.z),qh,Bx.set(o*n.sx,o*n.sy,o*n.sz)),this.mesh.setMatrixAt(n.i,ms),e.push(n)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function Ta(i){return{x:i.x,y:i.y,z:i.z,vx:i.vx||0,vy:i.vy||0,vz:i.vz||0,g:i.g??22,drag:i.drag??.6,bounce:i.bounce??.3,floor:i.floor??.04,size:i.size??.15,sx:i.sx??1,sy:i.sy??1,sz:i.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:i.spin??(Math.random()-.5)*18,age:0,life:i.life??1.5,fadeAt:i.fadeAt??.7,grow:i.grow||0,color:i.color}}function Kh(i,t){const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,i),s.addColorStop(.55,i),s.addColorStop(1,t),n.fillStyle=s,n.fillRect(0,0,128,128);for(let o=0;o<90;o++){const a=Math.random()*Math.PI*2,c=30+Math.random()*30;n.fillStyle=i,n.globalAlpha=Math.random()*.5,n.beginPath(),n.arc(64+Math.cos(a)*c,64+Math.sin(a)*c,2+Math.random()*6,0,Math.PI*2),n.fill()}const r=new ac(e);return r.colorSpace=Te,r}class kx{constructor(t,e,n){this.scene=t,this.camera=e,this.overlay=n,this.shake=0;const s=new sr(new Fn(1,1,1),new Cn({roughness:.85}),Xh);s.castShadow=!0;const r=new sr(new kn(1,0),new Ke({toneMapped:!1}),$h),o=new sr(new kn(1,1),new wv({transparent:!0,opacity:.55,depthWrite:!1}),jh);t.add(s,r,o),this.cubes=new wa(s,Xh),this.glow=new wa(r,$h),this.puff=new wa(o,jh),this.lights=[];for(let a=0;a<3;a++){const c=new Rv(16755285,0,14,1.6);c.position.set(0,-50,0),t.add(c),this.lights.push({l:c,until:0})}this.scorchTex=Kh("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=Kh("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new Gi(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new fn(1,20,12),this.ringGeo=new ji(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new Gi(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(Ta(t))}mote(t){this.glow.spawn(Ta({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(Ta({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,n,s,r,{from:o,power:a=7,size:c=.16}={}){for(let h=0;h<r;h++){let l=Math.random()-.5,u=Math.random()-.5;o&&(l+=(t-o.x)*.35,u+=(n-o.z)*.35);const f=Math.hypot(l,u)||1,p=a*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:n+(Math.random()-.5)*.4,vx:l/f*p,vy:3+Math.random()*a,vz:u/f*p,size:c*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,n,s,r,o=1){for(let a=0;a<r;a++){const c=Math.random()*Math.PI*2,h=1+Math.random()*4*o;this.cube({x:t+Math.cos(c)*.5*o,y:e+Math.random()*o,z:n+Math.sin(c)*.5*o,vx:Math.cos(c)*h,vy:2+Math.random()*4,vz:Math.sin(c)*h,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,n,s,r,o){const a=this.lights.reduce((c,h)=>c.until<h.until?c:h);a.until=hn.time+o,a.l.color.set(s),a.l.position.set(t,e,n),Ae(o,c=>a.l.intensity=r*(1-c)*(1-c))}decal(t,e,n,s,r=.8){const o=new Ht(this.decalGeo,new Ke({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(o.position.set(t,.015+this.decals.length*4e-4,e),o.rotation.y=Math.random()*6,o.scale.setScalar(n),o.renderOrder=1,this.scene.add(o),this.decals.push(o),this.decals.length>40){const a=this.decals.shift();this.scene.remove(a),a.material.dispose()}return o}clearDecals(){for(const t of this.decals)this.scene.remove(t),t.material.dispose();this.decals=[]}ring(t,e,n,s,{life:r=1.2,fill:o=.18,hold:a=!1}={}){const c=new zt,h=new Ht(this.ringGeo,new Ke({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),l=new Ht(this.discGeo,new Ke({color:s,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1}));c.add(h,l),c.position.set(t,.05,e),c.scale.setScalar(n),c.renderOrder=3,this.scene.add(c);const u=()=>{this.scene.remove(c),h.material.dispose(),l.material.dispose()};return a||Ae(r,f=>{h.material.opacity=.95*(1-f),l.material.opacity=o*(1-f)}).then(u),c.userData.remove=u,c}explode(t,e,n,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],o=new Ht(this.flashGeo,new Ke({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));o.position.set(t,.3,e),this.scene.add(o),Ae(.45,c=>{o.scale.setScalar(.2+n*.85*Ns(c)),o.material.opacity=.9*(1-c)}).then(()=>{this.scene.remove(o),o.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+n*6,.7);const a=Math.round(18+n*14);for(let c=0;c<a;c++){const h=Math.random()*Math.PI*2,l=(2+Math.random()*6)*(.6+n*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(h)*l,vy:2+Math.random()*6,vz:Math.sin(h)*l,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[c%r.glow.length],life:.5+Math.random()*.7})}for(let c=0;c<6+n*3;c++){const h=Math.random()*Math.PI*2,l=Math.random()*n*.6;this.smoke({x:t+Math.cos(h)*l,y:.3+Math.random()*.4,z:e+Math.sin(h)*l,vx:Math.cos(h)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(h)*1.2,size:.25+Math.random()*.25*n,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+n*4),{power:5+n,size:.1}),this.decal(t,e,n*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+n*.06)}async projectile(t,e,{mesh:n,arc:s=.25,speed:r=22,trail:o=null,spin:a=10}={}){const c=Math.hypot(e.x-t.x,e.z-t.z),h=c*s;this.scene.add(n);let l=0;await Ae(Math.max(.12,c/r),u=>{n.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*h*u*(1-u),t.z+(e.z-t.z)*u),n.rotation.x+=a*.016,n.rotation.z+=a*.011,o&&u-l>.03&&(l=u,o(n.position))}),this.scene.remove(n)}text(t,e,n="#ffffff",{size:s=18,life:r=1.3,rise:o=1.4}={}){const a=document.createElement("div");a.className="float-text",a.textContent=e,a.style.color=n,a.style.fontSize=s+"px",this.overlay.appendChild(a),this.texts.push({el:a,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:o})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,n=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return no.set(s.x,s.y+s.rise*Ns(r),s.z).project(this.camera),s.el.style.transform=`translate(${(no.x*.5+.5)*e}px, ${(-no.y*.5+.5)*n}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}function Hx(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new be;let h=0;for(let l=0;l<i.length;++l){const u=i[l];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,l),h+=p}}if(e){let l=0;const u=[];for(let f=0;f<i.length;++f){const p=i[f].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+l);l+=i[f].attributes.position.count}c.setIndex(u)}for(const l in r){const u=Jh(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(const l in o){const u=o[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let f=0;f<u;++f){const p=[];for(let _=0;_<o[l].length;++_)p.push(o[l][_][f]);const g=Jh(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(g)}}return c}function Jh(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){const l=i[h];if(l.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=l.array.constructor),t!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=l.itemSize),e!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=l.normalized),n!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.array.length}const o=new t(r);let a=0;for(let h=0;h<i.length;++h)o.set(i[h].array,a),a+=i[h].array.length;const c=new pn(o,e,n);return s!==void 0&&(c.gpuType=s),c}const Aa=new Map;function pt(i,t={}){const e=i+JSON.stringify(t);return Aa.has(e)||Aa.set(e,new Cn({color:i,roughness:.72,flatShading:!0,...t})),Aa.get(e)}const Ri=i=>pt(i,{emissive:i,emissiveIntensity:1.6,roughness:.3}),We=i=>pt(i,{metalness:.65,roughness:.35}),ct={ico:new kn(1,1),ico0:new kn(1,0),sph:new fn(1,10,8),box:new Fn(1,1,1),cyl:new rn(1,1,1,10),cone:new Bn(1,1,8),cap:new fn(1,12,6,0,Math.PI*2,0,Math.PI/2),brim:new Gi(1,12).rotateX(Math.PI/2),oct:new bo(1,0)};function nt(i,t,e=0,n=0,s=0,r=1,o=r,a=r){const c=new Ht(i,t);return c.position.set(e,n,s),c.scale.set(r,o,a),c.castShadow=!0,c}function Ci(i,t,e,n){const s=new R(...i),r=new R(...t),o=nt(ct.cyl,n);return o.position.copy(s).add(r).multiplyScalar(.5),o.scale.set(e,s.distanceTo(r),e),o.quaternion.setFromUnitVectors(new R(0,1,0),r.clone().sub(s).normalize()),o}function Gx(i,t){const e=new zt,n=nt(new rn(i,i*1.05,.09,28),pt("#262422"),0,.045,0);n.receiveShadow=!0;const s=nt(new rn(i*.96,i*.96,.012,28),pt("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=nt(new En(i*1.02,.028,4,32).rotateX(Math.PI/2),pt(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(n,s,r);for(let o=0;o<Math.round(i*9);o++){const a=Math.random()*6,c=Math.sqrt(Math.random())*i*.85;e.add(nt(ct.cone,pt("#6a8a3a"),Math.cos(a)*c,.13,Math.sin(a)*c,.035,.08,.035))}return e}function Vx(i,t,e,n,s=8,r=40){const o=new hc(i.map(d=>new R(...d))),a=o.computeFrenetFrames(r,!1),c=[],h=[];for(let d=0;d<=r;d++){const v=d/r,x=o.getPointAt(v),M=t+(e-t)*Math.pow(v,.6),P=a.normals[d],w=a.binormals[d];for(let T=0;T<=s;T++){const N=T/s*Math.PI*2,y=Math.cos(N),b=Math.sin(N);c.push(x.x+M*(y*P.x+b*w.x),x.y+M*(y*P.y+b*w.y),x.z+M*(y*P.z+b*w.z))}}for(let d=0;d<r;d++)for(let v=0;v<s;v++){const x=d*(s+1)+v,M=x+s+1;h.push(x,x+1,M,M,x+1,M+1)}const l=o.getPointAt(0),u=c.length/3;c.push(l.x,l.y,l.z);for(let d=0;d<s;d++)h.push(u,d+1,d);const f=o.getPointAt(1),p=c.length/3;c.push(f.x,f.y,f.z);const g=r*(s+1);for(let d=0;d<s;d++)h.push(p,g+d,g+d+1);const _=new be;_.setAttribute("position",new re(c,3)),_.setIndex(h),_.computeVertexNormals();const m=new Ht(_,n);return m.castShadow=!0,m}function gs({fur:i="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:n="#6e4a2a",tailUp:s=1}={}){const r=new zt,o=new zt;r.add(o);const a=pt(i),c=pt(t),h=pt("#1b1410");for(const d of[-1,1])o.add(nt(ct.ico,a,d*.1,.05,.07,.08,.045,.13)),o.add(nt(ct.ico,a,d*.12,.17,-.02,.14));o.add(nt(ct.ico,a,0,.38,0,.21,.28,.19)),o.add(nt(ct.ico,c,0,.36,.1,.14,.2,.09));const l=new zt;l.position.set(0,.72,.05),o.add(l),l.add(nt(ct.ico,a,0,0,0,.17)),l.add(nt(ct.ico,c,0,-.05,.12,.09,.075,.08)),l.add(nt(ct.sph,h,0,-.02,.2,.028));for(const d of[-1,1]){l.add(nt(ct.sph,h,d*.075,.04,.13,.034)),l.add(nt(ct.sph,pt("#ffffff"),d*.068,.055,.155,.01));const v=nt(ct.cone,a,d*.09,.16,-.02,.05,.13,.04);v.rotation.z=-d*.25,l.add(v);const x=nt(ct.cone,pt(er(i,-.25)),d*.1,.25,-.02,.025,.07,.02);x.rotation.z=-d*.3,l.add(x)}e==="acorn"&&(l.add(nt(ct.cap,pt(n),0,.07,0,.19,.13,.19)),l.add(nt(ct.brim,pt(n),0,.07,0,.19,1,.19)),l.add(nt(ct.cyl,pt(er(n,-.2)),0,.22,0,.02,.06,.02)));const u=new zt;u.position.set(0,.22,-.18),o.add(u);const f=new hc([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(d=>new R(...d))),p=pt(er(i,.08)),g=pt(er(i,.2)),_=12;for(let d=0;d<_;d++){const v=d/(_-1),x=.085+Math.sin(Math.min(1,v*1.15)*Math.PI)*.11,M=f.getPointAt(v);u.add(nt(ct.ico,v>.75?g:p,M.x,M.y,M.z,x,x*1.1,x))}const m=[];for(const d of[-1,1]){const v=new zt;v.position.set(d*.17,.52,.04),v.add(nt(ct.ico,a,0,-.1,0,.05,.12,.05));const x=new zt;x.position.set(0,-.21,0),x.add(nt(ct.ico,a,0,0,0,.045)),v.add(x),v.userData.hand=x,v.rotation.x=-.9,o.add(v),m.push(v)}return r.userData.anim={kind:"squirrel",body:o,tail:u,head:l,armL:m[0],armR:m[1]},r}function _s({scale:i="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:n=1,long:s=!1,thick:r=1}={}){const o=new zt,a=new zt;o.add(a);const c=pt(i),h=pt(t);let l;if(s)l=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{l=[];for(let _=0;_<=10;_++){const m=_/10,d=-.6+m*Math.PI*2.3,v=.3-m*.17;l.push([Math.cos(d)*v,.06+m*.1,Math.sin(d)*v-.04])}l.push([0,.3,.02],[0,.42,.03])}a.add(Vx(l,.025,.115*r,c));const u=nt(new fc(.12*r,.2,3,8),c,0,.53,.04);u.rotation.x=.12,a.add(u),a.add(nt(ct.ico,h,0,.5,.12*r,.085*r,.17,.05));const f=new zt;if(f.position.set(0,.79,.08),a.add(f),e){const _=nt(ct.ico,pt(e),0,-.02,-.07,.21*n,.24*n,.05);f.add(_);for(const m of[-1,1])f.add(nt(ct.sph,pt(t),m*.08*n,.02,-.12,.035*n,.035*n,.01))}f.add(nt(ct.ico,c,0,0,.02,.11,.09,.15)),f.add(nt(ct.ico,h,0,-.04,.06,.08,.04,.11));for(const _ of[-1,1])f.add(nt(ct.sph,pt("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),_*.065,.035,.09,.03)),f.add(nt(ct.sph,pt("#111111"),_*.079,.037,.1,.008,.024,.012));const p=new zt;p.position.set(0,-.03,.16);for(const _ of[-1,1]){const m=nt(ct.cyl,pt("#d0304a"),_*.012,0,.05,.008,.1,.008);m.rotation.x=Math.PI/2,m.rotation.z=_*.3,p.add(m)}p.scale.setScalar(.001),f.add(p);const g=[];for(const _ of[-1,1]){const m=new zt;m.position.set(_*.15*r,.64,.05),m.add(nt(ct.ico,c,0,-.1,0,.045*r,.12,.045*r));const d=new zt;d.position.set(0,-.21,0),d.add(nt(ct.ico,c,0,0,0,.042*r)),m.add(d),m.userData.hand=d,m.rotation.x=-.9,a.add(m),g.push(m)}return o.userData.anim={kind:"naga",body:a,head:f,tongue:p,armL:g[0],armR:g[1]},o}const tr=()=>pt("#7a5232");function Wx(i=1.1,t="#c9a24a"){const e=new zt;return e.add(nt(ct.cyl,tr(),0,0,0,.022,i,.022)),e.add(nt(ct.cone,We(t),0,i/2+.07,0,.04,.14,.04)),e}function Zh(i,t,e){const n=new zt,s=nt(ct.cyl,t,0,0,0,i,.04,i);return s.rotation.x=Math.PI/2,n.add(s),n.add(nt(ct.sph,e,0,0,.03,i*.25,i*.25,i*.15)),n}const er=(i,t)=>{const e=new jt(i),n={};return e.getHSL(n),e.setHSL(n.h,n.s,Math.max(0,Math.min(1,n.l+t))),"#"+e.getHexString()};function Kn(i,t,e=.9){i.userData.hand.add(t),t.rotation.x=e}function Qh(i,t,e,n){const s=new zt,r=nt(ct.cyl,pt("#5a3a22"),0,0,0,i,.1,i);r.rotation.z=Math.PI/2;const o=nt(ct.cyl,We("#444"),0,0,0,i*.3,.13,i*.3);return o.rotation.z=Math.PI/2,s.add(r,o),s.position.set(t,e,n),s}const Xx={nutkin(){const i=gs({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=i.userData.anim,e=nt(ct.cone,pt("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const n=new zt;return n.add(Ci([0,-.08,0],[0,.04,0],.018,tr())),n.add(Ci([0,.04,0],[-.05,.13,0],.014,tr())),n.add(Ci([0,.04,0],[.05,.13,0],.014,tr())),Kn(t.armR,n,1.4),t.armR.rotation.x=-1.3,i},grenadier(){const i=gs({fur:"#a9552a",hatColor:"#4f3a22"}),t=i.userData.anim,e=nt(new En(.21,.025,4,16),pt("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(nt(ct.sph,pt("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(nt(new En(.04,.012,4,10),We("#c9a24a"),s*.07,.07,.14));const n=new zt;return n.add(nt(ct.sph,pt("#8a5a2a"),0,0,0,.06,.07,.06)),n.add(nt(ct.cap,pt("#4f3a22"),0,.03,0,.065,.04,.065)),n.add(nt(ct.brim,pt("#4f3a22"),0,.03,0,.065,1,.065)),n.add(nt(ct.sph,Ri("#ffb030"),0,.1,0,.022)),Kn(t.armR,n,0),t.armR.rotation.x=2.3,i},oakguard(){const i=gs({fur:"#8a5a35",hatColor:"#5a3c22"}),t=i.userData.anim;t.body.add(nt(ct.ico,pt("#5b4330"),0,.42,.05,.2,.22,.16));const e=nt(ct.cone,pt("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const n=Zh(.22,pt("#6b4a2e"),pt("#3e7a2a"));Kn(t.armL,n,.9),n.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new zt;return s.add(nt(ct.cyl,tr(),0,.2,0,.022,1.15,.022)),s.add(nt(ct.box,We("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(nt(ct.cone,pt("#6b4a26"),0,.85,0,.06,.18,.06)),Kn(t.armR,s,.9),i},glider(){const i=gs({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=i.userData.anim;for(const n of[-1,1])t.head.add(nt(new En(.045,.015,4,10),We("#c9a24a"),n*.07,.07,.14));t.head.add(nt(ct.cap,pt("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.head.add(nt(ct.brim,pt("#6b4a2e"),0,.06,-.01,.18,1,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=pt(er("#9a8a78",-.12),{side:un});for(const n of[-1,1]){const s=new be;s.setAttribute("position",new re([n*.15,.52,.02,n*.42,.45,.02,n*.2,.1,0,n*.15,.52,.02,n*.2,.1,0,n*.12,.25,0],3)),s.computeVertexNormals();const r=new Ht(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,i.add(nt(ct.cyl,pt("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,i},trebuchet(){const i=new zt,t=new zt;i.add(t);const e=pt("#7a5232"),n=pt("#5f3e24");for(const h of[-1,1])t.add(nt(ct.box,n,h*.38,.2,0,.1,.1,1.6)),t.add(Ci([h*.38,.2,-.55],[h*.38,1.25,0],.045,e)),t.add(Ci([h*.38,.2,.55],[h*.38,1.25,0],.045,e));t.add(nt(ct.box,n,0,.2,.6,.86,.08,.1)),t.add(nt(ct.box,n,0,.2,-.6,.86,.08,.1));const s=nt(ct.cyl,We("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const h of[-1,1])for(const l of[-.6,.6]){const u=Qh(.17,h*.5,.17,l);t.add(u),r.push(u)}const o=new zt;o.position.set(0,1.25,0),o.add(nt(ct.box,e,0,0,.35,.08,.08,1.7));const a=nt(ct.box,n,0,-.18,-.45,.32,.3,.3);o.add(a);for(let h=0;h<5;h++)o.add(nt(ct.sph,pt("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const c=nt(ct.cone,pt("#6b4a26"),0,0,1.25,.11,.24,.11);c.rotation.x=Math.PI/2,o.add(c),o.add(nt(ct.sph,Ri("#ff8a2a"),0,.06,1.25,.05)),o.rotation.x=.75,o.rotation.y=Math.PI,t.add(o);for(const h of[-1,1]){const l=gs({fur:"#c96a2d"});l.scale.setScalar(.72),l.position.set(h*.72,.05,-.25),l.rotation.y=-h*.5,l.userData.anim.armR.rotation.x=-2.2,t.add(l)}o.userData.keep=!0;for(const h of r)h.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:r,throwArm:o,rest:.75},i},elder(){const i=gs({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=i.userData.anim;i.scale.setScalar(1.28);const e=nt(new Bn(.3,.55,10,1,!0),pt("#5a6b34",{side:un}),0,.3,0);t.body.add(e),t.head.add(nt(ct.cone,pt("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,o=nt(ct.cone,pt(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);o.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(o)}const n=new zt;n.add(nt(ct.cyl,pt("#5a3d24"),0,.25,0,.025,1,.025)),n.add(nt(ct.oct,Ri("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;n.add(Ci([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,pt("#5a3d24")))}return Kn(t.armL,n,.9),t.armL.rotation.x=-.6,t.gem=n.children[1],t.gem.userData.keep=!0,i},scaleguard(){const i=_s({scale:"#3f8f4a",belly:"#d9cf86"}),t=i.userData.anim;t.head.add(nt(ct.cap,We("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(nt(ct.brim,We("#b8862e"),0,.04,.01,.12,1,.15)),t.head.add(nt(ct.box,We("#b8862e"),0,.12,-.02,.015,.06,.18)),Kn(t.armR,Wx(1.15),.9);const e=Zh(.2,We("#a8762a"),We("#e0b050"));return Kn(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),i},spitter(){const i=_s({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=i.userData.anim;return t.head.add(nt(ct.sph,Ri("#8aff5a"),0,-.04,.16,.035)),t.body.add(nt(ct.ico,pt("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(nt(ct.sph,Ri("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,i},sidewinder(){const i=_s({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=i.userData.anim;for(let e=0;e<6;e++)t.body.add(nt(ct.oct,pt("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const n=nt(ct.cone,pt("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);n.rotation.z=-e*.4,t.head.add(n);const s=nt(new En(.13,.014,4,12,Math.PI*.9),We("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,Kn(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,i},brute(){const i=_s({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=i.userData.anim;i.scale.setScalar(2.15);for(let e=0;e<7;e++){const n=nt(ct.cone,pt("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);n.rotation.x=-1.1,t.body.add(n)}for(const e of[-1,1]){const n=nt(ct.cone,pt("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);n.rotation.set(-.6,0,-e*.6),t.head.add(n),t.body.add(nt(new En(.06,.015,4,10).rotateX(Math.PI/2),We("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),i},engine(){const i=new zt,t=new zt;i.add(t);const e=pt("#4a3a2a"),n=pt("#3a2c20");t.add(nt(ct.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const c of[-1,1])for(const h of[-.45,.45]){const l=Qh(.21,c*.47,.21,h);t.add(l),s.push(l)}const r=nt(ct.ico,pt("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const c of[-1,1])t.add(nt(ct.cone,pt("#f4ecd8"),c*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(nt(ct.sph,Ri("#8aff5a"),c*.1,.62,.88,.035));for(const c of[-1,1])t.add(Ci([c*.3,.45,-.3],[c*.2,1.05,-.1],.04,n));const o=new zt;o.position.set(0,1.05,-.1),o.add(nt(ct.box,e,0,0,.35,.08,.08,.9)),o.add(nt(ct.cap,pt("#3a2c20",{side:un}),0,.02,.8,.14,.08,.14).rotateX(Math.PI));const a=nt(ct.sph,pt("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);a.userData.keep=!0,o.add(a),o.rotation.x=-.55,t.add(o);for(let c=0;c<3;c++)t.add(nt(ct.sph,pt("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+c*.2,.55,-.55,.08));for(const c of[-1,1]){const h=_s({scale:"#3f8f4a",belly:"#d9cf86"});h.scale.setScalar(.72),h.position.set(c*.72,.05,-.35),h.rotation.y=-c*.5,t.add(h)}o.userData.keep=!0;for(const c of s)c.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:s,throwArm:o,rest:-.55,globe:a},i},hierophant(){const i=_s({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=i.userData.anim;i.scale.setScalar(1.32);for(let n=0;n<5;n++){const s=(n/4-.5)*1.6,r=nt(ct.cone,We("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const n of[-1,1])t.body.add(nt(new En(.05,.014,4,10).rotateX(Math.PI/2),We("#e0b040"),n*.15,.45,.05));const e=new zt;return e.add(nt(ct.cyl,pt("#2a1a40"),0,.25,0,.022,1,.022)),e.add(nt(ct.sph,Ri("#c070ff"),0,.82,0,.08)),e.add(nt(new En(.1,.012,4,14),We("#e0b040"),0,.82,0)),Kn(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,i}};function $x(i,t,e){const n=new zt;n.add(Gx(t.base,e));const s=Xx[i]();return s.position.y=t.big?.09:.06,s.userData.y0=s.position.y,n.add(s),n.userData.fig=s,n.userData.anim=s.userData.anim,n.userData.phase=Math.random()*10,qa(n.children[0]),qa(s),n.traverse(r=>{r.isMesh&&(r.castShadow=!0)}),n.children[0].traverse(r=>{r.isMesh&&(r.receiveShadow=!0)}),n}function jx(i){for(const t of["position","normal"]){const e=i.getAttribute(t);for(let n=0;n<e.count;n+=3){const s=e.getX(n+1),r=e.getY(n+1),o=e.getZ(n+1);e.setXYZ(n+1,e.getX(n+2),e.getY(n+2),e.getZ(n+2)),e.setXYZ(n+2,s,r,o)}}}const Ra=new Map;function qx(i){return[i.metalness,i.roughness,i.emissiveIntensity>0?i.emissive.getHex():0,i.emissiveIntensity,i.transparent,i.opacity,i.side,i.flatShading].join("|")}function qa(i){i.updateMatrixWorld(!0);const t=new le().copy(i.matrixWorld).invert(),e=new le,n=new Map,s=[],r=o=>{for(const a of o.children){if(a.userData.keep){qa(a);continue}if(a.isMesh){const c=a.material,h=qx(c);n.has(h)||n.set(h,{m:c,geos:[]});const l=a.geometry.index?a.geometry.toNonIndexed():a.geometry,u=new be;u.setAttribute("position",l.getAttribute("position").clone()),u.setAttribute("normal",l.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,a.matrixWorld)),e.determinant()<0&&jx(u);const f=u.getAttribute("position").count,p=new Float32Array(f*3);for(let g=0;g<f;g++)p.set([c.color.r,c.color.g,c.color.b],g*3);u.setAttribute("color",new pn(p,3)),n.get(h).geos.push(u),s.push(a)}r(a)}};r(i);for(const o of s)o.parent.remove(o);for(const[o,{m:a,geos:c}]of n)Ra.has(o)||Ra.set(o,new Cn({vertexColors:!0,metalness:a.metalness,roughness:a.roughness,flatShading:a.flatShading,emissive:a.emissive,emissiveIntensity:a.emissiveIntensity,transparent:a.transparent,opacity:a.opacity,side:a.side})),i.add(new Ht(Hx(c),Ra.get(o)))}const Os=["melee","raider","line","shooter","hero","artillery"];async function Mf(i,t,e,n){e==="move"?await Yx(i,t,n):e==="shoot"?await Kx(i,t,n):e==="charge"&&await Jx(i,t,n)}const yf=i=>i.t.pts*i.alive/i.t.models;function Fi(i,t){return i.t.melee?fo(i.alive*i.t.A,dr(i.t.WS,i.mesmerized?1:0),i.t.melee,t,!1).value:0}function Sf(i,t,e,n,s){var h;const r=t.t.ranged;if(!r||Ft(e.pos.x-n.x,e.pos.z-n.z)-t.r-e.r>r.range||tn(i,e)&&!r.spell)return 0;const a=vf(i,t,e,n);if(!a.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return a.visible?Vi(r.spell)*(yf(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((h=e.t.ranged)!=null&&h.blast?8:0)):0;let c=0;if(r.heavy&&s&&c++,r.indirect&&!a.visible&&c++,r.blast){const l=r.spell?Vi(r.spell):to(dr(t.t.BS,c)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return Us(t,r,!1)*l*fo(u,1,r,e,a.cover).value}return fo(Us(t,r,!1),dr(t.t.BS,c),r,e,a.cover).value}async function Yx(i,t,e){const n=i.units.filter(r=>r.side===t&&ee(r));n.sort((r,o)=>Os.indexOf(r.t.ai)-Os.indexOf(o.t.ai));const s=new Set;for(const r of n){if(!ee(r)||r.flags.moved)continue;const o=r.t.ai;if(tn(i,r)){const u=Ro(i,r),f=u.reduce((d,v)=>d+Fi(v,r),0),p=u.reduce((d,v)=>Math.max(d,Fi(r,v)),0);if(o==="melee"||o==="line"||p>=f*.8)continue;const g=hr(i,r);let _=-1,m=-1/0;for(let d=0;d<i.nav.N;d+=2){if(!Ao(i,g,d))continue;const v=i.nav.x(d),x=i.nav.z(d),M=Math.min(...oi(i,r).map(P=>Ft(P.pos.x-v,P.pos.z-x)-P.r));M>m&&(m=M,_=d)}_>=0&&(e.focus(r.pos.x,r.pos.z),await e.doMove(r,_,g));continue}let a=hr(i,r,r.flags.advanced?r.flags.advRoll:0),c=tu(i,r,a,s);const h=Math.min(...oi(i,r).map(u=>xi(r,u)));let l=!1;if(o==="melee"||o==="line"||o==="raider"?l=h>r.t.M+8&&!(o==="line"&&c.onObjective)&&!(o==="raider"&&c.canShoot):o==="shooter"&&(l=!c.canShoot&&!c.onObjective&&(r.t.ranged.assault||h>r.t.ranged.range+r.t.M+3)),l&&!r.flags.advanced){e.focus(r.pos.x,r.pos.z);const u=await e.doAdvance(r);a=hr(i,r,u);const f=tu(i,r,a,s);f.cell>=0&&(c=f)}c.obj>=0&&s.add(c.obj),c.cell>=0&&c.dist>.4?(e.focus(r.pos.x,r.pos.z),await e.doMove(r,c.cell,a)):r.flags.advanced&&(r.flags.moved=!0),await je(.05)}}function tu(i,t,e,n){const{nav:s}=i,r=oi(i,t),o=mf(i,t),a=i.objectives.map(p=>bc(i,p)),c=t.t.ai,h={enemies:r,friends:o,owners:a,claimed:n,role:c};let l={cell:-1,score:eu(i,t,t.pos.x,t.pos.z,h,!1),dist:0,...h.last};const u=t.t.M>8?3:2,f=e.res;for(let p=0;p<s.nz;p+=u)for(let g=p/u%2?1:0;g<s.nx;g+=u){const _=p*s.nx+g;if(!isFinite(f.dist[_])||!Ao(i,e,_))continue;const m=s.x(_),d=s.z(_),v=eu(i,t,m,d,h,!0)+ar(i.rng)*.05;v>l.score&&(l={cell:_,score:v,dist:Ft(m-t.pos.x,d-t.pos.z),...h.last})}return l}function eu(i,t,e,n,s,r){const{enemies:o,friends:a,owners:c,claimed:h,role:l}=s,u=t.t,f={x:e,z:n},p=r&&Ft(e-t.pos.x,n-t.pos.z)>.3;let g=0,_=!1,m=-1;if(u.OC>0){const M=l==="line"||l==="shooter"?5:l==="melee"?2:2.5;let P=0;for(const w of i.objectives){const T=Ft(w.x-e,w.z-n),N=c[w.i]===t.side?.45:1,y=h.has(w.i)?.25:1;let b;T<=2.6?b=M*N*y*1.4:b=M*N*y*Math.max(0,1-(T-2.6)/16)*.7,b>P&&(P=b,T<=2.6?(_=!0,m=w.i):_||(m=-1))}g+=P}let d=!1;if(u.ranged&&l!=="melee"){let M=0;for(const w of o){const T=Sf(i,t,w,f,p);T>M&&(M=T)}M>0&&(d=!0),g+=M*(l==="artillery"?.25:l==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(l==="melee"||l==="line"||l==="raider"||l==="hero"){let M=0;for(const w of o){const T=Ft(w.pos.x-e,w.pos.z-n)-t.r-w.r;if(T>Eo)continue;const N=T<=1?1:Vi(Math.ceil(T)),y=Fi(w,t)*.4,b=N*(Fi(t,w)-y+(w.t.role==="Artillery"?10:0));b>M&&(M=b)}if(g+=M*(l==="melee"?.3:l==="raider"?.18:l==="hero"?.06:.15),M===0&&l!=="hero"){const w=Math.min(...o.map(T=>Ft(T.pos.x-e,T.pos.z-n)));g-=w*(l==="melee"?.12:.05)}}const v=l==="shooter"||l==="artillery"||l==="hero";for(const M of o){const P=Ft(M.pos.x-e,M.pos.z-n)-t.r-M.r;M.t.brawler&&P<M.t.M+7&&(g-=Fi(M,t)*(v?.16:.05)*(1-P/(M.t.M+7)))}const x=i.nav.index(e,n);if(x>=0&&i.nav.cover[x]&&(g+=v?1.5:.5),l==="artillery"&&p&&(g-=2.5),l==="hero"){let M=0;for(const w of a)Ft(w.pos.x-e,w.pos.z-n)<=wo+w.r&&M++;g+=Math.min(3,M)*.9;const P=Math.min(...o.map(w=>Ft(w.pos.x-e,w.pos.z-n)));P<8&&(g-=(8-P)*.6)}for(const M of a){const P=Ft(M.pos.x-e,M.pos.z-n)-M.r-t.r;P<1.5&&(g-=(1.5-P)*.6)}return s.last={onObjective:_,obj:m,canShoot:d},g}async function Kx(i,t,e){const n=i.units.filter(s=>s.side===t&&mo(i,s));n.sort((s,r)=>Os.indexOf(r.t.ai)-Os.indexOf(s.t.ai));for(const s of n){if(!mo(i,s))continue;const r=Mc(i,s);let o=null,a=.4;for(const c of r){let h=Sf(i,s,c,s.pos,s.flags.moved);const l=s.t.ranged;if(l.blast)for(const u of i.units){if(u.side!==s.side||!ee(u))continue;const f=Ft(u.pos.x-c.pos.x,u.pos.z-c.pos.z)-u.r;f<l.blast+2.5&&(h-=yf(u)*.25*(1-Math.max(0,f)/(l.blast+2.5)))}l.mesmerize&&c.mesmerized&&(h*=.2),h>a&&(a=h,o=c)}o&&(e.focus((s.pos.x+o.pos.x)/2,(s.pos.z+o.pos.z)/2),await e.doShoot(s,o),await je(.1))}}async function Jx(i,t,e){const n=i.units.filter(s=>s.side===t&&go(i,s));n.sort((s,r)=>Os.indexOf(s.t.ai)-Os.indexOf(r.t.ai));for(const s of n){if(!go(i,s))continue;const r=s.t.ai;let o=null,a=0;for(const c of Hs(i,s)){const h=yr(i,s,c);if(!h)continue;const l=Vi(h.need),u=Fi(s,c)+(c.t.role==="Artillery"?12:0)+(c.alive<=2?6:0),f=Fi(c,s);if(l<(r==="melee"?.25:r==="line"?.33:r==="raider"?.4:r==="hero"?.5:.6)||(r==="shooter"||r==="hero")&&u<f*1.4)continue;const g=l*(u-f*.4);g>a&&(a=g,o=c)}o&&(e.focus((s.pos.x+o.pos.x)/2,(s.pos.z+o.pos.z)/2),await e.doCharge(s,o,{auto:!0}),await je(.1))}}let Je=null,As=null,Qn=!1;try{Qn=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function Po(){if(!Je)try{Je=new(window.AudioContext||window.webkitAudioContext),As=Je.createGain(),As.gain.value=Qn?0:.5,As.connect(Je.destination)}catch{Je=null}}function Zx(){Qn=!Qn;try{localStorage.setItem("tails-and-scales:muted",Qn?"1":"0")}catch{}return As&&(As.gain.value=Qn?0:.5),Qn}const Qx=()=>Qn;function tM(i){const t=Math.floor(Je.sampleRate*i),e=Je.createBuffer(1,t,Je.sampleRate),n=e.getChannelData(0);for(let r=0;r<t;r++)n[r]=Math.random()*2-1;const s=Je.createBufferSource();return s.buffer=e,s}function bf(i,t,e,n,s){const r=Je.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(n,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),i.connect(r),r.connect(As),r}function vs({dur:i=.3,freq:t=800,type:e="lowpass",peak:n=.5,delay:s=0,q:r=1}){const o=Je.currentTime+s,a=tM(i),c=Je.createBiquadFilter();c.type=e,c.frequency.value=t,c.Q.value=r,a.connect(c),bf(c,o,.005,n,i),a.start(o)}function Pi({f0:i=440,f1:t=i,dur:e=.15,type:n="sine",peak:s=.2,delay:r=0}){const o=Je.currentTime+r,a=Je.createOscillator();a.type=n,a.frequency.setValueAtTime(i,o),a.frequency.exponentialRampToValueAtTime(Math.max(20,t),o+e),bf(a,o,.01,s,e),a.start(o),a.stop(o+e+.05)}const eM={dice(i=3){for(let t=0;t<Math.min(6,i);t++)vs({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(i=1){vs({dur:.5+i*.5,freq:300+200/i,peak:.8}),Pi({f0:90,f1:30,dur:.5+i*.3,type:"sine",peak:.5})},shot(){Pi({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){vs({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},squeak(){Pi({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){vs({dur:.35,freq:5e3,type:"highpass",peak:.18})},crumble(){vs({dur:.8,freq:500,peak:.45});for(let i=0;i<4;i++)vs({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+i*.09})},magic(){for(let i=0;i<4;i++)Pi({f0:500+i*220,f1:900+i*300,dur:.25,type:"sine",peak:.08,delay:i*.06})},fizzle(){Pi({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((i,t)=>Pi({f0:i,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){Pi({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},Pe=new Proxy(eM,{get(i,t){return(...e)=>{if(!(!Je||Qn))try{i[t](...e)}catch{}}}}),{W:ke,H:Xe}=dn,yt=i=>document.querySelector(i),Rn=new URLSearchParams(location.search),qe=new Hu({antialias:!0});qe.setPixelRatio(Rn.has("lowfi")?.5:Math.min(devicePixelRatio,2));qe.setSize(innerWidth,innerHeight);qe.shadowMap.enabled=!Rn.has("lowfi");qe.shadowMap.type=uu;qe.toneMapping=fu;qe.toneMappingExposure=1.05;document.body.prepend(qe.domElement);const ae=new cv;ae.background=new jt("#1c1712");ae.fog=new rc("#1c1712",70,140);const de=new ln(40,innerWidth/innerHeight,.1,400);de.position.set(0,30,31);const Ne=new Iv(de,qe.domElement);Ne.target.set(0,0,1.5);Ne.enableDamping=!0;Ne.dampingFactor=.08;Ne.maxPolarAngle=1.32;Ne.minDistance=5;Ne.maxDistance=75;Ne.screenSpacePanning=!1;Ne.mouseButtons={LEFT:Zn.ROTATE,MIDDLE:Zn.DOLLY,RIGHT:Zn.PAN};ae.add(new Tv("#d6e6ff","#3b2a1a",.85));const Yi=new qu("#fff0d6",2.3);Yi.position.set(-16,34,20);Yi.castShadow=!0;Yi.shadow.mapSize.set(2048,2048);Object.assign(Yi.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90});Yi.shadow.bias=-4e-4;Yi.shadow.normalBias=.02;ae.add(Yi);const Ef=new qu("#9fb8ff",.35);Ef.position.set(18,12,-16);ae.add(Ef);const wf=yt("#labels"),se=new kx(ae,de,wf);function nM(){const i=document.createElement("canvas");i.width=2048,i.height=Math.round(2048*Xe/ke);const t=i.getContext("2d");t.fillStyle="#5b7a36",t.fillRect(0,0,i.width,i.height);const e=(s,r,o,a,c)=>{for(let h=0;h<r;h++)t.globalAlpha=c*(.4+Math.random()*.6),t.fillStyle=s[Math.random()*s.length|0],t.beginPath(),t.ellipse(Math.random()*i.width,Math.random()*i.height,o+Math.random()*(a-o),o+Math.random()*(a-o),Math.random()*3,0,Math.PI*2),t.fill()};e(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),e(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),e(["#8fa65a","#a4b46a"],300,4,14,.4);for(let s=0;s<14e3;s++)t.globalAlpha=.35,t.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",t.fillRect(Math.random()*i.width,Math.random()*i.height,2,4+Math.random()*4);t.globalAlpha=1;const n=new ac(i);return n.colorSpace=Te,n.anisotropy=qe.capabilities.getMaxAnisotropy(),n}function iM(){const i=document.createElement("canvas");i.width=i.height=512;const t=i.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+n)*4);t.stroke()}const e=new ac(i);return e.colorSpace=Te,e.wrapS=e.wrapT=so,e.repeat.set(6,6),e}const sM=new Cn({map:nM(),roughness:.95}),wc=new Ht(new yi(ke,Xe).rotateX(-Math.PI/2),sM);wc.receiveShadow=!0;ae.add(wc);const Tc=new Ht(new yi(220,220).rotateX(-Math.PI/2),new Cn({map:iM(),roughness:.7}));Tc.position.y=-.62;Tc.receiveShadow=!0;ae.add(Tc);{const i=new Cn({color:"#5a3a22",roughness:.6}),t=[[ke+1.6,.8,.8,0,-Xe/2-.4],[ke+1.6,.8,.8,0,Xe/2+.4],[.8,.8,Xe,-ke/2-.4,0],[.8,.8,Xe,ke/2+.4,0]];for(const[n,s,r,o,a]of t){const c=new Ht(new Fn(n,s,r),i);c.position.set(o,-.22,a),c.castShadow=c.receiveShadow=!0,ae.add(c)}const e=new Ht(new Fn(ke,.6,Xe),i);e.position.y=-.31,ae.add(e)}const mr=[],Tf=[];for(const i of[0,1]){const t=cf[i],e=new Ke({transparent:!0,opacity:.07,depthWrite:!1});mr.push(e);const n=new Ht(new yi(dn.deploy,Xe).rotateX(-Math.PI/2),e);n.position.set(t*(ke/2-dn.deploy/2),.008,0),n.renderOrder=1,ae.add(n);const s=[];for(let o=-Xe/2;o<Xe/2;o+=1)s.push(new R(t*(ke/2-dn.deploy),.02,o),new R(t*(ke/2-dn.deploy),.02,o+.5));const r=new oc({transparent:!0,opacity:.5});Tf.push(r),ae.add(new uv(new be().setFromPoints(s),r))}const Ms=new sr(new Bn(.035,.13,3),new Cn({color:"#ffffff",roughness:1}),700),ys=new sr(new kn(.05,0),new Cn({roughness:.6}),140);ae.add(Ms,ys);function rM(){const i=new le,t=new zn,e=new Fs,n=new jt;for(let r=0;r<Ms.count;r++){const o=(Math.random()-.5)*(ke-.4),a=(Math.random()-.5)*(Xe-.4),c=.6+Math.random()*1.2;t.setFromEuler(e.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),i.compose(new R(o,.08*c,a),t,new R(c,c,c)),Ms.setMatrixAt(r,i),Ms.setColorAt(r,n.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][r%4]))}const s=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let r=0;r<ys.count;r++){const o=(Math.random()-.5)*(ke-.4),a=(Math.random()-.5)*(Xe-.4);i.compose(new R(o,.08,a),t.identity(),new R(1,.6,1)),ys.setMatrixAt(r,i),ys.setColorAt(r,n.set(s[r%s.length]))}Ms.instanceMatrix.needsUpdate=ys.instanceMatrix.needsUpdate=!0,Ms.instanceColor.needsUpdate=ys.instanceColor.needsUpdate=!0}const Af=lf.map((i,t)=>{const e=new zt;e.position.set(i.x,0,i.z);const n=new Ht(new rn(.55,.65,.16,8),pt("#8a8478"));n.position.y=.08,n.castShadow=n.receiveShadow=!0;const s=new Ht(new bo(.2,0),new Cn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));s.position.y=.42;const r=new Ht(new rn(.03,.03,2.1,6),pt("#5a3d24"));r.position.set(.35,1.1,0),r.castShadow=!0;const o=new Cn({color:"#e8e0d0",side:un,roughness:.8}),a=new Ht(new yi(.8,.5,6,1).translate(.4,0,0),o);a.position.set(.35,1.85,0),a.castShadow=!0;const c=new Ht(new ji(uo-.06,uo,64).rotateX(-Math.PI/2),new Ke({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return c.position.y=.03,e.add(n,s,r,a,c),ae.add(e),{i:t,g:e,gem:s,flag:a,flagMat:o,ring:c,owner:-1}}),Rf=new zx(ae,se);Rf.onBreak=i=>{i.kind==="block"?Pe.crumble():Pe.thwack()};function Lo(){U.out.length&&Rf.play(U.out.splice(0))}const $={seed:Number(Rn.get("seed"))||Math.random()*1e6|0,control:["human","ai"],busy:!1,sel:null,reach:null,hover:null,follow:!0},Cf=(()=>{if(!Rn.has("races"))return po;const i=Rn.get("races").split(",").map(n=>n.trim().toLowerCase());if(i.length===2&&i.every(n=>ri[n]))return i;const t=`?races= takes two of ${Object.keys(ri).join(", ")}, comma-separated, not "${Rn.get("races")}"`;console.warn(`${t}: playing the classic matchup`);const e=document.createElement("p");return e.className="small",e.textContent=`${t}, so this is the classic matchup.`,yt("#title .modes").before(e),po})();let U=null;const oM=Math.random()*1e9|0;let Bi=null;const aM=Rn.has("debug")?(i,t)=>Bi==null?void 0:Bi.line(i,t):null;let ce=gc(xc(Cf,$.control));function cM(){ce=gc(U.seats),Lf()}const Pf=document.createElement("style");document.body.appendChild(Pf);const nu=i=>`rgba(${[1,3,5].map(t=>parseInt(i.slice(t,t+2),16)).join(", ")}, 0.45)`;function Lf(){Pf.textContent=`#hud, #labels, #log, #card { --s0: ${ce[0].color}; --s1: ${ce[1].color}; --s0-glow: ${nu(ce[0].color)}; --s1-glow: ${nu(ce[1].color)}; }`;for(const i of[0,1]){const t=i?"#sideB":"#sideA";yt(`${t} .ic`).textContent=ce[i].icon,yt(`${t} .nm`).textContent=ce[i].name,mr[i].color.set(ce[i].color),Tf[i].color.set(ce[i].color)}}Lf();const Df=i=>i>=0&&ef(U.seats)?ce[i].color:"",Hn=i=>Xa(U,i)==="human",_o=new Map,Ln=i=>_o.get(i.id),Ac=(i,t)=>Ln(i).models[i.models.indexOf(t)],gr=i=>Ln(i).models.filter((t,e)=>i.models[e].alive);function lM(i){const t=-To(U,i.side)*Math.PI/2,e={facing:t,moving:!1,models:[]};for(let n=0;n<i.t.models;n++){const s=$x(i.key,i.t,ce[i.side].color);ae.add(s),e.models.push({mesh:s,x:0,z:0,yaw:t,lunge:0,lungeDir:0,lift:0})}e.ring=new Ht(new ji(.88,1,48).rotateX(-Math.PI/2),new Ke({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),e.ring.position.y=.04,e.ring.renderOrder=2,ae.add(e.ring),e.hit=new Ht(new rn(1,1,1,12),new Ke({visible:!1})),e.hit.userData.unit=i,ae.add(e.hit),e.label=document.createElement("div"),e.label.className=`ulabel s${i.side}`,wf.appendChild(e.label),_o.set(i.id,e),Rc(i),i.models.forEach((n,s)=>{const r=e.models[s];r.x=Gs(i,n),r.z=Vs(i,n),r.mesh.position.set(r.x,0,r.z),r.mesh.rotation.y=r.yaw})}function Rc(i){const t=Ln(i);t.ring.scale.setScalar(i.r+.18);const e=i.t.big?2.4:i.t.fly?1.8:1.3;t.hit.scale.set(i.r,e,i.r),t.ring.position.x=t.hit.position.x=i.pos.x,t.ring.position.z=t.hit.position.z=i.pos.z,t.hit.position.y=t.hit.scale.y/2}function Do(i,t,e){af(i,t,e),Rc(i)}function Vn(i){const t=i.models.filter(s=>s.alive);let e=`<span class="nm">${i.t.short}</span>`;i.t.models>1?e+=`<span class="ct">${i.alive}/${i.t.models}</span>`:e+=`<span class="ct">${t[0]?t[0].w:0}/${i.t.W}♥</span>`,i.mesmerized&&(e+='<span class="st" title="Mesmerized">🌀</span>'),ee(i)&&tn(U,i)&&(e+='<span class="st" title="In combat">⚔</span>');const n=Ln(i);n.label.innerHTML=e,n.label.style.display=ee(i)?"":"none"}function hM(){for(const i of _o.values()){for(const t of i.models)ae.remove(t.mesh);ae.remove(i.ring,i.hit),i.label.remove()}_o.clear()}async function If(i,t,{speed:e=7,fly:n=!1}={}){const s=sf(t);if(s<.05)return;const r=Ln(i);if(r.moving=!0,n)for(const l of r.models)l.flying=!0;const o=[];let a=0;for(let l=1;l<t.length;l++){const u=Ft(t[l].x-t[l-1].x,t[l].z-t[l-1].z);o.push({a:t[l-1],b:t[l],s:a,l:u}),a+=u}const c=[];if(i.t.wrecker)for(const l of o)for(let u=0;u<l.l;u+=.25)c.push({s:l.s+u,x:l.a.x+(l.b.x-l.a.x)*u/l.l,z:l.a.z+(l.b.z-l.a.z)*u/l.l,dir:Math.atan2(l.b.x-l.a.x,l.b.z-l.a.z)});i.t.wrecker&&c.push({s,x:t[t.length-1].x,z:t[t.length-1].z,dir:Math.atan2(o[o.length-1].b.x-o[o.length-1].a.x,o[o.length-1].b.z-o[o.length-1].a.z)});let h=0;for(await Ae(s/e+.15,l=>{const u=Math.min(s,l*(s+e*.15)),f=o.find(m=>u<=m.s+m.l)||o[o.length-1],p=f.l>0?(u-f.s)/f.l:1,g=On(f.a.x,f.b.x,p),_=On(f.a.z,f.b.z,p);if(r.facing=Math.atan2(f.b.x-f.a.x,f.b.z-f.a.z),Do(i,g,_),n)for(const m of r.models)m.lift=Math.sin(Math.min(1,u/s)*Math.PI)*Math.min(3,s*.3);for(;h<c.length&&c[h].s<=u;)iu(i,c[h++])},Ec);h<c.length;)iu(i,c[h++]);if(r.moving=!1,n)for(const l of r.models)l.flying=!1,l.lift=0;await je(.15)}function iu(i,{x:t,z:e,dir:n}){for(const s of U.terrain.chunks){if(!s.alive||!s.destructible)continue;const r=s.nav||s.shape;Ft(r.x-t,r.z-e)<i.r+Math.max(r.hx,r.hz)*.8&&(U.terrain.hurt(s,99,{x:t-Math.sin(n),z:e-Math.cos(n)},U.out),Lo(),se.shake=Math.max(se.shake,.08))}}async function Cc(i,t,e){$.busy=!0;const n=U.nav.path(e.res,t,i.r,e.mode==="fly"?null:e.forbid);i.flags.moved=!0,e.fallback&&(i.flags.fellBack=!0);const s=sf(n);Oe(i.side,`<b>${i.t.short}</b> ${e.fallback?"fall back":i.flags.advanced?"advance":"move"} ${s.toFixed(1)}".`),i.t.wrecker&&s>.1&&Pe.boom(.4),await If(i,n,{fly:e.mode==="fly"}),qi(U),ni()}async function Pc(i){$.busy=!0,me.clear(`${i.t.short} — Advance`);const t=$e(U,1);return await me.row("Advance D6",t,0,{sum:!0,note:`+${t[0]}"`}),i.flags.advanced=!0,i.flags.advRoll=t[0],Oe(i.side,`<b>${i.t.short}</b> advance: +${t[0]}".`),$.busy=!1,t[0]}async function Lc(i,t){$.busy=!0;const e=i.t.ranged,n=ks(U,i,t);if(i.flags.shot=!0,Uc(i,t),me.clear(`${i.t.short} → ${t.t.short} · ${e.name}`),e.spell){const g=$e(U,2),_=g[0]+g[1]>=e.spell;return await me.row(`Cast ${e.spell}+ (2D6)`,g,0,{sum:!0,pass:_}),_?(Pe.magic(),e.mesmerize?mM(i,t):(Oe(i.side,`<b>${i.t.short}</b> casts <b>${e.name}</b> on ${t.t.short}!`),await pM(i,t,e),ni())):(Pe.fizzle(),se.text(Rs(i),"Fizzle…","#c8b8ff"),Oe(i.side,`<b>${i.t.short}</b> tries ${e.name} — it fizzles (${g[0]+g[1]}).`),ni())}if(e.blast)return await fM(i,t,e,n),ni();const s=Us(i,e,!1);await uM(i,t,e);const r=$e(U,s),o=ii(r,n.need);await me.row(`Hit ${n.need}+`,r,n.need);const a=xr(e.S,t.t.T,e.poison),c=$e(U,o),h=ii(c,a);o&&await me.row(`Wound ${a}+`,c,a);const l=Mr(t.t.Sv,e.AP,n.cover),u=$e(U,h),f=l>6?h:h-ii(u,l);h&&await me.row(l>6?"No save":`Save ${l}+${n.cover?" (cover)":""}`,l>6?[]:u,l,{save:!0});const p=await Io(t,f,e.D,i);Oe(i.side,`<b>${i.t.short}</b> shoot ${t.t.short}: ${o} hit, ${h} wound, ${f} unsaved${p?` — <b>${p} slain</b>`:""}.`),ni()}async function uM(i,t,e){const n=gr(i),s=gr(t),r=[],o=Math.min(10,n.length*e.shots);for(let a=0;a<o;a++){const c=n[a%n.length],h=s[Math.random()*s.length|0],l={x:c.x,y:gf(i)*.8+c.lift,z:c.z},u={x:h.x+(Math.random()-.5)*.6,y:_f(t)*.8,z:h.z+(Math.random()-.5)*.6};r.push(je(a*.06).then(()=>(Pe.shot(),se.projectile(l,u,Uf(e.fx)))).then(()=>{for(let f=0;f<5;f++)se.mote({x:u.x,y:u.y,z:u.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:e.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(r)}const fi={acorn:new fn(.07,6,5),dart:new Bn(.03,.3,4).rotateX(Math.PI/2),javelin:new rn(.02,.02,.9,4).rotateX(Math.PI/2),spit:new kn(.08,0),bomb:new fn(.11,8,6),pinecone:new Bn(.2,.42,7),acid:new fn(.24,12,8)};function Uf(i){const t=e=>new Ke({color:e,toneMapped:!1});switch(i){case"acorn":return{mesh:new Ht(fi.acorn,pt("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new Ht(fi.dart,pt("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new Ht(fi.javelin,pt("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new Ht(fi.spit,t("#9aff5a")),arc:.12,speed:18,trail:e=>se.mote({x:e.x,y:e.y,z:e.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new Ht(fi.bomb,pt("#7a4a22")),arc:.45,speed:14,trail:e=>se.mote({x:e.x,y:e.y+.1,z:e.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new Ht(fi.pinecone,pt("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:e=>{se.mote({x:e.x,y:e.y,z:e.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),se.smoke({x:e.x,y:e.y,z:e.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new Ht(fi.acid,t("#8aff5a")),arc:.5,speed:15,trail:e=>se.mote({x:e.x,y:e.y,z:e.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new Ht(fi.acorn,pt("#888"))}}async function fM(i,t,e,n){const s=Us(i,e,!1);Oe(i.side,`<b>${i.t.short}</b> fire ${e.name} at ${t.t.short} (${n.need}+${n.visible?"":", unseen"}).`);for(let r=0;r<s&&!(!ee(i)||!ee(t)&&r>0);r++){const o=ar(U.rng)*Math.PI*2,a=ar(U.rng)*t.r*.5,c={x:t.pos.x+Math.cos(o)*a,z:t.pos.z+Math.sin(o)*a},h=se.ring(c.x,c.z,e.blast,"#ffffff",{hold:!0,fill:.12}),l=$e(U,1),u=l[0]>=n.need;await me.row(s>1?`Template ${r+1}: hit ${n.need}+`:`Hit ${n.need}+`,l,n.need);let f=c;if(!u){const p=$e(U,1)[0]+1,g=ar(U.rng)*Math.PI*2;f={x:Math.max(-ke/2+.3,Math.min(ke/2-.3,c.x+Math.cos(g)*p)),z:Math.max(-Xe/2+.3,Math.min(Xe/2-.3,c.z+Math.sin(g)*p))},await me.row("Scatter D6+1",[p-1],0,{sum:!0,note:`${p}"`}),se.text({x:c.x,y:1.5,z:c.z},`scatter ${p}"`,"#ffd36e",{size:15}),await Ae(.35,_=>h.position.set(On(c.x,f.x,_),.05,On(c.z,f.z,_)),Ns)}await dM(i,f,e),h.userData.remove(),await Nf(i,f,e)}}async function dM(i,t,e){const n=gr(i)[0],s=n.mesh.userData.anim;if(s!=null&&s.throwArm){const o=s.rest;Pe.thwack(),Ae(.25,a=>s.throwArm.rotation.x=o-2.1*Ns(a)).then(()=>Ae(.8,a=>s.throwArm.rotation.x=o-2.1*(1-a))),s.globe&&(s.globe.visible=!1),await je(.15)}else n.lunge=1,n.lungeDir=Math.atan2(t.x-n.x,t.z-n.z);const r={x:n.x,y:i.t.big?1.8:.9,z:n.z};Pe.shot(),await se.projectile(r,{x:t.x,y:.15,z:t.z},Uf(e.fx)),s!=null&&s.globe&&(s.globe.visible=!0)}async function pM(i,t,e){const n={x:t.pos.x,z:t.pos.z},s=Ln(i).models[0].mesh.userData.anim.gem;if(s){const a=new R;s.getWorldPosition(a);for(let c=0;c<20;c++)se.mote({x:a.x,y:a.y,z:a.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const r=[],o=new Bn(.12,1,5);for(let a=0;a<26;a++){const c=Math.random()*Math.PI*2,h=Math.sqrt(Math.random())*e.blast,l=new Ht(o,pt(a%3?"#5a7a2a":"#7a5a2a"));l.position.set(n.x+Math.cos(c)*h,-.6,n.z+Math.sin(c)*h),l.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),l.scale.set(1,.6+Math.random()*1.1,1),l.castShadow=!0,ae.add(l),r.push(l)}await Ae(.3,a=>r.forEach(c=>c.position.y=-.6+Ns(a)*(.3+c.scale.y*.4))),se.explode(n.x,n.z,e.blast,"thorns"),await Nf(i,n,e),Ae(1.2,a=>r.forEach(c=>c.position.y-=.02*a)).then(()=>r.forEach(a=>ae.remove(a)))}async function Nf(i,t,e){e.fx!=="thorns"&&(se.explode(t.x,t.z,e.blast,e.fx==="acid"?"acid":"fire"),Pe.boom(e.blast/2)),se.ring(t.x,t.z,e.blast,e.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2});const n=[];for(const r of U.units){if(!ee(r))continue;const o=r.models.filter(a=>a.alive&&Ft(Gs(r,a)-t.x,Vs(r,a)-t.z)<=e.blast+r.t.base*.6);o.length&&n.push({v:r,under:o})}for(const{v:r,under:o}of n){let a=o.length;r.t.big&&(a=Math.ceil(mc(U)/2)+1);const c=r.side===i.side,h=xr(e.S,r.t.T,e.poison),l=$e(U,a),u=ii(l,h);await me.row(`${c?"⚠ ":""}${r.t.short}: ${a} hit${a>1?"s":""} · wound ${h}+`,l,h);const f=Sc(U,r),p=Mr(r.t.Sv,e.AP,f),g=$e(U,u),_=p>6?u:u-ii(g,p);u&&p<=6&&await me.row(`Save ${p}+${f?" (cover)":""}`,g,p,{save:!0});const m=await Io(r,_,e.D,i,o);Oe(i.side,`${c?"<b>Friendly fire!</b> ":""}${e.name} hits ${r.t.short}: ${u} wound, ${_} unsaved${m?` — <b>${m} slain</b>`:""}.`)}n.length||await je(.25);const s=U.terrain.blast(t.x,t.z,e.blast,e.scenery||1,{acid:!!e.corrodes},U.out);Lo(),s.length&&Oe(i.side,`…and ${s.length} piece${s.length>1?"s":""} of scenery ${s.length>1?"are":"is"} wrecked.`),qi(U)}async function mM(i,t){const e=Rs(i),n=Rs(t),s=[];for(let a=0;a<=16;a++){const c=a/16;s.push(je(c*.3).then(()=>se.mote({x:On(e.x,n.x,c),y:On(e.y,n.y,c)+Math.sin(c*Math.PI)*.8,z:On(e.z,n.z,c),size:.09,color:"#c070ff",life:.7,g:0})))}await Promise.all(s);for(let a=0;a<3;a++)se.ring(t.pos.x,t.pos.z,t.r*(.6+a*.35),"#c070ff",{life:1.2+a*.3,fill:.08});const r=Math.ceil(mc(U)/2);await me.row("Mortal wounds D3",[r],0,{sum:!0,note:`${r}`});const o=await Io(t,r,1,i);t.mesmerized=!0,Vn(t),se.text(Rs(t),"Mesmerized!","#e0a0ff",{size:20}),Oe(i.side,`<b>${i.t.short}</b> mesmerizes ${t.t.short}: ${r} mortal wound${r>1?"s":""}${o?`, <b>${o} slain</b>`:""}. It can't shoot or charge next turn.`),ni()}async function Io(i,t,e,n,s=null){let r=0;for(let o=0;o<t;o++){const a=i.models.filter(f=>f.alive);if(!a.length)break;let c=s?a.filter(f=>s.includes(f)):[];c.length||(c=a);const h=c.filter(f=>f.w<i.t.W);let l;if(h.length)l=h[0];else{const f=p=>Ft(Gs(i,p)-n.pos.x,Vs(i,p)-n.pos.z);l=c.reduce((p,g)=>f(p)<f(g)?p:g)}l.w-=e;const u=Ac(i,l);se.text({x:u.x,y:i.t.big?2.3:1.3,z:u.z},`-${Math.min(e,e+Math.min(0,l.w))}`,"#ff5a4a",{size:i.t.big?24:18}),l.w<=0?(gM(i,l,n),r++):u.flash=.4,await je(.06)}return r&&(i.lost+=r,await je(.25),ee(i)&&Of(i)),Vn(i),r}function Of(i){const t=Ro(U,i);if(of(i),Rc(i),Vn(i),!t.length||tn(U,i))return;const e=t.reduce((r,o)=>xi(i,r)<xi(i,o)?r:o),n=yc(i,e),s=xi(i,e)-(zi-.3);Do(i,i.pos.x+(e.pos.x-i.pos.x)/n*s,i.pos.z+(e.pos.z-i.pos.z)/n*s)}function gM(i,t,e){const n=Ac(i,t);t.alive=!1,t.w=0,i.alive--,n.dying=!0;const s=ri[i.race].look;Pe[s.voice]();const r=n.mesh.userData.fig,o=e?Math.atan2(n.x-e.pos.x,n.z-e.pos.z)-n.yaw:0,a=Math.sin(o)>=0?1:-1;se.debris(n.x,.5,n.z,s.gore,6,{power:2,size:.07}),Ae(.6,c=>{r.rotation.z=a*c*1.45,r.position.y=(i.t.big?.09:.06)+Math.sin(c*Math.PI)*.15},Ns).then(()=>je(1.4)).then(()=>Ae(.8,c=>n.mesh.position.y=-c*1.4)).then(()=>{ae.remove(n.mesh),n.dying=!1}),ee(i)||zf(i,e)}function zf(i,t){const e=Ln(i);e.label.style.display="none",e.ring.visible=!1,e.hit.visible=!1,ae.remove(e.hit),U.journal.pendingLog.push([i.side,`<b>${i.t.name}</b> ${i.t.models>1?"are":"is"} destroyed!`,"big"]),se.text({x:i.pos.x,y:2.2,z:i.pos.z},`${i.t.short} destroyed`,ce[t?t.side:1-i.side].color,{size:20,life:2})}async function Dc(i,t,{auto:e=!1}={}){$.busy=!0;const n=yr(U,i,t);if(i.flags.chargeTried=!0,me.clear(`${i.t.short} charge ${t.t.short}`),!n)return Oe(i.side,`<b>${i.t.short}</b> can't find a way to ${t.t.short}.`),ni();const s=$e(U,2),r=s[0]+s[1],o=r>=n.need;if(await me.row(`Charge ${n.need}" (2D6)`,s,0,{sum:!0,pass:o}),Uc(i,t),!o)return se.text(Rs(i),"Charge failed","#d0d0d0"),Oe(i.side,`<b>${i.t.short}</b> charge ${t.t.short} — roll ${r}, needed ${n.need}. Failed.`),ni();i.flags.charged=!0,i.flags.chargeTarget=t.id,se.text(Rs(i),"CHARGE!",ce[i.side].color,{size:22}),Oe(i.side,`<b>${i.t.short}</b> charge ${t.t.short} — roll ${r} vs ${n.need}. <b>Contact!</b>`);const a=e||!Hn(i.side)?n.cell:await _M(i,t,n,r),c=U.nav.path(n.res,a,i.r,n.mode==="fly"?null:n.forbid);await If(i,c,{speed:11,fly:n.mode==="fly"}),qi(U);for(const h of[i,t])Vn(h);ni()}function _M(i,t,e,n){const s=new Uint8Array(U.nav.N);for(const r of e.spots)r.d<=n+.011&&(s[r.i]=1);return s[e.cell]=1,Nn.visible=!1,Wf(s,[255,150,60],150),Xf(e.cell,i.r),new Promise(r=>{$.chargePick={u:i,target:t,plan:e,rolled:n,ok:s,resolve:r},Pn()})}function Ff(i,t,e,n=2.4){const s=U.nav;let r=-1,o=n;for(let a=0;a<s.N;a++){if(!i.ok[a])continue;const c=Ft(s.x(a)-t,s.z(a)-e);c<o&&(o=c,r=a)}return r}function Ic(i){const t=$.chargePick;!t||i<0||!t.ok[i]||($.chargePick=null,Oc(),Fe.visible=!1,yt("#tooltip").style.display="none",Pn(),t.resolve(i))}async function su(i){if(!ee(i)||i.flags.fought)return;const t=Ro(U,i);if(!t.length)return;i.flags.fought=!0;const e=t.find(m=>m.id===i.flags.chargeTarget)||t.reduce((m,d)=>m.alive*m.t.W<d.alive*d.t.W?m:d),n=i.t.melee,s=i.mesmerized?1:0,r=dr(i.t.WS,s);Uc(i,e),(Hn(i.side)||Hn(e.side)||$.follow)&&kf(i.pos.x*.5+e.pos.x*.5,i.pos.z*.5+e.pos.z*.5),me.clear(`${i.t.short} fight ${e.t.short} · ${n.name}`);for(const m of gr(i))m.lunge=1,m.lungeDir=Math.atan2(e.pos.x-m.x,e.pos.z-m.z);Pe.thwack();const o=Us(i,n,!0),a=$e(U,o),c=ii(a,r);await me.row(`Hit ${r}+${s?" (mesmerized)":""}`,a,r);for(let m=0;m<Math.min(c,8);m++){const d=gr(e)[m%Math.max(1,e.alive)];if(d)for(let v=0;v<4;v++)se.mote({x:d.x,y:.6,z:d.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}const h=xr(n.S,e.t.T,n.poison),l=$e(U,c),u=ii(l,h);c&&await me.row(`Wound ${h}+`,l,h);const f=Mr(e.t.Sv,n.AP,!1),p=$e(U,u),g=f>6?u:u-ii(p,f);u&&await me.row(f>6?"No save":`Save ${f}+`,f>6?[]:p,f,{save:!0});const _=await Io(e,g,n.D,i);Oe(i.side,`<b>${i.t.short}</b> fight ${e.t.short}: ${c} hit, ${u} wound, ${g} unsaved${_?` — <b>${_} slain</b>`:""}.`),await je(.3)}async function vM(i){const t=U.units.filter(n=>n.side===i&&n.flags.charged&&ee(n));for(const n of t)await su(n);let e=1-i;for(let n=0;n<30;n++){const s=U.units.find(o=>o.side===e&&ee(o)&&!o.flags.fought&&tn(U,o)),r=U.units.find(o=>o.side===1-e&&ee(o)&&!o.flags.fought&&tn(U,o));if(!s&&!r)break;s&&await su(s),e=1-e}for(const n of U.units)n.flags.fought=!1,Vn(n)}async function xM(){let i=!1;for(const t of U.units){if(!ee(t)||!t.lost||t.t.models===1)continue;i||me.clear("Morale"),i=!0;const e=Ax(U,t),n=$e(U,1),s=n[0]+t.lost,r=n[0]===1?0:Math.max(0,s-e);if(await me.row(`${t.t.short}: D6 + ${t.lost} lost vs Ld ${e}`,n,0,{sum:!0,pass:r===0,note:`${s}`}),r){const o=Math.min(r,t.alive),a=t.models.filter(c=>c.alive).slice(-o);for(const c of a)MM(t,c);Oe(t.side,`<b>${t.t.short}</b> lose their nerve — <b>${o} flee</b>.`),ee(t)?Of(t):zf(t,null),Vn(t),await je(.5)}else Oe(t.side,`<b>${t.t.short}</b> hold firm (${s} vs Ld ${e}).`)}}function MM(i,t){const e=Ac(i,t);t.alive=!1,t.w=0,i.alive--,e.dying=!0;const n=To(U,i.side),s=n*(ke/2+3),r=e.x,o=e.z;e.fleeing=!0,se.text({x:e.x,y:1.4,z:e.z},"flees!","#e0e0e0",{size:14}),e.yaw=n*Math.PI/2,Ae(2.2,a=>{e.x=On(r,s,a),e.z=o,e.mesh.position.set(e.x,Math.abs(Math.sin(a*30))*.2,e.z),e.mesh.rotation.y=e.yaw}).then(()=>{ae.remove(e.mesh),e.dying=!1})}function Uc(i,t){const e=Ln(i);e.facing=Math.atan2(t.pos.x-i.pos.x,t.pos.z-i.pos.z);for(const n of e.models)n.look=Math.atan2(t.pos.x-n.x,t.pos.z-n.z)}const Rs=i=>({x:i.pos.x,y:i.t.big?2.6:1.6,z:i.pos.z});function ni(){Co(U,"act"),$.busy=!1;for(const i of U.units)Vn(i);$.sel&&!Sr(U,$.sel)?xn(null):$.sel&&xn($.sel),Pn(),Bf()}function Bf(){for(const i of[0,1])U.units.some(t=>t.side===i&&ee(t))||(U.turn.wiped=i)}let ru=null;function kf(i,t){if(!$.follow||U.turn.stage!=="battle"||Hn(U.turn.active)&&Xa(U,0)!==Xa(U,1))return;const e=Ne.target.clone();if(Math.hypot(i-e.x,t-e.z)<6)return;const s=de.position.clone().sub(e),r=new R(On(e.x,i,.6),0,On(e.z,t,.6)),o=ru={};Ae(.9,a=>{ru===o&&(Ne.target.lerpVectors(e,r,a),de.position.copy(Ne.target).add(s))},Ec)}const Hf={doMove:Cc,doAdvance:Pc,doShoot:Lc,doCharge:Dc,focus:kf};let An=null;async function yM(){const i=U.turn;i.stage="battle",xn(null),mr.forEach(n=>n.opacity=.05),me.clear("Roll-off for the first turn");let t,e;do t=$e(U,1),e=$e(U,1),await me.row(ce[0].short,t,0,{sum:!0}),await me.row(ce[1].short,e,0,{sum:!0});while(t[0]===e[0]);for(i.first=t[0]>e[0]?0:1,Oe(i.first,`<b>${ce[i.first].name}</b> win the roll-off and take the first turn.`,"big"),i.round=1;i.round<=U.setup.rounds;i.round++){for(let n=0;n<2;n++)if(i.active=(i.first+n)%2,await SM(i.active),i.wiped>=0)return ou();await bM()}ou()}async function SM(i){const t=U.turn;for(const e of U.units)e.lost=0,e.side===i&&(e.flags={});for(const e of Ku)if(t.phase=e.key,xn(null),me.el.classList.remove("show"),Pn(),await jf(`${ce[i].icon} ${ce[i].name}`,e.name,i),e.key==="fight"?U.units.some(n=>ee(n)&&tn(U,n))&&await vM(i):e.key==="morale"?await xM():Rx(U,i)?Hn(i)?(await new Promise(n=>{An=n,$.waiting=!0,Pn()}),An=null,$.waiting=!1):await Mf(U,i,e.key,Hf):await je(.2),Co(U,`phase ${i}:${e.key}`),Bf(),t.wiped>=0)return;for(const e of U.units)e.side===i&&e.mesmerized&&(e.mesmerized=!1,Vn(e))}async function bM(){const i=U.turn,t=[0,0];for(const e of U.objectives){const n=bc(U,e);n>=0&&(t[n]++,se.ring(e.x,e.z,uo,ce[n].color,{life:1.6,fill:.15}))}i.vp[0]+=t[0],i.vp[1]+=t[1],Co(U,`round ${i.round}`),Oe(-1,`End of round ${i.round}: ${ce[0].short} hold ${t[0]} objective${t[0]===1?"":"s"}, ${ce[1].short} hold ${t[1]}. Score ${i.vp[0]}–${i.vp[1]}.`,"big"),Pn(),await jf(`End of round ${i.round}`,`VP ${i.vp[0]} – ${i.vp[1]}`)}function ou(){const i=U.turn;for(const r of U.journal.pendingLog.splice(0))Ya(...r);Co(U,"over"),i.stage="over",xn(null),Pn();let t;i.wiped>=0?t=1-i.wiped:t=i.vp[0]>i.vp[1]?0:i.vp[1]>i.vp[0]?1:-1;const e=t<0?"A bloody draw":`${ce[t].name} win!`,n=i.wiped>=0?`${ce[i.wiped].name} have been wiped from the table.`:`Final score ${i.vp[0]} – ${i.vp[1]} after ${U.setup.rounds} rounds.`,s=yt("#overTitle");s.textContent=`${t>=0?ce[t].icon+" ":""}${e}`,s.style.color=Df(t),yt("#overWhy").textContent=n,yt("#over").classList.remove("hidden"),Pe.fanfare()}const Ca=new Lv,au=new ut;let nr=null;function Gf(i){au.set(i.clientX/innerWidth*2-1,-(i.clientY/innerHeight)*2+1),Ca.setFromCamera(au,de);const t=Ca.intersectObjects(U.units.filter(ee).map(s=>Ln(s).hit),!1),e=t.length?t[0].object.userData.unit:null,n=Ca.intersectObject(wc,!1)[0];return{unit:e,ground:n?n.point:null}}qe.domElement.addEventListener("pointerdown",i=>{Po(),nr={x:i.clientX,y:i.clientY,b:i.button}});qe.domElement.addEventListener("pointerup",i=>{if(!nr||i.button!==0)return;const t=Math.hypot(i.clientX-nr.x,i.clientY-nr.y);nr=null,!(t>6)&&EM(Gf(i))});qe.domElement.addEventListener("pointerleave",()=>{$.hoverPick=null,$.hover=null,$f(),zc()});qe.domElement.addEventListener("pointermove",i=>{$.mouse={x:i.clientX,y:i.clientY},$.hoverPick=Gf(i),$f()});function Nc(){const i=U.turn;return i.stage==="battle"&&Hn(i.active)&&An&&!$.busy&&!$.auto||i.stage==="deploy"}async function EM({unit:i,ground:t}){yt("#tooltip").style.display="none";const e=U.turn;if(e.stage==="deploy")return Vf(i,t);if($.chargePick){t&&Ic(Ff($.chargePick,t.x,t.z));return}if(!Nc()){i&&Cs(i);return}const n=$.sel;if(i&&i.side===e.active){Sr(U,i)?(Pe.click(),xn(i)):Cs(i);return}if(e.phase==="move"&&n&&t){const s=pf(U,$.reach,t.x,t.z);s>=0&&(Oc(),await Cc(n,s,$.reach));return}if(e.phase==="shoot"&&n&&i&&i.side!==n.side){ks(U,n,i).ok&&await Lc(n,i);return}if(e.phase==="charge"&&n&&i&&i.side!==n.side){Hs(U,n).includes(i)&&yr(U,n,i)&&await Dc(n,i);return}i?Cs(i):!i&&t&&xn(null)}function Vf(i,t){const e=$.deploySide;if(i&&i.side===e){Pe.click(),$.sel=i,Cs(i),zc();return}if($.sel&&t){const n=$.sel,s=U.units.filter(o=>o!==n),r=vc(U,n,t.x,t.z,e,s);if(r&&Math.hypot(r.x-t.x,r.z-t.z)<2.5){Do(n,r.x,r.z),Pe.click();for(const o of U.units)Vn(o)}}}function xn(i){const t=U.turn;$.sel=i,$.reach=null,Oc(),i&&t.stage==="battle"&&t.phase==="move"&&!i.flags.moved&&($.reach=hr(U,i,i.flags.advanced?i.flags.advRoll:0),wM($.reach)),i&&t.phase==="shoot"&&i.t.ranged&&cu(i,i.t.ranged.range),i&&t.phase==="charge"&&cu(i,Eo),Cs(i),Pn()}const vo=nf(ke,Xe,hf),Ss=new Uint8Array(vo.nx*vo.nz*4),Uo=new lv(Ss,vo.nx,vo.nz,_n);Uo.magFilter=nn;Uo.minFilter=nn;const Ws=new Ht(new yi(ke,Xe).rotateX(-Math.PI/2),new Ke({map:Uo,transparent:!0,depthWrite:!1,toneMapped:!1}));Ws.position.y=.035;Ws.renderOrder=2;Ws.visible=!1;ae.add(Ws);function wM(i){const t=i.u.flags.advanced,{u:e,res:n,mode:s,endForbid:r}=i,o=U.nav,a=new Uint8Array(o.N);for(let c=0;c<o.N;c++)isFinite(n.dist[c])&&o.standable(c,e.r,s==="wreck"?"wreck":"walk",r)&&(a[c]=1);Wf(a,i.fallback?[255,120,90]:t?[255,190,70]:[90,180,255])}function Wf(i,t,e=80){const n=U.nav;Ss.fill(0);for(let s=0;s<n.N;s++){if(!i[s])continue;const r=s%n.nx,o=s/n.nx|0,a=r===0||o===0||r===n.nx-1||o===n.nz-1||!i[s-1]||!i[s+1]||!i[s-n.nx]||!i[s+n.nx],c=((n.nz-1-o)*n.nx+r)*4;Ss[c]=t[0],Ss[c+1]=t[1],Ss[c+2]=t[2],Ss[c+3]=a?210:n.diff[s]?Math.round(e*.7):e}Uo.needsUpdate=!0,Ws.visible=!0}function Oc(){Ws.visible=!1,ti.visible=!1,Nn.visible=!1}const Nn=new Ht(new ji(.985,1,96).rotateX(-Math.PI/2),new Ke({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));Nn.position.y=.04;Nn.visible=!1;ae.add(Nn);function cu(i,t){Nn.position.x=i.pos.x,Nn.position.z=i.pos.z,Nn.scale.setScalar(i.r+t),Nn.material.color.set(U.turn.phase==="charge"?"#ffb070":"#ffffff"),Nn.visible=!0}const ti=new Gu(new be,new oc({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));ti.visible=!1;ti.renderOrder=4;ae.add(ti);const Fe=new Ht(new ji(.9,1,40).rotateX(-Math.PI/2),new Ke({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));Fe.position.y=.05;Fe.visible=!1;ae.add(Fe);function Xf(i,t){Fe.position.x=U.nav.x(i),Fe.position.z=U.nav.z(i),Fe.scale.setScalar(t),Fe.visible=!0}function $f(){const i=yt("#tooltip");i.style.display="none",ti.visible=!1,Fe.visible=!1;const t=$.hoverPick;if(!t){$.chargePick&&Xf($.chargePick.plan.cell,$.chargePick.u.r);return}$.hover=t.unit;let e="";const n=$.sel,s=U.turn,r=U.nav;if($.chargePick&&t.ground){const o=$.chargePick,a=Ff(o,t.ground.x,t.ground.z);if(a>=0){const c=r.path(o.plan.res,a,o.u.r,o.plan.mode==="fly"?null:o.plan.forbid);ti.geometry.setFromPoints(c.map(h=>new R(h.x,.08,h.z))),ti.visible=!0,Fe.position.x=r.x(a),Fe.position.z=r.z(a),Fe.scale.setScalar(o.u.r),Fe.visible=!0,e=`End charge here · ${o.plan.res.dist[a].toFixed(1)}" of ${o.rolled}"`}else e="✖ out of reach — pick a spot in the orange area"}else if(s.stage==="battle"&&Nc()&&n){if(s.phase==="move"&&$.reach&&t.ground&&!t.unit){const o=pf(U,$.reach,t.ground.x,t.ground.z);if(o>=0){const a=r.path($.reach.res,o,n.r,$.reach.mode==="fly"?null:$.reach.forbid);ti.geometry.setFromPoints(a.map(c=>new R(c.x,.08,c.z))),ti.visible=!0,Fe.position.x=r.x(o),Fe.position.z=r.z(o),Fe.scale.setScalar(n.r),Fe.visible=!0,e=`${$.reach.res.dist[o].toFixed(1)}" of ${$.reach.max}"`}}else if(s.phase==="shoot"&&t.unit&&t.unit.side!==n.side){const o=ks(U,n,t.unit);e=o.ok?TM(n,t.unit,o):`✖ ${o.why}`}else if(s.phase==="charge"&&t.unit&&t.unit.side!==n.side)if(!Hs(U,n).includes(t.unit))e=`✖ out of charge range (${xi(n,t.unit).toFixed(1)}")`;else{const o=yr(U,n,t.unit);e=o?`Charge: need ${o.need}" on 2D6 — ${Math.round(Vi(o.need)*100)}%`:"✖ no route"}}!e&&t.unit&&(e=`${t.unit.t.name} · ${t.unit.t.models>1?`${t.unit.alive}/${t.unit.t.models} models`:`${t.unit.models[0].w}/${t.unit.t.W} wounds`}`),e&&$.mouse&&(i.innerHTML=e,i.style.display="block",i.style.left=$.mouse.x+16+"px",i.style.top=$.mouse.y+14+"px")}function TM(i,t,e){const n=i.t.ranged;if(n.mesmerize)return`Mesmerize: cast ${n.spell}+ on 2D6 (${Math.round(Vi(n.spell)*100)}%) · D3 mortal wounds`;const s=[];n.spell&&s.push(`Cast ${n.spell}+ (${Math.round(Vi(n.spell)*100)}%)`);const r=Us(i,n,!1),o=xr(n.S,t.t.T,n.poison),a=Mr(t.t.Sv,n.AP,e.cover);s.push(`${r} ${n.blast?`template${r>1?"s":""} (${n.blast}")`:"shots"} · hit ${n.spell?"auto":e.need+"+"} · wound ${o}+ · save ${a>6?"—":a+"+"}`);const c=[];if(c.push(`${e.range.toFixed(1)}"`),e.cover&&c.push("cover"),e.visible?e.seen<e.total&&c.push(`${e.seen}/${e.total} visible`):c.push("unseen (indirect −1)"),n.heavy&&i.flags.moved&&c.push("moved (heavy −1)"),!n.blast){const h=fo(r,e.need,n,t,e.cover);c.push(`≈${h.kills.toFixed(1)} slain`)}return s.push(c.join(" · ")),s.join("<br>")}const AM={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function RM(i,t){const e=document.createElement("div");e.className=`die ${t}`;for(let n=0;n<9;n++){const s=document.createElement("i");AM[i].includes(n)&&(s.className="on"),e.appendChild(s)}return e}const me={el:yt("#tray"),clear(i){this.el.innerHTML="";const t=document.createElement("div");t.className="tray-title",t.textContent=i,this.el.appendChild(t),this.el.classList.add("show")},async row(i,t,e,{sum:n=!1,pass:s,note:r="",save:o=!1}={}){Pe.dice(t.length);const a=document.createElement("div");a.className="tray-row";const c=document.createElement("span");c.className="lbl",c.textContent=i,a.appendChild(c);const h=document.createElement("span");h.className="dice",a.appendChild(h),t.slice(0,30).forEach((f,p)=>{const g=e?f>=e?o?"saved":"ok":"fail":s===!1?"fail":s?"ok":"plain",_=RM(f,g);_.style.animationDelay=`${p*.025/hn.speed}s`,h.appendChild(_)});const u=document.createElement("span");if(u.className="res",e){const f=ii(t,e);u.textContent=o?`${f} saved`:`${f} ✓`,t.length>30&&(u.textContent+=` (of ${t.length})`)}else n&&(u.textContent=r||`= ${t.reduce((f,p)=>f+p,0)}`,s===!0&&u.classList.add("good"),s===!1&&u.classList.add("bad"));for(a.appendChild(u),this.el.appendChild(a);this.el.children.length>7;)this.el.children[1].remove();await je(.38+Math.min(t.length,14)*.035)}};function Oe(i,t,e=""){Cx(U,i,t),Ya(i,t,e);for(const n of U.journal.pendingLog.splice(0))Ya(...n)}function Ya(i,t,e){const n=yt("#logList"),s=document.createElement("div");for(s.className=`entry s${i} ${e}`,s.innerHTML=t,n.prepend(s);n.children.length>80;)n.lastChild.remove()}const lu=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];function Cs(i){var a;const t=yt("#card");if(!i){t.classList.remove("show");return}const e=i.t,n=c=>c==="M"?`${e.M}"`:["WS","BS","Sv"].includes(c)?`${e[c]}+`:e[c],s=(c,h)=>{if(!c)return"";if(c.mesmerize)return`<div class="wpn"><span>${h} ${c.name}</span><em>spell ${c.spell}+ · ${c.range}" · D3 mortal + mesmerize</em></div>`;const l=[];return c.range&&l.push(`${c.range}"`),c.spell&&l.push(`spell ${c.spell}+`),c.blast?l.push(`blast ${c.blast}" ×${c.shots}`):c.shots&&l.push(`A${c.shots}`),l.push(`S${c.S}`,`AP-${c.AP}`,`D${c.D}`),c.poison&&l.push(`poison ${c.poison}+`),c.indirect&&l.push("indirect"),c.heavy&&l.push("heavy"),c.assault&&l.push("assault"),`<div class="wpn"><span>${h} ${c.name}</span><em>${l.join(" · ")}</em></div>`},r=[];i.flags.moved&&r.push(i.flags.fellBack?"fell back":i.flags.advanced?`advanced +${i.flags.advRoll}"`:"moved"),i.flags.shot&&r.push("shot"),i.flags.charged&&r.push("charged"),i.mesmerized&&r.push("🌀 mesmerized"),ee(i)&&tn(U,i)&&r.push("⚔ in combat"),ee(i)&&Sc(U,i)&&r.push("🛡 in cover");const o=e.models>1?`${i.alive}/${e.models} models`:`${i.models[0].w}/${e.W} wounds`;t.innerHTML=`
    <div class="card-head s${i.side}"><b>${e.name}</b><span>${ce[i.side].short} · ${e.role}</span></div>
    <div class="card-sub">${ee(i)?o:"destroyed"}${r.length?" · "+r.join(" · "):""}</div>
    <table class="stats"><tr>${lu.map(c=>`<th>${c}</th>`).join("")}</tr><tr>${lu.map(c=>`<td>${n(c)}</td>`).join("")}</tr></table>
    ${s(e.ranged,(a=e.ranged)!=null&&a.spell?"✦":"➹")}${s({...e.melee,range:0},"⚔")}
    <ul class="abil">${(e.abilities||[]).map(c=>`<li>${c}</li>`).join("")}</ul>`,t.classList.add("show")}function Pn(){var o;const i=U.turn;yt("#vp0").textContent=i.vp[0],yt("#vp1").textContent=i.vp[1],yt("#round").textContent=i.stage==="deploy"?"Deployment":`Round ${Math.min(i.round,U.setup.rounds)} / ${U.setup.rounds}`,document.querySelectorAll("#phases .ph").forEach(a=>{a.classList.toggle("on",i.stage==="battle"&&a.dataset.k===i.phase)}),yt("#sideA").classList.toggle("active",i.stage==="battle"&&i.active===0),yt("#sideB").classList.toggle("active",i.stage==="battle"&&i.active===1);const t=i.stage==="battle"&&Hn(i.active)&&!!An&&!$.auto,e=$.sel,n=!!$.chargePick;yt("#endPhase").style.display=t&&!n||i.stage==="deploy"?"":"none",yt("#closestSpot").style.display=n?"":"none",yt("#endPhase").textContent=i.stage==="deploy"?"Begin battle ▸":`End ${Ku.find(a=>a.key===i.phase).name} ▸`,yt("#endPhase").disabled=$.busy||$.auto,yt("#autoPhase").style.display=t&&!n?"":"none";const s=yt("#advance");s.style.display=t&&i.phase==="move"&&e&&!e.flags.moved&&!e.flags.advanced&&!tn(U,e)?"":"none",s.textContent=`Advance (+D6") — no ${(o=e==null?void 0:e.t.ranged)!=null&&o.assault?"charge":"shooting or charge"} after`,e!=null&&e.t.chargeAfterAdvance&&(s.textContent='Advance (+D6") — can still charge');let r="";n?r=`Charge! Rolled ${$.chargePick.rolled}" — click the orange area to place ${$.chargePick.u.t.short}, or take the shortest move.`:i.stage==="deploy"?r="Deployment — click one of your units, then click inside your shaded zone to move it there.":i.stage==="battle"&&!Hn(i.active)?r=`${ce[i.active].name} (AI) are taking their turn…`:t&&(r={move:e?tn(U,e)?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:e?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:e?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[i.phase]||""),yt("#hint").textContent=r,yt("#hint").style.display=r?"":"none",zc()}function zc(){const i=Nc(),t=U.turn;for(const e of U.units){if(!ee(e))continue;const n=Ln(e).ring.material;let s=0,r="#ffffff";e===$.sel?(s=1,r="#ffe680"):t.stage==="deploy"&&e.side===$.deploySide?s=.5:$.chargePick&&e===$.chargePick.target?(s=.95,r="#ffa040"):i&&t.stage==="battle"&&Sr(U,e)?s=.75:i&&$.sel&&t.phase==="shoot"&&e.side!==$.sel.side&&ks(U,$.sel,e).ok?(s=.95,r="#ff5a4a"):i&&$.sel&&t.phase==="charge"&&e.side!==$.sel.side&&Hs(U,$.sel).includes(e)?(s=.95,r="#ffa040"):e===$.hover&&(s=.35),n.opacity=s,n.color.set(r)}}async function jf(i,t,e=-1){const n=yt("#banner");n.innerHTML=`<div class="b1">${i}</div><div class="b2">${t}</div>`,n.querySelector(".b1").style.color=Df(e),n.classList.remove("show"),n.offsetWidth,n.classList.add("show"),await je(Hn(U.turn.active)||U.turn.stage!=="battle"?.9:.6)}yt("#endPhase").onclick=()=>{var i;if(Po(),Pe.click(),U.turn.stage==="deploy")return(i=$.deployDone)==null?void 0:i.call($);$.busy||$.auto||!An||(xn(null),An())};yt("#closestSpot").onclick=()=>{Pe.click(),$.chargePick&&Ic($.chargePick.plan.cell)};yt("#autoPhase").onclick=async()=>{if(!($.busy||$.auto||!An)){xn(null),$.auto=!0,$.busy=!0,Pn();try{await Mf(U,U.turn.active,U.turn.phase,Hf)}finally{$.auto=!1,$.busy=!1}An==null||An()}};yt("#advance").onclick=async()=>{const i=$.sel;!i||$.busy||$.auto||(await Pc(i),xn(i))};const Pa=[1,2,4];yt("#speed").onclick=()=>{hn.speed=Pa[(Pa.indexOf(hn.speed)+1)%Pa.length],yt("#speed").textContent=`⏩ ${hn.speed}×`};yt("#follow").onclick=()=>{$.follow=!$.follow,yt("#follow").classList.toggle("off",!$.follow)};yt("#mute").textContent=Qx()?"🔇":"🔊";yt("#mute").onclick=()=>{Po(),yt("#mute").textContent=Zx()?"🔇":"🔊"};yt("#helpBtn").onclick=()=>yt("#help").classList.remove("hidden");yt("#helpClose").onclick=()=>yt("#help").classList.add("hidden");yt("#logToggle").onclick=()=>yt("#log").classList.toggle("collapsed");yt("#seed").value=$.seed;yt("#reroll").onclick=()=>{$.seed=Math.random()*1e6|0,yt("#seed").value=$.seed,No()};yt("#seed").onchange=()=>{$.seed=Number(yt("#seed").value)||1,No()};document.querySelectorAll("[data-mode]").forEach(i=>{i.onclick=()=>{Po(),Pe.click(),Fc(i.dataset.mode)}});yt("#again").onclick=()=>{yt("#over").classList.add("hidden"),yt("#title").classList.remove("hidden"),document.body.classList.remove("playing"),$.titleSpin=!0,$.titleAngle-=hn.time*.035,$.viewShift=1,No()};const In=new Set;addEventListener("keydown",i=>{i.target.tagName!=="INPUT"&&(In.add(i.key.toLowerCase()),i.key==="Escape"&&!$.chargePick&&xn(null))});addEventListener("keyup",i=>In.delete(i.key.toLowerCase()));function CM(i){const t=new R,e=new R().subVectors(Ne.target,de.position).setY(0).normalize(),n=new R(-e.z,0,e.x);(In.has("w")||In.has("arrowup"))&&t.add(e),(In.has("s")||In.has("arrowdown"))&&t.sub(e),(In.has("d")||In.has("arrowright"))&&t.add(n),(In.has("a")||In.has("arrowleft"))&&t.sub(n),t.lengthSq()&&(t.normalize().multiplyScalar(i*18),Ne.target.add(t),de.position.add(t))}function No(){const i={board:$.seed,dice:oM,terrain:"classic",rounds:Uv,diceMode:"shared",seats:Cf.map((e,n)=>({race:e,ctrl:$.control[n]}))},t=wx(i,{out:[],onTrace:aM});hM(),$.sel=null,yt("#logList").innerHTML="",yt("#tray").classList.remove("show"),U=t,Lo(),rM();for(const e of U.units)lM(e);for(const e of U.units)Vn(e);for(const e of Af)qf(e,-1);se.clearDecals(),$.busy=!1,$.waiting=!1,$.chargePick=null,$.auto=!1,Pn()}const La={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]};async function Fc(i){if(!Object.hasOwn(La,i))throw new Error(`no mode "${i}" (there are ${Object.keys(La).join(", ")})`);const t=La[i],e=Number(Rn.get("dice"))||Math.random()*1e9|0;Tx(U,{dice:e,ctrl:t}),$.dice=e,$.control=[...t],Bi==null||Bi.begin(U),cM(),yt("#title").classList.add("hidden"),document.body.classList.add("playing"),$.titleSpin=!1;const n=de.position.clone(),s=Ne.target.clone(),r=IM();innerWidth<700&&yt("#log").classList.add("collapsed"),Ae(1.4,o=>{$.viewShift=1-o,de.position.lerpVectors(n,r.pos,o),Ne.target.lerpVectors(s,r.target,o)},Ec);for(const o of[0,1])Hn(o)&&(U.turn.stage="deploy",$.deploySide=o,mr[o].opacity=.2,Oe(o,`<b>${ce[o].name}</b>: deploy your army.`),Pn(),await new Promise(a=>$.deployDone=a),mr[o].opacity=.07,$.sel=null,Cs(null));yM()}const PM=new Pv,Jr=new R;$.titleSpin=!0;$.titleAngle=-1.02;$.viewShift=1;function LM(i,t){for(const e of U.units){const n=Ln(e);for(const[s,r]of e.models.entries()){const o=n.models[s];if(!r.alive&&!o.dying)continue;const a=o.mesh.userData.anim;if(r.alive){const l=e.pos.x+r.ox,u=e.pos.z+r.oz,f=1-Math.exp(-i*(n.moving?16:7)),p=o.x,g=o.z;o.x+=(l-o.x)*f,o.z+=(u-o.z)*f;const _=Math.hypot(o.x-p,o.z-g)/Math.max(i,1e-4),m=_>.6?Math.atan2(o.x-p,o.z-g):o.look??n.facing;o.yaw+=Dx(m-o.yaw)*(1-Math.exp(-i*8)),o.moving=_>.6;let d=0,v=0;if(o.lunge>0){o.lunge=Math.max(0,o.lunge-i*2.5);const x=Math.sin((1-o.lunge)*Math.PI)*.35;d=Math.sin(o.lungeDir)*x,v=Math.cos(o.lungeDir)*x}o.mesh.position.set(o.x+d,o.lift||0,o.z+v),o.mesh.rotation.y=o.yaw}if(!a||!r.alive)continue;const c=t+o.mesh.userData.phase,h=o.mesh.userData.fig;if(a.kind==="squirrel"){const l=o.moving?Math.abs(Math.sin(c*13))*.16:0;h.position.y=h.userData.y0+l,h.scale.y=1+(o.moving?0:Math.sin(c*2.4)*.018),h.rotation.x=o.moving?.12:0}else if(a.kind==="naga")h.rotation.z=Math.sin(c*(o.moving?9:1.4))*(o.moving?.12:.035),h.scale.y=1+Math.sin(c*1.4)*.015;else if(a.kind==="machine"&&o.moving)for(const l of a.wheels)l.rotation.x+=i*6;a.gem&&(a.gem.rotation.y=c*2),o.flash>0&&(o.flash-=i,h.position.x=Math.sin(t*60)*.04*(o.flash>0?1:0))}if(ee(e)&&!Ka){Jr.set(e.pos.x,e.t.big?2.7:e.t.fly?2.3:1.7,e.pos.z).project(de);const s=Jr.z<1;n.label.style.transform=`translate(${(Jr.x*.5+.5)*innerWidth}px, ${(-Jr.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,n.label.style.visibility=s&&U.turn.stage!=="title"?"visible":"hidden",n.label.classList.toggle("sel",e===$.sel)}}}function qf(i,t){i.owner=t,i.flagMat.color.set(t<0?"#e8e0d0":ce[t].color),i.ring.material.color.set(t<0?"#fff3c0":ce[t].color)}function DM(i,t){const e=U.turn.stage;for(const n of Af){const s=e==="battle"||e==="over"?bc(U,U.objectives[n.i]):-1;s!==n.owner&&qf(n,s),n.gem.rotation.y=t*1.2,n.gem.position.y=.45+Math.sin(t*2+n.i)*.05,n.flag.rotation.y=Math.sin(t*2.2+n.i)*.25,n.ring.material.opacity=.3+Math.sin(t*2+n.i)*.08}}const Ka=Rn.has("fast");function Yf(){var r;requestAnimationFrame(Yf),Ka&&(hn.speed=1e4);const i=Math.min(PM.getDelta(),.05),t=i*hn.speed;if(hn.time+=t,Ux(t),se.update(t),LM(t,hn.time),DM(t,hn.time),$.titleSpin){const o=$.titleAngle+hn.time*.035;de.position.set(-5+Math.sin(o)*25,13,Math.cos(o)*25),Ne.target.set(-5,0,0)}const e=innerWidth>900?$.viewShift:0;e>.001?de.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*e,0,innerWidth,innerHeight):(r=de.view)!=null&&r.enabled&&de.clearViewOffset(),CM(i),Ne.update();const n=se.shake,s=new R((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n);de.position.add(s),Ka||qe.render(ae,de),de.position.sub(s)}function IM(){return innerWidth>=innerHeight?{pos:new R(0,30,31),target:new R(0,0,1.5)}:{pos:new R(-36,46,0),target:new R(-1,0,0)}}function Kf(){de.fov=innerWidth>=innerHeight?40:56,de.aspect=innerWidth/innerHeight,de.updateProjectionMatrix()}Kf();addEventListener("resize",()=>{Kf(),de.aspect=innerWidth/innerHeight,de.updateProjectionMatrix(),qe.setSize(innerWidth,innerHeight)});No();Yf();Rn.has("watch")&&Fc("watch");if(Rn.has("debug")){const i=new Set(["stage","round","active","first","phase","vp","wiped"]),t=s=>s==="wiped"?U.turn.wiped<0?void 0:U.turn.wiped:U.turn[s],e=new Proxy($,{get:(s,r)=>i.has(r)?t(r):s[r],has:(s,r)=>i.has(r)||r in s,set:(s,r,o)=>{if(i.has(r))throw new Error(`__ts.S.${r} is the match's G.turn.${r}: it can't be set through S`);return s[r]=o,!0},ownKeys:s=>[...new Set([...Reflect.ownKeys(s),...i])],getOwnPropertyDescriptor:(s,r)=>i.has(r)?{value:t(r),enumerable:!0,configurable:!0,writable:!1}:Reflect.getOwnPropertyDescriptor(s,r)}),n=[];Bi={begin:()=>n.length=0,line:s=>n.push(s)},window.__ts={S:e,clock:hn,camera:de,controls:Ne,renderer:qe,trace:n,get G(){return U},get units(){return U.units},get nav(){return U.nav},scenery:{get chunks(){return U.terrain.chunks},scene:ae,blast(s,r,o,a,c){const h=U.terrain.blast(s,r,o,a,c,U.out);return Lo(),qi(U),h}},validEnd:(s,r)=>Ao(U,s,r),setUnitPos:Do,get phaseResolve(){return An},get chargePick(){return $.chargePick},start:Fc,select:xn,doMove:Cc,doAdvance:Pc,doShoot:Lc,doCharge:Dc,placeCharge:Ic,deployClick:Vf,endPhase:()=>yt("#endPhase").onclick(),autoPhase:()=>yt("#autoPhase").onclick(),q:{alive:ee,isEngaged:s=>tn(U,s),canAct:s=>Sr(U,s),movePlan:(s,r)=>hr(U,s,r),freeSpot:(s,r,o,a,c)=>vc(U,s,r,o,a,c),shootTargets:s=>Mc(U,s),shotInfo:(s,r)=>ks(U,s,r),chargeTargets:s=>Hs(U,s),chargePlan:(s,r)=>yr(U,s,r),rngState:()=>pc(U.rng)},screen(s,r,o){const a=new R(s,r,o).project(de);return[(a.x*.5+.5)*innerWidth,(-a.y*.5+.5)*innerHeight]}}}
