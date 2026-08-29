(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Vr=Math.sqrt(3);function Ln(i,t){return[i+t/2,t*Vr/2]}const Mi=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],yn=(i,t,e)=>i+1024<<15|t+1024<<3|e,Qt=i=>(i>>15&2047)-1024,te=i=>(i>>3&4095)-1024,re=i=>i&7,kr=[[0,0,0],[0,0,1],[0,0,4],[0,0,5],[4,-2,1],[4,-2,2],[2,2,3],[2,2,4]],bl=(i,t)=>[-t,i+t],Al=(i,t)=>[i+t,-t],Wr=[];for(let i=0;i<2;i++)for(let t=0;t<6;t++)Wr.push({r:t,flip:i,index:Wr.length});function wl(i,t,e,n){let s=[t,e];i.flip&&(s=Al(s[0],s[1]),n=(6-n)%6);for(let r=0;r<i.r;r++)s=bl(s[0],s[1]),n=(n+1)%6;return[s[0],s[1],n]}const Zi=Wr.map(i=>kr.map(([t,e,n])=>wl(i,t,e,n)));function $n(i,t,e){const n=Mi[(e+5)%6],s=Mi[e],r=Mi[(e+1)%6];return[[i,t],[i+n[0]+s[0],t+n[1]+s[1]],[i+2*s[0],t+2*s[1]],[i+s[0]+r[0],t+s[1]+r[1]]]}function qn(i,t,e){const n=$n(i,t,e);let s=0,r=0;for(const[a,o]of n){const[l,c]=Ln(a,o);s+=l,r+=c}return[s/4,r/4]}function Oe(i,t,e,n=[]){const s=Mi[(e+5)%6],r=Mi[e],a=Mi[(e+1)%6];return n[0]=yn(i,t,(e+1)%6),n[1]=yn(i,t,(e+5)%6),n[2]=yn(i+2*(s[0]+r[0]),t+2*(s[1]+r[1]),(e+2)%6),n[3]=yn(i+2*(r[0]+a[0]),t+2*(r[1]+a[1]),(e+4)%6),n}function $e(i,t,e,n=new Array(8)){const s=Zi[i];for(let r=0;r<8;r++)n[r]=yn(s[r][0]+t,s[r][1]+e,s[r][2]);return n}const Rl=(i,t,e)=>i*4194304+(t+1024<<11)+(e+1024);function mc(i){const t=new Set,e=[];for(const r of i){const a=Qt(r),o=te(r),l=re(r);Oe(a,o,l,e);for(let c=0;c<4;c++)i.has(e[c])||t.add(e[c])}const n=[],s=new Set;for(const r of t){const a=Qt(r),o=te(r),l=re(r);for(let c=0;c<12;c++){const h=Zi[c];for(let u=0;u<8;u++){if(h[u][2]!==l)continue;const d=a-h[u][0],m=o-h[u][1],_=Rl(c,d,m);if(s.has(_))continue;s.add(_);let g=!0;for(let p=0;p<8;p++)if(i.has(yn(h[p][0]+d,h[p][1]+m,h[p][2]))){g=!1;break}g&&n.push({o:c,ta:d,tb:m,id:_})}}}return n}function Cl(i){const t=new Map;for(const[a,o,l]of Zi[i]){const c=$n(a,o,l);for(let h=0;h<4;h++){const u=c[h],d=c[(h+1)%4],m=`${u[0]},${u[1]}>${d[0]},${d[1]}`,_=`${d[0]},${d[1]}>${u[0]},${u[1]}`;t.has(_)?t.delete(_):t.set(m,[u,d])}}const e=new Map;for(const[a,o]of t.values())e.set(`${a[0]},${a[1]}`,o);const n=t.values().next().value[0],s=[n];let r=e.get(`${n[0]},${n[1]}`);for(;r&&(r[0]!==n[0]||r[1]!==n[1]);)s.push(r),r=e.get(`${r[0]},${r[1]}`);return s.map(([a,o])=>Ln(a,o))}function Ll(i,t){const e=2*t/Vr,n=i-e/2,s=(e-n)/6,r=(n+2*s)/2;let a=null,o=1/0;for(const[p,f]of Pl){const S=Math.round(r)+p,v=Math.round(s)+f,E=2*S-2*v,C=2*S+4*v,w=n-E,A=e-C,I=w*w+w*A+A*A;I<o&&(o=I,a=[E,C,w,A])}const[l,c,h,u]=a,[d,m]=[h+u/2,u*Vr/2];let _=Math.atan2(m,d);_<0&&(_+=Math.PI*2);const g=Math.floor((_+Math.PI/6)/(Math.PI/3))%6;return[l,c,g]}const Pl=[[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]],ze=0,gn=1,Ji=2,qs=3,Pn=4,Dn=5,yi=["river","meadow","forest","hills","hamlet","peak"],gc=[1.6,1,1.1,1.25,1.8,1.4],ti=i=>i===ze,sr=2;function Dl(i,t){return Math.round(i*(i+2)*gc[t])}const Ul=.3;function Il(i,t){return Math.round(i*(i+2)*gc[t]*Ul)}function Nl(i){return i>=21?4:i>=13?3:i>=7?2:i>=3?1:0}class Fl{constructor(){this.biome=new Map,this.owner=new Map,this.filled=new Set,this.parent=new Map,this.rsize=new Map,this.ropen=new Map,this.sealed=new Set,this.dead=new Set,this.landmarks=new Map,this.tiles=[],this._nb=[]}find(t){let e=t;for(;this.parent.get(e)!==e;)e=this.parent.get(e);let n=t;for(;this.parent.get(n)!==e;){const s=this.parent.get(n);this.parent.set(n,e),n=s}return e}union(t,e){let n=this.find(t),s=this.find(e);return n===s||(this.rsize.get(n)<this.rsize.get(s)&&([n,s]=[s,n]),this.parent.set(s,n),this.rsize.set(n,this.rsize.get(n)+this.rsize.get(s)),this.ropen.set(n,this.ropen.get(n)+this.ropen.get(s)),this.rsize.delete(s),this.ropen.delete(s)),n}legal(t,e,n,s){const r=$e(t,e,n),a=new Set(r);for(let o=0;o<8;o++){if(this.filled.has(r[o]))return!1;const l=ti(s[o]);Oe(Qt(r[o]),te(r[o]),re(r[o]),this._nb);for(let c=0;c<sr;c++){const h=this._nb[c];if(!a.has(h)&&this.filled.has(h)&&ti(this.biome.get(h))!==l)return!1}}return!0}legalPlacements(t){const e=[],n=[],s=t.some(ti);for(const r of mc(this.filled))this.legal(r.o,r.ta,r.tb,t)&&(e.push(r),s&&this.joinsRiver(r.o,r.ta,r.tb,t)&&n.push(r));return n.length>0?n:e}joinsRiver(t,e,n,s){const r=$e(t,e,n),a=new Set(r);for(let o=0;o<8;o++)if(ti(s[o])){Oe(Qt(r[o]),te(r[o]),re(r[o]),this._nb);for(let l=0;l<sr;l++){const c=this._nb[l];if(!a.has(c)&&this.filled.has(c)&&ti(this.biome.get(c)))return!0}}return!1}demand(t,e,n){const s=$e(t,e,n),r=new Set(s),a=new Array(8).fill(null);for(let o=0;o<8;o++){if(this.filled.has(s[o]))return null;Oe(Qt(s[o]),te(s[o]),re(s[o]),this._nb);for(let l=0;l<sr;l++){const c=this._nb[l];if(r.has(c)||!this.filled.has(c))continue;const h=ti(this.biome.get(c));if(a[o]===null)a[o]=h;else if(a[o]!==h)return null}}return a}place(t,e,n,s,r){const a=$e(t,e,n);this.tiles.push({orient:t,ta:e,tb:n,cells:a,biomes:s.slice(),flipped:t>=6});const o=this._addCells(a,s,r),l=this._sealPockets(a,o);return{closed:this._collectSealed(o),hollows:l,cells:a}}_addCells(t,e,n){const s=new Set;for(let a=0;a<t.length;a++){const o=t[a];this.filled.add(o),this.biome.set(o,e[a]),this.owner.set(o,n),this.parent.set(o,o),this.rsize.set(o,1),this.ropen.set(o,0)}const r=new Set(t);for(let a=0;a<t.length;a++){const o=t[a],l=e[a];Oe(Qt(o),te(o),re(o),this._nb);for(let c=0;c<4;c++){const h=this._nb[c];if(!this.filled.has(h)){if(!this.dead.has(h)){const u=this.find(o);this.ropen.set(u,this.ropen.get(u)+1)}continue}if(!r.has(h)){const u=this.find(h);this.ropen.set(u,this.ropen.get(u)-1),s.add(u)}this.biome.get(h)===l&&s.add(this.union(o,h))}s.add(this.find(o))}return s}_sealPockets(t,e){const s=new Set,r=[];for(const a of t){Oe(Qt(a),te(a),re(a),this._nb);for(let o=0;o<4;o++){const l=this._nb[o];if(this.filled.has(l)||s.has(l)||this.dead.has(l))continue;const c=this._pocket(l,42);for(const h of c??[])s.add(h);if(c&&!(c.length>=8&&this._fitsInside(c)))for(const h of c)this.dead.add(h),r.push(h)}}for(const a of r){Oe(Qt(a),te(a),re(a),this._nb);for(let o=0;o<4;o++){const l=this._nb[o];if(!this.filled.has(l))continue;const c=this.find(l);this.ropen.set(c,this.ropen.get(c)-1),e.add(c)}}return r}_pocket(t,e){const n=new Set([t]),s=[t],r=[];for(;s.length;){const a=s.pop();if(r.push(a),r.length>e)return null;Oe(Qt(a),te(a),re(a),this._nb);for(let o=0;o<4;o++){const l=this._nb[o];this.filled.has(l)||n.has(l)||(n.add(l),s.push(l))}}return r}_fitsInside(t){const e=new Set(t);for(const n of t){const s=Qt(n),r=te(n),a=re(n);for(let o=0;o<12;o++)for(let l=0;l<8;l++){const c=Zi[o][l];if(c[2]!==a)continue;const h=s-c[0],u=r-c[1];let d=!0;const m=$e(o,h,u);for(let _=0;_<8;_++)if(!e.has(m[_])){d=!1;break}if(d)return!0}}return!1}_collectSealed(t){const e=[],n=new Set;for(const s of t){const r=this.find(s);if(n.has(r)||this.sealed.has(r)||(n.add(r),this.ropen.get(r)!==0))continue;this.sealed.add(r);const a=this.rsize.get(r),o=this.biome.get(r);a>=3&&this.landmarks.set(r,this._heart(r)),e.push({root:r,size:a,biome:o,score:Dl(a,o),tiles:Nl(a)})}return e}_heart(t){const e=this.regionCells(t);let n=0,s=0;for(const o of e)n+=Qt(o),s+=te(o);n/=e.length,s/=e.length;let r=e[0],a=1/0;for(const o of e){const l=Qt(o)-n,c=te(o)-s,h=l*l+l*c+c*c;h<a&&(a=h,r=o)}return r}allRegions(){const t=[],e=new Set;for(const n of this.filled){const s=this.find(n);e.has(s)||(e.add(s),t.push({root:s,size:this.rsize.get(s),biome:this.biome.get(n),sealed:this.sealed.has(s)}))}return t}regionCells(t){const e=this.find(t),n=[];for(const s of this.filled)this.find(s)===e&&n.push(s);return n}regionOf(t){if(!this.filled.has(t))return null;const e=this.find(t);return{root:e,size:this.rsize.get(e),open:this.ropen.get(e),biome:this.biome.get(t),sealed:this.sealed.has(e)}}}const _c=[];{const i=new Map(kr.map(([t,e,n],s)=>[yn(t,e,n),s]));for(let t=0;t<8;t++){const[e,n,s]=kr[t],r=Oe(e,n,s),a=[];for(let o=0;o<4;o++){const l=i.get(r[o]);l!==void 0&&a.push(l)}_c.push(a)}}const Ol=[[1,3],[5,3],[7,3],[2,1],[4,1],[6,1]],vc={1:[1,0],2:[2,3,0],4:[4,5,0],5:[5,0],6:[6,1,0],7:[7,0]},No=[[3],[0,3],[2,3]],xc=[[2,52],[1,15],[3,20],[4,4],[0,6]],Bl=xc.reduce((i,[,t])=>i+t,0),zl=["pond","spring","run","fork","delta"];function Gl(i){const t=Mc(xc,([,r])=>r,Bl,i)[0];if(t===0)return{water:No[Math.floor(i()*No.length)],kind:"pond",mouths:0};const e=Ol.map(([r,a])=>({p:r,w:a})),n=[];for(let r=0;r<t&&e.length;r++){let a=0;for(const c of e)a+=c.w;let o=i()*a,l=e.length-1;for(let c=0;c<e.length;c++)if(o-=e[c].w,o<=0){l=c;break}n.push(e.splice(l,1)[0].p)}const s=new Set;for(const r of n)for(const a of vc[r])s.add(a);return{water:[...s],kind:zl[t],mouths:t}}const Fo=[[gn,36],[Ji,32],[qs,15],[Pn,10],[Dn,5]];function Hl(i){return function(){i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Mc(i,t,e,n){let s=n()*e;for(const r of i)if(s-=t(r),s<=0)return r;return i[i.length-1]}function rr(i,t=!0){const e=t?Fo:Fo.filter(([s])=>s!==Pn&&s!==Dn),n=e.reduce((s,[,r])=>s+r,0);return Mc(e,([,s])=>s,n,i)[0]}function Sc(i,t){const e=new Map;if(i.length===0)return e;const n=t()<.3,s=rr(t,!n);if(n||i.length<=2){for(const m of i)e.set(m,s);return e}let r=rr(t),a=0;for(;r===s&&a++<8;)r=rr(t);const o=new Set(i),l=i[Math.floor(t()*i.length)],c=new Set([l]),h=2+Math.floor(t()*Math.max(1,i.length-3));let u=0;for(;c.size<h&&u++<40;){const m=[];for(const _ of c)for(const g of _c[_])o.has(g)&&!c.has(g)&&m.push(g);if(m.length===0)break;c.add(m[Math.floor(t()*m.length)])}const d=m=>m===Pn||m===Dn?3:8;for(const m of i)e.set(m,c.has(m)?s:r);for(const m of[Pn,Dn]){const _=i.filter(g=>e.get(g)===m);if(_.length>d(m)){const g=new Set(_.slice(0,d(m)));for(const p of _)g.has(p)||e.set(p,gn)}}return e}function Vl(i,t=.42){let e=[],n="land",s=0;if(i()<t){const c=Gl(i);e=c.water,n=c.kind,s=c.mouths}const r=new Set(e),a=[];for(let c=0;c<8;c++)r.has(c)||a.push(c);const o=Sc(a,i),l=new Array(8);for(let c=0;c<8;c++)l[c]=r.has(c)?ze:o.get(c)??gn;return{biomes:l,kind:n,mouths:s}}function kl(i,t){const e=new Set;for(let a=0;a<8;a++)i[a]===!0&&e.add(a);for(const a of[...e]){const o=vc[a];if(o&&o.every(l=>i[l]!==!1))for(const l of o)e.add(l)}const n=new Array(8),s=[];for(let a=0;a<8;a++)e.has(a)?n[a]=ze:s.push(a);const r=Sc(s,t);for(const a of s)n[a]=r.get(a)??gn;return{biomes:n,kind:"fitted",mouths:0}}const Oo=[{orient:0,ta:0,tb:0},{orient:2,ta:6,tb:0},{orient:4,ta:0,tb:6}],Bo=[2,2],Wl=1.9,Xl=3,ql=4.2,Yl=new Set([7,0,3]);function Kl(i,t,e){return i===0&&Yl.has(t)?ze:e<Wl||e<Xl?Dn:e<ql?Ji:i===1?Pn:gn}const Ys=[-.1,0,.14,.34,.06,.5];function jl(i){const t=Math.min(1,i/6.5);return 3.6*Math.pow(1-t,1.25)}const $l=42;function Zl(i){const t=(n,s)=>{let r=n*374761393+s*668265263+i*0x14057b7ef7678100|0;return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296},e=n=>n*n*(3-2*n);return(n,s)=>{const r=Math.floor(n),a=Math.floor(s),o=e(n-r),l=e(s-a),c=t(r,a),h=t(r+1,a),u=t(r,a+1),d=t(r+1,a+1);return(c*(1-o)+h*o)*(1-l)+(u*(1-o)+d*o)*l}}class Jl{constructor(t=1){this.seed=t,this.rnd=Hl(t),this.noise=Zl(t),this.board=new Fl,this.elev=new Map,this.jitter=new Map,this.score=0,this.tilesLeft=$l,this.placed=0,this.sealedCount=0,this.best={size:0,biome:gn},this.queue=[],this.log=[],this.over=!1;const[e,n]=Ln(Bo[0],Bo[1]);this.summit=[e,n],this._seedGarden(),this._refillQueue()}groundAt(t,e){const n=Math.hypot(t-this.summit[0],e-this.summit[1]);return jl(n)+(this.noise(t*.11,e*.11)-.5)*.34}elevationAt(t,e,n){return this.groundAt(t,e)+Ys[n]}_recordCells(t,e){for(let n=0;n<t.length;n++){const s=t[n],[r,a]=qn(Qt(s),te(s),re(s));this.elev.set(s,this.elevationAt(r,a,e[n])),this.jitter.set(s,this.rnd())}}_seedGarden(){Oo.forEach((t,e)=>{const n=$e(t.orient,t.ta,t.tb),s=n.map((r,a)=>{const[o,l]=qn(Qt(r),te(r),re(r)),c=Math.hypot(o-this.summit[0],l-this.summit[1]);return Kl(e,a,c)});this.board.place(t.orient,t.ta,t.tb,s,e),this._recordCells(n,s)});for(const t of this.board.filled){const e=this.board.find(t);this.board.ropen.get(e)===0&&this.board.sealed.add(e)}this.placed=Oo.length}_refillQueue(){for(;this.queue.length<3;)this.queue.push(Vl(this.rnd));this._ensurePlayable()}_ensurePlayable(){const t=this.queue[0];if(!t)return;const e=this.board.legalPlacements(t.biomes);if(e.length>0){this._fits=e;return}const n=mc(this.board.filled);for(let s=0;s<n.length;s++){const r=n[Math.floor(this.rnd()*n.length)],a=this.board.demand(r.o,r.ta,r.tb);if(!a)continue;const o=kl(a,this.rnd),l=this.board.legalPlacements(o.biomes);if(l.length>0){this.queue[0]=o,this._fits=l;return}}this._fits=[]}get tile(){return this.queue[0]}get fits(){return this._fits||this._ensurePlayable(),this._fits}reroll(){return this.over||this.tilesLeft<=1?!1:(this.tilesLeft-=1,this.queue.shift(),this._fits=null,this._refillQueue(),!0)}fitsAtCell(t){const e=this.tile;if(!e)return[];const n=[];for(const s of this.fits){const r=$e(s.o,s.ta,s.tb);r.includes(t)&&n.push({...s,cells:r,...this._harmony(r,e.biomes)})}return n.sort((s,r)=>r.match-s.match||r.touch-s.touch||s.o-r.o),n}_harmony(t,e){let n=0,s=0;const r=new Set(t);for(let a=0;a<t.length;a++){const o=t[a],l=Ql;th(o,l);for(let c=0;c<4;c++){const h=l[c];r.has(h)||!this.board.filled.has(h)||(s++,this.board.biome.get(h)===e[a]&&n++)}}return{match:n,touch:s}}place(t){if(this.over)return null;const e=this.tile,n=$e(t.o,t.ta,t.tb),s=this._harmony(n,e.biomes),r=s.touch>0&&s.match===s.touch,a=this.board.place(t.o,t.ta,t.tb,e.biomes,this.placed);this._recordCells(a.cells,e.biomes);for(const u of a.hollows){const[d,m]=qn(Qt(u),te(u),re(u));this.elev.set(u,this.groundAt(d,m)-.26),this.jitter.set(u,this.rnd())}this.placed+=1,this.tilesLeft-=1;const o=s.match*3+(r?12:0);this.score+=o;let l=o,c=0;const h=[];for(const u of a.closed)this.score+=u.score,l+=u.score,c+=u.tiles,this.sealedCount+=1,u.size>this.best.size&&(this.best={size:u.size,biome:u.biome}),u.size>=3&&(h.push(u),this.log.unshift(`${yi[u.biome]} sealed · ${u.size} kites · +${u.score}`));return this.tilesLeft+=c,this.log.length=Math.min(this.log.length,5),this.queue.shift(),this._fits=null,this._refillQueue(),(this.tilesLeft<=0||this.fits.length===0)&&this.finish(),{...a,gained:l,fitScore:o,perfect:r,bonus:c,announce:h,match:s.match,touch:s.touch}}biggestOpen(){let t=null;for(const e of this.board.allRegions())e.sealed||(!t||e.size>t.size)&&(t=e);return t}finish(){if(!this.over){this.over=!0,this.openTally=[];for(const t of this.board.allRegions()){if(t.sealed||t.size<3)continue;const e=Il(t.size,t.biome);this.score+=e,this.openTally.push({...t,score:e})}this.openTally.sort((t,e)=>e.score-t.score)}}}const Ql=[0,0,0,0];function th(i,t){Oe(Qt(i),te(i),re(i),t)}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const fo="160",eh=0,zo=1,nh=2,Ec=1,yc=2,fn=3,pn=0,De=1,Ze=2,An=0,Si=1,Fs=2,Go=3,Ho=4,ih=5,Wn=100,sh=101,rh=102,Vo=103,ko=104,oh=200,ah=201,ch=202,lh=203,Xr=204,qr=205,hh=206,uh=207,fh=208,dh=209,ph=210,mh=211,gh=212,_h=213,vh=214,xh=0,Mh=1,Sh=2,Os=3,Eh=4,yh=5,Th=6,bh=7,po=0,Ah=1,wh=2,wn=0,Rh=1,Ch=2,Lh=3,Ph=4,Dh=5,Uh=6,Tc=300,Ti=301,bi=302,Yr=303,Kr=304,Ks=306,jr=1e3,Je=1001,$r=1002,Re=1003,Wo=1004,or=1005,ke=1006,Ih=1007,Ki=1008,Rn=1009,Nh=1010,Fh=1011,mo=1012,bc=1013,Tn=1014,bn=1015,ji=1016,Ac=1017,wc=1018,Yn=1020,Oh=1021,Qe=1023,Bh=1024,zh=1025,Kn=1026,Ai=1027,Gh=1028,Rc=1029,Hh=1030,Cc=1031,Lc=1033,ar=33776,cr=33777,lr=33778,hr=33779,Xo=35840,qo=35841,Yo=35842,Ko=35843,Pc=36196,jo=37492,$o=37496,Zo=37808,Jo=37809,Qo=37810,ta=37811,ea=37812,na=37813,ia=37814,sa=37815,ra=37816,oa=37817,aa=37818,ca=37819,la=37820,ha=37821,ur=36492,ua=36494,fa=36495,Vh=36283,da=36284,pa=36285,ma=36286,Dc=3e3,jn=3001,kh=3200,Wh=3201,Uc=0,Xh=1,Xe="",he="srgb",mn="srgb-linear",go="display-p3",js="display-p3-linear",Bs="linear",Jt="srgb",zs="rec709",Gs="p3",ei=7680,ga=519,qh=512,Yh=513,Kh=514,Ic=515,jh=516,$h=517,Zh=518,Jh=519,_a=35044,Nc=35048,va="300 es",Zr=1035,dn=2e3,Hs=2001;class Li{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Se=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fr=Math.PI/180,Jr=180/Math.PI;function Qi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Se[i&255]+Se[i>>8&255]+Se[i>>16&255]+Se[i>>24&255]+"-"+Se[t&255]+Se[t>>8&255]+"-"+Se[t>>16&15|64]+Se[t>>24&255]+"-"+Se[e&63|128]+Se[e>>8&255]+"-"+Se[e>>16&255]+Se[e>>24&255]+Se[n&255]+Se[n>>8&255]+Se[n>>16&255]+Se[n>>24&255]).toLowerCase()}function Pe(i,t,e){return Math.max(t,Math.min(e,i))}function Qh(i,t){return(i%t+t)%t}function dr(i,t,e){return(1-e)*i+e*t}function xa(i){return(i&i-1)===0&&i!==0}function Qr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Oi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Le(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Vt{constructor(t=0,e=0){Vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class zt{constructor(t,e,n,s,r,a,o,l,c){zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],m=n[5],_=n[8],g=s[0],p=s[3],f=s[6],S=s[1],v=s[4],E=s[7],C=s[2],w=s[5],A=s[8];return r[0]=a*g+o*S+l*C,r[3]=a*p+o*v+l*w,r[6]=a*f+o*E+l*A,r[1]=c*g+h*S+u*C,r[4]=c*p+h*v+u*w,r[7]=c*f+h*E+u*A,r[2]=d*g+m*S+_*C,r[5]=d*p+m*v+_*w,r[8]=d*f+m*E+_*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,d=o*l-h*r,m=c*r-a*l,_=e*u+n*d+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=u*g,t[1]=(s*c-h*n)*g,t[2]=(o*n-s*a)*g,t[3]=d*g,t[4]=(h*e-s*l)*g,t[5]=(s*r-o*e)*g,t[6]=m*g,t[7]=(n*l-c*e)*g,t[8]=(a*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(pr.makeScale(t,e)),this}rotate(t){return this.premultiply(pr.makeRotation(-t)),this}translate(t,e){return this.premultiply(pr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const pr=new zt;function Fc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Vs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function tu(){const i=Vs("canvas");return i.style.display="block",i}const Ma={};function Yi(i){i in Ma||(Ma[i]=!0,console.warn(i))}const Sa=new zt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ea=new zt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),rs={[mn]:{transfer:Bs,primaries:zs,toReference:i=>i,fromReference:i=>i},[he]:{transfer:Jt,primaries:zs,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[js]:{transfer:Bs,primaries:Gs,toReference:i=>i.applyMatrix3(Ea),fromReference:i=>i.applyMatrix3(Sa)},[go]:{transfer:Jt,primaries:Gs,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Ea),fromReference:i=>i.applyMatrix3(Sa).convertLinearToSRGB()}},eu=new Set([mn,js]),Kt={enabled:!0,_workingColorSpace:mn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!eu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=rs[t].toReference,s=rs[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return rs[i].primaries},getTransfer:function(i){return i===Xe?Bs:rs[i].transfer}};function Ei(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function mr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ni;class Oc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ni===void 0&&(ni=Vs("canvas")),ni.width=t.width,ni.height=t.height;const n=ni.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ni}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Vs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ei(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ei(e[n]/255)*255):e[n]=Ei(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let nu=0;class Bc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nu++}),this.uuid=Qi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(gr(s[a].image)):r.push(gr(s[a]))}else r=gr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function gr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Oc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let iu=0;class Ue extends Li{constructor(t=Ue.DEFAULT_IMAGE,e=Ue.DEFAULT_MAPPING,n=Je,s=Je,r=ke,a=Ki,o=Qe,l=Rn,c=Ue.DEFAULT_ANISOTROPY,h=Xe){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=Qi(),this.name="",this.source=new Bc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Vt(0,0),this.repeat=new Vt(1,1),this.center=new Vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Yi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===jn?he:Xe),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Tc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case jr:t.x=t.x-Math.floor(t.x);break;case Je:t.x=t.x<0?0:1;break;case $r:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case jr:t.y=t.y-Math.floor(t.y);break;case Je:t.y=t.y<0?0:1;break;case $r:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Yi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===he?jn:Dc}set encoding(t){Yi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===jn?he:Xe}}Ue.DEFAULT_IMAGE=null;Ue.DEFAULT_MAPPING=Tc;Ue.DEFAULT_ANISOTROPY=1;class ge{constructor(t=0,e=0,n=0,s=1){ge.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],m=l[5],_=l[9],g=l[2],p=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-g)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+g)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,E=(m+1)/2,C=(f+1)/2,w=(h+d)/4,A=(u+g)/4,I=(_+p)/4;return v>E&&v>C?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=w/n,r=A/n):E>C?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=w/s,r=I/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=A/r,s=I/r),this.set(n,s,r,e),this}let S=Math.sqrt((p-_)*(p-_)+(u-g)*(u-g)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(p-_)/S,this.y=(u-g)/S,this.z=(d-h)/S,this.w=Math.acos((c+m+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class su extends Li{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ge(0,0,t,e),this.scissorTest=!1,this.viewport=new ge(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(Yi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===jn?he:Xe),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ke,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ue(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Bc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zn extends su{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class zc extends Ue{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Re,this.minFilter=Re,this.wrapR=Je,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ru extends Ue{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Re,this.minFilter=Re,this.wrapR=Je,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Jn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[a+0],m=r[a+1],_=r[a+2],g=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=m,t[e+2]=_,t[e+3]=g;return}if(u!==g||l!==d||c!==m||h!==_){let p=1-o;const f=l*d+c*m+h*_+u*g,S=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const C=Math.sqrt(v),w=Math.atan2(C,f*S);p=Math.sin(p*w)/C,o=Math.sin(o*w)/C}const E=o*S;if(l=l*p+d*E,c=c*p+m*E,h=h*p+_*E,u=u*p+g*E,p===1-o){const C=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=C,c*=C,h*=C,u*=C}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],m=r[a+2],_=r[a+3];return t[e]=o*_+h*u+l*m-c*d,t[e+1]=l*_+h*d+c*u-o*m,t[e+2]=c*_+h*m+o*d-l*u,t[e+3]=h*_-o*u-l*d-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),m=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*m*_,this._y=c*m*u-d*h*_,this._z=c*h*_+d*m*u,this._w=c*h*u-d*m*_;break;case"YXZ":this._x=d*h*u+c*m*_,this._y=c*m*u-d*h*_,this._z=c*h*_-d*m*u,this._w=c*h*u+d*m*_;break;case"ZXY":this._x=d*h*u-c*m*_,this._y=c*m*u+d*h*_,this._z=c*h*_+d*m*u,this._w=c*h*u-d*m*_;break;case"ZYX":this._x=d*h*u-c*m*_,this._y=c*m*u+d*h*_,this._z=c*h*_-d*m*u,this._w=c*h*u+d*m*_;break;case"YZX":this._x=d*h*u+c*m*_,this._y=c*m*u+d*h*_,this._z=c*h*_-d*m*u,this._w=c*h*u-d*m*_;break;case"XZY":this._x=d*h*u-c*m*_,this._y=c*m*u-d*h*_,this._z=c*h*_+d*m*u,this._w=c*h*u+d*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Pe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ya.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ya.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return _r.copy(this).projectOnVector(t),this.sub(_r)}reflect(t){return this.sub(_r.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _r=new P,ya=new Jn;class Qn{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(qe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(qe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=qe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,qe):qe.fromBufferAttribute(r,a),qe.applyMatrix4(t.matrixWorld),this.expandByPoint(qe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),os.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),os.copy(n.boundingBox)),os.applyMatrix4(t.matrixWorld),this.union(os)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,qe),qe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Bi),as.subVectors(this.max,Bi),ii.subVectors(t.a,Bi),si.subVectors(t.b,Bi),ri.subVectors(t.c,Bi),_n.subVectors(si,ii),vn.subVectors(ri,si),On.subVectors(ii,ri);let e=[0,-_n.z,_n.y,0,-vn.z,vn.y,0,-On.z,On.y,_n.z,0,-_n.x,vn.z,0,-vn.x,On.z,0,-On.x,-_n.y,_n.x,0,-vn.y,vn.x,0,-On.y,On.x,0];return!vr(e,ii,si,ri,as)||(e=[1,0,0,0,1,0,0,0,1],!vr(e,ii,si,ri,as))?!1:(cs.crossVectors(_n,vn),e=[cs.x,cs.y,cs.z],vr(e,ii,si,ri,as))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,qe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(qe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(on[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),on[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),on[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),on[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),on[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),on[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),on[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),on[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(on),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const on=[new P,new P,new P,new P,new P,new P,new P,new P],qe=new P,os=new Qn,ii=new P,si=new P,ri=new P,_n=new P,vn=new P,On=new P,Bi=new P,as=new P,cs=new P,Bn=new P;function vr(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Bn.fromArray(i,r);const o=s.x*Math.abs(Bn.x)+s.y*Math.abs(Bn.y)+s.z*Math.abs(Bn.z),l=t.dot(Bn),c=e.dot(Bn),h=n.dot(Bn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const ou=new Qn,zi=new P,xr=new P;class Pi{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ou.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;zi.subVectors(t,this.center);const e=zi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(zi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(xr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(zi.copy(t.center).add(xr)),this.expandByPoint(zi.copy(t.center).sub(xr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const an=new P,Mr=new P,ls=new P,xn=new P,Sr=new P,hs=new P,Er=new P;class _o{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,an)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=an.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(an.copy(this.origin).addScaledVector(this.direction,e),an.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Mr.copy(t).add(e).multiplyScalar(.5),ls.copy(e).sub(t).normalize(),xn.copy(this.origin).sub(Mr);const r=t.distanceTo(e)*.5,a=-this.direction.dot(ls),o=xn.dot(this.direction),l=-xn.dot(ls),c=xn.lengthSq(),h=Math.abs(1-a*a);let u,d,m,_;if(h>0)if(u=a*l-o,d=a*o-l,_=r*h,u>=0)if(d>=-_)if(d<=_){const g=1/h;u*=g,d*=g,m=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;else d<=-_?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+d*(d+2*l)+c):d<=_?(u=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Mr).addScaledVector(ls,d),m}intersectSphere(t,e){an.subVectors(t.center,this.origin);const n=an.dot(this.direction),s=an.dot(an)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,an)!==null}intersectTriangle(t,e,n,s,r){Sr.subVectors(e,t),hs.subVectors(n,t),Er.crossVectors(Sr,hs);let a=this.direction.dot(Er),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;xn.subVectors(this.origin,t);const l=o*this.direction.dot(hs.crossVectors(xn,hs));if(l<0)return null;const c=o*this.direction.dot(Sr.cross(xn));if(c<0||l+c>a)return null;const h=-o*xn.dot(Er);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ee{constructor(t,e,n,s,r,a,o,l,c,h,u,d,m,_,g,p){ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,u,d,m,_,g,p)}set(t,e,n,s,r,a,o,l,c,h,u,d,m,_,g,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=m,f[7]=_,f[11]=g,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ee().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/oi.setFromMatrixColumn(t,0).length(),r=1/oi.setFromMatrixColumn(t,1).length(),a=1/oi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,m=a*u,_=o*h,g=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=m+_*c,e[5]=d-g*c,e[9]=-o*l,e[2]=g-d*c,e[6]=_+m*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*h,m=l*u,_=c*h,g=c*u;e[0]=d+g*o,e[4]=_*o-m,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=m*o-_,e[6]=g+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*h,m=l*u,_=c*h,g=c*u;e[0]=d-g*o,e[4]=-a*u,e[8]=_+m*o,e[1]=m+_*o,e[5]=a*h,e[9]=g-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*h,m=a*u,_=o*h,g=o*u;e[0]=l*h,e[4]=_*c-m,e[8]=d*c+g,e[1]=l*u,e[5]=g*c+d,e[9]=m*c-_,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,m=a*c,_=o*l,g=o*c;e[0]=l*h,e[4]=g-d*u,e[8]=_*u+m,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=m*u+_,e[10]=d-g*u}else if(t.order==="XZY"){const d=a*l,m=a*c,_=o*l,g=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+g,e[5]=a*h,e[9]=m*u-_,e[2]=_*u-m,e[6]=o*h,e[10]=g*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(au,t,cu)}lookAt(t,e,n){const s=this.elements;return Ne.subVectors(t,e),Ne.lengthSq()===0&&(Ne.z=1),Ne.normalize(),Mn.crossVectors(n,Ne),Mn.lengthSq()===0&&(Math.abs(n.z)===1?Ne.x+=1e-4:Ne.z+=1e-4,Ne.normalize(),Mn.crossVectors(n,Ne)),Mn.normalize(),us.crossVectors(Ne,Mn),s[0]=Mn.x,s[4]=us.x,s[8]=Ne.x,s[1]=Mn.y,s[5]=us.y,s[9]=Ne.y,s[2]=Mn.z,s[6]=us.z,s[10]=Ne.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],m=n[13],_=n[2],g=n[6],p=n[10],f=n[14],S=n[3],v=n[7],E=n[11],C=n[15],w=s[0],A=s[4],I=s[8],x=s[12],T=s[1],G=s[5],H=s[9],k=s[13],R=s[2],D=s[6],z=s[10],q=s[14],X=s[3],Y=s[7],K=s[11],tt=s[15];return r[0]=a*w+o*T+l*R+c*X,r[4]=a*A+o*G+l*D+c*Y,r[8]=a*I+o*H+l*z+c*K,r[12]=a*x+o*k+l*q+c*tt,r[1]=h*w+u*T+d*R+m*X,r[5]=h*A+u*G+d*D+m*Y,r[9]=h*I+u*H+d*z+m*K,r[13]=h*x+u*k+d*q+m*tt,r[2]=_*w+g*T+p*R+f*X,r[6]=_*A+g*G+p*D+f*Y,r[10]=_*I+g*H+p*z+f*K,r[14]=_*x+g*k+p*q+f*tt,r[3]=S*w+v*T+E*R+C*X,r[7]=S*A+v*G+E*D+C*Y,r[11]=S*I+v*H+E*z+C*K,r[15]=S*x+v*k+E*q+C*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],m=t[14],_=t[3],g=t[7],p=t[11],f=t[15];return _*(+r*l*u-s*c*u-r*o*d+n*c*d+s*o*m-n*l*m)+g*(+e*l*m-e*c*d+r*a*d-s*a*m+s*c*h-r*l*h)+p*(+e*c*u-e*o*m-r*a*u+n*a*m+r*o*h-n*c*h)+f*(-s*o*h-e*l*u+e*o*d+s*a*u-n*a*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],m=t[11],_=t[12],g=t[13],p=t[14],f=t[15],S=u*p*c-g*d*c+g*l*m-o*p*m-u*l*f+o*d*f,v=_*d*c-h*p*c-_*l*m+a*p*m+h*l*f-a*d*f,E=h*g*c-_*u*c+_*o*m-a*g*m-h*o*f+a*u*f,C=_*u*l-h*g*l-_*o*d+a*g*d+h*o*p-a*u*p,w=e*S+n*v+s*E+r*C;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=S*A,t[1]=(g*d*r-u*p*r-g*s*m+n*p*m+u*s*f-n*d*f)*A,t[2]=(o*p*r-g*l*r+g*s*c-n*p*c-o*s*f+n*l*f)*A,t[3]=(u*l*r-o*d*r-u*s*c+n*d*c+o*s*m-n*l*m)*A,t[4]=v*A,t[5]=(h*p*r-_*d*r+_*s*m-e*p*m-h*s*f+e*d*f)*A,t[6]=(_*l*r-a*p*r-_*s*c+e*p*c+a*s*f-e*l*f)*A,t[7]=(a*d*r-h*l*r+h*s*c-e*d*c-a*s*m+e*l*m)*A,t[8]=E*A,t[9]=(_*u*r-h*g*r-_*n*m+e*g*m+h*n*f-e*u*f)*A,t[10]=(a*g*r-_*o*r+_*n*c-e*g*c-a*n*f+e*o*f)*A,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*m-e*o*m)*A,t[12]=C*A,t[13]=(h*g*s-_*u*s+_*n*d-e*g*d-h*n*p+e*u*p)*A,t[14]=(_*o*s-a*g*s-_*n*l+e*g*l+a*n*p-e*o*p)*A,t[15]=(a*u*s-h*o*s+h*n*l-e*u*l-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,d=r*c,m=r*h,_=r*u,g=a*h,p=a*u,f=o*u,S=l*c,v=l*h,E=l*u,C=n.x,w=n.y,A=n.z;return s[0]=(1-(g+f))*C,s[1]=(m+E)*C,s[2]=(_-v)*C,s[3]=0,s[4]=(m-E)*w,s[5]=(1-(d+f))*w,s[6]=(p+S)*w,s[7]=0,s[8]=(_+v)*A,s[9]=(p-S)*A,s[10]=(1-(d+g))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=oi.set(s[0],s[1],s[2]).length();const a=oi.set(s[4],s[5],s[6]).length(),o=oi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ye.copy(this);const c=1/r,h=1/a,u=1/o;return Ye.elements[0]*=c,Ye.elements[1]*=c,Ye.elements[2]*=c,Ye.elements[4]*=h,Ye.elements[5]*=h,Ye.elements[6]*=h,Ye.elements[8]*=u,Ye.elements[9]*=u,Ye.elements[10]*=u,e.setFromRotationMatrix(Ye),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=dn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let m,_;if(o===dn)m=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Hs)m=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=dn){const l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(a-r),d=(e+t)*c,m=(n+s)*h;let _,g;if(o===dn)_=(a+r)*u,g=-2*u;else if(o===Hs)_=r*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const oi=new P,Ye=new ee,au=new P(0,0,0),cu=new P(1,1,1),Mn=new P,us=new P,Ne=new P,Ta=new ee,ba=new Jn;class $s{constructor(t=0,e=0,n=0,s=$s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(Pe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Pe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Pe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Pe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Pe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Pe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ta.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ta,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ba.setFromEuler(this),this.setFromQuaternion(ba,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}$s.DEFAULT_ORDER="XYZ";class vo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let lu=0;const Aa=new P,ai=new Jn,cn=new ee,fs=new P,Gi=new P,hu=new P,uu=new Jn,wa=new P(1,0,0),Ra=new P(0,1,0),Ca=new P(0,0,1),fu={type:"added"},du={type:"removed"};class ve extends Li{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=Qi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ve.DEFAULT_UP.clone();const t=new P,e=new $s,n=new Jn,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ee},normalMatrix:{value:new zt}}),this.matrix=new ee,this.matrixWorld=new ee,this.matrixAutoUpdate=ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ai.setFromAxisAngle(t,e),this.quaternion.multiply(ai),this}rotateOnWorldAxis(t,e){return ai.setFromAxisAngle(t,e),this.quaternion.premultiply(ai),this}rotateX(t){return this.rotateOnAxis(wa,t)}rotateY(t){return this.rotateOnAxis(Ra,t)}rotateZ(t){return this.rotateOnAxis(Ca,t)}translateOnAxis(t,e){return Aa.copy(t).applyQuaternion(this.quaternion),this.position.add(Aa.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(wa,t)}translateY(t){return this.translateOnAxis(Ra,t)}translateZ(t){return this.translateOnAxis(Ca,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(cn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?fs.copy(t):fs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Gi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?cn.lookAt(Gi,fs,this.up):cn.lookAt(fs,Gi,this.up),this.quaternion.setFromRotationMatrix(cn),s&&(cn.extractRotation(s.matrixWorld),ai.setFromRotationMatrix(cn),this.quaternion.premultiply(ai.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(fu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(du)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),cn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),cn.multiply(t.parent.matrixWorld)),t.applyMatrix4(cn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,t,hu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,uu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),m=a(t.animations),_=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ve.DEFAULT_UP=new P(0,1,0);ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ke=new P,ln=new P,yr=new P,hn=new P,ci=new P,li=new P,La=new P,Tr=new P,br=new P,Ar=new P;let ds=!1;class je{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ke.subVectors(t,e),s.cross(Ke);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ke.subVectors(s,e),ln.subVectors(n,e),yr.subVectors(t,e);const a=Ke.dot(Ke),o=Ke.dot(ln),l=Ke.dot(yr),c=ln.dot(ln),h=ln.dot(yr),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,m=(c*l-o*h)*d,_=(a*h-o*l)*d;return r.set(1-m-_,_,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,hn)===null?!1:hn.x>=0&&hn.y>=0&&hn.x+hn.y<=1}static getUV(t,e,n,s,r,a,o,l){return ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ds=!0),this.getInterpolation(t,e,n,s,r,a,o,l)}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,hn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,hn.x),l.addScaledVector(a,hn.y),l.addScaledVector(o,hn.z),l)}static isFrontFacing(t,e,n,s){return Ke.subVectors(n,e),ln.subVectors(t,e),Ke.cross(ln).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ke.subVectors(this.c,this.b),ln.subVectors(this.a,this.b),Ke.cross(ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return je.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return je.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ds=!0),je.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return je.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return je.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return je.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;ci.subVectors(s,n),li.subVectors(r,n),Tr.subVectors(t,n);const l=ci.dot(Tr),c=li.dot(Tr);if(l<=0&&c<=0)return e.copy(n);br.subVectors(t,s);const h=ci.dot(br),u=li.dot(br);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(ci,a);Ar.subVectors(t,r);const m=ci.dot(Ar),_=li.dot(Ar);if(_>=0&&m<=_)return e.copy(r);const g=m*c-l*_;if(g<=0&&c>=0&&_<=0)return o=c/(c-_),e.copy(n).addScaledVector(li,o);const p=h*_-m*u;if(p<=0&&u-h>=0&&m-_>=0)return La.subVectors(r,s),o=(u-h)/(u-h+(m-_)),e.copy(s).addScaledVector(La,o);const f=1/(p+g+d);return a=g*f,o=d*f,e.copy(n).addScaledVector(ci,a).addScaledVector(li,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Gc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Sn={h:0,s:0,l:0},ps={h:0,s:0,l:0};function wr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=he){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Kt.workingColorSpace){if(t=Qh(t,1),e=Pe(e,0,1),n=Pe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=wr(a,r,t+1/3),this.g=wr(a,r,t),this.b=wr(a,r,t-1/3)}return Kt.toWorkingColorSpace(this,s),this}setStyle(t,e=he){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=he){const n=Gc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ei(t.r),this.g=Ei(t.g),this.b=Ei(t.b),this}copyLinearToSRGB(t){return this.r=mr(t.r),this.g=mr(t.g),this.b=mr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=he){return Kt.fromWorkingColorSpace(Ee.copy(this),t),Math.round(Pe(Ee.r*255,0,255))*65536+Math.round(Pe(Ee.g*255,0,255))*256+Math.round(Pe(Ee.b*255,0,255))}getHexString(t=he){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.fromWorkingColorSpace(Ee.copy(this),e);const n=Ee.r,s=Ee.g,r=Ee.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.fromWorkingColorSpace(Ee.copy(this),e),t.r=Ee.r,t.g=Ee.g,t.b=Ee.b,t}getStyle(t=he){Kt.fromWorkingColorSpace(Ee.copy(this),t);const e=Ee.r,n=Ee.g,s=Ee.b;return t!==he?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Sn),this.setHSL(Sn.h+t,Sn.s+e,Sn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Sn),t.getHSL(ps);const n=dr(Sn.h,ps.h,e),s=dr(Sn.s,ps.s,e),r=dr(Sn.l,ps.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ee=new Ht;Ht.NAMES=Gc;let pu=0;class Di extends Li{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pu++}),this.uuid=Qi(),this.name="",this.type="Material",this.blending=Si,this.side=pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xr,this.blendDst=qr,this.blendEquation=Wn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=Os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ga,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ei,this.stencilZFail=ei,this.stencilZPass=ei,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Si&&(n.blending=this.blending),this.side!==pn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xr&&(n.blendSrc=this.blendSrc),this.blendDst!==qr&&(n.blendDst=this.blendDst),this.blendEquation!==Wn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Os&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ga&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ei&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ei&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ei&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class wi extends Di{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=po,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const le=new P,ms=new Vt;class xe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=_a,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ms.fromBufferAttribute(this,e),ms.applyMatrix3(t),this.setXY(e,ms.x,ms.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)le.fromBufferAttribute(this,e),le.applyMatrix3(t),this.setXYZ(e,le.x,le.y,le.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)le.fromBufferAttribute(this,e),le.applyMatrix4(t),this.setXYZ(e,le.x,le.y,le.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)le.fromBufferAttribute(this,e),le.applyNormalMatrix(t),this.setXYZ(e,le.x,le.y,le.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)le.fromBufferAttribute(this,e),le.transformDirection(t),this.setXYZ(e,le.x,le.y,le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Oi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Le(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Oi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Oi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Oi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Oi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array),s=Le(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array),s=Le(s,this.array),r=Le(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==_a&&(t.usage=this.usage),t}}class Hc extends xe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Vc extends xe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ye extends xe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let mu=0;const He=new ee,Rr=new ve,hi=new P,Fe=new Qn,Hi=new Qn,me=new P;class _e extends Li{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=Qi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Fc(t)?Vc:Hc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return He.makeRotationFromQuaternion(t),this.applyMatrix4(He),this}rotateX(t){return He.makeRotationX(t),this.applyMatrix4(He),this}rotateY(t){return He.makeRotationY(t),this.applyMatrix4(He),this}rotateZ(t){return He.makeRotationZ(t),this.applyMatrix4(He),this}translate(t,e,n){return He.makeTranslation(t,e,n),this.applyMatrix4(He),this}scale(t,e,n){return He.makeScale(t,e,n),this.applyMatrix4(He),this}lookAt(t){return Rr.lookAt(t),Rr.updateMatrix(),this.applyMatrix4(Rr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hi).negate(),this.translate(hi.x,hi.y,hi.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ye(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Fe.setFromBufferAttribute(r),this.morphTargetsRelative?(me.addVectors(this.boundingBox.min,Fe.min),this.boundingBox.expandByPoint(me),me.addVectors(this.boundingBox.max,Fe.max),this.boundingBox.expandByPoint(me)):(this.boundingBox.expandByPoint(Fe.min),this.boundingBox.expandByPoint(Fe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Pi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(Fe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Hi.setFromBufferAttribute(o),this.morphTargetsRelative?(me.addVectors(Fe.min,Hi.min),Fe.expandByPoint(me),me.addVectors(Fe.max,Hi.max),Fe.expandByPoint(me)):(Fe.expandByPoint(Hi.min),Fe.expandByPoint(Hi.max))}Fe.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)me.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(me));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)me.fromBufferAttribute(o,c),l&&(hi.fromBufferAttribute(t,c),me.add(hi)),s=Math.max(s,n.distanceToSquared(me))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xe(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<o;T++)c[T]=new P,h[T]=new P;const u=new P,d=new P,m=new P,_=new Vt,g=new Vt,p=new Vt,f=new P,S=new P;function v(T,G,H){u.fromArray(s,T*3),d.fromArray(s,G*3),m.fromArray(s,H*3),_.fromArray(a,T*2),g.fromArray(a,G*2),p.fromArray(a,H*2),d.sub(u),m.sub(u),g.sub(_),p.sub(_);const k=1/(g.x*p.y-p.x*g.y);isFinite(k)&&(f.copy(d).multiplyScalar(p.y).addScaledVector(m,-g.y).multiplyScalar(k),S.copy(m).multiplyScalar(g.x).addScaledVector(d,-p.x).multiplyScalar(k),c[T].add(f),c[G].add(f),c[H].add(f),h[T].add(S),h[G].add(S),h[H].add(S))}let E=this.groups;E.length===0&&(E=[{start:0,count:n.length}]);for(let T=0,G=E.length;T<G;++T){const H=E[T],k=H.start,R=H.count;for(let D=k,z=k+R;D<z;D+=3)v(n[D+0],n[D+1],n[D+2])}const C=new P,w=new P,A=new P,I=new P;function x(T){A.fromArray(r,T*3),I.copy(A);const G=c[T];C.copy(G),C.sub(A.multiplyScalar(A.dot(G))).normalize(),w.crossVectors(I,G);const k=w.dot(h[T])<0?-1:1;l[T*4]=C.x,l[T*4+1]=C.y,l[T*4+2]=C.z,l[T*4+3]=k}for(let T=0,G=E.length;T<G;++T){const H=E[T],k=H.start,R=H.count;for(let D=k,z=k+R;D<z;D+=3)x(n[D+0]),x(n[D+1]),x(n[D+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new xe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,u=new P;if(t)for(let d=0,m=t.count;d<m;d+=3){const _=t.getX(d+0),g=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),a.fromBufferAttribute(e,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=e.count;d<m;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)me.fromBufferAttribute(t,e),me.normalize(),t.setXYZ(e,me.x,me.y,me.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let m=0,_=0;for(let g=0,p=l.length;g<p;g++){o.isInterleavedBufferAttribute?m=l[g]*o.data.stride+o.offset:m=l[g]*h;for(let f=0;f<h;f++)d[_++]=c[m++]}return new xe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new _e,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],m=t(d,n);l.push(m)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const m=c[u];h.push(m.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pa=new ee,zn=new _o,gs=new Pi,Da=new P,ui=new P,fi=new P,di=new P,Cr=new P,_s=new P,vs=new Vt,xs=new Vt,Ms=new Vt,Ua=new P,Ia=new P,Na=new P,Ss=new P,Es=new P;class Ce extends ve{constructor(t=new _e,e=new wi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){_s.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Cr.fromBufferAttribute(u,t),a?_s.addScaledVector(Cr,h):_s.addScaledVector(Cr.sub(e),h))}e.add(_s)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),gs.copy(n.boundingSphere),gs.applyMatrix4(r),zn.copy(t.ray).recast(t.near),!(gs.containsPoint(zn.origin)===!1&&(zn.intersectSphere(gs,Da)===null||zn.origin.distanceToSquared(Da)>(t.far-t.near)**2))&&(Pa.copy(r).invert(),zn.copy(t.ray).applyMatrix4(Pa),!(n.boundingBox!==null&&zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,zn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,g=d.length;_<g;_++){const p=d[_],f=a[p.materialIndex],S=Math.max(p.start,m.start),v=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let E=S,C=v;E<C;E+=3){const w=o.getX(E),A=o.getX(E+1),I=o.getX(E+2);s=ys(this,f,t,n,c,h,u,w,A,I),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const _=Math.max(0,m.start),g=Math.min(o.count,m.start+m.count);for(let p=_,f=g;p<f;p+=3){const S=o.getX(p),v=o.getX(p+1),E=o.getX(p+2);s=ys(this,a,t,n,c,h,u,S,v,E),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,g=d.length;_<g;_++){const p=d[_],f=a[p.materialIndex],S=Math.max(p.start,m.start),v=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let E=S,C=v;E<C;E+=3){const w=E,A=E+1,I=E+2;s=ys(this,f,t,n,c,h,u,w,A,I),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const _=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let p=_,f=g;p<f;p+=3){const S=p,v=p+1,E=p+2;s=ys(this,a,t,n,c,h,u,S,v,E),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function gu(i,t,e,n,s,r,a,o){let l;if(t.side===De?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===pn,o),l===null)return null;Es.copy(o),Es.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Es);return c<e.near||c>e.far?null:{distance:c,point:Es.clone(),object:i}}function ys(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,ui),i.getVertexPosition(l,fi),i.getVertexPosition(c,di);const h=gu(i,t,e,n,ui,fi,di,Ss);if(h){s&&(vs.fromBufferAttribute(s,o),xs.fromBufferAttribute(s,l),Ms.fromBufferAttribute(s,c),h.uv=je.getInterpolation(Ss,ui,fi,di,vs,xs,Ms,new Vt)),r&&(vs.fromBufferAttribute(r,o),xs.fromBufferAttribute(r,l),Ms.fromBufferAttribute(r,c),h.uv1=je.getInterpolation(Ss,ui,fi,di,vs,xs,Ms,new Vt),h.uv2=h.uv1),a&&(Ua.fromBufferAttribute(a,o),Ia.fromBufferAttribute(a,l),Na.fromBufferAttribute(a,c),h.normal=je.getInterpolation(Ss,ui,fi,di,Ua,Ia,Na,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new P,materialIndex:0};je.getNormal(ui,fi,di,u.normal),h.face=u}return h}class Ui extends _e{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,m=0;_("z","y","x",-1,-1,n,e,t,a,r,0),_("z","y","x",1,-1,n,e,-t,a,r,1),_("x","z","y",1,1,t,n,e,s,a,2),_("x","z","y",1,-1,t,n,-e,s,a,3),_("x","y","z",1,-1,t,e,n,s,r,4),_("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ye(c,3)),this.setAttribute("normal",new ye(h,3)),this.setAttribute("uv",new ye(u,2));function _(g,p,f,S,v,E,C,w,A,I,x){const T=E/A,G=C/I,H=E/2,k=C/2,R=w/2,D=A+1,z=I+1;let q=0,X=0;const Y=new P;for(let K=0;K<z;K++){const tt=K*G-k;for(let et=0;et<D;et++){const W=et*T-H;Y[g]=W*S,Y[p]=tt*v,Y[f]=R,c.push(Y.x,Y.y,Y.z),Y[g]=0,Y[p]=0,Y[f]=w>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(et/A),u.push(1-K/I),q+=1}}for(let K=0;K<I;K++)for(let tt=0;tt<A;tt++){const et=d+tt+D*K,W=d+tt+D*(K+1),j=d+(tt+1)+D*(K+1),at=d+(tt+1)+D*K;l.push(et,W,at),l.push(W,j,at),X+=6}o.addGroup(m,X,x),m+=X,d+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ui(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ri(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function we(i){const t={};for(let e=0;e<i.length;e++){const n=Ri(i[e]);for(const s in n)t[s]=n[s]}return t}function _u(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function kc(i){return i.getRenderTarget()===null?i.outputColorSpace:Kt.workingColorSpace}const Wc={clone:Ri,merge:we};var vu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Un extends Di{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vu,this.fragmentShader=xu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ri(t.uniforms),this.uniformsGroups=_u(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Xc extends ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ee,this.projectionMatrix=new ee,this.projectionMatrixInverse=new ee,this.coordinateSystem=dn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class We extends Xc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Jr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Jr*2*Math.atan(Math.tan(fr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(fr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const pi=-90,mi=1;class Mu extends ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new We(pi,mi,t,e);s.layers=this.layers,this.add(s);const r=new We(pi,mi,t,e);r.layers=this.layers,this.add(r);const a=new We(pi,mi,t,e);a.layers=this.layers,this.add(a);const o=new We(pi,mi,t,e);o.layers=this.layers,this.add(o);const l=new We(pi,mi,t,e);l.layers=this.layers,this.add(l);const c=new We(pi,mi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Hs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,m),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class qc extends Ue{constructor(t,e,n,s,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ti,super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Su extends Zn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Yi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===jn?he:Xe),this.texture=new qc(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ke}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ui(5,5,5),r=new Un({name:"CubemapFromEquirect",uniforms:Ri(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:De,blending:An});r.uniforms.tEquirect.value=e;const a=new Ce(s,r),o=e.minFilter;return e.minFilter===Ki&&(e.minFilter=ke),new Mu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const Lr=new P,Eu=new P,yu=new zt;class En{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Lr.subVectors(n,e).cross(Eu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Lr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||yu.getNormalMatrix(t),s=this.coplanarPoint(Lr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gn=new Pi,Ts=new P;class xo{constructor(t=new En,e=new En,n=new En,s=new En,r=new En,a=new En){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=dn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],m=s[8],_=s[9],g=s[10],p=s[11],f=s[12],S=s[13],v=s[14],E=s[15];if(n[0].setComponents(l-r,d-c,p-m,E-f).normalize(),n[1].setComponents(l+r,d+c,p+m,E+f).normalize(),n[2].setComponents(l+a,d+h,p+_,E+S).normalize(),n[3].setComponents(l-a,d-h,p-_,E-S).normalize(),n[4].setComponents(l-o,d-u,p-g,E-v).normalize(),e===dn)n[5].setComponents(l+o,d+u,p+g,E+v).normalize();else if(e===Hs)n[5].setComponents(o,u,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Gn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Gn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Gn)}intersectsSprite(t){return Gn.center.set(0,0,0),Gn.radius=.7071067811865476,Gn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Gn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ts.x=s.normal.x>0?t.max.x:t.min.x,Ts.y=s.normal.y>0?t.max.y:t.min.y,Ts.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ts)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Yc(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Tu(i,t){const e=t.isWebGL2,n=new WeakMap;function s(c,h){const u=c.array,d=c.usage,m=u.byteLength,_=i.createBuffer();i.bindBuffer(h,_),i.bufferData(h,u,d),c.onUploadCallback();let g;if(u instanceof Float32Array)g=i.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)g=i.SHORT;else if(u instanceof Uint32Array)g=i.UNSIGNED_INT;else if(u instanceof Int32Array)g=i.INT;else if(u instanceof Int8Array)g=i.BYTE;else if(u instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:_,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:m}}function r(c,h,u){const d=h.array,m=h._updateRange,_=h.updateRanges;if(i.bindBuffer(u,c),m.count===-1&&_.length===0&&i.bufferSubData(u,0,d),_.length!==0){for(let g=0,p=_.length;g<p;g++){const f=_[g];e?i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}m.count!==-1&&(e?i.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):i.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:a,remove:o,update:l}}class Mo extends _e{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=t/o,d=e/l,m=[],_=[],g=[],p=[];for(let f=0;f<h;f++){const S=f*d-a;for(let v=0;v<c;v++){const E=v*u-r;_.push(E,-S,0),g.push(0,0,1),p.push(v/o),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let S=0;S<o;S++){const v=S+c*f,E=S+c*(f+1),C=S+1+c*(f+1),w=S+1+c*f;m.push(v,E,w),m.push(E,C,w)}this.setIndex(m),this.setAttribute("position",new ye(_,3)),this.setAttribute("normal",new ye(g,3)),this.setAttribute("uv",new ye(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mo(t.width,t.height,t.widthSegments,t.heightSegments)}}var bu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Au=`#ifdef USE_ALPHAHASH
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
#endif`,wu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ru=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Lu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pu=`#ifdef USE_AOMAP
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
#endif`,Du=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Uu=`#ifdef USE_BATCHING
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
#endif`,Iu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Nu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Fu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ou=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Bu=`#ifdef USE_IRIDESCENCE
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
#endif`,zu=`#ifdef USE_BUMPMAP
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
#endif`,Gu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Hu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Vu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ku=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Wu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Xu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,qu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Yu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Ku=`#define PI 3.141592653589793
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
} // validated`,ju=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,$u=`vec3 transformedNormal = objectNormal;
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
#endif`,Zu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ju=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Qu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ef="gl_FragColor = linearToOutputTexel( gl_FragColor );",nf=`
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
}`,sf=`#ifdef USE_ENVMAP
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
#endif`,rf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,of=`#ifdef USE_ENVMAP
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
#endif`,af=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cf=`#ifdef USE_ENVMAP
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
#endif`,lf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,hf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,uf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ff=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,df=`#ifdef USE_GRADIENTMAP
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
}`,pf=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,mf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_f=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vf=`uniform bool receiveShadow;
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
#endif`,xf=`#ifdef USE_ENVMAP
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
#endif`,Mf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Sf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ef=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,yf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tf=`PhysicalMaterial material;
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
#endif`,bf=`struct PhysicalMaterial {
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
}`,Af=`
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
#endif`,wf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Rf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Lf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Df=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Uf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,If=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ff=`#if defined( USE_POINTS_UV )
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
#endif`,Of=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zf=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gf=`#ifdef USE_MORPHNORMALS
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
#endif`,Hf=`#ifdef USE_MORPHTARGETS
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
#endif`,Vf=`#ifdef USE_MORPHTARGETS
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
vec3 nonPerturbedNormal = normal;`,Wf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Xf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Kf=`#ifdef USE_NORMALMAP
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
#endif`,jf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$f=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Zf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Qf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,td=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ed=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,id=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,od=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ad=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ld=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,hd=`float getShadowMask() {
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
}`,ud=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fd=`#ifdef USE_SKINNING
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
#endif`,dd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pd=`#ifdef USE_SKINNING
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
#endif`,md=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_d=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,xd=`#ifdef USE_TRANSMISSION
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
#endif`,Md=`#ifdef USE_TRANSMISSION
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
#endif`,Sd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ed=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Td=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const bd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ad=`uniform sampler2D t2D;
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
}`,wd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rd=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Cd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ld=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pd=`#include <common>
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
}`,Dd=`#if DEPTH_PACKING == 3200
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
}`,Ud=`#define DISTANCE
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
}`,Id=`#define DISTANCE
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
}`,Nd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Fd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Od=`uniform float scale;
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
}`,Bd=`uniform vec3 diffuse;
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
}`,zd=`#include <common>
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
}`,Gd=`uniform vec3 diffuse;
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
}`,Hd=`#define LAMBERT
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
}`,Vd=`#define LAMBERT
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
}`,kd=`#define MATCAP
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
}`,Wd=`#define MATCAP
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
}`,Xd=`#define NORMAL
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
}`,qd=`#define NORMAL
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
}`,Yd=`#define PHONG
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
}`,Kd=`#define PHONG
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
}`,jd=`#define STANDARD
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
}`,$d=`#define STANDARD
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
}`,Zd=`#define TOON
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
}`,Jd=`#define TOON
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
}`,Qd=`uniform float size;
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
}`,tp=`uniform vec3 diffuse;
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
}`,ep=`#include <common>
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
}`,np=`uniform vec3 color;
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
}`,ip=`uniform float rotation;
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
}`,sp=`uniform vec3 diffuse;
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
}`,Dt={alphahash_fragment:bu,alphahash_pars_fragment:Au,alphamap_fragment:wu,alphamap_pars_fragment:Ru,alphatest_fragment:Cu,alphatest_pars_fragment:Lu,aomap_fragment:Pu,aomap_pars_fragment:Du,batching_pars_vertex:Uu,batching_vertex:Iu,begin_vertex:Nu,beginnormal_vertex:Fu,bsdfs:Ou,iridescence_fragment:Bu,bumpmap_pars_fragment:zu,clipping_planes_fragment:Gu,clipping_planes_pars_fragment:Hu,clipping_planes_pars_vertex:Vu,clipping_planes_vertex:ku,color_fragment:Wu,color_pars_fragment:Xu,color_pars_vertex:qu,color_vertex:Yu,common:Ku,cube_uv_reflection_fragment:ju,defaultnormal_vertex:$u,displacementmap_pars_vertex:Zu,displacementmap_vertex:Ju,emissivemap_fragment:Qu,emissivemap_pars_fragment:tf,colorspace_fragment:ef,colorspace_pars_fragment:nf,envmap_fragment:sf,envmap_common_pars_fragment:rf,envmap_pars_fragment:of,envmap_pars_vertex:af,envmap_physical_pars_fragment:xf,envmap_vertex:cf,fog_vertex:lf,fog_pars_vertex:hf,fog_fragment:uf,fog_pars_fragment:ff,gradientmap_pars_fragment:df,lightmap_fragment:pf,lightmap_pars_fragment:mf,lights_lambert_fragment:gf,lights_lambert_pars_fragment:_f,lights_pars_begin:vf,lights_toon_fragment:Mf,lights_toon_pars_fragment:Sf,lights_phong_fragment:Ef,lights_phong_pars_fragment:yf,lights_physical_fragment:Tf,lights_physical_pars_fragment:bf,lights_fragment_begin:Af,lights_fragment_maps:wf,lights_fragment_end:Rf,logdepthbuf_fragment:Cf,logdepthbuf_pars_fragment:Lf,logdepthbuf_pars_vertex:Pf,logdepthbuf_vertex:Df,map_fragment:Uf,map_pars_fragment:If,map_particle_fragment:Nf,map_particle_pars_fragment:Ff,metalnessmap_fragment:Of,metalnessmap_pars_fragment:Bf,morphcolor_vertex:zf,morphnormal_vertex:Gf,morphtarget_pars_vertex:Hf,morphtarget_vertex:Vf,normal_fragment_begin:kf,normal_fragment_maps:Wf,normal_pars_fragment:Xf,normal_pars_vertex:qf,normal_vertex:Yf,normalmap_pars_fragment:Kf,clearcoat_normal_fragment_begin:jf,clearcoat_normal_fragment_maps:$f,clearcoat_pars_fragment:Zf,iridescence_pars_fragment:Jf,opaque_fragment:Qf,packing:td,premultiplied_alpha_fragment:ed,project_vertex:nd,dithering_fragment:id,dithering_pars_fragment:sd,roughnessmap_fragment:rd,roughnessmap_pars_fragment:od,shadowmap_pars_fragment:ad,shadowmap_pars_vertex:cd,shadowmap_vertex:ld,shadowmask_pars_fragment:hd,skinbase_vertex:ud,skinning_pars_vertex:fd,skinning_vertex:dd,skinnormal_vertex:pd,specularmap_fragment:md,specularmap_pars_fragment:gd,tonemapping_fragment:_d,tonemapping_pars_fragment:vd,transmission_fragment:xd,transmission_pars_fragment:Md,uv_pars_fragment:Sd,uv_pars_vertex:Ed,uv_vertex:yd,worldpos_vertex:Td,background_vert:bd,background_frag:Ad,backgroundCube_vert:wd,backgroundCube_frag:Rd,cube_vert:Cd,cube_frag:Ld,depth_vert:Pd,depth_frag:Dd,distanceRGBA_vert:Ud,distanceRGBA_frag:Id,equirect_vert:Nd,equirect_frag:Fd,linedashed_vert:Od,linedashed_frag:Bd,meshbasic_vert:zd,meshbasic_frag:Gd,meshlambert_vert:Hd,meshlambert_frag:Vd,meshmatcap_vert:kd,meshmatcap_frag:Wd,meshnormal_vert:Xd,meshnormal_frag:qd,meshphong_vert:Yd,meshphong_frag:Kd,meshphysical_vert:jd,meshphysical_frag:$d,meshtoon_vert:Zd,meshtoon_frag:Jd,points_vert:Qd,points_frag:tp,shadow_vert:ep,shadow_frag:np,sprite_vert:ip,sprite_frag:sp},nt={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new Vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new Vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},en={basic:{uniforms:we([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.fog]),vertexShader:Dt.meshbasic_vert,fragmentShader:Dt.meshbasic_frag},lambert:{uniforms:we([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Dt.meshlambert_vert,fragmentShader:Dt.meshlambert_frag},phong:{uniforms:we([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Dt.meshphong_vert,fragmentShader:Dt.meshphong_frag},standard:{uniforms:we([nt.common,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.roughnessmap,nt.metalnessmap,nt.fog,nt.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Dt.meshphysical_vert,fragmentShader:Dt.meshphysical_frag},toon:{uniforms:we([nt.common,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.gradientmap,nt.fog,nt.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Dt.meshtoon_vert,fragmentShader:Dt.meshtoon_frag},matcap:{uniforms:we([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,{matcap:{value:null}}]),vertexShader:Dt.meshmatcap_vert,fragmentShader:Dt.meshmatcap_frag},points:{uniforms:we([nt.points,nt.fog]),vertexShader:Dt.points_vert,fragmentShader:Dt.points_frag},dashed:{uniforms:we([nt.common,nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Dt.linedashed_vert,fragmentShader:Dt.linedashed_frag},depth:{uniforms:we([nt.common,nt.displacementmap]),vertexShader:Dt.depth_vert,fragmentShader:Dt.depth_frag},normal:{uniforms:we([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,{opacity:{value:1}}]),vertexShader:Dt.meshnormal_vert,fragmentShader:Dt.meshnormal_frag},sprite:{uniforms:we([nt.sprite,nt.fog]),vertexShader:Dt.sprite_vert,fragmentShader:Dt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Dt.background_vert,fragmentShader:Dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Dt.backgroundCube_vert,fragmentShader:Dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Dt.cube_vert,fragmentShader:Dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Dt.equirect_vert,fragmentShader:Dt.equirect_frag},distanceRGBA:{uniforms:we([nt.common,nt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Dt.distanceRGBA_vert,fragmentShader:Dt.distanceRGBA_frag},shadow:{uniforms:we([nt.lights,nt.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Dt.shadow_vert,fragmentShader:Dt.shadow_frag}};en.physical={uniforms:we([en.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new Vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new Vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new Vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:Dt.meshphysical_vert,fragmentShader:Dt.meshphysical_frag};const bs={r:0,b:0,g:0};function rp(i,t,e,n,s,r,a){const o=new Ht(0);let l=r===!0?0:1,c,h,u=null,d=0,m=null;function _(p,f){let S=!1,v=f.isScene===!0?f.background:null;v&&v.isTexture&&(v=(f.backgroundBlurriness>0?e:t).get(v)),v===null?g(o,l):v&&v.isColor&&(g(v,1),S=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Ks)?(h===void 0&&(h=new Ce(new Ui(1,1,1),new Un({name:"BackgroundCubeMaterial",uniforms:Ri(en.backgroundCube.uniforms),vertexShader:en.backgroundCube.vertexShader,fragmentShader:en.backgroundCube.fragmentShader,side:De,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=Kt.getTransfer(v.colorSpace)!==Jt,(u!==v||d!==v.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,m=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Ce(new Mo(2,2),new Un({name:"BackgroundMaterial",uniforms:Ri(en.background.uniforms),vertexShader:en.background.vertexShader,fragmentShader:en.background.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,c.material.toneMapped=Kt.getTransfer(v.colorSpace)!==Jt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,m=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function g(p,f){p.getRGB(bs,kc(i)),n.buffers.color.setClear(bs.r,bs.g,bs.b,f,a)}return{getClearColor:function(){return o},setClearColor:function(p,f=1){o.set(p),l=f,g(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,g(o,l)},render:_}}function op(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=p(null);let c=l,h=!1;function u(R,D,z,q,X){let Y=!1;if(a){const K=g(q,z,D);c!==K&&(c=K,m(c.object)),Y=f(R,q,z,X),Y&&S(R,q,z,X)}else{const K=D.wireframe===!0;(c.geometry!==q.id||c.program!==z.id||c.wireframe!==K)&&(c.geometry=q.id,c.program=z.id,c.wireframe=K,Y=!0)}X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(Y||h)&&(h=!1,I(R,D,z,q),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(R){return n.isWebGL2?i.bindVertexArray(R):r.bindVertexArrayOES(R)}function _(R){return n.isWebGL2?i.deleteVertexArray(R):r.deleteVertexArrayOES(R)}function g(R,D,z){const q=z.wireframe===!0;let X=o[R.id];X===void 0&&(X={},o[R.id]=X);let Y=X[D.id];Y===void 0&&(Y={},X[D.id]=Y);let K=Y[q];return K===void 0&&(K=p(d()),Y[q]=K),K}function p(R){const D=[],z=[],q=[];for(let X=0;X<s;X++)D[X]=0,z[X]=0,q[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:z,attributeDivisors:q,object:R,attributes:{},index:null}}function f(R,D,z,q){const X=c.attributes,Y=D.attributes;let K=0;const tt=z.getAttributes();for(const et in tt)if(tt[et].location>=0){const j=X[et];let at=Y[et];if(at===void 0&&(et==="instanceMatrix"&&R.instanceMatrix&&(at=R.instanceMatrix),et==="instanceColor"&&R.instanceColor&&(at=R.instanceColor)),j===void 0||j.attribute!==at||at&&j.data!==at.data)return!0;K++}return c.attributesNum!==K||c.index!==q}function S(R,D,z,q){const X={},Y=D.attributes;let K=0;const tt=z.getAttributes();for(const et in tt)if(tt[et].location>=0){let j=Y[et];j===void 0&&(et==="instanceMatrix"&&R.instanceMatrix&&(j=R.instanceMatrix),et==="instanceColor"&&R.instanceColor&&(j=R.instanceColor));const at={};at.attribute=j,j&&j.data&&(at.data=j.data),X[et]=at,K++}c.attributes=X,c.attributesNum=K,c.index=q}function v(){const R=c.newAttributes;for(let D=0,z=R.length;D<z;D++)R[D]=0}function E(R){C(R,0)}function C(R,D){const z=c.newAttributes,q=c.enabledAttributes,X=c.attributeDivisors;z[R]=1,q[R]===0&&(i.enableVertexAttribArray(R),q[R]=1),X[R]!==D&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,D),X[R]=D)}function w(){const R=c.newAttributes,D=c.enabledAttributes;for(let z=0,q=D.length;z<q;z++)D[z]!==R[z]&&(i.disableVertexAttribArray(z),D[z]=0)}function A(R,D,z,q,X,Y,K){K===!0?i.vertexAttribIPointer(R,D,z,X,Y):i.vertexAttribPointer(R,D,z,q,X,Y)}function I(R,D,z,q){if(n.isWebGL2===!1&&(R.isInstancedMesh||q.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const X=q.attributes,Y=z.getAttributes(),K=D.defaultAttributeValues;for(const tt in Y){const et=Y[tt];if(et.location>=0){let W=X[tt];if(W===void 0&&(tt==="instanceMatrix"&&R.instanceMatrix&&(W=R.instanceMatrix),tt==="instanceColor"&&R.instanceColor&&(W=R.instanceColor)),W!==void 0){const j=W.normalized,at=W.itemSize,mt=e.get(W);if(mt===void 0)continue;const pt=mt.buffer,Rt=mt.type,Lt=mt.bytesPerElement,St=n.isWebGL2===!0&&(Rt===i.INT||Rt===i.UNSIGNED_INT||W.gpuType===bc);if(W.isInterleavedBufferAttribute){const kt=W.data,N=kt.stride,Te=W.offset;if(kt.isInstancedInterleavedBuffer){for(let _t=0;_t<et.locationSize;_t++)C(et.location+_t,kt.meshPerAttribute);R.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=kt.meshPerAttribute*kt.count)}else for(let _t=0;_t<et.locationSize;_t++)E(et.location+_t);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let _t=0;_t<et.locationSize;_t++)A(et.location+_t,at/et.locationSize,Rt,j,N*Lt,(Te+at/et.locationSize*_t)*Lt,St)}else{if(W.isInstancedBufferAttribute){for(let kt=0;kt<et.locationSize;kt++)C(et.location+kt,W.meshPerAttribute);R.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let kt=0;kt<et.locationSize;kt++)E(et.location+kt);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let kt=0;kt<et.locationSize;kt++)A(et.location+kt,at/et.locationSize,Rt,j,at*Lt,at/et.locationSize*kt*Lt,St)}}else if(K!==void 0){const j=K[tt];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(et.location,j);break;case 3:i.vertexAttrib3fv(et.location,j);break;case 4:i.vertexAttrib4fv(et.location,j);break;default:i.vertexAttrib1fv(et.location,j)}}}}w()}function x(){H();for(const R in o){const D=o[R];for(const z in D){const q=D[z];for(const X in q)_(q[X].object),delete q[X];delete D[z]}delete o[R]}}function T(R){if(o[R.id]===void 0)return;const D=o[R.id];for(const z in D){const q=D[z];for(const X in q)_(q[X].object),delete q[X];delete D[z]}delete o[R.id]}function G(R){for(const D in o){const z=o[D];if(z[R.id]===void 0)continue;const q=z[R.id];for(const X in q)_(q[X].object),delete q[X];delete z[R.id]}}function H(){k(),h=!0,c!==l&&(c=l,m(c.object))}function k(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:H,resetDefaultState:k,dispose:x,releaseStatesOfGeometry:T,releaseStatesOfProgram:G,initAttributes:v,enableAttribute:E,disableUnusedAttributes:w}}function ap(i,t,e,n){const s=n.isWebGL2;let r;function a(h){r=h}function o(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function l(h,u,d){if(d===0)return;let m,_;if(s)m=i,_="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),_="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[_](r,h,u,d),e.update(u,r,d)}function c(h,u,d){if(d===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<d;_++)this.render(h[_],u[_]);else{m.multiDrawArraysWEBGL(r,h,0,u,0,d);let _=0;for(let g=0;g<d;g++)_+=u[g];e.update(_,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function cp(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),f=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=d>0,E=a||t.has("OES_texture_float"),C=v&&E,w=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:p,maxVaryings:f,maxFragmentUniforms:S,vertexTextures:v,floatFragmentTextures:E,floatVertexTextures:C,maxSamples:w}}function lp(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new En,o=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const m=u.length!==0||d||n!==0||s;return s=d,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,m){const _=u.clippingPlanes,g=u.clipIntersection,p=u.clipShadows,f=i.get(u);if(!s||_===null||_.length===0||r&&!p)r?h(null):c();else{const S=r?0:n,v=S*4;let E=f.clippingState||null;l.value=E,E=h(_,d,v,m);for(let C=0;C!==v;++C)E[C]=e[C];f.clippingState=E,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,m,_){const g=u!==null?u.length:0;let p=null;if(g!==0){if(p=l.value,_!==!0||p===null){const f=m+g*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(p===null||p.length<f)&&(p=new Float32Array(f));for(let v=0,E=m;v!==g;++v,E+=4)a.copy(u[v]).applyMatrix4(S,o),a.normal.toArray(p,E),p[E+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function hp(i){let t=new WeakMap;function e(a,o){return o===Yr?a.mapping=Ti:o===Kr&&(a.mapping=bi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Yr||o===Kr)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Su(l.height/2);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Kc extends Xc{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const vi=4,Fa=[.125,.215,.35,.446,.526,.582],Xn=20,Pr=new Kc,Oa=new Ht;let Dr=null,Ur=0,Ir=0;const kn=(1+Math.sqrt(5))/2,gi=1/kn,Ba=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,kn,gi),new P(0,kn,-gi),new P(gi,0,kn),new P(-gi,0,kn),new P(kn,gi,0),new P(-kn,gi,0)];class za{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Dr=this._renderer.getRenderTarget(),Ur=this._renderer.getActiveCubeFace(),Ir=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Va(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ha(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Dr,Ur,Ir),t.scissorTest=!1,As(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ti||t.mapping===bi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Dr=this._renderer.getRenderTarget(),Ur=this._renderer.getActiveCubeFace(),Ir=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ke,minFilter:ke,generateMipmaps:!1,type:ji,format:Qe,colorSpace:mn,depthBuffer:!1},s=Ga(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ga(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=up(r)),this._blurMaterial=fp(r,t,e)}return s}_compileMaterial(t){const e=new Ce(this._lodPlanes[0],t);this._renderer.compile(e,Pr)}_sceneToCubeUV(t,e,n,s){const o=new We(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Oa),h.toneMapping=wn,h.autoClear=!1;const m=new wi({name:"PMREM.Background",side:De,depthWrite:!1,depthTest:!1}),_=new Ce(new Ui,m);let g=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,g=!0):(m.color.copy(Oa),g=!0);for(let f=0;f<6;f++){const S=f%3;S===0?(o.up.set(0,l[f],0),o.lookAt(c[f],0,0)):S===1?(o.up.set(0,0,l[f]),o.lookAt(0,c[f],0)):(o.up.set(0,l[f],0),o.lookAt(0,0,c[f]));const v=this._cubeSize;As(s,S*v,f>2?v:0,v,v),h.setRenderTarget(s),g&&h.render(_,o),h.render(t,o)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ti||t.mapping===bi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Va()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ha());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ce(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;As(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Pr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Ba[(s-1)%Ba.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ce(this._lodPlanes[s],c),d=c.uniforms,m=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Xn-1),g=r/_,p=isFinite(r)?1+Math.floor(h*g):Xn;p>Xn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Xn}`);const f=[];let S=0;for(let A=0;A<Xn;++A){const I=A/g,x=Math.exp(-I*I/2);f.push(x),A===0?S+=x:A<p&&(S+=2*x)}for(let A=0;A<f.length;A++)f[A]=f[A]/S;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:v}=this;d.dTheta.value=_,d.mipInt.value=v-n;const E=this._sizeLods[s],C=3*E*(s>v-vi?s-v+vi:0),w=4*(this._cubeSize-E);As(e,C,w,3*E,2*E),l.setRenderTarget(e),l.render(u,Pr)}}function up(i){const t=[],e=[],n=[];let s=i;const r=i-vi+1+Fa.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-vi?l=Fa[a-i+vi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,_=6,g=3,p=2,f=1,S=new Float32Array(g*_*m),v=new Float32Array(p*_*m),E=new Float32Array(f*_*m);for(let w=0;w<m;w++){const A=w%3*2/3-1,I=w>2?0:-1,x=[A,I,0,A+2/3,I,0,A+2/3,I+1,0,A,I,0,A+2/3,I+1,0,A,I+1,0];S.set(x,g*_*w),v.set(d,p*_*w);const T=[w,w,w,w,w,w];E.set(T,f*_*w)}const C=new _e;C.setAttribute("position",new xe(S,g)),C.setAttribute("uv",new xe(v,p)),C.setAttribute("faceIndex",new xe(E,f)),t.push(C),s>vi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ga(i,t,e){const n=new Zn(i,t,e);return n.texture.mapping=Ks,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function As(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function fp(i,t,e){const n=new Float32Array(Xn),s=new P(0,1,0);return new Un({name:"SphericalGaussianBlur",defines:{n:Xn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:So(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function Ha(){return new Un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:So(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function Va(){return new Un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:So(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function So(){return`

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
	`}function dp(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Yr||l===Kr,h=l===Ti||l===bi;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new za(i)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{const u=o.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new za(i));const d=c?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function pp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function mp(i,t,e,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const _ in d.attributes)t.remove(d.attributes[_]);for(const _ in d.morphAttributes){const g=d.morphAttributes[_];for(let p=0,f=g.length;p<f;p++)t.remove(g[p])}d.removeEventListener("dispose",a),delete s[d.id];const m=r.get(d);m&&(t.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const _ in d)t.update(d[_],i.ARRAY_BUFFER);const m=u.morphAttributes;for(const _ in m){const g=m[_];for(let p=0,f=g.length;p<f;p++)t.update(g[p],i.ARRAY_BUFFER)}}function c(u){const d=[],m=u.index,_=u.attributes.position;let g=0;if(m!==null){const S=m.array;g=m.version;for(let v=0,E=S.length;v<E;v+=3){const C=S[v+0],w=S[v+1],A=S[v+2];d.push(C,w,w,A,A,C)}}else if(_!==void 0){const S=_.array;g=_.version;for(let v=0,E=S.length/3-1;v<E;v+=3){const C=v+0,w=v+1,A=v+2;d.push(C,w,w,A,A,C)}}else return;const p=new(Fc(d)?Vc:Hc)(d,1);p.version=g;const f=r.get(u);f&&t.remove(f),r.set(u,p)}function h(u){const d=r.get(u);if(d){const m=u.index;m!==null&&d.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function gp(i,t,e,n){const s=n.isWebGL2;let r;function a(m){r=m}let o,l;function c(m){o=m.type,l=m.bytesPerElement}function h(m,_){i.drawElements(r,_,o,m*l),e.update(_,r,1)}function u(m,_,g){if(g===0)return;let p,f;if(s)p=i,f="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](r,_,o,m*l,g),e.update(_,r,g)}function d(m,_,g){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<g;f++)this.render(m[f]/l,_[f]);else{p.multiDrawElementsWEBGL(r,_,0,o,m,0,g);let f=0;for(let S=0;S<g;S++)f+=_[S];e.update(f,r,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function _p(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function vp(i,t){return i[0]-t[0]}function xp(i,t){return Math.abs(t[1])-Math.abs(i[1])}function Mp(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,a=new ge,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,u){const d=c.morphTargetInfluences;if(t.isWebGL2===!0){const _=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=_!==void 0?_.length:0;let p=r.get(h);if(p===void 0||p.count!==g){let D=function(){k.dispose(),r.delete(h),h.removeEventListener("dispose",D)};var m=D;p!==void 0&&p.texture.dispose();const v=h.morphAttributes.position!==void 0,E=h.morphAttributes.normal!==void 0,C=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],I=h.morphAttributes.color||[];let x=0;v===!0&&(x=1),E===!0&&(x=2),C===!0&&(x=3);let T=h.attributes.position.count*x,G=1;T>t.maxTextureSize&&(G=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);const H=new Float32Array(T*G*4*g),k=new zc(H,T,G,g);k.type=bn,k.needsUpdate=!0;const R=x*4;for(let z=0;z<g;z++){const q=w[z],X=A[z],Y=I[z],K=T*G*4*z;for(let tt=0;tt<q.count;tt++){const et=tt*R;v===!0&&(a.fromBufferAttribute(q,tt),H[K+et+0]=a.x,H[K+et+1]=a.y,H[K+et+2]=a.z,H[K+et+3]=0),E===!0&&(a.fromBufferAttribute(X,tt),H[K+et+4]=a.x,H[K+et+5]=a.y,H[K+et+6]=a.z,H[K+et+7]=0),C===!0&&(a.fromBufferAttribute(Y,tt),H[K+et+8]=a.x,H[K+et+9]=a.y,H[K+et+10]=a.z,H[K+et+11]=Y.itemSize===4?a.w:1)}}p={count:g,texture:k,size:new Vt(T,G)},r.set(h,p),h.addEventListener("dispose",D)}let f=0;for(let v=0;v<d.length;v++)f+=d[v];const S=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(i,"morphTargetBaseInfluence",S),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}else{const _=d===void 0?0:d.length;let g=n[h.id];if(g===void 0||g.length!==_){g=[];for(let E=0;E<_;E++)g[E]=[E,0];n[h.id]=g}for(let E=0;E<_;E++){const C=g[E];C[0]=E,C[1]=d[E]}g.sort(xp);for(let E=0;E<8;E++)E<_&&g[E][1]?(o[E][0]=g[E][0],o[E][1]=g[E][1]):(o[E][0]=Number.MAX_SAFE_INTEGER,o[E][1]=0);o.sort(vp);const p=h.morphAttributes.position,f=h.morphAttributes.normal;let S=0;for(let E=0;E<8;E++){const C=o[E],w=C[0],A=C[1];w!==Number.MAX_SAFE_INTEGER&&A?(p&&h.getAttribute("morphTarget"+E)!==p[w]&&h.setAttribute("morphTarget"+E,p[w]),f&&h.getAttribute("morphNormal"+E)!==f[w]&&h.setAttribute("morphNormal"+E,f[w]),s[E]=A,S+=A):(p&&h.hasAttribute("morphTarget"+E)===!0&&h.deleteAttribute("morphTarget"+E),f&&h.hasAttribute("morphNormal"+E)===!0&&h.deleteAttribute("morphNormal"+E),s[E]=0)}const v=h.morphTargetsRelative?1:1-S;u.getUniforms().setValue(i,"morphTargetBaseInfluence",v),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function Sp(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class jc extends Ue{constructor(t,e,n,s,r,a,o,l,c,h){if(h=h!==void 0?h:Kn,h!==Kn&&h!==Ai)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Kn&&(n=Tn),n===void 0&&h===Ai&&(n=Yn),super(null,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Re,this.minFilter=l!==void 0?l:Re,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const $c=new Ue,Zc=new jc(1,1);Zc.compareFunction=Ic;const Jc=new zc,Qc=new ru,tl=new qc,ka=[],Wa=[],Xa=new Float32Array(16),qa=new Float32Array(9),Ya=new Float32Array(4);function Ii(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=ka[s];if(r===void 0&&(r=new Float32Array(s),ka[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function ue(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function fe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Zs(i,t){let e=Wa[t];e===void 0&&(e=new Int32Array(t),Wa[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ep(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function yp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2fv(this.addr,t),fe(e,t)}}function Tp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ue(e,t))return;i.uniform3fv(this.addr,t),fe(e,t)}}function bp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4fv(this.addr,t),fe(e,t)}}function Ap(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;Ya.set(n),i.uniformMatrix2fv(this.addr,!1,Ya),fe(e,n)}}function wp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;qa.set(n),i.uniformMatrix3fv(this.addr,!1,qa),fe(e,n)}}function Rp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;Xa.set(n),i.uniformMatrix4fv(this.addr,!1,Xa),fe(e,n)}}function Cp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Lp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2iv(this.addr,t),fe(e,t)}}function Pp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ue(e,t))return;i.uniform3iv(this.addr,t),fe(e,t)}}function Dp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4iv(this.addr,t),fe(e,t)}}function Up(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ip(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2uiv(this.addr,t),fe(e,t)}}function Np(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ue(e,t))return;i.uniform3uiv(this.addr,t),fe(e,t)}}function Fp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4uiv(this.addr,t),fe(e,t)}}function Op(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Zc:$c;e.setTexture2D(t||r,s)}function Bp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Qc,s)}function zp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||tl,s)}function Gp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Jc,s)}function Hp(i){switch(i){case 5126:return Ep;case 35664:return yp;case 35665:return Tp;case 35666:return bp;case 35674:return Ap;case 35675:return wp;case 35676:return Rp;case 5124:case 35670:return Cp;case 35667:case 35671:return Lp;case 35668:case 35672:return Pp;case 35669:case 35673:return Dp;case 5125:return Up;case 36294:return Ip;case 36295:return Np;case 36296:return Fp;case 35678:case 36198:case 36298:case 36306:case 35682:return Op;case 35679:case 36299:case 36307:return Bp;case 35680:case 36300:case 36308:case 36293:return zp;case 36289:case 36303:case 36311:case 36292:return Gp}}function Vp(i,t){i.uniform1fv(this.addr,t)}function kp(i,t){const e=Ii(t,this.size,2);i.uniform2fv(this.addr,e)}function Wp(i,t){const e=Ii(t,this.size,3);i.uniform3fv(this.addr,e)}function Xp(i,t){const e=Ii(t,this.size,4);i.uniform4fv(this.addr,e)}function qp(i,t){const e=Ii(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Yp(i,t){const e=Ii(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Kp(i,t){const e=Ii(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function jp(i,t){i.uniform1iv(this.addr,t)}function $p(i,t){i.uniform2iv(this.addr,t)}function Zp(i,t){i.uniform3iv(this.addr,t)}function Jp(i,t){i.uniform4iv(this.addr,t)}function Qp(i,t){i.uniform1uiv(this.addr,t)}function tm(i,t){i.uniform2uiv(this.addr,t)}function em(i,t){i.uniform3uiv(this.addr,t)}function nm(i,t){i.uniform4uiv(this.addr,t)}function im(i,t,e){const n=this.cache,s=t.length,r=Zs(e,s);ue(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||$c,r[a])}function sm(i,t,e){const n=this.cache,s=t.length,r=Zs(e,s);ue(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Qc,r[a])}function rm(i,t,e){const n=this.cache,s=t.length,r=Zs(e,s);ue(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||tl,r[a])}function om(i,t,e){const n=this.cache,s=t.length,r=Zs(e,s);ue(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Jc,r[a])}function am(i){switch(i){case 5126:return Vp;case 35664:return kp;case 35665:return Wp;case 35666:return Xp;case 35674:return qp;case 35675:return Yp;case 35676:return Kp;case 5124:case 35670:return jp;case 35667:case 35671:return $p;case 35668:case 35672:return Zp;case 35669:case 35673:return Jp;case 5125:return Qp;case 36294:return tm;case 36295:return em;case 36296:return nm;case 35678:case 36198:case 36298:case 36306:case 35682:return im;case 35679:case 36299:case 36307:return sm;case 35680:case 36300:case 36308:case 36293:return rm;case 36289:case 36303:case 36311:case 36292:return om}}class cm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Hp(e.type)}}class lm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=am(e.type)}}class hm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Nr=/(\w+)(\])?(\[|\.)?/g;function Ka(i,t){i.seq.push(t),i.map[t.id]=t}function um(i,t,e){const n=i.name,s=n.length;for(Nr.lastIndex=0;;){const r=Nr.exec(n),a=Nr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Ka(e,c===void 0?new cm(o,i,t):new lm(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new hm(o),Ka(e,u)),e=u}}}class Is{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);um(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function ja(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const fm=37297;let dm=0;function pm(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function mm(i){const t=Kt.getPrimaries(Kt.workingColorSpace),e=Kt.getPrimaries(i);let n;switch(t===e?n="":t===Gs&&e===zs?n="LinearDisplayP3ToLinearSRGB":t===zs&&e===Gs&&(n="LinearSRGBToLinearDisplayP3"),i){case mn:case js:return[n,"LinearTransferOETF"];case he:case go:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function $a(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+pm(i.getShaderSource(t),a)}else return s}function gm(i,t){const e=mm(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function _m(i,t){let e;switch(t){case Rh:e="Linear";break;case Ch:e="Reinhard";break;case Lh:e="OptimizedCineon";break;case Ph:e="ACESFilmic";break;case Uh:e="AgX";break;case Dh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function vm(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xi).join(`
`)}function xm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(xi).join(`
`)}function Mm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Sm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function xi(i){return i!==""}function Za(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ja(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Em=/^[ \t]*#include +<([\w\d./]+)>/gm;function to(i){return i.replace(Em,Tm)}const ym=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Tm(i,t){let e=Dt[t];if(e===void 0){const n=ym.get(t);if(n!==void 0)e=Dt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return to(e)}const bm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qa(i){return i.replace(bm,Am)}function Am(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function tc(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function wm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ec?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===yc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===fn&&(t="SHADOWMAP_TYPE_VSM"),t}function Rm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ti:case bi:t="ENVMAP_TYPE_CUBE";break;case Ks:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Cm(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case bi:t="ENVMAP_MODE_REFRACTION";break}return t}function Lm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case po:t="ENVMAP_BLENDING_MULTIPLY";break;case Ah:t="ENVMAP_BLENDING_MIX";break;case wh:t="ENVMAP_BLENDING_ADD";break}return t}function Pm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Dm(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=wm(e),c=Rm(e),h=Cm(e),u=Lm(e),d=Pm(e),m=e.isWebGL2?"":vm(e),_=xm(e),g=Mm(r),p=s.createProgram();let f,S,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(xi).join(`
`),f.length>0&&(f+=`
`),S=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(xi).join(`
`),S.length>0&&(S+=`
`)):(f=[tc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xi).join(`
`),S=[m,tc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==wn?"#define TONE_MAPPING":"",e.toneMapping!==wn?Dt.tonemapping_pars_fragment:"",e.toneMapping!==wn?_m("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Dt.colorspace_pars_fragment,gm("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xi).join(`
`)),a=to(a),a=Za(a,e),a=Ja(a,e),o=to(o),o=Za(o,e),o=Ja(o,e),a=Qa(a),o=Qa(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,f=[_,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,S=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===va?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===va?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+S);const E=v+f+a,C=v+S+o,w=ja(s,s.VERTEX_SHADER,E),A=ja(s,s.FRAGMENT_SHADER,C);s.attachShader(p,w),s.attachShader(p,A),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function I(H){if(i.debug.checkShaderErrors){const k=s.getProgramInfoLog(p).trim(),R=s.getShaderInfoLog(w).trim(),D=s.getShaderInfoLog(A).trim();let z=!0,q=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,w,A);else{const X=$a(s,w,"vertex"),Y=$a(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+k+`
`+X+`
`+Y)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(R===""||D==="")&&(q=!1);q&&(H.diagnostics={runnable:z,programLog:k,vertexShader:{log:R,prefix:f},fragmentShader:{log:D,prefix:S}})}s.deleteShader(w),s.deleteShader(A),x=new Is(s,p),T=Sm(s,p)}let x;this.getUniforms=function(){return x===void 0&&I(this),x};let T;this.getAttributes=function(){return T===void 0&&I(this),T};let G=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=s.getProgramParameter(p,fm)),G},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=dm++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=A,this}let Um=0;class Im{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Nm(t),e.set(t,n)),n}}class Nm{constructor(t){this.id=Um++,this.code=t,this.usedTimes=0}}function Fm(i,t,e,n,s,r,a){const o=new vo,l=new Im,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let m=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return x===0?"uv":`uv${x}`}function p(x,T,G,H,k){const R=H.fog,D=k.geometry,z=x.isMeshStandardMaterial?H.environment:null,q=(x.isMeshStandardMaterial?e:t).get(x.envMap||z),X=q&&q.mapping===Ks?q.image.height:null,Y=_[x.type];x.precision!==null&&(m=s.getMaxPrecision(x.precision),m!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",m,"instead."));const K=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,tt=K!==void 0?K.length:0;let et=0;D.morphAttributes.position!==void 0&&(et=1),D.morphAttributes.normal!==void 0&&(et=2),D.morphAttributes.color!==void 0&&(et=3);let W,j,at,mt;if(Y){const be=en[Y];W=be.vertexShader,j=be.fragmentShader}else W=x.vertexShader,j=x.fragmentShader,l.update(x),at=l.getVertexShaderID(x),mt=l.getFragmentShaderID(x);const pt=i.getRenderTarget(),Rt=k.isInstancedMesh===!0,Lt=k.isBatchedMesh===!0,St=!!x.map,kt=!!x.matcap,N=!!q,Te=!!x.aoMap,_t=!!x.lightMap,At=!!x.bumpMap,ut=!!x.normalMap,ie=!!x.displacementMap,It=!!x.emissiveMap,b=!!x.metalnessMap,M=!!x.roughnessMap,O=x.anisotropy>0,J=x.clearcoat>0,Z=x.iridescence>0,Q=x.sheen>0,ft=x.transmission>0,ot=O&&!!x.anisotropyMap,lt=J&&!!x.clearcoatMap,Mt=J&&!!x.clearcoatNormalMap,Nt=J&&!!x.clearcoatRoughnessMap,$=Z&&!!x.iridescenceMap,Yt=Z&&!!x.iridescenceThicknessMap,Gt=Q&&!!x.sheenColorMap,bt=Q&&!!x.sheenRoughnessMap,gt=!!x.specularMap,ht=!!x.specularColorMap,Pt=!!x.specularIntensityMap,Xt=ft&&!!x.transmissionMap,oe=ft&&!!x.thicknessMap,Ot=!!x.gradientMap,it=!!x.alphaMap,L=x.alphaTest>0,st=!!x.alphaHash,rt=!!x.extensions,Et=!!D.attributes.uv1,vt=!!D.attributes.uv2,jt=!!D.attributes.uv3;let $t=wn;return x.toneMapped&&(pt===null||pt.isXRRenderTarget===!0)&&($t=i.toneMapping),{isWebGL2:h,shaderID:Y,shaderType:x.type,shaderName:x.name,vertexShader:W,fragmentShader:j,defines:x.defines,customVertexShaderID:at,customFragmentShaderID:mt,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:m,batching:Lt,instancing:Rt,instancingColor:Rt&&k.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:pt===null?i.outputColorSpace:pt.isXRRenderTarget===!0?pt.texture.colorSpace:mn,map:St,matcap:kt,envMap:N,envMapMode:N&&q.mapping,envMapCubeUVHeight:X,aoMap:Te,lightMap:_t,bumpMap:At,normalMap:ut,displacementMap:d&&ie,emissiveMap:It,normalMapObjectSpace:ut&&x.normalMapType===Xh,normalMapTangentSpace:ut&&x.normalMapType===Uc,metalnessMap:b,roughnessMap:M,anisotropy:O,anisotropyMap:ot,clearcoat:J,clearcoatMap:lt,clearcoatNormalMap:Mt,clearcoatRoughnessMap:Nt,iridescence:Z,iridescenceMap:$,iridescenceThicknessMap:Yt,sheen:Q,sheenColorMap:Gt,sheenRoughnessMap:bt,specularMap:gt,specularColorMap:ht,specularIntensityMap:Pt,transmission:ft,transmissionMap:Xt,thicknessMap:oe,gradientMap:Ot,opaque:x.transparent===!1&&x.blending===Si,alphaMap:it,alphaTest:L,alphaHash:st,combine:x.combine,mapUv:St&&g(x.map.channel),aoMapUv:Te&&g(x.aoMap.channel),lightMapUv:_t&&g(x.lightMap.channel),bumpMapUv:At&&g(x.bumpMap.channel),normalMapUv:ut&&g(x.normalMap.channel),displacementMapUv:ie&&g(x.displacementMap.channel),emissiveMapUv:It&&g(x.emissiveMap.channel),metalnessMapUv:b&&g(x.metalnessMap.channel),roughnessMapUv:M&&g(x.roughnessMap.channel),anisotropyMapUv:ot&&g(x.anisotropyMap.channel),clearcoatMapUv:lt&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:Mt&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Nt&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:Yt&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Gt&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:bt&&g(x.sheenRoughnessMap.channel),specularMapUv:gt&&g(x.specularMap.channel),specularColorMapUv:ht&&g(x.specularColorMap.channel),specularIntensityMapUv:Pt&&g(x.specularIntensityMap.channel),transmissionMapUv:Xt&&g(x.transmissionMap.channel),thicknessMapUv:oe&&g(x.thicknessMap.channel),alphaMapUv:it&&g(x.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(ut||O),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,vertexUv1s:Et,vertexUv2s:vt,vertexUv3s:jt,pointsUvs:k.isPoints===!0&&!!D.attributes.uv&&(St||it),fog:!!R,useFog:x.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:k.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:et,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&G.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,useLegacyLights:i._useLegacyLights,decodeVideoTexture:St&&x.map.isVideoTexture===!0&&Kt.getTransfer(x.map.colorSpace)===Jt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ze,flipSided:x.side===De,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionDerivatives:rt&&x.extensions.derivatives===!0,extensionFragDepth:rt&&x.extensions.fragDepth===!0,extensionDrawBuffers:rt&&x.extensions.drawBuffers===!0,extensionShaderTextureLOD:rt&&x.extensions.shaderTextureLOD===!0,extensionClipCullDistance:rt&&x.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()}}function f(x){const T=[];if(x.shaderID?T.push(x.shaderID):(T.push(x.customVertexShaderID),T.push(x.customFragmentShaderID)),x.defines!==void 0)for(const G in x.defines)T.push(G),T.push(x.defines[G]);return x.isRawShaderMaterial===!1&&(S(T,x),v(T,x),T.push(i.outputColorSpace)),T.push(x.customProgramCacheKey),T.join()}function S(x,T){x.push(T.precision),x.push(T.outputColorSpace),x.push(T.envMapMode),x.push(T.envMapCubeUVHeight),x.push(T.mapUv),x.push(T.alphaMapUv),x.push(T.lightMapUv),x.push(T.aoMapUv),x.push(T.bumpMapUv),x.push(T.normalMapUv),x.push(T.displacementMapUv),x.push(T.emissiveMapUv),x.push(T.metalnessMapUv),x.push(T.roughnessMapUv),x.push(T.anisotropyMapUv),x.push(T.clearcoatMapUv),x.push(T.clearcoatNormalMapUv),x.push(T.clearcoatRoughnessMapUv),x.push(T.iridescenceMapUv),x.push(T.iridescenceThicknessMapUv),x.push(T.sheenColorMapUv),x.push(T.sheenRoughnessMapUv),x.push(T.specularMapUv),x.push(T.specularColorMapUv),x.push(T.specularIntensityMapUv),x.push(T.transmissionMapUv),x.push(T.thicknessMapUv),x.push(T.combine),x.push(T.fogExp2),x.push(T.sizeAttenuation),x.push(T.morphTargetsCount),x.push(T.morphAttributeCount),x.push(T.numDirLights),x.push(T.numPointLights),x.push(T.numSpotLights),x.push(T.numSpotLightMaps),x.push(T.numHemiLights),x.push(T.numRectAreaLights),x.push(T.numDirLightShadows),x.push(T.numPointLightShadows),x.push(T.numSpotLightShadows),x.push(T.numSpotLightShadowsWithMaps),x.push(T.numLightProbes),x.push(T.shadowMapType),x.push(T.toneMapping),x.push(T.numClippingPlanes),x.push(T.numClipIntersection),x.push(T.depthPacking)}function v(x,T){o.disableAll(),T.isWebGL2&&o.enable(0),T.supportsVertexTextures&&o.enable(1),T.instancing&&o.enable(2),T.instancingColor&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),x.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.skinning&&o.enable(4),T.morphTargets&&o.enable(5),T.morphNormals&&o.enable(6),T.morphColors&&o.enable(7),T.premultipliedAlpha&&o.enable(8),T.shadowMapEnabled&&o.enable(9),T.useLegacyLights&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),x.push(o.mask)}function E(x){const T=_[x.type];let G;if(T){const H=en[T];G=Wc.clone(H.uniforms)}else G=x.uniforms;return G}function C(x,T){let G;for(let H=0,k=c.length;H<k;H++){const R=c[H];if(R.cacheKey===T){G=R,++G.usedTimes;break}}return G===void 0&&(G=new Dm(i,T,x,r),c.push(G)),G}function w(x){if(--x.usedTimes===0){const T=c.indexOf(x);c[T]=c[c.length-1],c.pop(),x.destroy()}}function A(x){l.remove(x)}function I(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:E,acquireProgram:C,releaseProgram:w,releaseShaderCache:A,programs:c,dispose:I}}function Om(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Bm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function ec(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function nc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,m,_,g,p){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:m,groupOrder:_,renderOrder:u.renderOrder,z:g,group:p},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=m,f.groupOrder=_,f.renderOrder=u.renderOrder,f.z=g,f.group=p),t++,f}function o(u,d,m,_,g,p){const f=a(u,d,m,_,g,p);m.transmission>0?n.push(f):m.transparent===!0?s.push(f):e.push(f)}function l(u,d,m,_,g,p){const f=a(u,d,m,_,g,p);m.transmission>0?n.unshift(f):m.transparent===!0?s.unshift(f):e.unshift(f)}function c(u,d){e.length>1&&e.sort(u||Bm),n.length>1&&n.sort(d||ec),s.length>1&&s.sort(d||ec)}function h(){for(let u=t,d=i.length;u<d;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function zm(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new nc,i.set(n,[a])):s>=r.length?(a=new nc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Gm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Ht};break;case"SpotLight":e={position:new P,direction:new P,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function Hm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Vm=0;function km(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Wm(i,t){const e=new Gm,n=Hm(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new P);const r=new P,a=new ee,o=new ee;function l(h,u){let d=0,m=0,_=0;for(let H=0;H<9;H++)s.probe[H].set(0,0,0);let g=0,p=0,f=0,S=0,v=0,E=0,C=0,w=0,A=0,I=0,x=0;h.sort(km);const T=u===!0?Math.PI:1;for(let H=0,k=h.length;H<k;H++){const R=h[H],D=R.color,z=R.intensity,q=R.distance,X=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=D.r*z*T,m+=D.g*z*T,_+=D.b*z*T;else if(R.isLightProbe){for(let Y=0;Y<9;Y++)s.probe[Y].addScaledVector(R.sh.coefficients[Y],z);x++}else if(R.isDirectionalLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity*T),R.castShadow){const K=R.shadow,tt=n.get(R);tt.shadowBias=K.bias,tt.shadowNormalBias=K.normalBias,tt.shadowRadius=K.radius,tt.shadowMapSize=K.mapSize,s.directionalShadow[g]=tt,s.directionalShadowMap[g]=X,s.directionalShadowMatrix[g]=R.shadow.matrix,E++}s.directional[g]=Y,g++}else if(R.isSpotLight){const Y=e.get(R);Y.position.setFromMatrixPosition(R.matrixWorld),Y.color.copy(D).multiplyScalar(z*T),Y.distance=q,Y.coneCos=Math.cos(R.angle),Y.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),Y.decay=R.decay,s.spot[f]=Y;const K=R.shadow;if(R.map&&(s.spotLightMap[A]=R.map,A++,K.updateMatrices(R),R.castShadow&&I++),s.spotLightMatrix[f]=K.matrix,R.castShadow){const tt=n.get(R);tt.shadowBias=K.bias,tt.shadowNormalBias=K.normalBias,tt.shadowRadius=K.radius,tt.shadowMapSize=K.mapSize,s.spotShadow[f]=tt,s.spotShadowMap[f]=X,w++}f++}else if(R.isRectAreaLight){const Y=e.get(R);Y.color.copy(D).multiplyScalar(z),Y.halfWidth.set(R.width*.5,0,0),Y.halfHeight.set(0,R.height*.5,0),s.rectArea[S]=Y,S++}else if(R.isPointLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity*T),Y.distance=R.distance,Y.decay=R.decay,R.castShadow){const K=R.shadow,tt=n.get(R);tt.shadowBias=K.bias,tt.shadowNormalBias=K.normalBias,tt.shadowRadius=K.radius,tt.shadowMapSize=K.mapSize,tt.shadowCameraNear=K.camera.near,tt.shadowCameraFar=K.camera.far,s.pointShadow[p]=tt,s.pointShadowMap[p]=X,s.pointShadowMatrix[p]=R.shadow.matrix,C++}s.point[p]=Y,p++}else if(R.isHemisphereLight){const Y=e.get(R);Y.skyColor.copy(R.color).multiplyScalar(z*T),Y.groundColor.copy(R.groundColor).multiplyScalar(z*T),s.hemi[v]=Y,v++}}S>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=nt.LTC_FLOAT_1,s.rectAreaLTC2=nt.LTC_FLOAT_2):(s.rectAreaLTC1=nt.LTC_HALF_1,s.rectAreaLTC2=nt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=nt.LTC_FLOAT_1,s.rectAreaLTC2=nt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=nt.LTC_HALF_1,s.rectAreaLTC2=nt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=m,s.ambient[2]=_;const G=s.hash;(G.directionalLength!==g||G.pointLength!==p||G.spotLength!==f||G.rectAreaLength!==S||G.hemiLength!==v||G.numDirectionalShadows!==E||G.numPointShadows!==C||G.numSpotShadows!==w||G.numSpotMaps!==A||G.numLightProbes!==x)&&(s.directional.length=g,s.spot.length=f,s.rectArea.length=S,s.point.length=p,s.hemi.length=v,s.directionalShadow.length=E,s.directionalShadowMap.length=E,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=E,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=w+A-I,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=I,s.numLightProbes=x,G.directionalLength=g,G.pointLength=p,G.spotLength=f,G.rectAreaLength=S,G.hemiLength=v,G.numDirectionalShadows=E,G.numPointShadows=C,G.numSpotShadows=w,G.numSpotMaps=A,G.numLightProbes=x,s.version=Vm++)}function c(h,u){let d=0,m=0,_=0,g=0,p=0;const f=u.matrixWorldInverse;for(let S=0,v=h.length;S<v;S++){const E=h[S];if(E.isDirectionalLight){const C=s.directional[d];C.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(f),d++}else if(E.isSpotLight){const C=s.spot[_];C.position.setFromMatrixPosition(E.matrixWorld),C.position.applyMatrix4(f),C.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(f),_++}else if(E.isRectAreaLight){const C=s.rectArea[g];C.position.setFromMatrixPosition(E.matrixWorld),C.position.applyMatrix4(f),o.identity(),a.copy(E.matrixWorld),a.premultiply(f),o.extractRotation(a),C.halfWidth.set(E.width*.5,0,0),C.halfHeight.set(0,E.height*.5,0),C.halfWidth.applyMatrix4(o),C.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){const C=s.point[m];C.position.setFromMatrixPosition(E.matrixWorld),C.position.applyMatrix4(f),m++}else if(E.isHemisphereLight){const C=s.hemi[p];C.direction.setFromMatrixPosition(E.matrixWorld),C.direction.transformDirection(f),p++}}}return{setup:l,setupView:c,state:s}}function ic(i,t){const e=new Wm(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function l(u){e.setup(n,u)}function c(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Xm(i,t){let e=new WeakMap;function n(r,a=0){const o=e.get(r);let l;return o===void 0?(l=new ic(i,t),e.set(r,[l])):a>=o.length?(l=new ic(i,t),o.push(l)):l=o[a],l}function s(){e=new WeakMap}return{get:n,dispose:s}}class qm extends Di{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=kh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ym extends Di{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Km=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jm=`uniform sampler2D shadow_pass;
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
}`;function $m(i,t,e){let n=new xo;const s=new Vt,r=new Vt,a=new ge,o=new qm({depthPacking:Wh}),l=new Ym,c={},h=e.maxTextureSize,u={[pn]:De,[De]:pn,[Ze]:Ze},d=new Un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vt},radius:{value:4}},vertexShader:Km,fragmentShader:jm}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const _=new _e;_.setAttribute("position",new xe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Ce(_,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ec;let f=this.type;this.render=function(w,A,I){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const x=i.getRenderTarget(),T=i.getActiveCubeFace(),G=i.getActiveMipmapLevel(),H=i.state;H.setBlending(An),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const k=f!==fn&&this.type===fn,R=f===fn&&this.type!==fn;for(let D=0,z=w.length;D<z;D++){const q=w[D],X=q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const Y=X.getFrameExtents();if(s.multiply(Y),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,X.mapSize.y=r.y)),X.map===null||k===!0||R===!0){const tt=this.type!==fn?{minFilter:Re,magFilter:Re}:{};X.map!==null&&X.map.dispose(),X.map=new Zn(s.x,s.y,tt),X.map.texture.name=q.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const K=X.getViewportCount();for(let tt=0;tt<K;tt++){const et=X.getViewport(tt);a.set(r.x*et.x,r.y*et.y,r.x*et.z,r.y*et.w),H.viewport(a),X.updateMatrices(q,tt),n=X.getFrustum(),E(A,I,X.camera,q,this.type)}X.isPointLightShadow!==!0&&this.type===fn&&S(X,I),X.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(x,T,G)};function S(w,A){const I=t.update(g);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Zn(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,I,d,g,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,I,m,g,null)}function v(w,A,I,x){let T=null;const G=I.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(G!==void 0)T=G;else if(T=I.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const H=T.uuid,k=A.uuid;let R=c[H];R===void 0&&(R={},c[H]=R);let D=R[k];D===void 0&&(D=T.clone(),R[k]=D,A.addEventListener("dispose",C)),T=D}if(T.visible=A.visible,T.wireframe=A.wireframe,x===fn?T.side=A.shadowSide!==null?A.shadowSide:A.side:T.side=A.shadowSide!==null?A.shadowSide:u[A.side],T.alphaMap=A.alphaMap,T.alphaTest=A.alphaTest,T.map=A.map,T.clipShadows=A.clipShadows,T.clippingPlanes=A.clippingPlanes,T.clipIntersection=A.clipIntersection,T.displacementMap=A.displacementMap,T.displacementScale=A.displacementScale,T.displacementBias=A.displacementBias,T.wireframeLinewidth=A.wireframeLinewidth,T.linewidth=A.linewidth,I.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const H=i.properties.get(T);H.light=I}return T}function E(w,A,I,x,T){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&T===fn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,w.matrixWorld);const k=t.update(w),R=w.material;if(Array.isArray(R)){const D=k.groups;for(let z=0,q=D.length;z<q;z++){const X=D[z],Y=R[X.materialIndex];if(Y&&Y.visible){const K=v(w,Y,x,T);w.onBeforeShadow(i,w,A,I,k,K,X),i.renderBufferDirect(I,null,k,K,w,X),w.onAfterShadow(i,w,A,I,k,K,X)}}}else if(R.visible){const D=v(w,R,x,T);w.onBeforeShadow(i,w,A,I,k,D,null),i.renderBufferDirect(I,null,k,D,w,null),w.onAfterShadow(i,w,A,I,k,D,null)}}const H=w.children;for(let k=0,R=H.length;k<R;k++)E(H[k],A,I,x,T)}function C(w){w.target.removeEventListener("dispose",C);for(const I in c){const x=c[I],T=w.target.uuid;T in x&&(x[T].dispose(),delete x[T])}}}function Zm(i,t,e){const n=e.isWebGL2;function s(){let L=!1;const st=new ge;let rt=null;const Et=new ge(0,0,0,0);return{setMask:function(vt){rt!==vt&&!L&&(i.colorMask(vt,vt,vt,vt),rt=vt)},setLocked:function(vt){L=vt},setClear:function(vt,jt,$t,de,be){be===!0&&(vt*=de,jt*=de,$t*=de),st.set(vt,jt,$t,de),Et.equals(st)===!1&&(i.clearColor(vt,jt,$t,de),Et.copy(st))},reset:function(){L=!1,rt=null,Et.set(-1,0,0,0)}}}function r(){let L=!1,st=null,rt=null,Et=null;return{setTest:function(vt){vt?Lt(i.DEPTH_TEST):St(i.DEPTH_TEST)},setMask:function(vt){st!==vt&&!L&&(i.depthMask(vt),st=vt)},setFunc:function(vt){if(rt!==vt){switch(vt){case xh:i.depthFunc(i.NEVER);break;case Mh:i.depthFunc(i.ALWAYS);break;case Sh:i.depthFunc(i.LESS);break;case Os:i.depthFunc(i.LEQUAL);break;case Eh:i.depthFunc(i.EQUAL);break;case yh:i.depthFunc(i.GEQUAL);break;case Th:i.depthFunc(i.GREATER);break;case bh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}rt=vt}},setLocked:function(vt){L=vt},setClear:function(vt){Et!==vt&&(i.clearDepth(vt),Et=vt)},reset:function(){L=!1,st=null,rt=null,Et=null}}}function a(){let L=!1,st=null,rt=null,Et=null,vt=null,jt=null,$t=null,de=null,be=null;return{setTest:function(Zt){L||(Zt?Lt(i.STENCIL_TEST):St(i.STENCIL_TEST))},setMask:function(Zt){st!==Zt&&!L&&(i.stencilMask(Zt),st=Zt)},setFunc:function(Zt,Ae,tn){(rt!==Zt||Et!==Ae||vt!==tn)&&(i.stencilFunc(Zt,Ae,tn),rt=Zt,Et=Ae,vt=tn)},setOp:function(Zt,Ae,tn){(jt!==Zt||$t!==Ae||de!==tn)&&(i.stencilOp(Zt,Ae,tn),jt=Zt,$t=Ae,de=tn)},setLocked:function(Zt){L=Zt},setClear:function(Zt){be!==Zt&&(i.clearStencil(Zt),be=Zt)},reset:function(){L=!1,st=null,rt=null,Et=null,vt=null,jt=null,$t=null,de=null,be=null}}}const o=new s,l=new r,c=new a,h=new WeakMap,u=new WeakMap;let d={},m={},_=new WeakMap,g=[],p=null,f=!1,S=null,v=null,E=null,C=null,w=null,A=null,I=null,x=new Ht(0,0,0),T=0,G=!1,H=null,k=null,R=null,D=null,z=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,Y=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(K)[1]),X=Y>=1):K.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),X=Y>=2);let tt=null,et={};const W=i.getParameter(i.SCISSOR_BOX),j=i.getParameter(i.VIEWPORT),at=new ge().fromArray(W),mt=new ge().fromArray(j);function pt(L,st,rt,Et){const vt=new Uint8Array(4),jt=i.createTexture();i.bindTexture(L,jt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let $t=0;$t<rt;$t++)n&&(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)?i.texImage3D(st,0,i.RGBA,1,1,Et,0,i.RGBA,i.UNSIGNED_BYTE,vt):i.texImage2D(st+$t,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,vt);return jt}const Rt={};Rt[i.TEXTURE_2D]=pt(i.TEXTURE_2D,i.TEXTURE_2D,1),Rt[i.TEXTURE_CUBE_MAP]=pt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Rt[i.TEXTURE_2D_ARRAY]=pt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Rt[i.TEXTURE_3D]=pt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Lt(i.DEPTH_TEST),l.setFunc(Os),It(!1),b(zo),Lt(i.CULL_FACE),ut(An);function Lt(L){d[L]!==!0&&(i.enable(L),d[L]=!0)}function St(L){d[L]!==!1&&(i.disable(L),d[L]=!1)}function kt(L,st){return m[L]!==st?(i.bindFramebuffer(L,st),m[L]=st,n&&(L===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=st),L===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=st)),!0):!1}function N(L,st){let rt=g,Et=!1;if(L)if(rt=_.get(st),rt===void 0&&(rt=[],_.set(st,rt)),L.isWebGLMultipleRenderTargets){const vt=L.texture;if(rt.length!==vt.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let jt=0,$t=vt.length;jt<$t;jt++)rt[jt]=i.COLOR_ATTACHMENT0+jt;rt.length=vt.length,Et=!0}}else rt[0]!==i.COLOR_ATTACHMENT0&&(rt[0]=i.COLOR_ATTACHMENT0,Et=!0);else rt[0]!==i.BACK&&(rt[0]=i.BACK,Et=!0);Et&&(e.isWebGL2?i.drawBuffers(rt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(rt))}function Te(L){return p!==L?(i.useProgram(L),p=L,!0):!1}const _t={[Wn]:i.FUNC_ADD,[sh]:i.FUNC_SUBTRACT,[rh]:i.FUNC_REVERSE_SUBTRACT};if(n)_t[Vo]=i.MIN,_t[ko]=i.MAX;else{const L=t.get("EXT_blend_minmax");L!==null&&(_t[Vo]=L.MIN_EXT,_t[ko]=L.MAX_EXT)}const At={[oh]:i.ZERO,[ah]:i.ONE,[ch]:i.SRC_COLOR,[Xr]:i.SRC_ALPHA,[ph]:i.SRC_ALPHA_SATURATE,[fh]:i.DST_COLOR,[hh]:i.DST_ALPHA,[lh]:i.ONE_MINUS_SRC_COLOR,[qr]:i.ONE_MINUS_SRC_ALPHA,[dh]:i.ONE_MINUS_DST_COLOR,[uh]:i.ONE_MINUS_DST_ALPHA,[mh]:i.CONSTANT_COLOR,[gh]:i.ONE_MINUS_CONSTANT_COLOR,[_h]:i.CONSTANT_ALPHA,[vh]:i.ONE_MINUS_CONSTANT_ALPHA};function ut(L,st,rt,Et,vt,jt,$t,de,be,Zt){if(L===An){f===!0&&(St(i.BLEND),f=!1);return}if(f===!1&&(Lt(i.BLEND),f=!0),L!==ih){if(L!==S||Zt!==G){if((v!==Wn||w!==Wn)&&(i.blendEquation(i.FUNC_ADD),v=Wn,w=Wn),Zt)switch(L){case Si:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Fs:i.blendFunc(i.ONE,i.ONE);break;case Go:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ho:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Si:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Fs:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Go:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ho:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}E=null,C=null,A=null,I=null,x.set(0,0,0),T=0,S=L,G=Zt}return}vt=vt||st,jt=jt||rt,$t=$t||Et,(st!==v||vt!==w)&&(i.blendEquationSeparate(_t[st],_t[vt]),v=st,w=vt),(rt!==E||Et!==C||jt!==A||$t!==I)&&(i.blendFuncSeparate(At[rt],At[Et],At[jt],At[$t]),E=rt,C=Et,A=jt,I=$t),(de.equals(x)===!1||be!==T)&&(i.blendColor(de.r,de.g,de.b,be),x.copy(de),T=be),S=L,G=!1}function ie(L,st){L.side===Ze?St(i.CULL_FACE):Lt(i.CULL_FACE);let rt=L.side===De;st&&(rt=!rt),It(rt),L.blending===Si&&L.transparent===!1?ut(An):ut(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),l.setFunc(L.depthFunc),l.setTest(L.depthTest),l.setMask(L.depthWrite),o.setMask(L.colorWrite);const Et=L.stencilWrite;c.setTest(Et),Et&&(c.setMask(L.stencilWriteMask),c.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),c.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),O(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Lt(i.SAMPLE_ALPHA_TO_COVERAGE):St(i.SAMPLE_ALPHA_TO_COVERAGE)}function It(L){H!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),H=L)}function b(L){L!==eh?(Lt(i.CULL_FACE),L!==k&&(L===zo?i.cullFace(i.BACK):L===nh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):St(i.CULL_FACE),k=L}function M(L){L!==R&&(X&&i.lineWidth(L),R=L)}function O(L,st,rt){L?(Lt(i.POLYGON_OFFSET_FILL),(D!==st||z!==rt)&&(i.polygonOffset(st,rt),D=st,z=rt)):St(i.POLYGON_OFFSET_FILL)}function J(L){L?Lt(i.SCISSOR_TEST):St(i.SCISSOR_TEST)}function Z(L){L===void 0&&(L=i.TEXTURE0+q-1),tt!==L&&(i.activeTexture(L),tt=L)}function Q(L,st,rt){rt===void 0&&(tt===null?rt=i.TEXTURE0+q-1:rt=tt);let Et=et[rt];Et===void 0&&(Et={type:void 0,texture:void 0},et[rt]=Et),(Et.type!==L||Et.texture!==st)&&(tt!==rt&&(i.activeTexture(rt),tt=rt),i.bindTexture(L,st||Rt[L]),Et.type=L,Et.texture=st)}function ft(){const L=et[tt];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function ot(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function lt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Mt(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Nt(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function $(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Yt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Gt(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function bt(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function gt(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ht(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Pt(L){at.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),at.copy(L))}function Xt(L){mt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),mt.copy(L))}function oe(L,st){let rt=u.get(st);rt===void 0&&(rt=new WeakMap,u.set(st,rt));let Et=rt.get(L);Et===void 0&&(Et=i.getUniformBlockIndex(st,L.name),rt.set(L,Et))}function Ot(L,st){const Et=u.get(st).get(L);h.get(st)!==Et&&(i.uniformBlockBinding(st,Et,L.__bindingPointIndex),h.set(st,Et))}function it(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},tt=null,et={},m={},_=new WeakMap,g=[],p=null,f=!1,S=null,v=null,E=null,C=null,w=null,A=null,I=null,x=new Ht(0,0,0),T=0,G=!1,H=null,k=null,R=null,D=null,z=null,at.set(0,0,i.canvas.width,i.canvas.height),mt.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Lt,disable:St,bindFramebuffer:kt,drawBuffers:N,useProgram:Te,setBlending:ut,setMaterial:ie,setFlipSided:It,setCullFace:b,setLineWidth:M,setPolygonOffset:O,setScissorTest:J,activeTexture:Z,bindTexture:Q,unbindTexture:ft,compressedTexImage2D:ot,compressedTexImage3D:lt,texImage2D:gt,texImage3D:ht,updateUBOMapping:oe,uniformBlockBinding:Ot,texStorage2D:Gt,texStorage3D:bt,texSubImage2D:Mt,texSubImage3D:Nt,compressedTexSubImage2D:$,compressedTexSubImage3D:Yt,scissor:Pt,viewport:Xt,reset:it}}function Jm(i,t,e,n,s,r,a){const o=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(b,M){return m?new OffscreenCanvas(b,M):Vs("canvas")}function g(b,M,O,J){let Z=1;if((b.width>J||b.height>J)&&(Z=J/Math.max(b.width,b.height)),Z<1||M===!0)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap){const Q=M?Qr:Math.floor,ft=Q(Z*b.width),ot=Q(Z*b.height);u===void 0&&(u=_(ft,ot));const lt=O?_(ft,ot):u;return lt.width=ft,lt.height=ot,lt.getContext("2d").drawImage(b,0,0,ft,ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+b.width+"x"+b.height+") to ("+ft+"x"+ot+")."),lt}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+b.width+"x"+b.height+")."),b;return b}function p(b){return xa(b.width)&&xa(b.height)}function f(b){return o?!1:b.wrapS!==Je||b.wrapT!==Je||b.minFilter!==Re&&b.minFilter!==ke}function S(b,M){return b.generateMipmaps&&M&&b.minFilter!==Re&&b.minFilter!==ke}function v(b){i.generateMipmap(b)}function E(b,M,O,J,Z=!1){if(o===!1)return M;if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let Q=M;if(M===i.RED&&(O===i.FLOAT&&(Q=i.R32F),O===i.HALF_FLOAT&&(Q=i.R16F),O===i.UNSIGNED_BYTE&&(Q=i.R8)),M===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(Q=i.R8UI),O===i.UNSIGNED_SHORT&&(Q=i.R16UI),O===i.UNSIGNED_INT&&(Q=i.R32UI),O===i.BYTE&&(Q=i.R8I),O===i.SHORT&&(Q=i.R16I),O===i.INT&&(Q=i.R32I)),M===i.RG&&(O===i.FLOAT&&(Q=i.RG32F),O===i.HALF_FLOAT&&(Q=i.RG16F),O===i.UNSIGNED_BYTE&&(Q=i.RG8)),M===i.RGBA){const ft=Z?Bs:Kt.getTransfer(J);O===i.FLOAT&&(Q=i.RGBA32F),O===i.HALF_FLOAT&&(Q=i.RGBA16F),O===i.UNSIGNED_BYTE&&(Q=ft===Jt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function C(b,M,O){return S(b,O)===!0||b.isFramebufferTexture&&b.minFilter!==Re&&b.minFilter!==ke?Math.log2(Math.max(M.width,M.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?M.mipmaps.length:1}function w(b){return b===Re||b===Wo||b===or?i.NEAREST:i.LINEAR}function A(b){const M=b.target;M.removeEventListener("dispose",A),x(M),M.isVideoTexture&&h.delete(M)}function I(b){const M=b.target;M.removeEventListener("dispose",I),G(M)}function x(b){const M=n.get(b);if(M.__webglInit===void 0)return;const O=b.source,J=d.get(O);if(J){const Z=J[M.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&T(b),Object.keys(J).length===0&&d.delete(O)}n.remove(b)}function T(b){const M=n.get(b);i.deleteTexture(M.__webglTexture);const O=b.source,J=d.get(O);delete J[M.__cacheKey],a.memory.textures--}function G(b){const M=b.texture,O=n.get(b),J=n.get(M);if(J.__webglTexture!==void 0&&(i.deleteTexture(J.__webglTexture),a.memory.textures--),b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(O.__webglFramebuffer[Z]))for(let Q=0;Q<O.__webglFramebuffer[Z].length;Q++)i.deleteFramebuffer(O.__webglFramebuffer[Z][Q]);else i.deleteFramebuffer(O.__webglFramebuffer[Z]);O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer[Z])}else{if(Array.isArray(O.__webglFramebuffer))for(let Z=0;Z<O.__webglFramebuffer.length;Z++)i.deleteFramebuffer(O.__webglFramebuffer[Z]);else i.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&i.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let Z=0;Z<O.__webglColorRenderbuffer.length;Z++)O.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(O.__webglColorRenderbuffer[Z]);O.__webglDepthRenderbuffer&&i.deleteRenderbuffer(O.__webglDepthRenderbuffer)}if(b.isWebGLMultipleRenderTargets)for(let Z=0,Q=M.length;Z<Q;Z++){const ft=n.get(M[Z]);ft.__webglTexture&&(i.deleteTexture(ft.__webglTexture),a.memory.textures--),n.remove(M[Z])}n.remove(M),n.remove(b)}let H=0;function k(){H=0}function R(){const b=H;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),H+=1,b}function D(b){const M=[];return M.push(b.wrapS),M.push(b.wrapT),M.push(b.wrapR||0),M.push(b.magFilter),M.push(b.minFilter),M.push(b.anisotropy),M.push(b.internalFormat),M.push(b.format),M.push(b.type),M.push(b.generateMipmaps),M.push(b.premultiplyAlpha),M.push(b.flipY),M.push(b.unpackAlignment),M.push(b.colorSpace),M.join()}function z(b,M){const O=n.get(b);if(b.isVideoTexture&&ie(b),b.isRenderTargetTexture===!1&&b.version>0&&O.__version!==b.version){const J=b.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{at(O,b,M);return}}e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+M)}function q(b,M){const O=n.get(b);if(b.version>0&&O.__version!==b.version){at(O,b,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+M)}function X(b,M){const O=n.get(b);if(b.version>0&&O.__version!==b.version){at(O,b,M);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+M)}function Y(b,M){const O=n.get(b);if(b.version>0&&O.__version!==b.version){mt(O,b,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+M)}const K={[jr]:i.REPEAT,[Je]:i.CLAMP_TO_EDGE,[$r]:i.MIRRORED_REPEAT},tt={[Re]:i.NEAREST,[Wo]:i.NEAREST_MIPMAP_NEAREST,[or]:i.NEAREST_MIPMAP_LINEAR,[ke]:i.LINEAR,[Ih]:i.LINEAR_MIPMAP_NEAREST,[Ki]:i.LINEAR_MIPMAP_LINEAR},et={[qh]:i.NEVER,[Jh]:i.ALWAYS,[Yh]:i.LESS,[Ic]:i.LEQUAL,[Kh]:i.EQUAL,[Zh]:i.GEQUAL,[jh]:i.GREATER,[$h]:i.NOTEQUAL};function W(b,M,O){if(O?(i.texParameteri(b,i.TEXTURE_WRAP_S,K[M.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,K[M.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,K[M.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,tt[M.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,tt[M.minFilter])):(i.texParameteri(b,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(b,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(M.wrapS!==Je||M.wrapT!==Je)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(b,i.TEXTURE_MAG_FILTER,w(M.magFilter)),i.texParameteri(b,i.TEXTURE_MIN_FILTER,w(M.minFilter)),M.minFilter!==Re&&M.minFilter!==ke&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),M.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,et[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const J=t.get("EXT_texture_filter_anisotropic");if(M.magFilter===Re||M.minFilter!==or&&M.minFilter!==Ki||M.type===bn&&t.has("OES_texture_float_linear")===!1||o===!1&&M.type===ji&&t.has("OES_texture_half_float_linear")===!1)return;(M.anisotropy>1||n.get(M).__currentAnisotropy)&&(i.texParameterf(b,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy)}}function j(b,M){let O=!1;b.__webglInit===void 0&&(b.__webglInit=!0,M.addEventListener("dispose",A));const J=M.source;let Z=d.get(J);Z===void 0&&(Z={},d.set(J,Z));const Q=D(M);if(Q!==b.__cacheKey){Z[Q]===void 0&&(Z[Q]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Z[Q].usedTimes++;const ft=Z[b.__cacheKey];ft!==void 0&&(Z[b.__cacheKey].usedTimes--,ft.usedTimes===0&&T(M)),b.__cacheKey=Q,b.__webglTexture=Z[Q].texture}return O}function at(b,M,O){let J=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(J=i.TEXTURE_3D);const Z=j(b,M),Q=M.source;e.bindTexture(J,b.__webglTexture,i.TEXTURE0+O);const ft=n.get(Q);if(Q.version!==ft.__version||Z===!0){e.activeTexture(i.TEXTURE0+O);const ot=Kt.getPrimaries(Kt.workingColorSpace),lt=M.colorSpace===Xe?null:Kt.getPrimaries(M.colorSpace),Mt=M.colorSpace===Xe||ot===lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);const Nt=f(M)&&p(M.image)===!1;let $=g(M.image,Nt,!1,s.maxTextureSize);$=It(M,$);const Yt=p($)||o,Gt=r.convert(M.format,M.colorSpace);let bt=r.convert(M.type),gt=E(M.internalFormat,Gt,bt,M.colorSpace,M.isVideoTexture);W(J,M,Yt);let ht;const Pt=M.mipmaps,Xt=o&&M.isVideoTexture!==!0&&gt!==Pc,oe=ft.__version===void 0||Z===!0,Ot=C(M,$,Yt);if(M.isDepthTexture)gt=i.DEPTH_COMPONENT,o?M.type===bn?gt=i.DEPTH_COMPONENT32F:M.type===Tn?gt=i.DEPTH_COMPONENT24:M.type===Yn?gt=i.DEPTH24_STENCIL8:gt=i.DEPTH_COMPONENT16:M.type===bn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),M.format===Kn&&gt===i.DEPTH_COMPONENT&&M.type!==mo&&M.type!==Tn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),M.type=Tn,bt=r.convert(M.type)),M.format===Ai&&gt===i.DEPTH_COMPONENT&&(gt=i.DEPTH_STENCIL,M.type!==Yn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),M.type=Yn,bt=r.convert(M.type))),oe&&(Xt?e.texStorage2D(i.TEXTURE_2D,1,gt,$.width,$.height):e.texImage2D(i.TEXTURE_2D,0,gt,$.width,$.height,0,Gt,bt,null));else if(M.isDataTexture)if(Pt.length>0&&Yt){Xt&&oe&&e.texStorage2D(i.TEXTURE_2D,Ot,gt,Pt[0].width,Pt[0].height);for(let it=0,L=Pt.length;it<L;it++)ht=Pt[it],Xt?e.texSubImage2D(i.TEXTURE_2D,it,0,0,ht.width,ht.height,Gt,bt,ht.data):e.texImage2D(i.TEXTURE_2D,it,gt,ht.width,ht.height,0,Gt,bt,ht.data);M.generateMipmaps=!1}else Xt?(oe&&e.texStorage2D(i.TEXTURE_2D,Ot,gt,$.width,$.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,$.width,$.height,Gt,bt,$.data)):e.texImage2D(i.TEXTURE_2D,0,gt,$.width,$.height,0,Gt,bt,$.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Xt&&oe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ot,gt,Pt[0].width,Pt[0].height,$.depth);for(let it=0,L=Pt.length;it<L;it++)ht=Pt[it],M.format!==Qe?Gt!==null?Xt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,ht.width,ht.height,$.depth,Gt,ht.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,gt,ht.width,ht.height,$.depth,0,ht.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,ht.width,ht.height,$.depth,Gt,bt,ht.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,gt,ht.width,ht.height,$.depth,0,Gt,bt,ht.data)}else{Xt&&oe&&e.texStorage2D(i.TEXTURE_2D,Ot,gt,Pt[0].width,Pt[0].height);for(let it=0,L=Pt.length;it<L;it++)ht=Pt[it],M.format!==Qe?Gt!==null?Xt?e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,ht.width,ht.height,Gt,ht.data):e.compressedTexImage2D(i.TEXTURE_2D,it,gt,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?e.texSubImage2D(i.TEXTURE_2D,it,0,0,ht.width,ht.height,Gt,bt,ht.data):e.texImage2D(i.TEXTURE_2D,it,gt,ht.width,ht.height,0,Gt,bt,ht.data)}else if(M.isDataArrayTexture)Xt?(oe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ot,gt,$.width,$.height,$.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,Gt,bt,$.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,gt,$.width,$.height,$.depth,0,Gt,bt,$.data);else if(M.isData3DTexture)Xt?(oe&&e.texStorage3D(i.TEXTURE_3D,Ot,gt,$.width,$.height,$.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,Gt,bt,$.data)):e.texImage3D(i.TEXTURE_3D,0,gt,$.width,$.height,$.depth,0,Gt,bt,$.data);else if(M.isFramebufferTexture){if(oe)if(Xt)e.texStorage2D(i.TEXTURE_2D,Ot,gt,$.width,$.height);else{let it=$.width,L=$.height;for(let st=0;st<Ot;st++)e.texImage2D(i.TEXTURE_2D,st,gt,it,L,0,Gt,bt,null),it>>=1,L>>=1}}else if(Pt.length>0&&Yt){Xt&&oe&&e.texStorage2D(i.TEXTURE_2D,Ot,gt,Pt[0].width,Pt[0].height);for(let it=0,L=Pt.length;it<L;it++)ht=Pt[it],Xt?e.texSubImage2D(i.TEXTURE_2D,it,0,0,Gt,bt,ht):e.texImage2D(i.TEXTURE_2D,it,gt,Gt,bt,ht);M.generateMipmaps=!1}else Xt?(oe&&e.texStorage2D(i.TEXTURE_2D,Ot,gt,$.width,$.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Gt,bt,$)):e.texImage2D(i.TEXTURE_2D,0,gt,Gt,bt,$);S(M,Yt)&&v(J),ft.__version=Q.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function mt(b,M,O){if(M.image.length!==6)return;const J=j(b,M),Z=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+O);const Q=n.get(Z);if(Z.version!==Q.__version||J===!0){e.activeTexture(i.TEXTURE0+O);const ft=Kt.getPrimaries(Kt.workingColorSpace),ot=M.colorSpace===Xe?null:Kt.getPrimaries(M.colorSpace),lt=M.colorSpace===Xe||ft===ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,lt);const Mt=M.isCompressedTexture||M.image[0].isCompressedTexture,Nt=M.image[0]&&M.image[0].isDataTexture,$=[];for(let it=0;it<6;it++)!Mt&&!Nt?$[it]=g(M.image[it],!1,!0,s.maxCubemapSize):$[it]=Nt?M.image[it].image:M.image[it],$[it]=It(M,$[it]);const Yt=$[0],Gt=p(Yt)||o,bt=r.convert(M.format,M.colorSpace),gt=r.convert(M.type),ht=E(M.internalFormat,bt,gt,M.colorSpace),Pt=o&&M.isVideoTexture!==!0,Xt=Q.__version===void 0||J===!0;let oe=C(M,Yt,Gt);W(i.TEXTURE_CUBE_MAP,M,Gt);let Ot;if(Mt){Pt&&Xt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,oe,ht,Yt.width,Yt.height);for(let it=0;it<6;it++){Ot=$[it].mipmaps;for(let L=0;L<Ot.length;L++){const st=Ot[L];M.format!==Qe?bt!==null?Pt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,L,0,0,st.width,st.height,bt,st.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,L,ht,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,L,0,0,st.width,st.height,bt,gt,st.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,L,ht,st.width,st.height,0,bt,gt,st.data)}}}else{Ot=M.mipmaps,Pt&&Xt&&(Ot.length>0&&oe++,e.texStorage2D(i.TEXTURE_CUBE_MAP,oe,ht,$[0].width,$[0].height));for(let it=0;it<6;it++)if(Nt){Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,$[it].width,$[it].height,bt,gt,$[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ht,$[it].width,$[it].height,0,bt,gt,$[it].data);for(let L=0;L<Ot.length;L++){const rt=Ot[L].image[it].image;Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,L+1,0,0,rt.width,rt.height,bt,gt,rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,L+1,ht,rt.width,rt.height,0,bt,gt,rt.data)}}else{Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,bt,gt,$[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ht,bt,gt,$[it]);for(let L=0;L<Ot.length;L++){const st=Ot[L];Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,L+1,0,0,bt,gt,st.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,L+1,ht,bt,gt,st.image[it])}}}S(M,Gt)&&v(i.TEXTURE_CUBE_MAP),Q.__version=Z.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function pt(b,M,O,J,Z,Q){const ft=r.convert(O.format,O.colorSpace),ot=r.convert(O.type),lt=E(O.internalFormat,ft,ot,O.colorSpace);if(!n.get(M).__hasExternalTextures){const Nt=Math.max(1,M.width>>Q),$=Math.max(1,M.height>>Q);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,Q,lt,Nt,$,M.depth,0,ft,ot,null):e.texImage2D(Z,Q,lt,Nt,$,0,ft,ot,null)}e.bindFramebuffer(i.FRAMEBUFFER,b),ut(M)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,Z,n.get(O).__webglTexture,0,At(M)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,Z,n.get(O).__webglTexture,Q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Rt(b,M,O){if(i.bindRenderbuffer(i.RENDERBUFFER,b),M.depthBuffer&&!M.stencilBuffer){let J=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(O||ut(M)){const Z=M.depthTexture;Z&&Z.isDepthTexture&&(Z.type===bn?J=i.DEPTH_COMPONENT32F:Z.type===Tn&&(J=i.DEPTH_COMPONENT24));const Q=At(M);ut(M)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Q,J,M.width,M.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,J,M.width,M.height)}else i.renderbufferStorage(i.RENDERBUFFER,J,M.width,M.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,b)}else if(M.depthBuffer&&M.stencilBuffer){const J=At(M);O&&ut(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,J,i.DEPTH24_STENCIL8,M.width,M.height):ut(M)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,J,i.DEPTH24_STENCIL8,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,b)}else{const J=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let Z=0;Z<J.length;Z++){const Q=J[Z],ft=r.convert(Q.format,Q.colorSpace),ot=r.convert(Q.type),lt=E(Q.internalFormat,ft,ot,Q.colorSpace),Mt=At(M);O&&ut(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,lt,M.width,M.height):ut(M)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt,lt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,lt,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Lt(b,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,b),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),z(M.depthTexture,0);const J=n.get(M.depthTexture).__webglTexture,Z=At(M);if(M.depthTexture.format===Kn)ut(M)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(M.depthTexture.format===Ai)ut(M)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function St(b){const M=n.get(b),O=b.isWebGLCubeRenderTarget===!0;if(b.depthTexture&&!M.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Lt(M.__webglFramebuffer,b)}else if(O){M.__webglDepthbuffer=[];for(let J=0;J<6;J++)e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[J]),M.__webglDepthbuffer[J]=i.createRenderbuffer(),Rt(M.__webglDepthbuffer[J],b,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=i.createRenderbuffer(),Rt(M.__webglDepthbuffer,b,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function kt(b,M,O){const J=n.get(b);M!==void 0&&pt(J.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&St(b)}function N(b){const M=b.texture,O=n.get(b),J=n.get(M);b.addEventListener("dispose",I),b.isWebGLMultipleRenderTargets!==!0&&(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=M.version,a.memory.textures++);const Z=b.isWebGLCubeRenderTarget===!0,Q=b.isWebGLMultipleRenderTargets===!0,ft=p(b)||o;if(Z){O.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(o&&M.mipmaps&&M.mipmaps.length>0){O.__webglFramebuffer[ot]=[];for(let lt=0;lt<M.mipmaps.length;lt++)O.__webglFramebuffer[ot][lt]=i.createFramebuffer()}else O.__webglFramebuffer[ot]=i.createFramebuffer()}else{if(o&&M.mipmaps&&M.mipmaps.length>0){O.__webglFramebuffer=[];for(let ot=0;ot<M.mipmaps.length;ot++)O.__webglFramebuffer[ot]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Q)if(s.drawBuffers){const ot=b.texture;for(let lt=0,Mt=ot.length;lt<Mt;lt++){const Nt=n.get(ot[lt]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&b.samples>0&&ut(b)===!1){const ot=Q?M:[M];O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let lt=0;lt<ot.length;lt++){const Mt=ot[lt];O.__webglColorRenderbuffer[lt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[lt]);const Nt=r.convert(Mt.format,Mt.colorSpace),$=r.convert(Mt.type),Yt=E(Mt.internalFormat,Nt,$,Mt.colorSpace,b.isXRRenderTarget===!0),Gt=At(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Gt,Yt,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.RENDERBUFFER,O.__webglColorRenderbuffer[lt])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Rt(O.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),W(i.TEXTURE_CUBE_MAP,M,ft);for(let ot=0;ot<6;ot++)if(o&&M.mipmaps&&M.mipmaps.length>0)for(let lt=0;lt<M.mipmaps.length;lt++)pt(O.__webglFramebuffer[ot][lt],b,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,lt);else pt(O.__webglFramebuffer[ot],b,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);S(M,ft)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Q){const ot=b.texture;for(let lt=0,Mt=ot.length;lt<Mt;lt++){const Nt=ot[lt],$=n.get(Nt);e.bindTexture(i.TEXTURE_2D,$.__webglTexture),W(i.TEXTURE_2D,Nt,ft),pt(O.__webglFramebuffer,b,Nt,i.COLOR_ATTACHMENT0+lt,i.TEXTURE_2D,0),S(Nt,ft)&&v(i.TEXTURE_2D)}e.unbindTexture()}else{let ot=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(o?ot=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ot,J.__webglTexture),W(ot,M,ft),o&&M.mipmaps&&M.mipmaps.length>0)for(let lt=0;lt<M.mipmaps.length;lt++)pt(O.__webglFramebuffer[lt],b,M,i.COLOR_ATTACHMENT0,ot,lt);else pt(O.__webglFramebuffer,b,M,i.COLOR_ATTACHMENT0,ot,0);S(M,ft)&&v(ot),e.unbindTexture()}b.depthBuffer&&St(b)}function Te(b){const M=p(b)||o,O=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let J=0,Z=O.length;J<Z;J++){const Q=O[J];if(S(Q,M)){const ft=b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ot=n.get(Q).__webglTexture;e.bindTexture(ft,ot),v(ft),e.unbindTexture()}}}function _t(b){if(o&&b.samples>0&&ut(b)===!1){const M=b.isWebGLMultipleRenderTargets?b.texture:[b.texture],O=b.width,J=b.height;let Z=i.COLOR_BUFFER_BIT;const Q=[],ft=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=n.get(b),lt=b.isWebGLMultipleRenderTargets===!0;if(lt)for(let Mt=0;Mt<M.length;Mt++)e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let Mt=0;Mt<M.length;Mt++){Q.push(i.COLOR_ATTACHMENT0+Mt),b.depthBuffer&&Q.push(ft);const Nt=ot.__ignoreDepthValues!==void 0?ot.__ignoreDepthValues:!1;if(Nt===!1&&(b.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),lt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ot.__webglColorRenderbuffer[Mt]),Nt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[ft]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[ft])),lt){const $=n.get(M[Mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$,0)}i.blitFramebuffer(0,0,O,J,0,0,O,J,Z,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Q)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),lt)for(let Mt=0;Mt<M.length;Mt++){e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,ot.__webglColorRenderbuffer[Mt]);const Nt=n.get(M[Mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,Nt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}}function At(b){return Math.min(s.maxSamples,b.samples)}function ut(b){const M=n.get(b);return o&&b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ie(b){const M=a.render.frame;h.get(b)!==M&&(h.set(b,M),b.update())}function It(b,M){const O=b.colorSpace,J=b.format,Z=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||b.format===Zr||O!==mn&&O!==Xe&&(Kt.getTransfer(O)===Jt?o===!1?t.has("EXT_sRGB")===!0&&J===Qe?(b.format=Zr,b.minFilter=ke,b.generateMipmaps=!1):M=Oc.sRGBToLinear(M):(J!==Qe||Z!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),M}this.allocateTextureUnit=R,this.resetTextureUnits=k,this.setTexture2D=z,this.setTexture2DArray=q,this.setTexture3D=X,this.setTextureCube=Y,this.rebindTextures=kt,this.setupRenderTarget=N,this.updateRenderTargetMipmap=Te,this.updateMultisampleRenderTarget=_t,this.setupDepthRenderbuffer=St,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=ut}function Qm(i,t,e){const n=e.isWebGL2;function s(r,a=Xe){let o;const l=Kt.getTransfer(a);if(r===Rn)return i.UNSIGNED_BYTE;if(r===Ac)return i.UNSIGNED_SHORT_4_4_4_4;if(r===wc)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Nh)return i.BYTE;if(r===Fh)return i.SHORT;if(r===mo)return i.UNSIGNED_SHORT;if(r===bc)return i.INT;if(r===Tn)return i.UNSIGNED_INT;if(r===bn)return i.FLOAT;if(r===ji)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===Oh)return i.ALPHA;if(r===Qe)return i.RGBA;if(r===Bh)return i.LUMINANCE;if(r===zh)return i.LUMINANCE_ALPHA;if(r===Kn)return i.DEPTH_COMPONENT;if(r===Ai)return i.DEPTH_STENCIL;if(r===Zr)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Gh)return i.RED;if(r===Rc)return i.RED_INTEGER;if(r===Hh)return i.RG;if(r===Cc)return i.RG_INTEGER;if(r===Lc)return i.RGBA_INTEGER;if(r===ar||r===cr||r===lr||r===hr)if(l===Jt)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===ar)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===cr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===lr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===hr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===ar)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===cr)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===lr)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===hr)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Xo||r===qo||r===Yo||r===Ko)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Xo)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===qo)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Yo)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ko)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Pc)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===jo||r===$o)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===jo)return l===Jt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===$o)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Zo||r===Jo||r===Qo||r===ta||r===ea||r===na||r===ia||r===sa||r===ra||r===oa||r===aa||r===ca||r===la||r===ha)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Zo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Jo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Qo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ta)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===ea)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===na)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===ia)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===sa)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===ra)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===oa)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===aa)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ca)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===la)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===ha)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ur||r===ua||r===fa)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===ur)return l===Jt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===ua)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===fa)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Vh||r===da||r===pa||r===ma)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===ur)return o.COMPRESSED_RED_RGTC1_EXT;if(r===da)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===pa)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===ma)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Yn?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class tg extends We{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class qi extends ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const eg={type:"move"};class Fr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,n),f=this._getHandJoint(c,g);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,_=.005;c.inputState.pinching&&d>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(eg)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new qi;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class ng extends Li{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,m=null,_=null;const g=e.getContextAttributes();let p=null,f=null;const S=[],v=[],E=new Vt;let C=null;const w=new We;w.layers.enable(1),w.viewport=new ge;const A=new We;A.layers.enable(2),A.viewport=new ge;const I=[w,A],x=new tg;x.layers.enable(1),x.layers.enable(2);let T=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let j=S[W];return j===void 0&&(j=new Fr,S[W]=j),j.getTargetRaySpace()},this.getControllerGrip=function(W){let j=S[W];return j===void 0&&(j=new Fr,S[W]=j),j.getGripSpace()},this.getHand=function(W){let j=S[W];return j===void 0&&(j=new Fr,S[W]=j),j.getHandSpace()};function H(W){const j=v.indexOf(W.inputSource);if(j===-1)return;const at=S[j];at!==void 0&&(at.update(W.inputSource,W.frame,c||a),at.dispatchEvent({type:W.type,data:W.inputSource}))}function k(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",R);for(let W=0;W<S.length;W++){const j=v[W];j!==null&&(v[W]=null,S[W].disconnect(j))}T=null,G=null,t.setRenderTarget(p),m=null,d=null,u=null,s=null,f=null,et.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",k),s.addEventListener("inputsourceschange",R),g.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(E),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const j={antialias:s.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,j),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),f=new Zn(m.framebufferWidth,m.framebufferHeight,{format:Qe,type:Rn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let j=null,at=null,mt=null;g.depth&&(mt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=g.stencil?Ai:Kn,at=g.stencil?Yn:Tn);const pt={colorFormat:e.RGBA8,depthFormat:mt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(pt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),f=new Zn(d.textureWidth,d.textureHeight,{format:Qe,type:Rn,depthTexture:new jc(d.textureWidth,d.textureHeight,at,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const Rt=t.properties.get(f);Rt.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function R(W){for(let j=0;j<W.removed.length;j++){const at=W.removed[j],mt=v.indexOf(at);mt>=0&&(v[mt]=null,S[mt].disconnect(at))}for(let j=0;j<W.added.length;j++){const at=W.added[j];let mt=v.indexOf(at);if(mt===-1){for(let Rt=0;Rt<S.length;Rt++)if(Rt>=v.length){v.push(at),mt=Rt;break}else if(v[Rt]===null){v[Rt]=at,mt=Rt;break}if(mt===-1)break}const pt=S[mt];pt&&pt.connect(at)}}const D=new P,z=new P;function q(W,j,at){D.setFromMatrixPosition(j.matrixWorld),z.setFromMatrixPosition(at.matrixWorld);const mt=D.distanceTo(z),pt=j.projectionMatrix.elements,Rt=at.projectionMatrix.elements,Lt=pt[14]/(pt[10]-1),St=pt[14]/(pt[10]+1),kt=(pt[9]+1)/pt[5],N=(pt[9]-1)/pt[5],Te=(pt[8]-1)/pt[0],_t=(Rt[8]+1)/Rt[0],At=Lt*Te,ut=Lt*_t,ie=mt/(-Te+_t),It=ie*-Te;j.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(It),W.translateZ(ie),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert();const b=Lt+ie,M=St+ie,O=At-It,J=ut+(mt-It),Z=kt*St/M*b,Q=N*St/M*b;W.projectionMatrix.makePerspective(O,J,Z,Q,b,M),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}function X(W,j){j===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(j.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;x.near=A.near=w.near=W.near,x.far=A.far=w.far=W.far,(T!==x.near||G!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),T=x.near,G=x.far);const j=W.parent,at=x.cameras;X(x,j);for(let mt=0;mt<at.length;mt++)X(at[mt],j);at.length===2?q(x,w,A):x.projectionMatrix.copy(w.projectionMatrix),Y(W,x,j)};function Y(W,j,at){at===null?W.matrix.copy(j.matrixWorld):(W.matrix.copy(at.matrixWorld),W.matrix.invert(),W.matrix.multiply(j.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(j.projectionMatrix),W.projectionMatrixInverse.copy(j.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Jr*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(W){l=W,d!==null&&(d.fixedFoveation=W),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=W)};let K=null;function tt(W,j){if(h=j.getViewerPose(c||a),_=j,h!==null){const at=h.views;m!==null&&(t.setRenderTargetFramebuffer(f,m.framebuffer),t.setRenderTarget(f));let mt=!1;at.length!==x.cameras.length&&(x.cameras.length=0,mt=!0);for(let pt=0;pt<at.length;pt++){const Rt=at[pt];let Lt=null;if(m!==null)Lt=m.getViewport(Rt);else{const kt=u.getViewSubImage(d,Rt);Lt=kt.viewport,pt===0&&(t.setRenderTargetTextures(f,kt.colorTexture,d.ignoreDepthValues?void 0:kt.depthStencilTexture),t.setRenderTarget(f))}let St=I[pt];St===void 0&&(St=new We,St.layers.enable(pt),St.viewport=new ge,I[pt]=St),St.matrix.fromArray(Rt.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(Rt.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(Lt.x,Lt.y,Lt.width,Lt.height),pt===0&&(x.matrix.copy(St.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),mt===!0&&x.cameras.push(St)}}for(let at=0;at<S.length;at++){const mt=v[at],pt=S[at];mt!==null&&pt!==void 0&&pt.update(mt,j,c||a)}K&&K(W,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),_=null}const et=new Yc;et.setAnimationLoop(tt),this.setAnimationLoop=function(W){K=W},this.dispose=function(){}}}function ig(i,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,kc(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,S,v,E){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),u(p,f)):f.isMeshPhongMaterial?(r(p,f),h(p,f)):f.isMeshStandardMaterial?(r(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,E)):f.isMeshMatcapMaterial?(r(p,f),_(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),g(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?l(p,f,S,v):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===De&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===De&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const S=t.get(f).envMap;if(S&&(p.envMap.value=S,p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const v=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*v,e(f.lightMap,p.lightMapTransform)}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,S,v){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*S,p.scale.value=v*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),t.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,S){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===De&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,f){f.matcap&&(p.matcap.value=f.matcap)}function g(p,f){const S=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function sg(i,t,e,n){let s={},r={},a=[];const o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(S,v){const E=v.program;n.uniformBlockBinding(S,E)}function c(S,v){let E=s[S.id];E===void 0&&(_(S),E=h(S),s[S.id]=E,S.addEventListener("dispose",p));const C=v.program;n.updateUBOMapping(S,C);const w=t.render.frame;r[S.id]!==w&&(d(S),r[S.id]=w)}function h(S){const v=u();S.__bindingPointIndex=v;const E=i.createBuffer(),C=S.__size,w=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,C,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,E),E}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const v=s[S.id],E=S.uniforms,C=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let w=0,A=E.length;w<A;w++){const I=Array.isArray(E[w])?E[w]:[E[w]];for(let x=0,T=I.length;x<T;x++){const G=I[x];if(m(G,w,x,C)===!0){const H=G.__offset,k=Array.isArray(G.value)?G.value:[G.value];let R=0;for(let D=0;D<k.length;D++){const z=k[D],q=g(z);typeof z=="number"||typeof z=="boolean"?(G.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,H+R,G.__data)):z.isMatrix3?(G.__data[0]=z.elements[0],G.__data[1]=z.elements[1],G.__data[2]=z.elements[2],G.__data[3]=0,G.__data[4]=z.elements[3],G.__data[5]=z.elements[4],G.__data[6]=z.elements[5],G.__data[7]=0,G.__data[8]=z.elements[6],G.__data[9]=z.elements[7],G.__data[10]=z.elements[8],G.__data[11]=0):(z.toArray(G.__data,R),R+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,H,G.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(S,v,E,C){const w=S.value,A=v+"_"+E;if(C[A]===void 0)return typeof w=="number"||typeof w=="boolean"?C[A]=w:C[A]=w.clone(),!0;{const I=C[A];if(typeof w=="number"||typeof w=="boolean"){if(I!==w)return C[A]=w,!0}else if(I.equals(w)===!1)return I.copy(w),!0}return!1}function _(S){const v=S.uniforms;let E=0;const C=16;for(let A=0,I=v.length;A<I;A++){const x=Array.isArray(v[A])?v[A]:[v[A]];for(let T=0,G=x.length;T<G;T++){const H=x[T],k=Array.isArray(H.value)?H.value:[H.value];for(let R=0,D=k.length;R<D;R++){const z=k[R],q=g(z),X=E%C;X!==0&&C-X<q.boundary&&(E+=C-X),H.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=E,E+=q.storage}}}const w=E%C;return w>0&&(E+=C-w),S.__size=E,S.__cache={},this}function g(S){const v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),v}function p(S){const v=S.target;v.removeEventListener("dispose",p);const E=a.indexOf(v.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(const S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}class el{constructor(t={}){const{canvas:e=tu(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=a;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const f=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=he,this._useLegacyLights=!1,this.toneMapping=wn,this.toneMappingExposure=1;const v=this;let E=!1,C=0,w=0,A=null,I=-1,x=null;const T=new ge,G=new ge;let H=null;const k=new Ht(0);let R=0,D=e.width,z=e.height,q=1,X=null,Y=null;const K=new ge(0,0,D,z),tt=new ge(0,0,D,z);let et=!1;const W=new xo;let j=!1,at=!1,mt=null;const pt=new ee,Rt=new Vt,Lt=new P,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function kt(){return A===null?q:1}let N=n;function Te(y,U){for(let B=0;B<y.length;B++){const V=y[B],F=e.getContext(V,U);if(F!==null)return F}return null}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${fo}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",st,!1),N===null){const U=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&U.shift(),N=Te(U,y),N===null)throw Te(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&N instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),N.getShaderPrecisionFormat===void 0&&(N.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let _t,At,ut,ie,It,b,M,O,J,Z,Q,ft,ot,lt,Mt,Nt,$,Yt,Gt,bt,gt,ht,Pt,Xt;function oe(){_t=new pp(N),At=new cp(N,_t,t),_t.init(At),ht=new Qm(N,_t,At),ut=new Zm(N,_t,At),ie=new _p(N),It=new Om,b=new Jm(N,_t,ut,It,At,ht,ie),M=new hp(v),O=new dp(v),J=new Tu(N,At),Pt=new op(N,_t,J,At),Z=new mp(N,J,ie,Pt),Q=new Sp(N,Z,J,ie),Gt=new Mp(N,At,b),Nt=new lp(It),ft=new Fm(v,M,O,_t,At,Pt,Nt),ot=new ig(v,It),lt=new zm,Mt=new Xm(_t,At),Yt=new rp(v,M,O,ut,Q,d,l),$=new $m(v,Q,At),Xt=new sg(N,ie,At,ut),bt=new ap(N,_t,ie,At),gt=new gp(N,_t,ie,At),ie.programs=ft.programs,v.capabilities=At,v.extensions=_t,v.properties=It,v.renderLists=lt,v.shadowMap=$,v.state=ut,v.info=ie}oe();const Ot=new ng(v,N);this.xr=Ot,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const y=_t.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=_t.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(y){y!==void 0&&(q=y,this.setSize(D,z,!1))},this.getSize=function(y){return y.set(D,z)},this.setSize=function(y,U,B=!0){if(Ot.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=y,z=U,e.width=Math.floor(y*q),e.height=Math.floor(U*q),B===!0&&(e.style.width=y+"px",e.style.height=U+"px"),this.setViewport(0,0,y,U)},this.getDrawingBufferSize=function(y){return y.set(D*q,z*q).floor()},this.setDrawingBufferSize=function(y,U,B){D=y,z=U,q=B,e.width=Math.floor(y*B),e.height=Math.floor(U*B),this.setViewport(0,0,y,U)},this.getCurrentViewport=function(y){return y.copy(T)},this.getViewport=function(y){return y.copy(K)},this.setViewport=function(y,U,B,V){y.isVector4?K.set(y.x,y.y,y.z,y.w):K.set(y,U,B,V),ut.viewport(T.copy(K).multiplyScalar(q).floor())},this.getScissor=function(y){return y.copy(tt)},this.setScissor=function(y,U,B,V){y.isVector4?tt.set(y.x,y.y,y.z,y.w):tt.set(y,U,B,V),ut.scissor(G.copy(tt).multiplyScalar(q).floor())},this.getScissorTest=function(){return et},this.setScissorTest=function(y){ut.setScissorTest(et=y)},this.setOpaqueSort=function(y){X=y},this.setTransparentSort=function(y){Y=y},this.getClearColor=function(y){return y.copy(Yt.getClearColor())},this.setClearColor=function(){Yt.setClearColor.apply(Yt,arguments)},this.getClearAlpha=function(){return Yt.getClearAlpha()},this.setClearAlpha=function(){Yt.setClearAlpha.apply(Yt,arguments)},this.clear=function(y=!0,U=!0,B=!0){let V=0;if(y){let F=!1;if(A!==null){const ct=A.texture.format;F=ct===Lc||ct===Cc||ct===Rc}if(F){const ct=A.texture.type,dt=ct===Rn||ct===Tn||ct===mo||ct===Yn||ct===Ac||ct===wc,xt=Yt.getClearColor(),yt=Yt.getClearAlpha(),Ft=xt.r,wt=xt.g,Ct=xt.b;dt?(m[0]=Ft,m[1]=wt,m[2]=Ct,m[3]=yt,N.clearBufferuiv(N.COLOR,0,m)):(_[0]=Ft,_[1]=wt,_[2]=Ct,_[3]=yt,N.clearBufferiv(N.COLOR,0,_))}else V|=N.COLOR_BUFFER_BIT}U&&(V|=N.DEPTH_BUFFER_BIT),B&&(V|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",st,!1),lt.dispose(),Mt.dispose(),It.dispose(),M.dispose(),O.dispose(),Q.dispose(),Pt.dispose(),Xt.dispose(),ft.dispose(),Ot.dispose(),Ot.removeEventListener("sessionstart",be),Ot.removeEventListener("sessionend",Zt),mt&&(mt.dispose(),mt=null),Ae.stop()};function it(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const y=ie.autoReset,U=$.enabled,B=$.autoUpdate,V=$.needsUpdate,F=$.type;oe(),ie.autoReset=y,$.enabled=U,$.autoUpdate=B,$.needsUpdate=V,$.type=F}function st(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function rt(y){const U=y.target;U.removeEventListener("dispose",rt),Et(U)}function Et(y){vt(y),It.remove(y)}function vt(y){const U=It.get(y).programs;U!==void 0&&(U.forEach(function(B){ft.releaseProgram(B)}),y.isShaderMaterial&&ft.releaseShaderCache(y))}this.renderBufferDirect=function(y,U,B,V,F,ct){U===null&&(U=St);const dt=F.isMesh&&F.matrixWorld.determinant()<0,xt=Sl(y,U,B,V,F);ut.setMaterial(V,dt);let yt=B.index,Ft=1;if(V.wireframe===!0){if(yt=Z.getWireframeAttribute(B),yt===void 0)return;Ft=2}const wt=B.drawRange,Ct=B.attributes.position;let ce=wt.start*Ft,Ie=(wt.start+wt.count)*Ft;ct!==null&&(ce=Math.max(ce,ct.start*Ft),Ie=Math.min(Ie,(ct.start+ct.count)*Ft)),yt!==null?(ce=Math.max(ce,0),Ie=Math.min(Ie,yt.count)):Ct!=null&&(ce=Math.max(ce,0),Ie=Math.min(Ie,Ct.count));const pe=Ie-ce;if(pe<0||pe===1/0)return;Pt.setup(F,V,xt,B,yt);let rn,se=bt;if(yt!==null&&(rn=J.get(yt),se=gt,se.setIndex(rn)),F.isMesh)V.wireframe===!0?(ut.setLineWidth(V.wireframeLinewidth*kt()),se.setMode(N.LINES)):se.setMode(N.TRIANGLES);else if(F.isLine){let Bt=V.linewidth;Bt===void 0&&(Bt=1),ut.setLineWidth(Bt*kt()),F.isLineSegments?se.setMode(N.LINES):F.isLineLoop?se.setMode(N.LINE_LOOP):se.setMode(N.LINE_STRIP)}else F.isPoints?se.setMode(N.POINTS):F.isSprite&&se.setMode(N.TRIANGLES);if(F.isBatchedMesh)se.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else if(F.isInstancedMesh)se.renderInstances(ce,pe,F.count);else if(B.isInstancedBufferGeometry){const Bt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,tr=Math.min(B.instanceCount,Bt);se.renderInstances(ce,pe,tr)}else se.render(ce,pe)};function jt(y,U,B){y.transparent===!0&&y.side===Ze&&y.forceSinglePass===!1?(y.side=De,y.needsUpdate=!0,ss(y,U,B),y.side=pn,y.needsUpdate=!0,ss(y,U,B),y.side=Ze):ss(y,U,B)}this.compile=function(y,U,B=null){B===null&&(B=y),p=Mt.get(B),p.init(),S.push(p),B.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),y!==B&&y.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights(v._useLegacyLights);const V=new Set;return y.traverse(function(F){const ct=F.material;if(ct)if(Array.isArray(ct))for(let dt=0;dt<ct.length;dt++){const xt=ct[dt];jt(xt,B,F),V.add(xt)}else jt(ct,B,F),V.add(ct)}),S.pop(),p=null,V},this.compileAsync=function(y,U,B=null){const V=this.compile(y,U,B);return new Promise(F=>{function ct(){if(V.forEach(function(dt){It.get(dt).currentProgram.isReady()&&V.delete(dt)}),V.size===0){F(y);return}setTimeout(ct,10)}_t.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let $t=null;function de(y){$t&&$t(y)}function be(){Ae.stop()}function Zt(){Ae.start()}const Ae=new Yc;Ae.setAnimationLoop(de),typeof self<"u"&&Ae.setContext(self),this.setAnimationLoop=function(y){$t=y,Ot.setAnimationLoop(y),y===null?Ae.stop():Ae.start()},Ot.addEventListener("sessionstart",be),Ot.addEventListener("sessionend",Zt),this.render=function(y,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Ot.enabled===!0&&Ot.isPresenting===!0&&(Ot.cameraAutoUpdate===!0&&Ot.updateCamera(U),U=Ot.getCamera()),y.isScene===!0&&y.onBeforeRender(v,y,U,A),p=Mt.get(y,S.length),p.init(),S.push(p),pt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),W.setFromProjectionMatrix(pt),at=this.localClippingEnabled,j=Nt.init(this.clippingPlanes,at),g=lt.get(y,f.length),g.init(),f.push(g),tn(y,U,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(X,Y),this.info.render.frame++,j===!0&&Nt.beginShadows();const B=p.state.shadowsArray;if($.render(B,y,U),j===!0&&Nt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Yt.render(g,y),p.setupLights(v._useLegacyLights),U.isArrayCamera){const V=U.cameras;for(let F=0,ct=V.length;F<ct;F++){const dt=V[F];Co(g,y,dt,dt.viewport)}}else Co(g,y,U);A!==null&&(b.updateMultisampleRenderTarget(A),b.updateRenderTargetMipmap(A)),y.isScene===!0&&y.onAfterRender(v,y,U),Pt.resetDefaultState(),I=-1,x=null,S.pop(),S.length>0?p=S[S.length-1]:p=null,f.pop(),f.length>0?g=f[f.length-1]:g=null};function tn(y,U,B,V){if(y.visible===!1)return;if(y.layers.test(U.layers)){if(y.isGroup)B=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(U);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||W.intersectsSprite(y)){V&&Lt.setFromMatrixPosition(y.matrixWorld).applyMatrix4(pt);const dt=Q.update(y),xt=y.material;xt.visible&&g.push(y,dt,xt,B,Lt.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||W.intersectsObject(y))){const dt=Q.update(y),xt=y.material;if(V&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Lt.copy(y.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),Lt.copy(dt.boundingSphere.center)),Lt.applyMatrix4(y.matrixWorld).applyMatrix4(pt)),Array.isArray(xt)){const yt=dt.groups;for(let Ft=0,wt=yt.length;Ft<wt;Ft++){const Ct=yt[Ft],ce=xt[Ct.materialIndex];ce&&ce.visible&&g.push(y,dt,ce,B,Lt.z,Ct)}}else xt.visible&&g.push(y,dt,xt,B,Lt.z,null)}}const ct=y.children;for(let dt=0,xt=ct.length;dt<xt;dt++)tn(ct[dt],U,B,V)}function Co(y,U,B,V){const F=y.opaque,ct=y.transmissive,dt=y.transparent;p.setupLightsView(B),j===!0&&Nt.setGlobalState(v.clippingPlanes,B),ct.length>0&&Ml(F,ct,U,B),V&&ut.viewport(T.copy(V)),F.length>0&&is(F,U,B),ct.length>0&&is(ct,U,B),dt.length>0&&is(dt,U,B),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function Ml(y,U,B,V){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;const ct=At.isWebGL2;mt===null&&(mt=new Zn(1,1,{generateMipmaps:!0,type:_t.has("EXT_color_buffer_half_float")?ji:Rn,minFilter:Ki,samples:ct?4:0})),v.getDrawingBufferSize(Rt),ct?mt.setSize(Rt.x,Rt.y):mt.setSize(Qr(Rt.x),Qr(Rt.y));const dt=v.getRenderTarget();v.setRenderTarget(mt),v.getClearColor(k),R=v.getClearAlpha(),R<1&&v.setClearColor(16777215,.5),v.clear();const xt=v.toneMapping;v.toneMapping=wn,is(y,B,V),b.updateMultisampleRenderTarget(mt),b.updateRenderTargetMipmap(mt);let yt=!1;for(let Ft=0,wt=U.length;Ft<wt;Ft++){const Ct=U[Ft],ce=Ct.object,Ie=Ct.geometry,pe=Ct.material,rn=Ct.group;if(pe.side===Ze&&ce.layers.test(V.layers)){const se=pe.side;pe.side=De,pe.needsUpdate=!0,Lo(ce,B,V,Ie,pe,rn),pe.side=se,pe.needsUpdate=!0,yt=!0}}yt===!0&&(b.updateMultisampleRenderTarget(mt),b.updateRenderTargetMipmap(mt)),v.setRenderTarget(dt),v.setClearColor(k,R),v.toneMapping=xt}function is(y,U,B){const V=U.isScene===!0?U.overrideMaterial:null;for(let F=0,ct=y.length;F<ct;F++){const dt=y[F],xt=dt.object,yt=dt.geometry,Ft=V===null?dt.material:V,wt=dt.group;xt.layers.test(B.layers)&&Lo(xt,U,B,yt,Ft,wt)}}function Lo(y,U,B,V,F,ct){y.onBeforeRender(v,U,B,V,F,ct),y.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),F.onBeforeRender(v,U,B,V,y,ct),F.transparent===!0&&F.side===Ze&&F.forceSinglePass===!1?(F.side=De,F.needsUpdate=!0,v.renderBufferDirect(B,U,V,F,y,ct),F.side=pn,F.needsUpdate=!0,v.renderBufferDirect(B,U,V,F,y,ct),F.side=Ze):v.renderBufferDirect(B,U,V,F,y,ct),y.onAfterRender(v,U,B,V,F,ct)}function ss(y,U,B){U.isScene!==!0&&(U=St);const V=It.get(y),F=p.state.lights,ct=p.state.shadowsArray,dt=F.state.version,xt=ft.getParameters(y,F.state,ct,U,B),yt=ft.getProgramCacheKey(xt);let Ft=V.programs;V.environment=y.isMeshStandardMaterial?U.environment:null,V.fog=U.fog,V.envMap=(y.isMeshStandardMaterial?O:M).get(y.envMap||V.environment),Ft===void 0&&(y.addEventListener("dispose",rt),Ft=new Map,V.programs=Ft);let wt=Ft.get(yt);if(wt!==void 0){if(V.currentProgram===wt&&V.lightsStateVersion===dt)return Do(y,xt),wt}else xt.uniforms=ft.getUniforms(y),y.onBuild(B,xt,v),y.onBeforeCompile(xt,v),wt=ft.acquireProgram(xt,yt),Ft.set(yt,wt),V.uniforms=xt.uniforms;const Ct=V.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ct.clippingPlanes=Nt.uniform),Do(y,xt),V.needsLights=yl(y),V.lightsStateVersion=dt,V.needsLights&&(Ct.ambientLightColor.value=F.state.ambient,Ct.lightProbe.value=F.state.probe,Ct.directionalLights.value=F.state.directional,Ct.directionalLightShadows.value=F.state.directionalShadow,Ct.spotLights.value=F.state.spot,Ct.spotLightShadows.value=F.state.spotShadow,Ct.rectAreaLights.value=F.state.rectArea,Ct.ltc_1.value=F.state.rectAreaLTC1,Ct.ltc_2.value=F.state.rectAreaLTC2,Ct.pointLights.value=F.state.point,Ct.pointLightShadows.value=F.state.pointShadow,Ct.hemisphereLights.value=F.state.hemi,Ct.directionalShadowMap.value=F.state.directionalShadowMap,Ct.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Ct.spotShadowMap.value=F.state.spotShadowMap,Ct.spotLightMatrix.value=F.state.spotLightMatrix,Ct.spotLightMap.value=F.state.spotLightMap,Ct.pointShadowMap.value=F.state.pointShadowMap,Ct.pointShadowMatrix.value=F.state.pointShadowMatrix),V.currentProgram=wt,V.uniformsList=null,wt}function Po(y){if(y.uniformsList===null){const U=y.currentProgram.getUniforms();y.uniformsList=Is.seqWithValue(U.seq,y.uniforms)}return y.uniformsList}function Do(y,U){const B=It.get(y);B.outputColorSpace=U.outputColorSpace,B.batching=U.batching,B.instancing=U.instancing,B.instancingColor=U.instancingColor,B.skinning=U.skinning,B.morphTargets=U.morphTargets,B.morphNormals=U.morphNormals,B.morphColors=U.morphColors,B.morphTargetsCount=U.morphTargetsCount,B.numClippingPlanes=U.numClippingPlanes,B.numIntersection=U.numClipIntersection,B.vertexAlphas=U.vertexAlphas,B.vertexTangents=U.vertexTangents,B.toneMapping=U.toneMapping}function Sl(y,U,B,V,F){U.isScene!==!0&&(U=St),b.resetTextureUnits();const ct=U.fog,dt=V.isMeshStandardMaterial?U.environment:null,xt=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:mn,yt=(V.isMeshStandardMaterial?O:M).get(V.envMap||dt),Ft=V.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,wt=!!B.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ct=!!B.morphAttributes.position,ce=!!B.morphAttributes.normal,Ie=!!B.morphAttributes.color;let pe=wn;V.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(pe=v.toneMapping);const rn=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,se=rn!==void 0?rn.length:0,Bt=It.get(V),tr=p.state.lights;if(j===!0&&(at===!0||y!==x)){const Ge=y===x&&V.id===I;Nt.setState(V,y,Ge)}let ae=!1;V.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==tr.state.version||Bt.outputColorSpace!==xt||F.isBatchedMesh&&Bt.batching===!1||!F.isBatchedMesh&&Bt.batching===!0||F.isInstancedMesh&&Bt.instancing===!1||!F.isInstancedMesh&&Bt.instancing===!0||F.isSkinnedMesh&&Bt.skinning===!1||!F.isSkinnedMesh&&Bt.skinning===!0||F.isInstancedMesh&&Bt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Bt.instancingColor===!1&&F.instanceColor!==null||Bt.envMap!==yt||V.fog===!0&&Bt.fog!==ct||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==Nt.numPlanes||Bt.numIntersection!==Nt.numIntersection)||Bt.vertexAlphas!==Ft||Bt.vertexTangents!==wt||Bt.morphTargets!==Ct||Bt.morphNormals!==ce||Bt.morphColors!==Ie||Bt.toneMapping!==pe||At.isWebGL2===!0&&Bt.morphTargetsCount!==se)&&(ae=!0):(ae=!0,Bt.__version=V.version);let Nn=Bt.currentProgram;ae===!0&&(Nn=ss(V,U,F));let Uo=!1,Fi=!1,er=!1;const Me=Nn.getUniforms(),Fn=Bt.uniforms;if(ut.useProgram(Nn.program)&&(Uo=!0,Fi=!0,er=!0),V.id!==I&&(I=V.id,Fi=!0),Uo||x!==y){Me.setValue(N,"projectionMatrix",y.projectionMatrix),Me.setValue(N,"viewMatrix",y.matrixWorldInverse);const Ge=Me.map.cameraPosition;Ge!==void 0&&Ge.setValue(N,Lt.setFromMatrixPosition(y.matrixWorld)),At.logarithmicDepthBuffer&&Me.setValue(N,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Me.setValue(N,"isOrthographic",y.isOrthographicCamera===!0),x!==y&&(x=y,Fi=!0,er=!0)}if(F.isSkinnedMesh){Me.setOptional(N,F,"bindMatrix"),Me.setOptional(N,F,"bindMatrixInverse");const Ge=F.skeleton;Ge&&(At.floatVertexTextures?(Ge.boneTexture===null&&Ge.computeBoneTexture(),Me.setValue(N,"boneTexture",Ge.boneTexture,b)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}F.isBatchedMesh&&(Me.setOptional(N,F,"batchingTexture"),Me.setValue(N,"batchingTexture",F._matricesTexture,b));const nr=B.morphAttributes;if((nr.position!==void 0||nr.normal!==void 0||nr.color!==void 0&&At.isWebGL2===!0)&&Gt.update(F,B,Nn),(Fi||Bt.receiveShadow!==F.receiveShadow)&&(Bt.receiveShadow=F.receiveShadow,Me.setValue(N,"receiveShadow",F.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Fn.envMap.value=yt,Fn.flipEnvMap.value=yt.isCubeTexture&&yt.isRenderTargetTexture===!1?-1:1),Fi&&(Me.setValue(N,"toneMappingExposure",v.toneMappingExposure),Bt.needsLights&&El(Fn,er),ct&&V.fog===!0&&ot.refreshFogUniforms(Fn,ct),ot.refreshMaterialUniforms(Fn,V,q,z,mt),Is.upload(N,Po(Bt),Fn,b)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Is.upload(N,Po(Bt),Fn,b),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Me.setValue(N,"center",F.center),Me.setValue(N,"modelViewMatrix",F.modelViewMatrix),Me.setValue(N,"normalMatrix",F.normalMatrix),Me.setValue(N,"modelMatrix",F.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Ge=V.uniformsGroups;for(let ir=0,Tl=Ge.length;ir<Tl;ir++)if(At.isWebGL2){const Io=Ge[ir];Xt.update(Io,Nn),Xt.bind(Io,Nn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Nn}function El(y,U){y.ambientLightColor.needsUpdate=U,y.lightProbe.needsUpdate=U,y.directionalLights.needsUpdate=U,y.directionalLightShadows.needsUpdate=U,y.pointLights.needsUpdate=U,y.pointLightShadows.needsUpdate=U,y.spotLights.needsUpdate=U,y.spotLightShadows.needsUpdate=U,y.rectAreaLights.needsUpdate=U,y.hemisphereLights.needsUpdate=U}function yl(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(y,U,B){It.get(y.texture).__webglTexture=U,It.get(y.depthTexture).__webglTexture=B;const V=It.get(y);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=B===void 0,V.__autoAllocateDepthBuffer||_t.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(y,U){const B=It.get(y);B.__webglFramebuffer=U,B.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(y,U=0,B=0){A=y,C=U,w=B;let V=!0,F=null,ct=!1,dt=!1;if(y){const yt=It.get(y);yt.__useDefaultFramebuffer!==void 0?(ut.bindFramebuffer(N.FRAMEBUFFER,null),V=!1):yt.__webglFramebuffer===void 0?b.setupRenderTarget(y):yt.__hasExternalTextures&&b.rebindTextures(y,It.get(y.texture).__webglTexture,It.get(y.depthTexture).__webglTexture);const Ft=y.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(dt=!0);const wt=It.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(wt[U])?F=wt[U][B]:F=wt[U],ct=!0):At.isWebGL2&&y.samples>0&&b.useMultisampledRTT(y)===!1?F=It.get(y).__webglMultisampledFramebuffer:Array.isArray(wt)?F=wt[B]:F=wt,T.copy(y.viewport),G.copy(y.scissor),H=y.scissorTest}else T.copy(K).multiplyScalar(q).floor(),G.copy(tt).multiplyScalar(q).floor(),H=et;if(ut.bindFramebuffer(N.FRAMEBUFFER,F)&&At.drawBuffers&&V&&ut.drawBuffers(y,F),ut.viewport(T),ut.scissor(G),ut.setScissorTest(H),ct){const yt=It.get(y.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+U,yt.__webglTexture,B)}else if(dt){const yt=It.get(y.texture),Ft=U||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,yt.__webglTexture,B||0,Ft)}I=-1},this.readRenderTargetPixels=function(y,U,B,V,F,ct,dt){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=It.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&dt!==void 0&&(xt=xt[dt]),xt){ut.bindFramebuffer(N.FRAMEBUFFER,xt);try{const yt=y.texture,Ft=yt.format,wt=yt.type;if(Ft!==Qe&&ht.convert(Ft)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ct=wt===ji&&(_t.has("EXT_color_buffer_half_float")||At.isWebGL2&&_t.has("EXT_color_buffer_float"));if(wt!==Rn&&ht.convert(wt)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_TYPE)&&!(wt===bn&&(At.isWebGL2||_t.has("OES_texture_float")||_t.has("WEBGL_color_buffer_float")))&&!Ct){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=y.width-V&&B>=0&&B<=y.height-F&&N.readPixels(U,B,V,F,ht.convert(Ft),ht.convert(wt),ct)}finally{const yt=A!==null?It.get(A).__webglFramebuffer:null;ut.bindFramebuffer(N.FRAMEBUFFER,yt)}}},this.copyFramebufferToTexture=function(y,U,B=0){const V=Math.pow(2,-B),F=Math.floor(U.image.width*V),ct=Math.floor(U.image.height*V);b.setTexture2D(U,0),N.copyTexSubImage2D(N.TEXTURE_2D,B,0,0,y.x,y.y,F,ct),ut.unbindTexture()},this.copyTextureToTexture=function(y,U,B,V=0){const F=U.image.width,ct=U.image.height,dt=ht.convert(B.format),xt=ht.convert(B.type);b.setTexture2D(B,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment),U.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,V,y.x,y.y,F,ct,dt,xt,U.image.data):U.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,V,y.x,y.y,U.mipmaps[0].width,U.mipmaps[0].height,dt,U.mipmaps[0].data):N.texSubImage2D(N.TEXTURE_2D,V,y.x,y.y,dt,xt,U.image),V===0&&B.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),ut.unbindTexture()},this.copyTextureToTexture3D=function(y,U,B,V,F=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ct=y.max.x-y.min.x+1,dt=y.max.y-y.min.y+1,xt=y.max.z-y.min.z+1,yt=ht.convert(V.format),Ft=ht.convert(V.type);let wt;if(V.isData3DTexture)b.setTexture3D(V,0),wt=N.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)b.setTexture2DArray(V,0),wt=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,V.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,V.unpackAlignment);const Ct=N.getParameter(N.UNPACK_ROW_LENGTH),ce=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Ie=N.getParameter(N.UNPACK_SKIP_PIXELS),pe=N.getParameter(N.UNPACK_SKIP_ROWS),rn=N.getParameter(N.UNPACK_SKIP_IMAGES),se=B.isCompressedTexture?B.mipmaps[F]:B.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,se.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,se.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,y.min.x),N.pixelStorei(N.UNPACK_SKIP_ROWS,y.min.y),N.pixelStorei(N.UNPACK_SKIP_IMAGES,y.min.z),B.isDataTexture||B.isData3DTexture?N.texSubImage3D(wt,F,U.x,U.y,U.z,ct,dt,xt,yt,Ft,se.data):B.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),N.compressedTexSubImage3D(wt,F,U.x,U.y,U.z,ct,dt,xt,yt,se.data)):N.texSubImage3D(wt,F,U.x,U.y,U.z,ct,dt,xt,yt,Ft,se),N.pixelStorei(N.UNPACK_ROW_LENGTH,Ct),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ce),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ie),N.pixelStorei(N.UNPACK_SKIP_ROWS,pe),N.pixelStorei(N.UNPACK_SKIP_IMAGES,rn),F===0&&V.generateMipmaps&&N.generateMipmap(wt),ut.unbindTexture()},this.initTexture=function(y){y.isCubeTexture?b.setTextureCube(y,0):y.isData3DTexture?b.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?b.setTexture2DArray(y,0):b.setTexture2D(y,0),ut.unbindTexture()},this.resetState=function(){C=0,w=0,A=null,ut.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===go?"display-p3":"srgb",e.unpackColorSpace=Kt.workingColorSpace===js?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===he?jn:Dc}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===jn?he:mn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class rg extends el{}rg.prototype.isWebGL1Renderer=!0;class Eo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ht(t),this.near=e,this.far=n}clone(){return new Eo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class og extends ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class eo extends xe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const _i=new ee,sc=new ee,ws=[],rc=new Qn,ag=new ee,Vi=new Ce,ki=new Pi;class nl extends Ce{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new eo(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ag)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Qn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,_i),rc.copy(t.boundingBox).applyMatrix4(_i),this.boundingBox.union(rc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Pi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,_i),ki.copy(t.boundingSphere).applyMatrix4(_i),this.boundingSphere.union(ki)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Vi.geometry=this.geometry,Vi.material=this.material,Vi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ki.copy(this.boundingSphere),ki.applyMatrix4(n),t.ray.intersectsSphere(ki)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,_i),sc.multiplyMatrices(n,_i),Vi.matrixWorld=sc,Vi.raycast(t,ws);for(let a=0,o=ws.length;a<o;a++){const l=ws[a];l.instanceId=r,l.object=this,e.push(l)}ws.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new eo(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class il extends Di{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const oc=new ee,no=new _o,Rs=new Pi,Cs=new P;class cg extends ve{constructor(t=new _e,e=new il){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Rs.copy(n.boundingSphere),Rs.applyMatrix4(s),Rs.radius+=r,t.ray.intersectsSphere(Rs)===!1)return;oc.copy(s).invert(),no.copy(t.ray).applyMatrix4(oc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let _=d,g=m;_<g;_++){const p=c.getX(_);Cs.fromBufferAttribute(u,p),ac(Cs,p,l,s,t,e,this)}}else{const d=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let _=d,g=m;_<g;_++)Cs.fromBufferAttribute(u,_),ac(Cs,_,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ac(i,t,e,n,s,r,a){const o=no.distanceSqToPoint(i);if(o<e){const l=new P;no.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,object:a})}}class sl extends Ue{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class yo extends _e{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new P,h=new Vt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const m=n+u/e*s;c.x=t*Math.cos(m),c.y=t*Math.sin(m),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ye(a,3)),this.setAttribute("normal",new ye(o,3)),this.setAttribute("uv",new ye(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ts extends _e{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],m=[];let _=0;const g=[],p=n/2;let f=0;S(),a===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new ye(u,3)),this.setAttribute("normal",new ye(d,3)),this.setAttribute("uv",new ye(m,2));function S(){const E=new P,C=new P;let w=0;const A=(e-t)/n;for(let I=0;I<=r;I++){const x=[],T=I/r,G=T*(e-t)+t;for(let H=0;H<=s;H++){const k=H/s,R=k*l+o,D=Math.sin(R),z=Math.cos(R);C.x=G*D,C.y=-T*n+p,C.z=G*z,u.push(C.x,C.y,C.z),E.set(D,A,z).normalize(),d.push(E.x,E.y,E.z),m.push(k,1-T),x.push(_++)}g.push(x)}for(let I=0;I<s;I++)for(let x=0;x<r;x++){const T=g[x][I],G=g[x+1][I],H=g[x+1][I+1],k=g[x][I+1];h.push(T,G,k),h.push(G,H,k),w+=6}c.addGroup(f,w,0),f+=w}function v(E){const C=_,w=new Vt,A=new P;let I=0;const x=E===!0?t:e,T=E===!0?1:-1;for(let H=1;H<=s;H++)u.push(0,p*T,0),d.push(0,T,0),m.push(.5,.5),_++;const G=_;for(let H=0;H<=s;H++){const R=H/s*l+o,D=Math.cos(R),z=Math.sin(R);A.x=x*z,A.y=p*T,A.z=x*D,u.push(A.x,A.y,A.z),d.push(0,T,0),w.x=D*.5+.5,w.y=z*.5*T+.5,m.push(w.x,w.y),_++}for(let H=0;H<s;H++){const k=C+H,R=G+H;E===!0?h.push(R,R+1,k):h.push(R+1,R,k),I+=3}c.addGroup(f,I,E===!0?1:2),f+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ts(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Js extends ts{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Js(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class To extends _e{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new ye(r,3)),this.setAttribute("normal",new ye(r.slice(),3)),this.setAttribute("uv",new ye(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const v=new P,E=new P,C=new P;for(let w=0;w<e.length;w+=3)m(e[w+0],v),m(e[w+1],E),m(e[w+2],C),l(v,E,C,S)}function l(S,v,E,C){const w=C+1,A=[];for(let I=0;I<=w;I++){A[I]=[];const x=S.clone().lerp(E,I/w),T=v.clone().lerp(E,I/w),G=w-I;for(let H=0;H<=G;H++)H===0&&I===w?A[I][H]=x:A[I][H]=x.clone().lerp(T,H/G)}for(let I=0;I<w;I++)for(let x=0;x<2*(w-I)-1;x++){const T=Math.floor(x/2);x%2===0?(d(A[I][T+1]),d(A[I+1][T]),d(A[I][T])):(d(A[I][T+1]),d(A[I+1][T+1]),d(A[I+1][T]))}}function c(S){const v=new P;for(let E=0;E<r.length;E+=3)v.x=r[E+0],v.y=r[E+1],v.z=r[E+2],v.normalize().multiplyScalar(S),r[E+0]=v.x,r[E+1]=v.y,r[E+2]=v.z}function h(){const S=new P;for(let v=0;v<r.length;v+=3){S.x=r[v+0],S.y=r[v+1],S.z=r[v+2];const E=p(S)/2/Math.PI+.5,C=f(S)/Math.PI+.5;a.push(E,1-C)}_(),u()}function u(){for(let S=0;S<a.length;S+=6){const v=a[S+0],E=a[S+2],C=a[S+4],w=Math.max(v,E,C),A=Math.min(v,E,C);w>.9&&A<.1&&(v<.2&&(a[S+0]+=1),E<.2&&(a[S+2]+=1),C<.2&&(a[S+4]+=1))}}function d(S){r.push(S.x,S.y,S.z)}function m(S,v){const E=S*3;v.x=t[E+0],v.y=t[E+1],v.z=t[E+2]}function _(){const S=new P,v=new P,E=new P,C=new P,w=new Vt,A=new Vt,I=new Vt;for(let x=0,T=0;x<r.length;x+=9,T+=6){S.set(r[x+0],r[x+1],r[x+2]),v.set(r[x+3],r[x+4],r[x+5]),E.set(r[x+6],r[x+7],r[x+8]),w.set(a[T+0],a[T+1]),A.set(a[T+2],a[T+3]),I.set(a[T+4],a[T+5]),C.copy(S).add(v).add(E).divideScalar(3);const G=p(C);g(w,T+0,S,G),g(A,T+2,v,G),g(I,T+4,E,G)}}function g(S,v,E,C){C<0&&S.x===1&&(a[v]=S.x-1),E.x===0&&E.z===0&&(a[v]=C/2/Math.PI+.5)}function p(S){return Math.atan2(S.z,-S.x)}function f(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new To(t.vertices,t.indices,t.radius,t.details)}}class In extends To{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new In(t.radius,t.detail)}}class ks extends Di{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Uc,this.normalScale=new Vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=po,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class rl extends ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class lg extends rl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Or=new ee,cc=new P,lc=new P;class hg{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Vt(512,512),this.map=null,this.mapPass=null,this.matrix=new ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xo,this._frameExtents=new Vt(1,1),this._viewportCount=1,this._viewports=[new ge(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;cc.setFromMatrixPosition(t.matrixWorld),e.position.copy(cc),lc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lc),e.updateMatrixWorld(),Or.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Or),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Or)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class ug extends hg{constructor(){super(new Kc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fg extends rl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.shadow=new ug}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class dg{constructor(t,e,n=0,s=1/0){this.ray=new _o(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new vo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return io(t,this,n,e),n.sort(hc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)io(t[s],this,n,e);return n.sort(hc),n}}function hc(i,t){return i.distance-t.distance}function io(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,a=s.length;r<a;r++)io(s[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fo);const pg=12376296,mg=14477548,gg=8020039,_g=4010280,ol=16317438,sn=[];sn[ze]={top:3104120,edge:4018002,name:"river"};sn[gn]={top:12965498,edge:10729058,name:"meadow"};sn[Ji]={top:5012042,edge:3825468,name:"forest"};sn[qs]={top:11706465,edge:9667662,name:"hills"};sn[Pn]={top:14207142,edge:11904386,name:"hamlet"};sn[Dn]={top:7304575,edge:5593956,name:"peak"};const vg=10475754,xg=4166334,al=2.5,Mg=.55,Wi=[4156223,4881221,3563580,5603141],Sg=[12091964,11102772],Eg=[15261127,14470578,15787990],yg=[10506044,9192502,11754309,7166540],Tg=[9146262,10133670,8159625];function Cn(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}function cl(i,t,e){const n=i>>16&255,s=i>>8&255,r=i&255,a=t>>16&255,o=t>>8&255,l=t&255;return Math.round(n+(a-n)*e)<<16|Math.round(s+(o-s)*e)<<8|Math.round(r+(l-r)*e)}const ll=(i,t=0)=>{const e=Math.min(1,Math.max(0,(i-al-t)/Mg));return e*e*(3-2*e)};function hl(i,t,e){const n=Cn(sn[i].top,.94+e*.12);return cl(n,ol,ll(t))}function ul(i,t,e){const n=Cn(sn[i].edge,.94+e*.1);return cl(n,Cn(ol,.86),ll(t,.25))}const uc=i=>Ys[i],fc=Ys[ze],Ut=.42,fl=1.6,so=.17,Xi=.075,dc=.3,Be=i=>i*Ut*fl;function Ve(i,t){let e=i*374761393+t*2246822519|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function bg(i,t,e){const n=t[0]-i[0],s=t[1]-i[1],r=Math.hypot(n,s)||1,a=-s/r,o=n/r;return[i[0]+a*e,i[1]+o*e,n,s]}function Ag(i,t){const[e,n,s,r]=i,[a,o,l,c]=t,h=s*c-r*l;if(Math.abs(h)<1e-9)return[e,n];const u=((a-e)*c-(o-n)*l)/h;return[e+s*u,n+r*u]}function ro(i,t,e){const n=[];for(let r=0;r<4;r++)n.push(bg(i[r],i[(r+1)%4],t[r]?e:0));const s=[];for(let r=0;r<4;r++)s.push(Ag(n[(r+3)%4],n[r]));return s}class Ws{constructor(){this.pos=[],this.nrm=[],this.col=[]}get count(){return this.pos.length/3}tri(t,e,n,s,r,a){const o=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=n[0]-t[0],u=n[1]-t[1],d=n[2]-t[2];let m=l*d-c*u,_=c*h-o*d,g=o*u-l*h;const p=Math.hypot(m,_,g)||1;m/=p,_/=p,g/=p,this.pos.push(t[0],t[1],t[2],e[0],e[1],e[2],n[0],n[1],n[2]),this.nrm.push(m,_,g,m,_,g,m,_,g),Br(this.col,s),Br(this.col,r),Br(this.col,a)}quad(t,e,n,s,r,a){this.tri(t,e,n,r,r,a),this.tri(t,n,s,r,a,a)}}const Ns=new Float32Array(256);for(let i=0;i<256;i++){const t=i/255;Ns[i]=t<.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function Br(i,t){i.push(Ns[t>>16&255],Ns[t>>8&255],Ns[t&255])}function wg(i,t={}){const e=i.board,n=new Ws,s=new Ws,r=[],a=[0,0,0,0],o=[!1,!1,!1,!1],l=[-1,-1,-1,-1];for(const c of e.filled){const h=Qt(c),u=te(c),d=re(c),m=e.biome.get(c),_=e.owner.get(c),g=i.elev.get(c)??0,p=i.jitter.get(c)??.5,S=e.sealed.has(e.find(c))?Math.min(1,p+.55):p,v=$n(h,u,d).map(([k,R])=>{const[D,z]=Ln(k,R);return[D*Ut,z*Ut]});Oe(h,u,d,a);for(let k=0;k<4;k++){const R=(k+1)%4,D=a[R],z=e.filled.has(D);o[k]=!(z&&e.owner.get(D)===_),l[k]=z?e.biome.get(D):-1}const E=ro(v,o,so*Ut),C=m===ze?fc:uc(m),w=E.map(k=>Be(i.groundAt(k[0]/Ut,k[1]/Ut)+C)),A=v.map(k=>Be(i.groundAt(k[0]/Ut,k[1]/Ut)+C)),I=m===ze?.055:0,x=E.map((k,R)=>[k[0],w[R]-I,k[1]]),T=m===ze?[2837070,2837070,2837070,2837070]:w.map(k=>hl(m,k/(Ut*fl),S));if(n.tri(x[0],x[2],x[1],T[0],T[2],T[1]),n.tri(x[0],x[3],x[2],T[0],T[3],T[2]),m===ze){const R=E.map((D,z)=>[D[0],w[z]+.008,D[1]]);s.tri(R[0],R[2],R[1],16777215,16777215,16777215),s.tri(R[0],R[3],R[2],16777215,16777215,16777215)}const G=ul(m,g,S),H=Cn(gg,.9+p*.2);if(o[0]||o[1]||o[2]||o[3]){const k=v.map((R,D)=>[R[0],A[D]-Xi,R[1]]);n.tri(k[0],k[2],k[1],H,H,H),n.tri(k[0],k[3],k[2],H,H,H)}for(let k=0;k<4;k++){const R=k,D=(k+1)%4;let z=A[R]-Xi,q=A[D]-Xi;o[k]?n.quad([E[R][0],w[R],E[R][1]],[E[D][0],w[D],E[D][1]],[v[D][0],q,v[D][1]],[v[R][0],z,v[R][1]],G,G):(z=A[R],q=A[D]);let X,Y;if(l[k]>=0){const et=l[k]===ze?fc:uc(l[k]);X=Be(i.groundAt(v[R][0]/Ut,v[R][1]/Ut)+et)-(o[k]?Xi:0)-.004,Y=Be(i.groundAt(v[D][0]/Ut,v[D][1]/Ut)+et)-(o[k]?Xi:0)-.004}else X=z-dc,Y=q-dc;if(X>=z-1e-4&&Y>=q-1e-4)continue;const K=o[k]?H:Cn(G,.86),tt=o[k]?_g:Cn(G,.66);n.quad([v[R][0],z,v[R][1]],[v[D][0],q,v[D][1]],[v[D][0],Math.min(Y,q),v[D][1]],[v[R][0],Math.min(X,z),v[R][1]],K,tt)}t.noProps||Cg(r,c,m,E,w,p,g)}for(const c of e.dead){const h=Qt(c),u=te(c),d=re(c),m=$n(h,u,d).map(([E,C])=>{const[w,A]=Ln(E,C);return[w*Ut,A*Ut]}),g=ro(m,[!0,!0,!0,!0],so*Ut),p=g.map(E=>Be(i.groundAt(E[0]/Ut,E[1]/Ut)-.26)),f=2373951,S=g.map((E,C)=>[E[0],p[C]-.05,E[1]]);n.tri(S[0],S[2],S[1],f,f,f),n.tri(S[0],S[3],S[2],f,f,f);const v=g.map((E,C)=>[E[0],p[C],E[1]]);s.tri(v[0],v[2],v[1],16777215,16777215,16777215),s.tri(v[0],v[3],v[2],16777215,16777215,16777215)}for(const[c,h]of e.landmarks){if(!e.filled.has(h))continue;const[u,d]=qn(Qt(h),te(h),re(h));r.push({type:pl,x:u*Ut,y:Be(i.elev.get(h)??0),z:d*Ut,s:1,rot:Ve(h,3)*Math.PI*2,tint:Ve(h,4),biome:e.biome.get(h)})}return{land:n,water:s,props:r}}function Rg(i,t,e){const n=Ve(t,e*7+1),s=Ve(t,e*7+2),r=Ve(t,e*7+3),a=n<.5?[i[0],i[1],i[2]]:[i[0],i[2],i[3]];let o=s,l=r;o+l>1&&(o=1-o,l=1-l);const c=a[0][0]+(a[1][0]-a[0][0])*o+(a[2][0]-a[0][0])*l,h=a[0][1]+(a[1][1]-a[0][1])*o+(a[2][1]-a[0][1])*l,u=(i[0][0]+i[1][0]+i[2][0]+i[3][0])/4,d=(i[0][1]+i[1][1]+i[2][1]+i[3][1])/4;return[u+(c-u)*.82,d+(h-d)*.82]}const oo=0,ao=1,co=2,dl=3,lo=4,pl=5;function Cg(i,t,e,n,s,r,a){const o=(s[0]+s[1]+s[2]+s[3])/4,l=(c,h,u,d=0)=>{const[m,_]=Rg(n,t,h);i.push({type:c,x:m,y:o,z:_,s:u,rot:Ve(t,h*13+5)*Math.PI*2,tint:Ve(t,h*13+6),extra:d})};switch(e){case Ji:{const c=3+Math.floor(r*2.6);for(let h=0;h<c;h++){const u=Ve(t,h*31+9)<.3;l(u?ao:oo,h,.72+Ve(t,h*17)*.5)}break}case gn:{r<.22&&l(ao,0,.7+r),r>.55&&l(lo,1,.7+Ve(t,3)*.6);break}case qs:{const c=r>.45?2:1;for(let h=0;h<c;h++)l(co,h,.55+Ve(t,h*19)*.7);r>.35&&l(lo,5,.6+r*.5);break}case Pn:{const c=1+(r>.62?1:0);for(let h=0;h<c;h++)l(dl,h*2,.85+Ve(t,h*23)*.35);r<.4&&l(oo,6,.6);break}case Dn:{a<al&&r>.35&&l(co,0,.7+r*.7);break}}}function Lg(i,t,e,n){const s=new Ws,r=[0,0,0,0],a=new Set(i);for(let o=0;o<i.length;o++){const l=i[o],c=Qt(l),h=te(l),u=re(l),d=t[o],m=$n(c,h,u).map(([A,I])=>{const[x,T]=Ln(A,I);return[x*Ut,T*Ut]});Oe(c,h,u,r);const _=[!1,!1,!1,!1];for(let A=0;A<4;A++)_[A]=!a.has(r[(A+1)%4]);const g=ro(m,_,so*Ut),p=Ys[d],f=g.map(A=>Be(e.groundAt(A[0]/Ut,A[1]/Ut)+p)+n),S=m.map(A=>Be(e.groundAt(A[0]/Ut,A[1]/Ut)+p)+n),v=e.groundAt((m[0][0]+m[1][0]+m[2][0]+m[3][0])/4/Ut,(m[0][1]+m[1][1]+m[2][1]+m[3][1])/4/Ut)+p,E=hl(d,v,.5),C=g.map((A,I)=>[A[0],f[I],A[1]]);s.tri(C[0],C[2],C[1],E,E,E),s.tri(C[0],C[3],C[2],E,E,E);const w=ul(d,v,.5);for(let A=0;A<4;A++){if(!_[A])continue;const I=A,x=(A+1)%4;s.quad([g[I][0],f[I],g[I][1]],[g[x][0],f[x],g[x][1]],[m[x][0],S[x]-.13,m[x][1]],[m[I][0],S[I]-.13,m[I][1]],w,Cn(w,.7))}}return s}const Hn=i=>new Ht(i).convertSRGBToLinear();function Pg(){const i=new ts(.022,.032,.15,5,1);return i.translate(0,.075,0),i}function Dg(){const i=new Js(.115,.42,6,1);return i.translate(0,.33,0),i}function Ug(){const i=new In(.15,0);return i.scale(1,.86,1),i.translate(0,.27,0),i}function Ig(){const i=new In(.1,0);return i.scale(1.25,.72,1),i.translate(0,.05,0),i}function Ng(){const i=new In(.075,0);return i.scale(1.2,.8,1.1),i.translate(0,.05,0),i}function Fg(){const i=new Ui(.2,.13,.16);return i.translate(0,.065,0),i}function Og(){const i=new ts(.013,.016,.5,5,1);return i.translate(0,.25,0),i}function Bg(){const i=new _e;return i.setAttribute("position",new xe(new Float32Array([.013,.5,0,.013,.33,0,.25,.43,.04]),3)),i.computeVertexNormals(),i}function zg(){const i=new Js(.16,.11,4,1);return i.rotateY(Math.PI/4),i.translate(0,.185,0),i}class un{constructor(t,e,n,{shadow:s=!0,side:r}={}){this.geo=e,this.mat=new ks({color:n??16777215,side:r??pn}),this.scene=t,this.mesh=null,this.shadow=s,this.cap=0}set(t){const e=t.length;if(e>this.cap&&(this.mesh&&(this.scene.remove(this.mesh),this.mesh.dispose()),this.cap=Math.max(64,Math.ceil(e*1.6)),this.mesh=new nl(this.geo,this.mat,this.cap),this.mesh.castShadow=this.shadow,this.mesh.receiveShadow=!1,this.mesh.instanceMatrix.setUsage(Nc),this.mesh.instanceColor=new eo(new Float32Array(this.cap*3),3),this.scene.add(this.mesh)),!this.mesh)return;const n=new ee,s=new Jn,r=new P,a=new P,o=new Ht;for(let l=0;l<e;l++){const c=t[l];r.set(c.x,c.y,c.z),s.setFromAxisAngle(Gg,c.rot),a.set(c.s,c.sy??c.s,c.s),n.compose(r,s,a),this.mesh.setMatrixAt(l,n),o.set(c.colour??16777215).convertSRGBToLinear(),this.mesh.instanceColor.setXYZ(l,o.r,o.g,o.b)}this.mesh.count=e,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor.needsUpdate=!0,this.mesh.frustumCulled=!1}}const Gg=new P(0,1,0),Hg=`
  uniform float uTime;
  varying vec3 vPos;
  varying float vWave;
  #include <common>
  #include <fog_pars_vertex>
  void main() {
    vec3 p = position;
    float w = sin(p.x * 2.9 + uTime * 1.15) * 0.5 + sin(p.z * 2.3 - uTime * 0.95) * 0.5;
    p.y += w * 0.011;
    vWave = w;
    vPos = p;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,Vg=`
  uniform float uTime;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  varying vec3 vPos;
  varying float vWave;
  #include <common>
  #include <fog_pars_fragment>
  void main() {
    vec3 c = mix(uDeep, uShallow, 0.42 + 0.34 * vWave);
    float ripple = sin(vPos.x * 11.0 + uTime * 1.9) * sin(vPos.z * 8.5 - uTime * 1.35);
    c += smoothstep(0.72, 1.0, ripple) * 0.12;
    float glint = sin(vPos.x * 24.0 - uTime * 2.6) * sin(vPos.z * 19.0 + uTime * 1.7);
    c += smoothstep(0.93, 1.0, glint) * 0.35;
    gl_FragColor = vec4(c, 0.92);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;class kg{constructor(t){this.canvas=t,this.renderer=new el({canvas:t,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)),this.renderer.outputColorSpace=he,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=yc,this.scene=new og,this.scene.background=Xg(),this.scene.fog=new Eo(Hn(mg),26,62),this.camera=new We(32,1,.5,200);const e=new lg(Hn(pg),Hn(7302744),1.32);this.scene.add(e),this.sun=new fg(Hn(16774109),2.3),this.sun.position.set(-8,14,7),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=60,this.sun.shadow.bias=-.0012,this.sun.shadow.normalBias=.02,this.scene.add(this.sun),this.scene.add(this.sun.target),this.haze=new Ce(new yo(1,72),new wi({color:Hn(12571342),transparent:!0,opacity:.9,alphaMap:Wg(),depthWrite:!1})),this.haze.rotation.x=-Math.PI/2,this.haze.position.y=-.62,this.scene.add(this.haze),this.landMat=new ks({vertexColors:!0}),this.land=new Ce(new _e,this.landMat),this.land.castShadow=!0,this.land.receiveShadow=!0,this.land.frustumCulled=!1,this.scene.add(this.land),this.waterUniforms={...Wc.clone(nt.fog),uTime:{value:0},uShallow:{value:Hn(vg)},uDeep:{value:Hn(xg)}},this.waterMat=new Un({uniforms:this.waterUniforms,fog:!0,vertexShader:Hg,fragmentShader:Vg,transparent:!0,depthWrite:!1}),this.water=new Ce(new _e,this.waterMat),this.water.frustumCulled=!1,this.water.renderOrder=2,this.scene.add(this.water),this.props={trunk:new un(this.scene,Pg(),6967098),conifer:new un(this.scene,Dg()),broadleaf:new un(this.scene,Ug()),rock:new un(this.scene,Ig()),bush:new un(this.scene,Ng()),houseBody:new un(this.scene,Fg()),houseRoof:new un(this.scene,zg()),pole:new un(this.scene,Og(),9072463),pennant:new un(this.scene,Bg(),16777215,{side:Ze})},this.ghostMat=new ks({vertexColors:!0}),this.ghost=new Ce(new _e,this.ghostMat),this.ghost.frustumCulled=!1,this.ghost.castShadow=!0,this.ghost.visible=!1,this.scene.add(this.ghost),this.flashMat=new wi({color:16777215,transparent:!0,opacity:0,blending:Fs,depthWrite:!1}),this.flash=new Ce(new _e,this.flashMat),this.flash.frustumCulled=!1,this.flash.renderOrder=4,this.flash.visible=!1,this.scene.add(this.flash),this.flashT=0,this.target=new P(0,0,0),this.wantTarget=new P(0,0,0),this.dist=22,this.wantDist=22,this.azimuth=-.62,this.polar=.74,this.plane=new En(new P(0,1,0),0),this.ray=new dg,this._v=new P}resize(t,e){this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.lastBounds&&this.frame(this.lastBounds)}setGarden(t,e){Ls(this.land.geometry,t.land),Ls(this.water.geometry,t.water);const n={trunk:[],conifer:[],broadleaf:[],rock:[],bush:[],houseBody:[],houseRoof:[],pole:[],pennant:[]};for(const s of t.props)switch(s.type){case oo:n.trunk.push(s),n.conifer.push({...s,colour:Wi[Math.floor(s.tint*Wi.length)%Wi.length]});break;case ao:n.trunk.push(s),n.broadleaf.push({...s,colour:s.tint>.86?Sg[s.tint>.94?1:0]:Wi[Math.floor(s.tint*4)%4]});break;case co:n.rock.push({...s,colour:Tg[Math.floor(s.tint*3)%3]});break;case lo:n.bush.push({...s,colour:Wi[Math.floor(s.tint*4)%4]});break;case dl:n.houseBody.push({...s,colour:Eg[Math.floor(s.tint*3)%3]}),n.houseRoof.push({...s,colour:yg[Math.floor(s.tint*4)%4]});break;case pl:n.pole.push(s),n.pennant.push({...s,colour:Cn(sn[s.biome].top,1.3)});break}for(const s of Object.keys(n))this.props[s].set(n[s]);e&&this.fitShadow(e)}fitShadow({cx:t,cz:e,r:n}){const s=this.sun.shadow.camera,r=n+3;s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.far=r*4+34,s.updateProjectionMatrix(),this.sunRadius=r,this.scene.fog.near=Math.max(16,n*1.7),this.scene.fog.far=this.scene.fog.near+n*2.6+30,this.haze.position.set(t,-.62,e),this.haze.scale.setScalar(n+7)}setGhost(t){if(!t){this.ghost.visible=!1;return}Ls(this.ghost.geometry,t),this.ghost.visible=!0}playFlash(t){Ls(this.flash.geometry,t),this.flash.visible=!0,this.flashT=1}frame(t,e=!1){const{cx:n,cz:s,r,maxY:a=1}=t;this.lastBounds=t;const o=Math.PI/2-this.polar,l=Math.tan(this.camera.fov*Math.PI/360),c=r*Math.sin(o)+a*.5*Math.cos(o)+.9,h=r+.9;this.wantTarget.set(n,a*.3,s),this.wantDist=Math.max(9,Math.max(c/l,h/(l*this.camera.aspect))*.96),e&&(this.target.copy(this.wantTarget),this.dist=this.wantDist)}orbit(t,e){this.azimuth-=t*.006,this.polar=Math.min(1.42,Math.max(.28,this.polar-e*.005))}zoom(t){this.wantDist=Math.min(90,Math.max(5,this.wantDist*t))}pan(t,e){const n=this.dist*.0016,s=Math.cos(this.azimuth),r=Math.sin(this.azimuth);this.wantTarget.x+=(-t*s-e*r)*n,this.wantTarget.z+=(-t*-r-e*s)*n}updateCamera(t){const e=1-Math.pow(.0015,t);this.target.lerp(this.wantTarget,e),this.dist+=(this.wantDist-this.dist)*e;const n=Math.sin(this.polar);this.camera.position.set(this.target.x+this.dist*n*Math.sin(this.azimuth),this.target.y+this.dist*Math.cos(this.polar),this.target.z+this.dist*n*Math.cos(this.azimuth)),this.camera.lookAt(this.target);const s=this.sunRadius??10,r=this.azimuth+.84;this.sun.position.set(this.target.x+s*.8*Math.sin(r),this.target.y+s*1.15+5,this.target.z+s*.8*Math.cos(r)),this.sun.target.position.copy(this.target),this.sun.target.updateMatrixWorld()}pick(t,e,n){this.ray.setFromCamera({x:t,y:e},this.camera);let s=.2,r=null;for(let a=0;a<3;a++){this.plane.constant=-s;const o=this.ray.ray.intersectPlane(this.plane,this._v);if(!o)return null;const[l,c,h]=Ll(o.x/Ut,o.z/Ut);r=yn(l,c,h);const u=n.elev.get(r),d=u===void 0?.2:Be(u);if(Math.abs(d-s)<.01)break;s=d}return{cell:r,point:this._v.clone()}}project(t,e,n){return this._v.set(t,e,n).project(this.camera),this._v}render(t,e){if(this.waterUniforms.uTime.value=e,this.ghost.visible&&(this.ghost.position.y=Math.sin(e*1.7)*.035),this.flashT>0){this.flashT=Math.max(0,this.flashT-t*1.15);const n=this.flashT;this.flashMat.opacity=Math.sin(Math.min(1,n)*Math.PI)*.5,this.flash.visible=this.flashT>0}this.renderer.render(this.scene,this.camera)}}function Wg(){const i=document.createElement("canvas");i.width=i.height=128;const t=i.getContext("2d"),e=t.createRadialGradient(64,64,6,64,64,64);return e.addColorStop(0,"#fff"),e.addColorStop(.45,"#fff"),e.addColorStop(1,"#000"),t.fillStyle=e,t.fillRect(0,0,128,128),new sl(i)}function Xg(){const i=document.createElement("canvas");i.width=4,i.height=256;const t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,256);e.addColorStop(0,"#9fc4dc"),e.addColorStop(.45,"#c9dfe8"),e.addColorStop(.78,"#e4eee6"),e.addColorStop(1,"#eef1e4"),t.fillStyle=e,t.fillRect(0,0,4,256);const n=new sl(i);return n.colorSpace=he,n}function Ls(i,t){i.setAttribute("position",new xe(new Float32Array(t.pos),3)),i.setAttribute("normal",new xe(new Float32Array(t.nrm),3)),i.setAttribute("color",new xe(new Float32Array(t.col),3)),i.attributes.position.needsUpdate=!0,i.computeBoundingSphere()}const Ps=i=>new Ht(i).convertSRGBToLinear();function qg(){const i=new _e,t=new Float32Array([0,0,0,-.16,.05,-.07,-.13,0,.04,0,0,0,.13,0,.04,.16,.05,-.07]);return i.setAttribute("position",new xe(t,3)),i.computeVertexNormals(),i}function Ds(i,t,e){const n=new In(1,0);return n.scale(i,t,e),n}function Yg(){const i=new In(1,0);return i.scale(.055,.03,.13),i}class Vn{constructor(t,e,n,s){this.mesh=new nl(e,n,s),this.mesh.frustumCulled=!1,this.mesh.count=0,this.mesh.instanceMatrix.setUsage(Nc),t.add(this.mesh),this.m=new ee,this.q=new Jn,this.p=new P,this.s=new P,this.n=0}begin(){this.n=0}put(t,e,n,s,r,a,o){this.n>=this.mesh.instanceMatrix.count||(this.p.set(t,e,n),this.q.setFromAxisAngle(Kg,s),this.s.set(r,a??r,o??r),this.m.compose(this.p,this.q,this.s),this.mesh.setMatrixAt(this.n++,this.m))}end(){this.mesh.count=this.n,this.mesh.instanceMatrix.needsUpdate=!0}}const Kg=new P(0,1,0);class jg{constructor(t){this.root=new qi,t.add(this.root);const e=(r,a={})=>new ks({color:Ps(r),...a});this.birds=new Vn(this.root,qg(),new wi({color:Ps(4871520),side:Ze,transparent:!0,opacity:.7}),9),this.deer=new Vn(this.root,Ds(.05,.045,.1),e(11106379),6),this.deerHead=new Vn(this.root,Ds(.03,.03,.035),e(12159580),6),this.sheep=new Vn(this.root,Ds(.05,.045,.062),e(15986660),14),this.kayak=new Vn(this.root,Yg(),e(14245951),2),this.paddler=new Vn(this.root,Ds(.032,.045,.032),e(4157324),2),this.smoke=new Vn(this.root,new In(1,0),new wi({color:Ps(15922418),transparent:!0,opacity:.2,depthWrite:!1}),44),this.smoke.mesh.renderOrder=5;const n=90,s=new _e;s.setAttribute("position",new xe(new Float32Array(n*3),3)),this.motes=new cg(s,new il({color:Ps(16774088),size:.045,transparent:!0,opacity:.55,depthWrite:!1,blending:Fs})),this.motes.frustumCulled=!1,this.root.add(this.motes),this.moteHome=[],this.moteN=n,this.reset()}reset(){this.flock=null,this.flockAt=6,this.deerParty=null,this.deerAt=9,this.boat=null,this.boatAt=4,this.flocks=[],this.sheepSpots=[],this.chimneys=[],this.rivers=[],this.forest=[],this.grazing=[],this.t=0}sync(t){const e=t.board,n=c=>{const[h,u]=qn(Qt(c),te(c),re(c));return[h*Ut,Be(t.elev.get(c)??0),u*Ut]};this.forest=[],this.grazing=[],this.chimneys=[];const s=[];for(const c of e.filled){const h=e.biome.get(c);h===Ji?this.forest.push(n(c)):h===gn||h===qs?this.grazing.push(n(c)):h===Pn?this.chimneys.push(n(c)):h===ze&&s.push(c)}this.rivers=[];const r=new Set(s),a=new Set,o=[0,0,0,0],l=c=>{Oe(Qt(c),te(c),re(c),o);const h=[];for(let u=0;u<4;u++)r.has(o[u])&&h.push(o[u]);return h};for(const c of s){if(a.has(c))continue;const h=[],u=[c];for(a.add(c);u.length;){const f=u.pop();h.push(f);for(const S of l(f))a.has(S)||(a.add(S),u.push(S))}if(h.length<3)continue;let d=h[0],m=5;for(const f of h){const S=l(f).length;S<m&&(m=S,d=f)}const _=[],g=new Set;let p=d;for(;p!==void 0&&!g.has(p);)g.add(p),_.push(n(p)),p=l(p).find(f=>!g.has(f));_.length>=3&&this.rivers.push(_)}if(this.rivers.sort((c,h)=>h.length-c.length),this.grazing.length>3)for(this.sheepSpots=this.sheepSpots.filter(c=>this.grazing.some(h=>Math.abs(h[0]-c.x)<.01&&Math.abs(h[2]-c.z)<.01));this.sheepSpots.length<Math.min(2,Math.floor(this.grazing.length/8));){const c=this.grazing[Math.floor(Math.random()*this.grazing.length)];this.sheepSpots.push({x:c[0],y:c[1],z:c[2],n:3+Math.floor(Math.random()*3),ph:Math.random()*9})}this.moteHome=[];for(let c=0;c<this.moteN;c++){const h=this.forest.length?this.forest[Math.floor(Math.random()*this.forest.length)]:null;this.moteHome.push(h?[h[0],h[1],h[2]]:null)}}celebrate(t,e){var n,s;(n=t.announce)!=null&&n.some(r=>r.biome===ze)&&(this.boatAt=Math.min(this.boatAt,1.2)),(s=t.announce)!=null&&s.length&&(this.flockAt=Math.min(this.flockAt,2.5))}update(t,e,n){this.t=e,this._birds(t,e),this._deer(t,e),this._sheep(e),this._boat(t,e),this._smoke(e),this._motes(e)}_birds(t,e){if(this.birds.begin(),this.flock){const n=this.flock,s=2.4;n.x+=n.vx*s*t,n.z+=n.vz*s*t,n.life+=t;const r=Math.atan2(n.vx,n.vz);for(let a=0;a<n.n;a++){const o=a*.55,l=(a%2?1:-1)*Math.ceil(a/2)*.42,c=n.x-n.vx*o+-n.vz*l,h=n.z-n.vz*o+n.vx*l,u=1+Math.sin(e*7+a*1.7)*.35;this.birds.put(c,n.y+Math.sin(e*.7+a)*.12,h,r,1,u,1)}n.life>26&&(this.flock=null)}else if(this.flockAt-=t,this.flockAt<=0){const n=Math.random()*Math.PI*2,s=16+Math.random()*8,r=Math.cos(n)*s,a=Math.sin(n)*s;this.flock={x:r,z:a,y:4.4+Math.random()*2.6,vx:-r/s,vz:-a/s,n:3+Math.floor(Math.random()*4),life:0},this.flockAt=22+Math.random()*26}this.birds.end()}_deer(t,e){if(this.deer.begin(),this.deerHead.begin(),this.deerParty){const n=this.deerParty;n.life+=t;const s=Math.min(1,n.life*2,Math.max(0,(13-n.life)*.7));for(let r=0;r<n.n;r++){const a=Math.sin(e*.5+n.ph+r*2.1),o=Math.cos(n.dir+r*1.9)*(.12+.05*a),l=Math.sin(n.dir+r*1.9)*(.12+.05*a),c=n.dir+a*.5,h=n.y+.055;this.deer.put(n.x+o,h,n.z+l,c,s,s,s),this.deerHead.put(n.x+o+Math.sin(c)*.085,h+.035+Math.sin(e*1.3+n.ph)*.012,n.z+l+Math.cos(c)*.085,c,s,s,s)}n.life>14&&(this.deerParty=null)}else{this.deerAt-=t;const n=this.forest.length?this.forest:this.grazing;if(this.deerAt<=0&&n.length){const s=n[Math.floor(Math.random()*n.length)];this.deerParty={x:s[0],y:s[1],z:s[2],n:1+(Math.random()<.5?1:0),life:0,dir:Math.random()*Math.PI*2,ph:Math.random()*8},this.deerAt=16+Math.random()*22}}this.deer.end(),this.deerHead.end()}_sheep(t){this.sheep.begin();for(const e of this.sheepSpots)for(let n=0;n<e.n;n++){const s=e.ph+n*2.3,r=.11+.05*Math.sin(t*.13+s);this.sheep.put(e.x+Math.cos(s+t*.035)*r,e.y+.045,e.z+Math.sin(s+t*.035)*r,s,1,1,1)}this.sheep.end()}_boat(t,e){if(this.kayak.begin(),this.paddler.begin(),!this.boat)this.boatAt-=t,this.boatAt<=0&&this.rivers.length&&(this.boat={path:this.rivers[0],u:0},this.boatAt=20+Math.random()*28);else{const n=this.boat.path;this.boat.u+=t*.44;const s=Math.floor(this.boat.u);if(s>=n.length-1)this.boat=null;else{const r=this.boat.u-s,a=n[s],o=n[s+1],l=a[0]+(o[0]-a[0])*r,c=a[2]+(o[2]-a[2])*r,h=a[1]+(o[1]-a[1])*r+.03,u=Math.atan2(o[0]-a[0],o[2]-a[2]),d=Math.sin(e*3.1)*.008;this.kayak.put(l,h+d,c,u,1,1,1),this.paddler.put(l,h+.045+d,c,u+Math.sin(e*4.2)*.28,1,1,1)}}this.kayak.end(),this.paddler.end()}_smoke(t){this.smoke.begin();for(let e=0;e<this.chimneys.length&&e<11;e++){const[n,s,r]=this.chimneys[e];for(let a=0;a<4;a++){const o=(t*.22+a*.25+e*.37)%1,l=o*.75,c=.02+o*.055,h=o*o*.22;this.smoke.put(n+h,s+.24+l,r+h*.4,0,c*(1-o*.35))}}this.smoke.end()}_motes(t){const e=this.motes.geometry.attributes.position.array;let n=0;for(let s=0;s<this.moteN;s++){const r=this.moteHome[s];r&&(e[n*3]=r[0]+Math.sin(t*.6+s*1.7)*.18,e[n*3+1]=r[1]+.22+Math.sin(t*.9+s*2.3)*.1,e[n*3+2]=r[2]+Math.cos(t*.5+s*2.9)*.18,n++)}this.motes.geometry.setDrawRange(0,n),this.motes.geometry.attributes.position.needsUpdate=!0}}const nn=document.getElementById("scene"),qt=i=>document.getElementById(i),ne=new kg(nn),Qs=new jg(ne.scene);let Tt,Wt=null,Ci=null,Ni=!1;function $g(i){let t=1/0,e=-1/0,n=1/0,s=-1/0,r=0;for(const c of i.board.filled){const[h,u]=qn(Qt(c),te(c),re(c));h<t&&(t=h),h>e&&(e=h),u<n&&(n=u),u>s&&(s=u);const d=Be(i.elev.get(c)??0);d>r&&(r=d)}const a=(t+e)/2*Ut,o=(n+s)/2*Ut,l=Math.max(e-t,s-n)*.5*Ut+.7;return{cx:a,cz:o,r:l,maxY:r}}function bo(i=!1){const t=wg(Tt),e=$g(Tt);ne.setGarden(t,e),ne.frame(e,i),Qs.sync(Tt)}const Zg=qt("tileart").getContext("2d");function ml(i){const t=Zg,e=t.canvas.width,n=t.canvas.height;t.clearRect(0,0,e,n);const s=Tt.tile;if(!s)return;const a=Zi[i].map(([f,S,v])=>$n(f,S,v).map(([E,C])=>Ln(E,C)));let o=1/0,l=-1/0,c=1/0,h=-1/0;for(const f of a)for(const[S,v]of f)o=Math.min(o,S),l=Math.max(l,S),c=Math.min(c,v),h=Math.max(h,v);const u=14,d=Math.min((e-u*2)/(l-o),(n-u*2)/(h-c)),m=(e-(l-o)*d)/2-o*d,_=(n-(h-c)*d)/2+h*d,g=([f,S])=>[m+f*d,_-S*d];t.lineJoin="round";for(let f=0;f<8;f++){const S=sn[s.biomes[f]];t.beginPath(),a[f].forEach((v,E)=>{const[C,w]=g(v);E===0?t.moveTo(C,w):t.lineTo(C,w)}),t.closePath(),t.fillStyle="#"+S.top.toString(16).padStart(6,"0"),t.fill(),t.strokeStyle="rgba(255,255,255,0.32)",t.lineWidth=1,t.stroke()}t.beginPath();for(const f of a)f.forEach((S,v)=>{const[E,C]=g(S);v===0?t.moveTo(E,C):t.lineTo(E,C)}),t.closePath();t.strokeStyle="rgba(40,52,60,0.14)",t.lineWidth=1,t.stroke();const p=Cl(i);t.beginPath(),p.forEach((f,S)=>{const[v,E]=g(f);S===0?t.moveTo(v,E):t.lineTo(v,E)}),t.closePath(),t.strokeStyle="rgba(34,45,54,0.75)",t.lineWidth=2.4,t.stroke()}function gl(i){if(!Tt||Tt.over)return;if(i===null){Wt=null,ne.setGhost(null);return}const t=Tt.fitsAtCell(i);if(t.length===0){Wt=null,ne.setGhost(null),qt("fitcount").textContent="",qt("contact").textContent="";return}let e=0;if(Ci!==null){const n=t.findIndex(s=>s.o===Ci);n>=0&&(e=n)}Wt={cell:i,fits:t,index:e},_l()}function _l(){if(!Wt)return;const i=Wt.fits[Wt.index],t=$e(i.o,i.ta,i.tb);ne.setGhost(Lg(t,Tt.tile.biomes,Tt,.42)),qt("fitcount").textContent=Wt.fits.length>1?`${Wt.index+1}/${Wt.fits.length}`:"";const e=qt("contact");e.textContent=i.touch===0?"":i.touch===4?"flush ×4 · a mirrored fit":i.touch===3?"flush ×3 · same hand":`${i.touch} edge${i.touch>1?"s":""} shared`,e.classList.toggle("flush",i.touch>=3),ml(i.o)}function $i(i){Wt&&(Wt.index=(Wt.index+i+Wt.fits.length)%Wt.fits.length,Ci=Wt.fits[Wt.index].o,_l())}function Jg(){if(!Wt||!Tt||Tt.over)return;const i=Wt.fits[Wt.index],t=$e(i.o,i.ta,i.tb),e=Tt.place(i);bo();const n=zr(t);e.fitScore>0&&Us(n,`+${e.fitScore}`,e.perfect);for(const s of e.announce){const r=Tt.board.regionCells(s.root);ne.playFlash(vl(r)),Us(zr(r),`${yi[s.biome]} +${s.score}`,!0)}e.bonus>0&&Us(n,`+${e.bonus} tiles`,!1,.5),e.hollows.length&&Us(zr(e.hollows),"a hidden hollow",!1,.7),Qs.celebrate(e,Tt),Wt=null,ne.setGhost(null),es(),Tt.over&&t_()}function zr(i){let t=0,e=0,n=-1/0;for(const s of i){const[r,a]=qn(Qt(s),te(s),re(s));t+=r,e+=a,n=Math.max(n,Be(Tt.elev.get(s)??0))}return[t/i.length*Ut,n+.25,e/i.length*Ut]}function vl(i){const t=new Ws;for(const e of i){const n=Qt(e),s=te(e),r=re(e),a=Be(Tt.elev.get(e)??0)+.02,o=$n(n,s,r).map(([l,c])=>{const[h,u]=Ln(l,c);return[h*Ut,a,u*Ut]});t.tri(o[0],o[2],o[1],16777215,16777215,16777215),t.tri(o[0],o[3],o[2],16777215,16777215,16777215)}return t}function Us([i,t,e],n,s=!1,r=0){const a=ne.project(i,t,e),o=document.createElement("span");o.textContent=n,s||(o.className="small"),o.style.left=`${(a.x+1)/2*innerWidth}px`,o.style.top=`${(1-a.y)/2*innerHeight}px`,o.style.animationDelay=`${r}s`,qt("pops").appendChild(o),setTimeout(()=>o.remove(),1900+r*1e3)}function es(){qt("score").textContent=Tt.score.toLocaleString(),qt("tiles").textContent=Math.max(0,Tt.tilesLeft),qt("sealed").textContent=Tt.sealedCount;const i=Tt.biggestOpen();qt("growing").textContent=i&&i.size>2?`${i.size} · ${yi[i.biome]}`:"—",qt("tilekind").textContent=Qg(Tt.tile);const t=qt("feed");t.textContent="";for(const e of Tt.log){const n=document.createElement("div");n.textContent=e,t.appendChild(n)}ml(Wt?Wt.fits[Wt.index].o:0)}function Qg(i){if(!i)return"";const t=new Map;for(const s of i.biomes)t.set(s,(t.get(s)??0)+1);const e=[...t.entries()].sort((s,r)=>r[1]-s[1]).map(([s])=>yi[s]),n=i.kind==="land"||i.kind==="fitted"?"":` · ${i.kind}`;return e.slice(0,2).join(" + ")+n}function t_(){qt("finalscore").textContent=Tt.score.toLocaleString();const i=Tt.sealedCount;qt("finalnote").textContent=`${Tt.placed} hats laid · ${i} region${i===1?"":"s"} sealed`+(Tt.best.size?` · largest ${Tt.best.size} kites of ${yi[Tt.best.biome]}`:"");const t=qt("finaltally");t.textContent="";for(const e of(Tt.openTally??[]).slice(0,8)){const n=document.createElement("li");n.innerHTML=`<span>${e.size} kites of ${yi[e.biome]} · left open</span><b>+${e.score}</b>`,t.appendChild(n)}setTimeout(()=>qt("gameover").classList.remove("hidden"),900)}let Ao=!1,Xs=0,ho=0,uo=0,wo=0;nn.addEventListener("pointerdown",i=>{Ao=!0,Xs=0,ho=i.clientX,uo=i.clientY,wo=i.button,nn.setPointerCapture(i.pointerId)});nn.addEventListener("pointermove",i=>{if(Ao){const s=i.clientX-ho,r=i.clientY-uo;Xs+=Math.abs(s)+Math.abs(r),ho=i.clientX,uo=i.clientY,Xs>4&&(document.body.classList.add("dragging"),wo===2||i.shiftKey?ne.pan(s,r):ne.orbit(s,r));return}if(!Ni)return;const t=i.clientX/innerWidth*2-1,e=-(i.clientY/innerHeight)*2+1,n=ne.pick(t,e,Tt);gl(n?n.cell:null)});nn.addEventListener("pointerup",i=>{var t;if(Ao=!1,document.body.classList.remove("dragging"),(t=nn.releasePointerCapture)==null||t.call(nn,i.pointerId),!(Xs>4||wo!==0||!Ni)){if(i.pointerType==="touch"){const e=i.clientX/innerWidth*2-1,n=-(i.clientY/innerHeight)*2+1,s=ne.pick(e,n,Tt);if(!s)return;if(!Wt||Wt.cell!==s.cell){gl(s.cell);return}}Jg()}});nn.addEventListener("contextmenu",i=>i.preventDefault());nn.addEventListener("wheel",i=>{i.preventDefault(),i.shiftKey||i.ctrlKey||!Wt?ne.zoom(i.deltaY>0?1.12:.89):$i(i.deltaY>0?1:-1)},{passive:!1});addEventListener("keydown",i=>{if(!Ni)return;const t=i.key.toLowerCase();if(t==="q")$i(-1);else if(t==="e"||t===" ")$i(1);else if(t==="r")Tt.reroll()&&(Ci=null,Wt=null,ne.setGhost(null),es());else if(t==="+"||t==="=")ne.zoom(.85);else if(t==="-")ne.zoom(1.18);else return;i.preventDefault()});addEventListener("resize",()=>ne.resize(innerWidth,innerHeight));function ns(i){Tt=new Jl(i),Ci=null,Wt=null,Ni=!0,ne.setGhost(null),Qs.reset(),bo(!0),es(),qt("gameover").classList.add("hidden")}qt("prev").addEventListener("click",()=>$i(-1));qt("next").addEventListener("click",()=>$i(1));qt("toss").addEventListener("click",()=>{Tt.reroll()&&(Ci=null,Wt=null,ne.setGhost(null),es())});qt("play").addEventListener("click",()=>{qt("intro").remove(),qt("startbar").classList.add("hidden"),ns((Math.random()*1e9|0)+1)});qt("watch").addEventListener("click",()=>{qt("intro").remove(),qt("startbar").classList.remove("hidden")});qt("startbar").addEventListener("click",()=>{qt("startbar").classList.add("hidden"),ns((Math.random()*1e9|0)+1)});qt("again").addEventListener("click",()=>ns(Math.random()*1e9|0));let Gr=.6;const e_=30;function Ro(){if(!Tt||Tt.over||Tt.placed>=e_+3)return;const i=Tt.fits;if(!i.length)return;let t=null,e=-1/0;for(const s of i){const r=$e(s.o,s.ta,s.tb),a=Tt._harmony(r,Tt.tile.biomes),o=a.match*3+a.touch+Math.random()*2;o>e&&(e=o,t=s)}const n=Tt.place(t);bo();for(const s of n.announce)ne.playFlash(vl(Tt.board.regionCells(s.root)));es()}window.aperiodicGarden={get game(){return Tt},get hover(){return Wt},get scene(){return ne},step:Ro,restart:ns};ne.resize(innerWidth,innerHeight);ns(1741);Ni=!1;for(let i=0;i<20;i++)Ro();let pc=performance.now(),Hr=0;function xl(i){const t=Math.min(.05,(i-pc)/1e3);pc=i,Hr+=t,Ni||(Gr-=t,Gr<=0&&(Gr=.34,Ro())),ne.updateCamera(t),Qs.update(t,Hr,Tt),ne.render(t,Hr),requestAnimationFrame(xl)}requestAnimationFrame(xl);
