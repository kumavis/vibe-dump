(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qa="160",pi={ROTATE:0,DOLLY:1,PAN:2},mi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Th=0,mo=1,Ah=2,Sc=1,Rh=2,Tn=3,qn=0,Gt=1,Cn=2,Vn=0,Vi=1,go=2,_o=3,vo=4,Ch=5,ti=100,Ph=101,Lh=102,xo=103,Mo=104,Ih=200,Dh=201,Uh=202,Nh=203,Ua=204,Na=205,Oh=206,Fh=207,zh=208,kh=209,Bh=210,Gh=211,Hh=212,Vh=213,Wh=214,Xh=0,qh=1,Yh=2,_r=3,jh=4,$h=5,Kh=6,Zh=7,bc=0,Jh=1,Qh=2,Wn=0,eu=1,tu=2,nu=3,Ec=4,iu=5,su=6,yo="attached",ru="detached",wc=300,ji=301,$i=302,Oa=303,Fa=304,Rr=306,za=1e3,cn=1001,ka=1002,Pt=1003,So=1004,Br=1005,qt=1006,au=1007,ys=1008,Xn=1009,ou=1010,lu=1011,Ya=1012,Tc=1013,Hn=1014,Ln=1015,Ss=1016,Ac=1017,Rc=1018,si=1020,cu=1021,en=1023,hu=1024,uu=1025,ri=1026,Ki=1027,fu=1028,Cc=1029,du=1030,Pc=1031,Lc=1033,Gr=33776,Hr=33777,Vr=33778,Wr=33779,bo=35840,Eo=35841,wo=35842,To=35843,Ic=36196,Ao=37492,Ro=37496,Co=37808,Po=37809,Lo=37810,Io=37811,Do=37812,Uo=37813,No=37814,Oo=37815,Fo=37816,zo=37817,ko=37818,Bo=37819,Go=37820,Ho=37821,Xr=36492,Vo=36494,Wo=36495,pu=36283,Xo=36284,qo=36285,Yo=36286,Dc=3e3,ai=3001,mu=3200,gu=3201,Uc=0,_u=1,tn="",Ct="srgb",Dn="srgb-linear",ja="display-p3",Cr="display-p3-linear",vr="linear",ht="srgb",xr="rec709",Mr="p3",gi=7680,jo=519,vu=512,xu=513,Mu=514,Nc=515,yu=516,Su=517,bu=518,Eu=519,Ba=35044,$o="300 es",Ga=1035,In=2e3,yr=2001;class fi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ko=1234567;const gs=Math.PI/180,bs=180/Math.PI;function gn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ut[i&255]+Ut[i>>8&255]+Ut[i>>16&255]+Ut[i>>24&255]+"-"+Ut[e&255]+Ut[e>>8&255]+"-"+Ut[e>>16&15|64]+Ut[e>>24&255]+"-"+Ut[t&63|128]+Ut[t>>8&255]+"-"+Ut[t>>16&255]+Ut[t>>24&255]+Ut[n&255]+Ut[n>>8&255]+Ut[n>>16&255]+Ut[n>>24&255]).toLowerCase()}function bt(i,e,t){return Math.max(e,Math.min(t,i))}function $a(i,e){return(i%e+e)%e}function wu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Tu(i,e,t){return i!==e?(t-i)/(e-i):0}function _s(i,e,t){return(1-t)*i+t*e}function Au(i,e,t,n){return _s(i,e,1-Math.exp(-t*n))}function Ru(i,e=1){return e-Math.abs($a(i,e*2)-e)}function Cu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Pu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Lu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Iu(i,e){return i+Math.random()*(e-i)}function Du(i){return i*(.5-Math.random())}function Uu(i){i!==void 0&&(Ko=i);let e=Ko+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Nu(i){return i*gs}function Ou(i){return i*bs}function Ha(i){return(i&i-1)===0&&i!==0}function Fu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Sr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function zu(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),h=r((e+n)/2),c=a((e+n)/2),u=r((e-n)/2),p=a((e-n)/2),f=r((n-e)/2),v=a((n-e)/2);switch(s){case"XYX":i.set(o*c,l*u,l*p,o*h);break;case"YZY":i.set(l*p,o*c,l*u,o*h);break;case"ZXZ":i.set(l*u,l*p,o*c,o*h);break;case"XZX":i.set(o*c,l*v,l*f,o*h);break;case"YXY":i.set(l*f,o*c,l*v,o*h);break;case"ZYZ":i.set(l*v,l*f,o*c,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function pn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function st(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const br={DEG2RAD:gs,RAD2DEG:bs,generateUUID:gn,clamp:bt,euclideanModulo:$a,mapLinear:wu,inverseLerp:Tu,lerp:_s,damp:Au,pingpong:Ru,smoothstep:Cu,smootherstep:Pu,randInt:Lu,randFloat:Iu,randFloatSpread:Du,seededRandom:Uu,degToRad:Nu,radToDeg:Ou,isPowerOfTwo:Ha,ceilPowerOfTwo:Fu,floorPowerOfTwo:Sr,setQuaternionFromProperEuler:zu,normalize:st,denormalize:pn};class fe{constructor(e=0,t=0){fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(bt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $e{constructor(e,t,n,s,r,a,o,l,h){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,h)}set(e,t,n,s,r,a,o,l,h){const c=this.elements;return c[0]=e,c[1]=s,c[2]=o,c[3]=t,c[4]=r,c[5]=l,c[6]=n,c[7]=a,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],h=n[1],c=n[4],u=n[7],p=n[2],f=n[5],v=n[8],x=s[0],g=s[3],d=s[6],b=s[1],_=s[4],M=s[7],L=s[2],S=s[5],P=s[8];return r[0]=a*x+o*b+l*L,r[3]=a*g+o*_+l*S,r[6]=a*d+o*M+l*P,r[1]=h*x+c*b+u*L,r[4]=h*g+c*_+u*S,r[7]=h*d+c*M+u*P,r[2]=p*x+f*b+v*L,r[5]=p*g+f*_+v*S,r[8]=p*d+f*M+v*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],h=e[7],c=e[8];return t*a*c-t*o*h-n*r*c+n*o*l+s*r*h-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],h=e[7],c=e[8],u=c*a-o*h,p=o*l-c*r,f=h*r-a*l,v=t*u+n*p+s*f;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return e[0]=u*x,e[1]=(s*h-c*n)*x,e[2]=(o*n-s*a)*x,e[3]=p*x,e[4]=(c*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*l-h*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),h=Math.sin(r);return this.set(n*l,n*h,-n*(l*a+h*o)+a+e,-s*h,s*l,-s*(-h*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(qr.makeScale(e,t)),this}rotate(e){return this.premultiply(qr.makeRotation(-e)),this}translate(e,t){return this.premultiply(qr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const qr=new $e;function Oc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Er(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ku(){const i=Er("canvas");return i.style.display="block",i}const Zo={};function vs(i){i in Zo||(Zo[i]=!0,console.warn(i))}const Jo=new $e().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Qo=new $e().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Cs={[Dn]:{transfer:vr,primaries:xr,toReference:i=>i,fromReference:i=>i},[Ct]:{transfer:ht,primaries:xr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Cr]:{transfer:vr,primaries:Mr,toReference:i=>i.applyMatrix3(Qo),fromReference:i=>i.applyMatrix3(Jo)},[ja]:{transfer:ht,primaries:Mr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Qo),fromReference:i=>i.applyMatrix3(Jo).convertLinearToSRGB()}},Bu=new Set([Dn,Cr]),rt={enabled:!0,_workingColorSpace:Dn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Bu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Cs[e].toReference,s=Cs[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Cs[i].primaries},getTransfer:function(i){return i===tn?vr:Cs[i].transfer}};function Wi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Yr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let _i;class Fc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{_i===void 0&&(_i=Er("canvas")),_i.width=e.width,_i.height=e.height;const n=_i.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=_i}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Er("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Wi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Wi(t[n]/255)*255):t[n]=Wi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Gu=0;class zc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=gn(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(jr(s[a].image)):r.push(jr(s[a]))}else r=jr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function jr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Fc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Hu=0;class kt extends fi{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,n=cn,s=cn,r=qt,a=ys,o=en,l=Xn,h=kt.DEFAULT_ANISOTROPY,c=tn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hu++}),this.uuid=gn(),this.name="",this.source=new zc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof c=="string"?this.colorSpace=c:(vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=c===ai?Ct:tn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==wc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case za:e.x=e.x-Math.floor(e.x);break;case cn:e.x=e.x<0?0:1;break;case ka:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case za:e.y=e.y-Math.floor(e.y);break;case cn:e.y=e.y<0?0:1;break;case ka:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ct?ai:Dc}set encoding(e){vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===ai?Ct:tn}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=wc;kt.DEFAULT_ANISOTROPY=1;class ot{constructor(e=0,t=0,n=0,s=1){ot.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,h=l[0],c=l[4],u=l[8],p=l[1],f=l[5],v=l[9],x=l[2],g=l[6],d=l[10];if(Math.abs(c-p)<.01&&Math.abs(u-x)<.01&&Math.abs(v-g)<.01){if(Math.abs(c+p)<.1&&Math.abs(u+x)<.1&&Math.abs(v+g)<.1&&Math.abs(h+f+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(h+1)/2,M=(f+1)/2,L=(d+1)/2,S=(c+p)/4,P=(u+x)/4,W=(v+g)/4;return _>M&&_>L?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=S/n,r=P/n):M>L?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=S/s,r=W/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=P/r,s=W/r),this.set(n,s,r,t),this}let b=Math.sqrt((g-v)*(g-v)+(u-x)*(u-x)+(p-c)*(p-c));return Math.abs(b)<.001&&(b=1),this.x=(g-v)/b,this.y=(u-x)/b,this.z=(p-c)/b,this.w=Math.acos((h+f+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Vu extends fi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ot(0,0,e,t),this.scissorTest=!1,this.viewport=new ot(0,0,e,t);const s={width:e,height:t,depth:1};n.encoding!==void 0&&(vs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ai?Ct:tn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new kt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new zc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class li extends Vu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class kc extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Wu extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],h=n[s+1],c=n[s+2],u=n[s+3];const p=r[a+0],f=r[a+1],v=r[a+2],x=r[a+3];if(o===0){e[t+0]=l,e[t+1]=h,e[t+2]=c,e[t+3]=u;return}if(o===1){e[t+0]=p,e[t+1]=f,e[t+2]=v,e[t+3]=x;return}if(u!==x||l!==p||h!==f||c!==v){let g=1-o;const d=l*p+h*f+c*v+u*x,b=d>=0?1:-1,_=1-d*d;if(_>Number.EPSILON){const L=Math.sqrt(_),S=Math.atan2(L,d*b);g=Math.sin(g*S)/L,o=Math.sin(o*S)/L}const M=o*b;if(l=l*g+p*M,h=h*g+f*M,c=c*g+v*M,u=u*g+x*M,g===1-o){const L=1/Math.sqrt(l*l+h*h+c*c+u*u);l*=L,h*=L,c*=L,u*=L}}e[t]=l,e[t+1]=h,e[t+2]=c,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],h=n[s+2],c=n[s+3],u=r[a],p=r[a+1],f=r[a+2],v=r[a+3];return e[t]=o*v+c*u+l*f-h*p,e[t+1]=l*v+c*p+h*u-o*f,e[t+2]=h*v+c*f+o*p-l*u,e[t+3]=c*v-o*u-l*p-h*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,h=o(n/2),c=o(s/2),u=o(r/2),p=l(n/2),f=l(s/2),v=l(r/2);switch(a){case"XYZ":this._x=p*c*u+h*f*v,this._y=h*f*u-p*c*v,this._z=h*c*v+p*f*u,this._w=h*c*u-p*f*v;break;case"YXZ":this._x=p*c*u+h*f*v,this._y=h*f*u-p*c*v,this._z=h*c*v-p*f*u,this._w=h*c*u+p*f*v;break;case"ZXY":this._x=p*c*u-h*f*v,this._y=h*f*u+p*c*v,this._z=h*c*v+p*f*u,this._w=h*c*u-p*f*v;break;case"ZYX":this._x=p*c*u-h*f*v,this._y=h*f*u+p*c*v,this._z=h*c*v-p*f*u,this._w=h*c*u+p*f*v;break;case"YZX":this._x=p*c*u+h*f*v,this._y=h*f*u+p*c*v,this._z=h*c*v-p*f*u,this._w=h*c*u-p*f*v;break;case"XZY":this._x=p*c*u-h*f*v,this._y=h*f*u-p*c*v,this._z=h*c*v+p*f*u,this._w=h*c*u+p*f*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],h=t[2],c=t[6],u=t[10],p=n+o+u;if(p>0){const f=.5/Math.sqrt(p+1);this._w=.25/f,this._x=(c-l)*f,this._y=(r-h)*f,this._z=(a-s)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(c-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+h)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-h)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+c)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+h)/f,this._y=(l+c)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,h=t._z,c=t._w;return this._x=n*c+a*o+s*h-r*l,this._y=s*c+a*l+r*o-n*h,this._z=r*c+a*h+n*l-s*o,this._w=a*c-n*o-s*l-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const h=Math.sqrt(l),c=Math.atan2(h,o),u=Math.sin((1-t)*c)/h,p=Math.sin(t*c)/h;return this._w=a*u+this._w*p,this._x=n*u+this._x*p,this._y=s*u+this._y*p,this._z=r*u+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(e=0,t=0,n=0){w.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(el.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(el.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,h=2*(a*s-o*n),c=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*h+a*u-o*c,this.y=n+l*c+o*h-r*u,this.z=s+l*u+r*c-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return $r.copy(this).projectOnVector(e),this.sub($r)}reflect(e){return this.sub($r.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(bt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $r=new w,el=new hn;class ts{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(sn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(sn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=sn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,sn):sn.fromBufferAttribute(r,a),sn.applyMatrix4(e.matrixWorld),this.expandByPoint(sn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ps.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ps.copy(n.boundingBox)),Ps.applyMatrix4(e.matrixWorld),this.union(Ps)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,sn),sn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rs),Ls.subVectors(this.max,rs),vi.subVectors(e.a,rs),xi.subVectors(e.b,rs),Mi.subVectors(e.c,rs),Un.subVectors(xi,vi),Nn.subVectors(Mi,xi),$n.subVectors(vi,Mi);let t=[0,-Un.z,Un.y,0,-Nn.z,Nn.y,0,-$n.z,$n.y,Un.z,0,-Un.x,Nn.z,0,-Nn.x,$n.z,0,-$n.x,-Un.y,Un.x,0,-Nn.y,Nn.x,0,-$n.y,$n.x,0];return!Kr(t,vi,xi,Mi,Ls)||(t=[1,0,0,0,1,0,0,0,1],!Kr(t,vi,xi,Mi,Ls))?!1:(Is.crossVectors(Un,Nn),t=[Is.x,Is.y,Is.z],Kr(t,vi,xi,Mi,Ls))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,sn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(sn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(yn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const yn=[new w,new w,new w,new w,new w,new w,new w,new w],sn=new w,Ps=new ts,vi=new w,xi=new w,Mi=new w,Un=new w,Nn=new w,$n=new w,rs=new w,Ls=new w,Is=new w,Kn=new w;function Kr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Kn.fromArray(i,r);const o=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),l=e.dot(Kn),h=t.dot(Kn),c=n.dot(Kn);if(Math.max(-Math.max(l,h,c),Math.min(l,h,c))>o)return!1}return!0}const Xu=new ts,as=new w,Zr=new w;class ws{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Xu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;as.subVectors(e,this.center);const t=as.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(as,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(as.copy(e.center).add(Zr)),this.expandByPoint(as.copy(e.center).sub(Zr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Sn=new w,Jr=new w,Ds=new w,On=new w,Qr=new w,Us=new w,ea=new w;class Pr{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Sn.copy(this.origin).addScaledVector(this.direction,t),Sn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Jr.copy(e).add(t).multiplyScalar(.5),Ds.copy(t).sub(e).normalize(),On.copy(this.origin).sub(Jr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ds),o=On.dot(this.direction),l=-On.dot(Ds),h=On.lengthSq(),c=Math.abs(1-a*a);let u,p,f,v;if(c>0)if(u=a*l-o,p=a*o-l,v=r*c,u>=0)if(p>=-v)if(p<=v){const x=1/c;u*=x,p*=x,f=u*(u+a*p+2*o)+p*(a*u+p+2*l)+h}else p=r,u=Math.max(0,-(a*p+o)),f=-u*u+p*(p+2*l)+h;else p=-r,u=Math.max(0,-(a*p+o)),f=-u*u+p*(p+2*l)+h;else p<=-v?(u=Math.max(0,-(-a*r+o)),p=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+p*(p+2*l)+h):p<=v?(u=0,p=Math.min(Math.max(-r,-l),r),f=p*(p+2*l)+h):(u=Math.max(0,-(a*r+o)),p=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+p*(p+2*l)+h);else p=a>0?-r:r,u=Math.max(0,-(a*p+o)),f=-u*u+p*(p+2*l)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Jr).addScaledVector(Ds,p),f}intersectSphere(e,t){Sn.subVectors(e.center,this.origin);const n=Sn.dot(this.direction),s=Sn.dot(Sn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const h=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,p=this.origin;return h>=0?(n=(e.min.x-p.x)*h,s=(e.max.x-p.x)*h):(n=(e.max.x-p.x)*h,s=(e.min.x-p.x)*h),c>=0?(r=(e.min.y-p.y)*c,a=(e.max.y-p.y)*c):(r=(e.max.y-p.y)*c,a=(e.min.y-p.y)*c),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-p.z)*u,l=(e.max.z-p.z)*u):(o=(e.max.z-p.z)*u,l=(e.min.z-p.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Sn)!==null}intersectTriangle(e,t,n,s,r){Qr.subVectors(t,e),Us.subVectors(n,e),ea.crossVectors(Qr,Us);let a=this.direction.dot(ea),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;On.subVectors(this.origin,e);const l=o*this.direction.dot(Us.crossVectors(On,Us));if(l<0)return null;const h=o*this.direction.dot(Qr.cross(On));if(h<0||l+h>a)return null;const c=-o*On.dot(ea);return c<0?null:this.at(c/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xe{constructor(e,t,n,s,r,a,o,l,h,c,u,p,f,v,x,g){Xe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,h,c,u,p,f,v,x,g)}set(e,t,n,s,r,a,o,l,h,c,u,p,f,v,x,g){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=h,d[6]=c,d[10]=u,d[14]=p,d[3]=f,d[7]=v,d[11]=x,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/yi.setFromMatrixColumn(e,0).length(),r=1/yi.setFromMatrixColumn(e,1).length(),a=1/yi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),h=Math.sin(s),c=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const p=a*c,f=a*u,v=o*c,x=o*u;t[0]=l*c,t[4]=-l*u,t[8]=h,t[1]=f+v*h,t[5]=p-x*h,t[9]=-o*l,t[2]=x-p*h,t[6]=v+f*h,t[10]=a*l}else if(e.order==="YXZ"){const p=l*c,f=l*u,v=h*c,x=h*u;t[0]=p+x*o,t[4]=v*o-f,t[8]=a*h,t[1]=a*u,t[5]=a*c,t[9]=-o,t[2]=f*o-v,t[6]=x+p*o,t[10]=a*l}else if(e.order==="ZXY"){const p=l*c,f=l*u,v=h*c,x=h*u;t[0]=p-x*o,t[4]=-a*u,t[8]=v+f*o,t[1]=f+v*o,t[5]=a*c,t[9]=x-p*o,t[2]=-a*h,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const p=a*c,f=a*u,v=o*c,x=o*u;t[0]=l*c,t[4]=v*h-f,t[8]=p*h+x,t[1]=l*u,t[5]=x*h+p,t[9]=f*h-v,t[2]=-h,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const p=a*l,f=a*h,v=o*l,x=o*h;t[0]=l*c,t[4]=x-p*u,t[8]=v*u+f,t[1]=u,t[5]=a*c,t[9]=-o*c,t[2]=-h*c,t[6]=f*u+v,t[10]=p-x*u}else if(e.order==="XZY"){const p=a*l,f=a*h,v=o*l,x=o*h;t[0]=l*c,t[4]=-u,t[8]=h*c,t[1]=p*u+x,t[5]=a*c,t[9]=f*u-v,t[2]=v*u-f,t[6]=o*c,t[10]=x*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qu,e,Yu)}lookAt(e,t,n){const s=this.elements;return Vt.subVectors(e,t),Vt.lengthSq()===0&&(Vt.z=1),Vt.normalize(),Fn.crossVectors(n,Vt),Fn.lengthSq()===0&&(Math.abs(n.z)===1?Vt.x+=1e-4:Vt.z+=1e-4,Vt.normalize(),Fn.crossVectors(n,Vt)),Fn.normalize(),Ns.crossVectors(Vt,Fn),s[0]=Fn.x,s[4]=Ns.x,s[8]=Vt.x,s[1]=Fn.y,s[5]=Ns.y,s[9]=Vt.y,s[2]=Fn.z,s[6]=Ns.z,s[10]=Vt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],h=n[12],c=n[1],u=n[5],p=n[9],f=n[13],v=n[2],x=n[6],g=n[10],d=n[14],b=n[3],_=n[7],M=n[11],L=n[15],S=s[0],P=s[4],W=s[8],m=s[12],y=s[1],U=s[5],k=s[9],K=s[13],N=s[2],B=s[6],G=s[10],Y=s[14],te=s[3],J=s[7],j=s[11],F=s[15];return r[0]=a*S+o*y+l*N+h*te,r[4]=a*P+o*U+l*B+h*J,r[8]=a*W+o*k+l*G+h*j,r[12]=a*m+o*K+l*Y+h*F,r[1]=c*S+u*y+p*N+f*te,r[5]=c*P+u*U+p*B+f*J,r[9]=c*W+u*k+p*G+f*j,r[13]=c*m+u*K+p*Y+f*F,r[2]=v*S+x*y+g*N+d*te,r[6]=v*P+x*U+g*B+d*J,r[10]=v*W+x*k+g*G+d*j,r[14]=v*m+x*K+g*Y+d*F,r[3]=b*S+_*y+M*N+L*te,r[7]=b*P+_*U+M*B+L*J,r[11]=b*W+_*k+M*G+L*j,r[15]=b*m+_*K+M*Y+L*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],h=e[13],c=e[2],u=e[6],p=e[10],f=e[14],v=e[3],x=e[7],g=e[11],d=e[15];return v*(+r*l*u-s*h*u-r*o*p+n*h*p+s*o*f-n*l*f)+x*(+t*l*f-t*h*p+r*a*p-s*a*f+s*h*c-r*l*c)+g*(+t*h*u-t*o*f-r*a*u+n*a*f+r*o*c-n*h*c)+d*(-s*o*c-t*l*u+t*o*p+s*a*u-n*a*p+n*l*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],h=e[7],c=e[8],u=e[9],p=e[10],f=e[11],v=e[12],x=e[13],g=e[14],d=e[15],b=u*g*h-x*p*h+x*l*f-o*g*f-u*l*d+o*p*d,_=v*p*h-c*g*h-v*l*f+a*g*f+c*l*d-a*p*d,M=c*x*h-v*u*h+v*o*f-a*x*f-c*o*d+a*u*d,L=v*u*l-c*x*l-v*o*p+a*x*p+c*o*g-a*u*g,S=t*b+n*_+s*M+r*L;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/S;return e[0]=b*P,e[1]=(x*p*r-u*g*r-x*s*f+n*g*f+u*s*d-n*p*d)*P,e[2]=(o*g*r-x*l*r+x*s*h-n*g*h-o*s*d+n*l*d)*P,e[3]=(u*l*r-o*p*r-u*s*h+n*p*h+o*s*f-n*l*f)*P,e[4]=_*P,e[5]=(c*g*r-v*p*r+v*s*f-t*g*f-c*s*d+t*p*d)*P,e[6]=(v*l*r-a*g*r-v*s*h+t*g*h+a*s*d-t*l*d)*P,e[7]=(a*p*r-c*l*r+c*s*h-t*p*h-a*s*f+t*l*f)*P,e[8]=M*P,e[9]=(v*u*r-c*x*r-v*n*f+t*x*f+c*n*d-t*u*d)*P,e[10]=(a*x*r-v*o*r+v*n*h-t*x*h-a*n*d+t*o*d)*P,e[11]=(c*o*r-a*u*r-c*n*h+t*u*h+a*n*f-t*o*f)*P,e[12]=L*P,e[13]=(c*x*s-v*u*s+v*n*p-t*x*p-c*n*g+t*u*g)*P,e[14]=(v*o*s-a*x*s-v*n*l+t*x*l+a*n*g-t*o*g)*P,e[15]=(a*u*s-c*o*s+c*n*l-t*u*l-a*n*p+t*o*p)*P,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,h=r*a,c=r*o;return this.set(h*a+n,h*o-s*l,h*l+s*o,0,h*o+s*l,c*o+n,c*l-s*a,0,h*l-s*o,c*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,h=r+r,c=a+a,u=o+o,p=r*h,f=r*c,v=r*u,x=a*c,g=a*u,d=o*u,b=l*h,_=l*c,M=l*u,L=n.x,S=n.y,P=n.z;return s[0]=(1-(x+d))*L,s[1]=(f+M)*L,s[2]=(v-_)*L,s[3]=0,s[4]=(f-M)*S,s[5]=(1-(p+d))*S,s[6]=(g+b)*S,s[7]=0,s[8]=(v+_)*P,s[9]=(g-b)*P,s[10]=(1-(p+x))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=yi.set(s[0],s[1],s[2]).length();const a=yi.set(s[4],s[5],s[6]).length(),o=yi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],rn.copy(this);const h=1/r,c=1/a,u=1/o;return rn.elements[0]*=h,rn.elements[1]*=h,rn.elements[2]*=h,rn.elements[4]*=c,rn.elements[5]*=c,rn.elements[6]*=c,rn.elements[8]*=u,rn.elements[9]*=u,rn.elements[10]*=u,t.setFromRotationMatrix(rn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=In){const l=this.elements,h=2*r/(t-e),c=2*r/(n-s),u=(t+e)/(t-e),p=(n+s)/(n-s);let f,v;if(o===In)f=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===yr)f=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=c,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=In){const l=this.elements,h=1/(t-e),c=1/(n-s),u=1/(a-r),p=(t+e)*h,f=(n+s)*c;let v,x;if(o===In)v=(a+r)*u,x=-2*u;else if(o===yr)v=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*h,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*c,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const yi=new w,rn=new Xe,qu=new w(0,0,0),Yu=new w(1,1,1),Fn=new w,Ns=new w,Vt=new w,tl=new Xe,nl=new hn;class Ts{constructor(e=0,t=0,n=0,s=Ts.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],h=s[5],c=s[9],u=s[2],p=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-bt(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(bt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-bt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-c,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return tl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nl.setFromEuler(this),this.setFromQuaternion(nl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ts.DEFAULT_ORDER="XYZ";class Ka{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ju=0;const il=new w,Si=new hn,bn=new Xe,Os=new w,os=new w,$u=new w,Ku=new hn,sl=new w(1,0,0),rl=new w(0,1,0),al=new w(0,0,1),Zu={type:"added"},Ju={type:"removed"};class Et extends fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=gn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new w,t=new Ts,n=new hn,s=new w(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xe},normalMatrix:{value:new $e}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ka,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.multiply(Si),this}rotateOnWorldAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.premultiply(Si),this}rotateX(e){return this.rotateOnAxis(sl,e)}rotateY(e){return this.rotateOnAxis(rl,e)}rotateZ(e){return this.rotateOnAxis(al,e)}translateOnAxis(e,t){return il.copy(e).applyQuaternion(this.quaternion),this.position.add(il.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(sl,e)}translateY(e){return this.translateOnAxis(rl,e)}translateZ(e){return this.translateOnAxis(al,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Os.copy(e):Os.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(os,Os,this.up):bn.lookAt(Os,os,this.up),this.quaternion.setFromRotationMatrix(bn),s&&(bn.extractRotation(s.matrixWorld),Si.setFromRotationMatrix(bn),this.quaternion.premultiply(Si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Zu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ju)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),bn.multiply(e.parent.matrixWorld)),e.applyMatrix4(bn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,e,$u),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,Ku,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let h=0,c=l.length;h<c;h++){const u=l[h];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),h=a(e.textures),c=a(e.images),u=a(e.shapes),p=a(e.skeletons),f=a(e.animations),v=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),h.length>0&&(n.textures=h),c.length>0&&(n.images=c),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),f.length>0&&(n.animations=f),v.length>0&&(n.nodes=v)}return n.object=s,n;function a(o){const l=[];for(const h in o){const c=o[h];delete c.metadata,l.push(c)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Et.DEFAULT_UP=new w(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const an=new w,En=new w,ta=new w,wn=new w,bi=new w,Ei=new w,ol=new w,na=new w,ia=new w,sa=new w;let Fs=!1;class Qt{constructor(e=new w,t=new w,n=new w){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),an.subVectors(e,t),s.cross(an);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){an.subVectors(s,t),En.subVectors(n,t),ta.subVectors(e,t);const a=an.dot(an),o=an.dot(En),l=an.dot(ta),h=En.dot(En),c=En.dot(ta),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;const p=1/u,f=(h*l-o*c)*p,v=(a*c-o*l)*p;return r.set(1-f-v,v,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getUV(e,t,n,s,r,a,o,l){return Fs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Fs=!0),this.getInterpolation(e,t,n,s,r,a,o,l)}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wn.x),l.addScaledVector(a,wn.y),l.addScaledVector(o,wn.z),l)}static isFrontFacing(e,t,n,s){return an.subVectors(n,t),En.subVectors(e,t),an.cross(En).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return an.subVectors(this.c,this.b),En.subVectors(this.a,this.b),an.cross(En).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Qt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Qt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,s,r){return Fs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Fs=!0),Qt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}getInterpolation(e,t,n,s,r){return Qt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Qt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Qt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;bi.subVectors(s,n),Ei.subVectors(r,n),na.subVectors(e,n);const l=bi.dot(na),h=Ei.dot(na);if(l<=0&&h<=0)return t.copy(n);ia.subVectors(e,s);const c=bi.dot(ia),u=Ei.dot(ia);if(c>=0&&u<=c)return t.copy(s);const p=l*u-c*h;if(p<=0&&l>=0&&c<=0)return a=l/(l-c),t.copy(n).addScaledVector(bi,a);sa.subVectors(e,r);const f=bi.dot(sa),v=Ei.dot(sa);if(v>=0&&f<=v)return t.copy(r);const x=f*h-l*v;if(x<=0&&h>=0&&v<=0)return o=h/(h-v),t.copy(n).addScaledVector(Ei,o);const g=c*v-f*u;if(g<=0&&u-c>=0&&f-v>=0)return ol.subVectors(r,s),o=(u-c)/(u-c+(f-v)),t.copy(s).addScaledVector(ol,o);const d=1/(g+x+p);return a=x*d,o=p*d,t.copy(n).addScaledVector(bi,a).addScaledVector(Ei,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Bc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zn={h:0,s:0,l:0},zs={h:0,s:0,l:0};function ra(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ke{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,rt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=rt.workingColorSpace){if(e=$a(e,1),t=bt(t,0,1),n=bt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ra(a,r,e+1/3),this.g=ra(a,r,e),this.b=ra(a,r,e-1/3)}return rt.toWorkingColorSpace(this,s),this}setStyle(e,t=Ct){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ct){const n=Bc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wi(e.r),this.g=Wi(e.g),this.b=Wi(e.b),this}copyLinearToSRGB(e){return this.r=Yr(e.r),this.g=Yr(e.g),this.b=Yr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ct){return rt.fromWorkingColorSpace(Nt.copy(this),e),Math.round(bt(Nt.r*255,0,255))*65536+Math.round(bt(Nt.g*255,0,255))*256+Math.round(bt(Nt.b*255,0,255))}getHexString(e=Ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.fromWorkingColorSpace(Nt.copy(this),t);const n=Nt.r,s=Nt.g,r=Nt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,h;const c=(o+a)/2;if(o===a)l=0,h=0;else{const u=a-o;switch(h=c<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=h,e.l=c,e}getRGB(e,t=rt.workingColorSpace){return rt.fromWorkingColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=Ct){rt.fromWorkingColorSpace(Nt.copy(this),e);const t=Nt.r,n=Nt.g,s=Nt.b;return e!==Ct?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(zn),this.setHSL(zn.h+e,zn.s+t,zn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(zn),e.getHSL(zs);const n=_s(zn.h,zs.h,t),s=_s(zn.s,zs.s,t),r=_s(zn.l,zs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new Ke;Ke.NAMES=Bc;let Qu=0;class ns extends fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=gn(),this.name="",this.type="Material",this.blending=Vi,this.side=qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ua,this.blendDst=Na,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=_r,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Vi&&(n.blending=this.blending),this.side!==qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ua&&(n.blendSrc=this.blendSrc),this.blendDst!==Na&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_r&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ci extends ns{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=bc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Mt=new w,ks=new fe;class vt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ba,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ks.fromBufferAttribute(this,t),ks.applyMatrix3(e),this.setXY(t,ks.x,ks.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ba&&(e.usage=this.usage),e}}class Gc extends vt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Hc extends vt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class at extends vt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ef=0;const Kt=new Xe,aa=new Et,wi=new w,Wt=new ts,ls=new ts,Rt=new w;class It extends fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ef++}),this.uuid=gn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Oc(e)?Hc:Gc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Kt.makeRotationFromQuaternion(e),this.applyMatrix4(Kt),this}rotateX(e){return Kt.makeRotationX(e),this.applyMatrix4(Kt),this}rotateY(e){return Kt.makeRotationY(e),this.applyMatrix4(Kt),this}rotateZ(e){return Kt.makeRotationZ(e),this.applyMatrix4(Kt),this}translate(e,t,n){return Kt.makeTranslation(e,t,n),this.applyMatrix4(Kt),this}scale(e,t,n){return Kt.makeScale(e,t,n),this.applyMatrix4(Kt),this}lookAt(e){return aa.lookAt(e),aa.updateMatrix(),this.applyMatrix4(aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wi).negate(),this.translate(wi.x,wi.y,wi.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new at(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ts);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Wt.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ws);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new w,1/0);return}if(e){const n=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors(Wt.min,ls.min),Wt.expandByPoint(Rt),Rt.addVectors(Wt.max,ls.max),Wt.expandByPoint(Rt)):(Wt.expandByPoint(ls.min),Wt.expandByPoint(ls.max))}Wt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Rt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Rt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let h=0,c=o.count;h<c;h++)Rt.fromBufferAttribute(o,h),l&&(wi.fromBufferAttribute(e,h),Rt.add(wi)),s=Math.max(s,n.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,s=t.position.array,r=t.normal.array,a=t.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vt(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,h=[],c=[];for(let y=0;y<o;y++)h[y]=new w,c[y]=new w;const u=new w,p=new w,f=new w,v=new fe,x=new fe,g=new fe,d=new w,b=new w;function _(y,U,k){u.fromArray(s,y*3),p.fromArray(s,U*3),f.fromArray(s,k*3),v.fromArray(a,y*2),x.fromArray(a,U*2),g.fromArray(a,k*2),p.sub(u),f.sub(u),x.sub(v),g.sub(v);const K=1/(x.x*g.y-g.x*x.y);isFinite(K)&&(d.copy(p).multiplyScalar(g.y).addScaledVector(f,-x.y).multiplyScalar(K),b.copy(f).multiplyScalar(x.x).addScaledVector(p,-g.x).multiplyScalar(K),h[y].add(d),h[U].add(d),h[k].add(d),c[y].add(b),c[U].add(b),c[k].add(b))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let y=0,U=M.length;y<U;++y){const k=M[y],K=k.start,N=k.count;for(let B=K,G=K+N;B<G;B+=3)_(n[B+0],n[B+1],n[B+2])}const L=new w,S=new w,P=new w,W=new w;function m(y){P.fromArray(r,y*3),W.copy(P);const U=h[y];L.copy(U),L.sub(P.multiplyScalar(P.dot(U))).normalize(),S.crossVectors(W,U);const K=S.dot(c[y])<0?-1:1;l[y*4]=L.x,l[y*4+1]=L.y,l[y*4+2]=L.z,l[y*4+3]=K}for(let y=0,U=M.length;y<U;++y){const k=M[y],K=k.start,N=k.count;for(let B=K,G=K+N;B<G;B+=3)m(n[B+0]),m(n[B+1]),m(n[B+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new vt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,f=n.count;p<f;p++)n.setXYZ(p,0,0,0);const s=new w,r=new w,a=new w,o=new w,l=new w,h=new w,c=new w,u=new w;if(e)for(let p=0,f=e.count;p<f;p+=3){const v=e.getX(p+0),x=e.getX(p+1),g=e.getX(p+2);s.fromBufferAttribute(t,v),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),c.subVectors(a,r),u.subVectors(s,r),c.cross(u),o.fromBufferAttribute(n,v),l.fromBufferAttribute(n,x),h.fromBufferAttribute(n,g),o.add(c),l.add(c),h.add(c),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,h.x,h.y,h.z)}else for(let p=0,f=t.count;p<f;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),c.subVectors(a,r),u.subVectors(s,r),c.cross(u),n.setXYZ(p+0,c.x,c.y,c.z),n.setXYZ(p+1,c.x,c.y,c.z),n.setXYZ(p+2,c.x,c.y,c.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,l){const h=o.array,c=o.itemSize,u=o.normalized,p=new h.constructor(l.length*c);let f=0,v=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*c;for(let d=0;d<c;d++)p[v++]=h[f++]}return new vt(p,c,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new It,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],h=e(l,n);t.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const l=[],h=r[o];for(let c=0,u=h.length;c<u;c++){const p=h[c],f=e(p,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const h=a[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const h in l)l[h]!==void 0&&(e[h]=l[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const h=n[l];e.data.attributes[l]=h.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const h=this.morphAttributes[l],c=[];for(let u=0,p=h.length;u<p;u++){const f=h[u];c.push(f.toJSON(e.data))}c.length>0&&(s[l]=c,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const h in s){const c=s[h];this.setAttribute(h,c.clone(t))}const r=e.morphAttributes;for(const h in r){const c=[],u=r[h];for(let p=0,f=u.length;p<f;p++)c.push(u[p].clone(t));this.morphAttributes[h]=c}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let h=0,c=a.length;h<c;h++){const u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ll=new Xe,Zn=new Pr,Bs=new ws,cl=new w,Ti=new w,Ai=new w,Ri=new w,oa=new w,Gs=new w,Hs=new fe,Vs=new fe,Ws=new fe,hl=new w,ul=new w,fl=new w,Xs=new w,qs=new w;class Lt extends Et{constructor(e=new It,t=new ci){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Gs.set(0,0,0);for(let l=0,h=r.length;l<h;l++){const c=o[l],u=r[l];c!==0&&(oa.fromBufferAttribute(u,e),a?Gs.addScaledVector(oa,c):Gs.addScaledVector(oa.sub(t),c))}t.add(Gs)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Bs.copy(n.boundingSphere),Bs.applyMatrix4(r),Zn.copy(e.ray).recast(e.near),!(Bs.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(Bs,cl)===null||Zn.origin.distanceToSquared(cl)>(e.far-e.near)**2))&&(ll.copy(r).invert(),Zn.copy(e.ray).applyMatrix4(ll),!(n.boundingBox!==null&&Zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Zn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,h=r.attributes.uv,c=r.attributes.uv1,u=r.attributes.normal,p=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,x=p.length;v<x;v++){const g=p[v],d=a[g.materialIndex],b=Math.max(g.start,f.start),_=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let M=b,L=_;M<L;M+=3){const S=o.getX(M),P=o.getX(M+1),W=o.getX(M+2);s=Ys(this,d,e,n,h,c,u,S,P,W),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const v=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=v,d=x;g<d;g+=3){const b=o.getX(g),_=o.getX(g+1),M=o.getX(g+2);s=Ys(this,a,e,n,h,c,u,b,_,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,x=p.length;v<x;v++){const g=p[v],d=a[g.materialIndex],b=Math.max(g.start,f.start),_=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let M=b,L=_;M<L;M+=3){const S=M,P=M+1,W=M+2;s=Ys(this,d,e,n,h,c,u,S,P,W),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const v=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=v,d=x;g<d;g+=3){const b=g,_=g+1,M=g+2;s=Ys(this,a,e,n,h,c,u,b,_,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function tf(i,e,t,n,s,r,a,o){let l;if(e.side===Gt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===qn,o),l===null)return null;qs.copy(o),qs.applyMatrix4(i.matrixWorld);const h=t.ray.origin.distanceTo(qs);return h<t.near||h>t.far?null:{distance:h,point:qs.clone(),object:i}}function Ys(i,e,t,n,s,r,a,o,l,h){i.getVertexPosition(o,Ti),i.getVertexPosition(l,Ai),i.getVertexPosition(h,Ri);const c=tf(i,e,t,n,Ti,Ai,Ri,Xs);if(c){s&&(Hs.fromBufferAttribute(s,o),Vs.fromBufferAttribute(s,l),Ws.fromBufferAttribute(s,h),c.uv=Qt.getInterpolation(Xs,Ti,Ai,Ri,Hs,Vs,Ws,new fe)),r&&(Hs.fromBufferAttribute(r,o),Vs.fromBufferAttribute(r,l),Ws.fromBufferAttribute(r,h),c.uv1=Qt.getInterpolation(Xs,Ti,Ai,Ri,Hs,Vs,Ws,new fe),c.uv2=c.uv1),a&&(hl.fromBufferAttribute(a,o),ul.fromBufferAttribute(a,l),fl.fromBufferAttribute(a,h),c.normal=Qt.getInterpolation(Xs,Ti,Ai,Ri,hl,ul,fl,new w),c.normal.dot(n.direction)>0&&c.normal.multiplyScalar(-1));const u={a:o,b:l,c:h,normal:new w,materialIndex:0};Qt.getNormal(Ti,Ai,Ri,u.normal),c.face=u}return c}class et extends It{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],h=[],c=[],u=[];let p=0,f=0;v("z","y","x",-1,-1,n,t,e,a,r,0),v("z","y","x",1,-1,n,t,-e,a,r,1),v("x","z","y",1,1,e,n,t,s,a,2),v("x","z","y",1,-1,e,n,-t,s,a,3),v("x","y","z",1,-1,e,t,n,s,r,4),v("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new at(h,3)),this.setAttribute("normal",new at(c,3)),this.setAttribute("uv",new at(u,2));function v(x,g,d,b,_,M,L,S,P,W,m){const y=M/P,U=L/W,k=M/2,K=L/2,N=S/2,B=P+1,G=W+1;let Y=0,te=0;const J=new w;for(let j=0;j<G;j++){const F=j*U-K;for(let R=0;R<B;R++){const I=R*y-k;J[x]=I*b,J[g]=F*_,J[d]=N,h.push(J.x,J.y,J.z),J[x]=0,J[g]=0,J[d]=S>0?1:-1,c.push(J.x,J.y,J.z),u.push(R/P),u.push(1-j/W),Y+=1}}for(let j=0;j<W;j++)for(let F=0;F<P;F++){const R=p+F+B*j,I=p+F+B*(j+1),C=p+(F+1)+B*(j+1),D=p+(F+1)+B*j;l.push(R,I,D),l.push(I,C,D),te+=6}o.addGroup(f,te,m),f+=te,p+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new et(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Zi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ft(i){const e={};for(let t=0;t<i.length;t++){const n=Zi(i[t]);for(const s in n)e[s]=n[s]}return e}function nf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Vc(i){return i.getRenderTarget()===null?i.outputColorSpace:rt.workingColorSpace}const sf={clone:Zi,merge:Ft};var rf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,af=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hi extends ns{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rf,this.fragmentShader=af,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zi(e.uniforms),this.uniformsGroups=nf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Wc extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=In}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Yt extends Wc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=bs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(gs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return bs*2*Math.atan(Math.tan(gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(gs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/h,s*=a.width/l,n*=a.height/h}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ci=-90,Pi=1;class of extends Et{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Yt(Ci,Pi,e,t);s.layers=this.layers,this.add(s);const r=new Yt(Ci,Pi,e,t);r.layers=this.layers,this.add(r);const a=new Yt(Ci,Pi,e,t);a.layers=this.layers,this.add(a);const o=new Yt(Ci,Pi,e,t);o.layers=this.layers,this.add(o);const l=new Yt(Ci,Pi,e,t);l.layers=this.layers,this.add(l);const h=new Yt(Ci,Pi,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const h of t)this.remove(h);if(e===In)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===yr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,h,c]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,h),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,c),e.setRenderTarget(u,p,f),e.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class Xc extends kt{constructor(e,t,n,s,r,a,o,l,h,c){e=e!==void 0?e:[],t=t!==void 0?t:ji,super(e,t,n,s,r,a,o,l,h,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class lf extends li{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&(vs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===ai?Ct:tn),this.texture=new Xc(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:qt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new et(5,5,5),r=new hi({name:"CubemapFromEquirect",uniforms:Zi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gt,blending:Vn});r.uniforms.tEquirect.value=t;const a=new Lt(s,r),o=t.minFilter;return t.minFilter===ys&&(t.minFilter=qt),new of(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}const la=new w,cf=new w,hf=new $e;class Bn{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=la.subVectors(n,t).cross(cf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(la),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||hf.getNormalMatrix(e),s=this.coplanarPoint(la).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jn=new ws,js=new w;class Za{constructor(e=new Bn,t=new Bn,n=new Bn,s=new Bn,r=new Bn,a=new Bn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=In){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],h=s[4],c=s[5],u=s[6],p=s[7],f=s[8],v=s[9],x=s[10],g=s[11],d=s[12],b=s[13],_=s[14],M=s[15];if(n[0].setComponents(l-r,p-h,g-f,M-d).normalize(),n[1].setComponents(l+r,p+h,g+f,M+d).normalize(),n[2].setComponents(l+a,p+c,g+v,M+b).normalize(),n[3].setComponents(l-a,p-c,g-v,M-b).normalize(),n[4].setComponents(l-o,p-u,g-x,M-_).normalize(),t===In)n[5].setComponents(l+o,p+u,g+x,M+_).normalize();else if(t===yr)n[5].setComponents(o,u,x,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Jn)}intersectsSprite(e){return Jn.center.set(0,0,0),Jn.radius=.7071067811865476,Jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Jn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(js.x=s.normal.x>0?e.max.x:e.min.x,js.y=s.normal.y>0?e.max.y:e.min.y,js.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(js)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function qc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function uf(i,e){const t=e.isWebGL2,n=new WeakMap;function s(h,c){const u=h.array,p=h.usage,f=u.byteLength,v=i.createBuffer();i.bindBuffer(c,v),i.bufferData(c,u,p),h.onUploadCallback();let x;if(u instanceof Float32Array)x=i.FLOAT;else if(u instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(t)x=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=i.SHORT;else if(u instanceof Uint32Array)x=i.UNSIGNED_INT;else if(u instanceof Int32Array)x=i.INT;else if(u instanceof Int8Array)x=i.BYTE;else if(u instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:v,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:h.version,size:f}}function r(h,c,u){const p=c.array,f=c._updateRange,v=c.updateRanges;if(i.bindBuffer(u,h),f.count===-1&&v.length===0&&i.bufferSubData(u,0,p),v.length!==0){for(let x=0,g=v.length;x<g;x++){const d=v[x];t?i.bufferSubData(u,d.start*p.BYTES_PER_ELEMENT,p,d.start,d.count):i.bufferSubData(u,d.start*p.BYTES_PER_ELEMENT,p.subarray(d.start,d.start+d.count))}c.clearUpdateRanges()}f.count!==-1&&(t?i.bufferSubData(u,f.offset*p.BYTES_PER_ELEMENT,p,f.offset,f.count):i.bufferSubData(u,f.offset*p.BYTES_PER_ELEMENT,p.subarray(f.offset,f.offset+f.count)),f.count=-1),c.onUploadCallback()}function a(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function o(h){h.isInterleavedBufferAttribute&&(h=h.data);const c=n.get(h);c&&(i.deleteBuffer(c.buffer),n.delete(h))}function l(h,c){if(h.isGLBufferAttribute){const p=n.get(h);(!p||p.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);const u=n.get(h);if(u===void 0)n.set(h,s(h,c));else if(u.version<h.version){if(u.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,h,c),u.version=h.version}}return{get:a,remove:o,update:l}}class Lr extends It{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),h=o+1,c=l+1,u=e/o,p=t/l,f=[],v=[],x=[],g=[];for(let d=0;d<c;d++){const b=d*p-a;for(let _=0;_<h;_++){const M=_*u-r;v.push(M,-b,0),x.push(0,0,1),g.push(_/o),g.push(1-d/l)}}for(let d=0;d<l;d++)for(let b=0;b<o;b++){const _=b+h*d,M=b+h*(d+1),L=b+1+h*(d+1),S=b+1+h*d;f.push(_,M,S),f.push(M,L,S)}this.setIndex(f),this.setAttribute("position",new at(v,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Lr(e.width,e.height,e.widthSegments,e.heightSegments)}}var ff=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,df=`#ifdef USE_ALPHAHASH
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
#endif`,pf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,_f=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vf=`#ifdef USE_AOMAP
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
#endif`,xf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mf=`#ifdef USE_BATCHING
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
#endif`,yf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Sf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ef=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,wf=`#ifdef USE_IRIDESCENCE
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
#endif`,Tf=`#ifdef USE_BUMPMAP
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
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,If=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Df=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Uf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Nf=`#define PI 3.141592653589793
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
} // validated`,Of=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ff=`vec3 transformedNormal = objectNormal;
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
#endif`,zf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vf=`
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
}`,Wf=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qf=`#ifdef USE_ENVMAP
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
#endif`,Yf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jf=`#ifdef USE_ENVMAP
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
#endif`,$f=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qf=`#ifdef USE_GRADIENTMAP
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
}`,ed=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,td=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,id=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sd=`uniform bool receiveShadow;
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
#endif`,rd=`#ifdef USE_ENVMAP
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
#endif`,ad=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,od=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ld=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hd=`PhysicalMaterial material;
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
#endif`,ud=`struct PhysicalMaterial {
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
}`,fd=`
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
#endif`,dd=`#if defined( RE_IndirectDiffuse )
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
#endif`,pd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,md=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_d=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,vd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,xd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Md=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,yd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Sd=`#if defined( USE_POINTS_UV )
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
#endif`,bd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ed=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Td=`#ifdef USE_MORPHNORMALS
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
#endif`,Ad=`#ifdef USE_MORPHTARGETS
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
#endif`,Rd=`#ifdef USE_MORPHTARGETS
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
#endif`,Cd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Pd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ld=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Id=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ud=`#ifdef USE_NORMALMAP
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
#endif`,Nd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Od=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Gd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Wd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Yd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$d=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Kd=`float getShadowMask() {
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
}`,Zd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Jd=`#ifdef USE_SKINNING
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
#endif`,Qd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ep=`#ifdef USE_SKINNING
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
#endif`,tp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,np=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ip=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,sp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,rp=`#ifdef USE_TRANSMISSION
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
#endif`,ap=`#ifdef USE_TRANSMISSION
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
#endif`,op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const up=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fp=`uniform sampler2D t2D;
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
}`,dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_p=`#include <common>
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
}`,vp=`#if DEPTH_PACKING == 3200
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
}`,xp=`#define DISTANCE
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
}`,Mp=`#define DISTANCE
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
}`,yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Sp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bp=`uniform float scale;
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
}`,Ep=`uniform vec3 diffuse;
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
}`,wp=`#include <common>
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
}`,Tp=`uniform vec3 diffuse;
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
}`,Ap=`#define LAMBERT
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
}`,Rp=`#define LAMBERT
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
}`,Cp=`#define MATCAP
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
}`,Pp=`#define MATCAP
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
}`,Lp=`#define NORMAL
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
}`,Ip=`#define NORMAL
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
}`,Dp=`#define PHONG
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
}`,Up=`#define PHONG
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
}`,Np=`#define STANDARD
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
}`,Op=`#define STANDARD
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
}`,Fp=`#define TOON
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
}`,zp=`#define TOON
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
}`,kp=`uniform float size;
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
}`,Bp=`uniform vec3 diffuse;
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
}`,Gp=`#include <common>
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
}`,Hp=`uniform vec3 color;
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
}`,Vp=`uniform float rotation;
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
}`,Wp=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:ff,alphahash_pars_fragment:df,alphamap_fragment:pf,alphamap_pars_fragment:mf,alphatest_fragment:gf,alphatest_pars_fragment:_f,aomap_fragment:vf,aomap_pars_fragment:xf,batching_pars_vertex:Mf,batching_vertex:yf,begin_vertex:Sf,beginnormal_vertex:bf,bsdfs:Ef,iridescence_fragment:wf,bumpmap_pars_fragment:Tf,clipping_planes_fragment:Af,clipping_planes_pars_fragment:Rf,clipping_planes_pars_vertex:Cf,clipping_planes_vertex:Pf,color_fragment:Lf,color_pars_fragment:If,color_pars_vertex:Df,color_vertex:Uf,common:Nf,cube_uv_reflection_fragment:Of,defaultnormal_vertex:Ff,displacementmap_pars_vertex:zf,displacementmap_vertex:kf,emissivemap_fragment:Bf,emissivemap_pars_fragment:Gf,colorspace_fragment:Hf,colorspace_pars_fragment:Vf,envmap_fragment:Wf,envmap_common_pars_fragment:Xf,envmap_pars_fragment:qf,envmap_pars_vertex:Yf,envmap_physical_pars_fragment:rd,envmap_vertex:jf,fog_vertex:$f,fog_pars_vertex:Kf,fog_fragment:Zf,fog_pars_fragment:Jf,gradientmap_pars_fragment:Qf,lightmap_fragment:ed,lightmap_pars_fragment:td,lights_lambert_fragment:nd,lights_lambert_pars_fragment:id,lights_pars_begin:sd,lights_toon_fragment:ad,lights_toon_pars_fragment:od,lights_phong_fragment:ld,lights_phong_pars_fragment:cd,lights_physical_fragment:hd,lights_physical_pars_fragment:ud,lights_fragment_begin:fd,lights_fragment_maps:dd,lights_fragment_end:pd,logdepthbuf_fragment:md,logdepthbuf_pars_fragment:gd,logdepthbuf_pars_vertex:_d,logdepthbuf_vertex:vd,map_fragment:xd,map_pars_fragment:Md,map_particle_fragment:yd,map_particle_pars_fragment:Sd,metalnessmap_fragment:bd,metalnessmap_pars_fragment:Ed,morphcolor_vertex:wd,morphnormal_vertex:Td,morphtarget_pars_vertex:Ad,morphtarget_vertex:Rd,normal_fragment_begin:Cd,normal_fragment_maps:Pd,normal_pars_fragment:Ld,normal_pars_vertex:Id,normal_vertex:Dd,normalmap_pars_fragment:Ud,clearcoat_normal_fragment_begin:Nd,clearcoat_normal_fragment_maps:Od,clearcoat_pars_fragment:Fd,iridescence_pars_fragment:zd,opaque_fragment:kd,packing:Bd,premultiplied_alpha_fragment:Gd,project_vertex:Hd,dithering_fragment:Vd,dithering_pars_fragment:Wd,roughnessmap_fragment:Xd,roughnessmap_pars_fragment:qd,shadowmap_pars_fragment:Yd,shadowmap_pars_vertex:jd,shadowmap_vertex:$d,shadowmask_pars_fragment:Kd,skinbase_vertex:Zd,skinning_pars_vertex:Jd,skinning_vertex:Qd,skinnormal_vertex:ep,specularmap_fragment:tp,specularmap_pars_fragment:np,tonemapping_fragment:ip,tonemapping_pars_fragment:sp,transmission_fragment:rp,transmission_pars_fragment:ap,uv_pars_fragment:op,uv_pars_vertex:lp,uv_vertex:cp,worldpos_vertex:hp,background_vert:up,background_frag:fp,backgroundCube_vert:dp,backgroundCube_frag:pp,cube_vert:mp,cube_frag:gp,depth_vert:_p,depth_frag:vp,distanceRGBA_vert:xp,distanceRGBA_frag:Mp,equirect_vert:yp,equirect_frag:Sp,linedashed_vert:bp,linedashed_frag:Ep,meshbasic_vert:wp,meshbasic_frag:Tp,meshlambert_vert:Ap,meshlambert_frag:Rp,meshmatcap_vert:Cp,meshmatcap_frag:Pp,meshnormal_vert:Lp,meshnormal_frag:Ip,meshphong_vert:Dp,meshphong_frag:Up,meshphysical_vert:Np,meshphysical_frag:Op,meshtoon_vert:Fp,meshtoon_frag:zp,points_vert:kp,points_frag:Bp,shadow_vert:Gp,shadow_frag:Hp,sprite_vert:Vp,sprite_frag:Wp},pe={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},dn={basic:{uniforms:Ft([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Ft([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Ft([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Ft([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Ft([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Ft([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Ft([pe.points,pe.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Ft([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Ft([pe.common,pe.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Ft([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Ft([pe.sprite,pe.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Ft([pe.common,pe.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Ft([pe.lights,pe.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};dn.physical={uniforms:Ft([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const $s={r:0,b:0,g:0};function Xp(i,e,t,n,s,r,a){const o=new Ke(0);let l=r===!0?0:1,h,c,u=null,p=0,f=null;function v(g,d){let b=!1,_=d.isScene===!0?d.background:null;_&&_.isTexture&&(_=(d.backgroundBlurriness>0?t:e).get(_)),_===null?x(o,l):_&&_.isColor&&(x(_,1),b=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,a):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||b)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Rr)?(c===void 0&&(c=new Lt(new et(1,1,1),new hi({name:"BackgroundCubeMaterial",uniforms:Zi(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(L,S,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=rt.getTransfer(_.colorSpace)!==ht,(u!==_||p!==_.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=_,p=_.version,f=i.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(h===void 0&&(h=new Lt(new Lr(2,2),new hi({name:"BackgroundMaterial",uniforms:Zi(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=_,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=rt.getTransfer(_.colorSpace)!==ht,_.matrixAutoUpdate===!0&&_.updateMatrix(),h.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||p!==_.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=_,p=_.version,f=i.toneMapping),h.layers.enableAll(),g.unshift(h,h.geometry,h.material,0,0,null))}function x(g,d){g.getRGB($s,Vc(i)),n.buffers.color.setClear($s.r,$s.g,$s.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(g,d=1){o.set(g),l=d,x(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,x(o,l)},render:v}}function qp(i,e,t,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=g(null);let h=l,c=!1;function u(N,B,G,Y,te){let J=!1;if(a){const j=x(Y,G,B);h!==j&&(h=j,f(h.object)),J=d(N,Y,G,te),J&&b(N,Y,G,te)}else{const j=B.wireframe===!0;(h.geometry!==Y.id||h.program!==G.id||h.wireframe!==j)&&(h.geometry=Y.id,h.program=G.id,h.wireframe=j,J=!0)}te!==null&&t.update(te,i.ELEMENT_ARRAY_BUFFER),(J||c)&&(c=!1,W(N,B,G,Y),te!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(te).buffer))}function p(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(N){return n.isWebGL2?i.bindVertexArray(N):r.bindVertexArrayOES(N)}function v(N){return n.isWebGL2?i.deleteVertexArray(N):r.deleteVertexArrayOES(N)}function x(N,B,G){const Y=G.wireframe===!0;let te=o[N.id];te===void 0&&(te={},o[N.id]=te);let J=te[B.id];J===void 0&&(J={},te[B.id]=J);let j=J[Y];return j===void 0&&(j=g(p()),J[Y]=j),j}function g(N){const B=[],G=[],Y=[];for(let te=0;te<s;te++)B[te]=0,G[te]=0,Y[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:G,attributeDivisors:Y,object:N,attributes:{},index:null}}function d(N,B,G,Y){const te=h.attributes,J=B.attributes;let j=0;const F=G.getAttributes();for(const R in F)if(F[R].location>=0){const C=te[R];let D=J[R];if(D===void 0&&(R==="instanceMatrix"&&N.instanceMatrix&&(D=N.instanceMatrix),R==="instanceColor"&&N.instanceColor&&(D=N.instanceColor)),C===void 0||C.attribute!==D||D&&C.data!==D.data)return!0;j++}return h.attributesNum!==j||h.index!==Y}function b(N,B,G,Y){const te={},J=B.attributes;let j=0;const F=G.getAttributes();for(const R in F)if(F[R].location>=0){let C=J[R];C===void 0&&(R==="instanceMatrix"&&N.instanceMatrix&&(C=N.instanceMatrix),R==="instanceColor"&&N.instanceColor&&(C=N.instanceColor));const D={};D.attribute=C,C&&C.data&&(D.data=C.data),te[R]=D,j++}h.attributes=te,h.attributesNum=j,h.index=Y}function _(){const N=h.newAttributes;for(let B=0,G=N.length;B<G;B++)N[B]=0}function M(N){L(N,0)}function L(N,B){const G=h.newAttributes,Y=h.enabledAttributes,te=h.attributeDivisors;G[N]=1,Y[N]===0&&(i.enableVertexAttribArray(N),Y[N]=1),te[N]!==B&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](N,B),te[N]=B)}function S(){const N=h.newAttributes,B=h.enabledAttributes;for(let G=0,Y=B.length;G<Y;G++)B[G]!==N[G]&&(i.disableVertexAttribArray(G),B[G]=0)}function P(N,B,G,Y,te,J,j){j===!0?i.vertexAttribIPointer(N,B,G,te,J):i.vertexAttribPointer(N,B,G,Y,te,J)}function W(N,B,G,Y){if(n.isWebGL2===!1&&(N.isInstancedMesh||Y.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;_();const te=Y.attributes,J=G.getAttributes(),j=B.defaultAttributeValues;for(const F in J){const R=J[F];if(R.location>=0){let I=te[F];if(I===void 0&&(F==="instanceMatrix"&&N.instanceMatrix&&(I=N.instanceMatrix),F==="instanceColor"&&N.instanceColor&&(I=N.instanceColor)),I!==void 0){const C=I.normalized,D=I.itemSize,V=t.get(I);if(V===void 0)continue;const $=V.buffer,ne=V.type,le=V.bytesPerElement,ce=n.isWebGL2===!0&&(ne===i.INT||ne===i.UNSIGNED_INT||I.gpuType===Tc);if(I.isInterleavedBufferAttribute){const xe=I.data,H=xe.stride,Ne=I.offset;if(xe.isInstancedInterleavedBuffer){for(let de=0;de<R.locationSize;de++)L(R.location+de,xe.meshPerAttribute);N.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let de=0;de<R.locationSize;de++)M(R.location+de);i.bindBuffer(i.ARRAY_BUFFER,$);for(let de=0;de<R.locationSize;de++)P(R.location+de,D/R.locationSize,ne,C,H*le,(Ne+D/R.locationSize*de)*le,ce)}else{if(I.isInstancedBufferAttribute){for(let xe=0;xe<R.locationSize;xe++)L(R.location+xe,I.meshPerAttribute);N.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=I.meshPerAttribute*I.count)}else for(let xe=0;xe<R.locationSize;xe++)M(R.location+xe);i.bindBuffer(i.ARRAY_BUFFER,$);for(let xe=0;xe<R.locationSize;xe++)P(R.location+xe,D/R.locationSize,ne,C,D*le,D/R.locationSize*xe*le,ce)}}else if(j!==void 0){const C=j[F];if(C!==void 0)switch(C.length){case 2:i.vertexAttrib2fv(R.location,C);break;case 3:i.vertexAttrib3fv(R.location,C);break;case 4:i.vertexAttrib4fv(R.location,C);break;default:i.vertexAttrib1fv(R.location,C)}}}}S()}function m(){k();for(const N in o){const B=o[N];for(const G in B){const Y=B[G];for(const te in Y)v(Y[te].object),delete Y[te];delete B[G]}delete o[N]}}function y(N){if(o[N.id]===void 0)return;const B=o[N.id];for(const G in B){const Y=B[G];for(const te in Y)v(Y[te].object),delete Y[te];delete B[G]}delete o[N.id]}function U(N){for(const B in o){const G=o[B];if(G[N.id]===void 0)continue;const Y=G[N.id];for(const te in Y)v(Y[te].object),delete Y[te];delete G[N.id]}}function k(){K(),c=!0,h!==l&&(h=l,f(h.object))}function K(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:k,resetDefaultState:K,dispose:m,releaseStatesOfGeometry:y,releaseStatesOfProgram:U,initAttributes:_,enableAttribute:M,disableUnusedAttributes:S}}function Yp(i,e,t,n){const s=n.isWebGL2;let r;function a(c){r=c}function o(c,u){i.drawArrays(r,c,u),t.update(u,r,1)}function l(c,u,p){if(p===0)return;let f,v;if(s)f=i,v="drawArraysInstanced";else if(f=e.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[v](r,c,u,p),t.update(u,r,p)}function h(c,u,p){if(p===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let v=0;v<p;v++)this.render(c[v],u[v]);else{f.multiDrawArraysWEBGL(r,c,0,u,0,p);let v=0;for(let x=0;x<p;x++)v+=u[x];t.update(v,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=h}function jp(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const h=a||e.has("WEBGL_draw_buffers"),c=t.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),x=i.getParameter(i.MAX_VERTEX_ATTRIBS),g=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=p>0,M=a||e.has("OES_texture_float"),L=_&&M,S=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:c,maxTextures:u,maxVertexTextures:p,maxTextureSize:f,maxCubemapSize:v,maxAttributes:x,maxVertexUniforms:g,maxVaryings:d,maxFragmentUniforms:b,vertexTextures:_,floatFragmentTextures:M,floatVertexTextures:L,maxSamples:S}}function $p(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Bn,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const f=u.length!==0||p||n!==0||s;return s=p,n=u.length,f},this.beginShadows=function(){r=!0,c(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,p){t=c(u,p,0)},this.setState=function(u,p,f){const v=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,d=i.get(u);if(!s||v===null||v.length===0||r&&!g)r?c(null):h();else{const b=r?0:n,_=b*4;let M=d.clippingState||null;l.value=M,M=c(v,p,_,f);for(let L=0;L!==_;++L)M[L]=t[L];d.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function h(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function c(u,p,f,v){const x=u!==null?u.length:0;let g=null;if(x!==0){if(g=l.value,v!==!0||g===null){const d=f+x*4,b=p.matrixWorldInverse;o.getNormalMatrix(b),(g===null||g.length<d)&&(g=new Float32Array(d));for(let _=0,M=f;_!==x;++_,M+=4)a.copy(u[_]).applyMatrix4(b,o),a.normal.toArray(g,M),g[M+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function Kp(i){let e=new WeakMap;function t(a,o){return o===Oa?a.mapping=ji:o===Fa&&(a.mapping=$i),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Oa||o===Fa)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const h=new lf(l.height/2);return h.fromEquirectangularTexture(i,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Yc extends Wc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=c*this.view.offsetY,l=o-c*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const zi=4,dl=[.125,.215,.35,.446,.526,.582],ni=20,ca=new Yc,pl=new Ke;let ha=null,ua=0,fa=0;const ei=(1+Math.sqrt(5))/2,Li=1/ei,ml=[new w(1,1,1),new w(-1,1,1),new w(1,1,-1),new w(-1,1,-1),new w(0,ei,Li),new w(0,ei,-Li),new w(Li,0,ei),new w(-Li,0,ei),new w(ei,Li,0),new w(-ei,Li,0)];class gl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){ha=this._renderer.getRenderTarget(),ua=this._renderer.getActiveCubeFace(),fa=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ha,ua,fa),e.scissorTest=!1,Ks(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ji||e.mapping===$i?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ha=this._renderer.getRenderTarget(),ua=this._renderer.getActiveCubeFace(),fa=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:qt,minFilter:qt,generateMipmaps:!1,type:Ss,format:en,colorSpace:Dn,depthBuffer:!1},s=_l(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_l(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zp(r)),this._blurMaterial=Jp(r,e,t)}return s}_compileMaterial(e){const t=new Lt(this._lodPlanes[0],e);this._renderer.compile(t,ca)}_sceneToCubeUV(e,t,n,s){const o=new Yt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],c=this._renderer,u=c.autoClear,p=c.toneMapping;c.getClearColor(pl),c.toneMapping=Wn,c.autoClear=!1;const f=new ci({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1}),v=new Lt(new et,f);let x=!1;const g=e.background;g?g.isColor&&(f.color.copy(g),e.background=null,x=!0):(f.color.copy(pl),x=!0);for(let d=0;d<6;d++){const b=d%3;b===0?(o.up.set(0,l[d],0),o.lookAt(h[d],0,0)):b===1?(o.up.set(0,0,l[d]),o.lookAt(0,h[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,h[d]));const _=this._cubeSize;Ks(s,b*_,d>2?_:0,_,_),c.setRenderTarget(s),x&&c.render(v,o),c.render(e,o)}v.geometry.dispose(),v.material.dispose(),c.toneMapping=p,c.autoClear=u,e.background=g}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ji||e.mapping===$i;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=xl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Lt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Ks(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,ca)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=ml[(s-1)%ml.length];this._blur(e,s-1,s,r,a)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const c=3,u=new Lt(this._lodPlanes[s],h),p=h.uniforms,f=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ni-1),x=r/v,g=isFinite(r)?1+Math.floor(c*x):ni;g>ni&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ni}`);const d=[];let b=0;for(let P=0;P<ni;++P){const W=P/x,m=Math.exp(-W*W/2);d.push(m),P===0?b+=m:P<g&&(b+=2*m)}for(let P=0;P<d.length;P++)d[P]=d[P]/b;p.envMap.value=e.texture,p.samples.value=g,p.weights.value=d,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:_}=this;p.dTheta.value=v,p.mipInt.value=_-n;const M=this._sizeLods[s],L=3*M*(s>_-zi?s-_+zi:0),S=4*(this._cubeSize-M);Ks(t,L,S,3*M,2*M),l.setRenderTarget(t),l.render(u,ca)}}function Zp(i){const e=[],t=[],n=[];let s=i;const r=i-zi+1+dl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-zi?l=dl[a-i+zi-1]:a===0&&(l=0),n.push(l);const h=1/(o-2),c=-h,u=1+h,p=[c,c,u,c,u,u,c,c,u,u,c,u],f=6,v=6,x=3,g=2,d=1,b=new Float32Array(x*v*f),_=new Float32Array(g*v*f),M=new Float32Array(d*v*f);for(let S=0;S<f;S++){const P=S%3*2/3-1,W=S>2?0:-1,m=[P,W,0,P+2/3,W,0,P+2/3,W+1,0,P,W,0,P+2/3,W+1,0,P,W+1,0];b.set(m,x*v*S),_.set(p,g*v*S);const y=[S,S,S,S,S,S];M.set(y,d*v*S)}const L=new It;L.setAttribute("position",new vt(b,x)),L.setAttribute("uv",new vt(_,g)),L.setAttribute("faceIndex",new vt(M,d)),e.push(L),s>zi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function _l(i,e,t){const n=new li(i,e,t);return n.texture.mapping=Rr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ks(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Jp(i,e,t){const n=new Float32Array(ni),s=new w(0,1,0);return new hi({name:"SphericalGaussianBlur",defines:{n:ni,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ja(),fragmentShader:`

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
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function vl(){return new hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ja(),fragmentShader:`

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
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function xl(){return new hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Ja(){return`

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
	`}function Qp(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,h=l===Oa||l===Fa,c=l===ji||l===$i;if(h||c)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=e.get(o);return t===null&&(t=new gl(i)),u=h?t.fromEquirectangular(o,u):t.fromCubemap(o,u),e.set(o,u),u.texture}else{if(e.has(o))return e.get(o).texture;{const u=o.image;if(h&&u&&u.height>0||c&&u&&s(u)){t===null&&(t=new gl(i));const p=h?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,p),o.addEventListener("dispose",r),p.texture}else return null}}}return o}function s(o){let l=0;const h=6;for(let c=0;c<h;c++)o[c]!==void 0&&l++;return l===h}function r(o){const l=o.target;l.removeEventListener("dispose",r);const h=e.get(l);h!==void 0&&(e.delete(l),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function em(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function tm(i,e,t,n){const s={},r=new WeakMap;function a(u){const p=u.target;p.index!==null&&e.remove(p.index);for(const v in p.attributes)e.remove(p.attributes[v]);for(const v in p.morphAttributes){const x=p.morphAttributes[v];for(let g=0,d=x.length;g<d;g++)e.remove(x[g])}p.removeEventListener("dispose",a),delete s[p.id];const f=r.get(p);f&&(e.remove(f),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(u,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,t.memory.geometries++),p}function l(u){const p=u.attributes;for(const v in p)e.update(p[v],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const v in f){const x=f[v];for(let g=0,d=x.length;g<d;g++)e.update(x[g],i.ARRAY_BUFFER)}}function h(u){const p=[],f=u.index,v=u.attributes.position;let x=0;if(f!==null){const b=f.array;x=f.version;for(let _=0,M=b.length;_<M;_+=3){const L=b[_+0],S=b[_+1],P=b[_+2];p.push(L,S,S,P,P,L)}}else if(v!==void 0){const b=v.array;x=v.version;for(let _=0,M=b.length/3-1;_<M;_+=3){const L=_+0,S=_+1,P=_+2;p.push(L,S,S,P,P,L)}}else return;const g=new(Oc(p)?Hc:Gc)(p,1);g.version=x;const d=r.get(u);d&&e.remove(d),r.set(u,g)}function c(u){const p=r.get(u);if(p){const f=u.index;f!==null&&p.version<f.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:c}}function nm(i,e,t,n){const s=n.isWebGL2;let r;function a(f){r=f}let o,l;function h(f){o=f.type,l=f.bytesPerElement}function c(f,v){i.drawElements(r,v,o,f*l),t.update(v,r,1)}function u(f,v,x){if(x===0)return;let g,d;if(s)g=i,d="drawElementsInstanced";else if(g=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",g===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[d](r,v,o,f*l,x),t.update(v,r,x)}function p(f,v,x){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<x;d++)this.render(f[d]/l,v[d]);else{g.multiDrawElementsWEBGL(r,v,0,o,f,0,x);let d=0;for(let b=0;b<x;b++)d+=v[b];t.update(d,r,1)}}this.setMode=a,this.setIndex=h,this.render=c,this.renderInstances=u,this.renderMultiDraw=p}function im(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function sm(i,e){return i[0]-e[0]}function rm(i,e){return Math.abs(e[1])-Math.abs(i[1])}function am(i,e,t){const n={},s=new Float32Array(8),r=new WeakMap,a=new ot,o=[];for(let h=0;h<8;h++)o[h]=[h,0];function l(h,c,u){const p=h.morphTargetInfluences;if(e.isWebGL2===!0){const v=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,x=v!==void 0?v.length:0;let g=r.get(c);if(g===void 0||g.count!==x){let B=function(){K.dispose(),r.delete(c),c.removeEventListener("dispose",B)};var f=B;g!==void 0&&g.texture.dispose();const _=c.morphAttributes.position!==void 0,M=c.morphAttributes.normal!==void 0,L=c.morphAttributes.color!==void 0,S=c.morphAttributes.position||[],P=c.morphAttributes.normal||[],W=c.morphAttributes.color||[];let m=0;_===!0&&(m=1),M===!0&&(m=2),L===!0&&(m=3);let y=c.attributes.position.count*m,U=1;y>e.maxTextureSize&&(U=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const k=new Float32Array(y*U*4*x),K=new kc(k,y,U,x);K.type=Ln,K.needsUpdate=!0;const N=m*4;for(let G=0;G<x;G++){const Y=S[G],te=P[G],J=W[G],j=y*U*4*G;for(let F=0;F<Y.count;F++){const R=F*N;_===!0&&(a.fromBufferAttribute(Y,F),k[j+R+0]=a.x,k[j+R+1]=a.y,k[j+R+2]=a.z,k[j+R+3]=0),M===!0&&(a.fromBufferAttribute(te,F),k[j+R+4]=a.x,k[j+R+5]=a.y,k[j+R+6]=a.z,k[j+R+7]=0),L===!0&&(a.fromBufferAttribute(J,F),k[j+R+8]=a.x,k[j+R+9]=a.y,k[j+R+10]=a.z,k[j+R+11]=J.itemSize===4?a.w:1)}}g={count:x,texture:K,size:new fe(y,U)},r.set(c,g),c.addEventListener("dispose",B)}let d=0;for(let _=0;_<p.length;_++)d+=p[_];const b=c.morphTargetsRelative?1:1-d;u.getUniforms().setValue(i,"morphTargetBaseInfluence",b),u.getUniforms().setValue(i,"morphTargetInfluences",p),u.getUniforms().setValue(i,"morphTargetsTexture",g.texture,t),u.getUniforms().setValue(i,"morphTargetsTextureSize",g.size)}else{const v=p===void 0?0:p.length;let x=n[c.id];if(x===void 0||x.length!==v){x=[];for(let M=0;M<v;M++)x[M]=[M,0];n[c.id]=x}for(let M=0;M<v;M++){const L=x[M];L[0]=M,L[1]=p[M]}x.sort(rm);for(let M=0;M<8;M++)M<v&&x[M][1]?(o[M][0]=x[M][0],o[M][1]=x[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(sm);const g=c.morphAttributes.position,d=c.morphAttributes.normal;let b=0;for(let M=0;M<8;M++){const L=o[M],S=L[0],P=L[1];S!==Number.MAX_SAFE_INTEGER&&P?(g&&c.getAttribute("morphTarget"+M)!==g[S]&&c.setAttribute("morphTarget"+M,g[S]),d&&c.getAttribute("morphNormal"+M)!==d[S]&&c.setAttribute("morphNormal"+M,d[S]),s[M]=P,b+=P):(g&&c.hasAttribute("morphTarget"+M)===!0&&c.deleteAttribute("morphTarget"+M),d&&c.hasAttribute("morphNormal"+M)===!0&&c.deleteAttribute("morphNormal"+M),s[M]=0)}const _=c.morphTargetsRelative?1:1-b;u.getUniforms().setValue(i,"morphTargetBaseInfluence",_),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function om(i,e,t,n){let s=new WeakMap;function r(l){const h=n.render.frame,c=l.geometry,u=e.get(l,c);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==h&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,h))),l.isSkinnedMesh){const p=l.skeleton;s.get(p)!==h&&(p.update(),s.set(p,h))}return u}function a(){s=new WeakMap}function o(l){const h=l.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}class jc extends kt{constructor(e,t,n,s,r,a,o,l,h,c){if(c=c!==void 0?c:ri,c!==ri&&c!==Ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&c===ri&&(n=Hn),n===void 0&&c===Ki&&(n=si),super(null,s,r,a,o,l,c,n,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Pt,this.minFilter=l!==void 0?l:Pt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const $c=new kt,Kc=new jc(1,1);Kc.compareFunction=Nc;const Zc=new kc,Jc=new Wu,Qc=new Xc,Ml=[],yl=[],Sl=new Float32Array(16),bl=new Float32Array(9),El=new Float32Array(4);function is(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Ml[s];if(r===void 0&&(r=new Float32Array(s),Ml[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function wt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Tt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ir(i,e){let t=yl[e];t===void 0&&(t=new Int32Array(e),yl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function lm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function cm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;i.uniform2fv(this.addr,e),Tt(t,e)}}function hm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;i.uniform3fv(this.addr,e),Tt(t,e)}}function um(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;i.uniform4fv(this.addr,e),Tt(t,e)}}function fm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(wt(t,n))return;El.set(n),i.uniformMatrix2fv(this.addr,!1,El),Tt(t,n)}}function dm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(wt(t,n))return;bl.set(n),i.uniformMatrix3fv(this.addr,!1,bl),Tt(t,n)}}function pm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(wt(t,n))return;Sl.set(n),i.uniformMatrix4fv(this.addr,!1,Sl),Tt(t,n)}}function mm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function gm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;i.uniform2iv(this.addr,e),Tt(t,e)}}function _m(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;i.uniform3iv(this.addr,e),Tt(t,e)}}function vm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;i.uniform4iv(this.addr,e),Tt(t,e)}}function xm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Mm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;i.uniform2uiv(this.addr,e),Tt(t,e)}}function ym(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;i.uniform3uiv(this.addr,e),Tt(t,e)}}function Sm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;i.uniform4uiv(this.addr,e),Tt(t,e)}}function bm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Kc:$c;t.setTexture2D(e||r,s)}function Em(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Jc,s)}function wm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Qc,s)}function Tm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Zc,s)}function Am(i){switch(i){case 5126:return lm;case 35664:return cm;case 35665:return hm;case 35666:return um;case 35674:return fm;case 35675:return dm;case 35676:return pm;case 5124:case 35670:return mm;case 35667:case 35671:return gm;case 35668:case 35672:return _m;case 35669:case 35673:return vm;case 5125:return xm;case 36294:return Mm;case 36295:return ym;case 36296:return Sm;case 35678:case 36198:case 36298:case 36306:case 35682:return bm;case 35679:case 36299:case 36307:return Em;case 35680:case 36300:case 36308:case 36293:return wm;case 36289:case 36303:case 36311:case 36292:return Tm}}function Rm(i,e){i.uniform1fv(this.addr,e)}function Cm(i,e){const t=is(e,this.size,2);i.uniform2fv(this.addr,t)}function Pm(i,e){const t=is(e,this.size,3);i.uniform3fv(this.addr,t)}function Lm(i,e){const t=is(e,this.size,4);i.uniform4fv(this.addr,t)}function Im(i,e){const t=is(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Dm(i,e){const t=is(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Um(i,e){const t=is(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Nm(i,e){i.uniform1iv(this.addr,e)}function Om(i,e){i.uniform2iv(this.addr,e)}function Fm(i,e){i.uniform3iv(this.addr,e)}function zm(i,e){i.uniform4iv(this.addr,e)}function km(i,e){i.uniform1uiv(this.addr,e)}function Bm(i,e){i.uniform2uiv(this.addr,e)}function Gm(i,e){i.uniform3uiv(this.addr,e)}function Hm(i,e){i.uniform4uiv(this.addr,e)}function Vm(i,e,t){const n=this.cache,s=e.length,r=Ir(t,s);wt(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||$c,r[a])}function Wm(i,e,t){const n=this.cache,s=e.length,r=Ir(t,s);wt(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Jc,r[a])}function Xm(i,e,t){const n=this.cache,s=e.length,r=Ir(t,s);wt(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Qc,r[a])}function qm(i,e,t){const n=this.cache,s=e.length,r=Ir(t,s);wt(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Zc,r[a])}function Ym(i){switch(i){case 5126:return Rm;case 35664:return Cm;case 35665:return Pm;case 35666:return Lm;case 35674:return Im;case 35675:return Dm;case 35676:return Um;case 5124:case 35670:return Nm;case 35667:case 35671:return Om;case 35668:case 35672:return Fm;case 35669:case 35673:return zm;case 5125:return km;case 36294:return Bm;case 36295:return Gm;case 36296:return Hm;case 35678:case 36198:case 36298:case 36306:case 35682:return Vm;case 35679:case 36299:case 36307:return Wm;case 35680:case 36300:case 36308:case 36293:return Xm;case 36289:case 36303:case 36311:case 36292:return qm}}class jm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Am(t.type)}}class $m{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ym(t.type)}}class Km{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const da=/(\w+)(\])?(\[|\.)?/g;function wl(i,e){i.seq.push(e),i.map[e.id]=e}function Zm(i,e,t){const n=i.name,s=n.length;for(da.lastIndex=0;;){const r=da.exec(n),a=da.lastIndex;let o=r[1];const l=r[2]==="]",h=r[3];if(l&&(o=o|0),h===void 0||h==="["&&a+2===s){wl(t,h===void 0?new jm(o,i,e):new $m(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Km(o),wl(t,u)),t=u}}}class pr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Zm(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Tl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Jm=37297;let Qm=0;function e0(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function t0(i){const e=rt.getPrimaries(rt.workingColorSpace),t=rt.getPrimaries(i);let n;switch(e===t?n="":e===Mr&&t===xr?n="LinearDisplayP3ToLinearSRGB":e===xr&&t===Mr&&(n="LinearSRGBToLinearDisplayP3"),i){case Dn:case Cr:return[n,"LinearTransferOETF"];case Ct:case ja:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Al(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+e0(i.getShaderSource(e),a)}else return s}function n0(i,e){const t=t0(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function i0(i,e){let t;switch(e){case eu:t="Linear";break;case tu:t="Reinhard";break;case nu:t="OptimizedCineon";break;case Ec:t="ACESFilmic";break;case su:t="AgX";break;case iu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function s0(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ki).join(`
`)}function r0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ki).join(`
`)}function a0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function o0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ki(i){return i!==""}function Rl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Cl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const l0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Va(i){return i.replace(l0,h0)}const c0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function h0(i,e){let t=qe[e];if(t===void 0){const n=c0.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Va(t)}const u0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pl(i){return i.replace(u0,f0)}function f0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ll(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function d0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Sc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Rh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Tn&&(e="SHADOWMAP_TYPE_VSM"),e}function p0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ji:case $i:e="ENVMAP_TYPE_CUBE";break;case Rr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function m0(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case $i:e="ENVMAP_MODE_REFRACTION";break}return e}function g0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case bc:e="ENVMAP_BLENDING_MULTIPLY";break;case Jh:e="ENVMAP_BLENDING_MIX";break;case Qh:e="ENVMAP_BLENDING_ADD";break}return e}function _0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function v0(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=d0(t),h=p0(t),c=m0(t),u=g0(t),p=_0(t),f=t.isWebGL2?"":s0(t),v=r0(t),x=a0(r),g=s.createProgram();let d,b,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ki).join(`
`),d.length>0&&(d+=`
`),b=[f,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ki).join(`
`),b.length>0&&(b+=`
`)):(d=[Ll(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ki).join(`
`),b=[f,Ll(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Wn?"#define TONE_MAPPING":"",t.toneMapping!==Wn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Wn?i0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,n0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ki).join(`
`)),a=Va(a),a=Rl(a,t),a=Cl(a,t),o=Va(o),o=Rl(o,t),o=Cl(o,t),a=Pl(a),o=Pl(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,d=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,b=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===$o?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===$o?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);const M=_+d+a,L=_+b+o,S=Tl(s,s.VERTEX_SHADER,M),P=Tl(s,s.FRAGMENT_SHADER,L);s.attachShader(g,S),s.attachShader(g,P),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function W(k){if(i.debug.checkShaderErrors){const K=s.getProgramInfoLog(g).trim(),N=s.getShaderInfoLog(S).trim(),B=s.getShaderInfoLog(P).trim();let G=!0,Y=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,S,P);else{const te=Al(s,S,"vertex"),J=Al(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Program Info Log: `+K+`
`+te+`
`+J)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(N===""||B==="")&&(Y=!1);Y&&(k.diagnostics={runnable:G,programLog:K,vertexShader:{log:N,prefix:d},fragmentShader:{log:B,prefix:b}})}s.deleteShader(S),s.deleteShader(P),m=new pr(s,g),y=o0(s,g)}let m;this.getUniforms=function(){return m===void 0&&W(this),m};let y;this.getAttributes=function(){return y===void 0&&W(this),y};let U=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=s.getProgramParameter(g,Jm)),U},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Qm++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=P,this}let x0=0;class M0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new y0(e),t.set(e,n)),n}}class y0{constructor(e){this.id=x0++,this.code=e,this.usedTimes=0}}function S0(i,e,t,n,s,r,a){const o=new Ka,l=new M0,h=[],c=s.isWebGL2,u=s.logarithmicDepthBuffer,p=s.vertexTextures;let f=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(m){return m===0?"uv":`uv${m}`}function g(m,y,U,k,K){const N=k.fog,B=K.geometry,G=m.isMeshStandardMaterial?k.environment:null,Y=(m.isMeshStandardMaterial?t:e).get(m.envMap||G),te=Y&&Y.mapping===Rr?Y.image.height:null,J=v[m.type];m.precision!==null&&(f=s.getMaxPrecision(m.precision),f!==m.precision&&console.warn("THREE.WebGLProgram.getParameters:",m.precision,"not supported, using",f,"instead."));const j=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,F=j!==void 0?j.length:0;let R=0;B.morphAttributes.position!==void 0&&(R=1),B.morphAttributes.normal!==void 0&&(R=2),B.morphAttributes.color!==void 0&&(R=3);let I,C,D,V;if(J){const mt=dn[J];I=mt.vertexShader,C=mt.fragmentShader}else I=m.vertexShader,C=m.fragmentShader,l.update(m),D=l.getVertexShaderID(m),V=l.getFragmentShaderID(m);const $=i.getRenderTarget(),ne=K.isInstancedMesh===!0,le=K.isBatchedMesh===!0,ce=!!m.map,xe=!!m.matcap,H=!!Y,Ne=!!m.aoMap,de=!!m.lightMap,Me=!!m.bumpMap,me=!!m.normalMap,He=!!m.displacementMap,Pe=!!m.emissiveMap,T=!!m.metalnessMap,E=!!m.roughnessMap,X=m.anisotropy>0,re=m.clearcoat>0,se=m.iridescence>0,ae=m.sheen>0,Te=m.transmission>0,ge=X&&!!m.anisotropyMap,be=re&&!!m.clearcoatMap,Le=re&&!!m.clearcoatNormalMap,_e=re&&!!m.clearcoatRoughnessMap,ie=se&&!!m.iridescenceMap,Ze=se&&!!m.iridescenceThicknessMap,Ve=ae&&!!m.sheenColorMap,ze=ae&&!!m.sheenRoughnessMap,Ie=!!m.specularMap,ye=!!m.specularColorMap,O=!!m.specularIntensityMap,he=Te&&!!m.transmissionMap,Re=Te&&!!m.thicknessMap,we=!!m.gradientMap,oe=!!m.alphaMap,z=m.alphaTest>0,ue=!!m.alphaHash,ve=!!m.extensions,Oe=!!B.attributes.uv1,De=!!B.attributes.uv2,Je=!!B.attributes.uv3;let Qe=Wn;return m.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Qe=i.toneMapping),{isWebGL2:c,shaderID:J,shaderType:m.type,shaderName:m.name,vertexShader:I,fragmentShader:C,defines:m.defines,customVertexShaderID:D,customFragmentShaderID:V,isRawShaderMaterial:m.isRawShaderMaterial===!0,glslVersion:m.glslVersion,precision:f,batching:le,instancing:ne,instancingColor:ne&&K.instanceColor!==null,supportsVertexTextures:p,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Dn,map:ce,matcap:xe,envMap:H,envMapMode:H&&Y.mapping,envMapCubeUVHeight:te,aoMap:Ne,lightMap:de,bumpMap:Me,normalMap:me,displacementMap:p&&He,emissiveMap:Pe,normalMapObjectSpace:me&&m.normalMapType===_u,normalMapTangentSpace:me&&m.normalMapType===Uc,metalnessMap:T,roughnessMap:E,anisotropy:X,anisotropyMap:ge,clearcoat:re,clearcoatMap:be,clearcoatNormalMap:Le,clearcoatRoughnessMap:_e,iridescence:se,iridescenceMap:ie,iridescenceThicknessMap:Ze,sheen:ae,sheenColorMap:Ve,sheenRoughnessMap:ze,specularMap:Ie,specularColorMap:ye,specularIntensityMap:O,transmission:Te,transmissionMap:he,thicknessMap:Re,gradientMap:we,opaque:m.transparent===!1&&m.blending===Vi,alphaMap:oe,alphaTest:z,alphaHash:ue,combine:m.combine,mapUv:ce&&x(m.map.channel),aoMapUv:Ne&&x(m.aoMap.channel),lightMapUv:de&&x(m.lightMap.channel),bumpMapUv:Me&&x(m.bumpMap.channel),normalMapUv:me&&x(m.normalMap.channel),displacementMapUv:He&&x(m.displacementMap.channel),emissiveMapUv:Pe&&x(m.emissiveMap.channel),metalnessMapUv:T&&x(m.metalnessMap.channel),roughnessMapUv:E&&x(m.roughnessMap.channel),anisotropyMapUv:ge&&x(m.anisotropyMap.channel),clearcoatMapUv:be&&x(m.clearcoatMap.channel),clearcoatNormalMapUv:Le&&x(m.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_e&&x(m.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&x(m.iridescenceMap.channel),iridescenceThicknessMapUv:Ze&&x(m.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&x(m.sheenColorMap.channel),sheenRoughnessMapUv:ze&&x(m.sheenRoughnessMap.channel),specularMapUv:Ie&&x(m.specularMap.channel),specularColorMapUv:ye&&x(m.specularColorMap.channel),specularIntensityMapUv:O&&x(m.specularIntensityMap.channel),transmissionMapUv:he&&x(m.transmissionMap.channel),thicknessMapUv:Re&&x(m.thicknessMap.channel),alphaMapUv:oe&&x(m.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(me||X),vertexColors:m.vertexColors,vertexAlphas:m.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,vertexUv1s:Oe,vertexUv2s:De,vertexUv3s:Je,pointsUvs:K.isPoints===!0&&!!B.attributes.uv&&(ce||oe),fog:!!N,useFog:m.fog===!0,fogExp2:N&&N.isFogExp2,flatShading:m.flatShading===!0,sizeAttenuation:m.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:K.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:F,morphTextureStride:R,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:m.dithering,shadowMapEnabled:i.shadowMap.enabled&&U.length>0,shadowMapType:i.shadowMap.type,toneMapping:Qe,useLegacyLights:i._useLegacyLights,decodeVideoTexture:ce&&m.map.isVideoTexture===!0&&rt.getTransfer(m.map.colorSpace)===ht,premultipliedAlpha:m.premultipliedAlpha,doubleSided:m.side===Cn,flipSided:m.side===Gt,useDepthPacking:m.depthPacking>=0,depthPacking:m.depthPacking||0,index0AttributeName:m.index0AttributeName,extensionDerivatives:ve&&m.extensions.derivatives===!0,extensionFragDepth:ve&&m.extensions.fragDepth===!0,extensionDrawBuffers:ve&&m.extensions.drawBuffers===!0,extensionShaderTextureLOD:ve&&m.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ve&&m.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:c||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:c||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:c||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:m.customProgramCacheKey()}}function d(m){const y=[];if(m.shaderID?y.push(m.shaderID):(y.push(m.customVertexShaderID),y.push(m.customFragmentShaderID)),m.defines!==void 0)for(const U in m.defines)y.push(U),y.push(m.defines[U]);return m.isRawShaderMaterial===!1&&(b(y,m),_(y,m),y.push(i.outputColorSpace)),y.push(m.customProgramCacheKey),y.join()}function b(m,y){m.push(y.precision),m.push(y.outputColorSpace),m.push(y.envMapMode),m.push(y.envMapCubeUVHeight),m.push(y.mapUv),m.push(y.alphaMapUv),m.push(y.lightMapUv),m.push(y.aoMapUv),m.push(y.bumpMapUv),m.push(y.normalMapUv),m.push(y.displacementMapUv),m.push(y.emissiveMapUv),m.push(y.metalnessMapUv),m.push(y.roughnessMapUv),m.push(y.anisotropyMapUv),m.push(y.clearcoatMapUv),m.push(y.clearcoatNormalMapUv),m.push(y.clearcoatRoughnessMapUv),m.push(y.iridescenceMapUv),m.push(y.iridescenceThicknessMapUv),m.push(y.sheenColorMapUv),m.push(y.sheenRoughnessMapUv),m.push(y.specularMapUv),m.push(y.specularColorMapUv),m.push(y.specularIntensityMapUv),m.push(y.transmissionMapUv),m.push(y.thicknessMapUv),m.push(y.combine),m.push(y.fogExp2),m.push(y.sizeAttenuation),m.push(y.morphTargetsCount),m.push(y.morphAttributeCount),m.push(y.numDirLights),m.push(y.numPointLights),m.push(y.numSpotLights),m.push(y.numSpotLightMaps),m.push(y.numHemiLights),m.push(y.numRectAreaLights),m.push(y.numDirLightShadows),m.push(y.numPointLightShadows),m.push(y.numSpotLightShadows),m.push(y.numSpotLightShadowsWithMaps),m.push(y.numLightProbes),m.push(y.shadowMapType),m.push(y.toneMapping),m.push(y.numClippingPlanes),m.push(y.numClipIntersection),m.push(y.depthPacking)}function _(m,y){o.disableAll(),y.isWebGL2&&o.enable(0),y.supportsVertexTextures&&o.enable(1),y.instancing&&o.enable(2),y.instancingColor&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),m.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.skinning&&o.enable(4),y.morphTargets&&o.enable(5),y.morphNormals&&o.enable(6),y.morphColors&&o.enable(7),y.premultipliedAlpha&&o.enable(8),y.shadowMapEnabled&&o.enable(9),y.useLegacyLights&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),m.push(o.mask)}function M(m){const y=v[m.type];let U;if(y){const k=dn[y];U=sf.clone(k.uniforms)}else U=m.uniforms;return U}function L(m,y){let U;for(let k=0,K=h.length;k<K;k++){const N=h[k];if(N.cacheKey===y){U=N,++U.usedTimes;break}}return U===void 0&&(U=new v0(i,y,m,r),h.push(U)),U}function S(m){if(--m.usedTimes===0){const y=h.indexOf(m);h[y]=h[h.length-1],h.pop(),m.destroy()}}function P(m){l.remove(m)}function W(){l.dispose()}return{getParameters:g,getProgramCacheKey:d,getUniforms:M,acquireProgram:L,releaseProgram:S,releaseShaderCache:P,programs:h,dispose:W}}function b0(){let i=new WeakMap;function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function t(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function E0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Il(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Dl(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,p,f,v,x,g){let d=i[e];return d===void 0?(d={id:u.id,object:u,geometry:p,material:f,groupOrder:v,renderOrder:u.renderOrder,z:x,group:g},i[e]=d):(d.id=u.id,d.object=u,d.geometry=p,d.material=f,d.groupOrder=v,d.renderOrder=u.renderOrder,d.z=x,d.group=g),e++,d}function o(u,p,f,v,x,g){const d=a(u,p,f,v,x,g);f.transmission>0?n.push(d):f.transparent===!0?s.push(d):t.push(d)}function l(u,p,f,v,x,g){const d=a(u,p,f,v,x,g);f.transmission>0?n.unshift(d):f.transparent===!0?s.unshift(d):t.unshift(d)}function h(u,p){t.length>1&&t.sort(u||E0),n.length>1&&n.sort(p||Il),s.length>1&&s.sort(p||Il)}function c(){for(let u=e,p=i.length;u<p;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:c,sort:h}}function w0(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Dl,i.set(n,[a])):s>=r.length?(a=new Dl,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function T0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new Ke};break;case"SpotLight":t={position:new w,direction:new w,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new w,halfWidth:new w,halfHeight:new w};break}return i[e.id]=t,t}}}function A0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let R0=0;function C0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function P0(i,e){const t=new T0,n=A0(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)s.probe.push(new w);const r=new w,a=new Xe,o=new Xe;function l(c,u){let p=0,f=0,v=0;for(let k=0;k<9;k++)s.probe[k].set(0,0,0);let x=0,g=0,d=0,b=0,_=0,M=0,L=0,S=0,P=0,W=0,m=0;c.sort(C0);const y=u===!0?Math.PI:1;for(let k=0,K=c.length;k<K;k++){const N=c[k],B=N.color,G=N.intensity,Y=N.distance,te=N.shadow&&N.shadow.map?N.shadow.map.texture:null;if(N.isAmbientLight)p+=B.r*G*y,f+=B.g*G*y,v+=B.b*G*y;else if(N.isLightProbe){for(let J=0;J<9;J++)s.probe[J].addScaledVector(N.sh.coefficients[J],G);m++}else if(N.isDirectionalLight){const J=t.get(N);if(J.color.copy(N.color).multiplyScalar(N.intensity*y),N.castShadow){const j=N.shadow,F=n.get(N);F.shadowBias=j.bias,F.shadowNormalBias=j.normalBias,F.shadowRadius=j.radius,F.shadowMapSize=j.mapSize,s.directionalShadow[x]=F,s.directionalShadowMap[x]=te,s.directionalShadowMatrix[x]=N.shadow.matrix,M++}s.directional[x]=J,x++}else if(N.isSpotLight){const J=t.get(N);J.position.setFromMatrixPosition(N.matrixWorld),J.color.copy(B).multiplyScalar(G*y),J.distance=Y,J.coneCos=Math.cos(N.angle),J.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),J.decay=N.decay,s.spot[d]=J;const j=N.shadow;if(N.map&&(s.spotLightMap[P]=N.map,P++,j.updateMatrices(N),N.castShadow&&W++),s.spotLightMatrix[d]=j.matrix,N.castShadow){const F=n.get(N);F.shadowBias=j.bias,F.shadowNormalBias=j.normalBias,F.shadowRadius=j.radius,F.shadowMapSize=j.mapSize,s.spotShadow[d]=F,s.spotShadowMap[d]=te,S++}d++}else if(N.isRectAreaLight){const J=t.get(N);J.color.copy(B).multiplyScalar(G),J.halfWidth.set(N.width*.5,0,0),J.halfHeight.set(0,N.height*.5,0),s.rectArea[b]=J,b++}else if(N.isPointLight){const J=t.get(N);if(J.color.copy(N.color).multiplyScalar(N.intensity*y),J.distance=N.distance,J.decay=N.decay,N.castShadow){const j=N.shadow,F=n.get(N);F.shadowBias=j.bias,F.shadowNormalBias=j.normalBias,F.shadowRadius=j.radius,F.shadowMapSize=j.mapSize,F.shadowCameraNear=j.camera.near,F.shadowCameraFar=j.camera.far,s.pointShadow[g]=F,s.pointShadowMap[g]=te,s.pointShadowMatrix[g]=N.shadow.matrix,L++}s.point[g]=J,g++}else if(N.isHemisphereLight){const J=t.get(N);J.skyColor.copy(N.color).multiplyScalar(G*y),J.groundColor.copy(N.groundColor).multiplyScalar(G*y),s.hemi[_]=J,_++}}b>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pe.LTC_FLOAT_1,s.rectAreaLTC2=pe.LTC_FLOAT_2):(s.rectAreaLTC1=pe.LTC_HALF_1,s.rectAreaLTC2=pe.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pe.LTC_FLOAT_1,s.rectAreaLTC2=pe.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=pe.LTC_HALF_1,s.rectAreaLTC2=pe.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=p,s.ambient[1]=f,s.ambient[2]=v;const U=s.hash;(U.directionalLength!==x||U.pointLength!==g||U.spotLength!==d||U.rectAreaLength!==b||U.hemiLength!==_||U.numDirectionalShadows!==M||U.numPointShadows!==L||U.numSpotShadows!==S||U.numSpotMaps!==P||U.numLightProbes!==m)&&(s.directional.length=x,s.spot.length=d,s.rectArea.length=b,s.point.length=g,s.hemi.length=_,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=L,s.pointShadowMap.length=L,s.spotShadow.length=S,s.spotShadowMap.length=S,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=L,s.spotLightMatrix.length=S+P-W,s.spotLightMap.length=P,s.numSpotLightShadowsWithMaps=W,s.numLightProbes=m,U.directionalLength=x,U.pointLength=g,U.spotLength=d,U.rectAreaLength=b,U.hemiLength=_,U.numDirectionalShadows=M,U.numPointShadows=L,U.numSpotShadows=S,U.numSpotMaps=P,U.numLightProbes=m,s.version=R0++)}function h(c,u){let p=0,f=0,v=0,x=0,g=0;const d=u.matrixWorldInverse;for(let b=0,_=c.length;b<_;b++){const M=c[b];if(M.isDirectionalLight){const L=s.directional[p];L.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),L.direction.sub(r),L.direction.transformDirection(d),p++}else if(M.isSpotLight){const L=s.spot[v];L.position.setFromMatrixPosition(M.matrixWorld),L.position.applyMatrix4(d),L.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),L.direction.sub(r),L.direction.transformDirection(d),v++}else if(M.isRectAreaLight){const L=s.rectArea[x];L.position.setFromMatrixPosition(M.matrixWorld),L.position.applyMatrix4(d),o.identity(),a.copy(M.matrixWorld),a.premultiply(d),o.extractRotation(a),L.halfWidth.set(M.width*.5,0,0),L.halfHeight.set(0,M.height*.5,0),L.halfWidth.applyMatrix4(o),L.halfHeight.applyMatrix4(o),x++}else if(M.isPointLight){const L=s.point[f];L.position.setFromMatrixPosition(M.matrixWorld),L.position.applyMatrix4(d),f++}else if(M.isHemisphereLight){const L=s.hemi[g];L.direction.setFromMatrixPosition(M.matrixWorld),L.direction.transformDirection(d),g++}}}return{setup:l,setupView:h,state:s}}function Ul(i,e){const t=new P0(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function l(u){t.setup(n,u)}function h(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o}}function L0(i,e){let t=new WeakMap;function n(r,a=0){const o=t.get(r);let l;return o===void 0?(l=new Ul(i,e),t.set(r,[l])):a>=o.length?(l=new Ul(i,e),o.push(l)):l=o[a],l}function s(){t=new WeakMap}return{get:n,dispose:s}}class I0 extends ns{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class D0 extends ns{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const U0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,N0=`uniform sampler2D shadow_pass;
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
}`;function O0(i,e,t){let n=new Za;const s=new fe,r=new fe,a=new ot,o=new I0({depthPacking:gu}),l=new D0,h={},c=t.maxTextureSize,u={[qn]:Gt,[Gt]:qn,[Cn]:Cn},p=new hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:U0,fragmentShader:N0}),f=p.clone();f.defines.HORIZONTAL_PASS=1;const v=new It;v.setAttribute("position",new vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Lt(v,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sc;let d=this.type;this.render=function(S,P,W){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const m=i.getRenderTarget(),y=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),k=i.state;k.setBlending(Vn),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const K=d!==Tn&&this.type===Tn,N=d===Tn&&this.type!==Tn;for(let B=0,G=S.length;B<G;B++){const Y=S[B],te=Y.shadow;if(te===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(te.autoUpdate===!1&&te.needsUpdate===!1)continue;s.copy(te.mapSize);const J=te.getFrameExtents();if(s.multiply(J),r.copy(te.mapSize),(s.x>c||s.y>c)&&(s.x>c&&(r.x=Math.floor(c/J.x),s.x=r.x*J.x,te.mapSize.x=r.x),s.y>c&&(r.y=Math.floor(c/J.y),s.y=r.y*J.y,te.mapSize.y=r.y)),te.map===null||K===!0||N===!0){const F=this.type!==Tn?{minFilter:Pt,magFilter:Pt}:{};te.map!==null&&te.map.dispose(),te.map=new li(s.x,s.y,F),te.map.texture.name=Y.name+".shadowMap",te.camera.updateProjectionMatrix()}i.setRenderTarget(te.map),i.clear();const j=te.getViewportCount();for(let F=0;F<j;F++){const R=te.getViewport(F);a.set(r.x*R.x,r.y*R.y,r.x*R.z,r.y*R.w),k.viewport(a),te.updateMatrices(Y,F),n=te.getFrustum(),M(P,W,te.camera,Y,this.type)}te.isPointLightShadow!==!0&&this.type===Tn&&b(te,W),te.needsUpdate=!1}d=this.type,g.needsUpdate=!1,i.setRenderTarget(m,y,U)};function b(S,P){const W=e.update(x);p.defines.VSM_SAMPLES!==S.blurSamples&&(p.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,p.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new li(s.x,s.y)),p.uniforms.shadow_pass.value=S.map.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(P,null,W,p,x,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(P,null,W,f,x,null)}function _(S,P,W,m){let y=null;const U=W.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(U!==void 0)y=U;else if(y=W.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const k=y.uuid,K=P.uuid;let N=h[k];N===void 0&&(N={},h[k]=N);let B=N[K];B===void 0&&(B=y.clone(),N[K]=B,P.addEventListener("dispose",L)),y=B}if(y.visible=P.visible,y.wireframe=P.wireframe,m===Tn?y.side=P.shadowSide!==null?P.shadowSide:P.side:y.side=P.shadowSide!==null?P.shadowSide:u[P.side],y.alphaMap=P.alphaMap,y.alphaTest=P.alphaTest,y.map=P.map,y.clipShadows=P.clipShadows,y.clippingPlanes=P.clippingPlanes,y.clipIntersection=P.clipIntersection,y.displacementMap=P.displacementMap,y.displacementScale=P.displacementScale,y.displacementBias=P.displacementBias,y.wireframeLinewidth=P.wireframeLinewidth,y.linewidth=P.linewidth,W.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const k=i.properties.get(y);k.light=W}return y}function M(S,P,W,m,y){if(S.visible===!1)return;if(S.layers.test(P.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&y===Tn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,S.matrixWorld);const K=e.update(S),N=S.material;if(Array.isArray(N)){const B=K.groups;for(let G=0,Y=B.length;G<Y;G++){const te=B[G],J=N[te.materialIndex];if(J&&J.visible){const j=_(S,J,m,y);S.onBeforeShadow(i,S,P,W,K,j,te),i.renderBufferDirect(W,null,K,j,S,te),S.onAfterShadow(i,S,P,W,K,j,te)}}}else if(N.visible){const B=_(S,N,m,y);S.onBeforeShadow(i,S,P,W,K,B,null),i.renderBufferDirect(W,null,K,B,S,null),S.onAfterShadow(i,S,P,W,K,B,null)}}const k=S.children;for(let K=0,N=k.length;K<N;K++)M(k[K],P,W,m,y)}function L(S){S.target.removeEventListener("dispose",L);for(const W in h){const m=h[W],y=S.target.uuid;y in m&&(m[y].dispose(),delete m[y])}}}function F0(i,e,t){const n=t.isWebGL2;function s(){let z=!1;const ue=new ot;let ve=null;const Oe=new ot(0,0,0,0);return{setMask:function(De){ve!==De&&!z&&(i.colorMask(De,De,De,De),ve=De)},setLocked:function(De){z=De},setClear:function(De,Je,Qe,dt,mt){mt===!0&&(De*=dt,Je*=dt,Qe*=dt),ue.set(De,Je,Qe,dt),Oe.equals(ue)===!1&&(i.clearColor(De,Je,Qe,dt),Oe.copy(ue))},reset:function(){z=!1,ve=null,Oe.set(-1,0,0,0)}}}function r(){let z=!1,ue=null,ve=null,Oe=null;return{setTest:function(De){De?le(i.DEPTH_TEST):ce(i.DEPTH_TEST)},setMask:function(De){ue!==De&&!z&&(i.depthMask(De),ue=De)},setFunc:function(De){if(ve!==De){switch(De){case Xh:i.depthFunc(i.NEVER);break;case qh:i.depthFunc(i.ALWAYS);break;case Yh:i.depthFunc(i.LESS);break;case _r:i.depthFunc(i.LEQUAL);break;case jh:i.depthFunc(i.EQUAL);break;case $h:i.depthFunc(i.GEQUAL);break;case Kh:i.depthFunc(i.GREATER);break;case Zh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=De}},setLocked:function(De){z=De},setClear:function(De){Oe!==De&&(i.clearDepth(De),Oe=De)},reset:function(){z=!1,ue=null,ve=null,Oe=null}}}function a(){let z=!1,ue=null,ve=null,Oe=null,De=null,Je=null,Qe=null,dt=null,mt=null;return{setTest:function(tt){z||(tt?le(i.STENCIL_TEST):ce(i.STENCIL_TEST))},setMask:function(tt){ue!==tt&&!z&&(i.stencilMask(tt),ue=tt)},setFunc:function(tt,xt,fn){(ve!==tt||Oe!==xt||De!==fn)&&(i.stencilFunc(tt,xt,fn),ve=tt,Oe=xt,De=fn)},setOp:function(tt,xt,fn){(Je!==tt||Qe!==xt||dt!==fn)&&(i.stencilOp(tt,xt,fn),Je=tt,Qe=xt,dt=fn)},setLocked:function(tt){z=tt},setClear:function(tt){mt!==tt&&(i.clearStencil(tt),mt=tt)},reset:function(){z=!1,ue=null,ve=null,Oe=null,De=null,Je=null,Qe=null,dt=null,mt=null}}}const o=new s,l=new r,h=new a,c=new WeakMap,u=new WeakMap;let p={},f={},v=new WeakMap,x=[],g=null,d=!1,b=null,_=null,M=null,L=null,S=null,P=null,W=null,m=new Ke(0,0,0),y=0,U=!1,k=null,K=null,N=null,B=null,G=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let te=!1,J=0;const j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(j)[1]),te=J>=1):j.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),te=J>=2);let F=null,R={};const I=i.getParameter(i.SCISSOR_BOX),C=i.getParameter(i.VIEWPORT),D=new ot().fromArray(I),V=new ot().fromArray(C);function $(z,ue,ve,Oe){const De=new Uint8Array(4),Je=i.createTexture();i.bindTexture(z,Je),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Qe=0;Qe<ve;Qe++)n&&(z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY)?i.texImage3D(ue,0,i.RGBA,1,1,Oe,0,i.RGBA,i.UNSIGNED_BYTE,De):i.texImage2D(ue+Qe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,De);return Je}const ne={};ne[i.TEXTURE_2D]=$(i.TEXTURE_2D,i.TEXTURE_2D,1),ne[i.TEXTURE_CUBE_MAP]=$(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(ne[i.TEXTURE_2D_ARRAY]=$(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ne[i.TEXTURE_3D]=$(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),h.setClear(0),le(i.DEPTH_TEST),l.setFunc(_r),Pe(!1),T(mo),le(i.CULL_FACE),me(Vn);function le(z){p[z]!==!0&&(i.enable(z),p[z]=!0)}function ce(z){p[z]!==!1&&(i.disable(z),p[z]=!1)}function xe(z,ue){return f[z]!==ue?(i.bindFramebuffer(z,ue),f[z]=ue,n&&(z===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ue),z===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ue)),!0):!1}function H(z,ue){let ve=x,Oe=!1;if(z)if(ve=v.get(ue),ve===void 0&&(ve=[],v.set(ue,ve)),z.isWebGLMultipleRenderTargets){const De=z.texture;if(ve.length!==De.length||ve[0]!==i.COLOR_ATTACHMENT0){for(let Je=0,Qe=De.length;Je<Qe;Je++)ve[Je]=i.COLOR_ATTACHMENT0+Je;ve.length=De.length,Oe=!0}}else ve[0]!==i.COLOR_ATTACHMENT0&&(ve[0]=i.COLOR_ATTACHMENT0,Oe=!0);else ve[0]!==i.BACK&&(ve[0]=i.BACK,Oe=!0);Oe&&(t.isWebGL2?i.drawBuffers(ve):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ve))}function Ne(z){return g!==z?(i.useProgram(z),g=z,!0):!1}const de={[ti]:i.FUNC_ADD,[Ph]:i.FUNC_SUBTRACT,[Lh]:i.FUNC_REVERSE_SUBTRACT};if(n)de[xo]=i.MIN,de[Mo]=i.MAX;else{const z=e.get("EXT_blend_minmax");z!==null&&(de[xo]=z.MIN_EXT,de[Mo]=z.MAX_EXT)}const Me={[Ih]:i.ZERO,[Dh]:i.ONE,[Uh]:i.SRC_COLOR,[Ua]:i.SRC_ALPHA,[Bh]:i.SRC_ALPHA_SATURATE,[zh]:i.DST_COLOR,[Oh]:i.DST_ALPHA,[Nh]:i.ONE_MINUS_SRC_COLOR,[Na]:i.ONE_MINUS_SRC_ALPHA,[kh]:i.ONE_MINUS_DST_COLOR,[Fh]:i.ONE_MINUS_DST_ALPHA,[Gh]:i.CONSTANT_COLOR,[Hh]:i.ONE_MINUS_CONSTANT_COLOR,[Vh]:i.CONSTANT_ALPHA,[Wh]:i.ONE_MINUS_CONSTANT_ALPHA};function me(z,ue,ve,Oe,De,Je,Qe,dt,mt,tt){if(z===Vn){d===!0&&(ce(i.BLEND),d=!1);return}if(d===!1&&(le(i.BLEND),d=!0),z!==Ch){if(z!==b||tt!==U){if((_!==ti||S!==ti)&&(i.blendEquation(i.FUNC_ADD),_=ti,S=ti),tt)switch(z){case Vi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case go:i.blendFunc(i.ONE,i.ONE);break;case _o:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case vo:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case Vi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case go:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case _o:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case vo:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}M=null,L=null,P=null,W=null,m.set(0,0,0),y=0,b=z,U=tt}return}De=De||ue,Je=Je||ve,Qe=Qe||Oe,(ue!==_||De!==S)&&(i.blendEquationSeparate(de[ue],de[De]),_=ue,S=De),(ve!==M||Oe!==L||Je!==P||Qe!==W)&&(i.blendFuncSeparate(Me[ve],Me[Oe],Me[Je],Me[Qe]),M=ve,L=Oe,P=Je,W=Qe),(dt.equals(m)===!1||mt!==y)&&(i.blendColor(dt.r,dt.g,dt.b,mt),m.copy(dt),y=mt),b=z,U=!1}function He(z,ue){z.side===Cn?ce(i.CULL_FACE):le(i.CULL_FACE);let ve=z.side===Gt;ue&&(ve=!ve),Pe(ve),z.blending===Vi&&z.transparent===!1?me(Vn):me(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),l.setFunc(z.depthFunc),l.setTest(z.depthTest),l.setMask(z.depthWrite),o.setMask(z.colorWrite);const Oe=z.stencilWrite;h.setTest(Oe),Oe&&(h.setMask(z.stencilWriteMask),h.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),h.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),X(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?le(i.SAMPLE_ALPHA_TO_COVERAGE):ce(i.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(z){k!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),k=z)}function T(z){z!==Th?(le(i.CULL_FACE),z!==K&&(z===mo?i.cullFace(i.BACK):z===Ah?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ce(i.CULL_FACE),K=z}function E(z){z!==N&&(te&&i.lineWidth(z),N=z)}function X(z,ue,ve){z?(le(i.POLYGON_OFFSET_FILL),(B!==ue||G!==ve)&&(i.polygonOffset(ue,ve),B=ue,G=ve)):ce(i.POLYGON_OFFSET_FILL)}function re(z){z?le(i.SCISSOR_TEST):ce(i.SCISSOR_TEST)}function se(z){z===void 0&&(z=i.TEXTURE0+Y-1),F!==z&&(i.activeTexture(z),F=z)}function ae(z,ue,ve){ve===void 0&&(F===null?ve=i.TEXTURE0+Y-1:ve=F);let Oe=R[ve];Oe===void 0&&(Oe={type:void 0,texture:void 0},R[ve]=Oe),(Oe.type!==z||Oe.texture!==ue)&&(F!==ve&&(i.activeTexture(ve),F=ve),i.bindTexture(z,ue||ne[z]),Oe.type=z,Oe.texture=ue)}function Te(){const z=R[F];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function ge(){try{i.compressedTexImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function be(){try{i.compressedTexImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Le(){try{i.texSubImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function _e(){try{i.texSubImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ie(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ze(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ve(){try{i.texStorage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ze(){try{i.texStorage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ie(){try{i.texImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ye(){try{i.texImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function O(z){D.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),D.copy(z))}function he(z){V.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),V.copy(z))}function Re(z,ue){let ve=u.get(ue);ve===void 0&&(ve=new WeakMap,u.set(ue,ve));let Oe=ve.get(z);Oe===void 0&&(Oe=i.getUniformBlockIndex(ue,z.name),ve.set(z,Oe))}function we(z,ue){const Oe=u.get(ue).get(z);c.get(ue)!==Oe&&(i.uniformBlockBinding(ue,Oe,z.__bindingPointIndex),c.set(ue,Oe))}function oe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),p={},F=null,R={},f={},v=new WeakMap,x=[],g=null,d=!1,b=null,_=null,M=null,L=null,S=null,P=null,W=null,m=new Ke(0,0,0),y=0,U=!1,k=null,K=null,N=null,B=null,G=null,D.set(0,0,i.canvas.width,i.canvas.height),V.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),h.reset()}return{buffers:{color:o,depth:l,stencil:h},enable:le,disable:ce,bindFramebuffer:xe,drawBuffers:H,useProgram:Ne,setBlending:me,setMaterial:He,setFlipSided:Pe,setCullFace:T,setLineWidth:E,setPolygonOffset:X,setScissorTest:re,activeTexture:se,bindTexture:ae,unbindTexture:Te,compressedTexImage2D:ge,compressedTexImage3D:be,texImage2D:Ie,texImage3D:ye,updateUBOMapping:Re,uniformBlockBinding:we,texStorage2D:Ve,texStorage3D:ze,texSubImage2D:Le,texSubImage3D:_e,compressedTexSubImage2D:ie,compressedTexSubImage3D:Ze,scissor:O,viewport:he,reset:oe}}function z0(i,e,t,n,s,r,a){const o=s.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new WeakMap;let u;const p=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(T,E){return f?new OffscreenCanvas(T,E):Er("canvas")}function x(T,E,X,re){let se=1;if((T.width>re||T.height>re)&&(se=re/Math.max(T.width,T.height)),se<1||E===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){const ae=E?Sr:Math.floor,Te=ae(se*T.width),ge=ae(se*T.height);u===void 0&&(u=v(Te,ge));const be=X?v(Te,ge):u;return be.width=Te,be.height=ge,be.getContext("2d").drawImage(T,0,0,Te,ge),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+Te+"x"+ge+")."),be}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function g(T){return Ha(T.width)&&Ha(T.height)}function d(T){return o?!1:T.wrapS!==cn||T.wrapT!==cn||T.minFilter!==Pt&&T.minFilter!==qt}function b(T,E){return T.generateMipmaps&&E&&T.minFilter!==Pt&&T.minFilter!==qt}function _(T){i.generateMipmap(T)}function M(T,E,X,re,se=!1){if(o===!1)return E;if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let ae=E;if(E===i.RED&&(X===i.FLOAT&&(ae=i.R32F),X===i.HALF_FLOAT&&(ae=i.R16F),X===i.UNSIGNED_BYTE&&(ae=i.R8)),E===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(ae=i.R8UI),X===i.UNSIGNED_SHORT&&(ae=i.R16UI),X===i.UNSIGNED_INT&&(ae=i.R32UI),X===i.BYTE&&(ae=i.R8I),X===i.SHORT&&(ae=i.R16I),X===i.INT&&(ae=i.R32I)),E===i.RG&&(X===i.FLOAT&&(ae=i.RG32F),X===i.HALF_FLOAT&&(ae=i.RG16F),X===i.UNSIGNED_BYTE&&(ae=i.RG8)),E===i.RGBA){const Te=se?vr:rt.getTransfer(re);X===i.FLOAT&&(ae=i.RGBA32F),X===i.HALF_FLOAT&&(ae=i.RGBA16F),X===i.UNSIGNED_BYTE&&(ae=Te===ht?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT_4_4_4_4&&(ae=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(ae=i.RGB5_A1)}return(ae===i.R16F||ae===i.R32F||ae===i.RG16F||ae===i.RG32F||ae===i.RGBA16F||ae===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function L(T,E,X){return b(T,X)===!0||T.isFramebufferTexture&&T.minFilter!==Pt&&T.minFilter!==qt?Math.log2(Math.max(E.width,E.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?E.mipmaps.length:1}function S(T){return T===Pt||T===So||T===Br?i.NEAREST:i.LINEAR}function P(T){const E=T.target;E.removeEventListener("dispose",P),m(E),E.isVideoTexture&&c.delete(E)}function W(T){const E=T.target;E.removeEventListener("dispose",W),U(E)}function m(T){const E=n.get(T);if(E.__webglInit===void 0)return;const X=T.source,re=p.get(X);if(re){const se=re[E.__cacheKey];se.usedTimes--,se.usedTimes===0&&y(T),Object.keys(re).length===0&&p.delete(X)}n.remove(T)}function y(T){const E=n.get(T);i.deleteTexture(E.__webglTexture);const X=T.source,re=p.get(X);delete re[E.__cacheKey],a.memory.textures--}function U(T){const E=T.texture,X=n.get(T),re=n.get(E);if(re.__webglTexture!==void 0&&(i.deleteTexture(re.__webglTexture),a.memory.textures--),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let se=0;se<6;se++){if(Array.isArray(X.__webglFramebuffer[se]))for(let ae=0;ae<X.__webglFramebuffer[se].length;ae++)i.deleteFramebuffer(X.__webglFramebuffer[se][ae]);else i.deleteFramebuffer(X.__webglFramebuffer[se]);X.__webglDepthbuffer&&i.deleteRenderbuffer(X.__webglDepthbuffer[se])}else{if(Array.isArray(X.__webglFramebuffer))for(let se=0;se<X.__webglFramebuffer.length;se++)i.deleteFramebuffer(X.__webglFramebuffer[se]);else i.deleteFramebuffer(X.__webglFramebuffer);if(X.__webglDepthbuffer&&i.deleteRenderbuffer(X.__webglDepthbuffer),X.__webglMultisampledFramebuffer&&i.deleteFramebuffer(X.__webglMultisampledFramebuffer),X.__webglColorRenderbuffer)for(let se=0;se<X.__webglColorRenderbuffer.length;se++)X.__webglColorRenderbuffer[se]&&i.deleteRenderbuffer(X.__webglColorRenderbuffer[se]);X.__webglDepthRenderbuffer&&i.deleteRenderbuffer(X.__webglDepthRenderbuffer)}if(T.isWebGLMultipleRenderTargets)for(let se=0,ae=E.length;se<ae;se++){const Te=n.get(E[se]);Te.__webglTexture&&(i.deleteTexture(Te.__webglTexture),a.memory.textures--),n.remove(E[se])}n.remove(E),n.remove(T)}let k=0;function K(){k=0}function N(){const T=k;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),k+=1,T}function B(T){const E=[];return E.push(T.wrapS),E.push(T.wrapT),E.push(T.wrapR||0),E.push(T.magFilter),E.push(T.minFilter),E.push(T.anisotropy),E.push(T.internalFormat),E.push(T.format),E.push(T.type),E.push(T.generateMipmaps),E.push(T.premultiplyAlpha),E.push(T.flipY),E.push(T.unpackAlignment),E.push(T.colorSpace),E.join()}function G(T,E){const X=n.get(T);if(T.isVideoTexture&&He(T),T.isRenderTargetTexture===!1&&T.version>0&&X.__version!==T.version){const re=T.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{D(X,T,E);return}}t.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+E)}function Y(T,E){const X=n.get(T);if(T.version>0&&X.__version!==T.version){D(X,T,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+E)}function te(T,E){const X=n.get(T);if(T.version>0&&X.__version!==T.version){D(X,T,E);return}t.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+E)}function J(T,E){const X=n.get(T);if(T.version>0&&X.__version!==T.version){V(X,T,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+E)}const j={[za]:i.REPEAT,[cn]:i.CLAMP_TO_EDGE,[ka]:i.MIRRORED_REPEAT},F={[Pt]:i.NEAREST,[So]:i.NEAREST_MIPMAP_NEAREST,[Br]:i.NEAREST_MIPMAP_LINEAR,[qt]:i.LINEAR,[au]:i.LINEAR_MIPMAP_NEAREST,[ys]:i.LINEAR_MIPMAP_LINEAR},R={[vu]:i.NEVER,[Eu]:i.ALWAYS,[xu]:i.LESS,[Nc]:i.LEQUAL,[Mu]:i.EQUAL,[bu]:i.GEQUAL,[yu]:i.GREATER,[Su]:i.NOTEQUAL};function I(T,E,X){if(X?(i.texParameteri(T,i.TEXTURE_WRAP_S,j[E.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,j[E.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,j[E.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,F[E.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,F[E.minFilter])):(i.texParameteri(T,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(T,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(E.wrapS!==cn||E.wrapT!==cn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(T,i.TEXTURE_MAG_FILTER,S(E.magFilter)),i.texParameteri(T,i.TEXTURE_MIN_FILTER,S(E.minFilter)),E.minFilter!==Pt&&E.minFilter!==qt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,R[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const re=e.get("EXT_texture_filter_anisotropic");if(E.magFilter===Pt||E.minFilter!==Br&&E.minFilter!==ys||E.type===Ln&&e.has("OES_texture_float_linear")===!1||o===!1&&E.type===Ss&&e.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(i.texParameterf(T,re.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function C(T,E){let X=!1;T.__webglInit===void 0&&(T.__webglInit=!0,E.addEventListener("dispose",P));const re=E.source;let se=p.get(re);se===void 0&&(se={},p.set(re,se));const ae=B(E);if(ae!==T.__cacheKey){se[ae]===void 0&&(se[ae]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,X=!0),se[ae].usedTimes++;const Te=se[T.__cacheKey];Te!==void 0&&(se[T.__cacheKey].usedTimes--,Te.usedTimes===0&&y(E)),T.__cacheKey=ae,T.__webglTexture=se[ae].texture}return X}function D(T,E,X){let re=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(re=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(re=i.TEXTURE_3D);const se=C(T,E),ae=E.source;t.bindTexture(re,T.__webglTexture,i.TEXTURE0+X);const Te=n.get(ae);if(ae.version!==Te.__version||se===!0){t.activeTexture(i.TEXTURE0+X);const ge=rt.getPrimaries(rt.workingColorSpace),be=E.colorSpace===tn?null:rt.getPrimaries(E.colorSpace),Le=E.colorSpace===tn||ge===be?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);const _e=d(E)&&g(E.image)===!1;let ie=x(E.image,_e,!1,s.maxTextureSize);ie=Pe(E,ie);const Ze=g(ie)||o,Ve=r.convert(E.format,E.colorSpace);let ze=r.convert(E.type),Ie=M(E.internalFormat,Ve,ze,E.colorSpace,E.isVideoTexture);I(re,E,Ze);let ye;const O=E.mipmaps,he=o&&E.isVideoTexture!==!0&&Ie!==Ic,Re=Te.__version===void 0||se===!0,we=L(E,ie,Ze);if(E.isDepthTexture)Ie=i.DEPTH_COMPONENT,o?E.type===Ln?Ie=i.DEPTH_COMPONENT32F:E.type===Hn?Ie=i.DEPTH_COMPONENT24:E.type===si?Ie=i.DEPTH24_STENCIL8:Ie=i.DEPTH_COMPONENT16:E.type===Ln&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===ri&&Ie===i.DEPTH_COMPONENT&&E.type!==Ya&&E.type!==Hn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=Hn,ze=r.convert(E.type)),E.format===Ki&&Ie===i.DEPTH_COMPONENT&&(Ie=i.DEPTH_STENCIL,E.type!==si&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=si,ze=r.convert(E.type))),Re&&(he?t.texStorage2D(i.TEXTURE_2D,1,Ie,ie.width,ie.height):t.texImage2D(i.TEXTURE_2D,0,Ie,ie.width,ie.height,0,Ve,ze,null));else if(E.isDataTexture)if(O.length>0&&Ze){he&&Re&&t.texStorage2D(i.TEXTURE_2D,we,Ie,O[0].width,O[0].height);for(let oe=0,z=O.length;oe<z;oe++)ye=O[oe],he?t.texSubImage2D(i.TEXTURE_2D,oe,0,0,ye.width,ye.height,Ve,ze,ye.data):t.texImage2D(i.TEXTURE_2D,oe,Ie,ye.width,ye.height,0,Ve,ze,ye.data);E.generateMipmaps=!1}else he?(Re&&t.texStorage2D(i.TEXTURE_2D,we,Ie,ie.width,ie.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,ie.width,ie.height,Ve,ze,ie.data)):t.texImage2D(i.TEXTURE_2D,0,Ie,ie.width,ie.height,0,Ve,ze,ie.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){he&&Re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Ie,O[0].width,O[0].height,ie.depth);for(let oe=0,z=O.length;oe<z;oe++)ye=O[oe],E.format!==en?Ve!==null?he?t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,oe,0,0,0,ye.width,ye.height,ie.depth,Ve,ye.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,oe,Ie,ye.width,ye.height,ie.depth,0,ye.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):he?t.texSubImage3D(i.TEXTURE_2D_ARRAY,oe,0,0,0,ye.width,ye.height,ie.depth,Ve,ze,ye.data):t.texImage3D(i.TEXTURE_2D_ARRAY,oe,Ie,ye.width,ye.height,ie.depth,0,Ve,ze,ye.data)}else{he&&Re&&t.texStorage2D(i.TEXTURE_2D,we,Ie,O[0].width,O[0].height);for(let oe=0,z=O.length;oe<z;oe++)ye=O[oe],E.format!==en?Ve!==null?he?t.compressedTexSubImage2D(i.TEXTURE_2D,oe,0,0,ye.width,ye.height,Ve,ye.data):t.compressedTexImage2D(i.TEXTURE_2D,oe,Ie,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):he?t.texSubImage2D(i.TEXTURE_2D,oe,0,0,ye.width,ye.height,Ve,ze,ye.data):t.texImage2D(i.TEXTURE_2D,oe,Ie,ye.width,ye.height,0,Ve,ze,ye.data)}else if(E.isDataArrayTexture)he?(Re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Ie,ie.width,ie.height,ie.depth),t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,Ve,ze,ie.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ie,ie.width,ie.height,ie.depth,0,Ve,ze,ie.data);else if(E.isData3DTexture)he?(Re&&t.texStorage3D(i.TEXTURE_3D,we,Ie,ie.width,ie.height,ie.depth),t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,Ve,ze,ie.data)):t.texImage3D(i.TEXTURE_3D,0,Ie,ie.width,ie.height,ie.depth,0,Ve,ze,ie.data);else if(E.isFramebufferTexture){if(Re)if(he)t.texStorage2D(i.TEXTURE_2D,we,Ie,ie.width,ie.height);else{let oe=ie.width,z=ie.height;for(let ue=0;ue<we;ue++)t.texImage2D(i.TEXTURE_2D,ue,Ie,oe,z,0,Ve,ze,null),oe>>=1,z>>=1}}else if(O.length>0&&Ze){he&&Re&&t.texStorage2D(i.TEXTURE_2D,we,Ie,O[0].width,O[0].height);for(let oe=0,z=O.length;oe<z;oe++)ye=O[oe],he?t.texSubImage2D(i.TEXTURE_2D,oe,0,0,Ve,ze,ye):t.texImage2D(i.TEXTURE_2D,oe,Ie,Ve,ze,ye);E.generateMipmaps=!1}else he?(Re&&t.texStorage2D(i.TEXTURE_2D,we,Ie,ie.width,ie.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ve,ze,ie)):t.texImage2D(i.TEXTURE_2D,0,Ie,Ve,ze,ie);b(E,Ze)&&_(re),Te.__version=ae.version,E.onUpdate&&E.onUpdate(E)}T.__version=E.version}function V(T,E,X){if(E.image.length!==6)return;const re=C(T,E),se=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+X);const ae=n.get(se);if(se.version!==ae.__version||re===!0){t.activeTexture(i.TEXTURE0+X);const Te=rt.getPrimaries(rt.workingColorSpace),ge=E.colorSpace===tn?null:rt.getPrimaries(E.colorSpace),be=E.colorSpace===tn||Te===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Le=E.isCompressedTexture||E.image[0].isCompressedTexture,_e=E.image[0]&&E.image[0].isDataTexture,ie=[];for(let oe=0;oe<6;oe++)!Le&&!_e?ie[oe]=x(E.image[oe],!1,!0,s.maxCubemapSize):ie[oe]=_e?E.image[oe].image:E.image[oe],ie[oe]=Pe(E,ie[oe]);const Ze=ie[0],Ve=g(Ze)||o,ze=r.convert(E.format,E.colorSpace),Ie=r.convert(E.type),ye=M(E.internalFormat,ze,Ie,E.colorSpace),O=o&&E.isVideoTexture!==!0,he=ae.__version===void 0||re===!0;let Re=L(E,Ze,Ve);I(i.TEXTURE_CUBE_MAP,E,Ve);let we;if(Le){O&&he&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,ye,Ze.width,Ze.height);for(let oe=0;oe<6;oe++){we=ie[oe].mipmaps;for(let z=0;z<we.length;z++){const ue=we[z];E.format!==en?ze!==null?O?t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,z,0,0,ue.width,ue.height,ze,ue.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,z,ye,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,z,0,0,ue.width,ue.height,ze,Ie,ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,z,ye,ue.width,ue.height,0,ze,Ie,ue.data)}}}else{we=E.mipmaps,O&&he&&(we.length>0&&Re++,t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,ye,ie[0].width,ie[0].height));for(let oe=0;oe<6;oe++)if(_e){O?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,ie[oe].width,ie[oe].height,ze,Ie,ie[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ye,ie[oe].width,ie[oe].height,0,ze,Ie,ie[oe].data);for(let z=0;z<we.length;z++){const ve=we[z].image[oe].image;O?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,z+1,0,0,ve.width,ve.height,ze,Ie,ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,z+1,ye,ve.width,ve.height,0,ze,Ie,ve.data)}}else{O?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,ze,Ie,ie[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ye,ze,Ie,ie[oe]);for(let z=0;z<we.length;z++){const ue=we[z];O?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,z+1,0,0,ze,Ie,ue.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,z+1,ye,ze,Ie,ue.image[oe])}}}b(E,Ve)&&_(i.TEXTURE_CUBE_MAP),ae.__version=se.version,E.onUpdate&&E.onUpdate(E)}T.__version=E.version}function $(T,E,X,re,se,ae){const Te=r.convert(X.format,X.colorSpace),ge=r.convert(X.type),be=M(X.internalFormat,Te,ge,X.colorSpace);if(!n.get(E).__hasExternalTextures){const _e=Math.max(1,E.width>>ae),ie=Math.max(1,E.height>>ae);se===i.TEXTURE_3D||se===i.TEXTURE_2D_ARRAY?t.texImage3D(se,ae,be,_e,ie,E.depth,0,Te,ge,null):t.texImage2D(se,ae,be,_e,ie,0,Te,ge,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),me(E)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,se,n.get(X).__webglTexture,0,Me(E)):(se===i.TEXTURE_2D||se>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,re,se,n.get(X).__webglTexture,ae),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ne(T,E,X){if(i.bindRenderbuffer(i.RENDERBUFFER,T),E.depthBuffer&&!E.stencilBuffer){let re=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(X||me(E)){const se=E.depthTexture;se&&se.isDepthTexture&&(se.type===Ln?re=i.DEPTH_COMPONENT32F:se.type===Hn&&(re=i.DEPTH_COMPONENT24));const ae=Me(E);me(E)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ae,re,E.width,E.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ae,re,E.width,E.height)}else i.renderbufferStorage(i.RENDERBUFFER,re,E.width,E.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,T)}else if(E.depthBuffer&&E.stencilBuffer){const re=Me(E);X&&me(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,re,i.DEPTH24_STENCIL8,E.width,E.height):me(E)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,re,i.DEPTH24_STENCIL8,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,T)}else{const re=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let se=0;se<re.length;se++){const ae=re[se],Te=r.convert(ae.format,ae.colorSpace),ge=r.convert(ae.type),be=M(ae.internalFormat,Te,ge,ae.colorSpace),Le=Me(E);X&&me(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Le,be,E.width,E.height):me(E)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Le,be,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,be,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function le(T,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),G(E.depthTexture,0);const re=n.get(E.depthTexture).__webglTexture,se=Me(E);if(E.depthTexture.format===ri)me(E)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0);else if(E.depthTexture.format===Ki)me(E)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function ce(T){const E=n.get(T),X=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!E.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");le(E.__webglFramebuffer,T)}else if(X){E.__webglDepthbuffer=[];for(let re=0;re<6;re++)t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[re]),E.__webglDepthbuffer[re]=i.createRenderbuffer(),ne(E.__webglDepthbuffer[re],T,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=i.createRenderbuffer(),ne(E.__webglDepthbuffer,T,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function xe(T,E,X){const re=n.get(T);E!==void 0&&$(re.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&ce(T)}function H(T){const E=T.texture,X=n.get(T),re=n.get(E);T.addEventListener("dispose",W),T.isWebGLMultipleRenderTargets!==!0&&(re.__webglTexture===void 0&&(re.__webglTexture=i.createTexture()),re.__version=E.version,a.memory.textures++);const se=T.isWebGLCubeRenderTarget===!0,ae=T.isWebGLMultipleRenderTargets===!0,Te=g(T)||o;if(se){X.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(o&&E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer[ge]=[];for(let be=0;be<E.mipmaps.length;be++)X.__webglFramebuffer[ge][be]=i.createFramebuffer()}else X.__webglFramebuffer[ge]=i.createFramebuffer()}else{if(o&&E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer=[];for(let ge=0;ge<E.mipmaps.length;ge++)X.__webglFramebuffer[ge]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(ae)if(s.drawBuffers){const ge=T.texture;for(let be=0,Le=ge.length;be<Le;be++){const _e=n.get(ge[be]);_e.__webglTexture===void 0&&(_e.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&T.samples>0&&me(T)===!1){const ge=ae?E:[E];X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let be=0;be<ge.length;be++){const Le=ge[be];X.__webglColorRenderbuffer[be]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[be]);const _e=r.convert(Le.format,Le.colorSpace),ie=r.convert(Le.type),Ze=M(Le.internalFormat,_e,ie,Le.colorSpace,T.isXRRenderTarget===!0),Ve=Me(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ve,Ze,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,X.__webglColorRenderbuffer[be])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),ne(X.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(se){t.bindTexture(i.TEXTURE_CUBE_MAP,re.__webglTexture),I(i.TEXTURE_CUBE_MAP,E,Te);for(let ge=0;ge<6;ge++)if(o&&E.mipmaps&&E.mipmaps.length>0)for(let be=0;be<E.mipmaps.length;be++)$(X.__webglFramebuffer[ge][be],T,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be);else $(X.__webglFramebuffer[ge],T,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);b(E,Te)&&_(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ae){const ge=T.texture;for(let be=0,Le=ge.length;be<Le;be++){const _e=ge[be],ie=n.get(_e);t.bindTexture(i.TEXTURE_2D,ie.__webglTexture),I(i.TEXTURE_2D,_e,Te),$(X.__webglFramebuffer,T,_e,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,0),b(_e,Te)&&_(i.TEXTURE_2D)}t.unbindTexture()}else{let ge=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(o?ge=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(ge,re.__webglTexture),I(ge,E,Te),o&&E.mipmaps&&E.mipmaps.length>0)for(let be=0;be<E.mipmaps.length;be++)$(X.__webglFramebuffer[be],T,E,i.COLOR_ATTACHMENT0,ge,be);else $(X.__webglFramebuffer,T,E,i.COLOR_ATTACHMENT0,ge,0);b(E,Te)&&_(ge),t.unbindTexture()}T.depthBuffer&&ce(T)}function Ne(T){const E=g(T)||o,X=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let re=0,se=X.length;re<se;re++){const ae=X[re];if(b(ae,E)){const Te=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ge=n.get(ae).__webglTexture;t.bindTexture(Te,ge),_(Te),t.unbindTexture()}}}function de(T){if(o&&T.samples>0&&me(T)===!1){const E=T.isWebGLMultipleRenderTargets?T.texture:[T.texture],X=T.width,re=T.height;let se=i.COLOR_BUFFER_BIT;const ae=[],Te=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=n.get(T),be=T.isWebGLMultipleRenderTargets===!0;if(be)for(let Le=0;Le<E.length;Le++)t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let Le=0;Le<E.length;Le++){ae.push(i.COLOR_ATTACHMENT0+Le),T.depthBuffer&&ae.push(Te);const _e=ge.__ignoreDepthValues!==void 0?ge.__ignoreDepthValues:!1;if(_e===!1&&(T.depthBuffer&&(se|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&(se|=i.STENCIL_BUFFER_BIT)),be&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ge.__webglColorRenderbuffer[Le]),_e===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Te]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Te])),be){const ie=n.get(E[Le]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ie,0)}i.blitFramebuffer(0,0,X,re,0,0,X,re,se,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ae)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),be)for(let Le=0;Le<E.length;Le++){t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,ge.__webglColorRenderbuffer[Le]);const _e=n.get(E[Le]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,_e,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}}function Me(T){return Math.min(s.maxSamples,T.samples)}function me(T){const E=n.get(T);return o&&T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function He(T){const E=a.render.frame;c.get(T)!==E&&(c.set(T,E),T.update())}function Pe(T,E){const X=T.colorSpace,re=T.format,se=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||T.format===Ga||X!==Dn&&X!==tn&&(rt.getTransfer(X)===ht?o===!1?e.has("EXT_sRGB")===!0&&re===en?(T.format=Ga,T.minFilter=qt,T.generateMipmaps=!1):E=Fc.sRGBToLinear(E):(re!==en||se!==Xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),E}this.allocateTextureUnit=N,this.resetTextureUnits=K,this.setTexture2D=G,this.setTexture2DArray=Y,this.setTexture3D=te,this.setTextureCube=J,this.rebindTextures=xe,this.setupRenderTarget=H,this.updateRenderTargetMipmap=Ne,this.updateMultisampleRenderTarget=de,this.setupDepthRenderbuffer=ce,this.setupFrameBufferTexture=$,this.useMultisampledRTT=me}function k0(i,e,t){const n=t.isWebGL2;function s(r,a=tn){let o;const l=rt.getTransfer(a);if(r===Xn)return i.UNSIGNED_BYTE;if(r===Ac)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Rc)return i.UNSIGNED_SHORT_5_5_5_1;if(r===ou)return i.BYTE;if(r===lu)return i.SHORT;if(r===Ya)return i.UNSIGNED_SHORT;if(r===Tc)return i.INT;if(r===Hn)return i.UNSIGNED_INT;if(r===Ln)return i.FLOAT;if(r===Ss)return n?i.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===cu)return i.ALPHA;if(r===en)return i.RGBA;if(r===hu)return i.LUMINANCE;if(r===uu)return i.LUMINANCE_ALPHA;if(r===ri)return i.DEPTH_COMPONENT;if(r===Ki)return i.DEPTH_STENCIL;if(r===Ga)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===fu)return i.RED;if(r===Cc)return i.RED_INTEGER;if(r===du)return i.RG;if(r===Pc)return i.RG_INTEGER;if(r===Lc)return i.RGBA_INTEGER;if(r===Gr||r===Hr||r===Vr||r===Wr)if(l===ht)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Gr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Hr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Vr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Wr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Gr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Hr)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Vr)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Wr)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===bo||r===Eo||r===wo||r===To)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===bo)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Eo)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===wo)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===To)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Ic)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Ao||r===Ro)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Ao)return l===ht?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Ro)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Co||r===Po||r===Lo||r===Io||r===Do||r===Uo||r===No||r===Oo||r===Fo||r===zo||r===ko||r===Bo||r===Go||r===Ho)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Co)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Po)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Lo)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Io)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Do)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Uo)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===No)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Oo)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Fo)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===zo)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===ko)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Bo)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Go)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ho)return l===ht?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Xr||r===Vo||r===Wo)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===Xr)return l===ht?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Vo)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Wo)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===pu||r===Xo||r===qo||r===Yo)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===Xr)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Xo)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===qo)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Yo)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===si?n?i.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class B0 extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Bi extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const G0={type:"move"};class pa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(const x of e.hand.values()){const g=t.getJointPose(x,n),d=this._getHandJoint(h,x);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}const c=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],p=c.position.distanceTo(u.position),f=.02,v=.005;h.inputState.pinching&&p>f+v?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=f-v&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(G0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Bi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class H0 extends fi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,h=null,c=null,u=null,p=null,f=null,v=null;const x=t.getContextAttributes();let g=null,d=null;const b=[],_=[],M=new fe;let L=null;const S=new Yt;S.layers.enable(1),S.viewport=new ot;const P=new Yt;P.layers.enable(2),P.viewport=new ot;const W=[S,P],m=new B0;m.layers.enable(1),m.layers.enable(2);let y=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(I){let C=b[I];return C===void 0&&(C=new pa,b[I]=C),C.getTargetRaySpace()},this.getControllerGrip=function(I){let C=b[I];return C===void 0&&(C=new pa,b[I]=C),C.getGripSpace()},this.getHand=function(I){let C=b[I];return C===void 0&&(C=new pa,b[I]=C),C.getHandSpace()};function k(I){const C=_.indexOf(I.inputSource);if(C===-1)return;const D=b[C];D!==void 0&&(D.update(I.inputSource,I.frame,h||a),D.dispatchEvent({type:I.type,data:I.inputSource}))}function K(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",N);for(let I=0;I<b.length;I++){const C=_[I];C!==null&&(_[I]=null,b[I].disconnect(C))}y=null,U=null,e.setRenderTarget(g),f=null,p=null,u=null,s=null,d=null,R.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(I){r=I,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(I){o=I,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(I){h=I},this.getBaseLayer=function(){return p!==null?p:f},this.getBinding=function(){return u},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(I){if(s=I,s!==null){if(g=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",K),s.addEventListener("inputsourceschange",N),x.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(M),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const C={antialias:s.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,C),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),d=new li(f.framebufferWidth,f.framebufferHeight,{format:en,type:Xn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let C=null,D=null,V=null;x.depth&&(V=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,C=x.stencil?Ki:ri,D=x.stencil?si:Hn);const $={colorFormat:t.RGBA8,depthFormat:V,scaleFactor:r};u=new XRWebGLBinding(s,t),p=u.createProjectionLayer($),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),d=new li(p.textureWidth,p.textureHeight,{format:en,type:Xn,depthTexture:new jc(p.textureWidth,p.textureHeight,D,void 0,void 0,void 0,void 0,void 0,void 0,C),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0});const ne=e.properties.get(d);ne.__ignoreDepthValues=p.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),h=null,a=await s.requestReferenceSpace(o),R.setContext(s),R.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function N(I){for(let C=0;C<I.removed.length;C++){const D=I.removed[C],V=_.indexOf(D);V>=0&&(_[V]=null,b[V].disconnect(D))}for(let C=0;C<I.added.length;C++){const D=I.added[C];let V=_.indexOf(D);if(V===-1){for(let ne=0;ne<b.length;ne++)if(ne>=_.length){_.push(D),V=ne;break}else if(_[ne]===null){_[ne]=D,V=ne;break}if(V===-1)break}const $=b[V];$&&$.connect(D)}}const B=new w,G=new w;function Y(I,C,D){B.setFromMatrixPosition(C.matrixWorld),G.setFromMatrixPosition(D.matrixWorld);const V=B.distanceTo(G),$=C.projectionMatrix.elements,ne=D.projectionMatrix.elements,le=$[14]/($[10]-1),ce=$[14]/($[10]+1),xe=($[9]+1)/$[5],H=($[9]-1)/$[5],Ne=($[8]-1)/$[0],de=(ne[8]+1)/ne[0],Me=le*Ne,me=le*de,He=V/(-Ne+de),Pe=He*-Ne;C.matrixWorld.decompose(I.position,I.quaternion,I.scale),I.translateX(Pe),I.translateZ(He),I.matrixWorld.compose(I.position,I.quaternion,I.scale),I.matrixWorldInverse.copy(I.matrixWorld).invert();const T=le+He,E=ce+He,X=Me-Pe,re=me+(V-Pe),se=xe*ce/E*T,ae=H*ce/E*T;I.projectionMatrix.makePerspective(X,re,se,ae,T,E),I.projectionMatrixInverse.copy(I.projectionMatrix).invert()}function te(I,C){C===null?I.matrixWorld.copy(I.matrix):I.matrixWorld.multiplyMatrices(C.matrixWorld,I.matrix),I.matrixWorldInverse.copy(I.matrixWorld).invert()}this.updateCamera=function(I){if(s===null)return;m.near=P.near=S.near=I.near,m.far=P.far=S.far=I.far,(y!==m.near||U!==m.far)&&(s.updateRenderState({depthNear:m.near,depthFar:m.far}),y=m.near,U=m.far);const C=I.parent,D=m.cameras;te(m,C);for(let V=0;V<D.length;V++)te(D[V],C);D.length===2?Y(m,S,P):m.projectionMatrix.copy(S.projectionMatrix),J(I,m,C)};function J(I,C,D){D===null?I.matrix.copy(C.matrixWorld):(I.matrix.copy(D.matrixWorld),I.matrix.invert(),I.matrix.multiply(C.matrixWorld)),I.matrix.decompose(I.position,I.quaternion,I.scale),I.updateMatrixWorld(!0),I.projectionMatrix.copy(C.projectionMatrix),I.projectionMatrixInverse.copy(C.projectionMatrixInverse),I.isPerspectiveCamera&&(I.fov=bs*2*Math.atan(1/I.projectionMatrix.elements[5]),I.zoom=1)}this.getCamera=function(){return m},this.getFoveation=function(){if(!(p===null&&f===null))return l},this.setFoveation=function(I){l=I,p!==null&&(p.fixedFoveation=I),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=I)};let j=null;function F(I,C){if(c=C.getViewerPose(h||a),v=C,c!==null){const D=c.views;f!==null&&(e.setRenderTargetFramebuffer(d,f.framebuffer),e.setRenderTarget(d));let V=!1;D.length!==m.cameras.length&&(m.cameras.length=0,V=!0);for(let $=0;$<D.length;$++){const ne=D[$];let le=null;if(f!==null)le=f.getViewport(ne);else{const xe=u.getViewSubImage(p,ne);le=xe.viewport,$===0&&(e.setRenderTargetTextures(d,xe.colorTexture,p.ignoreDepthValues?void 0:xe.depthStencilTexture),e.setRenderTarget(d))}let ce=W[$];ce===void 0&&(ce=new Yt,ce.layers.enable($),ce.viewport=new ot,W[$]=ce),ce.matrix.fromArray(ne.transform.matrix),ce.matrix.decompose(ce.position,ce.quaternion,ce.scale),ce.projectionMatrix.fromArray(ne.projectionMatrix),ce.projectionMatrixInverse.copy(ce.projectionMatrix).invert(),ce.viewport.set(le.x,le.y,le.width,le.height),$===0&&(m.matrix.copy(ce.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale)),V===!0&&m.cameras.push(ce)}}for(let D=0;D<b.length;D++){const V=_[D],$=b[D];V!==null&&$!==void 0&&$.update(V,C,h||a)}j&&j(I,C),C.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:C}),v=null}const R=new qc;R.setAnimationLoop(F),this.setAnimationLoop=function(I){j=I},this.dispose=function(){}}}function V0(i,e){function t(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function n(g,d){d.color.getRGB(g.fogColor.value,Vc(i)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function s(g,d,b,_,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(g,d):d.isMeshToonMaterial?(r(g,d),u(g,d)):d.isMeshPhongMaterial?(r(g,d),c(g,d)):d.isMeshStandardMaterial?(r(g,d),p(g,d),d.isMeshPhysicalMaterial&&f(g,d,M)):d.isMeshMatcapMaterial?(r(g,d),v(g,d)):d.isMeshDepthMaterial?r(g,d):d.isMeshDistanceMaterial?(r(g,d),x(g,d)):d.isMeshNormalMaterial?r(g,d):d.isLineBasicMaterial?(a(g,d),d.isLineDashedMaterial&&o(g,d)):d.isPointsMaterial?l(g,d,b,_):d.isSpriteMaterial?h(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,t(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,t(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===Gt&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,t(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===Gt&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,t(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,t(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);const b=e.get(d).envMap;if(b&&(g.envMap.value=b,g.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap){g.lightMap.value=d.lightMap;const _=i._useLegacyLights===!0?Math.PI:1;g.lightMapIntensity.value=d.lightMapIntensity*_,t(d.lightMap,g.lightMapTransform)}d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,g.aoMapTransform))}function a(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,t(d.map,g.mapTransform))}function o(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function l(g,d,b,_){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*b,g.scale.value=_*.5,d.map&&(g.map.value=d.map,t(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function h(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,t(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,t(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function c(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function u(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function p(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,g.roughnessMapTransform)),e.get(d).envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function f(g,d,b){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Gt&&g.clearcoatNormalScale.value.negate())),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,g.specularIntensityMapTransform))}function v(g,d){d.matcap&&(g.matcap.value=d.matcap)}function x(g,d){const b=e.get(d).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function W0(i,e,t,n){let s={},r={},a=[];const o=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(b,_){const M=_.program;n.uniformBlockBinding(b,M)}function h(b,_){let M=s[b.id];M===void 0&&(v(b),M=c(b),s[b.id]=M,b.addEventListener("dispose",g));const L=_.program;n.updateUBOMapping(b,L);const S=e.render.frame;r[b.id]!==S&&(p(b),r[b.id]=S)}function c(b){const _=u();b.__bindingPointIndex=_;const M=i.createBuffer(),L=b.__size,S=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,L,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,M),M}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(b){const _=s[b.id],M=b.uniforms,L=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let S=0,P=M.length;S<P;S++){const W=Array.isArray(M[S])?M[S]:[M[S]];for(let m=0,y=W.length;m<y;m++){const U=W[m];if(f(U,S,m,L)===!0){const k=U.__offset,K=Array.isArray(U.value)?U.value:[U.value];let N=0;for(let B=0;B<K.length;B++){const G=K[B],Y=x(G);typeof G=="number"||typeof G=="boolean"?(U.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,k+N,U.__data)):G.isMatrix3?(U.__data[0]=G.elements[0],U.__data[1]=G.elements[1],U.__data[2]=G.elements[2],U.__data[3]=0,U.__data[4]=G.elements[3],U.__data[5]=G.elements[4],U.__data[6]=G.elements[5],U.__data[7]=0,U.__data[8]=G.elements[6],U.__data[9]=G.elements[7],U.__data[10]=G.elements[8],U.__data[11]=0):(G.toArray(U.__data,N),N+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,U.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,_,M,L){const S=b.value,P=_+"_"+M;if(L[P]===void 0)return typeof S=="number"||typeof S=="boolean"?L[P]=S:L[P]=S.clone(),!0;{const W=L[P];if(typeof S=="number"||typeof S=="boolean"){if(W!==S)return L[P]=S,!0}else if(W.equals(S)===!1)return W.copy(S),!0}return!1}function v(b){const _=b.uniforms;let M=0;const L=16;for(let P=0,W=_.length;P<W;P++){const m=Array.isArray(_[P])?_[P]:[_[P]];for(let y=0,U=m.length;y<U;y++){const k=m[y],K=Array.isArray(k.value)?k.value:[k.value];for(let N=0,B=K.length;N<B;N++){const G=K[N],Y=x(G),te=M%L;te!==0&&L-te<Y.boundary&&(M+=L-te),k.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=M,M+=Y.storage}}}const S=M%L;return S>0&&(M+=L-S),b.__size=M,b.__cache={},this}function x(b){const _={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(_.boundary=4,_.storage=4):b.isVector2?(_.boundary=8,_.storage=8):b.isVector3||b.isColor?(_.boundary=16,_.storage=12):b.isVector4?(_.boundary=16,_.storage=16):b.isMatrix3?(_.boundary=48,_.storage=48):b.isMatrix4?(_.boundary=64,_.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),_}function g(b){const _=b.target;_.removeEventListener("dispose",g);const M=a.indexOf(_.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function d(){for(const b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:l,update:h,dispose:d}}class eh{constructor(e={}){const{canvas:t=ku(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let p;n!==null?p=n.getContextAttributes().alpha:p=a;const f=new Uint32Array(4),v=new Int32Array(4);let x=null,g=null;const d=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ct,this._useLegacyLights=!1,this.toneMapping=Wn,this.toneMappingExposure=1;const _=this;let M=!1,L=0,S=0,P=null,W=-1,m=null;const y=new ot,U=new ot;let k=null;const K=new Ke(0);let N=0,B=t.width,G=t.height,Y=1,te=null,J=null;const j=new ot(0,0,B,G),F=new ot(0,0,B,G);let R=!1;const I=new Za;let C=!1,D=!1,V=null;const $=new Xe,ne=new fe,le=new w,ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function xe(){return P===null?Y:1}let H=n;function Ne(A,q){for(let Q=0;Q<A.length;Q++){const ee=A[Q],Z=t.getContext(ee,q);if(Z!==null)return Z}return null}try{const A={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qa}`),t.addEventListener("webglcontextlost",oe,!1),t.addEventListener("webglcontextrestored",z,!1),t.addEventListener("webglcontextcreationerror",ue,!1),H===null){const q=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&q.shift(),H=Ne(q,A),H===null)throw Ne(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&H instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),H.getShaderPrecisionFormat===void 0&&(H.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let de,Me,me,He,Pe,T,E,X,re,se,ae,Te,ge,be,Le,_e,ie,Ze,Ve,ze,Ie,ye,O,he;function Re(){de=new em(H),Me=new jp(H,de,e),de.init(Me),ye=new k0(H,de,Me),me=new F0(H,de,Me),He=new im(H),Pe=new b0,T=new z0(H,de,me,Pe,Me,ye,He),E=new Kp(_),X=new Qp(_),re=new uf(H,Me),O=new qp(H,de,re,Me),se=new tm(H,re,He,O),ae=new om(H,se,re,He),Ve=new am(H,Me,T),_e=new $p(Pe),Te=new S0(_,E,X,de,Me,O,_e),ge=new V0(_,Pe),be=new w0,Le=new L0(de,Me),Ze=new Xp(_,E,X,me,ae,p,l),ie=new O0(_,ae,Me),he=new W0(H,He,Me,me),ze=new Yp(H,de,He,Me),Ie=new nm(H,de,He,Me),He.programs=Te.programs,_.capabilities=Me,_.extensions=de,_.properties=Pe,_.renderLists=be,_.shadowMap=ie,_.state=me,_.info=He}Re();const we=new H0(_,H);this.xr=we,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const A=de.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=de.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(A){A!==void 0&&(Y=A,this.setSize(B,G,!1))},this.getSize=function(A){return A.set(B,G)},this.setSize=function(A,q,Q=!0){if(we.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=A,G=q,t.width=Math.floor(A*Y),t.height=Math.floor(q*Y),Q===!0&&(t.style.width=A+"px",t.style.height=q+"px"),this.setViewport(0,0,A,q)},this.getDrawingBufferSize=function(A){return A.set(B*Y,G*Y).floor()},this.setDrawingBufferSize=function(A,q,Q){B=A,G=q,Y=Q,t.width=Math.floor(A*Q),t.height=Math.floor(q*Q),this.setViewport(0,0,A,q)},this.getCurrentViewport=function(A){return A.copy(y)},this.getViewport=function(A){return A.copy(j)},this.setViewport=function(A,q,Q,ee){A.isVector4?j.set(A.x,A.y,A.z,A.w):j.set(A,q,Q,ee),me.viewport(y.copy(j).multiplyScalar(Y).floor())},this.getScissor=function(A){return A.copy(F)},this.setScissor=function(A,q,Q,ee){A.isVector4?F.set(A.x,A.y,A.z,A.w):F.set(A,q,Q,ee),me.scissor(U.copy(F).multiplyScalar(Y).floor())},this.getScissorTest=function(){return R},this.setScissorTest=function(A){me.setScissorTest(R=A)},this.setOpaqueSort=function(A){te=A},this.setTransparentSort=function(A){J=A},this.getClearColor=function(A){return A.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor.apply(Ze,arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha.apply(Ze,arguments)},this.clear=function(A=!0,q=!0,Q=!0){let ee=0;if(A){let Z=!1;if(P!==null){const Ee=P.texture.format;Z=Ee===Lc||Ee===Pc||Ee===Cc}if(Z){const Ee=P.texture.type,Ce=Ee===Xn||Ee===Hn||Ee===Ya||Ee===si||Ee===Ac||Ee===Rc,Fe=Ze.getClearColor(),ke=Ze.getClearAlpha(),Ye=Fe.r,Be=Fe.g,We=Fe.b;Ce?(f[0]=Ye,f[1]=Be,f[2]=We,f[3]=ke,H.clearBufferuiv(H.COLOR,0,f)):(v[0]=Ye,v[1]=Be,v[2]=We,v[3]=ke,H.clearBufferiv(H.COLOR,0,v))}else ee|=H.COLOR_BUFFER_BIT}q&&(ee|=H.DEPTH_BUFFER_BIT),Q&&(ee|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(ee)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",oe,!1),t.removeEventListener("webglcontextrestored",z,!1),t.removeEventListener("webglcontextcreationerror",ue,!1),be.dispose(),Le.dispose(),Pe.dispose(),E.dispose(),X.dispose(),ae.dispose(),O.dispose(),he.dispose(),Te.dispose(),we.dispose(),we.removeEventListener("sessionstart",mt),we.removeEventListener("sessionend",tt),V&&(V.dispose(),V=null),xt.stop()};function oe(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function z(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=He.autoReset,q=ie.enabled,Q=ie.autoUpdate,ee=ie.needsUpdate,Z=ie.type;Re(),He.autoReset=A,ie.enabled=q,ie.autoUpdate=Q,ie.needsUpdate=ee,ie.type=Z}function ue(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ve(A){const q=A.target;q.removeEventListener("dispose",ve),Oe(q)}function Oe(A){De(A),Pe.remove(A)}function De(A){const q=Pe.get(A).programs;q!==void 0&&(q.forEach(function(Q){Te.releaseProgram(Q)}),A.isShaderMaterial&&Te.releaseShaderCache(A))}this.renderBufferDirect=function(A,q,Q,ee,Z,Ee){q===null&&(q=ce);const Ce=Z.isMesh&&Z.matrixWorld.determinant()<0,Fe=Sh(A,q,Q,ee,Z);me.setMaterial(ee,Ce);let ke=Q.index,Ye=1;if(ee.wireframe===!0){if(ke=se.getWireframeAttribute(Q),ke===void 0)return;Ye=2}const Be=Q.drawRange,We=Q.attributes.position;let gt=Be.start*Ye,Ht=(Be.start+Be.count)*Ye;Ee!==null&&(gt=Math.max(gt,Ee.start*Ye),Ht=Math.min(Ht,(Ee.start+Ee.count)*Ye)),ke!==null?(gt=Math.max(gt,0),Ht=Math.min(Ht,ke.count)):We!=null&&(gt=Math.max(gt,0),Ht=Math.min(Ht,We.count));const At=Ht-gt;if(At<0||At===1/0)return;O.setup(Z,ee,Fe,Q,ke);let Mn,ft=ze;if(ke!==null&&(Mn=re.get(ke),ft=Ie,ft.setIndex(Mn)),Z.isMesh)ee.wireframe===!0?(me.setLineWidth(ee.wireframeLinewidth*xe()),ft.setMode(H.LINES)):ft.setMode(H.TRIANGLES);else if(Z.isLine){let je=ee.linewidth;je===void 0&&(je=1),me.setLineWidth(je*xe()),Z.isLineSegments?ft.setMode(H.LINES):Z.isLineLoop?ft.setMode(H.LINE_LOOP):ft.setMode(H.LINE_STRIP)}else Z.isPoints?ft.setMode(H.POINTS):Z.isSprite&&ft.setMode(H.TRIANGLES);if(Z.isBatchedMesh)ft.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else if(Z.isInstancedMesh)ft.renderInstances(gt,At,Z.count);else if(Q.isInstancedBufferGeometry){const je=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Or=Math.min(Q.instanceCount,je);ft.renderInstances(gt,At,Or)}else ft.render(gt,At)};function Je(A,q,Q){A.transparent===!0&&A.side===Cn&&A.forceSinglePass===!1?(A.side=Gt,A.needsUpdate=!0,Rs(A,q,Q),A.side=qn,A.needsUpdate=!0,Rs(A,q,Q),A.side=Cn):Rs(A,q,Q)}this.compile=function(A,q,Q=null){Q===null&&(Q=A),g=Le.get(Q),g.init(),b.push(g),Q.traverseVisible(function(Z){Z.isLight&&Z.layers.test(q.layers)&&(g.pushLight(Z),Z.castShadow&&g.pushShadow(Z))}),A!==Q&&A.traverseVisible(function(Z){Z.isLight&&Z.layers.test(q.layers)&&(g.pushLight(Z),Z.castShadow&&g.pushShadow(Z))}),g.setupLights(_._useLegacyLights);const ee=new Set;return A.traverse(function(Z){const Ee=Z.material;if(Ee)if(Array.isArray(Ee))for(let Ce=0;Ce<Ee.length;Ce++){const Fe=Ee[Ce];Je(Fe,Q,Z),ee.add(Fe)}else Je(Ee,Q,Z),ee.add(Ee)}),b.pop(),g=null,ee},this.compileAsync=function(A,q,Q=null){const ee=this.compile(A,q,Q);return new Promise(Z=>{function Ee(){if(ee.forEach(function(Ce){Pe.get(Ce).currentProgram.isReady()&&ee.delete(Ce)}),ee.size===0){Z(A);return}setTimeout(Ee,10)}de.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let Qe=null;function dt(A){Qe&&Qe(A)}function mt(){xt.stop()}function tt(){xt.start()}const xt=new qc;xt.setAnimationLoop(dt),typeof self<"u"&&xt.setContext(self),this.setAnimationLoop=function(A){Qe=A,we.setAnimationLoop(A),A===null?xt.stop():xt.start()},we.addEventListener("sessionstart",mt),we.addEventListener("sessionend",tt),this.render=function(A,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),we.enabled===!0&&we.isPresenting===!0&&(we.cameraAutoUpdate===!0&&we.updateCamera(q),q=we.getCamera()),A.isScene===!0&&A.onBeforeRender(_,A,q,P),g=Le.get(A,b.length),g.init(),b.push(g),$.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),I.setFromProjectionMatrix($),D=this.localClippingEnabled,C=_e.init(this.clippingPlanes,D),x=be.get(A,d.length),x.init(),d.push(x),fn(A,q,0,_.sortObjects),x.finish(),_.sortObjects===!0&&x.sort(te,J),this.info.render.frame++,C===!0&&_e.beginShadows();const Q=g.state.shadowsArray;if(ie.render(Q,A,q),C===!0&&_e.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ze.render(x,A),g.setupLights(_._useLegacyLights),q.isArrayCamera){const ee=q.cameras;for(let Z=0,Ee=ee.length;Z<Ee;Z++){const Ce=ee[Z];lo(x,A,Ce,Ce.viewport)}}else lo(x,A,q);P!==null&&(T.updateMultisampleRenderTarget(P),T.updateRenderTargetMipmap(P)),A.isScene===!0&&A.onAfterRender(_,A,q),O.resetDefaultState(),W=-1,m=null,b.pop(),b.length>0?g=b[b.length-1]:g=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function fn(A,q,Q,ee){if(A.visible===!1)return;if(A.layers.test(q.layers)){if(A.isGroup)Q=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(q);else if(A.isLight)g.pushLight(A),A.castShadow&&g.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||I.intersectsSprite(A)){ee&&le.setFromMatrixPosition(A.matrixWorld).applyMatrix4($);const Ce=ae.update(A),Fe=A.material;Fe.visible&&x.push(A,Ce,Fe,Q,le.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||I.intersectsObject(A))){const Ce=ae.update(A),Fe=A.material;if(ee&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),le.copy(A.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),le.copy(Ce.boundingSphere.center)),le.applyMatrix4(A.matrixWorld).applyMatrix4($)),Array.isArray(Fe)){const ke=Ce.groups;for(let Ye=0,Be=ke.length;Ye<Be;Ye++){const We=ke[Ye],gt=Fe[We.materialIndex];gt&&gt.visible&&x.push(A,Ce,gt,Q,le.z,We)}}else Fe.visible&&x.push(A,Ce,Fe,Q,le.z,null)}}const Ee=A.children;for(let Ce=0,Fe=Ee.length;Ce<Fe;Ce++)fn(Ee[Ce],q,Q,ee)}function lo(A,q,Q,ee){const Z=A.opaque,Ee=A.transmissive,Ce=A.transparent;g.setupLightsView(Q),C===!0&&_e.setGlobalState(_.clippingPlanes,Q),Ee.length>0&&yh(Z,Ee,q,Q),ee&&me.viewport(y.copy(ee)),Z.length>0&&As(Z,q,Q),Ee.length>0&&As(Ee,q,Q),Ce.length>0&&As(Ce,q,Q),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function yh(A,q,Q,ee){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;const Ee=Me.isWebGL2;V===null&&(V=new li(1,1,{generateMipmaps:!0,type:de.has("EXT_color_buffer_half_float")?Ss:Xn,minFilter:ys,samples:Ee?4:0})),_.getDrawingBufferSize(ne),Ee?V.setSize(ne.x,ne.y):V.setSize(Sr(ne.x),Sr(ne.y));const Ce=_.getRenderTarget();_.setRenderTarget(V),_.getClearColor(K),N=_.getClearAlpha(),N<1&&_.setClearColor(16777215,.5),_.clear();const Fe=_.toneMapping;_.toneMapping=Wn,As(A,Q,ee),T.updateMultisampleRenderTarget(V),T.updateRenderTargetMipmap(V);let ke=!1;for(let Ye=0,Be=q.length;Ye<Be;Ye++){const We=q[Ye],gt=We.object,Ht=We.geometry,At=We.material,Mn=We.group;if(At.side===Cn&&gt.layers.test(ee.layers)){const ft=At.side;At.side=Gt,At.needsUpdate=!0,co(gt,Q,ee,Ht,At,Mn),At.side=ft,At.needsUpdate=!0,ke=!0}}ke===!0&&(T.updateMultisampleRenderTarget(V),T.updateRenderTargetMipmap(V)),_.setRenderTarget(Ce),_.setClearColor(K,N),_.toneMapping=Fe}function As(A,q,Q){const ee=q.isScene===!0?q.overrideMaterial:null;for(let Z=0,Ee=A.length;Z<Ee;Z++){const Ce=A[Z],Fe=Ce.object,ke=Ce.geometry,Ye=ee===null?Ce.material:ee,Be=Ce.group;Fe.layers.test(Q.layers)&&co(Fe,q,Q,ke,Ye,Be)}}function co(A,q,Q,ee,Z,Ee){A.onBeforeRender(_,q,Q,ee,Z,Ee),A.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),Z.onBeforeRender(_,q,Q,ee,A,Ee),Z.transparent===!0&&Z.side===Cn&&Z.forceSinglePass===!1?(Z.side=Gt,Z.needsUpdate=!0,_.renderBufferDirect(Q,q,ee,Z,A,Ee),Z.side=qn,Z.needsUpdate=!0,_.renderBufferDirect(Q,q,ee,Z,A,Ee),Z.side=Cn):_.renderBufferDirect(Q,q,ee,Z,A,Ee),A.onAfterRender(_,q,Q,ee,Z,Ee)}function Rs(A,q,Q){q.isScene!==!0&&(q=ce);const ee=Pe.get(A),Z=g.state.lights,Ee=g.state.shadowsArray,Ce=Z.state.version,Fe=Te.getParameters(A,Z.state,Ee,q,Q),ke=Te.getProgramCacheKey(Fe);let Ye=ee.programs;ee.environment=A.isMeshStandardMaterial?q.environment:null,ee.fog=q.fog,ee.envMap=(A.isMeshStandardMaterial?X:E).get(A.envMap||ee.environment),Ye===void 0&&(A.addEventListener("dispose",ve),Ye=new Map,ee.programs=Ye);let Be=Ye.get(ke);if(Be!==void 0){if(ee.currentProgram===Be&&ee.lightsStateVersion===Ce)return uo(A,Fe),Be}else Fe.uniforms=Te.getUniforms(A),A.onBuild(Q,Fe,_),A.onBeforeCompile(Fe,_),Be=Te.acquireProgram(Fe,ke),Ye.set(ke,Be),ee.uniforms=Fe.uniforms;const We=ee.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(We.clippingPlanes=_e.uniform),uo(A,Fe),ee.needsLights=Eh(A),ee.lightsStateVersion=Ce,ee.needsLights&&(We.ambientLightColor.value=Z.state.ambient,We.lightProbe.value=Z.state.probe,We.directionalLights.value=Z.state.directional,We.directionalLightShadows.value=Z.state.directionalShadow,We.spotLights.value=Z.state.spot,We.spotLightShadows.value=Z.state.spotShadow,We.rectAreaLights.value=Z.state.rectArea,We.ltc_1.value=Z.state.rectAreaLTC1,We.ltc_2.value=Z.state.rectAreaLTC2,We.pointLights.value=Z.state.point,We.pointLightShadows.value=Z.state.pointShadow,We.hemisphereLights.value=Z.state.hemi,We.directionalShadowMap.value=Z.state.directionalShadowMap,We.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,We.spotShadowMap.value=Z.state.spotShadowMap,We.spotLightMatrix.value=Z.state.spotLightMatrix,We.spotLightMap.value=Z.state.spotLightMap,We.pointShadowMap.value=Z.state.pointShadowMap,We.pointShadowMatrix.value=Z.state.pointShadowMatrix),ee.currentProgram=Be,ee.uniformsList=null,Be}function ho(A){if(A.uniformsList===null){const q=A.currentProgram.getUniforms();A.uniformsList=pr.seqWithValue(q.seq,A.uniforms)}return A.uniformsList}function uo(A,q){const Q=Pe.get(A);Q.outputColorSpace=q.outputColorSpace,Q.batching=q.batching,Q.instancing=q.instancing,Q.instancingColor=q.instancingColor,Q.skinning=q.skinning,Q.morphTargets=q.morphTargets,Q.morphNormals=q.morphNormals,Q.morphColors=q.morphColors,Q.morphTargetsCount=q.morphTargetsCount,Q.numClippingPlanes=q.numClippingPlanes,Q.numIntersection=q.numClipIntersection,Q.vertexAlphas=q.vertexAlphas,Q.vertexTangents=q.vertexTangents,Q.toneMapping=q.toneMapping}function Sh(A,q,Q,ee,Z){q.isScene!==!0&&(q=ce),T.resetTextureUnits();const Ee=q.fog,Ce=ee.isMeshStandardMaterial?q.environment:null,Fe=P===null?_.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Dn,ke=(ee.isMeshStandardMaterial?X:E).get(ee.envMap||Ce),Ye=ee.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Be=!!Q.attributes.tangent&&(!!ee.normalMap||ee.anisotropy>0),We=!!Q.morphAttributes.position,gt=!!Q.morphAttributes.normal,Ht=!!Q.morphAttributes.color;let At=Wn;ee.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(At=_.toneMapping);const Mn=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,ft=Mn!==void 0?Mn.length:0,je=Pe.get(ee),Or=g.state.lights;if(C===!0&&(D===!0||A!==m)){const $t=A===m&&ee.id===W;_e.setState(ee,A,$t)}let pt=!1;ee.version===je.__version?(je.needsLights&&je.lightsStateVersion!==Or.state.version||je.outputColorSpace!==Fe||Z.isBatchedMesh&&je.batching===!1||!Z.isBatchedMesh&&je.batching===!0||Z.isInstancedMesh&&je.instancing===!1||!Z.isInstancedMesh&&je.instancing===!0||Z.isSkinnedMesh&&je.skinning===!1||!Z.isSkinnedMesh&&je.skinning===!0||Z.isInstancedMesh&&je.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&je.instancingColor===!1&&Z.instanceColor!==null||je.envMap!==ke||ee.fog===!0&&je.fog!==Ee||je.numClippingPlanes!==void 0&&(je.numClippingPlanes!==_e.numPlanes||je.numIntersection!==_e.numIntersection)||je.vertexAlphas!==Ye||je.vertexTangents!==Be||je.morphTargets!==We||je.morphNormals!==gt||je.morphColors!==Ht||je.toneMapping!==At||Me.isWebGL2===!0&&je.morphTargetsCount!==ft)&&(pt=!0):(pt=!0,je.__version=ee.version);let Yn=je.currentProgram;pt===!0&&(Yn=Rs(ee,q,Z));let fo=!1,ss=!1,Fr=!1;const Dt=Yn.getUniforms(),jn=je.uniforms;if(me.useProgram(Yn.program)&&(fo=!0,ss=!0,Fr=!0),ee.id!==W&&(W=ee.id,ss=!0),fo||m!==A){Dt.setValue(H,"projectionMatrix",A.projectionMatrix),Dt.setValue(H,"viewMatrix",A.matrixWorldInverse);const $t=Dt.map.cameraPosition;$t!==void 0&&$t.setValue(H,le.setFromMatrixPosition(A.matrixWorld)),Me.logarithmicDepthBuffer&&Dt.setValue(H,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(ee.isMeshPhongMaterial||ee.isMeshToonMaterial||ee.isMeshLambertMaterial||ee.isMeshBasicMaterial||ee.isMeshStandardMaterial||ee.isShaderMaterial)&&Dt.setValue(H,"isOrthographic",A.isOrthographicCamera===!0),m!==A&&(m=A,ss=!0,Fr=!0)}if(Z.isSkinnedMesh){Dt.setOptional(H,Z,"bindMatrix"),Dt.setOptional(H,Z,"bindMatrixInverse");const $t=Z.skeleton;$t&&(Me.floatVertexTextures?($t.boneTexture===null&&$t.computeBoneTexture(),Dt.setValue(H,"boneTexture",$t.boneTexture,T)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Z.isBatchedMesh&&(Dt.setOptional(H,Z,"batchingTexture"),Dt.setValue(H,"batchingTexture",Z._matricesTexture,T));const zr=Q.morphAttributes;if((zr.position!==void 0||zr.normal!==void 0||zr.color!==void 0&&Me.isWebGL2===!0)&&Ve.update(Z,Q,Yn),(ss||je.receiveShadow!==Z.receiveShadow)&&(je.receiveShadow=Z.receiveShadow,Dt.setValue(H,"receiveShadow",Z.receiveShadow)),ee.isMeshGouraudMaterial&&ee.envMap!==null&&(jn.envMap.value=ke,jn.flipEnvMap.value=ke.isCubeTexture&&ke.isRenderTargetTexture===!1?-1:1),ss&&(Dt.setValue(H,"toneMappingExposure",_.toneMappingExposure),je.needsLights&&bh(jn,Fr),Ee&&ee.fog===!0&&ge.refreshFogUniforms(jn,Ee),ge.refreshMaterialUniforms(jn,ee,Y,G,V),pr.upload(H,ho(je),jn,T)),ee.isShaderMaterial&&ee.uniformsNeedUpdate===!0&&(pr.upload(H,ho(je),jn,T),ee.uniformsNeedUpdate=!1),ee.isSpriteMaterial&&Dt.setValue(H,"center",Z.center),Dt.setValue(H,"modelViewMatrix",Z.modelViewMatrix),Dt.setValue(H,"normalMatrix",Z.normalMatrix),Dt.setValue(H,"modelMatrix",Z.matrixWorld),ee.isShaderMaterial||ee.isRawShaderMaterial){const $t=ee.uniformsGroups;for(let kr=0,wh=$t.length;kr<wh;kr++)if(Me.isWebGL2){const po=$t[kr];he.update(po,Yn),he.bind(po,Yn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Yn}function bh(A,q){A.ambientLightColor.needsUpdate=q,A.lightProbe.needsUpdate=q,A.directionalLights.needsUpdate=q,A.directionalLightShadows.needsUpdate=q,A.pointLights.needsUpdate=q,A.pointLightShadows.needsUpdate=q,A.spotLights.needsUpdate=q,A.spotLightShadows.needsUpdate=q,A.rectAreaLights.needsUpdate=q,A.hemisphereLights.needsUpdate=q}function Eh(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(A,q,Q){Pe.get(A.texture).__webglTexture=q,Pe.get(A.depthTexture).__webglTexture=Q;const ee=Pe.get(A);ee.__hasExternalTextures=!0,ee.__hasExternalTextures&&(ee.__autoAllocateDepthBuffer=Q===void 0,ee.__autoAllocateDepthBuffer||de.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ee.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,q){const Q=Pe.get(A);Q.__webglFramebuffer=q,Q.__useDefaultFramebuffer=q===void 0},this.setRenderTarget=function(A,q=0,Q=0){P=A,L=q,S=Q;let ee=!0,Z=null,Ee=!1,Ce=!1;if(A){const ke=Pe.get(A);ke.__useDefaultFramebuffer!==void 0?(me.bindFramebuffer(H.FRAMEBUFFER,null),ee=!1):ke.__webglFramebuffer===void 0?T.setupRenderTarget(A):ke.__hasExternalTextures&&T.rebindTextures(A,Pe.get(A.texture).__webglTexture,Pe.get(A.depthTexture).__webglTexture);const Ye=A.texture;(Ye.isData3DTexture||Ye.isDataArrayTexture||Ye.isCompressedArrayTexture)&&(Ce=!0);const Be=Pe.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Be[q])?Z=Be[q][Q]:Z=Be[q],Ee=!0):Me.isWebGL2&&A.samples>0&&T.useMultisampledRTT(A)===!1?Z=Pe.get(A).__webglMultisampledFramebuffer:Array.isArray(Be)?Z=Be[Q]:Z=Be,y.copy(A.viewport),U.copy(A.scissor),k=A.scissorTest}else y.copy(j).multiplyScalar(Y).floor(),U.copy(F).multiplyScalar(Y).floor(),k=R;if(me.bindFramebuffer(H.FRAMEBUFFER,Z)&&Me.drawBuffers&&ee&&me.drawBuffers(A,Z),me.viewport(y),me.scissor(U),me.setScissorTest(k),Ee){const ke=Pe.get(A.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+q,ke.__webglTexture,Q)}else if(Ce){const ke=Pe.get(A.texture),Ye=q||0;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,ke.__webglTexture,Q||0,Ye)}W=-1},this.readRenderTargetPixels=function(A,q,Q,ee,Z,Ee,Ce){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=Pe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(Fe=Fe[Ce]),Fe){me.bindFramebuffer(H.FRAMEBUFFER,Fe);try{const ke=A.texture,Ye=ke.format,Be=ke.type;if(Ye!==en&&ye.convert(Ye)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const We=Be===Ss&&(de.has("EXT_color_buffer_half_float")||Me.isWebGL2&&de.has("EXT_color_buffer_float"));if(Be!==Xn&&ye.convert(Be)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Be===Ln&&(Me.isWebGL2||de.has("OES_texture_float")||de.has("WEBGL_color_buffer_float")))&&!We){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=A.width-ee&&Q>=0&&Q<=A.height-Z&&H.readPixels(q,Q,ee,Z,ye.convert(Ye),ye.convert(Be),Ee)}finally{const ke=P!==null?Pe.get(P).__webglFramebuffer:null;me.bindFramebuffer(H.FRAMEBUFFER,ke)}}},this.copyFramebufferToTexture=function(A,q,Q=0){const ee=Math.pow(2,-Q),Z=Math.floor(q.image.width*ee),Ee=Math.floor(q.image.height*ee);T.setTexture2D(q,0),H.copyTexSubImage2D(H.TEXTURE_2D,Q,0,0,A.x,A.y,Z,Ee),me.unbindTexture()},this.copyTextureToTexture=function(A,q,Q,ee=0){const Z=q.image.width,Ee=q.image.height,Ce=ye.convert(Q.format),Fe=ye.convert(Q.type);T.setTexture2D(Q,0),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,Q.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,Q.unpackAlignment),q.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,ee,A.x,A.y,Z,Ee,Ce,Fe,q.image.data):q.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,ee,A.x,A.y,q.mipmaps[0].width,q.mipmaps[0].height,Ce,q.mipmaps[0].data):H.texSubImage2D(H.TEXTURE_2D,ee,A.x,A.y,Ce,Fe,q.image),ee===0&&Q.generateMipmaps&&H.generateMipmap(H.TEXTURE_2D),me.unbindTexture()},this.copyTextureToTexture3D=function(A,q,Q,ee,Z=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ee=A.max.x-A.min.x+1,Ce=A.max.y-A.min.y+1,Fe=A.max.z-A.min.z+1,ke=ye.convert(ee.format),Ye=ye.convert(ee.type);let Be;if(ee.isData3DTexture)T.setTexture3D(ee,0),Be=H.TEXTURE_3D;else if(ee.isDataArrayTexture||ee.isCompressedArrayTexture)T.setTexture2DArray(ee,0),Be=H.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,ee.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ee.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,ee.unpackAlignment);const We=H.getParameter(H.UNPACK_ROW_LENGTH),gt=H.getParameter(H.UNPACK_IMAGE_HEIGHT),Ht=H.getParameter(H.UNPACK_SKIP_PIXELS),At=H.getParameter(H.UNPACK_SKIP_ROWS),Mn=H.getParameter(H.UNPACK_SKIP_IMAGES),ft=Q.isCompressedTexture?Q.mipmaps[Z]:Q.image;H.pixelStorei(H.UNPACK_ROW_LENGTH,ft.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,ft.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,A.min.x),H.pixelStorei(H.UNPACK_SKIP_ROWS,A.min.y),H.pixelStorei(H.UNPACK_SKIP_IMAGES,A.min.z),Q.isDataTexture||Q.isData3DTexture?H.texSubImage3D(Be,Z,q.x,q.y,q.z,Ee,Ce,Fe,ke,Ye,ft.data):Q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),H.compressedTexSubImage3D(Be,Z,q.x,q.y,q.z,Ee,Ce,Fe,ke,ft.data)):H.texSubImage3D(Be,Z,q.x,q.y,q.z,Ee,Ce,Fe,ke,Ye,ft),H.pixelStorei(H.UNPACK_ROW_LENGTH,We),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,gt),H.pixelStorei(H.UNPACK_SKIP_PIXELS,Ht),H.pixelStorei(H.UNPACK_SKIP_ROWS,At),H.pixelStorei(H.UNPACK_SKIP_IMAGES,Mn),Z===0&&ee.generateMipmaps&&H.generateMipmap(Be),me.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?T.setTextureCube(A,0):A.isData3DTexture?T.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?T.setTexture2DArray(A,0):T.setTexture2D(A,0),me.unbindTexture()},this.resetState=function(){L=0,S=0,P=null,me.reset(),O.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return In}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===ja?"display-p3":"srgb",t.unpackColorSpace=rt.workingColorSpace===Cr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ct?ai:Dc}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===ai?Ct:Dn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class X0 extends eh{}X0.prototype.isWebGL1Renderer=!0;class Qa{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ke(e),this.density=t}clone(){return new Qa(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class q0 extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Y0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ba,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=gn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=gn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=gn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ot=new w;class wr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=pn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=pn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=pn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=pn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new vt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new wr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class th extends ns{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ke(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ii;const cs=new w,Di=new w,Ui=new w,Ni=new fe,hs=new fe,nh=new Xe,Zs=new w,us=new w,Js=new w,Nl=new fe,ma=new fe,Ol=new fe;class j0 extends Et{constructor(e=new th){if(super(),this.isSprite=!0,this.type="Sprite",Ii===void 0){Ii=new It;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Y0(t,5);Ii.setIndex([0,1,2,0,2,3]),Ii.setAttribute("position",new wr(n,3,0,!1)),Ii.setAttribute("uv",new wr(n,2,3,!1))}this.geometry=Ii,this.material=e,this.center=new fe(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Di.setFromMatrixScale(this.matrixWorld),nh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ui.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Di.multiplyScalar(-Ui.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Qs(Zs.set(-.5,-.5,0),Ui,a,Di,s,r),Qs(us.set(.5,-.5,0),Ui,a,Di,s,r),Qs(Js.set(.5,.5,0),Ui,a,Di,s,r),Nl.set(0,0),ma.set(1,0),Ol.set(1,1);let o=e.ray.intersectTriangle(Zs,us,Js,!1,cs);if(o===null&&(Qs(us.set(-.5,.5,0),Ui,a,Di,s,r),ma.set(0,1),o=e.ray.intersectTriangle(Zs,Js,us,!1,cs),o===null))return;const l=e.ray.origin.distanceTo(cs);l<e.near||l>e.far||t.push({distance:l,point:cs.clone(),uv:Qt.getInterpolation(cs,Zs,us,Js,Nl,ma,Ol,new fe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Qs(i,e,t,n,s,r){Ni.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(hs.x=r*Ni.x-s*Ni.y,hs.y=s*Ni.x+r*Ni.y):hs.copy(Ni),i.copy(e),i.x+=hs.x,i.y+=hs.y,i.applyMatrix4(nh)}const Fl=new w,zl=new ot,kl=new ot,$0=new w,Bl=new Xe,er=new w,ga=new ws,Gl=new Xe,_a=new Pr;class K0 extends Lt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=yo,this.bindMatrix=new Xe,this.bindMatrixInverse=new Xe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ts),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,er),this.boundingBox.expandByPoint(er)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ws),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,er),this.boundingSphere.expandByPoint(er)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ga.copy(this.boundingSphere),ga.applyMatrix4(s),e.ray.intersectsSphere(ga)!==!1&&(Gl.copy(s).invert(),_a.copy(e.ray).applyMatrix4(Gl),!(this.boundingBox!==null&&_a.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,_a)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ot,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===yo?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===ru?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;zl.fromBufferAttribute(s.attributes.skinIndex,e),kl.fromBufferAttribute(s.attributes.skinWeight,e),Fl.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=kl.getComponent(r);if(a!==0){const o=zl.getComponent(r);Bl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector($0.copy(Fl).applyMatrix4(Bl),a)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(e,t)}}class ih extends Et{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Z0 extends kt{constructor(e=null,t=1,n=1,s,r,a,o,l,h=Pt,c=Pt,u,p){super(null,a,o,l,h,c,s,r,u,p),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Hl=new Xe,J0=new Xe;class eo{constructor(e=[],t=[]){this.uuid=gn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Xe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Xe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:J0;Hl.multiplyMatrices(o,t[r]),Hl.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new eo(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Z0(t,e,e,en,Ln);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let a=t[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new ih),this.bones.push(a),this.boneInverses.push(new Xe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=n[s];e.boneInverses.push(o.toArray())}return e}}class Q0 extends kt{constructor(e,t,n,s,r,a,o,l,h){super(e,t,n,s,r,a,o,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class xn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,h;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const c=n[s],p=n[s+1]-c,f=(a-c)/p;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new fe:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new w,s=[],r=[],a=[],o=new w,l=new Xe;for(let f=0;f<=e;f++){const v=f/e;s[f]=this.getTangentAt(v,new w)}r[0]=new w,a[0]=new w;let h=Number.MAX_VALUE;const c=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);c<=h&&(h=c,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),p<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const v=Math.acos(bt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,v))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(bt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let v=1;v<=e;v++)r[v].applyMatrix4(l.makeRotationAxis(s[v],f*v)),a[v].crossVectors(s[v],r[v])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class to extends xn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t){const n=t||new fe,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const c=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=l-this.aX,f=h-this.aY;l=p*c-f*u+this.aX,h=p*u+f*c+this.aY}return n.set(l,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class eg extends to{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function no(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,h){s(a,o,h*(o-r),h*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,h,c,u){let p=(a-r)/h-(o-r)/(h+c)+(o-a)/c,f=(o-a)/c-(l-a)/(c+u)+(l-o)/u;p*=c,f*=c,s(a,o,p,f)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const tr=new w,va=new no,xa=new no,Ma=new no;class tg extends xn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new w){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let h,c;this.closed||o>0?h=s[(o-1)%r]:(tr.subVectors(s[0],s[1]).add(s[0]),h=tr);const u=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?c=s[(o+2)%r]:(tr.subVectors(s[r-1],s[r-2]).add(s[r-1]),c=tr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let v=Math.pow(h.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(p),f),g=Math.pow(p.distanceToSquared(c),f);x<1e-4&&(x=1),v<1e-4&&(v=x),g<1e-4&&(g=x),va.initNonuniformCatmullRom(h.x,u.x,p.x,c.x,v,x,g),xa.initNonuniformCatmullRom(h.y,u.y,p.y,c.y,v,x,g),Ma.initNonuniformCatmullRom(h.z,u.z,p.z,c.z,v,x,g)}else this.curveType==="catmullrom"&&(va.initCatmullRom(h.x,u.x,p.x,c.x,this.tension),xa.initCatmullRom(h.y,u.y,p.y,c.y,this.tension),Ma.initCatmullRom(h.z,u.z,p.z,c.z,this.tension));return n.set(va.calc(l),xa.calc(l),Ma.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new w().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Vl(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function ng(i,e){const t=1-i;return t*t*e}function ig(i,e){return 2*(1-i)*i*e}function sg(i,e){return i*i*e}function xs(i,e,t,n){return ng(i,e)+ig(i,t)+sg(i,n)}function rg(i,e){const t=1-i;return t*t*t*e}function ag(i,e){const t=1-i;return 3*t*t*i*e}function og(i,e){return 3*(1-i)*i*i*e}function lg(i,e){return i*i*i*e}function Ms(i,e,t,n,s){return rg(i,e)+ag(i,t)+og(i,n)+lg(i,s)}class sh extends xn{constructor(e=new fe,t=new fe,n=new fe,s=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new fe){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ms(e,s.x,r.x,a.x,o.x),Ms(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class cg extends xn{constructor(e=new w,t=new w,n=new w,s=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new w){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ms(e,s.x,r.x,a.x,o.x),Ms(e,s.y,r.y,a.y,o.y),Ms(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class rh extends xn{constructor(e=new fe,t=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new fe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hg extends xn{constructor(e=new w,t=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new w){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new w){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ah extends xn{constructor(e=new fe,t=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new fe){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(xs(e,s.x,r.x,a.x),xs(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ug extends xn{constructor(e=new w,t=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new w){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(xs(e,s.x,r.x,a.x),xs(e,s.y,r.y,a.y),xs(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class oh extends xn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new fe){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],h=s[a],c=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Vl(o,l.x,h.x,c.x,u.x),Vl(o,l.y,h.y,c.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new fe().fromArray(s))}return this}}var Wl=Object.freeze({__proto__:null,ArcCurve:eg,CatmullRomCurve3:tg,CubicBezierCurve:sh,CubicBezierCurve3:cg,EllipseCurve:to,LineCurve:rh,LineCurve3:hg,QuadraticBezierCurve:ah,QuadraticBezierCurve3:ug,SplineCurve:oh});class fg extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Wl[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),h=l===0?0:1-a/l;return o.getPointAt(h,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let h=0;h<l.length;h++){const c=l[h];n&&n.equals(c)||(t.push(c),n=c)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Wl[s.type]().fromJSON(s))}return this}}class dg extends fg{constructor(e){super(),this.type="Path",this.currentPoint=new fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new rh(this.currentPoint.clone(),new fe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new ah(this.currentPoint.clone(),new fe(e,t),new fe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new sh(this.currentPoint.clone(),new fe(e,t),new fe(n,s),new fe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new oh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){const h=this.currentPoint.x,c=this.currentPoint.y;return this.absellipse(e+h,t+c,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){const h=new to(e,t,n,s,r,a,o,l);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const c=h.getPoint(1);return this.currentPoint.copy(c),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class io extends It{constructor(e=[new fe(0,-.5),new fe(.5,0),new fe(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=bt(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],h=[],c=1/t,u=new w,p=new fe,f=new w,v=new w,x=new w;let g=0,d=0;for(let b=0;b<=e.length-1;b++)switch(b){case 0:g=e[b+1].x-e[b].x,d=e[b+1].y-e[b].y,f.x=d*1,f.y=-g,f.z=d*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:g=e[b+1].x-e[b].x,d=e[b+1].y-e[b].y,f.x=d*1,f.y=-g,f.z=d*0,v.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(v)}for(let b=0;b<=t;b++){const _=n+b*c*s,M=Math.sin(_),L=Math.cos(_);for(let S=0;S<=e.length-1;S++){u.x=e[S].x*M,u.y=e[S].y,u.z=e[S].x*L,a.push(u.x,u.y,u.z),p.x=b/t,p.y=S/(e.length-1),o.push(p.x,p.y);const P=l[3*S+0]*M,W=l[3*S+1],m=l[3*S+0]*L;h.push(P,W,m)}}for(let b=0;b<t;b++)for(let _=0;_<e.length-1;_++){const M=_+b*e.length,L=M,S=M+e.length,P=M+e.length+1,W=M+1;r.push(L,S,W),r.push(P,W,S)}this.setIndex(r),this.setAttribute("position",new at(a,3)),this.setAttribute("uv",new at(o,2)),this.setAttribute("normal",new at(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new io(e.points,e.segments,e.phiStart,e.phiLength)}}class Xi extends io{constructor(e=1,t=1,n=4,s=8){const r=new dg;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new Xi(e.radius,e.length,e.capSegments,e.radialSegments)}}class Rn extends It{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],h=new w,c=new fe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,p=3;u<=t;u++,p+=3){const f=n+u/t*s;h.x=e*Math.cos(f),h.y=e*Math.sin(f),a.push(h.x,h.y,h.z),o.push(0,0,1),c.x=(a[p]/e+1)/2,c.y=(a[p+1]/e+1)/2,l.push(c.x,c.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(o,3)),this.setAttribute("uv",new at(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class nt extends It{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const h=this;s=Math.floor(s),r=Math.floor(r);const c=[],u=[],p=[],f=[];let v=0;const x=[],g=n/2;let d=0;b(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(c),this.setAttribute("position",new at(u,3)),this.setAttribute("normal",new at(p,3)),this.setAttribute("uv",new at(f,2));function b(){const M=new w,L=new w;let S=0;const P=(t-e)/n;for(let W=0;W<=r;W++){const m=[],y=W/r,U=y*(t-e)+e;for(let k=0;k<=s;k++){const K=k/s,N=K*l+o,B=Math.sin(N),G=Math.cos(N);L.x=U*B,L.y=-y*n+g,L.z=U*G,u.push(L.x,L.y,L.z),M.set(B,P,G).normalize(),p.push(M.x,M.y,M.z),f.push(K,1-y),m.push(v++)}x.push(m)}for(let W=0;W<s;W++)for(let m=0;m<r;m++){const y=x[m][W],U=x[m+1][W],k=x[m+1][W+1],K=x[m][W+1];c.push(y,U,K),c.push(U,k,K),S+=6}h.addGroup(d,S,0),d+=S}function _(M){const L=v,S=new fe,P=new w;let W=0;const m=M===!0?e:t,y=M===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,g*y,0),p.push(0,y,0),f.push(.5,.5),v++;const U=v;for(let k=0;k<=s;k++){const N=k/s*l+o,B=Math.cos(N),G=Math.sin(N);P.x=m*G,P.y=g*y,P.z=m*B,u.push(P.x,P.y,P.z),p.push(0,y,0),S.x=B*.5+.5,S.y=G*.5*y+.5,f.push(S.x,S.y),v++}for(let k=0;k<s;k++){const K=L+k,N=U+k;M===!0?c.push(N,N+1,K):c.push(N+1,N,K),W+=3}h.addGroup(d,W,M===!0?1:2),d+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class vn extends nt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new vn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class so extends It{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),h(n),c(),this.setAttribute("position",new at(r,3)),this.setAttribute("normal",new at(r.slice(),3)),this.setAttribute("uv",new at(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const _=new w,M=new w,L=new w;for(let S=0;S<t.length;S+=3)f(t[S+0],_),f(t[S+1],M),f(t[S+2],L),l(_,M,L,b)}function l(b,_,M,L){const S=L+1,P=[];for(let W=0;W<=S;W++){P[W]=[];const m=b.clone().lerp(M,W/S),y=_.clone().lerp(M,W/S),U=S-W;for(let k=0;k<=U;k++)k===0&&W===S?P[W][k]=m:P[W][k]=m.clone().lerp(y,k/U)}for(let W=0;W<S;W++)for(let m=0;m<2*(S-W)-1;m++){const y=Math.floor(m/2);m%2===0?(p(P[W][y+1]),p(P[W+1][y]),p(P[W][y])):(p(P[W][y+1]),p(P[W+1][y+1]),p(P[W+1][y]))}}function h(b){const _=new w;for(let M=0;M<r.length;M+=3)_.x=r[M+0],_.y=r[M+1],_.z=r[M+2],_.normalize().multiplyScalar(b),r[M+0]=_.x,r[M+1]=_.y,r[M+2]=_.z}function c(){const b=new w;for(let _=0;_<r.length;_+=3){b.x=r[_+0],b.y=r[_+1],b.z=r[_+2];const M=g(b)/2/Math.PI+.5,L=d(b)/Math.PI+.5;a.push(M,1-L)}v(),u()}function u(){for(let b=0;b<a.length;b+=6){const _=a[b+0],M=a[b+2],L=a[b+4],S=Math.max(_,M,L),P=Math.min(_,M,L);S>.9&&P<.1&&(_<.2&&(a[b+0]+=1),M<.2&&(a[b+2]+=1),L<.2&&(a[b+4]+=1))}}function p(b){r.push(b.x,b.y,b.z)}function f(b,_){const M=b*3;_.x=e[M+0],_.y=e[M+1],_.z=e[M+2]}function v(){const b=new w,_=new w,M=new w,L=new w,S=new fe,P=new fe,W=new fe;for(let m=0,y=0;m<r.length;m+=9,y+=6){b.set(r[m+0],r[m+1],r[m+2]),_.set(r[m+3],r[m+4],r[m+5]),M.set(r[m+6],r[m+7],r[m+8]),S.set(a[y+0],a[y+1]),P.set(a[y+2],a[y+3]),W.set(a[y+4],a[y+5]),L.copy(b).add(_).add(M).divideScalar(3);const U=g(L);x(S,y+0,b,U),x(P,y+2,_,U),x(W,y+4,M,U)}}function x(b,_,M,L){L<0&&b.x===1&&(a[_]=b.x-1),M.x===0&&M.z===0&&(a[_]=L/2/Math.PI+.5)}function g(b){return Math.atan2(b.z,-b.x)}function d(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new so(e.vertices,e.indices,e.radius,e.details)}}class Ji extends so{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ji(e.radius,e.detail)}}class ro extends It{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],h=[],c=[];let u=e;const p=(t-e)/s,f=new w,v=new fe;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){const d=r+g/n*a;f.x=u*Math.cos(d),f.y=u*Math.sin(d),l.push(f.x,f.y,f.z),h.push(0,0,1),v.x=(f.x/t+1)/2,v.y=(f.y/t+1)/2,c.push(v.x,v.y)}u+=p}for(let x=0;x<s;x++){const g=x*(n+1);for(let d=0;d<n;d++){const b=d+g,_=b,M=b+n+1,L=b+n+2,S=b+1;o.push(_,M,S),o.push(M,L,S)}}this.setIndex(o),this.setAttribute("position",new at(l,3)),this.setAttribute("normal",new at(h,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ro(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class jt extends It{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let h=0;const c=[],u=new w,p=new w,f=[],v=[],x=[],g=[];for(let d=0;d<=n;d++){const b=[],_=d/n;let M=0;d===0&&a===0?M=.5/t:d===n&&l===Math.PI&&(M=-.5/t);for(let L=0;L<=t;L++){const S=L/t;u.x=-e*Math.cos(s+S*r)*Math.sin(a+_*o),u.y=e*Math.cos(a+_*o),u.z=e*Math.sin(s+S*r)*Math.sin(a+_*o),v.push(u.x,u.y,u.z),p.copy(u).normalize(),x.push(p.x,p.y,p.z),g.push(S+M,1-_),b.push(h++)}c.push(b)}for(let d=0;d<n;d++)for(let b=0;b<t;b++){const _=c[d][b+1],M=c[d][b],L=c[d+1][b],S=c[d+1][b+1];(d!==0||a>0)&&f.push(_,M,S),(d!==n-1||l<Math.PI)&&f.push(M,L,S)}this.setIndex(f),this.setAttribute("position",new at(v,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Zt extends It{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],h=[],c=new w,u=new w,p=new w;for(let f=0;f<=n;f++)for(let v=0;v<=s;v++){const x=v/s*r,g=f/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(x),u.y=(e+t*Math.cos(g))*Math.sin(x),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),c.x=e*Math.cos(x),c.y=e*Math.sin(x),p.subVectors(u,c).normalize(),l.push(p.x,p.y,p.z),h.push(v/s),h.push(f/n)}for(let f=1;f<=n;f++)for(let v=1;v<=s;v++){const x=(s+1)*f+v-1,g=(s+1)*(f-1)+v-1,d=(s+1)*(f-1)+v,b=(s+1)*f+v;a.push(x,g,b),a.push(g,d,b)}this.setIndex(a),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(l,3)),this.setAttribute("uv",new at(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class lh extends ns{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Uc,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Dr extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class pg extends Dr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ya=new Xe,Xl=new w,ql=new w;class ch{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Za,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Xl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xl),ql.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ql),t.updateMatrixWorld(),ya.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ya),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ya)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Yl=new Xe,fs=new w,Sa=new w;class mg extends ch{constructor(){super(new Yt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new fe(4,2),this._viewportCount=6,this._viewports=[new ot(2,1,1,1),new ot(0,1,1,1),new ot(3,1,1,1),new ot(1,1,1,1),new ot(3,0,1,1),new ot(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),fs.setFromMatrixPosition(e.matrixWorld),n.position.copy(fs),Sa.copy(n.position),Sa.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Sa),n.updateMatrixWorld(),s.makeTranslation(-fs.x,-fs.y,-fs.z),Yl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yl)}}class ba extends Dr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new mg}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class gg extends ch{constructor(){super(new Yc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class hh extends Dr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new gg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class _g extends Dr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class vg{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=jl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=jl();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function jl(){return(typeof performance>"u"?Date:performance).now()}class xg{constructor(e,t,n=0,s=1/0){this.ray=new Pr(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Ka,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return Wa(e,this,n,t),n.sort($l),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Wa(e[s],this,n,t);return n.sort($l),n}}function $l(i,e){return i.distance-e.distance}function Wa(i,e,t,n){if(i.layers.test(e.layers)&&i.raycast(e,t),n===!0){const s=i.children;for(let r=0,a=s.length;r<a;r++)Wa(s[r],e,t,!0)}}class Kl{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(bt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qa);const Zl={type:"change"},Ea={type:"start"},Jl={type:"end"},nr=new Pr,Ql=new Bn,Mg=Math.cos(70*br.DEG2RAD);class yg extends fi{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new w,this.cursor=new w,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:pi.ROTATE,MIDDLE:pi.DOLLY,RIGHT:pi.PAN},this.touches={ONE:mi.ROTATE,TWO:mi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(O){O.addEventListener("keydown",Le),this._domElementKeyEvents=O},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Le),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Zl),n.update(),r=s.NONE},this.update=function(){const O=new w,he=new hn().setFromUnitVectors(e.up,new w(0,1,0)),Re=he.clone().invert(),we=new w,oe=new hn,z=new w,ue=2*Math.PI;return function(Oe=null){const De=n.object.position;O.copy(De).sub(n.target),O.applyQuaternion(he),o.setFromVector3(O),n.autoRotate&&r===s.NONE&&k(y(Oe)),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let Je=n.minAzimuthAngle,Qe=n.maxAzimuthAngle;isFinite(Je)&&isFinite(Qe)&&(Je<-Math.PI?Je+=ue:Je>Math.PI&&(Je-=ue),Qe<-Math.PI?Qe+=ue:Qe>Math.PI&&(Qe-=ue),Je<=Qe?o.theta=Math.max(Je,Math.min(Qe,o.theta)):o.theta=o.theta>(Je+Qe)/2?Math.max(Je,o.theta):Math.min(Qe,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(c,n.dampingFactor):n.target.add(c),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&S||n.object.isOrthographicCamera?o.radius=j(o.radius):o.radius=j(o.radius*h),O.setFromSpherical(o),O.applyQuaternion(Re),De.copy(n.target).add(O),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,c.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),c.set(0,0,0));let dt=!1;if(n.zoomToCursor&&S){let mt=null;if(n.object.isPerspectiveCamera){const tt=O.length();mt=j(tt*h);const xt=tt-mt;n.object.position.addScaledVector(M,xt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const tt=new w(L.x,L.y,0);tt.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),dt=!0;const xt=new w(L.x,L.y,0);xt.unproject(n.object),n.object.position.sub(xt).add(tt),n.object.updateMatrixWorld(),mt=O.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;mt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(mt).add(n.object.position):(nr.origin.copy(n.object.position),nr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(nr.direction))<Mg?e.lookAt(n.target):(Ql.setFromNormalAndCoplanarPoint(n.object.up,n.target),nr.intersectPlane(Ql,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),dt=!0);return h=1,S=!1,dt||we.distanceToSquared(n.object.position)>a||8*(1-oe.dot(n.object.quaternion))>a||z.distanceToSquared(n.target)>0?(n.dispatchEvent(Zl),we.copy(n.object.position),oe.copy(n.object.quaternion),z.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Ze),n.domElement.removeEventListener("pointerdown",T),n.domElement.removeEventListener("pointercancel",X),n.domElement.removeEventListener("wheel",ae),n.domElement.removeEventListener("pointermove",E),n.domElement.removeEventListener("pointerup",X),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Le),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const a=1e-6,o=new Kl,l=new Kl;let h=1;const c=new w,u=new fe,p=new fe,f=new fe,v=new fe,x=new fe,g=new fe,d=new fe,b=new fe,_=new fe,M=new w,L=new fe;let S=!1;const P=[],W={};let m=!1;function y(O){return O!==null?2*Math.PI/60*n.autoRotateSpeed*O:2*Math.PI/60/60*n.autoRotateSpeed}function U(O){const he=Math.abs(O*.01);return Math.pow(.95,n.zoomSpeed*he)}function k(O){l.theta-=O}function K(O){l.phi-=O}const N=function(){const O=new w;return function(Re,we){O.setFromMatrixColumn(we,0),O.multiplyScalar(-Re),c.add(O)}}(),B=function(){const O=new w;return function(Re,we){n.screenSpacePanning===!0?O.setFromMatrixColumn(we,1):(O.setFromMatrixColumn(we,0),O.crossVectors(n.object.up,O)),O.multiplyScalar(Re),c.add(O)}}(),G=function(){const O=new w;return function(Re,we){const oe=n.domElement;if(n.object.isPerspectiveCamera){const z=n.object.position;O.copy(z).sub(n.target);let ue=O.length();ue*=Math.tan(n.object.fov/2*Math.PI/180),N(2*Re*ue/oe.clientHeight,n.object.matrix),B(2*we*ue/oe.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(N(Re*(n.object.right-n.object.left)/n.object.zoom/oe.clientWidth,n.object.matrix),B(we*(n.object.top-n.object.bottom)/n.object.zoom/oe.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Y(O){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=O:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function te(O){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=O:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function J(O,he){if(!n.zoomToCursor)return;S=!0;const Re=n.domElement.getBoundingClientRect(),we=O-Re.left,oe=he-Re.top,z=Re.width,ue=Re.height;L.x=we/z*2-1,L.y=-(oe/ue)*2+1,M.set(L.x,L.y,1).unproject(n.object).sub(n.object.position).normalize()}function j(O){return Math.max(n.minDistance,Math.min(n.maxDistance,O))}function F(O){u.set(O.clientX,O.clientY)}function R(O){J(O.clientX,O.clientX),d.set(O.clientX,O.clientY)}function I(O){v.set(O.clientX,O.clientY)}function C(O){p.set(O.clientX,O.clientY),f.subVectors(p,u).multiplyScalar(n.rotateSpeed);const he=n.domElement;k(2*Math.PI*f.x/he.clientHeight),K(2*Math.PI*f.y/he.clientHeight),u.copy(p),n.update()}function D(O){b.set(O.clientX,O.clientY),_.subVectors(b,d),_.y>0?Y(U(_.y)):_.y<0&&te(U(_.y)),d.copy(b),n.update()}function V(O){x.set(O.clientX,O.clientY),g.subVectors(x,v).multiplyScalar(n.panSpeed),G(g.x,g.y),v.copy(x),n.update()}function $(O){J(O.clientX,O.clientY),O.deltaY<0?te(U(O.deltaY)):O.deltaY>0&&Y(U(O.deltaY)),n.update()}function ne(O){let he=!1;switch(O.code){case n.keys.UP:O.ctrlKey||O.metaKey||O.shiftKey?K(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):G(0,n.keyPanSpeed),he=!0;break;case n.keys.BOTTOM:O.ctrlKey||O.metaKey||O.shiftKey?K(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):G(0,-n.keyPanSpeed),he=!0;break;case n.keys.LEFT:O.ctrlKey||O.metaKey||O.shiftKey?k(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):G(n.keyPanSpeed,0),he=!0;break;case n.keys.RIGHT:O.ctrlKey||O.metaKey||O.shiftKey?k(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):G(-n.keyPanSpeed,0),he=!0;break}he&&(O.preventDefault(),n.update())}function le(O){if(P.length===1)u.set(O.pageX,O.pageY);else{const he=ye(O),Re=.5*(O.pageX+he.x),we=.5*(O.pageY+he.y);u.set(Re,we)}}function ce(O){if(P.length===1)v.set(O.pageX,O.pageY);else{const he=ye(O),Re=.5*(O.pageX+he.x),we=.5*(O.pageY+he.y);v.set(Re,we)}}function xe(O){const he=ye(O),Re=O.pageX-he.x,we=O.pageY-he.y,oe=Math.sqrt(Re*Re+we*we);d.set(0,oe)}function H(O){n.enableZoom&&xe(O),n.enablePan&&ce(O)}function Ne(O){n.enableZoom&&xe(O),n.enableRotate&&le(O)}function de(O){if(P.length==1)p.set(O.pageX,O.pageY);else{const Re=ye(O),we=.5*(O.pageX+Re.x),oe=.5*(O.pageY+Re.y);p.set(we,oe)}f.subVectors(p,u).multiplyScalar(n.rotateSpeed);const he=n.domElement;k(2*Math.PI*f.x/he.clientHeight),K(2*Math.PI*f.y/he.clientHeight),u.copy(p)}function Me(O){if(P.length===1)x.set(O.pageX,O.pageY);else{const he=ye(O),Re=.5*(O.pageX+he.x),we=.5*(O.pageY+he.y);x.set(Re,we)}g.subVectors(x,v).multiplyScalar(n.panSpeed),G(g.x,g.y),v.copy(x)}function me(O){const he=ye(O),Re=O.pageX-he.x,we=O.pageY-he.y,oe=Math.sqrt(Re*Re+we*we);b.set(0,oe),_.set(0,Math.pow(b.y/d.y,n.zoomSpeed)),Y(_.y),d.copy(b);const z=(O.pageX+he.x)*.5,ue=(O.pageY+he.y)*.5;J(z,ue)}function He(O){n.enableZoom&&me(O),n.enablePan&&Me(O)}function Pe(O){n.enableZoom&&me(O),n.enableRotate&&de(O)}function T(O){n.enabled!==!1&&(P.length===0&&(n.domElement.setPointerCapture(O.pointerId),n.domElement.addEventListener("pointermove",E),n.domElement.addEventListener("pointerup",X)),Ve(O),O.pointerType==="touch"?_e(O):re(O))}function E(O){n.enabled!==!1&&(O.pointerType==="touch"?ie(O):se(O))}function X(O){ze(O),P.length===0&&(n.domElement.releasePointerCapture(O.pointerId),n.domElement.removeEventListener("pointermove",E),n.domElement.removeEventListener("pointerup",X)),n.dispatchEvent(Jl),r=s.NONE}function re(O){let he;switch(O.button){case 0:he=n.mouseButtons.LEFT;break;case 1:he=n.mouseButtons.MIDDLE;break;case 2:he=n.mouseButtons.RIGHT;break;default:he=-1}switch(he){case pi.DOLLY:if(n.enableZoom===!1)return;R(O),r=s.DOLLY;break;case pi.ROTATE:if(O.ctrlKey||O.metaKey||O.shiftKey){if(n.enablePan===!1)return;I(O),r=s.PAN}else{if(n.enableRotate===!1)return;F(O),r=s.ROTATE}break;case pi.PAN:if(O.ctrlKey||O.metaKey||O.shiftKey){if(n.enableRotate===!1)return;F(O),r=s.ROTATE}else{if(n.enablePan===!1)return;I(O),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ea)}function se(O){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;C(O);break;case s.DOLLY:if(n.enableZoom===!1)return;D(O);break;case s.PAN:if(n.enablePan===!1)return;V(O);break}}function ae(O){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(O.preventDefault(),n.dispatchEvent(Ea),$(Te(O)),n.dispatchEvent(Jl))}function Te(O){const he=O.deltaMode,Re={clientX:O.clientX,clientY:O.clientY,deltaY:O.deltaY};switch(he){case 1:Re.deltaY*=16;break;case 2:Re.deltaY*=100;break}return O.ctrlKey&&!m&&(Re.deltaY*=10),Re}function ge(O){O.key==="Control"&&(m=!0,document.addEventListener("keyup",be,{passive:!0,capture:!0}))}function be(O){O.key==="Control"&&(m=!1,document.removeEventListener("keyup",be,{passive:!0,capture:!0}))}function Le(O){n.enabled===!1||n.enablePan===!1||ne(O)}function _e(O){switch(Ie(O),P.length){case 1:switch(n.touches.ONE){case mi.ROTATE:if(n.enableRotate===!1)return;le(O),r=s.TOUCH_ROTATE;break;case mi.PAN:if(n.enablePan===!1)return;ce(O),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case mi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;H(O),r=s.TOUCH_DOLLY_PAN;break;case mi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Ne(O),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ea)}function ie(O){switch(Ie(O),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;de(O),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Me(O),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;He(O),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Pe(O),n.update();break;default:r=s.NONE}}function Ze(O){n.enabled!==!1&&O.preventDefault()}function Ve(O){P.push(O.pointerId)}function ze(O){delete W[O.pointerId];for(let he=0;he<P.length;he++)if(P[he]==O.pointerId){P.splice(he,1);return}}function Ie(O){let he=W[O.pointerId];he===void 0&&(he=new fe,W[O.pointerId]=he),he.set(O.pageX,O.pageY)}function ye(O){const he=O.pointerId===P[0]?P[1]:P[0];return W[he]}n.domElement.addEventListener("contextmenu",Ze),n.domElement.addEventListener("pointerdown",T),n.domElement.addEventListener("pointercancel",X),n.domElement.addEventListener("wheel",ae,{passive:!1}),document.addEventListener("keydown",ge,{passive:!0,capture:!0}),this.update()}}function Bt(i){return i=i^61^i>>>16,i=i+(i<<3)|0,i=i^i>>>4,i=Math.imul(i,668265261),i=i^i>>>15,i>>>0}function wa(i){let e=2166136261;for(let t=0;t<i.length;t++)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return Bt(e)}function mn(i=1){let e=(i|0)>>>0||1;return function(){e=e+1831565813>>>0;let n=e;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}const ut=(i,e)=>e[Math.floor(i()*e.length)%e.length],Se=(i,e,t)=>e+i()*(t-e),ec=(i,e,t)=>e+Math.floor(i()*(t-e+1)),Ge=(i,e)=>i()<e;function ir(i,e){return Bt(Math.imul(i|0,374761393)+Math.imul(e|0,668265263))/4294967296}const tc=i=>i*i*i*(i*(i*6-15)+10),Ta=(i,e,t)=>i+(e-i)*t;function Sg(i,e){const t=Math.floor(i),n=Math.floor(e),s=tc(i-t),r=tc(e-n);return Ta(Ta(ir(t,n),ir(t+1,n),s),Ta(ir(t,n+1),ir(t+1,n+1),s),r)}function Oi(i,e,t=4,n=.5){let s=0,r=1,a=0,o=1;for(let l=0;l<t;l++)s+=r*Sg(i*o,e*o),a+=r,r*=n,o*=2;return s/a}const Pn=(i,e,t)=>i<e?e:i>t?t:Number.isNaN(i)?e:i,Xt=i=>Pn(i,0,1),sr=(i,e,t)=>{const n=Xt((t-i)/(e-i));return n*n*(3-2*n)},Ur=[{id:"apple",name:"Sun Apples",icon:"apple",baseValue:6,color:14238523},{id:"fish",name:"Moon Eels",icon:"fish",baseValue:9,color:7321545},{id:"bread",name:"Ember Loaves",icon:"bread",baseValue:5,color:13209422},{id:"spice",name:"Crimson Spice",icon:"spice",baseValue:14,color:12731692},{id:"potion",name:"Murk Tonics",icon:"potion",baseValue:18,color:8377482},{id:"gem",name:"Void Gems",icon:"gem",baseValue:30,color:9400276},{id:"lamp",name:"Wisp Lamps",icon:"lamp",baseValue:16,color:15251020},{id:"rug",name:"Dream Rugs",icon:"rug",baseValue:22,color:12081807},{id:"scroll",name:"Curse Scrolls",icon:"scroll",baseValue:12,color:14208942},{id:"skull",name:"Chatter Skulls",icon:"skull",baseValue:25,color:13620946}],bg=Object.fromEntries(Ur.map(i=>[i.id,i]));function _n(i){const e=bg[i];if(!e)throw new Error(`market-bazaar: unknown good "${i}"`);return e}const Eg={human:[15250572,13933162,11565646,9067064,7226408,1578e4],alien:[7323498,5089440,8024020,5937876,10146906,5294260],monster:[9071170,6978130,7371398,10512970,5925466,9861199],devil:[12597547,9316922,8006234,13914154,10498128]},nc=[12597547,15116311,1613459,8212414,12735103,3829413,9083434,12081712],wg=[4864602,3820090,5913130,2767450,5909034],Tg=[2365970,4860434,9062942,9079442,15261904,1976898,5909050],Ag=[16765514,16742970,16773280],Rg=[3811866,2771562,2775610,5913114,6957642];function Cg(i,e,t){const n={species:e,role:t,height:1.7,legginess:Se(i,.35,.65),headSize:.11,shoulderW:.19,hipW:.09,armLen:.56,neckLen:.05,hunch:Se(i,0,.15),footLen:.13,tailSegs:0,tailLen:0,antennae:!1,limbThick:.042,belly:Se(i,.1,.5),eyeCount:2,eyeScale:1,eyeGlow:!1,snout:0,fangs:!1,horns:null,earStyle:"round",hat:"none",beard:0,tailSpade:!1,instrument:null,hairStyle:"none",hairColor:ut(i,Tg),earrings:!1,necklace:"none",glasses:!1,eyepatch:!1,sash:!1,satchel:!1,beltPouches:!1,headscarf:!1,cuffs:Ge(i,.4),collar:!1,cape:!1,stripes:Ge(i,.3),skin:ut(i,Eg[e]),cloth:ut(i,nc),cloth2:ut(i,wg),accent:ut(i,nc),eye:ut(i,Rg),robe:Ge(i,.35)};return e==="human"?(n.height=Se(i,1.55,1.85),n.headSize=Se(i,.1,.115),n.shoulderW=Se(i,.17,.21),n.armLen=n.height*Se(i,.31,.34),n.belly=Se(i,.1,.7),n.hat=ut(i,["none","brim","cone","fez","brim","none"]),n.beard=Ge(i,.4)?Se(i,.4,1):0,n.earStyle="round"):e==="alien"?(n.height=Se(i,1.35,1.75),n.headSize=Se(i,.125,.15),n.shoulderW=Se(i,.14,.17),n.hipW=Se(i,.07,.09),n.armLen=n.height*Se(i,.34,.38),n.limbThick=Se(i,.028,.038),n.belly=Se(i,0,.3),n.antennae=Ge(i,.7),n.eyeCount=ut(i,[2,2,2,3]),n.eyeScale=Se(i,1.5,2.1),n.earStyle=Ge(i,.5)?"fin":"none",n.neckLen=Se(i,.055,.085),Ge(i,.25)&&(n.tailSegs=3,n.tailLen=Se(i,.3,.45))):e==="monster"?(n.height=Se(i,1.85,2.25),n.headSize=Se(i,.12,.14),n.shoulderW=Se(i,.24,.3),n.hipW=Se(i,.1,.13),n.armLen=n.height*Se(i,.34,.37),n.limbThick=Se(i,.06,.08),n.belly=Se(i,.4,.9),n.hunch=Se(i,.45,.85),n.eyeCount=Ge(i,.3)?1:2,n.eyeScale=n.eyeCount===1?1.9:Se(i,.9,1.2),n.snout=Se(i,.5,1),n.fangs=Ge(i,.8),n.earStyle="point",Ge(i,.55)&&(n.horns={style:ut(i,["straight","curved"]),size:Se(i,.7,1.2)}),Ge(i,.45)&&(n.tailSegs=4,n.tailLen=Se(i,.45,.7)),n.robe=Ge(i,.2)):e==="devil"&&(n.height=Se(i,1.6,1.95),n.headSize=Se(i,.105,.12),n.shoulderW=Se(i,.17,.2),n.armLen=n.height*Se(i,.32,.35),n.limbThick=Se(i,.036,.046),n.belly=Se(i,0,.35),n.eyeGlow=!0,n.eye=ut(i,Ag),n.snout=Se(i,.1,.35),n.fangs=Ge(i,.5),n.horns={style:ut(i,["curved","ram","straight"]),size:Se(i,.8,1.3)},n.earStyle="point",n.beard=Ge(i,.6)?Se(i,.5,1):0,n.tailSegs=4,n.tailLen=Se(i,.5,.75),n.tailSpade=!0,n.robe=Ge(i,.5)),e==="human"?(n.hat==="none"&&Ge(i,.28)&&(n.headscarf=!0),n.hairStyle=n.hat!=="none"||n.headscarf?ut(i,["ponytail","braids","none","none"]):ut(i,["bob","bun","ponytail","braids","topknot","none"]),n.earrings=Ge(i,.35),n.eyepatch=Ge(i,.08)):e==="alien"?(!n.antennae&&Ge(i,.55)&&(n.hairStyle="crest"),n.earrings=n.earStyle!=="none"&&Ge(i,.2),n.glasses=n.eyeCount===2&&Ge(i,.3)):e==="monster"?(Ge(i,.5)&&(n.hairStyle="mane"),n.earrings=Ge(i,.3),n.eyepatch=n.eyeCount===2&&Ge(i,.18),Ge(i,.4)&&(n.necklace="teeth"),n.hat==="none"&&Ge(i,.12)&&(n.headscarf=!0)):e==="devil"&&(n.hairStyle=ut(i,["none","none","topknot","bob"]),n.earrings=Ge(i,.6),Ge(i,.5)&&(n.necklace="pendant"),n.eyepatch=Ge(i,.1),n.cape=Ge(i,.35)),n.eyepatch&&(n.glasses=!1),n.necklace==="none"&&Ge(i,t==="vendor"?.45:.25)?n.necklace="pendant":n.necklace==="none"&&Ge(i,.35)&&(n.collar=!0),n.sash=Ge(i,t==="customer"?.25:.18),n.satchel=!n.sash&&Ge(i,t==="customer"?.45:t==="busker"?.3:.1),n.beltPouches=Ge(i,t==="vendor"?.6:.2),t==="vendor"&&!n.cape&&Ge(i,.2)&&(n.cape=!0),t==="busker"&&(n.sash=!0,n.satchel=!1,n.instrument=Ge(i,.5)?"drum":"flute",n.cloth=ut(i,[15116311,12735103,1613459]),n.hat=n.species==="human"?"cone":n.hat),t==="vendor"&&n.hat==="none"&&n.eyeCount!==3&&Ge(i,.5)&&(n.hat="fez"),n}const Pg=["human","human","alien","alien","monster","devil"],Lg={human:"Human",alien:"Alien",monster:"Monster",devil:"Devil"};function Ig(i){const e=i.height*(.44+i.legginess*.1),t=i.headSize*1.05,n=i.height-e-i.neckLen-t;if(n<.12)throw new Error(`rig: torso collapsed (height ${i.height}, hipY ${e})`);const s=i.hunch,r=[],a=(p,f,v,x,g)=>r.push({name:p,parent:f,pos:[v,x,g]});a("root",null,0,0,0),a("hips","root",0,e,0),a("spine01","hips",0,n*.34,s*.02),a("chest","spine01",0,n*.4,s*.05),a("neck","chest",0,n*.26,s*.03-.01),a("head","neck",0,i.neckLen,-s*.06+.008),a("headTop","head",0,t,-.005),a("jaw","head",0,-i.headSize*.28,i.headSize*.6),a("earL","head",i.headSize*.92,i.headSize*.2,-.01),a("earR","head",-i.headSize*.92,i.headSize*.2,-.01),i.antennae&&(a("antL0","head",i.headSize*.4,t*.92,0),a("antL1","antL0",i.headSize*.16,i.headSize*.55,-.01),a("antR0","head",-i.headSize*.4,t*.92,0),a("antR1","antR0",-i.headSize*.16,i.headSize*.55,-.01));const o=i.armLen*.52,l=i.armLen*.48;a("clavicleL","chest",i.shoulderW*.35,n*.2,s*.01),a("upperarmL","clavicleL",i.shoulderW*.65,n*.06,0),a("forearmL","upperarmL",.03,-o,0),a("handL","forearmL",.012,-l,.004),a("clavicleR","chest",-i.shoulderW*.35,n*.2,s*.01),a("upperarmR","clavicleR",-i.shoulderW*.65,n*.06,0),a("forearmR","upperarmR",-.03,-o,0),a("handR","forearmR",-.012,-l,.004);const h=.055,c=(e-h)*.52,u=(e-h)*.48;if(a("thighL","hips",i.hipW,-.02,0),a("shinL","thighL",0,-c,.012),a("footL","shinL",0,-u+.02,-.015),a("toeL","footL",0,-h+.015,i.footLen),a("thighR","hips",-i.hipW,-.02,0),a("shinR","thighR",0,-c,.012),a("footR","shinR",0,-u+.02,-.015),a("toeR","footR",0,-h+.015,i.footLen),i.tailSegs>0){const p=i.tailLen/i.tailSegs;a("tail0","hips",0,-.03,-i.hipW*.9);for(let f=1;f<i.tailSegs;f++)a(`tail${f}`,`tail${f-1}`,0,p*.12*(f-i.tailSegs/2),-p)}return r}function Dg(i){const e={},t=[];for(const n of i){const s=new ih;s.name=n.name,s.position.set(...n.pos),e[n.name]=s,t.push(s),n.parent&&e[n.parent].add(s)}return e.root.updateMatrixWorld(!0),{root:e.root,bones:t,byName:e,skeleton:new eo(t),boneNames:i.map(n=>n.name)}}function uh(i){const e={};for(const t of i){const n=new w(...t.pos);t.parent&&n.add(e[t.parent]),e[t.name]=n}return e}function Ug(i){const e=uh(i),t={},n={};for(const r of i)t[r.name]=[];for(const r of i)n[r.name]=r.parent,r.parent&&t[r.parent].push(r.name);const s={};for(const r of i){const a=e[r.name],o=t[r.name];let l;if(o.length){l=new w;for(const h of o)l.add(e[h]);l.divideScalar(o.length)}else{const h=n[r.name]?new w().subVectors(a,e[n[r.name]]).normalize():new w(0,1,0);l=new w().copy(a).addScaledVector(h,.05)}s[r.name]={a:a.clone(),b:l}}return{segs:s,rest:e,children:t,parent:n}}function Ng(i){const e=new Set(i.map(n=>n.name)),t=n=>n.filter(s=>e.has(s));return{torso:t(["hips","spine01","chest","neck","clavicleL","clavicleR","thighL","thighR"]),head:t(["head","headTop","neck","jaw"]),armL:t(["clavicleL","upperarmL","forearmL","handL","chest"]),armR:t(["clavicleR","upperarmR","forearmR","handR","chest"]),legL:t(["hips","thighL","shinL","footL","toeL"]),legR:t(["hips","thighR","shinR","footR","toeR"]),tail:t(["hips","tail0","tail1","tail2","tail3","tail4"])}}const Tr=new hn,fh=new w(0,1,0),mr=new w,Gi=new Ke;function Og(i,e,t=.05){Gi.setHex(e).convertSRGBToLinear();const n=i.attributes.position.count,s=new Float32Array(n*3);for(let r=0;r<n;r++){const a=1+(Bt(e+r*7)/4294967296*2-1)*t;s[r*3]=Math.min(1,Gi.r*a),s[r*3+1]=Math.min(1,Gi.g*a),s[r*3+2]=Math.min(1,Gi.b*a)}return i.setAttribute("color",new vt(s,3)),i}function yt(i,e,{scale:t,rot:n,quat:s}={}){return t&&i.scale(t[0],t[1],t[2]),n&&(n[0]&&i.rotateX(n[0]),n[1]&&i.rotateY(n[1]),n[2]&&i.rotateZ(n[2])),s&&i.applyQuaternion(s),e&&i.translate(e.x??e[0],e.y??e[1],e.z??e[2]),i}function lt(i,e,t={}){const n=new jt(e,t.w??10,t.h??8);return yt(n,i,t)}function on(i,e,t,n={}){mr.subVectors(e,i);const s=mr.length(),r=new Xi(t,Math.max(s,.001),3,n.w??8);return Tr.setFromUnitVectors(fh,mr.normalize()),r.applyQuaternion(Tr),r.translate((i.x+e.x)/2,(i.y+e.y)/2,(i.z+e.z)/2),r}function ln(i,e,t,n,s={}){const r=new vn(t,n,s.w??8);return r.translate(0,n/2,0),s.scale&&r.scale(...s.scale),Tr.setFromUnitVectors(fh,mr.copy(e).normalize()),r.applyQuaternion(Tr),r.translate(i.x,i.y,i.z),r}const Fg=2760728,Fi=15788752,ic=15720640,zg=6965802,rr=13934615,ar=5913122,sc=new Ke;function kg(i,e,t,n,s=0){Gi.setHex(e).convertSRGBToLinear(),sc.setHex(t).convertSRGBToLinear();const r=i.attributes.position,a=r.count,o=new Float32Array(a*3);for(let l=0;l<a;l++){const c=Math.floor((r.getY(l)-s)/n+.5)%2===0?Gi:sc,u=1+(Bt(e+l*7)/4294967296*2-1)*.04;o[l*3]=Math.min(1,c.r*u),o[l*3+1]=Math.min(1,c.g*u),o[l*3+2]=Math.min(1,c.b*u)}return i.setAttribute("color",new vt(o,3)),i}function Bg(i,e,t){const n=[],s=(_,M,L,S={})=>n.push({geometry:Og(_,M,S.jitter),material:S.material||"body",...L}),r=i.headSize,a=new w(e.head.x,e.head.y+r*.5,e.head.z+r*.05),o=i.hipW*1.35+i.shoulderW*.45,l=new w().lerpVectors(e.hips,e.chest,.42);l.z+=i.belly*.02;{const _=lt(l,o*(.92+i.belly*.3),{scale:[1,1.18,.82+i.belly*.22],w:12,h:9});i.stripes?n.push({geometry:kg(_,i.cloth,15720640,o*.62,l.y),material:"body",bones:t.torso}):s(_,i.cloth,{bones:t.torso})}s(lt(e.chest,i.shoulderW*.88,{scale:[1.06,.95,.72],w:12,h:9}),i.cloth,{bones:t.torso});for(const _ of["L","R"])s(lt(e["upperarm"+_],i.limbThick*1.45,{w:8,h:6}),i.cloth,{bones:t["arm"+_]});{const _=o*(.92+i.belly*.3),M=(e.hips.y+.015-l.y)/(_*1.18),L=_*Math.sqrt(Math.max(.25,1-M*M))+.012;s(yt(new Zt(L,.022,6,14),new w(e.hips.x,e.hips.y+.015,e.hips.z),{rot:[Math.PI/2,0,0],scale:[1,1,.85]}),i.accent,{bones:["hips","spine01"]})}if(i.robe){const _=e.shinL.y,M=new nt(o*.85,o*1.25,e.hips.y-_,10,2,!0);M.translate(0,(e.hips.y+_)/2,0),s(M,i.cloth,{bones:[...t.torso,"thighL","thighR"]})}if(i.role==="vendor"){const _=lt(new w(l.x,l.y-.02,l.z+o*(.62+i.belly*.2)),o*.72,{scale:[.95,1.35,.28],w:10,h:8});s(_,ic,{bones:["hips","spine01","chest"]})}s(on(e.neck,a,r*.32),i.skin,{bones:["neck","chest","head"]});const h=i.species==="alien"?[1.12,1.18,.95]:i.species==="monster"?[1.08,.92,1]:[.98,1.04,.95];if(s(lt(a,r,{scale:h,w:14,h:11}),i.skin,{bones:t.head,smooth:0}),i.snout>.05){const _=new w(a.x,a.y-r*.28,a.z+r*.62);s(lt(_,r*(.42+i.snout*.22),{scale:[.95,.72,1.1],w:10,h:8}),i.skin,{bones:t.head,smooth:0})}if(s(lt(new w(e.jaw.x,e.jaw.y,e.jaw.z+r*.05),r*.34,{scale:[1.05,.7,1],w:8,h:6}),i.skin,{bones:["jaw","head"],smooth:0}),s(lt(new w(e.jaw.x,e.jaw.y-r*.06,e.jaw.z+r*(.3+i.snout*.35)),r*.13,{scale:[1.5,.75,.6],w:6,h:5}),3350558,{rigid:"jaw",jitter:.02}),i.fangs)for(const _ of[-1,1])s(ln(new w(e.jaw.x+_*r*.3,e.jaw.y+r*.02,e.jaw.z+r*.28),new w(0,1,.15),r*.09,r*.3,{w:5}),Fi,{rigid:"jaw"});i.beard>0&&s(ln(new w(e.jaw.x,e.jaw.y+r*.05,e.jaw.z+r*.2),new w(0,-1,.35),r*.3,r*(.5+i.beard*.7),{w:7}),i.species==="devil"?2759194:10127990,{rigid:"jaw"});const c=r*.16*i.eyeScale,u=a.y+r*.1,p=(_,M)=>{const L=_/(r*h[0]),S=(M-a.y)/(r*h[1]),P=Math.sqrt(Math.max(.05,1-L*L-S*S));return a.z+r*h[2]*P},f=i.eyeCount===1?[[0,u+r*.06]]:i.eyeCount===3?[[-r*.42,u],[r*.42,u],[0,u+r*.45]]:[[-r*.4,u],[r*.4,u]],v=[];for(const[_,M]of f){const L=new w(a.x+_,M,p(_,M)+c*.55-c);v.push(L.clone()),i.eyeGlow?s(lt(L,c,{w:8,h:6}),i.eye,{rigid:"head",material:"glow",jitter:.02}):i.species==="alien"?(s(lt(L,c,{scale:[1,1.45,.55],rot:[0,0,_>0?-.25:.25],w:8,h:6}),1315882,{rigid:"head",jitter:.02}),s(lt(new w(L.x+c*.2,L.y+c*.45,L.z+c*.32),c*.16,{w:5,h:4}),16777215,{rigid:"head",material:"glow",jitter:0})):(s(lt(L,c,{w:8,h:6}),15920610,{rigid:"head",jitter:.02}),s(lt(new w(L.x,L.y,L.z+c*.62),c*.45,{w:6,h:5}),i.eye,{rigid:"head",jitter:.02}))}if(i.earStyle!=="none")for(const _ of["L","R"]){const M=_==="L"?1:-1,L=e["ear"+_];i.earStyle==="round"?s(lt(L,r*.24,{scale:[.55,1,.8],w:6,h:5}),i.skin,{rigid:"ear"+_}):i.earStyle==="point"?s(ln(L,new w(M,.85,-.2),r*.18,r*.62,{w:6}),i.skin,{rigid:"ear"+_}):s(ln(L,new w(M,1.1,-.35),r*.3,r*.9,{w:6,scale:[1,1,.35]}),i.skin,{rigid:"ear"+_})}if(i.horns){const _=i.horns.size;for(const M of[-1,1]){const L=new w(a.x+M*r*.5,a.y+r*.72,a.z-r*.1);if(i.horns.style==="straight")s(ln(L,new w(M*.45,1,-.1),r*.16,r*_,{w:7}),Fi,{rigid:"head"});else if(i.horns.style==="curved"){let S=L.clone(),P=new w(M*.5,1,0);for(let W=0;W<3;W++){const m=r*_*(.42-W*.09);s(ln(S,P,r*(.15-W*.04),m*1.35,{w:6}),Fi,{rigid:"head"}),S=S.clone().addScaledVector(P.clone().normalize(),m),P=new w(M*(.5-W*.25),1-W*.45,-.45-W*.25)}}else{const S=new Zt(r*.42*_,r*.13,6,10,Math.PI*1.35);yt(S,new w(a.x+M*r*.72,a.y+r*.4,a.z),{rot:[0,M*(Math.PI/2)*.92,Math.PI*.15]}),s(S,Fi,{rigid:"head"})}}}if(i.antennae&&e.antL0)for(const _ of["L","R"])s(on(e["ant"+_+"0"],e["ant"+_+"1"],r*.06),i.skin,{bones:["ant"+_+"0","ant"+_+"1"]}),s(lt(e["ant"+_+"1"],r*.14,{w:6,h:5}),11464928,{rigid:"ant"+_+"1",material:"glow",jitter:.02});const x=new w(a.x,e.headTop.y-r*.15,a.z-r*.05);if(i.hat==="cone")s(ln(x,new w(.12,1,-.08),r*.92,r*1.7,{w:9}),i.cloth2,{rigid:"head"});else if(i.hat==="brim"){const _=new nt(r*1.4,r*1.5,r*.08,12);s(yt(_,x),i.cloth2,{rigid:"head"});const M=new nt(r*.72,r*.8,r*.62,10);s(yt(M,new w(x.x,x.y+r*.32,x.z)),i.cloth2,{rigid:"head"})}else if(i.hat==="fez"){const _=new nt(r*.55,r*.68,r*.6,10);s(yt(_,new w(x.x,x.y+r*.22,x.z),{rot:[.08,0,.1]}),10496554,{rigid:"head"})}for(const _ of["L","R"]){s(on(e["upperarm"+_],e["forearm"+_],i.limbThick),i.skin,{bones:t["arm"+_]}),s(on(e["forearm"+_],e["hand"+_],i.limbThick*.85),i.skin,{bones:t["arm"+_]});const M=e["hand"+_];s(lt(new w(M.x,M.y-.025,M.z+.005),i.limbThick*1.45,{scale:[1,1.25,1.15],w:8,h:6}),i.skin,{bones:["hand"+_,"forearm"+_]})}const g=i.species==="monster"&&!i.robe?i.skin:i.cloth2;for(const _ of["L","R"]){s(on(e["thigh"+_],e["shin"+_],i.limbThick*1.35),g,{bones:t["leg"+_]}),s(on(e["shin"+_],e["foot"+_],i.limbThick*1.05),g,{bones:t["leg"+_]});const M=e["foot"+_],L=e["toe"+_],S=i.species==="monster"?i.skin:Fg;if(s(on(new w(M.x,L.y+.01,M.z-.03),new w(L.x,L.y,L.z),i.limbThick*1.2),S,{bones:["foot"+_,"toe"+_,"shin"+_]}),i.species==="monster")for(const P of[-1,0,1])s(ln(new w(L.x+P*i.limbThick*.7,L.y,L.z+.01),new w(P*.2,-.15,1),i.limbThick*.32,i.limbThick*1.1,{w:5}),Fi,{rigid:"toe"+_})}if(i.tailSegs>0&&e.tail0){for(let _=0;_<i.tailSegs-1;_++){const M=i.hipW*.38*(1-_/i.tailSegs);s(on(e[`tail${_}`],e[`tail${_+1}`],Math.max(M,.015)),i.skin,{bones:t.tail})}if(i.tailSpade){const _=e[`tail${i.tailSegs-1}`],M=new Ji(.055);yt(M,new w(_.x,_.y-.02,_.z-.04),{scale:[.5,1.2,1.2]}),s(M,i.skin,{rigid:`tail${i.tailSegs-1}`})}}if(i.hairStyle!=="none"){const _=i.hairColor,M=new w(a.x,a.y+r*.24,a.z-r*.26),L=()=>s(lt(M,r*1.02,{scale:[1.02,.85,.98],w:12,h:9}),_,{rigid:"head"});if(i.hairStyle==="bob")L();else if(i.hairStyle==="bun")L(),s(lt(new w(a.x,a.y+r*.95,a.z-r*.5),r*.34,{w:8,h:6}),_,{rigid:"head"});else if(i.hairStyle==="topknot")s(lt(new w(a.x,a.y+r*.55,a.z-r*.15),r*.72,{scale:[.9,.55,.9],w:10,h:7}),_,{rigid:"head"}),s(lt(new w(a.x,a.y+r*1.18,a.z-r*.28),r*.3,{scale:[1,1.4,1],w:7,h:6}),_,{rigid:"head"});else if(i.hairStyle==="ponytail")i.hat==="none"&&!i.headscarf&&L(),s(on(new w(a.x,a.y+r*.5,a.z-r*.8),new w(a.x,a.y-r*.9,a.z-r*1.2),r*.2),_,{rigid:"head"});else if(i.hairStyle==="braids"){i.hat==="none"&&!i.headscarf&&L();for(const S of[-1,1])s(on(new w(a.x+S*r*.78,a.y-r*.05,a.z+r*.1),new w(a.x+S*r*.92,a.y-r*1.45,a.z+r*.28),r*.13),_,{rigid:"head"}),s(lt(new w(a.x+S*r*.94,a.y-r*1.55,a.z+r*.3),r*.14,{w:6,h:5}),i.accent,{rigid:"head"})}else if(i.hairStyle==="mane")for(let S=0;S<4;S++){const P=S/3;s(ln(new w(a.x,a.y+r*(.85-P*.9),a.z-r*(.1+P*.85)),new w(0,1-P*.7,-.35-P*.5),r*(.3-P*.05),r*(.75-P*.12),{w:6}),_,{rigid:"head"})}else i.hairStyle==="crest"&&s(ln(new w(a.x,a.y+r*.8,a.z-r*.05),new w(0,1,-.3),r*.55,r*1,{w:7,scale:[.28,1,1]}),i.accent,{rigid:"head"})}if(i.headscarf&&(s(lt(new w(a.x,a.y+r*.42,a.z-r*.06),r*1.06,{scale:[1.03,.62,1.05],w:12,h:8}),i.accent,{rigid:"head"}),s(lt(new w(a.x,a.y+r*.32,a.z-r*1.02),r*.26,{w:6,h:5}),i.accent,{rigid:"head"})),i.earrings&&i.earStyle!=="none")for(const _ of["L","R"]){const M=e["ear"+_],L=new Zt(r*.14,r*.035,5,10);yt(L,new w(M.x,M.y-r*.22,M.z+r*.02),{rot:[0,Math.PI/2,0]}),s(L,rr,{rigid:"ear"+_,jitter:.02})}if(i.glasses&&v.length===2){for(const M of v){const L=new Zt(c*1.2,c*.14,5,12);yt(L,new w(M.x,M.y,M.z+c*.75)),s(L,rr,{rigid:"head",jitter:.02})}const _=new nt(c*.1,c*.1,Math.abs(v[0].x-v[1].x)-c*1.6,5);yt(_,new w(a.x,v[0].y+c*.3,v[0].z+c*.75),{rot:[0,0,Math.PI/2]}),s(_,rr,{rigid:"head",jitter:.02})}if(i.eyepatch&&v.length>=2){const _=v[0];s(lt(new w(_.x,_.y,_.z+c*.45),c*1.25,{scale:[1,1,.32],w:8,h:6}),1709330,{rigid:"head",jitter:.02});const M=new Zt(r*1.1,r*.045,4,16);yt(M,new w(a.x,_.y+r*.12,a.z),{rot:[Math.PI/2-.18,0,-.22]}),s(M,1709330,{rigid:"head",jitter:.02})}if(i.necklace!=="none"){const _=e.neck.y-.015,M=i.shoulderW*.55,L=new Zt(M,.011,4,16);yt(L,new w(0,_,.01),{rot:[Math.PI/2+.28,0,0]}),s(L,i.necklace==="teeth"?ar:rr,{bones:["neck","chest"],jitter:.02});const S=_-M*.42,P=i.shoulderW*.84,W=i.shoulderW*.63,m=(S-e.chest.y)/P,y=e.chest.z+W*Math.sqrt(Math.max(.1,1-m*m))+.02;if(i.necklace==="teeth")for(const U of[-1,0,1])s(ln(new w(U*M*.42,S+.012,y-Math.abs(U)*.012),new w(0,-1,.12),.014,.05,{w:5}),Fi,{bones:["neck","chest"]});else{const U=new Ji(.028);yt(U,new w(0,S,y),{scale:[1,1.3,.7]}),s(U,i.species==="devil"?12597547:i.accent,{bones:["neck","chest"],jitter:.02})}}else if(i.collar){const _=new Zt(i.shoulderW*.5,.02,5,14);yt(_,new w(0,e.neck.y+.005,.005),{rot:[Math.PI/2,0,0],scale:[1,1,.9]}),s(_,i.cloth2,{bones:["neck","chest"]})}const d=o*(1.04+i.belly*.34);if(i.sash){const _=new Zt(d*.96,.028,5,18);_.rotateX(Math.PI/2),_.rotateZ(.42),_.translate(l.x,l.y+o*.3,l.z),s(_,i.accent,{bones:t.torso})}if(i.satchel){const _=new Zt(d*.94,.016,4,18);_.rotateX(Math.PI/2),_.rotateZ(-.42),_.translate(l.x,l.y+o*.32,l.z),s(_,ar,{bones:t.torso});const M=new et(.17,.15,.08);yt(M,new w(o*.95,e.hips.y+.03,-.03),{rot:[0,.15,.08]}),s(M,ar,{bones:["hips","spine01"]}),s(lt(new w(o*.95,e.hips.y+.1,-.03),.045,{scale:[1.6,.5,1.1],w:6,h:4}),i.cloth2,{bones:["hips","spine01"]})}if(i.beltPouches)for(const _ of[-.55,.5])s(lt(new w(o*_,e.hips.y-.02,o*(.72+i.belly*.2)),.042,{scale:[1,1.25,.8],w:6,h:5}),ar,{bones:["hips","spine01"]});if(i.cape){const _=e.chest.y-e.hips.y+.16,M=new vn(o*1.35,_,9,1,!0,Math.PI/2,Math.PI);M.translate(0,-_/2,0),yt(M,new w(0,e.neck.y+.02,-.02),{rot:[-.12,0,0]}),s(M,i.species==="devil"?2756640:i.cloth2,{bones:["chest","spine01","hips"]})}if(i.cuffs)for(const _ of["L","R"]){const M=e["hand"+_],L=new Zt(i.limbThick*1.12,.013,4,10);yt(L,new w(M.x,M.y+.035,M.z),{rot:[Math.PI/2,0,0]}),s(L,i.cloth2,{bones:["hand"+_,"forearm"+_]})}const b=Gg(i,e);if((b==null?void 0:b.kind)==="drum"){const _=b.center,M=new nt(.15,.13,.17,12);s(yt(M,_,{rot:[.15,0,0]}),zg,{rigid:"chest"});const L=new nt(.145,.145,.02,12);s(yt(L,new w(b.top.x,b.top.y-.01,b.top.z),{rot:[.15,0,0]}),ic,{rigid:"chest"})}else(b==null?void 0:b.kind)==="flute"&&s(on(b.mouth,b.foot,.013,{w:6}),3811864,{rigid:"head"});return n}function Gg(i,e){if(!i.instrument)return null;const t=i.hipW*1.35+i.shoulderW*.45,n=new w().lerpVectors(e.hips,e.chest,.42);if(n.z+=i.belly*.02,i.instrument==="drum"){const l=new w(n.x,n.y+.05,n.z+t*1.15);return{kind:"drum",bone:"chest",center:l,top:new w(l.x,l.y+.1,l.z+.012)}}const s=i.headSize,r=new w(e.head.x,e.head.y+s*.5,e.head.z+s*.05),a=new w(r.x,r.y-s*.38,r.z+s*.88),o=new w(a.x-.26,a.y-.13,a.z+.09);return{kind:"flute",bone:"head",mouth:a,foot:o}}function Ar(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new It;let h=0;for(let c=0;c<i.length;++c){const u=i[c];let p=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". The geometry must have either an index or a position attribute"),null;l.addGroup(h,f,c),h+=f}}if(t){let c=0;const u=[];for(let p=0;p<i.length;++p){const f=i[p].index;for(let v=0;v<f.count;++v)u.push(f.getX(v)+c);c+=i[p].attributes.position.count}l.setIndex(u)}for(const c in r){const u=rc(r[c]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" attribute."),null;l.setAttribute(c,u)}for(const c in a){const u=a[c][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[c]=[];for(let p=0;p<u;++p){const f=[];for(let x=0;x<a[c].length;++x)f.push(a[c][x][p]);const v=rc(f);if(!v)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" morphAttribute."),null;l.morphAttributes[c].push(v)}}return l}function rc(i){let e,t,n,s=-1,r=0;for(let h=0;h<i.length;++h){const c=i[h];if(c.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(e===void 0&&(e=c.array.constructor),e!==c.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=c.itemSize),t!==c.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=c.normalized),n!==c.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=c.gpuType),s!==c.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=c.array.length}const a=new e(r);let o=0;for(let h=0;h<i.length;++h)a.set(i[h].array,o),o+=i[h].array.length;const l=new vt(a,t,n);return s!==void 0&&(l.gpuType=s),l}const or=new w,lr=new w,ac=new w;function Hg(i,e,t,n,s){lr.subVectors(s,n),ac.set(i-n.x,e-n.y,t-n.z);const r=lr.lengthSq(),a=r>1e-12?br.clamp(ac.dot(lr)/r,0,1):0;or.copy(n).addScaledVector(lr,a);const o=or.x-i,l=or.y-e,h=or.z-t;return o*o+l*l+h*h}function Vg(i){const e=i,t=["position","normal","color"];for(const n of Object.keys(e.attributes))t.includes(n)||e.deleteAttribute(n);if(!e.attributes.color){const n=e.attributes.position.count;e.setAttribute("color",new vt(new Float32Array(n*3).fill(1),3))}if(!e.index){const n=e.attributes.position.count,s=new Uint32Array(n);for(let r=0;r<n;r++)s[r]=r;e.setIndex(new vt(s,1))}return e}function Wg(i,{boneNames:e,segments:t}){const n=Object.fromEntries(e.map((v,x)=>[v,x])),s=new Map;for(const v of i){if(!v||!v.geometry)continue;const x=v.material||"body";s.has(x)||s.set(x,[]),s.get(x).push(v)}const r=[...s.keys()],a=[],o=[];let l=0;for(const v of r){const x=[];for(const d of s.get(v)){const b=Vg(d.geometry);a.push({part:d,start:l,count:b.attributes.position.count}),l+=b.attributes.position.count,x.push(b)}const g=x.length===1?x[0]:Ar(x);if(!g)throw new Error(`skinning: failed to merge group "${v}"`);o.push(g)}const h=o.length===1?o[0]:Ar(o,!0);if(!h)throw new Error("skinning: failed to merge material groups");o.length===1&&h.addGroup(0,1/0,0);const c=h.attributes.position.count,u=h.attributes.position.array,p=new Uint16Array(c*4),f=new Float32Array(c*4);for(const{part:v,start:x,count:g}of a){if(v.rigid){const m=n[v.rigid];if(m===void 0)throw new Error(`skinning: unknown rigid bone "${v.rigid}"`);for(let y=0;y<g;y++)p[(x+y)*4]=m,f[(x+y)*4]=1;continue}const d=v.bones||e,b=[],_=[];for(const m of d){const y=t[m];if(!y)throw new Error(`skinning: no segment for bone "${m}"`);b.push(y),_.push(n[m])}const M=b.length,L=v.falloff??4,S=new Float32Array(g*M),P=new Float32Array(M);for(let m=0;m<g;m++){const y=u[(x+m)*3],U=u[(x+m)*3+1],k=u[(x+m)*3+2];let K=1/0;for(let G=0;G<M;G++)P[G]=Hg(y,U,k,b[G].a,b[G].b),P[G]<K&&(K=P[G]);const N=K*10.5+1e-6;let B=0;for(let G=0;G<M;G++){if(P[G]>N)continue;const Y=1/Math.pow(Math.sqrt(P[G])+1e-4,L);S[m*M+G]=Y,B+=Y}if(B>0)for(let G=0;G<M;G++)S[m*M+G]/=B;else S[m*M]=1}const W=v.smooth??1;if(W>0&&g>0){const y=new Map,U=(B,G,Y)=>B*73856093^G*19349663^Y*83492791;for(let B=0;B<g;B++){const G=U(Math.floor(u[(x+B)*3]/.045),Math.floor(u[(x+B)*3+1]/.045),Math.floor(u[(x+B)*3+2]/.045));let Y=y.get(G);Y||y.set(G,Y=[]),Y.push(B)}const k=.045*.045;let K=S,N=new Float32Array(g*M);for(let B=0;B<W;B++){N.fill(0);for(let Y=0;Y<g;Y++){const te=u[(x+Y)*3],J=u[(x+Y)*3+1],j=u[(x+Y)*3+2],F=Math.floor(te/.045),R=Math.floor(J/.045),I=Math.floor(j/.045);for(let D=-1;D<=1;D++)for(let V=-1;V<=1;V++)for(let $=-1;$<=1;$++){const ne=y.get(U(F+$,R+V,I+D));if(ne)for(const le of ne){const ce=u[(x+le)*3]-te,xe=u[(x+le)*3+1]-J,H=u[(x+le)*3+2]-j;if(!(ce*ce+xe*xe+H*H>k))for(let Ne=0;Ne<M;Ne++)N[Y*M+Ne]+=K[le*M+Ne]}}let C=0;for(let D=0;D<M;D++)C+=N[Y*M+D];if(C>0)for(let D=0;D<M;D++)N[Y*M+D]/=C;else for(let D=0;D<M;D++)N[Y*M+D]=K[Y*M+D]}const G=K;K=N,N=G===S?new Float32Array(g*M):G}K!==S&&S.set(K)}for(let m=0;m<g;m++){const y=m*M;let U=-1,k=-1,K=-1,N=-1,B=0,G=0,Y=0,te=0;for(let F=0;F<M;F++){const R=S[y+F];R<=0||(R>B?(te=Y,N=K,Y=G,K=k,G=B,k=U,B=R,U=F):R>G?(te=Y,N=K,Y=G,K=k,G=R,k=F):R>Y?(te=Y,N=K,Y=R,K=F):R>te&&(te=R,N=F))}const J=B+G+Y+te||1,j=(x+m)*4;p[j]=U>=0?_[U]:0,p[j+1]=k>=0?_[k]:0,p[j+2]=K>=0?_[K]:0,p[j+3]=N>=0?_[N]:0,f[j]=B/J,f[j+1]=G/J,f[j+2]=Y/J,f[j+3]=te/J}}return h.setAttribute("skinIndex",new vt(p,4)),h.setAttribute("skinWeight",new vt(f,4)),h.computeBoundingSphere(),h.computeBoundingBox(),{geometry:h,materials:r}}const ao=new w(1,0,0),oo=new w(0,1,0),dh=new w(0,0,1),nn=new hn,cr=new hn;function it(i,e,t=0,n=0){i&&(i.quaternion.setFromAxisAngle(ao,e),t&&(nn.setFromAxisAngle(oo,t),i.quaternion.premultiply(nn)),n&&(nn.setFromAxisAngle(dh,n),i.quaternion.premultiply(nn)))}function Ue(i,e,t,n=0,s=0){!i||e<=0||(cr.setFromAxisAngle(ao,t),n&&(nn.setFromAxisAngle(oo,n),cr.premultiply(nn)),s&&(nn.setFromAxisAngle(dh,s),cr.premultiply(nn)),i.quaternion.slerp(cr,e))}function Xg(i,e){const t=i.byName,n=Bt(Math.floor(e.height*1e3)+e.skin)/4294967296*100,s=t.hips.position.y,r=Math.max(s*.75,.3),a=t.hips.position.y;let o=n%(Math.PI*2),l="none",h=0,c=0,u=0,p=0;const f=e.hunch;function v(x,g,d){const b=d.speed||0,_=Math.min(b/.9,1);o+=Math.PI*2*b/r*g;const M=x*.9+n;d.gesture!==l?(l=d.gesture||"none",c=0):c+=g,h+=((l==="none"?0:1)-h)*Math.min(1,g*7);const S=h,P=Math.sin(o),W=Math.sin(o+Math.PI),m=.52*_,y=Math.sin(M*.85)*.02,U=Math.sin(M*.5)*.02*(1-_);t.hips.position.y=a-Math.abs(Math.sin(o))*.028*_*s+y*.15,it(t.hips,.04*_,Math.sin(o)*.06*_,U+Math.sin(o)*.04*_);const k=Math.max(0,Math.sin(o+Math.PI*.6))*.95*_,K=Math.max(0,Math.sin(o+Math.PI*1.6))*.95*_;it(t.thighL,-m*P+.02,0,.02),it(t.thighR,-m*W+.02,0,-.02),it(t.shinL,k),it(t.shinR,K),it(t.footL,m*P*.55-k*.75),it(t.footR,m*W*.55-K*.75),it(t.toeL,Math.max(0,-Math.sin(o))*.25*_),it(t.toeR,Math.max(0,-Math.sin(o+Math.PI))*.25*_),it(t.spine01,f*.22+.03*_+y*.4,-Math.sin(o)*.05*_,0),it(t.chest,f*.3+y,-Math.sin(o)*.07*_,0),it(t.neck,-f*.2,0,0);const N=.45*_;it(t.clavicleL,0,0,.04),it(t.clavicleR,0,0,-.04),it(t.upperarmL,N*W+Math.sin(M*.7)*.03,0,.1+U),it(t.upperarmR,N*P+Math.cos(M*.8)*.03,0,-.1-U),it(t.forearmL,-.18-Math.max(0,N*W)*.5),it(t.forearmR,-.18-Math.max(0,N*P)*.5),it(t.handL,-.05),it(t.handR,-.05);const B=(1-_)*Math.sin(M*.35)*.25;if(it(t.head,-f*.28+Math.sin(M*.6)*.03,B,0),t.tail0){const J=Math.sin(M*1.1)*.18+Math.sin(o)*.12*_;for(let j=0;j<5;j++){const F=t["tail"+j];if(!F)break;it(F,-.06,J*(.5+j*.35),0)}}if(t.earL&&(it(t.earL,0,0,Math.sin(M*2.1)*.06+_*Math.sin(o*2)*.05),it(t.earR,0,0,-Math.sin(M*2.3)*.06-_*Math.sin(o*2)*.05)),t.antL0&&(it(t.antL0,Math.sin(M*1.7)*.1-_*.15,0,.1+Math.sin(M*1.3)*.08),it(t.antL1,Math.sin(M*1.9)*.15,0,.12),it(t.antR0,Math.sin(M*1.8)*.1-_*.15,0,-.1-Math.sin(M*1.4)*.08),it(t.antR1,Math.sin(M*2)*.15,0,-.12)),S>.001){const J=l,j=c;if(J==="talk"){const F=Math.sin(j*5.2),R=Math.sin(j*4.1+1.7);Ue(t.upperarmR,S,-.55+F*.12,0,-.28),Ue(t.forearmR,S,-1.5+F*.3,.25*R,0),Ue(t.upperarmL,S*.7,-.25+R*.1,0,.18),Ue(t.forearmL,S*.7,-.9+R*.25),Ue(t.head,S*.5,.05+F*.04,u*.5,0)}else if(J==="offer")Ue(t.upperarmR,S,-1.05,-.15,-.1),Ue(t.forearmR,S,-.35,0,.35),Ue(t.handR,S,-.3),Ue(t.chest,S*.4,f*.3+.08);else if(J==="refuse"){const F=Math.sin(j*6.5)*.32;Ue(t.head,S,-f*.28,F,0),Ue(t.upperarmR,S,-.5,0,-.55),Ue(t.forearmR,S,-1.15,0,-.6),Ue(t.upperarmL,S,-.5,0,.55),Ue(t.forearmL,S,-1.15,0,.6)}else if(J==="agree"){const F=Math.abs(Math.sin(j*4.5))*.3;Ue(t.head,S,-f*.28+F,0,0),Ue(t.upperarmR,S,-.95,-.2,0),Ue(t.forearmR,S,-.5+Math.sin(j*4.5)*.12)}else if(J==="angry"){const F=Math.sin(j*9)*.1;Ue(t.upperarmL,S,-1.2+F,0,.9),Ue(t.upperarmR,S,-1.2-F,0,-.9),Ue(t.forearmL,S,-2),Ue(t.forearmR,S,-2),Ue(t.chest,S,f*.3+.14,0,0),Ue(t.head,S,.12+F*.5,0,0)}else if(J==="browse")Ue(t.upperarmR,S,-.75,-.35,0),Ue(t.forearmR,S,-1.95,.2,0),Ue(t.head,S,.28,u*.4,.06),Ue(t.spine01,S*.5,f*.22+.1);else if(J==="wave"){const F=Math.sin(j*7);Ue(t.upperarmR,S,-.4,0,-2.45),Ue(t.forearmR,S,-.5,0,-.4+F*.45),Ue(t.head,S*.4,-.08,0,0)}else if(J==="bow")Ue(t.spine01,S,f*.22+.5),Ue(t.chest,S,f*.3+.25),Ue(t.head,S,.15),Ue(t.upperarmR,S,-.35,0,-.3),Ue(t.upperarmL,S,.25,0,.4);else if(J==="drum"){const F=Math.sin(j*8.5),R=Math.sin(j*8.5+Math.PI),I=.62+Math.max(0,e.armLen-.55)*.6,C=-.28-e.belly*.1;Ue(t.upperarmL,S,C,.15,-I),Ue(t.upperarmR,S,C,-.15,I),Ue(t.forearmL,S,-1.35+Math.max(0,F)*.5),Ue(t.forearmR,S,-1.35+Math.max(0,R)*.5),Ue(t.head,S*.6,.05+F*.05,0,Math.sin(j*2.1)*.12)}else if(J==="flute")Ue(t.upperarmR,S,-.95,-.55,-.25),Ue(t.forearmR,S,-2.05,0,-.35),Ue(t.upperarmL,S,-.85,.55,.25),Ue(t.forearmL,S,-2.15,0,.35),Ue(t.chest,S*.5,f*.3,0,Math.sin(j*1.7)*.08),Ue(t.head,S,.12,0,Math.sin(j*1.9)*.06);else if(J==="clap"){const F=Math.abs(Math.sin(j*6));Ue(t.upperarmL,S,-.85,-.5*F,.3),Ue(t.upperarmR,S,-.85,.5*F,-.3),Ue(t.forearmL,S,-1.35),Ue(t.forearmR,S,-1.35),Ue(t.head,S*.4,-.05,0,Math.sin(j*3)*.08)}}const G=br.clamp(d.lookYaw??0,-1.1,1.1),Y=br.clamp(d.lookPitch??0,-.5,.6);u+=(G-u)*Math.min(1,g*6),p+=(Y-p)*Math.min(1,g*6),(Math.abs(u)>.01||Math.abs(p)>.01)&&(nn.setFromAxisAngle(oo,u),t.head.quaternion.premultiply(nn),nn.setFromAxisAngle(ao,p),t.head.quaternion.premultiply(nn));const te=d.speaking?Math.max(0,Math.sin(x*11+n))*.3+.05:0;it(t.jaw,te)}return{update:v,get phase(){return o}}}const qg=new lh({vertexColors:!0,roughness:.85}),Yg=new ci({vertexColors:!0}),jg=new ci({color:0,transparent:!0,opacity:.32,depthWrite:!1}),$g=new Rn(1,20).rotateX(-Math.PI/2);function Kg({seed:i,species:e,role:t}){const n=mn(i),s=Cg(n,e,t),r=Ig(s),a=Dg(r),o=uh(r),{segs:l}=Ug(r),h=Ng(r),c=Bg(s,o,h),{geometry:u,materials:p}=Wg(c,{boneNames:a.boneNames,segments:l}),f=new K0(u,p.map(d=>d==="glow"?Yg:qg));f.add(a.root),f.updateMatrixWorld(!0),f.bind(a.skeleton,f.matrixWorld),f.frustumCulled=!1;const v=new Bi;v.add(f);const x=new Lt($g,jg);x.scale.setScalar(s.shoulderW*1.9),x.position.y=.012,x.renderOrder=1,v.add(x);const g=Xg(a,s);return{group:v,mesh:f,rig:a,appearance:s,animator:g,defs:r,parts:c}}const Zg={human:{a:["Se","Mi","Ta","Jo","Ru","Al","Be","Ka","Fen","Or"],b:["ra","fa","rin","mal","dan","sha","lo","ver","na","bel"]},alien:{a:["Zx'","Vr'","Xel","Qui","Ilx","Th'","Zzi","Oorv"],b:["eek","ilith","oon","ax","ubi","esh","arn","ptic"]},monster:{a:["Grub","Thok","Marg","Bruk","Snag","Hurl","Dreg","Gnash"],b:["bins","ka","oth","nar","tusk","maw","gut","jaw"]},devil:{a:["Mala","Bez","Vex","Aszh","Cro","Nihil","Mor","Sar"],b:["chor","reth","ius","avel","goth","issa","dane","quel"]}},Jg={human:["walked here from the salt flats with one boot","jumped ship from a spice freighter and never looked back","was born under this very awning during the Long Eclipse","used to keep the ledgers for a duke who is now a toad"],alien:["crash-landed in the fountain three seasons ago and stayed for the smells","is saving up for a return ticket to a moon that no longer exists","reads four currencies at once and dreams in a fifth","molted last spring and sold the old shell at a shameful discount"],monster:["was banned from two other markets for enthusiastic sneezing","once guarded a bridge, but the tolls dried up","ate the previous owner of this pitch (a misunderstanding)","sharpened teeth on shipwrecks before going respectable"],devil:["is on sabbatical from the Third Circle collections office","holds the notarised deed to at least one patron soul here","retired from cursing after the guild dues got absurd","came up through contract law and it shows"]},Qg=["counts change twice, loudly","claims every item once belonged to a minor king","hums when a deal is going well","keeps a lucky coin nailed to the counter","will not trade during moonrise","smells lies (allegedly)","names every coin before spending it","collects arguments the way others collect stamps","tips buskers only in prime numbers","insists the fountain whispers market tips"],e_=["off-shift dock hauler","apprentice moth-wrangler","retired sky-ferry pilot","fountain-cleaner third class","freelance rumor courier","night-soil alchemist","assistant to a sleeping wizard","union bell-ringer","map-seller between maps","chaperone of caravan cats"];function Aa(i){const e=[];return i.greed>.66?e.push("drive a merciless bargain"):i.greed<.33&&e.push("barely care about the coin"),i.patience>.66?e.push("will haggle until the moons set"):i.patience<.33&&e.push("walk away fast"),i.charm>.66&&e.push("could sell fog to a cloud"),i.temper>.66&&e.push("flare up when lowballed"),e.length?e.join(", "):"are, by bazaar standards, reasonable"}function t_(i,{species:e,role:t,goodIds:n=[]}){const s=Zg[e];let r=ut(i,s.a)+ut(i,s.b);e==="human"&&Ge(i,.3)&&(r=ut(i,["Old ","Young ","Honest "])+r);const a={human:{greed:0,patience:0,charm:.05,temper:0},alien:{greed:-.05,patience:.15,charm:0,temper:-.1},monster:{greed:0,patience:-.15,charm:-.1,temper:.25},devil:{greed:.2,patience:.1,charm:.15,temper:.05}}[e],o={greed:Xt(Se(i,.15,.85)+a.greed+(t==="vendor"?.1:0)),patience:Xt(Se(i,.15,.85)+a.patience),charm:Xt(Se(i,.15,.85)+a.charm),temper:Xt(Se(i,.15,.85)+a.temper)},l=Xt(Se(i,.1,.9)+(t==="vendor"?.15:0)+(e==="devil"?.1:0));let h;t==="vendor"?h=`${_n(n[0]).name} monger`:t==="busker"?h="street musician":h=ut(i,e_);const c=ut(i,Jg[e]),u=ut(i,Qg),p=t==="vendor"?`Now they hawk ${n.map(v=>_n(v).name.toLowerCase()).join(" and ")} and ${Aa(o)}.`:t==="busker"?`Now they play for coins and ${Aa(o)}.`:`By day ${/^[aeiou]/i.test(h)?"an":"a"} ${h}; at the stalls they ${Aa(o)}.`,f=`${r} ${c}. ${p} ${r} ${u}.`;return{name:r,title:h,backstory:f,attrs:o,wealth:l,quirk:u}}const ct=i=>new Ke(i).convertSRGBToLinear(),gr=[12597547,15116311,1613459,8212414,12735103],Ae={timber:ct(4862496),timberDark:ct(3547919),cream:ct(15720640),groundA:ct(9067068),groundB:ct(7030064),stone:ct(6971224),stoneDark:ct(4998206),skyHorizon:ct(1314856),skyZenith:ct(394511),moonAmber:ct(15774810),moonTeal:ct(8377544),bulbWarm:ct(16765562),flameCore:ct(16770720),flameTip:ct(16742954),ember:ct(16751164),water:ct(3051398),sack:ct(11573866),barrel:ct(5914672),iron:ct(2894896)},An=gr.map(ct),ps=new Ke,St=new w,oc=new Ts,lc=new hn,cc=new w,n_=new w(0,0,0),i_=new w(0,1,0);function _t({x:i=0,y:e=0,z:t=0,rx:n=0,ry:s=0,rz:r=0,sx:a=1,sy:o,sz:l}={}){return oc.set(n,s,r,"XYZ"),lc.setFromEuler(oc),St.set(i,e,t),cc.set(a,o===void 0?a:o,l===void 0?a:l),new Xe().compose(St,lc,cc)}function ds(i,e,t,n=!0){let s=i.index?i.toNonIndexed():i;e&&s.applyMatrix4(e);for(const o of Object.keys(s.attributes))o!=="position"&&(o==="normal"&&n||s.deleteAttribute(o));const r=s.getAttribute("position"),a=new Float32Array(r.count*3);if(typeof t=="function")for(let o=0;o<r.count;o++)t(r.getX(o),r.getY(o),r.getZ(o),ps),a[o*3]=ps.r,a[o*3+1]=ps.g,a[o*3+2]=ps.b;else for(let o=0;o<r.count;o++)a[o*3]=t.r,a[o*3+1]=t.g,a[o*3+2]=t.b;return s.setAttribute("color",new vt(a,3)),s}function ph(i,e,t,n,s,r,a,o=1){r(new et(.2*o,.03*o,.2*o),i({x:e,y:t-.12*o,z:n}),Ae.iron),r(new et(.2*o,.03*o,.2*o),i({x:e,y:t+.12*o,z:n}),Ae.iron);for(const l of[-1,1])for(const h of[-1,1])r(new et(.025*o,.24*o,.025*o),i({x:e+l*.085*o,y:t,z:n+h*.085*o}),Ae.iron);a(new et(.13*o,.2*o,.13*o),i({x:e,y:t,z:n}),s),r(new vn(.17*o,.12*o,4),i({x:e,y:t+.19*o,z:n,ry:Math.PI/4}),Ae.iron)}function hr(i){const e=new Xe().lookAt(n_,i,i_);return e.setPosition(i),e}function s_({seed:i,goods:e,stallGoods:t}){const n=new Bi;n.name="bazaar-world";const s=[],r=[],a=(C,D,V)=>s.push(ds(C,D,V,!0)),o=(C,D,V)=>r.push(ds(C,D,V,!1)),l=new lh({vertexColors:!0,roughness:.85}),h=new ci({vertexColors:!0}),c=[],u=[],p=[],f=[],v=t.length,x=new Map((e||[]).map(C=>[C.id,C])),g=C=>x.get(C)||_n(C),d=mn(Bt(i^2654435769)),b=mn(Bt(i^1374496523)),_=mn(Bt(i^625341585));{const D=new jt(80,36,18,0,Math.PI*2,0,Math.PI*.62);D.scale(-1,1,1),o(D,null,(me,He,Pe,T)=>{const E=Pn(He/80,-.2,1);T.copy(Ae.skyHorizon).lerp(Ae.skyZenith,sr(.02,.6,E)),E<.02&&T.multiplyScalar(.8)});const V=ct(14673663),$=ct(16771528);for(let me=0;me<300;me++){const He=b()*Math.PI*2,Pe=.14+Math.pow(b(),.75)*1.27,T=78,E=new w(Math.sin(He)*Math.cos(Pe)*T,Math.sin(Pe)*T,Math.cos(He)*Math.cos(Pe)*T),X=.28+b()*.5,re=hr(E).multiply(_t({sx:X,sy:X,sz:1})),se=ps.copy(b()<.22?$:V).multiplyScalar(.65+b()*.5).clone();o(new Lr(1,1),re,se)}const ne=Math.PI*1.25+(b()-.5)*.8,le=.17+b()*.08,ce=new w(Math.sin(ne)*Math.cos(le)*76,Math.sin(le)*76,Math.cos(ne)*Math.cos(le)*76);o(new Rn(6.4,28),hr(ce),(me,He,Pe,T)=>{const E=Math.sqrt((me-ce.x)**2+(He-ce.y)**2+(Pe-ce.z)**2);T.copy(Ae.moonAmber).multiplyScalar(1.05-sr(0,6.4,E)*.35)}),o(new Rn(8.6,28),hr(ce.clone().multiplyScalar(1.02)),Ae.moonAmber.clone().multiplyScalar(.22));const xe=ne+Math.PI*(.65+b()*.5),H=.75+b()*.35,Ne=new w(Math.sin(xe)*Math.cos(H)*77,Math.sin(H)*77,Math.cos(xe)*Math.cos(H)*77);o(new Rn(2.2,20),hr(Ne),Ae.moonTeal);const de=new pg(5919872,3811872,.9);n.add(de);const Me=new hh(16767392,1.15);Me.position.copy(ce).normalize().multiplyScalar(30),n.add(Me),n.add(Me.target)}const M=17,L=11,S=d()*Math.PI*2,P=d()*Math.PI*2,W=Math.floor(d()*5),m=[];for(let C=0;C<v;C++){const D=mn(Bt(i^334353+C*7919)),V=S+C/v*Math.PI*2+(D()-.5)*.05,$=L+(D()-.5)*1.2;m.push({rngS:D,theta:V,sr:$,px:Math.sin(V)*$,pz:Math.cos(V)*$,yaw:V+Math.PI})}const y=5,U=[];for(let C=0;C<y;C++){const D=S+Math.PI/v+C/y*Math.PI*2;U.push({a:D,px:Math.sin(D)*7.8,pz:Math.cos(D)*7.8})}const k=[0,Math.PI].map(C=>{const D=P+C;return{x:Math.sin(D)*3.9,z:Math.cos(D)*3.9,a:D}}),K=[{x:0,z:0,s:3.6,k:.5}];for(const C of k)K.push({x:C.x,z:C.z,s:2.2,k:.85});for(const C of U)K.push({x:C.px,z:C.pz,s:2.6,k:.8});for(const C of m)K.push({x:C.px+Math.sin(C.yaw)*1.7,z:C.pz+Math.cos(C.yaw)*1.7,s:2.4,k:.75});const N=ct(13664320);{const $=[];for(let H=0;H<=28;H++){const Ne=H/28*24;for(let de=0;de<88;de++){const Me=de/88*Math.PI*2;$.push(new w(Math.sin(Me)*Ne,0,Math.cos(Me)*Ne))}}const ne=[];for(let H=0;H<28;H++)for(let Ne=0;Ne<88;Ne++){const de=H*88+Ne,Me=H*88+(Ne+1)%88,me=(H+1)*88+Ne,He=(H+1)*88+(Ne+1)%88;ne.push(de,me,He,de,He,Me)}const le=new Float32Array(ne.length*3),ce=new Float32Array(ne.length*3);for(let H=0;H<ne.length;H++){const Ne=$[ne[H]];le[H*3]=Ne.x,le[H*3+1]=0,le[H*3+2]=Ne.z,ce[H*3]=0,ce[H*3+1]=1,ce[H*3+2]=0}const xe=new It;xe.setAttribute("position",new vt(le,3)),xe.setAttribute("normal",new vt(ce,3)),a(xe,null,(H,Ne,de,Me)=>{const me=Oi(H*.33+13.7,de*.33+4.1,4),He=Math.hypot(H,de);Me.copy(Ae.groundA).lerp(Ae.groundB,me),Me.multiplyScalar(1-sr(11,24,He)*.45);const Pe=Oi(H*1.7,de*1.7,2);Me.multiplyScalar(.92+Pe*.16);let T=0;for(let E=0;E<K.length;E++){const X=K[E],re=H-X.x,se=de-X.z,ae=(re*re+se*se)/(X.s*X.s);ae<4&&(T+=X.k*Math.exp(-ae*1.8))}Me.lerp(N,Math.min(.65,T))})}{const C=new nt(2.25,2.35,.6,22);a(C,_t({y:.3}),Ae.stone),a(new nt(2.35,2.45,.14,22),_t({y:.07}),Ae.stoneDark),o(new Rn(2.05,22),_t({y:.615,rx:-Math.PI/2}),Ae.water),a(new nt(.5,.62,.95,14),_t({y:1}),Ae.stone),a(new nt(1.18,1,.3,16),_t({y:1.55}),Ae.stone),o(new Rn(1.02,16),_t({y:1.72,rx:-Math.PI/2}),Ae.water.clone().multiplyScalar(1.2)),a(new nt(.26,.34,.6,12),_t({y:2}),Ae.stone),a(new nt(.62,.5,.24,14),_t({y:2.35}),Ae.stone),o(new Rn(.5,14),_t({y:2.49,rx:-Math.PI/2}),Ae.water.clone().multiplyScalar(1.5)),c.push({x:0,z:0,r:2.5});for(let D=0;D<10;D++){const V=D/10*Math.PI*2+.17;a(new et(1,.05,.64),_t({x:Math.sin(V)*3,y:.028,z:Math.cos(V)*3,ry:V}),Ae.stoneDark.clone().multiplyScalar(.9+.2*Oi(D*3.3,7.7,2)))}}for(const C of k){const D=_t({x:C.x,z:C.z});for(let V=0;V<3;V++){const $=C.a+V/3*Math.PI*2;a(new et(.07,.95,.07),new Xe().multiplyMatrices(D,_t({x:Math.sin($)*.3,y:.45,z:Math.cos($)*.3,rx:Math.cos($)*.3,rz:-Math.sin($)*.3})),Ae.iron)}a(new nt(.46,.26,.34,12),new Xe().multiplyMatrices(D,_t({y:.95})),Ae.iron),o(new jt(.34,10,6),new Xe().multiplyMatrices(D,_t({y:1.06,sy:.45})),Ae.ember),c.push({x:C.x,z:C.z,r:.65})}for(let C=0;C<v;C++){const{rngS:D,px:V,pz:$,yaw:ne}=m[C],le=new Xe().makeRotationY(ne).setPosition(V,0,$),ce=_e=>new Xe().multiplyMatrices(le,_t(_e)),xe=gr[(C+W+Math.floor(D()*2))%gr.length],H=An[gr.indexOf(xe)],Ne=.88+D()*.14,de=(_e,ie)=>_e.clone().lerp(N,ie).multiplyScalar(1+ie*.6),Me=2.3,me=2.75;for(const _e of[-1.55,1.55])a(new et(.13,Me,.13),ce({x:_e,y:Me/2,z:1.05}),de(Ae.timber,.22)),a(new et(.13,me,.13),ce({x:_e,y:me/2,z:-1.05}),Ae.timber);a(new et(3.3,.12,.9),ce({x:0,y:Ne-.06,z:.6}),de(Ae.timber,.3)),a(new et(3.3,Ne-.18,.07),ce({x:0,y:(Ne-.18)/2,z:1.02}),de(Ae.timberDark,.24)),a(new et(3.2,1.5,.06),ce({x:0,y:.95,z:-1.04}),de(Ae.timberDark,.1)),a(new et(3,.06,.34),ce({x:0,y:1.62,z:-.88}),de(Ae.timber,.15));const He=Math.atan2(me-Me+.15,2.7),Pe=2.75,T=10;for(let _e=0;_e<T;_e++){const ie=-1.71+(_e+.5)*(3.42/T),Ze=_e%2===0?Ae.cream:H;a(new et(3.42/T+.005,.045,Pe),ce({x:ie,y:2.47,z:.18,rx:He}),Ze)}for(let _e=0;_e<T;_e++){const ie=-1.71+(_e+.5)*(3.42/T),Ze=_e%2===0?H:Ae.cream;a(new et(3.42/T-.03,.26+_e%2*.07,.035),ce({x:ie,y:2.06,z:1.54}),Ze)}const E=9;for(let _e=0;_e<E;_e++){const ie=(_e+.5)/E,Ze=-1.55+ie*3.1,Ve=Me-.08-4*.34*ie*(1-ie),ze=Ae.bulbWarm.clone().multiplyScalar(1.1+D()*.55);o(new jt(.06,6,4),ce({x:Ze,y:Ve,z:1.24}),ze)}const X=t[C];for(let _e=0;_e<X.length;_e++){const ie=X.length===1?0:_e===0?-.78:.78;r_(g(X[_e]),ie,X.length===1?1.15:.62,ce,Ne,D,a,o)}const re=C%2===0?1:-1,se=ct(g(X[0]).color);hc(ce({x:re*2.35,z:-.35,ry:D()*Math.PI}),D,se,a),St.set(re*2.35,0,-.35).applyMatrix4(le),c.push({x:St.x,z:St.z,r:.8}),D()<.55?(a(new et(1.5,.025,1),ce({x:0,y:.032,z:2.15}),H.clone().multiplyScalar(.62)),a(new et(1.62,.02,1.12),ce({x:0,y:.014,z:2.15}),Ae.cream.clone().multiplyScalar(.5))):a(new et(1.1,.035,.7),ce({x:.3,y:.021,z:2,ry:.3}),Ae.stoneDark);const ae=[{lx:0,lz:.55,r:.8},{lx:-1.2,lz:.55,r:.6},{lx:1.2,lz:.55,r:.6},{lx:-1.55,lz:1.05,r:.3},{lx:1.55,lz:1.05,r:.3},{lx:-1.55,lz:-1.05,r:.35},{lx:1.55,lz:-1.05,r:.35}];for(const _e of ae)St.set(_e.lx,0,_e.lz).applyMatrix4(le),c.push({x:St.x,z:St.z,r:_e.r});const Te=(_e,ie)=>(St.set(_e,0,ie).applyMatrix4(le),{x:St.x,z:St.z}),ge=Te(0,-.72),be=Te(-.85,2.15),Le=Te(.85,2.15);u.push({id:`stall${C}`,goodIds:X.slice(),pos:{x:V,z:$},yaw:ne,vendorSpot:{x:ge.x,z:ge.z,yaw:ne},browseSpots:[{x:be.x,z:be.z,yaw:ne+Math.PI},{x:Le.x,z:Le.z,yaw:ne+Math.PI}],counterY:Ne,awningColor:xe})}const B=[];for(let C=0;C<y;C++){const{a:D,px:V,pz:$}=U[C],ne=new Xe().makeRotationY(D+Math.PI).setPosition(V,0,$),le=ce=>new Xe().multiplyMatrices(ne,_t(ce));a(new nt(.055,.085,3.3,8),le({y:1.65}),Ae.timberDark),a(new et(1,.08,.08),le({y:3.25}),Ae.timberDark),ph(le,.42,3,0,Ae.bulbWarm.clone().multiplyScalar(1.3),a,o,1.15),c.push({x:V,z:$,r:.3}),B.push({PM:ne,silk:An[(C+W)%An.length]})}for(let C=0;C<3;C++){const D=S+(C+.33)/3*Math.PI*2+_()*.5,V=7.2+_()*1.8,$=Math.sin(D)*V,ne=Math.cos(D)*V,le=An[Math.floor(_()*An.length)];hc(_t({x:$,z:ne,ry:_()*Math.PI*2}),_,le,a),c.push({x:$,z:ne,r:.8})}{for(let D=0;D<26;D++){if(D%7===3)continue;const V=D/26*Math.PI*2;a(new et(4.2,.85+Oi(D*2.1,.5,2)*.3,.5),_t({x:Math.sin(V)*(M+1.4),y:.42,z:Math.cos(V)*(M+1.4),ry:V}),Ae.stoneDark.clone().multiplyScalar(.75))}for(let D=0;D<9;D++){const V=S+D/9*Math.PI*2+.31,$=M+3.5+Oi(D*5.1,3.3,2)*3,ne=3.4+Oi(D*1.7,9.1,2)*2.4;a(new vn(2.2,ne,6),_t({x:Math.sin(V)*$,y:ne/2-.2,z:Math.cos(V)*$,ry:V}),An[D%An.length].clone().multiplyScalar(.16))}}{const C=P+Math.PI/2,D=Math.sin(C)*4.9,V=Math.cos(C)*4.9;p.push({x:D,z:V,yaw:Math.atan2(D,V)});const $=S+(Math.floor(v/2)+.5)/v*Math.PI*2,ne=Math.sin($)*(L-1.9),le=Math.cos($)*(L-1.9);p.push({x:ne,z:le,yaw:Math.atan2(-ne,-le)})}const G=new Lt(Ar(s,!1),l),Y=new Lt(Ar(r,!1),h);G.name="static-body",Y.name="static-glow",G.matrixAutoUpdate=!1,Y.matrixAutoUpdate=!1,n.add(G,Y);for(const C of s)C.dispose();for(const C of r)C.dispose();for(let C=0;C<k.length;C++){const D=k[C],V=new vn(.17,.6,6);V.translate(0,.3,0);const $=ds(V,null,(le,ce,xe,H)=>{H.copy(Ae.flameCore).lerp(Ae.flameTip,Pn(ce/.6,0,1))},!1),ne=new Lt($,h);ne.position.set(D.x,1.08,D.z),ne.userData.dynamic=!0,n.add(ne),f.push({mesh:ne,kind:"flame",phase:C*2.4+.7,speed:9+C*1.7})}for(let C=0;C<B.length;C++){const{PM:D,silk:V}=B[C],$=new et(.46,1.35,.025);$.translate(0,-.675,0);const ne=ds($,null,(ce,xe,H,Ne)=>{Ne.copy(V).multiplyScalar(1.15-Pn(-xe/1.35,0,1)*.4)},!0),le=new Lt(ne,l);St.set(-.42,3.2,0).applyMatrix4(D),le.position.copy(St),le.rotation.y=Math.atan2(St.x,St.z),le.userData.dynamic=!0,n.add(le),f.push({mesh:le,kind:"banner",phase:C*1.9,speed:.9+C%3*.25,baseRy:le.rotation.y})}const te=[{y:.625,rMax:1.92,period:3.4,phase:0},{y:.625,rMax:1.92,period:3.4,phase:.5},{y:1.745,rMax:.94,period:2.7,phase:.25}];for(const C of te){const D=new ro(.88,1,26);D.rotateX(-Math.PI/2);const V=new ci({color:Ae.water.clone().multiplyScalar(1.9),transparent:!0,opacity:0,depthWrite:!1}),$=new Lt(D,V);$.position.y=C.y,$.userData.dynamic=!0,n.add($),f.push({mesh:$,kind:"ripple",period:C.period,phase:C.phase,rMax:C.rMax})}{const C=ds(new Ji(.24),null,Ae.moonTeal,!1),D=new Lt(C,h);D.position.set(0,2.85,0),D.userData.dynamic=!0,n.add(D),f.push({mesh:D,kind:"wisp",phase:0,period:1})}const J=new ba(16756838,45,0,2);J.position.set(0,4,0),n.add(J);const j=new ba(16760954,80,0,2);St.set(Math.sin(S+Math.PI*.34)*9.5,4.2,Math.cos(S+Math.PI*.34)*9.5),j.position.copy(St),n.add(j);const F=new ba(16760954,80,0,2);St.set(Math.sin(S+Math.PI*1.34)*9.5,4.2,Math.cos(S+Math.PI*1.34)*9.5),F.position.copy(St),n.add(F);const R=J.intensity;function I(C){for(let D=0;D<f.length;D++){const V=f[D],$=V.mesh;if(V.kind==="flame"){const ne=Math.sin(C*V.speed+V.phase),le=Math.sin(C*V.speed*1.73+V.phase*2.1),ce=1+.1*ne-.06*le;$.scale.set(ce,.9+.18*ne*ne+.1*le,ce),$.rotation.y=C*1.9+V.phase}else if(V.kind==="ripple"){const ne=(C/V.period+V.phase)%1,le=(.28+.72*ne)*V.rMax;$.scale.set(le,1,le),$.material.opacity=.36*(1-ne)*(1-ne)*sr(0,.12,ne)}else if(V.kind==="wisp"){$.position.y=2.85+Math.sin(C*1.1)*.06,$.rotation.y=C*.6;const ne=1+Math.sin(C*2.3)*.05;$.scale.set(ne,ne,ne)}else $.rotation.z=.14*Math.sin(C*V.speed+V.phase),$.rotation.x=.07*Math.sin(C*V.speed*1.31+V.phase*1.7),$.rotation.y=V.baseRy}J.intensity=R*(1+.09*Math.sin(C*7.3)*Math.sin(C*3.1+1.2))}return{group:n,bounds:{r:M},stalls:u,buskerSpots:p,colliders:c,update:I}}function r_(i,e,t,n,s,r,a,o){const l=ct(i.color).multiplyScalar(1.25),h=c=>(r()-.5)*c;switch(i.id){case"apple":{a(new et(.62,.16,.5),n({x:e,y:s+.08,z:.55}),Ae.timberDark);for(let c=0;c<3;c++)for(let u=0;u<2;u++)a(new jt(.075,8,6),n({x:e-.18+c*.18+h(.02),y:s+.2,z:.44+u*.2+h(.02)}),l);for(let c=0;c<2;c++)a(new jt(.075,8,6),n({x:e-.09+c*.18,y:s+.33,z:.54+h(.03)}),l);a(new jt(.07,8,6),n({x:e+t*.7,y:s+.07,z:.32}),l);break}case"fish":{a(new et(.95,.05,.5),n({x:e,y:s+.025,z:.6}),Ae.stone.clone().multiplyScalar(1.15));for(let c=0;c<4;c++){const u=e-.33+c*.22+h(.02);a(new Xi(.05,.3,3,6),n({x:u,y:s+.09,z:.56+h(.06),rx:Math.PI/2,sx:.7}),l),a(new vn(.055,.16,5),n({x:u,y:s+.09,z:.82+h(.04),rx:Math.PI/2,sx:.6}),l)}break}case"bread":{for(let c=0;c<3;c++)a(new Xi(.09,.18,3,7),n({x:e-.3+c*.3,y:s+.085,z:.45+h(.06),rz:Math.PI/2,ry:h(.4),sy:.75}),l);a(new nt(.2,.15,.14,9),n({x:e+.1,y:s+.07,z:.82}),Ae.sack),a(new Xi(.08,.16,3,7),n({x:e+.1,y:s+.17,z:.82,rz:Math.PI/2,ry:.5,sy:.75}),l);break}case"spice":{for(let c=0;c<3;c++){const u=e-.34+c*.34;a(new nt(.17,.13,.07,10),n({x:u,y:s+.035,z:.55}),Ae.timberDark),a(new vn(.13,.17,9),n({x:u,y:s+.15,z:.55}),l.clone().multiplyScalar(.85+c*.15))}a(new jt(.13,8,6),n({x:e+t*.6,y:s+.1,z:.85,sy:.8}),Ae.sack);break}case"potion":{for(let c=0;c<4;c++){const u=e-.36+c*.24+h(.02),p=.45+c%2*.3+h(.04);o(new nt(.055,.065,.16,8),n({x:u,y:s+.08,z:p}),l.clone().multiplyScalar(.55+r()*.5)),a(new nt(.02,.03,.09,6),n({x:u,y:s+.2,z:p}),Ae.timberDark)}break}case"gem":{a(new et(.6,.07,.4),n({x:e,y:s+.035,z:.55}),ct(2366010));for(let c=0;c<5;c++)o(new Ji(.055+r()*.03),n({x:e-.2+c%3*.2+h(.04),y:s+.13,z:.46+Math.floor(c/3)*.18+h(.04),ry:r()*Math.PI}),l.clone().multiplyScalar(.6+r()*.6));break}case"lamp":{for(let c=0;c<3;c++){const u=e-.32+c*.32;ph(n,u,s+.14+(c===1?.22:0),.55,l.clone().multiplyScalar(1+r()*.4),a,o,.85)}break}case"rug":{for(let c=0;c<3;c++)a(new nt(.085,.085,.6,9),n({x:e,y:s+.085+c*.13,z:.5+c%2*.14,rz:Math.PI/2}),c===1?An[1]:l.clone().multiplyScalar(.8+c*.2));a(new nt(.1,.1,1.3,9),n({x:e+t*.85,y:.62,z:1.12,rx:-.35}),l.clone().multiplyScalar(.7));break}case"scroll":{for(let c=0;c<3;c++)a(new nt(.04,.04,.42,7),n({x:e-.09+c*.09,y:s+.045,z:.5+(c-1)*.1,rz:Math.PI/2}),l);for(let c=0;c<2;c++)a(new nt(.04,.04,.42,7),n({x:e-.045+c*.09,y:s+.12,z:.5,rz:Math.PI/2}),l);a(new nt(.04,.04,.42,7),n({x:e,y:s+.195,z:.5,rz:Math.PI/2}),l.clone().multiplyScalar(1.1)),a(new et(.06,.09,.09),n({x:e,y:s+.045,z:.5}),An[0]);break}case"skull":{for(let c=0;c<3;c++){const u=e-.3+c*.3,p=h(.9);a(new jt(.095,9,7),n({x:u,y:s+.1,z:.55,ry:p,sy:.92,sz:1.05}),l),a(new et(.1,.05,.07),n({x:u+Math.sin(p)*.05,y:s+.035,z:.55+Math.cos(p)*.05,ry:p}),l.clone().multiplyScalar(.85));for(const f of[-1,1])o(new jt(.014,5,4),n({x:u+Math.sin(p)*.08+Math.cos(p)*f*.035,y:s+.12,z:.55+Math.cos(p)*.08-Math.sin(p)*f*.035}),Ae.ember)}break}default:a(new et(.4,.25,.4),n({x:e,y:s+.125,z:.55}),Ae.timberDark),a(new et(.42,.05,.42),n({x:e,y:s+.27,z:.55}),l)}}function hc(i,e,t,n){const s=r=>new Xe().multiplyMatrices(i,_t(r));n(new et(.56,.56,.56),s({x:-.18,y:.28,ry:e()*.6}),Ae.timberDark),n(new et(.58,.06,.58),s({x:-.18,y:.59,ry:.1}),t.clone().multiplyScalar(.7)),n(new et(.38,.38,.38),s({x:-.14,y:.19+.62,z:.06,ry:e()*.9}),Ae.timber),n(new nt(.24,.27,.66,11),s({x:.42,y:.33,z:-.1}),Ae.barrel),n(new nt(.25,.25,.045,11),s({x:.42,y:.2,z:-.1}),Ae.iron),n(new nt(.255,.255,.045,11),s({x:.42,y:.52,z:-.1}),Ae.iron),n(new jt(.26,8,6),s({x:.28,y:.18,z:.48,sy:.72}),Ae.sack),n(new vn(.07,.1,6),s({x:.28,y:.4,z:.48}),Ae.sack.clone().multiplyScalar(.8))}const uc=12,a_=20,fc=5e3;function o_(i){let e=0;for(let t=0;t<12;t++)e+=i();return e-6}function l_(i){const e=i.slice().sort((n,s)=>n-s),t=e.length>>1;return e.length%2?e[t]:(e[t-1]+e[t])/2}function c_({seed:i,goods:e,actors:t}){const n=new Map(e.map(F=>[F.id,F])),s=Bt(i|0),r=new Map,a=[],o=[],l=new Map,h=new Map;let c=[],u=0,p=0,f=0,v=0,x=0,g=0,d=0,b=0,_=0;function M(F){c.push(F),c.length>fc&&c.splice(0,c.length-fc)}for(const F of t){const R=mn(Bt(s^wa(F.id))),I={greed:Xt(F.attrs.greed),patience:Xt(F.attrs.patience),charm:Xt(F.attrs.charm),temper:Xt(F.attrs.temper)},C=Xt(F.wealth),D={id:F.id,role:F.role,attrs:I,wealth:C,rng:R,wallet:0,inventory:{},beliefs:{},deals:0,walkaways:0};for(const V of e){const $=Math.max(.35,1+.25*o_(R));D.beliefs[V.id]=Math.max(1,V.baseValue*$)}if(F.role==="vendor"){const V=F.goodIds||[];if(V.length<1)throw new Error(`economy: vendor "${F.id}" has no goodIds`);D.goodIds=V.slice(),D.asks={},D.stock={},D.costBasis={},D.sinceSale={},D.restockAcc={},D.wallet=30+Math.round(C*120);for(const $ of V){const ne=n.get($);if(!ne)throw new Error(`economy: vendor "${F.id}" sells unknown good "${$}"`);D.stock[$]=ec(R,3,6),D.costBasis[$]=Math.max(1,Math.round(ne.baseValue*(.5+.2*R()))),D.asks[$]=D.beliefs[$]*(1.1+.45*I.greed),D.sinceSale[$]=0,D.restockAcc[$]=0}a.push(D)}else{D.needs={},D.needRate={};for(const V of e)D.needs[V.id]=.35*R(),D.needRate[V.id]=(.1+.8*R())*Math.sqrt(6/V.baseValue);F.role==="customer"?(D.wallet=15+Math.round(C*105),D.wageRate=3+9*C):(D.wallet=5+Math.round(C*20),D.wageRate=0,o.push(D)),D.wageAcc=0}r.set(D.id,D),f+=D.wallet}for(const F of e)h.set(F.id,[]);function L(F){const R=r.get(F);if(!R)throw new Error(`economy: unknown actor "${F}"`);return R}function S(F,R){return Math.max(1,Math.ceil(F.costBasis[R]*1.1),Math.round(F.beliefs[R]*(.75+.5*F.attrs.greed)))}function P(F){p+=F;for(const R of r.values())if(R.role==="vendor")for(const I of R.goodIds){const C=R.beliefs[I]*(1+.25*R.attrs.greed);if(R.asks[I]+=(C-R.asks[I])*Math.min(1,.6*F),R.asks[I]<S(R,I)&&(R.asks[I]=S(R,I)),R.sinceSale[I]+=F,R.sinceSale[I]>1.5&&R.stock[I]>0&&(R.beliefs[I]=Math.max(1,R.beliefs[I]*(1-.1*F))),R.stock[I]===0&&(R.restockAcc[I]+=F,R.restockAcc[I]>=.2)){const D=n.get(I),V=Math.max(1,Math.round(D.baseValue*(.5+.25*R.rng())));let $=ec(R.rng,2,5);for(;$>0&&R.wallet<V*$;)$--;if($>0){const ne=V*$;R.wallet-=ne,x+=ne,R.stock[I]=$,R.costBasis[I]=V,R.asks[I]<S(R,I)&&(R.asks[I]=S(R,I)),R.sinceSale[I]=0,R.restockAcc[I]=0,M({type:"restock",vendorId:R.id,goodId:I,count:$,cost:ne})}else R.restockAcc[I]=.2}}else{for(const I in R.needs){const C=R.needs[I]+R.needRate[I]*F;R.needs[I]=C>1?1:C}if(R.wageRate>0){R.wageAcc+=R.wageRate*F;const I=Math.floor(R.wageAcc);I>0&&(R.wageAcc-=I,R.wallet+=I,v+=I)}}}function W(F){const R=L(F);if(R.role==="vendor")return{kind:"idle"};let I=null;for(const D of a)if(D.id!==F)for(const V of D.goodIds){if(D.stock[V]<=0)continue;const $=.5*(D.asks[V]+R.beliefs[V]);if(R.wallet<Math.max(1,Math.round(.9*$)))continue;const ne=R.needs[V]*R.beliefs[V]*1.6-$;ne>0&&(I===null||ne>I.surplus)&&(I={vendorId:D.id,goodId:V,surplus:ne,urgency:Xt(R.needs[V])})}return I?{kind:"buy",vendorId:I.vendorId,goodId:I.goodId,urgency:I.urgency}:o.some(D=>D.id!==F)&&R.rng()<.25?{kind:"watch"}:{kind:"idle"}}function m(F,R,I){const C=r.get(F),D=r.get(R);if(!C||!D||D.role!=="vendor"||F===R||!(D.stock[I]>0))return null;const V=S(D,I),$=Math.max(V,Math.round(D.asks[I])),ne=Math.max(1,Math.round(.5*Math.min(C.beliefs[I],$)));if(C.wallet<ne)return null;const le=Xt(C.needs?C.needs[I]:.5),ce=Math.min(C.wallet,Math.max(1,Math.round(C.beliefs[I]*(1+.6*le))));u++;const xe=`h${u}`,H=mn(Bt(s^Bt(Math.imul(u,2654435769))^wa(F)^wa(R)));return l.set(xe,{id:xe,buyerId:F,vendorId:R,goodId:I,srng:H,step:0,F:V,R:ce,openAsk:$,lastBuyer:-1,lastSeller:-1,scoffed:!1,heldFirm:!1,buyerCounters:0,maxBuyerCounters:1+Math.round(C.attrs.patience*4)}),xe}function y(F,R,I,C,D){return{speaker:R,type:I,price:C,mood:D,done:!1,deal:null}}function U(F,R,I){const C=r.get(F.buyerId),D=r.get(F.vendorId),V=F.goodId;if(I>C.wallet||D.stock[V]<=0)return K(F,R,"walkaway");const $=(F.openAsk-I)/Math.max(1,F.openAsk-F.F);let ne;R==="buyer"?ne=I<=.7*F.R?"delighted":I<=.92*F.R?"happy":"neutral":ne=I>=D.beliefs[V]*1.08?"delighted":$<=.45?"happy":$<=.8?"neutral":"annoyed",C.wallet-=I,D.wallet+=I,D.stock[V]-=1,C.inventory[V]=(C.inventory[V]||0)+1,C.needs&&(C.needs[V]=0),C.deals++,D.deals++,g++,b+=I,D.sinceSale[V]=0,C.beliefs[V]+=.3*(I-C.beliefs[V]),D.beliefs[V]+=.2*(I-D.beliefs[V]);const le=D.stock[V],ce=.04+(le===0?.1:le<=1?.06:0)+(F.step<=6?.04:0);D.asks[V]*=1+ce;const xe=h.get(V);return xe.push(I),xe.length>a_&&xe.shift(),M({type:"deal",buyerId:F.buyerId,sellerId:F.vendorId,goodId:V,price:I}),l.delete(F.id),{speaker:R,type:"accept",price:I,mood:ne,done:!0,deal:{price:I,goodId:V}}}function k(F){const R=r.get(F.buyerId),I=r.get(F.vendorId),C=F.goodId;R.walkaways++,I.walkaways++,d++,I.asks[C]=Math.max(S(I,C),I.asks[C]*.97),I.beliefs[C]=Math.max(1,I.beliefs[C]*.985),F.lastSeller>0&&(R.beliefs[C]+=.1*(F.lastSeller-R.beliefs[C])),M({type:"walkaway",buyerId:F.buyerId,sellerId:F.vendorId,goodId:C}),l.delete(F.id)}function K(F,R,I){const D=r.get(R==="buyer"?F.buyerId:F.vendorId).attrs.temper<.35?"angry":"annoyed";return k(F),{speaker:R,type:I,price:void 0,mood:D,done:!0,deal:null}}function N(F){const R=l.get(F);if(!R)throw new Error(`economy: unknown or finished haggle session "${F}"`);const I=r.get(R.buyerId),C=r.get(R.vendorId),D=R.goodId;R.step++;const V=R.step;if(V%2===1){if(V===1)return y(R,"buyer","greet",void 0,I.attrs.charm>.6?"happy":"neutral");let de;const Me=R.lastBuyer<0;if(Me)de=Math.round(I.beliefs[D]*(.9-.35*I.attrs.greed));else{const Pe=Pn(.15+.4*(1-I.attrs.patience)+.25*C.attrs.charm,.1,.9);de=R.lastBuyer+Math.max(1,Math.round(Pe*(R.lastSeller-R.lastBuyer)))}if(de=Pn(de,1,R.R),R.lastSeller>=0&&de>=R.lastSeller)return U(R,"buyer",Pn(Math.round((de+R.lastSeller)/2),R.F,R.R));if(R.heldFirm&&R.lastSeller>=0&&R.lastSeller<=R.R)return U(R,"buyer",R.lastSeller);if(!Me&&(de<=R.lastBuyer||(R.buyerCounters++,R.buyerCounters>R.maxBuyerCounters)))return K(R,"buyer","walkaway");R.lastBuyer=de;const me=(R.R-de)/Math.max(1,R.R),He=me>.35?"happy":me>.12?"neutral":"annoyed";return y(R,"buyer",Me?"offer":"counter",de,He)}if(C.stock[D]<=0)return K(R,"seller","walkaway");if(V===2)return R.lastSeller=R.openAsk,I.beliefs[D]+=.08*(R.openAsk-I.beliefs[D]),y(R,"seller","ask",R.openAsk,C.attrs.charm>.6?"happy":"neutral");const $=R.lastBuyer,ne=C.attrs.temper<.35,le=$>=0&&$<Math.max(1,Math.round(.55*R.openAsk));if(ne&&le&&!R.scoffed&&V<uc)return R.scoffed=!0,y(R,"seller","scoff",void 0,"angry");if(ne&&le&&R.scoffed&&R.srng()<.6)return K(R,"seller","walkaway");const ce=Pn(.12+.3*(1-C.attrs.patience)+.3*I.attrs.charm-.25*C.attrs.greed,.06,.9);let xe=R.lastSeller-Math.max(1,Math.round(ce*(R.lastSeller-Math.max($,0))));if(xe=Math.max(xe,R.F),$>=0&&xe<=$)return U(R,"seller",Pn(Math.round((xe+$)/2),R.F,R.R));if(V>=uc)return K(R,"seller","reject");if(xe>=R.lastSeller)return R.heldFirm=!0,y(R,"seller","counter",R.lastSeller,"annoyed");R.lastSeller=xe;const H=(R.openAsk-xe)/Math.max(1,R.openAsk-R.F),Ne=le?"angry":H>.75?"annoyed":H>.4?"neutral":"happy";return y(R,"seller","counter",xe,Ne)}function B(F){const R=l.get(F);R&&k(R)}function G(F,R){const I=r.get(F),C=r.get(R);if(!I||!C||C.role!=="busker"||F===R||I.wallet<=0)return 0;const D=.5*(I.wealth+I.attrs.charm)+.6*C.attrs.charm;let V=1+Math.floor(I.rng()*(1+2.5*D));return V=Math.min(V,I.wallet),I.wallet-=V,C.wallet+=V,_++,M({type:"tip",fromId:F,buskerId:R,coins:V}),V}function Y(F){const R=L(F),I={};for(const D in R.beliefs)I[D]=Math.max(1,Math.round(R.beliefs[D]));const C={role:R.role,wallet:R.wallet,inventory:{...R.inventory},beliefs:I,deals:R.deals,walkaways:R.walkaways};if(R.role==="vendor"){C.stock={...R.stock},C.asks={};for(const D of R.goodIds)C.asks[D]=Math.max(1,Math.round(R.asks[D]))}else C.needs={...R.needs};return C}function te(){let F=0;for(const I of r.values())F+=I.wallet;const R={};for(const I of e){const C=h.get(I.id);R[I.id]=C.length?l_(C):null}return{day:p,moneySupply:F,dealCount:g,walkawayCount:d,volumeCoins:b,wagesIn:v,restockOut:x,tipsCount:_,medianPrice:R}}function J(){const F=c;return c=[],F}function j(){let F=0;for(const C of r.values())F+=C.wallet;const R=f+v-x,I=F-R;return{ok:I===0,sumWallets:F,expected:R,drift:I}}return{tick:P,chooseErrand:W,startHaggle:m,stepHaggle:N,cancelHaggle:B,tipBusker:G,actorState:Y,stats:te,drainEvents:J,audit:j}}function mh(i,e,t,n,s){i.save(),i.translate(t,n);const r=s/24;i.scale(r,r),i.lineJoin="round",i.lineCap="round";const a=l=>{i.fillStyle=l,i.beginPath(),i.arc(0,0,10,0,Math.PI*2),i.fill()},o=(l=-2.5)=>{i.fillStyle="#31261a",i.beginPath(),i.arc(-3.6,l,1.5,0,Math.PI*2),i.arc(3.6,l,1.5,0,Math.PI*2),i.fill()};switch(e){case"apple":{i.fillStyle="#d9433b",i.beginPath(),i.arc(-3.2,1.5,6.4,0,Math.PI*2),i.arc(3.2,1.5,6.4,0,Math.PI*2),i.fill(),i.strokeStyle="#6a4a2a",i.lineWidth=1.8,i.beginPath(),i.moveTo(0,-3),i.quadraticCurveTo(1,-7,3,-8.5),i.stroke(),i.fillStyle="#5a9a3a",i.beginPath(),i.ellipse(5,-7,3.4,1.8,-.5,0,Math.PI*2),i.fill();break}case"fish":{i.fillStyle="#6fb7c9",i.beginPath(),i.ellipse(-1,0,7.5,4.5,0,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(6,0),i.lineTo(11,-4.5),i.lineTo(11,4.5),i.closePath(),i.fill(),i.fillStyle="#1a2a33",i.beginPath(),i.arc(-4.5,-1,1.1,0,Math.PI*2),i.fill();break}case"bread":{i.fillStyle="#c98f4e",i.beginPath(),i.ellipse(0,.5,9,5.5,0,0,Math.PI*2),i.fill(),i.strokeStyle="#8a5a2a",i.lineWidth=1.4;for(const l of[-4,0,4])i.beginPath(),i.moveTo(l-1.5,-2.5),i.lineTo(l+1.5,.5),i.stroke();break}case"spice":{i.fillStyle="#c2452c",i.beginPath(),i.moveTo(-9,7),i.quadraticCurveTo(0,-12,9,7),i.closePath(),i.fill(),i.fillStyle="#e88a3a";for(const[l,h]of[[-3,3],[1,-1],[4,4],[-1,5]])i.beginPath(),i.arc(l,h,1,0,Math.PI*2),i.fill();break}case"potion":{i.fillStyle="#cfd8dc",i.fillRect(-2,-10,4,4),i.fillStyle="#7fd48a",i.beginPath(),i.arc(0,2.5,7,0,Math.PI*2),i.fill(),i.fillStyle="#bfe8c5",i.beginPath(),i.arc(-2.5,0,2,0,Math.PI*2),i.fill();break}case"gem":{i.fillStyle="#8f6fd4",i.beginPath(),i.moveTo(0,-9),i.lineTo(8,-2),i.lineTo(0,10),i.lineTo(-8,-2),i.closePath(),i.fill(),i.strokeStyle="#c9b8ef",i.lineWidth=1.2,i.beginPath(),i.moveTo(-8,-2),i.lineTo(8,-2),i.moveTo(0,-9),i.lineTo(0,10),i.stroke();break}case"lamp":{i.fillStyle="#e8b64c",i.beginPath(),i.ellipse(0,3,8,5,0,0,Math.PI*2),i.fill(),i.beginPath(),i.moveTo(6,1),i.lineTo(12,-2),i.lineTo(7,4),i.closePath(),i.fill(),i.strokeStyle="#e8b64c",i.lineWidth=1.6,i.beginPath(),i.arc(-8,1,3,-1.2,2.4),i.stroke(),i.fillStyle="#fff3c9",i.beginPath(),i.arc(0,-6,2.2,0,Math.PI*2),i.fill();break}case"rug":{i.fillStyle="#b85a8f",i.fillRect(-9,-6,18,12),i.fillStyle="#efe0c0",i.fillRect(-9,-2,18,1.6),i.fillRect(-9,2,18,1.6),i.strokeStyle="#efe0c0",i.lineWidth=1.2;for(let l=-8;l<=8;l+=3)i.beginPath(),i.moveTo(l,6),i.lineTo(l,8),i.moveTo(l,-6),i.lineTo(l,-8),i.stroke();break}case"scroll":{i.fillStyle="#d8cfae",i.fillRect(-7,-8,14,16),i.fillStyle="#b8a97e",i.beginPath(),i.ellipse(0,-8,7,2.4,0,0,Math.PI*2),i.ellipse(0,8,7,2.4,0,0,Math.PI*2),i.fill(),i.strokeStyle="#7a2a2a",i.lineWidth=1.3,i.beginPath(),i.moveTo(-4,-3),i.lineTo(4,-3),i.moveTo(-4,.5),i.lineTo(4,.5),i.moveTo(-4,4),i.lineTo(1,4),i.stroke();break}case"skull":{i.fillStyle="#e8e4da",i.beginPath(),i.arc(0,-1.5,7.5,0,Math.PI*2),i.fill(),i.fillRect(-4.5,3,9,5.5),i.fillStyle="#2a2a2a",i.beginPath(),i.arc(-3,-2,2.2,0,Math.PI*2),i.arc(3,-2,2.2,0,Math.PI*2),i.fill();for(const l of[-2.6,0,2.6])i.fillRect(l-.7,4.5,1.4,3.5);break}case"coin":{i.fillStyle="#e6b422",i.beginPath(),i.arc(0,0,9,0,Math.PI*2),i.fill(),i.strokeStyle="#a67c00",i.lineWidth=1.6,i.beginPath(),i.arc(0,0,6.2,0,Math.PI*2),i.stroke(),i.fillStyle="#a67c00",i.font="bold 9px sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("¢",0,.5);break}case"happy":{a("#f5c542"),o(),i.strokeStyle="#31261a",i.lineWidth=1.8,i.beginPath(),i.arc(0,1,5,.35,Math.PI-.35),i.stroke();break}case"delighted":{a("#f5c542"),i.strokeStyle="#31261a",i.lineWidth=1.8,i.beginPath(),i.arc(-3.6,-2,2,Math.PI,Math.PI*2),i.stroke(),i.beginPath(),i.arc(3.6,-2,2,Math.PI,Math.PI*2),i.stroke(),i.fillStyle="#31261a",i.beginPath(),i.arc(0,2.5,4.5,0,Math.PI),i.fill();break}case"neutral":{a("#f5c542"),o(),i.strokeStyle="#31261a",i.lineWidth=1.8,i.beginPath(),i.moveTo(-4,3.5),i.lineTo(4,3.5),i.stroke();break}case"annoyed":{a("#f0a04a"),o(),i.strokeStyle="#31261a",i.lineWidth=1.8,i.beginPath(),i.arc(0,7.5,5,Math.PI+.45,-.45),i.stroke(),i.beginPath(),i.moveTo(-5.5,-5.5),i.lineTo(-1.8,-5),i.moveTo(5.5,-5.5),i.lineTo(1.8,-5),i.stroke();break}case"angry":{a("#e04a3a"),o(-2),i.strokeStyle="#31261a",i.lineWidth=1.9,i.beginPath(),i.arc(0,8,5,Math.PI+.5,-.5),i.stroke(),i.beginPath(),i.moveTo(-5.8,-6.5),i.lineTo(-1.6,-3.8),i.moveTo(5.8,-6.5),i.lineTo(1.6,-3.8),i.stroke();break}case"no":{i.strokeStyle="#c0392b",i.lineWidth=2.6,i.beginPath(),i.arc(0,0,8.4,0,Math.PI*2),i.stroke(),i.beginPath(),i.moveTo(-5.5,5.5),i.lineTo(5.5,-5.5),i.stroke();break}case"yes":{i.strokeStyle="#2f9e44",i.lineWidth=3.2,i.beginPath(),i.moveTo(-7,.5),i.lineTo(-2,6),i.lineTo(8,-6),i.stroke();break}case"question":case"exclaim":{i.fillStyle=e==="question"?"#4a6fd4":"#e6a817",i.font="bold 22px sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(e==="question"?"?":"!",0,1);break}case"note":{i.fillStyle="#4a3a8a",i.beginPath(),i.ellipse(-3.5,6,3.4,2.5,-.35,0,Math.PI*2),i.fill(),i.strokeStyle="#4a3a8a",i.lineWidth=2,i.beginPath(),i.moveTo(-.6,5.5),i.lineTo(-.6,-7),i.stroke(),i.beginPath(),i.moveTo(-.6,-7),i.quadraticCurveTo(4,-6,5.5,-1.5),i.quadraticCurveTo(3,-3.5,-.6,-3.5),i.closePath(),i.fill();break}case"heart":{i.fillStyle="#e0508a",i.beginPath(),i.moveTo(0,8),i.bezierCurveTo(-10,0,-7,-8,0,-3),i.bezierCurveTo(7,-8,10,0,0,8),i.fill();break}case"sparkle":{i.fillStyle="#e6c84a",i.beginPath(),i.moveTo(0,-9),i.quadraticCurveTo(1.6,-1.6,9,0),i.quadraticCurveTo(1.6,1.6,0,9),i.quadraticCurveTo(-1.6,1.6,-9,0),i.quadraticCurveTo(-1.6,-1.6,0,-9),i.fill();break}default:i.fillStyle="#888",i.font="bold 18px sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("?",0,1)}i.restore()}const dc={happy:"happy",delighted:"delighted",neutral:"neutral",annoyed:"annoyed",angry:"angry"},pc={neutral:"#8a8398",good:"#2f9e44",bad:"#c0392b",gold:"#c9971a"},ur=2,Ra=40,mc=11,kn=62,Ca=13;function h_(i,e){const t=document.createElement("canvas").getContext("2d");t.font="bold 30px sans-serif";let n=mc*2;const s=i.map(c=>{const p=/^\d/.test(c)?t.measureText(c).width+4:Ra;return n+=p+5,p});n-=5;const r=document.createElement("canvas");r.width=n*ur,r.height=(kn+Ca)*ur;const a=r.getContext("2d");a.scale(ur,ur),a.fillStyle="rgba(252, 250, 245, 0.96)",a.strokeStyle=pc[e]||pc.neutral,a.lineWidth=3;const o=14;a.beginPath(),a.roundRect(1.5,1.5,n-3,kn-3,o),a.fill(),a.stroke(),a.beginPath(),a.moveTo(n/2-9,kn-2),a.lineTo(n/2,kn+Ca-2),a.lineTo(n/2+9,kn-2),a.closePath(),a.fill(),a.strokeStyle="rgba(252, 250, 245, 0.96)",a.stroke();let l=mc;for(let c=0;c<i.length;c++){const u=i[c];/^\d/.test(u)?(a.fillStyle="#3a3226",a.font="bold 30px sans-serif",a.textAlign="left",a.textBaseline="middle",a.fillText(u,l+2,kn/2+1)):mh(a,u,l+Ra/2,kn/2,Ra),l+=s[c]+5}const h=new Q0(r);return h.colorSpace=Ct,h.minFilter=qt,{texture:h,aspect:n/(kn+Ca)}}function u_(i){const e=new Map,t=new w;function n(a,o,l,h={}){s(a);const{texture:c,aspect:u}=h_(l,h.tone||"neutral"),p=new th({map:c,depthTest:!1,transparent:!0}),f=new j0(p);f.renderOrder=20;const v=.6;return f.scale.set(v*u,v,1),f.center.set(.5,0),i.add(f),e.set(a,{sprite:f,mat:p,age:0,ttl:h.ttl??3,anchorH:o,target:a}),f}function s(a){const o=e.get(a);o&&(i.remove(o.sprite),o.mat.map.dispose(),o.mat.dispose(),e.delete(a))}function r(a){for(const o of e.values()){if(o.age+=a,o.age>=o.ttl){s(o.target);continue}const l=Math.min(1,o.age/.18),h=1+Math.sin(Math.min(l,1)*Math.PI)*.12,c=Math.min(1,(o.ttl-o.age)/.3);o.mat.opacity=c;const p=.6*(l*h);o.sprite.scale.set(p*(o.mat.map.image.width/o.mat.map.image.height),p,1),o.target.getWorldPosition(t),o.sprite.position.set(t.x,t.y+o.anchorH+Math.sin(o.age*1.7)*.02,t.z)}}return{say:n,dismiss:s,update:r,live:e}}const f_=120,qi=Math.PI*2,Pa=i=>((i+Math.PI)%qi+qi)%qi-Math.PI;function d_(i,e){const t=_n(e).icon;let n,s="neutral",r="talk";switch(i.type){case"greet":n=[t,"question"],r="browse";break;case"ask":n=[t,"coin",String(i.price)],r="offer";break;case"offer":n=["coin",String(i.price),"question"],r="offer";break;case"counter":n=["coin",String(i.price),"exclaim"],r="talk";break;case"scoff":n=["no","exclaim"],s="bad",r="angry";break;case"accept":n=["yes","coin",String(i.price??"")].filter(Boolean),s="good",r="agree";break;case"reject":n=["no"],s="bad",r="refuse";break;case"walkaway":n=["no",dc[i.mood]||"annoyed"],s="bad",r="refuse";break;default:n=["question"]}return i.mood&&i.mood!=="neutral"&&i.type!=="walkaway"&&i.type!=="scoff"&&(n=[...n,dc[i.mood]]),i.mood==="angry"&&(r="angry"),{tokens:n,tone:s,gesture:r}}function p_({seed:i,world:e,economy:t,bubbles:n,actors:s,onTicker:r}){const a=mn(i^20903),o=new Map(s.map(m=>[m.id,m]));let l=0,h=!0;for(const m of s){if(m.pos={x:0,z:0},m.yaw=0,m.vel={x:0,z:0},m.speed=0,m.state="idle",m.stateT=0,m.until=0,m.target=null,m.gesture="none",m.speakUntil=0,m.lookTarget=null,m.session=null,m.busyWith=null,m.walkSpeed=Se(a,.72,1.05)*(m.role==="customer"?1:.9),m.baseYaw=0,m.role==="vendor"){const y=m.stall.vendorSpot;m.pos={x:y.x,z:y.z},m.yaw=m.baseYaw=y.yaw,m.state="tend",m.until=l+Se(a,2,9)}else if(m.role==="busker"){const y=m.buskerSpot;m.pos={x:y.x,z:y.z},m.yaw=m.baseYaw=y.yaw,m.state="busk",m.gesture=m.char.appearance.instrument==="drum"?"drum":"flute",m.until=l+Se(a,2,5)}else{const y=a()*qi,U=Se(a,3,e.bounds.r*.55);m.pos={x:Math.sin(y)*U,z:Math.cos(y)*U},m.yaw=a()*qi,m.state="idle",m.until=l+Se(a,.5,6)}m.char.group.position.set(m.pos.x,0,m.pos.z),m.char.group.rotation.y=m.yaw}const c=(m,y,U)=>{h&&(m.speakUntil=l+Math.min((U==null?void 0:U.ttl)??2.4,1.6),n.say(m.char.group,m.char.appearance.height+.35,y,U))},u=m=>r&&r(m);function p(m,y){for(const U of e.colliders)if(Math.hypot(m-U.x,y-U.z)<U.r+.45)return!1;return!0}function f(){for(let m=0;m<8;m++){const y=a()*qi,U=Se(a,3,e.bounds.r*.6),k=Math.sin(y)*U,K=Math.cos(y)*U;if(p(k,K))return{x:k,z:K,arriveR:.4}}return null}function v(m,y){const U=m.target;if(!U)return m.speed=0,!0;const k=U.x-m.pos.x,K=U.z-m.pos.z,N=Math.hypot(k,K),B=U.arriveR??.14;if(N<B)return m.speed=0,m.target=null,U.yaw!==void 0&&(m.baseYaw=U.yaw),!0;let G=k/N,Y=K/N;for(const F of e.colliders){const R=m.pos.x-F.x,I=m.pos.z-F.z,C=Math.hypot(R,I),D=F.r+.34;if(C<D&&C>1e-4){const V=(D-C)/D;G+=R/C*V*2.2,Y+=I/C*V*2.2}}for(const F of s){if(F===m||F.role!=="customer")continue;const R=m.pos.x-F.pos.x,I=m.pos.z-F.pos.z,C=R*R+I*I;if(C<.45&&C>1e-6){const D=Math.sqrt(C);G+=R/D*(.67-D)*1.4,Y+=I/D*(.67-D)*1.4}}const te=Math.hypot(G,Y)||1,J=Math.min(m.walkSpeed,N*2.2);m.vel.x=G/te*J,m.vel.z=Y/te*J,m.pos.x+=m.vel.x*y,m.pos.z+=m.vel.z*y;const j=Math.hypot(m.pos.x,m.pos.z);j>e.bounds.r-.5&&(m.pos.x*=(e.bounds.r-.5)/j,m.pos.z*=(e.bounds.r-.5)/j);for(const F of e.colliders){const R=m.pos.x-F.x,I=m.pos.z-F.z,C=Math.hypot(R,I);C<F.r&&C>1e-4&&(m.pos.x=F.x+R/C*F.r,m.pos.z=F.z+I/C*F.r)}return m.speed=J,m.baseYaw=Math.atan2(m.vel.x,m.vel.z),!1}const x=[];function g(m,y,U){const k=t.startHaggle(m.id,y.id,U);return k?(m.session=y.session=k,m.state="haggle",y.busyWith=m,m.lookTarget=y,y.lookTarget=m,x.push({id:k,buyer:m,seller:y,goodId:U,nextAt:l+.4,askSeen:null}),!0):!1}function d(m,y){const{buyer:U,seller:k}=m;U.session=k.session=null,k.busyWith=null,U.lookTarget=k.lookTarget=null,k.gesture="none",k.state="tend",k.until=l+Se(a,1,4),U.state="leave",U.until=l+(y?Se(a,.8,1.6):Se(a,.2,.8)),x.splice(x.indexOf(m),1)}function b(){for(let m=x.length-1;m>=0;m--){const y=x[m];if(l<y.nextAt)continue;const U=t.stepHaggle(y.id);if(!U){d(y,!1);continue}const k=U.speaker==="buyer"?y.buyer:y.seller,K=U.speaker==="buyer"?y.seller:y.buyer,N=d_(U,y.goodId);U.type==="ask"&&y.askSeen===null&&(y.askSeen=U.price),c(k,N.tokens,{tone:N.tone}),k.gesture=N.gesture,K.gesture="none";const B=k===y.buyer?y.buyer.persona.attrs.patience:y.seller.persona.attrs.patience;if(y.nextAt=l+Se(a,1.15,1.5)+B*.55,U.done){const G=_n(y.goodId);U.deal?(h&&(c(y.seller,["coin",String(U.deal.price),"delighted"],{tone:"gold"}),c(y.buyer,[G.icon,"heart"],{tone:"good",ttl:2}),y.buyer.gesture="agree",y.seller.gesture="agree"),u(`${y.buyer.persona.name} bought ${G.name} from ${y.seller.persona.name} for ${U.deal.price}¢`+(y.askSeen&&y.askSeen!==U.deal.price?` (asked ${y.askSeen}¢)`:""))):u(`${y.buyer.persona.name} and ${y.seller.persona.name} fell out over ${G.name}`+(y.askSeen?` at ${y.askSeen}¢`:"")),d(y,!!U.deal)}}}function _(m,y){var U,k,K;switch(m.stateT+=y,m.state){case"tend":{if(l>m.until&&!m.busyWith){const N=ut(a,m.stall.goodIds),B=(U=t.actorState(m.id).asks)==null?void 0:U[N];m.gesture="wave",c(m,[_n(N).icon,...B?["coin",String(B)]:["exclaim"]],{tone:"neutral"}),m.until=l+Se(a,4,10)}else m.gesture==="wave"&&l>m.speakUntil&&(m.gesture="none");break}case"busk":{l>m.until&&(c(m,Ge(a,.3)?["note","note"]:["note"],{tone:"neutral",ttl:1.8}),m.until=l+Se(a,2.4,4.5));break}case"idle":{if(l<m.until)break;const N=t.chooseErrand(m.id);if(N&&N.kind==="buy"){const B=o.get(N.vendorId),G=ut(a,B.stall.browseSpots);m.target={...G,arriveR:.2},m.errand=N,m.state="walkTo",m.stateT=0}else if(N&&N.kind==="watch"&&s.some(B=>B.role==="busker")){const B=ut(a,s.filter(Y=>Y.role==="busker"));let G=null;for(let Y=0;Y<6&&!G;Y++){const te=B.buskerSpot.yaw+Se(a,-.9,.9),J=Se(a,1.5,2.3),j=B.buskerSpot.x+Math.sin(te)*J,F=B.buskerSpot.z+Math.cos(te)*J;p(j,F)&&(G={x:j,z:F,yaw:Pa(te+Math.PI),arriveR:.3})}if(!G){m.until=l+Se(a,1,3);break}m.target=G,m.errand={kind:"watch",buskerId:B.id},m.state="walkTo",m.stateT=0}else{const B=f();if(!B){m.until=l+Se(a,1,3);break}m.target=B,m.errand=null,m.state="walkTo",m.stateT=0}break}case"walkTo":{if(m.stateT>30){m.target=null,m.speed=0,m.errand=null,m.state="idle",m.until=l+Se(a,1,3);break}v(m,y)&&(((k=m.errand)==null?void 0:k.kind)==="buy"?(m.state="browse",m.gesture="browse",m.until=l+Se(a,1.2,2.6),m.lookTarget=o.get(m.errand.vendorId)):((K=m.errand)==null?void 0:K.kind)==="watch"?(m.state="watch",m.until=l+Se(a,4,9),m.lookTarget=o.get(m.errand.buskerId)):(m.state="idle",m.until=l+Se(a,1,5)));break}case"browse":{if(l<m.until)break;const N=o.get(m.errand.vendorId);if(N.busyWith){m.gesture="none",m.state="leave",m.until=l+.5;break}g(m,N,m.errand.goodId)||(h&&c(m,["neutral"],{tone:"neutral",ttl:1.4}),m.gesture="none",m.state="leave",m.until=l+.5);break}case"haggle":break;case"watch":{if(Ge(a,y*.5)&&(m.gesture=m.gesture==="clap"?"none":"clap"),l<m.until)break;const N=o.get(m.errand.buskerId),B=t.tipBusker(m.id,N.id);B>0&&(c(m,["coin",String(B)],{tone:"gold",ttl:1.6}),h&&(c(N,["heart"],{tone:"good",ttl:1.6}),N.gesture="bow",N.until=l+1.4,L(N,1.4)),u(`${m.persona.name} tipped ${N.persona.name} ${B}¢`)),m.gesture="none",m.lookTarget=null,m.state="idle",m.until=l+Se(a,.5,2);break}case"leave":{if(l<m.until)break;m.gesture="none",m.lookTarget=null,m.state="idle",m.until=l+Se(a,.6,3.5);break}}}const M=[];function L(m,y){M.push({at:l+y,actor:m})}function S(){for(let m=M.length-1;m>=0;m--)if(l>=M[m].at){const y=M[m].actor;y.role==="busker"&&(y.gesture=y.char.appearance.instrument==="drum"?"drum":"flute"),M.splice(m,1)}}function P(m,y){l+=y,t.tick(y/f_),b(),S();for(const U of s){_(U,y);let k=U.baseYaw,K=0,N=0;if(U.lookTarget){const B=U.lookTarget.pos.x-U.pos.x,G=U.lookTarget.pos.z-U.pos.z,Y=Math.atan2(B,G);(U.state==="haggle"||U.state==="watch")&&(k=Y),K=Pa(Y-U.yaw),U.state==="browse"&&(N=.35)}U.yaw+=Pa(k-U.yaw)*Math.min(1,y*6),h&&(U.char.group.position.set(U.pos.x,0,U.pos.z),U.char.group.rotation.y=U.yaw,U.char.animator.update(m,y,{speed:U.speed,gesture:U.gesture,speaking:l<U.speakUntil,lookYaw:K,lookPitch:N}))}h&&n.update(y);for(const U of t.drainEvents())if(U.type==="restock"&&Ge(a,.5)){const k=o.get(U.vendorId);k&&u(`${k.persona.name} restocked ${U.count} ${_n(U.goodId).name} (${U.cost}¢ to the caravan)`)}}function W(m,y=5){h=!1;const U=.2;for(let k=0;k<m-y;k+=U)P(k,U);h=!0;for(let k=m-y;k<m;k+=U)P(k,U);for(const k of s)k.char.group.position.set(k.pos.x,0,k.pos.z),k.char.group.rotation.y=k.yaw}return{update:P,preroll:W,actors:s,get now(){return l}}}const La=new Map;function fr(i,e=36){const t=i+e;if(La.has(t))return La.get(t);const n=document.createElement("canvas");n.width=n.height=e*2;const s=n.getContext("2d");s.scale(2,2),mh(s,i,e/2,e/2,e*.92);const r=n.toDataURL();return La.set(t,r),r}const dr=(i,e,t)=>{const n=document.createElement(i);return e&&(n.className=e),t!==void 0&&(n.innerHTML=t),n};function m_({onDeselect:i}){const e=document.getElementById("app"),t=dr("div","hud stats");e.appendChild(t);const n=dr("div","hud ticker");e.appendChild(n);const s=[],r=dr("div","hud panel hidden");e.appendChild(r);const a=dr("div","hud hint","drag to orbit · click a stranger to meet them");e.appendChild(a),setTimeout(()=>a.classList.add("fade"),9e3);function o(f,v){const x=[`<span class="chip">day <b>${f.day.toFixed(1)}</b></span>`,`<span class="chip">deals <b>${f.dealCount}</b></span>`,`<span class="chip">walkaways <b>${f.walkawayCount}</b></span>`,`<span class="chip"><img src="${fr("coin",15)}"> traded <b>${f.volumeCoins}¢</b></span>`,`<span class="chip">supply <b>${f.moneySupply}¢</b></span>`,v?`<span class="chip">${v}</span>`:""];t.innerHTML='<div class="title">The Night Bazaar</div>'+x.join("")}function l(f){s.unshift(f),s.length>7&&s.pop(),n.innerHTML=s.map((v,x)=>`<div class="line" style="opacity:${(1-x*.13).toFixed(2)}">${v}</div>`).join("")}const h=(f,v,x)=>`<div class="attr"><span>${f}</span><div class="bar"><i style="width:${(v*100).toFixed(0)}%;background:hsl(${x},62%,52%)"></i></div></div>`;function c(f,v){const x=f.persona,g=Lg[f.species]||f.species,d=Object.entries(v.inventory||{}).filter(([,_])=>_>0),b=f.role==="vendor"&&v.stock?Object.entries(v.stock).map(([_,M])=>{var S;const L=(S=v.asks)==null?void 0:S[_];return`<div class="invrow"><img src="${fr(_n(_).icon)}"> ×${M} <span class="ask">asking ${L}¢</span></div>`}).join(""):"";r.innerHTML=`
      <button class="close" aria-label="close">×</button>
      <div class="pname">${x.name}</div>
      <div class="ptitle">${g} · ${x.title}</div>
      <p class="story">${x.backstory}</p>
      <div class="attrs">
        ${h("greed",x.attrs.greed,0)}
        ${h("patience",x.attrs.patience,145)}
        ${h("charm",x.attrs.charm,275)}
        ${h("temper",x.attrs.temper,22)}
      </div>
      <div class="wallet"><img src="${fr("coin",17)}"> <b>${v.wallet}¢</b>
        <span class="deals">${v.deals} deal${v.deals===1?"":"s"} · ${v.walkaways} walkaway${v.walkaways===1?"":"s"}</span></div>
      ${b?`<div class="invhead">on the counter</div>${b}`:""}
      ${d.length&&f.role!=="vendor"?'<div class="invhead">in their basket</div><div class="invrow">'+d.map(([_,M])=>`<img title="${_n(_).name}" src="${fr(_n(_).icon)}"><em>×${M}</em>`).join(" ")+"</div>":""}
      <div class="doing">${u(f)}</div>`,r.classList.remove("hidden"),r.querySelector(".close").onclick=()=>{p(),i&&i()}}function u(f){var v,x;switch(f.state){case"haggle":return"currently: haggling";case"walkTo":return((v=f.errand)==null?void 0:v.kind)==="buy"?"currently: heading to a stall":((x=f.errand)==null?void 0:x.kind)==="watch"?"currently: going to hear the busker":"currently: wandering";case"browse":return"currently: eyeing the goods";case"watch":return"currently: enjoying the music";case"tend":return"currently: minding the stall";case"busk":return"currently: performing";default:return"currently: taking in the night air"}}function p(){r.classList.add("hidden")}return{setStats:o,addTicker:l,showActor:c,hideActor:p}}const g_=new URLSearchParams(location.search),Es=(parseInt(g_.get("seed"),10)||7)>>>0,Nr=document.getElementById("scene"),Qi=new eh({canvas:Nr,antialias:!0});Qi.setPixelRatio(Math.min(devicePixelRatio,2));Qi.toneMapping=Ec;Qi.toneMappingExposure=1.55;const di=new q0;di.fog=new Qa(1314856,.0085);const ui=new Yt(46,1,.1,220);ui.position.set(8.8,7.8,11.4);const un=new yg(ui,Nr);un.target.set(0,1.3,0);un.enableDamping=!0;un.dampingFactor=.06;un.maxPolarAngle=Math.PI*.49;un.minDistance=3;un.maxDistance=34;un.autoRotate=!0;un.autoRotateSpeed=.35;function gh(){const i=innerWidth,e=innerHeight;Qi.setSize(i,e,!1),ui.aspect=i/e,ui.updateProjectionMatrix()}addEventListener("resize",gh);gh();const __=mn(Es),zt=[...Ur.map(i=>i.id)];for(let i=zt.length-1;i>0;i--){const e=Math.floor(__()*(i+1));[zt[i],zt[e]]=[zt[e],zt[i]]}const v_=[[zt[0]],[zt[1]],[zt[2]],[zt[3]],[zt[4]],[zt[5]],[zt[6],zt[7]],[zt[8],zt[9]]],es=s_({seed:Es,goods:Ur,stallGoods:v_});di.add(es.group);di.add(new _g(3485774,1.15));const _h=new hh(10336511,.4);_h.position.set(-18,14,-10);di.add(_h);const x_=16,Xa=document.getElementById("load-fill"),vh=document.getElementById("load-sub"),M_=document.getElementById("loading"),Gn=[];es.stalls.forEach((i,e)=>{Gn.push({id:`v${e}`,role:"vendor",stall:i})});es.buskerSpots.slice(0,2).forEach((i,e)=>{Gn.push({id:`b${e}`,role:"busker",buskerSpot:i})});for(let i=0;i<x_;i++)Gn.push({id:`c${i}`,role:"customer"});const Hi=[],xh=[];function y_(i,e){var c;const t=Bt(Es*2654435761+e*97+13),n=mn(t),s=ut(n,Pg),r=Kg({seed:t^48879,species:s,role:i.role}),a=t_(n,{species:s,role:i.role,goodIds:(c=i.stall)==null?void 0:c.goodIds}),o={...i,species:s,char:r,persona:a};di.add(r.group);const l=r.appearance.height,h=new Lt(new nt(.42,.42,l+.15,8),new ci);h.visible=!1,h.position.y=l/2,h.userData.actor=o,r.group.add(h),xh.push(h),Hi.push(o)}let Qn=0;const Ia=["raising the stalls…","waking the vendors…","stitching costumes…","rigging skeletons…","arguing about prices…","counting the float…"];function Mh(){for(let e=0;e<8&&Qn<Gn.length;e++,Qn++)y_(Gn[Qn],Qn);Xa.style.width=`${(Qn/Gn.length*88).toFixed(0)}%`,vh.textContent=Ia[Math.min(Ia.length-1,Math.floor(Qn/Gn.length*Ia.length))],Qn<Gn.length?requestAnimationFrame(Mh):requestAnimationFrame(S_)}requestAnimationFrame(Mh);let Yi=null,ii=null,oi=null,Jt=null;function S_(){ii=c_({seed:Es,goods:Ur,actors:Hi.map(e=>{var t;return{id:e.id,role:e.role,goodIds:(t=e.stall)==null?void 0:t.goodIds,attrs:e.persona.attrs,wealth:e.persona.wealth}})});const i=u_(di);oi=m_({onDeselect:()=>Jt=null}),Yi=p_({seed:Es,world:es,economy:ii,bubbles:i,actors:Hi,onTicker:e=>oi.addTicker(e)}),vh.textContent="letting the market warm up…",Xa.style.width="96%",Yi.preroll(70),Xa.style.width="100%",M_.classList.add("done"),oi.setStats(ii.stats(),`${Hi.length} souls`),window.bazaar={sim:Yi,economy:ii,world:es,actors:Hi,bubbles:i,camera:ui}}const gc=new xg,_c=new fe;let ms=null;Nr.addEventListener("pointerdown",i=>{un.autoRotate=!1,ms=[i.clientX,i.clientY]});Nr.addEventListener("pointerup",i=>{if(!ms||!Yi)return;const e=Math.hypot(i.clientX-ms[0],i.clientY-ms[1]);if(ms=null,e>6)return;_c.set(i.clientX/innerWidth*2-1,-(i.clientY/innerHeight)*2+1),gc.setFromCamera(_c,ui);const t=gc.intersectObjects(xh,!1);t.length?(Jt=t[0].object.userData.actor,oi.showActor(Jt,ii.actorState(Jt.id))):(Jt=null,oi.hideActor())});const vc=new vg;let Da=0;const xc=new w,Mc=.05,b_=8;let yc=0;Qi.setAnimationLoop(()=>{const i=vc.getDelta(),e=vc.elapsedTime;if(Yi){let t=Math.min(i,Mc*b_);for(;t>1e-4;){const n=Math.min(t,Mc);yc+=n,Yi.update(yc,n),t-=n}Da-=i,Da<=0&&(Da=.7,oi.setStats(ii.stats(),`${Hi.length} souls`),Jt&&oi.showActor(Jt,ii.actorState(Jt.id))),Jt&&(xc.set(Jt.pos.x,Jt.char.appearance.height*.62,Jt.pos.z),un.target.lerp(xc,Math.min(1,i*3)))}es.update(e),un.update(),Qi.render(di,ui)});
