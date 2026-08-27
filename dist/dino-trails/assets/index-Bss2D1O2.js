(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const An=11102230246251565e-32,Lt=134217729,yh=(3+8*An)*An;function Nr(i,e,t,n,s){let r,o,a,c,l=e[0],h=n[0],u=0,d=0;h>l==h>-l?(r=l,l=e[++u]):(r=h,h=n[++d]);let f=0;if(u<i&&d<t)for(h>l==h>-l?(o=l+r,a=r-(o-l),l=e[++u]):(o=h+r,a=r-(o-h),h=n[++d]),r=o,a!==0&&(s[f++]=a);u<i&&d<t;)h>l==h>-l?(o=r+l,c=o-r,a=r-(o-c)+(l-c),l=e[++u]):(o=r+h,c=o-r,a=r-(o-c)+(h-c),h=n[++d]),r=o,a!==0&&(s[f++]=a);for(;u<i;)o=r+l,c=o-r,a=r-(o-c)+(l-c),l=e[++u],r=o,a!==0&&(s[f++]=a);for(;d<t;)o=r+h,c=o-r,a=r-(o-c)+(h-c),h=n[++d],r=o,a!==0&&(s[f++]=a);return(r!==0||f===0)&&(s[f++]=r),f}function Sh(i,e){let t=e[0];for(let n=1;n<i;n++)t+=e[n];return t}function Ss(i){return new Float64Array(i)}const Eh=(3+16*An)*An,bh=(2+12*An)*An,Th=(9+64*An)*An*An,gi=Ss(4),_o=Ss(8),vo=Ss(12),xo=Ss(16),Ot=Ss(4);function wh(i,e,t,n,s,r,o){let a,c,l,h,u,d,f,g,_,m,p,M,x,S,C,w,A,k;const v=i-s,y=t-s,L=e-r,N=n-r;S=v*N,d=Lt*v,f=d-(d-v),g=v-f,d=Lt*N,_=d-(d-N),m=N-_,C=g*m-(S-f*_-g*_-f*m),w=L*y,d=Lt*L,f=d-(d-L),g=L-f,d=Lt*y,_=d-(d-y),m=y-_,A=g*m-(w-f*_-g*_-f*m),p=C-A,u=C-p,gi[0]=C-(p+u)+(u-A),M=S+p,u=M-S,x=S-(M-u)+(p-u),p=x-w,u=x-p,gi[1]=x-(p+u)+(u-w),k=M+p,u=k-M,gi[2]=M-(k-u)+(p-u),gi[3]=k;let G=Sh(4,gi),P=bh*o;if(G>=P||-G>=P||(u=i-v,a=i-(v+u)+(u-s),u=t-y,l=t-(y+u)+(u-s),u=e-L,c=e-(L+u)+(u-r),u=n-N,h=n-(N+u)+(u-r),a===0&&c===0&&l===0&&h===0)||(P=Th*o+yh*Math.abs(G),G+=v*h+N*a-(L*l+y*c),G>=P||-G>=P))return G;S=a*N,d=Lt*a,f=d-(d-a),g=a-f,d=Lt*N,_=d-(d-N),m=N-_,C=g*m-(S-f*_-g*_-f*m),w=c*y,d=Lt*c,f=d-(d-c),g=c-f,d=Lt*y,_=d-(d-y),m=y-_,A=g*m-(w-f*_-g*_-f*m),p=C-A,u=C-p,Ot[0]=C-(p+u)+(u-A),M=S+p,u=M-S,x=S-(M-u)+(p-u),p=x-w,u=x-p,Ot[1]=x-(p+u)+(u-w),k=M+p,u=k-M,Ot[2]=M-(k-u)+(p-u),Ot[3]=k;const F=Nr(4,gi,4,Ot,_o);S=v*h,d=Lt*v,f=d-(d-v),g=v-f,d=Lt*h,_=d-(d-h),m=h-_,C=g*m-(S-f*_-g*_-f*m),w=L*l,d=Lt*L,f=d-(d-L),g=L-f,d=Lt*l,_=d-(d-l),m=l-_,A=g*m-(w-f*_-g*_-f*m),p=C-A,u=C-p,Ot[0]=C-(p+u)+(u-A),M=S+p,u=M-S,x=S-(M-u)+(p-u),p=x-w,u=x-p,Ot[1]=x-(p+u)+(u-w),k=M+p,u=k-M,Ot[2]=M-(k-u)+(p-u),Ot[3]=k;const O=Nr(F,_o,4,Ot,vo);S=a*h,d=Lt*a,f=d-(d-a),g=a-f,d=Lt*h,_=d-(d-h),m=h-_,C=g*m-(S-f*_-g*_-f*m),w=c*l,d=Lt*c,f=d-(d-c),g=c-f,d=Lt*l,_=d-(d-l),m=l-_,A=g*m-(w-f*_-g*_-f*m),p=C-A,u=C-p,Ot[0]=C-(p+u)+(u-A),M=S+p,u=M-S,x=S-(M-u)+(p-u),p=x-w,u=x-p,Ot[1]=x-(p+u)+(u-w),k=M+p,u=k-M,Ot[2]=M-(k-u)+(p-u),Ot[3]=k;const X=Nr(O,vo,4,Ot,xo);return xo[X-1]}function Rs(i,e,t,n,s,r){const o=(e-r)*(t-s),a=(i-s)*(n-r),c=o-a,l=Math.abs(o+a);return Math.abs(c)>=Eh*l?c:-wh(i,e,t,n,s,r,l)}const Mo=Math.pow(2,-52),Cs=new Uint32Array(512);class hr{static from(e,t=Lh,n=Dh){const s=e.length,r=new Float64Array(s*2);for(let o=0;o<s;o++){const a=e[o];r[2*o]=t(a),r[2*o+1]=n(a)}return new hr(r)}constructor(e){const t=e.length>>1;if(t>0&&typeof e[0]!="number")throw new Error("Expected coords to contain numbers.");this.coords=e;const n=Math.max(2*t-5,0);this._triangles=new Uint32Array(n*3),this._halfedges=new Int32Array(n*3),this._hashSize=Math.ceil(Math.sqrt(t)),this._hullPrev=new Uint32Array(t),this._hullNext=new Uint32Array(t),this._hullTri=new Uint32Array(t),this._hullHash=new Int32Array(this._hashSize),this._ids=new Uint32Array(t),this._dists=new Float64Array(t),this.trianglesLen=0,this._cx=0,this._cy=0,this._hullStart=0,this.hull=this._triangles,this.triangles=this._triangles,this.halfedges=this._halfedges,this.update()}update(){const{coords:e,_hullPrev:t,_hullNext:n,_hullTri:s,_hullHash:r}=this,o=e.length>>1;let a=1/0,c=1/0,l=-1/0,h=-1/0;for(let v=0;v<o;v++){const y=e[2*v],L=e[2*v+1];y<a&&(a=y),L<c&&(c=L),y>l&&(l=y),L>h&&(h=L),this._ids[v]=v}const u=(a+l)/2,d=(c+h)/2;let f=0,g=0,_=0;for(let v=0,y=1/0;v<o;v++){const L=Or(u,d,e[2*v],e[2*v+1]);L<y&&(f=v,y=L)}const m=e[2*f],p=e[2*f+1];for(let v=0,y=1/0;v<o;v++){if(v===f)continue;const L=Or(m,p,e[2*v],e[2*v+1]);L<y&&L>0&&(g=v,y=L)}let M=e[2*g],x=e[2*g+1],S=1/0;for(let v=0;v<o;v++){if(v===f||v===g)continue;const y=Ch(m,p,M,x,e[2*v],e[2*v+1]);y<S&&(_=v,S=y)}let C=e[2*_],w=e[2*_+1];if(S===1/0){for(let L=0;L<o;L++)this._dists[L]=e[2*L]-e[0]||e[2*L+1]-e[1];Bi(this._ids,this._dists,0,o-1);const v=new Uint32Array(o);let y=0;for(let L=0,N=-1/0;L<o;L++){const G=this._ids[L],P=this._dists[G];P>N&&(v[y++]=G,N=P)}this.hull=v.subarray(0,y),this.triangles=new Uint32Array(0),this.halfedges=new Int32Array(0);return}if(Rs(m,p,M,x,C,w)<0){const v=g,y=M,L=x;g=_,M=C,x=w,_=v,C=y,w=L}const A=Ph(m,p,M,x,C,w);this._cx=A.x,this._cy=A.y;for(let v=0;v<o;v++)this._dists[v]=Or(e[2*v],e[2*v+1],A.x,A.y);Bi(this._ids,this._dists,0,o-1),this._hullStart=f;let k=3;n[f]=t[_]=g,n[g]=t[f]=_,n[_]=t[g]=f,s[f]=0,s[g]=1,s[_]=2,r.fill(-1),r[this._hashKey(m,p)]=f,r[this._hashKey(M,x)]=g,r[this._hashKey(C,w)]=_,this.trianglesLen=0,this._addTriangle(f,g,_,-1,-1,-1);for(let v=0,y=0,L=0;v<this._ids.length;v++){const N=this._ids[v],G=e[2*N],P=e[2*N+1];if(v>0&&Math.abs(G-y)<=Mo&&Math.abs(P-L)<=Mo||(y=G,L=P,N===f||N===g||N===_))continue;let F=0;for(let K=0,se=this._hashKey(G,P);K<this._hashSize&&(F=r[(se+K)%this._hashSize],!(F!==-1&&F!==n[F]));K++);F=t[F];let O=F,X;for(;X=n[O],Rs(G,P,e[2*O],e[2*O+1],e[2*X],e[2*X+1])>=0;)if(O=X,O===F){O=-1;break}if(O===-1)continue;let q=this._addTriangle(O,N,n[O],-1,-1,s[O]);s[N]=this._legalize(q+2),s[O]=q,k++;let Y=n[O];for(;X=n[Y],Rs(G,P,e[2*Y],e[2*Y+1],e[2*X],e[2*X+1])<0;)q=this._addTriangle(Y,N,X,s[N],-1,s[Y]),s[N]=this._legalize(q+2),n[Y]=Y,k--,Y=X;if(O===F)for(;X=t[O],Rs(G,P,e[2*X],e[2*X+1],e[2*O],e[2*O+1])<0;)q=this._addTriangle(X,N,O,-1,s[O],s[X]),this._legalize(q+2),s[X]=q,n[O]=O,k--,O=X;this._hullStart=t[N]=O,n[O]=t[Y]=N,n[N]=Y,r[this._hashKey(G,P)]=N,r[this._hashKey(e[2*O],e[2*O+1])]=O}this.hull=new Uint32Array(k);for(let v=0,y=this._hullStart;v<k;v++)this.hull[v]=y,y=n[y];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(e,t){return Math.floor(Ah(e-this._cx,t-this._cy)*this._hashSize)%this._hashSize}_legalize(e){const{_triangles:t,_halfedges:n,coords:s}=this;let r=0,o=0;for(;;){const a=n[e],c=e-e%3;if(o=c+(e+2)%3,a===-1){if(r===0)break;e=Cs[--r];continue}const l=a-a%3,h=c+(e+1)%3,u=l+(a+2)%3,d=t[o],f=t[e],g=t[h],_=t[u];if(Rh(s[2*d],s[2*d+1],s[2*f],s[2*f+1],s[2*g],s[2*g+1],s[2*_],s[2*_+1])){t[e]=_,t[a]=d;const p=n[u];if(p===-1){let x=this._hullStart;do{if(this._hullTri[x]===u){this._hullTri[x]=e;break}x=this._hullPrev[x]}while(x!==this._hullStart)}this._link(e,p),this._link(a,n[o]),this._link(o,u);const M=l+(a+1)%3;r<Cs.length&&(Cs[r++]=M)}else{if(r===0)break;e=Cs[--r]}}return o}_link(e,t){this._halfedges[e]=t,t!==-1&&(this._halfedges[t]=e)}_addTriangle(e,t,n,s,r,o){const a=this.trianglesLen;return this._triangles[a]=e,this._triangles[a+1]=t,this._triangles[a+2]=n,this._link(a,s),this._link(a+1,r),this._link(a+2,o),this.trianglesLen+=3,a}}function Ah(i,e){const t=i/(Math.abs(i)+Math.abs(e));return(e>0?3-t:1+t)/4}function Or(i,e,t,n){const s=i-t,r=e-n;return s*s+r*r}function Rh(i,e,t,n,s,r,o,a){const c=i-o,l=e-a,h=t-o,u=n-a,d=s-o,f=r-a,g=c*c+l*l,_=h*h+u*u,m=d*d+f*f;return c*(u*m-_*f)-l*(h*m-_*d)+g*(h*f-u*d)<0}function Ch(i,e,t,n,s,r){const o=t-i,a=n-e,c=s-i,l=r-e,h=o*o+a*a,u=c*c+l*l,d=.5/(o*l-a*c),f=(l*h-a*u)*d,g=(o*u-c*h)*d;return f*f+g*g}function Ph(i,e,t,n,s,r){const o=t-i,a=n-e,c=s-i,l=r-e,h=o*o+a*a,u=c*c+l*l,d=.5/(o*l-a*c),f=i+(l*h-a*u)*d,g=e+(o*u-c*h)*d;return{x:f,y:g}}function Bi(i,e,t,n){if(n-t<=20)for(let s=t+1;s<=n;s++){const r=i[s],o=e[r];let a=s-1;for(;a>=t&&e[i[a]]>o;)i[a+1]=i[a--];i[a+1]=r}else{const s=t+n>>1;let r=t+1,o=n;ts(i,s,r),e[i[t]]>e[i[n]]&&ts(i,t,n),e[i[r]]>e[i[n]]&&ts(i,r,n),e[i[t]]>e[i[r]]&&ts(i,t,r);const a=i[r],c=e[a];for(;;){do r++;while(e[i[r]]<c);do o--;while(e[i[o]]>c);if(o<r)break;ts(i,r,o)}i[t+1]=i[o],i[o]=a,n-r+1>=o-t?(Bi(i,e,r,n),Bi(i,e,t,o-1)):(Bi(i,e,t,o-1),Bi(i,e,r,n))}}function ts(i,e,t){const n=i[e];i[e]=i[t],i[t]=n}function Lh(i){return i[0]}function Dh(i){return i[1]}const yo=1e-6;let ri=class{constructor(){this._x0=this._y0=this._x1=this._y1=null,this._=""}moveTo(e,t){this._+=`M${this._x0=this._x1=+e},${this._y0=this._y1=+t}`}closePath(){this._x1!==null&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")}lineTo(e,t){this._+=`L${this._x1=+e},${this._y1=+t}`}arc(e,t,n){e=+e,t=+t,n=+n;const s=e+n,r=t;if(n<0)throw new Error("negative radius");this._x1===null?this._+=`M${s},${r}`:(Math.abs(this._x1-s)>yo||Math.abs(this._y1-r)>yo)&&(this._+="L"+s+","+r),n&&(this._+=`A${n},${n},0,1,1,${e-n},${t}A${n},${n},0,1,1,${this._x1=s},${this._y1=r}`)}rect(e,t,n,s){this._+=`M${this._x0=this._x1=+e},${this._y0=this._y1=+t}h${+n}v${+s}h${-n}Z`}value(){return this._||null}};class Sa{constructor(){this._=[]}moveTo(e,t){this._.push([e,t])}closePath(){this._.push(this._[0].slice())}lineTo(e,t){this._.push([e,t])}value(){return this._.length?this._:null}}class Uh{constructor(e,[t,n,s,r]=[0,0,960,500]){if(!((s=+s)>=(t=+t))||!((r=+r)>=(n=+n)))throw new Error("invalid bounds");this.delaunay=e,this._circumcenters=new Float64Array(e.points.length*2),this.vectors=new Float64Array(e.points.length*2),this.xmax=s,this.xmin=t,this.ymax=r,this.ymin=n,this._init()}update(){return this.delaunay.update(),this._init(),this}_init(){const{delaunay:{points:e,hull:t,triangles:n},vectors:s}=this;let r,o;const a=this.circumcenters=this._circumcenters.subarray(0,n.length/3*2);for(let _=0,m=0,p=n.length,M,x;_<p;_+=3,m+=2){const S=n[_]*2,C=n[_+1]*2,w=n[_+2]*2,A=e[S],k=e[S+1],v=e[C],y=e[C+1],L=e[w],N=e[w+1],G=v-A,P=y-k,F=L-A,O=N-k,X=(G*O-P*F)*2;if(Math.abs(X)<1e-9){if(r===void 0){r=o=0;for(const Y of t)r+=e[Y*2],o+=e[Y*2+1];r/=t.length,o/=t.length}const q=1e9*Math.sign((r-A)*O-(o-k)*F);M=(A+L)/2-q*O,x=(k+N)/2+q*F}else{const q=1/X,Y=G*G+P*P,K=F*F+O*O;M=A+(O*Y-P*K)*q,x=k+(G*K-F*Y)*q}a[m]=M,a[m+1]=x}let c=t[t.length-1],l,h=c*4,u,d=e[2*c],f,g=e[2*c+1];s.fill(0);for(let _=0;_<t.length;++_)c=t[_],l=h,u=d,f=g,h=c*4,d=e[2*c],g=e[2*c+1],s[l+2]=s[h]=f-g,s[l+3]=s[h+1]=d-u}render(e){const t=e==null?e=new ri:void 0,{delaunay:{halfedges:n,inedges:s,hull:r},circumcenters:o,vectors:a}=this;if(r.length<=1)return null;for(let h=0,u=n.length;h<u;++h){const d=n[h];if(d<h)continue;const f=Math.floor(h/3)*2,g=Math.floor(d/3)*2,_=o[f],m=o[f+1],p=o[g],M=o[g+1];this._renderSegment(_,m,p,M,e)}let c,l=r[r.length-1];for(let h=0;h<r.length;++h){c=l,l=r[h];const u=Math.floor(s[l]/3)*2,d=o[u],f=o[u+1],g=c*4,_=this._project(d,f,a[g+2],a[g+3]);_&&this._renderSegment(d,f,_[0],_[1],e)}return t&&t.value()}renderBounds(e){const t=e==null?e=new ri:void 0;return e.rect(this.xmin,this.ymin,this.xmax-this.xmin,this.ymax-this.ymin),t&&t.value()}renderCell(e,t){const n=t==null?t=new ri:void 0,s=this._clip(e);if(s===null||!s.length)return;t.moveTo(s[0],s[1]);let r=s.length;for(;s[0]===s[r-2]&&s[1]===s[r-1]&&r>1;)r-=2;for(let o=2;o<r;o+=2)(s[o]!==s[o-2]||s[o+1]!==s[o-1])&&t.lineTo(s[o],s[o+1]);return t.closePath(),n&&n.value()}*cellPolygons(){const{delaunay:{points:e}}=this;for(let t=0,n=e.length/2;t<n;++t){const s=this.cellPolygon(t);s&&(s.index=t,yield s)}}cellPolygon(e){const t=new Sa;return this.renderCell(e,t),t.value()}_renderSegment(e,t,n,s,r){let o;const a=this._regioncode(e,t),c=this._regioncode(n,s);a===0&&c===0?(r.moveTo(e,t),r.lineTo(n,s)):(o=this._clipSegment(e,t,n,s,a,c))&&(r.moveTo(o[0],o[1]),r.lineTo(o[2],o[3]))}contains(e,t,n){return t=+t,t!==t||(n=+n,n!==n)?!1:this.delaunay._step(e,t,n)===e}*neighbors(e){const t=this._clip(e);if(t)for(const n of this.delaunay.neighbors(e)){const s=this._clip(n);if(s){e:for(let r=0,o=t.length;r<o;r+=2)for(let a=0,c=s.length;a<c;a+=2)if(t[r]===s[a]&&t[r+1]===s[a+1]&&t[(r+2)%o]===s[(a+c-2)%c]&&t[(r+3)%o]===s[(a+c-1)%c]){yield n;break e}}}}_cell(e){const{circumcenters:t,delaunay:{inedges:n,halfedges:s,triangles:r}}=this,o=n[e];if(o===-1)return null;const a=[];let c=o;do{const l=Math.floor(c/3);if(a.push(t[l*2],t[l*2+1]),c=c%3===2?c-2:c+1,r[c]!==e)break;c=s[c]}while(c!==o&&c!==-1);return a}_clip(e){if(e===0&&this.delaunay.hull.length===1)return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];const t=this._cell(e);if(t===null)return null;const{vectors:n}=this,s=e*4;return this._simplify(n[s]||n[s+1]?this._clipInfinite(e,t,n[s],n[s+1],n[s+2],n[s+3]):this._clipFinite(e,t))}_clipFinite(e,t){const n=t.length;let s=null,r,o,a=t[n-2],c=t[n-1],l,h=this._regioncode(a,c),u,d=0;for(let f=0;f<n;f+=2)if(r=a,o=c,a=t[f],c=t[f+1],l=h,h=this._regioncode(a,c),l===0&&h===0)u=d,d=0,s?s.push(a,c):s=[a,c];else{let g,_,m,p,M;if(l===0){if((g=this._clipSegment(r,o,a,c,l,h))===null)continue;[_,m,p,M]=g}else{if((g=this._clipSegment(a,c,r,o,h,l))===null)continue;[p,M,_,m]=g,u=d,d=this._edgecode(_,m),u&&d&&this._edge(e,u,d,s,s.length),s?s.push(_,m):s=[_,m]}u=d,d=this._edgecode(p,M),u&&d&&this._edge(e,u,d,s,s.length),s?s.push(p,M):s=[p,M]}if(s)u=d,d=this._edgecode(s[0],s[1]),u&&d&&this._edge(e,u,d,s,s.length);else if(this.contains(e,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2))return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];return s}_clipSegment(e,t,n,s,r,o){const a=r<o;for(a&&([e,t,n,s,r,o]=[n,s,e,t,o,r]);;){if(r===0&&o===0)return a?[n,s,e,t]:[e,t,n,s];if(r&o)return null;let c,l,h=r||o;h&8?(c=e+(n-e)*(this.ymax-t)/(s-t),l=this.ymax):h&4?(c=e+(n-e)*(this.ymin-t)/(s-t),l=this.ymin):h&2?(l=t+(s-t)*(this.xmax-e)/(n-e),c=this.xmax):(l=t+(s-t)*(this.xmin-e)/(n-e),c=this.xmin),r?(e=c,t=l,r=this._regioncode(e,t)):(n=c,s=l,o=this._regioncode(n,s))}}_clipInfinite(e,t,n,s,r,o){let a=Array.from(t),c;if((c=this._project(a[0],a[1],n,s))&&a.unshift(c[0],c[1]),(c=this._project(a[a.length-2],a[a.length-1],r,o))&&a.push(c[0],c[1]),a=this._clipFinite(e,a))for(let l=0,h=a.length,u,d=this._edgecode(a[h-2],a[h-1]);l<h;l+=2)u=d,d=this._edgecode(a[l],a[l+1]),u&&d&&(l=this._edge(e,u,d,a,l),h=a.length);else this.contains(e,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2)&&(a=[this.xmin,this.ymin,this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax]);return a}_edge(e,t,n,s,r){for(;t!==n;){let o,a;switch(t){case 5:t=4;continue;case 4:t=6,o=this.xmax,a=this.ymin;break;case 6:t=2;continue;case 2:t=10,o=this.xmax,a=this.ymax;break;case 10:t=8;continue;case 8:t=9,o=this.xmin,a=this.ymax;break;case 9:t=1;continue;case 1:t=5,o=this.xmin,a=this.ymin;break}(s[r]!==o||s[r+1]!==a)&&this.contains(e,o,a)&&(s.splice(r,0,o,a),r+=2)}return r}_project(e,t,n,s){let r=1/0,o,a,c;if(s<0){if(t<=this.ymin)return null;(o=(this.ymin-t)/s)<r&&(c=this.ymin,a=e+(r=o)*n)}else if(s>0){if(t>=this.ymax)return null;(o=(this.ymax-t)/s)<r&&(c=this.ymax,a=e+(r=o)*n)}if(n>0){if(e>=this.xmax)return null;(o=(this.xmax-e)/n)<r&&(a=this.xmax,c=t+(r=o)*s)}else if(n<0){if(e<=this.xmin)return null;(o=(this.xmin-e)/n)<r&&(a=this.xmin,c=t+(r=o)*s)}return[a,c]}_edgecode(e,t){return(e===this.xmin?1:e===this.xmax?2:0)|(t===this.ymin?4:t===this.ymax?8:0)}_regioncode(e,t){return(e<this.xmin?1:e>this.xmax?2:0)|(t<this.ymin?4:t>this.ymax?8:0)}_simplify(e){if(e&&e.length>4){for(let t=0;t<e.length;t+=2){const n=(t+2)%e.length,s=(t+4)%e.length;(e[t]===e[n]&&e[n]===e[s]||e[t+1]===e[n+1]&&e[n+1]===e[s+1])&&(e.splice(n,2),t-=2)}e.length||(e=null)}return e}}const Ih=2*Math.PI,_i=Math.pow;function Nh(i){return i[0]}function Oh(i){return i[1]}function Fh(i){const{triangles:e,coords:t}=i;for(let n=0;n<e.length;n+=3){const s=2*e[n],r=2*e[n+1],o=2*e[n+2];if((t[o]-t[s])*(t[r+1]-t[s+1])-(t[r]-t[s])*(t[o+1]-t[s+1])>1e-10)return!1}return!0}function kh(i,e,t){return[i+Math.sin(i+e)*t,e+Math.cos(i-e)*t]}class ur{static from(e,t=Nh,n=Oh,s){return new ur("length"in e?Bh(e,t,n,s):Float64Array.from(zh(e,t,n,s)))}constructor(e){this._delaunator=new hr(e),this.inedges=new Int32Array(e.length/2),this._hullIndex=new Int32Array(e.length/2),this.points=this._delaunator.coords,this._init()}update(){return this._delaunator.update(),this._init(),this}_init(){const e=this._delaunator,t=this.points;if(e.hull&&e.hull.length>2&&Fh(e)){this.collinear=Int32Array.from({length:t.length/2},(d,f)=>f).sort((d,f)=>t[2*d]-t[2*f]||t[2*d+1]-t[2*f+1]);const c=this.collinear[0],l=this.collinear[this.collinear.length-1],h=[t[2*c],t[2*c+1],t[2*l],t[2*l+1]],u=1e-8*Math.hypot(h[3]-h[1],h[2]-h[0]);for(let d=0,f=t.length/2;d<f;++d){const g=kh(t[2*d],t[2*d+1],u);t[2*d]=g[0],t[2*d+1]=g[1]}this._delaunator=new hr(t)}else delete this.collinear;const n=this.halfedges=this._delaunator.halfedges,s=this.hull=this._delaunator.hull,r=this.triangles=this._delaunator.triangles,o=this.inedges.fill(-1),a=this._hullIndex.fill(-1);for(let c=0,l=n.length;c<l;++c){const h=r[c%3===2?c-2:c+1];(n[c]===-1||o[h]===-1)&&(o[h]=c)}for(let c=0,l=s.length;c<l;++c)a[s[c]]=c;s.length<=2&&s.length>0&&(this.triangles=new Int32Array(3).fill(-1),this.halfedges=new Int32Array(3).fill(-1),this.triangles[0]=s[0],o[s[0]]=1,s.length===2&&(o[s[1]]=0,this.triangles[1]=s[1],this.triangles[2]=s[1]))}voronoi(e){return new Uh(this,e)}*neighbors(e){const{inedges:t,hull:n,_hullIndex:s,halfedges:r,triangles:o,collinear:a}=this;if(a){const u=a.indexOf(e);u>0&&(yield a[u-1]),u<a.length-1&&(yield a[u+1]);return}const c=t[e];if(c===-1)return;let l=c,h=-1;do{if(yield h=o[l],l=l%3===2?l-2:l+1,o[l]!==e)return;if(l=r[l],l===-1){const u=n[(s[e]+1)%n.length];u!==h&&(yield u);return}}while(l!==c)}find(e,t,n=0){if(e=+e,e!==e||(t=+t,t!==t))return-1;const s=n;let r;for(;(r=this._step(n,e,t))>=0&&r!==n&&r!==s;)n=r;return r}_step(e,t,n){const{inedges:s,hull:r,_hullIndex:o,halfedges:a,triangles:c,points:l}=this;if(s[e]===-1||!l.length)return(e+1)%(l.length>>1);let h=e,u=_i(t-l[e*2],2)+_i(n-l[e*2+1],2);const d=s[e];let f=d;do{let g=c[f];const _=_i(t-l[g*2],2)+_i(n-l[g*2+1],2);if(_<u&&(u=_,h=g),f=f%3===2?f-2:f+1,c[f]!==e)break;if(f=a[f],f===-1){if(f=r[(o[e]+1)%r.length],f!==g&&_i(t-l[f*2],2)+_i(n-l[f*2+1],2)<u)return f;break}}while(f!==d);return h}render(e){const t=e==null?e=new ri:void 0,{points:n,halfedges:s,triangles:r}=this;for(let o=0,a=s.length;o<a;++o){const c=s[o];if(c<o)continue;const l=r[o]*2,h=r[c]*2;e.moveTo(n[l],n[l+1]),e.lineTo(n[h],n[h+1])}return this.renderHull(e),t&&t.value()}renderPoints(e,t){t===void 0&&(!e||typeof e.moveTo!="function")&&(t=e,e=null),t=t==null?2:+t;const n=e==null?e=new ri:void 0,{points:s}=this;for(let r=0,o=s.length;r<o;r+=2){const a=s[r],c=s[r+1];e.moveTo(a+t,c),e.arc(a,c,t,0,Ih)}return n&&n.value()}renderHull(e){const t=e==null?e=new ri:void 0,{hull:n,points:s}=this,r=n[0]*2,o=n.length;e.moveTo(s[r],s[r+1]);for(let a=1;a<o;++a){const c=2*n[a];e.lineTo(s[c],s[c+1])}return e.closePath(),t&&t.value()}hullPolygon(){const e=new Sa;return this.renderHull(e),e.value()}renderTriangle(e,t){const n=t==null?t=new ri:void 0,{points:s,triangles:r}=this,o=r[e*=3]*2,a=r[e+1]*2,c=r[e+2]*2;return t.moveTo(s[o],s[o+1]),t.lineTo(s[a],s[a+1]),t.lineTo(s[c],s[c+1]),t.closePath(),n&&n.value()}*trianglePolygons(){const{triangles:e}=this;for(let t=0,n=e.length/3;t<n;++t)yield this.trianglePolygon(t)}trianglePolygon(e){const t=new Sa;return this.renderTriangle(e,t),t.value()}}function Bh(i,e,t,n){const s=i.length,r=new Float64Array(s*2);for(let o=0;o<s;++o){const a=i[o];r[o*2]=e.call(n,a,o,i),r[o*2+1]=t.call(n,a,o,i)}return r}function*zh(i,e,t,n){let s=0;for(const r of i)yield e.call(n,r,s,i),yield t.call(n,r,s,i),++s}function Hh(i){let e=i>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const Ct=29;function Gh(i){const t=.5+i()*1.5,n=i()*Math.PI*2,s=[];for(let r=0;r<24;r++){const o=r/24*Math.PI*2,a=Ct+Math.sin(o*2+n)*t+Math.sin(o*3+n*1.7)*t*.5;s.push([Math.sin(o)*a,Math.cos(o)*-a])}return s}function Vh(i,e,t){for(let n=0;n<i.length;n++){const[s,r]=i[n],[o,a]=i[(n+1)%i.length];if((o-s)*(t-r)-(a-r)*(e-s)<0)return!1}return!0}function Wh(i,e){let t=i;for(let n=0;n<e.length&&t.length;n++){const[s,r]=e[n],[o,a]=e[(n+1)%e.length],c=([u,d])=>(o-s)*(d-r)-(a-r)*(u-s)>=0,l=(u,d)=>{const f=d[0]-u[0],g=d[1]-u[1],_=(o-s)*g-(a-r)*f,m=_===0?0:((o-s)*(u[1]-r)-(a-r)*(u[0]-s))/-_;return[u[0]+f*m,u[1]+g*m]},h=[];for(let u=0;u<t.length;u++){const d=t[u],f=t[(u+1)%t.length];c(d)?(h.push(d),c(f)||h.push(l(d,f))):c(f)&&h.push(l(d,f))}t=h}return t}function Xh(i){let e=0;for(let t=0;t<i.length;t++){const[n,s]=i[t],[r,o]=i[(t+1)%i.length];e+=n*o-r*s}return Math.abs(e)/2}function So(i){let e=0,t=0;for(const[n,s]of i)e+=n,t+=s;return[e/i.length,t/i.length]}function $h(i,[e,t]){let n=1/0;for(let s=0;s<i.length;s++){const[r,o]=i[s],[a,c]=i[(s+1)%i.length],l=a-r,h=c-o,u=l*l+h*h,d=u?Math.max(0,Math.min(1,((e-r)*l+(t-o)*h)/u)):0,f=r+l*d,g=o+h*d;n=Math.min(n,Math.hypot(e-f,t-g))}return n}function Yh(i){const e=Hh(i),t=Gh(e),n=[];for(let p=-Ct;p<=Ct;p+=7.2)for(let M=-Ct;M<=Ct;M+=7.2)(M+Ct)/(2*Ct)>.62&&e()<.35&&n.push([p+(e()-.5)*5.2,M+(e()-.5)*5.2]),n.push([p+(e()-.5)*5.2,M+(e()-.5)*5.2]);let r=n.filter(([p,M])=>Vh(t,p*1.12,M*1.12));for(let p=0;p<1;p++){const x=ur.from(r).voronoi([-Ct-6,-Ct-6,Ct+6,Ct+6]);r=r.map((S,C)=>{const w=x.cellPolygon(C);if(!w)return S;const[A,k]=So(w.slice(0,-1));return[(S[0]+A)/2,(S[1]+k)/2]})}const a=ur.from(r).voronoi([-Ct-6,-Ct-6,Ct+6,Ct+6]),c=new Map,l=[],h=(p,M)=>{const x=`${p.toFixed(2)}|${M.toFixed(2)}`;return c.has(x)||(c.set(x,l.length),l.push([p,M])),c.get(x)},u=[],d=new Map;for(let p=0;p<r.length;p++){const M=a.cellPolygon(p);if(!M)continue;const x=Wh(M.slice(0,-1),t);if(x.length<3)continue;const S=Xh(x);if(S<6)continue;const C=So(x),w=x.map(([k,v])=>h(k,v)),A=u.length;for(let k=0;k<w.length;k++){const v=w[k],y=w[(k+1)%w.length];if(v===y)continue;const L=v<y?`${v}-${y}`:`${y}-${v}`;d.has(L)||d.set(L,{key:L,a:Math.min(v,y),b:Math.max(v,y),cells:[]}),d.get(L).cells.push(A)}u.push({id:A,poly:x,vertIds:w,centroid:C,area:S,inradius:$h(x,C),elev:.3+e()*.14,terrain:"meadow",neighbors:[]})}const f=[...d.values()];for(const p of f)if(p.length=Math.hypot(l[p.a][0]-l[p.b][0],l[p.a][1]-l[p.b][1]),p.cells.length===2){const[M,x]=p.cells;u[M].neighbors.push(x),u[x].neighbors.push(M)}const g=u.filter(p=>Math.hypot(p.centroid[0],p.centroid[1])<Ct-8&&p.centroid[1]<8);for(let p=0;p<2&&g.length;p++){const M=g[Math.floor(e()*g.length)];M.terrain==="meadow"&&(M.terrain="water",M.elev=.16)}for(let p=0;p<3;p++){const M=u[Math.floor(e()*u.length)];if(M.terrain==="meadow"){M.terrain="forest";for(const x of M.neighbors)u[x].terrain==="meadow"&&e()<.5&&(u[x].terrain="forest")}}for(const p of u)p.terrain==="meadow"&&e()<.1&&(p.terrain="rock");let _=0;for(let p=0;p<l.length;p++)l[p][1]>l[_][1]&&(_=p);const m=l.map(()=>[]);for(const p of f)m[p.a].push({to:p.b,len:p.length,key:p.key}),m[p.b].push({to:p.a,len:p.length,key:p.key});return{seed:i,boundary:t,cells:u,edges:f,verts:l,adj:m,gateVertex:_,R:Ct}}function Fr(i,e=Math.random,t=1){const[n,s]=i.centroid;for(let r=0;r<12;r++){const o=e()*Math.PI*2,a=Math.sqrt(e())*Math.max(.4,i.inradius-t),c=n+Math.cos(o)*a,l=s+Math.sin(o)*a;return{x:c,z:l}}return{x:n,z:s}}function Eo(i,e,t){const{adj:n}=i,s=new Array(n.length).fill(1/0),r=new Array(n.length).fill(-1),o=new Array(n.length).fill(!1);for(s[e]=0;;){let c=-1,l=1/0;for(let h=0;h<n.length;h++)!o[h]&&s[h]<l&&(l=s[h],c=h);if(c===-1||c===t)break;o[c]=!0;for(const{to:h,len:u}of n[c])s[c]+u<s[h]&&(s[h]=s[c]+u,r[h]=c)}if(s[t]===1/0)return null;const a=[];for(let c=t;c!==-1;c=r[c])a.push(c);return a.reverse()}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Va="160",En={ROTATE:0,DOLLY:1,PAN:2},On={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},qh=0,bo=1,jh=2,al=1,ol=2,Sn=3,qn=0,Vt=1,bn=2,Gn=0,Vi=1,To=2,wo=3,Ao=4,Zh=5,ii=100,Kh=101,Jh=102,Ro=103,Co=104,Qh=200,eu=201,tu=202,nu=203,Ea=204,ba=205,iu=206,su=207,ru=208,au=209,ou=210,cu=211,lu=212,hu=213,uu=214,du=0,fu=1,pu=2,dr=3,mu=4,gu=5,_u=6,vu=7,cl=0,xu=1,Mu=2,Vn=0,yu=1,Su=2,Eu=3,bu=4,Tu=5,wu=6,ll=300,$i=301,Yi=302,Ta=303,wa=304,Er=306,Aa=1e3,ln=1001,Ra=1002,Bt=1003,Po=1004,kr=1005,Qt=1006,Au=1007,_s=1008,Wn=1009,Ru=1010,Cu=1011,Wa=1012,hl=1013,kn=1014,Bn=1015,vs=1016,ul=1017,dl=1018,ai=1020,Pu=1021,hn=1023,Lu=1024,Du=1025,oi=1026,qi=1027,Uu=1028,fl=1029,Iu=1030,pl=1031,ml=1033,Br=33776,zr=33777,Hr=33778,Gr=33779,Lo=35840,Do=35841,Uo=35842,Io=35843,gl=36196,No=37492,Oo=37496,Fo=37808,ko=37809,Bo=37810,zo=37811,Ho=37812,Go=37813,Vo=37814,Wo=37815,Xo=37816,$o=37817,Yo=37818,qo=37819,jo=37820,Zo=37821,Vr=36492,Ko=36494,Jo=36495,Nu=36283,Qo=36284,ec=36285,tc=36286,_l=3e3,ci=3001,Ou=3200,Fu=3201,vl=0,ku=1,nn="",Mt="srgb",Cn="srgb-linear",Xa="display-p3",br="display-p3-linear",fr="linear",ot="srgb",pr="rec709",mr="p3",vi=7680,nc=519,Bu=512,zu=513,Hu=514,xl=515,Gu=516,Vu=517,Wu=518,Xu=519,Ca=35044,ic="300 es",Pa=1035,wn=2e3,gr=2001;class pi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ar=Math.PI/180,La=180/Math.PI;function Rn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function wt(i,e,t){return Math.max(e,Math.min(t,i))}function $u(i,e){return(i%e+e)%e}function Wr(i,e,t){return(1-t)*i+t*e}function sc(i){return(i&i-1)===0&&i!==0}function Da(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Tn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function st(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Yu={DEG2RAD:ar};class ie{constructor(e=0,t=0){ie.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qe{constructor(e,t,n,s,r,o,a,c,l){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],M=s[1],x=s[4],S=s[7],C=s[2],w=s[5],A=s[8];return r[0]=o*_+a*M+c*C,r[3]=o*m+a*x+c*w,r[6]=o*p+a*S+c*A,r[1]=l*_+h*M+u*C,r[4]=l*m+h*x+u*w,r[7]=l*p+h*S+u*A,r[2]=d*_+f*M+g*C,r[5]=d*m+f*x+g*w,r[8]=d*p+f*S+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,g=t*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(s*l-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(h*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=f*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Xr.makeScale(e,t)),this}rotate(e){return this.premultiply(Xr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Xr=new qe;function Ml(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function _r(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function qu(){const i=_r("canvas");return i.style.display="block",i}const rc={};function ds(i){i in rc||(rc[i]=!0,console.warn(i))}const ac=new qe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),oc=new qe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ps={[Cn]:{transfer:fr,primaries:pr,toReference:i=>i,fromReference:i=>i},[Mt]:{transfer:ot,primaries:pr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[br]:{transfer:fr,primaries:mr,toReference:i=>i.applyMatrix3(oc),fromReference:i=>i.applyMatrix3(ac)},[Xa]:{transfer:ot,primaries:mr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(oc),fromReference:i=>i.applyMatrix3(ac).convertLinearToSRGB()}},ju=new Set([Cn,br]),tt={enabled:!0,_workingColorSpace:Cn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!ju.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Ps[e].toReference,s=Ps[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Ps[i].primaries},getTransfer:function(i){return i===nn?fr:Ps[i].transfer}};function Wi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $r(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let xi;class yl{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{xi===void 0&&(xi=_r("canvas")),xi.width=e.width,xi.height=e.height;const n=xi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=xi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=_r("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Wi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Wi(t[n]/255)*255):t[n]=Wi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zu=0;class Sl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zu++}),this.uuid=Rn(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Yr(s[o].image)):r.push(Yr(s[o]))}else r=Yr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Yr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?yl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ku=0;class Wt extends pi{constructor(e=Wt.DEFAULT_IMAGE,t=Wt.DEFAULT_MAPPING,n=ln,s=ln,r=Qt,o=_s,a=hn,c=Wn,l=Wt.DEFAULT_ANISOTROPY,h=nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=Rn(),this.name="",this.source=new Sl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ie(0,0),this.repeat=new ie(1,1),this.center=new ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ds("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ci?Mt:nn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ll)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Aa:e.x=e.x-Math.floor(e.x);break;case ln:e.x=e.x<0?0:1;break;case Ra:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Aa:e.y=e.y-Math.floor(e.y);break;case ln:e.y=e.y<0?0:1;break;case Ra:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ds("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Mt?ci:_l}set encoding(e){ds("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===ci?Mt:nn}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=ll;Wt.DEFAULT_ANISOTROPY=1;class At{constructor(e=0,t=0,n=0,s=1){At.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(l+1)/2,S=(f+1)/2,C=(p+1)/2,w=(h+d)/4,A=(u+_)/4,k=(g+m)/4;return x>S&&x>C?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=w/n,r=A/n):S>C?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=w/s,r=k/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=A/r,s=k/r),this.set(n,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-_)/M,this.z=(d-h)/M,this.w=Math.acos((l+f+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ju extends pi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t);const s={width:e,height:t,depth:1};n.encoding!==void 0&&(ds("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ci?Mt:nn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Wt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Sl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class li extends Ju{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class El extends Wt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qu extends Wt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==d||l!==f||h!==g){let m=1-a;const p=c*d+l*f+h*g+u*_,M=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const C=Math.sqrt(x),w=Math.atan2(C,p*M);m=Math.sin(m*w)/C,a=Math.sin(a*w)/C}const S=a*M;if(c=c*m+d*S,l=l*m+f*S,h=h*m+g*S,u=u*m+_*S,m===1-a){const C=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=C,l*=C,h*=C,u*=C}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*u+c*f-l*d,e[t+1]=c*g+h*d+l*u-a*f,e[t+2]=l*g+h*f+a*d-c*u,e[t+3]=h*g-a*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(wt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(cc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(cc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qr.copy(this).projectOnVector(e),this.sub(qr)}reflect(e){return this.sub(qr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qr=new I,cc=new hi;class Es{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(an.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(an.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=an.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,an):an.fromBufferAttribute(r,o),an.applyMatrix4(e.matrixWorld),this.expandByPoint(an);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ls.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ls.copy(n.boundingBox)),Ls.applyMatrix4(e.matrixWorld),this.union(Ls)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,an),an.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ns),Ds.subVectors(this.max,ns),Mi.subVectors(e.a,ns),yi.subVectors(e.b,ns),Si.subVectors(e.c,ns),Pn.subVectors(yi,Mi),Ln.subVectors(Si,yi),Kn.subVectors(Mi,Si);let t=[0,-Pn.z,Pn.y,0,-Ln.z,Ln.y,0,-Kn.z,Kn.y,Pn.z,0,-Pn.x,Ln.z,0,-Ln.x,Kn.z,0,-Kn.x,-Pn.y,Pn.x,0,-Ln.y,Ln.x,0,-Kn.y,Kn.x,0];return!jr(t,Mi,yi,Si,Ds)||(t=[1,0,0,0,1,0,0,0,1],!jr(t,Mi,yi,Si,Ds))?!1:(Us.crossVectors(Pn,Ln),t=[Us.x,Us.y,Us.z],jr(t,Mi,yi,Si,Ds))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,an).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(an).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const _n=[new I,new I,new I,new I,new I,new I,new I,new I],an=new I,Ls=new Es,Mi=new I,yi=new I,Si=new I,Pn=new I,Ln=new I,Kn=new I,ns=new I,Ds=new I,Us=new I,Jn=new I;function jr(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Jn.fromArray(i,r);const a=s.x*Math.abs(Jn.x)+s.y*Math.abs(Jn.y)+s.z*Math.abs(Jn.z),c=e.dot(Jn),l=t.dot(Jn),h=n.dot(Jn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const ed=new Es,is=new I,Zr=new I;class $a{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):ed.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;is.subVectors(e,this.center);const t=is.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(is,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(is.copy(e.center).add(Zr)),this.expandByPoint(is.copy(e.center).sub(Zr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const vn=new I,Kr=new I,Is=new I,Dn=new I,Jr=new I,Ns=new I,Qr=new I;class Ya{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,vn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=vn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(vn.copy(this.origin).addScaledVector(this.direction,t),vn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Kr.copy(e).add(t).multiplyScalar(.5),Is.copy(t).sub(e).normalize(),Dn.copy(this.origin).sub(Kr);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Is),a=Dn.dot(this.direction),c=-Dn.dot(Is),l=Dn.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Kr).addScaledVector(Is,d),f}intersectSphere(e,t){vn.subVectors(e.center,this.origin);const n=vn.dot(this.direction),s=vn.dot(vn)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,vn)!==null}intersectTriangle(e,t,n,s,r){Jr.subVectors(t,e),Ns.subVectors(n,e),Qr.crossVectors(Jr,Ns);let o=this.direction.dot(Qr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Dn.subVectors(this.origin,e);const c=a*this.direction.dot(Ns.crossVectors(Dn,Ns));if(c<0)return null;const l=a*this.direction.dot(Jr.cross(Dn));if(l<0||c+l>o)return null;const h=-a*Dn.dot(Qr);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class gt{constructor(e,t,n,s,r,o,a,c,l,h,u,d,f,g,_,m){gt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,u,d,f,g,_,m)}set(e,t,n,s,r,o,a,c,l,h,u,d,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new gt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ei.setFromMatrixColumn(e,0).length(),r=1/Ei.setFromMatrixColumn(e,1).length(),o=1/Ei.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=o*h,f=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+g*l,t[5]=d-_*l,t[9]=-a*c,t[2]=_-d*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*h,f=c*u,g=l*h,_=l*u;t[0]=d+_*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=_+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*h,f=c*u,g=l*h,_=l*u;t[0]=d-_*a,t[4]=-o*u,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*h,f=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=g*l-f,t[8]=d*l+_,t[1]=c*u,t[5]=_*l+d,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,f=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=_-d*u,t[8]=g*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=f*u+g,t[10]=d-_*u}else if(e.order==="XZY"){const d=o*c,f=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+_,t[5]=o*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(td,e,nd)}lookAt(e,t,n){const s=this.elements;return $t.subVectors(e,t),$t.lengthSq()===0&&($t.z=1),$t.normalize(),Un.crossVectors(n,$t),Un.lengthSq()===0&&(Math.abs(n.z)===1?$t.x+=1e-4:$t.z+=1e-4,$t.normalize(),Un.crossVectors(n,$t)),Un.normalize(),Os.crossVectors($t,Un),s[0]=Un.x,s[4]=Os.x,s[8]=$t.x,s[1]=Un.y,s[5]=Os.y,s[9]=$t.y,s[2]=Un.z,s[6]=Os.z,s[10]=$t.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],M=n[3],x=n[7],S=n[11],C=n[15],w=s[0],A=s[4],k=s[8],v=s[12],y=s[1],L=s[5],N=s[9],G=s[13],P=s[2],F=s[6],O=s[10],X=s[14],q=s[3],Y=s[7],K=s[11],se=s[15];return r[0]=o*w+a*y+c*P+l*q,r[4]=o*A+a*L+c*F+l*Y,r[8]=o*k+a*N+c*O+l*K,r[12]=o*v+a*G+c*X+l*se,r[1]=h*w+u*y+d*P+f*q,r[5]=h*A+u*L+d*F+f*Y,r[9]=h*k+u*N+d*O+f*K,r[13]=h*v+u*G+d*X+f*se,r[2]=g*w+_*y+m*P+p*q,r[6]=g*A+_*L+m*F+p*Y,r[10]=g*k+_*N+m*O+p*K,r[14]=g*v+_*G+m*X+p*se,r[3]=M*w+x*y+S*P+C*q,r[7]=M*A+x*L+S*F+C*Y,r[11]=M*k+x*N+S*O+C*K,r[15]=M*v+x*G+S*X+C*se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*f-n*c*f)+_*(+t*c*f-t*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+m*(+t*l*u-t*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-s*a*h-t*c*u+t*a*d+s*o*u-n*o*d+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],M=u*m*l-_*d*l+_*c*f-a*m*f-u*c*p+a*d*p,x=g*d*l-h*m*l-g*c*f+o*m*f+h*c*p-o*d*p,S=h*_*l-g*u*l+g*a*f-o*_*f-h*a*p+o*u*p,C=g*u*c-h*_*c-g*a*d+o*_*d+h*a*m-o*u*m,w=t*M+n*x+s*S+r*C;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return e[0]=M*A,e[1]=(_*d*r-u*m*r-_*s*f+n*m*f+u*s*p-n*d*p)*A,e[2]=(a*m*r-_*c*r+_*s*l-n*m*l-a*s*p+n*c*p)*A,e[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*f-n*c*f)*A,e[4]=x*A,e[5]=(h*m*r-g*d*r+g*s*f-t*m*f-h*s*p+t*d*p)*A,e[6]=(g*c*r-o*m*r-g*s*l+t*m*l+o*s*p-t*c*p)*A,e[7]=(o*d*r-h*c*r+h*s*l-t*d*l-o*s*f+t*c*f)*A,e[8]=S*A,e[9]=(g*u*r-h*_*r-g*n*f+t*_*f+h*n*p-t*u*p)*A,e[10]=(o*_*r-g*a*r+g*n*l-t*_*l-o*n*p+t*a*p)*A,e[11]=(h*a*r-o*u*r-h*n*l+t*u*l+o*n*f-t*a*f)*A,e[12]=C*A,e[13]=(h*_*s-g*u*s+g*n*d-t*_*d-h*n*m+t*u*m)*A,e[14]=(g*a*s-o*_*s-g*n*c+t*_*c+o*n*m-t*a*m)*A,e[15]=(o*u*s-h*a*s+h*n*c-t*u*c-o*n*d+t*a*d)*A,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,g=r*u,_=o*h,m=o*u,p=a*u,M=c*l,x=c*h,S=c*u,C=n.x,w=n.y,A=n.z;return s[0]=(1-(_+p))*C,s[1]=(f+S)*C,s[2]=(g-x)*C,s[3]=0,s[4]=(f-S)*w,s[5]=(1-(d+p))*w,s[6]=(m+M)*w,s[7]=0,s[8]=(g+x)*A,s[9]=(m-M)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ei.set(s[0],s[1],s[2]).length();const o=Ei.set(s[4],s[5],s[6]).length(),a=Ei.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],on.copy(this);const l=1/r,h=1/o,u=1/a;return on.elements[0]*=l,on.elements[1]*=l,on.elements[2]*=l,on.elements[4]*=h,on.elements[5]*=h,on.elements[6]*=h,on.elements[8]*=u,on.elements[9]*=u,on.elements[10]*=u,t.setFromRotationMatrix(on),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=wn){const c=this.elements,l=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s);let f,g;if(a===wn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===gr)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=wn){const c=this.elements,l=1/(t-e),h=1/(n-s),u=1/(o-r),d=(t+e)*l,f=(n+s)*h;let g,_;if(a===wn)g=(o+r)*u,_=-2*u;else if(a===gr)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ei=new I,on=new gt,td=new I(0,0,0),nd=new I(1,1,1),Un=new I,Os=new I,$t=new I,lc=new gt,hc=new hi;class Tr{constructor(e=0,t=0,n=0,s=Tr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(wt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-wt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(wt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return lc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(lc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return hc.setFromEuler(this),this.setFromQuaternion(hc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tr.DEFAULT_ORDER="XYZ";class qa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let id=0;const uc=new I,bi=new hi,xn=new gt,Fs=new I,ss=new I,sd=new I,rd=new hi,dc=new I(1,0,0),fc=new I(0,1,0),pc=new I(0,0,1),ad={type:"added"},od={type:"removed"};class Rt extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:id++}),this.uuid=Rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rt.DEFAULT_UP.clone();const e=new I,t=new Tr,n=new hi,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new gt},normalMatrix:{value:new qe}}),this.matrix=new gt,this.matrixWorld=new gt,this.matrixAutoUpdate=Rt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return bi.setFromAxisAngle(e,t),this.quaternion.multiply(bi),this}rotateOnWorldAxis(e,t){return bi.setFromAxisAngle(e,t),this.quaternion.premultiply(bi),this}rotateX(e){return this.rotateOnAxis(dc,e)}rotateY(e){return this.rotateOnAxis(fc,e)}rotateZ(e){return this.rotateOnAxis(pc,e)}translateOnAxis(e,t){return uc.copy(e).applyQuaternion(this.quaternion),this.position.add(uc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(dc,e)}translateY(e){return this.translateOnAxis(fc,e)}translateZ(e){return this.translateOnAxis(pc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Fs.copy(e):Fs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(ss,Fs,this.up):xn.lookAt(Fs,ss,this.up),this.quaternion.setFromRotationMatrix(xn),s&&(xn.extractRotation(s.matrixWorld),bi.setFromRotationMatrix(xn),this.quaternion.premultiply(bi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(ad)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(od)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(xn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,e,sd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,rd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Rt.DEFAULT_UP=new I(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new I,Mn=new I,ea=new I,yn=new I,Ti=new I,wi=new I,mc=new I,ta=new I,na=new I,ia=new I;let ks=!1;class en{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),cn.subVectors(e,t),s.cross(cn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){cn.subVectors(s,t),Mn.subVectors(n,t),ea.subVectors(e,t);const o=cn.dot(cn),a=cn.dot(Mn),c=cn.dot(ea),l=Mn.dot(Mn),h=Mn.dot(ea),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,yn)===null?!1:yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getUV(e,t,n,s,r,o,a,c){return ks===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ks=!0),this.getInterpolation(e,t,n,s,r,o,a,c)}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,yn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,yn.x),c.addScaledVector(o,yn.y),c.addScaledVector(a,yn.z),c)}static isFrontFacing(e,t,n,s){return cn.subVectors(n,t),Mn.subVectors(e,t),cn.cross(Mn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return cn.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),cn.cross(Mn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return en.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return en.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,s,r){return ks===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ks=!0),en.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}getInterpolation(e,t,n,s,r){return en.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return en.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return en.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;Ti.subVectors(s,n),wi.subVectors(r,n),ta.subVectors(e,n);const c=Ti.dot(ta),l=wi.dot(ta);if(c<=0&&l<=0)return t.copy(n);na.subVectors(e,s);const h=Ti.dot(na),u=wi.dot(na);if(h>=0&&u<=h)return t.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Ti,o);ia.subVectors(e,r);const f=Ti.dot(ia),g=wi.dot(ia);if(g>=0&&f<=g)return t.copy(r);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(wi,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return mc.subVectors(r,s),a=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(mc,a);const p=1/(m+_+d);return o=_*p,a=d*p,t.copy(n).addScaledVector(Ti,o).addScaledVector(wi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const bl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},Bs={h:0,s:0,l:0};function sa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class We{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=$u(e,1),t=wt(t,0,1),n=wt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=sa(o,r,e+1/3),this.g=sa(o,r,e),this.b=sa(o,r,e-1/3)}return tt.toWorkingColorSpace(this,s),this}setStyle(e,t=Mt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mt){const n=bl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wi(e.r),this.g=Wi(e.g),this.b=Wi(e.b),this}copyLinearToSRGB(e){return this.r=$r(e.r),this.g=$r(e.g),this.b=$r(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mt){return tt.fromWorkingColorSpace(Ut.copy(this),e),Math.round(wt(Ut.r*255,0,255))*65536+Math.round(wt(Ut.g*255,0,255))*256+Math.round(wt(Ut.b*255,0,255))}getHexString(e=Mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.fromWorkingColorSpace(Ut.copy(this),t);const n=Ut.r,s=Ut.g,r=Ut.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.fromWorkingColorSpace(Ut.copy(this),t),e.r=Ut.r,e.g=Ut.g,e.b=Ut.b,e}getStyle(e=Mt){tt.fromWorkingColorSpace(Ut.copy(this),e);const t=Ut.r,n=Ut.g,s=Ut.b;return e!==Mt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(In),this.setHSL(In.h+e,In.s+t,In.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(In),e.getHSL(Bs);const n=Wr(In.h,Bs.h,t),s=Wr(In.s,Bs.s,t),r=Wr(In.l,Bs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ut=new We;We.NAMES=bl;let cd=0;class Ji extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cd++}),this.uuid=Rn(),this.name="",this.type="Material",this.blending=Vi,this.side=qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ea,this.blendDst=ba,this.blendEquation=ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=dr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=vi,this.stencilZFail=vi,this.stencilZPass=vi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Vi&&(n.blending=this.blending),this.side!==qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ea&&(n.blendSrc=this.blendSrc),this.blendDst!==ba&&(n.blendDst=this.blendDst),this.blendEquation!==ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==dr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==vi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==vi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==vi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class fs extends Ji{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=cl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const xt=new I,zs=new ie;class un{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ca,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)zs.fromBufferAttribute(this,t),zs.applyMatrix3(e),this.setXY(t,zs.x,zs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix3(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix4(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyNormalMatrix(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.transformDirection(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Tn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Tn(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Tn(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Tn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Tn(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ca&&(e.usage=this.usage),e}}class Tl extends un{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class wl extends un{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class _t extends un{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ld=0;const Jt=new gt,ra=new Rt,Ai=new I,Yt=new Es,rs=new Es,bt=new I;class Zt extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ld++}),this.uuid=Rn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ml(e)?wl:Tl)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Jt.makeRotationFromQuaternion(e),this.applyMatrix4(Jt),this}rotateX(e){return Jt.makeRotationX(e),this.applyMatrix4(Jt),this}rotateY(e){return Jt.makeRotationY(e),this.applyMatrix4(Jt),this}rotateZ(e){return Jt.makeRotationZ(e),this.applyMatrix4(Jt),this}translate(e,t,n){return Jt.makeTranslation(e,t,n),this.applyMatrix4(Jt),this}scale(e,t,n){return Jt.makeScale(e,t,n),this.applyMatrix4(Jt),this}lookAt(e){return ra.lookAt(e),ra.updateMatrix(),this.applyMatrix4(ra.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ai).negate(),this.translate(Ai.x,Ai.y,Ai.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new _t(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Es);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Yt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Yt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Yt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Yt.min),this.boundingBox.expandByPoint(Yt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $a);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(Yt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];rs.setFromBufferAttribute(a),this.morphTargetsRelative?(bt.addVectors(Yt.min,rs.min),Yt.expandByPoint(bt),bt.addVectors(Yt.max,rs.max),Yt.expandByPoint(bt)):(Yt.expandByPoint(rs.min),Yt.expandByPoint(rs.max))}Yt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(bt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)bt.fromBufferAttribute(a,l),c&&(Ai.fromBufferAttribute(e,l),bt.add(Ai)),s=Math.max(s,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,s=t.position.array,r=t.normal.array,o=t.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new un(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let y=0;y<a;y++)l[y]=new I,h[y]=new I;const u=new I,d=new I,f=new I,g=new ie,_=new ie,m=new ie,p=new I,M=new I;function x(y,L,N){u.fromArray(s,y*3),d.fromArray(s,L*3),f.fromArray(s,N*3),g.fromArray(o,y*2),_.fromArray(o,L*2),m.fromArray(o,N*2),d.sub(u),f.sub(u),_.sub(g),m.sub(g);const G=1/(_.x*m.y-m.x*_.y);isFinite(G)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-_.y).multiplyScalar(G),M.copy(f).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(G),l[y].add(p),l[L].add(p),l[N].add(p),h[y].add(M),h[L].add(M),h[N].add(M))}let S=this.groups;S.length===0&&(S=[{start:0,count:n.length}]);for(let y=0,L=S.length;y<L;++y){const N=S[y],G=N.start,P=N.count;for(let F=G,O=G+P;F<O;F+=3)x(n[F+0],n[F+1],n[F+2])}const C=new I,w=new I,A=new I,k=new I;function v(y){A.fromArray(r,y*3),k.copy(A);const L=l[y];C.copy(L),C.sub(A.multiplyScalar(A.dot(L))).normalize(),w.crossVectors(k,L);const G=w.dot(h[y])<0?-1:1;c[y*4]=C.x,c[y*4+1]=C.y,c[y*4+2]=C.z,c[y*4+3]=G}for(let y=0,L=S.length;y<L;++y){const N=S[y],G=N.start,P=N.count;for(let F=G,O=G+P;F<O;F+=3)v(n[F+0]),v(n[F+1]),v(n[F+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new un(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new I,r=new I,o=new I,a=new I,c=new I,l=new I,h=new I,u=new I;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new un(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Zt,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const gc=new gt,Qn=new Ya,Hs=new $a,_c=new I,Ri=new I,Ci=new I,Pi=new I,aa=new I,Gs=new I,Vs=new ie,Ws=new ie,Xs=new ie,vc=new I,xc=new I,Mc=new I,$s=new I,Ys=new I;class Ht extends Rt{constructor(e=new Zt,t=new fs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){Gs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(aa.fromBufferAttribute(u,e),o?Gs.addScaledVector(aa,h):Gs.addScaledVector(aa.sub(t),h))}t.add(Gs)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Hs.copy(n.boundingSphere),Hs.applyMatrix4(r),Qn.copy(e.ray).recast(e.near),!(Hs.containsPoint(Qn.origin)===!1&&(Qn.intersectSphere(Hs,_c)===null||Qn.origin.distanceToSquared(_c)>(e.far-e.near)**2))&&(gc.copy(r).invert(),Qn.copy(e.ray).applyMatrix4(gc),!(n.boundingBox!==null&&Qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Qn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,C=x;S<C;S+=3){const w=a.getX(S),A=a.getX(S+1),k=a.getX(S+2);s=qs(this,p,e,n,l,h,u,w,A,k),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const M=a.getX(m),x=a.getX(m+1),S=a.getX(m+2);s=qs(this,o,e,n,l,h,u,M,x,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,C=x;S<C;S+=3){const w=S,A=S+1,k=S+2;s=qs(this,p,e,n,l,h,u,w,A,k),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const M=m,x=m+1,S=m+2;s=qs(this,o,e,n,l,h,u,M,x,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function hd(i,e,t,n,s,r,o,a){let c;if(e.side===Vt?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===qn,a),c===null)return null;Ys.copy(a),Ys.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Ys);return l<t.near||l>t.far?null:{distance:l,point:Ys.clone(),object:i}}function qs(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,Ri),i.getVertexPosition(c,Ci),i.getVertexPosition(l,Pi);const h=hd(i,e,t,n,Ri,Ci,Pi,$s);if(h){s&&(Vs.fromBufferAttribute(s,a),Ws.fromBufferAttribute(s,c),Xs.fromBufferAttribute(s,l),h.uv=en.getInterpolation($s,Ri,Ci,Pi,Vs,Ws,Xs,new ie)),r&&(Vs.fromBufferAttribute(r,a),Ws.fromBufferAttribute(r,c),Xs.fromBufferAttribute(r,l),h.uv1=en.getInterpolation($s,Ri,Ci,Pi,Vs,Ws,Xs,new ie),h.uv2=h.uv1),o&&(vc.fromBufferAttribute(o,a),xc.fromBufferAttribute(o,c),Mc.fromBufferAttribute(o,l),h.normal=en.getInterpolation($s,Ri,Ci,Pi,vc,xc,Mc,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new I,materialIndex:0};en.getNormal(Ri,Ci,Pi,u.normal),h.face=u}return h}class mi extends Zt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new _t(l,3)),this.setAttribute("normal",new _t(h,3)),this.setAttribute("uv",new _t(u,2));function g(_,m,p,M,x,S,C,w,A,k,v){const y=S/A,L=C/k,N=S/2,G=C/2,P=w/2,F=A+1,O=k+1;let X=0,q=0;const Y=new I;for(let K=0;K<O;K++){const se=K*L-G;for(let ce=0;ce<F;ce++){const $=ce*y-N;Y[_]=$*M,Y[m]=se*x,Y[p]=P,l.push(Y.x,Y.y,Y.z),Y[_]=0,Y[m]=0,Y[p]=w>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(ce/A),u.push(1-K/k),X+=1}}for(let K=0;K<k;K++)for(let se=0;se<A;se++){const ce=d+se+F*K,$=d+se+F*(K+1),Q=d+(se+1)+F*(K+1),pe=d+(se+1)+F*K;c.push(ce,$,pe),c.push($,Q,pe),q+=6}a.addGroup(f,q,v),f+=q,d+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ji(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function kt(i){const e={};for(let t=0;t<i.length;t++){const n=ji(i[t]);for(const s in n)e[s]=n[s]}return e}function ud(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Al(i){return i.getRenderTarget()===null?i.outputColorSpace:tt.workingColorSpace}const dd={clone:ji,merge:kt};var fd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ui extends Ji{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fd,this.fragmentShader=pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ji(e.uniforms),this.uniformsGroups=ud(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Rl extends Rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new gt,this.projectionMatrix=new gt,this.projectionMatrixInverse=new gt,this.coordinateSystem=wn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class tn extends Rl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=La*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return La*2*Math.atan(Math.tan(ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ar*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Li=-90,Di=1;class md extends Rt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new tn(Li,Di,e,t);s.layers=this.layers,this.add(s);const r=new tn(Li,Di,e,t);r.layers=this.layers,this.add(r);const o=new tn(Li,Di,e,t);o.layers=this.layers,this.add(o);const a=new tn(Li,Di,e,t);a.layers=this.layers,this.add(a);const c=new tn(Li,Di,e,t);c.layers=this.layers,this.add(c);const l=new tn(Li,Di,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===gr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Cl extends Wt{constructor(e,t,n,s,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:$i,super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class gd extends li{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&(ds("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===ci?Mt:nn),this.texture=new Cl(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Qt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new mi(5,5,5),r=new ui({name:"CubemapFromEquirect",uniforms:ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Vt,blending:Gn});r.uniforms.tEquirect.value=t;const o=new Ht(s,r),a=t.minFilter;return t.minFilter===_s&&(t.minFilter=Qt),new md(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}const oa=new I,_d=new I,vd=new qe;class Fn{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=oa.subVectors(n,t).cross(_d.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(oa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||vd.getNormalMatrix(e),s=this.coplanarPoint(oa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ei=new $a,js=new I;class ja{constructor(e=new Fn,t=new Fn,n=new Fn,s=new Fn,r=new Fn,o=new Fn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=wn){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],M=s[13],x=s[14],S=s[15];if(n[0].setComponents(c-r,d-l,m-f,S-p).normalize(),n[1].setComponents(c+r,d+l,m+f,S+p).normalize(),n[2].setComponents(c+o,d+h,m+g,S+M).normalize(),n[3].setComponents(c-o,d-h,m-g,S-M).normalize(),n[4].setComponents(c-a,d-u,m-_,S-x).normalize(),t===wn)n[5].setComponents(c+a,d+u,m+_,S+x).normalize();else if(t===gr)n[5].setComponents(a,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ei.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ei.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ei)}intersectsSprite(e){return ei.center.set(0,0,0),ei.radius=.7071067811865476,ei.applyMatrix4(e.matrixWorld),this.intersectsSphere(ei)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(js.x=s.normal.x>0?e.max.x:e.min.x,js.y=s.normal.y>0?e.max.y:e.min.y,js.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(js)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Pl(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function xd(i,e){const t=e.isWebGL2,n=new WeakMap;function s(l,h){const u=l.array,d=l.usage,f=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),l.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(t)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:f}}function r(l,h,u){const d=h.array,f=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),f.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){const p=g[_];t?i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(t?i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}class wr extends Zt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=e/a,d=t/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const M=p*d-o;for(let x=0;x<l;x++){const S=x*u-r;g.push(S,-M,0),_.push(0,0,1),m.push(x/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<a;M++){const x=M+l*p,S=M+l*(p+1),C=M+1+l*(p+1),w=M+1+l*p;f.push(x,S,w),f.push(S,C,w)}this.setIndex(f),this.setAttribute("position",new _t(g,3)),this.setAttribute("normal",new _t(_,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wr(e.width,e.height,e.widthSegments,e.heightSegments)}}var Md=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yd=`#ifdef USE_ALPHAHASH
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
#endif`,Sd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ed=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bd=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Td=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wd=`#ifdef USE_AOMAP
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
#endif`,Ad=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rd=`#ifdef USE_BATCHING
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
#endif`,Cd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Pd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ld=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ud=`#ifdef USE_IRIDESCENCE
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
#endif`,Id=`#ifdef USE_BUMPMAP
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
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Od=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,kd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Gd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Vd=`#define PI 3.141592653589793
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
} // validated`,Wd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xd=`vec3 transformedNormal = objectNormal;
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
#endif`,$d=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Zd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kd=`
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
}`,Jd=`#ifdef USE_ENVMAP
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
#endif`,Qd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ef=`#ifdef USE_ENVMAP
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
#endif`,tf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nf=`#ifdef USE_ENVMAP
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
#endif`,sf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,af=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,of=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,cf=`#ifdef USE_GRADIENTMAP
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
}`,lf=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,hf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,uf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,df=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ff=`uniform bool receiveShadow;
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
#endif`,pf=`#ifdef USE_ENVMAP
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
#endif`,mf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,gf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_f=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xf=`PhysicalMaterial material;
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
#endif`,Mf=`struct PhysicalMaterial {
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
}`,yf=`
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
#endif`,Sf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ef=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Tf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Af=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Rf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Lf=`#if defined( USE_POINTS_UV )
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
#endif`,Df=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Uf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,If=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Nf=`#ifdef USE_MORPHNORMALS
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
#endif`,Of=`#ifdef USE_MORPHTARGETS
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
#endif`,Ff=`#ifdef USE_MORPHTARGETS
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
#endif`,kf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Bf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Vf=`#ifdef USE_NORMALMAP
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
#endif`,Wf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$f=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Zf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,np=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ip=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,rp=`float getShadowMask() {
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
}`,ap=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,op=`#ifdef USE_SKINNING
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
#endif`,cp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lp=`#ifdef USE_SKINNING
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
#endif`,hp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,up=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,fp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,pp=`#ifdef USE_TRANSMISSION
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
#endif`,mp=`#ifdef USE_TRANSMISSION
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
#endif`,gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Mp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yp=`uniform sampler2D t2D;
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
}`,Sp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ep=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wp=`#include <common>
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
}`,Ap=`#if DEPTH_PACKING == 3200
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
}`,Rp=`#define DISTANCE
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
}`,Cp=`#define DISTANCE
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
}`,Pp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dp=`uniform float scale;
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
}`,Up=`uniform vec3 diffuse;
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
}`,Ip=`#include <common>
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
}`,Np=`uniform vec3 diffuse;
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
}`,Op=`#define LAMBERT
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
}`,Fp=`#define LAMBERT
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
}`,kp=`#define MATCAP
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
}`,Bp=`#define MATCAP
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
}`,zp=`#define NORMAL
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
}`,Hp=`#define NORMAL
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
}`,Gp=`#define PHONG
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
}`,Vp=`#define PHONG
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
}`,Wp=`#define STANDARD
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
}`,Xp=`#define STANDARD
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
}`,$p=`#define TOON
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
}`,Yp=`#define TOON
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
}`,qp=`uniform float size;
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
}`,jp=`uniform vec3 diffuse;
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
}`,Zp=`#include <common>
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
}`,Kp=`uniform vec3 color;
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
}`,Jp=`uniform float rotation;
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
}`,Qp=`uniform vec3 diffuse;
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
}`,Ve={alphahash_fragment:Md,alphahash_pars_fragment:yd,alphamap_fragment:Sd,alphamap_pars_fragment:Ed,alphatest_fragment:bd,alphatest_pars_fragment:Td,aomap_fragment:wd,aomap_pars_fragment:Ad,batching_pars_vertex:Rd,batching_vertex:Cd,begin_vertex:Pd,beginnormal_vertex:Ld,bsdfs:Dd,iridescence_fragment:Ud,bumpmap_pars_fragment:Id,clipping_planes_fragment:Nd,clipping_planes_pars_fragment:Od,clipping_planes_pars_vertex:Fd,clipping_planes_vertex:kd,color_fragment:Bd,color_pars_fragment:zd,color_pars_vertex:Hd,color_vertex:Gd,common:Vd,cube_uv_reflection_fragment:Wd,defaultnormal_vertex:Xd,displacementmap_pars_vertex:$d,displacementmap_vertex:Yd,emissivemap_fragment:qd,emissivemap_pars_fragment:jd,colorspace_fragment:Zd,colorspace_pars_fragment:Kd,envmap_fragment:Jd,envmap_common_pars_fragment:Qd,envmap_pars_fragment:ef,envmap_pars_vertex:tf,envmap_physical_pars_fragment:pf,envmap_vertex:nf,fog_vertex:sf,fog_pars_vertex:rf,fog_fragment:af,fog_pars_fragment:of,gradientmap_pars_fragment:cf,lightmap_fragment:lf,lightmap_pars_fragment:hf,lights_lambert_fragment:uf,lights_lambert_pars_fragment:df,lights_pars_begin:ff,lights_toon_fragment:mf,lights_toon_pars_fragment:gf,lights_phong_fragment:_f,lights_phong_pars_fragment:vf,lights_physical_fragment:xf,lights_physical_pars_fragment:Mf,lights_fragment_begin:yf,lights_fragment_maps:Sf,lights_fragment_end:Ef,logdepthbuf_fragment:bf,logdepthbuf_pars_fragment:Tf,logdepthbuf_pars_vertex:wf,logdepthbuf_vertex:Af,map_fragment:Rf,map_pars_fragment:Cf,map_particle_fragment:Pf,map_particle_pars_fragment:Lf,metalnessmap_fragment:Df,metalnessmap_pars_fragment:Uf,morphcolor_vertex:If,morphnormal_vertex:Nf,morphtarget_pars_vertex:Of,morphtarget_vertex:Ff,normal_fragment_begin:kf,normal_fragment_maps:Bf,normal_pars_fragment:zf,normal_pars_vertex:Hf,normal_vertex:Gf,normalmap_pars_fragment:Vf,clearcoat_normal_fragment_begin:Wf,clearcoat_normal_fragment_maps:Xf,clearcoat_pars_fragment:$f,iridescence_pars_fragment:Yf,opaque_fragment:qf,packing:jf,premultiplied_alpha_fragment:Zf,project_vertex:Kf,dithering_fragment:Jf,dithering_pars_fragment:Qf,roughnessmap_fragment:ep,roughnessmap_pars_fragment:tp,shadowmap_pars_fragment:np,shadowmap_pars_vertex:ip,shadowmap_vertex:sp,shadowmask_pars_fragment:rp,skinbase_vertex:ap,skinning_pars_vertex:op,skinning_vertex:cp,skinnormal_vertex:lp,specularmap_fragment:hp,specularmap_pars_fragment:up,tonemapping_fragment:dp,tonemapping_pars_fragment:fp,transmission_fragment:pp,transmission_pars_fragment:mp,uv_pars_fragment:gp,uv_pars_vertex:_p,uv_vertex:vp,worldpos_vertex:xp,background_vert:Mp,background_frag:yp,backgroundCube_vert:Sp,backgroundCube_frag:Ep,cube_vert:bp,cube_frag:Tp,depth_vert:wp,depth_frag:Ap,distanceRGBA_vert:Rp,distanceRGBA_frag:Cp,equirect_vert:Pp,equirect_frag:Lp,linedashed_vert:Dp,linedashed_frag:Up,meshbasic_vert:Ip,meshbasic_frag:Np,meshlambert_vert:Op,meshlambert_frag:Fp,meshmatcap_vert:kp,meshmatcap_frag:Bp,meshnormal_vert:zp,meshnormal_frag:Hp,meshphong_vert:Gp,meshphong_frag:Vp,meshphysical_vert:Wp,meshphysical_frag:Xp,meshtoon_vert:$p,meshtoon_frag:Yp,points_vert:qp,points_frag:jp,shadow_vert:Zp,shadow_frag:Kp,sprite_vert:Jp,sprite_frag:Qp},ue={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},fn={basic:{uniforms:kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new We(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:kt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:kt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new We(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:kt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:kt([ue.points,ue.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:kt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:kt([ue.common,ue.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:kt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:kt([ue.sprite,ue.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:kt([ue.common,ue.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:kt([ue.lights,ue.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};fn.physical={uniforms:kt([fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};const Zs={r:0,b:0,g:0};function em(i,e,t,n,s,r,o){const a=new We(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(m,p){let M=!1,x=p.isScene===!0?p.background:null;x&&x.isTexture&&(x=(p.backgroundBlurriness>0?t:e).get(x)),x===null?_(a,c):x&&x.isColor&&(_(x,1),M=!0);const S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Er)?(h===void 0&&(h=new Ht(new mi(1,1,1),new ui({name:"BackgroundCubeMaterial",uniforms:ji(fn.backgroundCube.uniforms),vertexShader:fn.backgroundCube.vertexShader,fragmentShader:fn.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=tt.getTransfer(x.colorSpace)!==ot,(u!==x||d!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Ht(new wr(2,2),new ui({name:"BackgroundMaterial",uniforms:ji(fn.background.uniforms),vertexShader:fn.background.vertexShader,fragmentShader:fn.background.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=tt.getTransfer(x.colorSpace)!==ot,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function _(m,p){m.getRGB(Zs,Al(i)),n.buffers.color.setClear(Zs.r,Zs.g,Zs.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),c=p,_(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(a,c)},render:g}}function tm(i,e,t,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null);let l=c,h=!1;function u(P,F,O,X,q){let Y=!1;if(o){const K=_(X,O,F);l!==K&&(l=K,f(l.object)),Y=p(P,X,O,q),Y&&M(P,X,O,q)}else{const K=F.wireframe===!0;(l.geometry!==X.id||l.program!==O.id||l.wireframe!==K)&&(l.geometry=X.id,l.program=O.id,l.wireframe=K,Y=!0)}q!==null&&t.update(q,i.ELEMENT_ARRAY_BUFFER),(Y||h)&&(h=!1,k(P,F,O,X),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(P){return n.isWebGL2?i.bindVertexArray(P):r.bindVertexArrayOES(P)}function g(P){return n.isWebGL2?i.deleteVertexArray(P):r.deleteVertexArrayOES(P)}function _(P,F,O){const X=O.wireframe===!0;let q=a[P.id];q===void 0&&(q={},a[P.id]=q);let Y=q[F.id];Y===void 0&&(Y={},q[F.id]=Y);let K=Y[X];return K===void 0&&(K=m(d()),Y[X]=K),K}function m(P){const F=[],O=[],X=[];for(let q=0;q<s;q++)F[q]=0,O[q]=0,X[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:O,attributeDivisors:X,object:P,attributes:{},index:null}}function p(P,F,O,X){const q=l.attributes,Y=F.attributes;let K=0;const se=O.getAttributes();for(const ce in se)if(se[ce].location>=0){const Q=q[ce];let pe=Y[ce];if(pe===void 0&&(ce==="instanceMatrix"&&P.instanceMatrix&&(pe=P.instanceMatrix),ce==="instanceColor"&&P.instanceColor&&(pe=P.instanceColor)),Q===void 0||Q.attribute!==pe||pe&&Q.data!==pe.data)return!0;K++}return l.attributesNum!==K||l.index!==X}function M(P,F,O,X){const q={},Y=F.attributes;let K=0;const se=O.getAttributes();for(const ce in se)if(se[ce].location>=0){let Q=Y[ce];Q===void 0&&(ce==="instanceMatrix"&&P.instanceMatrix&&(Q=P.instanceMatrix),ce==="instanceColor"&&P.instanceColor&&(Q=P.instanceColor));const pe={};pe.attribute=Q,Q&&Q.data&&(pe.data=Q.data),q[ce]=pe,K++}l.attributes=q,l.attributesNum=K,l.index=X}function x(){const P=l.newAttributes;for(let F=0,O=P.length;F<O;F++)P[F]=0}function S(P){C(P,0)}function C(P,F){const O=l.newAttributes,X=l.enabledAttributes,q=l.attributeDivisors;O[P]=1,X[P]===0&&(i.enableVertexAttribArray(P),X[P]=1),q[P]!==F&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,F),q[P]=F)}function w(){const P=l.newAttributes,F=l.enabledAttributes;for(let O=0,X=F.length;O<X;O++)F[O]!==P[O]&&(i.disableVertexAttribArray(O),F[O]=0)}function A(P,F,O,X,q,Y,K){K===!0?i.vertexAttribIPointer(P,F,O,q,Y):i.vertexAttribPointer(P,F,O,X,q,Y)}function k(P,F,O,X){if(n.isWebGL2===!1&&(P.isInstancedMesh||X.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;x();const q=X.attributes,Y=O.getAttributes(),K=F.defaultAttributeValues;for(const se in Y){const ce=Y[se];if(ce.location>=0){let $=q[se];if($===void 0&&(se==="instanceMatrix"&&P.instanceMatrix&&($=P.instanceMatrix),se==="instanceColor"&&P.instanceColor&&($=P.instanceColor)),$!==void 0){const Q=$.normalized,pe=$.itemSize,Ee=t.get($);if(Ee===void 0)continue;const xe=Ee.buffer,De=Ee.type,Fe=Ee.bytesPerElement,Se=n.isWebGL2===!0&&(De===i.INT||De===i.UNSIGNED_INT||$.gpuType===hl);if($.isInterleavedBufferAttribute){const Ne=$.data,D=Ne.stride,he=$.offset;if(Ne.isInstancedInterleavedBuffer){for(let Z=0;Z<ce.locationSize;Z++)C(ce.location+Z,Ne.meshPerAttribute);P.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=Ne.meshPerAttribute*Ne.count)}else for(let Z=0;Z<ce.locationSize;Z++)S(ce.location+Z);i.bindBuffer(i.ARRAY_BUFFER,xe);for(let Z=0;Z<ce.locationSize;Z++)A(ce.location+Z,pe/ce.locationSize,De,Q,D*Fe,(he+pe/ce.locationSize*Z)*Fe,Se)}else{if($.isInstancedBufferAttribute){for(let Ne=0;Ne<ce.locationSize;Ne++)C(ce.location+Ne,$.meshPerAttribute);P.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Ne=0;Ne<ce.locationSize;Ne++)S(ce.location+Ne);i.bindBuffer(i.ARRAY_BUFFER,xe);for(let Ne=0;Ne<ce.locationSize;Ne++)A(ce.location+Ne,pe/ce.locationSize,De,Q,pe*Fe,pe/ce.locationSize*Ne*Fe,Se)}}else if(K!==void 0){const Q=K[se];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(ce.location,Q);break;case 3:i.vertexAttrib3fv(ce.location,Q);break;case 4:i.vertexAttrib4fv(ce.location,Q);break;default:i.vertexAttrib1fv(ce.location,Q)}}}}w()}function v(){N();for(const P in a){const F=a[P];for(const O in F){const X=F[O];for(const q in X)g(X[q].object),delete X[q];delete F[O]}delete a[P]}}function y(P){if(a[P.id]===void 0)return;const F=a[P.id];for(const O in F){const X=F[O];for(const q in X)g(X[q].object),delete X[q];delete F[O]}delete a[P.id]}function L(P){for(const F in a){const O=a[F];if(O[P.id]===void 0)continue;const X=O[P.id];for(const q in X)g(X[q].object),delete X[q];delete O[P.id]}}function N(){G(),h=!0,l!==c&&(l=c,f(l.object))}function G(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:N,resetDefaultState:G,dispose:v,releaseStatesOfGeometry:y,releaseStatesOfProgram:L,initAttributes:x,enableAttribute:S,disableUnusedAttributes:w}}function nm(i,e,t,n){const s=n.isWebGL2;let r;function o(h){r=h}function a(h,u){i.drawArrays(r,h,u),t.update(u,r,1)}function c(h,u,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),t.update(u,r,d)}function l(h,u,d){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function im(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,S=o||e.has("OES_texture_float"),C=x&&S,w=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:M,vertexTextures:x,floatFragmentTextures:S,floatVertexTextures:C,maxSamples:w}}function sm(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new Fn,a=new qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const M=r?0:n,x=M*4;let S=p.clippingState||null;c.value=S,S=h(g,d,x,f);for(let C=0;C!==x;++C)S[C]=t[C];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,S=f;x!==_;++x,S+=4)o.copy(u[x]).applyMatrix4(M,a),o.normal.toArray(m,S),m[S+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function rm(i){let e=new WeakMap;function t(o,a){return a===Ta?o.mapping=$i:a===wa&&(o.mapping=Yi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ta||a===wa)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new gd(c.height/2);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Ll extends Rl{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const zi=4,yc=[.125,.215,.35,.446,.526,.582],si=20,ca=new Ll,Sc=new We;let la=null,ha=0,ua=0;const ti=(1+Math.sqrt(5))/2,Ui=1/ti,Ec=[new I(1,1,1),new I(-1,1,1),new I(1,1,-1),new I(-1,1,-1),new I(0,ti,Ui),new I(0,ti,-Ui),new I(Ui,0,ti),new I(-Ui,0,ti),new I(ti,Ui,0),new I(-ti,Ui,0)];class bc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){la=this._renderer.getRenderTarget(),ha=this._renderer.getActiveCubeFace(),ua=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ac(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(la,ha,ua),e.scissorTest=!1,Ks(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===$i||e.mapping===Yi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),la=this._renderer.getRenderTarget(),ha=this._renderer.getActiveCubeFace(),ua=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Qt,minFilter:Qt,generateMipmaps:!1,type:vs,format:hn,colorSpace:Cn,depthBuffer:!1},s=Tc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=am(r)),this._blurMaterial=om(r,e,t)}return s}_compileMaterial(e){const t=new Ht(this._lodPlanes[0],e);this._renderer.compile(t,ca)}_sceneToCubeUV(e,t,n,s){const a=new tn(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Sc),h.toneMapping=Vn,h.autoClear=!1;const f=new fs({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),g=new Ht(new mi,f);let _=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,_=!0):(f.color.copy(Sc),_=!0);for(let p=0;p<6;p++){const M=p%3;M===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):M===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const x=this._cubeSize;Ks(s,M*x,p>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===$i||e.mapping===Yi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ac()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ht(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Ks(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,ca)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Ec[(s-1)%Ec.length];this._blur(e,s-1,s,r,o)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ht(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*si-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):si;m>si&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${si}`);const p=[];let M=0;for(let A=0;A<si;++A){const k=A/_,v=Math.exp(-k*k/2);p.push(v),A===0?M+=v:A<m&&(M+=2*v)}for(let A=0;A<p.length;A++)p[A]=p[A]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const S=this._sizeLods[s],C=3*S*(s>x-zi?s-x+zi:0),w=4*(this._cubeSize-S);Ks(t,C,w,3*S,2*S),c.setRenderTarget(t),c.render(u,ca)}}function am(i){const e=[],t=[],n=[];let s=i;const r=i-zi+1+yc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let c=1/a;o>i-zi?c=yc[o-i+zi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,M=new Float32Array(_*g*f),x=new Float32Array(m*g*f),S=new Float32Array(p*g*f);for(let w=0;w<f;w++){const A=w%3*2/3-1,k=w>2?0:-1,v=[A,k,0,A+2/3,k,0,A+2/3,k+1,0,A,k,0,A+2/3,k+1,0,A,k+1,0];M.set(v,_*g*w),x.set(d,m*g*w);const y=[w,w,w,w,w,w];S.set(y,p*g*w)}const C=new Zt;C.setAttribute("position",new un(M,_)),C.setAttribute("uv",new un(x,m)),C.setAttribute("faceIndex",new un(S,p)),e.push(C),s>zi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Tc(i,e,t){const n=new li(i,e,t);return n.texture.mapping=Er,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ks(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function om(i,e,t){const n=new Float32Array(si),s=new I(0,1,0);return new ui({name:"SphericalGaussianBlur",defines:{n:si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Za(),fragmentShader:`

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
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function wc(){return new ui({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Za(),fragmentShader:`

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
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Ac(){return new ui({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Za(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Za(){return`

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
	`}function cm(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Ta||c===wa,h=c===$i||c===Yi;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=e.get(a);return t===null&&(t=new bc(i)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),e.set(a,u),u.texture}else{if(e.has(a))return e.get(a).texture;{const u=a.image;if(l&&u&&u.height>0||h&&u&&s(u)){t===null&&(t=new bc(i));const d=l?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function lm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function hm(i,e,t,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)e.remove(_[m])}d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)e.update(d[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)e.update(_[m],i.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const M=f.array;_=f.version;for(let x=0,S=M.length;x<S;x+=3){const C=M[x+0],w=M[x+1],A=M[x+2];d.push(C,w,w,A,A,C)}}else if(g!==void 0){const M=g.array;_=g.version;for(let x=0,S=M.length/3-1;x<S;x+=3){const C=x+0,w=x+1,A=x+2;d.push(C,w,w,A,A,C)}}else return;const m=new(Ml(d)?wl:Tl)(d,1);m.version=_;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function um(i,e,t,n){const s=n.isWebGL2;let r;function o(f){r=f}let a,c;function l(f){a=f.type,c=f.bytesPerElement}function h(f,g){i.drawElements(r,g,a,f*c),t.update(g,r,1)}function u(f,g,_){if(_===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,f*c,_),t.update(g,r,_)}function d(f,g,_){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<_;p++)this.render(f[p]/c,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,f,0,_);let p=0;for(let M=0;M<_;M++)p+=g[M];t.update(p,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function dm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function fm(i,e){return i[0]-e[0]}function pm(i,e){return Math.abs(e[1])-Math.abs(i[1])}function mm(i,e,t){const n={},s=new Float32Array(8),r=new WeakMap,o=new At,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){const d=l.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let m=r.get(h);if(m===void 0||m.count!==_){let F=function(){G.dispose(),r.delete(h),h.removeEventListener("dispose",F)};var f=F;m!==void 0&&m.texture.dispose();const x=h.morphAttributes.position!==void 0,S=h.morphAttributes.normal!==void 0,C=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],k=h.morphAttributes.color||[];let v=0;x===!0&&(v=1),S===!0&&(v=2),C===!0&&(v=3);let y=h.attributes.position.count*v,L=1;y>e.maxTextureSize&&(L=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const N=new Float32Array(y*L*4*_),G=new El(N,y,L,_);G.type=Bn,G.needsUpdate=!0;const P=v*4;for(let O=0;O<_;O++){const X=w[O],q=A[O],Y=k[O],K=y*L*4*O;for(let se=0;se<X.count;se++){const ce=se*P;x===!0&&(o.fromBufferAttribute(X,se),N[K+ce+0]=o.x,N[K+ce+1]=o.y,N[K+ce+2]=o.z,N[K+ce+3]=0),S===!0&&(o.fromBufferAttribute(q,se),N[K+ce+4]=o.x,N[K+ce+5]=o.y,N[K+ce+6]=o.z,N[K+ce+7]=0),C===!0&&(o.fromBufferAttribute(Y,se),N[K+ce+8]=o.x,N[K+ce+9]=o.y,N[K+ce+10]=o.z,N[K+ce+11]=Y.itemSize===4?o.w:1)}}m={count:_,texture:G,size:new ie(y,L)},r.set(h,m),h.addEventListener("dispose",F)}let p=0;for(let x=0;x<d.length;x++)p+=d[x];const M=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",M),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,t),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const g=d===void 0?0:d.length;let _=n[h.id];if(_===void 0||_.length!==g){_=[];for(let S=0;S<g;S++)_[S]=[S,0];n[h.id]=_}for(let S=0;S<g;S++){const C=_[S];C[0]=S,C[1]=d[S]}_.sort(pm);for(let S=0;S<8;S++)S<g&&_[S][1]?(a[S][0]=_[S][0],a[S][1]=_[S][1]):(a[S][0]=Number.MAX_SAFE_INTEGER,a[S][1]=0);a.sort(fm);const m=h.morphAttributes.position,p=h.morphAttributes.normal;let M=0;for(let S=0;S<8;S++){const C=a[S],w=C[0],A=C[1];w!==Number.MAX_SAFE_INTEGER&&A?(m&&h.getAttribute("morphTarget"+S)!==m[w]&&h.setAttribute("morphTarget"+S,m[w]),p&&h.getAttribute("morphNormal"+S)!==p[w]&&h.setAttribute("morphNormal"+S,p[w]),s[S]=A,M+=A):(m&&h.hasAttribute("morphTarget"+S)===!0&&h.deleteAttribute("morphTarget"+S),p&&h.hasAttribute("morphNormal"+S)===!0&&h.deleteAttribute("morphNormal"+S),s[S]=0)}const x=h.morphTargetsRelative?1:1-M;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function gm(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}class Dl extends Wt{constructor(e,t,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:oi,h!==oi&&h!==qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===oi&&(n=kn),n===void 0&&h===qi&&(n=ai),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Bt,this.minFilter=c!==void 0?c:Bt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Ul=new Wt,Il=new Dl(1,1);Il.compareFunction=xl;const Nl=new El,Ol=new Qu,Fl=new Cl,Rc=[],Cc=[],Pc=new Float32Array(16),Lc=new Float32Array(9),Dc=new Float32Array(4);function Qi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Rc[s];if(r===void 0&&(r=new Float32Array(s),Rc[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function yt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function St(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ar(i,e){let t=Cc[e];t===void 0&&(t=new Int32Array(e),Cc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function _m(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function vm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yt(t,e))return;i.uniform2fv(this.addr,e),St(t,e)}}function xm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yt(t,e))return;i.uniform3fv(this.addr,e),St(t,e)}}function Mm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yt(t,e))return;i.uniform4fv(this.addr,e),St(t,e)}}function ym(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(yt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),St(t,e)}else{if(yt(t,n))return;Dc.set(n),i.uniformMatrix2fv(this.addr,!1,Dc),St(t,n)}}function Sm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(yt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),St(t,e)}else{if(yt(t,n))return;Lc.set(n),i.uniformMatrix3fv(this.addr,!1,Lc),St(t,n)}}function Em(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(yt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),St(t,e)}else{if(yt(t,n))return;Pc.set(n),i.uniformMatrix4fv(this.addr,!1,Pc),St(t,n)}}function bm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Tm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yt(t,e))return;i.uniform2iv(this.addr,e),St(t,e)}}function wm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yt(t,e))return;i.uniform3iv(this.addr,e),St(t,e)}}function Am(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yt(t,e))return;i.uniform4iv(this.addr,e),St(t,e)}}function Rm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Cm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yt(t,e))return;i.uniform2uiv(this.addr,e),St(t,e)}}function Pm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yt(t,e))return;i.uniform3uiv(this.addr,e),St(t,e)}}function Lm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yt(t,e))return;i.uniform4uiv(this.addr,e),St(t,e)}}function Dm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Il:Ul;t.setTexture2D(e||r,s)}function Um(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Ol,s)}function Im(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Fl,s)}function Nm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Nl,s)}function Om(i){switch(i){case 5126:return _m;case 35664:return vm;case 35665:return xm;case 35666:return Mm;case 35674:return ym;case 35675:return Sm;case 35676:return Em;case 5124:case 35670:return bm;case 35667:case 35671:return Tm;case 35668:case 35672:return wm;case 35669:case 35673:return Am;case 5125:return Rm;case 36294:return Cm;case 36295:return Pm;case 36296:return Lm;case 35678:case 36198:case 36298:case 36306:case 35682:return Dm;case 35679:case 36299:case 36307:return Um;case 35680:case 36300:case 36308:case 36293:return Im;case 36289:case 36303:case 36311:case 36292:return Nm}}function Fm(i,e){i.uniform1fv(this.addr,e)}function km(i,e){const t=Qi(e,this.size,2);i.uniform2fv(this.addr,t)}function Bm(i,e){const t=Qi(e,this.size,3);i.uniform3fv(this.addr,t)}function zm(i,e){const t=Qi(e,this.size,4);i.uniform4fv(this.addr,t)}function Hm(i,e){const t=Qi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Gm(i,e){const t=Qi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Vm(i,e){const t=Qi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Wm(i,e){i.uniform1iv(this.addr,e)}function Xm(i,e){i.uniform2iv(this.addr,e)}function $m(i,e){i.uniform3iv(this.addr,e)}function Ym(i,e){i.uniform4iv(this.addr,e)}function qm(i,e){i.uniform1uiv(this.addr,e)}function jm(i,e){i.uniform2uiv(this.addr,e)}function Zm(i,e){i.uniform3uiv(this.addr,e)}function Km(i,e){i.uniform4uiv(this.addr,e)}function Jm(i,e,t){const n=this.cache,s=e.length,r=Ar(t,s);yt(n,r)||(i.uniform1iv(this.addr,r),St(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Ul,r[o])}function Qm(i,e,t){const n=this.cache,s=e.length,r=Ar(t,s);yt(n,r)||(i.uniform1iv(this.addr,r),St(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Ol,r[o])}function eg(i,e,t){const n=this.cache,s=e.length,r=Ar(t,s);yt(n,r)||(i.uniform1iv(this.addr,r),St(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Fl,r[o])}function tg(i,e,t){const n=this.cache,s=e.length,r=Ar(t,s);yt(n,r)||(i.uniform1iv(this.addr,r),St(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Nl,r[o])}function ng(i){switch(i){case 5126:return Fm;case 35664:return km;case 35665:return Bm;case 35666:return zm;case 35674:return Hm;case 35675:return Gm;case 35676:return Vm;case 5124:case 35670:return Wm;case 35667:case 35671:return Xm;case 35668:case 35672:return $m;case 35669:case 35673:return Ym;case 5125:return qm;case 36294:return jm;case 36295:return Zm;case 36296:return Km;case 35678:case 36198:case 36298:case 36306:case 35682:return Jm;case 35679:case 36299:case 36307:return Qm;case 35680:case 36300:case 36308:case 36293:return eg;case 36289:case 36303:case 36311:case 36292:return tg}}class ig{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Om(t.type)}}class sg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ng(t.type)}}class rg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const da=/(\w+)(\])?(\[|\.)?/g;function Uc(i,e){i.seq.push(e),i.map[e.id]=e}function ag(i,e,t){const n=i.name,s=n.length;for(da.lastIndex=0;;){const r=da.exec(n),o=da.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Uc(t,l===void 0?new ig(a,i,e):new sg(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new rg(a),Uc(t,u)),t=u}}}class or{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);ag(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function Ic(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const og=37297;let cg=0;function lg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function hg(i){const e=tt.getPrimaries(tt.workingColorSpace),t=tt.getPrimaries(i);let n;switch(e===t?n="":e===mr&&t===pr?n="LinearDisplayP3ToLinearSRGB":e===pr&&t===mr&&(n="LinearSRGBToLinearDisplayP3"),i){case Cn:case br:return[n,"LinearTransferOETF"];case Mt:case Xa:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Nc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+lg(i.getShaderSource(e),o)}else return s}function ug(i,e){const t=hg(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function dg(i,e){let t;switch(e){case yu:t="Linear";break;case Su:t="Reinhard";break;case Eu:t="OptimizedCineon";break;case bu:t="ACESFilmic";break;case wu:t="AgX";break;case Tu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function fg(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Hi).join(`
`)}function pg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Hi).join(`
`)}function mg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function gg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Hi(i){return i!==""}function Oc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const _g=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ua(i){return i.replace(_g,xg)}const vg=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function xg(i,e){let t=Ve[e];if(t===void 0){const n=vg.get(e);if(n!==void 0)t=Ve[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ua(t)}const Mg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kc(i){return i.replace(Mg,yg)}function yg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bc(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Sg(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===al?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ol?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Sn&&(e="SHADOWMAP_TYPE_VSM"),e}function Eg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case $i:case Yi:e="ENVMAP_TYPE_CUBE";break;case Er:e="ENVMAP_TYPE_CUBE_UV";break}return e}function bg(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Yi:e="ENVMAP_MODE_REFRACTION";break}return e}function Tg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case cl:e="ENVMAP_BLENDING_MULTIPLY";break;case xu:e="ENVMAP_BLENDING_MIX";break;case Mu:e="ENVMAP_BLENDING_ADD";break}return e}function wg(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Ag(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=Sg(t),l=Eg(t),h=bg(t),u=Tg(t),d=wg(t),f=t.isWebGL2?"":fg(t),g=pg(t),_=mg(r),m=s.createProgram();let p,M,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Hi).join(`
`),p.length>0&&(p+=`
`),M=[f,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Hi).join(`
`),M.length>0&&(M+=`
`)):(p=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hi).join(`
`),M=[f,Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vn?"#define TONE_MAPPING":"",t.toneMapping!==Vn?Ve.tonemapping_pars_fragment:"",t.toneMapping!==Vn?dg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,ug("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Hi).join(`
`)),o=Ua(o),o=Oc(o,t),o=Fc(o,t),a=Ua(a),a=Oc(a,t),a=Fc(a,t),o=kc(o),a=kc(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,M=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===ic?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ic?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);const S=x+p+o,C=x+M+a,w=Ic(s,s.VERTEX_SHADER,S),A=Ic(s,s.FRAGMENT_SHADER,C);s.attachShader(m,w),s.attachShader(m,A),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function k(N){if(i.debug.checkShaderErrors){const G=s.getProgramInfoLog(m).trim(),P=s.getShaderInfoLog(w).trim(),F=s.getShaderInfoLog(A).trim();let O=!0,X=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(O=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,w,A);else{const q=Nc(s,w,"vertex"),Y=Nc(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+G+`
`+q+`
`+Y)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(P===""||F==="")&&(X=!1);X&&(N.diagnostics={runnable:O,programLog:G,vertexShader:{log:P,prefix:p},fragmentShader:{log:F,prefix:M}})}s.deleteShader(w),s.deleteShader(A),v=new or(s,m),y=gg(s,m)}let v;this.getUniforms=function(){return v===void 0&&k(this),v};let y;this.getAttributes=function(){return y===void 0&&k(this),y};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(m,og)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=cg++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=w,this.fragmentShader=A,this}let Rg=0;class Cg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Pg(e),t.set(e,n)),n}}class Pg{constructor(e){this.id=Rg++,this.code=e,this.usedTimes=0}}function Lg(i,e,t,n,s,r,o){const a=new qa,c=new Cg,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return v===0?"uv":`uv${v}`}function m(v,y,L,N,G){const P=N.fog,F=G.geometry,O=v.isMeshStandardMaterial?N.environment:null,X=(v.isMeshStandardMaterial?t:e).get(v.envMap||O),q=X&&X.mapping===Er?X.image.height:null,Y=g[v.type];v.precision!==null&&(f=s.getMaxPrecision(v.precision),f!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const K=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,se=K!==void 0?K.length:0;let ce=0;F.morphAttributes.position!==void 0&&(ce=1),F.morphAttributes.normal!==void 0&&(ce=2),F.morphAttributes.color!==void 0&&(ce=3);let $,Q,pe,Ee;if(Y){const pt=fn[Y];$=pt.vertexShader,Q=pt.fragmentShader}else $=v.vertexShader,Q=v.fragmentShader,c.update(v),pe=c.getVertexShaderID(v),Ee=c.getFragmentShaderID(v);const xe=i.getRenderTarget(),De=G.isInstancedMesh===!0,Fe=G.isBatchedMesh===!0,Se=!!v.map,Ne=!!v.matcap,D=!!X,he=!!v.aoMap,Z=!!v.lightMap,ae=!!v.bumpMap,j=!!v.normalMap,be=!!v.displacementMap,me=!!v.emissiveMap,b=!!v.metalnessMap,E=!!v.roughnessMap,B=v.anisotropy>0,ne=v.clearcoat>0,ee=v.iridescence>0,J=v.sheen>0,ye=v.transmission>0,de=B&&!!v.anisotropyMap,_e=ne&&!!v.clearcoatMap,Pe=ne&&!!v.clearcoatNormalMap,ze=ne&&!!v.clearcoatRoughnessMap,te=ee&&!!v.iridescenceMap,Qe=ee&&!!v.iridescenceThicknessMap,Xe=J&&!!v.sheenColorMap,ke=J&&!!v.sheenRoughnessMap,Ce=!!v.specularMap,ge=!!v.specularColorMap,R=!!v.specularIntensityMap,oe=ye&&!!v.transmissionMap,Te=ye&&!!v.thicknessMap,Me=!!v.gradientMap,re=!!v.alphaMap,U=v.alphaTest>0,le=!!v.alphaHash,fe=!!v.extensions,Ue=!!F.attributes.uv1,Le=!!F.attributes.uv2,Ze=!!F.attributes.uv3;let Ke=Vn;return v.toneMapped&&(xe===null||xe.isXRRenderTarget===!0)&&(Ke=i.toneMapping),{isWebGL2:h,shaderID:Y,shaderType:v.type,shaderName:v.name,vertexShader:$,fragmentShader:Q,defines:v.defines,customVertexShaderID:pe,customFragmentShaderID:Ee,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:Fe,instancing:De,instancingColor:De&&G.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:xe===null?i.outputColorSpace:xe.isXRRenderTarget===!0?xe.texture.colorSpace:Cn,map:Se,matcap:Ne,envMap:D,envMapMode:D&&X.mapping,envMapCubeUVHeight:q,aoMap:he,lightMap:Z,bumpMap:ae,normalMap:j,displacementMap:d&&be,emissiveMap:me,normalMapObjectSpace:j&&v.normalMapType===ku,normalMapTangentSpace:j&&v.normalMapType===vl,metalnessMap:b,roughnessMap:E,anisotropy:B,anisotropyMap:de,clearcoat:ne,clearcoatMap:_e,clearcoatNormalMap:Pe,clearcoatRoughnessMap:ze,iridescence:ee,iridescenceMap:te,iridescenceThicknessMap:Qe,sheen:J,sheenColorMap:Xe,sheenRoughnessMap:ke,specularMap:Ce,specularColorMap:ge,specularIntensityMap:R,transmission:ye,transmissionMap:oe,thicknessMap:Te,gradientMap:Me,opaque:v.transparent===!1&&v.blending===Vi,alphaMap:re,alphaTest:U,alphaHash:le,combine:v.combine,mapUv:Se&&_(v.map.channel),aoMapUv:he&&_(v.aoMap.channel),lightMapUv:Z&&_(v.lightMap.channel),bumpMapUv:ae&&_(v.bumpMap.channel),normalMapUv:j&&_(v.normalMap.channel),displacementMapUv:be&&_(v.displacementMap.channel),emissiveMapUv:me&&_(v.emissiveMap.channel),metalnessMapUv:b&&_(v.metalnessMap.channel),roughnessMapUv:E&&_(v.roughnessMap.channel),anisotropyMapUv:de&&_(v.anisotropyMap.channel),clearcoatMapUv:_e&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:Pe&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ze&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:Qe&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:Xe&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:ke&&_(v.sheenRoughnessMap.channel),specularMapUv:Ce&&_(v.specularMap.channel),specularColorMapUv:ge&&_(v.specularColorMap.channel),specularIntensityMapUv:R&&_(v.specularIntensityMap.channel),transmissionMapUv:oe&&_(v.transmissionMap.channel),thicknessMapUv:Te&&_(v.thicknessMap.channel),alphaMapUv:re&&_(v.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(j||B),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Ue,vertexUv2s:Le,vertexUv3s:Ze,pointsUvs:G.isPoints===!0&&!!F.attributes.uv&&(Se||re),fog:!!P,useFog:v.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:G.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:ce,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ke,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Se&&v.map.isVideoTexture===!0&&tt.getTransfer(v.map.colorSpace)===ot,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===bn,flipSided:v.side===Vt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionDerivatives:fe&&v.extensions.derivatives===!0,extensionFragDepth:fe&&v.extensions.fragDepth===!0,extensionDrawBuffers:fe&&v.extensions.drawBuffers===!0,extensionShaderTextureLOD:fe&&v.extensions.shaderTextureLOD===!0,extensionClipCullDistance:fe&&v.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()}}function p(v){const y=[];if(v.shaderID?y.push(v.shaderID):(y.push(v.customVertexShaderID),y.push(v.customFragmentShaderID)),v.defines!==void 0)for(const L in v.defines)y.push(L),y.push(v.defines[L]);return v.isRawShaderMaterial===!1&&(M(y,v),x(y,v),y.push(i.outputColorSpace)),y.push(v.customProgramCacheKey),y.join()}function M(v,y){v.push(y.precision),v.push(y.outputColorSpace),v.push(y.envMapMode),v.push(y.envMapCubeUVHeight),v.push(y.mapUv),v.push(y.alphaMapUv),v.push(y.lightMapUv),v.push(y.aoMapUv),v.push(y.bumpMapUv),v.push(y.normalMapUv),v.push(y.displacementMapUv),v.push(y.emissiveMapUv),v.push(y.metalnessMapUv),v.push(y.roughnessMapUv),v.push(y.anisotropyMapUv),v.push(y.clearcoatMapUv),v.push(y.clearcoatNormalMapUv),v.push(y.clearcoatRoughnessMapUv),v.push(y.iridescenceMapUv),v.push(y.iridescenceThicknessMapUv),v.push(y.sheenColorMapUv),v.push(y.sheenRoughnessMapUv),v.push(y.specularMapUv),v.push(y.specularColorMapUv),v.push(y.specularIntensityMapUv),v.push(y.transmissionMapUv),v.push(y.thicknessMapUv),v.push(y.combine),v.push(y.fogExp2),v.push(y.sizeAttenuation),v.push(y.morphTargetsCount),v.push(y.morphAttributeCount),v.push(y.numDirLights),v.push(y.numPointLights),v.push(y.numSpotLights),v.push(y.numSpotLightMaps),v.push(y.numHemiLights),v.push(y.numRectAreaLights),v.push(y.numDirLightShadows),v.push(y.numPointLightShadows),v.push(y.numSpotLightShadows),v.push(y.numSpotLightShadowsWithMaps),v.push(y.numLightProbes),v.push(y.shadowMapType),v.push(y.toneMapping),v.push(y.numClippingPlanes),v.push(y.numClipIntersection),v.push(y.depthPacking)}function x(v,y){a.disableAll(),y.isWebGL2&&a.enable(0),y.supportsVertexTextures&&a.enable(1),y.instancing&&a.enable(2),y.instancingColor&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),v.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.useLegacyLights&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),v.push(a.mask)}function S(v){const y=g[v.type];let L;if(y){const N=fn[y];L=dd.clone(N.uniforms)}else L=v.uniforms;return L}function C(v,y){let L;for(let N=0,G=l.length;N<G;N++){const P=l[N];if(P.cacheKey===y){L=P,++L.usedTimes;break}}return L===void 0&&(L=new Ag(i,y,v,r),l.push(L)),L}function w(v){if(--v.usedTimes===0){const y=l.indexOf(v);l[y]=l[l.length-1],l.pop(),v.destroy()}}function A(v){c.remove(v)}function k(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:C,releaseProgram:w,releaseShaderCache:A,programs:l,dispose:k}}function Dg(){let i=new WeakMap;function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function t(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function Ug(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function zc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Hc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,f,g,_,m){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),e++,p}function a(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function l(u,d){t.length>1&&t.sort(u||Ug),n.length>1&&n.sort(d||zc),s.length>1&&s.sort(d||zc)}function h(){for(let u=e,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Ig(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new Hc,i.set(n,[o])):s>=r.length?(o=new Hc,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ng(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new We};break;case"SpotLight":t={position:new I,direction:new I,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function Og(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Fg=0;function kg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Bg(i,e){const t=new Ng,n=Og(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new I);const r=new I,o=new gt,a=new gt;function c(h,u){let d=0,f=0,g=0;for(let N=0;N<9;N++)s.probe[N].set(0,0,0);let _=0,m=0,p=0,M=0,x=0,S=0,C=0,w=0,A=0,k=0,v=0;h.sort(kg);const y=u===!0?Math.PI:1;for(let N=0,G=h.length;N<G;N++){const P=h[N],F=P.color,O=P.intensity,X=P.distance,q=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=F.r*O*y,f+=F.g*O*y,g+=F.b*O*y;else if(P.isLightProbe){for(let Y=0;Y<9;Y++)s.probe[Y].addScaledVector(P.sh.coefficients[Y],O);v++}else if(P.isDirectionalLight){const Y=t.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity*y),P.castShadow){const K=P.shadow,se=n.get(P);se.shadowBias=K.bias,se.shadowNormalBias=K.normalBias,se.shadowRadius=K.radius,se.shadowMapSize=K.mapSize,s.directionalShadow[_]=se,s.directionalShadowMap[_]=q,s.directionalShadowMatrix[_]=P.shadow.matrix,S++}s.directional[_]=Y,_++}else if(P.isSpotLight){const Y=t.get(P);Y.position.setFromMatrixPosition(P.matrixWorld),Y.color.copy(F).multiplyScalar(O*y),Y.distance=X,Y.coneCos=Math.cos(P.angle),Y.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Y.decay=P.decay,s.spot[p]=Y;const K=P.shadow;if(P.map&&(s.spotLightMap[A]=P.map,A++,K.updateMatrices(P),P.castShadow&&k++),s.spotLightMatrix[p]=K.matrix,P.castShadow){const se=n.get(P);se.shadowBias=K.bias,se.shadowNormalBias=K.normalBias,se.shadowRadius=K.radius,se.shadowMapSize=K.mapSize,s.spotShadow[p]=se,s.spotShadowMap[p]=q,w++}p++}else if(P.isRectAreaLight){const Y=t.get(P);Y.color.copy(F).multiplyScalar(O),Y.halfWidth.set(P.width*.5,0,0),Y.halfHeight.set(0,P.height*.5,0),s.rectArea[M]=Y,M++}else if(P.isPointLight){const Y=t.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity*y),Y.distance=P.distance,Y.decay=P.decay,P.castShadow){const K=P.shadow,se=n.get(P);se.shadowBias=K.bias,se.shadowNormalBias=K.normalBias,se.shadowRadius=K.radius,se.shadowMapSize=K.mapSize,se.shadowCameraNear=K.camera.near,se.shadowCameraFar=K.camera.far,s.pointShadow[m]=se,s.pointShadowMap[m]=q,s.pointShadowMatrix[m]=P.shadow.matrix,C++}s.point[m]=Y,m++}else if(P.isHemisphereLight){const Y=t.get(P);Y.skyColor.copy(P.color).multiplyScalar(O*y),Y.groundColor.copy(P.groundColor).multiplyScalar(O*y),s.hemi[x]=Y,x++}}M>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ue.LTC_FLOAT_1,s.rectAreaLTC2=ue.LTC_FLOAT_2):(s.rectAreaLTC1=ue.LTC_HALF_1,s.rectAreaLTC2=ue.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ue.LTC_FLOAT_1,s.rectAreaLTC2=ue.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ue.LTC_HALF_1,s.rectAreaLTC2=ue.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;const L=s.hash;(L.directionalLength!==_||L.pointLength!==m||L.spotLength!==p||L.rectAreaLength!==M||L.hemiLength!==x||L.numDirectionalShadows!==S||L.numPointShadows!==C||L.numSpotShadows!==w||L.numSpotMaps!==A||L.numLightProbes!==v)&&(s.directional.length=_,s.spot.length=p,s.rectArea.length=M,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=S,s.directionalShadowMap.length=S,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=S,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=w+A-k,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=k,s.numLightProbes=v,L.directionalLength=_,L.pointLength=m,L.spotLength=p,L.rectAreaLength=M,L.hemiLength=x,L.numDirectionalShadows=S,L.numPointShadows=C,L.numSpotShadows=w,L.numSpotMaps=A,L.numLightProbes=v,s.version=Fg++)}function l(h,u){let d=0,f=0,g=0,_=0,m=0;const p=u.matrixWorldInverse;for(let M=0,x=h.length;M<x;M++){const S=h[M];if(S.isDirectionalLight){const C=s.directional[d];C.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(p),d++}else if(S.isSpotLight){const C=s.spot[g];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(p),C.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(p),g++}else if(S.isRectAreaLight){const C=s.rectArea[_];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(p),a.identity(),o.copy(S.matrixWorld),o.premultiply(p),a.extractRotation(o),C.halfWidth.set(S.width*.5,0,0),C.halfHeight.set(0,S.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){const C=s.point[f];C.position.setFromMatrixPosition(S.matrixWorld),C.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){const C=s.hemi[m];C.direction.setFromMatrixPosition(S.matrixWorld),C.direction.transformDirection(p),m++}}}return{setup:c,setupView:l,state:s}}function Gc(i,e){const t=new Bg(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function c(u){t.setup(n,u)}function l(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function zg(i,e){let t=new WeakMap;function n(r,o=0){const a=t.get(r);let c;return a===void 0?(c=new Gc(i,e),t.set(r,[c])):o>=a.length?(c=new Gc(i,e),a.push(c)):c=a[o],c}function s(){t=new WeakMap}return{get:n,dispose:s}}class Hg extends Ji{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ou,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Gg extends Ji{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Vg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wg=`uniform sampler2D shadow_pass;
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
}`;function Xg(i,e,t){let n=new ja;const s=new ie,r=new ie,o=new At,a=new Hg({depthPacking:Fu}),c=new Gg,l={},h=t.maxTextureSize,u={[qn]:Vt,[Vt]:qn,[bn]:bn},d=new ui({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ie},radius:{value:4}},vertexShader:Vg,fragmentShader:Wg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Zt;g.setAttribute("position",new un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ht(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=al;let p=this.type;this.render=function(w,A,k){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const v=i.getRenderTarget(),y=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),N=i.state;N.setBlending(Gn),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const G=p!==Sn&&this.type===Sn,P=p===Sn&&this.type!==Sn;for(let F=0,O=w.length;F<O;F++){const X=w[F],q=X.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);const Y=q.getFrameExtents();if(s.multiply(Y),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,q.mapSize.y=r.y)),q.map===null||G===!0||P===!0){const se=this.type!==Sn?{minFilter:Bt,magFilter:Bt}:{};q.map!==null&&q.map.dispose(),q.map=new li(s.x,s.y,se),q.map.texture.name=X.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const K=q.getViewportCount();for(let se=0;se<K;se++){const ce=q.getViewport(se);o.set(r.x*ce.x,r.y*ce.y,r.x*ce.z,r.y*ce.w),N.viewport(o),q.updateMatrices(X,se),n=q.getFrustum(),S(A,k,q.camera,X,this.type)}q.isPointLightShadow!==!0&&this.type===Sn&&M(q,k),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(v,y,L)};function M(w,A){const k=e.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new li(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,k,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,k,f,_,null)}function x(w,A,k,v){let y=null;const L=k.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)y=L;else if(y=k.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const N=y.uuid,G=A.uuid;let P=l[N];P===void 0&&(P={},l[N]=P);let F=P[G];F===void 0&&(F=y.clone(),P[G]=F,A.addEventListener("dispose",C)),y=F}if(y.visible=A.visible,y.wireframe=A.wireframe,v===Sn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,k.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const N=i.properties.get(y);N.light=k}return y}function S(w,A,k,v,y){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===Sn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,w.matrixWorld);const G=e.update(w),P=w.material;if(Array.isArray(P)){const F=G.groups;for(let O=0,X=F.length;O<X;O++){const q=F[O],Y=P[q.materialIndex];if(Y&&Y.visible){const K=x(w,Y,v,y);w.onBeforeShadow(i,w,A,k,G,K,q),i.renderBufferDirect(k,null,G,K,w,q),w.onAfterShadow(i,w,A,k,G,K,q)}}}else if(P.visible){const F=x(w,P,v,y);w.onBeforeShadow(i,w,A,k,G,F,null),i.renderBufferDirect(k,null,G,F,w,null),w.onAfterShadow(i,w,A,k,G,F,null)}}const N=w.children;for(let G=0,P=N.length;G<P;G++)S(N[G],A,k,v,y)}function C(w){w.target.removeEventListener("dispose",C);for(const k in l){const v=l[k],y=w.target.uuid;y in v&&(v[y].dispose(),delete v[y])}}}function $g(i,e,t){const n=t.isWebGL2;function s(){let U=!1;const le=new At;let fe=null;const Ue=new At(0,0,0,0);return{setMask:function(Le){fe!==Le&&!U&&(i.colorMask(Le,Le,Le,Le),fe=Le)},setLocked:function(Le){U=Le},setClear:function(Le,Ze,Ke,ut,pt){pt===!0&&(Le*=ut,Ze*=ut,Ke*=ut),le.set(Le,Ze,Ke,ut),Ue.equals(le)===!1&&(i.clearColor(Le,Ze,Ke,ut),Ue.copy(le))},reset:function(){U=!1,fe=null,Ue.set(-1,0,0,0)}}}function r(){let U=!1,le=null,fe=null,Ue=null;return{setTest:function(Le){Le?Fe(i.DEPTH_TEST):Se(i.DEPTH_TEST)},setMask:function(Le){le!==Le&&!U&&(i.depthMask(Le),le=Le)},setFunc:function(Le){if(fe!==Le){switch(Le){case du:i.depthFunc(i.NEVER);break;case fu:i.depthFunc(i.ALWAYS);break;case pu:i.depthFunc(i.LESS);break;case dr:i.depthFunc(i.LEQUAL);break;case mu:i.depthFunc(i.EQUAL);break;case gu:i.depthFunc(i.GEQUAL);break;case _u:i.depthFunc(i.GREATER);break;case vu:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}fe=Le}},setLocked:function(Le){U=Le},setClear:function(Le){Ue!==Le&&(i.clearDepth(Le),Ue=Le)},reset:function(){U=!1,le=null,fe=null,Ue=null}}}function o(){let U=!1,le=null,fe=null,Ue=null,Le=null,Ze=null,Ke=null,ut=null,pt=null;return{setTest:function(et){U||(et?Fe(i.STENCIL_TEST):Se(i.STENCIL_TEST))},setMask:function(et){le!==et&&!U&&(i.stencilMask(et),le=et)},setFunc:function(et,vt,dn){(fe!==et||Ue!==vt||Le!==dn)&&(i.stencilFunc(et,vt,dn),fe=et,Ue=vt,Le=dn)},setOp:function(et,vt,dn){(Ze!==et||Ke!==vt||ut!==dn)&&(i.stencilOp(et,vt,dn),Ze=et,Ke=vt,ut=dn)},setLocked:function(et){U=et},setClear:function(et){pt!==et&&(i.clearStencil(et),pt=et)},reset:function(){U=!1,le=null,fe=null,Ue=null,Le=null,Ze=null,Ke=null,ut=null,pt=null}}}const a=new s,c=new r,l=new o,h=new WeakMap,u=new WeakMap;let d={},f={},g=new WeakMap,_=[],m=null,p=!1,M=null,x=null,S=null,C=null,w=null,A=null,k=null,v=new We(0,0,0),y=0,L=!1,N=null,G=null,P=null,F=null,O=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Y=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(K)[1]),q=Y>=1):K.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),q=Y>=2);let se=null,ce={};const $=i.getParameter(i.SCISSOR_BOX),Q=i.getParameter(i.VIEWPORT),pe=new At().fromArray($),Ee=new At().fromArray(Q);function xe(U,le,fe,Ue){const Le=new Uint8Array(4),Ze=i.createTexture();i.bindTexture(U,Ze),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ke=0;Ke<fe;Ke++)n&&(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)?i.texImage3D(le,0,i.RGBA,1,1,Ue,0,i.RGBA,i.UNSIGNED_BYTE,Le):i.texImage2D(le+Ke,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Le);return Ze}const De={};De[i.TEXTURE_2D]=xe(i.TEXTURE_2D,i.TEXTURE_2D,1),De[i.TEXTURE_CUBE_MAP]=xe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(De[i.TEXTURE_2D_ARRAY]=xe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),De[i.TEXTURE_3D]=xe(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Fe(i.DEPTH_TEST),c.setFunc(dr),me(!1),b(bo),Fe(i.CULL_FACE),j(Gn);function Fe(U){d[U]!==!0&&(i.enable(U),d[U]=!0)}function Se(U){d[U]!==!1&&(i.disable(U),d[U]=!1)}function Ne(U,le){return f[U]!==le?(i.bindFramebuffer(U,le),f[U]=le,n&&(U===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=le),U===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=le)),!0):!1}function D(U,le){let fe=_,Ue=!1;if(U)if(fe=g.get(le),fe===void 0&&(fe=[],g.set(le,fe)),U.isWebGLMultipleRenderTargets){const Le=U.texture;if(fe.length!==Le.length||fe[0]!==i.COLOR_ATTACHMENT0){for(let Ze=0,Ke=Le.length;Ze<Ke;Ze++)fe[Ze]=i.COLOR_ATTACHMENT0+Ze;fe.length=Le.length,Ue=!0}}else fe[0]!==i.COLOR_ATTACHMENT0&&(fe[0]=i.COLOR_ATTACHMENT0,Ue=!0);else fe[0]!==i.BACK&&(fe[0]=i.BACK,Ue=!0);Ue&&(t.isWebGL2?i.drawBuffers(fe):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(fe))}function he(U){return m!==U?(i.useProgram(U),m=U,!0):!1}const Z={[ii]:i.FUNC_ADD,[Kh]:i.FUNC_SUBTRACT,[Jh]:i.FUNC_REVERSE_SUBTRACT};if(n)Z[Ro]=i.MIN,Z[Co]=i.MAX;else{const U=e.get("EXT_blend_minmax");U!==null&&(Z[Ro]=U.MIN_EXT,Z[Co]=U.MAX_EXT)}const ae={[Qh]:i.ZERO,[eu]:i.ONE,[tu]:i.SRC_COLOR,[Ea]:i.SRC_ALPHA,[ou]:i.SRC_ALPHA_SATURATE,[ru]:i.DST_COLOR,[iu]:i.DST_ALPHA,[nu]:i.ONE_MINUS_SRC_COLOR,[ba]:i.ONE_MINUS_SRC_ALPHA,[au]:i.ONE_MINUS_DST_COLOR,[su]:i.ONE_MINUS_DST_ALPHA,[cu]:i.CONSTANT_COLOR,[lu]:i.ONE_MINUS_CONSTANT_COLOR,[hu]:i.CONSTANT_ALPHA,[uu]:i.ONE_MINUS_CONSTANT_ALPHA};function j(U,le,fe,Ue,Le,Ze,Ke,ut,pt,et){if(U===Gn){p===!0&&(Se(i.BLEND),p=!1);return}if(p===!1&&(Fe(i.BLEND),p=!0),U!==Zh){if(U!==M||et!==L){if((x!==ii||w!==ii)&&(i.blendEquation(i.FUNC_ADD),x=ii,w=ii),et)switch(U){case Vi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case To:i.blendFunc(i.ONE,i.ONE);break;case wo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ao:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Vi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case To:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case wo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ao:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}S=null,C=null,A=null,k=null,v.set(0,0,0),y=0,M=U,L=et}return}Le=Le||le,Ze=Ze||fe,Ke=Ke||Ue,(le!==x||Le!==w)&&(i.blendEquationSeparate(Z[le],Z[Le]),x=le,w=Le),(fe!==S||Ue!==C||Ze!==A||Ke!==k)&&(i.blendFuncSeparate(ae[fe],ae[Ue],ae[Ze],ae[Ke]),S=fe,C=Ue,A=Ze,k=Ke),(ut.equals(v)===!1||pt!==y)&&(i.blendColor(ut.r,ut.g,ut.b,pt),v.copy(ut),y=pt),M=U,L=!1}function be(U,le){U.side===bn?Se(i.CULL_FACE):Fe(i.CULL_FACE);let fe=U.side===Vt;le&&(fe=!fe),me(fe),U.blending===Vi&&U.transparent===!1?j(Gn):j(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),c.setFunc(U.depthFunc),c.setTest(U.depthTest),c.setMask(U.depthWrite),a.setMask(U.colorWrite);const Ue=U.stencilWrite;l.setTest(Ue),Ue&&(l.setMask(U.stencilWriteMask),l.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),l.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),B(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Fe(i.SAMPLE_ALPHA_TO_COVERAGE):Se(i.SAMPLE_ALPHA_TO_COVERAGE)}function me(U){N!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),N=U)}function b(U){U!==qh?(Fe(i.CULL_FACE),U!==G&&(U===bo?i.cullFace(i.BACK):U===jh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Se(i.CULL_FACE),G=U}function E(U){U!==P&&(q&&i.lineWidth(U),P=U)}function B(U,le,fe){U?(Fe(i.POLYGON_OFFSET_FILL),(F!==le||O!==fe)&&(i.polygonOffset(le,fe),F=le,O=fe)):Se(i.POLYGON_OFFSET_FILL)}function ne(U){U?Fe(i.SCISSOR_TEST):Se(i.SCISSOR_TEST)}function ee(U){U===void 0&&(U=i.TEXTURE0+X-1),se!==U&&(i.activeTexture(U),se=U)}function J(U,le,fe){fe===void 0&&(se===null?fe=i.TEXTURE0+X-1:fe=se);let Ue=ce[fe];Ue===void 0&&(Ue={type:void 0,texture:void 0},ce[fe]=Ue),(Ue.type!==U||Ue.texture!==le)&&(se!==fe&&(i.activeTexture(fe),se=fe),i.bindTexture(U,le||De[U]),Ue.type=U,Ue.texture=le)}function ye(){const U=ce[se];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function de(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _e(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Pe(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ze(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function te(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Qe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Xe(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ke(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ce(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ge(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function R(U){pe.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),pe.copy(U))}function oe(U){Ee.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Ee.copy(U))}function Te(U,le){let fe=u.get(le);fe===void 0&&(fe=new WeakMap,u.set(le,fe));let Ue=fe.get(U);Ue===void 0&&(Ue=i.getUniformBlockIndex(le,U.name),fe.set(U,Ue))}function Me(U,le){const Ue=u.get(le).get(U);h.get(le)!==Ue&&(i.uniformBlockBinding(le,Ue,U.__bindingPointIndex),h.set(le,Ue))}function re(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},se=null,ce={},f={},g=new WeakMap,_=[],m=null,p=!1,M=null,x=null,S=null,C=null,w=null,A=null,k=null,v=new We(0,0,0),y=0,L=!1,N=null,G=null,P=null,F=null,O=null,pe.set(0,0,i.canvas.width,i.canvas.height),Ee.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:Fe,disable:Se,bindFramebuffer:Ne,drawBuffers:D,useProgram:he,setBlending:j,setMaterial:be,setFlipSided:me,setCullFace:b,setLineWidth:E,setPolygonOffset:B,setScissorTest:ne,activeTexture:ee,bindTexture:J,unbindTexture:ye,compressedTexImage2D:de,compressedTexImage3D:_e,texImage2D:Ce,texImage3D:ge,updateUBOMapping:Te,uniformBlockBinding:Me,texStorage2D:Xe,texStorage3D:ke,texSubImage2D:Pe,texSubImage3D:ze,compressedTexSubImage2D:te,compressedTexSubImage3D:Qe,scissor:R,viewport:oe,reset:re}}function Yg(i,e,t,n,s,r,o){const a=s.isWebGL2,c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,E){return f?new OffscreenCanvas(b,E):_r("canvas")}function _(b,E,B,ne){let ee=1;if((b.width>ne||b.height>ne)&&(ee=ne/Math.max(b.width,b.height)),ee<1||E===!0)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap){const J=E?Da:Math.floor,ye=J(ee*b.width),de=J(ee*b.height);u===void 0&&(u=g(ye,de));const _e=B?g(ye,de):u;return _e.width=ye,_e.height=de,_e.getContext("2d").drawImage(b,0,0,ye,de),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+b.width+"x"+b.height+") to ("+ye+"x"+de+")."),_e}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+b.width+"x"+b.height+")."),b;return b}function m(b){return sc(b.width)&&sc(b.height)}function p(b){return a?!1:b.wrapS!==ln||b.wrapT!==ln||b.minFilter!==Bt&&b.minFilter!==Qt}function M(b,E){return b.generateMipmaps&&E&&b.minFilter!==Bt&&b.minFilter!==Qt}function x(b){i.generateMipmap(b)}function S(b,E,B,ne,ee=!1){if(a===!1)return E;if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let J=E;if(E===i.RED&&(B===i.FLOAT&&(J=i.R32F),B===i.HALF_FLOAT&&(J=i.R16F),B===i.UNSIGNED_BYTE&&(J=i.R8)),E===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.R8UI),B===i.UNSIGNED_SHORT&&(J=i.R16UI),B===i.UNSIGNED_INT&&(J=i.R32UI),B===i.BYTE&&(J=i.R8I),B===i.SHORT&&(J=i.R16I),B===i.INT&&(J=i.R32I)),E===i.RG&&(B===i.FLOAT&&(J=i.RG32F),B===i.HALF_FLOAT&&(J=i.RG16F),B===i.UNSIGNED_BYTE&&(J=i.RG8)),E===i.RGBA){const ye=ee?fr:tt.getTransfer(ne);B===i.FLOAT&&(J=i.RGBA32F),B===i.HALF_FLOAT&&(J=i.RGBA16F),B===i.UNSIGNED_BYTE&&(J=ye===ot?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function C(b,E,B){return M(b,B)===!0||b.isFramebufferTexture&&b.minFilter!==Bt&&b.minFilter!==Qt?Math.log2(Math.max(E.width,E.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?E.mipmaps.length:1}function w(b){return b===Bt||b===Po||b===kr?i.NEAREST:i.LINEAR}function A(b){const E=b.target;E.removeEventListener("dispose",A),v(E),E.isVideoTexture&&h.delete(E)}function k(b){const E=b.target;E.removeEventListener("dispose",k),L(E)}function v(b){const E=n.get(b);if(E.__webglInit===void 0)return;const B=b.source,ne=d.get(B);if(ne){const ee=ne[E.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&y(b),Object.keys(ne).length===0&&d.delete(B)}n.remove(b)}function y(b){const E=n.get(b);i.deleteTexture(E.__webglTexture);const B=b.source,ne=d.get(B);delete ne[E.__cacheKey],o.memory.textures--}function L(b){const E=b.texture,B=n.get(b),ne=n.get(E);if(ne.__webglTexture!==void 0&&(i.deleteTexture(ne.__webglTexture),o.memory.textures--),b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(B.__webglFramebuffer[ee]))for(let J=0;J<B.__webglFramebuffer[ee].length;J++)i.deleteFramebuffer(B.__webglFramebuffer[ee][J]);else i.deleteFramebuffer(B.__webglFramebuffer[ee]);B.__webglDepthbuffer&&i.deleteRenderbuffer(B.__webglDepthbuffer[ee])}else{if(Array.isArray(B.__webglFramebuffer))for(let ee=0;ee<B.__webglFramebuffer.length;ee++)i.deleteFramebuffer(B.__webglFramebuffer[ee]);else i.deleteFramebuffer(B.__webglFramebuffer);if(B.__webglDepthbuffer&&i.deleteRenderbuffer(B.__webglDepthbuffer),B.__webglMultisampledFramebuffer&&i.deleteFramebuffer(B.__webglMultisampledFramebuffer),B.__webglColorRenderbuffer)for(let ee=0;ee<B.__webglColorRenderbuffer.length;ee++)B.__webglColorRenderbuffer[ee]&&i.deleteRenderbuffer(B.__webglColorRenderbuffer[ee]);B.__webglDepthRenderbuffer&&i.deleteRenderbuffer(B.__webglDepthRenderbuffer)}if(b.isWebGLMultipleRenderTargets)for(let ee=0,J=E.length;ee<J;ee++){const ye=n.get(E[ee]);ye.__webglTexture&&(i.deleteTexture(ye.__webglTexture),o.memory.textures--),n.remove(E[ee])}n.remove(E),n.remove(b)}let N=0;function G(){N=0}function P(){const b=N;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),N+=1,b}function F(b){const E=[];return E.push(b.wrapS),E.push(b.wrapT),E.push(b.wrapR||0),E.push(b.magFilter),E.push(b.minFilter),E.push(b.anisotropy),E.push(b.internalFormat),E.push(b.format),E.push(b.type),E.push(b.generateMipmaps),E.push(b.premultiplyAlpha),E.push(b.flipY),E.push(b.unpackAlignment),E.push(b.colorSpace),E.join()}function O(b,E){const B=n.get(b);if(b.isVideoTexture&&be(b),b.isRenderTargetTexture===!1&&b.version>0&&B.__version!==b.version){const ne=b.image;if(ne===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pe(B,b,E);return}}t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+E)}function X(b,E){const B=n.get(b);if(b.version>0&&B.__version!==b.version){pe(B,b,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+E)}function q(b,E){const B=n.get(b);if(b.version>0&&B.__version!==b.version){pe(B,b,E);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+E)}function Y(b,E){const B=n.get(b);if(b.version>0&&B.__version!==b.version){Ee(B,b,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+E)}const K={[Aa]:i.REPEAT,[ln]:i.CLAMP_TO_EDGE,[Ra]:i.MIRRORED_REPEAT},se={[Bt]:i.NEAREST,[Po]:i.NEAREST_MIPMAP_NEAREST,[kr]:i.NEAREST_MIPMAP_LINEAR,[Qt]:i.LINEAR,[Au]:i.LINEAR_MIPMAP_NEAREST,[_s]:i.LINEAR_MIPMAP_LINEAR},ce={[Bu]:i.NEVER,[Xu]:i.ALWAYS,[zu]:i.LESS,[xl]:i.LEQUAL,[Hu]:i.EQUAL,[Wu]:i.GEQUAL,[Gu]:i.GREATER,[Vu]:i.NOTEQUAL};function $(b,E,B){if(B?(i.texParameteri(b,i.TEXTURE_WRAP_S,K[E.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,K[E.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,K[E.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,se[E.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,se[E.minFilter])):(i.texParameteri(b,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(b,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(E.wrapS!==ln||E.wrapT!==ln)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(b,i.TEXTURE_MAG_FILTER,w(E.magFilter)),i.texParameteri(b,i.TEXTURE_MIN_FILTER,w(E.minFilter)),E.minFilter!==Bt&&E.minFilter!==Qt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,ce[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const ne=e.get("EXT_texture_filter_anisotropic");if(E.magFilter===Bt||E.minFilter!==kr&&E.minFilter!==_s||E.type===Bn&&e.has("OES_texture_float_linear")===!1||a===!1&&E.type===vs&&e.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(i.texParameterf(b,ne.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function Q(b,E){let B=!1;b.__webglInit===void 0&&(b.__webglInit=!0,E.addEventListener("dispose",A));const ne=E.source;let ee=d.get(ne);ee===void 0&&(ee={},d.set(ne,ee));const J=F(E);if(J!==b.__cacheKey){ee[J]===void 0&&(ee[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),ee[J].usedTimes++;const ye=ee[b.__cacheKey];ye!==void 0&&(ee[b.__cacheKey].usedTimes--,ye.usedTimes===0&&y(E)),b.__cacheKey=J,b.__webglTexture=ee[J].texture}return B}function pe(b,E,B){let ne=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(ne=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(ne=i.TEXTURE_3D);const ee=Q(b,E),J=E.source;t.bindTexture(ne,b.__webglTexture,i.TEXTURE0+B);const ye=n.get(J);if(J.version!==ye.__version||ee===!0){t.activeTexture(i.TEXTURE0+B);const de=tt.getPrimaries(tt.workingColorSpace),_e=E.colorSpace===nn?null:tt.getPrimaries(E.colorSpace),Pe=E.colorSpace===nn||de===_e?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);const ze=p(E)&&m(E.image)===!1;let te=_(E.image,ze,!1,s.maxTextureSize);te=me(E,te);const Qe=m(te)||a,Xe=r.convert(E.format,E.colorSpace);let ke=r.convert(E.type),Ce=S(E.internalFormat,Xe,ke,E.colorSpace,E.isVideoTexture);$(ne,E,Qe);let ge;const R=E.mipmaps,oe=a&&E.isVideoTexture!==!0&&Ce!==gl,Te=ye.__version===void 0||ee===!0,Me=C(E,te,Qe);if(E.isDepthTexture)Ce=i.DEPTH_COMPONENT,a?E.type===Bn?Ce=i.DEPTH_COMPONENT32F:E.type===kn?Ce=i.DEPTH_COMPONENT24:E.type===ai?Ce=i.DEPTH24_STENCIL8:Ce=i.DEPTH_COMPONENT16:E.type===Bn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===oi&&Ce===i.DEPTH_COMPONENT&&E.type!==Wa&&E.type!==kn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=kn,ke=r.convert(E.type)),E.format===qi&&Ce===i.DEPTH_COMPONENT&&(Ce=i.DEPTH_STENCIL,E.type!==ai&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=ai,ke=r.convert(E.type))),Te&&(oe?t.texStorage2D(i.TEXTURE_2D,1,Ce,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Ce,te.width,te.height,0,Xe,ke,null));else if(E.isDataTexture)if(R.length>0&&Qe){oe&&Te&&t.texStorage2D(i.TEXTURE_2D,Me,Ce,R[0].width,R[0].height);for(let re=0,U=R.length;re<U;re++)ge=R[re],oe?t.texSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,Xe,ke,ge.data):t.texImage2D(i.TEXTURE_2D,re,Ce,ge.width,ge.height,0,Xe,ke,ge.data);E.generateMipmaps=!1}else oe?(Te&&t.texStorage2D(i.TEXTURE_2D,Me,Ce,te.width,te.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,te.width,te.height,Xe,ke,te.data)):t.texImage2D(i.TEXTURE_2D,0,Ce,te.width,te.height,0,Xe,ke,te.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){oe&&Te&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Me,Ce,R[0].width,R[0].height,te.depth);for(let re=0,U=R.length;re<U;re++)ge=R[re],E.format!==hn?Xe!==null?oe?t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,ge.width,ge.height,te.depth,Xe,ge.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,Ce,ge.width,ge.height,te.depth,0,ge.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):oe?t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,ge.width,ge.height,te.depth,Xe,ke,ge.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,Ce,ge.width,ge.height,te.depth,0,Xe,ke,ge.data)}else{oe&&Te&&t.texStorage2D(i.TEXTURE_2D,Me,Ce,R[0].width,R[0].height);for(let re=0,U=R.length;re<U;re++)ge=R[re],E.format!==hn?Xe!==null?oe?t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,Xe,ge.data):t.compressedTexImage2D(i.TEXTURE_2D,re,Ce,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):oe?t.texSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,Xe,ke,ge.data):t.texImage2D(i.TEXTURE_2D,re,Ce,ge.width,ge.height,0,Xe,ke,ge.data)}else if(E.isDataArrayTexture)oe?(Te&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Me,Ce,te.width,te.height,te.depth),t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,Xe,ke,te.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ce,te.width,te.height,te.depth,0,Xe,ke,te.data);else if(E.isData3DTexture)oe?(Te&&t.texStorage3D(i.TEXTURE_3D,Me,Ce,te.width,te.height,te.depth),t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,Xe,ke,te.data)):t.texImage3D(i.TEXTURE_3D,0,Ce,te.width,te.height,te.depth,0,Xe,ke,te.data);else if(E.isFramebufferTexture){if(Te)if(oe)t.texStorage2D(i.TEXTURE_2D,Me,Ce,te.width,te.height);else{let re=te.width,U=te.height;for(let le=0;le<Me;le++)t.texImage2D(i.TEXTURE_2D,le,Ce,re,U,0,Xe,ke,null),re>>=1,U>>=1}}else if(R.length>0&&Qe){oe&&Te&&t.texStorage2D(i.TEXTURE_2D,Me,Ce,R[0].width,R[0].height);for(let re=0,U=R.length;re<U;re++)ge=R[re],oe?t.texSubImage2D(i.TEXTURE_2D,re,0,0,Xe,ke,ge):t.texImage2D(i.TEXTURE_2D,re,Ce,Xe,ke,ge);E.generateMipmaps=!1}else oe?(Te&&t.texStorage2D(i.TEXTURE_2D,Me,Ce,te.width,te.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,Xe,ke,te)):t.texImage2D(i.TEXTURE_2D,0,Ce,Xe,ke,te);M(E,Qe)&&x(ne),ye.__version=J.version,E.onUpdate&&E.onUpdate(E)}b.__version=E.version}function Ee(b,E,B){if(E.image.length!==6)return;const ne=Q(b,E),ee=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+B);const J=n.get(ee);if(ee.version!==J.__version||ne===!0){t.activeTexture(i.TEXTURE0+B);const ye=tt.getPrimaries(tt.workingColorSpace),de=E.colorSpace===nn?null:tt.getPrimaries(E.colorSpace),_e=E.colorSpace===nn||ye===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Pe=E.isCompressedTexture||E.image[0].isCompressedTexture,ze=E.image[0]&&E.image[0].isDataTexture,te=[];for(let re=0;re<6;re++)!Pe&&!ze?te[re]=_(E.image[re],!1,!0,s.maxCubemapSize):te[re]=ze?E.image[re].image:E.image[re],te[re]=me(E,te[re]);const Qe=te[0],Xe=m(Qe)||a,ke=r.convert(E.format,E.colorSpace),Ce=r.convert(E.type),ge=S(E.internalFormat,ke,Ce,E.colorSpace),R=a&&E.isVideoTexture!==!0,oe=J.__version===void 0||ne===!0;let Te=C(E,Qe,Xe);$(i.TEXTURE_CUBE_MAP,E,Xe);let Me;if(Pe){R&&oe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Te,ge,Qe.width,Qe.height);for(let re=0;re<6;re++){Me=te[re].mipmaps;for(let U=0;U<Me.length;U++){const le=Me[U];E.format!==hn?ke!==null?R?t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U,0,0,le.width,le.height,ke,le.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U,ge,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):R?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U,0,0,le.width,le.height,ke,Ce,le.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U,ge,le.width,le.height,0,ke,Ce,le.data)}}}else{Me=E.mipmaps,R&&oe&&(Me.length>0&&Te++,t.texStorage2D(i.TEXTURE_CUBE_MAP,Te,ge,te[0].width,te[0].height));for(let re=0;re<6;re++)if(ze){R?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,te[re].width,te[re].height,ke,Ce,te[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ge,te[re].width,te[re].height,0,ke,Ce,te[re].data);for(let U=0;U<Me.length;U++){const fe=Me[U].image[re].image;R?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U+1,0,0,fe.width,fe.height,ke,Ce,fe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U+1,ge,fe.width,fe.height,0,ke,Ce,fe.data)}}else{R?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ke,Ce,te[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ge,ke,Ce,te[re]);for(let U=0;U<Me.length;U++){const le=Me[U];R?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U+1,0,0,ke,Ce,le.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U+1,ge,ke,Ce,le.image[re])}}}M(E,Xe)&&x(i.TEXTURE_CUBE_MAP),J.__version=ee.version,E.onUpdate&&E.onUpdate(E)}b.__version=E.version}function xe(b,E,B,ne,ee,J){const ye=r.convert(B.format,B.colorSpace),de=r.convert(B.type),_e=S(B.internalFormat,ye,de,B.colorSpace);if(!n.get(E).__hasExternalTextures){const ze=Math.max(1,E.width>>J),te=Math.max(1,E.height>>J);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,J,_e,ze,te,E.depth,0,ye,de,null):t.texImage2D(ee,J,_e,ze,te,0,ye,de,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),j(E)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,ee,n.get(B).__webglTexture,0,ae(E)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ne,ee,n.get(B).__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function De(b,E,B){if(i.bindRenderbuffer(i.RENDERBUFFER,b),E.depthBuffer&&!E.stencilBuffer){let ne=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(B||j(E)){const ee=E.depthTexture;ee&&ee.isDepthTexture&&(ee.type===Bn?ne=i.DEPTH_COMPONENT32F:ee.type===kn&&(ne=i.DEPTH_COMPONENT24));const J=ae(E);j(E)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,J,ne,E.width,E.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,J,ne,E.width,E.height)}else i.renderbufferStorage(i.RENDERBUFFER,ne,E.width,E.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,b)}else if(E.depthBuffer&&E.stencilBuffer){const ne=ae(E);B&&j(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,i.DEPTH24_STENCIL8,E.width,E.height):j(E)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,i.DEPTH24_STENCIL8,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,b)}else{const ne=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let ee=0;ee<ne.length;ee++){const J=ne[ee],ye=r.convert(J.format,J.colorSpace),de=r.convert(J.type),_e=S(J.internalFormat,ye,de,J.colorSpace),Pe=ae(E);B&&j(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,_e,E.width,E.height):j(E)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Pe,_e,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,_e,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Fe(b,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,b),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),O(E.depthTexture,0);const ne=n.get(E.depthTexture).__webglTexture,ee=ae(E);if(E.depthTexture.format===oi)j(E)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ne,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ne,0);else if(E.depthTexture.format===qi)j(E)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ne,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function Se(b){const E=n.get(b),B=b.isWebGLCubeRenderTarget===!0;if(b.depthTexture&&!E.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Fe(E.__webglFramebuffer,b)}else if(B){E.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[ne]),E.__webglDepthbuffer[ne]=i.createRenderbuffer(),De(E.__webglDepthbuffer[ne],b,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=i.createRenderbuffer(),De(E.__webglDepthbuffer,b,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ne(b,E,B){const ne=n.get(b);E!==void 0&&xe(ne.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Se(b)}function D(b){const E=b.texture,B=n.get(b),ne=n.get(E);b.addEventListener("dispose",k),b.isWebGLMultipleRenderTargets!==!0&&(ne.__webglTexture===void 0&&(ne.__webglTexture=i.createTexture()),ne.__version=E.version,o.memory.textures++);const ee=b.isWebGLCubeRenderTarget===!0,J=b.isWebGLMultipleRenderTargets===!0,ye=m(b)||a;if(ee){B.__webglFramebuffer=[];for(let de=0;de<6;de++)if(a&&E.mipmaps&&E.mipmaps.length>0){B.__webglFramebuffer[de]=[];for(let _e=0;_e<E.mipmaps.length;_e++)B.__webglFramebuffer[de][_e]=i.createFramebuffer()}else B.__webglFramebuffer[de]=i.createFramebuffer()}else{if(a&&E.mipmaps&&E.mipmaps.length>0){B.__webglFramebuffer=[];for(let de=0;de<E.mipmaps.length;de++)B.__webglFramebuffer[de]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(J)if(s.drawBuffers){const de=b.texture;for(let _e=0,Pe=de.length;_e<Pe;_e++){const ze=n.get(de[_e]);ze.__webglTexture===void 0&&(ze.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&b.samples>0&&j(b)===!1){const de=J?E:[E];B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let _e=0;_e<de.length;_e++){const Pe=de[_e];B.__webglColorRenderbuffer[_e]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[_e]);const ze=r.convert(Pe.format,Pe.colorSpace),te=r.convert(Pe.type),Qe=S(Pe.internalFormat,ze,te,Pe.colorSpace,b.isXRRenderTarget===!0),Xe=ae(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Xe,Qe,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,B.__webglColorRenderbuffer[_e])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),De(B.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ee){t.bindTexture(i.TEXTURE_CUBE_MAP,ne.__webglTexture),$(i.TEXTURE_CUBE_MAP,E,ye);for(let de=0;de<6;de++)if(a&&E.mipmaps&&E.mipmaps.length>0)for(let _e=0;_e<E.mipmaps.length;_e++)xe(B.__webglFramebuffer[de][_e],b,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,_e);else xe(B.__webglFramebuffer[de],b,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);M(E,ye)&&x(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(J){const de=b.texture;for(let _e=0,Pe=de.length;_e<Pe;_e++){const ze=de[_e],te=n.get(ze);t.bindTexture(i.TEXTURE_2D,te.__webglTexture),$(i.TEXTURE_2D,ze,ye),xe(B.__webglFramebuffer,b,ze,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,0),M(ze,ye)&&x(i.TEXTURE_2D)}t.unbindTexture()}else{let de=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(a?de=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(de,ne.__webglTexture),$(de,E,ye),a&&E.mipmaps&&E.mipmaps.length>0)for(let _e=0;_e<E.mipmaps.length;_e++)xe(B.__webglFramebuffer[_e],b,E,i.COLOR_ATTACHMENT0,de,_e);else xe(B.__webglFramebuffer,b,E,i.COLOR_ATTACHMENT0,de,0);M(E,ye)&&x(de),t.unbindTexture()}b.depthBuffer&&Se(b)}function he(b){const E=m(b)||a,B=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let ne=0,ee=B.length;ne<ee;ne++){const J=B[ne];if(M(J,E)){const ye=b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,de=n.get(J).__webglTexture;t.bindTexture(ye,de),x(ye),t.unbindTexture()}}}function Z(b){if(a&&b.samples>0&&j(b)===!1){const E=b.isWebGLMultipleRenderTargets?b.texture:[b.texture],B=b.width,ne=b.height;let ee=i.COLOR_BUFFER_BIT;const J=[],ye=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=n.get(b),_e=b.isWebGLMultipleRenderTargets===!0;if(_e)for(let Pe=0;Pe<E.length;Pe++)t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let Pe=0;Pe<E.length;Pe++){J.push(i.COLOR_ATTACHMENT0+Pe),b.depthBuffer&&J.push(ye);const ze=de.__ignoreDepthValues!==void 0?de.__ignoreDepthValues:!1;if(ze===!1&&(b.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),_e&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,de.__webglColorRenderbuffer[Pe]),ze===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[ye]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[ye])),_e){const te=n.get(E[Pe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,B,ne,0,0,B,ne,ee,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,J)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),_e)for(let Pe=0;Pe<E.length;Pe++){t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pe,i.RENDERBUFFER,de.__webglColorRenderbuffer[Pe]);const ze=n.get(E[Pe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pe,i.TEXTURE_2D,ze,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}}function ae(b){return Math.min(s.maxSamples,b.samples)}function j(b){const E=n.get(b);return a&&b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function be(b){const E=o.render.frame;h.get(b)!==E&&(h.set(b,E),b.update())}function me(b,E){const B=b.colorSpace,ne=b.format,ee=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||b.format===Pa||B!==Cn&&B!==nn&&(tt.getTransfer(B)===ot?a===!1?e.has("EXT_sRGB")===!0&&ne===hn?(b.format=Pa,b.minFilter=Qt,b.generateMipmaps=!1):E=yl.sRGBToLinear(E):(ne!==hn||ee!==Wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),E}this.allocateTextureUnit=P,this.resetTextureUnits=G,this.setTexture2D=O,this.setTexture2DArray=X,this.setTexture3D=q,this.setTextureCube=Y,this.rebindTextures=Ne,this.setupRenderTarget=D,this.updateRenderTargetMipmap=he,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=j}function qg(i,e,t){const n=t.isWebGL2;function s(r,o=nn){let a;const c=tt.getTransfer(o);if(r===Wn)return i.UNSIGNED_BYTE;if(r===ul)return i.UNSIGNED_SHORT_4_4_4_4;if(r===dl)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Ru)return i.BYTE;if(r===Cu)return i.SHORT;if(r===Wa)return i.UNSIGNED_SHORT;if(r===hl)return i.INT;if(r===kn)return i.UNSIGNED_INT;if(r===Bn)return i.FLOAT;if(r===vs)return n?i.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Pu)return i.ALPHA;if(r===hn)return i.RGBA;if(r===Lu)return i.LUMINANCE;if(r===Du)return i.LUMINANCE_ALPHA;if(r===oi)return i.DEPTH_COMPONENT;if(r===qi)return i.DEPTH_STENCIL;if(r===Pa)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Uu)return i.RED;if(r===fl)return i.RED_INTEGER;if(r===Iu)return i.RG;if(r===pl)return i.RG_INTEGER;if(r===ml)return i.RGBA_INTEGER;if(r===Br||r===zr||r===Hr||r===Gr)if(c===ot)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Br)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===zr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Hr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Gr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Br)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===zr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Hr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Gr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Lo||r===Do||r===Uo||r===Io)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Lo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Do)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Uo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Io)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===gl)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===No||r===Oo)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===No)return c===ot?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Oo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Fo||r===ko||r===Bo||r===zo||r===Ho||r===Go||r===Vo||r===Wo||r===Xo||r===$o||r===Yo||r===qo||r===jo||r===Zo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Fo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ko)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Bo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===zo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Ho)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Go)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Vo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Wo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Xo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===$o)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Yo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===qo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===jo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Zo)return c===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Vr||r===Ko||r===Jo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===Vr)return c===ot?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ko)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Jo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Nu||r===Qo||r===ec||r===tc)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===Vr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Qo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ec)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===tc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ai?n?i.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class jg extends tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Je extends Rt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zg={type:"move"};class fa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zg)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Je;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Kg extends pi{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const _=t.getContextAttributes();let m=null,p=null;const M=[],x=[],S=new ie;let C=null;const w=new tn;w.layers.enable(1),w.viewport=new At;const A=new tn;A.layers.enable(2),A.viewport=new At;const k=[w,A],v=new jg;v.layers.enable(1),v.layers.enable(2);let y=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Q=M[$];return Q===void 0&&(Q=new fa,M[$]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function($){let Q=M[$];return Q===void 0&&(Q=new fa,M[$]=Q),Q.getGripSpace()},this.getHand=function($){let Q=M[$];return Q===void 0&&(Q=new fa,M[$]=Q),Q.getHandSpace()};function N($){const Q=x.indexOf($.inputSource);if(Q===-1)return;const pe=M[Q];pe!==void 0&&(pe.update($.inputSource,$.frame,l||o),pe.dispatchEvent({type:$.type,data:$.inputSource}))}function G(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",P);for(let $=0;$<M.length;$++){const Q=x[$];Q!==null&&(x[$]=null,M[$].disconnect(Q))}y=null,L=null,e.setRenderTarget(m),f=null,d=null,u=null,s=null,p=null,ce.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(m=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",G),s.addEventListener("inputsourceschange",P),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Q={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Q),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new li(f.framebufferWidth,f.framebufferHeight,{format:hn,type:Wn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Q=null,pe=null,Ee=null;_.depth&&(Ee=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Q=_.stencil?qi:oi,pe=_.stencil?ai:kn);const xe={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(xe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),p=new li(d.textureWidth,d.textureHeight,{format:hn,type:Wn,depthTexture:new Dl(d.textureWidth,d.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const De=e.properties.get(p);De.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),ce.setContext(s),ce.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function P($){for(let Q=0;Q<$.removed.length;Q++){const pe=$.removed[Q],Ee=x.indexOf(pe);Ee>=0&&(x[Ee]=null,M[Ee].disconnect(pe))}for(let Q=0;Q<$.added.length;Q++){const pe=$.added[Q];let Ee=x.indexOf(pe);if(Ee===-1){for(let De=0;De<M.length;De++)if(De>=x.length){x.push(pe),Ee=De;break}else if(x[De]===null){x[De]=pe,Ee=De;break}if(Ee===-1)break}const xe=M[Ee];xe&&xe.connect(pe)}}const F=new I,O=new I;function X($,Q,pe){F.setFromMatrixPosition(Q.matrixWorld),O.setFromMatrixPosition(pe.matrixWorld);const Ee=F.distanceTo(O),xe=Q.projectionMatrix.elements,De=pe.projectionMatrix.elements,Fe=xe[14]/(xe[10]-1),Se=xe[14]/(xe[10]+1),Ne=(xe[9]+1)/xe[5],D=(xe[9]-1)/xe[5],he=(xe[8]-1)/xe[0],Z=(De[8]+1)/De[0],ae=Fe*he,j=Fe*Z,be=Ee/(-he+Z),me=be*-he;Q.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(me),$.translateZ(be),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert();const b=Fe+be,E=Se+be,B=ae-me,ne=j+(Ee-me),ee=Ne*Se/E*b,J=D*Se/E*b;$.projectionMatrix.makePerspective(B,ne,ee,J,b,E),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}function q($,Q){Q===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Q.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;v.near=A.near=w.near=$.near,v.far=A.far=w.far=$.far,(y!==v.near||L!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),y=v.near,L=v.far);const Q=$.parent,pe=v.cameras;q(v,Q);for(let Ee=0;Ee<pe.length;Ee++)q(pe[Ee],Q);pe.length===2?X(v,w,A):v.projectionMatrix.copy(w.projectionMatrix),Y($,v,Q)};function Y($,Q,pe){pe===null?$.matrix.copy(Q.matrixWorld):($.matrix.copy(pe.matrixWorld),$.matrix.invert(),$.matrix.multiply(Q.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Q.projectionMatrix),$.projectionMatrixInverse.copy(Q.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=La*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function($){c=$,d!==null&&(d.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)};let K=null;function se($,Q){if(h=Q.getViewerPose(l||o),g=Q,h!==null){const pe=h.views;f!==null&&(e.setRenderTargetFramebuffer(p,f.framebuffer),e.setRenderTarget(p));let Ee=!1;pe.length!==v.cameras.length&&(v.cameras.length=0,Ee=!0);for(let xe=0;xe<pe.length;xe++){const De=pe[xe];let Fe=null;if(f!==null)Fe=f.getViewport(De);else{const Ne=u.getViewSubImage(d,De);Fe=Ne.viewport,xe===0&&(e.setRenderTargetTextures(p,Ne.colorTexture,d.ignoreDepthValues?void 0:Ne.depthStencilTexture),e.setRenderTarget(p))}let Se=k[xe];Se===void 0&&(Se=new tn,Se.layers.enable(xe),Se.viewport=new At,k[xe]=Se),Se.matrix.fromArray(De.transform.matrix),Se.matrix.decompose(Se.position,Se.quaternion,Se.scale),Se.projectionMatrix.fromArray(De.projectionMatrix),Se.projectionMatrixInverse.copy(Se.projectionMatrix).invert(),Se.viewport.set(Fe.x,Fe.y,Fe.width,Fe.height),xe===0&&(v.matrix.copy(Se.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),Ee===!0&&v.cameras.push(Se)}}for(let pe=0;pe<M.length;pe++){const Ee=x[pe],xe=M[pe];Ee!==null&&xe!==void 0&&xe.update(Ee,Q,l||o)}K&&K($,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}const ce=new Pl;ce.setAnimationLoop(se),this.setAnimationLoop=function($){K=$},this.dispose=function(){}}}function Jg(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Al(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,M,x,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,M,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Vt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Vt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=e.get(p).envMap;if(M&&(m.envMap.value=M,m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*x,t(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,M,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=x*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),e.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Vt&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Qg(i,e,t,n){let s={},r={},o=[];const a=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(M,x){const S=x.program;n.uniformBlockBinding(M,S)}function l(M,x){let S=s[M.id];S===void 0&&(g(M),S=h(M),s[M.id]=S,M.addEventListener("dispose",m));const C=x.program;n.updateUBOMapping(M,C);const w=e.render.frame;r[M.id]!==w&&(d(M),r[M.id]=w)}function h(M){const x=u();M.__bindingPointIndex=x;const S=i.createBuffer(),C=M.__size,w=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,C,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,S),S}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const x=s[M.id],S=M.uniforms,C=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,A=S.length;w<A;w++){const k=Array.isArray(S[w])?S[w]:[S[w]];for(let v=0,y=k.length;v<y;v++){const L=k[v];if(f(L,w,v,C)===!0){const N=L.__offset,G=Array.isArray(L.value)?L.value:[L.value];let P=0;for(let F=0;F<G.length;F++){const O=G[F],X=_(O);typeof O=="number"||typeof O=="boolean"?(L.__data[0]=O,i.bufferSubData(i.UNIFORM_BUFFER,N+P,L.__data)):O.isMatrix3?(L.__data[0]=O.elements[0],L.__data[1]=O.elements[1],L.__data[2]=O.elements[2],L.__data[3]=0,L.__data[4]=O.elements[3],L.__data[5]=O.elements[4],L.__data[6]=O.elements[5],L.__data[7]=0,L.__data[8]=O.elements[6],L.__data[9]=O.elements[7],L.__data[10]=O.elements[8],L.__data[11]=0):(O.toArray(L.__data,P),P+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,x,S,C){const w=M.value,A=x+"_"+S;if(C[A]===void 0)return typeof w=="number"||typeof w=="boolean"?C[A]=w:C[A]=w.clone(),!0;{const k=C[A];if(typeof w=="number"||typeof w=="boolean"){if(k!==w)return C[A]=w,!0}else if(k.equals(w)===!1)return k.copy(w),!0}return!1}function g(M){const x=M.uniforms;let S=0;const C=16;for(let A=0,k=x.length;A<k;A++){const v=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,L=v.length;y<L;y++){const N=v[y],G=Array.isArray(N.value)?N.value:[N.value];for(let P=0,F=G.length;P<F;P++){const O=G[P],X=_(O),q=S%C;q!==0&&C-q<X.boundary&&(S+=C-q),N.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=S,S+=X.storage}}}const w=S%C;return w>0&&(S+=C-w),M.__size=S,M.__cache={},this}function _(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){const x=M.target;x.removeEventListener("dispose",m);const S=o.indexOf(x.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class kl{constructor(e={}){const{canvas:t=qu(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Mt,this._useLegacyLights=!1,this.toneMapping=Vn,this.toneMappingExposure=1;const x=this;let S=!1,C=0,w=0,A=null,k=-1,v=null;const y=new At,L=new At;let N=null;const G=new We(0);let P=0,F=t.width,O=t.height,X=1,q=null,Y=null;const K=new At(0,0,F,O),se=new At(0,0,F,O);let ce=!1;const $=new ja;let Q=!1,pe=!1,Ee=null;const xe=new gt,De=new ie,Fe=new I,Se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ne(){return A===null?X:1}let D=n;function he(T,z){for(let V=0;V<T.length;V++){const W=T[V],H=t.getContext(W,z);if(H!==null)return H}return null}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Va}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",U,!1),t.addEventListener("webglcontextcreationerror",le,!1),D===null){const z=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&z.shift(),D=he(z,T),D===null)throw he(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&D instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),D.getShaderPrecisionFormat===void 0&&(D.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Z,ae,j,be,me,b,E,B,ne,ee,J,ye,de,_e,Pe,ze,te,Qe,Xe,ke,Ce,ge,R,oe;function Te(){Z=new lm(D),ae=new im(D,Z,e),Z.init(ae),ge=new qg(D,Z,ae),j=new $g(D,Z,ae),be=new dm(D),me=new Dg,b=new Yg(D,Z,j,me,ae,ge,be),E=new rm(x),B=new cm(x),ne=new xd(D,ae),R=new tm(D,Z,ne,ae),ee=new hm(D,ne,be,R),J=new gm(D,ee,ne,be),Xe=new mm(D,ae,b),ze=new sm(me),ye=new Lg(x,E,B,Z,ae,R,ze),de=new Jg(x,me),_e=new Ig,Pe=new zg(Z,ae),Qe=new em(x,E,B,j,J,d,c),te=new Xg(x,J,ae),oe=new Qg(D,be,ae,j),ke=new nm(D,Z,be,ae),Ce=new um(D,Z,be,ae),be.programs=ye.programs,x.capabilities=ae,x.extensions=Z,x.properties=me,x.renderLists=_e,x.shadowMap=te,x.state=j,x.info=be}Te();const Me=new Kg(x,D);this.xr=Me,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const T=Z.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Z.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(T){T!==void 0&&(X=T,this.setSize(F,O,!1))},this.getSize=function(T){return T.set(F,O)},this.setSize=function(T,z,V=!0){if(Me.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=T,O=z,t.width=Math.floor(T*X),t.height=Math.floor(z*X),V===!0&&(t.style.width=T+"px",t.style.height=z+"px"),this.setViewport(0,0,T,z)},this.getDrawingBufferSize=function(T){return T.set(F*X,O*X).floor()},this.setDrawingBufferSize=function(T,z,V){F=T,O=z,X=V,t.width=Math.floor(T*V),t.height=Math.floor(z*V),this.setViewport(0,0,T,z)},this.getCurrentViewport=function(T){return T.copy(y)},this.getViewport=function(T){return T.copy(K)},this.setViewport=function(T,z,V,W){T.isVector4?K.set(T.x,T.y,T.z,T.w):K.set(T,z,V,W),j.viewport(y.copy(K).multiplyScalar(X).floor())},this.getScissor=function(T){return T.copy(se)},this.setScissor=function(T,z,V,W){T.isVector4?se.set(T.x,T.y,T.z,T.w):se.set(T,z,V,W),j.scissor(L.copy(se).multiplyScalar(X).floor())},this.getScissorTest=function(){return ce},this.setScissorTest=function(T){j.setScissorTest(ce=T)},this.setOpaqueSort=function(T){q=T},this.setTransparentSort=function(T){Y=T},this.getClearColor=function(T){return T.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor.apply(Qe,arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha.apply(Qe,arguments)},this.clear=function(T=!0,z=!0,V=!0){let W=0;if(T){let H=!1;if(A!==null){const ve=A.texture.format;H=ve===ml||ve===pl||ve===fl}if(H){const ve=A.texture.type,Ae=ve===Wn||ve===kn||ve===Wa||ve===ai||ve===ul||ve===dl,Ie=Qe.getClearColor(),Be=Qe.getClearAlpha(),$e=Ie.r,He=Ie.g,Ge=Ie.b;Ae?(f[0]=$e,f[1]=He,f[2]=Ge,f[3]=Be,D.clearBufferuiv(D.COLOR,0,f)):(g[0]=$e,g[1]=He,g[2]=Ge,g[3]=Be,D.clearBufferiv(D.COLOR,0,g))}else W|=D.COLOR_BUFFER_BIT}z&&(W|=D.DEPTH_BUFFER_BIT),V&&(W|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",U,!1),t.removeEventListener("webglcontextcreationerror",le,!1),_e.dispose(),Pe.dispose(),me.dispose(),E.dispose(),B.dispose(),J.dispose(),R.dispose(),oe.dispose(),ye.dispose(),Me.dispose(),Me.removeEventListener("sessionstart",pt),Me.removeEventListener("sessionend",et),Ee&&(Ee.dispose(),Ee=null),vt.stop()};function re(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const T=be.autoReset,z=te.enabled,V=te.autoUpdate,W=te.needsUpdate,H=te.type;Te(),be.autoReset=T,te.enabled=z,te.autoUpdate=V,te.needsUpdate=W,te.type=H}function le(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function fe(T){const z=T.target;z.removeEventListener("dispose",fe),Ue(z)}function Ue(T){Le(T),me.remove(T)}function Le(T){const z=me.get(T).programs;z!==void 0&&(z.forEach(function(V){ye.releaseProgram(V)}),T.isShaderMaterial&&ye.releaseShaderCache(T))}this.renderBufferDirect=function(T,z,V,W,H,ve){z===null&&(z=Se);const Ae=H.isMesh&&H.matrixWorld.determinant()<0,Ie=_h(T,z,V,W,H);j.setMaterial(W,Ae);let Be=V.index,$e=1;if(W.wireframe===!0){if(Be=ee.getWireframeAttribute(V),Be===void 0)return;$e=2}const He=V.drawRange,Ge=V.attributes.position;let mt=He.start*$e,Xt=(He.start+He.count)*$e;ve!==null&&(mt=Math.max(mt,ve.start*$e),Xt=Math.min(Xt,(ve.start+ve.count)*$e)),Be!==null?(mt=Math.max(mt,0),Xt=Math.min(Xt,Be.count)):Ge!=null&&(mt=Math.max(mt,0),Xt=Math.min(Xt,Ge.count));const Et=Xt-mt;if(Et<0||Et===1/0)return;R.setup(H,W,Ie,V,Be);let gn,lt=ke;if(Be!==null&&(gn=ne.get(Be),lt=Ce,lt.setIndex(gn)),H.isMesh)W.wireframe===!0?(j.setLineWidth(W.wireframeLinewidth*Ne()),lt.setMode(D.LINES)):lt.setMode(D.TRIANGLES);else if(H.isLine){let Ye=W.linewidth;Ye===void 0&&(Ye=1),j.setLineWidth(Ye*Ne()),H.isLineSegments?lt.setMode(D.LINES):H.isLineLoop?lt.setMode(D.LINE_LOOP):lt.setMode(D.LINE_STRIP)}else H.isPoints?lt.setMode(D.POINTS):H.isSprite&&lt.setMode(D.TRIANGLES);if(H.isBatchedMesh)lt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else if(H.isInstancedMesh)lt.renderInstances(mt,Et,H.count);else if(V.isInstancedBufferGeometry){const Ye=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Lr=Math.min(V.instanceCount,Ye);lt.renderInstances(mt,Et,Lr)}else lt.render(mt,Et)};function Ze(T,z,V){T.transparent===!0&&T.side===bn&&T.forceSinglePass===!1?(T.side=Vt,T.needsUpdate=!0,As(T,z,V),T.side=qn,T.needsUpdate=!0,As(T,z,V),T.side=bn):As(T,z,V)}this.compile=function(T,z,V=null){V===null&&(V=T),m=Pe.get(V),m.init(),M.push(m),V.traverseVisible(function(H){H.isLight&&H.layers.test(z.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),T!==V&&T.traverseVisible(function(H){H.isLight&&H.layers.test(z.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights(x._useLegacyLights);const W=new Set;return T.traverse(function(H){const ve=H.material;if(ve)if(Array.isArray(ve))for(let Ae=0;Ae<ve.length;Ae++){const Ie=ve[Ae];Ze(Ie,V,H),W.add(Ie)}else Ze(ve,V,H),W.add(ve)}),M.pop(),m=null,W},this.compileAsync=function(T,z,V=null){const W=this.compile(T,z,V);return new Promise(H=>{function ve(){if(W.forEach(function(Ae){me.get(Ae).currentProgram.isReady()&&W.delete(Ae)}),W.size===0){H(T);return}setTimeout(ve,10)}Z.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let Ke=null;function ut(T){Ke&&Ke(T)}function pt(){vt.stop()}function et(){vt.start()}const vt=new Pl;vt.setAnimationLoop(ut),typeof self<"u"&&vt.setContext(self),this.setAnimationLoop=function(T){Ke=T,Me.setAnimationLoop(T),T===null?vt.stop():vt.start()},Me.addEventListener("sessionstart",pt),Me.addEventListener("sessionend",et),this.render=function(T,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Me.enabled===!0&&Me.isPresenting===!0&&(Me.cameraAutoUpdate===!0&&Me.updateCamera(z),z=Me.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,z,A),m=Pe.get(T,M.length),m.init(),M.push(m),xe.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),$.setFromProjectionMatrix(xe),pe=this.localClippingEnabled,Q=ze.init(this.clippingPlanes,pe),_=_e.get(T,p.length),_.init(),p.push(_),dn(T,z,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(q,Y),this.info.render.frame++,Q===!0&&ze.beginShadows();const V=m.state.shadowsArray;if(te.render(V,T,z),Q===!0&&ze.endShadows(),this.info.autoReset===!0&&this.info.reset(),Qe.render(_,T),m.setupLights(x._useLegacyLights),z.isArrayCamera){const W=z.cameras;for(let H=0,ve=W.length;H<ve;H++){const Ae=W[H];ho(_,T,Ae,Ae.viewport)}}else ho(_,T,z);A!==null&&(b.updateMultisampleRenderTarget(A),b.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(x,T,z),R.resetDefaultState(),k=-1,v=null,M.pop(),M.length>0?m=M[M.length-1]:m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function dn(T,z,V,W){if(T.visible===!1)return;if(T.layers.test(z.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(z);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||$.intersectsSprite(T)){W&&Fe.setFromMatrixPosition(T.matrixWorld).applyMatrix4(xe);const Ae=J.update(T),Ie=T.material;Ie.visible&&_.push(T,Ae,Ie,V,Fe.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||$.intersectsObject(T))){const Ae=J.update(T),Ie=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Fe.copy(T.boundingSphere.center)):(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),Fe.copy(Ae.boundingSphere.center)),Fe.applyMatrix4(T.matrixWorld).applyMatrix4(xe)),Array.isArray(Ie)){const Be=Ae.groups;for(let $e=0,He=Be.length;$e<He;$e++){const Ge=Be[$e],mt=Ie[Ge.materialIndex];mt&&mt.visible&&_.push(T,Ae,mt,V,Fe.z,Ge)}}else Ie.visible&&_.push(T,Ae,Ie,V,Fe.z,null)}}const ve=T.children;for(let Ae=0,Ie=ve.length;Ae<Ie;Ae++)dn(ve[Ae],z,V,W)}function ho(T,z,V,W){const H=T.opaque,ve=T.transmissive,Ae=T.transparent;m.setupLightsView(V),Q===!0&&ze.setGlobalState(x.clippingPlanes,V),ve.length>0&&gh(H,ve,z,V),W&&j.viewport(y.copy(W)),H.length>0&&ws(H,z,V),ve.length>0&&ws(ve,z,V),Ae.length>0&&ws(Ae,z,V),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function gh(T,z,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;const ve=ae.isWebGL2;Ee===null&&(Ee=new li(1,1,{generateMipmaps:!0,type:Z.has("EXT_color_buffer_half_float")?vs:Wn,minFilter:_s,samples:ve?4:0})),x.getDrawingBufferSize(De),ve?Ee.setSize(De.x,De.y):Ee.setSize(Da(De.x),Da(De.y));const Ae=x.getRenderTarget();x.setRenderTarget(Ee),x.getClearColor(G),P=x.getClearAlpha(),P<1&&x.setClearColor(16777215,.5),x.clear();const Ie=x.toneMapping;x.toneMapping=Vn,ws(T,V,W),b.updateMultisampleRenderTarget(Ee),b.updateRenderTargetMipmap(Ee);let Be=!1;for(let $e=0,He=z.length;$e<He;$e++){const Ge=z[$e],mt=Ge.object,Xt=Ge.geometry,Et=Ge.material,gn=Ge.group;if(Et.side===bn&&mt.layers.test(W.layers)){const lt=Et.side;Et.side=Vt,Et.needsUpdate=!0,uo(mt,V,W,Xt,Et,gn),Et.side=lt,Et.needsUpdate=!0,Be=!0}}Be===!0&&(b.updateMultisampleRenderTarget(Ee),b.updateRenderTargetMipmap(Ee)),x.setRenderTarget(Ae),x.setClearColor(G,P),x.toneMapping=Ie}function ws(T,z,V){const W=z.isScene===!0?z.overrideMaterial:null;for(let H=0,ve=T.length;H<ve;H++){const Ae=T[H],Ie=Ae.object,Be=Ae.geometry,$e=W===null?Ae.material:W,He=Ae.group;Ie.layers.test(V.layers)&&uo(Ie,z,V,Be,$e,He)}}function uo(T,z,V,W,H,ve){T.onBeforeRender(x,z,V,W,H,ve),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),H.onBeforeRender(x,z,V,W,T,ve),H.transparent===!0&&H.side===bn&&H.forceSinglePass===!1?(H.side=Vt,H.needsUpdate=!0,x.renderBufferDirect(V,z,W,H,T,ve),H.side=qn,H.needsUpdate=!0,x.renderBufferDirect(V,z,W,H,T,ve),H.side=bn):x.renderBufferDirect(V,z,W,H,T,ve),T.onAfterRender(x,z,V,W,H,ve)}function As(T,z,V){z.isScene!==!0&&(z=Se);const W=me.get(T),H=m.state.lights,ve=m.state.shadowsArray,Ae=H.state.version,Ie=ye.getParameters(T,H.state,ve,z,V),Be=ye.getProgramCacheKey(Ie);let $e=W.programs;W.environment=T.isMeshStandardMaterial?z.environment:null,W.fog=z.fog,W.envMap=(T.isMeshStandardMaterial?B:E).get(T.envMap||W.environment),$e===void 0&&(T.addEventListener("dispose",fe),$e=new Map,W.programs=$e);let He=$e.get(Be);if(He!==void 0){if(W.currentProgram===He&&W.lightsStateVersion===Ae)return po(T,Ie),He}else Ie.uniforms=ye.getUniforms(T),T.onBuild(V,Ie,x),T.onBeforeCompile(Ie,x),He=ye.acquireProgram(Ie,Be),$e.set(Be,He),W.uniforms=Ie.uniforms;const Ge=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ge.clippingPlanes=ze.uniform),po(T,Ie),W.needsLights=xh(T),W.lightsStateVersion=Ae,W.needsLights&&(Ge.ambientLightColor.value=H.state.ambient,Ge.lightProbe.value=H.state.probe,Ge.directionalLights.value=H.state.directional,Ge.directionalLightShadows.value=H.state.directionalShadow,Ge.spotLights.value=H.state.spot,Ge.spotLightShadows.value=H.state.spotShadow,Ge.rectAreaLights.value=H.state.rectArea,Ge.ltc_1.value=H.state.rectAreaLTC1,Ge.ltc_2.value=H.state.rectAreaLTC2,Ge.pointLights.value=H.state.point,Ge.pointLightShadows.value=H.state.pointShadow,Ge.hemisphereLights.value=H.state.hemi,Ge.directionalShadowMap.value=H.state.directionalShadowMap,Ge.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ge.spotShadowMap.value=H.state.spotShadowMap,Ge.spotLightMatrix.value=H.state.spotLightMatrix,Ge.spotLightMap.value=H.state.spotLightMap,Ge.pointShadowMap.value=H.state.pointShadowMap,Ge.pointShadowMatrix.value=H.state.pointShadowMatrix),W.currentProgram=He,W.uniformsList=null,He}function fo(T){if(T.uniformsList===null){const z=T.currentProgram.getUniforms();T.uniformsList=or.seqWithValue(z.seq,T.uniforms)}return T.uniformsList}function po(T,z){const V=me.get(T);V.outputColorSpace=z.outputColorSpace,V.batching=z.batching,V.instancing=z.instancing,V.instancingColor=z.instancingColor,V.skinning=z.skinning,V.morphTargets=z.morphTargets,V.morphNormals=z.morphNormals,V.morphColors=z.morphColors,V.morphTargetsCount=z.morphTargetsCount,V.numClippingPlanes=z.numClippingPlanes,V.numIntersection=z.numClipIntersection,V.vertexAlphas=z.vertexAlphas,V.vertexTangents=z.vertexTangents,V.toneMapping=z.toneMapping}function _h(T,z,V,W,H){z.isScene!==!0&&(z=Se),b.resetTextureUnits();const ve=z.fog,Ae=W.isMeshStandardMaterial?z.environment:null,Ie=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Cn,Be=(W.isMeshStandardMaterial?B:E).get(W.envMap||Ae),$e=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,He=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ge=!!V.morphAttributes.position,mt=!!V.morphAttributes.normal,Xt=!!V.morphAttributes.color;let Et=Vn;W.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Et=x.toneMapping);const gn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,lt=gn!==void 0?gn.length:0,Ye=me.get(W),Lr=m.state.lights;if(Q===!0&&(pe===!0||T!==v)){const Kt=T===v&&W.id===k;ze.setState(W,T,Kt)}let dt=!1;W.version===Ye.__version?(Ye.needsLights&&Ye.lightsStateVersion!==Lr.state.version||Ye.outputColorSpace!==Ie||H.isBatchedMesh&&Ye.batching===!1||!H.isBatchedMesh&&Ye.batching===!0||H.isInstancedMesh&&Ye.instancing===!1||!H.isInstancedMesh&&Ye.instancing===!0||H.isSkinnedMesh&&Ye.skinning===!1||!H.isSkinnedMesh&&Ye.skinning===!0||H.isInstancedMesh&&Ye.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ye.instancingColor===!1&&H.instanceColor!==null||Ye.envMap!==Be||W.fog===!0&&Ye.fog!==ve||Ye.numClippingPlanes!==void 0&&(Ye.numClippingPlanes!==ze.numPlanes||Ye.numIntersection!==ze.numIntersection)||Ye.vertexAlphas!==$e||Ye.vertexTangents!==He||Ye.morphTargets!==Ge||Ye.morphNormals!==mt||Ye.morphColors!==Xt||Ye.toneMapping!==Et||ae.isWebGL2===!0&&Ye.morphTargetsCount!==lt)&&(dt=!0):(dt=!0,Ye.__version=W.version);let jn=Ye.currentProgram;dt===!0&&(jn=As(W,z,H));let mo=!1,es=!1,Dr=!1;const Pt=jn.getUniforms(),Zn=Ye.uniforms;if(j.useProgram(jn.program)&&(mo=!0,es=!0,Dr=!0),W.id!==k&&(k=W.id,es=!0),mo||v!==T){Pt.setValue(D,"projectionMatrix",T.projectionMatrix),Pt.setValue(D,"viewMatrix",T.matrixWorldInverse);const Kt=Pt.map.cameraPosition;Kt!==void 0&&Kt.setValue(D,Fe.setFromMatrixPosition(T.matrixWorld)),ae.logarithmicDepthBuffer&&Pt.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Pt.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),v!==T&&(v=T,es=!0,Dr=!0)}if(H.isSkinnedMesh){Pt.setOptional(D,H,"bindMatrix"),Pt.setOptional(D,H,"bindMatrixInverse");const Kt=H.skeleton;Kt&&(ae.floatVertexTextures?(Kt.boneTexture===null&&Kt.computeBoneTexture(),Pt.setValue(D,"boneTexture",Kt.boneTexture,b)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}H.isBatchedMesh&&(Pt.setOptional(D,H,"batchingTexture"),Pt.setValue(D,"batchingTexture",H._matricesTexture,b));const Ur=V.morphAttributes;if((Ur.position!==void 0||Ur.normal!==void 0||Ur.color!==void 0&&ae.isWebGL2===!0)&&Xe.update(H,V,jn),(es||Ye.receiveShadow!==H.receiveShadow)&&(Ye.receiveShadow=H.receiveShadow,Pt.setValue(D,"receiveShadow",H.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Zn.envMap.value=Be,Zn.flipEnvMap.value=Be.isCubeTexture&&Be.isRenderTargetTexture===!1?-1:1),es&&(Pt.setValue(D,"toneMappingExposure",x.toneMappingExposure),Ye.needsLights&&vh(Zn,Dr),ve&&W.fog===!0&&de.refreshFogUniforms(Zn,ve),de.refreshMaterialUniforms(Zn,W,X,O,Ee),or.upload(D,fo(Ye),Zn,b)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(or.upload(D,fo(Ye),Zn,b),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Pt.setValue(D,"center",H.center),Pt.setValue(D,"modelViewMatrix",H.modelViewMatrix),Pt.setValue(D,"normalMatrix",H.normalMatrix),Pt.setValue(D,"modelMatrix",H.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Kt=W.uniformsGroups;for(let Ir=0,Mh=Kt.length;Ir<Mh;Ir++)if(ae.isWebGL2){const go=Kt[Ir];oe.update(go,jn),oe.bind(go,jn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return jn}function vh(T,z){T.ambientLightColor.needsUpdate=z,T.lightProbe.needsUpdate=z,T.directionalLights.needsUpdate=z,T.directionalLightShadows.needsUpdate=z,T.pointLights.needsUpdate=z,T.pointLightShadows.needsUpdate=z,T.spotLights.needsUpdate=z,T.spotLightShadows.needsUpdate=z,T.rectAreaLights.needsUpdate=z,T.hemisphereLights.needsUpdate=z}function xh(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,z,V){me.get(T.texture).__webglTexture=z,me.get(T.depthTexture).__webglTexture=V;const W=me.get(T);W.__hasExternalTextures=!0,W.__hasExternalTextures&&(W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||Z.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,z){const V=me.get(T);V.__webglFramebuffer=z,V.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(T,z=0,V=0){A=T,C=z,w=V;let W=!0,H=null,ve=!1,Ae=!1;if(T){const Be=me.get(T);Be.__useDefaultFramebuffer!==void 0?(j.bindFramebuffer(D.FRAMEBUFFER,null),W=!1):Be.__webglFramebuffer===void 0?b.setupRenderTarget(T):Be.__hasExternalTextures&&b.rebindTextures(T,me.get(T.texture).__webglTexture,me.get(T.depthTexture).__webglTexture);const $e=T.texture;($e.isData3DTexture||$e.isDataArrayTexture||$e.isCompressedArrayTexture)&&(Ae=!0);const He=me.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(He[z])?H=He[z][V]:H=He[z],ve=!0):ae.isWebGL2&&T.samples>0&&b.useMultisampledRTT(T)===!1?H=me.get(T).__webglMultisampledFramebuffer:Array.isArray(He)?H=He[V]:H=He,y.copy(T.viewport),L.copy(T.scissor),N=T.scissorTest}else y.copy(K).multiplyScalar(X).floor(),L.copy(se).multiplyScalar(X).floor(),N=ce;if(j.bindFramebuffer(D.FRAMEBUFFER,H)&&ae.drawBuffers&&W&&j.drawBuffers(T,H),j.viewport(y),j.scissor(L),j.setScissorTest(N),ve){const Be=me.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+z,Be.__webglTexture,V)}else if(Ae){const Be=me.get(T.texture),$e=z||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Be.__webglTexture,V||0,$e)}k=-1},this.readRenderTargetPixels=function(T,z,V,W,H,ve,Ae){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=me.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Ie=Ie[Ae]),Ie){j.bindFramebuffer(D.FRAMEBUFFER,Ie);try{const Be=T.texture,$e=Be.format,He=Be.type;if($e!==hn&&ge.convert($e)!==D.getParameter(D.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ge=He===vs&&(Z.has("EXT_color_buffer_half_float")||ae.isWebGL2&&Z.has("EXT_color_buffer_float"));if(He!==Wn&&ge.convert(He)!==D.getParameter(D.IMPLEMENTATION_COLOR_READ_TYPE)&&!(He===Bn&&(ae.isWebGL2||Z.has("OES_texture_float")||Z.has("WEBGL_color_buffer_float")))&&!Ge){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=T.width-W&&V>=0&&V<=T.height-H&&D.readPixels(z,V,W,H,ge.convert($e),ge.convert(He),ve)}finally{const Be=A!==null?me.get(A).__webglFramebuffer:null;j.bindFramebuffer(D.FRAMEBUFFER,Be)}}},this.copyFramebufferToTexture=function(T,z,V=0){const W=Math.pow(2,-V),H=Math.floor(z.image.width*W),ve=Math.floor(z.image.height*W);b.setTexture2D(z,0),D.copyTexSubImage2D(D.TEXTURE_2D,V,0,0,T.x,T.y,H,ve),j.unbindTexture()},this.copyTextureToTexture=function(T,z,V,W=0){const H=z.image.width,ve=z.image.height,Ae=ge.convert(V.format),Ie=ge.convert(V.type);b.setTexture2D(V,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,V.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,V.unpackAlignment),z.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,W,T.x,T.y,H,ve,Ae,Ie,z.image.data):z.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,W,T.x,T.y,z.mipmaps[0].width,z.mipmaps[0].height,Ae,z.mipmaps[0].data):D.texSubImage2D(D.TEXTURE_2D,W,T.x,T.y,Ae,Ie,z.image),W===0&&V.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),j.unbindTexture()},this.copyTextureToTexture3D=function(T,z,V,W,H=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ve=T.max.x-T.min.x+1,Ae=T.max.y-T.min.y+1,Ie=T.max.z-T.min.z+1,Be=ge.convert(W.format),$e=ge.convert(W.type);let He;if(W.isData3DTexture)b.setTexture3D(W,0),He=D.TEXTURE_3D;else if(W.isDataArrayTexture||W.isCompressedArrayTexture)b.setTexture2DArray(W,0),He=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,W.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,W.unpackAlignment);const Ge=D.getParameter(D.UNPACK_ROW_LENGTH),mt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Xt=D.getParameter(D.UNPACK_SKIP_PIXELS),Et=D.getParameter(D.UNPACK_SKIP_ROWS),gn=D.getParameter(D.UNPACK_SKIP_IMAGES),lt=V.isCompressedTexture?V.mipmaps[H]:V.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,lt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,lt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,T.min.x),D.pixelStorei(D.UNPACK_SKIP_ROWS,T.min.y),D.pixelStorei(D.UNPACK_SKIP_IMAGES,T.min.z),V.isDataTexture||V.isData3DTexture?D.texSubImage3D(He,H,z.x,z.y,z.z,ve,Ae,Ie,Be,$e,lt.data):V.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),D.compressedTexSubImage3D(He,H,z.x,z.y,z.z,ve,Ae,Ie,Be,lt.data)):D.texSubImage3D(He,H,z.x,z.y,z.z,ve,Ae,Ie,Be,$e,lt),D.pixelStorei(D.UNPACK_ROW_LENGTH,Ge),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,mt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Xt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Et),D.pixelStorei(D.UNPACK_SKIP_IMAGES,gn),H===0&&W.generateMipmaps&&D.generateMipmap(He),j.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?b.setTextureCube(T,0):T.isData3DTexture?b.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?b.setTexture2DArray(T,0):b.setTexture2D(T,0),j.unbindTexture()},this.resetState=function(){C=0,w=0,A=null,j.reset(),R.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Xa?"display-p3":"srgb",t.unpackColorSpace=tt.workingColorSpace===br?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Mt?ci:_l}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===ci?Mt:Cn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class e0 extends kl{}e0.prototype.isWebGL1Renderer=!0;class Ka{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new We(e),this.near=t,this.far=n}clone(){return new Ka(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class t0 extends Rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class n0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ca,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ft=new I;class vr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Tn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Tn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Tn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Tn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new un(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new vr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Bl extends Ji{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ii;const as=new I,Ni=new I,Oi=new I,Fi=new ie,os=new ie,zl=new gt,Js=new I,cs=new I,Qs=new I,Vc=new ie,pa=new ie,Wc=new ie;class i0 extends Rt{constructor(e=new Bl){if(super(),this.isSprite=!0,this.type="Sprite",Ii===void 0){Ii=new Zt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new n0(t,5);Ii.setIndex([0,1,2,0,2,3]),Ii.setAttribute("position",new vr(n,3,0,!1)),Ii.setAttribute("uv",new vr(n,2,3,!1))}this.geometry=Ii,this.material=e,this.center=new ie(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ni.setFromMatrixScale(this.matrixWorld),zl.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Oi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ni.multiplyScalar(-Oi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;er(Js.set(-.5,-.5,0),Oi,o,Ni,s,r),er(cs.set(.5,-.5,0),Oi,o,Ni,s,r),er(Qs.set(.5,.5,0),Oi,o,Ni,s,r),Vc.set(0,0),pa.set(1,0),Wc.set(1,1);let a=e.ray.intersectTriangle(Js,cs,Qs,!1,as);if(a===null&&(er(cs.set(-.5,.5,0),Oi,o,Ni,s,r),pa.set(0,1),a=e.ray.intersectTriangle(Js,Qs,cs,!1,as),a===null))return;const c=e.ray.origin.distanceTo(as);c<e.near||c>e.far||t.push({distance:c,point:as.clone(),uv:en.getInterpolation(as,Js,cs,Qs,Vc,pa,Wc,new ie),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function er(i,e,t,n,s,r){Fi.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(os.x=r*Fi.x-s*Fi.y,os.y=s*Fi.x+r*Fi.y):os.copy(Fi),i.copy(e),i.x+=os.x,i.y+=os.y,i.applyMatrix4(zl)}class Hl extends Wt{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class mn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new ie:new I);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new I,s=[],r=[],o=[],a=new I,c=new gt;for(let f=0;f<=e;f++){const g=f/e;s[f]=this.getTangentAt(g,new I)}r[0]=new I,o[0]=new I;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(wt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(wt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Ja extends mn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t){const n=t||new ie,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class s0 extends Ja{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Qa(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+e*r+t*o+n*a}}}const tr=new I,ma=new Qa,ga=new Qa,_a=new Qa;class r0 extends mn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new I){const n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(tr.subVectors(s[0],s[1]).add(s[0]),l=tr);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(tr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=tr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),ma.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,m),ga.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,m),_a.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(ma.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),ga.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),_a.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(ma.calc(c),ga.calc(c),_a.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Xc(i,e,t,n,s){const r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function a0(i,e){const t=1-i;return t*t*e}function o0(i,e){return 2*(1-i)*i*e}function c0(i,e){return i*i*e}function ps(i,e,t,n){return a0(i,e)+o0(i,t)+c0(i,n)}function l0(i,e){const t=1-i;return t*t*t*e}function h0(i,e){const t=1-i;return 3*t*t*i*e}function u0(i,e){return 3*(1-i)*i*i*e}function d0(i,e){return i*i*i*e}function ms(i,e,t,n,s){return l0(i,e)+h0(i,t)+u0(i,n)+d0(i,s)}class Gl extends mn{constructor(e=new ie,t=new ie,n=new ie,s=new ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ie){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ms(e,s.x,r.x,o.x,a.x),ms(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class f0 extends mn{constructor(e=new I,t=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new I){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ms(e,s.x,r.x,o.x,a.x),ms(e,s.y,r.y,o.y,a.y),ms(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Vl extends mn{constructor(e=new ie,t=new ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ie){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class p0 extends mn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wl extends mn{constructor(e=new ie,t=new ie,n=new ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ie){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ps(e,s.x,r.x,o.x),ps(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class m0 extends mn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ps(e,s.x,r.x,o.x),ps(e,s.y,r.y,o.y),ps(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Xl extends mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ie){const n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Xc(a,c.x,l.x,h.x,u.x),Xc(a,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new ie().fromArray(s))}return this}}var Ia=Object.freeze({__proto__:null,ArcCurve:s0,CatmullRomCurve3:r0,CubicBezierCurve:Gl,CubicBezierCurve3:f0,EllipseCurve:Ja,LineCurve:Vl,LineCurve3:p0,QuadraticBezierCurve:Wl,QuadraticBezierCurve3:m0,SplineCurve:Xl});class g0 extends mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ia[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Ia[s.type]().fromJSON(s))}return this}}class Na extends g0{constructor(e){super(),this.type="Path",this.currentPoint=new ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Vl(this.currentPoint.clone(),new ie(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Wl(this.currentPoint.clone(),new ie(e,t),new ie(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){const a=new Gl(this.currentPoint.clone(),new ie(e,t),new ie(n,s),new ie(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Xl(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,o,a,c),this}absellipse(e,t,n,s,r,o,a,c){const l=new Ja(e,t,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class eo extends Zt{constructor(e=[new ie(0,-.5),new ie(.5,0),new ie(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=wt(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],l=[],h=1/t,u=new I,d=new ie,f=new I,g=new I,_=new I;let m=0,p=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(_.x,_.y,_.z);break;default:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),c.push(f.x,f.y,f.z),_.copy(g)}for(let M=0;M<=t;M++){const x=n+M*h*s,S=Math.sin(x),C=Math.cos(x);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*S,u.y=e[w].y,u.z=e[w].x*C,o.push(u.x,u.y,u.z),d.x=M/t,d.y=w/(e.length-1),a.push(d.x,d.y);const A=c[3*w+0]*S,k=c[3*w+1],v=c[3*w+0]*C;l.push(A,k,v)}}for(let M=0;M<t;M++)for(let x=0;x<e.length-1;x++){const S=x+M*e.length,C=S,w=S+e.length,A=S+e.length+1,k=S+1;r.push(C,w,k),r.push(A,k,w)}this.setIndex(r),this.setAttribute("position",new _t(o,3)),this.setAttribute("uv",new _t(a,2)),this.setAttribute("normal",new _t(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new eo(e.points,e.segments,e.phiStart,e.phiLength)}}class to extends eo{constructor(e=1,t=1,n=4,s=8){const r=new Na;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new to(e.radius,e.length,e.capSegments,e.radialSegments)}}class bs extends Zt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;M(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new _t(u,3)),this.setAttribute("normal",new _t(d,3)),this.setAttribute("uv",new _t(f,2));function M(){const S=new I,C=new I;let w=0;const A=(t-e)/n;for(let k=0;k<=r;k++){const v=[],y=k/r,L=y*(t-e)+e;for(let N=0;N<=s;N++){const G=N/s,P=G*c+a,F=Math.sin(P),O=Math.cos(P);C.x=L*F,C.y=-y*n+m,C.z=L*O,u.push(C.x,C.y,C.z),S.set(F,A,O).normalize(),d.push(S.x,S.y,S.z),f.push(G,1-y),v.push(g++)}_.push(v)}for(let k=0;k<s;k++)for(let v=0;v<r;v++){const y=_[v][k],L=_[v+1][k],N=_[v+1][k+1],G=_[v][k+1];h.push(y,L,G),h.push(L,N,G),w+=6}l.addGroup(p,w,0),p+=w}function x(S){const C=g,w=new ie,A=new I;let k=0;const v=S===!0?e:t,y=S===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,m*y,0),d.push(0,y,0),f.push(.5,.5),g++;const L=g;for(let N=0;N<=s;N++){const P=N/s*c+a,F=Math.cos(P),O=Math.sin(P);A.x=v*O,A.y=m*y,A.z=v*F,u.push(A.x,A.y,A.z),d.push(0,y,0),w.x=F*.5+.5,w.y=O*.5*y+.5,f.push(w.x,w.y),g++}for(let N=0;N<s;N++){const G=C+N,P=L+N;S===!0?h.push(P,P+1,G):h.push(P+1,P,G),k+=3}l.addGroup(p,k,S===!0?1:2),p+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bs(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Rr extends bs{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Rr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class $l extends Na{constructor(e){super(e),this.uuid=Rn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Na().fromJSON(s))}return this}}const _0={triangulate:function(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Yl(i,0,s,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,d,f;if(n&&(r=S0(i,e,r,t)),i.length>80*t){a=l=i[0],c=h=i[1];for(let g=t;g<s;g+=t)u=i[g],d=i[g+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-a,h-c),f=f!==0?32767/f:0}return xs(r,o,t,a,c,f,0),o}};function Yl(i,e,t,n,s){let r,o;if(s===U0(i,e,t,n)>0)for(r=e;r<t;r+=n)o=$c(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=$c(r,i[r],i[r+1],o);return o&&Cr(o,o.next)&&(ys(o),o=o.next),o}function di(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Cr(t,t.next)||ht(t.prev,t,t.next)===0)){if(ys(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function xs(i,e,t,n,s,r,o){if(!i)return;!o&&r&&A0(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?x0(i,n,s,r):v0(i)){e.push(c.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),ys(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=M0(di(i),e,t),xs(i,e,t,n,s,r,2)):o===2&&y0(i,e,t,n,s,r):xs(di(i),e,t,n,s,r,1);break}}}function v0(i){const e=i.prev,t=i,n=i.next;if(ht(e,t,n)>=0)return!1;const s=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,d=s>r?s>o?s:o:r>o?r:o,f=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Gi(s,a,r,c,o,l,g.x,g.y)&&ht(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function x0(i,e,t,n){const s=i.prev,r=i,o=i.next;if(ht(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,d=o.y,f=a<c?a<l?a:l:c<l?c:l,g=h<u?h<d?h:d:u<d?u:d,_=a>c?a>l?a:l:c>l?c:l,m=h>u?h>d?h:d:u>d?u:d,p=Oa(f,g,e,t,n),M=Oa(_,m,e,t,n);let x=i.prevZ,S=i.nextZ;for(;x&&x.z>=p&&S&&S.z<=M;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Gi(a,h,c,u,l,d,x.x,x.y)&&ht(x.prev,x,x.next)>=0||(x=x.prevZ,S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==s&&S!==o&&Gi(a,h,c,u,l,d,S.x,S.y)&&ht(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Gi(a,h,c,u,l,d,x.x,x.y)&&ht(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;S&&S.z<=M;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==s&&S!==o&&Gi(a,h,c,u,l,d,S.x,S.y)&&ht(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function M0(i,e,t){let n=i;do{const s=n.prev,r=n.next.next;!Cr(s,r)&&ql(s,n,n.next,r)&&Ms(s,r)&&Ms(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),ys(n),ys(n.next),n=i=r),n=n.next}while(n!==i);return di(n)}function y0(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&P0(o,a)){let c=jl(o,a);o=di(o,o.next),c=di(c,c.next),xs(o,e,t,n,s,r,0),xs(c,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function S0(i,e,t,n){const s=[];let r,o,a,c,l;for(r=0,o=e.length;r<o;r++)a=e[r]*n,c=r<o-1?e[r+1]*n:i.length,l=Yl(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(C0(l));for(s.sort(E0),r=0;r<s.length;r++)t=b0(s[r],t);return t}function E0(i,e){return i.x-e.x}function b0(i,e){const t=T0(i,e);if(!t)return e;const n=jl(t,i);return di(n,n.next),di(t,t.next)}function T0(i,e){let t=e,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;const a=s,c=s.x,l=s.y;let h=1/0,u;t=s;do r>=t.x&&t.x>=c&&r!==t.x&&Gi(o<l?r:n,o,c,l,o<l?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),Ms(t,i)&&(u<h||u===h&&(t.x>s.x||t.x===s.x&&w0(s,t)))&&(s=t,h=u)),t=t.next;while(t!==a);return s}function w0(i,e){return ht(i.prev,i,e.prev)<0&&ht(e.next,i,i.next)<0}function A0(i,e,t,n){let s=i;do s.z===0&&(s.z=Oa(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,R0(s)}function R0(i){let e,t,n,s,r,o,a,c,l=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<l&&(a++,n=n.nextZ,!!n);e++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,l*=2}while(o>1);return i}function Oa(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function C0(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Gi(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function P0(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!L0(i,e)&&(Ms(i,e)&&Ms(e,i)&&D0(i,e)&&(ht(i.prev,i,e.prev)||ht(i,e.prev,e))||Cr(i,e)&&ht(i.prev,i,i.next)>0&&ht(e.prev,e,e.next)>0)}function ht(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Cr(i,e){return i.x===e.x&&i.y===e.y}function ql(i,e,t,n){const s=ir(ht(i,e,t)),r=ir(ht(i,e,n)),o=ir(ht(t,n,i)),a=ir(ht(t,n,e));return!!(s!==r&&o!==a||s===0&&nr(i,t,e)||r===0&&nr(i,n,e)||o===0&&nr(t,i,n)||a===0&&nr(t,e,n))}function nr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function ir(i){return i>0?1:i<0?-1:0}function L0(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&ql(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ms(i,e){return ht(i.prev,i,i.next)<0?ht(i,e,i.next)>=0&&ht(i,i.prev,e)>=0:ht(i,e,i.prev)<0||ht(i,i.next,e)<0}function D0(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function jl(i,e){const t=new Fa(i.i,i.x,i.y),n=new Fa(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function $c(i,e,t,n){const s=new Fa(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ys(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Fa(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function U0(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class gs{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return gs.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];Yc(e),qc(n,e);let o=e.length;t.forEach(Yc);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,qc(n,t[c]);const a=_0.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function Yc(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function qc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class no extends Zt{constructor(e=new $l([new ie(.5,.5),new ie(-.5,.5),new ie(-.5,-.5),new ie(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let a=0,c=e.length;a<c;a++){const l=e[a];o(l)}this.setAttribute("position",new _t(s,3)),this.setAttribute("uv",new _t(r,2)),this.computeVertexNormals();function o(a){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:I0;let x,S=!1,C,w,A,k;p&&(x=p.getSpacedPoints(h),S=!0,d=!1,C=p.computeFrenetFrames(h,!1),w=new I,A=new I,k=new I),d||(m=0,f=0,g=0,_=0);const v=a.extractPoints(l);let y=v.shape;const L=v.holes;if(!gs.isClockWise(y)){y=y.reverse();for(let D=0,he=L.length;D<he;D++){const Z=L[D];gs.isClockWise(Z)&&(L[D]=Z.reverse())}}const G=gs.triangulateShape(y,L),P=y;for(let D=0,he=L.length;D<he;D++){const Z=L[D];y=y.concat(Z)}function F(D,he,Z){return he||console.error("THREE.ExtrudeGeometry: vec does not exist"),D.clone().addScaledVector(he,Z)}const O=y.length,X=G.length;function q(D,he,Z){let ae,j,be;const me=D.x-he.x,b=D.y-he.y,E=Z.x-D.x,B=Z.y-D.y,ne=me*me+b*b,ee=me*B-b*E;if(Math.abs(ee)>Number.EPSILON){const J=Math.sqrt(ne),ye=Math.sqrt(E*E+B*B),de=he.x-b/J,_e=he.y+me/J,Pe=Z.x-B/ye,ze=Z.y+E/ye,te=((Pe-de)*B-(ze-_e)*E)/(me*B-b*E);ae=de+me*te-D.x,j=_e+b*te-D.y;const Qe=ae*ae+j*j;if(Qe<=2)return new ie(ae,j);be=Math.sqrt(Qe/2)}else{let J=!1;me>Number.EPSILON?E>Number.EPSILON&&(J=!0):me<-Number.EPSILON?E<-Number.EPSILON&&(J=!0):Math.sign(b)===Math.sign(B)&&(J=!0),J?(ae=-b,j=me,be=Math.sqrt(ne)):(ae=me,j=b,be=Math.sqrt(ne/2))}return new ie(ae/be,j/be)}const Y=[];for(let D=0,he=P.length,Z=he-1,ae=D+1;D<he;D++,Z++,ae++)Z===he&&(Z=0),ae===he&&(ae=0),Y[D]=q(P[D],P[Z],P[ae]);const K=[];let se,ce=Y.concat();for(let D=0,he=L.length;D<he;D++){const Z=L[D];se=[];for(let ae=0,j=Z.length,be=j-1,me=ae+1;ae<j;ae++,be++,me++)be===j&&(be=0),me===j&&(me=0),se[ae]=q(Z[ae],Z[be],Z[me]);K.push(se),ce=ce.concat(se)}for(let D=0;D<m;D++){const he=D/m,Z=f*Math.cos(he*Math.PI/2),ae=g*Math.sin(he*Math.PI/2)+_;for(let j=0,be=P.length;j<be;j++){const me=F(P[j],Y[j],ae);xe(me.x,me.y,-Z)}for(let j=0,be=L.length;j<be;j++){const me=L[j];se=K[j];for(let b=0,E=me.length;b<E;b++){const B=F(me[b],se[b],ae);xe(B.x,B.y,-Z)}}}const $=g+_;for(let D=0;D<O;D++){const he=d?F(y[D],ce[D],$):y[D];S?(A.copy(C.normals[0]).multiplyScalar(he.x),w.copy(C.binormals[0]).multiplyScalar(he.y),k.copy(x[0]).add(A).add(w),xe(k.x,k.y,k.z)):xe(he.x,he.y,0)}for(let D=1;D<=h;D++)for(let he=0;he<O;he++){const Z=d?F(y[he],ce[he],$):y[he];S?(A.copy(C.normals[D]).multiplyScalar(Z.x),w.copy(C.binormals[D]).multiplyScalar(Z.y),k.copy(x[D]).add(A).add(w),xe(k.x,k.y,k.z)):xe(Z.x,Z.y,u/h*D)}for(let D=m-1;D>=0;D--){const he=D/m,Z=f*Math.cos(he*Math.PI/2),ae=g*Math.sin(he*Math.PI/2)+_;for(let j=0,be=P.length;j<be;j++){const me=F(P[j],Y[j],ae);xe(me.x,me.y,u+Z)}for(let j=0,be=L.length;j<be;j++){const me=L[j];se=K[j];for(let b=0,E=me.length;b<E;b++){const B=F(me[b],se[b],ae);S?xe(B.x,B.y+x[h-1].y,x[h-1].x+Z):xe(B.x,B.y,u+Z)}}}Q(),pe();function Q(){const D=s.length/3;if(d){let he=0,Z=O*he;for(let ae=0;ae<X;ae++){const j=G[ae];De(j[2]+Z,j[1]+Z,j[0]+Z)}he=h+m*2,Z=O*he;for(let ae=0;ae<X;ae++){const j=G[ae];De(j[0]+Z,j[1]+Z,j[2]+Z)}}else{for(let he=0;he<X;he++){const Z=G[he];De(Z[2],Z[1],Z[0])}for(let he=0;he<X;he++){const Z=G[he];De(Z[0]+O*h,Z[1]+O*h,Z[2]+O*h)}}n.addGroup(D,s.length/3-D,0)}function pe(){const D=s.length/3;let he=0;Ee(P,he),he+=P.length;for(let Z=0,ae=L.length;Z<ae;Z++){const j=L[Z];Ee(j,he),he+=j.length}n.addGroup(D,s.length/3-D,1)}function Ee(D,he){let Z=D.length;for(;--Z>=0;){const ae=Z;let j=Z-1;j<0&&(j=D.length-1);for(let be=0,me=h+m*2;be<me;be++){const b=O*be,E=O*(be+1),B=he+ae+b,ne=he+j+b,ee=he+j+E,J=he+ae+E;Fe(B,ne,ee,J)}}}function xe(D,he,Z){c.push(D),c.push(he),c.push(Z)}function De(D,he,Z){Se(D),Se(he),Se(Z);const ae=s.length/3,j=M.generateTopUV(n,s,ae-3,ae-2,ae-1);Ne(j[0]),Ne(j[1]),Ne(j[2])}function Fe(D,he,Z,ae){Se(D),Se(he),Se(ae),Se(he),Se(Z),Se(ae);const j=s.length/3,be=M.generateSideWallUV(n,s,j-6,j-3,j-2,j-1);Ne(be[0]),Ne(be[1]),Ne(be[3]),Ne(be[1]),Ne(be[2]),Ne(be[3])}function Se(D){s.push(c[D*3+0]),s.push(c[D*3+1]),s.push(c[D*3+2])}function Ne(D){r.push(D.x),r.push(D.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return N0(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,o=e.shapes.length;r<o;r++){const a=t[e.shapes[r]];n.push(a)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Ia[s.type]().fromJSON(s)),new no(n,e.options)}}const I0={generateTopUV:function(i,e,t,n,s){const r=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[s*3],h=e[s*3+1];return[new ie(r,o),new ie(a,c),new ie(l,h)]},generateSideWallUV:function(i,e,t,n,s,r){const o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],_=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new ie(o,1-c),new ie(l,1-u),new ie(d,1-g),new ie(_,1-p)]:[new ie(a,1-c),new ie(h,1-u),new ie(f,1-g),new ie(m,1-p)]}};function N0(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Pr extends Zt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new I,d=new I,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const M=[],x=p/n;let S=0;p===0&&o===0?S=.5/t:p===n&&c===Math.PI&&(S=-.5/t);for(let C=0;C<=t;C++){const w=C/t;u.x=-e*Math.cos(s+w*r)*Math.sin(o+x*a),u.y=e*Math.cos(o+x*a),u.z=e*Math.sin(s+w*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(w+S,1-x),M.push(l++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){const x=h[p][M+1],S=h[p][M],C=h[p+1][M],w=h[p+1][M+1];(p!==0||o>0)&&f.push(x,S,w),(p!==n-1||c<Math.PI)&&f.push(S,C,w)}this.setIndex(f),this.setAttribute("position",new _t(g,3)),this.setAttribute("normal",new _t(_,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class xr extends Zt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new I,u=new I,d=new I;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*r,m=f/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,M=(s+1)*f+g;o.push(_,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new _t(a,3)),this.setAttribute("normal",new _t(c,3)),this.setAttribute("uv",new _t(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xr(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Zl extends Ji{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vl,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Kl extends Rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class O0 extends Kl{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new We(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const va=new gt,jc=new I,Zc=new I;class F0{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ie(512,512),this.map=null,this.mapPass=null,this.matrix=new gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ja,this._frameExtents=new ie(1,1),this._viewportCount=1,this._viewports=[new At(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;jc.setFromMatrixPosition(e.matrixWorld),t.position.copy(jc),Zc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zc),t.updateMatrixWorld(),va.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(va),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(va)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class k0 extends F0{constructor(){super(new Ll(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class B0 extends Kl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.shadow=new k0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class z0{constructor(e,t,n=0,s=1/0){this.ray=new Ya(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new qa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return ka(e,this,n,t),n.sort(Kc),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ka(e[s],this,n,t);return n.sort(Kc),n}}function Kc(i,e){return i.distance-e.distance}function ka(i,e,t,n){if(i.layers.test(e.layers)&&i.raycast(e,t),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)ka(s[r],e,t,!0)}}class Jc{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(wt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Va}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Va);const Qc={type:"change"},xa={type:"start"},el={type:"end"},sr=new Ya,tl=new Fn,H0=Math.cos(70*Yu.DEG2RAD);class G0 extends pi{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:En.ROTATE,MIDDLE:En.DOLLY,RIGHT:En.PAN},this.touches={ONE:On.ROTATE,TWO:On.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(R){R.addEventListener("keydown",Pe),this._domElementKeyEvents=R},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Pe),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Qc),n.update(),r=s.NONE},this.update=function(){const R=new I,oe=new hi().setFromUnitVectors(e.up,new I(0,1,0)),Te=oe.clone().invert(),Me=new I,re=new hi,U=new I,le=2*Math.PI;return function(Ue=null){const Le=n.object.position;R.copy(Le).sub(n.target),R.applyQuaternion(oe),a.setFromVector3(R),n.autoRotate&&r===s.NONE&&N(y(Ue)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let Ze=n.minAzimuthAngle,Ke=n.maxAzimuthAngle;isFinite(Ze)&&isFinite(Ke)&&(Ze<-Math.PI?Ze+=le:Ze>Math.PI&&(Ze-=le),Ke<-Math.PI?Ke+=le:Ke>Math.PI&&(Ke-=le),Ze<=Ke?a.theta=Math.max(Ze,Math.min(Ke,a.theta)):a.theta=a.theta>(Ze+Ke)/2?Math.max(Ze,a.theta):Math.min(Ke,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&w||n.object.isOrthographicCamera?a.radius=K(a.radius):a.radius=K(a.radius*l),R.setFromSpherical(a),R.applyQuaternion(Te),Le.copy(n.target).add(R),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let ut=!1;if(n.zoomToCursor&&w){let pt=null;if(n.object.isPerspectiveCamera){const et=R.length();pt=K(et*l);const vt=et-pt;n.object.position.addScaledVector(S,vt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const et=new I(C.x,C.y,0);et.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),ut=!0;const vt=new I(C.x,C.y,0);vt.unproject(n.object),n.object.position.sub(vt).add(et),n.object.updateMatrixWorld(),pt=R.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;pt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(pt).add(n.object.position):(sr.origin.copy(n.object.position),sr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(sr.direction))<H0?e.lookAt(n.target):(tl.setFromNormalAndCoplanarPoint(n.object.up,n.target),sr.intersectPlane(tl,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),ut=!0);return l=1,w=!1,ut||Me.distanceToSquared(n.object.position)>o||8*(1-re.dot(n.object.quaternion))>o||U.distanceToSquared(n.target)>0?(n.dispatchEvent(Qc),Me.copy(n.object.position),re.copy(n.object.quaternion),U.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Qe),n.domElement.removeEventListener("pointerdown",b),n.domElement.removeEventListener("pointercancel",B),n.domElement.removeEventListener("wheel",J),n.domElement.removeEventListener("pointermove",E),n.domElement.removeEventListener("pointerup",B),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Pe),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new Jc,c=new Jc;let l=1;const h=new I,u=new ie,d=new ie,f=new ie,g=new ie,_=new ie,m=new ie,p=new ie,M=new ie,x=new ie,S=new I,C=new ie;let w=!1;const A=[],k={};let v=!1;function y(R){return R!==null?2*Math.PI/60*n.autoRotateSpeed*R:2*Math.PI/60/60*n.autoRotateSpeed}function L(R){const oe=Math.abs(R*.01);return Math.pow(.95,n.zoomSpeed*oe)}function N(R){c.theta-=R}function G(R){c.phi-=R}const P=function(){const R=new I;return function(Te,Me){R.setFromMatrixColumn(Me,0),R.multiplyScalar(-Te),h.add(R)}}(),F=function(){const R=new I;return function(Te,Me){n.screenSpacePanning===!0?R.setFromMatrixColumn(Me,1):(R.setFromMatrixColumn(Me,0),R.crossVectors(n.object.up,R)),R.multiplyScalar(Te),h.add(R)}}(),O=function(){const R=new I;return function(Te,Me){const re=n.domElement;if(n.object.isPerspectiveCamera){const U=n.object.position;R.copy(U).sub(n.target);let le=R.length();le*=Math.tan(n.object.fov/2*Math.PI/180),P(2*Te*le/re.clientHeight,n.object.matrix),F(2*Me*le/re.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(P(Te*(n.object.right-n.object.left)/n.object.zoom/re.clientWidth,n.object.matrix),F(Me*(n.object.top-n.object.bottom)/n.object.zoom/re.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function X(R){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=R:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(R){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=R:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Y(R,oe){if(!n.zoomToCursor)return;w=!0;const Te=n.domElement.getBoundingClientRect(),Me=R-Te.left,re=oe-Te.top,U=Te.width,le=Te.height;C.x=Me/U*2-1,C.y=-(re/le)*2+1,S.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function K(R){return Math.max(n.minDistance,Math.min(n.maxDistance,R))}function se(R){u.set(R.clientX,R.clientY)}function ce(R){Y(R.clientX,R.clientX),p.set(R.clientX,R.clientY)}function $(R){g.set(R.clientX,R.clientY)}function Q(R){d.set(R.clientX,R.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const oe=n.domElement;N(2*Math.PI*f.x/oe.clientHeight),G(2*Math.PI*f.y/oe.clientHeight),u.copy(d),n.update()}function pe(R){M.set(R.clientX,R.clientY),x.subVectors(M,p),x.y>0?X(L(x.y)):x.y<0&&q(L(x.y)),p.copy(M),n.update()}function Ee(R){_.set(R.clientX,R.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),O(m.x,m.y),g.copy(_),n.update()}function xe(R){Y(R.clientX,R.clientY),R.deltaY<0?q(L(R.deltaY)):R.deltaY>0&&X(L(R.deltaY)),n.update()}function De(R){let oe=!1;switch(R.code){case n.keys.UP:R.ctrlKey||R.metaKey||R.shiftKey?G(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):O(0,n.keyPanSpeed),oe=!0;break;case n.keys.BOTTOM:R.ctrlKey||R.metaKey||R.shiftKey?G(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):O(0,-n.keyPanSpeed),oe=!0;break;case n.keys.LEFT:R.ctrlKey||R.metaKey||R.shiftKey?N(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):O(n.keyPanSpeed,0),oe=!0;break;case n.keys.RIGHT:R.ctrlKey||R.metaKey||R.shiftKey?N(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):O(-n.keyPanSpeed,0),oe=!0;break}oe&&(R.preventDefault(),n.update())}function Fe(R){if(A.length===1)u.set(R.pageX,R.pageY);else{const oe=ge(R),Te=.5*(R.pageX+oe.x),Me=.5*(R.pageY+oe.y);u.set(Te,Me)}}function Se(R){if(A.length===1)g.set(R.pageX,R.pageY);else{const oe=ge(R),Te=.5*(R.pageX+oe.x),Me=.5*(R.pageY+oe.y);g.set(Te,Me)}}function Ne(R){const oe=ge(R),Te=R.pageX-oe.x,Me=R.pageY-oe.y,re=Math.sqrt(Te*Te+Me*Me);p.set(0,re)}function D(R){n.enableZoom&&Ne(R),n.enablePan&&Se(R)}function he(R){n.enableZoom&&Ne(R),n.enableRotate&&Fe(R)}function Z(R){if(A.length==1)d.set(R.pageX,R.pageY);else{const Te=ge(R),Me=.5*(R.pageX+Te.x),re=.5*(R.pageY+Te.y);d.set(Me,re)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const oe=n.domElement;N(2*Math.PI*f.x/oe.clientHeight),G(2*Math.PI*f.y/oe.clientHeight),u.copy(d)}function ae(R){if(A.length===1)_.set(R.pageX,R.pageY);else{const oe=ge(R),Te=.5*(R.pageX+oe.x),Me=.5*(R.pageY+oe.y);_.set(Te,Me)}m.subVectors(_,g).multiplyScalar(n.panSpeed),O(m.x,m.y),g.copy(_)}function j(R){const oe=ge(R),Te=R.pageX-oe.x,Me=R.pageY-oe.y,re=Math.sqrt(Te*Te+Me*Me);M.set(0,re),x.set(0,Math.pow(M.y/p.y,n.zoomSpeed)),X(x.y),p.copy(M);const U=(R.pageX+oe.x)*.5,le=(R.pageY+oe.y)*.5;Y(U,le)}function be(R){n.enableZoom&&j(R),n.enablePan&&ae(R)}function me(R){n.enableZoom&&j(R),n.enableRotate&&Z(R)}function b(R){n.enabled!==!1&&(A.length===0&&(n.domElement.setPointerCapture(R.pointerId),n.domElement.addEventListener("pointermove",E),n.domElement.addEventListener("pointerup",B)),Xe(R),R.pointerType==="touch"?ze(R):ne(R))}function E(R){n.enabled!==!1&&(R.pointerType==="touch"?te(R):ee(R))}function B(R){ke(R),A.length===0&&(n.domElement.releasePointerCapture(R.pointerId),n.domElement.removeEventListener("pointermove",E),n.domElement.removeEventListener("pointerup",B)),n.dispatchEvent(el),r=s.NONE}function ne(R){let oe;switch(R.button){case 0:oe=n.mouseButtons.LEFT;break;case 1:oe=n.mouseButtons.MIDDLE;break;case 2:oe=n.mouseButtons.RIGHT;break;default:oe=-1}switch(oe){case En.DOLLY:if(n.enableZoom===!1)return;ce(R),r=s.DOLLY;break;case En.ROTATE:if(R.ctrlKey||R.metaKey||R.shiftKey){if(n.enablePan===!1)return;$(R),r=s.PAN}else{if(n.enableRotate===!1)return;se(R),r=s.ROTATE}break;case En.PAN:if(R.ctrlKey||R.metaKey||R.shiftKey){if(n.enableRotate===!1)return;se(R),r=s.ROTATE}else{if(n.enablePan===!1)return;$(R),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(xa)}function ee(R){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Q(R);break;case s.DOLLY:if(n.enableZoom===!1)return;pe(R);break;case s.PAN:if(n.enablePan===!1)return;Ee(R);break}}function J(R){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(R.preventDefault(),n.dispatchEvent(xa),xe(ye(R)),n.dispatchEvent(el))}function ye(R){const oe=R.deltaMode,Te={clientX:R.clientX,clientY:R.clientY,deltaY:R.deltaY};switch(oe){case 1:Te.deltaY*=16;break;case 2:Te.deltaY*=100;break}return R.ctrlKey&&!v&&(Te.deltaY*=10),Te}function de(R){R.key==="Control"&&(v=!0,document.addEventListener("keyup",_e,{passive:!0,capture:!0}))}function _e(R){R.key==="Control"&&(v=!1,document.removeEventListener("keyup",_e,{passive:!0,capture:!0}))}function Pe(R){n.enabled===!1||n.enablePan===!1||De(R)}function ze(R){switch(Ce(R),A.length){case 1:switch(n.touches.ONE){case On.ROTATE:if(n.enableRotate===!1)return;Fe(R),r=s.TOUCH_ROTATE;break;case On.PAN:if(n.enablePan===!1)return;Se(R),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case On.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;D(R),r=s.TOUCH_DOLLY_PAN;break;case On.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;he(R),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(xa)}function te(R){switch(Ce(R),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Z(R),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;ae(R),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;be(R),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;me(R),n.update();break;default:r=s.NONE}}function Qe(R){n.enabled!==!1&&R.preventDefault()}function Xe(R){A.push(R.pointerId)}function ke(R){delete k[R.pointerId];for(let oe=0;oe<A.length;oe++)if(A[oe]==R.pointerId){A.splice(oe,1);return}}function Ce(R){let oe=k[R.pointerId];oe===void 0&&(oe=new ie,k[R.pointerId]=oe),oe.set(R.pageX,R.pageY)}function ge(R){const oe=R.pointerId===A[0]?A[1]:A[0];return k[oe]}n.domElement.addEventListener("contextmenu",Qe),n.domElement.addEventListener("pointerdown",b),n.domElement.addEventListener("pointercancel",B),n.domElement.addEventListener("wheel",J,{passive:!1}),document.addEventListener("keydown",de,{passive:!0,capture:!0}),this.update()}}const nt={startMoney:2500,startFame:40,ticket:12,ticketMin:6,ticketMax:26,staffBase:20,dayMs:14e3,fastMult:3,bankruptcyAt:-3e3,marketSlots:3,marketRefreshDays:5,baseFeedCapacity:30,overflowFeedMult:1.8,rangerCoverage:2,treatCost:250},je={parasaur:{name:"Parasaurolophus",icon:"🎺",cost:450,food:12,pop:3,irr:2,fer:1,social:"herd",minR:1.2,always:!0,desc:"A cheerful honker. Fits almost anywhere and complains about nothing."},stego:{name:"Stegosaurus",icon:"🌵",cost:900,food:18,pop:5,irr:3,fer:2,social:"herd",minR:1.6,always:!0,desc:"Slow, photogenic, needs a bit of lawn to trundle."},pachy:{name:"Pachycephalosaurus",icon:"🪨",cost:750,food:14,pop:4,irr:5,fer:2,social:"herd",minR:1.2,weight:.18,desc:"Headbutts fences, rocks, and occasionally opinions."},anky:{name:"Ankylosaurus",icon:"🛡️",cost:1100,food:20,pop:6,irr:3,fer:2,social:"herd",minR:1.6,weight:.17,desc:"A living tank with a club tail. Placid, until it is not."},trike:{name:"Triceratops",icon:"🦬",cost:1400,food:22,pop:7,irr:4,fer:2,social:"herd",minR:1.8,weight:.15,desc:"Grumpy alone, majestic in a herd. Wants real acreage."},ptero:{name:"Pteranodon",icon:"🪁",cost:1600,food:16,pop:9,irr:4,fer:2,social:"herd",minR:1.3,weight:.13,desc:"Circles its territory all day. Guests crane their necks; wallets open."},dilo:{name:"Dilophosaurus",icon:"🎭",cost:2e3,food:26,pop:8,irr:6,fer:3,social:"solo",minR:1.7,weight:.12,desc:"Dramatic, venomous, lives alone by mutual agreement."},raptor:{name:"Velociraptor",icon:"🗡️",cost:2800,food:30,pop:10,irr:7,fer:3,social:"herd",minR:1.5,weight:.1,desc:"Clever girl. Tests fences daily; happier with the pack."},carno:{name:"Carnotaurus",icon:"😈",cost:3400,food:38,pop:12,irr:7,fer:3,social:"solo",minR:1.9,weight:.07,desc:"The horned sprinter. Fast, furious, photogenic."},brachio:{name:"Brachiosaurus",icon:"🌴",cost:5200,food:48,pop:14,irr:2,fer:2,social:"herd",minR:3.5,weight:.05,desc:"A four-story neck. Only the big back-country cells will do."},spino:{name:"Spinosaurus",icon:"🌊",cost:6e3,food:55,pop:16,irr:6,fer:4,social:"solo",minR:3,weight:.04,loves:"water",desc:"The sailed fisher-king. Miserable without a pond next door."},trex:{name:"T-Rex",icon:"👑",cost:9e3,food:75,pop:20,irr:8,fer:4,social:"solo",minR:3.3,weight:.04,desc:"The main event. Demands room, solitude and electric fencing."}},Xn=[{name:"Timber",strength:1,cost:0,desc:"Holds in the polite ones."},{name:"Steel",strength:3,cost:500,desc:"Raptor-rated."},{name:"Electrified",strength:4,cost:1200,desc:"T-Rex proof."}],$n={paddock:{name:"Paddock",icon:"🦕",cost:200,upkeep:5,desc:"Fence the whole cell. Bigger cells hold bigger dinos — and more of them."},kiosk:{name:"Snack Kiosk",icon:"🌭",cost:350,upkeep:18,desc:"Earns per guest walking the adjacent trails. Placement is everything."},gift:{name:"Gift Stand",icon:"🧸",cost:650,upkeep:28,desc:"Bigger margins than snacks, hungrier for foot traffic."},garden:{name:"Garden",icon:"🌳",cost:150,upkeep:4,desc:"Calms neighboring dinosaurs and nudges park fame."},restroom:{name:"Restroom",icon:"🚻",cost:250,upkeep:8,desc:"Comfy guests spread the word. Fame insurance."},depot:{name:"Feed Depot",icon:"🌾",cost:500,upkeep:15,desc:"Feeds 60 appetite. Beyond capacity, feed is imported at a heavy premium and dinos go hungry."},ranger:{name:"Ranger Station",icon:"🎯",cost:600,upkeep:24,desc:"Covers 2 dangerous dinos: halves their escape risk and recaptures runaways within 2 days."},generator:{name:"Generator",icon:"🔌",cost:800,upkeep:20,desc:"Powers electric fences (they idle at steel strength without it) and keeps stands open through outages."},clinic:{name:"Vet Clinic",icon:"🩺",cost:550,upkeep:16,desc:"Sick dinosaurs are treated overnight for free. Without it, illness lingers or costs a call-out fee."},survey:{name:"Guest Services",icon:"🎪",cost:400,upkeep:10,desc:"Surveys departing guests: unlocks the guest-mood report in the Books — who left hungry, empty-handed or uncomfortable."},research:{name:"Research Post",icon:"🔭",cost:700,upkeep:18,desc:"Behavior scientists on staff: unlocks exact happiness readings for every dinosaur instead of keeper guesswork."}},V0={kiosk:6,gift:9},ni={outage:{name:"Power Outage",icon:"⚡",days:3,desc:"Electric fences sag to steel and stands go dark — unless a generator hums."},storm:{name:"Thunderstorm",icon:"⛈️",days:1,desc:"Gale winds wreck gardens and keep guests home."},heatwave:{name:"Heatwave",icon:"🥵",days:3,desc:"Tempers grill. Dinos with a pond next door stay cool."}},Zi={meadow:{name:"Meadow",color:9621355,priceMult:1},forest:{name:"Forest",color:6135898,priceMult:1.1},rock:{name:"Rocky",color:12102544,priceMult:.7},water:{name:"Pond",color:7325928,priceMult:0}};function W0(i,e=0){return Math.round((60+i.area*7+e*2.5)*Zi[i.terrain].priceMult)}function ft(i){return`${i<0?"-":""}$${Math.abs(Math.round(i)).toLocaleString("en-US")}`}function zn(i){const e=i<0?"-":"",t=Math.abs(i);return t>=1e6?`${e}$${(t/1e6).toFixed(1)}m`:t>=1e4?`${e}$${(t/1e3).toFixed(1)}k`:`${e}$${Math.round(t).toLocaleString("en-US")}`}function ct(i,e={}){return new Zl({color:i,flatShading:!0,roughness:.9,...e})}function Oe(i,e,t=0,n=0,s=0){const r=new Ht(i,e);return r.position.set(t,n,s),r.castShadow=!0,r}const Tt=new Pr(1,10,8),qt=new Rr(1,1,8),Hn=new bs(1,1,1,8),Nn=new mi(1,1,1);function Mr(i,e,{y:t=.1,z:n=.35,spread:s=.32}={}){const r=ct(16777215,{roughness:.4}),o=ct(2236962,{roughness:.4});for(const a of[-1,1]){const c=Oe(Tt,r,a*s*e,t*e,n*e);c.scale.setScalar(.16*e);const l=Oe(Tt,o,a*s*e,t*e,(n+.12)*e);l.scale.setScalar(.08*e),i.add(c,l)}}function Jl(i,e,t,n){const s=new Je,r=Oe(Hn,n,0,-t/2,0);r.scale.set(e,t,e);const o=Oe(Tt,n,0,-t,.06*i);return o.scale.set(e*1.35,e*.8,e*1.6),s.add(r,o),s}function io(i,e,t,n,s,r=.12){const o=[];let a=null;const c=new Je;c.position.set(0,e,t);for(let l=0;l<n.length;l++){const[h,u]=n[l],d=l===0?c:new Je;a&&d.position.set(0,r*i,-n[l-1][1]);const f=Oe(qt,s,0,0,-u/2);f.scale.set(h,u,h),f.rotation.x=-Math.PI/2,d.add(f),a&&a.add(d),a=d,o.push(d)}return{root:c,segs:o}}function ls({s:i,skin:e,belly:t,legH:n=1,bodyScale:s=[.85,.72,1.2],neckH:r=.55,headScale:o=.62}){const a=new Je,c=ct(e),l=ct(t),h=n*i+s[1]*i*.35,u=new Je;u.position.y=h,a.add(u);const d=Oe(Tt,c);d.scale.set(s[0]*i,s[1]*i,s[2]*i);const f=Oe(Tt,l,0,-.28*i,.1*i);f.scale.set(s[0]*i*.82,s[1]*i*.72,s[2]*i*.85),u.add(d,f);const g=[],_=-.35*s[1]*i;for(const[C,w]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const A=Jl(i,.2*i,h+_,c);A.position.set(C*.5*s[0]*i,_,w*.62*s[2]*i),u.add(A),g.push({pivot:A,phase:C*w>0?0:Math.PI})}const m=io(i,.12*i,-s[2]*i*.85,[[.42*i,.75*i],[.3*i,.6*i],[.18*i,.5*i]],c);u.add(m.root);const p=Oe(Hn,c,0,.32*i,s[2]*i*.95);p.scale.set(.28*i,.85*i,.28*i),p.rotation.x=.55,u.add(p);const M=new Je;M.position.set(0,r*i+s[1]*i*.6,s[2]*i*1.35);const x=Oe(Tt,c);x.scale.set(.5*o*i*1.7,.48*o*i*1.7,.6*o*i*1.7);const S=Oe(Tt,c,0,-.1*i,.62*o*i);return S.scale.set(.36*o*i*1.6,.28*o*i*1.5,.48*o*i*1.6),M.add(x,S),Mr(M,i*o*1.7,{y:.16,z:.3,spread:.34}),u.add(M),{group:a,bodyPivot:u,legs:g,tail:m.segs,head:M,skinM:c,bellyM:l,size:i}}function ki({s:i,skin:e,belly:t,legH:n=1.15,bodyScale:s=[.68,.74,1.05],headScale:r=.7,headZ:o=1.55,headY:a=1.05}){const c=new Je,l=ct(e),h=ct(t),u=n*i+s[1]*i*.25,d=new Je;d.position.y=u,d.rotation.x=-.24,c.add(d);const f=Oe(Tt,l);f.scale.set(s[0]*i,s[1]*i,s[2]*i);const g=Oe(Tt,h,0,-.22*i,.18*i);g.scale.set(s[0]*i*.8,s[1]*i*.75,s[2]*i*.8),d.add(f,g);const _=[];for(const C of[-1,1]){const w=Jl(i,.26*i,u-.1*i,l);w.position.set(C*.5*s[0]*i,-.15*i,-.15*i);const A=Oe(Tt,l,0,-.1*i,0);A.scale.set(.32*i,.42*i,.4*i),w.add(A),d.add(w),_.push({pivot:w,phase:C>0?0:Math.PI})}const m=[];for(const C of[-1,1]){const w=Oe(Hn,l,C*.72*s[0]*i,.05*i,.7*s[2]*i);w.scale.set(.09*i,.4*i,.09*i),w.rotation.x=2.2,d.add(w),m.push(w)}const p=io(i,.05*i,-s[2]*i*.8,[[.4*i,.9*i],[.28*i,.75*i],[.16*i,.6*i]],l,.06);d.add(p.root);const M=Oe(Hn,l,0,a*i*.55,s[2]*i*.9);M.scale.set(.24*i,.8*i,.24*i),M.rotation.x=.5,d.add(M);const x=new Je;x.position.set(0,a*i,o*s[2]*i);const S=Oe(Tt,l);return S.scale.set(.42*r*i*1.7,.42*r*i*1.7,.55*r*i*1.7),x.add(S),Mr(x,i*r*1.7,{y:.16,z:.28,spread:.3}),d.add(x),{group:c,bodyPivot:d,legs:_,tail:p.segs,head:x,arms:m,skinM:l,bellyM:h,size:i}}const X0={parasaur(i=.85){const e=ls({s:i,skin:5818789,belly:14218212,bodyScale:[.9,.8,1.35]}),t=Oe(Hn,ct(16747625),0,.45*i,-.25*i);return t.scale.set(.1*i,.85*i,.14*i),t.rotation.x=2.4,e.head.add(t),e},stego(i=1.05){const e=ls({s:i,skin:8172354,belly:14478792,bodyScale:[1.05,.9,1.5],neckH:.3,headScale:.45}),t=ct(16740419);[.45,.65,.8,.65,.45].forEach((s,r)=>{for(const o of[-1,1]){const a=Oe(qt,t,o*.14*i,.75*i,(1-r*.55)*i);a.scale.set(.34*i,s*i,.1*i),e.bodyPivot.add(a)}});for(const s of[-1,1]){const r=Oe(qt,t,s*.12*i,.12*i,-.25*i);r.scale.set(.08*i,.5*i,.08*i),r.rotation.z=s*-.7,e.tail[2].add(r)}return e.head.position.y-=.35*i,e},trike(i=1.05){const e=ls({s:i,skin:7311305,belly:13490674,bodyScale:[1.05,.9,1.45],neckH:.35,headScale:.6}),t=Oe(Hn,ct(5534111),0,.28*i,-.32*i);t.scale.set(.62*i,.09*i,.62*i),t.rotation.x=1.15,e.head.add(t);const n=ct(16774102);for(const r of[-1,1]){const o=Oe(qt,n,r*.28*i,.32*i,.22*i);o.scale.set(.09*i,.55*i,.09*i),o.rotation.x=.9,e.head.add(o)}const s=Oe(qt,n,0,.05*i,.62*i);return s.scale.set(.08*i,.3*i,.08*i),s.rotation.x=1.2,e.head.add(s),e},dilo(i=.9){const e=ki({s:i,skin:13943626,belly:16051906,headScale:.65}),t=ct(15029053);for(const n of[-1,1]){const s=Oe(Tt,t,n*.2*i,.42*i,.1*i);s.scale.set(.06*i,.34*i,.3*i),e.head.add(s)}return e},raptor(i=.8){const e=ki({s:i,skin:16750656,belly:16769203,legH:1.2,bodyScale:[.6,.65,1],headScale:.62,headZ:1.65}),t=ct(8014367);for(let s=0;s<3;s++){const r=Oe(Nn,t,0,.55*i,(.5-s*.5)*i);r.scale.set(1.15*i,.16*i,.16*i),r.rotation.x=.15,e.bodyPivot.add(r)}const n=Oe(qt,t,0,0,-.65*i);return n.scale.set(.12*i,.35*i,.12*i),n.rotation.x=-Math.PI/2,e.tail[2].add(n),e},brachio(i=1.35){const e=ls({s:i,skin:10190804,belly:13879278,legH:1.1,bodyScale:[.9,.8,1.25],headScale:.4});e.bodyPivot.remove(e.head),e.bodyPivot.children.filter(a=>a.geometry===Hn&&a.position.z>.5*i).forEach(a=>e.bodyPivot.remove(a));const t=e.skinM,n=new Je;n.position.set(0,.3*i,.95*i),n.rotation.x=.55;const s=Oe(Hn,t,0,.85*i,0);s.scale.set(.26*i,1.7*i,.26*i),n.add(s);const r=new Je;r.position.set(0,1.75*i,.12*i);const o=Oe(Tt,t);return o.scale.set(.3*i,.28*i,.4*i),r.add(o),Mr(r,i*.75,{y:.12,z:.3,spread:.28}),n.add(r),e.bodyPivot.add(n),e.head=r,e.neck=n,e},trex(i=1.25){const e=ki({s:i,skin:12605263,belly:15255968,legH:1.2,bodyScale:[.78,.85,1.1],headScale:.9,headY:1.15,headZ:1.5}),t=Oe(Nn,e.skinM,0,.05*i,.35*i);t.scale.set(.55*i,.45*i,.7*i),e.head.add(t);const n=new Je;n.position.set(0,-.12*i,.1*i);const s=Oe(Nn,e.skinM,0,-.08*i,.35*i);s.scale.set(.48*i,.2*i,.62*i);const r=Oe(Nn,ct(16777215),0,.03*i,.35*i);r.scale.set(.44*i,.06*i,.58*i),n.add(s,r),e.head.add(n),e.jaw=n;for(const o of[-1,1]){const a=Oe(Nn,ct(9386548),o*.28*i,.32*i,.45*i);a.scale.set(.16*i,.08*i,.24*i),e.head.add(a)}return e},anky(i=1){const e=ls({s:i,skin:9083483,belly:14077616,legH:.65,bodyScale:[1.05,.6,1.3],neckH:.2,headScale:.5}),t=ct(6254399);for(let s=0;s<4;s++)for(const r of[-.35,.35]){const o=Oe(Tt,t,r*i,.55*i,(.85-s*.55)*i);o.scale.set(.24*i,.14*i,.24*i),e.bodyPivot.add(o)}for(let s=0;s<3;s++)for(const r of[-1,1]){const o=Oe(qt,t,r*1*i,.1*i,(.7-s*.7)*i);o.scale.set(.12*i,.4*i,.12*i),o.rotation.z=r*-1.35,e.bodyPivot.add(o)}const n=Oe(Tt,t,0,.02*i,-.55*i);return n.scale.set(.34*i,.28*i,.4*i),e.tail[2].add(n),e.head.position.y-=.3*i,e},pachy(i=.75){const e=ki({s:i,skin:13207632,belly:15784373,headScale:.68}),t=Oe(Tt,ct(15258544),0,.4*i,.05*i);t.scale.set(.4*i,.34*i,.42*i),e.head.add(t);const n=ct(9067056);for(let s=0;s<5;s++){const r=-1.1+s*.55,o=Oe(qt,n,Math.sin(r)*.42*i,.42*i,-.15*i+Math.cos(r)*.1*i);o.scale.set(.06*i,.16*i,.06*i),o.rotation.z=-r,e.head.add(o)}return e},carno(i=1.1){const e=ki({s:i,skin:9194044,belly:14264710,legH:1.25,bodyScale:[.66,.75,1.05],headScale:.78,headY:1.1}),t=ct(15786176);for(const s of[-1,1]){const r=Oe(qt,t,s*.3*i,.45*i,.2*i);r.scale.set(.1*i,.34*i,.1*i),r.rotation.z=s*-.5,e.head.add(r)}const n=Oe(qt,ct(7025962),0,0,-.6*i);return n.scale.set(.11*i,.32*i,.11*i),n.rotation.x=-Math.PI/2,e.tail[2].add(n),e},spino(i=1.3){const e=ki({s:i,skin:5995916,belly:14272928,legH:1.1,bodyScale:[.78,.85,1.2],headScale:.7,headY:1,headZ:1.45}),t=ct(14251842);[.5,.8,1,.8,.5].forEach((r,o)=>{const a=Oe(qt,t,0,.75*i,(.75-o*.42)*i);a.scale.set(.4*i,r*i,.09*i),e.bodyPivot.add(a)});const s=Oe(Nn,e.skinM,0,-.05*i,.6*i);return s.scale.set(.26*i,.2*i,.75*i),e.head.add(s),e},ptero(i=.8){const e=new Je,t=ct(14190927),n=ct(15250055),s=new Je;s.position.y=1.2*i,e.add(s);const r=Oe(Tt,t);r.scale.set(.45*i,.4*i,.9*i),s.add(r);const o=new Je;o.position.set(0,.25*i,.85*i);const a=Oe(Tt,t);a.scale.set(.28*i,.26*i,.34*i);const c=Oe(qt,ct(15254122),0,-.04*i,.55*i);c.scale.set(.12*i,.6*i,.12*i),c.rotation.x=Math.PI/2;const l=Oe(qt,ct(12605263),0,.18*i,-.3*i);l.scale.set(.1*i,.5*i,.1*i),l.rotation.x=-2.2,o.add(a,c,l),Mr(o,i*.9,{y:.12,z:.22,spread:.24}),s.add(o);const h=[];for(const d of[-1,1]){const f=new Je;f.position.set(d*.3*i,.15*i,.1*i);const g=Oe(Nn,n,d*.85*i,0,-.15*i);g.scale.set(1.7*i,.06*i,.75*i);const _=Oe(Nn,n,d*1.9*i,0,-.3*i);_.scale.set(.5*i,.05*i,.45*i),f.add(g,_),s.add(f),h.push(f)}const u=io(i*.6,-.05*i,-.8*i,[[.14*i,.5*i]],t,0);return s.add(u.root),{group:e,bodyPivot:s,legs:[],tail:u.segs,head:o,wings:h,fly:!0,skinM:t,bellyM:n,size:i}}};function $0(i){const e=X0[i]();return e.group.traverse(t=>{t.castShadow=!0}),e}const Ma={};function nl(i){if(!Ma[i]){const t=document.createElement("canvas");t.width=t.height=128;const n=t.getContext("2d");n.font="96px serif",n.textAlign="center",n.textBaseline="middle",n.fillText(i,64,72);const s=new Hl(t);s.colorSpace=Mt,Ma[i]=s}const e=new i0(new Bl({map:Ma[i],transparent:!0,depthTest:!1}));return e.scale.setScalar(1.5),e}const hs=.5;function we(i,e={}){return new Zl({color:i,flatShading:!0,roughness:.95,...e})}const pn=new Pr(1,10,8),Ki=new Rr(1,1,8),Gt=new bs(1,1,1,10),rt=new mi(1,1,1);function Re(i,e,t=0,n=0,s=0){const r=new Ht(i,e);return r.position.set(t,n,s),r.castShadow=!0,r.receiveShadow=!0,r}function Y0(i){const e=new Je,t=Re(rt,we(15909198),0,.8,0);t.scale.set(2.2,1.6,1.7),e.add(t);for(let s=0;s<5;s++){const r=Re(rt,we(s%2?16777215:15029053),-1+s*.5,1.85,.85);r.scale.set(.5,.1,.9),r.rotation.x=-.35,e.add(r)}const n=Re(Gt,we(13201210),0,2.35,0);return n.scale.set(.24,1.1,.24),n.rotation.z=Math.PI/2,e.add(n),e.scale.setScalar(i),e}function q0(i){const e=new Je,t=Re(rt,we(10473704),0,.9,0);t.scale.set(2.2,1.8,2),e.add(t);const n=Re(Ki,we(15236004),0,2.5,0);n.scale.set(1.9,1.4,1.9),e.add(n);const s=Re(pn,we(16766287,{emissive:10055424}),0,3.4,0);return s.scale.setScalar(.28),e.add(s),e.scale.setScalar(i),e}function j0(i){const e=new Je;for(const[t,n,s,r]of[[-.8,-.4,1.3,.65],[.6,.3,1.7,.8],[-.1,.9,1,.5]]){const o=Re(Gt,we(9268835),t,s*.35,n);o.scale.set(.13,s*.7,.13);const a=Re(pn,we(6732650),t,s,n);a.scale.setScalar(r),e.add(o,a)}for(let t=0;t<5;t++){const n=t/5*Math.PI*2,s=Re(pn,we([15029053,16766287,15236004][t%3]),Math.cos(n)*1.6,.15,Math.sin(n)*1.6);s.scale.setScalar(.14),e.add(s)}return e.scale.setScalar(i),e}function Z0(i){const e=new Je,t=Re(rt,we(13621468),0,.75,0);t.scale.set(2.1,1.5,1.5),e.add(t);const n=Re(rt,we(7901340),0,1.6,0);n.scale.set(2.4,.22,1.8),e.add(n);for(const[s,r]of[[-.5,4886745],[.5,15236004]]){const o=Re(rt,we(r),s,.6,.76);o.scale.set(.55,1.1,.08),e.add(o)}return e.scale.setScalar(i),e}function K0(i){const e=new Je,t=Re(rt,we(11884094),0,.9,0);t.scale.set(2.4,1.8,1.9),e.add(t);const n=Re(rt,we(9255466),0,1.95,0);n.scale.set(2.7,.5,2.2),n.rotation.z=0,e.add(n);const s=Re(rt,we(16180152),0,.7,.96);s.scale.set(1,1.3,.1),e.add(s);for(const[r,o]of[[-1.6,.4],[-1.5,-.5]]){const a=Re(Gt,we(14730088),r,.35,o);a.scale.set(.35,.6,.35),a.rotation.z=Math.PI/2,e.add(a)}return e.scale.setScalar(i),e}function J0(i){const e=new Je;for(const[r,o]of[[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]]){const a=Re(Gt,we(9268835),r,.9,o);a.scale.set(.11,1.8,.11),e.add(a)}const t=Re(rt,we(11104575),0,2.2,0);t.scale.set(1.9,1,1.9);const n=Re(Ki,we(6130250),0,3.2,0);n.scale.set(1.7,1,1.7);const s=Re(pn,we(15029053,{emissive:8000528}),.6,4,0);return s.scale.setScalar(.13),e.add(t,n,s),e.userData.anim={type:"beacon",beacon:s},e.scale.setScalar(i),e}function Q0(i){const e=new Je,t=Re(rt,we(9280165),0,.65,0);t.scale.set(2,1.3,1.5),e.add(t);for(let r=0;r<3;r++){const o=Re(Gt,we(16766287),-.6+r*.6,1.5,0);o.scale.set(.24,.45,.24),e.add(o)}const n=Re(rt,we(3622735),0,.9,.8);n.scale.set(.8,.8,.1),e.add(n);const s=Re(Ki,we(16771402,{emissive:9073920}),.8,1.75,0);return s.scale.set(.18,.45,.18),s.rotation.z=Math.PI,e.add(s),e.userData.anim={type:"generator",fan:n},e.scale.setScalar(i),e}function e_(i){const e=new Je,t=Re(rt,we(16052712),0,.85,0);t.scale.set(2.3,1.7,1.8),e.add(t);const n=Re(rt,we(13621468),0,1.8,0);n.scale.set(2.6,.22,2.1),e.add(n);const s=Re(rt,we(15029053),0,1.15,.93);s.scale.set(.22,.75,.08);const r=Re(rt,we(15029053),0,1.15,.93);r.scale.set(.75,.22,.08),e.add(s,r);const o=Re(rt,we(10473704),0,.55,.92);return o.scale.set(.7,1.1,.08),e.add(o),e.scale.setScalar(i),e}function t_(i){const e=new Je,t=Re(Gt,we(16052712),0,.7,0);t.scale.set(1.4,1.4,1.4),e.add(t);const n=Re(Ki,we(15029053),0,2.1,0);n.scale.set(1.7,1.3,1.7),e.add(n);for(let o=0;o<4;o++){const a=o/4*Math.PI*2+.4,c=Re(rt,we(16777215),Math.cos(a)*1.1,1.9,Math.sin(a)*1.1);c.scale.set(.28,.7,.06),c.rotation.y=-a+Math.PI/2,c.rotation.z=.35,e.add(c)}const s=Re(Gt,we(9268835),0,3,0);s.scale.set(.05,.8,.05);const r=Re(rt,we(16766287),.28,3.25,0);return r.scale.set(.55,.3,.05),e.add(s,r),e.scale.setScalar(i),e}function n_(i){const e=new Je,t=Re(Gt,we(13621468),0,1.1,0);t.scale.set(1,2.2,1),e.add(t);const n=Re(pn,we(10473704),0,2.4,0);n.scale.setScalar(.85),e.add(n);const s=Re(Gt,we(3622735),.35,2.9,0);s.scale.set(.16,1.1,.16),s.rotation.z=-.7,e.add(s);const r=Re(Gt,we(9280165),0,.35,0);return r.scale.set(1.35,.1,1.35),e.add(r),e.scale.setScalar(i),e}const i_={kiosk:Y0,gift:q0,garden:j0,restroom:Z0,depot:K0,ranger:J0,generator:Q0,clinic:e_,survey:t_,research:n_},s_=[10119747,6055536,4871520],r_=[1,1.6,1.9];function a_(i,e){const t=new Je,[n,s]=i.centroid,r=i.poly.map(([l,h])=>{const u=n-l,d=s-h,f=Math.hypot(u,d)||1;return[l+u/f*.45,h+d/f*.45]}),o=r_[e],a=we(s_[e]),c=e===2?we(5494783,{emissive:1933221,emissiveIntensity:1.3}):null;for(let l=0;l<r.length;l++){const[h,u]=r[l],[d,f]=r[(l+1)%r.length],g=Re(rt,a,h,o/2,u);g.scale.set(.18,o,.18),t.add(g);const _=Math.hypot(d-h,f-u),m=(h+d)/2,p=(u+f)/2,M=Math.atan2(-(f-u),d-h),x=e===0?2:3;for(let S=1;S<=x;S++){const C=Re(rt,a,m,o*S/(x+.6),p);C.scale.set(_,.09,.09),C.rotation.y=M,t.add(C)}if(c){const S=Re(rt,c,m,o+.08,p);S.scale.set(_+.1,.06,.06),S.rotation.y=M,t.add(S)}}return c&&(t.userData.anim={type:"electric",mat:c}),t}class o_{constructor(e,t){this.container=e,this.park=t,this.renderer=new kl({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.renderer.outputColorSpace=Mt,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ol,e.appendChild(this.renderer.domElement),this.scene=new t0,this.scene.background=new We(11067640),this.scene.fog=new Ka(12183289,80,190);const n=e.clientWidth/Math.max(1,e.clientHeight);this.camera=new tn(50,n,.5,400);const s=n<.9?42:34,r=t.R*.45;this.camera.position.set(0,s*.62,r+s*.85),this.controls=new G0(this.camera,this.renderer.domElement),this.controls.target.set(0,0,r),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.enablePan=!0,this.controls.screenSpacePanning=!1,this.controls.panSpeed=1.15,this.controls.touches={ONE:On.PAN,TWO:On.DOLLY_ROTATE},this.controls.mouseButtons={LEFT:En.PAN,MIDDLE:En.DOLLY,RIGHT:En.ROTATE},this.controls.minDistance=10,this.controls.maxDistance=95,this.controls.minPolarAngle=.25,this.controls.maxPolarAngle=1.35,this.raycaster=new z0,this.cellMeshes=[],this.cellContents=new Map,this.dinoViews=new Map,this.guests=[],this.spawnAcc=0,this.heatOn=!1,this.heatTimer=0,this.edgeCounts=new Map,this.entered=0,this.cellEdges=t.cells.map(o=>{const a=[];for(const c of t.edges)c.cells.includes(o.id)&&a.push(c.key);return a}),this.edgeCells=new Map(t.edges.map(o=>[o.key,o.cells])),this.sales=new Map,this.moodSum=0,this.moodCount=0,this.unmet={food:0,gift:0,comfort:0},this.buildStatic(),this.buildTerrain(),this.buildSelection(),this.resize()}buildStatic(){const e=this.park;this.scene.add(new O0(13496575,8034895,.95));const t=new B0(16774102,1.6);t.position.set(28,42,14),t.castShadow=!0,t.shadow.mapSize.set(1024,1024);const n=t.shadow.camera;n.left=n.bottom=-42,n.right=n.top=42,n.far=130,this.scene.add(t);const s=Re(Gt,we(8309599),0,-.5,0);s.scale.set(e.R+17,1,e.R+17),this.scene.add(s);const r=Re(Gt,we(6137416),0,-1.4,0);r.scale.set(e.R+19,1.2,e.R+19),this.scene.add(r);const[o,a]=e.verts[e.gateVertex],c=new Je;c.position.set(o,.2,a+1.2);for(const m of[-3.2,3.2]){const p=Re(rt,we(12159834),m,2.2,0);p.scale.set(1,4.4,1);const M=Re(pn,we(15029053),m,4.6,0);M.scale.setScalar(.7),c.add(p,M)}const l=Re(rt,we(12159834),0,4.3,0);l.scale.set(7.4,.85,.85),c.add(l);const h=document.createElement("canvas");h.width=512,h.height=160;const u=h.getContext("2d");u.fillStyle="#fdf3d8",u.beginPath(),u.roundRect(4,4,504,152,20),u.fill(),u.strokeStyle="#6b4a2b",u.lineWidth=7,u.stroke(),u.fillStyle="#6b4a2b",u.font="bold 64px system-ui, sans-serif",u.textAlign="center",u.textBaseline="middle",u.fillText("🦕 DINO TRAILS",256,84);const d=new Hl(h);d.colorSpace=Mt;const f=new Ht(new wr(6.2,1.95),new fs({map:d,transparent:!0}));f.position.set(0,5.5,.1),c.add(f);const g=f.clone();g.rotation.y=Math.PI,g.position.z=-.1,c.add(g),this.scene.add(c);const _=(m,p)=>m+Math.random()*(p-m);for(let m=0;m<30;m++){const p=m/30*Math.PI*2+_(-.1,.1),M=e.R+_(3.5,12),x=Math.sin(p)*M,S=Math.cos(p)*M;if(!(S>e.R-4&&Math.abs(x-o)<9))if(Math.random()<.72){const C=_(2.4,4.4),w=Re(Gt,we(9268835),x,C*.3,S);w.scale.set(.24,C*.6,.24);const A=Re(Math.random()<.5?Ki:pn,we(Math.random()<.5?5020243:6732650),x,C,S);A.scale.set(_(1.2,1.9),_(1.5,2.4),_(1.2,1.9)),this.scene.add(w,A)}else{const C=Re(pn,we(11051675),x,.25,S);C.scale.set(_(.5,1.2),_(.3,.7),_(.5,1.1)),this.scene.add(C)}}this.clouds=[];for(let m=0;m<6;m++){const p=new Je,M=we(16777215,{flatShading:!1});for(let x=0;x<3;x++){const S=new Ht(pn,M);S.position.set(x*1.6-1.6,Math.random()*.4,Math.random()*.8),S.scale.set(_(1.3,2.2),_(.8,1.1),_(1.1,1.6)),p.add(S)}p.position.set(_(-55,55),_(17,26),_(-45,30)),p.userData.speed=_(.4,1),this.scene.add(p),this.clouds.push(p)}}buildTerrain(){const e=this.park;for(const t of e.cells){const n=new $l;t.poly.forEach(([a,c],l)=>l?n.lineTo(a,-c):n.moveTo(a,-c));const s=new no(n,{depth:t.elev,bevelEnabled:!1});s.rotateX(-Math.PI/2);const r=we(Zi[t.terrain].color),o=new Ht(s,r);if(o.receiveShadow=!0,o.castShadow=!1,o.userData.cellId=t.id,this.scene.add(o),this.cellMeshes[t.id]=o,t.terrain==="water")for(let a=0;a<3;a++){const c=Fr(t,Math.random,.8),l=Re(Gt,we(8179578),c.x,t.elev+.03,c.z);l.scale.set(.45,.04,.45),this.scene.add(l)}}this.ribbons=new Map,this.activeEdges=new Set;for(const t of e.edges){const[n,s]=e.verts[t.a],[r,o]=e.verts[t.b],a=Re(rt,we(10799486),(n+r)/2,hs-.05,(s+o)/2);a.scale.set(t.length+.3,.12,.4),a.rotation.y=Math.atan2(-(o-s),r-n),a.castShadow=!1,this.scene.add(a),this.ribbons.set(t.key,a)}}paintRibbonBase(e){const t=this.ribbons.get(e);t&&(this.activeEdges.has(e)?(t.material.color.set(15522987),t.scale.z=.95):(t.material.color.set(10799486),t.scale.z=.4))}buildSelection(){this.selRing=new Ht(new xr(1,.13,8,32),new fs({color:16766287})),this.selRing.rotation.x=Math.PI/2,this.selRing.visible=!1,this.scene.add(this.selRing)}setSelected(e){if(!e){this.selRing.visible=!1;return}const[t,n]=e.centroid;this.selRing.position.set(t,e.elev+.15,n),this.selBase=Math.max(1.2,e.inradius*.85),this.selRing.visible=!0}syncState(e){this.state=e,this.powered=e.cells.some(s=>s.use==="generator");const t=this.park;this.activeEdges=new Set;for(const s of t.edges)s.cells.some(r=>e.cells[r].owned)&&this.activeEdges.add(s.key);if(!this.heatOn)for(const s of this.ribbons.keys())this.paintRibbonBase(s);for(const s of t.cells){const r=e.cells[s.id],o=`${r.owned}|${r.use}|${r.fence}`,a=this.cellContents.get(s.id);if((a==null?void 0:a.sig)===o)continue;a&&this.scene.remove(a.group);const c=new We(Zi[s.terrain].color);!r.owned&&s.terrain!=="water"&&c.lerp(new We(12168593),.32),this.cellMeshes[s.id].material.color=c;const l=new Je,[h,u]=s.centroid,d=Math.max(.7,Math.min(1.3,s.inradius/2.4));if(r.use==="paddock"){const f=a_(s,r.fence);f.position.y=s.elev,l.add(f),f.userData.anim&&(l.userData.anim=f.userData.anim);const g=Re(rt,we(9268835),h+s.inradius*.4,s.elev+.18,u+s.inradius*.4);g.scale.set(.9,.32,.5),l.add(g)}else if(r.use){const f=i_[r.use](d);f.position.set(h,s.elev,u),l.add(f),f.userData.anim&&(l.userData.anim=f.userData.anim)}this.scene.add(l),this.cellContents.set(s.id,{group:l,sig:o,cell:s})}for(const{group:s,cell:r}of this.cellContents.values()){const o=e.cells[r.id];if(o.use!=="paddock")continue;let a=Xn[o.fence].strength;o.fence===2&&!this.powered&&(a=3);const c=e.dinos.some(l=>l.cell===r.id&&!l.escaped&&je[l.sp].fer>a);if(c&&!s.userData.warn){const l=nl("⚠️");l.position.set(r.centroid[0],r.elev+3.2,r.centroid[1]),s.add(l),s.userData.warn=l}else!c&&s.userData.warn&&(s.remove(s.userData.warn),s.userData.warn=null)}const n=new Set;for(const s of e.dinos){n.add(s.id);let r=this.dinoViews.get(s.id);r||(r=this.createDinoView(s),this.dinoViews.set(s.id,r)),r.dino=s;const o=!!s.escaped;r.escaped!==o&&(r.escaped=o,r.speed=o?4.2:.9+Math.random()*.5,r.target=null,r.alertRing.visible=o),this.setEmote(r,o?"❗":s.hap<40?"💢":s.hap>85?"❤️":null)}for(const[s,r]of this.dinoViews)n.has(s)||(this.scene.remove(r.rig.group),this.dinoViews.delete(s))}createDinoView(e){const t=$0(e.sp),n=this.park.cells[e.cell],s=Fr(n);t.group.position.set(s.x,n.elev,s.z),t.group.rotation.y=Math.random()*Math.PI*2,t.group.traverse(o=>{o.userData.dinoId=e.id});const r=new Ht(new xr(1.6,.12,8,24),new fs({color:15029053}));return r.rotation.x=Math.PI/2,r.position.y=.15,r.visible=!1,t.group.add(r),this.scene.add(t.group),{rig:t,dino:e,escaped:!!e.escaped,speed:.9+Math.random()*.5,target:null,idle:Math.random()*2,t:Math.random()*10,moving:!1,emote:null,emoteTxt:null,alertRing:r}}setEmote(e,t){if(e.emoteTxt!==t&&(e.emoteTxt=t,e.emote&&(e.rig.group.remove(e.emote),e.emote=null),t)){const n=nl(t);n.position.set(0,e.rig.size*2.6+.8,0),e.rig.group.add(n),e.emote=n}}collectTraffic(){const e={};for(let n=0;n<this.cellEdges.length;n++){let s=0;for(const r of this.cellEdges[n])s+=this.edgeCounts.get(r)??0;s&&(e[n]=s)}const t={entered:this.entered,byCell:e,sales:Object.fromEntries(this.sales),mood:{sum:this.moodSum,count:this.moodCount,unmet:{...this.unmet}}};return this.prevCounts=new Map(this.edgeCounts),this.edgeCounts.clear(),this.entered=0,this.sales.clear(),this.moodSum=0,this.moodCount=0,this.unmet={food:0,gift:0,comfort:0},t}setHeat(e){if(this.heatOn=e,e)this.paintHeat();else for(const t of this.ribbons.keys())this.paintRibbonBase(t)}paintHeat(){const e=o=>{var a;return(this.edgeCounts.get(o)??0)+(((a=this.prevCounts)==null?void 0:a.get(o))??0)};let t=4;for(const o of this.ribbons.keys())t=Math.max(t,e(o));const n=new We(15262930),s=new We(16097597),r=new We(15022127);for(const[o,a]of this.ribbons){if(!this.activeEdges.has(o)){this.paintRibbonBase(o);continue}const c=Math.min(1,e(o)/t),l=c<.5?n.clone().lerp(s,c*2):s.clone().lerp(r,(c-.5)*2);a.material.color.copy(l)}}spawnGuest(){const e=this.park,t=new Je,n=[15895476,9161202,15913867,11067552,13084912,15902091],s=Re(new to(.22,.35,4,8),we(n[Math.floor(Math.random()*n.length)]),0,.5,0),r=[16109737,14262374,9262372,16767916][Math.floor(Math.random()*4)],o=Re(pn,we(r),0,.98,0);if(o.scale.setScalar(.2),t.add(s,o),Math.random()<.3){const h=Re(Ki,we(15029053),0,1.14,0);h.scale.set(.16,.14,.16),t.add(h)}const[a,c]=e.verts[e.gateVertex];t.position.set(a,hs,c),this.scene.add(t);const l={group:t,at:e.gateVertex,path:[],seg:0,mode:"wander",dwell:0,t:Math.random()*5,hunger:.25+Math.random()*.3,comfort:Math.random()*.35,wantGift:Math.random()<.65,sat:.72+Math.random()*.1};this.pickGuestTarget(l),this.guests.push(l),this.entered+=1}recordExit(e,t){let n=e.sat;t&&(n*=.35),e.hunger>.55&&(this.unmet.food+=1),e.wantGift&&(this.unmet.gift+=1),e.comfort>.5&&(this.unmet.comfort+=1),this.moodSum+=Math.max(0,Math.min(1,n)),this.moodCount+=1}shopAtEdge(e,t){var s;const n=this.state;if(n)for(const r of this.edgeCells.get(t)??[]){const o=(s=n.cells[r])==null?void 0:s.use;o==="kiosk"&&e.hunger>.55?(e.hunger=0,e.sat=Math.min(1,e.sat+.06),this.sales.set(r,(this.sales.get(r)??0)+1)):o==="gift"&&e.wantGift?(e.wantGift=!1,e.sat=Math.min(1,e.sat+.06),this.sales.set(r,(this.sales.get(r)??0)+1)):o==="restroom"&&e.comfort>.5&&(e.comfort=0,e.sat=Math.min(1,e.sat+.05))}}attractionCells(){const e=this.state,t=[];for(const n of this.park.cells){const s=e.cells[n.id];if(s.use==="paddock"){const r=this.state.dinos.filter(o=>o.cell===n.id&&!o.escaped).reduce((o,a)=>o+je[a.sp].pop,0);r&&t.push({cell:n,draw:r})}else(s.use==="gift"||s.use==="kiosk")&&t.push({cell:n,draw:.8})}return t}pickGuestTarget(e){const t=this.park,n=this.attractionCells();let s;if(!n.length)s=Math.floor(Math.random()*t.verts.length);else{const o=n.reduce((h,u)=>h+u.draw,0);let a=Math.random()*o,c=n[0];for(const h of n)if(a-=h.draw,a<=0){c=h;break}const l=c.cell.vertIds;s=l[Math.floor(Math.random()*l.length)]}const r=Eo(t,e.at,s);r&&r.length>1?(e.path=r,e.seg=0,e.mode="walk"):(e.mode="dwell",e.dwell=1+Math.random()*2)}updateGuests(e,t){const n=this.park,s=this.state,r=s&&s.dinos.some(o=>o.escaped);for(this.spawnAcc+=e*t;this.spawnAcc>=1&&this.guests.length<48;)this.spawnAcc-=1,this.spawnGuest();for(let o=this.guests.length-1;o>=0;o--){const a=this.guests[o];a.hunger=Math.min(1,a.hunger+e*.02),a.comfort=Math.min(1,a.comfort+e*.016),a.hunger>.85&&(a.sat=Math.max(0,a.sat-e*.015)),a.comfort>.85&&(a.sat=Math.max(0,a.sat-e*.015));const c=r?7:3.6;if(a.mode==="dwell"){if(a.dwell-=e,a.t+=e,a.group.position.y=hs+Math.abs(Math.sin(a.t*3))*.03,r||a.dwell<=0)if(r||Math.random()<.35){const g=Eo(n,a.at,n.gateVertex);g&&g.length>1?(a.path=g,a.seg=0,a.mode="leave"):a.mode="leave-now"}else this.pickGuestTarget(a);continue}if(a.mode==="leave-now"){this.recordExit(a,r),this.scene.remove(a.group),this.guests.splice(o,1);continue}n.verts[a.path[a.seg]];const l=n.verts[a.path[a.seg+1]],h=l[0]-a.group.position.x,u=l[1]-a.group.position.z,d=Math.hypot(h,u);if(a.t+=e,a.group.position.y=hs+Math.abs(Math.sin(a.t*8))*.07,d<.12){const g=a.path[a.seg],_=a.path[a.seg+1],m=g<_?`${g}-${_}`:`${_}-${g}`;this.edgeCounts.set(m,(this.edgeCounts.get(m)??0)+1),this.shopAtEdge(a,m),a.at=_,a.seg+=1,a.seg>=a.path.length-1&&(a.mode==="leave"?(this.recordExit(a,r),this.scene.remove(a.group),this.guests.splice(o,1)):(a.mode="dwell",a.dwell=1+Math.random()*1.5,a.sat=Math.min(1,a.sat+.05)));continue}const f=Math.min(d,c*e);a.group.position.x+=h/d*f,a.group.position.z+=u/d*f,a.group.rotation.y=Math.atan2(h,u)}}update(e,t,n){this.controls.update();const s=this.controls.target,r=this.park.R+5;s.x=Math.max(-r,Math.min(r,s.x)),s.z=Math.max(-r,Math.min(r+6,s.z)),s.y=0,this.state&&(this.updateDinos(e,t),this.updateGuests(e,n));for(const o of this.clouds)o.position.x+=o.userData.speed*e,o.position.x>65&&(o.position.x=-65);for(const{group:o}of this.cellContents.values()){const a=o.userData.anim;(a==null?void 0:a.type)==="electric"?a.mat.emissiveIntensity=this.powered?1.1+Math.sin(t*10)*.5:.05:(a==null?void 0:a.type)==="generator"?a.fan.rotation.z+=e*6:(a==null?void 0:a.type)==="beacon"&&(a.beacon.material.emissiveIntensity=1+Math.sin(t*4)*.9),o.userData.warn&&(o.userData.warn.position.y+=Math.sin(t*2.5)*.004)}if(this.heatOn&&(this.heatTimer+=e,this.heatTimer>.5&&(this.heatTimer=0,this.paintHeat())),this.selRing.visible){const o=(this.selBase??1.5)*(1+Math.sin(t*5)*.05);this.selRing.scale.set(o,o,1)}this.renderer.render(this.scene,this.camera)}updateDinos(e,t){const n=this.park;for(const s of this.dinoViews.values()){const r=s.rig.group,o=n.cells[s.dino.cell];if(s.rig.fly){this.updateFlyer(s,e,t,o);continue}if(!s.target||s.idle<0){if(s.escaped){const f=Math.random()*Math.PI*2,g=Math.sqrt(Math.random())*(n.R-3);s.target={x:Math.sin(f)*g,z:Math.cos(f)*g}}else s.target=Fr(o,Math.random,.9+s.rig.size*.4);s.idle=1+Math.random()*2.5}const a=s.target.x-r.position.x,c=s.target.z-r.position.z,l=Math.hypot(a,c);if(s.moving=l>.35,s.moving){const f=Math.min(l,s.speed*e);r.position.x+=a/l*f,r.position.z+=c/l*f;let _=Math.atan2(a,c)-r.rotation.y;for(;_>Math.PI;)_-=Math.PI*2;for(;_<-Math.PI;)_+=Math.PI*2;r.rotation.y+=_*Math.min(1,e*5)}else s.idle-=e;r.position.y=s.escaped?hs-.1:o.elev,s.t+=e*(s.moving?s.escaped?2.2:1.4:.6);const h=s.rig,u=s.moving?.55:0;for(const f of h.legs)f.pivot.rotation.x=Math.sin(s.t*7+f.phase)*u;const d=h.bodyPivot.userData.baseY??(h.bodyPivot.userData.baseY=h.bodyPivot.position.y);if(h.bodyPivot.position.y=d+(s.moving?Math.abs(Math.sin(s.t*7))*.09*h.size:Math.sin(s.t*2)*.02*h.size),h.tail.forEach((f,g)=>{f.rotation.y=Math.sin(s.t*2.5+g*.9)*.16}),h.neck?h.neck.rotation.x=.55+Math.sin(s.t*1.2)*.08:h.head.rotation.x=Math.sin(s.t*1.7)*.08,h.jaw&&(h.jaw.rotation.x=s.escaped?.35+Math.sin(s.t*6)*.25:.05),s.emote&&(s.emote.position.y=h.size*2.6+.8+Math.sin(t*3+s.t)*.12),s.alertRing.visible){const f=1+Math.sin(t*6)*.25;s.alertRing.scale.set(f,f,1)}}}updateFlyer(e,t,n,s){const r=e.rig.group;e.flyAngle=(e.flyAngle??Math.random()*Math.PI*2)+t*(e.escaped?1.1:.55);const o=e.flyAngle,[a,c]=e.escaped?[0,0]:s.centroid,l=e.escaped?this.park.R*.5:Math.max(1.2,s.inradius*.55),h=(e.escaped?7.5:4.2)+Math.sin(n*1.3+e.t)*.5;r.position.set(a+Math.cos(o)*l,s.elev+h,c+Math.sin(o)*l),r.rotation.y=Math.atan2(-Math.sin(o),Math.cos(o))+Math.PI/2,r.rotation.z=e.escaped?.25:.15,e.t+=t;const u=Math.sin(e.t*9)*.45;if(e.rig.wings[0].rotation.z=u,e.rig.wings[1].rotation.z=-u,e.rig.tail.forEach((d,f)=>{d.rotation.y=Math.sin(e.t*2.5+f)*.1}),e.emote&&(e.emote.position.y=1.6),e.alertRing.visible){const d=1+Math.sin(n*6)*.25;e.alertRing.scale.set(d,d,1)}}pick(e,t){const n=this.renderer.domElement.getBoundingClientRect(),s=new ie((e-n.left)/n.width*2-1,-((t-n.top)/n.height)*2+1);this.raycaster.setFromCamera(s,this.camera);const r=[...this.cellMeshes];for(const a of this.dinoViews.values())r.push(a.rig.group);const o=this.raycaster.intersectObjects(r,!0);for(const a of o){let c=a.object;for(;c;){if(c.userData.dinoId!=null)return{type:"dino",id:c.userData.dinoId};if(c.userData.cellId!=null)return{type:"cell",id:c.userData.cellId};c=c.parent}}return null}resize(){const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}}const so="dino-trails-v2";function Ql(i,e){const t={v:1,seed:i,day:1,money:nt.startMoney,fame:nt.startFame,guests:0,visitorRate:8,ticket:nt.ticket,disaster:null,lastDisaster:0,guestMood:70,unmet:null,cells:e.cells.map(()=>({owned:!1,use:null,fence:0})),dinos:[],market:{offers:[],nextRefresh:0},cellTraffic:{},ledger:[],history:[],flags:{},nextId:1,over:!1},n=e.verts[e.gateVertex],s=e.cells.filter(a=>a.terrain!=="water").sort((a,c)=>Math.hypot(a.centroid[0]-n[0],a.centroid[1]-n[1])-Math.hypot(c.centroid[0]-n[0],c.centroid[1]-n[1])),r=s.find(a=>a.inradius>=je.parasaur.minR),o=s.find(a=>a!==r);return t.cells[r.id]={owned:!0,use:"paddock",fence:0},t.cells[o.id]={owned:!0,use:"kiosk",fence:0},t.dinos.push({id:t.nextId++,sp:"parasaur",cell:r.id,hap:70,escaped:!1,escDays:0}),ih(t,Math.random),t.market.nextRefresh=nt.marketRefreshDays,t.ledger.push({d:1,label:"Founding grant (one parasaur included)",amt:nt.startMoney,cat:"land"}),t.history.push({d:0,inc:0,exp:0,bal:t.money,vis:0,rep:t.fame}),t}function Ts(i){try{localStorage.setItem(so,JSON.stringify(i))}catch{}}function eh(){try{const i=JSON.parse(localStorage.getItem(so)??"null");return(i==null?void 0:i.v)!==1||!Array.isArray(i.cells)?null:(i.ticket??(i.ticket=nt.ticket),i.disaster??(i.disaster=null),i.lastDisaster??(i.lastDisaster=0),i.guestMood??(i.guestMood=70),i.unmet??(i.unmet=null),i)}catch{return null}}function th(){try{localStorage.removeItem(so)}catch{}}function zt(i,e,t,n){i.money+=t,i.ledger.push({d:i.day,label:e,amt:Math.round(t),cat:n}),i.ledger.length>400&&i.ledger.splice(0,i.ledger.length-400)}function Yn(i,e){return i.dinos.filter(t=>t.cell===e)}function ro(i){return i.dinos.filter(e=>e.escaped)}function It(i,e){return i.cells.filter(t=>t.use===e).length}function ao(i,e){const t=je[e];return i.inradius<t.minR?0:t.social==="solo"?1:Math.max(1,Math.min(3,Math.floor(i.inradius/t.minR*1.2)))}function Xi(i,e,t){return e.cells.filter(n=>{const s=i.cells[n.id];if(!s.owned||s.use!=="paddock")return!1;const r=Yn(i,n.id),o=ao(n,t);return!o||r.length>=o?!1:!r.length||r[0].sp===t})}function oo(i,e){return W0(e,i.cellTraffic[e.id]??0)}function nh(i){let e=0;for(const t of i.dinos)t.escaped||(e+=je[t.sp].pop*(t.hap<40?.6:1));return e+=It(i,"garden")*.6+It(i,"gift")*.4,e}function ih(i,e){const t=Object.entries(je).filter(([,s])=>!s.always),n=t.reduce((s,[,r])=>s+r.weight,0);i.market.offers=[];for(let s=0;s<nt.marketSlots;s++){let r=e()*n,o=t[0][0];for(const[c,l]of t)if(r-=l.weight,r<=0){o=c;break}const a=je[o];i.market.offers.push({sp:o,price:Math.round(a.cost*(.85+e()*.3)/10)*10})}}function sh(i,e,t){const n=i.cells[t.id];if(n.owned)return{ok:!1,msg:"Already yours."};if(t.terrain==="water")return{ok:!1,msg:"The pond belongs to the ducks."};const s=oo(i,t);return i.money<s?{ok:!1,msg:`Need ${ft(s)} for this land.`}:(n.owned=!0,zt(i,`Bought ${Zi[t.terrain].name.toLowerCase()} land`,-s,"land"),{ok:!0,msg:"Territory claimed!"})}function rh(i,e,t){const n=$n[t],s=i.cells[e.id];return!n||!s.owned||s.use?{ok:!1,msg:"This cell is taken."}:i.money<n.cost?{ok:!1,msg:`Need ${ft(n.cost)}.`}:(s.use=t,s.fence=0,zt(i,`Built ${n.name}`,-n.cost,"construction"),{ok:!0,msg:`${n.icon} ${n.name} ready!`})}function Ba(i,e){const t=i.cells[e.id];if(!t.use)return{ok:!1};if(t.use==="paddock"&&Yn(i,e.id).length)return{ok:!1,msg:"Sell the dinosaurs first."};const n=Math.round($n[t.use].cost*.3);return zt(i,`Demolished ${$n[t.use].name}`,n,"construction"),t.use=null,t.fence=0,{ok:!0,msg:`Cleared (+${ft(n)} salvage).`}}function ah(i,e){const t=i.cells[e.id];if(t.use!=="paddock")return{ok:!1};const n=Xn[t.fence+1];return n?i.money<n.cost?{ok:!1,msg:`Need ${ft(n.cost)}.`}:(t.fence+=1,zt(i,`Fence upgrade: ${n.name}`,-n.cost,"construction"),{ok:!0,msg:`${n.name} fence installed.`}):{ok:!1,msg:"Fence is already maxed."}}function za(i,e,t,n){const s=i.market.offers[t];if(!s)return{ok:!1,msg:"That offer is gone."};const r=je[s.sp];return e.cells[n],Xi(i,e,s.sp).some(a=>a.id===n)?i.money<s.price?{ok:!1,msg:`Need ${ft(s.price)}.`}:(i.dinos.push({id:i.nextId++,sp:s.sp,cell:n,hap:65,escaped:!1,escDays:0}),i.market.offers.splice(t,1),zt(i,`Bought ${r.name} at market`,-s.price,"dinos"),{ok:!0,msg:r.fer>Xn[i.cells[n].fence].strength?`${r.icon} ${r.name} delivered… upgrade that fence.`:`${r.icon} ${r.name} settled in!`}):{ok:!1,msg:"That paddock cannot take this dinosaur."}}function Ha(i,e,t,n){const s=je[t];return s!=null&&s.always?Xi(i,e,t).some(r=>r.id===n)?i.money<s.cost?{ok:!1,msg:`Need ${ft(s.cost)}.`}:(i.dinos.push({id:i.nextId++,sp:t,cell:n,hap:65,escaped:!1,escDays:0}),zt(i,`Bought ${s.name} from the ranch`,-s.cost,"dinos"),{ok:!0,msg:`${s.icon} ${s.name} settled in!`}):{ok:!1,msg:"That paddock cannot take this dinosaur."}:{ok:!1}}function oh(i,e){const t=je[e.sp],n=Math.round(t.cost*.4);return i.dinos=i.dinos.filter(s=>s.id!==e.id),zt(i,`Sold ${t.name} to a rival park`,n,"dinos"),{ok:!0,msg:`${t.name} sold for ${ft(n)}.`}}function ch(i,e){i.ticket=Math.max(nt.ticketMin,Math.min(nt.ticketMax,Math.round(e)))}function yr(i){return 7+i.fame/9}function lh(i,e){return e.sick?i.money<nt.treatCost?{ok:!1,msg:`The vet call-out is ${ft(nt.treatCost)}.`}:(e.sick=!1,e.sickDays=0,e.hap=Math.min(100,e.hap+15),zt(i,`Vet call-out for ${je[e.sp].name}`,-250,"incidents"),{ok:!0,msg:`${je[e.sp].name} is back on its feet.`}):{ok:!1}}function co(i){const e=i.dinos.reduce((o,a)=>o+je[a.sp].food,0),t=nt.baseFeedCapacity+It(i,"depot")*60,n=i.dinos.filter(o=>je[o.sp].fer>=3).length,s=It(i,"ranger")*nt.rangerCoverage,r=It(i,"generator")>0;return{feedDemand:e,feedCapacity:t,dangerous:n,covered:s,powered:r}}function Sr(i,e){let t=Xn[e.fence].strength;return e.fence===2&&!It(i,"generator")&&(t=3),t}function lo(i,e){const t=150+je[e.sp].fer*100;return It(i,"ranger")?Math.round(t*.6):t}function hh(i,e){if(!e.escaped)return{ok:!1};const t=lo(i,e);return i.money<t?{ok:!1,msg:`The rangers want ${ft(t)} up front.`}:(e.escaped=!1,e.escDays=0,e.hap=Math.min(100,e.hap+25),zt(i,`Recaptured ${je[e.sp].name}`,-t,"incidents"),{ok:!0,msg:`${je[e.sp].icon} Back behind the fence.`})}function uh(i,e,t){var C,w,A,k;const n=[];i.day+=1,i.guests=t.entered,i.cellTraffic=t.byCell;const s=co(i);let r=1;const o=((C=i.disaster)==null?void 0:C.key)==="outage"&&!s.powered;i.disaster&&(i.disaster.key==="outage"&&(r=s.powered?1:.8),i.disaster.key==="storm"&&(r=.4),i.disaster.key==="heatwave"&&(r=.85),i.disaster.days-=1,i.disaster.days<=0&&(n.push({icon:"🌤️",text:`${ni[i.disaster.key].name} is over.`,tone:"good"}),i.disaster=null));let a=0;const c=t.entered*i.ticket;c&&zt(i,`Tickets — ${t.entered} guests at ${ft(i.ticket)}`,c,"tickets"),a+=c;for(const v of e.cells){const y=i.cells[v.id];if(y.use!=="kiosk"&&y.use!=="gift")continue;const L=((w=t.sales)==null?void 0:w[v.id])??0;let N=L*V0[y.use];o&&(N=Math.round(N*.5)),N&&(zt(i,`${$n[y.use].name} — ${L} sale${L>1?"s":""}${o?" (by candlelight)":""}`,N,y.use==="kiosk"?"food":"gifts"),a+=N)}(A=t.mood)!=null&&A.count&&(i.guestMood=Math.round(t.mood.sum/t.mood.count*100),i.unmet={food:t.mood.unmet.food/t.mood.count,gift:t.mood.unmet.gift/t.mood.count,comfort:t.mood.unmet.comfort/t.mood.count});let l=0;const h=s.feedDemand>s.feedCapacity;if(s.feedDemand){const v=Math.min(s.feedDemand,s.feedCapacity),y=s.feedDemand-v,L=Math.round(v+y*nt.overflowFeedMult);zt(i,y?`Dino feed (${y} imported at a premium)`:`Dino feed (${i.dinos.length} dinos)`,-L,"upkeep"),l+=L,h&&!i.flags.hungryWarned&&(i.flags.hungryWarned=!0,n.push({icon:"🌾",text:"Feed demand exceeds depot capacity — imports cost extra and dinos grumble.",tone:"bad"})),h||(i.flags.hungryWarned=!1)}const u=i.cells.reduce((v,y)=>v+(y.use?$n[y.use].upkeep:0),0);u&&(zt(i,"Upkeep",-u,"upkeep"),l+=u),zt(i,"Staff wages",-20,"staff"),l+=nt.staffBase;const d=((k=i.disaster)==null?void 0:k.key)==="heatwave";for(const v of i.dinos){const y=je[v.sp],L=e.cells[v.cell],N=Yn(i,v.cell);let G=4-y.irr*.8;L.inradius>y.minR*1.5&&(G+=2),y.social==="herd"?G+=N.length>=2?3:-2:G+=N.length===1?2:-4;let P=!1;for(const F of L.neighbors)i.cells[F].use==="garden"&&(G+=2),e.cells[F].terrain==="water"&&(P=!0,G+=y.loves==="water"?4:1.5);y.loves==="water"&&!P&&(G-=3),L.terrain==="forest"&&(G+=1),d&&!P&&(G-=6),h&&(G-=2),v.sick&&(G-=4),G+=Math.random()*4-2,v.hap=Math.max(0,Math.min(100,v.hap+Math.min(8,G)))}const f=It(i,"clinic");for(const v of i.dinos)v.sick&&(f?(v.sick=!1,v.sickDays=0,n.push({icon:"🩺",text:`The clinic patched up the ${je[v.sp].name}.`,tone:"good"})):(v.sickDays=(v.sickDays??0)+1,v.sickDays>=4&&(v.sick=!1,v.sickDays=0)));const g=It(i,"ranger")>0,_=s.dangerous===0?1:s.covered>=s.dangerous?.5:1.5-Math.min(1,s.covered/s.dangerous);for(const v of i.dinos){if(v.escaped){v.escDays+=1,i.fame=Math.max(0,i.fame-2),g&&v.escDays>=2&&(v.escaped=!1,v.escDays=0,zt(i,`Rangers recaptured ${je[v.sp].name}`,-100,"incidents"),n.push({icon:"🎯",text:`Rangers wrangled the ${je[v.sp].name} back home.`,tone:"good"}));continue}const y=je[v.sp],L=y.fer-Sr(i,i.cells[v.cell]);if(L<=0)continue;let N=.02*L;v.hap<40&&(N+=(40-v.hap)/40*.1*L),y.fer>=3&&(N*=_),Math.random()<Math.min(.35,N)&&(v.escaped=!0,v.escDays=0,i.fame=Math.max(0,i.fame-8),n.push({icon:"🚨",text:`${y.icon} A ${y.name} broke out onto the trails! Tap it.`,tone:"bad"}))}if(i.day>6){for(const v of i.dinos)!v.sick&&!v.escaped&&Math.random()<.012&&(v.sick=!0,v.sickDays=0,n.push({icon:"🤒",text:`The ${je[v.sp].name} looks queasy${f?" — the clinic is on it.":". Treat it or wait it out."}`,tone:"bad"}));for(const v of e.cells){const y=i.cells[v.id];if(y.use!=="paddock"||y.fence===0)continue;const L=Yn(i,v.id);if(!L.length)continue;const N=Math.max(...L.map(G=>je[G.sp].fer));Math.random()<.008*N&&(y.fence-=1,n.push({icon:"🔨",text:`Fence damage in a ${je[L[0].sp].name} paddock — it dropped to ${Xn[y.fence].name}!`,tone:"bad"}))}}const m=new Set(i.dinos.map(v=>v.sp)).size,p=i.dinos.length?i.dinos.reduce((v,y)=>v+y.hap,0)/i.dinos.length:60;let M=25+m*5+It(i,"garden")*2.5+(p-60)*.25+(i.guestMood-65)*.2;M=Math.max(5,Math.min(95,M)),i.fame=Math.max(0,Math.min(100,i.fame+(M-i.fame)*.12));const x=2/(1+Math.exp((i.ticket-yr(i))/3.5));let S=(5+Math.pow(nh(i),.8)*2.4)*(.3+i.fame/100*1.3);if(S*=x*r,ro(i).length&&(S*=.35),i.visitorRate=Math.max(2,Math.min(80,Math.round(S*(.9+Math.random()*.2)))),!i.disaster&&i.day>10&&i.day-i.lastDisaster>8&&Math.random()<.07){const v=Object.keys(ni),y=v[Math.floor(Math.random()*v.length)];if(i.disaster={key:y,days:ni[y].days},i.lastDisaster=i.day,y==="storm"){let L=0;for(const N of i.cells)N.use==="garden"&&Math.random()<.25&&(N.use=null,L+=1);i.fame=Math.max(0,i.fame-3),n.push({icon:"⛈️",text:L?`Thunderstorm! ${L} garden${L>1?"s":""} blown to bits.`:"Thunderstorm! Guests are staying home.",tone:"bad"})}else y==="outage"&&s.powered?n.push({icon:"🔌",text:"City power failed — your generator kicked in!",tone:"good"}):n.push({icon:ni[y].icon,text:`${ni[y].name}! ${ni[y].desc}`,tone:"bad"})}if(i.market.nextRefresh-=1,i.market.nextRefresh<=0){ih(i,Math.random),i.market.nextRefresh=nt.marketRefreshDays;const v=i.market.offers.find(y=>je[y.sp].weight<=.07);n.push(v?{icon:"✨",text:`RARE at the market: ${je[v.sp].name}! ${nt.marketRefreshDays} days only.`,tone:"celebrate"}:{icon:"🛒",text:"The dino market has fresh stock.",tone:"info"})}i.history.push({d:i.day,inc:Math.round(a),exp:Math.round(l),bal:Math.round(i.money),vis:t.entered,rep:Math.round(i.fame)}),i.history.length>120&&i.history.splice(0,i.history.length-120);for(const[v,y,L,N]of[["m10k",i.money>=1e4,"💰","Milestone: $10,000 banked!"],["m30k",i.money>=3e4,"🏦","Milestone: $30,000! Land barons take notice."],["five",m>=5,"🏆","Five species! Your trails are famous."]])y&&!i.flags[v]&&(i.flags[v]=!0,n.push({icon:L,text:N,tone:"good"}));return i.money<nt.bankruptcyAt&&(i.over=!0,n.push({icon:"💀",text:"The bank forecloses the park…",tone:"bad"})),Ts(i),n}const c_=Object.freeze(Object.defineProperty({__proto__:null,attractionScore:nh,build:rh,buyCell:sh,buyCommon:Ha,buyOffer:za,capacityFor:ao,countUse:It,dayTick:uh,demolish:Ba,dinosIn:Yn,eligibleCells:Xi,escapees:ro,fenceStrength:Sr,load:eh,newGame:Ql,priceOf:oo,recapture:hh,recaptureCost:lo,save:Ts,sellDino:oh,setTicket:ch,sweetTicket:yr,systems:co,treatDino:lh,upgradeFence:ah,wipeSave:th},Symbol.toStringTag,{value:"Module"})),sn={blue:"#3987e5",orange:"#d95926",ink:"#e8ecf4",muted:"#8d97ab",grid:"rgba(255,255,255,0.08)",baseline:"rgba(255,255,255,0.22)"};function dh(i){const e=Math.min(devicePixelRatio||1,2),t=i.clientWidth||300,n=i.clientHeight||140;i.width=t*e,i.height=n*e;const s=i.getContext("2d");return s.setTransform(e,0,0,e,0,0),s.clearRect(0,0,t,n),s.font="11px system-ui, sans-serif",{ctx:s,w:t,h:n}}function fh(i,e){i===e&&(i-=1,e+=1);const t=e-i,n=Math.pow(10,Math.floor(Math.log10(t/3))),s=t/3/n>5?5:t/3/n>2?2:1,r=n*s;return{lo:Math.floor(i/r)*r,hi:Math.ceil(e/r)*r,step:r}}const it={l:44,r:10,t:10,b:20};function l_(i,e,{color:t=sn.blue,fmt:n=zn}={}){const{ctx:s,w:r,h:o}=dh(i);if(!e.length)return()=>null;const a=e.map(_=>_.v),{lo:c,hi:l,step:h}=fh(Math.min(0,...a),Math.max(...a)),u=_=>it.l+_/Math.max(1,e.length-1)*(r-it.l-it.r),d=_=>it.t+(1-(_-c)/(l-c))*(o-it.t-it.b);s.fillStyle=sn.muted,s.strokeStyle=sn.grid,s.lineWidth=1;for(let _=c;_<=l+1e-9;_+=h){const m=d(_);s.beginPath(),s.moveTo(it.l,m),s.lineTo(r-it.r,m),s.stroke(),s.textAlign="right",s.textBaseline="middle",s.fillText(n(_),it.l-6,m)}c<0&&(s.strokeStyle=sn.baseline,s.beginPath(),s.moveTo(it.l,d(0)),s.lineTo(r-it.r,d(0)),s.stroke()),s.textAlign="center",s.textBaseline="top";const f=Math.ceil(e.length/5);e.forEach((_,m)=>{m%f===0&&s.fillText(`D${_.d}`,u(m),o-it.b+6)}),s.strokeStyle=t,s.lineWidth=2,s.lineJoin=s.lineCap="round",s.beginPath(),e.forEach((_,m)=>m?s.lineTo(u(m),d(_.v)):s.moveTo(u(m),d(_.v))),s.stroke();const g=e[e.length-1];return s.fillStyle=t,s.beginPath(),s.arc(u(e.length-1),d(g.v),3.5,0,Math.PI*2),s.fill(),s.fillStyle=sn.ink,s.textAlign="right",s.textBaseline="bottom",s.fillText(n(g.v),r-it.r,d(g.v)-6),_=>{const m=Math.round((_-it.l)/(r-it.l-it.r)*(e.length-1));return m<0||m>=e.length?null:{x:u(m),y:d(e[m].v),label:`Day ${e[m].d} · ${n(e[m].v)}`}}}function h_(i,e){const{ctx:t,w:n,h:s}=dh(i);if(!e.length)return()=>null;const r=Math.max(1,...e.flatMap(f=>[f.inc,f.exp])),{lo:o,hi:a,step:c}=fh(0,r),l=f=>it.t+(1-(f-o)/(a-o))*(s-it.t-it.b);t.fillStyle=sn.muted,t.strokeStyle=sn.grid;for(let f=o;f<=a+1e-9;f+=c){const g=l(f);t.beginPath(),t.moveTo(it.l,g),t.lineTo(n-it.r,g),t.stroke(),t.textAlign="right",t.textBaseline="middle",t.fillText(zn(f),it.l-6,g)}const h=(n-it.l-it.r)/e.length,u=Math.min(14,Math.max(3,h/2-3)),d=[];return e.forEach((f,g)=>{const _=it.l+h*g+h/2;for(const[m,p,M]of[[f.inc,sn.blue,-u/2-1],[f.exp,sn.orange,u/2+1]]){const x=l(m),S=l(o)-x;t.fillStyle=p,t.beginPath(),t.roundRect(_+M-u/2,x,u,Math.max(1,S),[4,4,0,0]),t.fill()}d.push({cx:_,d:f.d,inc:f.inc,exp:f.exp}),(e.length<=8||g%2===0)&&(t.fillStyle=sn.muted,t.textAlign="center",t.textBaseline="top",t.fillText(`D${f.d}`,_,s-it.b+6))}),f=>{let g=null;for(const _ of d)(!g||Math.abs(_.cx-f)<Math.abs(g.cx-f))&&(g=_);return!g||Math.abs(g.cx-f)>h?null:{x:g.cx,y:it.t,label:`Day ${g.d} · in ${zn(g.inc)} / out ${zn(g.exp)}`}}}function il(i,e,t){const n=r=>{var u,d;const o=i.getBoundingClientRect(),a=(r.touches?r.touches[0].clientX:r.clientX)-o.left,c=(u=t.fn)==null?void 0:u.call(t,a);if(!c){e.hidden=!0;return}e.textContent=c.label,e.hidden=!1;const l=((d=e.offsetParent)==null?void 0:d.getBoundingClientRect())??o;let h=o.left-l.left+c.x-e.offsetWidth/2;h=Math.max(4,Math.min(l.width-e.offsetWidth-4,h)),e.style.left=`${h}px`,e.style.top=`${o.top-l.top-26}px`},s=()=>{e.hidden=!0};i.addEventListener("pointermove",n),i.addEventListener("pointerdown",n),i.addEventListener("pointerleave",s)}const at=i=>document.querySelector(i),u_={good:"✅",bad:"🚨",info:"💬",celebrate:"✨"};class d_{constructor(e,t){this.h=e,this.park=t,this.sheet=null,this.buildHUD(),this.buildNav(),at("#sheet-close").addEventListener("click",()=>this.closeSheet()),at("#sheet-backdrop").addEventListener("click",()=>this.closeSheet()),at("#banner").addEventListener("click",()=>this.openSheet({type:"herd"})),this.heatOn=!1,at("#heat-toggle").addEventListener("click",()=>{this.heatOn=!this.heatOn,at("#heat-toggle").classList.toggle("on",this.heatOn),this.h.setHeat(this.heatOn),this.toast("🔥",this.heatOn?"Footfall heatmap on — red trails are money.":"Heatmap off.","info")}),this.refresh()}get s(){return this.h.s}cellName(e){return`${Zi[e.terrain].name} #${e.id}`}roominess(e){return e.inradius>=3?"vast":e.inradius>=2.2?"roomy":e.inradius>=1.6?"modest":"snug"}buildHUD(){at("#hud").innerHTML=`
      <div class="chip chip-money" id="hud-money"></div>
      <div class="chip" id="hud-day"></div>
      <div class="chip" id="hud-vis" title="Guests yesterday"></div>
      <div class="chip chip-rep" id="hud-rep" title="Fame"></div>
      <button class="chip chip-btn" id="hud-speed"></button>
    `,at("#hud-speed").addEventListener("click",()=>{this.h.speed(),this.updateHUD()}),at("#hud-rep").addEventListener("click",()=>this.openSheet({type:"books"}))}buildNav(){at("#navbar").innerHTML=`
      <button data-nav="market"><span>🛒</span>Market</button>
      <button data-nav="herd"><span>🦕</span>Herd</button>
      <button data-nav="books"><span>📊</span>Books</button>
      <button data-nav="help"><span>❔</span>Help</button>
    `;for(const e of document.querySelectorAll("#navbar button"))e.addEventListener("click",()=>{var n;const t=e.dataset.nav;((n=this.sheet)==null?void 0:n.type)===t?this.closeSheet():this.openSheet({type:t})})}updateHUD(e=this.lastProgress??0){this.lastProgress=e;const t=this.s,n=at("#hud-money");n.textContent=zn(t.money),n.classList.toggle("debt",t.money<0);const s=e<.25?"🌅":e<.6?"☀️":e<.85?"🌇":"🌙";at("#hud-day").textContent=`${s} Day ${t.day}`,at("#hud-vis").textContent=`👥 ${t.guests}`;const r=Math.round(t.fame/20);at("#hud-rep").textContent="★".repeat(r)+"☆".repeat(5-r),at("#hud-speed").textContent=this.h.speedLabel()}refresh(){this.updateHUD(),this.updateBanner(),this.sheet&&this.renderSheet(),this.updateOverlay()}updateBanner(){const e=this.s,t=at("#banner"),n=ro(e),s=e.market.offers.find(r=>je[r.sp].weight<=.07);if(n.length){const r=je[n[0].sp];t.className="bad",t.innerHTML=`🚨 <b>${n.length>1?`${n.length} dinosaurs are`:`A ${r.name} is`} loose on the trails!</b> Tap it`,t.hidden=!1}else if(e.disaster){const r=ni[e.disaster.key];t.className="warn",t.innerHTML=`${r.icon} <b>${r.name}</b> — ${e.disaster.days} day${e.disaster.days>1?"s":""} left`,t.hidden=!1}else s?(t.className="good",t.innerHTML=`✨ <b>${je[s.sp].name} at the market</b> — ${e.market.nextRefresh} day${e.market.nextRefresh>1?"s":""} left`,t.hidden=!1):t.hidden=!0}toast(e,t,n="info"){const s=document.createElement("div");s.className=`toast ${n}`,s.innerHTML=`<span>${e}</span>${t}`;const r=at("#toasts");for(r.appendChild(s);r.children.length>3;)r.firstChild.remove();setTimeout(()=>{s.classList.add("bye"),setTimeout(()=>s.remove(),400)},3800)}handleEvents(e){for(const t of e)this.toast(t.icon??u_[t.tone]??"💬",t.text,t.tone)}hint(e){const t=at("#hint");t.textContent=e,t.hidden=!e}updateOverlay(){const e=this.s,t=at("#overlay");e.over?(t.innerHTML=`
        <div class="modal">
          <div class="modal-icon">💀</div>
          <h2>Foreclosed!</h2>
          <p>The bank took the trails on day ${e.day}. The dinosaurs found homes;
          your spreadsheet did not.</p>
          <button class="big" id="restart">🔄 Carve a new park</button>
        </div>`,t.hidden=!1,at("#restart").addEventListener("click",()=>this.h.reset())):t.hidden=!0}openSheet(e){this.sheet=e,at("#sheet").hidden=!1,at("#sheet-backdrop").hidden=!1,this.renderSheet()}closeSheet(){var e,t;this.sheet=null,at("#sheet").hidden=!0,at("#sheet-backdrop").hidden=!0,(t=(e=this.h).deselect)==null||t.call(e)}renderSheet(){const e=at("#sheet-body"),t={cell:()=>this.renderCell(e),market:()=>this.renderMarket(e),herd:()=>this.renderHerd(e),books:()=>this.renderBooks(e),help:()=>this.renderHelp(e),recapture:()=>this.renderRecapture(e)}[this.sheet.type];t?t():this.closeSheet()}title(e){at("#sheet-title").textContent=e}wire(e,t){for(const n of e.querySelectorAll("[data-act]"))n.addEventListener("click",()=>{const s=t[n.dataset.act];if(s){if(n.dataset.confirm&&!n.dataset.armed){n.dataset.armed="1",n.dataset.label=n.textContent,n.textContent="Tap again to confirm",n.classList.add("danger"),setTimeout(()=>{n.dataset.armed="",n.textContent=n.dataset.label,n.classList.remove("danger")},2500);return}s(n)}})}renderCell(e){const t=this.s,n=this.park.cells[this.sheet.cellId];if(!n)return this.closeSheet();const s=t.cells[n.id],r=t.cellTraffic[n.id]??0,o=`<p class="muted">${this.roominess(n)} · ${Math.round(n.area)} m² · 👣 ${r} passers-by yesterday</p>`;if(n.terrain==="water"){this.title("💧 Pond"),e.innerHTML=`<p class="lead">Cool water and lily pads. Not for sale — but dinosaurs
        in neighboring cells love living lakeside, and the shore trail draws strollers.</p>${o}`;return}if(!s.owned){const l=oo(t,n);this.title(`🏞️ Wild ${Zi[n.terrain].name.toLowerCase()}`),e.innerHTML=`
        <p class="lead">Untamed territory. Land beside busy trails costs more — check the 🔥 heatmap before you buy.</p>
        ${o}
        <button class="big" data-act="buy" ${t.money<l?"disabled":""}>Claim land — ${ft(l)}</button>`,this.wire(e,{buy:()=>this.h.run(sh,this.park,n)});return}if(!s.use){this.title(`🏗️ ${this.cellName(n)}`),e.innerHTML=`${o}<div class="cards">${Object.entries($n).map(([l,h])=>`
          <button class="card" data-act="build" data-kind="${l}" ${t.money<h.cost?"disabled":""}>
            <div class="card-head"><span class="card-icon">${h.icon}</span><b>${h.name}</b></div>
            <div class="card-desc">${h.desc}</div>
            <div class="card-foot"><span>${ft(h.cost)}</span><span class="muted">${ft(h.upkeep)}/day</span></div>
          </button>`).join("")}</div>`,this.wire(e,{build:l=>this.h.run(rh,n,l.dataset.kind)});return}if(s.use==="paddock")return this.renderPaddock(e,n,s,o);const a=$n[s.use];this.title(`${a.icon} ${a.name}`);const c=s.use==="kiosk"||s.use==="gift";e.innerHTML=`
      <p class="lead">${a.desc}</p>
      ${o}
      ${c?'<p class="muted">Guests buy once when the need bites — busy trails bring the hungry ones here first.</p>':""}
      <button class="big danger-outline" data-act="demo" data-confirm="1">💣 Demolish (30% refund)</button>`,this.wire(e,{demo:()=>{var l;(l=this.h.run(Ba,n))!=null&&l.ok&&this.closeSheet()}})}renderPaddock(e,t,n,s){const r=this.s,o=Yn(r,t.id),a=Xn[n.fence],c=Xn[n.fence+1];this.title(`🦕 Paddock — ${this.cellName(t)}`);const l=Sr(r,n),h=o.map(u=>{const d=je[u.sp],f=u.escaped?"🚨 LOOSE!":u.sick?"🤒 under the weather":u.hap<40?"💢 agitated":u.hap>85?"❤️ blissful":"🙂 content",g=d.fer>l,_=It(r,"research")>0;return`
        <div class="row">
          <span class="row-icon">${d.icon}</span>
          <div class="row-main">
            <b>${d.name}</b>${_?` <small class="muted">· ${Math.round(u.hap)}/100</small>`:""}
            ${_?`<div class="hap-bar"><i style="width:${Math.round(u.hap)}%" class="${u.hap<40?"low":""}"></i></div>`:""}
            <small class="muted">${f}${g?" · ⚠️ fence too weak!":""}${_?"":" · 🔭 build a Research Post for exact readings"}</small>
          </div>
          ${u.sick?`<button class="mini" data-act="treat" data-id="${u.id}">Treat<br>${ft(nt.treatCost)}</button>`:""}
          <button class="mini" data-act="sell" data-id="${u.id}" data-confirm="1">Sell<br>${zn(d.cost*.4)}</button>
        </div>`}).join("");e.innerHTML=`
      ${s}
      ${o.length?`<div class="rows">${h}</div>`:'<p class="lead">An empty paddock. Dinosaurs come from the 🛒 Market — when they come at all.</p>'}
      <div class="fence-box">
        <div><b>Fence: ${a.name}</b> ${"⛓".repeat(l)}<br>
        <small class="${n.fence===2&&l<4?"warn-text":"muted"}">${n.fence===2&&l<4?"Unpowered — build a Generator for full strength!":a.desc}</small></div>
        ${c?`<button class="mini" data-act="fence" ${r.money<c.cost?"disabled":""}>Upgrade<br>${ft(c.cost)}</button>`:'<span class="muted">Maxed</span>'}
      </div>
      <button class="big" data-act="market">🛒 Browse the dino market</button>
      ${o.length===0?'<button class="big danger-outline" data-act="demo" data-confirm="1">💣 Demolish paddock</button>':""}`,this.wire(e,{sell:u=>{const d=r.dinos.find(f=>f.id===+u.dataset.id);d&&this.h.run(oh,d)},treat:u=>{const d=r.dinos.find(f=>f.id===+u.dataset.id);d&&this.h.run(lh,d)},fence:()=>this.h.run(ah,t),market:()=>this.openSheet({type:"market"}),demo:()=>{var u;(u=this.h.run(Ba,t))!=null&&u.ok&&this.closeSheet()}})}speciesCard(e,t,{rare:n=!1,extraAct:s="pick",dataAttr:r=""}={}){const o=this.s,a=je[e],c=Xi(o,this.park,e).length;return`
      <button class="card ${n?"active":""}" data-act="${s}" ${r} ${o.money<t?"disabled":""}>
        <div class="card-head"><span class="card-icon">${a.icon}</span><b>${a.name}</b>${n?" ✨":""}</div>
        <div class="card-desc">${a.desc}</div>
        <div class="stats">
          <span title="Crowd draw">🌟${a.pop}</span>
          <span title="Irritability">🌶️${a.irr}</span>
          <span title="Fence needed">🦷${"⛓".repeat(a.fer)}</span>
          <span title="Needs room">📐${a.minR}+</span>
        </div>
        <div class="card-foot"><span>${ft(t)}</span>
          <span class="${c?"muted":"warn-text"}">${c?`${c} paddock${c>1?"s":""} fit`:"no paddock fits!"}</span></div>
      </button>`}startPlacing(e,t){const n=Xi(this.s,this.park,e);if(!n.length){this.toast("🚫","No paddock fits this dinosaur — build a roomier one.","bad");return}const s=r=>t==null?this.h.run(Ha,this.park,e,r):this.h.run(za,this.park,t,r);n.length===1?s(n[0].id):(this.sheet.placing={sp:e,offerIdx:t},this.renderSheet())}renderMarket(e){const t=this.s;if(this.title("🛒 Dino Market"),this.sheet.placing!=null)return this.renderPlacement(e);const n=t.market.nextRefresh,s=Object.entries(je).filter(([,r])=>r.always);e.innerHTML=`
      <h3>Ranch stock — always available</h3>
      <div class="cards">${s.map(([r,o])=>this.speciesCard(r,o.cost,{extraAct:"common",dataAttr:`data-sp="${r}"`})).join("")}</div>
      <h3>Traveling market — new stock in ${n} day${n>1?"s":""}</h3>
      <p class="muted" style="margin:0 2px 8px">Unsold dinos leave with the refresh. Rare species (✨) show up when they feel like it.</p>
      <div class="cards">${t.market.offers.map((r,o)=>this.speciesCard(r.sp,r.price,{rare:je[r.sp].weight<=.07,extraAct:"pick",dataAttr:`data-i="${o}"`})).join("")}</div>
      ${t.market.offers.length?"":'<p class="muted center">Sold out. Come back after the refresh.</p>'}`,this.wire(e,{common:r=>this.startPlacing(r.dataset.sp,null),pick:r=>this.startPlacing(t.market.offers[+r.dataset.i].sp,+r.dataset.i)})}renderPlacement(e){const t=this.s,{sp:n,offerIdx:s}=this.sheet.placing,r=s!=null?t.market.offers[s]:null;if(s!=null&&!r)return this.sheet.placing=null,this.renderSheet();const o=je[n],a=r?r.price:o.cost,c=Xi(t,this.park,n);e.innerHTML=`
      <p class="lead">${o.icon} Where does the ${o.name} live? (${ft(a)})</p>
      <div class="rows">${c.map(l=>{const h=Yn(t,l.id),u=ao(l,n);return`
          <button class="row row-btn" data-act="place" data-cell="${l.id}">
            <span class="row-icon">🏞️</span>
            <div class="row-main">
              <b>${this.cellName(l)}</b>
              <small class="muted">${this.roominess(l)} · ${h.length}/${u} dinos · fence ${Xn[t.cells[l.id].fence].name}</small>
            </div>
          </button>`}).join("")}</div>
      <button class="big danger-outline" data-act="back">← Back to market</button>`,this.wire(e,{place:l=>{const h=s==null?this.h.run(Ha,this.park,n,+l.dataset.cell):this.h.run(za,this.park,s,+l.dataset.cell);h!=null&&h.ok&&(this.sheet.placing=null,this.renderSheet())},back:()=>{this.sheet.placing=null,this.renderSheet()}})}renderHerd(e){const t=this.s;if(this.title("🦕 Your herd"),!t.dinos.length){e.innerHTML='<p class="lead">No dinosaurs. The 🛒 Market is the only way in — keep cash ready.</p>';return}e.innerHTML=`<div class="rows">${t.dinos.map(n=>{const s=je[n.sp],r=this.park.cells[n.cell],o=t.cells[n.cell],a=[];n.escaped?a.push("🚨 LOOSE — tap it on the trails!"):s.fer>Sr(t,o)&&a.push("⚠️ fence too weak"),n.sick&&a.push("🤒 sick"),!n.escaped&&s.social==="herd"&&Yn(t,n.cell).length<2&&a.push("😔 lonely");const c=It(t,"research")>0,l=n.hap<40?"💢 agitated":n.hap>85?"❤️ blissful":"🙂 content";return`
        <button class="row row-btn" data-act="go" data-cell="${n.cell}">
          <span class="row-icon">${s.icon}</span>
          <div class="row-main">
            <b>${s.name}</b> <small class="muted">· ${this.cellName(r)}</small>
            ${c?`<div class="hap-bar"><i style="width:${Math.round(n.hap)}%" class="${n.hap<40?"low":""}"></i></div>`:""}
            <small class="${a.length?"warn-text":"muted"}">${a.join(" · ")||(c?`${l} (${Math.round(n.hap)}/100)`:l)}</small>
          </div>
        </button>`}).join("")}</div>
    ${It(t,"research")?"":'<p class="muted center">🔭 A Research Post unlocks exact happiness readings.</p>'}`,this.wire(e,{go:n=>this.openSheet({type:"cell",cellId:+n.dataset.cell})})}renderBooks(e){const t=this.s;this.title("📊 The Books");const n=t.history[t.history.length-1]??{inc:0,exp:0},s=n.inc-n.exp,r=co(t),o=yr(t),a=t.ticket<o-3?'"A steal!"':t.ticket>o+4?'"Highway robbery!"':'"Fair price."';e.innerHTML=`
      <div class="tiles">
        <div class="tile"><small>Balance</small><b class="${t.money<0?"neg":""}">${zn(t.money)}</b></div>
        <div class="tile"><small>Net yesterday</small><b class="${s<0?"neg":"pos"}">${s>=0?"+":""}${zn(s)}</b></div>
        <div class="tile"><small>Guests</small><b>${t.guests}</b></div>
        <div class="tile"><small>Fame</small><b>${Math.round(t.fame)}/100</b></div>
      </div>
      <div class="ticket-box">
        <div class="ticket-row"><b>🎟️ Gate price</b><span id="ticket-val">${ft(t.ticket)}</span></div>
        <input type="range" id="ticket" min="${nt.ticketMin}" max="${nt.ticketMax}" step="1" value="${t.ticket}">
        <small class="muted" id="ticket-mood">Guests say: ${a} (fame raises what they'll pay)</small>
      </div>
      <h3>Park systems</h3>
      <div class="tiles">
        <div class="tile"><small>Feed</small><b class="${r.feedDemand>r.feedCapacity?"neg":""}">${r.feedDemand}/${r.feedCapacity}</b></div>
        <div class="tile"><small>Ranger cover</small><b class="${r.dangerous>r.covered?"neg":""}">${Math.min(r.covered,r.dangerous)}/${r.dangerous}</b></div>
        <div class="tile"><small>Power</small><b class="${r.powered?"pos":""}">${r.powered?"On grid":"None"}</b></div>
        <div class="tile"><small>Clinic</small><b>${It(t,"clinic")?"Staffed":"None"}</b></div>
      </div>
      <h3>Guest report</h3>
      ${It(t,"survey")?t.unmet?`<div class="tiles">
                <div class="tile"><small>Guest mood</small><b class="${t.guestMood<50?"neg":t.guestMood>75?"pos":""}">${t.guestMood}/100</b></div>
                <div class="tile"><small>Left hungry</small><b class="${t.unmet.food>.4?"neg":""}">${Math.round(t.unmet.food*100)}%</b></div>
                <div class="tile"><small>No souvenir</small><b class="${t.unmet.gift>.4?"neg":""}">${Math.round(t.unmet.gift*100)}%</b></div>
                <div class="tile"><small>Uncomfortable</small><b class="${t.unmet.comfort>.4?"neg":""}">${Math.round(t.unmet.comfort*100)}%</b></div>
              </div>
              <p class="muted" style="margin:6px 2px 0">Guests buy once when a need bites — put stands where hungry
              guests actually walk, not everywhere.</p>`:`<p class="muted">Surveys start with tomorrow's guests.</p>`:`<p class="muted">Build ${$n.survey.icon} Guest Services to survey departing guests — who left
             hungry, empty-handed or uncomfortable.</p>`}
      <h3>Balance — last 30 days</h3>
      <div class="chart-wrap"><canvas id="c-line"></canvas><div class="chart-tip" hidden></div></div>
      <h3>Income vs expenses — last 14 days</h3>
      <div class="legend">
        <span><i style="background:${sn.blue}"></i>Income</span>
        <span><i style="background:${sn.orange}"></i>Expenses</span>
      </div>
      <div class="chart-wrap"><canvas id="c-bars"></canvas><div class="chart-tip" hidden></div></div>
      <h3>Ledger</h3>
      <div class="ledger" id="ledger"></div>`;const c=e.querySelector("#ticket");c.addEventListener("input",()=>{ch(t,+c.value),e.querySelector("#ticket-val").textContent=ft(t.ticket);const f=yr(t),g=t.ticket<f-3?'"A steal!"':t.ticket>f+4?'"Highway robbery!"':'"Fair price."';e.querySelector("#ticket-mood").textContent=`Guests say: ${g} (fame raises what they'll pay)`});const l={fn:null},h={fn:null};requestAnimationFrame(()=>{l.fn=l_(e.querySelector("#c-line"),t.history.slice(-30).map(f=>({d:f.d,v:f.bal}))),h.fn=h_(e.querySelector("#c-bars"),t.history.slice(-14).filter(f=>f.d>0))}),il(e.querySelector("#c-line"),e.querySelectorAll(".chart-tip")[0],l),il(e.querySelector("#c-bars"),e.querySelectorAll(".chart-tip")[1],h);const u=[];let d=null;for(let f=t.ledger.length-1;f>=0&&u.length<80;f--){const g=t.ledger[f];g.d!==d&&(d=g.d,u.push(`<div class="ledger-day">Day ${d}</div>`)),u.push(`<div class="ledger-row"><span>${g.label}</span><b class="${g.amt<0?"neg":"pos"}">${g.amt<0?"−":"+"}${ft(Math.abs(g.amt))}</b></div>`)}e.querySelector("#ledger").innerHTML=u.join("")}renderHelp(e){this.title("❔ Trail wisdom"),e.innerHTML=`
      <div class="help">
        <p><b>👣 Money follows footsteps.</b> Guests walk real trails between the gate and
        your star dinos. Toggle 🔥 to see where the crowds actually go.</p>
        <p><b>🌭 Guests have needs.</b> Each guest gets hungry once, wants one souvenir,
        and needs a restroom — they buy at the <i>first</i> stand they pass when the need
        bites, then walk past the rest. Unmet needs sour their mood, and guest mood moves
        your fame. 🎪 Guest Services unlocks the exit-survey report.</p>
        <p><b>🏞️ Land is unequal.</b> Cells differ in size, terrain and traffic. Prices follow
        footfall, so buy ahead of the crowd. Big species need <i>vast</i> cells — 📐 shows
        the roominess a dino demands.</p>
        <p><b>🗺️ Getting around:</b> drag to roam the park, pinch (or scroll) to zoom,
        two-finger drag (or right-drag) to spin the view.</p>
        <p><b>🛒 Getting dinos.</b> Ranch commons are always for sale. The traveling market
        restocks every ${nt.marketRefreshDays} days with ${nt.marketSlots} offers — rare species (✨) show up when
        they please, and missed offers are gone.</p>
        <p><b>⛓ Fences vs teeth.</b> A dino whose bite (🦷) beats the fence will eventually
        walk out — especially when unhappy. Loose dinos empty the park until you tap them.</p>
        <p><b>😊 Happiness</b>: room to roam, herds together, loners alone, gardens and
        lakesides next door.</p>
        <p><b>🏗️ Big dinos need infrastructure.</b> Electric fences want a Generator,
        big appetites want Feed Depots (imports cost extra beyond capacity), dangerous
        species want Ranger cover, and a Vet Clinic shrugs off sickness. Check
        "Park systems" in the Books.</p>
        <p><b>⚡ Disasters happen</b>: outages, storms and heatwaves roll through —
        the right buildings (and lakeside pens) blunt them.</p>
        <p><b>🎟️ Gate price</b> is set in the Books — fame raises what guests will pay.</p>
        <p><b>💀 Don't drop below ${ft(nt.bankruptcyAt)}.</b> The bank has no chill.</p>
      </div>
      <button class="big danger-outline" data-act="reset" data-confirm="1">🗑️ Reset park (new terrain)</button>
      <p class="muted center">Design doc: docs/design-dino-trails.md · autosaves on this device</p>`,this.wire(e,{reset:()=>this.h.reset()})}renderRecapture(e){const t=this.s,n=t.dinos.find(o=>o.id===this.sheet.dinoId);if(!(n!=null&&n.escaped))return this.closeSheet();const s=je[n.sp],r=lo(t,n);this.title("🚨 Dinosaur on the trails!"),e.innerHTML=`
      <p class="lead">${s.icon} The ${s.name} is loose and the guests are sprinting for the gate.</p>
      <button class="big" data-act="catch" ${t.money<r?"disabled":""}>🎯 Send the rangers — ${ft(r)}</button>`,this.wire(e,{catch:()=>{var o;(o=this.h.run(hh,n))!=null&&o.ok&&this.closeSheet()}})}}const f_=document.getElementById("scene"),cr=eh(),ph=(cr==null?void 0:cr.seed)??Math.random()*2**31|0,fi=Yh(ph);let Nt=cr??Ql(ph,fi);const jt=new o_(f_,fi),Ga=[{mult:1,label:"▶ 1×"},{mult:3,label:"⏩ 3×"},{mult:0,label:"⏸"}];let lr=0;const rn=new d_({get s(){return Nt},run(i,...e){const t=i(Nt,...e);return t!=null&&t.msg&&rn.toast(t.ok?"✅":"🚫",t.msg,t.ok?"good":"bad"),t!=null&&t.ok&&(Ts(Nt),jt.syncState(Nt),rn.refresh()),t},speed(){lr=(lr+1)%Ga.length},speedLabel:()=>Ga[lr].label,setHeat(i){jt.setHeat(i)},reset(){th(),location.reload()},deselect(){jt.setSelected(null)}},fi);jt.syncState(Nt);rn.refresh();Nt.flags.hinted||rn.hint("👆 Tap a cell · drag to roam · 🔥 busy trails");window.__dp={get s(){return Nt},sim:c_,world:jt,ui:rn,park:fi};function sl(i){jt.setSelected(i),rn.openSheet({type:"cell",cellId:i.id}),Nt.flags.hinted||(Nt.flags.hinted=!0,Ts(Nt),rn.hint(""))}function p_(i,e){const t=jt.pick(i,e);if(!t){rn.closeSheet();return}if(t.type==="dino"){const n=Nt.dinos.find(s=>s.id===t.id);if(!n)return;if(n.escaped){rn.openSheet({type:"recapture",dinoId:n.id});return}sl(fi.cells[n.cell]);return}sl(fi.cells[t.id])}const mh=jt.renderer.domElement;let us=null;mh.addEventListener("pointerdown",i=>{us={x:i.clientX,y:i.clientY}});mh.addEventListener("pointerup",i=>{us&&Math.hypot(i.clientX-us.x,i.clientY-us.y)<10&&p_(i.clientX,i.clientY),us=null});window.addEventListener("resize",()=>jt.resize());document.addEventListener("visibilitychange",()=>Ts(Nt));let rl=performance.now(),rr=0,ya=0;jt.renderer.setAnimationLoop(()=>{const i=performance.now(),e=Math.min(.1,(i-rl)/1e3);rl=i;const t=Nt.over?0:Ga[lr].mult;if(rr+=e*1e3*t,rr>=nt.dayMs){rr-=nt.dayMs;const s=uh(Nt,fi,jt.collectTraffic());jt.syncState(Nt),rn.refresh(),rn.handleEvents(s)}ya+=e,ya>.25&&(ya=0,rn.updateHUD(rr/nt.dayMs));const n=Nt.visitorRate/(nt.dayMs/1e3)*t;jt.update(e,i/1e3,n)});
