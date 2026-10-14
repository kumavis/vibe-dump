(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Io="160",nh=0,na=1,ih=2,lc=1,cc=2,An=3,$n=0,Be=1,qe=2,qn=0,pi=1,vo=2,ia=3,sa=4,sh=5,ui=100,rh=101,oh=102,ra=103,oa=104,ah=200,lh=201,ch=202,hh=203,_o=204,yo=205,uh=206,dh=207,fh=208,ph=209,mh=210,gh=211,xh=212,vh=213,_h=214,yh=0,Mh=1,bh=2,nr=3,wh=4,Sh=5,Eh=6,Th=7,dr=0,Ah=1,Rh=2,Yn=0,Ch=1,Ph=2,Lh=3,hc=4,Dh=5,Ih=6,aa="attached",Uh="detached",uc=300,Yi=301,$i=302,Mo=303,bo=304,fr=306,ir=1e3,sn=1001,wo=1002,Ae=1003,la=1004,Rr=1005,We=1006,zh=1007,xs=1008,Pn=1009,Nh=1010,kh=1011,Uo=1012,dc=1013,Xn=1014,Rn=1015,vs=1016,fc=1017,pc=1018,mi=1020,Fh=1021,rn=1023,Oh=1024,Bh=1025,gi=1026,ji=1027,mc=1028,gc=1029,Hh=1030,xc=1031,vc=1033,Cr=33776,Pr=33777,Lr=33778,Dr=33779,ca=35840,ha=35841,ua=35842,da=35843,_c=36196,fa=37492,pa=37496,ma=37808,ga=37809,xa=37810,va=37811,_a=37812,ya=37813,Ma=37814,ba=37815,wa=37816,Sa=37817,Ea=37818,Ta=37819,Aa=37820,Ra=37821,Ir=36492,Ca=36494,Pa=36495,Gh=36283,La=36284,Da=36285,Ia=36286,yc=3e3,xi=3001,Vh=3200,Wh=3201,zo=0,Xh=1,on="",me="srgb",In="srgb-linear",No="display-p3",pr="display-p3-linear",sr="linear",ie="srgb",rr="rec709",or="p3",Mi=7680,Ua=519,qh=512,Yh=513,$h=514,Mc=515,jh=516,Kh=517,Zh=518,Jh=519,za=35044,ws=35048,Na="300 es",So=1035,Cn=2e3,ar=2001;class ts{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ka=1234567;const ps=Math.PI/180,Ki=180/Math.PI;function _i(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pe[s&255]+Pe[s>>8&255]+Pe[s>>16&255]+Pe[s>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]).toLowerCase()}function Fe(s,t,e){return Math.max(t,Math.min(e,s))}function ko(s,t){return(s%t+t)%t}function Qh(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function tu(s,t,e){return s!==t?(e-s)/(t-s):0}function ms(s,t,e){return(1-e)*s+e*t}function eu(s,t,e,n){return ms(s,t,1-Math.exp(-e*n))}function nu(s,t=1){return t-Math.abs(ko(s,t*2)-t)}function iu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function su(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function ru(s,t){return s+Math.floor(Math.random()*(t-s+1))}function ou(s,t){return s+Math.random()*(t-s)}function au(s){return s*(.5-Math.random())}function lu(s){s!==void 0&&(ka=s);let t=ka+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function cu(s){return s*ps}function hu(s){return s*Ki}function Eo(s){return(s&s-1)===0&&s!==0}function uu(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function lr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function du(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),m=o((n-t)/2);switch(i){case"XYX":s.set(a*u,l*h,l*d,a*c);break;case"YZY":s.set(l*d,a*u,l*h,a*c);break;case"ZXZ":s.set(l*h,l*d,a*u,a*c);break;case"XZX":s.set(a*u,l*m,l*f,a*c);break;case"YXY":s.set(l*f,a*u,l*m,a*c);break;case"ZYZ":s.set(l*m,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Bi(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ne(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const fu={DEG2RAD:ps,RAD2DEG:Ki,generateUUID:_i,clamp:Fe,euclideanModulo:ko,mapLinear:Qh,inverseLerp:tu,lerp:ms,damp:eu,pingpong:nu,smoothstep:iu,smootherstep:su,randInt:ru,randFloat:ou,randFloatSpread:au,seededRandom:lu,degToRad:cu,radToDeg:hu,isPowerOfTwo:Eo,ceilPowerOfTwo:uu,floorPowerOfTwo:lr,setQuaternionFromProperEuler:du,normalize:Ne,denormalize:Bi};class Bt{constructor(t=0,e=0){Bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Fe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ot{constructor(t,e,n,i,r,o,a,l,c){Ot.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=i,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],m=n[8],g=i[0],x=i[3],p=i[6],_=i[1],v=i[4],y=i[7],A=i[2],w=i[5],E=i[8];return r[0]=o*g+a*_+l*A,r[3]=o*x+a*v+l*w,r[6]=o*p+a*y+l*E,r[1]=c*g+u*_+h*A,r[4]=c*x+u*v+h*w,r[7]=c*p+u*y+h*E,r[2]=d*g+f*_+m*A,r[5]=d*x+f*v+m*w,r[8]=d*p+f*y+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,m=e*h+n*d+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/m;return t[0]=h*g,t[1]=(i*c-u*n)*g,t[2]=(a*n-i*o)*g,t[3]=d*g,t[4]=(u*e-i*l)*g,t[5]=(i*r-a*e)*g,t[6]=f*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ur.makeScale(t,e)),this}rotate(t){return this.premultiply(Ur.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ur.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ur=new Ot;function bc(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function cr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function pu(){const s=cr("canvas");return s.style.display="block",s}const Fa={};function gs(s){s in Fa||(Fa[s]=!0,console.warn(s))}const Oa=new Ot().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ba=new Ot().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ss={[In]:{transfer:sr,primaries:rr,toReference:s=>s,fromReference:s=>s},[me]:{transfer:ie,primaries:rr,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[pr]:{transfer:sr,primaries:or,toReference:s=>s.applyMatrix3(Ba),fromReference:s=>s.applyMatrix3(Oa)},[No]:{transfer:ie,primaries:or,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Ba),fromReference:s=>s.applyMatrix3(Oa).convertLinearToSRGB()}},mu=new Set([In,pr]),Zt={enabled:!0,_workingColorSpace:In,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!mu.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=Ss[t].toReference,i=Ss[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Ss[s].primaries},getTransfer:function(s){return s===on?sr:Ss[s].transfer}};function qi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function zr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let bi;class wc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{bi===void 0&&(bi=cr("canvas")),bi.width=t.width,bi.height=t.height;const n=bi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=bi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=cr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=qi(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(qi(e[n]/255)*255):e[n]=qi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let gu=0;class Sc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gu++}),this.uuid=_i(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Nr(i[o].image)):r.push(Nr(i[o]))}else r=Nr(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Nr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?wc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let xu=0;class He extends ts{constructor(t=He.DEFAULT_IMAGE,e=He.DEFAULT_MAPPING,n=sn,i=sn,r=We,o=xs,a=rn,l=Pn,c=He.DEFAULT_ANISOTROPY,u=on){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xu++}),this.uuid=_i(),this.name="",this.source=new Sc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Bt(0,0),this.repeat=new Bt(1,1),this.center=new Bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(gs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===xi?me:on),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==uc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ir:t.x=t.x-Math.floor(t.x);break;case sn:t.x=t.x<0?0:1;break;case wo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ir:t.y=t.y-Math.floor(t.y);break;case sn:t.y=t.y<0?0:1;break;case wo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return gs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===me?xi:yc}set encoding(t){gs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===xi?me:on}}He.DEFAULT_IMAGE=null;He.DEFAULT_MAPPING=uc;He.DEFAULT_ANISOTROPY=1;class Jt{constructor(t=0,e=0,n=0,i=1){Jt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],m=l[9],g=l[2],x=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-g)<.01&&Math.abs(m-x)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+g)<.1&&Math.abs(m+x)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,y=(f+1)/2,A=(p+1)/2,w=(u+d)/4,E=(h+g)/4,D=(m+x)/4;return v>y&&v>A?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=w/n,r=E/n):y>A?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=w/i,r=D/i):A<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(A),n=E/r,i=D/r),this.set(n,i,r,e),this}let _=Math.sqrt((x-m)*(x-m)+(h-g)*(h-g)+(d-u)*(d-u));return Math.abs(_)<.001&&(_=1),this.x=(x-m)/_,this.y=(h-g)/_,this.z=(d-u)/_,this.w=Math.acos((c+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class vu extends ts{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Jt(0,0,t,e),this.scissorTest=!1,this.viewport=new Jt(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(gs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===xi?me:on),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:We,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new He(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Sc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class vi extends vu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Ec extends He{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ae,this.minFilter=Ae,this.wrapR=sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _u extends He{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ae,this.minFilter=Ae,this.wrapR=sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3];const d=r[o+0],f=r[o+1],m=r[o+2],g=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=g;return}if(h!==g||l!==d||c!==f||u!==m){let x=1-a;const p=l*d+c*f+u*m+h*g,_=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const A=Math.sqrt(v),w=Math.atan2(A,p*_);x=Math.sin(x*w)/A,a=Math.sin(a*w)/A}const y=a*_;if(l=l*x+d*y,c=c*x+f*y,u=u*x+m*y,h=h*x+g*y,x===1-a){const A=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=A,c*=A,u*=A,h*=A}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+u*h+l*f-c*d,t[e+1]=l*m+u*d+c*h-a*f,t[e+2]=c*m+u*f+a*d-l*h,t[e+3]=u*m-a*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(i/2),h=a(r/2),d=l(n/2),f=l(i/2),m=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"YXZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"ZXY":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"ZYX":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"YZX":this._x=d*u*h+c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h-d*f*m;break;case"XZY":this._x=d*u*h-c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Fe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+i*c-r*l,this._y=i*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-i*a,this._w=o*u-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=i*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(r),n*Math.cos(r),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ha.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ha.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),u=2*(a*e-r*i),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=i+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return kr.copy(this).projectOnVector(t),this.sub(kr)}reflect(t){return this.sub(kr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Fe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const kr=new L,Ha=new jn;class Kn{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(cn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(cn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=cn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,cn):cn.fromBufferAttribute(r,o),cn.applyMatrix4(t.matrixWorld),this.expandByPoint(cn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Es.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Es.copy(n.boundingBox)),Es.applyMatrix4(t.matrixWorld),this.union(Es)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,cn),cn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(rs),Ts.subVectors(this.max,rs),wi.subVectors(t.a,rs),Si.subVectors(t.b,rs),Ei.subVectors(t.c,rs),Nn.subVectors(Si,wi),kn.subVectors(Ei,Si),si.subVectors(wi,Ei);let e=[0,-Nn.z,Nn.y,0,-kn.z,kn.y,0,-si.z,si.y,Nn.z,0,-Nn.x,kn.z,0,-kn.x,si.z,0,-si.x,-Nn.y,Nn.x,0,-kn.y,kn.x,0,-si.y,si.x,0];return!Fr(e,wi,Si,Ei,Ts)||(e=[1,0,0,0,1,0,0,0,1],!Fr(e,wi,Si,Ei,Ts))?!1:(As.crossVectors(Nn,kn),e=[As.x,As.y,As.z],Fr(e,wi,Si,Ei,Ts))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,cn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(cn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const bn=[new L,new L,new L,new L,new L,new L,new L,new L],cn=new L,Es=new Kn,wi=new L,Si=new L,Ei=new L,Nn=new L,kn=new L,si=new L,rs=new L,Ts=new L,As=new L,ri=new L;function Fr(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){ri.fromArray(s,r);const a=i.x*Math.abs(ri.x)+i.y*Math.abs(ri.y)+i.z*Math.abs(ri.z),l=t.dot(ri),c=e.dot(ri),u=n.dot(ri);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const yu=new Kn,os=new L,Or=new L;class yn{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):yu.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;os.subVectors(t,this.center);const e=os.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(os,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Or.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(os.copy(t.center).add(Or)),this.expandByPoint(os.copy(t.center).sub(Or))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const wn=new L,Br=new L,Rs=new L,Fn=new L,Hr=new L,Cs=new L,Gr=new L;class mr{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,wn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=wn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(wn.copy(this.origin).addScaledVector(this.direction,e),wn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Br.copy(t).add(e).multiplyScalar(.5),Rs.copy(e).sub(t).normalize(),Fn.copy(this.origin).sub(Br);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Rs),a=Fn.dot(this.direction),l=-Fn.dot(Rs),c=Fn.lengthSq(),u=Math.abs(1-o*o);let h,d,f,m;if(u>0)if(h=o*l-a,d=o*a-l,m=r*u,h>=0)if(d>=-m)if(d<=m){const g=1/u;h*=g,d*=g,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-m?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=m?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(Br).addScaledVector(Rs,d),f}intersectSphere(t,e){wn.subVectors(t.center,this.origin);const n=wn.dot(this.direction),i=wn.dot(wn)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,wn)!==null}intersectTriangle(t,e,n,i,r){Hr.subVectors(e,t),Cs.subVectors(n,t),Gr.crossVectors(Hr,Cs);let o=this.direction.dot(Gr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fn.subVectors(this.origin,t);const l=a*this.direction.dot(Cs.crossVectors(Fn,Cs));if(l<0)return null;const c=a*this.direction.dot(Hr.cross(Fn));if(c<0||l+c>o)return null;const u=-a*Fn.dot(Gr);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class At{constructor(t,e,n,i,r,o,a,l,c,u,h,d,f,m,g,x){At.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,u,h,d,f,m,g,x)}set(t,e,n,i,r,o,a,l,c,u,h,d,f,m,g,x){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=m,p[11]=g,p[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new At().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Ti.setFromMatrixColumn(t,0).length(),r=1/Ti.setFromMatrixColumn(t,1).length(),o=1/Ti.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,f=o*h,m=a*u,g=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+m*c,e[5]=d-g*c,e[9]=-a*l,e[2]=g-d*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,f=l*h,m=c*u,g=c*h;e[0]=d+g*a,e[4]=m*a-f,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-m,e[6]=g+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,f=l*h,m=c*u,g=c*h;e[0]=d-g*a,e[4]=-o*h,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*u,e[9]=g-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,f=o*h,m=a*u,g=a*h;e[0]=l*u,e[4]=m*c-f,e[8]=d*c+g,e[1]=l*h,e[5]=g*c+d,e[9]=f*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,m=a*l,g=a*c;e[0]=l*u,e[4]=g-d*h,e[8]=m*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*h+m,e[10]=d-g*h}else if(t.order==="XZY"){const d=o*l,f=o*c,m=a*l,g=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+g,e[5]=o*u,e[9]=f*h-m,e[2]=m*h-f,e[6]=a*u,e[10]=g*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Mu,t,bu)}lookAt(t,e,n){const i=this.elements;return je.subVectors(t,e),je.lengthSq()===0&&(je.z=1),je.normalize(),On.crossVectors(n,je),On.lengthSq()===0&&(Math.abs(n.z)===1?je.x+=1e-4:je.z+=1e-4,je.normalize(),On.crossVectors(n,je)),On.normalize(),Ps.crossVectors(je,On),i[0]=On.x,i[4]=Ps.x,i[8]=je.x,i[1]=On.y,i[5]=Ps.y,i[9]=je.y,i[2]=On.z,i[6]=Ps.z,i[10]=je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],m=n[2],g=n[6],x=n[10],p=n[14],_=n[3],v=n[7],y=n[11],A=n[15],w=i[0],E=i[4],D=i[8],M=i[12],S=i[1],H=i[5],P=i[9],K=i[13],R=i[2],I=i[6],F=i[10],k=i[14],N=i[3],B=i[7],z=i[11],V=i[15];return r[0]=o*w+a*S+l*R+c*N,r[4]=o*E+a*H+l*I+c*B,r[8]=o*D+a*P+l*F+c*z,r[12]=o*M+a*K+l*k+c*V,r[1]=u*w+h*S+d*R+f*N,r[5]=u*E+h*H+d*I+f*B,r[9]=u*D+h*P+d*F+f*z,r[13]=u*M+h*K+d*k+f*V,r[2]=m*w+g*S+x*R+p*N,r[6]=m*E+g*H+x*I+p*B,r[10]=m*D+g*P+x*F+p*z,r[14]=m*M+g*K+x*k+p*V,r[3]=_*w+v*S+y*R+A*N,r[7]=_*E+v*H+y*I+A*B,r[11]=_*D+v*P+y*F+A*z,r[15]=_*M+v*K+y*k+A*V,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],m=t[3],g=t[7],x=t[11],p=t[15];return m*(+r*l*h-i*c*h-r*a*d+n*c*d+i*a*f-n*l*f)+g*(+e*l*f-e*c*d+r*o*d-i*o*f+i*c*u-r*l*u)+x*(+e*c*h-e*a*f-r*o*h+n*o*f+r*a*u-n*c*u)+p*(-i*a*u-e*l*h+e*a*d+i*o*h-n*o*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],m=t[12],g=t[13],x=t[14],p=t[15],_=h*x*c-g*d*c+g*l*f-a*x*f-h*l*p+a*d*p,v=m*d*c-u*x*c-m*l*f+o*x*f+u*l*p-o*d*p,y=u*g*c-m*h*c+m*a*f-o*g*f-u*a*p+o*h*p,A=m*h*l-u*g*l-m*a*d+o*g*d+u*a*x-o*h*x,w=e*_+n*v+i*y+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/w;return t[0]=_*E,t[1]=(g*d*r-h*x*r-g*i*f+n*x*f+h*i*p-n*d*p)*E,t[2]=(a*x*r-g*l*r+g*i*c-n*x*c-a*i*p+n*l*p)*E,t[3]=(h*l*r-a*d*r-h*i*c+n*d*c+a*i*f-n*l*f)*E,t[4]=v*E,t[5]=(u*x*r-m*d*r+m*i*f-e*x*f-u*i*p+e*d*p)*E,t[6]=(m*l*r-o*x*r-m*i*c+e*x*c+o*i*p-e*l*p)*E,t[7]=(o*d*r-u*l*r+u*i*c-e*d*c-o*i*f+e*l*f)*E,t[8]=y*E,t[9]=(m*h*r-u*g*r-m*n*f+e*g*f+u*n*p-e*h*p)*E,t[10]=(o*g*r-m*a*r+m*n*c-e*g*c-o*n*p+e*a*p)*E,t[11]=(u*a*r-o*h*r-u*n*c+e*h*c+o*n*f-e*a*f)*E,t[12]=A*E,t[13]=(u*g*i-m*h*i+m*n*d-e*g*d-u*n*x+e*h*x)*E,t[14]=(m*a*i-o*g*i-m*n*l+e*g*l+o*n*x-e*a*x)*E,t[15]=(o*h*i-u*a*i+u*n*l-e*h*l-o*n*d+e*a*d)*E,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,u*a+n,u*l-i*o,0,c*l-i*a,u*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,m=r*h,g=o*u,x=o*h,p=a*h,_=l*c,v=l*u,y=l*h,A=n.x,w=n.y,E=n.z;return i[0]=(1-(g+p))*A,i[1]=(f+y)*A,i[2]=(m-v)*A,i[3]=0,i[4]=(f-y)*w,i[5]=(1-(d+p))*w,i[6]=(x+_)*w,i[7]=0,i[8]=(m+v)*E,i[9]=(x-_)*E,i[10]=(1-(d+g))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=Ti.set(i[0],i[1],i[2]).length();const o=Ti.set(i[4],i[5],i[6]).length(),a=Ti.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],hn.copy(this);const c=1/r,u=1/o,h=1/a;return hn.elements[0]*=c,hn.elements[1]*=c,hn.elements[2]*=c,hn.elements[4]*=u,hn.elements[5]*=u,hn.elements[6]*=u,hn.elements[8]*=h,hn.elements[9]*=h,hn.elements[10]*=h,e.setFromRotationMatrix(hn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Cn){const l=this.elements,c=2*r/(e-t),u=2*r/(n-i),h=(e+t)/(e-t),d=(n+i)/(n-i);let f,m;if(a===Cn)f=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===ar)f=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Cn){const l=this.elements,c=1/(e-t),u=1/(n-i),h=1/(o-r),d=(e+t)*c,f=(n+i)*u;let m,g;if(a===Cn)m=(o+r)*h,g=-2*h;else if(a===ar)m=r*h,g=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=g,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ti=new L,hn=new At,Mu=new L(0,0,0),bu=new L(1,1,1),On=new L,Ps=new L,je=new L,Ga=new At,Va=new jn;class Zn{constructor(t=0,e=0,n=0,i=Zn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Fe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Fe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Fe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ga.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ga,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Va.setFromEuler(this),this.setFromQuaternion(Va,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Zn.DEFAULT_ORDER="XYZ";class Tc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let wu=0;const Wa=new L,Ai=new jn,Sn=new At,Ls=new L,as=new L,Su=new L,Eu=new jn,Xa=new L(1,0,0),qa=new L(0,1,0),Ya=new L(0,0,1),Tu={type:"added"},Au={type:"removed"};class ue extends ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=_i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ue.DEFAULT_UP.clone();const t=new L,e=new Zn,n=new jn,i=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new At},normalMatrix:{value:new Ot}}),this.matrix=new At,this.matrixWorld=new At,this.matrixAutoUpdate=ue.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Tc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ai.setFromAxisAngle(t,e),this.quaternion.multiply(Ai),this}rotateOnWorldAxis(t,e){return Ai.setFromAxisAngle(t,e),this.quaternion.premultiply(Ai),this}rotateX(t){return this.rotateOnAxis(Xa,t)}rotateY(t){return this.rotateOnAxis(qa,t)}rotateZ(t){return this.rotateOnAxis(Ya,t)}translateOnAxis(t,e){return Wa.copy(t).applyQuaternion(this.quaternion),this.position.add(Wa.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Xa,t)}translateY(t){return this.translateOnAxis(qa,t)}translateZ(t){return this.translateOnAxis(Ya,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ls.copy(t):Ls.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),as.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(as,Ls,this.up):Sn.lookAt(Ls,as,this.up),this.quaternion.setFromRotationMatrix(Sn),i&&(Sn.extractRotation(i.matrixWorld),Ai.setFromRotationMatrix(Sn),this.quaternion.premultiply(Ai.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Tu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Au)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Sn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Sn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,t,Su),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,Eu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}ue.DEFAULT_UP=new L(0,1,0);ue.DEFAULT_MATRIX_AUTO_UPDATE=!0;ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const un=new L,En=new L,Vr=new L,Tn=new L,Ri=new L,Ci=new L,$a=new L,Wr=new L,Xr=new L,qr=new L;let Ds=!1;class fn{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),un.subVectors(t,e),i.cross(un);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){un.subVectors(i,e),En.subVectors(n,e),Vr.subVectors(t,e);const o=un.dot(un),a=un.dot(En),l=un.dot(Vr),c=En.dot(En),u=En.dot(Vr),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,m=(o*u-a*l)*d;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Tn)===null?!1:Tn.x>=0&&Tn.y>=0&&Tn.x+Tn.y<=1}static getUV(t,e,n,i,r,o,a,l){return Ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ds=!0),this.getInterpolation(t,e,n,i,r,o,a,l)}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,Tn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Tn.x),l.addScaledVector(o,Tn.y),l.addScaledVector(a,Tn.z),l)}static isFrontFacing(t,e,n,i){return un.subVectors(n,e),En.subVectors(t,e),un.cross(En).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return un.subVectors(this.c,this.b),En.subVectors(this.a,this.b),un.cross(En).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return fn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return fn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,r){return Ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ds=!0),fn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}getInterpolation(t,e,n,i,r){return fn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return fn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return fn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;Ri.subVectors(i,n),Ci.subVectors(r,n),Wr.subVectors(t,n);const l=Ri.dot(Wr),c=Ci.dot(Wr);if(l<=0&&c<=0)return e.copy(n);Xr.subVectors(t,i);const u=Ri.dot(Xr),h=Ci.dot(Xr);if(u>=0&&h<=u)return e.copy(i);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Ri,o);qr.subVectors(t,r);const f=Ri.dot(qr),m=Ci.dot(qr);if(m>=0&&f<=m)return e.copy(r);const g=f*c-l*m;if(g<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(Ci,a);const x=u*m-f*h;if(x<=0&&h-u>=0&&f-m>=0)return $a.subVectors(r,i),a=(h-u)/(h-u+(f-m)),e.copy(i).addScaledVector($a,a);const p=1/(x+g+d);return o=g*p,a=d*p,e.copy(n).addScaledVector(Ri,o).addScaledVector(Ci,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ac={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},Is={h:0,s:0,l:0};function Yr(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class rt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Zt.workingColorSpace){if(t=ko(t,1),e=Fe(e,0,1),n=Fe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Yr(o,r,t+1/3),this.g=Yr(o,r,t),this.b=Yr(o,r,t-1/3)}return Zt.toWorkingColorSpace(this,i),this}setStyle(t,e=me){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=me){const n=Ac[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=qi(t.r),this.g=qi(t.g),this.b=qi(t.b),this}copyLinearToSRGB(t){return this.r=zr(t.r),this.g=zr(t.g),this.b=zr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=me){return Zt.fromWorkingColorSpace(Le.copy(this),t),Math.round(Fe(Le.r*255,0,255))*65536+Math.round(Fe(Le.g*255,0,255))*256+Math.round(Fe(Le.b*255,0,255))}getHexString(t=me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.fromWorkingColorSpace(Le.copy(this),e);const n=Le.r,i=Le.g,r=Le.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(i-r)/h+(i<r?6:0);break;case i:l=(r-n)/h+2;break;case r:l=(n-i)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Zt.workingColorSpace){return Zt.fromWorkingColorSpace(Le.copy(this),e),t.r=Le.r,t.g=Le.g,t.b=Le.b,t}getStyle(t=me){Zt.fromWorkingColorSpace(Le.copy(this),t);const e=Le.r,n=Le.g,i=Le.b;return t!==me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Bn),this.setHSL(Bn.h+t,Bn.s+e,Bn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Bn),t.getHSL(Is);const n=ms(Bn.h,Is.h,e),i=ms(Bn.s,Is.s,e),r=ms(Bn.l,Is.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Le=new rt;rt.NAMES=Ac;let Ru=0;class Jn extends ts{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ru++}),this.uuid=_i(),this.name="",this.type="Material",this.blending=pi,this.side=$n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_o,this.blendDst=yo,this.blendEquation=ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=nr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ua,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mi,this.stencilZFail=Mi,this.stencilZPass=Mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==pi&&(n.blending=this.blending),this.side!==$n&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==_o&&(n.blendSrc=this.blendSrc),this.blendDst!==yo&&(n.blendDst=this.blendDst),this.blendEquation!==ui&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==nr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ua&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class gr extends Jn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=dr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const _e=new L,Us=new Bt;class he{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=za,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Rn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Us.fromBufferAttribute(this,e),Us.applyMatrix3(t),this.setXY(e,Us.x,Us.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix3(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix4(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyNormalMatrix(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.transformDirection(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Bi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ne(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Bi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Bi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Bi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Bi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ne(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array),i=Ne(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ne(e,this.array),n=Ne(n,this.array),i=Ne(i,this.array),r=Ne(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==za&&(t.usage=this.usage),t}}class Fo extends he{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Rc extends he{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class $t extends he{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Cu=0;const en=new At,$r=new ue,Pi=new L,Ke=new Kn,ls=new Kn,Ee=new L;class ye extends ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cu++}),this.uuid=_i(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bc(t)?Rc:Fo)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return en.makeRotationFromQuaternion(t),this.applyMatrix4(en),this}rotateX(t){return en.makeRotationX(t),this.applyMatrix4(en),this}rotateY(t){return en.makeRotationY(t),this.applyMatrix4(en),this}rotateZ(t){return en.makeRotationZ(t),this.applyMatrix4(en),this}translate(t,e,n){return en.makeTranslation(t,e,n),this.applyMatrix4(en),this}scale(t,e,n){return en.makeScale(t,e,n),this.applyMatrix4(en),this}lookAt(t){return $r.lookAt(t),$r.updateMatrix(),this.applyMatrix4($r.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pi).negate(),this.translate(Pi.x,Pi.y,Pi.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new $t(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];Ke.setFromBufferAttribute(r),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];ls.setFromBufferAttribute(a),this.morphTargetsRelative?(Ee.addVectors(Ke.min,ls.min),Ke.expandByPoint(Ee),Ee.addVectors(Ke.max,ls.max),Ke.expandByPoint(Ee)):(Ke.expandByPoint(ls.min),Ke.expandByPoint(ls.max))}Ke.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Ee.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ee));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ee.fromBufferAttribute(a,c),l&&(Pi.fromBufferAttribute(t,c),Ee.add(Pi)),i=Math.max(i,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,r=e.normal.array,o=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new he(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let S=0;S<a;S++)c[S]=new L,u[S]=new L;const h=new L,d=new L,f=new L,m=new Bt,g=new Bt,x=new Bt,p=new L,_=new L;function v(S,H,P){h.fromArray(i,S*3),d.fromArray(i,H*3),f.fromArray(i,P*3),m.fromArray(o,S*2),g.fromArray(o,H*2),x.fromArray(o,P*2),d.sub(h),f.sub(h),g.sub(m),x.sub(m);const K=1/(g.x*x.y-x.x*g.y);isFinite(K)&&(p.copy(d).multiplyScalar(x.y).addScaledVector(f,-g.y).multiplyScalar(K),_.copy(f).multiplyScalar(g.x).addScaledVector(d,-x.x).multiplyScalar(K),c[S].add(p),c[H].add(p),c[P].add(p),u[S].add(_),u[H].add(_),u[P].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let S=0,H=y.length;S<H;++S){const P=y[S],K=P.start,R=P.count;for(let I=K,F=K+R;I<F;I+=3)v(n[I+0],n[I+1],n[I+2])}const A=new L,w=new L,E=new L,D=new L;function M(S){E.fromArray(r,S*3),D.copy(E);const H=c[S];A.copy(H),A.sub(E.multiplyScalar(E.dot(H))).normalize(),w.crossVectors(D,H);const K=w.dot(u[S])<0?-1:1;l[S*4]=A.x,l[S*4+1]=A.y,l[S*4+2]=A.z,l[S*4+3]=K}for(let S=0,H=y.length;S<H;++S){const P=y[S],K=P.start,R=P.count;for(let I=K,F=K+R;I<F;I+=3)M(n[I+0]),M(n[I+1]),M(n[I+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new he(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new L,r=new L,o=new L,a=new L,l=new L,c=new L,u=new L,h=new L;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),g=t.getX(d+1),x=t.getX(d+2);i.fromBufferAttribute(e,m),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,x),u.subVectors(o,r),h.subVectors(i,r),u.cross(h),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),a.add(u),l.add(u),c.add(u),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(x,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(i,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,m=0;for(let g=0,x=l.length;g<x;g++){a.isInterleavedBufferAttribute?f=l[g]*a.data.stride+a.offset:f=l[g]*u;for(let p=0;p<u;p++)d[m++]=c[f++]}return new he(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ye,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(i[l]=u,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ja=new At,oi=new mr,zs=new yn,Ka=new L,Li=new L,Di=new L,Ii=new L,jr=new L,Ns=new L,ks=new Bt,Fs=new Bt,Os=new Bt,Za=new L,Ja=new L,Qa=new L,Bs=new L,Hs=new L;class _t extends ue{constructor(t=new ye,e=new gr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){Ns.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(jr.fromBufferAttribute(h,t),o?Ns.addScaledVector(jr,u):Ns.addScaledVector(jr.sub(e),u))}e.add(Ns)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zs.copy(n.boundingSphere),zs.applyMatrix4(r),oi.copy(t.ray).recast(t.near),!(zs.containsPoint(oi.origin)===!1&&(oi.intersectSphere(zs,Ka)===null||oi.origin.distanceToSquared(Ka)>(t.far-t.near)**2))&&(ja.copy(r).invert(),oi.copy(t.ray).applyMatrix4(ja),!(n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,oi)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,g=d.length;m<g;m++){const x=d[m],p=o[x.materialIndex],_=Math.max(x.start,f.start),v=Math.min(a.count,Math.min(x.start+x.count,f.start+f.count));for(let y=_,A=v;y<A;y+=3){const w=a.getX(y),E=a.getX(y+1),D=a.getX(y+2);i=Gs(this,p,t,n,c,u,h,w,E,D),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=x.materialIndex,e.push(i))}}else{const m=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let x=m,p=g;x<p;x+=3){const _=a.getX(x),v=a.getX(x+1),y=a.getX(x+2);i=Gs(this,o,t,n,c,u,h,_,v,y),i&&(i.faceIndex=Math.floor(x/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,g=d.length;m<g;m++){const x=d[m],p=o[x.materialIndex],_=Math.max(x.start,f.start),v=Math.min(l.count,Math.min(x.start+x.count,f.start+f.count));for(let y=_,A=v;y<A;y+=3){const w=y,E=y+1,D=y+2;i=Gs(this,p,t,n,c,u,h,w,E,D),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=x.materialIndex,e.push(i))}}else{const m=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let x=m,p=g;x<p;x+=3){const _=x,v=x+1,y=x+2;i=Gs(this,o,t,n,c,u,h,_,v,y),i&&(i.faceIndex=Math.floor(x/3),e.push(i))}}}}function Pu(s,t,e,n,i,r,o,a){let l;if(t.side===Be?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===$n,a),l===null)return null;Hs.copy(a),Hs.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Hs);return c<e.near||c>e.far?null:{distance:c,point:Hs.clone(),object:s}}function Gs(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,Li),s.getVertexPosition(l,Di),s.getVertexPosition(c,Ii);const u=Pu(s,t,e,n,Li,Di,Ii,Bs);if(u){i&&(ks.fromBufferAttribute(i,a),Fs.fromBufferAttribute(i,l),Os.fromBufferAttribute(i,c),u.uv=fn.getInterpolation(Bs,Li,Di,Ii,ks,Fs,Os,new Bt)),r&&(ks.fromBufferAttribute(r,a),Fs.fromBufferAttribute(r,l),Os.fromBufferAttribute(r,c),u.uv1=fn.getInterpolation(Bs,Li,Di,Ii,ks,Fs,Os,new Bt),u.uv2=u.uv1),o&&(Za.fromBufferAttribute(o,a),Ja.fromBufferAttribute(o,l),Qa.fromBufferAttribute(o,c),u.normal=fn.getInterpolation(Bs,Li,Di,Ii,Za,Ja,Qa,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new L,materialIndex:0};fn.getNormal(Li,Di,Ii,h.normal),u.face=h}return u}class Ye extends ye{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,i,o,2),m("x","z","y",1,-1,t,n,-e,i,o,3),m("x","y","z",1,-1,t,e,n,i,r,4),m("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new $t(c,3)),this.setAttribute("normal",new $t(u,3)),this.setAttribute("uv",new $t(h,2));function m(g,x,p,_,v,y,A,w,E,D,M){const S=y/E,H=A/D,P=y/2,K=A/2,R=w/2,I=E+1,F=D+1;let k=0,N=0;const B=new L;for(let z=0;z<F;z++){const V=z*H-K;for(let j=0;j<I;j++){const G=j*S-P;B[g]=G*_,B[x]=V*v,B[p]=R,c.push(B.x,B.y,B.z),B[g]=0,B[x]=0,B[p]=w>0?1:-1,u.push(B.x,B.y,B.z),h.push(j/E),h.push(1-z/D),k+=1}}for(let z=0;z<D;z++)for(let V=0;V<E;V++){const j=d+V+I*z,G=d+V+I*(z+1),Z=d+(V+1)+I*(z+1),nt=d+(V+1)+I*z;l.push(j,G,nt),l.push(G,Z,nt),N+=6}a.addGroup(f,N,M),f+=N,d+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ye(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Zi(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function ke(s){const t={};for(let e=0;e<s.length;e++){const n=Zi(s[e]);for(const i in n)t[i]=n[i]}return t}function Lu(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Cc(s){return s.getRenderTarget()===null?s.outputColorSpace:Zt.workingColorSpace}const Du={clone:Zi,merge:ke};var Iu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Uu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Un extends Jn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Iu,this.fragmentShader=Uu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Zi(t.uniforms),this.uniformsGroups=Lu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Pc extends ue{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new At,this.projectionMatrix=new At,this.projectionMatrixInverse=new At,this.coordinateSystem=Cn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Oe extends Pc{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ki*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ps*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ki*2*Math.atan(Math.tan(ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ps*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ui=-90,zi=1;class zu extends ue{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Oe(Ui,zi,t,e);i.layers=this.layers,this.add(i);const r=new Oe(Ui,zi,t,e);r.layers=this.layers,this.add(r);const o=new Oe(Ui,zi,t,e);o.layers=this.layers,this.add(o);const a=new Oe(Ui,zi,t,e);a.layers=this.layers,this.add(a);const l=new Oe(Ui,zi,t,e);l.layers=this.layers,this.add(l);const c=new Oe(Ui,zi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Cn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ar)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Lc extends He{constructor(t,e,n,i,r,o,a,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:Yi,super(t,e,n,i,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Nu extends vi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(gs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===xi?me:on),this.texture=new Lc(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:We}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Ye(5,5,5),r=new Un({name:"CubemapFromEquirect",uniforms:Zi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:qn});r.uniforms.tEquirect.value=e;const o=new _t(i,r),a=e.minFilter;return e.minFilter===xs&&(e.minFilter=We),new zu(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}const Kr=new L,ku=new L,Fu=new Ot;class ci{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Kr.subVectors(n,e).cross(ku.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Kr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Fu.getNormalMatrix(t),i=this.coplanarPoint(Kr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ai=new yn,Vs=new L;class Oo{constructor(t=new ci,e=new ci,n=new ci,i=new ci,r=new ci,o=new ci){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Cn){const n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],u=i[5],h=i[6],d=i[7],f=i[8],m=i[9],g=i[10],x=i[11],p=i[12],_=i[13],v=i[14],y=i[15];if(n[0].setComponents(l-r,d-c,x-f,y-p).normalize(),n[1].setComponents(l+r,d+c,x+f,y+p).normalize(),n[2].setComponents(l+o,d+u,x+m,y+_).normalize(),n[3].setComponents(l-o,d-u,x-m,y-_).normalize(),n[4].setComponents(l-a,d-h,x-g,y-v).normalize(),e===Cn)n[5].setComponents(l+a,d+h,x+g,y+v).normalize();else if(e===ar)n[5].setComponents(a,h,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(t){return ai.center.set(0,0,0),ai.radius=.7071067811865476,ai.applyMatrix4(t.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Vs.x=i.normal.x>0?t.max.x:t.min.x,Vs.y=i.normal.y>0?t.max.y:t.min.y,Vs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Vs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Dc(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Ou(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,u){const h=c.array,d=c.usage,f=h.byteLength,m=s.createBuffer();s.bindBuffer(u,m),s.bufferData(u,h,d),c.onUploadCallback();let g;if(h instanceof Float32Array)g=s.FLOAT;else if(h instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)g=s.SHORT;else if(h instanceof Uint32Array)g=s.UNSIGNED_INT;else if(h instanceof Int32Array)g=s.INT;else if(h instanceof Int8Array)g=s.BYTE;else if(h instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:g,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,u,h){const d=u.array,f=u._updateRange,m=u.updateRanges;if(s.bindBuffer(h,c),f.count===-1&&m.length===0&&s.bufferSubData(h,0,d),m.length!==0){for(let g=0,x=m.length;g<x;g++){const p=m[g];e?s.bufferSubData(h,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):s.bufferSubData(h,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}u.clearUpdateRanges()}f.count!==-1&&(e?s.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):s.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),u.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);u&&(s.deleteBuffer(u.buffer),n.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);if(h===void 0)n.set(c,i(c,u));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(h.buffer,c,u),h.version=c.version}}return{get:o,remove:a,update:l}}class Qn extends ye{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,u=l+1,h=t/a,d=e/l,f=[],m=[],g=[],x=[];for(let p=0;p<u;p++){const _=p*d-o;for(let v=0;v<c;v++){const y=v*h-r;m.push(y,-_,0),g.push(0,0,1),x.push(v/a),x.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<a;_++){const v=_+c*p,y=_+c*(p+1),A=_+1+c*(p+1),w=_+1+c*p;f.push(v,y,w),f.push(y,A,w)}this.setIndex(f),this.setAttribute("position",new $t(m,3)),this.setAttribute("normal",new $t(g,3)),this.setAttribute("uv",new $t(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Bu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hu=`#ifdef USE_ALPHAHASH
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
#endif`,Gu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Vu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Wu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Xu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qu=`#ifdef USE_AOMAP
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
#endif`,Yu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$u=`#ifdef USE_BATCHING
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
#endif`,ju=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ku=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Zu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ju=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Qu=`#ifdef USE_IRIDESCENCE
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
#endif`,td=`#ifdef USE_BUMPMAP
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
#endif`,ed=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,nd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,id=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,rd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,od=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ad=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,ld=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,cd=`#define PI 3.141592653589793
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
} // validated`,hd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ud=`vec3 transformedNormal = objectNormal;
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
#endif`,dd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,fd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,pd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,md=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,gd="gl_FragColor = linearToOutputTexel( gl_FragColor );",xd=`
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
}`,vd=`#ifdef USE_ENVMAP
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
#endif`,_d=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,yd=`#ifdef USE_ENVMAP
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
#endif`,Md=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bd=`#ifdef USE_ENVMAP
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
#endif`,wd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ed=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Td=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ad=`#ifdef USE_GRADIENTMAP
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
}`,Rd=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Cd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ld=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dd=`uniform bool receiveShadow;
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
#endif`,Id=`#ifdef USE_ENVMAP
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
#endif`,Ud=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,kd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fd=`PhysicalMaterial material;
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
#endif`,Od=`struct PhysicalMaterial {
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
}`,Bd=`
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
#endif`,Hd=`#if defined( RE_IndirectDiffuse )
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
#endif`,Gd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,qd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Yd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$d=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Kd=`#if defined( USE_POINTS_UV )
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
#endif`,Zd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Jd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Qd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,tf=`#ifdef USE_MORPHNORMALS
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
#endif`,ef=`#ifdef USE_MORPHTARGETS
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
#endif`,nf=`#ifdef USE_MORPHTARGETS
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
#endif`,sf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,rf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,of=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,af=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,cf=`#ifdef USE_NORMALMAP
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
#endif`,hf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,uf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,df=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ff=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,pf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,mf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,gf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_f=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,wf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Sf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ef=`float getShadowMask() {
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
}`,Tf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Af=`#ifdef USE_SKINNING
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
#endif`,Rf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Cf=`#ifdef USE_SKINNING
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
#endif`,Pf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Df=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,If=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Uf=`#ifdef USE_TRANSMISSION
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
#endif`,zf=`#ifdef USE_TRANSMISSION
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
#endif`,Nf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ff=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Of=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Bf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Hf=`uniform sampler2D t2D;
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
}`,Gf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Wf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qf=`#include <common>
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
}`,Yf=`#if DEPTH_PACKING == 3200
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
}`,$f=`#define DISTANCE
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
}`,jf=`#define DISTANCE
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
}`,Kf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jf=`uniform float scale;
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
}`,Qf=`uniform vec3 diffuse;
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
}`,tp=`#include <common>
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
}`,ep=`uniform vec3 diffuse;
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
}`,np=`#define LAMBERT
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
}`,ip=`#define LAMBERT
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
}`,sp=`#define MATCAP
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
}`,rp=`#define MATCAP
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
}`,op=`#define NORMAL
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
}`,ap=`#define NORMAL
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
}`,lp=`#define PHONG
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
}`,cp=`#define PHONG
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
}`,hp=`#define STANDARD
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
}`,up=`#define STANDARD
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
}`,dp=`#define TOON
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
}`,fp=`#define TOON
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
}`,pp=`uniform float size;
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
}`,mp=`uniform vec3 diffuse;
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
}`,gp=`#include <common>
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
}`,xp=`uniform vec3 color;
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
}`,vp=`uniform float rotation;
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
}`,_p=`uniform vec3 diffuse;
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
}`,zt={alphahash_fragment:Bu,alphahash_pars_fragment:Hu,alphamap_fragment:Gu,alphamap_pars_fragment:Vu,alphatest_fragment:Wu,alphatest_pars_fragment:Xu,aomap_fragment:qu,aomap_pars_fragment:Yu,batching_pars_vertex:$u,batching_vertex:ju,begin_vertex:Ku,beginnormal_vertex:Zu,bsdfs:Ju,iridescence_fragment:Qu,bumpmap_pars_fragment:td,clipping_planes_fragment:ed,clipping_planes_pars_fragment:nd,clipping_planes_pars_vertex:id,clipping_planes_vertex:sd,color_fragment:rd,color_pars_fragment:od,color_pars_vertex:ad,color_vertex:ld,common:cd,cube_uv_reflection_fragment:hd,defaultnormal_vertex:ud,displacementmap_pars_vertex:dd,displacementmap_vertex:fd,emissivemap_fragment:pd,emissivemap_pars_fragment:md,colorspace_fragment:gd,colorspace_pars_fragment:xd,envmap_fragment:vd,envmap_common_pars_fragment:_d,envmap_pars_fragment:yd,envmap_pars_vertex:Md,envmap_physical_pars_fragment:Id,envmap_vertex:bd,fog_vertex:wd,fog_pars_vertex:Sd,fog_fragment:Ed,fog_pars_fragment:Td,gradientmap_pars_fragment:Ad,lightmap_fragment:Rd,lightmap_pars_fragment:Cd,lights_lambert_fragment:Pd,lights_lambert_pars_fragment:Ld,lights_pars_begin:Dd,lights_toon_fragment:Ud,lights_toon_pars_fragment:zd,lights_phong_fragment:Nd,lights_phong_pars_fragment:kd,lights_physical_fragment:Fd,lights_physical_pars_fragment:Od,lights_fragment_begin:Bd,lights_fragment_maps:Hd,lights_fragment_end:Gd,logdepthbuf_fragment:Vd,logdepthbuf_pars_fragment:Wd,logdepthbuf_pars_vertex:Xd,logdepthbuf_vertex:qd,map_fragment:Yd,map_pars_fragment:$d,map_particle_fragment:jd,map_particle_pars_fragment:Kd,metalnessmap_fragment:Zd,metalnessmap_pars_fragment:Jd,morphcolor_vertex:Qd,morphnormal_vertex:tf,morphtarget_pars_vertex:ef,morphtarget_vertex:nf,normal_fragment_begin:sf,normal_fragment_maps:rf,normal_pars_fragment:of,normal_pars_vertex:af,normal_vertex:lf,normalmap_pars_fragment:cf,clearcoat_normal_fragment_begin:hf,clearcoat_normal_fragment_maps:uf,clearcoat_pars_fragment:df,iridescence_pars_fragment:ff,opaque_fragment:pf,packing:mf,premultiplied_alpha_fragment:gf,project_vertex:xf,dithering_fragment:vf,dithering_pars_fragment:_f,roughnessmap_fragment:yf,roughnessmap_pars_fragment:Mf,shadowmap_pars_fragment:bf,shadowmap_pars_vertex:wf,shadowmap_vertex:Sf,shadowmask_pars_fragment:Ef,skinbase_vertex:Tf,skinning_pars_vertex:Af,skinning_vertex:Rf,skinnormal_vertex:Cf,specularmap_fragment:Pf,specularmap_pars_fragment:Lf,tonemapping_fragment:Df,tonemapping_pars_fragment:If,transmission_fragment:Uf,transmission_pars_fragment:zf,uv_pars_fragment:Nf,uv_pars_vertex:kf,uv_vertex:Ff,worldpos_vertex:Of,background_vert:Bf,background_frag:Hf,backgroundCube_vert:Gf,backgroundCube_frag:Vf,cube_vert:Wf,cube_frag:Xf,depth_vert:qf,depth_frag:Yf,distanceRGBA_vert:$f,distanceRGBA_frag:jf,equirect_vert:Kf,equirect_frag:Zf,linedashed_vert:Jf,linedashed_frag:Qf,meshbasic_vert:tp,meshbasic_frag:ep,meshlambert_vert:np,meshlambert_frag:ip,meshmatcap_vert:sp,meshmatcap_frag:rp,meshnormal_vert:op,meshnormal_frag:ap,meshphong_vert:lp,meshphong_frag:cp,meshphysical_vert:hp,meshphysical_frag:up,meshtoon_vert:dp,meshtoon_frag:fp,points_vert:pp,points_frag:mp,shadow_vert:gp,shadow_frag:xp,sprite_vert:vp,sprite_frag:_p},st={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},xn={basic:{uniforms:ke([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:ke([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new rt(0)}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:ke([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:ke([st.common,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.roughnessmap,st.metalnessmap,st.fog,st.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:ke([st.common,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.gradientmap,st.fog,st.lights,{emissive:{value:new rt(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:ke([st.common,st.bumpmap,st.normalmap,st.displacementmap,st.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:ke([st.points,st.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:ke([st.common,st.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:ke([st.common,st.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:ke([st.common,st.bumpmap,st.normalmap,st.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:ke([st.sprite,st.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distanceRGBA:{uniforms:ke([st.common,st.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distanceRGBA_vert,fragmentShader:zt.distanceRGBA_frag},shadow:{uniforms:ke([st.lights,st.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};xn.physical={uniforms:ke([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};const Ws={r:0,b:0,g:0};function yp(s,t,e,n,i,r,o){const a=new rt(0);let l=r===!0?0:1,c,u,h=null,d=0,f=null;function m(x,p){let _=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?e:t).get(v)),v===null?g(a,l):v&&v.isColor&&(g(v,1),_=!0);const y=s.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||_)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),v&&(v.isCubeTexture||v.mapping===fr)?(u===void 0&&(u=new _t(new Ye(1,1,1),new Un({name:"BackgroundCubeMaterial",uniforms:Zi(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=v,u.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,u.material.toneMapped=Zt.getTransfer(v.colorSpace)!==ie,(h!==v||d!==v.version||f!==s.toneMapping)&&(u.material.needsUpdate=!0,h=v,d=v.version,f=s.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new _t(new Qn(2,2),new Un({name:"BackgroundMaterial",uniforms:Zi(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:$n,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=Zt.getTransfer(v.colorSpace)!==ie,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||d!==v.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,h=v,d=v.version,f=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function g(x,p){x.getRGB(Ws,Cc(s)),n.buffers.color.setClear(Ws.r,Ws.g,Ws.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(x,p=1){a.set(x),l=p,g(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,g(a,l)},render:m}}function Mp(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=x(null);let c=l,u=!1;function h(R,I,F,k,N){let B=!1;if(o){const z=g(k,F,I);c!==z&&(c=z,f(c.object)),B=p(R,k,F,N),B&&_(R,k,F,N)}else{const z=I.wireframe===!0;(c.geometry!==k.id||c.program!==F.id||c.wireframe!==z)&&(c.geometry=k.id,c.program=F.id,c.wireframe=z,B=!0)}N!==null&&e.update(N,s.ELEMENT_ARRAY_BUFFER),(B||u)&&(u=!1,D(R,I,F,k),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function f(R){return n.isWebGL2?s.bindVertexArray(R):r.bindVertexArrayOES(R)}function m(R){return n.isWebGL2?s.deleteVertexArray(R):r.deleteVertexArrayOES(R)}function g(R,I,F){const k=F.wireframe===!0;let N=a[R.id];N===void 0&&(N={},a[R.id]=N);let B=N[I.id];B===void 0&&(B={},N[I.id]=B);let z=B[k];return z===void 0&&(z=x(d()),B[k]=z),z}function x(R){const I=[],F=[],k=[];for(let N=0;N<i;N++)I[N]=0,F[N]=0,k[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:k,object:R,attributes:{},index:null}}function p(R,I,F,k){const N=c.attributes,B=I.attributes;let z=0;const V=F.getAttributes();for(const j in V)if(V[j].location>=0){const Z=N[j];let nt=B[j];if(nt===void 0&&(j==="instanceMatrix"&&R.instanceMatrix&&(nt=R.instanceMatrix),j==="instanceColor"&&R.instanceColor&&(nt=R.instanceColor)),Z===void 0||Z.attribute!==nt||nt&&Z.data!==nt.data)return!0;z++}return c.attributesNum!==z||c.index!==k}function _(R,I,F,k){const N={},B=I.attributes;let z=0;const V=F.getAttributes();for(const j in V)if(V[j].location>=0){let Z=B[j];Z===void 0&&(j==="instanceMatrix"&&R.instanceMatrix&&(Z=R.instanceMatrix),j==="instanceColor"&&R.instanceColor&&(Z=R.instanceColor));const nt={};nt.attribute=Z,Z&&Z.data&&(nt.data=Z.data),N[j]=nt,z++}c.attributes=N,c.attributesNum=z,c.index=k}function v(){const R=c.newAttributes;for(let I=0,F=R.length;I<F;I++)R[I]=0}function y(R){A(R,0)}function A(R,I){const F=c.newAttributes,k=c.enabledAttributes,N=c.attributeDivisors;F[R]=1,k[R]===0&&(s.enableVertexAttribArray(R),k[R]=1),N[R]!==I&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,I),N[R]=I)}function w(){const R=c.newAttributes,I=c.enabledAttributes;for(let F=0,k=I.length;F<k;F++)I[F]!==R[F]&&(s.disableVertexAttribArray(F),I[F]=0)}function E(R,I,F,k,N,B,z){z===!0?s.vertexAttribIPointer(R,I,F,N,B):s.vertexAttribPointer(R,I,F,k,N,B)}function D(R,I,F,k){if(n.isWebGL2===!1&&(R.isInstancedMesh||k.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const N=k.attributes,B=F.getAttributes(),z=I.defaultAttributeValues;for(const V in B){const j=B[V];if(j.location>=0){let G=N[V];if(G===void 0&&(V==="instanceMatrix"&&R.instanceMatrix&&(G=R.instanceMatrix),V==="instanceColor"&&R.instanceColor&&(G=R.instanceColor)),G!==void 0){const Z=G.normalized,nt=G.itemSize,ht=e.get(G);if(ht===void 0)continue;const ut=ht.buffer,xt=ht.type,Rt=ht.bytesPerElement,yt=n.isWebGL2===!0&&(xt===s.INT||xt===s.UNSIGNED_INT||G.gpuType===dc);if(G.isInterleavedBufferAttribute){const Vt=G.data,W=Vt.stride,De=G.offset;if(Vt.isInstancedInterleavedBuffer){for(let Mt=0;Mt<j.locationSize;Mt++)A(j.location+Mt,Vt.meshPerAttribute);R.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=Vt.meshPerAttribute*Vt.count)}else for(let Mt=0;Mt<j.locationSize;Mt++)y(j.location+Mt);s.bindBuffer(s.ARRAY_BUFFER,ut);for(let Mt=0;Mt<j.locationSize;Mt++)E(j.location+Mt,nt/j.locationSize,xt,Z,W*Rt,(De+nt/j.locationSize*Mt)*Rt,yt)}else{if(G.isInstancedBufferAttribute){for(let Vt=0;Vt<j.locationSize;Vt++)A(j.location+Vt,G.meshPerAttribute);R.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let Vt=0;Vt<j.locationSize;Vt++)y(j.location+Vt);s.bindBuffer(s.ARRAY_BUFFER,ut);for(let Vt=0;Vt<j.locationSize;Vt++)E(j.location+Vt,nt/j.locationSize,xt,Z,nt*Rt,nt/j.locationSize*Vt*Rt,yt)}}else if(z!==void 0){const Z=z[V];if(Z!==void 0)switch(Z.length){case 2:s.vertexAttrib2fv(j.location,Z);break;case 3:s.vertexAttrib3fv(j.location,Z);break;case 4:s.vertexAttrib4fv(j.location,Z);break;default:s.vertexAttrib1fv(j.location,Z)}}}}w()}function M(){P();for(const R in a){const I=a[R];for(const F in I){const k=I[F];for(const N in k)m(k[N].object),delete k[N];delete I[F]}delete a[R]}}function S(R){if(a[R.id]===void 0)return;const I=a[R.id];for(const F in I){const k=I[F];for(const N in k)m(k[N].object),delete k[N];delete I[F]}delete a[R.id]}function H(R){for(const I in a){const F=a[I];if(F[R.id]===void 0)continue;const k=F[R.id];for(const N in k)m(k[N].object),delete k[N];delete F[R.id]}}function P(){K(),u=!0,c!==l&&(c=l,f(c.object))}function K(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:P,resetDefaultState:K,dispose:M,releaseStatesOfGeometry:S,releaseStatesOfProgram:H,initAttributes:v,enableAttribute:y,disableUnusedAttributes:w}}function bp(s,t,e,n){const i=n.isWebGL2;let r;function o(u){r=u}function a(u,h){s.drawArrays(r,u,h),e.update(h,r,1)}function l(u,h,d){if(d===0)return;let f,m;if(i)f=s,m="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[m](r,u,h,d),e.update(h,r,d)}function c(u,h,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<d;m++)this.render(u[m],h[m]);else{f.multiDrawArraysWEBGL(r,u,0,h,0,d);let m=0;for(let g=0;g<d;g++)m+=h[g];e.update(m,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function wp(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,h=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),v=d>0,y=o||t.has("OES_texture_float"),A=v&&y,w=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:x,maxVaryings:p,maxFragmentUniforms:_,vertexTextures:v,floatFragmentTextures:y,floatVertexTextures:A,maxSamples:w}}function Sp(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new ci,a=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||i;return i=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const m=h.clippingPlanes,g=h.clipIntersection,x=h.clipShadows,p=s.get(h);if(!i||m===null||m.length===0||r&&!x)r?u(null):c();else{const _=r?0:n,v=_*4;let y=p.clippingState||null;l.value=y,y=u(m,d,v,f);for(let A=0;A!==v;++A)y[A]=e[A];p.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,m){const g=h!==null?h.length:0;let x=null;if(g!==0){if(x=l.value,m!==!0||x===null){const p=f+g*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(x===null||x.length<p)&&(x=new Float32Array(p));for(let v=0,y=f;v!==g;++v,y+=4)o.copy(h[v]).applyMatrix4(_,a),o.normal.toArray(x,y),x[y+3]=o.constant}l.value=x,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,x}}function Ep(s){let t=new WeakMap;function e(o,a){return a===Mo?o.mapping=Yi:a===bo&&(o.mapping=$i),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Mo||a===bo)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Nu(l.height/2);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Ic extends Pc{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Hi=4,tl=[.125,.215,.35,.446,.526,.582],di=20,Zr=new Ic,el=new rt;let Jr=null,Qr=0,to=0;const hi=(1+Math.sqrt(5))/2,Ni=1/hi,nl=[new L(1,1,1),new L(-1,1,1),new L(1,1,-1),new L(-1,1,-1),new L(0,hi,Ni),new L(0,hi,-Ni),new L(Ni,0,hi),new L(-Ni,0,hi),new L(hi,Ni,0),new L(-hi,Ni,0)];class il{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Jr=this._renderer.getRenderTarget(),Qr=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ol(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Jr,Qr,to),t.scissorTest=!1,Xs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Yi||t.mapping===$i?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Jr=this._renderer.getRenderTarget(),Qr=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:We,minFilter:We,generateMipmaps:!1,type:vs,format:rn,colorSpace:In,depthBuffer:!1},i=sl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Tp(r)),this._blurMaterial=Ap(r,t,e)}return i}_compileMaterial(t){const e=new _t(this._lodPlanes[0],t);this._renderer.compile(e,Zr)}_sceneToCubeUV(t,e,n,i){const a=new Oe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(el),u.toneMapping=Yn,u.autoClear=!1;const f=new gr({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),m=new _t(new Ye,f);let g=!1;const x=t.background;x?x.isColor&&(f.color.copy(x),t.background=null,g=!0):(f.color.copy(el),g=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):_===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const v=this._cubeSize;Xs(i,_*v,p>2?v:0,v,v),u.setRenderTarget(i),g&&u.render(m,a),u.render(t,a)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=h,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Yi||t.mapping===$i;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=ol()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rl());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new _t(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Xs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Zr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=nl[(i-1)%nl.length];this._blur(t,i-1,i,r,o)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new _t(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*di-1),g=r/m,x=isFinite(r)?1+Math.floor(u*g):di;x>di&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${di}`);const p=[];let _=0;for(let E=0;E<di;++E){const D=E/g,M=Math.exp(-D*D/2);p.push(M),E===0?_+=M:E<x&&(_+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;d.envMap.value=t.texture,d.samples.value=x,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=m,d.mipInt.value=v-n;const y=this._sizeLods[i],A=3*y*(i>v-Hi?i-v+Hi:0),w=4*(this._cubeSize-y);Xs(e,A,w,3*y,2*y),l.setRenderTarget(e),l.render(h,Zr)}}function Tp(s){const t=[],e=[],n=[];let i=s;const r=s-Hi+1+tl.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>s-Hi?l=tl[o-s+Hi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,m=6,g=3,x=2,p=1,_=new Float32Array(g*m*f),v=new Float32Array(x*m*f),y=new Float32Array(p*m*f);for(let w=0;w<f;w++){const E=w%3*2/3-1,D=w>2?0:-1,M=[E,D,0,E+2/3,D,0,E+2/3,D+1,0,E,D,0,E+2/3,D+1,0,E,D+1,0];_.set(M,g*m*w),v.set(d,x*m*w);const S=[w,w,w,w,w,w];y.set(S,p*m*w)}const A=new ye;A.setAttribute("position",new he(_,g)),A.setAttribute("uv",new he(v,x)),A.setAttribute("faceIndex",new he(y,p)),t.push(A),i>Hi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function sl(s,t,e){const n=new vi(s,t,e);return n.texture.mapping=fr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Xs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Ap(s,t,e){const n=new Float32Array(di),i=new L(0,1,0);return new Un({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Bo(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function rl(){return new Un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bo(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function ol(){return new Un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Bo(){return`

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
	`}function Rp(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Mo||l===bo,u=l===Yi||l===$i;if(c||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let h=t.get(a);return e===null&&(e=new il(s)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),t.set(a,h),h.texture}else{if(t.has(a))return t.get(a).texture;{const h=a.image;if(c&&h&&h.height>0||u&&h&&i(h)){e===null&&(e=new il(s));const d=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Cp(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Pp(s,t,e,n){const i={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const g=d.morphAttributes[m];for(let x=0,p=g.length;x<p;x++)t.remove(g[x])}d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const m in d)t.update(d[m],s.ARRAY_BUFFER);const f=h.morphAttributes;for(const m in f){const g=f[m];for(let x=0,p=g.length;x<p;x++)t.update(g[x],s.ARRAY_BUFFER)}}function c(h){const d=[],f=h.index,m=h.attributes.position;let g=0;if(f!==null){const _=f.array;g=f.version;for(let v=0,y=_.length;v<y;v+=3){const A=_[v+0],w=_[v+1],E=_[v+2];d.push(A,w,w,E,E,A)}}else if(m!==void 0){const _=m.array;g=m.version;for(let v=0,y=_.length/3-1;v<y;v+=3){const A=v+0,w=v+1,E=v+2;d.push(A,w,w,E,E,A)}}else return;const x=new(bc(d)?Rc:Fo)(d,1);x.version=g;const p=r.get(h);p&&t.remove(p),r.set(h,x)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Lp(s,t,e,n){const i=n.isWebGL2;let r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function u(f,m){s.drawElements(r,m,a,f*l),e.update(m,r,1)}function h(f,m,g){if(g===0)return;let x,p;if(i)x=s,p="drawElementsInstanced";else if(x=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",x===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}x[p](r,m,a,f*l,g),e.update(m,r,g)}function d(f,m,g){if(g===0)return;const x=t.get("WEBGL_multi_draw");if(x===null)for(let p=0;p<g;p++)this.render(f[p]/l,m[p]);else{x.multiDrawElementsWEBGL(r,m,0,a,f,0,g);let p=0;for(let _=0;_<g;_++)p+=m[_];e.update(p,r,1)}}this.setMode=o,this.setIndex=c,this.render=u,this.renderInstances=h,this.renderMultiDraw=d}function Dp(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Ip(s,t){return s[0]-t[0]}function Up(s,t){return Math.abs(t[1])-Math.abs(s[1])}function zp(s,t,e){const n={},i=new Float32Array(8),r=new WeakMap,o=new Jt,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,u,h){const d=c.morphTargetInfluences;if(t.isWebGL2===!0){const m=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=m!==void 0?m.length:0;let x=r.get(u);if(x===void 0||x.count!==g){let I=function(){K.dispose(),r.delete(u),u.removeEventListener("dispose",I)};var f=I;x!==void 0&&x.texture.dispose();const v=u.morphAttributes.position!==void 0,y=u.morphAttributes.normal!==void 0,A=u.morphAttributes.color!==void 0,w=u.morphAttributes.position||[],E=u.morphAttributes.normal||[],D=u.morphAttributes.color||[];let M=0;v===!0&&(M=1),y===!0&&(M=2),A===!0&&(M=3);let S=u.attributes.position.count*M,H=1;S>t.maxTextureSize&&(H=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const P=new Float32Array(S*H*4*g),K=new Ec(P,S,H,g);K.type=Rn,K.needsUpdate=!0;const R=M*4;for(let F=0;F<g;F++){const k=w[F],N=E[F],B=D[F],z=S*H*4*F;for(let V=0;V<k.count;V++){const j=V*R;v===!0&&(o.fromBufferAttribute(k,V),P[z+j+0]=o.x,P[z+j+1]=o.y,P[z+j+2]=o.z,P[z+j+3]=0),y===!0&&(o.fromBufferAttribute(N,V),P[z+j+4]=o.x,P[z+j+5]=o.y,P[z+j+6]=o.z,P[z+j+7]=0),A===!0&&(o.fromBufferAttribute(B,V),P[z+j+8]=o.x,P[z+j+9]=o.y,P[z+j+10]=o.z,P[z+j+11]=B.itemSize===4?o.w:1)}}x={count:g,texture:K,size:new Bt(S,H)},r.set(u,x),u.addEventListener("dispose",I)}let p=0;for(let v=0;v<d.length;v++)p+=d[v];const _=u.morphTargetsRelative?1:1-p;h.getUniforms().setValue(s,"morphTargetBaseInfluence",_),h.getUniforms().setValue(s,"morphTargetInfluences",d),h.getUniforms().setValue(s,"morphTargetsTexture",x.texture,e),h.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}else{const m=d===void 0?0:d.length;let g=n[u.id];if(g===void 0||g.length!==m){g=[];for(let y=0;y<m;y++)g[y]=[y,0];n[u.id]=g}for(let y=0;y<m;y++){const A=g[y];A[0]=y,A[1]=d[y]}g.sort(Up);for(let y=0;y<8;y++)y<m&&g[y][1]?(a[y][0]=g[y][0],a[y][1]=g[y][1]):(a[y][0]=Number.MAX_SAFE_INTEGER,a[y][1]=0);a.sort(Ip);const x=u.morphAttributes.position,p=u.morphAttributes.normal;let _=0;for(let y=0;y<8;y++){const A=a[y],w=A[0],E=A[1];w!==Number.MAX_SAFE_INTEGER&&E?(x&&u.getAttribute("morphTarget"+y)!==x[w]&&u.setAttribute("morphTarget"+y,x[w]),p&&u.getAttribute("morphNormal"+y)!==p[w]&&u.setAttribute("morphNormal"+y,p[w]),i[y]=E,_+=E):(x&&u.hasAttribute("morphTarget"+y)===!0&&u.deleteAttribute("morphTarget"+y),p&&u.hasAttribute("morphNormal"+y)===!0&&u.deleteAttribute("morphNormal"+y),i[y]=0)}const v=u.morphTargetsRelative?1:1-_;h.getUniforms().setValue(s,"morphTargetBaseInfluence",v),h.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function Np(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(i.get(h)!==c&&(t.update(h),i.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return h}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Uc extends He{constructor(t,e,n,i,r,o,a,l,c,u){if(u=u!==void 0?u:gi,u!==gi&&u!==ji)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===gi&&(n=Xn),n===void 0&&u===ji&&(n=mi),super(null,i,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ae,this.minFilter=l!==void 0?l:Ae,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const zc=new He,Nc=new Uc(1,1);Nc.compareFunction=Mc;const kc=new Ec,Fc=new _u,Oc=new Lc,al=[],ll=[],cl=new Float32Array(16),hl=new Float32Array(9),ul=new Float32Array(4);function es(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=al[i];if(r===void 0&&(r=new Float32Array(i),al[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Me(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function be(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function xr(s,t){let e=ll[t];e===void 0&&(e=new Int32Array(t),ll[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function kp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Fp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;s.uniform2fv(this.addr,t),be(e,t)}}function Op(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Me(e,t))return;s.uniform3fv(this.addr,t),be(e,t)}}function Bp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;s.uniform4fv(this.addr,t),be(e,t)}}function Hp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;ul.set(n),s.uniformMatrix2fv(this.addr,!1,ul),be(e,n)}}function Gp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;hl.set(n),s.uniformMatrix3fv(this.addr,!1,hl),be(e,n)}}function Vp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;cl.set(n),s.uniformMatrix4fv(this.addr,!1,cl),be(e,n)}}function Wp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Xp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;s.uniform2iv(this.addr,t),be(e,t)}}function qp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Me(e,t))return;s.uniform3iv(this.addr,t),be(e,t)}}function Yp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;s.uniform4iv(this.addr,t),be(e,t)}}function $p(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function jp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;s.uniform2uiv(this.addr,t),be(e,t)}}function Kp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Me(e,t))return;s.uniform3uiv(this.addr,t),be(e,t)}}function Zp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;s.uniform4uiv(this.addr,t),be(e,t)}}function Jp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Nc:zc;e.setTexture2D(t||r,i)}function Qp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Fc,i)}function t0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Oc,i)}function e0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||kc,i)}function n0(s){switch(s){case 5126:return kp;case 35664:return Fp;case 35665:return Op;case 35666:return Bp;case 35674:return Hp;case 35675:return Gp;case 35676:return Vp;case 5124:case 35670:return Wp;case 35667:case 35671:return Xp;case 35668:case 35672:return qp;case 35669:case 35673:return Yp;case 5125:return $p;case 36294:return jp;case 36295:return Kp;case 36296:return Zp;case 35678:case 36198:case 36298:case 36306:case 35682:return Jp;case 35679:case 36299:case 36307:return Qp;case 35680:case 36300:case 36308:case 36293:return t0;case 36289:case 36303:case 36311:case 36292:return e0}}function i0(s,t){s.uniform1fv(this.addr,t)}function s0(s,t){const e=es(t,this.size,2);s.uniform2fv(this.addr,e)}function r0(s,t){const e=es(t,this.size,3);s.uniform3fv(this.addr,e)}function o0(s,t){const e=es(t,this.size,4);s.uniform4fv(this.addr,e)}function a0(s,t){const e=es(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function l0(s,t){const e=es(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function c0(s,t){const e=es(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function h0(s,t){s.uniform1iv(this.addr,t)}function u0(s,t){s.uniform2iv(this.addr,t)}function d0(s,t){s.uniform3iv(this.addr,t)}function f0(s,t){s.uniform4iv(this.addr,t)}function p0(s,t){s.uniform1uiv(this.addr,t)}function m0(s,t){s.uniform2uiv(this.addr,t)}function g0(s,t){s.uniform3uiv(this.addr,t)}function x0(s,t){s.uniform4uiv(this.addr,t)}function v0(s,t,e){const n=this.cache,i=t.length,r=xr(e,i);Me(n,r)||(s.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||zc,r[o])}function _0(s,t,e){const n=this.cache,i=t.length,r=xr(e,i);Me(n,r)||(s.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Fc,r[o])}function y0(s,t,e){const n=this.cache,i=t.length,r=xr(e,i);Me(n,r)||(s.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Oc,r[o])}function M0(s,t,e){const n=this.cache,i=t.length,r=xr(e,i);Me(n,r)||(s.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||kc,r[o])}function b0(s){switch(s){case 5126:return i0;case 35664:return s0;case 35665:return r0;case 35666:return o0;case 35674:return a0;case 35675:return l0;case 35676:return c0;case 5124:case 35670:return h0;case 35667:case 35671:return u0;case 35668:case 35672:return d0;case 35669:case 35673:return f0;case 5125:return p0;case 36294:return m0;case 36295:return g0;case 36296:return x0;case 35678:case 36198:case 36298:case 36306:case 35682:return v0;case 35679:case 36299:case 36307:return _0;case 35680:case 36300:case 36308:case 36293:return y0;case 36289:case 36303:case 36311:case 36292:return M0}}class w0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=n0(e.type)}}class S0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=b0(e.type)}}class E0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const eo=/(\w+)(\])?(\[|\.)?/g;function dl(s,t){s.seq.push(t),s.map[t.id]=t}function T0(s,t,e){const n=s.name,i=n.length;for(eo.lastIndex=0;;){const r=eo.exec(n),o=eo.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){dl(e,c===void 0?new w0(a,s,t):new S0(a,s,t));break}else{let h=e.map[a];h===void 0&&(h=new E0(a),dl(e,h)),e=h}}}class er{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);T0(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function fl(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const A0=37297;let R0=0;function C0(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function P0(s){const t=Zt.getPrimaries(Zt.workingColorSpace),e=Zt.getPrimaries(s);let n;switch(t===e?n="":t===or&&e===rr?n="LinearDisplayP3ToLinearSRGB":t===rr&&e===or&&(n="LinearSRGBToLinearDisplayP3"),s){case In:case pr:return[n,"LinearTransferOETF"];case me:case No:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function pl(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+C0(s.getShaderSource(t),o)}else return i}function L0(s,t){const e=P0(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function D0(s,t){let e;switch(t){case Ch:e="Linear";break;case Ph:e="Reinhard";break;case Lh:e="OptimizedCineon";break;case hc:e="ACESFilmic";break;case Ih:e="AgX";break;case Dh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function I0(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Gi).join(`
`)}function U0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Gi).join(`
`)}function z0(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function N0(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function Gi(s){return s!==""}function ml(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function gl(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const k0=/^[ \t]*#include +<([\w\d./]+)>/gm;function To(s){return s.replace(k0,O0)}const F0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function O0(s,t){let e=zt[t];if(e===void 0){const n=F0.get(t);if(n!==void 0)e=zt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return To(e)}const B0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xl(s){return s.replace(B0,H0)}function H0(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function vl(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function G0(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===lc?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===cc?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===An&&(t="SHADOWMAP_TYPE_VSM"),t}function V0(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Yi:case $i:t="ENVMAP_TYPE_CUBE";break;case fr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function W0(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case $i:t="ENVMAP_MODE_REFRACTION";break}return t}function X0(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case dr:t="ENVMAP_BLENDING_MULTIPLY";break;case Ah:t="ENVMAP_BLENDING_MIX";break;case Rh:t="ENVMAP_BLENDING_ADD";break}return t}function q0(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Y0(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=G0(e),c=V0(e),u=W0(e),h=X0(e),d=q0(e),f=e.isWebGL2?"":I0(e),m=U0(e),g=z0(r),x=i.createProgram();let p,_,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Gi).join(`
`),p.length>0&&(p+=`
`),_=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Gi).join(`
`),_.length>0&&(_+=`
`)):(p=[vl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Gi).join(`
`),_=[f,vl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Yn?"#define TONE_MAPPING":"",e.toneMapping!==Yn?zt.tonemapping_pars_fragment:"",e.toneMapping!==Yn?D0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,L0("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Gi).join(`
`)),o=To(o),o=ml(o,e),o=gl(o,e),a=To(a),a=ml(a,e),a=gl(a,e),o=xl(o),a=xl(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,_=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Na?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Na?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const y=v+p+o,A=v+_+a,w=fl(i,i.VERTEX_SHADER,y),E=fl(i,i.FRAGMENT_SHADER,A);i.attachShader(x,w),i.attachShader(x,E),e.index0AttributeName!==void 0?i.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function D(P){if(s.debug.checkShaderErrors){const K=i.getProgramInfoLog(x).trim(),R=i.getShaderInfoLog(w).trim(),I=i.getShaderInfoLog(E).trim();let F=!0,k=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(F=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,w,E);else{const N=pl(i,w,"vertex"),B=pl(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Program Info Log: `+K+`
`+N+`
`+B)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(R===""||I==="")&&(k=!1);k&&(P.diagnostics={runnable:F,programLog:K,vertexShader:{log:R,prefix:p},fragmentShader:{log:I,prefix:_}})}i.deleteShader(w),i.deleteShader(E),M=new er(i,x),S=N0(i,x)}let M;this.getUniforms=function(){return M===void 0&&D(this),M};let S;this.getAttributes=function(){return S===void 0&&D(this),S};let H=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return H===!1&&(H=i.getProgramParameter(x,A0)),H},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=R0++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=E,this}let $0=0;class j0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new K0(t),e.set(t,n)),n}}class K0{constructor(t){this.id=$0++,this.code=t,this.usedTimes=0}}function Z0(s,t,e,n,i,r,o){const a=new Tc,l=new j0,c=[],u=i.isWebGL2,h=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return M===0?"uv":`uv${M}`}function x(M,S,H,P,K){const R=P.fog,I=K.geometry,F=M.isMeshStandardMaterial?P.environment:null,k=(M.isMeshStandardMaterial?e:t).get(M.envMap||F),N=k&&k.mapping===fr?k.image.height:null,B=m[M.type];M.precision!==null&&(f=i.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const z=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,V=z!==void 0?z.length:0;let j=0;I.morphAttributes.position!==void 0&&(j=1),I.morphAttributes.normal!==void 0&&(j=2),I.morphAttributes.color!==void 0&&(j=3);let G,Z,nt,ht;if(B){const Ie=xn[B];G=Ie.vertexShader,Z=Ie.fragmentShader}else G=M.vertexShader,Z=M.fragmentShader,l.update(M),nt=l.getVertexShaderID(M),ht=l.getFragmentShaderID(M);const ut=s.getRenderTarget(),xt=K.isInstancedMesh===!0,Rt=K.isBatchedMesh===!0,yt=!!M.map,Vt=!!M.matcap,W=!!k,De=!!M.aoMap,Mt=!!M.lightMap,Lt=!!M.bumpMap,pt=!!M.normalMap,se=!!M.displacementMap,Nt=!!M.emissiveMap,C=!!M.metalnessMap,b=!!M.roughnessMap,q=M.anisotropy>0,tt=M.clearcoat>0,Q=M.iridescence>0,et=M.sheen>0,mt=M.transmission>0,lt=q&&!!M.anisotropyMap,dt=tt&&!!M.clearcoatMap,Et=tt&&!!M.clearcoatNormalMap,kt=tt&&!!M.clearcoatRoughnessMap,J=Q&&!!M.iridescenceMap,Kt=Q&&!!M.iridescenceThicknessMap,Wt=et&&!!M.sheenColorMap,Pt=et&&!!M.sheenRoughnessMap,vt=!!M.specularMap,ft=!!M.specularColorMap,Ut=!!M.specularIntensityMap,jt=mt&&!!M.transmissionMap,ae=mt&&!!M.thicknessMap,Ht=!!M.gradientMap,it=!!M.alphaMap,U=M.alphaTest>0,ot=!!M.alphaHash,at=!!M.extensions,Tt=!!I.attributes.uv1,bt=!!I.attributes.uv2,te=!!I.attributes.uv3;let ee=Yn;return M.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(ee=s.toneMapping),{isWebGL2:u,shaderID:B,shaderType:M.type,shaderName:M.name,vertexShader:G,fragmentShader:Z,defines:M.defines,customVertexShaderID:nt,customFragmentShaderID:ht,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Rt,instancing:xt,instancingColor:xt&&K.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:ut===null?s.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:In,map:yt,matcap:Vt,envMap:W,envMapMode:W&&k.mapping,envMapCubeUVHeight:N,aoMap:De,lightMap:Mt,bumpMap:Lt,normalMap:pt,displacementMap:d&&se,emissiveMap:Nt,normalMapObjectSpace:pt&&M.normalMapType===Xh,normalMapTangentSpace:pt&&M.normalMapType===zo,metalnessMap:C,roughnessMap:b,anisotropy:q,anisotropyMap:lt,clearcoat:tt,clearcoatMap:dt,clearcoatNormalMap:Et,clearcoatRoughnessMap:kt,iridescence:Q,iridescenceMap:J,iridescenceThicknessMap:Kt,sheen:et,sheenColorMap:Wt,sheenRoughnessMap:Pt,specularMap:vt,specularColorMap:ft,specularIntensityMap:Ut,transmission:mt,transmissionMap:jt,thicknessMap:ae,gradientMap:Ht,opaque:M.transparent===!1&&M.blending===pi,alphaMap:it,alphaTest:U,alphaHash:ot,combine:M.combine,mapUv:yt&&g(M.map.channel),aoMapUv:De&&g(M.aoMap.channel),lightMapUv:Mt&&g(M.lightMap.channel),bumpMapUv:Lt&&g(M.bumpMap.channel),normalMapUv:pt&&g(M.normalMap.channel),displacementMapUv:se&&g(M.displacementMap.channel),emissiveMapUv:Nt&&g(M.emissiveMap.channel),metalnessMapUv:C&&g(M.metalnessMap.channel),roughnessMapUv:b&&g(M.roughnessMap.channel),anisotropyMapUv:lt&&g(M.anisotropyMap.channel),clearcoatMapUv:dt&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:Et&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:Kt&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&g(M.sheenRoughnessMap.channel),specularMapUv:vt&&g(M.specularMap.channel),specularColorMapUv:ft&&g(M.specularColorMap.channel),specularIntensityMapUv:Ut&&g(M.specularIntensityMap.channel),transmissionMapUv:jt&&g(M.transmissionMap.channel),thicknessMapUv:ae&&g(M.thicknessMap.channel),alphaMapUv:it&&g(M.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(pt||q),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,vertexUv1s:Tt,vertexUv2s:bt,vertexUv3s:te,pointsUvs:K.isPoints===!0&&!!I.attributes.uv&&(yt||it),fog:!!R,useFog:M.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:K.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:V,morphTextureStride:j,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&H.length>0,shadowMapType:s.shadowMap.type,toneMapping:ee,useLegacyLights:s._useLegacyLights,decodeVideoTexture:yt&&M.map.isVideoTexture===!0&&Zt.getTransfer(M.map.colorSpace)===ie,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===qe,flipSided:M.side===Be,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:at&&M.extensions.derivatives===!0,extensionFragDepth:at&&M.extensions.fragDepth===!0,extensionDrawBuffers:at&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:at&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:at&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function p(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const H in M.defines)S.push(H),S.push(M.defines[H]);return M.isRawShaderMaterial===!1&&(_(S,M),v(S,M),S.push(s.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function _(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function v(M,S){a.disableAll(),S.isWebGL2&&a.enable(0),S.supportsVertexTextures&&a.enable(1),S.instancing&&a.enable(2),S.instancingColor&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),M.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.skinning&&a.enable(4),S.morphTargets&&a.enable(5),S.morphNormals&&a.enable(6),S.morphColors&&a.enable(7),S.premultipliedAlpha&&a.enable(8),S.shadowMapEnabled&&a.enable(9),S.useLegacyLights&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function y(M){const S=m[M.type];let H;if(S){const P=xn[S];H=Du.clone(P.uniforms)}else H=M.uniforms;return H}function A(M,S){let H;for(let P=0,K=c.length;P<K;P++){const R=c[P];if(R.cacheKey===S){H=R,++H.usedTimes;break}}return H===void 0&&(H=new Y0(s,S,M,r),c.push(H)),H}function w(M){if(--M.usedTimes===0){const S=c.indexOf(M);c[S]=c[c.length-1],c.pop(),M.destroy()}}function E(M){l.remove(M)}function D(){l.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:y,acquireProgram:A,releaseProgram:w,releaseShaderCache:E,programs:c,dispose:D}}function J0(){let s=new WeakMap;function t(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function e(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Q0(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function _l(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function yl(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(h,d,f,m,g,x){let p=s[t];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:m,renderOrder:h.renderOrder,z:g,group:x},s[t]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=h.renderOrder,p.z=g,p.group=x),t++,p}function a(h,d,f,m,g,x){const p=o(h,d,f,m,g,x);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(h,d,f,m,g,x){const p=o(h,d,f,m,g,x);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(h,d){e.length>1&&e.sort(h||Q0),n.length>1&&n.sort(d||_l),i.length>1&&i.sort(d||_l)}function u(){for(let h=t,d=s.length;h<d;h++){const f=s[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:u,sort:c}}function tm(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new yl,s.set(n,[o])):i>=r.length?(o=new yl,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function em(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new rt};break;case"SpotLight":e={position:new L,direction:new L,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new rt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":e={color:new rt,position:new L,halfWidth:new L,halfHeight:new L};break}return s[t.id]=e,e}}}function nm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let im=0;function sm(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function rm(s,t){const e=new em,n=nm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new L);const r=new L,o=new At,a=new At;function l(u,h){let d=0,f=0,m=0;for(let P=0;P<9;P++)i.probe[P].set(0,0,0);let g=0,x=0,p=0,_=0,v=0,y=0,A=0,w=0,E=0,D=0,M=0;u.sort(sm);const S=h===!0?Math.PI:1;for(let P=0,K=u.length;P<K;P++){const R=u[P],I=R.color,F=R.intensity,k=R.distance,N=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=I.r*F*S,f+=I.g*F*S,m+=I.b*F*S;else if(R.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(R.sh.coefficients[B],F);M++}else if(R.isDirectionalLight){const B=e.get(R);if(B.color.copy(R.color).multiplyScalar(R.intensity*S),R.castShadow){const z=R.shadow,V=n.get(R);V.shadowBias=z.bias,V.shadowNormalBias=z.normalBias,V.shadowRadius=z.radius,V.shadowMapSize=z.mapSize,i.directionalShadow[g]=V,i.directionalShadowMap[g]=N,i.directionalShadowMatrix[g]=R.shadow.matrix,y++}i.directional[g]=B,g++}else if(R.isSpotLight){const B=e.get(R);B.position.setFromMatrixPosition(R.matrixWorld),B.color.copy(I).multiplyScalar(F*S),B.distance=k,B.coneCos=Math.cos(R.angle),B.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),B.decay=R.decay,i.spot[p]=B;const z=R.shadow;if(R.map&&(i.spotLightMap[E]=R.map,E++,z.updateMatrices(R),R.castShadow&&D++),i.spotLightMatrix[p]=z.matrix,R.castShadow){const V=n.get(R);V.shadowBias=z.bias,V.shadowNormalBias=z.normalBias,V.shadowRadius=z.radius,V.shadowMapSize=z.mapSize,i.spotShadow[p]=V,i.spotShadowMap[p]=N,w++}p++}else if(R.isRectAreaLight){const B=e.get(R);B.color.copy(I).multiplyScalar(F),B.halfWidth.set(R.width*.5,0,0),B.halfHeight.set(0,R.height*.5,0),i.rectArea[_]=B,_++}else if(R.isPointLight){const B=e.get(R);if(B.color.copy(R.color).multiplyScalar(R.intensity*S),B.distance=R.distance,B.decay=R.decay,R.castShadow){const z=R.shadow,V=n.get(R);V.shadowBias=z.bias,V.shadowNormalBias=z.normalBias,V.shadowRadius=z.radius,V.shadowMapSize=z.mapSize,V.shadowCameraNear=z.camera.near,V.shadowCameraFar=z.camera.far,i.pointShadow[x]=V,i.pointShadowMap[x]=N,i.pointShadowMatrix[x]=R.shadow.matrix,A++}i.point[x]=B,x++}else if(R.isHemisphereLight){const B=e.get(R);B.skyColor.copy(R.color).multiplyScalar(F*S),B.groundColor.copy(R.groundColor).multiplyScalar(F*S),i.hemi[v]=B,v++}}_>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=st.LTC_FLOAT_1,i.rectAreaLTC2=st.LTC_FLOAT_2):(i.rectAreaLTC1=st.LTC_HALF_1,i.rectAreaLTC2=st.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=st.LTC_FLOAT_1,i.rectAreaLTC2=st.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=st.LTC_HALF_1,i.rectAreaLTC2=st.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=m;const H=i.hash;(H.directionalLength!==g||H.pointLength!==x||H.spotLength!==p||H.rectAreaLength!==_||H.hemiLength!==v||H.numDirectionalShadows!==y||H.numPointShadows!==A||H.numSpotShadows!==w||H.numSpotMaps!==E||H.numLightProbes!==M)&&(i.directional.length=g,i.spot.length=p,i.rectArea.length=_,i.point.length=x,i.hemi.length=v,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=A,i.pointShadowMap.length=A,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=A,i.spotLightMatrix.length=w+E-D,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=D,i.numLightProbes=M,H.directionalLength=g,H.pointLength=x,H.spotLength=p,H.rectAreaLength=_,H.hemiLength=v,H.numDirectionalShadows=y,H.numPointShadows=A,H.numSpotShadows=w,H.numSpotMaps=E,H.numLightProbes=M,i.version=im++)}function c(u,h){let d=0,f=0,m=0,g=0,x=0;const p=h.matrixWorldInverse;for(let _=0,v=u.length;_<v;_++){const y=u[_];if(y.isDirectionalLight){const A=i.directional[d];A.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(p),d++}else if(y.isSpotLight){const A=i.spot[m];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),A.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(p),m++}else if(y.isRectAreaLight){const A=i.rectArea[g];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),a.identity(),o.copy(y.matrixWorld),o.premultiply(p),a.extractRotation(o),A.halfWidth.set(y.width*.5,0,0),A.halfHeight.set(0,y.height*.5,0),A.halfWidth.applyMatrix4(a),A.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const A=i.point[f];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const A=i.hemi[x];A.direction.setFromMatrixPosition(y.matrixWorld),A.direction.transformDirection(p),x++}}}return{setup:l,setupView:c,state:i}}function Ml(s,t){const e=new rm(s,t),n=[],i=[];function r(){n.length=0,i.length=0}function o(h){n.push(h)}function a(h){i.push(h)}function l(h){e.setup(n,h)}function c(h){e.setupView(n,h)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function om(s,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let l;return a===void 0?(l=new Ml(s,t),e.set(r,[l])):o>=a.length?(l=new Ml(s,t),a.push(l)):l=a[o],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class am extends Jn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class lm extends Jn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const cm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hm=`uniform sampler2D shadow_pass;
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
}`;function um(s,t,e){let n=new Oo;const i=new Bt,r=new Bt,o=new Jt,a=new am({depthPacking:Wh}),l=new lm,c={},u=e.maxTextureSize,h={[$n]:Be,[Be]:$n,[qe]:qe},d=new Un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:cm,fragmentShader:hm}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new ye;m.setAttribute("position",new he(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new _t(m,d),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lc;let p=this.type;this.render=function(w,E,D){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||w.length===0)return;const M=s.getRenderTarget(),S=s.getActiveCubeFace(),H=s.getActiveMipmapLevel(),P=s.state;P.setBlending(qn),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const K=p!==An&&this.type===An,R=p===An&&this.type!==An;for(let I=0,F=w.length;I<F;I++){const k=w[I],N=k.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",k,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;i.copy(N.mapSize);const B=N.getFrameExtents();if(i.multiply(B),r.copy(N.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/B.x),i.x=r.x*B.x,N.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/B.y),i.y=r.y*B.y,N.mapSize.y=r.y)),N.map===null||K===!0||R===!0){const V=this.type!==An?{minFilter:Ae,magFilter:Ae}:{};N.map!==null&&N.map.dispose(),N.map=new vi(i.x,i.y,V),N.map.texture.name=k.name+".shadowMap",N.camera.updateProjectionMatrix()}s.setRenderTarget(N.map),s.clear();const z=N.getViewportCount();for(let V=0;V<z;V++){const j=N.getViewport(V);o.set(r.x*j.x,r.y*j.y,r.x*j.z,r.y*j.w),P.viewport(o),N.updateMatrices(k,V),n=N.getFrustum(),y(E,D,N.camera,k,this.type)}N.isPointLightShadow!==!0&&this.type===An&&_(N,D),N.needsUpdate=!1}p=this.type,x.needsUpdate=!1,s.setRenderTarget(M,S,H)};function _(w,E){const D=t.update(g);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new vi(i.x,i.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(E,null,D,d,g,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(E,null,D,f,g,null)}function v(w,E,D,M){let S=null;const H=D.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(H!==void 0)S=H;else if(S=D.isPointLight===!0?l:a,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const P=S.uuid,K=E.uuid;let R=c[P];R===void 0&&(R={},c[P]=R);let I=R[K];I===void 0&&(I=S.clone(),R[K]=I,E.addEventListener("dispose",A)),S=I}if(S.visible=E.visible,S.wireframe=E.wireframe,M===An?S.side=E.shadowSide!==null?E.shadowSide:E.side:S.side=E.shadowSide!==null?E.shadowSide:h[E.side],S.alphaMap=E.alphaMap,S.alphaTest=E.alphaTest,S.map=E.map,S.clipShadows=E.clipShadows,S.clippingPlanes=E.clippingPlanes,S.clipIntersection=E.clipIntersection,S.displacementMap=E.displacementMap,S.displacementScale=E.displacementScale,S.displacementBias=E.displacementBias,S.wireframeLinewidth=E.wireframeLinewidth,S.linewidth=E.linewidth,D.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const P=s.properties.get(S);P.light=D}return S}function y(w,E,D,M,S){if(w.visible===!1)return;if(w.layers.test(E.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&S===An)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,w.matrixWorld);const K=t.update(w),R=w.material;if(Array.isArray(R)){const I=K.groups;for(let F=0,k=I.length;F<k;F++){const N=I[F],B=R[N.materialIndex];if(B&&B.visible){const z=v(w,B,M,S);w.onBeforeShadow(s,w,E,D,K,z,N),s.renderBufferDirect(D,null,K,z,w,N),w.onAfterShadow(s,w,E,D,K,z,N)}}}else if(R.visible){const I=v(w,R,M,S);w.onBeforeShadow(s,w,E,D,K,I,null),s.renderBufferDirect(D,null,K,I,w,null),w.onAfterShadow(s,w,E,D,K,I,null)}}const P=w.children;for(let K=0,R=P.length;K<R;K++)y(P[K],E,D,M,S)}function A(w){w.target.removeEventListener("dispose",A);for(const D in c){const M=c[D],S=w.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}function dm(s,t,e){const n=e.isWebGL2;function i(){let U=!1;const ot=new Jt;let at=null;const Tt=new Jt(0,0,0,0);return{setMask:function(bt){at!==bt&&!U&&(s.colorMask(bt,bt,bt,bt),at=bt)},setLocked:function(bt){U=bt},setClear:function(bt,te,ee,we,Ie){Ie===!0&&(bt*=we,te*=we,ee*=we),ot.set(bt,te,ee,we),Tt.equals(ot)===!1&&(s.clearColor(bt,te,ee,we),Tt.copy(ot))},reset:function(){U=!1,at=null,Tt.set(-1,0,0,0)}}}function r(){let U=!1,ot=null,at=null,Tt=null;return{setTest:function(bt){bt?Rt(s.DEPTH_TEST):yt(s.DEPTH_TEST)},setMask:function(bt){ot!==bt&&!U&&(s.depthMask(bt),ot=bt)},setFunc:function(bt){if(at!==bt){switch(bt){case yh:s.depthFunc(s.NEVER);break;case Mh:s.depthFunc(s.ALWAYS);break;case bh:s.depthFunc(s.LESS);break;case nr:s.depthFunc(s.LEQUAL);break;case wh:s.depthFunc(s.EQUAL);break;case Sh:s.depthFunc(s.GEQUAL);break;case Eh:s.depthFunc(s.GREATER);break;case Th:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}at=bt}},setLocked:function(bt){U=bt},setClear:function(bt){Tt!==bt&&(s.clearDepth(bt),Tt=bt)},reset:function(){U=!1,ot=null,at=null,Tt=null}}}function o(){let U=!1,ot=null,at=null,Tt=null,bt=null,te=null,ee=null,we=null,Ie=null;return{setTest:function(ne){U||(ne?Rt(s.STENCIL_TEST):yt(s.STENCIL_TEST))},setMask:function(ne){ot!==ne&&!U&&(s.stencilMask(ne),ot=ne)},setFunc:function(ne,Ue,mn){(at!==ne||Tt!==Ue||bt!==mn)&&(s.stencilFunc(ne,Ue,mn),at=ne,Tt=Ue,bt=mn)},setOp:function(ne,Ue,mn){(te!==ne||ee!==Ue||we!==mn)&&(s.stencilOp(ne,Ue,mn),te=ne,ee=Ue,we=mn)},setLocked:function(ne){U=ne},setClear:function(ne){Ie!==ne&&(s.clearStencil(ne),Ie=ne)},reset:function(){U=!1,ot=null,at=null,Tt=null,bt=null,te=null,ee=null,we=null,Ie=null}}}const a=new i,l=new r,c=new o,u=new WeakMap,h=new WeakMap;let d={},f={},m=new WeakMap,g=[],x=null,p=!1,_=null,v=null,y=null,A=null,w=null,E=null,D=null,M=new rt(0,0,0),S=0,H=!1,P=null,K=null,R=null,I=null,F=null;const k=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,B=0;const z=s.getParameter(s.VERSION);z.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(z)[1]),N=B>=1):z.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),N=B>=2);let V=null,j={};const G=s.getParameter(s.SCISSOR_BOX),Z=s.getParameter(s.VIEWPORT),nt=new Jt().fromArray(G),ht=new Jt().fromArray(Z);function ut(U,ot,at,Tt){const bt=new Uint8Array(4),te=s.createTexture();s.bindTexture(U,te),s.texParameteri(U,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(U,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ee=0;ee<at;ee++)n&&(U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY)?s.texImage3D(ot,0,s.RGBA,1,1,Tt,0,s.RGBA,s.UNSIGNED_BYTE,bt):s.texImage2D(ot+ee,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,bt);return te}const xt={};xt[s.TEXTURE_2D]=ut(s.TEXTURE_2D,s.TEXTURE_2D,1),xt[s.TEXTURE_CUBE_MAP]=ut(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(xt[s.TEXTURE_2D_ARRAY]=ut(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),xt[s.TEXTURE_3D]=ut(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Rt(s.DEPTH_TEST),l.setFunc(nr),Nt(!1),C(na),Rt(s.CULL_FACE),pt(qn);function Rt(U){d[U]!==!0&&(s.enable(U),d[U]=!0)}function yt(U){d[U]!==!1&&(s.disable(U),d[U]=!1)}function Vt(U,ot){return f[U]!==ot?(s.bindFramebuffer(U,ot),f[U]=ot,n&&(U===s.DRAW_FRAMEBUFFER&&(f[s.FRAMEBUFFER]=ot),U===s.FRAMEBUFFER&&(f[s.DRAW_FRAMEBUFFER]=ot)),!0):!1}function W(U,ot){let at=g,Tt=!1;if(U)if(at=m.get(ot),at===void 0&&(at=[],m.set(ot,at)),U.isWebGLMultipleRenderTargets){const bt=U.texture;if(at.length!==bt.length||at[0]!==s.COLOR_ATTACHMENT0){for(let te=0,ee=bt.length;te<ee;te++)at[te]=s.COLOR_ATTACHMENT0+te;at.length=bt.length,Tt=!0}}else at[0]!==s.COLOR_ATTACHMENT0&&(at[0]=s.COLOR_ATTACHMENT0,Tt=!0);else at[0]!==s.BACK&&(at[0]=s.BACK,Tt=!0);Tt&&(e.isWebGL2?s.drawBuffers(at):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(at))}function De(U){return x!==U?(s.useProgram(U),x=U,!0):!1}const Mt={[ui]:s.FUNC_ADD,[rh]:s.FUNC_SUBTRACT,[oh]:s.FUNC_REVERSE_SUBTRACT};if(n)Mt[ra]=s.MIN,Mt[oa]=s.MAX;else{const U=t.get("EXT_blend_minmax");U!==null&&(Mt[ra]=U.MIN_EXT,Mt[oa]=U.MAX_EXT)}const Lt={[ah]:s.ZERO,[lh]:s.ONE,[ch]:s.SRC_COLOR,[_o]:s.SRC_ALPHA,[mh]:s.SRC_ALPHA_SATURATE,[fh]:s.DST_COLOR,[uh]:s.DST_ALPHA,[hh]:s.ONE_MINUS_SRC_COLOR,[yo]:s.ONE_MINUS_SRC_ALPHA,[ph]:s.ONE_MINUS_DST_COLOR,[dh]:s.ONE_MINUS_DST_ALPHA,[gh]:s.CONSTANT_COLOR,[xh]:s.ONE_MINUS_CONSTANT_COLOR,[vh]:s.CONSTANT_ALPHA,[_h]:s.ONE_MINUS_CONSTANT_ALPHA};function pt(U,ot,at,Tt,bt,te,ee,we,Ie,ne){if(U===qn){p===!0&&(yt(s.BLEND),p=!1);return}if(p===!1&&(Rt(s.BLEND),p=!0),U!==sh){if(U!==_||ne!==H){if((v!==ui||w!==ui)&&(s.blendEquation(s.FUNC_ADD),v=ui,w=ui),ne)switch(U){case pi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vo:s.blendFunc(s.ONE,s.ONE);break;case ia:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case sa:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case pi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vo:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case ia:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case sa:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}y=null,A=null,E=null,D=null,M.set(0,0,0),S=0,_=U,H=ne}return}bt=bt||ot,te=te||at,ee=ee||Tt,(ot!==v||bt!==w)&&(s.blendEquationSeparate(Mt[ot],Mt[bt]),v=ot,w=bt),(at!==y||Tt!==A||te!==E||ee!==D)&&(s.blendFuncSeparate(Lt[at],Lt[Tt],Lt[te],Lt[ee]),y=at,A=Tt,E=te,D=ee),(we.equals(M)===!1||Ie!==S)&&(s.blendColor(we.r,we.g,we.b,Ie),M.copy(we),S=Ie),_=U,H=!1}function se(U,ot){U.side===qe?yt(s.CULL_FACE):Rt(s.CULL_FACE);let at=U.side===Be;ot&&(at=!at),Nt(at),U.blending===pi&&U.transparent===!1?pt(qn):pt(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),l.setFunc(U.depthFunc),l.setTest(U.depthTest),l.setMask(U.depthWrite),a.setMask(U.colorWrite);const Tt=U.stencilWrite;c.setTest(Tt),Tt&&(c.setMask(U.stencilWriteMask),c.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),c.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),q(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Rt(s.SAMPLE_ALPHA_TO_COVERAGE):yt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(U){P!==U&&(U?s.frontFace(s.CW):s.frontFace(s.CCW),P=U)}function C(U){U!==nh?(Rt(s.CULL_FACE),U!==K&&(U===na?s.cullFace(s.BACK):U===ih?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):yt(s.CULL_FACE),K=U}function b(U){U!==R&&(N&&s.lineWidth(U),R=U)}function q(U,ot,at){U?(Rt(s.POLYGON_OFFSET_FILL),(I!==ot||F!==at)&&(s.polygonOffset(ot,at),I=ot,F=at)):yt(s.POLYGON_OFFSET_FILL)}function tt(U){U?Rt(s.SCISSOR_TEST):yt(s.SCISSOR_TEST)}function Q(U){U===void 0&&(U=s.TEXTURE0+k-1),V!==U&&(s.activeTexture(U),V=U)}function et(U,ot,at){at===void 0&&(V===null?at=s.TEXTURE0+k-1:at=V);let Tt=j[at];Tt===void 0&&(Tt={type:void 0,texture:void 0},j[at]=Tt),(Tt.type!==U||Tt.texture!==ot)&&(V!==at&&(s.activeTexture(at),V=at),s.bindTexture(U,ot||xt[U]),Tt.type=U,Tt.texture=ot)}function mt(){const U=j[V];U!==void 0&&U.type!==void 0&&(s.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function lt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function dt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Et(){try{s.texSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function kt(){try{s.texSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Kt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Wt(){try{s.texStorage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Pt(){try{s.texStorage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function vt(){try{s.texImage2D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ft(){try{s.texImage3D.apply(s,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ut(U){nt.equals(U)===!1&&(s.scissor(U.x,U.y,U.z,U.w),nt.copy(U))}function jt(U){ht.equals(U)===!1&&(s.viewport(U.x,U.y,U.z,U.w),ht.copy(U))}function ae(U,ot){let at=h.get(ot);at===void 0&&(at=new WeakMap,h.set(ot,at));let Tt=at.get(U);Tt===void 0&&(Tt=s.getUniformBlockIndex(ot,U.name),at.set(U,Tt))}function Ht(U,ot){const Tt=h.get(ot).get(U);u.get(ot)!==Tt&&(s.uniformBlockBinding(ot,Tt,U.__bindingPointIndex),u.set(ot,Tt))}function it(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},V=null,j={},f={},m=new WeakMap,g=[],x=null,p=!1,_=null,v=null,y=null,A=null,w=null,E=null,D=null,M=new rt(0,0,0),S=0,H=!1,P=null,K=null,R=null,I=null,F=null,nt.set(0,0,s.canvas.width,s.canvas.height),ht.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Rt,disable:yt,bindFramebuffer:Vt,drawBuffers:W,useProgram:De,setBlending:pt,setMaterial:se,setFlipSided:Nt,setCullFace:C,setLineWidth:b,setPolygonOffset:q,setScissorTest:tt,activeTexture:Q,bindTexture:et,unbindTexture:mt,compressedTexImage2D:lt,compressedTexImage3D:dt,texImage2D:vt,texImage3D:ft,updateUBOMapping:ae,uniformBlockBinding:Ht,texStorage2D:Wt,texStorage3D:Pt,texSubImage2D:Et,texSubImage3D:kt,compressedTexSubImage2D:J,compressedTexSubImage3D:Kt,scissor:Ut,viewport:jt,reset:it}}function fm(s,t,e,n,i,r,o){const a=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,b){return f?new OffscreenCanvas(C,b):cr("canvas")}function g(C,b,q,tt){let Q=1;if((C.width>tt||C.height>tt)&&(Q=tt/Math.max(C.width,C.height)),Q<1||b===!0)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap){const et=b?lr:Math.floor,mt=et(Q*C.width),lt=et(Q*C.height);h===void 0&&(h=m(mt,lt));const dt=q?m(mt,lt):h;return dt.width=mt,dt.height=lt,dt.getContext("2d").drawImage(C,0,0,mt,lt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+C.width+"x"+C.height+") to ("+mt+"x"+lt+")."),dt}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+C.width+"x"+C.height+")."),C;return C}function x(C){return Eo(C.width)&&Eo(C.height)}function p(C){return a?!1:C.wrapS!==sn||C.wrapT!==sn||C.minFilter!==Ae&&C.minFilter!==We}function _(C,b){return C.generateMipmaps&&b&&C.minFilter!==Ae&&C.minFilter!==We}function v(C){s.generateMipmap(C)}function y(C,b,q,tt,Q=!1){if(a===!1)return b;if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let et=b;if(b===s.RED&&(q===s.FLOAT&&(et=s.R32F),q===s.HALF_FLOAT&&(et=s.R16F),q===s.UNSIGNED_BYTE&&(et=s.R8)),b===s.RED_INTEGER&&(q===s.UNSIGNED_BYTE&&(et=s.R8UI),q===s.UNSIGNED_SHORT&&(et=s.R16UI),q===s.UNSIGNED_INT&&(et=s.R32UI),q===s.BYTE&&(et=s.R8I),q===s.SHORT&&(et=s.R16I),q===s.INT&&(et=s.R32I)),b===s.RG&&(q===s.FLOAT&&(et=s.RG32F),q===s.HALF_FLOAT&&(et=s.RG16F),q===s.UNSIGNED_BYTE&&(et=s.RG8)),b===s.RGBA){const mt=Q?sr:Zt.getTransfer(tt);q===s.FLOAT&&(et=s.RGBA32F),q===s.HALF_FLOAT&&(et=s.RGBA16F),q===s.UNSIGNED_BYTE&&(et=mt===ie?s.SRGB8_ALPHA8:s.RGBA8),q===s.UNSIGNED_SHORT_4_4_4_4&&(et=s.RGBA4),q===s.UNSIGNED_SHORT_5_5_5_1&&(et=s.RGB5_A1)}return(et===s.R16F||et===s.R32F||et===s.RG16F||et===s.RG32F||et===s.RGBA16F||et===s.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function A(C,b,q){return _(C,q)===!0||C.isFramebufferTexture&&C.minFilter!==Ae&&C.minFilter!==We?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function w(C){return C===Ae||C===la||C===Rr?s.NEAREST:s.LINEAR}function E(C){const b=C.target;b.removeEventListener("dispose",E),M(b),b.isVideoTexture&&u.delete(b)}function D(C){const b=C.target;b.removeEventListener("dispose",D),H(b)}function M(C){const b=n.get(C);if(b.__webglInit===void 0)return;const q=C.source,tt=d.get(q);if(tt){const Q=tt[b.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(C),Object.keys(tt).length===0&&d.delete(q)}n.remove(C)}function S(C){const b=n.get(C);s.deleteTexture(b.__webglTexture);const q=C.source,tt=d.get(q);delete tt[b.__cacheKey],o.memory.textures--}function H(C){const b=C.texture,q=n.get(C),tt=n.get(b);if(tt.__webglTexture!==void 0&&(s.deleteTexture(tt.__webglTexture),o.memory.textures--),C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(q.__webglFramebuffer[Q]))for(let et=0;et<q.__webglFramebuffer[Q].length;et++)s.deleteFramebuffer(q.__webglFramebuffer[Q][et]);else s.deleteFramebuffer(q.__webglFramebuffer[Q]);q.__webglDepthbuffer&&s.deleteRenderbuffer(q.__webglDepthbuffer[Q])}else{if(Array.isArray(q.__webglFramebuffer))for(let Q=0;Q<q.__webglFramebuffer.length;Q++)s.deleteFramebuffer(q.__webglFramebuffer[Q]);else s.deleteFramebuffer(q.__webglFramebuffer);if(q.__webglDepthbuffer&&s.deleteRenderbuffer(q.__webglDepthbuffer),q.__webglMultisampledFramebuffer&&s.deleteFramebuffer(q.__webglMultisampledFramebuffer),q.__webglColorRenderbuffer)for(let Q=0;Q<q.__webglColorRenderbuffer.length;Q++)q.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(q.__webglColorRenderbuffer[Q]);q.__webglDepthRenderbuffer&&s.deleteRenderbuffer(q.__webglDepthRenderbuffer)}if(C.isWebGLMultipleRenderTargets)for(let Q=0,et=b.length;Q<et;Q++){const mt=n.get(b[Q]);mt.__webglTexture&&(s.deleteTexture(mt.__webglTexture),o.memory.textures--),n.remove(b[Q])}n.remove(b),n.remove(C)}let P=0;function K(){P=0}function R(){const C=P;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),P+=1,C}function I(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function F(C,b){const q=n.get(C);if(C.isVideoTexture&&se(C),C.isRenderTargetTexture===!1&&C.version>0&&q.__version!==C.version){const tt=C.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{nt(q,C,b);return}}e.bindTexture(s.TEXTURE_2D,q.__webglTexture,s.TEXTURE0+b)}function k(C,b){const q=n.get(C);if(C.version>0&&q.__version!==C.version){nt(q,C,b);return}e.bindTexture(s.TEXTURE_2D_ARRAY,q.__webglTexture,s.TEXTURE0+b)}function N(C,b){const q=n.get(C);if(C.version>0&&q.__version!==C.version){nt(q,C,b);return}e.bindTexture(s.TEXTURE_3D,q.__webglTexture,s.TEXTURE0+b)}function B(C,b){const q=n.get(C);if(C.version>0&&q.__version!==C.version){ht(q,C,b);return}e.bindTexture(s.TEXTURE_CUBE_MAP,q.__webglTexture,s.TEXTURE0+b)}const z={[ir]:s.REPEAT,[sn]:s.CLAMP_TO_EDGE,[wo]:s.MIRRORED_REPEAT},V={[Ae]:s.NEAREST,[la]:s.NEAREST_MIPMAP_NEAREST,[Rr]:s.NEAREST_MIPMAP_LINEAR,[We]:s.LINEAR,[zh]:s.LINEAR_MIPMAP_NEAREST,[xs]:s.LINEAR_MIPMAP_LINEAR},j={[qh]:s.NEVER,[Jh]:s.ALWAYS,[Yh]:s.LESS,[Mc]:s.LEQUAL,[$h]:s.EQUAL,[Zh]:s.GEQUAL,[jh]:s.GREATER,[Kh]:s.NOTEQUAL};function G(C,b,q){if(q?(s.texParameteri(C,s.TEXTURE_WRAP_S,z[b.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,z[b.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,z[b.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,V[b.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,V[b.minFilter])):(s.texParameteri(C,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(C,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(b.wrapS!==sn||b.wrapT!==sn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(C,s.TEXTURE_MAG_FILTER,w(b.magFilter)),s.texParameteri(C,s.TEXTURE_MIN_FILTER,w(b.minFilter)),b.minFilter!==Ae&&b.minFilter!==We&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,j[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const tt=t.get("EXT_texture_filter_anisotropic");if(b.magFilter===Ae||b.minFilter!==Rr&&b.minFilter!==xs||b.type===Rn&&t.has("OES_texture_float_linear")===!1||a===!1&&b.type===vs&&t.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||n.get(b).__currentAnisotropy)&&(s.texParameterf(C,tt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy)}}function Z(C,b){let q=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",E));const tt=b.source;let Q=d.get(tt);Q===void 0&&(Q={},d.set(tt,Q));const et=I(b);if(et!==C.__cacheKey){Q[et]===void 0&&(Q[et]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,q=!0),Q[et].usedTimes++;const mt=Q[C.__cacheKey];mt!==void 0&&(Q[C.__cacheKey].usedTimes--,mt.usedTimes===0&&S(b)),C.__cacheKey=et,C.__webglTexture=Q[et].texture}return q}function nt(C,b,q){let tt=s.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(tt=s.TEXTURE_2D_ARRAY),b.isData3DTexture&&(tt=s.TEXTURE_3D);const Q=Z(C,b),et=b.source;e.bindTexture(tt,C.__webglTexture,s.TEXTURE0+q);const mt=n.get(et);if(et.version!==mt.__version||Q===!0){e.activeTexture(s.TEXTURE0+q);const lt=Zt.getPrimaries(Zt.workingColorSpace),dt=b.colorSpace===on?null:Zt.getPrimaries(b.colorSpace),Et=b.colorSpace===on||lt===dt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);const kt=p(b)&&x(b.image)===!1;let J=g(b.image,kt,!1,i.maxTextureSize);J=Nt(b,J);const Kt=x(J)||a,Wt=r.convert(b.format,b.colorSpace);let Pt=r.convert(b.type),vt=y(b.internalFormat,Wt,Pt,b.colorSpace,b.isVideoTexture);G(tt,b,Kt);let ft;const Ut=b.mipmaps,jt=a&&b.isVideoTexture!==!0&&vt!==_c,ae=mt.__version===void 0||Q===!0,Ht=A(b,J,Kt);if(b.isDepthTexture)vt=s.DEPTH_COMPONENT,a?b.type===Rn?vt=s.DEPTH_COMPONENT32F:b.type===Xn?vt=s.DEPTH_COMPONENT24:b.type===mi?vt=s.DEPTH24_STENCIL8:vt=s.DEPTH_COMPONENT16:b.type===Rn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===gi&&vt===s.DEPTH_COMPONENT&&b.type!==Uo&&b.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=Xn,Pt=r.convert(b.type)),b.format===ji&&vt===s.DEPTH_COMPONENT&&(vt=s.DEPTH_STENCIL,b.type!==mi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=mi,Pt=r.convert(b.type))),ae&&(jt?e.texStorage2D(s.TEXTURE_2D,1,vt,J.width,J.height):e.texImage2D(s.TEXTURE_2D,0,vt,J.width,J.height,0,Wt,Pt,null));else if(b.isDataTexture)if(Ut.length>0&&Kt){jt&&ae&&e.texStorage2D(s.TEXTURE_2D,Ht,vt,Ut[0].width,Ut[0].height);for(let it=0,U=Ut.length;it<U;it++)ft=Ut[it],jt?e.texSubImage2D(s.TEXTURE_2D,it,0,0,ft.width,ft.height,Wt,Pt,ft.data):e.texImage2D(s.TEXTURE_2D,it,vt,ft.width,ft.height,0,Wt,Pt,ft.data);b.generateMipmaps=!1}else jt?(ae&&e.texStorage2D(s.TEXTURE_2D,Ht,vt,J.width,J.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,J.width,J.height,Wt,Pt,J.data)):e.texImage2D(s.TEXTURE_2D,0,vt,J.width,J.height,0,Wt,Pt,J.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){jt&&ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,vt,Ut[0].width,Ut[0].height,J.depth);for(let it=0,U=Ut.length;it<U;it++)ft=Ut[it],b.format!==rn?Wt!==null?jt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,it,0,0,0,ft.width,ft.height,J.depth,Wt,ft.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,it,vt,ft.width,ft.height,J.depth,0,ft.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,it,0,0,0,ft.width,ft.height,J.depth,Wt,Pt,ft.data):e.texImage3D(s.TEXTURE_2D_ARRAY,it,vt,ft.width,ft.height,J.depth,0,Wt,Pt,ft.data)}else{jt&&ae&&e.texStorage2D(s.TEXTURE_2D,Ht,vt,Ut[0].width,Ut[0].height);for(let it=0,U=Ut.length;it<U;it++)ft=Ut[it],b.format!==rn?Wt!==null?jt?e.compressedTexSubImage2D(s.TEXTURE_2D,it,0,0,ft.width,ft.height,Wt,ft.data):e.compressedTexImage2D(s.TEXTURE_2D,it,vt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?e.texSubImage2D(s.TEXTURE_2D,it,0,0,ft.width,ft.height,Wt,Pt,ft.data):e.texImage2D(s.TEXTURE_2D,it,vt,ft.width,ft.height,0,Wt,Pt,ft.data)}else if(b.isDataArrayTexture)jt?(ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,vt,J.width,J.height,J.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,Wt,Pt,J.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,vt,J.width,J.height,J.depth,0,Wt,Pt,J.data);else if(b.isData3DTexture)jt?(ae&&e.texStorage3D(s.TEXTURE_3D,Ht,vt,J.width,J.height,J.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,Wt,Pt,J.data)):e.texImage3D(s.TEXTURE_3D,0,vt,J.width,J.height,J.depth,0,Wt,Pt,J.data);else if(b.isFramebufferTexture){if(ae)if(jt)e.texStorage2D(s.TEXTURE_2D,Ht,vt,J.width,J.height);else{let it=J.width,U=J.height;for(let ot=0;ot<Ht;ot++)e.texImage2D(s.TEXTURE_2D,ot,vt,it,U,0,Wt,Pt,null),it>>=1,U>>=1}}else if(Ut.length>0&&Kt){jt&&ae&&e.texStorage2D(s.TEXTURE_2D,Ht,vt,Ut[0].width,Ut[0].height);for(let it=0,U=Ut.length;it<U;it++)ft=Ut[it],jt?e.texSubImage2D(s.TEXTURE_2D,it,0,0,Wt,Pt,ft):e.texImage2D(s.TEXTURE_2D,it,vt,Wt,Pt,ft);b.generateMipmaps=!1}else jt?(ae&&e.texStorage2D(s.TEXTURE_2D,Ht,vt,J.width,J.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Wt,Pt,J)):e.texImage2D(s.TEXTURE_2D,0,vt,Wt,Pt,J);_(b,Kt)&&v(tt),mt.__version=et.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function ht(C,b,q){if(b.image.length!==6)return;const tt=Z(C,b),Q=b.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+q);const et=n.get(Q);if(Q.version!==et.__version||tt===!0){e.activeTexture(s.TEXTURE0+q);const mt=Zt.getPrimaries(Zt.workingColorSpace),lt=b.colorSpace===on?null:Zt.getPrimaries(b.colorSpace),dt=b.colorSpace===on||mt===lt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Et=b.isCompressedTexture||b.image[0].isCompressedTexture,kt=b.image[0]&&b.image[0].isDataTexture,J=[];for(let it=0;it<6;it++)!Et&&!kt?J[it]=g(b.image[it],!1,!0,i.maxCubemapSize):J[it]=kt?b.image[it].image:b.image[it],J[it]=Nt(b,J[it]);const Kt=J[0],Wt=x(Kt)||a,Pt=r.convert(b.format,b.colorSpace),vt=r.convert(b.type),ft=y(b.internalFormat,Pt,vt,b.colorSpace),Ut=a&&b.isVideoTexture!==!0,jt=et.__version===void 0||tt===!0;let ae=A(b,Kt,Wt);G(s.TEXTURE_CUBE_MAP,b,Wt);let Ht;if(Et){Ut&&jt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,ae,ft,Kt.width,Kt.height);for(let it=0;it<6;it++){Ht=J[it].mipmaps;for(let U=0;U<Ht.length;U++){const ot=Ht[U];b.format!==rn?Pt!==null?Ut?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,U,0,0,ot.width,ot.height,Pt,ot.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,U,ft,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,U,0,0,ot.width,ot.height,Pt,vt,ot.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,U,ft,ot.width,ot.height,0,Pt,vt,ot.data)}}}else{Ht=b.mipmaps,Ut&&jt&&(Ht.length>0&&ae++,e.texStorage2D(s.TEXTURE_CUBE_MAP,ae,ft,J[0].width,J[0].height));for(let it=0;it<6;it++)if(kt){Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,J[it].width,J[it].height,Pt,vt,J[it].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ft,J[it].width,J[it].height,0,Pt,vt,J[it].data);for(let U=0;U<Ht.length;U++){const at=Ht[U].image[it].image;Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,U+1,0,0,at.width,at.height,Pt,vt,at.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,U+1,ft,at.width,at.height,0,Pt,vt,at.data)}}else{Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Pt,vt,J[it]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ft,Pt,vt,J[it]);for(let U=0;U<Ht.length;U++){const ot=Ht[U];Ut?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,U+1,0,0,Pt,vt,ot.image[it]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+it,U+1,ft,Pt,vt,ot.image[it])}}}_(b,Wt)&&v(s.TEXTURE_CUBE_MAP),et.__version=Q.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function ut(C,b,q,tt,Q,et){const mt=r.convert(q.format,q.colorSpace),lt=r.convert(q.type),dt=y(q.internalFormat,mt,lt,q.colorSpace);if(!n.get(b).__hasExternalTextures){const kt=Math.max(1,b.width>>et),J=Math.max(1,b.height>>et);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?e.texImage3D(Q,et,dt,kt,J,b.depth,0,mt,lt,null):e.texImage2D(Q,et,dt,kt,J,0,mt,lt,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),pt(b)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,tt,Q,n.get(q).__webglTexture,0,Lt(b)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,tt,Q,n.get(q).__webglTexture,et),e.bindFramebuffer(s.FRAMEBUFFER,null)}function xt(C,b,q){if(s.bindRenderbuffer(s.RENDERBUFFER,C),b.depthBuffer&&!b.stencilBuffer){let tt=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(q||pt(b)){const Q=b.depthTexture;Q&&Q.isDepthTexture&&(Q.type===Rn?tt=s.DEPTH_COMPONENT32F:Q.type===Xn&&(tt=s.DEPTH_COMPONENT24));const et=Lt(b);pt(b)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,et,tt,b.width,b.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,et,tt,b.width,b.height)}else s.renderbufferStorage(s.RENDERBUFFER,tt,b.width,b.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,C)}else if(b.depthBuffer&&b.stencilBuffer){const tt=Lt(b);q&&pt(b)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,tt,s.DEPTH24_STENCIL8,b.width,b.height):pt(b)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,tt,s.DEPTH24_STENCIL8,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,C)}else{const tt=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let Q=0;Q<tt.length;Q++){const et=tt[Q],mt=r.convert(et.format,et.colorSpace),lt=r.convert(et.type),dt=y(et.internalFormat,mt,lt,et.colorSpace),Et=Lt(b);q&&pt(b)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Et,dt,b.width,b.height):pt(b)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Et,dt,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,dt,b.width,b.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Rt(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),F(b.depthTexture,0);const tt=n.get(b.depthTexture).__webglTexture,Q=Lt(b);if(b.depthTexture.format===gi)pt(b)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,tt,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,tt,0);else if(b.depthTexture.format===ji)pt(b)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,tt,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function yt(C){const b=n.get(C),q=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");Rt(b.__webglFramebuffer,C)}else if(q){b.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[tt]),b.__webglDepthbuffer[tt]=s.createRenderbuffer(),xt(b.__webglDepthbuffer[tt],C,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=s.createRenderbuffer(),xt(b.__webglDepthbuffer,C,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Vt(C,b,q){const tt=n.get(C);b!==void 0&&ut(tt.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),q!==void 0&&yt(C)}function W(C){const b=C.texture,q=n.get(C),tt=n.get(b);C.addEventListener("dispose",D),C.isWebGLMultipleRenderTargets!==!0&&(tt.__webglTexture===void 0&&(tt.__webglTexture=s.createTexture()),tt.__version=b.version,o.memory.textures++);const Q=C.isWebGLCubeRenderTarget===!0,et=C.isWebGLMultipleRenderTargets===!0,mt=x(C)||a;if(Q){q.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(a&&b.mipmaps&&b.mipmaps.length>0){q.__webglFramebuffer[lt]=[];for(let dt=0;dt<b.mipmaps.length;dt++)q.__webglFramebuffer[lt][dt]=s.createFramebuffer()}else q.__webglFramebuffer[lt]=s.createFramebuffer()}else{if(a&&b.mipmaps&&b.mipmaps.length>0){q.__webglFramebuffer=[];for(let lt=0;lt<b.mipmaps.length;lt++)q.__webglFramebuffer[lt]=s.createFramebuffer()}else q.__webglFramebuffer=s.createFramebuffer();if(et)if(i.drawBuffers){const lt=C.texture;for(let dt=0,Et=lt.length;dt<Et;dt++){const kt=n.get(lt[dt]);kt.__webglTexture===void 0&&(kt.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&C.samples>0&&pt(C)===!1){const lt=et?b:[b];q.__webglMultisampledFramebuffer=s.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let dt=0;dt<lt.length;dt++){const Et=lt[dt];q.__webglColorRenderbuffer[dt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,q.__webglColorRenderbuffer[dt]);const kt=r.convert(Et.format,Et.colorSpace),J=r.convert(Et.type),Kt=y(Et.internalFormat,kt,J,Et.colorSpace,C.isXRRenderTarget===!0),Wt=Lt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Wt,Kt,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,q.__webglColorRenderbuffer[dt])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(q.__webglDepthRenderbuffer=s.createRenderbuffer(),xt(q.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){e.bindTexture(s.TEXTURE_CUBE_MAP,tt.__webglTexture),G(s.TEXTURE_CUBE_MAP,b,mt);for(let lt=0;lt<6;lt++)if(a&&b.mipmaps&&b.mipmaps.length>0)for(let dt=0;dt<b.mipmaps.length;dt++)ut(q.__webglFramebuffer[lt][dt],C,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+lt,dt);else ut(q.__webglFramebuffer[lt],C,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);_(b,mt)&&v(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(et){const lt=C.texture;for(let dt=0,Et=lt.length;dt<Et;dt++){const kt=lt[dt],J=n.get(kt);e.bindTexture(s.TEXTURE_2D,J.__webglTexture),G(s.TEXTURE_2D,kt,mt),ut(q.__webglFramebuffer,C,kt,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,0),_(kt,mt)&&v(s.TEXTURE_2D)}e.unbindTexture()}else{let lt=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(a?lt=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(lt,tt.__webglTexture),G(lt,b,mt),a&&b.mipmaps&&b.mipmaps.length>0)for(let dt=0;dt<b.mipmaps.length;dt++)ut(q.__webglFramebuffer[dt],C,b,s.COLOR_ATTACHMENT0,lt,dt);else ut(q.__webglFramebuffer,C,b,s.COLOR_ATTACHMENT0,lt,0);_(b,mt)&&v(lt),e.unbindTexture()}C.depthBuffer&&yt(C)}function De(C){const b=x(C)||a,q=C.isWebGLMultipleRenderTargets===!0?C.texture:[C.texture];for(let tt=0,Q=q.length;tt<Q;tt++){const et=q[tt];if(_(et,b)){const mt=C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,lt=n.get(et).__webglTexture;e.bindTexture(mt,lt),v(mt),e.unbindTexture()}}}function Mt(C){if(a&&C.samples>0&&pt(C)===!1){const b=C.isWebGLMultipleRenderTargets?C.texture:[C.texture],q=C.width,tt=C.height;let Q=s.COLOR_BUFFER_BIT;const et=[],mt=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=n.get(C),dt=C.isWebGLMultipleRenderTargets===!0;if(dt)for(let Et=0;Et<b.length;Et++)e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let Et=0;Et<b.length;Et++){et.push(s.COLOR_ATTACHMENT0+Et),C.depthBuffer&&et.push(mt);const kt=lt.__ignoreDepthValues!==void 0?lt.__ignoreDepthValues:!1;if(kt===!1&&(C.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),dt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,lt.__webglColorRenderbuffer[Et]),kt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[mt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[mt])),dt){const J=n.get(b[Et]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,J,0)}s.blitFramebuffer(0,0,q,tt,0,0,q,tt,Q,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,et)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),dt)for(let Et=0;Et<b.length;Et++){e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.RENDERBUFFER,lt.__webglColorRenderbuffer[Et]);const kt=n.get(b[Et]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.TEXTURE_2D,kt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}}function Lt(C){return Math.min(i.maxSamples,C.samples)}function pt(C){const b=n.get(C);return a&&C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function se(C){const b=o.render.frame;u.get(C)!==b&&(u.set(C,b),C.update())}function Nt(C,b){const q=C.colorSpace,tt=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===So||q!==In&&q!==on&&(Zt.getTransfer(q)===ie?a===!1?t.has("EXT_sRGB")===!0&&tt===rn?(C.format=So,C.minFilter=We,C.generateMipmaps=!1):b=wc.sRGBToLinear(b):(tt!==rn||Q!==Pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),b}this.allocateTextureUnit=R,this.resetTextureUnits=K,this.setTexture2D=F,this.setTexture2DArray=k,this.setTexture3D=N,this.setTextureCube=B,this.rebindTextures=Vt,this.setupRenderTarget=W,this.updateRenderTargetMipmap=De,this.updateMultisampleRenderTarget=Mt,this.setupDepthRenderbuffer=yt,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=pt}function pm(s,t,e){const n=e.isWebGL2;function i(r,o=on){let a;const l=Zt.getTransfer(o);if(r===Pn)return s.UNSIGNED_BYTE;if(r===fc)return s.UNSIGNED_SHORT_4_4_4_4;if(r===pc)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Nh)return s.BYTE;if(r===kh)return s.SHORT;if(r===Uo)return s.UNSIGNED_SHORT;if(r===dc)return s.INT;if(r===Xn)return s.UNSIGNED_INT;if(r===Rn)return s.FLOAT;if(r===vs)return n?s.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Fh)return s.ALPHA;if(r===rn)return s.RGBA;if(r===Oh)return s.LUMINANCE;if(r===Bh)return s.LUMINANCE_ALPHA;if(r===gi)return s.DEPTH_COMPONENT;if(r===ji)return s.DEPTH_STENCIL;if(r===So)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===mc)return s.RED;if(r===gc)return s.RED_INTEGER;if(r===Hh)return s.RG;if(r===xc)return s.RG_INTEGER;if(r===vc)return s.RGBA_INTEGER;if(r===Cr||r===Pr||r===Lr||r===Dr)if(l===ie)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Cr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Pr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Lr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Dr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Cr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Pr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Lr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Dr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ca||r===ha||r===ua||r===da)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===ca)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ha)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===ua)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===da)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===_c)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===fa||r===pa)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===fa)return l===ie?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===pa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===ma||r===ga||r===xa||r===va||r===_a||r===ya||r===Ma||r===ba||r===wa||r===Sa||r===Ea||r===Ta||r===Aa||r===Ra)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===ma)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ga)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===xa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===va)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===_a)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ya)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ma)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===ba)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===wa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Sa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ea)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ta)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Aa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ra)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Ir||r===Ca||r===Pa)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Ir)return l===ie?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ca)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Pa)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Gh||r===La||r===Da||r===Ia)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Ir)return a.COMPRESSED_RED_RGTC1_EXT;if(r===La)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Da)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ia)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===mi?n?s.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class mm extends Oe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ge extends ue{constructor(){super(),this.isGroup=!0,this.type="Group"}}const gm={type:"move"};class no{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ge,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ge,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ge,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const x=e.getJointPose(g,n),p=this._getHandJoint(c,g);x!==null&&(p.matrix.fromArray(x.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=x.radius),p.visible=x!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(gm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ge;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class xm extends ts{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,m=null;const g=e.getContextAttributes();let x=null,p=null;const _=[],v=[],y=new Bt;let A=null;const w=new Oe;w.layers.enable(1),w.viewport=new Jt;const E=new Oe;E.layers.enable(2),E.viewport=new Jt;const D=[w,E],M=new mm;M.layers.enable(1),M.layers.enable(2);let S=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let Z=_[G];return Z===void 0&&(Z=new no,_[G]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(G){let Z=_[G];return Z===void 0&&(Z=new no,_[G]=Z),Z.getGripSpace()},this.getHand=function(G){let Z=_[G];return Z===void 0&&(Z=new no,_[G]=Z),Z.getHandSpace()};function P(G){const Z=v.indexOf(G.inputSource);if(Z===-1)return;const nt=_[Z];nt!==void 0&&(nt.update(G.inputSource,G.frame,c||o),nt.dispatchEvent({type:G.type,data:G.inputSource}))}function K(){i.removeEventListener("select",P),i.removeEventListener("selectstart",P),i.removeEventListener("selectend",P),i.removeEventListener("squeeze",P),i.removeEventListener("squeezestart",P),i.removeEventListener("squeezeend",P),i.removeEventListener("end",K),i.removeEventListener("inputsourceschange",R);for(let G=0;G<_.length;G++){const Z=v[G];Z!==null&&(v[G]=null,_[G].disconnect(Z))}S=null,H=null,t.setRenderTarget(x),f=null,d=null,h=null,i=null,p=null,j.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(y.width,y.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(G){if(i=G,i!==null){if(x=t.getRenderTarget(),i.addEventListener("select",P),i.addEventListener("selectstart",P),i.addEventListener("selectend",P),i.addEventListener("squeeze",P),i.addEventListener("squeezestart",P),i.addEventListener("squeezeend",P),i.addEventListener("end",K),i.addEventListener("inputsourceschange",R),g.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(y),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Z={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,Z),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new vi(f.framebufferWidth,f.framebufferHeight,{format:rn,type:Pn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let Z=null,nt=null,ht=null;g.depth&&(ht=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=g.stencil?ji:gi,nt=g.stencil?mi:Xn);const ut={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:r};h=new XRWebGLBinding(i,e),d=h.createProjectionLayer(ut),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new vi(d.textureWidth,d.textureHeight,{format:rn,type:Pn,depthTexture:new Uc(d.textureWidth,d.textureHeight,nt,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const xt=t.properties.get(p);xt.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),j.setContext(i),j.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function R(G){for(let Z=0;Z<G.removed.length;Z++){const nt=G.removed[Z],ht=v.indexOf(nt);ht>=0&&(v[ht]=null,_[ht].disconnect(nt))}for(let Z=0;Z<G.added.length;Z++){const nt=G.added[Z];let ht=v.indexOf(nt);if(ht===-1){for(let xt=0;xt<_.length;xt++)if(xt>=v.length){v.push(nt),ht=xt;break}else if(v[xt]===null){v[xt]=nt,ht=xt;break}if(ht===-1)break}const ut=_[ht];ut&&ut.connect(nt)}}const I=new L,F=new L;function k(G,Z,nt){I.setFromMatrixPosition(Z.matrixWorld),F.setFromMatrixPosition(nt.matrixWorld);const ht=I.distanceTo(F),ut=Z.projectionMatrix.elements,xt=nt.projectionMatrix.elements,Rt=ut[14]/(ut[10]-1),yt=ut[14]/(ut[10]+1),Vt=(ut[9]+1)/ut[5],W=(ut[9]-1)/ut[5],De=(ut[8]-1)/ut[0],Mt=(xt[8]+1)/xt[0],Lt=Rt*De,pt=Rt*Mt,se=ht/(-De+Mt),Nt=se*-De;Z.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Nt),G.translateZ(se),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();const C=Rt+se,b=yt+se,q=Lt-Nt,tt=pt+(ht-Nt),Q=Vt*yt/b*C,et=W*yt/b*C;G.projectionMatrix.makePerspective(q,tt,Q,et,C,b),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function N(G,Z){Z===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(Z.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(i===null)return;M.near=E.near=w.near=G.near,M.far=E.far=w.far=G.far,(S!==M.near||H!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),S=M.near,H=M.far);const Z=G.parent,nt=M.cameras;N(M,Z);for(let ht=0;ht<nt.length;ht++)N(nt[ht],Z);nt.length===2?k(M,w,E):M.projectionMatrix.copy(w.projectionMatrix),B(G,M,Z)};function B(G,Z,nt){nt===null?G.matrix.copy(Z.matrixWorld):(G.matrix.copy(nt.matrixWorld),G.matrix.invert(),G.matrix.multiply(Z.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(Z.projectionMatrix),G.projectionMatrixInverse.copy(Z.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=Ki*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(G){l=G,d!==null&&(d.fixedFoveation=G),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=G)};let z=null;function V(G,Z){if(u=Z.getViewerPose(c||o),m=Z,u!==null){const nt=u.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let ht=!1;nt.length!==M.cameras.length&&(M.cameras.length=0,ht=!0);for(let ut=0;ut<nt.length;ut++){const xt=nt[ut];let Rt=null;if(f!==null)Rt=f.getViewport(xt);else{const Vt=h.getViewSubImage(d,xt);Rt=Vt.viewport,ut===0&&(t.setRenderTargetTextures(p,Vt.colorTexture,d.ignoreDepthValues?void 0:Vt.depthStencilTexture),t.setRenderTarget(p))}let yt=D[ut];yt===void 0&&(yt=new Oe,yt.layers.enable(ut),yt.viewport=new Jt,D[ut]=yt),yt.matrix.fromArray(xt.transform.matrix),yt.matrix.decompose(yt.position,yt.quaternion,yt.scale),yt.projectionMatrix.fromArray(xt.projectionMatrix),yt.projectionMatrixInverse.copy(yt.projectionMatrix).invert(),yt.viewport.set(Rt.x,Rt.y,Rt.width,Rt.height),ut===0&&(M.matrix.copy(yt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ht===!0&&M.cameras.push(yt)}}for(let nt=0;nt<_.length;nt++){const ht=v[nt],ut=_[nt];ht!==null&&ut!==void 0&&ut.update(ht,Z,c||o)}z&&z(G,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),m=null}const j=new Dc;j.setAnimationLoop(V),this.setAnimationLoop=function(G){z=G},this.dispose=function(){}}}function vm(s,t){function e(x,p){x.matrixAutoUpdate===!0&&x.updateMatrix(),p.value.copy(x.matrix)}function n(x,p){p.color.getRGB(x.fogColor.value,Cc(s)),p.isFog?(x.fogNear.value=p.near,x.fogFar.value=p.far):p.isFogExp2&&(x.fogDensity.value=p.density)}function i(x,p,_,v,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(x,p):p.isMeshToonMaterial?(r(x,p),h(x,p)):p.isMeshPhongMaterial?(r(x,p),u(x,p)):p.isMeshStandardMaterial?(r(x,p),d(x,p),p.isMeshPhysicalMaterial&&f(x,p,y)):p.isMeshMatcapMaterial?(r(x,p),m(x,p)):p.isMeshDepthMaterial?r(x,p):p.isMeshDistanceMaterial?(r(x,p),g(x,p)):p.isMeshNormalMaterial?r(x,p):p.isLineBasicMaterial?(o(x,p),p.isLineDashedMaterial&&a(x,p)):p.isPointsMaterial?l(x,p,_,v):p.isSpriteMaterial?c(x,p):p.isShadowMaterial?(x.color.value.copy(p.color),x.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(x,p){x.opacity.value=p.opacity,p.color&&x.diffuse.value.copy(p.color),p.emissive&&x.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.bumpMap&&(x.bumpMap.value=p.bumpMap,e(p.bumpMap,x.bumpMapTransform),x.bumpScale.value=p.bumpScale,p.side===Be&&(x.bumpScale.value*=-1)),p.normalMap&&(x.normalMap.value=p.normalMap,e(p.normalMap,x.normalMapTransform),x.normalScale.value.copy(p.normalScale),p.side===Be&&x.normalScale.value.negate()),p.displacementMap&&(x.displacementMap.value=p.displacementMap,e(p.displacementMap,x.displacementMapTransform),x.displacementScale.value=p.displacementScale,x.displacementBias.value=p.displacementBias),p.emissiveMap&&(x.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,x.emissiveMapTransform)),p.specularMap&&(x.specularMap.value=p.specularMap,e(p.specularMap,x.specularMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest);const _=t.get(p).envMap;if(_&&(x.envMap.value=_,x.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=p.reflectivity,x.ior.value=p.ior,x.refractionRatio.value=p.refractionRatio),p.lightMap){x.lightMap.value=p.lightMap;const v=s._useLegacyLights===!0?Math.PI:1;x.lightMapIntensity.value=p.lightMapIntensity*v,e(p.lightMap,x.lightMapTransform)}p.aoMap&&(x.aoMap.value=p.aoMap,x.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,x.aoMapTransform))}function o(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform))}function a(x,p){x.dashSize.value=p.dashSize,x.totalSize.value=p.dashSize+p.gapSize,x.scale.value=p.scale}function l(x,p,_,v){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.size.value=p.size*_,x.scale.value=v*.5,p.map&&(x.map.value=p.map,e(p.map,x.uvTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function c(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.rotation.value=p.rotation,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function u(x,p){x.specular.value.copy(p.specular),x.shininess.value=Math.max(p.shininess,1e-4)}function h(x,p){p.gradientMap&&(x.gradientMap.value=p.gradientMap)}function d(x,p){x.metalness.value=p.metalness,p.metalnessMap&&(x.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,x.metalnessMapTransform)),x.roughness.value=p.roughness,p.roughnessMap&&(x.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,x.roughnessMapTransform)),t.get(p).envMap&&(x.envMapIntensity.value=p.envMapIntensity)}function f(x,p,_){x.ior.value=p.ior,p.sheen>0&&(x.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),x.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(x.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,x.sheenColorMapTransform)),p.sheenRoughnessMap&&(x.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,x.sheenRoughnessMapTransform))),p.clearcoat>0&&(x.clearcoat.value=p.clearcoat,x.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(x.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,x.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(x.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Be&&x.clearcoatNormalScale.value.negate())),p.iridescence>0&&(x.iridescence.value=p.iridescence,x.iridescenceIOR.value=p.iridescenceIOR,x.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(x.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,x.iridescenceMapTransform)),p.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),p.transmission>0&&(x.transmission.value=p.transmission,x.transmissionSamplerMap.value=_.texture,x.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(x.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,x.transmissionMapTransform)),x.thickness.value=p.thickness,p.thicknessMap&&(x.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=p.attenuationDistance,x.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(x.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(x.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=p.specularIntensity,x.specularColor.value.copy(p.specularColor),p.specularColorMap&&(x.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,x.specularColorMapTransform)),p.specularIntensityMap&&(x.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,x.specularIntensityMapTransform))}function m(x,p){p.matcap&&(x.matcap.value=p.matcap)}function g(x,p){const _=t.get(p).light;x.referencePosition.value.setFromMatrixPosition(_.matrixWorld),x.nearDistance.value=_.shadow.camera.near,x.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function _m(s,t,e,n){let i={},r={},o=[];const a=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,v){const y=v.program;n.uniformBlockBinding(_,y)}function c(_,v){let y=i[_.id];y===void 0&&(m(_),y=u(_),i[_.id]=y,_.addEventListener("dispose",x));const A=v.program;n.updateUBOMapping(_,A);const w=t.render.frame;r[_.id]!==w&&(d(_),r[_.id]=w)}function u(_){const v=h();_.__bindingPointIndex=v;const y=s.createBuffer(),A=_.__size,w=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,A,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,y),y}function h(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const v=i[_.id],y=_.uniforms,A=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let w=0,E=y.length;w<E;w++){const D=Array.isArray(y[w])?y[w]:[y[w]];for(let M=0,S=D.length;M<S;M++){const H=D[M];if(f(H,w,M,A)===!0){const P=H.__offset,K=Array.isArray(H.value)?H.value:[H.value];let R=0;for(let I=0;I<K.length;I++){const F=K[I],k=g(F);typeof F=="number"||typeof F=="boolean"?(H.__data[0]=F,s.bufferSubData(s.UNIFORM_BUFFER,P+R,H.__data)):F.isMatrix3?(H.__data[0]=F.elements[0],H.__data[1]=F.elements[1],H.__data[2]=F.elements[2],H.__data[3]=0,H.__data[4]=F.elements[3],H.__data[5]=F.elements[4],H.__data[6]=F.elements[5],H.__data[7]=0,H.__data[8]=F.elements[6],H.__data[9]=F.elements[7],H.__data[10]=F.elements[8],H.__data[11]=0):(F.toArray(H.__data,R),R+=k.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,H.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(_,v,y,A){const w=_.value,E=v+"_"+y;if(A[E]===void 0)return typeof w=="number"||typeof w=="boolean"?A[E]=w:A[E]=w.clone(),!0;{const D=A[E];if(typeof w=="number"||typeof w=="boolean"){if(D!==w)return A[E]=w,!0}else if(D.equals(w)===!1)return D.copy(w),!0}return!1}function m(_){const v=_.uniforms;let y=0;const A=16;for(let E=0,D=v.length;E<D;E++){const M=Array.isArray(v[E])?v[E]:[v[E]];for(let S=0,H=M.length;S<H;S++){const P=M[S],K=Array.isArray(P.value)?P.value:[P.value];for(let R=0,I=K.length;R<I;R++){const F=K[R],k=g(F),N=y%A;N!==0&&A-N<k.boundary&&(y+=A-N),P.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=y,y+=k.storage}}}const w=y%A;return w>0&&(y+=A-w),_.__size=y,_.__cache={},this}function g(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function x(_){const v=_.target;v.removeEventListener("dispose",x);const y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function p(){for(const _ in i)s.deleteBuffer(i[_]);o=[],i={},r={}}return{bind:l,update:c,dispose:p}}class Bc{constructor(t={}){const{canvas:e=pu(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),m=new Int32Array(4);let g=null,x=null;const p=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=me,this._useLegacyLights=!1,this.toneMapping=Yn,this.toneMappingExposure=1;const v=this;let y=!1,A=0,w=0,E=null,D=-1,M=null;const S=new Jt,H=new Jt;let P=null;const K=new rt(0);let R=0,I=e.width,F=e.height,k=1,N=null,B=null;const z=new Jt(0,0,I,F),V=new Jt(0,0,I,F);let j=!1;const G=new Oo;let Z=!1,nt=!1,ht=null;const ut=new At,xt=new Bt,Rt=new L,yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Vt(){return E===null?k:1}let W=n;function De(T,O){for(let Y=0;Y<T.length;Y++){const $=T[Y],X=e.getContext($,O);if(X!==null)return X}return null}try{const T={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Io}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",U,!1),e.addEventListener("webglcontextcreationerror",ot,!1),W===null){const O=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&O.shift(),W=De(O,T),W===null)throw De(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&W instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),W.getShaderPrecisionFormat===void 0&&(W.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Mt,Lt,pt,se,Nt,C,b,q,tt,Q,et,mt,lt,dt,Et,kt,J,Kt,Wt,Pt,vt,ft,Ut,jt;function ae(){Mt=new Cp(W),Lt=new wp(W,Mt,t),Mt.init(Lt),ft=new pm(W,Mt,Lt),pt=new dm(W,Mt,Lt),se=new Dp(W),Nt=new J0,C=new fm(W,Mt,pt,Nt,Lt,ft,se),b=new Ep(v),q=new Rp(v),tt=new Ou(W,Lt),Ut=new Mp(W,Mt,tt,Lt),Q=new Pp(W,tt,se,Ut),et=new Np(W,Q,tt,se),Wt=new zp(W,Lt,C),kt=new Sp(Nt),mt=new Z0(v,b,q,Mt,Lt,Ut,kt),lt=new vm(v,Nt),dt=new tm,Et=new om(Mt,Lt),Kt=new yp(v,b,q,pt,et,d,l),J=new um(v,et,Lt),jt=new _m(W,se,Lt,pt),Pt=new bp(W,Mt,se,Lt),vt=new Lp(W,Mt,se,Lt),se.programs=mt.programs,v.capabilities=Lt,v.extensions=Mt,v.properties=Nt,v.renderLists=dt,v.shadowMap=J,v.state=pt,v.info=se}ae();const Ht=new xm(v,W);this.xr=Ht,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){const T=Mt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Mt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(T){T!==void 0&&(k=T,this.setSize(I,F,!1))},this.getSize=function(T){return T.set(I,F)},this.setSize=function(T,O,Y=!0){if(Ht.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=T,F=O,e.width=Math.floor(T*k),e.height=Math.floor(O*k),Y===!0&&(e.style.width=T+"px",e.style.height=O+"px"),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(I*k,F*k).floor()},this.setDrawingBufferSize=function(T,O,Y){I=T,F=O,k=Y,e.width=Math.floor(T*Y),e.height=Math.floor(O*Y),this.setViewport(0,0,T,O)},this.getCurrentViewport=function(T){return T.copy(S)},this.getViewport=function(T){return T.copy(z)},this.setViewport=function(T,O,Y,$){T.isVector4?z.set(T.x,T.y,T.z,T.w):z.set(T,O,Y,$),pt.viewport(S.copy(z).multiplyScalar(k).floor())},this.getScissor=function(T){return T.copy(V)},this.setScissor=function(T,O,Y,$){T.isVector4?V.set(T.x,T.y,T.z,T.w):V.set(T,O,Y,$),pt.scissor(H.copy(V).multiplyScalar(k).floor())},this.getScissorTest=function(){return j},this.setScissorTest=function(T){pt.setScissorTest(j=T)},this.setOpaqueSort=function(T){N=T},this.setTransparentSort=function(T){B=T},this.getClearColor=function(T){return T.copy(Kt.getClearColor())},this.setClearColor=function(){Kt.setClearColor.apply(Kt,arguments)},this.getClearAlpha=function(){return Kt.getClearAlpha()},this.setClearAlpha=function(){Kt.setClearAlpha.apply(Kt,arguments)},this.clear=function(T=!0,O=!0,Y=!0){let $=0;if(T){let X=!1;if(E!==null){const ct=E.texture.format;X=ct===vc||ct===xc||ct===gc}if(X){const ct=E.texture.type,gt=ct===Pn||ct===Xn||ct===Uo||ct===mi||ct===fc||ct===pc,St=Kt.getClearColor(),Ct=Kt.getClearAlpha(),Ft=St.r,Dt=St.g,It=St.b;gt?(f[0]=Ft,f[1]=Dt,f[2]=It,f[3]=Ct,W.clearBufferuiv(W.COLOR,0,f)):(m[0]=Ft,m[1]=Dt,m[2]=It,m[3]=Ct,W.clearBufferiv(W.COLOR,0,m))}else $|=W.COLOR_BUFFER_BIT}O&&($|=W.DEPTH_BUFFER_BIT),Y&&($|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",U,!1),e.removeEventListener("webglcontextcreationerror",ot,!1),dt.dispose(),Et.dispose(),Nt.dispose(),b.dispose(),q.dispose(),et.dispose(),Ut.dispose(),jt.dispose(),mt.dispose(),Ht.dispose(),Ht.removeEventListener("sessionstart",Ie),Ht.removeEventListener("sessionend",ne),ht&&(ht.dispose(),ht=null),Ue.stop()};function it(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const T=se.autoReset,O=J.enabled,Y=J.autoUpdate,$=J.needsUpdate,X=J.type;ae(),se.autoReset=T,J.enabled=O,J.autoUpdate=Y,J.needsUpdate=$,J.type=X}function ot(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function at(T){const O=T.target;O.removeEventListener("dispose",at),Tt(O)}function Tt(T){bt(T),Nt.remove(T)}function bt(T){const O=Nt.get(T).programs;O!==void 0&&(O.forEach(function(Y){mt.releaseProgram(Y)}),T.isShaderMaterial&&mt.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,Y,$,X,ct){O===null&&(O=yt);const gt=X.isMesh&&X.matrixWorld.determinant()<0,St=Jc(T,O,Y,$,X);pt.setMaterial($,gt);let Ct=Y.index,Ft=1;if($.wireframe===!0){if(Ct=Q.getWireframeAttribute(Y),Ct===void 0)return;Ft=2}const Dt=Y.drawRange,It=Y.attributes.position;let de=Dt.start*Ft,$e=(Dt.start+Dt.count)*Ft;ct!==null&&(de=Math.max(de,ct.start*Ft),$e=Math.min($e,(ct.start+ct.count)*Ft)),Ct!==null?(de=Math.max(de,0),$e=Math.min($e,Ct.count)):It!=null&&(de=Math.max(de,0),$e=Math.min($e,It.count));const Se=$e-de;if(Se<0||Se===1/0)return;Ut.setup(X,$,St,Y,Ct);let Mn,re=Pt;if(Ct!==null&&(Mn=tt.get(Ct),re=vt,re.setIndex(Mn)),X.isMesh)$.wireframe===!0?(pt.setLineWidth($.wireframeLinewidth*Vt()),re.setMode(W.LINES)):re.setMode(W.TRIANGLES);else if(X.isLine){let Gt=$.linewidth;Gt===void 0&&(Gt=1),pt.setLineWidth(Gt*Vt()),X.isLineSegments?re.setMode(W.LINES):X.isLineLoop?re.setMode(W.LINE_LOOP):re.setMode(W.LINE_STRIP)}else X.isPoints?re.setMode(W.POINTS):X.isSprite&&re.setMode(W.TRIANGLES);if(X.isBatchedMesh)re.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else if(X.isInstancedMesh)re.renderInstances(de,Se,X.count);else if(Y.isInstancedBufferGeometry){const Gt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Sr=Math.min(Y.instanceCount,Gt);re.renderInstances(de,Se,Sr)}else re.render(de,Se)};function te(T,O,Y){T.transparent===!0&&T.side===qe&&T.forceSinglePass===!1?(T.side=Be,T.needsUpdate=!0,bs(T,O,Y),T.side=$n,T.needsUpdate=!0,bs(T,O,Y),T.side=qe):bs(T,O,Y)}this.compile=function(T,O,Y=null){Y===null&&(Y=T),x=Et.get(Y),x.init(),_.push(x),Y.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(x.pushLight(X),X.castShadow&&x.pushShadow(X))}),T!==Y&&T.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(x.pushLight(X),X.castShadow&&x.pushShadow(X))}),x.setupLights(v._useLegacyLights);const $=new Set;return T.traverse(function(X){const ct=X.material;if(ct)if(Array.isArray(ct))for(let gt=0;gt<ct.length;gt++){const St=ct[gt];te(St,Y,X),$.add(St)}else te(ct,Y,X),$.add(ct)}),_.pop(),x=null,$},this.compileAsync=function(T,O,Y=null){const $=this.compile(T,O,Y);return new Promise(X=>{function ct(){if($.forEach(function(gt){Nt.get(gt).currentProgram.isReady()&&$.delete(gt)}),$.size===0){X(T);return}setTimeout(ct,10)}Mt.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let ee=null;function we(T){ee&&ee(T)}function Ie(){Ue.stop()}function ne(){Ue.start()}const Ue=new Dc;Ue.setAnimationLoop(we),typeof self<"u"&&Ue.setContext(self),this.setAnimationLoop=function(T){ee=T,Ht.setAnimationLoop(T),T===null?Ue.stop():Ue.start()},Ht.addEventListener("sessionstart",Ie),Ht.addEventListener("sessionend",ne),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Ht.enabled===!0&&Ht.isPresenting===!0&&(Ht.cameraAutoUpdate===!0&&Ht.updateCamera(O),O=Ht.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,O,E),x=Et.get(T,_.length),x.init(),_.push(x),ut.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),G.setFromProjectionMatrix(ut),nt=this.localClippingEnabled,Z=kt.init(this.clippingPlanes,nt),g=dt.get(T,p.length),g.init(),p.push(g),mn(T,O,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(N,B),this.info.render.frame++,Z===!0&&kt.beginShadows();const Y=x.state.shadowsArray;if(J.render(Y,T,O),Z===!0&&kt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Kt.render(g,T),x.setupLights(v._useLegacyLights),O.isArrayCamera){const $=O.cameras;for(let X=0,ct=$.length;X<ct;X++){const gt=$[X];Ko(g,T,gt,gt.viewport)}}else Ko(g,T,O);E!==null&&(C.updateMultisampleRenderTarget(E),C.updateRenderTargetMipmap(E)),T.isScene===!0&&T.onAfterRender(v,T,O),Ut.resetDefaultState(),D=-1,M=null,_.pop(),_.length>0?x=_[_.length-1]:x=null,p.pop(),p.length>0?g=p[p.length-1]:g=null};function mn(T,O,Y,$){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)Y=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)x.pushLight(T),T.castShadow&&x.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||G.intersectsSprite(T)){$&&Rt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ut);const gt=et.update(T),St=T.material;St.visible&&g.push(T,gt,St,Y,Rt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||G.intersectsObject(T))){const gt=et.update(T),St=T.material;if($&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Rt.copy(T.boundingSphere.center)):(gt.boundingSphere===null&&gt.computeBoundingSphere(),Rt.copy(gt.boundingSphere.center)),Rt.applyMatrix4(T.matrixWorld).applyMatrix4(ut)),Array.isArray(St)){const Ct=gt.groups;for(let Ft=0,Dt=Ct.length;Ft<Dt;Ft++){const It=Ct[Ft],de=St[It.materialIndex];de&&de.visible&&g.push(T,gt,de,Y,Rt.z,It)}}else St.visible&&g.push(T,gt,St,Y,Rt.z,null)}}const ct=T.children;for(let gt=0,St=ct.length;gt<St;gt++)mn(ct[gt],O,Y,$)}function Ko(T,O,Y,$){const X=T.opaque,ct=T.transmissive,gt=T.transparent;x.setupLightsView(Y),Z===!0&&kt.setGlobalState(v.clippingPlanes,Y),ct.length>0&&Zc(X,ct,O,Y),$&&pt.viewport(S.copy($)),X.length>0&&Ms(X,O,Y),ct.length>0&&Ms(ct,O,Y),gt.length>0&&Ms(gt,O,Y),pt.buffers.depth.setTest(!0),pt.buffers.depth.setMask(!0),pt.buffers.color.setMask(!0),pt.setPolygonOffset(!1)}function Zc(T,O,Y,$){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;const ct=Lt.isWebGL2;ht===null&&(ht=new vi(1,1,{generateMipmaps:!0,type:Mt.has("EXT_color_buffer_half_float")?vs:Pn,minFilter:xs,samples:ct?4:0})),v.getDrawingBufferSize(xt),ct?ht.setSize(xt.x,xt.y):ht.setSize(lr(xt.x),lr(xt.y));const gt=v.getRenderTarget();v.setRenderTarget(ht),v.getClearColor(K),R=v.getClearAlpha(),R<1&&v.setClearColor(16777215,.5),v.clear();const St=v.toneMapping;v.toneMapping=Yn,Ms(T,Y,$),C.updateMultisampleRenderTarget(ht),C.updateRenderTargetMipmap(ht);let Ct=!1;for(let Ft=0,Dt=O.length;Ft<Dt;Ft++){const It=O[Ft],de=It.object,$e=It.geometry,Se=It.material,Mn=It.group;if(Se.side===qe&&de.layers.test($.layers)){const re=Se.side;Se.side=Be,Se.needsUpdate=!0,Zo(de,Y,$,$e,Se,Mn),Se.side=re,Se.needsUpdate=!0,Ct=!0}}Ct===!0&&(C.updateMultisampleRenderTarget(ht),C.updateRenderTargetMipmap(ht)),v.setRenderTarget(gt),v.setClearColor(K,R),v.toneMapping=St}function Ms(T,O,Y){const $=O.isScene===!0?O.overrideMaterial:null;for(let X=0,ct=T.length;X<ct;X++){const gt=T[X],St=gt.object,Ct=gt.geometry,Ft=$===null?gt.material:$,Dt=gt.group;St.layers.test(Y.layers)&&Zo(St,O,Y,Ct,Ft,Dt)}}function Zo(T,O,Y,$,X,ct){T.onBeforeRender(v,O,Y,$,X,ct),T.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),X.onBeforeRender(v,O,Y,$,T,ct),X.transparent===!0&&X.side===qe&&X.forceSinglePass===!1?(X.side=Be,X.needsUpdate=!0,v.renderBufferDirect(Y,O,$,X,T,ct),X.side=$n,X.needsUpdate=!0,v.renderBufferDirect(Y,O,$,X,T,ct),X.side=qe):v.renderBufferDirect(Y,O,$,X,T,ct),T.onAfterRender(v,O,Y,$,X,ct)}function bs(T,O,Y){O.isScene!==!0&&(O=yt);const $=Nt.get(T),X=x.state.lights,ct=x.state.shadowsArray,gt=X.state.version,St=mt.getParameters(T,X.state,ct,O,Y),Ct=mt.getProgramCacheKey(St);let Ft=$.programs;$.environment=T.isMeshStandardMaterial?O.environment:null,$.fog=O.fog,$.envMap=(T.isMeshStandardMaterial?q:b).get(T.envMap||$.environment),Ft===void 0&&(T.addEventListener("dispose",at),Ft=new Map,$.programs=Ft);let Dt=Ft.get(Ct);if(Dt!==void 0){if($.currentProgram===Dt&&$.lightsStateVersion===gt)return Qo(T,St),Dt}else St.uniforms=mt.getUniforms(T),T.onBuild(Y,St,v),T.onBeforeCompile(St,v),Dt=mt.acquireProgram(St,Ct),Ft.set(Ct,Dt),$.uniforms=St.uniforms;const It=$.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(It.clippingPlanes=kt.uniform),Qo(T,St),$.needsLights=th(T),$.lightsStateVersion=gt,$.needsLights&&(It.ambientLightColor.value=X.state.ambient,It.lightProbe.value=X.state.probe,It.directionalLights.value=X.state.directional,It.directionalLightShadows.value=X.state.directionalShadow,It.spotLights.value=X.state.spot,It.spotLightShadows.value=X.state.spotShadow,It.rectAreaLights.value=X.state.rectArea,It.ltc_1.value=X.state.rectAreaLTC1,It.ltc_2.value=X.state.rectAreaLTC2,It.pointLights.value=X.state.point,It.pointLightShadows.value=X.state.pointShadow,It.hemisphereLights.value=X.state.hemi,It.directionalShadowMap.value=X.state.directionalShadowMap,It.directionalShadowMatrix.value=X.state.directionalShadowMatrix,It.spotShadowMap.value=X.state.spotShadowMap,It.spotLightMatrix.value=X.state.spotLightMatrix,It.spotLightMap.value=X.state.spotLightMap,It.pointShadowMap.value=X.state.pointShadowMap,It.pointShadowMatrix.value=X.state.pointShadowMatrix),$.currentProgram=Dt,$.uniformsList=null,Dt}function Jo(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=er.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function Qo(T,O){const Y=Nt.get(T);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function Jc(T,O,Y,$,X){O.isScene!==!0&&(O=yt),C.resetTextureUnits();const ct=O.fog,gt=$.isMeshStandardMaterial?O.environment:null,St=E===null?v.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:In,Ct=($.isMeshStandardMaterial?q:b).get($.envMap||gt),Ft=$.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Dt=!!Y.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),It=!!Y.morphAttributes.position,de=!!Y.morphAttributes.normal,$e=!!Y.morphAttributes.color;let Se=Yn;$.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Se=v.toneMapping);const Mn=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,re=Mn!==void 0?Mn.length:0,Gt=Nt.get($),Sr=x.state.lights;if(Z===!0&&(nt===!0||T!==M)){const tn=T===M&&$.id===D;kt.setState($,T,tn)}let le=!1;$.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==Sr.state.version||Gt.outputColorSpace!==St||X.isBatchedMesh&&Gt.batching===!1||!X.isBatchedMesh&&Gt.batching===!0||X.isInstancedMesh&&Gt.instancing===!1||!X.isInstancedMesh&&Gt.instancing===!0||X.isSkinnedMesh&&Gt.skinning===!1||!X.isSkinnedMesh&&Gt.skinning===!0||X.isInstancedMesh&&Gt.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Gt.instancingColor===!1&&X.instanceColor!==null||Gt.envMap!==Ct||$.fog===!0&&Gt.fog!==ct||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==kt.numPlanes||Gt.numIntersection!==kt.numIntersection)||Gt.vertexAlphas!==Ft||Gt.vertexTangents!==Dt||Gt.morphTargets!==It||Gt.morphNormals!==de||Gt.morphColors!==$e||Gt.toneMapping!==Se||Lt.isWebGL2===!0&&Gt.morphTargetsCount!==re)&&(le=!0):(le=!0,Gt.__version=$.version);let ni=Gt.currentProgram;le===!0&&(ni=bs($,O,X));let ta=!1,ss=!1,Er=!1;const Ce=ni.getUniforms(),ii=Gt.uniforms;if(pt.useProgram(ni.program)&&(ta=!0,ss=!0,Er=!0),$.id!==D&&(D=$.id,ss=!0),ta||M!==T){Ce.setValue(W,"projectionMatrix",T.projectionMatrix),Ce.setValue(W,"viewMatrix",T.matrixWorldInverse);const tn=Ce.map.cameraPosition;tn!==void 0&&tn.setValue(W,Rt.setFromMatrixPosition(T.matrixWorld)),Lt.logarithmicDepthBuffer&&Ce.setValue(W,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Ce.setValue(W,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,ss=!0,Er=!0)}if(X.isSkinnedMesh){Ce.setOptional(W,X,"bindMatrix"),Ce.setOptional(W,X,"bindMatrixInverse");const tn=X.skeleton;tn&&(Lt.floatVertexTextures?(tn.boneTexture===null&&tn.computeBoneTexture(),Ce.setValue(W,"boneTexture",tn.boneTexture,C)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}X.isBatchedMesh&&(Ce.setOptional(W,X,"batchingTexture"),Ce.setValue(W,"batchingTexture",X._matricesTexture,C));const Tr=Y.morphAttributes;if((Tr.position!==void 0||Tr.normal!==void 0||Tr.color!==void 0&&Lt.isWebGL2===!0)&&Wt.update(X,Y,ni),(ss||Gt.receiveShadow!==X.receiveShadow)&&(Gt.receiveShadow=X.receiveShadow,Ce.setValue(W,"receiveShadow",X.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(ii.envMap.value=Ct,ii.flipEnvMap.value=Ct.isCubeTexture&&Ct.isRenderTargetTexture===!1?-1:1),ss&&(Ce.setValue(W,"toneMappingExposure",v.toneMappingExposure),Gt.needsLights&&Qc(ii,Er),ct&&$.fog===!0&&lt.refreshFogUniforms(ii,ct),lt.refreshMaterialUniforms(ii,$,k,F,ht),er.upload(W,Jo(Gt),ii,C)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(er.upload(W,Jo(Gt),ii,C),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Ce.setValue(W,"center",X.center),Ce.setValue(W,"modelViewMatrix",X.modelViewMatrix),Ce.setValue(W,"normalMatrix",X.normalMatrix),Ce.setValue(W,"modelMatrix",X.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const tn=$.uniformsGroups;for(let Ar=0,eh=tn.length;Ar<eh;Ar++)if(Lt.isWebGL2){const ea=tn[Ar];jt.update(ea,ni),jt.bind(ea,ni)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ni}function Qc(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function th(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(T,O,Y){Nt.get(T.texture).__webglTexture=O,Nt.get(T.depthTexture).__webglTexture=Y;const $=Nt.get(T);$.__hasExternalTextures=!0,$.__hasExternalTextures&&($.__autoAllocateDepthBuffer=Y===void 0,$.__autoAllocateDepthBuffer||Mt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,O){const Y=Nt.get(T);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,Y=0){E=T,A=O,w=Y;let $=!0,X=null,ct=!1,gt=!1;if(T){const Ct=Nt.get(T);Ct.__useDefaultFramebuffer!==void 0?(pt.bindFramebuffer(W.FRAMEBUFFER,null),$=!1):Ct.__webglFramebuffer===void 0?C.setupRenderTarget(T):Ct.__hasExternalTextures&&C.rebindTextures(T,Nt.get(T.texture).__webglTexture,Nt.get(T.depthTexture).__webglTexture);const Ft=T.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(gt=!0);const Dt=Nt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Dt[O])?X=Dt[O][Y]:X=Dt[O],ct=!0):Lt.isWebGL2&&T.samples>0&&C.useMultisampledRTT(T)===!1?X=Nt.get(T).__webglMultisampledFramebuffer:Array.isArray(Dt)?X=Dt[Y]:X=Dt,S.copy(T.viewport),H.copy(T.scissor),P=T.scissorTest}else S.copy(z).multiplyScalar(k).floor(),H.copy(V).multiplyScalar(k).floor(),P=j;if(pt.bindFramebuffer(W.FRAMEBUFFER,X)&&Lt.drawBuffers&&$&&pt.drawBuffers(T,X),pt.viewport(S),pt.scissor(H),pt.setScissorTest(P),ct){const Ct=Nt.get(T.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ct.__webglTexture,Y)}else if(gt){const Ct=Nt.get(T.texture),Ft=O||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,Ct.__webglTexture,Y||0,Ft)}D=-1},this.readRenderTargetPixels=function(T,O,Y,$,X,ct,gt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=Nt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&gt!==void 0&&(St=St[gt]),St){pt.bindFramebuffer(W.FRAMEBUFFER,St);try{const Ct=T.texture,Ft=Ct.format,Dt=Ct.type;if(Ft!==rn&&ft.convert(Ft)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const It=Dt===vs&&(Mt.has("EXT_color_buffer_half_float")||Lt.isWebGL2&&Mt.has("EXT_color_buffer_float"));if(Dt!==Pn&&ft.convert(Dt)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Dt===Rn&&(Lt.isWebGL2||Mt.has("OES_texture_float")||Mt.has("WEBGL_color_buffer_float")))&&!It){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-$&&Y>=0&&Y<=T.height-X&&W.readPixels(O,Y,$,X,ft.convert(Ft),ft.convert(Dt),ct)}finally{const Ct=E!==null?Nt.get(E).__webglFramebuffer:null;pt.bindFramebuffer(W.FRAMEBUFFER,Ct)}}},this.copyFramebufferToTexture=function(T,O,Y=0){const $=Math.pow(2,-Y),X=Math.floor(O.image.width*$),ct=Math.floor(O.image.height*$);C.setTexture2D(O,0),W.copyTexSubImage2D(W.TEXTURE_2D,Y,0,0,T.x,T.y,X,ct),pt.unbindTexture()},this.copyTextureToTexture=function(T,O,Y,$=0){const X=O.image.width,ct=O.image.height,gt=ft.convert(Y.format),St=ft.convert(Y.type);C.setTexture2D(Y,0),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,Y.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,Y.unpackAlignment),O.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,$,T.x,T.y,X,ct,gt,St,O.image.data):O.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,$,T.x,T.y,O.mipmaps[0].width,O.mipmaps[0].height,gt,O.mipmaps[0].data):W.texSubImage2D(W.TEXTURE_2D,$,T.x,T.y,gt,St,O.image),$===0&&Y.generateMipmaps&&W.generateMipmap(W.TEXTURE_2D),pt.unbindTexture()},this.copyTextureToTexture3D=function(T,O,Y,$,X=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ct=T.max.x-T.min.x+1,gt=T.max.y-T.min.y+1,St=T.max.z-T.min.z+1,Ct=ft.convert($.format),Ft=ft.convert($.type);let Dt;if($.isData3DTexture)C.setTexture3D($,0),Dt=W.TEXTURE_3D;else if($.isDataArrayTexture||$.isCompressedArrayTexture)C.setTexture2DArray($,0),Dt=W.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,$.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,$.unpackAlignment);const It=W.getParameter(W.UNPACK_ROW_LENGTH),de=W.getParameter(W.UNPACK_IMAGE_HEIGHT),$e=W.getParameter(W.UNPACK_SKIP_PIXELS),Se=W.getParameter(W.UNPACK_SKIP_ROWS),Mn=W.getParameter(W.UNPACK_SKIP_IMAGES),re=Y.isCompressedTexture?Y.mipmaps[X]:Y.image;W.pixelStorei(W.UNPACK_ROW_LENGTH,re.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,re.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,T.min.x),W.pixelStorei(W.UNPACK_SKIP_ROWS,T.min.y),W.pixelStorei(W.UNPACK_SKIP_IMAGES,T.min.z),Y.isDataTexture||Y.isData3DTexture?W.texSubImage3D(Dt,X,O.x,O.y,O.z,ct,gt,St,Ct,Ft,re.data):Y.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),W.compressedTexSubImage3D(Dt,X,O.x,O.y,O.z,ct,gt,St,Ct,re.data)):W.texSubImage3D(Dt,X,O.x,O.y,O.z,ct,gt,St,Ct,Ft,re),W.pixelStorei(W.UNPACK_ROW_LENGTH,It),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,de),W.pixelStorei(W.UNPACK_SKIP_PIXELS,$e),W.pixelStorei(W.UNPACK_SKIP_ROWS,Se),W.pixelStorei(W.UNPACK_SKIP_IMAGES,Mn),X===0&&$.generateMipmaps&&W.generateMipmap(Dt),pt.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?C.setTextureCube(T,0):T.isData3DTexture?C.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?C.setTexture2DArray(T,0):C.setTexture2D(T,0),pt.unbindTexture()},this.resetState=function(){A=0,w=0,E=null,pt.reset(),Ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===No?"display-p3":"srgb",e.unpackColorSpace=Zt.workingColorSpace===pr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===me?xi:yc}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===xi?me:In}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class ym extends Bc{}ym.prototype.isWebGL1Renderer=!0;class Ho{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new rt(t),this.density=e}clone(){return new Ho(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Hc extends ue{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}const bl=new L,wl=new Jt,Sl=new Jt,Mm=new L,El=new At,qs=new L,io=new yn,Tl=new At,so=new mr;class bm extends _t{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=aa,this.bindMatrix=new At,this.bindMatrixInverse=new At,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Kn),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,qs),this.boundingBox.expandByPoint(qs)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new yn),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,qs),this.boundingSphere.expandByPoint(qs)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),io.copy(this.boundingSphere),io.applyMatrix4(i),t.ray.intersectsSphere(io)!==!1&&(Tl.copy(i).invert(),so.copy(t.ray).applyMatrix4(Tl),!(this.boundingBox!==null&&so.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,so)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new Jt,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===aa?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Uh?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,i=this.geometry;wl.fromBufferAttribute(i.attributes.skinIndex,t),Sl.fromBufferAttribute(i.attributes.skinWeight,t),bl.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){const o=Sl.getComponent(r);if(o!==0){const a=wl.getComponent(r);El.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(Mm.copy(bl).applyMatrix4(El),o)}}return e.applyMatrix4(this.bindMatrixInverse)}boneTransform(t,e){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(t,e)}}class Go extends ue{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Gc extends He{constructor(t=null,e=1,n=1,i,r,o,a,l,c=Ae,u=Ae,h,d){super(null,o,a,l,c,u,i,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Al=new At,wm=new At;class Vo{constructor(t=[],e=[]){this.uuid=_i(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new At)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new At;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=t.length;r<o;r++){const a=t[r]?t[r].matrixWorld:wm;Al.multiplyMatrices(a,e[r]),Al.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Vo(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new Gc(e,t,t,rn,Rn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){const r=t.bones[n];let o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Go),this.bones.push(o),this.boneInverses.push(new At().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let i=0,r=e.length;i<r;i++){const o=e[i];t.bones.push(o.uuid);const a=n[i];t.boneInverses.push(a.toArray())}return t}}class Rl extends he{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ki=new At,Cl=new At,Ys=[],Pl=new Kn,Sm=new At,cs=new _t,hs=new yn;class ro extends _t{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Rl(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Sm)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Kn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ki),Pl.copy(t.boundingBox).applyMatrix4(ki),this.boundingBox.union(Pl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new yn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ki),hs.copy(t.boundingSphere).applyMatrix4(ki),this.boundingSphere.union(hs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(cs.geometry=this.geometry,cs.material=this.material,cs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hs.copy(this.boundingSphere),hs.applyMatrix4(n),t.ray.intersectsSphere(hs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ki),Cl.multiplyMatrices(n,ki),cs.matrixWorld=Cl,cs.raycast(t,Ys);for(let o=0,a=Ys.length;o<a;o++){const l=Ys[o];l.instanceId=r,l.object=this,e.push(l)}Ys.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Rl(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Vc extends Jn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ll=new L,Dl=new L,Il=new At,oo=new mr,$s=new yn;class Em extends ue{constructor(t=new ye,e=new Vc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)Ll.fromBufferAttribute(e,i-1),Dl.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=Ll.distanceTo(Dl);t.setAttribute("lineDistance",new $t(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$s.copy(n.boundingSphere),$s.applyMatrix4(i),$s.radius+=r,t.ray.intersectsSphere($s)===!1)return;Il.copy(i).invert(),oo.copy(t.ray).applyMatrix4(Il);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new L,u=new L,h=new L,d=new L,f=this.isLineSegments?2:1,m=n.index,x=n.attributes.position;if(m!==null){const p=Math.max(0,o.start),_=Math.min(m.count,o.start+o.count);for(let v=p,y=_-1;v<y;v+=f){const A=m.getX(v),w=m.getX(v+1);if(c.fromBufferAttribute(x,A),u.fromBufferAttribute(x,w),oo.distanceSqToSegment(c,u,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);const D=t.ray.origin.distanceTo(d);D<t.near||D>t.far||e.push({distance:D,point:h.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),_=Math.min(x.count,o.start+o.count);for(let v=p,y=_-1;v<y;v+=f){if(c.fromBufferAttribute(x,v),u.fromBufferAttribute(x,v+1),oo.distanceSqToSegment(c,u,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);const w=t.ray.origin.distanceTo(d);w<t.near||w>t.far||e.push({distance:w,point:h.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}class Tm extends Jn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ul=new At,Ao=new mr,js=new yn,Ks=new L;class Am extends ue{constructor(t=new ye,e=new Tm){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),js.copy(n.boundingSphere),js.applyMatrix4(i),js.radius+=r,t.ray.intersectsSphere(js)===!1)return;Ul.copy(i).invert(),Ao.copy(t.ray).applyMatrix4(Ul);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,g=f;m<g;m++){const x=c.getX(m);Ks.fromBufferAttribute(h,x),zl(Ks,x,l,i,t,e,this)}}else{const d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let m=d,g=f;m<g;m++)Ks.fromBufferAttribute(h,m),zl(Ks,m,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function zl(s,t,e,n,i,r,o){const a=Ao.distanceSqToPoint(s);if(a<e){const l=new L;Ao.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:o})}}class vr extends He{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Wo extends ye{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new L,u=new Bt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const f=n+h/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new $t(o,3)),this.setAttribute("normal",new $t(a,3)),this.setAttribute("uv",new $t(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Qt extends ye{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],h=[],d=[],f=[];let m=0;const g=[],x=n/2;let p=0;_(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new $t(h,3)),this.setAttribute("normal",new $t(d,3)),this.setAttribute("uv",new $t(f,2));function _(){const y=new L,A=new L;let w=0;const E=(e-t)/n;for(let D=0;D<=r;D++){const M=[],S=D/r,H=S*(e-t)+t;for(let P=0;P<=i;P++){const K=P/i,R=K*l+a,I=Math.sin(R),F=Math.cos(R);A.x=H*I,A.y=-S*n+x,A.z=H*F,h.push(A.x,A.y,A.z),y.set(I,E,F).normalize(),d.push(y.x,y.y,y.z),f.push(K,1-S),M.push(m++)}g.push(M)}for(let D=0;D<i;D++)for(let M=0;M<r;M++){const S=g[M][D],H=g[M+1][D],P=g[M+1][D+1],K=g[M][D+1];u.push(S,H,K),u.push(H,P,K),w+=6}c.addGroup(p,w,0),p+=w}function v(y){const A=m,w=new Bt,E=new L;let D=0;const M=y===!0?t:e,S=y===!0?1:-1;for(let P=1;P<=i;P++)h.push(0,x*S,0),d.push(0,S,0),f.push(.5,.5),m++;const H=m;for(let P=0;P<=i;P++){const R=P/i*l+a,I=Math.cos(R),F=Math.sin(R);E.x=M*F,E.y=x*S,E.z=M*I,h.push(E.x,E.y,E.z),d.push(0,S,0),w.x=I*.5+.5,w.y=F*.5*S+.5,f.push(w.x,w.y),m++}for(let P=0;P<i;P++){const K=A+P,R=H+P;y===!0?u.push(R,R+1,K):u.push(R+1,R,K),D+=3}c.addGroup(p,D,y===!0?1:2),p+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Te extends Qt{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Te(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class _r extends ye{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],o=[];a(i),c(n),u(),this.setAttribute("position",new $t(r,3)),this.setAttribute("normal",new $t(r.slice(),3)),this.setAttribute("uv",new $t(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const v=new L,y=new L,A=new L;for(let w=0;w<e.length;w+=3)f(e[w+0],v),f(e[w+1],y),f(e[w+2],A),l(v,y,A,_)}function l(_,v,y,A){const w=A+1,E=[];for(let D=0;D<=w;D++){E[D]=[];const M=_.clone().lerp(y,D/w),S=v.clone().lerp(y,D/w),H=w-D;for(let P=0;P<=H;P++)P===0&&D===w?E[D][P]=M:E[D][P]=M.clone().lerp(S,P/H)}for(let D=0;D<w;D++)for(let M=0;M<2*(w-D)-1;M++){const S=Math.floor(M/2);M%2===0?(d(E[D][S+1]),d(E[D+1][S]),d(E[D][S])):(d(E[D][S+1]),d(E[D+1][S+1]),d(E[D+1][S]))}}function c(_){const v=new L;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(_),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function u(){const _=new L;for(let v=0;v<r.length;v+=3){_.x=r[v+0],_.y=r[v+1],_.z=r[v+2];const y=x(_)/2/Math.PI+.5,A=p(_)/Math.PI+.5;o.push(y,1-A)}m(),h()}function h(){for(let _=0;_<o.length;_+=6){const v=o[_+0],y=o[_+2],A=o[_+4],w=Math.max(v,y,A),E=Math.min(v,y,A);w>.9&&E<.1&&(v<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),A<.2&&(o[_+4]+=1))}}function d(_){r.push(_.x,_.y,_.z)}function f(_,v){const y=_*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function m(){const _=new L,v=new L,y=new L,A=new L,w=new Bt,E=new Bt,D=new Bt;for(let M=0,S=0;M<r.length;M+=9,S+=6){_.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),y.set(r[M+6],r[M+7],r[M+8]),w.set(o[S+0],o[S+1]),E.set(o[S+2],o[S+3]),D.set(o[S+4],o[S+5]),A.copy(_).add(v).add(y).divideScalar(3);const H=x(A);g(w,S+0,_,H),g(E,S+2,v,H),g(D,S+4,y,H)}}function g(_,v,y,A){A<0&&_.x===1&&(o[v]=_.x-1),y.x===0&&y.z===0&&(o[v]=A/2/Math.PI+.5)}function x(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _r(t.vertices,t.indices,t.radius,t.details)}}class ti extends _r{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ti(t.radius,t.detail)}}class hr extends _r{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new hr(t.radius,t.detail)}}class an extends ye{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new L,d=new L,f=[],m=[],g=[],x=[];for(let p=0;p<=n;p++){const _=[],v=p/n;let y=0;p===0&&o===0?y=.5/e:p===n&&l===Math.PI&&(y=-.5/e);for(let A=0;A<=e;A++){const w=A/e;h.x=-t*Math.cos(i+w*r)*Math.sin(o+v*a),h.y=t*Math.cos(o+v*a),h.z=t*Math.sin(i+w*r)*Math.sin(o+v*a),m.push(h.x,h.y,h.z),d.copy(h).normalize(),g.push(d.x,d.y,d.z),x.push(w+y,1-v),_.push(c++)}u.push(_)}for(let p=0;p<n;p++)for(let _=0;_<e;_++){const v=u[p][_+1],y=u[p][_],A=u[p+1][_],w=u[p+1][_+1];(p!==0||o>0)&&f.push(v,y,w),(p!==n-1||l<Math.PI)&&f.push(y,A,w)}this.setIndex(f),this.setAttribute("position",new $t(m,3)),this.setAttribute("normal",new $t(g,3)),this.setAttribute("uv",new $t(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new an(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class _s extends Jn{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new rt(16777215),this.specular=new rt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zo,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=dr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ge extends Jn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zo,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=dr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class yr extends ue{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class Wc extends yr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ue.DEFAULT_UP),this.updateMatrix(),this.groundColor=new rt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ao=new At,Nl=new L,kl=new L;class Xo{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Bt(512,512),this.map=null,this.mapPass=null,this.matrix=new At,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Oo,this._frameExtents=new Bt(1,1),this._viewportCount=1,this._viewports=[new Jt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Nl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Nl),kl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(kl),e.updateMatrixWorld(),ao.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ao),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ao)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Rm extends Xo{constructor(){super(new Oe(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=Ki*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class Cm extends yr{constructor(t,e,n=0,i=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ue.DEFAULT_UP),this.updateMatrix(),this.target=new ue,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Rm}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Fl=new At,us=new L,lo=new L;class Pm extends Xo{constructor(){super(new Oe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Bt(4,2),this._viewportCount=6,this._viewports=[new Jt(2,1,1,1),new Jt(0,1,1,1),new Jt(3,1,1,1),new Jt(1,1,1,1),new Jt(3,0,1,1),new Jt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),us.setFromMatrixPosition(t.matrixWorld),n.position.copy(us),lo.copy(n.position),lo.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(lo),n.updateMatrixWorld(),i.makeTranslation(-us.x,-us.y,-us.z),Fl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fl)}}class qo extends yr{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Pm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Lm extends Xo{constructor(){super(new Ic(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ro extends yr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ue.DEFAULT_UP),this.updateMatrix(),this.target=new ue,this.shadow=new Lm}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Io}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Io);const Ol={seed:20261014,size:2e3,seg:400,radius:840,seaLevel:0,mountain:{x:-60,z:-450,height:175,spread:250,crater:24},plains:{x:300,z:-60,radius:280,height:11},river:{points:[[-30,-290],[30,-190],[110,-60],[150,70],[200,180],[270,290],[380,400],[470,490],[560,580],[700,700]],widthStart:5,widthEnd:22,depth:1.8},lake:{x:-400,z:310,radius:70},pois:[{id:"dock",name:"Supply Dock",coast:{x:40,dir:[0,1]},flat:22,icon:"dock"},{id:"station",name:"Ranger Station Alpha",inland:{from:"dock",dist:120},flat:30,icon:"station"},{id:"fieldlab",name:"Foundation Field Lab",x:-270,z:150,flat:62,icon:"lab"},{id:"easttower",name:"East Plains Tower",x:330,z:-30,flat:10,icon:"tower"},{id:"westtower",name:"West Jungle Tower",x:-480,z:-80,flat:10,icon:"tower"},{id:"southtower",name:"Marsh Tower",x:300,z:470,flat:10,icon:"tower"},{id:"paddock",name:"Old Paddock C",x:210,z:-280,flat:0,icon:"fence"},{id:"summit",name:"Summit Relay",summit:!0,flat:16,icon:"relay"}],roads:[["dock","station",[-60,470],[-170,300],"fieldlab"],["station",[120,470],[250,340],[330,180],[345,60],"easttower",[290,-150],"paddock"],["fieldlab",[-380,40],"westtower"],["station",[200,520],"southtower"]],wind:{angle:.6,strength:.6}},Ln={compsognathus:{name:"Compsognathus",latin:"Compsognathus longipes",blurb:"Chicken-sized scavengers that move in twitchy little gangs. One rifle dart is an overdose.",temperament:"skittish",diet:"carnivore",mass:3,radius:.25,health:12,speed:{walk:1.4,run:7,turn:6},senses:{sight:32,fov:260,hearing:1.3,smell:.8,motion:.3},sedation:{ko:8,lethal:20,metab:.07},herd:[4,7],habitat:{jungle:1,beach:.8,swamp:.5},herds:3,attack:null,science:{blood:40,measure:15,tag:20,scan:15},killPenalty:100,sound:{voice:"chirp",pitch:2.4,size:.1},scale:[.85,1.15],body:{plan:"biped",hipH:.24,torsoLen:.24,torsoR:.07,torsoH:.08,pelvisLen:.08,neck:{n:2,len:.16,r:.03,rise:.75},head:{len:.1,w:.04,h:.045,taper:.55},tail:{n:6,len:.46,r:.045,rise:.05},legR:.035,armLen:.08,colors:{dorsal:"#6b7a3a",belly:"#d9d2a0",stripe:"#3b4420",pattern:"stripes",accent:"#c8a040"},features:[]}},gallimimus:{name:"Gallimimus",latin:"Gallimimus bullatus",blurb:"Ostrich-like sprinters. A flock will bolt at the first snapped twig — from cover, patience pays.",temperament:"skittish",diet:"omnivore",mass:300,radius:.55,health:60,speed:{walk:2.2,run:13,turn:4},senses:{sight:75,fov:300,hearing:1.2,smell:.5,motion:.6},sedation:{ko:30,lethal:75,metab:.2},herd:[5,8],habitat:{grass:1,beach:.6},herds:3,attack:null,science:{blood:80,measure:25,tag:40,scan:20},killPenalty:200,sound:{voice:"honk",pitch:1.6,size:.35},scale:[.9,1.1],body:{plan:"biped",hipH:1.45,torsoLen:1,torsoR:.3,torsoH:.36,pelvisLen:.35,neck:{n:4,len:1.15,r:.1,rise:1.05},head:{len:.32,w:.09,h:.1,taper:.4},tail:{n:7,len:2.1,r:.22,rise:.08},legR:.14,armLen:.55,colors:{dorsal:"#a08860",belly:"#efe2c0",stripe:"#6a5a40",pattern:"mottle",accent:"#d0b080"},features:["beak"]}},parasaurolophus:{name:"Parasaurolophus",latin:"Parasaurolophus walkeri",blurb:"Gentle herd browsers of the riverbanks. Their crest-honk sends the whole herd running.",temperament:"skittish",diet:"herbivore",mass:2500,radius:1.1,health:220,speed:{walk:1.8,run:9,turn:2},senses:{sight:60,fov:280,hearing:1.1,smell:.9,motion:.5},sedation:{ko:90,lethal:210,metab:.55},herd:[3,6],habitat:{swamp:1,jungle:.4,grass:.4},nearWater:!0,herds:3,attack:null,science:{blood:100,measure:30,tag:50,scan:25},killPenalty:250,sound:{voice:"horn",pitch:.7,size:.7},scale:[.85,1.1],body:{plan:"quad",hipH:2,shoulderH:1.55,torsoLen:2.4,torsoR:.62,torsoH:.75,pelvisLen:.8,neck:{n:4,len:1.3,r:.24,rise:.55},head:{len:.75,w:.18,h:.24,taper:.55},tail:{n:7,len:3.8,r:.42,rise:.04},legR:.3,frontR:.15,colors:{dorsal:"#5d6a88",belly:"#dcd4b4",stripe:"#38405e",pattern:"bands",accent:"#c87830"},features:["crest","beak"]}},velociraptor:{name:"Velociraptor",latin:"Deinonychus antirrhopus (preserve strain)",blurb:"Pack hunters with a good nose. They flank, they test fences, and they hunt you once they know you are there.",temperament:"aggressive",diet:"carnivore",pack:!0,mass:80,radius:.45,health:70,speed:{walk:2.2,run:10.5,turn:5},senses:{sight:55,fov:220,hearing:1.35,smell:1.6,motion:.6},sedation:{ko:25,lethal:60,metab:.18},herd:[3,4],habitat:{jungle:1,swamp:.3},herds:2,attack:{kind:"bite",damage:14,range:1.9,cooldown:1.1,lunge:6},prey:["compsognathus","gallimimus","parasaurolophus"],science:{blood:220,measure:60,tag:100,scan:50},killPenalty:300,sound:{voice:"screech",pitch:1.4,size:.35},scale:[.9,1.1],body:{plan:"biped",hipH:.95,torsoLen:.85,torsoR:.22,torsoH:.28,pelvisLen:.25,neck:{n:3,len:.55,r:.09,rise:.7},head:{len:.42,w:.1,h:.13,taper:.5},tail:{n:7,len:1.9,r:.16,rise:.12},legR:.11,armLen:.45,colors:{dorsal:"#7a6040",belly:"#d8c8a0",stripe:"#2b2015",pattern:"stripes",accent:"#40342a"},features:["quills","sickle","teeth"]}},dilophosaurus:{name:"Dilophosaurus",latin:"Dilophosaurus wetherilli",blurb:"Solitary ambusher of the marsh margins. Spits a blinding mist before it closes in.",temperament:"aggressive",diet:"carnivore",mass:400,radius:.6,health:110,speed:{walk:1.8,run:8.5,turn:3.5},senses:{sight:38,fov:200,hearing:1,smell:.9,motion:.7},sedation:{ko:45,lethal:110,metab:.29},herd:[1,1],habitat:{swamp:1,jungle:.7},herds:3,attack:{kind:"bite",damage:18,range:2.3,cooldown:1.5,spit:{range:15,cooldown:7}},prey:["compsognathus","gallimimus"],science:{blood:180,measure:50,tag:80,scan:40},killPenalty:300,sound:{voice:"hiss",pitch:1.1,size:.5},scale:[.9,1.1],body:{plan:"biped",hipH:1.35,torsoLen:1.15,torsoR:.3,torsoH:.38,pelvisLen:.35,neck:{n:3,len:.85,r:.13,rise:.6},head:{len:.55,w:.12,h:.16,taper:.55},tail:{n:7,len:2.6,r:.24,rise:.08},legR:.15,armLen:.5,colors:{dorsal:"#4a6a3a",belly:"#d4d490",stripe:"#b86a20",pattern:"spots",accent:"#c03020"},features:["twinCrest","teeth"]}},stegosaurus:{name:"Stegosaurus",latin:"Stegosaurus stenops",blurb:"Short-sighted and slow, but that thagomizer swings hard at anything behind it.",temperament:"defensive",diet:"herbivore",mass:4e3,radius:1.3,health:340,speed:{walk:1.4,run:5.5,turn:1.4},senses:{sight:30,fov:240,hearing:.9,smell:.7,motion:.5},sedation:{ko:120,lethal:280,metab:.65},personalSpace:12,herd:[2,4],habitat:{grass:.7,jungle:.6},herds:2,attack:{kind:"tail",damage:32,range:5.5,cooldown:2.2},science:{blood:160,measure:50,tag:80,scan:30},killPenalty:400,sound:{voice:"bellow",pitch:.75,size:.8},scale:[.9,1.1],body:{plan:"quad",hipH:2.2,shoulderH:1.3,torsoLen:2.3,torsoR:.75,torsoH:.95,pelvisLen:.9,neck:{n:3,len:1,r:.24,rise:-.25},head:{len:.5,w:.14,h:.16,taper:.6},tail:{n:7,len:3.6,r:.42,rise:.15},legR:.32,frontR:.18,colors:{dorsal:"#6a7050",belly:"#cbc39a",stripe:"#404830",pattern:"mottle",accent:"#b05532"},features:["plates","thagomizer","beak"]}},triceratops:{name:"Triceratops",latin:"Triceratops horridus",blurb:"Herds of grumpy tanks. Give them space and they will graze; crowd them and they charge.",temperament:"defensive",diet:"herbivore",mass:6e3,radius:1.5,health:420,speed:{walk:1.6,run:8,turn:1.3},senses:{sight:42,fov:220,hearing:1,smell:.8,motion:.5},sedation:{ko:135,lethal:330,metab:.81},personalSpace:16,herd:[3,5],habitat:{grass:1},herds:3,attack:{kind:"charge",damage:30,range:3.4,cooldown:3},science:{blood:180,measure:50,tag:90,scan:30},killPenalty:450,sound:{voice:"bellow",pitch:.6,size:.9},scale:[.85,1.1],body:{plan:"quad",hipH:1.75,shoulderH:1.6,torsoLen:2.6,torsoR:.95,torsoH:.95,pelvisLen:.8,neck:{n:2,len:.55,r:.45,rise:-.15},head:{len:1.3,w:.42,h:.5,taper:.65},tail:{n:6,len:2.4,r:.42,rise:.02},legR:.36,frontR:.3,colors:{dorsal:"#7a6a50",belly:"#cfc0a0",stripe:"#4a3e2c",pattern:"bands",accent:"#a8452e"},features:["frill","horns","beak"]}},ankylosaurus:{name:"Ankylosaurus",latin:"Ankylosaurus magniventris",blurb:"A walking bunker. Darts bounce off its back — aim for legs, neck or head. Mind the club.",temperament:"defensive",diet:"herbivore",mass:5e3,radius:1.4,health:380,speed:{walk:1,run:4.2,turn:1.2},senses:{sight:26,fov:220,hearing:.8,smell:1,motion:.5},sedation:{ko:140,lethal:320,metab:.75},personalSpace:10,herd:[1,2],habitat:{highland:1,jungle:.5,grass:.4},herds:3,attack:{kind:"tail",damage:34,range:4.6,cooldown:2.4},armor:["torso","tail"],science:{blood:180,measure:50,tag:90,scan:35},killPenalty:450,sound:{voice:"grunt",pitch:.55,size:.8},scale:[.9,1.1],body:{plan:"quad",hipH:1.15,shoulderH:1.05,torsoLen:2.4,torsoR:1.15,torsoH:.65,pelvisLen:.8,neck:{n:2,len:.45,r:.3,rise:-.1},head:{len:.6,w:.32,h:.24,taper:.8},tail:{n:6,len:2.6,r:.36,rise:.08},legR:.3,frontR:.26,colors:{dorsal:"#6a5a40",belly:"#b8a888",stripe:"#3e342a",pattern:"mottle",accent:"#3a3128"},features:["armor","club","beak"]}},tyrannosaurus:{name:"Tyrannosaurus",latin:"Tyrannosaurus rex",blurb:"The island’s apex. Hunts by motion and smell — stay still, stay downwind. Takes a lot of sedative.",temperament:"aggressive",diet:"carnivore",mass:8e3,radius:1.6,health:650,speed:{walk:2.2,run:9,turn:1.6},senses:{sight:75,fov:200,hearing:1.1,smell:1.4,motion:1.6},sedation:{ko:260,lethal:560,metab:1.37},herd:[1,1],habitat:{highland:.8,jungle:.7,grass:.5},herds:1,attack:{kind:"bite",damage:55,range:4.6,cooldown:2.2,lunge:4},prey:["triceratops","parasaurolophus","gallimimus","stegosaurus"],science:{blood:600,measure:150,tag:250,scan:120},killPenalty:1e3,sound:{voice:"roar",pitch:.42,size:1},scale:[1,1.05],body:{plan:"biped",hipH:3.4,torsoLen:3,torsoR:.9,torsoH:1.15,pelvisLen:1,neck:{n:3,len:1.4,r:.48,rise:.35},head:{len:1.5,w:.42,h:.6,taper:.65},tail:{n:8,len:5.6,r:.75,rise:.06},legR:.5,armLen:.8,colors:{dorsal:"#5a4a38",belly:"#c4ac8a",stripe:"#2e261c",pattern:"stripes",accent:"#2e261c"},features:["teeth"]}},brachiosaurus:{name:"Brachiosaurus",latin:"Brachiosaurus altithorax",blurb:"Gentle giants that browse the canopy. They will not chase you — just do not stand under one.",temperament:"passive",diet:"herbivore",mass:3e4,radius:2.6,health:1200,speed:{walk:1.2,run:3.2,turn:.7},senses:{sight:50,fov:260,hearing:.6,smell:.5,motion:.4},sedation:{ko:420,lethal:900,metab:2.21},herd:[2,3],habitat:{jungle:.8,swamp:.6,grass:.4},nearWater:!0,herds:2,attack:{kind:"trample",damage:40,range:3.2,cooldown:1.5},browse:!0,science:{blood:300,measure:100,tag:150,scan:40},killPenalty:800,sound:{voice:"horn",pitch:.32,size:1},scale:[.9,1.05],body:{plan:"quad",hipH:4.2,shoulderH:5.4,torsoLen:5.2,torsoR:1.5,torsoH:1.7,pelvisLen:1.4,neck:{n:6,len:8,r:.55,rise:1},head:{len:.95,w:.3,h:.36,taper:.6},tail:{n:8,len:7,r:.8,rise:.02},legR:.6,frontR:.5,colors:{dorsal:"#6f7f70",belly:"#c4c4aa",stripe:"#4a5a50",pattern:"mottle",accent:"#4a5a50"},features:["nasalCrest"]}}},Xc=["compsognathus","gallimimus","parasaurolophus","stegosaurus","triceratops","ankylosaurus","brachiosaurus","dilophosaurus","velociraptor","tyrannosaurus"];for(const s in Ln)Ln[s].id=s;const Bl={pistolDart:{name:"Pistol darts",max:36},rifleDart:{name:"Rifle darts",max:16},rifleRound:{name:"Rifle rounds",max:20},shell:{name:"Shells",max:16},stone:{name:"Stones",max:8},flare:{name:"Flares",max:5},medkit:{name:"Medkits",max:4},fuelcan:{name:"Fuel can",max:1,key:!0},circuit:{name:"Relay circuit board",max:1,key:!0}},Dm={weapons:["scanner","pistol"],items:{pistolDart:12,stone:5,flare:1,medkit:1}},Im={stationLocker:{weapons:["rifle","hunting"],items:{rifleDart:6,rifleRound:5,flare:2,medkit:1,pistolDart:6},flag:"stationLocker"},labArmory:{weapons:["shotgun"],items:{shell:6,rifleDart:6,pistolDart:12,medkit:2},flag:"labArmory"},hangarCrate:{items:{fuelcan:1,flare:1},flag:"hangarCrate"},relayHut:{items:{rifleDart:6,medkit:1,flare:1},flag:"relayHut"}},Um=[{w:3,items:{pistolDart:6}},{w:3,items:{rifleDart:3}},{w:1.5,items:{shell:4}},{w:1.5,items:{rifleRound:3}},{w:2,items:{medkit:1}},{w:2,items:{flare:1,stone:3}}];class zm{constructor(){this.handlers=new Map}on(t,e){let n=this.handlers.get(t);return n||this.handlers.set(t,n=[]),n.push(e),()=>this.off(t,e)}off(t,e){const n=this.handlers.get(t);if(!n)return;const i=n.indexOf(e);i>=0&&n.splice(i,1)}emit(t,e={}){const n=this.handlers.get(t);if(n)for(const r of n.slice())r(e);const i=this.handlers.get("*");if(i)for(const r of i.slice())r(t,e)}}const Nm={forward:["KeyW","ArrowUp"],back:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],jump:["Space"],sprint:["ShiftLeft","ShiftRight"],crouch:["KeyC"],interact:["KeyE"],reload:["KeyR"],fire:["Mouse0"],aim:["Mouse2"],throwStone:["KeyG"],throwFlare:["KeyT"],medkit:["KeyH"],flashlight:["KeyF"],map:["KeyM"],journal:["KeyJ","Tab"],camera:["KeyV"],slot1:["Digit1"],slot2:["Digit2"],slot3:["Digit3"],slot4:["Digit4"],slot5:["Digit5"],nextWeapon:["WheelDown"],prevWeapon:["WheelUp"],ascend:["Space"],descend:["ShiftLeft","ShiftRight"]};class km{constructor(t,e=Nm){this.el=t,this.bindings=e,this.held=new Set,this.downEdge=new Set,this.upEdge=new Set,this.mouseDX=0,this.mouseDY=0,this.sensitivity=.0022,this.invertY=!1,this.enabled=!0,this.locked=!1,this.onLockChange=null;const n=new Set(["Tab","Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]);window.addEventListener("keydown",i=>{n.has(i.code)&&i.preventDefault(),!i.repeat&&this.press(i.code)}),window.addEventListener("keyup",i=>this.release(i.code)),window.addEventListener("blur",()=>{for(const i of this.held)this.upEdge.add(i);this.held.clear()}),t.addEventListener("mousedown",i=>{this.press("Mouse"+i.button)}),window.addEventListener("mouseup",i=>this.release("Mouse"+i.button)),t.addEventListener("contextmenu",i=>i.preventDefault()),window.addEventListener("wheel",i=>{if(!this.locked)return;const r=i.deltaY>0?"WheelDown":"WheelUp";this.downEdge.add(r),this.upEdge.add(r)},{passive:!0}),window.addEventListener("mousemove",i=>{this.locked&&(this.mouseDX+=i.movementX,this.mouseDY+=i.movementY)}),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===this.el,this.onLockChange&&this.onLockChange(this.locked)})}press(t){this.held.has(t)||this.downEdge.add(t),this.held.add(t)}release(t){this.held.has(t)&&this.upEdge.add(t),this.held.delete(t)}lock(){try{const t=this.el.requestPointerLock();t&&t.catch&&t.catch(()=>{})}catch{}}unlock(){document.pointerLockElement&&document.exitPointerLock()}down(t){if(!this.enabled)return!1;const e=this.bindings[t];if(!e)return!1;for(const n of e)if(this.held.has(n))return!0;return!1}pressed(t){if(!this.enabled)return!1;const e=this.bindings[t];if(!e)return!1;for(const n of e)if(this.downEdge.has(n))return!0;return!1}released(t){const e=this.bindings[t];if(!e)return!1;for(const n of e)if(this.upEdge.has(n))return!0;return!1}axis(t,e){return(this.down(e)?1:0)-(this.down(t)?1:0)}look(){const t=this.mouseDX*this.sensitivity,e=this.mouseDY*this.sensitivity*(this.invertY?-1:1);return this.mouseDX=0,this.mouseDY=0,this.enabled?{dx:t,dy:e}:{dx:0,dy:0}}endFrame(){this.downEdge.clear(),this.upEdge.clear()}}const Hl=Math.PI*2,wt=(s,t,e)=>s<t?t:s>e?e:s,oe=(s,t,e)=>s+(t-s)*e,Yt=(s,t,e)=>{const n=wt((e-s)/(t-s),0,1);return n*n*(3-2*n)},Re=(s,t,e,n)=>oe(s,t,1-Math.exp(-e*n));function Je(s){return s=(s+Math.PI)%Hl,s<0&&(s+=Hl),s-Math.PI}function Fm(s,t,e,n){return s+Je(t-s)*(1-Math.exp(-3*n))}function Om(s,t,e){const n=Je(t-s);return Math.abs(n)<=e?t:s+Math.sign(n)*e}const vn=(s,t,e,n)=>Math.atan2(-(e-s),-(n-t)),Vn=s=>-Math.sin(s),Wn=s=>-Math.cos(s);function Gl(s,t,e,n,i,r){const o=i-e,a=r-n,l=o*o+a*a;let c=l>0?((s-e)*o+(t-n)*a)/l:0;c=wt(c,0,1);const u=e+o*c,h=n+a*c;return{d:Math.hypot(s-u,t-h),t:c}}function Bm(s){const t=Math.floor(s)%24,e=Math.floor((s-Math.floor(s))*60);return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function Mr(s){let t=s>>>0;return function(){t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Vl(s,t,e=0){let n=Math.imul(s|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,1442695041)|0;return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}function Hm(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}class Dn{constructor(t=1){this.seed=t>>>0,this.next=Mr(this.seed)}range(t,e){return t+(e-t)*this.next()}int(t,e){return t+Math.floor(this.next()*(e-t+1))}chance(t){return this.next()<t}pick(t){return t[Math.floor(this.next()*t.length)]}sign(){return this.next()<.5?-1:1}gauss(){const t=1-this.next(),e=this.next();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*e)}weighted(t,e){let n=0;for(let r=0;r<t.length;r++)n+=e?e[r]:t[r].w;let i=this.next()*n;for(let r=0;r<t.length;r++)if(i-=e?e[r]:t[r].w,i<=0)return t[r];return t[t.length-1]}fork(t){return new Dn((this.seed^Math.imul(t+1,2654435761))>>>0)}}const Gm=.5*(Math.sqrt(3)-1),ds=(3-Math.sqrt(3))/6,Fi=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1]);class Wl{constructor(t=1){const e=Mr(t),n=new Uint8Array(256);for(let i=0;i<256;i++)n[i]=i;for(let i=255;i>0;i--){const r=Math.floor(e()*(i+1)),o=n[i];n[i]=n[r],n[r]=o}this.perm=new Uint8Array(512);for(let i=0;i<512;i++)this.perm[i]=n[i&255]}noise(t,e){const n=this.perm,i=(t+e)*Gm,r=Math.floor(t+i),o=Math.floor(e+i),a=(r+o)*ds,l=t-(r-a),c=e-(o-a),u=l>c?1:0,h=l>c?0:1,d=l-u+ds,f=c-h+ds,m=l-1+2*ds,g=c-1+2*ds,x=r&255,p=o&255;let _=0,v=0,y=0,A=.5-l*l-c*c;if(A>0){const D=(n[x+n[p]]&7)*2;A*=A,_=A*A*(Fi[D]*l+Fi[D+1]*c)}let w=.5-d*d-f*f;if(w>0){const D=(n[x+u+n[p+h]]&7)*2;w*=w,v=w*w*(Fi[D]*d+Fi[D+1]*f)}let E=.5-m*m-g*g;if(E>0){const D=(n[x+1+n[p+1]]&7)*2;E*=E,y=E*E*(Fi[D]*m+Fi[D+1]*g)}return 70*(_+v+y)}fbm(t,e,n=5,i=2,r=.5){let o=0,a=1,l=0;for(let c=0;c<n;c++)o+=a*this.noise(t,e),l+=a,a*=r,t*=i,e*=i;return o/l}ridged(t,e,n=4){let i=0,r=.5,o=0;for(let a=0;a<n;a++){const l=1-Math.abs(this.noise(t,e));i+=l*l*r,o+=r,r*=.5,t*=2,e*=2}return i/o}}const Xl=["beach","grass","jungle","swamp","highland","rock"],ql=-1e4;class Vm{constructor(t){this.cfg=t,this.size=t.size,this.seg=t.seg,this.n=t.seg+1,this.cell=t.size/t.seg,this.half=t.size/2,this.sea=t.seaLevel;const e=this.n*this.n,n=()=>new Float32Array(e);this.h=n(),this.water=new Float32Array(e).fill(ql),this.riverD=new Float32Array(e).fill(1e4),this.riverM=new Float32Array(e).fill(1e4),this.moist=n(),this.slope=n(),this.road=n(),this.clear=n(),this.w={};for(const i of Xl)this.w[i]=n();this.d={};for(const i of["canopy","palm","broadleaf","pine","fern","bush","grass","reed","rock","bigleaf","log"])this.d[i]=n();this.cover=n(),this.noise=new Wl(t.seed),this.noiseB=new Wl(t.seed+7),this.rng=new Dn(t.seed),this.pois=[],this.roads=[],this.bridges=[],this.river=null,this.lake=null,this.generateBase(),this.carveRiver(),this.carveLake(),this.placePois(),this.buildRoads(),this.computeSlope(),this.computeBiomes(),this.computeDensities()}idx(t,e){return e*this.n+t}xOf(t){return-this.half+t*this.cell}forEachInBox(t,e,n,i,r){const o=Math.max(0,Math.floor((t+this.half)/this.cell)),a=Math.min(this.n-1,Math.ceil((n+this.half)/this.cell)),l=Math.max(0,Math.floor((e+this.half)/this.cell)),c=Math.min(this.n-1,Math.ceil((i+this.half)/this.cell));for(let u=l;u<=c;u++){const h=this.xOf(u);for(let d=o;d<=a;d++)r(this.idx(d,u),this.xOf(d),h)}}heightAt(t,e){const n=(t+this.half)/this.cell,i=(e+this.half)/this.cell;if(n<0||i<0||n>=this.seg||i>=this.seg)return-30;const r=Math.floor(n),o=Math.floor(i),a=n-r,l=i-o,c=this.n,u=this.h,h=u[o*c+r],d=u[(o+1)*c+r],f=u[o*c+r+1],m=u[(o+1)*c+r+1];return a+l<=1?h+(f-h)*a+(d-h)*l:m+(d-m)*(1-a)+(f-m)*(1-l)}sample(t,e,n){const i=wt((e+this.half)/this.cell,0,this.seg-.001),r=wt((n+this.half)/this.cell,0,this.seg-.001),o=Math.floor(i),a=Math.floor(r),l=i-o,c=r-a,u=this.n,h=t[a*u+o],d=t[a*u+o+1],f=t[(a+1)*u+o],m=t[(a+1)*u+o+1];return oe(oe(h,d,l),oe(f,m,l),c)}waterAt(t,e){const n=(t+this.half)/this.cell,i=(e+this.half)/this.cell;let r=this.sea;if(n>=0&&i>=0&&n<this.seg&&i<this.seg){const o=Math.floor(n),a=Math.floor(i),l=this.n,c=this.water,u=Math.max(c[a*l+o],c[a*l+o+1],c[(a+1)*l+o],c[(a+1)*l+o+1]);u>r&&(r=u)}return r}depthAt(t,e){return this.waterAt(t,e)-this.heightAt(t,e)}normalAt(t,e,n){const r=this.heightAt(t+1.5,e)-this.heightAt(t-1.5,e),o=this.heightAt(t,e+1.5)-this.heightAt(t,e-1.5),a=-r,l=2*1.5,c=-o,u=Math.hypot(a,l,c);return n.x=a/u,n.y=l/u,n.z=c/u,n}biomeAt(t,e){let n="grass",i=-1;for(const r of Xl){const o=this.sample(this.w[r],t,e);o>i&&(i=o,n=r)}return this.heightAt(t,e)<this.sea-.3?"ocean":n}coverAt(t,e){return this.sample(this.cover,t,e)}isLand(t,e,n=.3){return this.depthAt(t,e)<n}generateBase(){const{radius:t,mountain:e,plains:n}=this.cfg,i=this.noise,r=this.noiseB;for(let o=0;o<this.n;o++){const a=this.xOf(o);for(let l=0;l<this.n;l++){const c=this.xOf(l),u=c+150*i.fbm(c*.0011,a*.0011,3),h=a+150*i.fbm(c*.0011+40,a*.0011-30,3),d=Math.hypot(u,h*1.05)/t,f=1-Yt(.7,1.02,d);let m=oe(-24,5,f);m+=(r.fbm(c*.0024+7,a*.0024+3,4)*.5+.5)*36*f*f,m+=i.fbm(c*.013,a*.013,3)*3*f;const g=Math.hypot(c-e.x,a-e.z);m+=e.height*Math.exp(-((g/e.spread)**2))*f,m+=32*r.ridged(c*.0055,a*.0055,4)*Math.exp(-((g/(e.spread*1.35))**2))*f,m-=e.crater*Math.exp(-((g/58)**2));const x=Math.hypot(c-n.x,a-n.z)/n.radius,p=(1-Yt(.5,1,x))*f;m=oe(m,n.height+r.fbm(c*.006,a*.006,2)*3,p*.85),m>0&&m<6&&(m=6*Math.pow(m/6,1.7)),this.h[this.idx(l,o)]=m}}}carveRiver(){const t=this.cfg.river,e=t.points,n=[];for(let h=0;h<e.length-1;h++){const d=e[Math.max(0,h-1)],f=e[h],m=e[h+1],g=e[Math.min(e.length-1,h+2)],x=Math.hypot(m[0]-f[0],m[1]-f[1]),p=Math.max(2,Math.ceil(x/6));for(let _=0;_<p;_++){const v=_/p,y=v*v,A=y*v,w=(E,D,M,S)=>.5*(2*D+(-E+M)*v+(2*E-5*D+4*M-S)*y+(-E+3*D-3*M+S)*A);n.push([w(d[0],f[0],m[0],g[0]),w(d[1],f[1],m[1],g[1])])}}n.push(e[e.length-1].slice());let i=0;for(let h=1;h<n.length-1;h++){const d=n[h+1][0]-n[h-1][0],f=n[h+1][1]-n[h-1][1],m=Math.hypot(d,f)||1;i+=6;const g=this.noiseB.noise(i*.006,3.3)*28;n[h][0]+=-f/m*g,n[h][1]+=d/m*g}const r=n.length,o=new Float32Array(r);let a=1/0;for(let h=0;h<r;h++){const d=this.heightAt(n[h][0],n[h][1]);a=Math.min(a-.03,d-1.2),o[h]=Math.max(a,this.sea)}const l=new Float32Array(r);for(let h=0;h<r;h++){let d=0,f=0;for(let m=-4;m<=4;m++){const g=h+m;g<0||g>=r||(d+=o[g],f++)}l[h]=d/f}for(let h=1;h<r;h++)l[h]=Math.min(l[h],l[h-1]-.01);for(let h=0;h<r;h++)l[h]=Math.max(l[h],this.sea);const c=new Float32Array(r);for(let h=0;h<r;h++)c[h]=oe(t.widthStart,t.widthEnd,h/(r-1))*(1+.25*this.noise.noise(h*.05,9.1));const u=new Float32Array(this.n*this.n).fill(ql);for(let h=0;h<r-1;h++){const[d,f]=n[h],[m,g]=n[h+1],p=Math.max(c[h],c[h+1])/2*4+10;this.forEachInBox(Math.min(d,m)-p,Math.min(f,g)-p,Math.max(d,m)+p,Math.max(f,g)+p,(_,v,y)=>{const{d:A,t:w}=Gl(v,y,d,f,m,g),E=oe(c[h],c[h+1],w)/2,D=A/E;D<this.riverD[_]&&(this.riverD[_]=D,this.riverM[_]=A,u[_]=oe(l[h],l[h+1],w))})}for(let h=0;h<u.length;h++){const d=this.riverD[h];if(d>4.5)continue;const f=u[h];let m=this.h[h];if(d<1){const g=f-t.depth*(1-d*d)-.25;m=Math.min(m,g)}else{const g=f+.35+(d-1)*.9;m=Math.min(m,oe(g,m,Yt(1,4.5,d))),d<1.6&&(m=Math.max(m,f+.2))}this.h[h]=m,d<1.3&&f>this.sea+.01&&(this.water[h]=f)}this.river={path:n,surf:l,widths:c}}carveLake(){const t=this.cfg.lake,e=r=>t.radius*(1+.28*this.noise.noise(Math.cos(r)*1.3+5,Math.sin(r)*1.3+5));let n=1/0;for(let r=0;r<64;r++){const o=r/64*Math.PI*2,a=e(o)*1.3;n=Math.min(n,this.heightAt(t.x+Math.cos(o)*a,t.z+Math.sin(o)*a))}n=Math.max(n-.4,this.sea+1.5);const i=t.radius*2.2;this.forEachInBox(t.x-i,t.z-i,t.x+i,t.z+i,(r,o,a)=>{const l=o-t.x,c=a-t.z,u=Math.hypot(l,c)/e(Math.atan2(c,l));let h=this.h[r];u<1?h=Math.min(h,n-6*(1-u*u)-.4):u<1.9&&(h=Math.min(h,oe(n+.3,h,Yt(1,1.9,u))),u<1.3&&(h=Math.max(h,n+.12))),this.h[r]=h,u<1.2&&(this.water[r]=Math.max(this.water[r],n))}),this.lake={x:t.x,z:t.z,radius:t.radius,level:n}}findCoast(t,e,n,i){for(let r=0;r<1200;r+=2){const o=t+n*r,a=e+i*r;if(this.heightAt(o,a)<this.sea+.2)return{x:o,z:a}}return{x:t+n*1200,z:e+i*1200}}flatten(t,e,n,i,r=1.8){const o=n*r+10;this.forEachInBox(t-o,e-o,t+o,e+o,(a,l,c)=>{const u=Math.hypot(l-t,c-e);if(u>o)return;const h=1-Yt(n,o,u);this.h[a]=oe(this.h[a],i,h),this.clear[a]=Math.max(this.clear[a],1-Yt(n,n+10,u))})}placePois(){const t={};for(const e of this.cfg.pois){const n={id:e.id,name:e.name,icon:e.icon,x:e.x??0,z:e.z??0,yaw:0,flat:e.flat};if(e.coast){const[i,r]=e.coast.dir,o=this.findCoast(e.coast.x,0,i,r);n.x=o.x-i*12,n.z=o.z-r*12,n.seaDir=[i,r],n.yaw=Math.atan2(-i,-r)}else if(e.inland){const i=t[e.inland.from],r=-i.seaDir[0],o=-i.seaDir[1];n.x=i.x+r*e.inland.dist,n.z=i.z+o*e.inland.dist,n.yaw=Math.atan2(-r,-o)}else if(e.summit){const i=this.cfg.mountain;let r=-1/0;for(let o=0;o<48;o++)for(let a=30;a<=140;a+=10){const l=i.x+Math.cos(o/48*Math.PI*2)*a,c=i.z+Math.sin(o/48*Math.PI*2)*a,u=this.heightAt(l,c)+(c>i.z?6:0);u>r&&(r=u,n.x=l,n.z=c)}}if(e.flat>0){let i=0,r=0;for(let o=0;o<12;o++){const a=e.flat*.6;i+=this.heightAt(n.x+Math.cos(o)*a,n.z+Math.sin(o)*a),r++}n.y=Math.max(i/r,this.sea+1.6),this.flatten(n.x,n.z,e.flat,n.y,e.summit?1.3:1.8)}n.y=this.heightAt(n.x,n.z),t[e.id]=n,this.pois.push(n)}this.poi=t}buildRoads(){for(const t of this.cfg.roads){const e=t.map(h=>typeof h=="string"?[this.poi[h].x,this.poi[h].z]:h),n=[];for(let h=0;h<e.length-1;h++){const d=e[Math.max(0,h-1)],f=e[h],m=e[h+1],g=e[Math.min(e.length-1,h+2)],x=Math.hypot(m[0]-f[0],m[1]-f[1]),p=Math.max(2,Math.ceil(x/4));for(let _=0;_<p;_++){const v=_/p,y=v*v,A=y*v,w=(E,D,M,S)=>.5*(2*D+(-E+M)*v+(2*E-5*D+4*M-S)*y+(-E+3*D-3*M+S)*A);n.push([w(d[0],f[0],m[0],g[0]),w(d[1],f[1],m[1],g[1])])}}n.push(e[e.length-1].slice());const i=n.length,r=n.map(([h,d])=>this.heightAt(h,d)),o=n.map(([h,d])=>this.sample(this.riverD,h,d)),a=new Float32Array(i);for(let h=0;h<i;h++){let d=0,f=0;for(let m=-10;m<=10;m++){const g=h+m;g<0||g>=i||o[g]<2.5||(d+=r[g],f++)}a[h]=Math.max(f?d/f:r[h],this.sea+1.2)}const l=3.2,c=7;for(let h=0;h<i-1;h++){const[d,f]=n[h],[m,g]=n[h+1],x=l+c+6;this.forEachInBox(Math.min(d,m)-x,Math.min(f,g)-x,Math.max(d,m)+x,Math.max(f,g)+x,(p,_,v)=>{const{d:y,t:A}=Gl(_,v,d,f,m,g);if(y>l+c||(this.clear[p]=Math.max(this.clear[p],1-Yt(l,l+4,y)),this.riverD[p]<2.6))return;const w=oe(a[h],a[h+1],A),E=1-Yt(l,l+c,y);this.h[p]=oe(this.h[p],w,E),this.road[p]=Math.max(this.road[p],1-Yt(l-1,l+.8,y))})}let u=null;for(let h=0;h<i;h++){const d=o[h]<2.2;if(d&&!u?u={a:h,b:h}:d&&(u.b=h),(!d||h===i-1)&&u){const f=Math.max(0,u.a-2),m=Math.min(i-1,u.b+2),[g,x]=n[f],[p,_]=n[m];this.bridges.push({x:(g+p)/2,z:(x+_)/2,yaw:Math.atan2(-(p-g),-(_-x)),length:Math.hypot(p-g,_-x)+4,y:Math.max(a[f],a[m])+.15}),u=null}}this.roads.push({pts:n,prof:a})}}computeSlope(){const t=this.n,e=this.cell;for(let n=0;n<t;n++)for(let i=0;i<t;i++){const r=this.h[this.idx(Math.max(0,i-1),n)],o=this.h[this.idx(Math.min(t-1,i+1),n)],a=this.h[this.idx(i,Math.max(0,n-1))],l=this.h[this.idx(i,Math.min(t-1,n+1))];this.slope[this.idx(i,n)]=Math.hypot(o-r,l-a)/(2*e)}}computeBiomes(){const{radius:t,plains:e}=this.cfg,n=this.noise,i=this.lake;for(let r=0;r<this.n;r++){const o=this.xOf(r);for(let a=0;a<this.n;a++){const l=this.xOf(a),c=this.idx(a,r),u=this.h[c];let h=.52+.32*n.fbm(l*.0022+11,o*.0022-4,3)-l/t*.3;h+=.45*Math.exp(-this.riverM[c]/70),h+=.35*Math.exp(-Math.max(0,Math.hypot(l-i.x,o-i.z)-i.radius)/90);const d=Math.hypot(l-e.x,o-e.z)/e.radius;h-=.5*(1-Yt(.4,1.05,d)),h-=Math.max(0,u-55)/170,h=wt(h,0,1),this.moist[c]=h;const f=this.slope[c];let m=1;const g=p=>{const _=wt(p,0,1)*m;return m-=_,_},x=u>this.sea-1?(1-Yt(1.4,3.6,u))*(this.riverD[c]>1.4?1:.3):1;this.w.beach[c]=g(x),this.w.rock[c]=g(Yt(.85,1.25,f)+Yt(170,195,u)),this.w.highland[c]=g(Yt(70,105,u)),this.w.swamp[c]=g(Yt(.7,.86,h)*(1-Yt(5,14,u))),this.w.jungle[c]=g(Yt(.4,.58,h)),this.w.grass[c]=m}}}computeDensities(){const t=this.noise,e=this.noiseB,n=this.d;for(let i=0;i<this.n;i++){const r=this.xOf(i);for(let o=0;o<this.n;o++){const a=this.xOf(o),l=this.idx(o,i),c=this.h[l],u=this.depthAt(a,r)<-.25?1:0,h=(1-this.clear[l])*(1-this.road[l])*u;if(!h)continue;const d=this.w,f=this.riverD[l],m=f<1.6?0:1,g=t.noise(a*.012+3,r*.012-8),x=e.noise(a*.03,r*.03),p=1-Yt(.65,1,this.slope[l]);n.canopy[l]=h*m*p*d.jungle[l]*wt(.75+.35*g,0,1),n.palm[l]=h*m*(d.beach[l]*Yt(.6,1.8,c)*.55+d.swamp[l]*.35+d.jungle[l]*.18+d.grass[l]*.03),n.broadleaf[l]=h*m*p*(d.grass[l]*Yt(.25,.7,g)*.45+d.jungle[l]*.25+d.highland[l]*.08),n.pine[l]=h*p*d.highland[l]*wt(.45+.5*g,0,1),n.fern[l]=h*m*(d.jungle[l]*wt(.75+.4*x,0,1)+d.swamp[l]*.25),n.bush[l]=h*(d.jungle[l]*.45+d.grass[l]*Yt(.2,.6,x)*.4+d.highland[l]*.25),n.grass[l]=h*m*(d.grass[l]*Yt(-.25,.25,g+.3*x)+d.highland[l]*.35*Yt(0,.5,x)+d.jungle[l]*.1),n.reed[l]=u*(1-this.road[l])*(d.swamp[l]*.85+(f>1.15&&f<2.6?.85:0)+(c<2.6&&d.beach[l]<.5?.2:0)),n.rock[l]=h*(d.rock[l]*.6+d.highland[l]*.12+d.beach[l]*.04+d.grass[l]*.02+d.jungle[l]*.02),n.bigleaf[l]=h*m*(d.jungle[l]*Yt(-.1,.5,x)*.6+d.swamp[l]*.3),n.log[l]=h*d.jungle[l]*.25,this.cover[l]=wt(n.fern[l]*.85+n.grass[l]*.95+n.bush[l]*.5+n.reed[l]*.85+n.bigleaf[l]*.5,0,1)}}}habitat(t,e,n){if(!this.isLand(t,e,-.2))return 0;let i=0;for(const r in n)i+=(this.w[r]?this.sample(this.w[r],t,e):0)*n[r];return i}}class Wm{constructor(t=16){this.cell=t,this.map=new Map}key(t,e){return(t+32768)*65536+(e+32768)}insert(t,e,n,i,r){const o=this.cell,a=Math.floor(e/o),l=Math.floor(i/o),c=Math.floor(n/o),u=Math.floor(r/o);for(let h=a;h<=l;h++)for(let d=c;d<=u;d++){const f=this.key(h,d);let m=this.map.get(f);m||this.map.set(f,m=[]),m.push(t)}}remove(t,e,n,i,r){const o=this.cell;for(let a=Math.floor(e/o);a<=Math.floor(i/o);a++)for(let l=Math.floor(n/o);l<=Math.floor(r/o);l++){const c=this.map.get(this.key(a,l));if(!c)continue;const u=c.indexOf(t);u>=0&&c.splice(u,1)}}cellItems(t,e){return this.map.get(this.key(t,e))}query(t,e,n,i,r=[]){const o=this.cell,a=++this._stamp||(this._stamp=1);for(let l=Math.floor(t/o);l<=Math.floor(n/o);l++)for(let c=Math.floor(e/o);c<=Math.floor(i/o);c++){const u=this.map.get(this.key(l,c));if(u)for(const h of u)h._stamp!==a&&(h._stamp=a,r.push(h))}return r}}class Xm{constructor(t){this.island=t,this.grid=new Wm(16),this._tmp=[]}addCylinder(t,e,n,i,r,o={}){const a={type:"cyl",x:t,z:e,r:n,y0:i,y1:r,tag:o.tag||"static",ref:o.ref||null,solidFor:o.solidFor};return a.minX=t-n,a.maxX=t+n,a.minZ=e-n,a.maxZ=e+n,this.grid.insert(a,a.minX,a.minZ,a.maxX,a.maxZ),a}addBox(t,e,n,i,r,o,a,l={}){const c={type:"box",x:t,z:e,hx:n,hz:i,y0:o,y1:a,cos:Math.cos(r),sin:Math.sin(r),walkable:l.walkable!==!1,tag:l.tag||"static",ref:l.ref||null},u=Math.abs(n*c.cos)+Math.abs(i*c.sin),h=Math.abs(n*c.sin)+Math.abs(i*c.cos);return c.minX=t-u,c.maxX=t+u,c.minZ=e-h,c.maxZ=e+h,this.grid.insert(c,c.minX,c.minZ,c.maxX,c.maxZ),c}remove(t){this.grid.remove(t,t.minX,t.minZ,t.maxX,t.maxZ)}toLocal(t,e,n){const i=e-t.x,r=n-t.z;return[i*t.cos-r*t.sin,i*t.sin+r*t.cos]}nearby(t,e,n){return this._tmp.length=0,this.grid.query(t-n,e-n,t+n,e+n,this._tmp)}groundAt(t,e,n=1/0){let i=this.island.heightAt(t,e);const r=this.grid.cellItems(Math.floor(t/16),Math.floor(e/16));if(!r)return i;for(const o of r){if(o.type!=="box"||!o.walkable||o.y1<=i||o.y1>n)continue;const[a,l]=this.toLocal(o,t,e);Math.abs(a)<=o.hx&&Math.abs(l)<=o.hz&&(i=o.y1)}return i}ceilingAt(t,e,n){let i=1/0;const r=this.grid.cellItems(Math.floor(t/16),Math.floor(e/16));if(!r)return i;for(const o of r){if(o.type!=="box"||o.y0<n)continue;const[a,l]=this.toLocal(o,t,e);Math.abs(a)<=o.hx&&Math.abs(l)<=o.hz&&(i=Math.min(i,o.y0))}return i}collideCircle(t,e,n,i,r){let o=!1;for(let a=0;a<2;a++){const l=this.nearby(t.x,t.z,e+2);for(const c of l)if(!(c.y1<=n||c.y0>=i)&&!(r&&!r(c)))if(c.type==="cyl"){const u=t.x-c.x,h=t.z-c.z,d=Math.hypot(u,h),f=e+c.r;if(d<f){const m=d>1e-5?(f-d)/d:0;t.x+=u*m+(d>1e-5?0:f),t.z+=h*m,o=!0}}else{const[u,h]=this.toLocal(c,t.x,t.z),d=Math.max(-c.hx,Math.min(c.hx,u)),f=Math.max(-c.hz,Math.min(c.hz,h));let m=u-d,g=h-f,x=Math.hypot(m,g),p,_;if(x>1e-5){if(x>=e)continue;const v=e-x;p=m/x*v,_=g/x*v}else{const v=c.hx-Math.abs(u),y=c.hz-Math.abs(h);v<y?(p=Math.sign(u||1)*(v+e),_=0):(p=0,_=Math.sign(h||1)*(y+e))}t.x+=p*c.cos+_*c.sin,t.z+=-p*c.sin+_*c.cos,o=!0}}return o}raycast(t,e,n,i,r,o,a,l={}){let c=null;l.statics!==!1&&(c=this.raycastStatics(t,e,n,i,r,o,a,l.ignoreTag));const u=c?c.t:a;if(l.terrain!==!1){const h=this.raycastTerrain(t,e,n,i,r,o,u);h!==null&&(!c||h<c.t)&&(c={t:h,kind:"terrain"})}return c&&(c.x=t+i*c.t,c.y=e+r*c.t,c.z=n+o*c.t),c}raycastTerrain(t,e,n,i,r,o,a){const l=this.island;let c=0,u=0,h=e-l.heightAt(t,n);if(h<0)return 0;for(;c<a;){const d=Math.max(.4,Math.min(6,h*.6));u=c,c=Math.min(a,c+d);const f=t+i*c,m=e+r*c,g=n+o*c;if(h=m-l.heightAt(f,g),h<0){let x=u,p=c;for(let _=0;_<8;_++){const v=(x+p)/2;e+r*v-l.heightAt(t+i*v,n+o*v)<0?p=v:x=v}return p}if(c>=a)break}return null}raycastStatics(t,e,n,i,r,o,a,l){let c=null;const u=this.grid.cell,h=this._rayStamp=(this._rayStamp||0)+1,d=Math.hypot(i,o),f=d>1e-4?u*.5/d:a;for(let m=0;m<=a+f;m+=f){const g=Math.min(m,a),x=t+i*g,p=n+o*g,_=this.grid.cellItems(Math.floor(x/u),Math.floor(p/u));if(_)for(const v of _){if(v._ray===h||(v._ray=h,l&&v.tag===l))continue;const y=v.type==="cyl"?qm(v,t,e,n,i,r,o):Ym(v,t,e,n,i,r,o);y!==null&&y<=a&&(!c||y<c.t)&&(c={t:y,kind:"static",collider:v})}if(c&&c.t<m||g>=a)break}return c}lineOfSight(t,e,n,i,r,o){const a=i-t,l=r-e,c=o-n,u=Math.hypot(a,l,c);return u<.01?!0:!this.raycast(t,e,n,a/u,l/u,c/u,u-.3)}}function qm(s,t,e,n,i,r,o){const a=t-s.x,l=n-s.z,c=i*i+o*o;if(c<1e-8)return null;const u=2*(a*i+l*o),h=a*a+l*l-s.r*s.r,d=u*u-4*c*h;if(d<0)return null;const f=Math.sqrt(d);let m=(-u-f)/(2*c);if(m<0&&(m=(-u+f)/(2*c)),m<0)return null;const g=e+r*m;return g<s.y0||g>s.y1?null:m}function Ym(s,t,e,n,i,r,o){const a=t-s.x,l=n-s.z,c=a*s.cos-l*s.sin,u=a*s.sin+l*s.cos,h=i*s.cos-o*s.sin,d=i*s.sin+o*s.cos;let f=-1/0,m=1/0;const g=(x,p,_,v)=>{if(Math.abs(p)<1e-9)return x>=_&&x<=v;let y=(_-x)/p,A=(v-x)/p;if(y>A){const w=y;y=A,A=w}return y>f&&(f=y),A<m&&(m=A),f<=m};return!g(c,h,-s.hx,s.hx)||!g(e,r,s.y0,s.y1)||!g(u,d,-s.hz,s.hz)||m<0?null:f>=0?f:0}function Yo(s,t){const e=document.createElement("canvas");return e.width=s,e.height=t,e}function $m(s,t,e){const n=Mr(e),i=new Float32Array(t*t);for(let o=0;o<i.length;o++)i[o]=n();const r=new Float32Array(s*s);for(let o=0;o<s;o++)for(let a=0;a<s;a++){const l=a/s*t,c=o/s*t,u=Math.floor(l),h=Math.floor(c),d=l-u,f=c-h,m=d*d*(3-2*d),g=f*f*(3-2*f),x=i[h%t*t+u%t],p=i[h%t*t+(u+1)%t],_=i[(h+1)%t*t+u%t],v=i[(h+1)%t*t+(u+1)%t];r[o*s+a]=(x+(p-x)*m)*(1-g)+(_+(v-_)*m)*g}return r}function ln(s,t,e=4,n=4){const i=new Float32Array(s*s);let r=1,o=0;for(let a=0;a<e;a++){const l=$m(s,n<<a,t+a*31);for(let c=0;c<i.length;c++)i[c]+=l[c]*r;o+=r,r*=.5}for(let a=0;a<i.length;a++)i[a]/=o;return i}function ei(s,{repeat:t=!0,srgb:e=!0}={}){const n=new vr(s);return t&&(n.wrapS=n.wrapT=ir),e&&(n.colorSpace=me),n.anisotropy=4,n.needsUpdate=!0,n}function ns(s,t){const e=Yo(s,s),n=e.getContext("2d"),i=n.createImageData(s,s);for(let r=0;r<s;r++)for(let o=0;o<s;o++){const[a,l,c]=t(o,r,r*s+o),u=(r*s+o)*4;i.data[u]=a,i.data[u+1]=l,i.data[u+2]=c,i.data[u+3]=255}return n.putImageData(i,0,0),e}const co=new Map;function yi(s,t){return co.has(s)||co.set(s,t()),co.get(s)}function jm(){return yi("terrain",()=>{const t=ln(256,11,5,4),e=ln(256,23,2,32);return ei(ns(256,(n,i,r)=>{const o=.78+.22*t[r]+(e[r]-.5)*.18,a=Math.max(0,Math.min(255,o*255));return[a,a,a*.98]}))})}function Km(){return yi("concrete",()=>{const t=ln(256,5,5,4),e=ln(256,9,3,2);return ei(ns(256,(n,i,r)=>{let o=150+50*(t[r]-.5)-Math.max(0,e[r]-.55)*160;o-=Math.max(0,Math.sin(n*.11+t[r]*4)-.85)*120*(1-i/256);const a=Math.max(0,t[r]-.62)*260;return[o-a*.4,o+a*.1,o-a*.5]}))})}function Yl(s=[120,92,62]){return yi("planks"+s.join(),()=>{const e=ln(256,7,4,4),n=ln(256,17,2,64);return ei(ns(256,(i,r,o)=>{const a=Math.floor(r/32),l=r%32<2?.45:1,c=.75+.25*(a*37%7)/7,u=(.7+.3*e[o])*c*l*(.85+.3*n[(r*256+i*4%256)%n.length]);return[s[0]*u,s[1]*u,s[2]*u]}))})}function $l(s=[150,150,140]){return yi("corr"+s.join(),()=>{const e=ln(256,3,5,4),n=ln(256,41,4,8);return ei(ns(256,(i,r,o)=>{const a=.8+.2*Math.sin(i/256*Math.PI*2*16),l=Math.max(0,n[o]-.45)*2.2,c=a*(.75+.25*e[o]);return[(s[0]*(1-l)+150*l)*c,(s[1]*(1-l)+70*l)*c,(s[2]*(1-l)+35*l)*c]}))})}function Vi(s=[200,120,40]){return yi("paint"+s.join(),()=>{const e=ln(128,13,4,4),n=ln(128,29,4,8);return ei(ns(128,(i,r,o)=>{const a=n[o]>.62?1:0,l=.8+.2*e[o];return a?[110*l,60*l,30*l]:[s[0]*l,s[1]*l,s[2]*l]}))})}function Zm(){return yi("dot",()=>{const s=Yo(64,64),t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.4,"rgba(255,255,255,0.5)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),ei(s,{repeat:!1})})}function Jm(s,{bg:t="#6b5236",fg:e="#efe6c8",w:n=512,h:i=256}={}){const r=Yo(n,i),o=r.getContext("2d");o.fillStyle=t,o.fillRect(0,0,n,i);const a=Mr(s.join("").length*977);for(let c=0;c<400;c++)o.fillStyle=`rgba(0,0,0,${a()*.15})`,o.fillRect(a()*n,a()*i,a()*40,2);o.fillStyle=e,o.textAlign="center",o.textBaseline="middle";const l=Math.floor(i/(s.length+1));o.font=`bold ${l}px "Trebuchet MS", sans-serif`,s.forEach((c,u)=>o.fillText(c,n/2,i/(s.length+1)*(u+1)));for(let c=0;c<60;c++)o.fillStyle=`rgba(40,30,20,${a()*.35})`,o.beginPath(),o.arc(a()*n,a()*i,a()*14,0,Math.PI*2),o.fill();return ei(r,{repeat:!1})}function Qm(s,t,e){return yi("skin"+e,()=>{const i=ln(256,e,4,4),r=ln(256,e+3,2,32),o=new rt(s.dorsal),a=new rt(s.belly),l=new rt(s.stripe),c=f=>[f.r*255,f.g*255,f.b*255];o.convertLinearToSRGB(),a.convertLinearToSRGB(),l.convertLinearToSRGB();const u=c(o),h=c(a),d=c(l);return ei(ns(256,(f,m,g)=>{if(m<256*.05)return[255,255,255];const x=f/256,p=1-m/256,_=Math.abs(x-.5)*2,v=1-Math.min(1,Math.max(0,(_-.25)/.35));let y=[0,1,2].map(E=>u[E]*(1-v)+h[E]*v),A=0;t==="stripes"?A=Math.sin(p*70+i[g]*6)>.35?1:0:t==="bands"?A=Math.sin(p*34+i[g]*3)>.55?1:0:t==="spots"?A=r[g]>.62?1:0:A=i[g]>.6?.7:0,A*=Math.max(0,_-.3)*1.4,y=y.map((E,D)=>E*(1-A)+d[D]*A);const w=.88+.24*r[g];return y.map(E=>Math.min(255,E*w))}))})}const ho=8,Ze={sand:new rt("#d8c690"),wetSand:new rt("#a89868"),grass:new rt("#7d9a3c"),dryGrass:new rt("#a8a457"),jungle:new rt("#3f5a22"),jungleDark:new rt("#2e3f1a"),swamp:new rt("#4a5230"),highland:new rt("#7c8450"),rock:new rt("#7d776c"),rockDark:new rt("#5a554d"),road:new rt("#8a6e4a"),mud:new rt("#5a4a34"),seabed:new rt("#c2b37f")};function tg(s){const t=new ge;t.name="terrain";const e=new Ge({vertexColors:!0,map:jm()}),n=s.n,i=s.seg/ho,r=ng(s),o=eg(s);for(let a=0;a<ho;a++)for(let l=0;l<ho;l++){const c=l*i,u=a*i,h=i+1,d=new Float32Array(h*h*3),f=new Float32Array(h*h*3),m=new Float32Array(h*h*3),g=new Float32Array(h*h*2);let x=0;for(let A=0;A<h;A++)for(let w=0;w<h;w++){const E=c+w,D=u+A,M=D*n+E,S=s.xOf(E),H=s.xOf(D);d[x*3]=S,d[x*3+1]=s.h[M],d[x*3+2]=H,f[x*3]=o[M*3],f[x*3+1]=o[M*3+1],f[x*3+2]=o[M*3+2],m[x*3]=r[M*3],m[x*3+1]=r[M*3+1],m[x*3+2]=r[M*3+2],g[x*2]=S/9,g[x*2+1]=H/9,x++}const p=new Uint32Array(i*i*6);let _=0;for(let A=0;A<i;A++)for(let w=0;w<i;w++){const E=A*h+w,D=(A+1)*h+w,M=A*h+w+1,S=(A+1)*h+w+1;p[_++]=E,p[_++]=D,p[_++]=M,p[_++]=D,p[_++]=S,p[_++]=M}const v=new ye;v.setAttribute("position",new he(d,3)),v.setAttribute("normal",new he(f,3)),v.setAttribute("color",new he(m,3)),v.setAttribute("uv",new he(g,2)),v.setIndex(new he(p,1)),v.computeBoundingSphere();const y=new _t(v,e);y.receiveShadow=!0,y.matrixAutoUpdate=!1,t.add(y)}return t}function eg(s){const t=s.n,e=new Float32Array(t*t*3),n=s.cell;for(let i=0;i<t;i++)for(let r=0;r<t;r++){const o=s.h[i*t+Math.max(0,r-1)],a=s.h[i*t+Math.min(t-1,r+1)],l=s.h[Math.max(0,i-1)*t+r],c=s.h[Math.min(t-1,i+1)*t+r],u=o-a,h=l-c,d=2*n,f=Math.hypot(u,d,h),m=(i*t+r)*3;e[m]=u/f,e[m+1]=d/f,e[m+2]=h/f}return e}function ng(s){const t=s.n,e=new Float32Array(t*t*3),n=new rt,i=new rt,r=s.noise;for(let o=0;o<t;o++){const a=s.xOf(o);for(let l=0;l<t;l++){const c=s.xOf(l),u=o*t+l,h=s.h[u],d=s.w,f=r.noise(c*.05,a*.05)*.5+r.noise(c*.21,a*.21)*.5;i.setRGB(0,0,0);const m=(y,A)=>{A<=0||(i.r+=y.r*A,i.g+=y.g*A,i.b+=y.b*A)},g=wt(s.moist[u]*1.4-.2+f*.15,0,1);n.copy(Ze.dryGrass).lerp(Ze.grass,g),m(n,d.grass[u]),n.copy(Ze.jungle).lerp(Ze.jungleDark,wt(.5+f*.6,0,1)),m(n,d.jungle[u]),m(Ze.swamp,d.swamp[u]),m(Ze.highland,d.highland[u]),n.copy(Ze.rock).lerp(Ze.rockDark,wt(.5+f,0,1)),m(n,d.rock[u]),n.copy(Ze.sand).lerp(Ze.wetSand,1-Yt(.2,1.4,h)),m(n,d.beach[u]);const x=s.riverD[u];x<2.2&&i.lerp(Ze.mud,(1-Yt(1,2.2,x))*.8);const p=s.road[u];p>0&&(n.copy(Ze.road).multiplyScalar(.9+f*.12),i.lerp(n,p*.92));const _=s.waterAt(c,a)-h;_>0&&i.lerp(Ze.seabed,wt(_/3,0,.85)).multiplyScalar(1-wt(_/30,0,.5));const v=1+f*.07;e[u*3]=i.r*v*1.12,e[u*3+1]=i.g*v*1.12,e[u*3+2]=i.b*v*1.12}}return e}function ig(s){const t=s.n,e=new Uint8Array(t*t);for(let i=0;i<t*t;i++){const r=Math.max(s.sea,s.water[i]),o=wt(r-s.h[i],-2,14);e[i]=Math.round((o+2)/16*255)}const n=new Gc(e,t,t,mc,Pn);return n.magFilter=We,n.minFilter=We,n.wrapS=n.wrapT=sn,n.needsUpdate=!0,n}function sg(s){const t=new ge;t.name="water";const e={uTime:{value:0},uDepth:{value:ig(s)},uHalf:{value:s.half},uCell:{value:s.cell},uN:{value:s.n}},n=new _s({color:16777215,specular:10135728,shininess:120,transparent:!0,depthWrite:!1});n.onBeforeCompile=o=>{Object.assign(o.uniforms,e),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
         uniform float uTime;
         varying vec3 vWorldPos;`).replace("#include <begin_vertex>",`#include <begin_vertex>
         vec4 wp0 = modelMatrix * vec4(transformed, 1.0);
         transformed.y += sin(wp0.x * 0.08 + uTime * 1.1) * 0.06 + cos(wp0.z * 0.11 + uTime * 0.9) * 0.05;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
         vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
         uniform float uTime;
         uniform sampler2D uDepth;
         uniform float uHalf;
         uniform float uCell;
         uniform float uN;
         varying vec3 vWorldPos;
         float wHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
         float wNoise(vec2 p) {
           vec2 i = floor(p); vec2 f = fract(p);
           f = f * f * (3.0 - 2.0 * f);
           return mix(mix(wHash(i), wHash(i + vec2(1, 0)), f.x), mix(wHash(i + vec2(0, 1)), wHash(i + vec2(1, 1)), f.x), f.y);
         }`).replace("vec4 diffuseColor = vec4( diffuse, opacity );",`vec2 duv = ((vWorldPos.xz + uHalf) / uCell + 0.5) / uN;
         float depth = texture2D(uDepth, duv).r * 16.0 - 2.0;
         if (duv.x < 0.0 || duv.y < 0.0 || duv.x > 1.0 || duv.y > 1.0) depth = 14.0;
         vec3 shallow = vec3(0.16, 0.62, 0.58);
         vec3 mid = vec3(0.05, 0.36, 0.42);
         vec3 deep = vec3(0.02, 0.13, 0.24);
         vec3 wc = mix(shallow, mid, smoothstep(0.3, 3.5, depth));
         wc = mix(wc, deep, smoothstep(3.5, 13.0, depth));
         float n1 = wNoise(vWorldPos.xz * 0.35 + vec2(uTime * 0.25, uTime * 0.18));
         float n2 = wNoise(vWorldPos.xz * 0.9 - vec2(uTime * 0.31, 0.0));
         float foamBand = 1.0 - smoothstep(0.0, 0.4, depth + (n1 - 0.5) * 0.25);
         float foam = foamBand * smoothstep(0.35, 0.65, n2 + 0.25 * sin(depth * 9.0 - uTime * 2.2));
         wc = mix(wc, vec3(0.92, 0.95, 0.93), clamp(foam, 0.0, 1.0) * 0.7);
         float alpha = mix(0.35, 0.93, smoothstep(0.0, 2.6, depth));
         alpha = max(alpha, foam * 0.75);
         vec4 diffuseColor = vec4(wc, alpha);`).replace("#include <normal_fragment_begin>",`#include <normal_fragment_begin>
         float wa = uTime * 1.3;
         vec3 wpert = vec3(
           sin(vWorldPos.x * 0.7 + wa) * 0.5 + sin(vWorldPos.z * 1.9 - wa * 1.4) * 0.35 + (wNoise(vWorldPos.xz * 1.6 + wa * 0.3) - 0.5) * 0.6,
           0.0,
           cos(vWorldPos.z * 0.8 + wa * 0.8) * 0.5 + sin(vWorldPos.x * 1.7 + wa * 1.1) * 0.35 + (wNoise(vWorldPos.zx * 1.4 - wa * 0.2) - 0.5) * 0.6
         ) * 0.09;
         normal = normalize(normal + (viewMatrix * vec4(wpert, 0.0)).xyz);`)};const i=new _t(new Qn(16e3,16e3,64,64).rotateX(-Math.PI/2),n);i.position.y=s.sea,i.renderOrder=2,t.add(i);const r=rg(s);if(r){const o=new _t(r,n);o.renderOrder=2,t.add(o)}return{group:t,uniforms:e}}function rg(s){const t=s.n,e=s.water,n=s.sea,i=h=>e[h]>n+.01,r=new Int32Array(t*t).fill(-1),o=[],a=[],l=(h,d)=>{const f=d*t+h;if(r[f]>=0)return r[f];let m=e[f];if(!i(f)){let g=0,x=0;for(let p=-1;p<=1;p++)for(let _=-1;_<=1;_++){const v=h+_,y=d+p;if(v<0||y<0||v>=t||y>=t)continue;const A=y*t+v;i(A)&&(g+=e[A],x++)}m=x?g/x:s.h[f]}return r[f]=o.length/3,o.push(s.xOf(h),m,s.xOf(d)),r[f]};for(let h=0;h<t-1;h++)for(let d=0;d<t-1;d++){const f=h*t+d;if(!(i(f)||i(f+1)||i(f+t)||i(f+t+1)))continue;const m=l(d,h),g=l(d,h+1),x=l(d+1,h),p=l(d+1,h+1);a.push(m,g,x,g,p,x)}if(!a.length)return null;const c=new ye;c.setAttribute("position",new $t(o,3)),c.setIndex(a);const u=new Float32Array(o.length);for(let h=1;h<u.length;h+=3)u[h]=1;return c.setAttribute("normal",new he(u,3)),c.computeBoundingSphere(),c}const gn=[{e:-12,top:"#05070f",hor:"#0b1222",sun:"#203050",sunI:0,hemi:.18,fog:"#0a1020"},{e:-4,top:"#141a33",hor:"#3a3048",sun:"#ff7040",sunI:0,hemi:.3,fog:"#2a2638"},{e:3,top:"#3a5a8a",hor:"#f0a060",sun:"#ff9a50",sunI:1.1,hemi:.65,fog:"#c09070"},{e:12,top:"#4a7ab8",hor:"#e8c8a0",sun:"#ffd8a0",sunI:2.2,hemi:.9,fog:"#b8c0b0"},{e:30,top:"#3f78c4",hor:"#bcd4e0",sun:"#fff2dc",sunI:2.8,hemi:1.05,fog:"#b4c8cc"},{e:90,top:"#3570c0",hor:"#b0cce0",sun:"#ffffff",sunI:3,hemi:1.1,fog:"#aac0cc"}];for(const s of gn)for(const t of["top","hor","sun","fog"])s[t]=new rt(s[t]);class og{constructor(t,{hours:e=7.5,dayMinutes:n=28}={}){this.hours=e,this.rate=24/(n*60),this.light=1,this.sunDir=new L(0,1,0),this.scene=t,this.uniforms={uTop:{value:new rt},uHor:{value:new rt},uSunDir:{value:this.sunDir},uSunCol:{value:new rt},uTime:{value:0},uNight:{value:0}};const i=new _t(new an(1e3,32,16),new Un({uniforms:this.uniforms,side:Be,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:`
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            vec4 p = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * p;
          }`,fragmentShader:`
          uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uSunDir; uniform vec3 uSunCol;
          uniform float uTime; uniform float uNight;
          varying vec3 vDir;
          float h(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5); }
          float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
            return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
          float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * n(p); p *= 2.03; a *= 0.5; } return s; }
          void main() {
            vec3 d = normalize(vDir);
            float y = d.y;
            vec3 col = mix(uHor, uTop, pow(clamp(y, 0.0, 1.0), 0.55));
            col = mix(col, uHor * 0.75, smoothstep(0.0, -0.25, y));
            float sd = max(dot(d, normalize(uSunDir)), 0.0);
            col += uSunCol * (pow(sd, 900.0) * 6.0 + pow(sd, 12.0) * 0.35 + pow(sd, 3.0) * 0.08);
            // clouds on a plane above the island
            if (y > 0.02) {
              vec2 cp = d.xz / (y + 0.08) * 1.6 + vec2(uTime * 0.004, uTime * 0.0025);
              float c = smoothstep(0.5, 0.78, fbm(cp));
              vec3 cc = mix(uHor * 1.05 + uSunCol * 0.15, vec3(1.0), 0.55) * (1.0 - uNight * 0.85);
              col = mix(col, cc, c * smoothstep(0.02, 0.25, y) * 0.85);
            }
            // stars
            if (uNight > 0.01 && y > 0.0) {
              vec2 sp = d.xz / (y + 0.3) * 160.0;
              float st = step(0.997, h(floor(sp)));
              col += vec3(st) * uNight * smoothstep(0.05, 0.4, y);
            }
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`}));i.renderOrder=-10,i.frustumCulled=!1,this.dome=i,t.add(i),this.sun=new Ro(16777215,2.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048);const r=this.sun.shadow.camera;r.left=-75,r.right=75,r.top=75,r.bottom=-75,r.near=1,r.far=600,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.6,t.add(this.sun),t.add(this.sun.target),this.moon=new Ro(8425664,0),t.add(this.moon),this.hemi=new Wc(12572927,4870192,1),t.add(this.hemi),t.fog=new Ho(11190476,.0022),this.baseFog=.0022,this.fogBoost=0,this.update(0,new L)}setShadowSize(t){if(!t){this.sun.castShadow=!1;return}this.sun.castShadow=!0,this.sun.shadow.mapSize.x!==t&&(this.sun.shadow.mapSize.set(t,t),this.sun.shadow.map&&(this.sun.shadow.map.dispose(),this.sun.shadow.map=null))}update(t,e,n={}){this.hours=(this.hours+t*this.rate)%24,this.uniforms.uTime.value+=t;const i=(this.hours-6)/12*Math.PI,r=Math.sin(i)*68,o=i,a=r*Math.PI/180;this.sunDir.set(Math.cos(o)*Math.cos(a),Math.sin(a),.35*Math.cos(a)).normalize();let l=gn[0],c=gn[gn.length-1];for(let g=0;g<gn.length-1;g++)if(r>=gn[g].e&&r<=gn[g+1].e){l=gn[g],c=gn[g+1];break}r<gn[0].e&&(c=l);const u=l===c?0:wt((r-l.e)/(c.e-l.e),0,1),h=this.uniforms;h.uTop.value.copy(l.top).lerp(c.top,u),h.uHor.value.copy(l.hor).lerp(c.hor,u),h.uSunCol.value.copy(l.sun).lerp(c.sun,u),h.uNight.value=1-Yt(-10,2,r),this.light=wt(Yt(-8,10,r)*.85+.15,.15,1),this.sun.color.copy(h.uSunCol.value),this.sun.intensity=oe(l.sunI,c.sunI,u),this.hemi.intensity=oe(l.hemi,c.hemi,u),this.hemi.color.copy(h.uTop.value).lerp(new rt(1,1,1),.45),this.hemi.groundColor.setRGB(.2,.22,.12).multiplyScalar(.5+this.light*.5),this.moon.intensity=h.uNight.value*.35,this.moon.position.set(-this.sunDir.x,Math.abs(this.sunDir.y)+.4,-this.sunDir.z).multiplyScalar(200);const d=new rt().copy(l.fog).lerp(c.fog,u);this.scene.fog.color.copy(d);const f=n.altitude||0,m=this.baseFog*(1+this.fogBoost*1.6)*oe(1,.45,Yt(20,160,f));if(this.scene.fog.density=oe(this.scene.fog.density,m,Math.min(1,t*1.5)),e){const g=this.sun.shadow.camera.right*2/this.sun.shadow.mapSize.x,x=Math.round(e.x/g)*g,p=Math.round(e.z/g)*g,_=this.sunDir.y>.05?this.sunDir:new L(.3,1,.2).normalize();this.sun.position.set(x+_.x*250,e.y+_.y*250,p+_.z*250),this.sun.target.position.set(x,e.y,p),this.sun.target.updateMatrixWorld(),this.dome.position.copy(n.camera||e)}}isNight(){return this.light<.4}}class pn{constructor(){this.pos=[],this.col=[],this.sway=[]}tri(t,e,n,i,r=0,o=r,a=r){this.pos.push(...t,...e,...n);const l=Array.isArray(i)?i:[i,i,i];for(const c of l)this.col.push(c.r,c.g,c.b);this.sway.push(r,o,a)}quad(t,e,n,i,r,o=0,a=o,l=o,c=o){const u=Array.isArray(r)?r:[r,r,r,r];this.tri(t,e,n,[u[0],u[1],u[2]],o,a,l),this.tri(t,n,i,[u[0],u[2],u[3]],o,l,c)}add(t,e,n,i=()=>0){const r=t.index?t.toNonIndexed():t;r.applyMatrix4(e);const o=r.attributes.position.array,a=new L,l=new L,c=new L,u=new L;for(let h=0;h<o.length;h+=9){a.set(o[h],o[h+1],o[h+2]),l.set(o[h+3],o[h+4],o[h+5]),c.set(o[h+6],o[h+7],o[h+8]),u.subVectors(c,l).cross(l.clone().sub(a)).normalize().negate();const d=typeof n=="function"?n(u.x,u.y,u.z,(a.x+l.x+c.x)/3,(a.y+l.y+c.y)/3,(a.z+l.z+c.z)/3):n;this.tri([a.x,a.y,a.z],[l.x,l.y,l.z],[c.x,c.y,c.z],d,i(a.x,a.y,a.z),i(l.x,l.y,l.z),i(c.x,c.y,c.z))}r!==t&&r.dispose(),t.dispose()}build(){const t=new ye;return t.setAttribute("position",new $t(this.pos,3)),t.setAttribute("color",new $t(this.col,3)),t.setAttribute("aSway",new $t(this.sway,1)),t.computeVertexNormals(),t.computeBoundingSphere(),t}}new At;const Co=new jn,fs=new Zn,Po=new L,Lo=new L;function Qe(s,t,e,n=0,i=0,r=0,o=1,a=o,l=o){return new At().compose(Po.set(s,t,e),Co.setFromEuler(fs.set(n,i,r)),Lo.set(o,a,l))}function xe(s,t,e=.08){const n=new rt(s),i=1+(t.next()*2-1)*e;return n.multiplyScalar(i)}function br(s,t,e){const n=s.attributes.position,i=new Map;for(let r=0;r<n.count;r++){const o=`${n.getX(r).toFixed(3)},${n.getY(r).toFixed(3)},${n.getZ(r).toFixed(3)}`;let a=i.get(o);a||i.set(o,a=[(t.next()-.5)*e,(t.next()-.5)*e,(t.next()-.5)*e]),n.setXYZ(r,n.getX(r)+a[0],n.getY(r)+a[1],n.getZ(r)+a[2])}return s}function $o(s,t,e,n,i,r,o,a,l,c,u=0,h=1){const d=-n,f=e;let m=null;for(let g=0;g<=r;g++){const x=g/r,p=t[0]+e*i*x,_=t[2]+n*i*x,v=t[1]+o(x),y=a(x),A=l.clone().lerp(c,x),w={l:[p+d*y,v-u*y,_+f*y],m:[p,v,_],r:[p-d*y,v-u*y,_-f*y],c:A,sw:x*h};m&&(u?(s.quad(m.l,w.l,w.m,m.m,[m.c,w.c,w.c,m.c],m.sw,w.sw,w.sw,m.sw),s.quad(m.m,w.m,w.r,m.r,[m.c,w.c,w.c,m.c],m.sw,w.sw,w.sw,m.sw)):s.quad(m.l,w.l,w.r,m.r,[m.c,w.c,w.c,m.c],m.sw,w.sw,w.sw,m.sw)),m=w}}function ag(s,t){const e=new pn,n=s.range(14,20),i=s.range(-.8,.8),r=new rt("#5c4c3a");if(t<2){const a=new Qt(.3,.55,n*.8,t?5:7,t?1:4,!0);a.translate(0,n*.4,0);const l=a.attributes.position;for(let c=0;c<l.count;c++)l.setX(c,l.getX(c)+Math.sin(l.getY(c)/n*Math.PI)*i);if(e.add(a,new At,(c,u,h,d,f)=>xe("#5c4c3a",s,.1).lerp(new rt("#7a6a52"),f/n)),!t){for(let c=0;c<4;c++){const u=c/4*Math.PI*2+s.range(-.3,.3),h=new Ye(.14,2.4,1.5);h.translate(0,1,.75),e.add(h,Qe(0,0,0,-.18,u,0),r.clone().multiplyScalar(.85))}for(let c=0;c<3;c++){const u=s.range(0,Math.PI*2),h=new Qt(.08,.16,3.6,4,1,!0);h.translate(0,1.8,0),e.add(h,Qe(Math.sin(.65*Math.PI)*i,n*s.range(.55,.72),0,.95,u,0),r)}}}else{const a=new Qt(.35,.5,n*.75,4,1,!0);a.translate(0,n*.375,0),e.add(a,new At,r)}const o=t===2?2:t?3:5;for(let a=0;a<o;a++){const l=s.range(2.6,4.2)*(t===2?1.25:1),c=a/o*Math.PI*2+s.range(0,1),u=a===0?0:s.range(1.8,3.2),h=br(new ti(l,t?0:1),s,.6),d=n*s.range(.8,.95);e.add(h,Qe(Math.cos(c)*u+i*.3,d,Math.sin(c)*u,0,s.range(0,3),0,1,s.range(.5,.65),1),(f,m)=>xe(m>.3?"#3f7a2a":"#2c5a20",s,.12),(f,m)=>Math.max(0,(m-n*.7)/(n*.3))*.3)}if(!t)for(let a=0;a<5;a++){const l=s.range(0,Math.PI*2),c=s.range(1.5,3.4),u=Math.cos(l)*c,h=Math.sin(l)*c,d=n*.78,f=s.range(4,9),m=.07,g=xe("#3d5f22",s);e.quad([u-m,d-f,h],[u+m,d-f,h],[u+m,d,h],[u-m,d,h],g,.7,.7,.2,.2)}return{geo:e.build(),r:.55,h:n}}function lg(s,t){const e=new pn,n=s.range(6,10),i=s.range(.12,.4),r=t===2?2:t?4:8,o=c=>[i*n*c*c,n*c,0];for(let c=0;c<r;c++){const u=o(c/r),h=o((c+1)/r),d=h[0]-u[0],f=h[1]-u[1],m=Math.hypot(d,f),g=new Qt(.17,.2,m,t?4:6,1,!0);g.translate(0,m/2,0),e.add(g,Qe(u[0],u[1],0,0,0,-Math.atan2(d,f)),xe(c%2?"#8a7550":"#6e5c40",s,.05),()=>c/r*.15)}const a=o(1),l=t===2?5:t?7:10;for(let c=0;c<l;c++){const u=c/l*Math.PI*2+s.range(-.2,.2),h=s.range(3.2,4.4),d=s.range(1.8,2.8);$o(e,a,Math.cos(u),Math.sin(u),h,t===2?2:t?3:6,f=>h*(.45*f)-d*f*f,f=>.6*Math.pow(Math.sin(Math.PI*Math.min(1,f*.9+.08)),.7)+.04,xe("#4a7f2a",s,.1),xe("#79a845",s,.1),t?0:.35,1)}if(!t)for(let c=0;c<3;c++){const u=c/3*Math.PI*2;e.add(new ti(.16,0),Qe(a[0]+Math.cos(u)*.25,a[1]-.25,Math.sin(u)*.25),xe("#4a3a1a",s))}return{geo:e.build(),r:.28,h:n}}function cg(s,t,e){const n=new pn,i=e===1,r=i?s.range(5,7):s.range(6,9),o=new Qt(.16,.3,r*.7,t?4:6,1,!0);o.translate(0,r*.35,0),n.add(o,new At,xe("#5e4e3c",s));const a=t===2?1:t?2:4;for(let l=0;l<a;l++){const c=(i?s.range(2.6,3.4):s.range(1.8,2.6))*(t===2?1.4:1),u=s.range(0,Math.PI*2),h=l?s.range(1,2):0,d=br(new ti(c,t?0:1),s,.4);n.add(d,Qe(Math.cos(u)*h,r*(i?.88:.78)+(l?s.range(-.6,.8):0),Math.sin(u)*h,0,u,0,1,i?.32:.75,1),(f,m)=>xe(m>.2?i?"#6f8a3a":"#4f8034":i?"#4e6a2a":"#365e26",s,.1),(f,m)=>Math.max(0,m/r-.6)*.5)}return{geo:n.build(),r:.3,h:r}}function hg(s,t){const e=new pn,n=s.range(7,12),i=new Qt(.12,.25,n,5,1,!0);i.translate(0,n/2,0),e.add(i,new At,xe("#4e3e30",s));const r=t===2?2:t?3:5;for(let o=0;o<r;o++){const a=o/r,l=2.4*(1-a*.75),c=new Te(l,n*.38,t?5:7,1,!0);e.add(c,Qe(0,n*(.3+a*.62),0,0,s.range(0,3),0),(u,h)=>xe(h>.4?"#36583a":"#24402a",s,.08),(u,h)=>h/n*.25)}return{geo:e.build(),r:.28,h:n}}function ug(s,t){const e=new pn,n=new ti(1,t?0:1);return br(n,s,.45),e.add(n,Qe(0,.25,0,s.range(0,3),s.range(0,3),0,s.range(1.1,1.6),s.range(.6,.9),s.range(.9,1.3)),(i,r)=>r>.55?xe("#5e6a3c",s,.12):xe("#7a766c",s,.12)),{geo:e.build(),r:1.1,h:1.2}}function dg(s){const t=new pn,e=s.int(7,10),n=s.range(.8,1.35);for(let i=0;i<e;i++){const r=i/e*Math.PI*2+s.range(-.2,.2),o=n*s.range(.9,1.25),a=s.range(.7,1);$o(t,[0,.02,0],Math.cos(r),Math.sin(r),o,3,l=>o*(a*l-.8*l*l),l=>.17*Math.sin(Math.PI*l)+.02,xe("#2f6a26",s,.1),xe("#5ea845",s,.1),0,1)}return{geo:t.build()}}function fg(s){const t=new pn,e=s.int(2,3);for(let n=0;n<e;n++){const i=s.range(.55,.95),r=br(new ti(i,0),s,.3);t.add(r,Qe(s.range(-.5,.5),i*.7,s.range(-.5,.5),0,s.range(0,3),0,1,.8,1),(o,a)=>xe(a>.3?"#4a7432":"#30522a",s,.1),(o,a)=>a*.3)}return{geo:t.build()}}function pg(s){const t=new pn,e=s.int(12,18),n=s.range(.75,1.35),i=new rt("#5d6e2a"),r=new rt(s.chance(.5)?"#c2bc62":"#a8b452");for(let o=0;o<e;o++){const a=s.range(0,Math.PI*2),l=s.range(0,.35),c=Math.cos(a)*l,u=Math.sin(a)*l,h=n*s.range(.7,1.1),d=s.range(.1,.4),f=.05,m=-Math.sin(a)*f,g=Math.cos(a)*f;t.tri([c-m,0,u-g],[c+m,0,u+g],[c+Math.cos(a)*d,h,u+Math.sin(a)*d],[i,i,r.clone().multiplyScalar(s.range(.85,1.1))],0,0,1)}return{geo:t.build()}}function mg(s){const t=new pn,e=s.int(9,14),n=new rt("#4a5a26"),i=new rt("#8a9a48");for(let r=0;r<e;r++){const o=s.range(-.35,.35),a=s.range(-.35,.35),l=s.range(1.4,2.3),c=.035,u=s.range(-.15,.15),h=s.range(-.15,.15);if(t.tri([o-c,0,a],[o+c,0,a],[o+u,l,a+h],[n,n,i],0,0,1),t.tri([o,0,a-c],[o,0,a+c],[o+u,l,a+h],[n,n,i],0,0,1),r<3){const d=new Qt(.04,.04,.26,4);t.add(d,Qe(o+u*.9,l*.9,a+h*.9),new rt("#4a3420"),()=>.9)}}return{geo:t.build()}}function gg(s){const t=new pn,e=s.int(4,7);for(let n=0;n<e;n++){const i=n/e*Math.PI*2+s.range(-.3,.3),r=s.range(.7,1.6),o=s.range(.2,.5),a=Math.cos(i)*o,l=Math.sin(i)*o,c=new Qt(.02,.035,r,3,1,!0);c.translate(0,r/2,0),t.add(c,Qe(0,0,0,Math.sin(i)*.3,0,-Math.cos(i)*.3),new rt("#4a7a30"),(h,d)=>d/r);const u=s.range(.8,1.3);$o(t,[a,r,l],Math.cos(i),Math.sin(i),u,3,h=>u*(.15*h-.55*h*h),h=>.4*Math.sin(Math.PI*Math.pow(h,.8))+.01,xe("#2a6a24",s,.1),xe("#3f8a30",s,.1),.25,1)}return{geo:t.build()}}function xg(s){const t=new pn,e=s.range(3.5,7),n=s.range(.25,.45),i=new Qt(n*.85,n,e,6,1);t.add(i,Qe(0,n*.7,0,0,0,Math.PI/2),(o,a)=>a>.5?xe("#4f6030",s,.1):xe("#5a4834",s,.1));const r=new Qt(.06,.12,1.2,4,1,!0);return t.add(r,Qe(e*.2,n+.4,0,0,0,.5),xe("#5a4834",s)),{geo:t.build()}}const Oi={canopy:{builder:ag,tier:"big",spacing:8.5,scale:[.8,1.25],sink:.4,variants:2,shadow:!0},palm:{builder:lg,tier:"big",spacing:9.5,scale:[.85,1.2],sink:.2,variants:2,shadow:!0},broadleaf:{builder:cg,tier:"big",spacing:13,scale:[.8,1.25],sink:.2,variants:2,shadow:!0},pine:{builder:hg,tier:"big",spacing:9,scale:[.8,1.3],sink:.2,variants:2,shadow:!0},rock:{builder:ug,tier:"big",spacing:15,scale:[.6,2.6],sink:.35,variants:2,shadow:!0,tilt:!0},fern:{builder:dg,tier:"small",spacing:2.3,scale:[.75,1.3],sink:0,variants:2},bigleaf:{builder:gg,tier:"small",spacing:3.2,scale:[.8,1.4],sink:0,variants:2},bush:{builder:fg,tier:"small",spacing:4.2,scale:[.7,1.4],sink:.1,variants:2},grass:{builder:pg,tier:"small",spacing:1.6,scale:[.8,1.2],sink:0,variants:3},reed:{builder:mg,tier:"small",spacing:1.7,scale:[.8,1.2],sink:0,variants:2},log:{builder:xg,tier:"small",spacing:14,scale:[.8,1.2],sink:.15,variants:2}};function vg(s){const t=new Ge({vertexColors:!0,side:qe});return t.onBeforeCompile=e=>{e.uniforms.uTime=s.uTime,e.uniforms.uWind=s.uWind,e.uniforms.uPush=s.uPush,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
         attribute float aSway;
         uniform float uTime;
         uniform float uWind;
         uniform vec4 uPush;`).replace("#include <begin_vertex>",`#include <begin_vertex>
         #ifdef USE_INSTANCING
           vec2 ip = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
         #else
           vec2 ip = vec2(0.0);
         #endif
         float ph = ip.x * 0.37 + ip.y * 0.23;
         float sw = aSway * uWind;
         transformed.x += sin(uTime * 1.7 + ph + position.y * 0.35) * 0.13 * sw;
         transformed.z += cos(uTime * 1.3 + ph * 1.31) * 0.1 * sw;
         // whatever brushes through (the player, rotor wash) parts the leaves
         vec2 away = ip - uPush.xy;
         float pd = length(away);
         float pk = aSway * uPush.w * (1.0 - smoothstep(0.0, uPush.z, pd));
         transformed.xz += normalize(away + 0.001) * pk * 0.5 * position.y;`)},t}class _g{constructor(t,e,n,i){this.island=t,this.physics=e,this.scene=n,this.seed=i,this.uniforms={uTime:{value:0},uWind:{value:1},uPush:{value:new Jt(0,0,3,0)}},this.material=vg(this.uniforms),this.group=new ge,this.group.name="vegetation",n.add(this.group),this.drawDist=330,this.farDist=1100,this.smallRadius=95,this.shadowDist=110,this.geos={},this.meta={};let r=0;for(const[o,a]of Object.entries(Oi)){r++,this.geos[o]=[],this.meta[o]=[];for(let l=0;l<a.variants;l++){const c=[];let u;const h=Math.floor(Vl(l,r,i)*1e9);for(let d=0;d<(a.tier==="big"?3:1);d++){const f=a.builder(new Dn(h),d,l);c.push(f.geo),u||(u=f)}this.geos[o].push(c),this.meta[o].push({r:u.r||0,h:u.h||1})}}this.bigChunk=200,this.chunks=[],this.nearGrid=new Map,this.nearRadius=55,this.placeBig(),this.small=new Map,this.smallChunk=48,this.initNear()}setQuality(t){this.drawDist=t.drawDist,this.smallRadius=t.smallRadius,this.shadowDist=t.shadows?110:0;for(const e of this.small.values())this.disposeSmall(e);this.small.clear()}placeBig(){var a;const t=this.island,e=new Map,n=(l,c)=>{const u=Math.floor(l/this.bigChunk),h=Math.floor(c/this.bigChunk),d=u*1e3+h;let f=e.get(d);return f||(f={cx:u,cz:h,x:(u+.5)*this.bigChunk,z:(h+.5)*this.bigChunk,lists:{},meshes:[],lod:-1},e.set(d,f)),f},i=t.half;let r=0;for(const[l,c]of Object.entries(Oi)){if(r++,c.tier!=="big")continue;const u=t.d[l],h=c.spacing,d=new Dn(this.seed+r*7919);for(let f=-i;f<i;f+=h)for(let m=-i;m<i;m+=h){const g=m+d.next()*h,x=f+d.next()*h,p=t.sample(u,g,x),_=d.next(),v=d.int(0,c.variants-1),y=d.range(c.scale[0],c.scale[1]),A=d.range(0,Math.PI*2);if(_>=p)continue;const w=t.heightAt(g,x)-c.sink*y,E=this.meta[l][v],D={x:g,y:w,z:x,yaw:A,s:y,v,tilt:c.tilt?[d.range(-.4,.4),d.range(-.4,.4)]:null};if(((a=n(g,x).lists)[l]||(a[l]=[])).push(D),E.r>0){const S=E.r*y;this.physics.addCylinder(g,x,S,w-1,w+E.h*y,{tag:l==="rock"?"rock":"tree"})}}}const o=new At;for(const l of e.values()){for(const[c,u]of Object.entries(l.lists)){const h=Oi[c];for(let d=0;d<h.variants;d++){const f=u.filter(g=>g.v===d);if(!f.length)continue;const m=new ro(this.geos[c][d][1],this.material,f.length);f.forEach((g,x)=>{fs.set(g.tilt?g.tilt[0]:0,g.yaw,g.tilt?g.tilt[1]:0),o.compose(Po.set(g.x,g.y,g.z),Co.setFromEuler(fs),Lo.set(g.s,g.s,g.s)),m.setMatrixAt(x,o),g.matrix=o.clone(),g.mesh=m,g.index=x,g.type=c;const p=Math.floor(g.x/32)*1e3+Math.floor(g.z/32);let _=this.nearGrid.get(p);_||this.nearGrid.set(p,_=[]),_.push(g)}),m.instanceMatrix.needsUpdate=!0,m.computeBoundingSphere(),m.boundingSphere.radius+=25,m.castShadow=h.shadow,m.receiveShadow=!1,m.matrixAutoUpdate=!1,m.userData={type:c,v:d},this.group.add(m),l.meshes.push(m)}}delete l.lists,this.chunks.push(l)}}update(t,e,n=1){this.uniforms.uTime.value+=t,this.uniforms.uWind.value=n;const i=this.bigChunk/2;for(const d of this.chunks){const f=Math.hypot(Math.max(0,Math.abs(d.x-e.x)-i),Math.max(0,Math.abs(d.z-e.z)-i)),m=f<this.drawDist?1:f<this.farDist?2:3;if(m!==d.lod){d.lod=m;for(const x of d.meshes)x.visible=m<3,m<3&&(x.geometry=this.geos[x.userData.type][x.userData.v][m])}const g=f<this.shadowDist;for(const x of d.meshes)x.castShadow=g&&Oi[x.userData.type].shadow}this.updateNear(e);const r=this.smallChunk,o=this.smallRadius,a=Math.floor(e.x/r),l=Math.floor(e.z/r),c=Math.ceil(o/r)+1;let u=0;const h=new Set;for(let d=-c;d<=c;d++)for(let f=-c;f<=c;f++){const m=a+f,g=l+d,x=(m+.5)*r,p=(g+.5)*r;if(Math.hypot(x-e.x,p-e.z)>o+r*.71)continue;const _=m*1e5+g;h.add(_),!this.small.has(_)&&u<2&&(this.small.set(_,this.buildSmall(m,g)),u++)}for(const[d,f]of this.small)if(!h.has(d)){const m=(f.cx+.5)*r,g=(f.cz+.5)*r;Math.hypot(m-e.x,g-e.z)>o+r*1.4&&(this.disposeSmall(f),this.small.delete(d))}}initNear(){this.near=new Set,this.nearAt={x:1/0,z:1/0},this.nearMeshes={};for(const[t,e]of Object.entries(Oi))if(e.tier==="big"){this.nearMeshes[t]=[];for(let n=0;n<e.variants;n++){const i=new ro(this.geos[t][n][0],this.material,700);i.count=0,i.frustumCulled=!1,i.castShadow=e.shadow,i.matrixAutoUpdate=!1,this.group.add(i),this.nearMeshes[t].push(i)}}}updateNear(t){if(Math.hypot(t.x-this.nearAt.x,t.z-this.nearAt.z)<8)return;this.nearAt={x:t.x,z:t.z};const e=this.nearRadius,n=new Set,i=Math.floor((t.x-e)/32),r=Math.floor((t.x+e)/32),o=Math.floor((t.z-e)/32),a=Math.floor((t.z+e)/32);for(let u=i;u<=r;u++)for(let h=o;h<=a;h++){const d=this.nearGrid.get(u*1e3+h);if(d)for(const f of d)Math.hypot(f.x-t.x,f.z-t.z)<e&&n.add(f)}const l=new Set,c=new At().makeScale(0,0,0);for(const u of this.near)n.has(u)||(u.mesh.setMatrixAt(u.index,u.matrix),l.add(u.mesh));for(const u of n)this.near.has(u)||(u.mesh.setMatrixAt(u.index,c),l.add(u.mesh));for(const u of l)u.instanceMatrix.needsUpdate=!0;this.near=n;for(const u of Object.values(this.nearMeshes))for(const h of u)h.count=0;for(const u of n){const h=this.nearMeshes[u.type][u.v];h.count>=700||h.setMatrixAt(h.count++,u.matrix)}for(const u of Object.values(this.nearMeshes))for(const h of u)h.instanceMatrix.needsUpdate=!0}buildSmall(t,e){const n=this.island,i=this.smallChunk,r={cx:t,cz:e,meshes:[]},o=new At;let a=0;for(const[l,c]of Object.entries(Oi)){if(a++,c.tier!=="small")continue;const u=new Dn(Vl(t,e,this.seed+a*131)),h=n.d[l],d=[];for(let m=0;m<c.variants;m++)d.push([]);const f=c.spacing;for(let m=e*i;m<(e+1)*i;m+=f)for(let g=t*i;g<(t+1)*i;g+=f){const x=g+u.next()*f,p=m+u.next()*f,_=u.next(),v=u.int(0,c.variants-1),y=u.range(c.scale[0],c.scale[1]),A=u.range(0,Math.PI*2);_>=n.sample(h,x,p)||(fs.set(0,A,0),o.compose(Po.set(x,n.heightAt(x,p)-c.sink,p),Co.setFromEuler(fs),Lo.set(y,y,y)),d[v].push(o.clone()))}d.forEach((m,g)=>{if(!m.length)return;const x=new ro(this.geos[l][g][0],this.material,m.length);m.forEach((p,_)=>x.setMatrixAt(_,p)),x.instanceMatrix.needsUpdate=!0,x.computeBoundingSphere(),x.boundingSphere.radius+=3,x.matrixAutoUpdate=!1,x.receiveShadow=!0,this.group.add(x),r.meshes.push(x)})}return r}disposeSmall(t){for(const e of t.meshes)this.group.remove(e),e.dispose();t.meshes.length=0}setPush(t,e,n,i){this.uniforms.uPush.value.set(t,e,n,i)}}function yg(s,t=!1){const e=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,l=new ye;let c=0;for(let u=0;u<s.length;++u){const h=s[u];let d=0;if(e!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(t){let f;if(e)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(e){let u=0;const h=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let m=0;m<f.count;++m)h.push(f.getX(m)+u);u+=s[d].attributes.position.count}l.setIndex(h)}for(const u in r){const h=jl(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let g=0;g<o[u].length;++g)f.push(o[u][g][d]);const m=jl(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(m)}}return l}function jl(s){let t,e,n,i=-1,r=0;for(let c=0;c<s.length;++c){const u=s[c];if(u.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.array.length}const o=new t(r);let a=0;for(let c=0;c<s.length;++c)o.set(s[c].array,a),a+=s[c].array.length;const l=new he(o,e,n);return i!==void 0&&(l.gpuType=i),l}const Mg={stationRadio:{title:"Radio log — Ranger K. Okafor",text:`Day 312. The board pulled the funding again, but the charter stands: zero footprint. Scan them, dart them, draw blood, tag them, let them wake up. Anybody who shoots an animal answers for it — every carcass is a mark against the whole programme.

Locker has the long tranq rifle and a hunting rifle for emergencies. Mind the dose: a rifle dart will drop a raptor and stop a compy’s heart.`},stationMap:{title:"Island survey map",text:"A faded survey of the preserve, pinned with rusty tacks. The Field Lab and helipad sit in the western jungle; watchtowers overlook the east plains, the west jungle and the marsh. The old relay crowns the volcano to the north. Someone has circled Paddock C in red and written NO.",reveal:!0},labTerminal:{title:"Terminal — Specimen T-01 “Matron”",text:`Adult female Tyrannosaurus. Collar battery dead since the evacuation; last fix in the northern highlands. Hunts by movement and scent — freeze when she looks your way, and keep the wind in your face.

Knockout needs six or seven rifle darts. Neck and head shots carry more. Do NOT stand in front of her while the sedative takes hold.`},hangarClipboard:{title:"Hangar clipboard",text:`Tail rotor rebuilt, main gearbox good. Fuel pump on the pad runs off the lab generator — if the genny is dry there is a jerrycan in the parts crate.

Flight: Space climbs, Shift descends, W/S pitch, A/D slide, mouse turns. Land soft or you will be walking home.`},relayLog:{title:"Relay maintenance log",text:"Junction board swapped, needs a proper reseat. Once the relay is up the old collar frequencies come back through — including Matron’s. Bring darts."},"tower:easttower":{title:"Field notes — East Plains Tower",text:"Trike herd grazing below again. They tolerate you at thirty metres; inside fifteen they lower the horns. One bull charged the jeep when we darted his cow. Dart from range, from cover, and wait."},"tower:westtower":{title:"Field notes — West Jungle Tower",text:"Raptors tested us again last night. Wind from the south-west carried our scent straight to them. Crouch in the ferns, stay downwind, and if a pack does come — a flare buys you about twenty seconds."},"tower:southtower":{title:"Field notes — Marsh Tower",text:"Dilophosaurus in the reeds again. It spits before it bites — when your eyes sting, back off and keep something solid between you. Para herd by the river honks at anything; one honk and they all run."}};let Zs=null;function pe(){if(Zs)return Zs;const s=t=>new Ge(t);return Zs={concrete:s({map:Km()}),wood:s({map:Yl()}),darkWood:s({map:Yl([86,66,46])}),roof:s({map:$l([140,140,128]),side:qe}),rust:s({map:$l([120,96,70]),side:qe}),orange:s({map:Vi([196,106,40])}),yellow:s({map:Vi([206,172,58])}),green:s({map:Vi([70,98,72])}),white:s({map:Vi([206,204,192])}),metal:s({color:4868680}),black:s({color:1842204}),glass:new _s({color:9089208,transparent:!0,opacity:.28,shininess:90,depthWrite:!1}),tank:new _s({color:6987914,transparent:!0,opacity:.4,shininess:60,depthWrite:!1}),vine:s({color:3826982,side:qe}),bulb:s({color:4472883,emissive:0}),helipad:s({map:bg()})},Zs}function bg(){const s=document.createElement("canvas");s.width=s.height=512;const t=s.getContext("2d");t.fillStyle="#7a7a74",t.fillRect(0,0,512,512);for(let n=0;n<3e3;n++)t.fillStyle=`rgba(${Math.random()<.5?"40,40,30":"200,200,190"},${Math.random()*.12})`,t.fillRect(Math.random()*512,Math.random()*512,Math.random()*6,Math.random()*6);t.strokeStyle="#d8c850",t.lineWidth=18,t.beginPath(),t.arc(256,256,210,0,Math.PI*2),t.stroke(),t.fillStyle="#e8e4d8",t.fillRect(160,130,50,252),t.fillRect(302,130,50,252),t.fillRect(160,230,192,50),t.strokeStyle="rgba(30,30,20,0.5)",t.lineWidth=2;for(let n=0;n<14;n++){t.beginPath();let i=Math.random()*512,r=Math.random()*512;t.moveTo(i,r);for(let o=0;o<6;o++)t.lineTo(i+=(Math.random()-.5)*60,r+=(Math.random()-.5)*60);t.stroke()}const e=new vr(s);return e.colorSpace=me,e}function Ji(s,t,e,n=2){const i=new Ye(s,t,e),r=i.attributes.uv,o=[[e,t],[e,t],[s,e],[s,e],[s,t],[s,t]];for(let a=0;a<6;a++)for(let l=0;l<4;l++){const c=a*4+l;r.setXY(c,r.getX(c)*o[a][0]/n,r.getY(c)*o[a][1]/n)}return i}const Js=new At,Kl=new jn,wg=new Zn,Zl=new L,Jl=new L(1,1,1);class zn{constructor(t,e,n,i,r=0,o="prefab"){this.G=t,this.x=e,this.y=n,this.z=i,this.yaw=r,this.cos=Math.cos(r),this.sin=Math.sin(r),this.group=new ge,this.group.name=o,this.group.position.set(e,n,i),this.group.rotation.y=r,this.buckets={},t.scene.add(this.group)}world(t,e){return[this.x+t*this.cos+e*this.sin,this.z-t*this.sin+e*this.cos]}point(t,e,n){const[i,r]=this.world(t,n);return new L(i,this.y+e,r)}ground(t,e){const[n,i]=this.world(t,e);return this.G.island.heightAt(n,i)-this.y}push(t,e,n,i,r,o=0,a=0,l=0){var c;Js.compose(Zl.set(n,i,r),Kl.setFromEuler(wg.set(o,a,l)),Jl),e.applyMatrix4(Js),((c=this.buckets)[t]||(c[t]=[])).push(e)}box(t,e,n,i,r,o,a,l={}){const{ry:c=0,rx:u=0,rz:h=0,collide:d=!0,walkable:f=!0,tex:m=2}=l;if(this.push(i,Ji(t,e,n,m),r,o,a,u,c,h),d&&!u&&!h){const[g,x]=this.world(r,a);this.G.physics.addBox(g,x,t/2,n/2,this.yaw+c,this.y+o-e/2,this.y+o+e/2,{walkable:f})}}cyl(t,e,n,i,r,o,a={}){const{rTop:l=t,seg:c=8,collide:u=!0,rx:h=0,rz:d=0,open:f=!1}=a;if(this.push(n,new Qt(l,t,e,c,1,f),i,r,o,h,0,d),u&&!h&&!d){const[m,g]=this.world(i,o);this.G.physics.addCylinder(m,g,Math.max(t,l),this.y+r-e/2,this.y+r+e/2)}}post(t,e,n,i,r,o={}){const a=this.ground(i,r)-.6,l=e-a;this.box(t,l,t,n,i,a+l/2,r,o)}vines(t,e,n,i,r,o,a){const l=Math.max(2,Math.round(i*1.4));for(let c=0;c<l;c++){const u=-i/2+(c+a.next())*(i/l),h=r*a.range(.3,1),d=new Qn(a.range(.25,.6),h,1,3),f=d.attributes.position;for(let m=0;m<f.count;m++)f.setX(m,f.getX(m)+(a.next()-.5)*.25);d.translate(0,-h/2,0),Js.compose(Zl.set(u,0,0),Kl.identity(),Jl),d.applyMatrix4(Js),this.push("vine",d,t*1,e,n,0,o,0)}}add(t){return this.group.add(t),t}interact(t,e,n,i){const r=this.point(e,n,i);return this.G.interact.add({...t,x:r.x,y:r.y,z:r.z})}finish(){const t=pe();for(const[e,n]of Object.entries(this.buckets)){for(const o of n)o.attributes.uv||o.setAttribute("uv",new $t(new Float32Array(o.attributes.position.count*2),2)),o.index||o.setIndex([...Array(o.attributes.position.count).keys()]);const i=yg(n,!1);for(const o of n)o.dispose();const r=new _t(i,t[e]);r.castShadow=!t[e].transparent,r.receiveShadow=!0,this.group.add(r)}return this.buckets={},this.group.updateMatrixWorld(!0),this}}function is(s,t,e,n,i,r,o,a=null){const l=a??t.ground(e,n),c=new _t(Ji(1.1,.75,.75,1),pe().wood);c.position.set(e,l+.375,n),c.rotation.y=o.range(-.4,.4),c.castShadow=c.receiveShadow=!0,t.add(c);const[u,h]=t.world(e,n);return s.physics.addBox(u,h,.55,.375,t.yaw+c.rotation.y,t.y+l,t.y+l+.75),t.interact({id:i,label:"Search supply crate",hold:.7,once:!0,radius:2.2,onUse:d=>{var m;const f=d.inventory.grant(r||o.weighted(Um).items);d.toast(f.length?`Found: ${f.join(", ")}`:"Crate is empty — you are carrying all you can.","loot"),c.material=pe().darkWood,(m=d.audio)==null||m.play("crate",{pos:c.getWorldPosition(new L)})}},e,l+.6,n),c}function ur(s,t,e,n,i,r,o,a={}){const l=Im[e];return t.interact({id:e,label:n,hold:a.hold??.8,once:!0,radius:2.4,enabled:a.enabled,onUse:c=>{var h,d;const u=c.inventory.grant(l);l.flag&&c.flags.set(l.flag),c.toast(`${a.title||"Collected"}: ${u.join(", ")}`,"loot"),(h=c.audio)==null||h.play("locker",{pos:new L(c.player.pos.x,c.player.pos.y,c.player.pos.z)}),(d=a.after)==null||d.call(a)}},i,r,o)}function Qi(s,t,e,n,i,r,o){const a=Mg[e];t.interact({id:"lore:"+e,label:n,hold:0,radius:2.2,onUse:l=>{var c;(c=l.ui)==null||c.showNote(a),l.flags.set("read:"+e),a.reveal&&l.flags.set("mapRevealed")}},i,r,o)}function wr(s,t,e,n,i,r=0,o={}){const a=t.ground(n,i);t.box(.14,2.2,.14,"darkWood",n-.9,a+1.1,i,{ry:r}),t.box(.14,2.2,.14,"darkWood",n+.9,a+1.1,i,{ry:r});const l=Jm(e,o),c=new _t(new Ye(2.3,1.05,.08),[pe().darkWood,pe().darkWood,pe().darkWood,pe().darkWood,new Ge({map:l}),new Ge({map:l})]);c.position.set(n,a+1.75,i),c.rotation.set(o.tilt||.04,r,o.lean||.05),c.castShadow=!0,t.add(c)}function jo(s,t,e,n,i={}){const{mat:r="concrete",roof:o="roof",cx:a=0,cz:l=0,door:c=1.7,hole:u=!0,rng:h}=i,d=.3;s.box(t,.3,e,"concrete",a,.15,l),s.box(t,n,d,r,a,n/2,l-e/2+d/2);const f=(t-c)/2;s.box(f,n,d,r,a-c/2-f/2,n/2,l+e/2-d/2),s.box(f,n,d,r,a+c/2+f/2,n/2,l+e/2-d/2),s.box(c,n-2.3,d,r,a,2.3+(n-2.3)/2,l+e/2-d/2);for(const m of[-1,1]){const g=a+m*(t/2-d/2),x=Math.min(2,e*.3),p=(e-x)/2;s.box(d,n,p,r,g,n/2,l-e/2+p/2),s.box(d,n,p,r,g,n/2,l+e/2-p/2),s.box(d,1,x,r,g,.5,l),s.box(d,n-2.1,x,r,g,2.1+(n-2.1)/2,l);const _=new _t(new Qn(x,1.1),pe().glass);_.position.set(g,1.55,l),_.rotation.y=Math.PI/2,(!u||m>0)&&s.add(_)}if(u){const g=t*.62;s.box(g,.22,e+.6,o,a-t/2+g/2-.3,n+.11,l,{tex:3}),s.box(t-g-1.6+.6,.22,e+.6,o,a+t/2-(t-g-1.6)/2+.3,n+.11,l,{tex:3}),s.box(1.6+.4,.12,e*.5,o,a-t/2+g+1.6/2,n*.55,l+e*.15,{rz:.6,collide:!1,tex:3})}else s.box(t+.6,.22,e+.6,o,a,n+.11,l,{tex:3});h&&(s.vines(a-t/4,n,l+e/2+.05,t*.4,n*.8,0,h),s.vines(a+t/2+.05,n,l-e/4,e*.4,n*.9,Math.PI/2,h))}function Sg(s,t,e){const[n,i]=t.seaDir,r=s.island,o=1.9;let a=0;for(let g=-20;g<60;g+=.5)if(r.heightAt(t.x+n*g,t.z+i*g)<o-.25){a=g-1.5;break}const l=42,c=new zn(s,t.x,0,t.z,Math.atan2(n,i),"dock"),u=a+l;for(let g=a;g<u;g+=3.7){const x=Math.min(3.4,u-g);c.box(4,.25,x,"wood",0,o-.125,g+x/2,{collide:!1,tex:1.5})}s.physics.addBox(...c.world(0,a+l/2),2,l/2,c.yaw,o-.4,o);for(let g=a+1;g<=u;g+=4)for(const x of[-1.9,1.9])c.cyl(.16,6.5,"darkWood",x,o-3,g,{collide:!1,seg:6});for(let g=a+6;g<u;g+=8)c.cyl(.2,.7,"darkWood",2,o+.35,g,{seg:6});for(let g=a+3;g<a+20;g+=2.5)c.box(.1,1,.1,"darkWood",-1.95,o+.5,g);c.box(.08,.08,17,"darkWood",-1.95,o+.95,a+11.5,{collide:!1});const h=new ge,d=new _t(Ji(2.4,1.1,6.5,2),pe().white);d.position.y=.45;const f=new _t(Ji(1.9,1,2.2,2),pe().orange);f.position.set(0,1.5,-.6);const m=new _t(new Te(1.2,1.8,4),pe().white);return m.rotation.set(Math.PI/2,Math.PI/4,0),m.scale.set(1,1,.6),m.position.set(0,.5,4),h.add(d,f,m),h.traverse(g=>g.castShadow=!0),h.position.set(3.8,0,u-6),c.add(h),s.physics.addBox(...c.world(3.8,u-6),1.2,3.25,c.yaw,-.5,1),is(s,c,-1,u-9,"crate:dock",{items:{pistolDart:6,stone:2}},e,o),c.box(1.2,.9,1.2,"wood",1,o+.45,u-11),wr(s,c,["SUPPLY DOCK","FOUNDATION PRESERVE"],3.5,a-3,0),c.finish(),s.boat=h,t.spawn={pos:c.point(0,o,u-3),yaw:Math.atan2(n,i)},c}function Eg(s,t,e){const n=new zn(s,t.x,t.y,t.z,t.yaw,"station");jo(n,12,9,3.2,{rng:e}),n.box(1.3,2.1,.6,"green",-4.6,1.35,-3.9);const i=new _t(Ji(.65,2,.05,1),pe().green);i.position.set(-5.25,1.35,-3.55),n.add(i),ur(s,n,"stationLocker","Open equipment locker",-4.6,1.3,-3.4,{title:"Locker",after:()=>{i.position.set(-5.4,1.35,-3.3),i.rotation.y=-1.6}}),n.box(2.2,.9,.9,"darkWood",3.6,.75,-3.7),n.box(.5,.35,.35,"metal",3.2,1.38,-3.7),Qi(s,n,"stationRadio","Play radio log",3.2,1.4,-3.4),n.box(2,.5,.9,"darkWood",4.9,.55,1.5),n.box(2,.08,.9,"darkWood",4.9,1.6,1.5,{collide:!1});const r=new _t(new Qn(2.2,1.4),new Ge({map:s.mapTexture}));r.position.set(0,1.8,-4.33),n.add(r),Qi(s,n,"stationMap","Study island map",0,1.7,-4),n.box(1.6,1.1,1,"yellow",7.4,.55,-2.5),n.box(.2,9,.2,"metal",-6.6,4.5,-3.8,{collide:!0}),n.box(1.6,.06,.06,"metal",-6.6,8.6,-3.8,{collide:!1}),n.cyl(1,1.8,"rust",8,3.6,3,{seg:10});for(const[o,a]of[[7.4,2.4],[8.6,2.4],[7.4,3.6],[8.6,3.6]])n.box(.12,2.7,.12,"metal",o,1.35,a);return wr(s,n,["RANGER STATION","ALPHA"],-3.5,9.5,0),is(s,n,6.2,5,"crate:station",null,e),n.finish(),n}function Tg(s,t,e,n){const i=new zn(s,t.x,t.y,t.z,n,"fieldlab"),r={cx:-14,cz:-12};jo(i,20,13,3.8,{cx:r.cx,cz:r.cz,door:2.2,rng:e}),i.box(.2,3.8,5,"metal",r.cx+3,1.9,r.cz-4);for(let g=0;g<3;g++)i.box(2.6,.9,.9,"white",r.cx-6+g*3.4,.75,r.cz+2.5);for(let g=0;g<3;g++){const x=new _t(new Qt(.55,.55,2.2,12),pe().tank);x.position.set(r.cx-7+g*1.6,1.4,r.cz-5),i.add(x),i.cyl(.6,.25,"metal",r.cx-7+g*1.6,.42,r.cz-5),i.cyl(.6,.2,"metal",r.cx-7+g*1.6,2.6,r.cz-5,{collide:!1})}i.box(1.4,2.1,.6,"orange",r.cx+7.5,1.35,r.cz-5.8),ur(s,i,"labArmory","Open armory locker",r.cx+7.5,1.3,r.cz-5.2,{title:"Armory"}),i.box(1.1,1,.7,"metal",r.cx+6,.8,r.cz+4.5),Qi(s,i,"labTerminal","Read terminal",r.cx+6,1.4,r.cz+4.1);const o={x:15,z:7},a=new _t(new Qt(8,8.2,.35,32),[pe().concrete,pe().helipad,pe().concrete]);a.position.set(o.x,.17,o.z),a.receiveShadow=!0,i.add(a),s.physics.addBox(...i.world(o.x,o.z),5.8,5.8,n,i.y-.5,i.y+.35);const l=[];for(let g=0;g<8;g++){const x=g/8*Math.PI*2,p=new _t(new an(.12,6,4),pe().bulb.clone());p.position.set(o.x+Math.cos(x)*7.7,.42,o.z+Math.sin(x)*7.7),i.add(p),l.push(p)}i.box(.9,1.6,.7,"yellow",o.x+10,.8,o.z-5),i.box(.3,.3,.3,"black",o.x+10,1.3,o.z-4.6,{collide:!1}),t.pad=i.point(o.x,.35,o.z),t.padYaw=n+Math.PI*.75,i.interact({id:"fuelPump",label:()=>s.heli&&s.heli.fuel>.98?"Helicopter tank is full":"Run fuel pump (refuel helicopter)",hold:2.5,radius:2.4,enabled:g=>g.flags.get("labPower")?!g.heli||g.heli.pos.distanceTo(t.pad)>14?"Helicopter is not on the pad":!0:"Pump is dead — no power",onUse:g=>{var x;g.heli.fuel=1,g.flags.set("heliFueled"),g.toast("Helicopter refuelled. Climb aboard with E.","info"),(x=g.audio)==null||x.play("pump",{pos:t.pad})}},o.x+10,1.2,o.z-4.4);const c={cx:15,cz:-16};i.box(14,.25,10,"concrete",c.cx,.12,c.cz),i.box(14,5,.25,"rust",c.cx,2.5,c.cz-5,{tex:3}),i.box(.25,5,10,"rust",c.cx-7,2.5,c.cz,{tex:3}),i.box(.25,5,6,"rust",c.cx+7,2.5,c.cz-2,{tex:3});for(const g of[-7,7])i.box(.3,5,.3,"metal",c.cx+g,2.5,c.cz+5);i.box(14.6,.15,10.6,"rust",c.cx,5.1,c.cz,{tex:3,rx:.04}),i.box(3,.9,1,"darkWood",c.cx-4,.7,c.cz-4.2),Qi(s,i,"hangarClipboard","Read clipboard",c.cx-4,1.3,c.cz-3.8);for(let g=0;g<4;g++)i.cyl(.32,.9,g%2?"orange":"rust",c.cx+4+g%2*.7,.7,c.cz-3.8+Math.floor(g/2)*.7,{seg:10});const u=new _t(Ji(1.4,.9,.9,1),pe().green);u.position.set(c.cx+1,.7,c.cz-3.6),i.add(u),s.physics.addBox(...i.world(c.cx+1,c.cz-3.6),.7,.45,n,t.y,t.y+1.15),ur(s,i,"hangarCrate","Search parts crate",c.cx+1,1.2,c.cz-3,{title:"Parts crate",hold:1});const h={cx:-16,cz:10};for(const[g,x]of[[-2.2,-1.6],[2.2,-1.6],[-2.2,1.6],[2.2,1.6]])i.box(.2,3,.2,"metal",h.cx+g,1.5,h.cz+x);i.box(5.2,.12,4,"rust",h.cx,3.05,h.cz,{tex:3}),i.box(4.6,.2,3.4,"concrete",h.cx,.1,h.cz),i.box(2.2,1.3,1.1,"green",h.cx,.85,h.cz),i.cyl(.08,1.4,"black",h.cx+.8,2.1,h.cz-.3,{collide:!1});const d=new _t(new an(.08,6,4),pe().bulb.clone());d.position.set(h.cx-.8,1.55,h.cz+.56),i.add(d),t.generator=i.point(h.cx,1,h.cz),i.interact({id:"labGenerator",label:()=>s.flags.get("labPower")?"Generator running":"Fuel & start generator",hold:3,radius:2.6,enabled:g=>g.flags.get("labPower")?"Already running":g.inventory.has("fuelcan")?!0:"Needs a fuel can",onUse:g=>{g.inventory.take("fuelcan"),g.flags.set("labPower"),g.toast("The generator coughs into life. The lab has power.","info")}},h.cx,1.2,h.cz+.9);const f=[d,...l],m=[];for(const[g,x]of[[0,0],[-4,-20],[24,-6],[4,16]]){i.cyl(.12,7,"metal",g,3.5,x,{seg:6}),i.box(1.2,.08,.08,"metal",g+.5,6.9,x,{collide:!1});const p=new _t(new an(.2,8,6),pe().bulb.clone());p.position.set(g+1,6.75,x),i.add(p),f.push(p)}for(const[g,x]of[[2,0],[15,7]]){const p=new qo(16767136,0,26,1.6);p.position.set(g,6.5,x),i.add(p),m.push(p)}s.events.on("flag",({flag:g})=>{var x;if(g==="labPower"){for(const p of f)p.material.emissive.setHex(16764023);for(const p of m)p.intensity=40;(x=s.audio)==null||x.loopAt("generator",t.generator)}});for(const[g,x]of[[-1.4,-1.4],[1.4,-1.4],[-1.4,1.4],[1.4,1.4]])i.box(.2,6,.2,"metal",-30+g,3,18+x);i.cyl(2.2,3,"rust",-30,7.5,18,{seg:12});for(let g=0;g<9;g++){if(g===3||g===6)continue;const x=-36+g*6;i.post(.12,2.2,"metal",x,-30),i.box(6,2,.05,"roof",x+3,i.ground(x+3,-30)+1.2,-30,{tex:1,collide:g!==8})}return wr(s,i,["FOUNDATION FIELD LAB","AUTHORIZED PERSONNEL ONLY"],6,28,0,{bg:"#2f4a3a"}),is(s,i,22,-24,"crate:lab",null,e),i.finish(),i}function Ag(s,t,e,n){const i=new zn(s,t.x,t.y,t.z,n,"tower"),r=8;for(const[o,a]of[[-1.8,-1.8],[1.8,-1.8],[-1.8,1.8],[1.8,1.8]])i.post(.3,r+3,"darkWood",o,a);for(const o of[2.5,5.5])i.box(3.6,.15,.15,"darkWood",0,o,-1.8,{rz:.5,collide:!1}),i.box(.15,.15,3.6,"darkWood",1.8,o,0,{rx:.5,collide:!1}),i.box(.15,.15,3.6,"darkWood",-1.8,o,0,{rx:-.5,collide:!1});i.box(4.4,.25,4.4,"wood",0,r,0),i.box(4.4,1,.1,"darkWood",0,r+.6,-2.15),i.box(.1,1,4.4,"darkWood",-2.15,r+.6,0),i.box(.1,1,4.4,"darkWood",2.15,r+.6,0),i.box(1.4,1,.1,"darkWood",-1.5,r+.6,2.15),i.box(1.4,1,.1,"darkWood",1.5,r+.6,2.15),i.box(5,.15,5,"rust",0,r+2.9,0,{rx:.08,tex:3});for(const o of[-.35,.35])i.box(.08,r+1,.08,"metal",o,r/2,2.35,{collide:!1});for(let o=.4;o<r;o+=.4)i.box(.7,.04,.04,"metal",0,o,2.35,{collide:!1});return i.box(.2,.5,.2,"black",1.4,r+1.1,-1.4,{collide:!1}),i.interact({id:"climb:"+t.id,label:"Climb ladder",hold:0,radius:2,onUse:o=>o.player.teleport(i.point(0,r+.15,1),null,.9)},0,1.2,2.8),i.interact({id:"descend:"+t.id,label:"Climb down",hold:0,radius:1.6,onUse:o=>o.player.teleport(i.point(0,i.ground(0,3.4)+.05,3.4),null,.9)},0,r+1,1.7),is(s,i,-1.2,-1.2,"crate:"+t.id,null,e,r+.125),Qi(s,i,"tower:"+t.id,"Read field notes",1.3,r+1,1.3),i.finish(),i}function Rg(s,t,e){const n=new zn(s,t.x,0,t.z,0,"paddock"),i=58,r=16;for(let c=0;c<r;c++){const u=c/r*Math.PI*2,h=(c+1)/r*Math.PI*2,d=Math.cos(u)*i,f=Math.sin(u)*i,m=Math.cos(h)*i,g=Math.sin(h)*i,x=e.chance(.3)||c===4,p=c===12,_=Math.hypot(m-d,g-f),v=Math.ceil(_/4.5),y=-Math.atan2(g-f,m-d);for(let A=0;A<v;A++){const w=A/v,E=(A+1)/v,D=d+(m-d)*w,M=f+(g-f)*w,S=d+(m-d)*E,H=f+(g-f)*E,P=n.ground(D,M),K=n.ground(S,H),R=x&&e.chance(.5)?e.range(.3,1.2):0;if(R?n.box(.28,4.2,.28,"concrete",D,P+1.6,M,{rx:R*e.sign(),ry:y,collide:!1}):n.box(.28,4.6,.28,"concrete",D,P+1.7,M,{ry:y}),p&&A===Math.floor(v/2)||x&&e.chance(.75))continue;const I=(D+S)/2,F=(M+H)/2,k=(P+K)/2,N=Math.atan2(K-P,Math.hypot(S-D,H-M));for(let V=0;V<4;V++)n.box(Math.hypot(S-D,H-M),.03,.03,"metal",I,k+.6+V*.9,F,{ry:y,rz:N,collide:!1});const[B,z]=n.world(I,F);s.physics.addBox(B,z,Math.hypot(S-D,H-M)/2,.12,y,Math.min(P,K)-.5,Math.max(P,K)+3.6,{walkable:!1,tag:"fence"})}}const o=12.5/r*Math.PI*2;wr(s,n,["PADDOCK C","DANGER 10,000 V"],Math.cos(o)*(i+4),Math.sin(o)*(i+4),-o+Math.PI/2,{bg:"#8a6a20",fg:"#1a1a1a"});const a=8,l=6;return n.box(5,.8,1.4,"concrete",a,n.ground(a,l)+.3,l),n.box(3,3.5,3,"rust",-10,n.ground(-10,-6)+1.6,-6,{ry:.4,tex:3}),is(s,n,-12.5,-3.5,"crate:paddock",{items:{rifleDart:4,flare:1}},e),n.finish(),n}function Cg(s,t,e){const n=new zn(s,t.x,t.y,t.z,e.range(0,6),"relay");jo(n,5,4,2.8,{hole:!1}),ur(s,n,"relayHut","Search supply shelf",0,1,-1.4,{title:"Shelf"}),Qi(s,n,"relayLog","Read maintenance log",1.6,1.2,-1.2);const i=6,r=0,o=22;for(const[l,c]of[[-.8,-.8],[.8,-.8],[-.8,.8],[.8,.8]])n.post(.12,o,"white",i+l,r+c);for(let l=1.5;l<o;l+=2.2)n.box(1.6,.06,.06,"white",i,l,r-.8,{collide:!1,rz:.9}),n.box(1.6,.06,.06,"white",i,l,r+.8,{collide:!1,rz:-.9}),n.box(.06,.06,1.6,"white",i-.8,l+1.1,r,{collide:!1,rx:.9}),n.box(.06,.06,1.6,"white",i+.8,l+1.1,r,{collide:!1,rx:-.9});n.cyl(1,.2,"white",i,o-3,r+1.1,{rx:1.4,collide:!1,seg:14});const a=new _t(new an(.25,8,6),pe().bulb.clone());return a.position.set(i,o+.3,r),n.add(a),n.box(.8,1.2,.5,"metal",i,.9,r+1.3),t.relay=n.point(i,1,r+1.6),n.interact({id:"relay",label:()=>s.flags.get("relayFixed")?"Relay online":"Repair relay junction",hold:4,radius:2.4,enabled:l=>l.flags.get("relayFixed")?"Already repaired":!0,onUse:l=>{l.flags.set("relayFixed"),a.material.emissive.setHex(16724e3),l.toast("Relay online. Old collar frequencies are coming through.","info")}},i,1.3,r+1.7),n.finish(),n}function Pg(s,t,e){const n=new zn(s,t.x,t.y,t.z,t.yaw,"bridge"),i=t.length;for(let r=-i/2;r<i/2;r+=1.2)e.chance(.06)||n.box(4.6,.18,1,"wood",0,-.09,r+.6,{collide:!1,tex:1.5});s.physics.addBox(t.x,t.z,2.3,i/2,t.yaw,t.y-.5,t.y);for(const r of[-2.4,2.4]){n.box(.4,.5,i,"darkWood",r,-.4,0,{collide:!1});for(let o=-i/2;o<=i/2;o+=3)n.box(.12,1.1,.12,"darkWood",r,.55,o);n.box(.1,.1,i,"darkWood",r,1.05,0,{collide:!1}),s.physics.addBox(...n.world(r,0),.08,i/2,t.yaw,t.y,t.y+1.1,{walkable:!1})}for(let r=-i/2+6;r<i/2-4;r+=9)for(const o of[-2.2,2.2]){const a=n.ground(o,r);a>-.8||n.box(.4,-a+.5,.4,"darkWood",o,a/2-.25,r,{collide:!0})}return n.finish(),n}function Lg(s,t,e,n,i,r){const o=s.island.heightAt(t,e),a=new zn(s,t,o,e,n,"wreck"),l=i.range(-.08,.08);a.box(1.9,.8,4.1,i.chance(.5)?"orange":"green",0,.8,0,{rz:l,collide:!1}),a.box(1.8,.5,1.6,"metal",0,1.45,-.2,{rz:l,collide:!1}),a.box(1.85,.08,1.5,"black",0,1.75,.9,{collide:!1,rx:-.3});for(const[c,u]of[[-.95,1.3],[.95,1.3],[-.95,-1.3]])a.cyl(.42,.3,"black",c,.42,u,{rz:Math.PI/2,collide:!1,seg:10});s.physics.addBox(t,e,.95,2.05,n,o,o+1.6),a.vines(0,1.5,2.06,1.6,1,0,i),r&&is(s,a,2.2,-.5,`crate:wreck:${Math.round(t)}:${Math.round(e)}`,null,i),a.finish()}function Ql(s,t,e){const n=new zn(s,0,0,0,0,"poles");let i=0;for(let r=1;r<t.pts.length;r++){const[o,a]=t.pts[r-1],[l,c]=t.pts[r];if(i+=Math.hypot(l-o,c-a),i<36)continue;i=0;const u=l-o,h=c-a,d=Math.hypot(u,h)||1,f=l+-h/d*5.5,m=c+u/d*5.5,g=s.island.heightAt(f,m),x=e.chance(.25)?e.range(.1,.35)*e.sign():0,p=Math.atan2(u,h);n.cyl(.13,8,"darkWood",f,g+3.6,m,{seg:6,rx:x,collide:!x}),x&&s.physics.addCylinder(f,m,.2,g-1,g+1.5),n.box(1.6,.1,.1,"darkWood",f,g+7.2,m,{ry:p+Math.PI/2,rz:x,collide:!1})}n.finish()}function tc(s,t){let e=null,n=1/0;for(const i of s.roads)for(const[r,o]of i.pts){const a=Math.hypot(r-t.x,o-t.z);a>=28&&a<=90&&a<n&&(n=a,e=[r,o])}return e?Math.atan2(e[0]-t.x,e[1]-t.z):0}function Dg(s){const t=s.island,e=new Dn(t.cfg.seed+404),n=t.poi;Sg(s,n.dock,e),Eg(s,n.station,e),Tg(s,n.fieldlab,e,tc(t,n.fieldlab));for(const r of["easttower","westtower","southtower"])Ag(s,n[r],e,tc(t,n[r]));Rg(s,n.paddock,e),Cg(s,n.summit,e);for(const r of t.bridges)Pg(s,r,e);Ql(s,t.roads[0],e),Ql(s,t.roads[1],e);const i=[[0,.55,!0],[1,.22,!1],[1,.62,!0],[2,.5,!0],[3,.6,!1]];for(const[r,o,a]of i){const l=t.roads[r];if(!l)continue;const c=Math.floor(l.pts.length*o),[u,h]=l.pts[c],[d,f]=l.pts[Math.min(l.pts.length-1,c+1)],m=d-u,g=f-h,x=Math.hypot(m,g)||1,p=e.sign();Lg(s,u+-g/x*6*p,h+m/x*6*p,Math.atan2(m,g)+e.range(-.6,.6),e,a)}}const dn=900;class ec{constructor(t,e){this.pos=new Float32Array(dn*3),this.col=new Float32Array(dn*3),this.size=new Float32Array(dn),this.alpha=new Float32Array(dn),this.vel=new Float32Array(dn*3),this.life=new Float32Array(dn),this.max=new Float32Array(dn),this.grav=new Float32Array(dn),this.grow=new Float32Array(dn),this.next=0;const n=new ye;n.setAttribute("position",new he(this.pos,3).setUsage(ws)),n.setAttribute("color",new he(this.col,3).setUsage(ws)),n.setAttribute("size",new he(this.size,1).setUsage(ws)),n.setAttribute("alpha",new he(this.alpha,1).setUsage(ws)),this.geo=n;const i=new Un({uniforms:{uMap:{value:Zm()},uScale:{value:400}},vertexShader:`
        attribute float size; attribute float alpha; attribute vec3 color;
        varying float vA; varying vec3 vC;
        uniform float uScale;
        void main() {
          vA = alpha; vC = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uScale / max(0.1, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        uniform sampler2D uMap; varying float vA; varying vec3 vC;
        void main() {
          vec4 t = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(vC, t.a * vA);
          if (gl_FragColor.a < 0.01) discard;
        }`,transparent:!0,depthWrite:!1,blending:e});this.points=new Am(n,i),this.points.frustumCulled=!1,this.points.renderOrder=5,t.add(this.points)}emit(t,e,n,i,r,o,a,l,c,u,h,d=0,f=0){const m=this.next;this.next=(this.next+1)%dn,this.pos.set([t,e,n],m*3),this.vel.set([i,r,o],m*3),this.col.set([c,u,h],m*3),this.life[m]=a,this.max[m]=a,this.size[m]=l,this.grav[m]=d,this.grow[m]=f,this.alpha[m]=1}update(t){for(let e=0;e<dn;e++){if(this.life[e]<=0){this.alpha[e]!==0&&(this.alpha[e]=0);continue}this.life[e]-=t;const n=e*3;this.vel[n+1]-=this.grav[e]*t,this.vel[n]*=1-t*1.2,this.vel[n+2]*=1-t*1.2,this.pos[n]+=this.vel[n]*t,this.pos[n+1]+=this.vel[n+1]*t,this.pos[n+2]+=this.vel[n+2]*t,this.size[e]+=this.grow[e]*t;const i=this.life[e]/this.max[e];this.alpha[e]=Math.min(1,i*2.5)*(i>0?1:0)}for(const e of["position","color","size","alpha"])this.geo.attributes[e].needsUpdate=!0}}class Ig{constructor(t,e){this.scene=t,this.camera=e,this.normal=new ec(t,pi),this.add=new ec(t,vo),this.tracers=[],this.flashes=[],this.flashLight=new qo(16760944,0,18,2),t.add(this.flashLight),this.flashT=0}setScale(t){this.normal.points.material.uniforms.uScale.value=t,this.add.points.material.uniforms.uScale.value=t}burst(t,e,n,i,r,o,a,l,c,u=0){for(let h=0;h<n;h++)t.emit(e.x,e.y,e.z,(Math.random()-.5)*i,Math.random()*r,(Math.random()-.5)*i,o*(.6+Math.random()*.6),a*(.7+Math.random()*.6),l[0],l[1],l[2],c,u)}blood(t){this.burst(this.normal,t,10,2.5,2,.7,.12,[.45,.03,.02],6)}dartHit(t){this.burst(this.normal,t,4,.8,.6,.4,.05,[.6,.1,.05],3)}dust(t,e=8){this.burst(this.normal,t,e,2,1.5,.9,.25,[.45,.38,.28],1.5,.6)}splash(t){this.burst(this.normal,t,14,2.5,4,.8,.12,[.8,.88,.92],9)}sparks(t){this.burst(this.add,t,10,4,3,.4,.06,[1,.6,.2],9)}smoke(t,e=3){this.burst(this.normal,t,e,.4,.8,1.6,.25,[.6,.6,.6],-.5,.5)}flareSmoke(t){this.normal.emit(t.x,t.y+.2,t.z,(Math.random()-.5)*.4,1.2,(Math.random()-.5)*.4,2.5,.35,.75,.55,.55,-.2,.8),this.add.emit(t.x,t.y+.15,t.z,(Math.random()-.5)*1.5,Math.random()*2,(Math.random()-.5)*1.5,.5,.08,1,.35,.25,6)}rotorDust(t,e){for(let n=0;n<3;n++){const i=Math.random()*Math.PI*2;this.normal.emit(t.x+Math.cos(i)*e*.3,t.y+.3,t.z+Math.sin(i)*e*.3,Math.cos(i)*9,.6,Math.sin(i)*9,1.2,.6,.55,.5,.4,0,1.5)}}spit(t,e){const n=e.x-t.x,i=e.y-t.y,r=e.z-t.z;for(let o=0;o<24;o++){const a=2.4+Math.random()*.6;this.normal.emit(t.x,t.y,t.z,n*a*.35+(Math.random()-.5),i*a*.35+1.5+Math.random(),r*a*.35+(Math.random()-.5),.6,.09,.45,.6,.15,4)}}muzzle(t,e){this.flashLight.position.copy(t),this.flashLight.intensity=e?60:8,this.flashT=.06,this.smoke(t,e?4:1)}tracer(t,e){const n=new ye().setFromPoints([t,e]),i=new Vc({color:16773312,transparent:!0,opacity:.6}),r=new Em(n,i);this.scene.add(r),this.tracers.push({l:r,t:.08})}update(t){this.normal.update(t),this.add.update(t);for(let e=this.tracers.length-1;e>=0;e--){const n=this.tracers[e];n.t-=t,n.l.material.opacity=Math.max(0,n.t/.08)*.6,n.t<=0&&(this.scene.remove(n.l),n.l.geometry.dispose(),n.l.material.dispose(),this.tracers.splice(e,1))}this.flashT-=t,this.flashT<=0&&(this.flashLight.intensity=0)}}class Ug{constructor(t){this.events=t,this.values={}}get(t){return!!this.values[t]}set(t,e=!0){this.values[t]!==e&&(this.values[t]=e,this.events.emit("flag",{flag:t,value:e}))}}class zg{constructor(t){this.events=t,this.counters={},this.sets={},t.on("science:scan",({creature:e,first:n})=>{n&&this.addToSet("speciesScanned",e.species.id),this.bump("scans")}),t.on("science:done",({creature:e,procedure:n})=>{this.bump(n),this.bump(`${n}:${e.species.id}`),n==="blood"&&this.addToSet("speciesBlood",e.species.id)}),t.on("creature:died",({creature:e,cause:n})=>{if(n==="predation")return this.bump("predation");this.bump("kills"),this.bump(`kill:${e.species.id}`),n==="overdose"&&this.bump("overdoses")}),t.on("creature:ko",()=>this.bump("knockouts")),t.on("weapon:fired",({weapon:e})=>this.bump(`shots:${e}`)),t.on("creature:detected",()=>this.bump("detections"))}get(t){return this.sets[t]?this.sets[t].size:this.counters[t]||0}bump(t,e=1){this.counters[t]=(this.counters[t]||0)+e}addToSet(t,e){var n;((n=this.sets)[t]||(n[t]=new Set)).add(e)}has(t,e){return!!this.sets[t]&&this.sets[t].has(e)}}class Ng{constructor(t){this.G=t,this.noises=[],this.visibility=1,this.cover=0,this.moving=0,this.lastLoud=-99,this.playerNoise=0,t.events.on("noise",e=>{this.noises.push({...e,t:t.time}),e.source==="player"&&(this.playerNoise=Math.max(this.playerNoise,e.radius),e.radius>60&&(this.lastLoud=t.time))})}update(t){const e=this.G,n=e.time;for(;this.noises.length&&n-this.noises[0].t>1;)this.noises.shift();this.playerNoise=Math.max(0,this.playerNoise-t*30);const i=e.player;if(e.heli&&e.heli.piloted){this.visibility=2,this.cover=0,this.moving=1;return}const r=i.crouching,o=Math.hypot(i.vel.x,i.vel.z);this.moving=o;const a=r?.45:1,l=o<.3?.55:o<2.6?.8:o<5?1.05:1.4,c=e.island.coverAt(i.pos.x,i.pos.z),u=e.physics.ceilingAt(i.pos.x,i.pos.z,i.pos.y+1)<i.pos.y+6?.35:0,h=i.swimming?.3:0;this.cover=wt(c*(r?1:.35)+u+h,0,.92);let d=oe(.35,1,e.sky.light);i.flashlight&&(d=Math.max(d,.95));const f=n-this.lastLoud<1.5?.7:0;this.visibility=wt(a*l*(1-this.cover)*d+f,.02,1.8)}heardSince(t,e,n,i,r){r.length=0;for(const o of this.noises){if(o.t<=t)continue;const a=Math.hypot(o.x-e,o.z-n),l=o.radius*i;a<l&&r.push({n:o,strength:1-a/l,d:a})}return r}scentAt(t,e,n){const i=this.G,r=i.player.pos,o=t-r.x,a=e-r.z,l=Math.hypot(o,a);if(l>n||l<.01)return l<4?1:0;const c=i.wind,u=(o*c.x+a*c.z)/l;return u<.55?l<6?.5:0:(u-.55)/.45*(1-l/n)*c.strength}}const kg=[{min:6e3,title:"Foundation Fellow"},{min:3500,title:"Distinguished Naturalist"},{min:2e3,title:"Senior Field Biologist"},{min:900,title:"Field Biologist"},{min:200,title:"Research Assistant"},{min:-1/0,title:"Poacher (contract terminated)"}];class Fg{constructor(t){this.G=t,this.total=0,this.ledger=[],this.byCategory={science:0,bonus:0,penalty:0};const e=t.events;e.on("science:scan",({creature:n,points:i,first:r})=>this.add(i,`${r?"Catalogued":"Logged"} ${n.sp.name}`,"science")),e.on("science:done",({creature:n,procedure:i,points:r,ghost:o})=>{const a={blood:"Blood sample",measure:"Measurements",tag:"Tracking tag",tissue:"Tissue sample"}[i];this.add(r,`${a}: ${n.sp.name}${o?" (unseen ×1.5)":""}`,"science")}),e.on("creature:died",({creature:n,cause:i})=>{if(i==="predation"||!n.rec.hitByPlayer)return;const r=n.sp.killPenalty;this.add(-r,i==="overdose"?`Overdose: ${n.sp.name}`:`Killed: ${n.sp.name}`,"penalty")}),e.on("player:died",()=>this.add(-250,"Medical evacuation","penalty")),e.on("objective:done",({objective:n})=>this.add(n.final?500:100,`Objective: ${n.title}`,"bonus"))}add(t,e,n){t&&(this.total+=t,this.byCategory[n]=(this.byCategory[n]||0)+t,this.ledger.push({delta:t,reason:e,category:n,time:this.G.time}),this.G.events.emit("score",{delta:t,reason:e,category:n}))}rank(){return kg.find(t=>this.total>=t.min).title}}const Og=[{id:"landfall",title:"Landfall",text:"Follow the dirt road inland to Ranger Station Alpha.",marker:"station",done:{reach:"station",radius:16}},{id:"gearup",after:["landfall"],title:"Gear Up",text:"Open the equipment locker inside the station.",marker:{interactable:"stationLocker"},done:{flag:"stationLocker"}},{id:"firstcontact",after:["landfall"],title:"First Contact",text:"Catalogue 3 species with the Field Scanner [1].",done:{stat:"speciesScanned",n:3}},{id:"bloodwork",after:["gearup"],title:"Blood Work",text:"Sedate dinosaurs and draw blood from 2 different species.",done:{stat:"speciesBlood",n:2}},{id:"fieldlab",after:["bloodwork"],title:"The Field Lab",text:"Reach the Foundation Field Lab in the western jungle.",marker:"fieldlab",done:{reach:"fieldlab",radius:34}},{id:"fuel",after:["fieldlab"],title:"Running on Fumes",text:"Search the hangar for a fuel can.",marker:{interactable:"hangarCrate"},done:{item:"fuelcan"}},{id:"power",after:["fuel"],title:"Power Up",text:"Fuel and start the Field Lab generator.",marker:{interactable:"labGenerator"},done:{flag:"labPower"}},{id:"heli",after:["power"],title:"Rotor Wash",text:"Run the pump to refuel the helicopter, then take off.",marker:{interactable:"fuelPump"},done:{flag:"heliFlown"}},{id:"relay",after:["heli"],title:"Summit Relay",text:"Fly to the summit and repair the radio relay.",marker:{interactable:"relay"},done:{flag:"relayFixed"}},{id:"apex",after:["relay"],title:"Apex",text:"The relay picked up the tyrant’s old tracking collar. Draw its blood.",done:{stat:"blood:tyrannosaurus",n:1}},{id:"extract",after:["apex"],title:"Extraction",text:"Return to the Supply Dock for pickup.",marker:"dock",done:{reach:"dock",radius:14},final:!0}];class Bg{constructor(t){this.G=t,this.list=Og.map(e=>({...e,state:"locked"})),this.timer=0,this.finished=!1,this.refresh()}byId(t){return this.list.find(e=>e.id===t)}active(){return this.list.filter(t=>t.state==="active")}refresh(){for(const t of this.list)t.state==="locked"&&(t.after||[]).every(e=>this.byId(e).state==="done")&&(t.state="active",this.G.started&&this.G.toast(`New objective: ${t.title}`,"objective"))}test(t){var i;const e=this.G,n=t.done;if(n.reach){const r=e.island.poi[n.reach],o=(i=e.heli)!=null&&i.piloted?e.heli.pos:e.player.pos;return Math.hypot(r.x-o.x,r.z-o.z)<n.radius}return n.flag?e.flags.get(n.flag):n.item?e.inventory.has(n.item):n.stat?e.stats.get(n.stat)>=n.n:!1}update(t){if(this.timer-=t,this.timer>0)return;this.timer=.4;let e=!1;for(const n of this.list)n.state==="active"&&this.test(n)&&(n.state="done",e=!0,this.G.events.emit("objective:done",{objective:n}),this.G.toast(`Objective complete: ${n.title}`,"objective"),n.final&&(this.finished=!0,this.G.events.emit("expedition:complete",{})));e&&this.refresh()}marker(t){const e=this.G,n=t.marker;if(!n)return null;if(typeof n=="string"){const i=e.island.poi[n];return i?{x:i.x,y:i.y+2,z:i.z}:null}if(n.interactable){const i=e.interact.get(n.interactable);return i?{x:i.x,y:i.y,z:i.z}:null}return null}progress(t){const e=t.done;return e.stat?`${Math.min(e.n,this.G.stats.get(e.stat))}/${e.n}`:""}}const Hg=.975;class Gg{constructor(){this.pos=[],this.nor=[],this.uv=[],this.col=[],this.si=[],this.sw=[],this.idx=[]}vertex(t,e,n,i,r,o){this.pos.push(t.x,t.y,t.z),this.nor.push(e.x,e.y,e.z),this.uv.push(n,i),this.col.push(r.r,r.g,r.b);const a=o.slice(0,4);for(;a.length<4;)a.push([0,0]);let l=0;for(const[,c]of a)l+=c;for(const[c,u]of a)this.si.push(c),this.sw.push(l>0?u/l:0);return this.pos.length/3-1}tri(t,e,n){this.idx.push(t,e,n)}build(){const t=new ye;return t.setAttribute("position",new $t(this.pos,3)),t.setAttribute("normal",new $t(this.nor,3)),t.setAttribute("uv",new $t(this.uv,2)),t.setAttribute("color",new $t(this.col,3)),t.setAttribute("skinIndex",new Fo(this.si,4)),t.setAttribute("skinWeight",new $t(this.sw,4)),t.setIndex(this.idx),t}}const qc=new rt(1,1,1),Wi=new L,fi=new L,Xi=new Ot;function li(s,t,e,{capStart:n=!0,capEnd:i=!0,color:r=qc}={}){const o=[];let a=null;for(let c=0;c<t.length;c++){const u=t[c];Xi.getNormalMatrix(u.m);const h=[];for(let d=0;d<=e;d++){const f=d/e*Math.PI*2;Wi.set(Math.sin(f)*u.rx,Math.cos(f)*u.ry,0).applyMatrix4(u.m),fi.set(Math.sin(f)/u.rx,Math.cos(f)/u.ry,0).applyMatrix3(Xi).normalize(),h.push(s.vertex(Wi,fi,d/e,u.v,r,u.w))}if(a)for(let d=0;d<e;d++)s.tri(a[d],h[d],a[d+1]),s.tri(h[d],h[d+1],a[d+1]);else o.push(...h);a=h}const l=(c,u,h)=>{Xi.getNormalMatrix(c.m),Wi.set(0,0,0).applyMatrix4(c.m),fi.set(0,0,h?-1:1).applyMatrix3(Xi).normalize();const d=s.vertex(Wi.clone().addScaledVector(fi,Math.min(c.rx,c.ry)*.6),fi,.5,c.v,r,c.w);for(let f=0;f<e;f++)h?s.tri(d,u[f],u[f+1]):s.tri(d,u[f+1],u[f])};n&&l(t[0],o,!0),i&&l(t[t.length-1],a,!1)}function ce(s,t,e,n,i,r="white",o=[.5,.6]){const a=(t.index,t),l=a.attributes.position,c=a.attributes.normal,u=a.attributes.uv;Xi.getNormalMatrix(e);const h=s.pos.length/3;for(let d=0;d<l.count;d++){Wi.fromBufferAttribute(l,d).applyMatrix4(e),fi.fromBufferAttribute(c,d).applyMatrix3(Xi).normalize();let f=.5,m=Hg;r==="skin"&&u&&(f=u.getX(d),m=o[0]+u.getY(d)*(o[1]-o[0])),s.vertex(Wi,fi,f,m,i,[[n,1]])}if(a.index){const d=a.index.array;for(let f=0;f<d.length;f+=3)s.tri(h+d[f],h+d[f+1],h+d[f+2])}else for(let d=0;d<l.count;d+=3)s.tri(h+d,h+d+1,h+d+2);t.dispose()}const nc=new Map;function nn(s,t,e,n,i=[0,0,0]){const r=new Go;return r.name=t,r.position.set(...n),r.rotation.set(...i),r.userData.rest={px:n[0],py:n[1],pz:n[2],rx:i[0],ry:i[1],rz:i[2]},s.bones.push(r),s.index[t]=s.bones.length-1,e&&s.bones[s.index[e]].add(r),r}function uo(s,t,e,n,i,r,o){let a=0;for(let m=0;m<i.length;m++)a+=r[m]*Math.cos(i[m]);const l=o/a,c=r.map(m=>m*l);let u=0,h=e,d=n;const f=[];for(let m=0;m<i.length;m++){const g=`${t}${m}`;nn(s,g,h,d,[i[m]-u,0,0]),u=i[m],h=g,d=[0,-c[m],0],f.push(g)}return{names:f,lens:c}}function Vg(s){const t=s.body,e={bones:[],index:{},legs:[],arms:[],neck:[],tail:[]},n=t.plan==="quad",i=t.hipH,r=n?t.shoulderH:i;nn(e,"root",null,[0,0,0]),nn(e,"hips","root",[0,i,0]);const o=t.torsoLen*.6,a=n?r-i:t.torsoH*.05;nn(e,"chest","hips",[0,a,o]);const l=t.neck.n,c=t.neck.len/l,u=n?[0,t.torsoH*.3,t.torsoLen*.42]:[0,t.torsoH*.35,t.torsoLen*.42];let h="chest",d=0;for(let p=0;p<l;p++){const _=p===0?-t.neck.rise:t.neck.rise*.55/Math.max(1,l-1);d+=_,nn(e,`neck${p}`,h,p===0?u:[0,0,c],[_,0,0]),e.neck.push(`neck${p}`),h=`neck${p}`}nn(e,"head",h,[0,0,c],[-d*.85+.08,0,0]),nn(e,"jaw","head",[0,-t.head.h*.32,t.head.len*.05],[.04,0,0]),nn(e,"eyes","head",[0,t.head.h*.3,t.head.len*.22]);const f=t.tail.n,m=t.tail.len/f;h="hips";for(let p=0;p<f;p++)nn(e,`tail${p}`,h,p===0?[0,t.torsoH*.18,-t.pelvisLen]:[0,0,-m],[p===0?t.tail.rise:-.035,0,0]),e.tail.push(`tail${p}`),h=`tail${p}`;const g=t.torsoR*(n?.72:.62);for(const p of[1,-1]){const _=p>0?"L":"R";if(n){const v=uo(e,`hleg${_}`,"hips",[p*g,0,0],[-.22,.24,-.04],[.45,.42,.13],i*.95);e.legs.push({...v,side:p,front:!1,kind:"quadHind"})}else{const v=uo(e,`hleg${_}`,"hips",[p*g,-t.torsoH*.05,0],[-.5,.62,-.25],[.38,.36,.26],i*.97);nn(e,`toe${_}`,v.names[2],[0,-v.lens[2],0],[-Math.PI/2+.25,0,0]),v.toe=`toe${_}`,e.legs.push({...v,side:p,front:!1,kind:"biped"})}}if(n){const p=t.torsoR*.66;for(const _ of[1,-1]){const v=_>0?"L":"R",y=uo(e,`fleg${v}`,"chest",[_*p,0,t.torsoLen*.3],[.14,-.12,0],[.48,.4,.12],r*.95);e.legs.push({...y,side:_,front:!0,kind:"quadFront"})}}else{const p=t.armLen;for(const _ of[1,-1]){const v=_>0?"L":"R";nn(e,`arm${v}0`,"chest",[_*t.torsoR*.72,-t.torsoH*.25,t.torsoLen*.3],[-.5,0,_*.15]),nn(e,`arm${v}1`,`arm${v}0`,[0,-p*.5,0],[-.9,0,0]),e.arms.push({names:[`arm${v}0`,`arm${v}1`],side:_,len:p})}}return e.bones[0].updateMatrixWorld(!0),e.world=e.bones.map(p=>p.matrixWorld.clone()),e.geometry=Wg(s,e),e.material=new Ge({map:Qm(t.colors,t.colors.pattern,Hm(s.id)%1e5),vertexColors:!0}),e.hits=qg(s,e),e.dims={hipH:i,length:t.torsoLen+t.pelvisLen+t.tail.len+t.neck.len*Math.cos(t.neck.rise)+t.head.len,height:Math.max(r+t.neck.len*Math.sin(Math.max(0,t.neck.rise))+t.head.h,i+t.torsoH),radius:t.torsoR},e.boneInverses=e.world.map(p=>p.clone().invert()),e}function Xt(s,t,e,n=0,i=0,r=0,o=1,a=1,l=1){return new At().compose(new L(s,t,e),new jn().setFromEuler(new Zn(n,i,r)),new L(o,a,l))}function Wg(s,t){const e=s.body,n=new Gg,i=t.index,r=R=>t.world[i[R]],o=e.plan==="quad",a=12,l=new rt(e.colors.accent),c=new rt("#e8dfc0"),u=new rt("#14100a"),h=new rt(e.colors.stripe),d=-e.pelvisLen,f=e.torsoLen*1.05,m=e.torsoLen*.6,g=e.hipH+e.torsoH*(o?.18:.08),x=(o?e.shoulderH+e.torsoH*.22:e.hipH+e.torsoH*.12)+0,p=e.tail.r/Math.max(e.torsoR,e.torsoH),_=e.neck.r*1.35/Math.max(e.torsoR,e.torsoH),v=[[0,Math.max(.3,p*1.2)],[.2,.86],[.45,1],[.7,.96],[.88,.75],[1,Math.max(.28,_)]],y=R=>{for(let I=0;I<v.length-1;I++)if(R<=v[I+1][0]){const F=(R-v[I][0])/(v[I+1][0]-v[I][0]),k=F*F*(3-2*F);return v[I][1]+(v[I+1][1]-v[I][1])*k}return v[v.length-1][1]},A=R=>Math.max(0,Math.min(1,(R-d)/(f-d))),w=R=>g+(x-g)*A(R),E=R=>w(R)+e.torsoH*y(A(R))*(o?1:1.05),D=R=>e.torsoR*y(A(R)),M=R=>R<m*.55?i.hips:i.chest,S=[],H=10;for(let R=0;R<=H;R++){const I=R/H,F=d+(f-d)*I,k=g+(x-g)*Math.max(0,Math.min(1,(F-d)/(f-d))),N=y(I),B=Math.max(0,Math.min(1,(F-m*.15)/(m*.85))),z=[[i.hips,1-B],[i.chest,B]];F<-e.pelvisLen*.4&&z.push([i.tail0,(-e.pelvisLen*.4-F)/(e.pelvisLen*.6)*.4]),F>e.torsoLen*.9&&z.push([i.neck0,(F-e.torsoLen*.9)/(e.torsoLen*.15)*.35]),S.push({m:Xt(0,k,F),rx:e.torsoR*N,ry:e.torsoH*N*(o?1:1.05),v:.12+I*.4,w:z})}li(n,S,a);{const R=[],I=t.neck.length,F=e.neck.len/I,k=I>3?2:3;for(let N=0;N<I;N++)for(let B=0;B<k;B++){const z=B/k*F,V=N+B/k,j=V/I,G=Qs(V,I,Z=>i[t.neck[Z]],i.chest,i.head);R.push({m:r(t.neck[N]).clone().multiply(Xt(0,0,z)),rx:e.neck.r*(1.3-.4*j),ry:e.neck.r*(1.45-.45*j),v:.55+j*.2,w:G})}R.push({m:r("head").clone().multiply(Xt(0,e.head.h*.05,0)),rx:e.neck.r*.9,ry:e.neck.r*1,v:.75,w:[[i.head,.6],[i[t.neck[I-1]],.4]]}),li(n,R,10,{capStart:!1,capEnd:!1})}const P=e.head;{const R=r("head"),F=[[-.18,.75,.75,.12],[.05,1,1,.1],[.35,.92,.9,.05],[.7,.7*(.5+P.taper*.5),.62*(.5+P.taper*.5),0],[1,P.taper*.85,P.taper*.55,-.05]].map(([z,V,j,G],Z)=>({m:R.clone().multiply(Xt(0,P.h*G,P.len*z)),rx:P.w*V,ry:P.h*j*.62,v:.76+Z*.03,w:Z===0?[[i.head,.7],[i[t.neck[t.neck.length-1]],.3]]:[[i.head,1]]}));li(n,F,10);const k=r("jaw"),N=[[0,.78,.36],[.45,.68,.3],[.92,.5*P.taper+.1,.18]];li(n,N.map(([z,V,j])=>({m:k.clone().multiply(Xt(0,-P.h*.1,P.len*z)),rx:P.w*V,ry:P.h*j,v:.86,w:[[i.jaw,1]]})),8);const B=Math.max(.012,P.w*.2);for(const z of[1,-1])ce(n,new an(B,8,6),r("eyes").clone().multiply(Xt(z*P.w*.78,0,0)),i.eyes,u);if(e.features.includes("teeth"))for(let V=0;V<7;V++){const j=P.len*(.25+V/7*.7);for(const G of[1,-1]){const Z=new Te(P.w*.07,P.h*.18,4);ce(n,Z,R.clone().multiply(Xt(G*P.w*(.75-V/7*.35),-P.h*.42,j,Math.PI,0,0)),i.head,c)}}if(e.features.includes("beak")&&ce(n,new Te(P.w*P.taper*.7,P.len*.18,6),R.clone().multiply(Xt(0,-P.h*.06,P.len*1.02,Math.PI/2,0,0,1,1,.6)),i.head,new rt("#2a2420")),e.features.includes("frill")){const z=new Qt(P.len*.78,P.len*.78,.07,14,1,!1,0,Math.PI);ce(n,z,R.clone().multiply(Xt(0,P.h*.25,-P.len*.02,-1,0,0)).multiply(Xt(0,0,0,Math.PI/2,Math.PI/2,0)),i.head,l);for(let V=0;V<9;V++){const j=-Math.PI/2+V/8*Math.PI,G=new Te(P.len*.05,P.len*.16,4),Z=new L(Math.sin(j)*P.len*.8,Math.cos(j)*P.len*.8,0);ce(n,G,R.clone().multiply(Xt(0,P.h*.25,-P.len*.02,-1,0,0)).multiply(Xt(Z.x,Z.y,0,0,0,-j)),i.head,c)}}if(e.features.includes("horns")){for(const V of[1,-1]){const j=new Te(P.w*.16,P.len*.7,6);j.translate(0,P.len*.35,0),ce(n,j,R.clone().multiply(Xt(V*P.w*.45,P.h*.42,P.len*.22,1.05,0,-V*.12)),i.head,c)}const z=new Te(P.w*.12,P.len*.22,6);z.translate(0,P.len*.11,0),ce(n,z,R.clone().multiply(Xt(0,P.h*.26,P.len*.82,.6,0,0)),i.head,c)}if(e.features.includes("crest")){const z=new Qt(P.w*.28,P.w*.42,P.len*1.5,7);z.translate(0,P.len*.75,0),ce(n,z,R.clone().multiply(Xt(0,P.h*.3,P.len*.35,-1.2,0,0)),i.head,l)}if(e.features.includes("twinCrest"))for(const z of[1,-1]){const V=new Qt(P.len*.42,P.len*.42,.015,10,1,!1,0,Math.PI);ce(n,V,R.clone().multiply(Xt(z*P.w*.28,P.h*.28,P.len*.45,0,0,Math.PI/2)).multiply(Xt(0,0,0,0,0,0,1,1,.55)),i.head,l)}e.features.includes("nasalCrest")&&ce(n,new an(P.w*.75,8,6),R.clone().multiply(Xt(0,P.h*.42,P.len*.3,0,0,0,1,.8,1.4)),i.head,qc,"skin",[.8,.82])}{const R=t.tail.length,I=e.tail.len/R,F=[];for(let k=0;k<R;k++)for(let N=0;N<2;N++){const B=k+N/2,z=B/R,V=e.tail.r*Math.pow(1-z,.85)+e.tail.r*.06,j=Qs(B,R,G=>i[t.tail[G]],i.hips,null);F.push({m:r(t.tail[k]).clone().multiply(Xt(0,0,-(N/2)*I,0,Math.PI,0)),rx:V*.9,ry:V,v:.12-z*.1,w:j})}if(F.push({m:r(t.tail[R-1]).clone().multiply(Xt(0,0,-I,0,Math.PI,0)),rx:e.tail.r*.05,ry:e.tail.r*.06,v:.01,w:[[i[t.tail[R-1]],1]]}),li(n,F,10,{capStart:!1}),e.features.includes("club")&&ce(n,new an(e.tail.r*1.4,10,8),r(t.tail[R-1]).clone().multiply(Xt(0,0,-I*.8,0,0,0,1.3,.7,1)),i[t.tail[R-1]],h),e.features.includes("thagomizer"))for(const k of[1,-1])for(let N=0;N<2;N++){const B=new Te(e.tail.r*.18,e.tail.r*2.2,5);B.translate(0,e.tail.r*1.1,0),ce(n,B,r(t.tail[R-1-N]).clone().multiply(Xt(k*e.tail.r*.1,e.tail.r*.15,-I*.5,-.5,0,k*1)),i[t.tail[R-1-N]],c)}if(e.features.includes("plates")){for(let k=0;k<6;k++){const N=-e.pelvisLen*.6+k/5*(e.torsoLen*.95),B=e.torsoH*.9*(1-Math.abs(k-1.5)*.12);ce(n,new hr(1,0),Xt((k%2?1:-1)*.08,E(N)+B*.3,N,0,0,0,.05,B*.6,B*.55),M(N),l)}for(let k=0;k<4;k++){const N=e.torsoH*.9*(.7-k*.13),B=e.tail.r*Math.pow(1-(k+.4)/R,.85);ce(n,new hr(1,0),r(t.tail[k]).clone().multiply(Xt((k%2?1:-1)*.06,B*.8+N*.4,-I*.4,0,0,0,.05,N*.6,N*.55)),i[t.tail[k]],l)}}if(e.features.includes("armor")){for(let k=0;k<18;k++){const N=k%3,B=Math.floor(k/3),z=-e.pelvisLen*.6+B/5*e.torsoLen*1.1,V=(N-1)*D(z)*.55,j=E(z)-(N===1?.04:e.torsoH*.16),G=new Te(e.torsoR*.14,e.torsoH*.35,5);ce(n,G,Xt(V,j,z,0,0,(1-N)*.6),M(z),h)}for(const k of[1,-1])for(let N=0;N<5;N++){const B=-e.pelvisLen*.4+N/4*e.torsoLen,z=new Te(e.torsoR*.1,e.torsoR*.45,4);ce(n,z,Xt(k*D(B)*.98,w(B),B,0,0,-k*1.4),M(B),c)}}if(e.features.includes("quills")){for(const k of t.neck){const N=new Te(e.neck.r*.35,e.neck.r*2.2,4);N.translate(0,e.neck.r*1.1,0),ce(n,N,r(k).clone().multiply(Xt(0,e.neck.r*1.1,e.neck.len/t.neck.length*.5,-.9,0,0)),i[k],l)}for(let k=0;k<4;k++){const N=-e.pelvisLen*.5+k/3*e.torsoLen,B=new Te(e.neck.r*.4,e.neck.r*2.4,4);B.translate(0,e.neck.r*1.2,0),ce(n,B,Xt(0,E(N)-.03,N,-1.1,0,0),M(N),l)}}}for(const R of t.legs){const I=R.names.length,F=[],k=R.front?e.frontR||e.legR*.8:e.legR,N=R.kind==="biped"?[1.25,.8,.5,.36,.3]:R.kind==="quadHind"?[1.2,.85,.7,.65]:[1.05,.8,.7,.72];F.push({m:r(R.names[0]).clone().multiply(Xt(0,k*.9,0,Math.PI/2,0,0)),rx:k*1.05,ry:k*1.25,v:.3,w:[[i[R.names[0]],.5],[R.front?i.chest:i.hips,.5]]});for(let z=0;z<I;z++){const V=R.lens[z],j=2;for(let G=0;G<j;G++){const Z=z+G/j,nt=k*Xg(N,Z/I),ht=Qs(Z,I,ut=>i[R.names[ut]],R.front?i.chest:i.hips,null);F.push({m:r(R.names[z]).clone().multiply(Xt(0,-(G/j)*V,0,Math.PI/2,0,0)),rx:nt*.85,ry:z===0?nt*1.15:nt,v:.25-Z*.03,w:ht})}}const B=R.names[I-1];if(F.push({m:r(B).clone().multiply(Xt(0,-R.lens[I-1],0,Math.PI/2,0,0)),rx:k*N[N.length-1]*.85,ry:k*N[N.length-1],v:.14,w:[[i[B],1]]}),li(n,F,8,{capStart:!1}),R.kind==="biped"){const z=r(R.toe),V=e.hipH*.2;for(const j of[-.35,0,.35]){const G=new Te(k*.22,V,5);G.translate(0,-V/2,0),ce(n,G,z.clone().multiply(Xt(0,0,0,0,0,j)),i[R.toe],h)}if(e.features.includes("sickle")){const j=new Te(k*.12,V*.7,4);j.translate(0,V*.35,0),ce(n,j,z.clone().multiply(Xt(R.side*k*.2,-V*.15,k*.25,.4,0,0)),i[R.toe],c)}}else{const z=new Qt(k*.75,k*.85,e.hipH*.07,10);ce(n,z,r(B).clone().multiply(Xt(0,-R.lens[I-1]+e.hipH*.02,k*.1)),i[B],h)}}for(const R of t.arms){const I=Math.max(.015,e.legR*.33),F=[];for(let k=0;k<2;k++)for(let N=0;N<2;N++){const B=k+N/2;F.push({m:r(R.names[k]).clone().multiply(Xt(0,-(N/2)*R.len*.5,0,Math.PI/2,0,0)),rx:I*(1.2-B*.25),ry:I*(1.3-B*.25),v:.3,w:Qs(B,2,z=>i[R.names[z]],i.chest,null)})}F.push({m:r(R.names[1]).clone().multiply(Xt(0,-R.len*.5,0,Math.PI/2,0,0)),rx:I*.6,ry:I*.6,v:.3,w:[[i[R.names[1]],1]]}),li(n,F,6,{capStart:!1});for(const k of[-.3,0,.3]){const N=new Te(I*.35,R.len*.22,4);N.translate(0,-R.len*.11,0),ce(n,N,r(R.names[1]).clone().multiply(Xt(0,-R.len*.5,0,.3,0,k)),i[R.names[1]],c)}}return n.build()}function Xg(s,t){const e=t*(s.length-1),n=Math.min(s.length-2,Math.floor(e));return s[n]+(s[n+1]-s[n])*(e-n)}function Qs(s,t,e,n,i){const r=[],o=s-.5;if(o<0){const c=-o;return r.push([e(0),1-c]),n!=null&&r.push([n,c]),r}const a=Math.floor(o),l=o-a;return a>=t-1?(r.push([e(t-1),1-(i!=null?l*.5:0)]),i!=null&&r.push([i,l*.5]),r):(r.push([e(a),1-l]),r.push([e(a+1),l]),r)}function qg(s,t){const e=s.body,n=[],i=new Set(s.armor||[]),r=o=>i.has(o)?"armor":o;n.push({bone:"head",offset:new L(0,0,e.head.len*.45),r:Math.max(e.head.w,e.head.h)*.95,zone:"head"});for(const o of t.neck)n.push({bone:o,offset:new L(0,0,e.neck.len/t.neck.length*.5),r:e.neck.r*1.4,zone:"neck"});n.push({bone:"chest",offset:new L(0,e.torsoH*.2,0),r:Math.max(e.torsoR,e.torsoH)*.95,zone:r("torso")}),n.push({bone:"hips",offset:new L(0,e.torsoH*.15,0),r:Math.max(e.torsoR,e.torsoH)*.95,zone:r("torso")}),t.tail.forEach((o,a)=>{a%2===0&&n.push({bone:o,offset:new L(0,0,-e.tail.len/t.tail.length),r:e.tail.r*Math.pow(1-a/t.tail.length,.85)*1.1+.03,zone:r("tail")})});for(const o of t.legs)o.names.forEach((a,l)=>{l<2&&n.push({bone:a,offset:new L(0,-o.lens[l]*.5,0),r:(o.front&&e.frontR||e.legR)*(l?.9:1.3),zone:"limb"})});return n}function Yg(s){let t=nc.get(s.id);return t||nc.set(s.id,t=Vg(s)),t}function $g(s,t){const e=Yg(s),n=e.bones.map(l=>{const c=new Go;return c.name=l.name,c.position.copy(l.position),c.rotation.copy(l.rotation),c.userData.rest=l.userData.rest,c});e.bones.forEach((l,c)=>{l.parent&&l.parent.isBone&&n[e.bones.indexOf(l.parent)].add(n[c])});const i=new bm(e.geometry,e.material);i.add(n[0]),i.bind(new Vo(n,e.boneInverses),new At),i.scale.setScalar(t),i.castShadow=!0,i.receiveShadow=!0;const r=e.dims;i.boundingSphere=new yn(new L(0,r.hipH,s.body.torsoLen*.3),Math.max(r.length,r.height)*.75);const o={};n.forEach(l=>o[l.name]=l);const a=e.hits.map(l=>({...l,boneObj:o[l.bone],world:new L,rWorld:l.r*t}));return{mesh:i,bones:o,template:e,hits:a,neck:e.neck.map(l=>o[l]),tail:e.tail.map(l=>o[l]),legs:e.legs.map(l=>({...l,bones:l.names.map(c=>o[c]),toeBone:l.toe?o[l.toe]:null})),arms:e.arms.map(l=>({...l,bones:l.names.map(c=>o[c])}))}}class jg{constructor(t,e,n){this.rig=t,this.sp=e,this.B=e.body,this.t=n.range(0,100),this.phase=n.range(0,Math.PI*2),this.side=n.chance(.5)?1:-1,this.speed=0,this.turn=0,this.lookYaw=0,this.lookPitch=0,this.graze=0,this.alert=0,this.roar=0,this.attack=0,this.down=0,this.dead=!1,this.drowsy=0,this.crouch=0,this.eat=0,this.s={graze:0,alert:0,roar:0,attack:0,down:0,drowsy:0,crouch:0,lookYaw:0,lookPitch:0,amp:0,eat:0,turn:0};const i=this.B.hipH;this.stride=i*(this.B.plan==="quad"?1.5:1.7)}update(t){const e=this.s;this.t+=t;const n=(z,V=6)=>e[z]=Re(e[z],this[z],V,t);n("graze",3),n("alert",5),n("roar",8),n("attack",14),n("down",this.down>e.down?1.6:.8),n("drowsy",2),n("crouch",4),n("eat",4),n("turn",4),e.lookYaw=Re(e.lookYaw,wt(this.lookYaw,-1.2,1.2),5,t),e.lookPitch=Re(e.lookPitch,wt(this.lookPitch,-.7,.6),5,t);const i=this.B,r=this.rig,o=this.sp.speed.walk,a=1-e.down,l=wt(this.speed/o*.3,0,.6)*a;e.amp=Re(e.amp,l,6,t);const c=e.amp,u=this.stride*(1+wt(this.speed/o-1,0,4)*.25);this.phase+=this.speed/u*Math.PI*2*t;const h=this.phase,d=this.t,f=r.bones.root,m=r.bones.hips,g=z=>z.userData.rest,x=g(m),p=i.plan==="biped",_=p?-Math.cos(h*2)*.035*i.hipH*(c/.6):-Math.cos(h*2)*.02*i.hipH*(c/.6),v=Math.sin(d*(this.dead?0:e.down>.5?1.6:2.4))*(this.dead?0:1);m.position.set(x.px,x.py+_-e.crouch*.14*i.hipH-e.drowsy*.04*i.hipH,x.pz),m.rotation.set(x.rx+e.crouch*.05+v*.006,x.ry+(p?Math.sin(h)*.05*c:0)+e.drowsy*Math.sin(d*.8)*.05,x.rz+Math.sin(h)*.04*c);const y=r.bones.chest,A=g(y);y.rotation.set(A.rx+v*.012,A.ry-e.turn*.05,A.rz);const w=1.42*e.down;f.rotation.set(0,0,w*this.side),f.position.set(this.side*i.hipH*Math.sin(w)*.92,e.down*(i.torsoR*.95-i.hipH*Math.cos(1.42))+e.down*v*.01*i.torsoR,0);for(const z of r.legs){const V=Kg(z,p),j=h+V,G=Math.sin(j)*c,Z=Math.max(0,-Math.cos(j))*c,[nt,ht,ut]=z.bones,xt=e.down,Rt=g(nt),yt=g(ht),Vt=g(ut);z.kind==="biped"?(nt.rotation.x=(Rt.rx+G-e.crouch*.35)*(1-xt*.7),ht.rotation.x=(yt.rx+Z*1.3+e.crouch*.55)*(1-xt*.5),ut.rotation.x=(Vt.rx-Z*1-e.crouch*.3)*(1-xt*.5),z.toeBone&&(z.toeBone.rotation.x=g(z.toeBone).rx+Z*.9)):z.kind==="quadHind"?(nt.rotation.x=(Rt.rx+G)*(1-xt*.6),ht.rotation.x=(yt.rx+Z*1.1)*(1-xt*.6)+xt*.3,ut.rotation.x=Vt.rx-Z*.5):(nt.rotation.x=(Rt.rx+G)*(1-xt*.6),ht.rotation.x=(yt.rx-Z*1.2)*(1-xt*.6)-xt*.3,ut.rotation.x=Vt.rx+Z*.6),nt.rotation.z=Rt.rz+xt*z.side*.25}for(const z of r.arms){const[V,j]=z.bones;V.rotation.x=g(V).rx+Math.sin(h+Math.PI)*.15*c-e.attack*.6+e.down*.4,j.rotation.x=g(j).rx-e.attack*.3}const E=r.tail.length;r.tail.forEach((z,V)=>{var ht;const j=g(z),G=(V+1)/E,Z=Math.sin(d*1.5-V*.55)*(.05+.05*c)*(.4+G),nt=((ht=this.sp.attack)==null?void 0:ht.kind)==="tail"?e.attack*Math.sin(d*9)*.35:0;z.rotation.y=j.ry+Z*a+e.turn*.1+nt,z.rotation.x=(j.rx+Math.sin(d*1.1-V*.4)*.015+(V===0?c*.08:0)+e.crouch*(V===0?-.06:0))*(1-e.down*.85)});const D=r.neck.length,M=this.sp.browse?-.25:p?1.25:.95,S=e.graze*M-e.alert*.3-e.roar*.45+e.attack*.35+e.drowsy*.6+e.crouch*.25+e.lookPitch,H=e.lookYaw+e.drowsy*Math.sin(d*.7)*.25;r.neck.forEach((z,V)=>{const j=g(z);z.rotation.x=(j.rx+S/D)*(1-e.down*.7)+Math.sin(d*.9+V)*.01,z.rotation.y=j.ry+H/(D+1)*a,z.rotation.z=j.rz});const P=r.bones.head,K=g(P);P.rotation.x=K.rx-e.roar*.15+e.eat*Math.sin(d*6)*.05,P.rotation.y=K.ry+H/(D+1)*a;const R=r.bones.jaw,I=Math.max(e.roar*.85,e.attack*.7,e.eat*(.25+.25*Math.sin(d*7)),this.dead?.2:0);R.rotation.x=g(R).rx+I;const F=r.bones.eyes,k=e.down>.6||this.dead,N=!k&&Math.sin(d*.7)>.995,B=k||N?.05:1;F.scale.set(1,B,1)}setLook(t,e,n=0){this.lookYaw=Je(e-t),this.lookPitch=n}}function Kg(s,t){return t||!s.front?s.side>0?0:Math.PI:s.side>0?Math.PI/2:Math.PI*3/2}const Ve={OK:"ok",DROWSY:"drowsy",OUT:"unconscious",DEAD:"dead"};class Yc{constructor(t,e){this.sp=t,this.rec=e,e.health??(e.health=t.health),e.sedative??(e.sedative=0),e.pending??(e.pending=0),e.state??(e.state=Ve.OK),this.events=[]}get state(){return this.rec.state}get alive(){return this.rec.state!==Ve.DEAD}get conscious(){return this.rec.state===Ve.OK||this.rec.state===Ve.DROWSY}get sedation(){return this.rec.sedative/this.sp.sedation.ko}get projected(){return(this.rec.sedative+this.rec.pending)/this.sp.sedation.ko}get speedMul(){const t=this.rec;if(t.state===Ve.OUT||t.state===Ve.DEAD)return 0;const e=this.sedation;return e<.35?1:wt(1-(e-.35)*.95,.3,1)}dose(t){this.alive&&(this.rec.pending+=t)}damage(t){this.alive&&(this.rec.health-=t,this.rec.health<=0&&this.die("weapon"))}die(t){this.rec.state!==Ve.DEAD&&(this.rec.state=Ve.DEAD,this.rec.cause=t,this.events.push({type:"died",cause:t}))}update(t){const e=this.rec;if(e.state===Ve.DEAD)return;const n=this.sp.sedation;if(e.pending>0){const r=Math.min(e.pending,Math.max(n.ko*.05,e.pending*.55)*t);e.pending-=r,e.sedative+=r}if(e.sedative=Math.max(0,e.sedative-n.metab*t),e.sedative>=n.lethal){this.die("overdose");return}const i=e.sedative/n.ko;e.state===Ve.OUT?i<.6&&e.pending<=0&&(e.state=Ve.DROWSY,this.events.push({type:"woke"})):i>=1?(e.state=Ve.OUT,this.events.push({type:"ko"})):e.state=i>=.35?Ve.DROWSY:Ve.OK}simulate(t){let e=Math.min(t,1200);for(;e>0;){const n=Math.min(1,e);this.update(n),e-=n}return this.events.splice(0)}}const Zg=[];class Jg{constructor(t,e){this.c=t,this.awareness=0,this.lastKnown=null,this.lastSeen=-99,this.sees=!1,this.timer=e.range(0,.25),this.lastHeard=0,this.threat=null,this.prey=null,this.distractedBy=null,this.everDetected=!1}update(t,e){if(this.timer-=t,this.timer>0)return;const n=.22+Math.random()*.06,i=n-this.timer;this.timer=n,this.sense(i,e)}sense(t,e){const n=this.c,i=n.sp,r=i.senses,o=n.eyePos();let a=!1;this.sees=!1;const l=e.heli&&e.heli.piloted,c=l?e.heli.pos:e.player.eye,u=c.x-o.x,h=c.y-o.y,d=c.z-o.z,f=Math.hypot(u,h,d),m=r.sight*(.45+.55*e.sky.light)*(e.player.flashlight&&!l?1.3:1);if(f<m&&e.player.alive){const p=n.yaw+n.anim.s.lookYaw;if((Math.abs(Je(vn(o.x,o.z,c.x,c.z)-p))<r.fov/2*Math.PI/180||f<2.5)&&e.physics.lineOfSight(o.x,o.y,o.z,c.x,c.y-(l?0:.4),c.z)){let y=e.stealth.visibility;r.motion>1&&!l&&(y*=e.stealth.moving<.3?.12:1.25);const A=Math.pow(1-f/m,.7);let w=y*A*2.4;f<4&&(w*=3),w>.05&&(this.awareness+=w*t,a=!0,this.awareness>.6?(this.sees=!0,this.lastSeen=e.time,this.lastKnown={x:c.x,y:c.y,z:c.z}):(!this.lastKnown||this.awareness>.3)&&(this.lastKnown={x:c.x+(Math.random()-.5)*6,y:c.y,z:c.z+(Math.random()-.5)*6}))}}const g=e.stealth.heardSince(this.lastHeard,n.pos.x,n.pos.z,r.hearing,Zg);this.lastHeard=e.time;for(const p of g){if(p.n.creature===n)continue;const _=p.n.source==="player",v=p.strength*(p.n.radius>60?1.6:.7);_?this.awareness+=v:this.awareness=Math.min(.85,Math.max(this.awareness,.35)+v*.8);const y=p.d*.08;this.lastKnown={x:p.n.x+(Math.random()-.5)*y,y:p.n.y,z:p.n.z+(Math.random()-.5)*y},_||(this.distractedBy={...this.lastKnown,t:e.time}),a=!0}if(!l&&e.player.alive){const p=e.stealth.scentAt(n.pos.x,n.pos.z,40*r.smell);p>0&&(this.awareness+=p*.35*r.smell*t,this.awareness>.4&&(this.lastKnown={x:e.player.pos.x+(Math.random()-.5)*10,y:e.player.pos.y,z:e.player.pos.z+(Math.random()-.5)*10}),a=!0)}a||(this.awareness-=t*(this.awareness>1?.05:.09)),this.awareness=Math.max(0,Math.min(2,this.awareness)),this.awareness>=1&&!this.everDetected&&(this.everDetected=!0,n.rec.spotted=!0,e.events.emit("creature:detected",{creature:n})),this.threat=null,this.prey=null;let x=1/0;for(const p of e.ecology.active){if(p===n||!p.vitals.alive)continue;const _=Math.hypot(p.pos.x-n.pos.x,p.pos.z-n.pos.z);_>r.sight||(p.sp.prey&&p.sp.prey.includes(i.id)&&p.vitals.conscious&&_<45&&(p.brain.state==="hunt"||p.brain.state==="attack"||_<14)&&(this.threat=p),i.prey&&i.prey.includes(p.sp.id)&&_<x&&(x=_,this.prey=p))}}alertTo(t,e=1){this.awareness=Math.max(this.awareness,e),this.lastKnown={x:t.x,y:t.y,z:t.z}}}class Qg{constructor(t,e){this.c=t,this.rng=e,this.state="graze",this.t=0,this.data={},this.thinkTimer=e.range(0,.3),this.cool=e.range(0,1),this.spitCool=e.range(2,5),this.anger=0,this.roarCool=e.range(2,6),this.idleTimer=e.range(2,8)}set(t,e={}){t===this.state&&!e.force||(this.state=t,this.t=0,this.data=e)}update(t,e){const n=this.c;this.t+=t,this.cool-=t,this.spitCool-=t,this.roarCool-=t,this.anger=Math.max(0,this.anger-t*.03);const i=n.vitals;i.alive?i.state==="unconscious"?this.state!=="down"&&this.set("down"):this.state==="down"&&this.set("groggy"):this.state!=="dead"&&this.set("dead"),this.state!=="dead"&&this.state!=="down"&&(this.thinkTimer-=t,this.thinkTimer<=0&&(this.thinkTimer=.25,this.think(e)));const r=n.intent;r.graze=r.alert=r.roar=r.attack=r.crouch=r.eat=0,r.look=null,this[this.state](t,e)}think(t){var f;const e=this.c,n=e.sp,i=e.perception,r=this.state,o=n.temperament,a=r==="attack"||r==="charge"||r==="spit";if(r==="groggy"&&this.t<4)return;const l=(f=t.hazards)==null?void 0:f.nearestFlare(e.pos.x,e.pos.z);if(l&&l.d<l.fear){(r!=="flee"||this.data.from!==l)&&this.set("flee",{from:l,time:5,fast:!0});return}if(a)return;if(i.threat&&o!=="aggressive"){o==="defensive"&&n.mass>i.threat.sp.mass*.4?r!=="threaten"&&this.set("threaten",{target:i.threat}):(this.fleeFrom(i.threat.pos,7),this.alarmHerd(t,i.threat.pos));return}const c=e.herd;if(c&&c.alarm&&t.time-c.alarm.t<4&&o==="skittish"&&r!=="flee"){this.fleeFrom(c.alarm,6+this.rng.next()*3);return}const u=i.awareness,h=t.heli&&t.heli.piloted?t.heli.pos:t.player.pos,d=Math.hypot(h.x-e.pos.x,h.z-e.pos.z);if(u>=1){if(o==="skittish"){r!=="flee"&&(this.fleeFrom(h,7+this.rng.next()*4),this.alarmHerd(t,h),e.vocalize("alarm"));return}if(o==="aggressive"){if(e.vitals.rec.health<n.health*.25&&n.id!=="tyrannosaurus"){r!=="flee"&&this.fleeFrom(h,10);return}(r!=="hunt"||this.data.target!=="player")&&(this.set("hunt",{target:"player"}),e.vocalize("roar"),this.alertPack(t));return}if(o==="defensive"){const m=n.personalSpace||12;if(this.anger>.7&&d<m*2.5){r!=="charge"&&this.set("charge",{target:"player"});return}if(e.vitals.rec.health<n.health*.35){r!=="flee"&&this.fleeFrom(h,8);return}d<m*1.6?r!=="threaten"&&this.set("threaten",{target:"player"}):r!=="alert"&&r!=="threaten"&&this.set("alert"),r==="threaten"&&d>m*2.2&&this.t>3&&this.set("alert");return}d<e.radius*3&&r!=="flee"?this.fleeFrom(h,5,!0):r==="graze"&&this.rng.next()<.05&&this.set("alert");return}if(u>=.35&&i.lastKnown){if(o==="skittish"&&u>.7){r!=="flee"&&(this.fleeFrom(i.lastKnown,5),this.alarmHerd(t,i.lastKnown));return}if(o==="aggressive"||o==="defensive"&&u>.6){r!=="investigate"&&r!=="hunt"?this.set("investigate",{at:{...i.lastKnown}}):r==="investigate"&&(this.data.at={...i.lastKnown});return}o!=="passive"&&r!=="alert"&&r!=="flee"&&this.set("alert");return}if(n.prey&&e.rec.hunger>.55&&i.prey&&r!=="hunt"&&r!=="feed"){this.set("hunt",{target:i.prey});return}r==="alert"&&this.t>4&&this.set("graze"),r==="flee"&&this.t>(this.data.time||6)&&this.set("alert"),r==="groggy"&&this.set("graze"),r==="threaten"&&(this.data.target==="player"?u<.6:!i.threat)&&this.t>3&&this.set("alert"),r==="hunt"&&this.data.target==="player"&&u<.6&&this.set("investigate",{at:i.lastKnown?{...i.lastKnown}:{...e.pos}})}fleeFrom(t,e,n=!1){this.set("flee",{from:{x:t.x,z:t.z},time:e,slow:n,force:!0})}alarmHerd(t,e){const n=this.c.herd;n&&(n.alarm={x:e.x,z:e.z,t:t.time})}alertPack(t){const e=this.c;if(!(!e.sp.pack||!e.herd))for(const n of e.herd.loaded)n===e||!n.vitals.conscious||n.perception.alertTo(e.perception.lastKnown||t.player.pos,1.05)}onHurt(t,e,n){const i=this.c,r=i.sp.temperament;if(i.perception.alertTo(e,1.3),this.anger+=n?.9:.5,r==="skittish")this.fleeFrom(e,9),this.alarmHerd(t,e),i.vocalize("alarm");else if(r==="defensive"){if(i.vitals.rec.health<i.sp.health*.35)this.fleeFrom(e,10);else if(this.set("charge",{target:"player"}),i.vocalize("roar"),i.herd)for(const o of i.herd.loaded)o!==i&&o.vitals.conscious&&o.perception.alertTo(e,1.05)}else r==="aggressive"?(this.set("hunt",{target:"player",force:!0}),this.alertPack(t)):this.fleeFrom(e,6,!0)}graze(t,e){const n=this.c,i=n.herd,r=i?{x:i.goal.x+n.rec.offset.dx*n.radius*3,z:i.goal.z+n.rec.offset.dz*n.radius*3}:n.pos,o=Math.hypot(r.x-n.pos.x,r.z-n.pos.z);o>7?n.goTo(r.x,r.z,n.sp.speed.walk*(o>30?1.3:1)):(this.idleTimer-=t,this.idleTimer<0&&(this.idleTimer=this.rng.range(4,12),this.data.wander={x:n.pos.x+this.rng.range(-8,8),z:n.pos.z+this.rng.range(-8,8),until:this.t+this.rng.range(2,5)}),this.data.wander&&this.t<this.data.wander.until?n.goTo(this.data.wander.x,this.data.wander.z,n.sp.speed.walk*.6):(n.halt(),n.intent.graze=n.sp.temperament==="aggressive"?.25:Math.sin(this.t*.25+n.rec.seed)>-.3?1:0,n.intent.eat=n.intent.graze)),n.sp.prey&&(n.rec.hunger=Math.min(1,(n.rec.hunger||0)+t/500))}alert(t,e){const n=this.c;n.halt();const i=n.perception.lastKnown;i&&(n.face(i.x,i.z),n.intent.look=i),n.intent.alert=1}investigate(t,e){const n=this.c,i=this.data.at;if(!i)return this.set("graze");const r=Math.hypot(i.x-n.pos.x,i.z-n.pos.z),o=n.sp.temperament==="aggressive";r>3&&this.t<25?(n.goTo(i.x,i.z,n.sp.speed.walk*(o?.9:.8)),n.intent.crouch=o?.8:0,n.intent.look=i):(n.halt(),n.intent.alert=1,n.intent.look={x:n.pos.x+Math.sin(this.t)*10,z:n.pos.z+Math.cos(this.t*.7)*10,y:n.pos.y},(this.t>30||r<=3&&(this.data.arrived=this.data.arrived??this.t)+5<this.t)&&(n.perception.awareness=Math.min(n.perception.awareness,.3),this.set("graze")))}flee(t,e){const n=this.c,i=this.data.from;let r=n.pos.x-i.x,o=n.pos.z-i.z;const a=Math.hypot(r,o)||1;r/=a,o/=a,n.goTo(n.pos.x+r*30,n.pos.z+o*30,this.data.slow?n.sp.speed.walk*1.5:n.sp.speed.run),this.t>(this.data.time||6)+4&&this.set("alert")}threaten(t,e){var c,u;const n=this.c,i=this.data.target==="player"?e.player.pos:(c=this.data.target)==null?void 0:c.pos;if(!i)return this.set("alert");const r=Math.hypot(i.x-n.pos.x,i.z-n.pos.z);n.halt();const o=n.sp,a=Math.abs(Je(vn(n.pos.x,n.pos.z,i.x,i.z)-n.yaw))>1.6;if(((u=o.attack)==null?void 0:u.kind)==="tail"&&a&&r<o.attack.range+n.radius&&this.cool<=0)return this.set("attack",{target:this.data.target});n.face(i.x,i.z),n.intent.look=i,n.intent.alert=1,this.roarCool<=0&&(this.roarCool=this.rng.range(2.5,4.5),n.vocalize("threat")),n.intent.roar=n.roaring;const l=o.personalSpace||12;this.data.target==="player"&&r<l*.6&&this.t>1.2&&(this.anger+=.3,this.set("charge",{target:"player"})),this.data.target!=="player"&&r<l*.5&&this.t>1.5&&this.set("charge",{target:this.data.target})}charge(t,e){var h,d;const n=this.c,i=n.sp,r=this.data.target==="player"?null:this.data.target,o=r?r.pos:e.player.pos;if(!this.data.dir){const f=vn(n.pos.x,n.pos.z,o.x,o.z);this.data.dir=f,n.vocalize("roar")}const a=vn(n.pos.x,n.pos.z,o.x,o.z);this.t<1.4&&(this.data.dir+=wt(Je(a-this.data.dir),-.9*t,.9*t));const l=this.data.dir;n.goTo(n.pos.x-Math.sin(l)*20,n.pos.z-Math.cos(l)*20,i.speed.run*1.05),n.intent.attack=.4;const c=Math.hypot(o.x-n.pos.x,o.z-n.pos.z),u=n.radius+(i.attack?i.attack.range*.5:1);!this.data.hit&&c<u&&(this.data.hit=!0,r?r.takeHit(e,{damage:(((h=i.attack)==null?void 0:h.damage)||30)*2,zone:"torso",from:n.pos,cause:"predation"}):n.strikePlayer(e,((d=i.attack)==null?void 0:d.damage)||30,9)),(this.t>4.5||this.data.hit&&this.t>1.2||n.speed<.5&&this.t>1.5)&&(this.anger=Math.max(0,this.anger-.5),this.set(r?"threaten":"alert",{target:this.data.target}))}hunt(t,e){var _,v,y;const n=this.c,i=n.sp,r=n.perception,o=this.data.target==="player",a=o?null:this.data.target;if(a&&(!a.vitals||a.disposed))return this.set("graze");if(a&&!a.vitals.alive)return this.set("feed",{carcass:a});let l;if(o){if(!e.player.alive)return this.set("graze");l=r.sees||e.time-r.lastSeen<2?e.player.pos:r.lastKnown||e.player.pos}else l=a.pos;const c=l.x-n.pos.x,u=l.z-n.pos.z,h=Math.hypot(c,u),d=(_=e.hazards)==null?void 0:_.nearestFlareTo(l.x,l.z);if(d&&Math.hypot(d.x-l.x,d.z-l.z)<d.fear*.8&&h<d.fear+6){n.halt(),n.face(l.x,l.z),n.intent.look=l,this.roarCool<=0&&(this.roarCool=3,n.vocalize("threat")),n.intent.roar=n.roaring;return}let f=l.x,m=l.z;if(i.pack&&n.herd&&h>9){const A=n.herd.loaded.indexOf(n),w=Math.max(1,n.herd.loaded.length),E=A/w*Math.PI*2+e.time*.1;f+=Math.cos(E)*7,m+=Math.sin(E)*7}const g=i.attack?i.attack.range:2,x=o?r.awareness<1:h>18&&!((v=a==null?void 0:a.perception)!=null&&v.threat),p=x?i.speed.walk*1.1:h>5?i.speed.run:i.speed.walk*1.6;if(n.intent.crouch=x?.7:0,n.goTo(f,m,p),n.intent.look=l,(y=i.attack)!=null&&y.spit&&o&&r.sees&&h<i.attack.spit.range&&h>5&&this.spitCool<=0)return this.set("spit");h<g+n.radius+.4&&this.cool<=0&&this.set("attack",{target:this.data.target}),o&&r.awareness<.6&&this.set("investigate",{at:r.lastKnown?{...r.lastKnown}:{x:l.x,z:l.z}}),!o&&this.t>40&&this.set("graze")}attack(t,e){const n=this.c,r=n.sp.attack;if(!r)return this.set("graze");const o=this.data.target==="player"||!this.data.target?null:this.data.target,a=o?o.pos:e.player.pos;n.halt(),r.kind!=="tail"&&n.face(a.x,a.z);const l=.28;if(r.lunge&&this.t<l+.15&&n.nudge(a,r.lunge*t),n.intent.attack=this.t<l?this.t/l:this.t<l+.25?1:Math.max(0,1-(this.t-l-.25)*3),n.intent.look=a,!this.data.struck&&this.t>=l){this.data.struck=!0,n.vocalize("attack");const c=Math.hypot(a.x-n.pos.x,a.z-n.pos.z),u=Math.abs(Je(vn(n.pos.x,n.pos.z,a.x,a.z)-n.yaw)),h=r.kind==="tail"?u>1.2:u<1.3;c<r.range+n.radius+.6&&h&&(o?o.takeHit(e,{damage:r.damage*3,zone:"neck",from:n.pos,cause:"predation"}):n.strikePlayer(e,r.damage,r.kind==="tail"?10:5))}if(this.t>.9){if(this.cool=r.cooldown*this.rng.range(.8,1.3),o&&!o.vitals.alive)return this.set("feed",{carcass:o});this.set(n.sp.temperament==="defensive"?"threaten":"hunt",{target:this.data.target||"player"})}}spit(t,e){var r;const n=this.c;n.halt();const i=e.player.pos;n.face(i.x,i.z),n.intent.look=i,n.intent.roar=Math.min(1,this.t*2),!this.data.fired&&this.t>.7&&(this.data.fired=!0,n.vocalize("spit"),(r=e.fx)==null||r.spit(n.eyePos(),e.player.eye),Math.hypot(i.x-n.pos.x,i.z-n.pos.z)<n.sp.attack.spit.range&&n.perception.sees&&setTimeout(()=>e.player.blind(4.5,n.pos),350)),this.t>1.3&&(this.spitCool=n.sp.attack.spit.cooldown,this.set("hunt",{target:"player"}))}feed(t,e){const n=this.c,i=this.data.carcass;if(!i||i.disposed)return this.set("graze");Math.hypot(i.pos.x-n.pos.x,i.pos.z-n.pos.z)>n.radius+i.radius+1?n.goTo(i.pos.x,i.pos.z,n.sp.speed.walk):(n.halt(),n.face(i.pos.x,i.pos.z),n.intent.graze=1,n.intent.eat=1),n.rec.hunger=0,this.t>45&&this.set("graze")}groggy(t,e){const n=this.c;n.halt(),n.intent.alert=.3,this.t>4&&(Math.hypot(e.player.pos.x-n.pos.x,e.player.pos.z-n.pos.z)<22&&n.perception.alertTo(e.player.pos,1.1),this.set("graze"))}down(){this.c.halt()}dead(){this.c.halt()}}const ic=new L;class tx{constructor(t,e,n){this.G=t,this.rec=e,this.herd=n,this.sp=Ln[e.species],this.species=this.sp,this.rng=new Dn(e.seed),this.scale=e.scale,this.rig=$g(this.sp,this.scale),this.mesh=this.rig.mesh,this.mesh.rotation.order="YXZ",this.mesh.userData.creature=this,this.radius=this.sp.radius*this.scale,this.pos=new L(e.x,0,e.z),this.pos.y=t.physics.groundAt(e.x,e.z,t.island.heightAt(e.x,e.z)+1),this.yaw=e.yaw,this.pitch=0,this.speed=0,this.targetSpeed=0,this.target=null,this.faceYaw=null,this.turnRate=0,this.intent={graze:0,alert:0,roar:0,attack:0,crouch:0,eat:0,look:null},this.roaring=0,this.voiceCool=this.rng.range(0,3),this.avoid={yaw:0,until:0},this.stuck={t:0,x:e.x,z:e.z,detour:0,until:0},this.trampleCool=0,this.disposed=!1,this.vitals=new Yc(this.sp,e),this.anim=new jg(this.rig,this.sp,this.rng),this.perception=new Jg(this,this.rng),this.perception.everDetected=!!e.spotted,this.brain=new Qg(this,this.rng),(this.vitals.state==="unconscious"||!this.vitals.alive)&&(this.anim.down=this.anim.s.down=1,this.anim.dead=!this.vitals.alive,this.brain.set(this.vitals.alive?"down":"dead")),t.scene.add(this.mesh),this.syncMesh(0),this.hitsFresh=-1}goTo(t,e,n){this.target={x:t,z:e},this.targetSpeed=n,this.faceYaw=null}halt(){this.target=null,this.targetSpeed=0}face(t,e){this.faceYaw=vn(this.pos.x,this.pos.z,t,e)}nudge(t,e){Math.hypot(t.x-this.pos.x,t.z-this.pos.z)<this.radius+.8||(this.pos.x+=Vn(this.yaw)*e,this.pos.z+=Wn(this.yaw)*e)}eyePos(){return this.rig.bones.eyes.getWorldPosition(ic),ic.clone()}center(){return new L(this.pos.x,this.pos.y+this.sp.body.hipH*this.scale,this.pos.z)}vocalize(t){var e;this.voiceCool>0&&t!=="alarm"&&t!=="attack"||(this.voiceCool=this.rng.range(1.5,3),(t==="roar"||t==="threat"||t==="alarm")&&(this.roaring=1),(e=this.G.audio)==null||e.voice(this.sp,t,this.eyePos()))}takeHit(t,e){if(!this.vitals.alive)return;const n=this.vitals.alive;e.dose&&this.vitals.dose(e.dose),e.damage&&(this.vitals.rec.health-=e.damage,this.vitals.rec.health<=0&&this.vitals.die(e.cause||"weapon")),e.cause!=="predation"&&(this.rec.hitByPlayer=!0,t.events.emit("creature:hit",{creature:this,zone:e.zone,dose:e.dose||0,damage:e.damage||0,weapon:e.weapon})),n&&this.vitals.alive&&this.vitals.conscious&&this.brain.onHurt(t,e.from||t.player.pos,!!e.damage),this.flushVitals(t)}strikePlayer(t,e,n){if(t.heli&&t.heli.piloted)return t.heli.damage(e*.5);t.player.damage(e,this.pos,n)}flushVitals(t){for(const e of this.vitals.events.splice(0))e.type==="ko"?(t.events.emit("creature:ko",{creature:this}),this.anim.down=1):e.type==="woke"?(t.events.emit("creature:woke",{creature:this}),this.anim.down=0):e.type==="died"&&(this.anim.down=1,this.anim.dead=!0,t.events.emit("creature:died",{creature:this,cause:e.cause}))}update(t){var n;const e=this.G;if(this.voiceCool-=t,this.roaring=Math.max(0,this.roaring-t*.8),this.trampleCool-=t,this.vitals.update(t),this.flushVitals(e),this.vitals.conscious&&this.perception.update(t,e),this.brain.update(t,e),this.locomote(t),this.applyIntent(t),this.anim.update(t),this.syncMesh(t),((n=this.sp.attack)==null?void 0:n.kind)==="trample"&&this.speed>.4&&this.trampleCool<=0){const i=e.player.pos;Math.hypot(i.x-this.pos.x,i.z-this.pos.z)<this.radius*1.3&&i.y<this.pos.y+2&&(this.trampleCool=this.sp.attack.cooldown,this.strikePlayer(e,this.sp.attack.damage,8))}this.rec.x=this.pos.x,this.rec.z=this.pos.z,this.rec.yaw=this.yaw}locomote(t){const e=this.G,n=this.sp,i=this.vitals.speedMul;let r=this.targetSpeed*i,o=this.yaw;if(this.target){const A=this.target.x-this.pos.x,w=this.target.z-this.pos.z,E=Math.hypot(A,w);if(E<.6?r=0:(o=vn(this.pos.x,this.pos.z,this.target.x,this.target.z),E<3&&(r*=E/3)),this.stuck.t+=t,this.stuck.t>1.5){const D=Math.hypot(this.pos.x-this.stuck.x,this.pos.z-this.stuck.z);r>.5&&D<.5&&(this.stuck.detour=this.rng.sign()*this.rng.range(.9,1.6),this.stuck.until=e.time+this.rng.range(1,2)),this.stuck.t=0,this.stuck.x=this.pos.x,this.stuck.z=this.pos.z}e.time<this.stuck.until&&(o+=this.stuck.detour),r>.3&&(o=this.steer(o,r))}else this.faceYaw!=null&&(o=this.faceYaw);const a=n.speed.turn*(r>.2?1:1.3)*(.6+.4*i)*t,l=this.yaw;this.vitals.conscious&&(this.yaw=Om(this.yaw,o,a)),this.turnRate=Je(this.yaw-l)/Math.max(t,1e-4),Math.abs(Je(o-this.yaw))>1.2&&(r*=.35);const u=n.mass>2e3?3:7;this.speed+=wt(r-this.speed,-u*1.6*t,u*t),this.vitals.conscious||(this.speed=0);const h=this.speed*t;h>0&&(this.pos.x+=Vn(this.yaw)*h,this.pos.z+=Wn(this.yaw)*h);const d=n.mass>2e3;e.physics.collideCircle(this.pos,this.radius,this.pos.y+.4,this.pos.y+n.body.hipH*this.scale,d?A=>!(A.tag==="tree"&&A.r<.6):null);const f=e.island.depthAt(this.pos.x,this.pos.z),m=n.body.hipH*this.scale*.8;f>m&&(this.pos.x-=Vn(this.yaw)*h*1.2,this.pos.z-=Wn(this.yaw)*h*1.2);for(const A of e.ecology.active){if(A===this)continue;const w=this.pos.x-A.pos.x,E=this.pos.z-A.pos.z,D=this.radius+A.radius;if(Math.abs(w)>D||Math.abs(E)>D)continue;const M=Math.hypot(w,E);if(M<D&&M>1e-4){const S=(D-M)/M*(A.sp.mass/(A.sp.mass+n.mass));this.pos.x+=w*S,this.pos.z+=E*S}}this.pos.y=e.physics.groundAt(this.pos.x,this.pos.z,this.pos.y+1.2);const g=(n.body.torsoLen+n.body.pelvisLen)*this.scale*.5,x=Vn(this.yaw)*g,p=Wn(this.yaw)*g,_=e.island.heightAt(this.pos.x+x,this.pos.z+p),v=e.island.heightAt(this.pos.x-x,this.pos.z-p),y=this.vitals.conscious?wt(Math.atan2(_-v,2*g),-.45,.45):0;this.pitch+=(y-this.pitch)*Math.min(1,t*5)}steer(t,e){const n=this.G;if(n.time<this.avoid.until)return t+this.avoid.yaw;const i=this.radius*1.5+e*.7,r=[0,.45,-.45,.9,-.9,1.5,-1.5,2.3,-2.3];for(const o of r){const a=t+o;if(this.clearAt(a,i))return o!==0&&(this.avoid={yaw:o,until:n.time+.6}),a}return t}clearAt(t,e){const n=this.G,i=this.pos.x+Vn(t)*e,r=this.pos.z+Wn(t)*e;if(n.island.depthAt(i,r)>this.sp.body.hipH*this.scale*.7)return!1;const o=n.island.heightAt(i,r)-this.pos.y;if(Math.abs(o)/e>1.1)return!1;const a=this.sp.mass>2e3,l=this.radius*.8;for(const c of n.physics.nearby(i,r,l+1))if(!(c.y1<this.pos.y+.5||c.y0>this.pos.y+2)&&!(a&&c.tag==="tree"&&c.r<.6))if(c.type==="cyl"){if(Math.hypot(i-c.x,r-c.z)<l+c.r)return!1}else{const[u,h]=n.physics.toLocal(c,i,r);if(Math.abs(u)<c.hx+l&&Math.abs(h)<c.hz+l)return!1}return!0}applyIntent(t){const e=this.intent,n=this.anim;if(n.speed=this.speed/this.scale,n.turn=this.turnRate,n.graze=e.graze,n.alert=e.alert,n.roar=Math.max(e.roar,this.roaring>.4?1:0),n.attack=e.attack,n.crouch=e.crouch,n.eat=e.eat,n.drowsy=this.vitals.state==="drowsy"?Math.min(1,(this.vitals.sedation-.35)*2+.3):0,e.look&&this.vitals.conscious){const i=this.pos,r=vn(i.x,i.z,e.look.x,e.look.z),o=(e.look.y??i.y)-(i.y+this.sp.body.hipH*this.scale),a=Math.hypot(e.look.x-i.x,e.look.z-i.z)||1;n.setLook(this.yaw,r,-Math.atan2(o,a)*.6)}else n.lookYaw=0,n.lookPitch=0}syncMesh(){const t=this.mesh;t.position.copy(this.pos),t.rotation.set(-this.pitch,this.yaw+Math.PI,0)}updateHits(){const t=this.G.frame;if(this.hitsFresh===t)return this.rig.hits;this.hitsFresh=t,this.mesh.updateMatrixWorld(!0);for(const e of this.rig.hits)e.world.copy(e.offset).applyMatrix4(e.boneObj.matrixWorld);return this.rig.hits}raycast(t,e,n){const i=this.center(),r=(this.sp.body.torsoLen+this.sp.body.tail.len+this.sp.body.neck.len+this.sp.body.head.len)*this.scale,o=i.x-t.x,a=i.y-t.y,l=i.z-t.z,c=o*e.x+a*e.y+l*e.z;if(c<-r||o*o+a*a+l*l-c*c>r*r)return null;let h=null;for(const d of this.updateHits()){const f=d.world.x-t.x,m=d.world.y-t.y,g=d.world.z-t.z,x=f*e.x+m*e.y+g*e.z;if(x<0)continue;const p=f*f+m*m+g*g-x*x,_=d.rWorld*d.rWorld;if(p>_)continue;const v=x-Math.sqrt(_-p);v>=0&&v<=n&&(!h||v<h.t)&&(h={t:v,zone:d.zone,hit:d})}return h}dispose(){this.disposed=!0,this.G.scene.remove(this.mesh),this.mesh.skeleton.dispose()}}let ex=1;class nx{constructor(t){this.G=t,this.herds=[],this.active=[],this.loadRadius=220,this.unloadRadius=280,this.maxActive=44,this.focus={x:0,z:0},this.virtualTimer=0}populate(t){const n=this.G.island,i=new Dn(t),r=n.poi.dock;for(const a of Xc){const l=Ln[a];for(let c=0;c<l.herds;c++){let u=null,h=-1;for(let d=0;d<260;d++){const f=i.range(0,Math.PI*2),m=Math.sqrt(i.next())*720,g=Math.cos(f)*m,x=Math.sin(f)*m;let p=n.habitat(g,x,l.habitat);if(p<=.15||n.sample(n.clear,g,x)>.2)continue;const _=Math.hypot(g-r.x,x-r.z),v=l.temperament==="aggressive"?380:l.mass<10?70:170;if(!(_<v)&&!(a==="tyrannosaurus"&&x>-100)){l.nearWater&&(p*=1+1.5*Math.exp(-n.sample(n.riverM,g,x)/60)+(Math.hypot(g-n.lake.x,x-n.lake.z)<220?.8:0));for(const y of this.herds){const A=Math.hypot(y.home.x-g,y.home.z-x);y.species===a&&A<260?p*=.2:A<60&&(p*=.5)}p*=.85+i.next()*.3,p>h&&(h=p,u={x:g,z:x})}}u&&this.addHerd(a,u.x,u.z,i)}}const o=n.poi.station;this.addHerd("compsognathus",(r.x+o.x)/2+40,(r.z+o.z)/2,i),this.addHerd("gallimimus",o.x+160,o.z-120,i)}addHerd(t,e,n,i){const r=Ln[t],o=i.int(r.herd[0],r.herd[1]),a={id:this.herds.length,species:t,home:{x:e,z:n},radius:30+r.radius*18,x:e,z:n,goal:{x:e,z:n},goalTimer:i.range(5,20),records:[],loaded:[],alarm:null,rng:i.fork(this.herds.length+1)};for(let l=0;l<o;l++){const c=l/o*Math.PI*2+i.range(-.4,.4),u=o>2&&l===o-1&&i.chance(.5),h=i.range(r.scale[0],r.scale[1])*(u?.65:1);a.records.push({id:ex++,species:t,herd:a.id,seed:i.int(1,1e9),scale:h,juvenile:u,offset:{dx:Math.cos(c)*i.range(.6,1.4),dz:Math.sin(c)*i.range(.6,1.4)},x:e+Math.cos(c)*r.radius*4,z:n+Math.sin(c)*r.radius*4,yaw:i.range(-Math.PI,Math.PI),hunger:i.range(0,.5),science:{},scanned:!1,spotted:!1,lastSim:0})}return this.herds.push(a),a}findSpecies(t){return this.herds.filter(e=>e.species===t)}update(t,e){const n=this.G;this.focus=e;for(const i of this.herds){if(i.goalTimer-=t,i.goalTimer<=0){i.goalTimer=i.rng.range(18,45);for(let r=0;r<8;r++){const o=i.rng.range(0,Math.PI*2),a=i.rng.range(0,i.radius),l=i.home.x+Math.cos(o)*a,c=i.home.z+Math.sin(o)*a;if(n.island.isLand(l,c,-.4)&&n.island.sample(n.island.clear,l,c)<.5){i.goal={x:l,z:c};break}}}if(i.loaded.length){let r=0,o=0;for(const a of i.loaded)r+=a.pos.x,o+=a.pos.z;i.x=r/i.loaded.length,i.z=o/i.loaded.length}}if(this.virtualTimer-=t,this.virtualTimer<=0){this.virtualTimer=1;for(const r of this.herds){if(r.loaded.length)continue;const o=Ln[r.species],a=r.goal.x-r.x,l=r.goal.z-r.z,c=Math.hypot(a,l),u=r.records.some(h=>h.state==="unconscious");if(c>2&&!u){const h=Math.min(c,o.speed.walk*.6*1);r.x+=a/c*h,r.z+=l/c*h;for(const d of r.records)d.state==="unconscious"||d.state==="dead"||(d.x+=a/c*h,d.z+=l/c*h)}for(const h of r.records)if(h.state&&h.state!=="ok"&&h.state!=="dead"){const d=new Yc(o,h);for(const f of d.simulate(1))f.type==="died"&&n.events.emit("creature:died",{creature:{species:o,sp:o,rec:h,pos:{x:h.x,y:0,z:h.z}},cause:f.cause})}}}for(const i of this.herds){const r=Math.hypot(i.x-e.x,i.z-e.z);!i.loaded.length&&r<this.loadRadius&&this.active.length+i.records.length<=this.maxActive+6?this.load(i):i.loaded.length&&r>this.unloadRadius&&this.unload(i)}for(const i of this.active)i.update(t)}load(t){for(const e of t.records){const n=new tx(this.G,e,t);t.loaded.push(n),this.active.push(n)}}unload(t){for(const e of t.loaded){e.dispose();const n=this.active.indexOf(e);n>=0&&this.active.splice(n,1)}t.loaded.length=0}raycast(t,e,n){let i=null;for(const r of this.active){const o=r.raycast(t,e,n);o&&(!i||o.t<i.t)&&(i={creature:r,t:o.t,zone:o.zone,sphere:o.hit})}return i}near(t,e,n){return this.active.filter(i=>Math.hypot(i.pos.x-t,i.pos.z-e)<n)}}const fo=1.75,sc=1.05,ix=.35,po=.55;class sx{constructor(t){this.G=t,this.pos=new L,this.vel=new L,this.yaw=0,this.pitch=0,this.height=fo,this.crouching=!1,this.onGround=!0,this.swimming=!1,this.wading=0,this.stamina=1,this.health=100,this.alive=!0,this.flashlight=!1,this.blindT=0,this.lastHurt=-99,this.hurtDir=0,this.bob=0,this.stepAcc=0,this.shake=0,this.fade=0,this.recoil=0,this.frozen=!1,this.eye=new L,this.look=new L(0,0,-1),this._fall=0,this.light=new Cm(16773848,0,60,.5,.45,1.2),this.light.position.set(.25,-.2,0),this.light.target.position.set(.1,-.1,-5),t.camera.add(this.light),t.camera.add(this.light.target)}teleport(t,e=null,n=0){this.pos.copy(t),this.vel.set(0,0,0),e!=null&&(this.yaw=e),this.fade=n,this.onGround=!0}damage(t,e,n=0){var i;if(!(!this.alive||this.G.godMode)){if(this.health-=t,this.lastHurt=this.G.time,this.shake=Math.min(1,this.shake+t/30),e){const r=this.pos.x-e.x,o=this.pos.z-e.z,a=Math.hypot(r,o)||1;this.vel.x+=r/a*n,this.vel.z+=o/a*n,this.vel.y+=n*.25,this.hurtDir=Math.atan2(-(e.x-this.pos.x),-(e.z-this.pos.z))-this.yaw}this.G.events.emit("player:damaged",{amount:t,from:e}),(i=this.G.audio)==null||i.play("hurt"),this.health<=0&&(this.health=0,this.alive=!1,this.G.events.emit("player:died",{}))}}heal(t){this.health=Math.min(100,this.health+t)}blind(t){this.blindT=Math.max(this.blindT,t),this.damage(4,null)}revive(t,e){this.alive=!0,this.health=70,this.blindT=0,this.teleport(t,e,1.2)}update(t,e){var R,I,F,k,N,B;const n=this.G,i=n.island;this.blindT=Math.max(0,this.blindT-t),this.fade=Math.max(0,this.fade-t),this.shake=Math.max(0,this.shake-t*2),this.recoil=Re(this.recoil,0,9,t),this.alive&&n.time-this.lastHurt>9&&this.heal(t*2.5);const r=e.look();if(this.lastLook=r,this.alive&&!this.frozen){const z=n.weapons?n.weapons.zoomFactor():1;this.yaw-=r.dx/z,this.pitch=wt(this.pitch-r.dy/z,-1.45,1.45)}this.alive&&!this.frozen&&(e.pressed("crouch")&&(this.crouching=!this.crouching),e.pressed("flashlight")&&(this.flashlight=!this.flashlight,(R=n.audio)==null||R.play("click"))),this.crouching||n.physics.ceilingAt(this.pos.x,this.pos.z,this.pos.y+sc)<this.pos.y+fo+.05&&(this.crouching=!0),this.height=Re(this.height,this.crouching?sc:fo,10,t);let o=0,a=0;this.alive&&!this.frozen&&(a=e.axis("back","forward"),o=e.axis("left","right"));const l=Math.hypot(o,a);l>1&&(o/=l,a/=l);const c=this.alive&&e.down("sprint")&&a>.1&&!this.crouching&&this.stamina>.05&&!this.swimming,u=n.weapons&&n.weapons.aim>.5;let h=this.crouching?1.9:c?7.2:4.2;u&&(h*=.6),this.swimming?h=2.3:this.wading>.35&&(h*=.65),this.stamina=wt(this.stamina+(c&&l>0?-t/7:t/5),0,1);const d=Math.sin(this.yaw),f=Math.cos(this.yaw),m=(-d*a+f*o)*h,g=(-f*a-d*o)*h,x=this.onGround||this.swimming?40:5;this.vel.x+=wt(m-this.vel.x,-x*t,x*t),this.vel.z+=wt(g-this.vel.z,-x*t,x*t);const p=i.waterAt(this.pos.x,this.pos.z),_=n.physics.groundAt(this.pos.x,this.pos.z,this.pos.y+po),v=p-_;this.wading=wt(v/1.3,0,1);const y=v>1.35;if(y&&this.pos.y<p-1.2?(this.swimming||(I=n.audio)==null||I.play("splash",{pos:this.pos}),this.swimming=!0):(!y||this.pos.y>p-.8)&&(this.swimming=!1),this.swimming){const z=p-1.45;this.vel.y=Re(this.vel.y,(z-this.pos.y)*3,4,t),this.alive&&e.down("jump")&&(this.vel.y=1.5)}else this.vel.y-=22*t,this.onGround&&this.alive&&!this.frozen&&e.pressed("jump")&&!this.crouching&&(this.vel.y=6.2,this.onGround=!1,(F=n.audio)==null||F.play("jump"));const A=this.pos.y;this.pos.x+=this.vel.x*t,this.pos.z+=this.vel.z*t,n.physics.collideCircle(this.pos,ix,this.pos.y+po*.8,this.pos.y+this.height),this.pos.x=wt(this.pos.x,-i.half+20,i.half-20),this.pos.z=wt(this.pos.z,-i.half+20,i.half-20),this.pos.y+=this.vel.y*t;const w=n.physics.ceilingAt(this.pos.x,this.pos.z,A+this.height-.05);this.pos.y+this.height>w&&(this.pos.y=w-this.height,this.vel.y>0&&(this.vel.y=0));const E=n.physics.groundAt(this.pos.x,this.pos.z,Math.max(this.pos.y,A)+po),D=this.onGround;this.pos.y<=E+.02||D&&this.vel.y<=0&&this.pos.y-E<.6&&!this.swimming?(!D&&this._fall<-13&&this.damage(Math.round((-this._fall-13)*6),null),!D&&this._fall<-4&&((k=n.audio)==null||k.play("land",{pos:this.pos}),n.events.emit("noise",{x:this.pos.x,y:this.pos.y,z:this.pos.z,radius:this.crouching?4:12,source:"player",kind:"step"})),this.pos.y=E,this.vel.y<0&&(this.vel.y=0),this.onGround=!0):this.onGround=this.swimming,this._fall=this.vel.y;const M=Math.hypot(this.vel.x,this.vel.z);if((this.onGround||this.swimming)&&M>.5){this.stepAcc+=M*t;const z=c?1.05:this.crouching?.6:.8;if(this.stepAcc>z){this.stepAcc=0;const V=i.coverAt(this.pos.x,this.pos.z);let j=this.crouching?2.5:c?22:9;!this.crouching&&V>.45&&(j*=1.35),(this.wading>.2||this.swimming)&&(j=Math.max(j,14)),n.events.emit("noise",{x:this.pos.x,y:this.pos.y,z:this.pos.z,radius:j,source:"player",kind:"step"}),(N=n.audio)==null||N.step(this.swimming||this.wading>.2?"water":V>.45?"brush":i.sample(i.road,this.pos.x,this.pos.z)>.5?"gravel":"ground",c?1:this.crouching?.35:.65)}this.bob+=M*t*(c?1.6:1.9)}else this.bob=Re(this.bob,Math.round(this.bob/Math.PI)*Math.PI,6,t);(B=n.veg)==null||B.setPush(this.pos.x,this.pos.z,1.6,M>.3?1:.4);const S=n.camera,H=this.onGround?wt(M/7,0,1)*(this.crouching?.5:1):0;this.eye.set(this.pos.x,this.pos.y+this.height-.12,this.pos.z);const P=(Math.random()-.5)*this.shake*.12,K=(Math.random()-.5)*this.shake*.12;S.position.set(this.eye.x+Math.cos(this.yaw)*Math.sin(this.bob)*.035*H+P,this.eye.y+Math.abs(Math.cos(this.bob))*.045*H+K,this.eye.z-Math.sin(this.yaw)*Math.sin(this.bob)*.035*H),this.alive||(S.position.y=oe(S.position.y,this.pos.y+.3,.5)),S.rotation.order="YXZ",S.rotation.set(this.pitch+this.recoil,this.yaw,Math.sin(this.bob)*.006*H+(this.alive?0:.6)),S.updateMatrixWorld(),this.look.set(0,0,-1).applyQuaternion(S.quaternion),this.light.intensity=this.flashlight?60:0}}const _n={scanner:{slot:1,name:"Field Scanner",short:"SCAN",kind:"scanner",range:85,zoom:1.6,noise:0},pistol:{slot:2,name:"Tranq Pistol",short:"T-PST",kind:"projectile",dose:12,speed:62,gravity:9.8,mag:6,ammo:"pistolDart",reload:2,rof:.32,noise:6,spread:.012,aimSpread:.004,zoom:1.35,recoil:.012,lethal:!1},rifle:{slot:3,name:"Tranq Rifle",short:"T-RFL",kind:"projectile",dose:40,speed:105,gravity:9.8,mag:1,ammo:"rifleDart",reload:1.5,rof:.4,noise:9,spread:.01,aimSpread:6e-4,zoom:4,scope:!0,recoil:.025,lethal:!1},hunting:{slot:4,name:"Hunting Rifle",short:"RIFLE",kind:"hitscan",damage:110,mag:5,ammo:"rifleRound",reload:2.6,rof:1,noise:320,spread:.012,aimSpread:5e-4,zoom:4.5,scope:!0,recoil:.07,range:600,lethal:!0},shotgun:{slot:5,name:"Pump Shotgun",short:"SHTGN",kind:"hitscan",pellets:9,damage:17,mag:4,ammo:"shell",reload:2.6,rof:.8,noise:260,spread:.055,aimSpread:.04,zoom:1.2,recoil:.1,range:70,lethal:!0}},$c={head:{dose:1.4,damage:2.2,label:"HEAD"},neck:{dose:1.35,damage:1.4,label:"NECK"},torso:{dose:1,damage:1,label:"BODY"},limb:{dose:.75,damage:.6,label:"LEG"},tail:{dose:.5,damage:.5,label:"TAIL"}},jc={dose:0,damage:.25,label:"ARMOUR"},Kc={stone:{item:"stone",speed:19,noise:18,label:"Stone"},flare:{item:"flare",speed:15,noise:6,label:"Flare",burn:22,fear:14}};for(const s in _n)_n[s].id=s;class rx{constructor(t){this.events=t,this.items={},this.weapons=new Set}count(t){return this.items[t]||0}has(t,e=1){return this.count(t)>=e}add(t,e=1){const n=Bl[t],i=n?n.max:99,r=this.count(t),o=Math.min(i,r+e);this.items[t]=o;const a=o-r;return a>0&&this.events.emit("item:gained",{item:t,count:a}),a}take(t,e=1){return this.count(t)<e?!1:(this.items[t]-=e,!0)}giveWeapon(t){return this.weapons.has(t)?!1:(this.weapons.add(t),this.events.emit("weapon:gained",{weapon:t}),!0)}grant(t){const e=[];for(const[n,i]of Object.entries(t.items||{})){const r=this.add(n,i);r>0&&e.push(`${r} × ${Bl[n].name}`)}for(const n of t.weapons||[])this.giveWeapon(n)&&e.unshift(_n[n].name);return e}}class ox{constructor(t){this.G=t,this.items=new Map,this.dynamic=[],this.current=null,this.progress=0,this.holding=!1}add(t){return t.radius??(t.radius=2.2),t.hold??(t.hold=0),t.y??(t.y=0),this.items.set(t.id,t),t}remove(t){this.items.delete(t)}get(t){return this.items.get(t)}addProvider(t){this.dynamic.push(t)}update(t,e,n,i,r){const o=this.G;let a=null,l=1/0;const c=h=>{const d=h.dynamic?h.dynamic():h,f=d.x-e.x,m=d.y-e.y,g=d.z-e.z,x=Math.hypot(f,m,g);if(x>h.radius+.6)return;const p=(f*n.x+m*n.y+g*n.z)/(x||1);if(x>1.2&&p<.55)return;const _=x*(2-p);_<l&&(l=_,a=h)};for(const h of this.items.values())c(h);for(const h of this.dynamic)for(const d of h(o))c(d);if(a!==this.current&&(this.current=a,this.progress=0),!a){this.holding=!1;return}if((a.enabled?a.enabled(o):!0)!==!0){this.holding=!1,this.progress=0;return}a.hold>0?(this.holding=r,r?(this.progress+=t/a.hold,this.progress>=1&&(this.progress=0,this.fire(a))):this.progress=Math.max(0,this.progress-t*2)):i&&this.fire(a)}fire(t){t.onUse(this.G),t.once&&this.items.delete(t.id),this.current=null}prompt(){const t=this.current;if(!t)return null;const e=t.enabled?t.enabled(this.G):!0;return{label:typeof t.label=="function"?t.label(this.G):t.label,blocked:e===!0?null:e,hold:t.hold,progress:this.progress}}}function Hn(s,t={}){return new Ge({color:s,...t})}const qt={gun:Hn(2829615),steel:Hn(5593180),orange:Hn(14186026),yellow:Hn(14200880),wood:Hn(7029798),glove:Hn(3815978),sleeve:Hn(8024912),lens:new _s({color:3170464,shininess:100,specular:8956671}),fletch:Hn(16734752)};function ve(s,t,e,n,i,r,o,a=0,l=0,c=0){const u=new _t(new Ye(s,t,e),n);return u.position.set(i,r,o),u.rotation.set(a,l,c),u}function Xe(s,t,e,n,i,r,o=10,a=s){const l=new _t(new Qt(s,a,t,o),e);return l.rotation.x=Math.PI/2,l.position.set(n,i,r),l}function ys(s,t,e,n=-.02){s.add(ve(.05,.09,.08,qt.glove,0,-.06,t,.25)),s.add(ve(.06,.07,.24,qt.sleeve,.01,-.1,t+.15,.35)),e!=null&&(s.add(ve(.06,.05,.09,qt.glove,n,-.04,e,0,0,.2)),s.add(ve(.07,.07,.3,qt.sleeve,n-.06,-.1,e+.17,.25,.35,0)))}function ax(){const s=new ge;return s.add(ve(.035,.045,.2,qt.gun,0,.02,-.06)),s.add(Xe(.011,.08,qt.steel,0,.025,-.19)),s.add(Xe(.013,.12,qt.yellow,0,-.012,-.08)),s.add(ve(.032,.1,.045,qt.gun,0,-.04,.02,.25)),s.add(ve(.036,.008,.2,qt.orange,0,.044,-.06)),s.add(ve(.006,.012,.01,qt.gun,0,.05,-.15)),ys(s,.02,null),{g:s,muzzle:new L(0,.025,-.24),hip:new L(.17,-.17,-.38),ads:new L(0,-.075,-.3)}}function lx(){const s=new ge;s.add(ve(.05,.07,.34,qt.gun,0,0,-.05)),s.add(Xe(.014,.42,qt.steel,0,.012,-.42)),s.add(Xe(.02,.26,qt.yellow,0,-.04,-.2)),s.add(ve(.04,.1,.24,qt.orange,0,-.02,.22,.12)),s.add(ve(.035,.09,.05,qt.gun,0,-.07,.05,.3)),s.add(Xe(.022,.2,qt.gun,0,.07,-.06)),s.add(Xe(.019,.01,qt.lens,0,.07,-.16));const t=new ge;return t.add(Xe(.005,.06,qt.steel,0,0,0)),t.add(Xe(.012,.02,qt.fletch,0,0,.035,6,.004)),t.position.set(.028,.02,.02),s.add(t),ys(s,.06,-.24),{g:s,muzzle:new L(0,.012,-.64),hip:new L(.16,-.16,-.42),ads:new L(0,-.07,-.26),dart:t}}function cx(){const s=new ge;return s.add(ve(.045,.06,.3,qt.gun,0,0,-.06)),s.add(Xe(.012,.5,qt.gun,0,.01,-.45)),s.add(ve(.05,.06,.5,qt.wood,0,-.03,-.05)),s.add(ve(.045,.11,.24,qt.wood,0,-.04,.28,.15)),s.add(Xe(.024,.24,qt.gun,0,.07,-.06)),s.add(Xe(.02,.01,qt.lens,0,.07,-.18)),s.add(ve(.04,.012,.012,qt.steel,.035,.02,.06)),ys(s,.08,-.24),{g:s,muzzle:new L(0,.01,-.72),hip:new L(.16,-.16,-.42),ads:new L(0,-.07,-.26)}}function hx(){const s=new ge;return s.add(ve(.05,.07,.26,qt.gun,0,0,-.02)),s.add(Xe(.016,.5,qt.gun,0,.018,-.4)),s.add(Xe(.013,.4,qt.steel,0,-.016,-.34)),s.add(ve(.05,.05,.14,qt.wood,0,-.02,-.3)),s.add(ve(.045,.11,.26,qt.wood,0,-.04,.24,.15)),s.add(ve(.006,.01,.01,qt.steel,0,.04,-.62)),ys(s,.06,-.3),{g:s,muzzle:new L(0,.018,-.66),hip:new L(.16,-.17,-.42),ads:new L(0,-.06,-.3),pump:s.children[3]}}function ux(){const s=new ge,t=document.createElement("canvas");t.width=256,t.height=160;const e=new vr(t);e.colorSpace=me,s.add(ve(.15,.1,.025,qt.yellow,0,0,0,-.5));const n=new _t(new Qn(.125,.078),new gr({map:e,toneMapped:!1}));return n.position.set(0,.006,.0135),n.rotation.x=-.5,s.add(n),s.add(Xe(.004,.08,qt.gun,.06,.06,-.03)),s.add(ve(.04,.05,.05,qt.gun,0,-.06,.03,.2)),ys(s,.04,null),{g:s,muzzle:new L(0,0,-.1),hip:new L(.12,-.15,-.32),ads:new L(0,-.1,-.26),canvas:t,tex:e}}class dx{constructor(t){this.G=t,this.scene=new Hc,this.camera=new Oe(58,1,.01,5),this.hemi=new Wc(16777215,4210736,1.2),this.dir=new Ro(16777215,1.5),this.dir.position.set(.5,1,.3),this.scene.add(this.hemi,this.dir),this.root=new ge,this.scene.add(this.root),this.models={pistol:ax(),rifle:lx(),hunting:cx(),shotgun:hx(),scanner:ux()};for(const e of Object.values(this.models))e.g.visible=!1,this.root.add(e.g);this.current=null,this.off=new L,this.rot=new Zn,this.kick=0,this.swayX=0,this.swayY=0,this.lower=1,this.reloadDip=0,this.screenState=""}show(t){this.current&&(this.models[this.current].g.visible=!1),this.current=t,t&&(this.models[t].g.visible=!0)}fire(t){this.kick=Math.min(1.5,this.kick+t)}setAspect(t){this.camera.aspect=t,this.camera.updateProjectionMatrix()}drawScreen(t){const e=JSON.stringify(t);if(e===this.screenState)return;this.screenState=e;const n=this.models.scanner,i=n.canvas.getContext("2d");i.fillStyle="#0a1a14",i.fillRect(0,0,256,160),i.strokeStyle="#1f5a40";for(let r=0;r<160;r+=6)i.beginPath(),i.moveTo(0,r),i.lineTo(256,r),i.stroke();i.fillStyle="#6dfcb0",i.font="bold 20px monospace",i.fillText("FIELD SCANNER",12,28),i.font="16px monospace",i.fillText(t.line1||"NO TARGET",12,60),i.fillStyle="#a8ffd4",i.fillText(t.line2||"",12,84),t.progress!=null&&(i.strokeStyle="#6dfcb0",i.strokeRect(12,104,232,18),i.fillStyle="#6dfcb0",i.fillRect(14,106,228*Math.min(1,t.progress),14)),i.fillStyle="#6dfcb0",i.font="13px monospace",i.fillText(t.line3||"",12,146),n.tex.needsUpdate=!0}update(t,e){e.id!==this.current&&this.show(e.id);const n=this.current&&this.models[this.current];if(!n)return;this.kick=Re(this.kick,0,12,t),this.swayX=Re(this.swayX,-e.look.dx*.6,8,t),this.swayY=Re(this.swayY,e.look.dy*.6,8,t),this.lower=Re(this.lower,e.switching||e.hidden?1:0,14,t),this.reloadDip=Re(this.reloadDip,e.reloading?1:0,8,t);const i=e.aim,r=n.hip.clone().lerp(n.ads,i),o=e.moving*(1-i*.85)*(e.sprint?1.6:1);this.root.position.set(r.x+Math.sin(e.bob)*.012*o+this.swayX*.02,r.y+Math.abs(Math.cos(e.bob))*.01*o-this.lower*.35-this.reloadDip*.08+this.swayY*.02-(e.sprint?.04:0),r.z+this.kick*.05),this.root.rotation.set(this.kick*.18-this.reloadDip*.6+(e.sprint?-.25:0),this.swayX*.05+(e.sprint?.5:0),this.reloadDip*.35+this.swayX*.05),n.dart&&(n.dart.visible=e.loaded),this.hemi.intensity=.4+e.light*1,this.dir.intensity=.3+e.light*1.5}render(t){t.clearDepth(),t.render(this.scene,this.camera)}}const rc=new L,oc=new L,ac=new L;class fx{constructor(t){this.G=t,this.current="scanner",this.mag={pistol:_n.pistol.mag,rifle:0,hunting:0,shotgun:0},this.aim=0,this.fireCool=0,this.reloadT=0,this.switchT=0,this.pending=null,this.vm=new dx(t),this.scan={target:null,progress:0},this.throwCool=0,this.baseFov=72,t.events.on("weapon:gained",({weapon:e})=>{if(this.mag[e]===0&&e!=="scanner"){const n=_n[e],i=Math.min(n.mag,t.inventory.count(n.ammo));t.inventory.take(n.ammo,i),this.mag[e]=i}})}get def(){return _n[this.current]}owned(){return Object.values(_n).filter(t=>this.G.inventory.weapons.has(t.id)).sort((t,e)=>t.slot-e.slot)}select(t){var e;t===this.current||!this.G.inventory.weapons.has(t)||(this.pending=t,this.switchT=.32,this.reloadT=0,this.scan.progress=0,(e=this.G.audio)==null||e.play("switch"))}zoomFactor(){return 1+((this.def.zoom||1)-1)*this.aim}scoped(){return!!this.def.scope&&this.aim>.92&&this.switchT<=0}canFire(){var e;const t=this.G.player;return t.alive&&!t.swimming&&!((e=this.G.heli)!=null&&e.piloted)&&this.switchT<=0&&this.reloadT<=0}update(t,e){var c,u,h,d;const n=this.G,i=n.player;this.fireCool-=t,this.throwCool-=t;const r=i.alive&&!((c=n.heli)!=null&&c.piloted);if(r){const f=this.owned();for(const m of f)e.pressed("slot"+m.slot)&&this.select(m.id);if(e.pressed("nextWeapon")||e.pressed("prevWeapon")){const m=f.findIndex(p=>p.id===(this.pending||this.current)),g=f.length,x=(m+(e.pressed("nextWeapon")?1:-1)+g)%g;this.select(f[x].id)}}this.switchT>0&&(this.switchT-=t,this.switchT<=.16&&this.pending&&(this.current=this.pending,this.pending=null));const o=this.def,a=r&&e.down("aim")&&this.switchT<=0&&!i.swimming;if(this.aim=Re(this.aim,a?1:0,12,t),n.camera.fov=this.baseFov/this.zoomFactor(),n.camera.updateProjectionMatrix(),this.reloadT>0){if(this.reloadT-=t,this.reloadT<=0){const f=o.mag-this.mag[o.id],m=Math.min(f,n.inventory.count(o.ammo));n.inventory.take(o.ammo,m),this.mag[o.id]+=m}}else r&&o.ammo&&e.pressed("reload")&&this.startReload();o.kind==="scanner"?this.updateScanner(t,e,r):r&&e.pressed("fire")&&this.fireCool<=0&&this.canFire()&&(this.mag[o.id]>0?this.fire(o):((u=n.audio)==null||u.play("empty"),this.startReload())),r&&this.throwCool<=0&&(e.pressed("throwStone")&&this.throwIt("stone"),e.pressed("throwFlare")&&this.throwIt("flare")),r&&e.pressed("medkit")&&(i.health>=100?n.toast("Already at full health","info"):n.inventory.take("medkit")?(i.heal(45),(h=n.audio)==null||h.play("medkit"),n.toast("Patched up (+45)","info")):n.toast("No medkits","warn"));const l=Math.hypot(i.vel.x,i.vel.z);this.vm.update(t,{id:(d=n.heli)!=null&&d.piloted?null:this.current,aim:this.aim,bob:i.bob,moving:i.onGround?Math.min(1,l/5):0,sprint:e.down("sprint")&&l>5,look:i.lastLook||{dx:0,dy:0},reloading:this.reloadT>0,switching:this.switchT>0,hidden:!i.alive||i.swimming||this.scoped(),loaded:this.mag.rifle>0&&this.reloadT<=0,light:n.sky.light})}startReload(){var e;const t=this.def;if(!(!t.ammo||this.reloadT>0)&&!(this.mag[t.id]>=t.mag)){if(this.G.inventory.count(t.ammo)<=0){this.G.toast(`Out of ${t.name} ammo`,"warn");return}this.reloadT=t.reload,(e=this.G.audio)==null||e.play("reload")}}aimRay(t){const e=this.G.camera;rc.set(0,0,-1).applyQuaternion(e.quaternion),oc.set(1,0,0).applyQuaternion(e.quaternion),ac.set(0,1,0).applyQuaternion(e.quaternion);const n=Math.random()*Math.PI*2,i=Math.sqrt(Math.random())*t;return rc.clone().addScaledVector(oc,Math.cos(n)*i).addScaledVector(ac,Math.sin(n)*i).normalize()}muzzleWorld(){const t=this.G.camera;return new L(.12*(1-this.aim),-.08*(1-this.aim)-.03,-.5).applyQuaternion(t.quaternion).add(t.position)}fire(t){var a;const e=this.G,n=e.player;this.mag[t.id]--,this.fireCool=t.rof;const i=Math.hypot(n.vel.x,n.vel.z)/4,r=(t.spread+(t.aimSpread-t.spread)*this.aim)*(1+i*.8)*(n.crouching?.7:1),o=e.camera;if(t.kind==="projectile"){const l=this.aimRay(r),c=o.position.clone().addScaledVector(l,.4);e.projectiles.spawnDart(c,l.multiplyScalar(t.speed),t)}else{const l=t.pellets||1;for(let c=0;c<l;c++)this.hitscan(t,this.aimRay(r));e.fx.muzzle(this.muzzleWorld(),!0)}n.recoil+=t.recoil,this.vm.fire(t.recoil*8),(a=e.audio)==null||a.play(t.id,{pos:n.pos}),e.events.emit("noise",{x:n.pos.x,y:n.pos.y,z:n.pos.z,radius:t.noise,source:"player",kind:t.noise>60?"gunshot":"shot"}),e.events.emit("weapon:fired",{weapon:t.id}),this.mag[t.id]===0&&e.inventory.count(t.ammo)>0&&setTimeout(()=>this.current===t.id&&this.startReload(),350)}hitscan(t,e){var c;const n=this.G,i=n.camera.position,r=t.range||300,o=n.ecology.raycast(i,e,r),a=n.physics.raycast(i.x,i.y,i.z,e.x,e.y,e.z,o?o.t:r),l=i.clone().addScaledVector(e,a?a.t:o?o.t:r);if(Math.random()<.5&&n.fx.tracer(this.muzzleWorld(),l),o&&(!a||o.t<a.t)){const u=o.zone==="armor"?jc:$c[o.zone],h=t.damage*u.damage;o.creature.takeHit(n,{damage:h,zone:o.zone,weapon:t.id,from:n.player.pos}),n.fx.blood(l),n.events.emit("dart:hit",{creature:o.creature,zone:u.label,damage:h}),(c=n.audio)==null||c.play("fleshHit",{pos:l})}else a&&(n.island.waterAt(l.x,l.z)>l.y-.1?n.fx.splash(l):n.fx.dust(l,6))}updateScanner(t,e,n){const i=this.G,r=this.def,o=this.scan;let a={line1:"NO TARGET",line2:"Hold [LMB] on an animal",line3:""};if(n&&this.switchT<=0){const l=i.camera.position,c=this.aimRay(0),u=i.ecology.raycast(l,c,r.range),h=u&&i.physics.raycast(l.x,l.y,l.z,c.x,c.y,c.z,u.t),d=u&&!h?u.creature:null;if(d){const f=i.science.known(d.sp.id);a={line1:f?d.sp.name.toUpperCase():"UNKNOWN SPECIES",line2:d.rec.scanned?"CATALOGUED":`${Math.round(u.t)} m — hold to scan`,line3:f?`${d.sp.temperament.toUpperCase()}  KO ${d.sp.sedation.ko}u`:""},e.down("fire")&&!d.rec.scanned?(o.target!==d&&(o.target=d,o.progress=0),o.progress+=t/(1+u.t/50),a.progress=o.progress,o.progress>=1&&(i.science.scan(d),o.progress=0,o.target=null)):o.progress=Math.max(0,o.progress-t)}else o.progress=Math.max(0,o.progress-t*2)}this.scanning=o.progress>0,this.vm.drawScreen(a)}throwIt(t){var o;const e=this.G,n=Kc[t];if(!e.inventory.take(n.item)){e.toast(`No ${n.label.toLowerCase()}s left`,"warn");return}this.throwCool=.6;const i=this.aimRay(0);i.y+=.18,i.normalize();const r=e.camera.position.clone().addScaledVector(i,.5);e.projectiles.throw(t,r,i.multiplyScalar(n.speed).add(e.player.vel.clone().multiplyScalar(.5))),(o=e.audio)==null||o.play("throw"),this.vm.fire(.4)}}const ze=new L,fe=new L;function px(){const s=new ge,t=new _t(new Qt(.008,.008,.11,5),new Ge({color:11580600}));t.rotation.x=Math.PI/2;const e=new _t(new Te(.02,.04,6),new Ge({color:16734752,emissive:4198400}));return e.rotation.x=-Math.PI/2,e.position.z=.06,s.add(t,e),s}class mx{constructor(t){this.G=t,this.darts=[],this.stuck=[],this.thrown=[],this.flares=[],this.flareLights=[0,1].map(()=>{const e=new qo(16728096,0,26,1.8);return t.scene.add(e),e})}spawnDart(t,e,n){const i=px();i.position.copy(t),this.G.scene.add(i),this.darts.push({mesh:i,pos:t.clone(),vel:e.clone(),weapon:n,life:6})}throw(t,e,n){const i=Kc[t],r=t==="flare"?new _t(new Qt(.025,.025,.22,6),new Ge({color:12591120,emissive:8392704})):new _t(new ti(.06,0),new Ge({color:7827558}));r.position.copy(e),this.G.scene.add(r),this.thrown.push({kind:t,def:i,mesh:r,pos:e.clone(),vel:n.clone(),life:8,bounces:0,spin:new L(Math.random()*8,Math.random()*8,0)})}update(t){var n;const e=this.G;for(let i=this.darts.length-1;i>=0;i--){const r=this.darts[i],o=r.weapon;r.life-=t,r.vel.y-=o.gravity*t,ze.copy(r.pos),fe.copy(r.vel).multiplyScalar(t);const a=fe.length();fe.divideScalar(a||1);const l=e.ecology.raycast(ze,fe,a),c=e.physics.raycast(ze.x,ze.y,ze.z,fe.x,fe.y,fe.z,a),u=e.island.waterAt(r.pos.x,r.pos.z);if(l&&(!c||l.t<c.t)){const h=ze.clone().addScaledVector(fe,l.t);this.dartHitsCreature(r,l,h),this.darts.splice(i,1);continue}if(c){const h=ze.clone().addScaledVector(fe,c.t);r.mesh.position.copy(h).addScaledVector(fe,-.04),r.mesh.lookAt(h.clone().sub(fe)),this.stuck.push({mesh:r.mesh,t:25}),e.fx.dust(h,3),(n=e.audio)==null||n.play("dartMiss",{pos:h}),e.events.emit("noise",{x:h.x,y:h.y,z:h.z,radius:9,source:"impact",kind:"impact"}),this.darts.splice(i,1);continue}if(r.pos.y<u){e.fx.splash(r.pos),this.remove(r.mesh),this.darts.splice(i,1);continue}r.pos.addScaledVector(r.vel,t),r.mesh.position.copy(r.pos),r.mesh.lookAt(ze.copy(r.pos).sub(r.vel)),r.life<=0&&(this.remove(r.mesh),this.darts.splice(i,1))}for(let i=this.stuck.length-1;i>=0;i--){const r=this.stuck[i];r.t-=t,(r.t<=0||r.creature&&r.creature.disposed)&&(r.mesh.parent&&r.mesh.parent.remove(r.mesh),this.stuck.splice(i,1))}for(let i=this.thrown.length-1;i>=0;i--){const r=this.thrown[i];r.life-=t,r.vel.y-=14*t,ze.copy(r.pos),fe.copy(r.vel).multiplyScalar(t);const o=fe.length();fe.divideScalar(o||1);const a=e.physics.raycast(ze.x,ze.y,ze.z,fe.x,fe.y,fe.z,o+.05),l=e.ecology.raycast(ze,fe,o);if(l&&(!a||l.t<a.t)&&r.bounces===0){const u=l.creature;u.perception.alertTo(e.player.pos,u.perception.awareness+.5),r.vel.multiplyScalar(-.2),r.bounces++,this.land(r,ze.clone().addScaledVector(fe,l.t))}else if(a){const u=ze.clone().addScaledVector(fe,a.t);r.pos.copy(u).addScaledVector(fe,-.05),r.bounces===0&&this.land(r,u),r.bounces++,r.vel.multiplyScalar(.3),r.vel.y=Math.abs(r.vel.y)*.4,(r.vel.length()<1||r.bounces>3)&&r.vel.set(0,0,0)}else r.pos.addScaledVector(r.vel,t);const c=e.physics.groundAt(r.pos.x,r.pos.z,r.pos.y+.3);r.pos.y<c+.03&&(r.pos.y=c+.03,r.vel.set(0,0,0)),r.mesh.position.copy(r.pos),r.vel.lengthSq()>.1&&(r.mesh.rotation.x+=r.spin.x*t,r.mesh.rotation.y+=r.spin.y*t),r.kind==="stone"&&(r.life<=0||r.vel.lengthSq()===0&&r.life<6)?(this.remove(r.mesh),this.thrown.splice(i,1)):r.kind==="flare"&&r.landed&&(this.thrown.splice(i,1),this.flares.push({mesh:r.mesh,pos:r.pos,t:r.def.burn,fear:r.def.fear,puff:0}))}for(const i of this.flareLights)i.intensity=0;for(let i=this.flares.length-1;i>=0;i--){const r=this.flares[i];r.t-=t,r.puff-=t,r.puff<=0&&(r.puff=.06,e.fx.flareSmoke(r.pos));const o=this.flareLights[i%2];o&&(o.position.set(r.pos.x,r.pos.y+.6,r.pos.z),o.intensity=80*Math.min(1,r.t/3)*(.85+Math.random()*.3)),r.t<=0&&(this.remove(r.mesh),this.flares.splice(i,1))}}land(t,e){var i;const n=this.G;t.landed||(t.landed=!0,n.island.waterAt(e.x,e.z)>e.y&&(n.fx.splash(e),t.kind==="flare"&&(t.def={...t.def,burn:.1})),(i=n.audio)==null||i.play(t.kind==="flare"?"flare":"stone",{pos:e}),n.events.emit("noise",{x:e.x,y:e.y,z:e.z,radius:t.def.noise,source:t.kind,kind:"distraction"}))}dartHitsCreature(t,e,n){var l,c;const i=this.G,r=e.creature,o=e.zone==="armor"?jc:$c[e.zone],a=t.weapon.dose*o.dose;if(a<=0){i.fx.sparks(n),(l=i.audio)==null||l.play("ricochet",{pos:n}),i.events.emit("dart:hit",{creature:r,zone:"ARMOUR",dose:0}),this.remove(t.mesh);return}r.takeHit(i,{dose:a,zone:e.zone,weapon:t.weapon.id,from:i.player.pos}),i.events.emit("dart:hit",{creature:r,zone:o.label,dose:a}),i.fx.dartHit(n),(c=i.audio)==null||c.play("dartHit",{pos:n}),t.mesh.position.copy(n),t.mesh.lookAt(n.clone().sub(t.vel)),e.sphere.boneObj.attach(t.mesh),this.stuck.push({mesh:t.mesh,t:60,creature:r})}remove(t){t.parent&&t.parent.remove(t)}nearestFlare(t,e){let n=null;for(const i of this.flares){const r=Math.hypot(i.pos.x-t,i.pos.z-e);(!n||r<n.d)&&(n={x:i.pos.x,z:i.pos.z,d:r,fear:i.fear})}return n}nearestFlareTo(t,e){return this.nearestFlare(t,e)}}const mo={blood:{label:"Draw blood sample",hold:3.2},measure:{label:"Take measurements",hold:2.4},tag:{label:"Attach tracking tag",hold:2.8},tissue:{label:"Take tissue sample",hold:3}},gx=["blood","measure","tag"];class xx{constructor(t){this.G=t,this.catalogue=new Set,t.interact.addProvider(()=>this.procedures())}known(t){return this.catalogue.has(t)}scan(t){var o;const e=this.G;if(t.rec.scanned)return;t.rec.scanned=!0;const n=!this.catalogue.has(t.sp.id);this.catalogue.add(t.sp.id);const i=t.perception.awareness<.35&&t.vitals.conscious;let r=n?t.sp.science.scan:Math.round(t.sp.science.scan*.3);i&&(r=Math.round(r*1.25)),e.events.emit("science:scan",{creature:t,first:n,points:r,unaware:i}),(o=e.audio)==null||o.play("scan"),e.toast(n?`New species catalogued: ${t.sp.name}`:`${t.sp.name} individual logged`,"science")}nextProcedure(t){const e=t.rec;if(!t.vitals.alive)return e.science.tissue||e.science.blood?null:"tissue";for(const n of gx)if(!e.science[n])return n;return null}procedures(){var i;const t=this.G,e=[];if((i=t.heli)!=null&&i.piloted)return e;const n=t.player.pos;for(const r of t.ecology.active)r.vitals.conscious||Math.hypot(r.pos.x-n.x,r.pos.z-n.z)>r.radius+4||e.push(this.interactableFor(r));return e}interactableFor(t){return t._sci||(t._sci={id:"sci:"+t.rec.id,radius:t.radius+2.6,dynamic:()=>{const e=t.center();return e.y=Math.min(e.y,t.pos.y+1.2),e},label:()=>{const e=this.nextProcedure(t);if(!e)return`${t.sp.name}: fully processed`;const n=t.vitals.alive&&t.vitals.sedation<.8?" — WAKING SOON":"";return`${mo[e].label} — ${t.sp.name}${n}`},enabled:()=>this.nextProcedure(t)?t.vitals.alive&&t.vitals.conscious?"It is awake!":!0:"Nothing more to collect",onUse:()=>this.perform(t)}),t._sci.hold=mo[this.nextProcedure(t)||"blood"].hold,t._sci}perform(t){var a;const e=this.G,n=this.nextProcedure(t);if(!n)return;t.rec.scanned||this.scan(t),t.rec.science[n]=!0;const i=t.sp.science;let r=n==="tissue"?Math.round(i.blood*.3):i[n];const o=n!=="tissue"&&!t.rec.spotted;o&&(r=Math.round(r*1.5)),n==="tag"&&(t.rec.tagged=!0),e.events.emit("science:done",{creature:t,procedure:n,points:r,ghost:o}),(a=e.audio)==null||a.play("sample"),e.toast(`${mo[n].label} — ${t.sp.name}${o?" (unseen)":""}`,"science")}summary(){const t=this.G,e={};for(const n in Ln)e[n]={scanned:this.catalogue.has(n),blood:t.stats.get("blood:"+n),measure:t.stats.get("measure:"+n),tag:t.stats.get("tag:"+n),tissue:t.stats.get("tissue:"+n),kills:t.stats.get("kill:"+n)};return e}}class vx{constructor(t,e,n){this.G=t,this.pos=e.clone(),this.vel=new L,this.yaw=n,this.pitch=0,this.roll=0,this.rpm=0,this.fuel=0,this.health=100,this.piloted=!1,this.onGround=!0,this.view="chase",this.camYaw=n,this.camPitch=-.15,this.noiseT=0,this.rotorAngle=0,this.lookPitch=0,this.buildModel(),this.collider=null,this.parkCollider(),t.interact.add({id:"heli",label:()=>this.fuel>.02?"Board helicopter":"Helicopter — tank is dry",hold:0,radius:4.2,dynamic:()=>({x:this.pos.x,y:this.pos.y+1.2,z:this.pos.z}),enabled:()=>this.piloted?"In use":this.fuel<=.02?t.flags.get("labPower")?"Refuel at the pad pump":"No fuel — the pump needs power":!0,onUse:()=>this.enter()})}buildModel(){const t=new ge,e=new Ge({map:Vi([200,112,46])}),n=new Ge({map:Vi([214,210,196])}),i=new Ge({color:2763306}),r=new _s({color:2243140,transparent:!0,opacity:.55,shininess:120,specular:10075084}),o=new _t(new an(1,18,12),e);o.scale.set(1.15,1.05,1.75),o.position.set(0,1.55,.2);const a=new _t(new an(1,18,12,0,Math.PI*2,0,Math.PI*.62),r);a.scale.set(1.12,1,1.25),a.rotation.x=-Math.PI/2+.25,a.position.set(0,1.75,-.55);const l=new _t(new Qt(1.16,1.16,.25,18,1,!0),n);l.rotation.x=Math.PI/2,l.scale.set(1,1,.92),l.position.set(0,1.35,.9);const c=new _t(new Qt(.16,.36,5.6,10),e);c.rotation.x=Math.PI/2,c.position.set(0,1.8,4.3);const u=new _t(new Ye(.1,1.3,.8),n);u.position.set(0,2.3,6.9),u.rotation.x=-.35;const h=new _t(new Ye(1.4,.06,.4),n);h.position.set(0,1.85,6.1);const d=new _t(new Ye(1,.6,1.6),i);d.position.set(0,2.6,1);const f=new _t(new Qt(.09,.12,.6,8),i);f.position.set(0,3.1,.4),t.add(o,a,l,c,u,h,d,f);for(const p of[-1,1]){const _=new _t(new Qt(.06,.06,3.6,6),i);_.rotation.x=Math.PI/2,_.position.set(p*1.05,.08,.2),t.add(_);for(const v of[-.7,1.1]){const y=new _t(new Qt(.05,.05,.75,5),i);y.position.set(p*.9,.42,v),y.rotation.z=p*.35,t.add(y)}}const m=new ge;m.position.set(0,3.42,.4);for(let p=0;p<2;p++){const _=new _t(new Ye(.28,.04,5.4),i);_.position.z=2.75;const v=new ge;v.rotation.y=p*Math.PI,v.add(_),m.add(v)}const g=new _t(new Wo(5.5,32),new gr({color:1118481,transparent:!0,opacity:0,depthWrite:!1,side:qe}));g.rotation.x=-Math.PI/2,m.add(g),this.disc=g,t.add(m);const x=new ge;x.position.set(.12,2.25,7);for(let p=0;p<2;p++){const _=new _t(new Ye(.03,1.1,.12),i);_.rotation.x=p*Math.PI,_.position.y=0,x.add(_)}t.add(x),t.traverse(p=>{p.isMesh&&p!==g&&(p.castShadow=!0)}),this.rotor=m,this.tail=x,this.model=t,t.rotation.order="YXZ",this.G.scene.add(t),this.sync()}parkCollider(){this.collider&&this.G.physics.remove(this.collider),this.collider=this.G.physics.addBox(this.pos.x,this.pos.z,1.3,2.2,this.yaw,this.pos.y+.2,this.pos.y+2.6,{walkable:!1,tag:"heli"})}enter(){const t=this.G;this.piloted=!0,this.collider&&(t.physics.remove(this.collider),this.collider=null),this.camYaw=this.yaw,t.events.emit("heli:enter",{}),t.toast("Space: climb · Shift: descend · W/S: pitch · A/D: slide · Mouse: turn · V: camera · E: exit (landed)","info",7)}exit(){const t=this.G;if(!this.onGround||this.vel.length()>2.5){t.toast("Land first","warn");return}this.piloted=!1;const e=new L(Math.cos(this.yaw)*2.6,0,-Math.sin(this.yaw)*2.6),n=this.pos.clone().sub(e);n.y=t.physics.groundAt(n.x,n.z,this.pos.y+2),t.player.teleport(n,this.yaw),t.player.pitch=0,this.parkCollider(),t.events.emit("heli:exit",{})}damage(t){this.health=Math.max(0,this.health-t),this.G.player.shake=Math.min(1,this.G.player.shake+t/40),this.health<=0&&this.piloted&&this.G.toast("Engine failure! Autorotating...","warn")}update(t,e){var w;const n=this.G,i=n.island,r=this.fuel>0&&this.health>0;this.rpm=Re(this.rpm,this.piloted&&r?1:0,this.piloted?.7:.4,t),this.rotorAngle+=this.rpm*t*38,this.rotor.rotation.y=this.rotorAngle,this.tail.rotation.x=this.rotorAngle*1.7,this.disc.material.opacity=wt((this.rpm-.5)*.5,0,.22);for(const E of this.rotor.children)E.isGroup&&(E.visible=this.rpm<.85||Math.random()<.5);let o=0,a=0,l=0;if(this.piloted){o=e.axis("back","forward"),a=e.axis("left","right"),l=(e.down("ascend")?1:0)-(e.down("descend")?1:0);const E=e.look();n.player.lastLook=E,this.yaw-=E.dx*1.1*Math.max(.15,this.rpm),this.lookPitch=wt(this.lookPitch-E.dy,-.9,.6),e.pressed("camera")&&(this.view=this.view==="chase"?"cockpit":"chase"),e.pressed("interact")&&this.exit(),this.fuel=Math.max(0,this.fuel-t/420),this.fuel<=0&&r&&n.toast("Out of fuel!","warn")}const c=this.rpm,u=this.onGround?0:o*.32,h=this.onGround?0:a*.28;this.pitch=Re(this.pitch,u,3,t),this.roll=Re(this.roll,h,3,t);const d=Vn(this.yaw),f=Wn(this.yaw),m=Math.cos(this.yaw),g=-Math.sin(this.yaw),x=(d*this.pitch+m*this.roll)*42*c,p=(f*this.pitch+g*this.roll)*42*c;let _=-9.8+9.8*c+l*9*c;!r&&!this.onGround&&(_=-6-this.vel.y*.8),this.vel.x+=(x-this.vel.x*.33)*t,this.vel.z+=(p-this.vel.z*.33)*t,this.vel.y+=(_-this.vel.y*1.1)*t,this.pos.addScaledVector(this.vel,t),this.pos.y=Math.min(this.pos.y,430),this.pos.x=wt(this.pos.x,-i.half+30,i.half-30),this.pos.z=wt(this.pos.z,-i.half+30,i.half-30);const v=this.pos.clone();if(n.physics.collideCircle(this.pos,2.2,this.pos.y+.3,this.pos.y+3.4)){const E=this.vel.length();E>6&&this.damage((E-6)*4);const D=this.pos.clone().sub(v);if(D.lengthSq()>0){D.normalize();const M=this.vel.dot(D);M<0&&this.vel.addScaledVector(D,-M*1.4)}}const y=Math.max(n.physics.groundAt(this.pos.x,this.pos.z,this.pos.y+1.5),i.waterAt(this.pos.x,this.pos.z)-.2);if(this.pos.y<=y){const E=-this.vel.y;E>5.5&&this.damage((E-5.5)*14),this.pos.y=y,this.vel.y<0&&(this.vel.y=0),this.vel.x*=Math.max(0,1-t*4),this.vel.z*=Math.max(0,1-t*4),this.onGround=!0}else this.onGround=this.pos.y-y<.05;const A=this.pos.y-y;this.piloted&&A>8&&!n.flags.get("heliFlown")&&n.flags.set("heliFlown"),this.rpm>.3&&(this.noiseT-=t,this.noiseT<=0&&(this.noiseT=.6,n.events.emit("noise",{x:this.pos.x,y:this.pos.y,z:this.pos.z,radius:150*this.rpm*wt(1.4-A/150,.3,1),source:"player",kind:"vehicle"})),A<14&&Math.random()<this.rpm&&n.fx.rotorDust({x:this.pos.x,y,z:this.pos.z},6),this.piloted&&n.veg.setPush(this.pos.x,this.pos.z,22,this.rpm*wt(1.5-A/25,0,1.5))),(w=n.audio)==null||w.setRotor(this.rpm,this.pos,this.piloted&&this.view==="cockpit"),this.sync()}sync(){this.model.position.copy(this.pos),this.model.rotation.set(-this.pitch,this.yaw,-this.roll)}updateCamera(t,e){if(this.view==="cockpit"){const n=new L(-.35,1.9,-.55).applyEuler(this.model.rotation).add(this.pos);t.position.copy(n),t.rotation.order="YXZ",t.rotation.set(this.pitch*.6+this.lookPitch*.8,this.yaw,-this.roll*.8)}else{this.camYaw=Fm(this.camYaw,this.yaw,3,e);const n=15,i=5.5+this.lookPitch*-6,r=this.pos.x-Vn(this.camYaw)*n,o=this.pos.z-Wn(this.camYaw)*n;let a=this.pos.y+i;a=Math.max(a,this.G.island.heightAt(r,o)+1.5),t.position.set(oe(t.position.x,r,Math.min(1,e*8)),oe(t.position.y,a,Math.min(1,e*8)),oe(t.position.z,o,Math.min(1,e*8))),t.lookAt(this.pos.x+Vn(this.camYaw)*8,this.pos.y+1.5,this.pos.z+Wn(this.camYaw)*8)}t.updateMatrixWorld()}}const go=(s,t,e)=>s<t?t:s>e?e:s;class _x{constructor(){this.ctx=null,this.enabled=!0,this.volume=.8,this.listener={x:0,y:0,z:0,yaw:0},this.loops=[],this.birdT=2,this.roarT=30,this.heartT=0,this.frogT=3}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const t=window.AudioContext||window.webkitAudioContext;if(!t)return;const e=this.ctx=new t;this.master=e.createGain(),this.master.gain.value=this.volume;const n=e.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=4,this.master.connect(n).connect(e.destination);const i=e.sampleRate*2;this.noise=e.createBuffer(1,i,e.sampleRate);const r=this.noise.getChannelData(0);for(let l=0;l<i;l++)r[l]=Math.random()*2-1;this.echo=e.createDelay(1),this.echo.delayTime.value=.32;const o=e.createGain();o.gain.value=.32;const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=1400,this.echo.connect(a).connect(o).connect(this.echo),a.connect(this.master),this.startAmbience()}setVolume(t){this.volume=t,this.master&&(this.master.gain.value=t)}setListener(t,e){this.listener.x=t.x,this.listener.y=t.y,this.listener.z=t.z,this.listener.yaw=e}spatial(t,e){if(!t)return{gain:1,pan:0,cutoff:2e4};const n=this.listener,i=t.x-n.x,r=t.z-n.z,o=(t.y??n.y)-n.y,a=Math.hypot(i,o,r),l=Math.pow(go(1-a/e,0,1),1.7),c=Math.cos(n.yaw),u=-Math.sin(n.yaw),h=a>.5?go((i*c+r*u)/a,-1,1)*.85:0;return{gain:l,pan:h,cutoff:go(18e3-a*40,600,18e3)}}out(t,e,n,i,r=0){const o=this.ctx,a=this.spatial(e,n);if(a.gain*i<.002)return null;const l=o.createGain();l.gain.value=a.gain*i;const c=o.createBiquadFilter();c.type="lowpass",c.frequency.value=a.cutoff;const u=o.createStereoPanner();if(u.pan.value=a.pan,t.connect(c).connect(l).connect(u).connect(this.master),r){const h=o.createGain();h.gain.value=r*a.gain*i,u.connect(h).connect(this.echo)}return l}burst({dur:t=.1,type:e="bandpass",freq:n=1e3,q:i=1,vol:r=.5,attack:o=.002,pos:a,max:l=60,echo:c=0,sweep:u=0,delay:h=0}){const d=this.ctx,f=d.currentTime+h,m=d.createBufferSource();m.buffer=this.noise,m.playbackRate.value=.8+Math.random()*.4;const g=d.createBiquadFilter();g.type=e,g.frequency.setValueAtTime(n,f),u&&g.frequency.exponentialRampToValueAtTime(Math.max(40,n*u),f+t),g.Q.value=i;const x=d.createGain();x.gain.setValueAtTime(1e-4,f),x.gain.exponentialRampToValueAtTime(1,f+o),x.gain.exponentialRampToValueAtTime(1e-4,f+t),m.connect(g).connect(x),this.out(x,a,l,r,c)&&(m.start(f,Math.random()*1.5),m.stop(f+t+.05))}tone({type:t="sine",f0:e=440,f1:n=e,dur:i=.2,vol:r=.3,attack:o=.005,pos:a,max:l=60,echo:c=0,delay:u=0,vibrato:h=0,filter:d=0}){const f=this.ctx,m=f.currentTime+u,g=f.createOscillator();if(g.type=t,g.frequency.setValueAtTime(e,m),g.frequency.exponentialRampToValueAtTime(Math.max(20,n),m+i),h){const _=f.createOscillator();_.frequency.value=5.5;const v=f.createGain();v.gain.value=e*h,_.connect(v).connect(g.frequency),_.start(m),_.stop(m+i+.05)}const x=f.createGain();x.gain.setValueAtTime(1e-4,m),x.gain.exponentialRampToValueAtTime(1,m+o),x.gain.setValueAtTime(1,m+Math.max(o,i*.6)),x.gain.exponentialRampToValueAtTime(1e-4,m+i);let p=g;if(d){const _=f.createBiquadFilter();_.type="lowpass",_.frequency.value=d,g.connect(_),p=_}p.connect(x),this.out(x,a,l,r,c)&&(g.start(m),g.stop(m+i+.05))}play(t,e={}){if(!this.ctx||!this.enabled)return;const n=e.pos;switch(t){case"pistol":this.burst({dur:.09,type:"highpass",freq:1800,vol:.35}),this.tone({type:"square",f0:900,f1:300,dur:.03,vol:.05});break;case"rifle":this.burst({dur:.16,type:"bandpass",freq:900,q:.7,vol:.5,sweep:.4}),this.tone({f0:140,f1:60,dur:.1,vol:.25});break;case"hunting":this.burst({dur:.6,type:"lowpass",freq:3500,vol:1,echo:.8,sweep:.15}),this.tone({f0:110,f1:35,dur:.35,vol:.7}),this.burst({dur:.08,type:"highpass",freq:3e3,vol:.12,delay:.55});break;case"shotgun":this.burst({dur:.7,type:"lowpass",freq:2600,vol:1,echo:.9,sweep:.12}),this.tone({f0:90,f1:30,dur:.4,vol:.8}),this.burst({dur:.06,type:"bandpass",freq:1400,q:3,vol:.2,delay:.42}),this.burst({dur:.06,type:"bandpass",freq:1100,q:3,vol:.2,delay:.55});break;case"reload":for(let i=0;i<3;i++)this.burst({dur:.04,type:"bandpass",freq:2200+i*400,q:6,vol:.18,delay:i*.28+.1});break;case"empty":case"click":this.burst({dur:.03,type:"bandpass",freq:3e3,q:8,vol:.2});break;case"switch":this.burst({dur:.06,type:"bandpass",freq:1200,q:3,vol:.12});break;case"dartHit":this.tone({f0:220,f1:90,dur:.07,vol:.4,pos:n,max:70});break;case"dartMiss":this.burst({dur:.05,type:"bandpass",freq:900,q:2,vol:.3,pos:n,max:50});break;case"ricochet":this.tone({f0:2600,f1:1100,dur:.25,vol:.2,pos:n,max:70});break;case"fleshHit":this.burst({dur:.12,type:"lowpass",freq:500,vol:.5,pos:n,max:120});break;case"stone":this.burst({dur:.04,type:"bandpass",freq:1700,q:5,vol:.5,pos:n,max:70}),this.burst({dur:.03,type:"bandpass",freq:1300,q:5,vol:.3,pos:n,max:70,delay:.09});break;case"flare":this.burst({dur:1.4,type:"highpass",freq:2800,vol:.35,pos:n,max:60,attack:.05});break;case"throw":this.burst({dur:.18,type:"bandpass",freq:600,q:1,vol:.12,sweep:2});break;case"scan":this.tone({f0:880,dur:.08,vol:.12}),this.tone({f0:1320,dur:.12,vol:.12,delay:.1});break;case"sample":this.tone({f0:660,dur:.25,vol:.14}),this.tone({f0:990,dur:.4,vol:.12,delay:.12});break;case"objective":this.tone({type:"triangle",f0:523,dur:.3,vol:.15}),this.tone({type:"triangle",f0:659,dur:.3,vol:.15,delay:.15}),this.tone({type:"triangle",f0:784,dur:.6,vol:.15,delay:.3});break;case"penalty":this.tone({type:"sawtooth",f0:220,f1:110,dur:.6,vol:.12,filter:900});break;case"hurt":this.burst({dur:.15,type:"lowpass",freq:400,vol:.6}),this.tone({type:"sawtooth",f0:160,f1:95,dur:.22,vol:.12,filter:800});break;case"splash":this.burst({dur:.6,type:"lowpass",freq:1300,vol:.5,pos:n,max:60,sweep:.4});break;case"jump":this.burst({dur:.08,type:"lowpass",freq:500,vol:.12});break;case"land":this.burst({dur:.12,type:"lowpass",freq:380,vol:.35});break;case"crate":case"locker":this.burst({dur:.2,type:"bandpass",freq:600,q:4,vol:.4}),this.tone({type:"square",f0:180,f1:150,dur:.12,vol:.06,filter:1200});break;case"medkit":this.burst({dur:.3,type:"highpass",freq:2500,vol:.15,sweep:.6});break;case"pump":this.tone({type:"sawtooth",f0:70,f1:95,dur:2.2,vol:.12,filter:500,pos:n,max:40});break;case"heartbeat":this.tone({f0:62,f1:40,dur:.12,vol:.35}),this.tone({f0:58,f1:38,dur:.12,vol:.25,delay:.22});break;case"toast":this.tone({f0:1200,dur:.06,vol:.05});break}}step(t,e){if(!this.ctx||!this.enabled)return;const n=.08+e*.14;t==="brush"?this.burst({dur:.16,type:"bandpass",freq:2600,q:.8,vol:n*1.4}):t==="water"?this.burst({dur:.22,type:"bandpass",freq:800,q:1,vol:n*1.4,sweep:.5}):t==="gravel"?this.burst({dur:.07,type:"bandpass",freq:1900,q:1.5,vol:n}):this.burst({dur:.07,type:"lowpass",freq:650,vol:n*1.1})}voice(t,e,n){if(!this.ctx||!this.enabled)return;const i=t.sound,r=i.pitch*(.9+Math.random()*.2),o=120+i.size*380,a=.25+i.size*.6,l=e==="attack"||e==="alarm";switch(i.voice){case"roar":{const c=l?.7:2.4;this.tone({type:"sawtooth",f0:140*r,f1:70*r,dur:c,vol:a*.8,attack:.15,pos:n,max:o,echo:.6,filter:700,vibrato:.04}),this.tone({type:"sawtooth",f0:70*r,f1:45*r,dur:c,vol:a*.8,attack:.2,pos:n,max:o,filter:400}),this.burst({dur:c,type:"bandpass",freq:420*r,q:1.2,vol:a*.7,attack:.15,pos:n,max:o,sweep:.6});break}case"bellow":{const c=l?.5:1.3;this.tone({type:"sawtooth",f0:170*r,f1:120*r,dur:c,vol:a*.6,attack:.08,pos:n,max:o,filter:650,echo:.3}),this.burst({dur:c,type:"bandpass",freq:300*r,q:2,vol:a*.5,attack:.1,pos:n,max:o});break}case"horn":{const c=l?.6:1.6;this.tone({type:"triangle",f0:230*r,f1:210*r,dur:c,vol:a*.7,attack:.25,pos:n,max:o,echo:.5,vibrato:.02}),this.tone({type:"sine",f0:460*r,f1:420*r,dur:c,vol:a*.25,attack:.3,pos:n,max:o});break}case"honk":this.tone({type:"square",f0:520*r,f1:380*r,dur:.22,vol:a*.3,pos:n,max:o,filter:1800}),l||this.tone({type:"square",f0:560*r,f1:400*r,dur:.2,vol:a*.25,pos:n,max:o,filter:1800,delay:.28});break;case"screech":this.tone({type:"sawtooth",f0:700*r,f1:1100*r,dur:l?.25:.55,vol:a*.45,pos:n,max:o,filter:3500,vibrato:.08,echo:.2}),this.burst({dur:.4,type:"bandpass",freq:2200,q:2,vol:a*.3,pos:n,max:o});break;case"chirp":for(let c=0;c<3;c++)this.tone({f0:2200*r*.5,f1:3200*r*.5,dur:.07,vol:a*.4,pos:n,max:o,delay:c*.1});break;case"hiss":this.burst({dur:l?.4:.9,type:"highpass",freq:2800,vol:a*.6,attack:.05,pos:n,max:o}),this.tone({type:"square",f0:340*r,f1:300*r,dur:.6,vol:a*.12,pos:n,max:o,filter:1500,vibrato:.3});break;case"grunt":this.tone({type:"sawtooth",f0:110*r,f1:75*r,dur:l?.3:.6,vol:a*.6,pos:n,max:o,filter:500});break}}loopAt(t,e){if(!this.ctx)return;const n=this.ctx,i=n.createGain();i.gain.value=0;const r=n.createBiquadFilter();r.type="lowpass",r.frequency.value=320;for(const a of[50,100,150]){const l=n.createOscillator();l.type="sawtooth",l.frequency.value=a+Math.random();const c=n.createGain();c.gain.value=.3/(a/50),l.connect(c).connect(r),l.start()}const o=n.createStereoPanner();r.connect(i).connect(o).connect(this.master),this.loops.push({g:i,p:o,pos:e,max:45,vol:.35})}setRotor(t,e,n){if(!this.ctx)return;const i=this.ctx;if(!this.rotor){const a=i.createBufferSource();a.buffer=this.noise,a.loop=!0;const l=i.createBiquadFilter();l.type="lowpass",l.frequency.value=380;const c=i.createGain(),u=i.createOscillator();u.type="square";const h=i.createGain();h.gain.value=.5,u.connect(h).connect(c.gain),c.gain.value=.5;const d=i.createOscillator();d.type="sine";const f=i.createGain();f.gain.value=.04;const m=i.createGain();m.gain.value=0;const g=i.createStereoPanner();a.connect(l).connect(c).connect(m),d.connect(f).connect(m),m.connect(g).connect(this.master),a.start(),u.start(),d.start(),this.rotor={g:m,p:g,lfo:u,whine:d}}const r=this.rotor,o=n?{gain:1,pan:0}:this.spatial(e,450);r.g.gain.setTargetAtTime(t*o.gain*(n?.9:1.4),i.currentTime,.1),r.p.pan.setTargetAtTime(o.pan,i.currentTime,.1),r.lfo.frequency.setTargetAtTime(2+t*9,i.currentTime,.2),r.whine.frequency.setTargetAtTime(300+t*900,i.currentTime,.3)}startAmbience(){const t=this.ctx,e=(r,o,a,l)=>{const c=t.createBufferSource();c.buffer=this.noise,c.loop=!0,c.playbackRate.value=.5+Math.random()*.2;const u=t.createBiquadFilter();u.type=r,u.frequency.value=o,u.Q.value=a;const h=t.createGain();return h.gain.value=l,c.connect(u).connect(h).connect(this.master),c.start(),{g:h,f:u}};this.wind=e("lowpass",380,.5,.05),this.surf=e("lowpass",520,.7,0),this.insects=e("bandpass",4600,9,.012);const n=t.createOscillator();n.frequency.value=17;const i=t.createGain();i.gain.value=.008,n.connect(i).connect(this.insects.g.gain),n.start()}update(t,e){var c;if(!this.ctx||this.ctx.state!=="running")return;const n=this.ctx.currentTime,i=e.sky.light,r=(c=e.heli)!=null&&c.piloted?e.heli.pos.y-e.island.heightAt(e.heli.pos.x,e.heli.pos.z):0;this.wind.g.gain.setTargetAtTime(.03+.03*Math.sin(n*.13)+.02*Math.sin(n*.41)+Math.min(.08,r/2e3),n,.5),this.insects.g.gain.setTargetAtTime((1.4-i)*.014,n,1);const o=this.listener,a=Math.hypot(o.x,o.z)>560&&e.island.heightAt(o.x,o.z)<12?1:0;this.surf.g.gain.setTargetAtTime(a*(.05+.04*Math.sin(n*.35)),n,1.5);for(const u of this.loops){const h=this.spatial(u.pos,u.max);u.g.gain.setTargetAtTime(h.gain*u.vol,n,.2),u.p.pan.setTargetAtTime(h.pan,n,.2)}if(this.birdT-=t,this.birdT<=0){this.birdT=.8+Math.random()*3.5;const u=Math.random()*Math.PI*2,h={x:o.x+Math.cos(u)*30,y:o.y+10,z:o.z+Math.sin(u)*30};if(i>.5){const d=1800+Math.random()*2500,f=1+Math.floor(Math.random()*4);for(let m=0;m<f;m++)this.tone({f0:d,f1:d*(.7+Math.random()*.8),dur:.08+Math.random()*.1,vol:.06,pos:h,max:80,delay:m*.13})}else this.tone({type:"square",f0:180+Math.random()*80,f1:140,dur:.12,vol:.05,pos:h,max:80,filter:700})}if(this.roarT-=t,this.roarT<=0){this.roarT=35+Math.random()*60;const u=["tyrannosaurus","parasaurolophus","triceratops","velociraptor","brachiosaurus"],h=e.species[u[Math.floor(Math.random()*u.length)]],d=Math.random()*Math.PI*2;this.voice(h,"roar",{x:o.x+Math.cos(d)*300,y:o.y,z:o.z+Math.sin(d)*300})}e.ecology.active.some(u=>u.brain.state==="hunt"&&u.brain.data.target==="player"&&Math.hypot(u.pos.x-o.x,u.pos.z-o.z)<45)&&(this.heartT-=t,this.heartT<=0&&(this.heartT=.62,this.play("heartbeat")))}}const yx=s=>document.getElementById(s);class Mx{constructor(t){this.G=t,this.el={};for(const e of["hud","crosshair","hitmarker","prompt","promptText","promptRing","health","stamina","eye","eyeLabel","noise","weapon","weaponName","ammo","gadgets","compass","compassStrip","objectives","score","clock","toasts","detect","target","scope","blind","vignette","heliHud","fade","hurtArrow"])this.el[e]=yx(e);this.detectCtx=this.el.detect.getContext("2d"),this.cache={},this.targetTimer=0,this.hitT=0,this.vignette=0,t.events.on("dart:hit",e=>this.hit(e)),t.events.on("score",e=>this.toast(`${e.delta>0?"+":""}${e.delta}  ${e.reason}`,e.delta>0?"score":"penalty")),t.events.on("player:damaged",({amount:e})=>this.vignette=Math.min(1,this.vignette+e/25)),this.buildCompass()}set(t,e,n,i="textContent"){this.cache[t]!==n&&(this.cache[t]=n,i==="html"?e.innerHTML=n:i.startsWith("style.")?e.style[i.slice(6)]=n:e[i]=n)}toast(t,e="info",n=4.5){var r,o;const i=document.createElement("div");for(i.className="toast "+e,i.textContent=t,this.el.toasts.prepend(i);this.el.toasts.children.length>6;)this.el.toasts.lastChild.remove();setTimeout(()=>i.classList.add("out"),n*1e3),setTimeout(()=>i.remove(),n*1e3+600),e==="objective"?(r=this.G.audio)==null||r.play("objective"):e==="penalty"&&((o=this.G.audio)==null||o.play("penalty"))}hit(t){this.hitT=.5,this.el.hitmarker.textContent=t.zone+(t.dose?` +${Math.round(t.dose)}u`:t.damage?` −${Math.round(t.damage)}`:""),this.el.hitmarker.className=t.dose===0&&!t.damage?"show armor":t.damage?"show lethal":"show"}buildCompass(){const t=this.el.compassStrip;t.innerHTML="";const e={0:"N",45:"NE",90:"E",135:"SE",180:"S",225:"SW",270:"W",315:"NW"};for(let n=0;n<360;n+=15){const i=document.createElement("div");i.className="tick"+(e[n]?" major":""),i.dataset.deg=n,i.textContent=e[n]||"·",t.appendChild(i)}this.markers=[]}update(t){var _;const e=this.G,n=e.player,i=e.weapons,r=(_=e.heli)==null?void 0:_.piloted,o=r?e.heli.view==="cockpit"?e.heli.yaw:e.heli.camYaw:n.yaw;this.set("hp",this.el.health,`${wt(n.health,0,100)}%`,"style.width"),this.set("st",this.el.stamina,`${Math.round(n.stamina*100)}%`,"style.width");const a=e.stealth.visibility,l=wt(a/1.2,.08,1);this.set("eyeOpen",this.el.eye,`scaleY(${l.toFixed(2)})`,"style.transform");const c=a<.25?"#6fd08c":a<.6?"#d8d070":"#ff7a50";this.set("eyeCol",this.el.eye,c,"style.background"),this.set("eyeLbl",this.el.eyeLabel,r?"AIRBORNE":a<.25?"HIDDEN":a<.6?"LOW PROFILE":"EXPOSED"),this.set("noise",this.el.noise,`${wt(e.stealth.playerNoise/25,0,1)*100}%`,"style.width");const u=i.def;this.set("wname",this.el.weaponName,r?"HELICOPTER":u.name);let h="";!r&&u.ammo?h=`${i.mag[u.id]} <span>/ ${e.inventory.count(u.ammo)}</span>${i.reloadT>0?" <em>RELOADING</em>":""}`:!r&&u.kind==="scanner"&&(h=`<span>${e.science.catalogue.size} species</span>`),this.set("ammo",this.el.ammo,h,"html");const d=i.owned().map(v=>`<b class="${v.id===i.current?"on":""}">${v.slot}</b>`).join("");this.set("gad",this.el.gadgets,`${d}<i>G</i> stone ×${e.inventory.count("stone")} <i>T</i> flare ×${e.inventory.count("flare")} <i>H</i> med ×${e.inventory.count("medkit")}`,"html");const f=!r&&!!i.scoped();this.el.scope.classList.toggle("show",f),this.set("xh",this.el.crosshair,r?"none":u.kind==="scanner"?"scan":u.id==="shotgun"?"wide":"dot","className"),this.el.crosshair.style.opacity=f?0:1,this.hitT-=t,this.hitT<=0&&(this.el.hitmarker.className=""),this.set("score",this.el.score,`${e.scoring.total} <span>pts</span>`,"html"),this.set("clock",this.el.clock,Bm(e.sky.hours));const m=e.objectives.active().slice(0,4).map(v=>`<div class="obj"><b>${v.title}</b>${bx(e,v)}<br><span>${v.text}</span></div>`).join("");this.set("objs",this.el.objectives,m,"html"),this.updateCompass(o);const g=r?null:e.interact.prompt();g?(this.el.prompt.classList.add("show"),this.set("prt",this.el.promptText,g.blocked?`<em>${g.label}</em><br><span class="blocked">${g.blocked}</span>`:`<b>E</b> ${g.hold?"hold · ":""}${g.label}`,"html"),this.el.promptRing.style.setProperty("--p",(g.progress*100).toFixed(1)),this.el.promptRing.style.display=g.hold&&!g.blocked?"block":"none"):this.el.prompt.classList.remove("show"),this.vignette=Math.max(0,this.vignette-t*.8);const x=n.health<35?(35-n.health)/35:0;this.el.vignette.style.opacity=Math.max(this.vignette,x*(.5+.2*Math.sin(e.time*6))).toFixed(2),this.el.blind.style.opacity=wt(n.blindT/2,0,.95).toFixed(2),this.el.fade.style.opacity=wt(n.fade*1.5,0,1).toFixed(2);const p=e.time-n.lastHurt<1.2;if(this.el.hurtArrow.style.opacity=p?1-(e.time-n.lastHurt)/1.2:0,this.el.hurtArrow.style.transform=`translate(-50%,-50%) rotate(${-Je(n.hurtDir)}rad)`,this.el.heliHud.classList.toggle("show",!!r),r){const v=e.heli,y=v.pos.y-Math.max(e.island.heightAt(v.pos.x,v.pos.z),e.island.waterAt(v.pos.x,v.pos.z));this.set("heli",this.el.heliHud,`<div>ALT <b>${Math.round(y)}</b> m</div><div>SPD <b>${Math.round(Math.hypot(v.vel.x,v.vel.z)*3.6)}</b> km/h</div><div>FUEL <b class="${v.fuel<.2?"warn":""}">${Math.round(v.fuel*100)}%</b></div><div>HULL <b class="${v.health<40?"warn":""}">${Math.round(v.health)}%</b></div><div class="hint">${v.onGround?"E: exit · ":""}V: camera</div>`,"html")}this.drawDetection(o),this.targetTimer-=t,this.targetTimer<=0&&(this.targetTimer=.1,this.updateTarget())}updateCompass(t){var c;const e=this.G,n=this.el.compassStrip,r=(this.el.compass.clientWidth||600)/2.2,o=-t;for(const u of n.children){if(u.classList.contains("marker"))continue;const h=Je(u.dataset.deg*Math.PI/180-o),d=h*r;u.style.transform=`translateX(${d}px)`,u.style.opacity=Math.abs(h)>1.05?0:1}const a=(c=e.heli)!=null&&c.piloted?e.heli.pos:e.player.pos,l=[];for(const u of e.objectives.active()){const h=e.objectives.marker(u);h&&l.push({x:h.x,z:h.z,cls:"obj",label:"◆",dist:!0})}for(const u of e.island.pois)(e.discovered.has(u.id)||e.flags.get("mapRevealed"))&&l.push({x:u.x,z:u.z,cls:"poi",label:"▾"});for(;this.markers.length<l.length;){const u=document.createElement("div");u.className="marker",n.appendChild(u),this.markers.push(u)}this.markers.forEach((u,h)=>{const d=l[h];if(!d){u.style.opacity=0;return}const f=vn(a.x,a.z,d.x,d.z),m=Je(-f-o);u.className="marker "+d.cls;const g=Math.hypot(d.x-a.x,d.z-a.z);u.innerHTML=d.dist?`${d.label}<small>${Math.round(g)}m</small>`:d.label,u.style.transform=`translateX(${m*r}px)`,u.style.opacity=Math.abs(m)>1.05?0:1})}drawDetection(t){var o;const e=this.G,n=this.detectCtx,i=this.el.detect.width;n.clearRect(0,0,i,i);const r=(o=e.heli)!=null&&o.piloted?e.heli.pos:e.player.pos;for(const a of e.ecology.active){if(!a.vitals.conscious)continue;const l=a.perception.awareness;if(l<.05)continue;const c=Math.hypot(a.pos.x-r.x,a.pos.z-r.z);if(c>140)continue;const h=-Je(vn(r.x,r.z,a.pos.x,a.pos.z)-t)-Math.PI/2,d=a.brain.state==="hunt"||a.brain.state==="charge"||a.brain.state==="attack"||a.brain.state==="threaten",f=l>=1?d?"255,70,50":"255,150,60":l>=.35?"255,220,90":"230,230,230",m=i*.4,g=.18+.1*wt(1-c/140,0,1);n.lineWidth=5,n.strokeStyle=`rgba(${f},0.25)`,n.beginPath(),n.arc(i/2,i/2,m,h-g,h+g),n.stroke(),n.strokeStyle=`rgba(${f},${l>=1?.6+.4*Math.sin(e.time*10):.9})`,n.beginPath(),n.arc(i/2,i/2,m,h-g,h-g+g*2*wt(l,0,1)),n.stroke()}}updateTarget(){var m;const t=this.G,e=this.el.target;if((m=t.heli)!=null&&m.piloted||!t.player.alive){this.set("tgt",e,"","html");return}const n=t.camera,i=t.player.look,r=t.weapons.aim>.5||t.weapons.def.kind==="scanner",o=t.ecology.raycast(n.position,i,r?160:45);if(!o||t.physics.raycast(n.position.x,n.position.y,n.position.z,i.x,i.y,i.z,o.t)){this.set("tgt",e,"","html");return}const a=o.creature,l=t.science.known(a.sp.id),c=a.vitals,u=a.perception;let h;c.alive?c.state==="unconscious"?h="UNCONSCIOUS":a.brain.state==="flee"?h="FLEEING":["hunt","attack","charge","spit"].includes(a.brain.state)?h="HOSTILE":a.brain.state==="threaten"?h="THREATENED":u.awareness>=1?h="ALERTED":u.awareness>=.35?h="SUSPICIOUS":h="UNAWARE":h=a.rec.cause==="predation"?"DEAD (predation)":"DEAD",c.alive&&c.state==="drowsy"&&(h+=" · DROWSY");let d=`<div class="tname">${l?a.sp.name:"Unknown species"}<small>${Math.round(o.t)} m · ${o.zone==="armor"?"ARMOUR":o.zone.toUpperCase()}</small></div><div class="tstate s-${h.split(" ")[0].toLowerCase()}">${h}</div>`;if(l&&c.alive){const g=a.sp.sedation,x=g.lethal,p=a.rec.sedative/x*100,_=a.rec.pending/x*100,v=g.ko/x*100,y=Math.max(0,g.ko-a.rec.sedative-a.rec.pending),A=Math.max(0,x-a.rec.sedative-a.rec.pending),w=_n.rifle.dose,E=_n.pistol.dose;d+=`<div class="sedbar"><i style="width:${p.toFixed(1)}%"></i><u style="left:${p.toFixed(1)}%;width:${_.toFixed(1)}%"></u><b style="left:${v.toFixed(1)}%"></b></div>`,d+=`<div class="dose">KO in ~${Math.ceil(y/w)} rifle / ${Math.ceil(y/E)} pistol · overdose after ${Math.floor(A/w)} rifle</div>`}else l||(d+='<div class="dose">Scan [1] to learn its tolerances</div>');const f=a.rec.science;l&&(d+=`<div class="sci">${["blood","measure","tag"].map(g=>`<span class="${f[g]?"done":""}">${g}</span>`).join("")}</div>`),this.set("tgt",e,d,"html")}}function bx(s,t){const e=s.objectives.progress(t);return e?` <em>${e}</em>`:""}function wx(s,t=512){const e=document.createElement("canvas");e.width=e.height=t;const n=e.getContext("2d"),i=n.createImageData(t,t),r=s.half,o=r*2/t;for(let a=0;a<t;a++)for(let l=0;l<t;l++){const c=-r+(l+.5)*o,u=-r+(a+.5)*o,h=s.heightAt(c,u),d=s.waterAt(c,u)-h;let f,m,g;if(d>0){const p=Math.min(1,d/14);f=70-p*50,m=150-p*90,g=160-p*60}else{const p=s.sample(s.w.jungle,c,u),_=s.sample(s.w.swamp,c,u),v=s.sample(s.w.beach,c,u),y=s.sample(s.w.highland,c,u),A=s.sample(s.w.rock,c,u);f=150-p*80-_*60+v*70+y*10+A*20,m=160-p*50-_*50+v*50-y*10+A*0,g=90-p*40-_*30+v*60+A*40;const w=s.heightAt(c+o,u)-s.heightAt(c-o,u),E=s.heightAt(c,u+o)-s.heightAt(c,u-o),D=Math.max(.55,Math.min(1.35,1-(w+E)*.06));f*=D,m*=D,g*=D,Math.floor(h/20)!==Math.floor(s.heightAt(c+o,u)/20)&&(f*=.82,m*=.82,g*=.82),s.sample(s.road,c,u)>.45&&(f=196,m=160,g=110)}const x=(a*t+l)*4;i.data[x]=f,i.data[x+1]=m,i.data[x+2]=g,i.data[x+3]=255}return n.putImageData(i,0,0),e}function Sx(s){const t=new vr(s);return t.colorSpace=me,t}const Ex={dock:"⚓",station:"⌂",lab:"⚗",tower:"♜",fence:"⚠",relay:"📡"};class Tx{constructor(t,e){this.G=t,this.el=e,this.canvas=e.querySelector("canvas"),this.ctx=this.canvas.getContext("2d"),this.base=t.reliefCanvas,this.open=!1}toggle(t){this.open=t??!this.open,this.el.classList.toggle("show",this.open),this.open&&this.draw()}w2m(t,e){const n=this.canvas.width,i=this.G.island.half;return[(t+i)/(i*2)*n,(e+i)/(i*2)*n]}draw(){var c,u;const t=this.G,e=this.ctx,n=this.canvas.width;e.drawImage(this.base,0,0,n,n),e.font="600 15px system-ui, sans-serif",e.textAlign="center";for(const h of t.island.pois){if(!t.discovered.has(h.id)&&!t.flags.get("mapRevealed"))continue;const[d,f]=this.w2m(h.x,h.z);e.fillStyle="rgba(20,16,8,0.75)",e.beginPath(),e.arc(d,f,11,0,Math.PI*2),e.fill(),e.fillStyle="#f2e6c4",e.fillText(Ex[h.icon]||"•",d,f+5),e.fillStyle="rgba(20,16,8,0.8)";const m=e.measureText(h.name).width;e.fillRect(d-m/2-4,f+13,m+8,19),e.fillStyle="#f2e6c4",e.fillText(h.name,d,f+28)}for(const h of t.ecology.herds)for(const d of h.records){if(!(d.tagged||d.species==="tyrannosaurus"&&t.flags.get("relayFixed"))||d.state==="dead")continue;const[m,g]=this.w2m(d.x,d.z);e.fillStyle=d.species==="tyrannosaurus"?"#ff4030":"#ffd040",e.beginPath(),e.arc(m,g,5,0,Math.PI*2),e.fill(),e.strokeStyle="#000",e.stroke(),d.species==="tyrannosaurus"&&(e.fillStyle="#ffb0a0",e.fillText("T-01 “Matron”",m,g-9))}for(const h of t.objectives.active()){const d=t.objectives.marker(h);if(!d)continue;const[f,m]=this.w2m(d.x,d.z);e.strokeStyle="#ffe070",e.lineWidth=3,e.beginPath(),e.arc(f,m,16+Math.sin(performance.now()/200)*2,0,Math.PI*2),e.stroke()}const i=(c=t.heli)!=null&&c.piloted?t.heli.pos:t.player.pos,r=(u=t.heli)!=null&&u.piloted?t.heli.yaw:t.player.yaw,[o,a]=this.w2m(i.x,i.z);e.save(),e.translate(o,a),e.rotate(-r),e.fillStyle="#ffffff",e.strokeStyle="#000",e.lineWidth=2,e.beginPath(),e.moveTo(0,-12),e.lineTo(7,8),e.lineTo(0,4),e.lineTo(-7,8),e.closePath(),e.fill(),e.stroke(),e.restore();const l=t.wind;e.save(),e.translate(n-50,50),e.fillStyle="rgba(20,16,8,0.7)",e.beginPath(),e.arc(0,0,32,0,Math.PI*2),e.fill(),e.rotate(Math.atan2(l.z,l.x)+Math.PI/2),e.strokeStyle="#bfe8ff",e.lineWidth=3,e.beginPath(),e.moveTo(0,18),e.lineTo(0,-18),e.lineTo(-7,-9),e.moveTo(0,-18),e.lineTo(7,-9),e.stroke(),e.restore(),e.fillStyle="#bfe8ff",e.font="600 11px system-ui",e.fillText("WIND",n-50,98)}}class Ax{constructor(t,e){this.G=t,this.el=e,this.open=!1,this.tab="species",e.addEventListener("click",n=>{const i=n.target.closest("[data-tab]");i&&(this.tab=i.dataset.tab,this.render())})}toggle(t){this.open=t??!this.open,this.el.classList.toggle("show",this.open),this.open&&this.render()}render(){const t=this.G,e=t.science.summary(),n=`<div class="tabs"><button data-tab="species" class="${this.tab==="species"?"on":""}">Species</button><button data-tab="ledger" class="${this.tab==="ledger"?"on":""}">Ledger</button><button data-tab="help" class="${this.tab==="help"?"on":""}">Field manual</button></div>`;let i="";if(this.tab==="species"){i='<div class="cards">';for(const r of Xc){const o=Ln[r],a=e[r];if(!a.scanned){i+='<div class="card unknown"><h3>Unknown species</h3><p>Catalogue it with the Field Scanner to unlock its file.</p></div>';continue}const l=["blood","measure","tag","tissue"].map(c=>`<span class="${a[c]?"done":""}">${c}${a[c]>1?" ×"+a[c]:""}</span>`).join("");i+=`<div class="card t-${o.temperament}"><h3>${o.name}</h3><em>${o.latin}</em><p>${o.blurb}</p>
          <dl><dt>Temperament</dt><dd>${o.temperament}</dd><dt>Mass</dt><dd>${o.mass.toLocaleString()} kg</dd>
          <dt>Knockout</dt><dd>${o.sedation.ko}u ≈ ${Math.ceil(o.sedation.ko/_n.rifle.dose)} rifle darts</dd>
          <dt>Overdose</dt><dd>${o.sedation.lethal}u</dd>
          <dt>Blood value</dt><dd>${o.science.blood} pts</dd><dt>Kill penalty</dt><dd class="bad">−${o.killPenalty}</dd></dl>
          <div class="sci">${l}</div>${a.kills?`<div class="bad">Killed: ${a.kills}</div>`:""}</div>`}i+="</div>"}else if(this.tab==="ledger"){const r=t.scoring.ledger.slice(-40).reverse();i=`<div class="ledger"><div class="tot">${t.scoring.total} pts — <b>${t.scoring.rank()}</b></div>
        <div class="cats">Science ${t.scoring.byCategory.science||0} · Objectives ${t.scoring.byCategory.bonus||0} · Penalties ${t.scoring.byCategory.penalty||0}</div>
        ${r.map(o=>`<div class="row ${o.delta<0?"bad":""}"><span>${o.reason}</span><b>${o.delta>0?"+":""}${o.delta}</b></div>`).join("")||"<p>No entries yet.</p>"}
        <div class="cats">Shots fired: ${t.stats.get("shots:pistol")+t.stats.get("shots:rifle")} darts · ${t.stats.get("shots:hunting")+t.stats.get("shots:shotgun")} lethal · Knockouts ${t.stats.get("knockouts")} · Times spotted ${t.stats.get("detections")}</div></div>`}else i=`<div class="manual">
        <h3>The charter</h3><p>Scan, sedate, sample, release. Science earns points; every animal that dies by your hand — bullet or overdose — costs points. A procedure on an animal that never noticed you is worth half again.</p>
        <h3>Staying unseen</h3><p>The eye in the corner is how visible you are. Crouch [C] in ferns, reeds and tall grass; move slowly; keep the wind (see map) blowing from them to you — downwind animals smell you. Night hides you, the flashlight [F] does not. Arcs around the reticle show who has noticed you: white curious, yellow suspicious, red alerted.</p>
        <h3>Darting</h3><p>Darts take a few seconds to work — a darted predator can still reach you. Neck and head carry more dose; legs and tail less; armour stops darts cold. Too much sedative is an overdose. Scan a species to see its knockout and overdose lines on the target readout.</p>
        <h3>Procedures</h3><p>Stand over a sedated animal and hold [E]: blood, then measurements, then a tracking tag (tagged animals show on the map). Watch for “waking soon”. Dead animals yield only a tissue sample.</p>
        <h3>Tools</h3><p>[G] throws a stone — a noise somewhere else. [T] lights a flare — animals will not come near it for twenty seconds. [H] uses a medkit. [R] reloads, right mouse aims.</p>
        <h3>Temperaments</h3><p>Skittish animals bolt and take the herd with them. Defensive ones threaten inside their personal space and charge if you push — or shoot. Aggressive ones hunt you. Passive giants ignore you; do not stand underfoot.</p></div>`;this.el.querySelector(".inner").innerHTML=`<h2>Field Journal</h2>${n}${i}<div class="foot">[J] / [Tab] close</div>`}}const Do={low:{label:"Low",pixelRatio:1,shadows:0,drawDist:220,smallRadius:60},medium:{label:"Medium",pixelRatio:1.5,shadows:2048,drawDist:330,smallRadius:90},high:{label:"High",pixelRatio:2,shadows:4096,drawDist:480,smallRadius:125}},Gn=s=>document.getElementById(s);function Rx(){const s={quality:"medium",sensitivity:1,volume:.8,invertY:!1};try{return{...s,...JSON.parse(localStorage.getItem("specimen-island:settings")||"{}")}}catch{return s}}function Cx(s){try{localStorage.setItem("specimen-island:settings",JSON.stringify(s))}catch{}}class Px{constructor(t,e){this.G=t,this.hooks=e,this.settings=Rx(),this.noteOpen=!1;for(const n of document.querySelectorAll(".settings"))this.buildSettings(n);Gn("start").addEventListener("click",()=>e.start()),Gn("resume").addEventListener("click",()=>e.resume()),Gn("respawn").addEventListener("click",()=>e.respawn()),Gn("openJournal").addEventListener("click",()=>e.openJournal()),Gn("note").querySelector("[data-close]").addEventListener("click",()=>this.closeNote())}buildSettings(t){const e=this.settings;t.innerHTML=`
      <label>Graphics</label><select data-k="quality">${Object.entries(Do).map(([n,i])=>`<option value="${n}" ${n===e.quality?"selected":""}>${i.label}</option>`).join("")}</select>
      <label>Mouse</label><input type="range" data-k="sensitivity" min="0.3" max="2.5" step="0.05" value="${e.sensitivity}">
      <label>Volume</label><input type="range" data-k="volume" min="0" max="1" step="0.05" value="${e.volume}">
      <label>Invert Y</label><input type="checkbox" data-k="invertY" ${e.invertY?"checked":""}>`,t.addEventListener("input",n=>{const i=n.target.dataset.k;if(i){e[i]=n.target.type==="checkbox"?n.target.checked:n.target.type==="range"?Number(n.target.value):n.target.value,Cx(e);for(const r of document.querySelectorAll(`.settings [data-k="${i}"]`))r!==n.target&&(r.type==="checkbox"?r.checked=e[i]:r.value=e[i]);this.hooks.applySettings(e)}})}show(t,e=!0){Gn(t).classList.toggle("show",e)}showNote(t){const e=Gn("note");e.querySelector("h2").textContent=t.title,e.querySelector("p").textContent=t.text,this.show("note"),this.noteOpen=!0}closeNote(){this.show("note",!1),this.noteOpen=!1,this.hooks.resume(!0)}showDebrief(){const t=this.G,e=t.scoring,n=Gn("debrief").querySelector(".inner"),i=t.science.catalogue.size;n.innerHTML=`<h2>Expedition debrief</h2>
      <p style="font-size:28px;margin:4px 0"><b>${e.total}</b> pts — <span style="color:var(--accent)">${e.rank()}</span></p>
      <p style="color:var(--dim)">Species catalogued ${i}/10 · Blood samples ${t.stats.get("blood")} · Tags ${t.stats.get("tag")} · Animals killed ${t.stats.get("kills")} (overdoses ${t.stats.get("overdoses")}) · Times spotted ${t.stats.get("detections")}</p>
      <div class="ledger">${e.ledger.slice(-14).reverse().map(r=>`<div class="row ${r.delta<0?"bad":""}"><span>${r.reason}</span><b>${r.delta>0?"+":""}${r.delta}</b></div>`).join("")}</div>
      <div style="display:flex;gap:10px;margin-top:12px"><button class="btn primary" id="keepGoing">Keep exploring</button><button class="btn" id="newGame">New expedition</button></div>`,this.show("debrief"),n.querySelector("#keepGoing").onclick=()=>{this.show("debrief",!1),this.hooks.resume()},n.querySelector("#newGame").onclick=()=>location.reload()}}const tr=new URLSearchParams(location.search),xo=()=>new Promise(s=>requestAnimationFrame(()=>s()));async function Lx(){const s={time:0,frame:0,started:!1,paused:!1,mode:"title",species:Ln,discovered:new Set,godMode:tr.has("god"),events:new zm};window.__G=s;const t=document.getElementById("game"),e=new Bc({canvas:t,antialias:!0,powerPreference:"high-performance"});e.shadowMap.enabled=!0,e.shadowMap.type=cc,e.toneMapping=hc,e.toneMappingExposure=1.05,e.autoClear=!1;const n=new Hc,i=new Oe(72,innerWidth/innerHeight,.1,3e3);n.add(i),Object.assign(s,{renderer:e,scene:n,camera:i}),await xo();const r={...Ol,seed:tr.has("seed")?Number(tr.get("seed")):Ol.seed};s.island=new Vm(r),s.flags=new Ug(s.events),s.stats=new zg(s.events),s.inventory=new rx(s.events),s.interact=new ox(s),s.physics=new Xm(s.island),n.add(tg(s.island));const o=sg(s.island);n.add(o.group),s.sky=new og(n,{hours:7.4}),s.reliefCanvas=wx(s.island,512),s.mapTexture=Sx(s.reliefCanvas),await xo(),s.veg=new _g(s.island,s.physics,n,r.seed),s.fx=new Ig(n,i),s.player=new sx(s),s.ui={showNote:P=>x(P)},s.toast=(P,K,R)=>{var I;return(I=s.hud)==null?void 0:I.toast(P,K,R)},Dg(s),s.projectiles=new mx(s),s.hazards=s.projectiles,s.stealth=new Ng(s),s.ecology=new nx(s),s.ecology.populate(r.seed+99),s.wind={x:0,z:0,strength:r.wind.strength,angle:r.wind.angle},await xo(),s.weapons=new fx(s),s.science=new xx(s),s.scoring=new Fg(s),s.objectives=new Bg(s);const a=s.island.poi.fieldlab;s.heli=new vx(s,a.pad,a.padYaw),s.audio=new _x,s.hud=new Mx(s),s.map=new Tx(s,document.getElementById("map")),s.journal=new Ax(s,document.getElementById("journal")),s.inventory.grant(Dm);const l=s.island.poi.dock.spawn;s.player.teleport(l.pos,l.yaw);const c=new km(t);s.input=c;const u=P=>{const K=Do[P.quality]||Do.medium;e.setPixelRatio(Math.min(devicePixelRatio,K.pixelRatio)),s.sky.setShadowSize(K.shadows),s.veg.setQuality(K),c.sensitivity=.0022*P.sensitivity,c.invertY=P.invertY,s.audio.setVolume(P.volume),h()},h=()=>{e.setSize(innerWidth,innerHeight),i.aspect=innerWidth/innerHeight,i.updateProjectionMatrix(),s.weapons.vm.setAspect(i.aspect);const P=e.getDrawingBufferSize(new Bt).y;s.fx.setScale(P/(2*Math.tan(fu.degToRad(36))))};addEventListener("resize",h);const d=()=>s.map.open||s.journal.open||s.menus.noteOpen,f=P=>{s.paused=P},m=P=>{s.mode!=="title"&&(s.menus.show("pause",!1),P!==!0&&(s.map.toggle(!1),s.journal.toggle(!1)),d()||f(!1),c.lock(),s.audio.init())},g=()=>{s.mode!=="play"||s.paused||(f(!0),s.menus.show("pause"))},x=P=>{s.menus.showNote(P),f(!0)},p=()=>{s.audio.init(),s.mode="play",s.started=!0,document.body.classList.add("playing"),c.lock(),s.player.fade=1.5,s.objectives.refresh(),[["Day 1, 07:30. The boat leaves at dusk the day you call for it. Make the trip count.","info",7],["Field Scanner [1] catalogues species. Tranq Pistol [2] for small animals. J opens the journal.","info",9],["Crouch [C] in ferns and tall grass. The eye bottom-left shows how visible you are.","info",10]].forEach(([K,R,I],F)=>setTimeout(()=>s.toast(K,R,I),1500+F*3500))};s.menus=new Px(s,{start:p,resume:m,respawn:()=>{s.menus.show("death",!1);const P=s.island.poi.station,K=new L(P.x+Math.sin(P.yaw)*7,0,P.z+Math.cos(P.yaw)*7);K.y=s.physics.groundAt(K.x,K.z,P.y+3),s.player.revive(K,P.yaw+Math.PI),c.lock()},applySettings:u,openJournal:()=>{s.menus.show("pause",!1),s.journal.toggle(!0)}}),u(s.menus.settings),c.onLockChange=P=>{!P&&s.mode==="play"&&!s.paused&&!d()&&g()},t.addEventListener("click",()=>{s.mode==="play"&&!s.paused&&c.lock()}),addEventListener("keydown",P=>{P.code!=="Escape"||s.mode!=="play"||(d()?(s.menus.noteOpen&&s.menus.closeNote(),s.map.toggle(!1),s.journal.toggle(!1),f(s.menus.noteOpen)):s.paused||g())}),s.events.on("player:died",()=>setTimeout(()=>s.menus.show("death"),2200)),s.events.on("expedition:complete",()=>setTimeout(()=>{s.menus.showDebrief(),f(!0),c.unlock()},2500));const _=s.island.cfg.plains,v=s.ecology.herds.filter(P=>P.species==="triceratops").sort((P,K)=>Math.hypot(P.home.x-_.x,P.home.z-_.z)-Math.hypot(K.home.x-_.x,K.home.z-_.z))[0]||s.ecology.herds[0],y={angle:1.3,focus:{x:v.home.x,z:v.home.z}};for(const P of v.records)P.x=v.home.x+P.offset.dx*6,P.z=v.home.z+P.offset.dz*6;tr.has("play")&&p();let A=performance.now(),w=0,E=0;const D=new L;function M(P){s.frame++;const K=s.mode==="play";if(K&&s.player.alive&&(c.pressed("map")&&!s.journal.open&&!s.menus.noteOpen&&(s.map.toggle(),f(d())),c.pressed("journal")&&!s.map.open&&!s.menus.noteOpen&&(s.journal.toggle(),f(d())),s.menus.noteOpen&&c.pressed("interact")&&s.frame>(s.noteFrame||0)&&s.menus.closeNote()),K&&!s.paused){s.time+=P;const N=s.heli.piloted;N||s.player.update(P,c),s.heli.update(P,c),N&&s.heli.updateCamera(i,P),s.weapons.update(P,c),!N&&s.player.alive&&s.interact.update(P,s.player.eye,s.player.look,c.pressed("interact"),c.down("interact")),s.menus.noteOpen&&(s.noteFrame=s.frame+1),s.projectiles.update(P),s.stealth.update(P);const B=N?s.heli.pos:s.player.pos;if(s.ecology.loadRadius=N?300:220,s.ecology.unloadRadius=N?360:280,s.ecology.update(P,B),s.objectives.update(P),w-=P,w<=0){w=.5;for(const z of s.island.pois)s.discovered.has(z.id)||Math.hypot(z.x-B.x,z.z-B.z)<75&&(s.discovered.add(z.id),s.toast(`Discovered: ${z.name}`,"loot"))}s.map.open&&s.map.draw()}else if(s.mode==="title"){s.time+=P,y.angle+=P*.03;const N=y.focus,B=19,z=N.x+Math.cos(y.angle)*B,V=N.z+Math.sin(y.angle)*B,j=Math.max(s.island.heightAt(z,V),s.island.waterAt(z,V));i.position.set(z,j+2.6,V);let G=s.island.heightAt(N.x,N.z)+3.4;const Z=v.loaded;if(Z.length){let nt=0,ht=0;for(const ut of Z)nt+=ut.pos.x,ht+=ut.pos.z;y.focus.x+=(nt/Z.length-y.focus.x)*P*.3,y.focus.z+=(ht/Z.length-y.focus.z)*P*.3,G=s.island.heightAt(y.focus.x,y.focus.z)+3.4}i.lookAt(N.x,G,N.z),innerWidth>800&&i.rotateY(.3),i.updateMatrixWorld(),s.ecology.update(P,y.focus)}const R=i.position,I=s.wind.angle+Math.sin(s.time/90)*.5;s.wind.x=Math.cos(I),s.wind.z=Math.sin(I);const F=s.heli.piloted,k=F?s.heli.pos.y-s.island.heightAt(s.heli.pos.x,s.heli.pos.z):0;s.sky.fogBoost=Yt(.2,.8,s.island.sample(s.island.d.canopy,R.x,R.z))*(F?0:1),D.copy(K?F?s.heli.pos:s.player.pos:R),s.sky.update(K&&!s.paused?P:P*.2,D,{altitude:k,camera:R}),s.veg.update(P,R,.8+.4*Math.sin(s.time*.3)*s.wind.strength),o.uniforms.uTime.value+=P,s.fx.update(s.paused?0:P),s.boat&&(s.boat.position.y=Math.sin(s.time*.9)*.12-.05),s.audio.setListener(R,F&&s.heli.view!=="cockpit"?s.heli.camYaw:s.player.yaw),s.audio.update(P,s),K&&s.hud.update(P),c.endFrame()}function S(){e.clear(),e.render(n,i),s.mode==="play"&&!s.heli.piloted&&s.player.alive&&s.weapons.vm.render(e)}function H(P){var R;requestAnimationFrame(H);const K=Math.min(.05,(P-A)/1e3);A=P,M(K),S(),E<4&&++E===4&&((R=document.getElementById("boot"))==null||R.remove())}requestAnimationFrame(H),window.__step=(P,K=1/30)=>{for(let R=0,I=Math.round(P/K);R<I;R++)M(K)}}Lx().catch(s=>{console.error(s);const t=document.getElementById("boot");t&&(t.innerHTML=`<div style="max-width:70ch;padding:20px">The island failed to grow: ${String(s&&s.message)}</div>`)});
