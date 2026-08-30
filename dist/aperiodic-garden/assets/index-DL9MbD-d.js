(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const co=Math.sqrt(3);function qe(i,t){return[i+t/2,t*co/2]}const an=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],en=(i,t,e)=>i+1024<<15|t+1024<<3|e,Xt=i=>(i>>15&2047)-1024,qt=i=>(i>>3&4095)-1024,jt=i=>i&7,hs=[[0,0,0],[0,0,1],[0,0,4],[0,0,5],[4,-2,1],[4,-2,2],[2,2,3],[2,2,4]],lh=(i,t)=>[-t,i+t],hh=(i,t)=>[i+t,-t],lo=[];for(let i=0;i<2;i++)for(let t=0;t<6;t++)lo.push({r:t,flip:i,index:lo.length});function uh(i,t,e,n){let s=[t,e];i.flip&&(s=hh(s[0],s[1]),n=(6-n)%6);for(let r=0;r<i.r;r++)s=lh(s[0],s[1]),n=(n+1)%6;return[s[0],s[1],n]}const On=lo.map(i=>hs.map(([t,e,n])=>uh(i,t,e,n)));function Vi(i,t,e){const n=an[(e+5)%6],s=an[e],r=an[(e+1)%6];return[[i,t],[i+n[0]+s[0],t+n[1]+s[1]],[i+2*s[0],t+2*s[1]],[i+s[0]+r[0],t+s[1]+r[1]]]}function Ye(i,t,e){const n=Vi(i,t,e);let s=0,r=0;for(const[o,a]of n){const[c,l]=qe(o,a);s+=c,r+=l}return[s/4,r/4]}function De(i,t,e,n=[]){const s=an[(e+5)%6],r=an[e],o=an[(e+1)%6];return n[0]=en(i,t,(e+1)%6),n[1]=en(i,t,(e+5)%6),n[2]=en(i+2*(s[0]+r[0]),t+2*(s[1]+r[1]),(e+2)%6),n[3]=en(i+2*(r[0]+o[0]),t+2*(r[1]+o[1]),(e+4)%6),n}const hr=[1,2,4,5,6,7],Un=(()=>{const i=new Map(hs.map(([e,n,s],r)=>[en(e,n,s),r])),t=[];return hs.map(([e,n,s])=>{De(e,n,s,t);for(let r=0;r<2;r++)if(!i.has(t[r]))return r;return null})})(),In=(i,t)=>t?1-i:i,Do=(i,t,e,n)=>en(i,t,n===0?e:(e+5)%6);function ho(i,t,e,n){const s=n===0?e:(e+5)%6,r=an[s],o=an[(s+1)%6];return qe(i+(r[0]+o[0])/2,t+(r[1]+o[1])/2)}function fh(i,t,e,n){const s=n===0?e:(e+5)%6,r=an[s],o=an[(s+1)%6],a=qe(i+(r[0]+o[0])/2,t+(r[1]+o[1])/2),[c,l]=qe(i,t),[h,u]=qe(i+r[0]+o[0],t+r[1]+o[1]),f=h-c,p=u-l,g=Math.hypot(f,p)||1;let _=-p/g,m=f/g;const[d,M]=Ye(i,t,e);return(d-a[0])*_+(M-a[1])*m<0&&(_=-_,m=-m),{mid:a,nx:_,ny:m}}function Me(i,t,e,n=new Array(8)){const s=On[i];for(let r=0;r<8;r++)n[r]=en(s[r][0]+t,s[r][1]+e,s[r][2]);return n}const dh=(i,t,e)=>i*4194304+(t+1024<<11)+(e+1024);function uo(i){const t=new Set,e=[];for(const r of i){const o=Xt(r),a=qt(r),c=jt(r);De(o,a,c,e);for(let l=0;l<4;l++)i.has(e[l])||t.add(e[l])}const n=[],s=new Set;for(const r of t){const o=Xt(r),a=qt(r),c=jt(r);for(let l=0;l<12;l++){const h=On[l];for(let u=0;u<8;u++){if(h[u][2]!==c)continue;const f=o-h[u][0],p=a-h[u][1],g=dh(l,f,p);if(s.has(g))continue;s.add(g);let _=!0;for(let m=0;m<8;m++)if(i.has(en(h[m][0]+f,h[m][1]+p,h[m][2]))){_=!1;break}_&&n.push({o:l,ta:f,tb:p,id:g})}}}return n}function ph(i){const t=new Map;for(const[o,a,c]of On[i]){const l=Vi(o,a,c);for(let h=0;h<4;h++){const u=l[h],f=l[(h+1)%4],p=`${u[0]},${u[1]}>${f[0]},${f[1]}`,g=`${f[0]},${f[1]}>${u[0]},${u[1]}`;t.has(g)?t.delete(g):t.set(p,[u,f])}}const e=new Map;for(const[o,a]of t.values())e.set(`${o[0]},${o[1]}`,a);const n=t.values().next().value[0],s=[n];let r=e.get(`${n[0]},${n[1]}`);for(;r&&(r[0]!==n[0]||r[1]!==n[1]);)s.push(r),r=e.get(`${r[0]},${r[1]}`);return s.map(([o,a])=>qe(o,a))}function Kc(i,t){const e=2*t/co,n=i-e/2,s=(e-n)/6,r=(n+2*s)/2;let o=null,a=1/0;for(const[m,d]of mh){const M=Math.round(r)+m,x=Math.round(s)+d,v=2*M-2*x,A=2*M+4*x,w=n-v,R=e-A,U=w*w+w*R+R*R;U<a&&(a=U,o=[v,A,w,R])}const[c,l,h,u]=o,[f,p]=[h+u/2,u*co/2];let g=Math.atan2(p,f);g<0&&(g+=Math.PI*2);const _=Math.floor((g+Math.PI/6)/(Math.PI/3))%6;return[c,l,_]}const mh=[[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]],nn=0,Wi=1,ai=2,cn=3,Xn=4,kn=["meadow","forest","hills","hamlet","scree"],Zc=[1,1.15,1.3,1.85,1.4];function gh(i,t){return Math.round(i*(i+2)*Zc[t])}const _h=.3;function xh(i,t){return Math.round(i*(i+2)*Zc[t]*_h)}function vh(i){return i>=21?4:i>=13?3:i>=7?2:i>=3?1:0}const Mh=(()=>{const i=Me(0,0,0),t=[];let e=0;for(const n of i){const s=new Set([n]);let r=[n];for(let o=1;o<=8&&r.length;o++){const a=[];for(const c of r){De(Xt(c),qt(c),jt(c),t);for(let l=0;l<4;l++)s.has(t[l])||(s.add(t[l]),a.push(t[l]),i.includes(t[l])&&(e=Math.max(e,o)))}r=a}}return e})(),Ms=new Set,aa=(i,t)=>i*2+t;class Sh{constructor(){this.biome=new Map,this.owner=new Map,this.filled=new Set,this.ports=new Set,this.openMouths=new Map,this.riverParent=new Map,this.parent=new Map,this.rsize=new Map,this.ropen=new Map,this.sealed=new Set,this.landmarks=new Map,this.tiles=[],this._stuck=new Set,this._stuckAt=-1,this._nb=[],this._nb2=[]}find(t){let e=t;for(;this.parent.get(e)!==e;)e=this.parent.get(e);let n=t;for(;this.parent.get(n)!==e;){const s=this.parent.get(n);this.parent.set(n,e),n=s}return e}union(t,e){let n=this.find(t),s=this.find(e);return n===s||(this.rsize.get(n)<this.rsize.get(s)&&([n,s]=[s,n]),this.parent.set(s,n),this.rsize.set(n,this.rsize.get(n)+this.rsize.get(s)),this.ropen.set(n,this.ropen.get(n)+this.ropen.get(s)),this.rsize.delete(s),this.ropen.delete(s)),n}riverFind(t){let e=t;for(;this.riverParent.get(e)!==e;)e=this.riverParent.get(e);let n=t;for(;this.riverParent.get(n)!==e;){const s=this.riverParent.get(n);this.riverParent.set(n,e),n=s}return e}riverConnected(t,e){return!this.riverParent.has(t)||!this.riverParent.has(e)?!1:this.riverFind(t)===this.riverFind(e)}crossings(t,e,n,s=Me(t,e,n),r=[]){r.length=0;const o=t>=6;for(let a=0;a<8;a++){const c=Un[a];if(c===null)continue;const l=In(c,o),h=s[a],u=Xt(h),f=qt(h),p=jt(h);De(u,f,p,this._nb),r.push({slot:a,cell:h,side:l,edge:Do(u,f,p,l),far:this._nb[l]})}return r}matchesRiver(t,e,n,s,r=Me(t,e,n)){for(let a=0;a<8;a++)if(this.filled.has(r[a]))return!1;const o=this.crossings(t,e,n,r,[]);for(const a of o)if(this.filled.has(a.far)&&this.ports.has(a.edge)!==s.has(a.slot))return!1;return!0}joinsRiver(t,e,n,s,r=Me(t,e,n)){for(const o of this.crossings(t,e,n,r,[]))if(s.has(o.slot)&&this.filled.has(o.far)&&this.ports.has(o.edge))return!0;return!1}placeable(t,e,n,s,r=Me(t,e,n)){if(!this.matchesRiver(t,e,n,s,r))return!1;const o=new Set(r);return this.leavesRoom(r,o)&&this.streamsCanFlow(t,e,n,s,r,o)}legalPlacements(t){const e=[];for(const n of uo(this.filled)){const s=Me(n.o,n.ta,n.tb);t.demand&&!this.meetsDemand(s,t.demand)||this.placeable(n.o,n.ta,n.tb,t.ports,s)&&e.push({...n,cells:s})}return e}meetsDemand(t,{biome:e,wants:n}){const s=new Set(t);let r=0;for(const o of t){De(Xt(o),qt(o),jt(o),this._nb);for(let a=0;a<4;a++){const c=this._nb[a];if(!(s.has(c)||!this.filled.has(c))&&this.biome.get(c)===e&&++r>=n)return!0}}return!1}leavesRoom(t,e){for(const n of this._nearby(t,e))if(!this._coverable(n,e))return!1;return!0}_nearby(t,e){let n=t;const s=[],r=new Set(t);for(let o=0;o<Mh;o++){const a=[];for(const c of n){De(Xt(c),qt(c),jt(c),this._nb);for(let l=0;l<4;l++){const h=this._nb[l];r.has(h)||(r.add(h),!(this.filled.has(h)||e.has(h))&&(s.push(h),a.push(h)))}}n=a}return s}_coverable(t,e){const n=Xt(t),s=qt(t),r=jt(t);for(let o=0;o<12;o++){const a=On[o];for(let c=0;c<8;c++){if(a[c][2]!==r)continue;const l=n-a[c][0],h=s-a[c][1];let u=!0;for(let f=0;f<8;f++){const p=a[f],g=p[0]+l+1024<<15|p[1]+h+1024<<3|p[2];if(this.filled.has(g)||e.has(g)){u=!1;break}}if(u)return!0}}return!1}streamsCanFlow(t,e,n,s,r,o){const a=new Set;for(const l of this.crossings(t,e,n,r,[]))if(s.has(l.slot)){if(this.filled.has(l.far)){a.add(l.edge);continue}if(!this._continuable(l.far,1-l.side,o))return!1}const c=this.stuckMouths();for(const[l,h]of this.openMouths)if(!(a.has(l)||o.has(h[0])||c.has(l))&&!this._continuable(h[0],h[1],o))return!1;return!0}stuckMouths(){if(this._stuckAt===this.filled.size)return this._stuck;const t=new Set;for(const[e,n]of this.openMouths)this._continuable(n[0],n[1],Ms)||t.add(e);return this._stuck=t,this._stuckAt=this.filled.size,t}_continuable(t,e,n){const s=Xt(t),r=qt(t),o=jt(t);for(let a=0;a<12;a++){const c=a>=6,l=On[a];for(let h=0;h<8;h++){const u=Un[h];if(u===null||In(u,c)!==e||l[h][2]!==o)continue;const f=s-l[h][0],p=r-l[h][1];let g=!0;for(let _=0;_<8;_++){const m=l[_],d=m[0]+f+1024<<15|m[1]+p+1024<<3|m[2];if(this.filled.has(d)||n.has(d)){g=!1;break}}if(g)return!0}}return!1}continuations(t,e){const n=[],s=Xt(t),r=qt(t),o=jt(t);for(let a=0;a<12;a++){const c=a>=6,l=On[a];for(let h=0;h<8;h++){const u=Un[h];if(u===null||In(u,c)!==e||l[h][2]!==o)continue;const f=s-l[h][0],p=r-l[h][1];let g=!0;for(let _=0;_<8;_++){const m=l[_],d=m[0]+f+1024<<15|m[1]+p+1024<<3|m[2];if(this.filled.has(d)){g=!1;break}}g&&n.push({o:a,ta:f,tb:p,slot:h})}}return n}servedMouths(t,e){const n=t>=6,s=[];for(let r=0;r<8;r++){const o=Un[r];o!==null&&s.push(aa(e[r],In(o,n)))}return s}routeTo(t,e,n,s,r,o=Ms){const a=[];for(const l of this.continuations(n,s)){const h=Me(l.o,l.ta,l.tb);h.some(u=>o.has(u))||a.push({place:l,cells:h,serves:new Set(this.servedMouths(l.o,h))})}if(a.length===0)return null;let c=[{cell:t,side:e,used:o,first:null,laid:[]}];for(let l=0;l<r&&c.length;l++){for(const u of c){const f=aa(u.cell,u.side);for(const p of a)if(p.serves.has(f)&&!p.cells.some(g=>u.used.has(g)))return{first:u.first??p.place,cells:new Set([...u.laid,...p.cells])}}if(l+1>=r)break;const h=[];for(const u of c)for(const f of this.continuations(u.cell,u.side)){const p=Me(f.o,f.ta,f.tb);if(p.some(d=>u.used.has(d)))continue;const g=new Set(u.used);for(const d of p)g.add(d);const _=u.first??f,m=[...u.laid,...p];for(const d of this.crossings(f.o,f.ta,f.tb,p,[]))d.slot===f.slot||this.filled.has(d.far)||g.has(d.far)||h.push({cell:d.far,side:1-d.side,used:g,first:_,laid:m})}if(h.length>700){const u=Math.ceil(h.length/700),f=[];for(let p=0;p<h.length;p+=u)f.push(h[p]);c=f}else c=h}return null}canCarryTo(t,e,n,s,r,o=Ms){return this.routeTo(t,e,n,s,r,o)!==null}openCrossing(t,e){const n=this.tiles[t];if(!n||n.ports.has(e))return null;const s=this.crossings(n.orient,n.ta,n.tb,n.cells,[]).find(r=>r.slot===e);if(!s||this.filled.has(s.far)||!this._continuable(s.far,1-s.side,Ms))return null;n.ports.add(e),this.ports.add(s.edge),this.riverParent.has(s.edge)||this.riverParent.set(s.edge,s.edge);for(const r of this.crossings(n.orient,n.ta,n.tb,n.cells,[])){if(r.slot===e||!n.ports.has(r.slot))continue;const o=this.riverFind(r.edge),a=this.riverFind(s.edge);o!==a&&this.riverParent.set(a,o)}return this.openMouths.set(s.edge,[s.far,1-s.side]),this._stuckAt=-1,s}demandedPorts(t,e,n,s=Me(t,e,n)){const r=new Set;for(let o=0;o<8;o++)if(this.filled.has(s[o]))return null;for(const o of this.crossings(t,e,n,s,[]))this.filled.has(o.far)&&this.ports.has(o.edge)&&r.add(o.slot);return r}place(t,e,n,s,r){const o=Me(t,e,n);this.tiles.push({orient:t,ta:e,tb:n,cells:o,biomes:s.biomes.slice(),ports:new Set(s.ports),flipped:t>=6});let a=0,c=null;for(const u of this.crossings(t,e,n,o,[]))if(s.ports.has(u.slot)){if(this.ports.add(u.edge),this.riverParent.has(u.edge)||this.riverParent.set(u.edge,u.edge),c===null)c=u.edge;else{const f=this.riverFind(c),p=this.riverFind(u.edge);f!==p&&this.riverParent.set(p,f)}this.filled.has(u.far)?(a++,this.openMouths.delete(u.edge)):this.openMouths.set(u.edge,[u.far,1-u.side])}const l=this._addCells(o,s.biomes,r);return{closed:this._collectSealed(l),cells:o,joined:a}}_addCells(t,e,n){const s=new Set;for(let o=0;o<t.length;o++){const a=t[o];this.filled.add(a),this.biome.set(a,e[o]),this.owner.set(a,n),this.parent.set(a,a),this.rsize.set(a,1),this.ropen.set(a,0)}const r=new Set(t);for(let o=0;o<t.length;o++){const a=t[o],c=e[o];De(Xt(a),qt(a),jt(a),this._nb);for(let l=0;l<4;l++){const h=this._nb[l];if(!this.filled.has(h)){const u=this.find(a);this.ropen.set(u,this.ropen.get(u)+1);continue}if(!r.has(h)){const u=this.find(h);this.ropen.set(u,this.ropen.get(u)-1),s.add(u)}this.biome.get(h)===c&&s.add(this.union(a,h))}s.add(this.find(a))}return s}_collectSealed(t){const e=[],n=new Set;for(const s of t){const r=this.find(s);if(n.has(r)||this.sealed.has(r)||(n.add(r),this.ropen.get(r)!==0))continue;this.sealed.add(r);const o=this.rsize.get(r),a=this.biome.get(r);o>=3&&this.landmarks.set(r,this._heart(r)),e.push({root:r,size:o,biome:a,score:gh(o,a),tiles:vh(o)})}return e}_heart(t){const e=this.regionCells(t);let n=0,s=0;for(const a of e)n+=Xt(a),s+=qt(a);n/=e.length,s/=e.length;let r=e[0],o=1/0;for(const a of e){const c=Xt(a)-n,l=qt(a)-s,h=c*c+c*l+l*l;h<o&&(o=h,r=a)}return r}allRegions(){const t=[],e=new Set;for(const n of this.filled){const s=this.find(n);e.has(s)||(e.add(s),t.push({root:s,size:this.rsize.get(s),biome:this.biome.get(n),sealed:this.sealed.has(s)}))}return t}regionCells(t){const e=this.find(t),n=[];for(const s of this.filled)this.find(s)===e&&n.push(s);return n}}const ur=[];{const i=new Map(hs.map(([t,e,n],s)=>[en(t,e,n),s]));for(let t=0;t<8;t++){const[e,n,s]=hs[t],r=De(e,n,s),o=[];for(let a=0;a<4;a++){const c=i.get(r[a]);c!==void 0&&o.push(c)}ur.push(o)}}const Jc=[[2,58],[3,28],[4,14]],Eh=Jc.reduce((i,[,t])=>i+t,0),yh=[null,"lake","run","fork","delta"],bh=.11,ca=[[nn,36],[Wi,32],[ai,16],[cn,10],[Xn,6]];function Th(i){return function(){i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Qc(i,t,e,n){let s=n()*e;for(const r of i)if(s-=t(r),s<=0)return r;return i[i.length-1]}function br(i,t=!0){const e=t?ca:ca.filter(([s])=>s!==cn&&s!==Xn),n=e.reduce((s,[,r])=>s+r,0);return Qc(e,([,s])=>s,n,i)[0]}function Uo(i){const t=new Array(8),e=i()<.28,n=br(i,!e);if(e)return t.fill(n),t;let s=br(i),r=0;for(;s===n&&r++<8;)s=br(i);const o=Math.floor(i()*8),a=new Set([o]),c=2+Math.floor(i()*5);let l=0;for(;a.size<c&&l++<40;){const h=[];for(const u of a)for(const f of ur[u])a.has(f)||h.push(f);if(h.length===0)break;a.add(h[Math.floor(i()*h.length)])}for(let h=0;h<8;h++)t[h]=a.has(h)?n:s;for(const h of[cn,Xn]){const u=[];for(let f=0;f<8;f++)t[f]===h&&u.push(f);if(u.length>3)for(const f of u.slice(3))t[f]=nn}return t}function la(i,t=.42){const e=new Set;let n="land";if(i()<t){const s=i()<bh?1:Qc(Jc,([,o])=>o,Eh,i)[0],r=hr.slice();for(let o=0;o<s;o++)e.add(...r.splice(Math.floor(i()*r.length),1));n=yh[s]}return{biomes:Uo(i),ports:e,kind:n,mouths:e.size,lake:e.size===1}}function Ah(i,t){return{biomes:Uo(t),ports:new Set([i]),kind:"lake",mouths:1,lake:!0}}const ha=[{key:"woodcutter",title:"woodcutter's camp",biome:Wi,wants:4,score:180,tiles:2},{key:"shepherd",title:"shepherd's fold",biome:nn,wants:5,score:140,tiles:2},{key:"quarry",title:"quarry",biome:Xn,wants:2,score:240,tiles:3},{key:"vineyard",title:"vineyard",biome:ai,wants:3,score:210,tiles:2}];function wh(i){const t=new Array(8).fill(i.biome);for(const e of[0,...ur[0]])t[e]=cn;return{biomes:t,ports:new Set,kind:i.key,mouths:0,camp:i,demand:{biome:i.biome,wants:i.wants}}}function Tr(i,t){return{biomes:Uo(t),ports:new Set(i),kind:"fitted",mouths:i.size}}const ua=[{orient:0,ta:0,tb:0},{orient:2,ta:6,tb:0},{orient:4,ta:0,tb:6}],Zs=[2,2],Rh=3,Ch=3,Ph=4.2;function Lh(){const[i,t]=qe(Zs[0],Zs[1]),e=new Set;for(const r of ua)for(const o of Me(r.orient,r.ta,r.tb))e.add(o);let n=null;return{tiles:ua.map((r,o)=>{const a=Me(r.orient,r.ta,r.tb),c=a.map(h=>{const[u,f]=Ye(Xt(h),qt(h),jt(h)),p=Math.hypot(u-i,f-t);return p<Rh?Xn:p<Ch?ai:p<Ph?Wi:o===1?cn:nn}),l=new Set;if(o===0){const h=r.orient>=6;let u=null,f=-1;for(const p of hr){const g=In(Un[p],h),_=a[p],m=Xt(_),d=qt(_),M=jt(_);if(e.has(De(m,d,M)[g]))continue;const[x,v]=ho(m,d,M,g),A=Math.hypot(x-i,v-t);A>f&&(f=A,u=p)}if(u!==null){l.add(u);const p=a[u],g=Xt(p),_=qt(p),m=jt(p),d=In(Un[u],h),[M,x]=ho(g,_,m,d),v=Math.hypot(M-i,x-t)||1;n={edge:Do(g,_,m,d),mid:[M,x],dir:[(M-i)/v,(x-t)/v]}}}return{orient:r.orient,ta:r.ta,tb:r.tb,tile:{biomes:c,ports:l,kind:"massif",mouths:l.size}}}),headwater:n,summit:[i,t]}}function Dh(i,t,e,n=1){const[s,r,o]=Kc(i,t),a=new Set([en(s,r,o)]);for(let l=0;l<2;l++)for(const h of[...a])for(const u of De(Xt(h),qt(h),jt(h)))a.add(u);const c=[];for(const l of a){const h=Xt(l),u=qt(l),f=jt(l);for(let p=0;p<12;p++){const g=On[p];for(let _=0;_<8;_++){if(g[_][2]!==f)continue;const m=h-g[_][0],d=u-g[_][1],M=Me(p,m,d);let x=!0;for(const w of M){if(e.has(w)){x=!1;break}for(const R of De(Xt(w),qt(w),jt(w)))if(e.has(R)){x=!1;break}if(!x)break}if(!x)continue;let v=0,A=0;for(const w of M){const[R,U]=Ye(Xt(w),qt(w),jt(w));v+=R,A+=U}v/=8,A/=8,c.push({orient:p,ta:m,tb:d,cells:M,hub:[v,A],d:Math.hypot(v-i,A-t)})}}}return c.sort((l,h)=>l.d-h.d),n===1?c[0]??null:c.slice(0,n)}function Uh(i,t,e){const n=i.orient>=6,s=hr.map(l=>{const h=i.cells[l],u=Xt(h),f=qt(h),p=jt(h),g=In(Un[l],n),[_,m]=ho(u,f,p,g);return{slot:l,side:g,edge:Do(u,f,p,g),mid:[_,m],d:Math.hypot(_-t,m-e)}});s.sort((l,h)=>l.d-h.d);const r=s[0];let o=null,a=-1;for(const l of s.slice(1)){const h=Math.hypot(l.mid[0]-r.mid[0],l.mid[1]-r.mid[1]);h>a&&(a=h,o=l)}const c=new Array(8).fill(nn);for(const l of[r.slot,...ur[r.slot],0])c[l]=cn;return{tile:{biomes:c,ports:new Set([r.slot]),kind:"town",mouths:1},edge:r.edge,mid:r.mid,slot:r.slot,tail:{edge:o.edge,mid:o.mid,slot:o.slot,side:o.side}}}const Ih=42,Nh=.1,fr=[{key:"flour",glyph:"🌾",label:"flour",from:"the mill"},{key:"timber",glyph:"🪵",label:"timber",from:"the woodcutter's camp"},{key:"stone",glyph:"🪨",label:"stone",from:"the quarry"},{key:"wool",glyph:"🧶",label:"wool",from:"the shepherd's fold"},{key:"wine",glyph:"🍇",label:"wine",from:"the vineyard"}],fa={mill:"flour",woodcutter:"timber",quarry:"stone",shepherd:"wool",vineyard:"wine"},Fh=3,tl=[{key:"clearing",title:"clearing",note:"a whole tile of whatever your biggest open region is — the piece that finishes it",cost:{timber:3},make(i){const t=i.biggestOpen(),e=t?t.biome:nn;return{biomes:new Array(8).fill(e),ports:new Set,kind:kn[e],mouths:0}}},{key:"aqueduct",title:"aqueduct",note:"a stream cut to carry the water on from wherever it has got to",cost:{stone:3},make(i){const t=i._cutStream();return t?(t.tile.kind="aqueduct",t.tile):null}},{key:"hamlet",title:"vintners’ hamlet",note:"a whole tile of houses — the richest cover there is, and never dealt",cost:{wine:3,timber:2},make(){return{biomes:new Array(8).fill(cn),ports:new Set,kind:"hamlet",mouths:0}}},{key:"millpond",title:"millpond",note:"a lake, to let a stream you have finished with end tidily",cost:{flour:3},make(i){const t=i.board.stuckMouths();for(const[e,n]of i.board.openMouths)if(!t.has(e))for(const s of i.board.continuations(n[0],n[1])){const r=Me(s.o,s.ta,s.tb),o=i.board.demandedPorts(s.o,s.ta,s.tb,r);if(!(!o||o.size!==1)&&i.board.placeable(s.o,s.ta,s.tb,o,r))return Ah([...o][0],i.rnd)}return null}},{key:"provisions",title:"provisions",note:"six more tiles on the stack; each load costs more wool than the last",cost:{wool:3},escalates:!0,make:null,tiles:6}],da=["the mill","the fulling mill","the sawmill","the oil mill","the paper mill","the forge hammer","the last mill on the river"];function Oh(i){const t=da[Math.min(i,da.length-1)];return{key:`mill-${i}`,index:i,title:i===0?"Turn the mill wheel":`Reach ${t}`,hint:i===0?"Carry the headwater down to the mill.":"Carry the water on, wheel to wheel.",hops:2,dist:7+Math.min(i,3),turn:i===0?0:i%2?.85:-.7,score:320+i*260,tiles:6+i,unlock:i===0?"choice":null,unlockNote:i===0?"The village will now offer you a choice of two tiles.":""}}class zh{constructor(t=1){this.seed=t,this.rnd=Th(t),this.board=new Sh,this.jitter=new Map,this.score=0,this.tilesLeft=Ih,this.placed=0,this.sealedCount=0,this.best={size:0,biome:nn},this.queue=[],this.log=[],this.over=!1,this.res=Object.fromEntries(fr.map(e=>[e.key,0])),this.works=[],this.sinceHarvest=0,this.crafted=0,this.bought={},this._seed(),this._refillQueue()}_harvest(){if(this.works.length===0||++this.sinceHarvest<Fh)return null;this.sinceHarvest=0;const t={};for(const e of this.works)this.res[e.resource]+=1,t[e.resource]=(t[e.resource]??0)+1;return t}costOf(t){if(!t.escalates)return t.cost;const e=this.bought[t.key]??0;return Object.fromEntries(Object.entries(t.cost).map(([n,s])=>[n,s+e]))}affordable(t){return Object.entries(this.costOf(t)).every(([e,n])=>this.res[e]>=n)}craft(t){const e=tl.find(s=>s.key===t);if(!e||this.over||!this.affordable(e))return null;if(!e.make)return this._pay(e),this.tilesLeft+=e.tiles,this.crafted+=1,this.log.unshift(`${e.title} · +${e.tiles} tiles`),e;const n=e.make(this);return n?(n.cost=this._pay(e),n.crafted=!0,n.craftTitle=e.title,this.crafted+=1,this.queue.unshift(n),this._fits=null,this._ensurePlayable(),this.log.unshift(`${e.title} · made`),e):null}_pay(t){const e=this.costOf(t);for(const[n,s]of Object.entries(e))this.res[n]-=s;return this.bought[t.key]=(this.bought[t.key]??0)+1,e}refund(t){for(const[e,n]of Object.entries(t.cost??{}))this.res[e]+=n}_remember(t){for(const e of t)this.jitter.set(e,this.rnd())}_seed(){const t=Lh();t.tiles.forEach((e,n)=>{const s=this.board.place(e.orient,e.ta,e.tb,e.tile,n);this._remember(s.cells)}),this.headwater=t.headwater,this.summit=t.summit,this.sites=[],this.questIndex=0,this.canChoose=!1;for(const e of this.board.filled){const n=this.board.find(e);this.board.ropen.get(n)===0&&this.board.sealed.add(n)}this.placed=3,this._openSite(0)}_openSite(t){var h;const e=Oh(t);if(this.quest=null,!this.headwater)return;const n=this.sites[this.sites.length-1],s=n?((h=n.tail)==null?void 0:h.mid)??n.mid:this.headwater.mid,r=this.board.riverFind(this.headwater.edge);let o=null,a=1/0;for(const[u,f]of this.board.openMouths){if(this.board.riverFind(u)!==r)continue;const[p,g]=Ye(Xt(f[0]),qt(f[0]),jt(f[0])),_=Math.hypot(p-s[0],g-s[1]);_<a&&(a=_,o=f)}if(!o)return;const c=Math.atan2(s[1]-this.summit[1],s[0]-this.summit[0]),l=[];for(const u of[0,.4,-.4,.85,-.85,1.4,-1.4])for(const f of[1,1.25,.8,1.55]){const p=c+e.turn+u;l.push([s[0]+Math.cos(p)*e.dist*f,s[1]+Math.sin(p)*e.dist*f])}for(const u of[e.hops,e.hops+1])for(const[f,p]of l)if(this._trySite(e,t,f,p,s,o,u))return;for(const[u,f]of l)if(this._trySite(e,t,u,f,s,null,0))return}_trySite(t,e,n,s,r,o,a){for(const c of Dh(n,s,this.board.filled,12)){const l=Uh(c,r[0],r[1]),h=new Set(c.cells);if(!this.board.leavesRoom(c.cells,h))continue;const f=this.board.crossings(c.orient,c.ta,c.tb,c.cells,[]).find(_=>_.slot===l.slot);if(!f||this.board.filled.has(f.far)||!this.board._continuable(f.far,1-f.side,h)||o&&!this.board.canCarryTo(o[0],o[1],f.far,1-f.side,a,h))continue;const p=this.board.place(c.orient,c.ta,c.tb,l.tile,900+e);this._remember(p.cells);const g={...t,hub:c.hub,mid:l.mid,edge:l.edge,tail:l.tail,cells:p.cells,tileIndex:this.board.tiles.length-1,done:!1};return this.sites.push(g),this.quest=g,!0}return!1}_checkQuest(){const t=this.quest;if(!t||t.done||!this.board.riverConnected(this.headwater.edge,t.edge))return null;t.done=!0,this.score+=t.score,this.tilesLeft+=t.tiles,t.unlock==="choice"&&(this.canChoose=!0),this.log.unshift(`${t.title} · +${t.score}`);for(const e of[t.tail.slot,...hr]){const n=this.board.openCrossing(t.tileIndex,e);if(n){t.tail={edge:n.edge,slot:e,mid:this.centreOf(n.far)};break}}return this.questIndex+=1,this._openSite(this.questIndex),t}swapNext(){if(!this.canChoose||this.over||this.queue.length<2)return!1;const t=this.queue[0];return this.queue[0]=this.queue[1],this.queue[1]=t,this._fits=null,this._ensurePlayable(),!0}_refillQueue(){for(;this.queue.length<3;)this.queue.push(this._deal());this._ensurePlayable()}_deal(){return this.placed>8&&this.rnd()<Nh?wh(ha[Math.floor(this.rnd()*ha.length)]):la(this.rnd)}_legalFor(t){const e=this.board.legalPlacements(t),n=this.quest;if(!n||n.done)return e;const s=this._questTargets(n),r=this._riverEnds();if(r.length===0||s.length===0)return e;const o=n.hops+1,a=this.board.riverFind(this.headwater.edge),c=this.board.riverFind(n.edge),l=(f,p)=>{for(const g of f)if(!p.has(g[0]))for(const _ of s){if(p.has(_[0]))continue;const m=this.board.routeTo(g[0],g[1],_[0],_[1],o,p);if(m)return m}return null},h=(f,p)=>l(f,p)!==null,u=l(r,Gh);return u?e.filter(f=>{if(!f.cells.some(m=>u.cells.has(m)))return!0;const p=new Set(f.cells);if(h(r,p))return!0;if(t.ports.size===0)return!1;const g=[];let _=!1;for(const m of this.board.crossings(f.o,f.ta,f.tb,f.cells,[]))if(t.ports.has(m.slot)){if(!this.board.filled.has(m.far))g.push([m.far,1-m.side]);else if(this.board.ports.has(m.edge)){const d=this.board.riverFind(m.edge);if(d===a)_=!0;else if(d===c)return!0}}return _&&h(g,p)}):e}_questTargets(t){const e=this.board.openMouths.get(t.edge);if(e)return[e];const n=t.tail?this.board.openMouths.get(t.tail.edge):null,s=this._endsOf(t.edge).filter(r=>!n||r[0]!==n[0]||r[1]!==n[1]);return s.length?s:this._endsOf(t.edge)}_endsOf(t){const e=[];if(!t||!this.board.riverParent.has(t))return e;const n=this.board.riverFind(t);for(const[s,r]of this.board.openMouths)this.board.riverFind(s)===n&&e.push(r);return e}_riverEnds(){return this.headwater?this._endsOf(this.headwater.edge):[]}_canJoin(t,e){return t.ports.size===0?!0:e.some(n=>this.board.joinsRiver(n.o,n.ta,n.tb,t.ports,n.cells))}_ensurePlayable(){const t=this.queue[0];if(!t)return;let e=this._legalFor(t);if(t.crafted){if(e.length>0){this._fits=e;return}return this.refund(t),this.queue.shift(),this.log.unshift(`nowhere for the ${t.craftTitle} — refunded`),this._ensurePlayable()}const n=this._cutBridge();if(n){this.queue[0]=n.tile,this._fits=n.fits;return}if(this.quest&&!this.quest.done&&(t.ports.size>0||this.rnd()<.25)){const r=this._cutStream();if(r){this.queue[0]=r.tile,this._fits=r.fits;return}}if(t.ports.size>0&&!this._canJoin(t,e)){const r=this._cutStream();if(r){this.queue[0]=r.tile,this._fits=r.fits;return}const o=la(this.rnd,0),a=this._legalFor(o);if(a.length>0){this.queue[0]=o,this._fits=a;return}}if(e.length>0){this._fits=e;return}const s=uo(this.board.filled);for(let r=0;r<s.length;r++){const o=s[Math.floor(this.rnd()*s.length)],a=Me(o.o,o.ta,o.tb),c=this.board.demandedPorts(o.o,o.ta,o.tb,a);if(!c)continue;const l=Tr(c,this.rnd),h=this._legalFor(l);if(h.length>0){this.queue[0]=l,this._fits=h;return}}this._fits=[]}_cutBridge(){const t=this.quest;if(!t||t.done||!this.headwater||!this.board.riverParent.has(this.headwater.edge)||!this.board.riverParent.has(t.edge))return null;const e=this.board.riverFind(this.headwater.edge),n=this.board.riverFind(t.edge);if(e===n)return null;for(const s of uo(this.board.filled)){const r=Me(s.o,s.ta,s.tb),o=this.board.crossings(s.o,s.ta,s.tb,r,[]),a=new Set;let c=!1,l=!1;for(const f of o){if(!this.board.filled.has(f.far)||!this.board.ports.has(f.edge))continue;a.add(f.slot);const p=this.board.riverFind(f.edge);p===e?c=!0:p===n&&(l=!0)}if(!c||!l||!this.board.placeable(s.o,s.ta,s.tb,a,r))continue;const h=Tr(a,this.rnd);h.kind="confluence";const u=this._legalFor(h);if(u.length>0)return{tile:h,fits:u}}return null}_cutStream(){const t=this.board.stuckMouths(),e=this.headwater&&this.board.riverParent.has(this.headwater.edge)?this.board.riverFind(this.headwater.edge):null,n=this.quest&&!this.quest.done&&this.board.riverParent.has(this.quest.edge)?this.board.riverFind(this.quest.edge):null;let s=[];for(const[h,u]of this.board.openMouths){if(t.has(h))continue;const f=this.board.riverFind(h);for(const p of this.board.continuations(u[0],u[1]))s.push({...p,root:f,w:1})}if(s.length===0)return null;const r=this.quest&&!this.quest.done?this._questTargets(this.quest):[],o=r.length>0&&e!==null&&n!==null&&e!==n;if(o){const h=[];for(const u of this._riverEnds())for(const f of r){const p=this.board.routeTo(u[0],u[1],f[0],f[1],this.quest.hops+1);p&&h.push({...p.first,root:e,w:1})}h.length?s=[...h,...s]:s.sort((u,f)=>(f.root===e)-(u.root===e))}const a=s.reduce((h,u)=>h+u.w,0);let c=null;const l=o?s.length:24;for(let h=0;h<l;h++){let u=s[h];if(!o){let M=this.rnd()*a;u=s[s.length-1];for(const x of s)if(M-=x.w,M<=0){u=x;break}}const f=Me(u.o,u.ta,u.tb),p=this.board.demandedPorts(u.o,u.ta,u.tb,f);if(!p||!p.has(u.slot))continue;const g=new Set(p),_=this.board.crossings(u.o,u.ta,u.tb,f,[]).filter(M=>!this.board.filled.has(M.far)&&!g.has(M.slot));for(let M=_.length-1;M>0;M--){const x=Math.floor(this.rnd()*(M+1));[_[M],_[x]]=[_[x],_[M]]}for(const M of _){if(g.size>=3||g.size>p.size&&this.rnd()>.45)break;g.add(M.slot)}if(!this.board.placeable(u.o,u.ta,u.tb,g,f))continue;const m=Tr(g,this.rnd);m.kind="stream";const d=this._legalFor(m);if(this._canJoin(m,d)){if(o)return{tile:m,fits:d};if((!c||d.length>c.fits.length)&&(c={tile:m,fits:d}),c.fits.length>=12)break}}return c}get tile(){return this.queue[0]}get fits(){return this._fits||this._ensurePlayable(),this._fits}reroll(){return this.over||this.tilesLeft<=1?!1:(this.tilesLeft-=1,this.queue.shift(),this._fits=null,this._refillQueue(),!0)}fitsAtCell(t){if(!this.tile)return[];const e=[];for(const n of this.fits)n.cells.includes(t)&&e.push({...n,...this._harmony(n.o,n.cells,this.tile)});return e.sort((n,s)=>s.joins-n.joins||s.match-n.match||s.touch-n.touch||n.o-s.o),e}_harmony(t,e,n){let s=0,r=0;const o=new Set(e);for(let c=0;c<e.length;c++){const l=e[c];De(Xt(l),qt(l),jt(l),pa);for(let h=0;h<4;h++){const u=pa[h];o.has(u)||!this.board.filled.has(u)||(r++,this.board.biome.get(u)===n.biomes[c]&&s++)}}let a=0;for(const c of this.board.crossings(t,0,0,e,[]))n.ports.has(c.slot)&&this.board.filled.has(c.far)&&this.board.ports.has(c.edge)&&a++;return{match:s,touch:r,joins:a}}place(t){if(this.over)return null;const e=this.tile,n=this._harmony(t.o,t.cells,e),s=n.touch>0&&n.match===n.touch,r=this.board.place(t.o,t.ta,t.tb,e,this.placed);this._remember(r.cells),this.placed+=1,this.tilesLeft-=1;const o=n.match*3+r.joined*6+(s?12:0);this.score+=o;let a=o,c=0;const l=[];for(const p of r.closed)this.score+=p.score,a+=p.score,c+=p.tiles,this.sealedCount+=1,p.size>this.best.size&&(this.best={size:p.size,biome:p.biome}),p.size>=3&&(l.push(p),this.log.unshift(`${kn[p.biome]} sealed · ${p.size} kites · +${p.score}`));const h=e.camp??null;h&&(this.score+=h.score,a+=h.score,c+=h.tiles,this.camps=(this.camps??0)+1,this.log.unshift(`${h.title} · +${h.score}`),this.works.push({kind:h.key,resource:fa[h.key],at:Bh(r.cells)}));const u=this._checkQuest();u&&(a+=u.score,c+=u.tiles,this.works.push({kind:"mill",resource:fa.mill,at:u.hub}));const f=this._harvest();return this.tilesLeft+=c,this.log.length=Math.min(this.log.length,5),this.queue.shift(),this._fits=null,this._refillQueue(),(this.tilesLeft<=0||this.fits.length===0)&&this.finish(),{...r,gained:a,fitScore:o,perfect:s,bonus:c,announce:l,quest:u,camp:h,harvest:f,...n,joined:r.joined}}biggestOpen(){let t=null;for(const e of this.board.allRegions())e.sealed||(!t||e.size>t.size)&&(t=e);return t}finish(){if(!this.over){this.over=!0,this.openTally=[];for(const t of this.board.allRegions()){if(t.sealed||t.size<3)continue;const e=xh(t.size,t.biome);this.score+=e,this.openTally.push({...t,score:e})}this.openTally.sort((t,e)=>e.score-t.score)}}centreOf(t){return Ye(Xt(t),qt(t),jt(t))}}const pa=[0,0,0,0];function Bh(i){let t=0,e=0;for(const n of i){const[s,r]=Ye(Xt(n),qt(n),jt(n));t+=s,e+=r}return[t/i.length,e/i.length]}const Gh=new Set;/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Io="160",Hh=0,ma=1,kh=2,el=1,nl=2,_n=3,Sn=0,Ne=1,Je=2,zn=0,Ni=1,us=2,ga=3,_a=4,Vh=5,ei=100,Wh=101,Xh=102,xa=103,va=104,qh=200,Yh=201,jh=202,$h=203,fo=204,po=205,Kh=206,Zh=207,Jh=208,Qh=209,tu=210,eu=211,nu=212,iu=213,su=214,ru=0,ou=1,au=2,Js=3,cu=4,lu=5,hu=6,uu=7,No=0,fu=1,du=2,Bn=0,pu=1,mu=2,gu=3,_u=4,xu=5,vu=6,il=300,zi=301,Bi=302,mo=303,go=304,dr=306,_o=1e3,Qe=1001,xo=1002,Le=1003,Ma=1004,Ar=1005,Ve=1006,Mu=1007,fs=1008,Gn=1009,Su=1010,Eu=1011,Fo=1012,sl=1013,Nn=1014,Fn=1015,ds=1016,rl=1017,ol=1018,ii=1020,yu=1021,tn=1023,bu=1024,Tu=1025,si=1026,Gi=1027,Au=1028,al=1029,wu=1030,cl=1031,ll=1033,wr=33776,Rr=33777,Cr=33778,Pr=33779,Sa=35840,Ea=35841,ya=35842,ba=35843,hl=36196,Ta=37492,Aa=37496,wa=37808,Ra=37809,Ca=37810,Pa=37811,La=37812,Da=37813,Ua=37814,Ia=37815,Na=37816,Fa=37817,Oa=37818,za=37819,Ba=37820,Ga=37821,Lr=36492,Ha=36494,ka=36495,Ru=36283,Va=36284,Wa=36285,Xa=36286,ul=3e3,ri=3001,Cu=3200,Pu=3201,fl=0,Lu=1,Xe="",fe="srgb",En="srgb-linear",Oo="display-p3",pr="display-p3-linear",Qs="linear",ne="srgb",tr="rec709",er="p3",pi=7680,qa=519,Du=512,Uu=513,Iu=514,dl=515,Nu=516,Fu=517,Ou=518,zu=519,Ya=35044,pl=35048,ja="300 es",vo=1035,xn=2e3,nr=2001;class Xi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const be=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Dr=Math.PI/180,Mo=180/Math.PI;function ps(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(be[i&255]+be[i>>8&255]+be[i>>16&255]+be[i>>24&255]+"-"+be[t&255]+be[t>>8&255]+"-"+be[t>>16&15|64]+be[t>>24&255]+"-"+be[e&63|128]+be[e>>8&255]+"-"+be[e>>16&255]+be[e>>24&255]+be[n&255]+be[n>>8&255]+be[n>>16&255]+be[n>>24&255]).toLowerCase()}function Ie(i,t,e){return Math.max(t,Math.min(e,i))}function Bu(i,t){return(i%t+t)%t}function Ur(i,t,e){return(1-e)*i+e*t}function $a(i){return(i&i-1)===0&&i!==0}function So(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ji(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ue(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gt{constructor(t,e,n,s,r,o,a,c,l){Gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],p=n[5],g=n[8],_=s[0],m=s[3],d=s[6],M=s[1],x=s[4],v=s[7],A=s[2],w=s[5],R=s[8];return r[0]=o*_+a*M+c*A,r[3]=o*m+a*x+c*w,r[6]=o*d+a*v+c*R,r[1]=l*_+h*M+u*A,r[4]=l*m+h*x+u*w,r[7]=l*d+h*v+u*R,r[2]=f*_+p*M+g*A,r[5]=f*m+p*x+g*w,r[8]=f*d+p*v+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,p=l*r-o*c,g=e*u+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=f*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=p*_,t[7]=(n*c-l*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ir.makeScale(t,e)),this}rotate(t){return this.premultiply(Ir.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ir.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ir=new Gt;function ml(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ir(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Gu(){const i=ir("canvas");return i.style.display="block",i}const Ka={};function os(i){i in Ka||(Ka[i]=!0,console.warn(i))}const Za=new Gt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ja=new Gt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ss={[En]:{transfer:Qs,primaries:tr,toReference:i=>i,fromReference:i=>i},[fe]:{transfer:ne,primaries:tr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[pr]:{transfer:Qs,primaries:er,toReference:i=>i.applyMatrix3(Ja),fromReference:i=>i.applyMatrix3(Za)},[Oo]:{transfer:ne,primaries:er,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Ja),fromReference:i=>i.applyMatrix3(Za).convertLinearToSRGB()}},Hu=new Set([En,pr]),Jt={enabled:!0,_workingColorSpace:En,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Hu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Ss[t].toReference,s=Ss[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Ss[i].primaries},getTransfer:function(i){return i===Xe?Qs:Ss[i].transfer}};function Fi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Nr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let mi;class gl{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{mi===void 0&&(mi=ir("canvas")),mi.width=t.width,mi.height=t.height;const n=mi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=mi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ir("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Fi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Fi(e[n]/255)*255):e[n]=Fi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ku=0;class _l{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ku++}),this.uuid=ps(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Fr(s[o].image)):r.push(Fr(s[o]))}else r=Fr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Fr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?gl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Vu=0;class Fe extends Xi{constructor(t=Fe.DEFAULT_IMAGE,e=Fe.DEFAULT_MAPPING,n=Qe,s=Qe,r=Ve,o=fs,a=tn,c=Gn,l=Fe.DEFAULT_ANISOTROPY,h=Xe){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=ps(),this.name="",this.source=new _l(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ri?fe:Xe),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==il)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case _o:t.x=t.x-Math.floor(t.x);break;case Qe:t.x=t.x<0?0:1;break;case xo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case _o:t.y=t.y-Math.floor(t.y);break;case Qe:t.y=t.y<0?0:1;break;case xo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===fe?ri:ul}set encoding(t){os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ri?fe:Xe}}Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=il;Fe.DEFAULT_ANISOTROPY=1;class Se{constructor(t=0,e=0,n=0,s=1){Se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],p=c[5],g=c[9],_=c[2],m=c[6],d=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,v=(p+1)/2,A=(d+1)/2,w=(h+f)/4,R=(u+_)/4,U=(g+m)/4;return x>v&&x>A?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=w/n,r=R/n):v>A?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=w/s,r=U/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=R/r,s=U/r),this.set(n,s,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-_)/M,this.z=(f-h)/M,this.w=Math.acos((l+p+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Wu extends Xi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Se(0,0,t,e),this.scissorTest=!1,this.viewport=new Se(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(os("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ri?fe:Xe),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ve,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Fe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new _l(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ci extends Wu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class xl extends Fe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Le,this.minFilter=Le,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xu extends Fe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Le,this.minFilter=Le,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ui{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==f||l!==p||h!==g){let m=1-a;const d=c*f+l*p+h*g+u*_,M=d>=0?1:-1,x=1-d*d;if(x>Number.EPSILON){const A=Math.sqrt(x),w=Math.atan2(A,d*M);m=Math.sin(m*w)/A,a=Math.sin(a*w)/A}const v=a*M;if(c=c*m+f*v,l=l*m+p*v,h=h*m+g*v,u=u*m+_*v,m===1-a){const A=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=A,l*=A,h*=A,u*=A}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*p-l*f,t[e+1]=c*g+h*f+l*u-a*p,t[e+2]=l*g+h*p+a*f-c*u,t[e+3]=h*g-a*u-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),f=c(n/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u+f*p*g;break;case"YZX":this._x=f*h*u+l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u-f*p*g;break;case"XZY":this._x=f*h*u-l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Qa.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Qa.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Or.copy(this).projectOnVector(t),this.sub(Or)}reflect(t){return this.sub(Or.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Or=new L,Qa=new ui;class fi{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(je.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(je.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=je.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,je):je.fromBufferAttribute(r,o),je.applyMatrix4(t.matrixWorld),this.expandByPoint(je);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Es.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Es.copy(n.boundingBox)),Es.applyMatrix4(t.matrixWorld),this.union(Es)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,je),je.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qi),ys.subVectors(this.max,Qi),gi.subVectors(t.a,Qi),_i.subVectors(t.b,Qi),xi.subVectors(t.c,Qi),An.subVectors(_i,gi),wn.subVectors(xi,_i),$n.subVectors(gi,xi);let e=[0,-An.z,An.y,0,-wn.z,wn.y,0,-$n.z,$n.y,An.z,0,-An.x,wn.z,0,-wn.x,$n.z,0,-$n.x,-An.y,An.x,0,-wn.y,wn.x,0,-$n.y,$n.x,0];return!zr(e,gi,_i,xi,ys)||(e=[1,0,0,0,1,0,0,0,1],!zr(e,gi,_i,xi,ys))?!1:(bs.crossVectors(An,wn),e=[bs.x,bs.y,bs.z],zr(e,gi,_i,xi,ys))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,je).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(je).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const hn=[new L,new L,new L,new L,new L,new L,new L,new L],je=new L,Es=new fi,gi=new L,_i=new L,xi=new L,An=new L,wn=new L,$n=new L,Qi=new L,ys=new L,bs=new L,Kn=new L;function zr(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Kn.fromArray(i,r);const a=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),c=t.dot(Kn),l=e.dot(Kn),h=n.dot(Kn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const qu=new fi,ts=new L,Br=new L;class qi{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):qu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ts.subVectors(t,this.center);const e=ts.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ts,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Br.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ts.copy(t.center).add(Br)),this.expandByPoint(ts.copy(t.center).sub(Br))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const un=new L,Gr=new L,Ts=new L,Rn=new L,Hr=new L,As=new L,kr=new L;class zo{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(un.copy(this.origin).addScaledVector(this.direction,e),un.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Gr.copy(t).add(e).multiplyScalar(.5),Ts.copy(e).sub(t).normalize(),Rn.copy(this.origin).sub(Gr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Ts),a=Rn.dot(this.direction),c=-Rn.dot(Ts),l=Rn.lengthSq(),h=Math.abs(1-o*o);let u,f,p,g;if(h>0)if(u=o*c-a,f=o*a-c,g=r*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,p=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Gr).addScaledVector(Ts,f),p}intersectSphere(t,e){un.subVectors(t.center,this.origin);const n=un.dot(this.direction),s=un.dot(un)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,un)!==null}intersectTriangle(t,e,n,s,r){Hr.subVectors(e,t),As.subVectors(n,t),kr.crossVectors(Hr,As);let o=this.direction.dot(kr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Rn.subVectors(this.origin,t);const c=a*this.direction.dot(As.crossVectors(Rn,As));if(c<0)return null;const l=a*this.direction.dot(Hr.cross(Rn));if(l<0||c+l>o)return null;const h=-a*Rn.dot(kr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ie{constructor(t,e,n,s,r,o,a,c,l,h,u,f,p,g,_,m){ie.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,f,p,g,_,m)}set(t,e,n,s,r,o,a,c,l,h,u,f,p,g,_,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=l,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ie().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/vi.setFromMatrixColumn(t,0).length(),r=1/vi.setFromMatrixColumn(t,1).length(),o=1/vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*h,p=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=f-_*l,e[9]=-a*c,e[2]=_-f*l,e[6]=g+p*l,e[10]=o*c}else if(t.order==="YXZ"){const f=c*h,p=c*u,g=l*h,_=l*u;e[0]=f+_*a,e[4]=g*a-p,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*h,p=c*u,g=l*h,_=l*u;e[0]=f-_*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*h,p=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=g*l-p,e[8]=f*l+_,e[1]=c*u,e[5]=_*l+f,e[9]=p*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-f*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=p*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+_,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Yu,t,ju)}lookAt(t,e,n){const s=this.elements;return ze.subVectors(t,e),ze.lengthSq()===0&&(ze.z=1),ze.normalize(),Cn.crossVectors(n,ze),Cn.lengthSq()===0&&(Math.abs(n.z)===1?ze.x+=1e-4:ze.z+=1e-4,ze.normalize(),Cn.crossVectors(n,ze)),Cn.normalize(),ws.crossVectors(ze,Cn),s[0]=Cn.x,s[4]=ws.x,s[8]=ze.x,s[1]=Cn.y,s[5]=ws.y,s[9]=ze.y,s[2]=Cn.z,s[6]=ws.z,s[10]=ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],p=n[13],g=n[2],_=n[6],m=n[10],d=n[14],M=n[3],x=n[7],v=n[11],A=n[15],w=s[0],R=s[4],U=s[8],S=s[12],y=s[1],I=s[5],N=s[9],Z=s[13],P=s[2],G=s[6],V=s[10],q=s[14],W=s[3],X=s[7],Y=s[11],tt=s[15];return r[0]=o*w+a*y+c*P+l*W,r[4]=o*R+a*I+c*G+l*X,r[8]=o*U+a*N+c*V+l*Y,r[12]=o*S+a*Z+c*q+l*tt,r[1]=h*w+u*y+f*P+p*W,r[5]=h*R+u*I+f*G+p*X,r[9]=h*U+u*N+f*V+p*Y,r[13]=h*S+u*Z+f*q+p*tt,r[2]=g*w+_*y+m*P+d*W,r[6]=g*R+_*I+m*G+d*X,r[10]=g*U+_*N+m*V+d*Y,r[14]=g*S+_*Z+m*q+d*tt,r[3]=M*w+x*y+v*P+A*W,r[7]=M*R+x*I+v*G+A*X,r[11]=M*U+x*N+v*V+A*Y,r[15]=M*S+x*Z+v*q+A*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],p=t[14],g=t[3],_=t[7],m=t[11],d=t[15];return g*(+r*c*u-s*l*u-r*a*f+n*l*f+s*a*p-n*c*p)+_*(+e*c*p-e*l*f+r*o*f-s*o*p+s*l*h-r*c*h)+m*(+e*l*u-e*a*p-r*o*u+n*o*p+r*a*h-n*l*h)+d*(-s*a*h-e*c*u+e*a*f+s*o*u-n*o*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],p=t[11],g=t[12],_=t[13],m=t[14],d=t[15],M=u*m*l-_*f*l+_*c*p-a*m*p-u*c*d+a*f*d,x=g*f*l-h*m*l-g*c*p+o*m*p+h*c*d-o*f*d,v=h*_*l-g*u*l+g*a*p-o*_*p-h*a*d+o*u*d,A=g*u*c-h*_*c-g*a*f+o*_*f+h*a*m-o*u*m,w=e*M+n*x+s*v+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return t[0]=M*R,t[1]=(_*f*r-u*m*r-_*s*p+n*m*p+u*s*d-n*f*d)*R,t[2]=(a*m*r-_*c*r+_*s*l-n*m*l-a*s*d+n*c*d)*R,t[3]=(u*c*r-a*f*r-u*s*l+n*f*l+a*s*p-n*c*p)*R,t[4]=x*R,t[5]=(h*m*r-g*f*r+g*s*p-e*m*p-h*s*d+e*f*d)*R,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*d-e*c*d)*R,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*p+e*c*p)*R,t[8]=v*R,t[9]=(g*u*r-h*_*r-g*n*p+e*_*p+h*n*d-e*u*d)*R,t[10]=(o*_*r-g*a*r+g*n*l-e*_*l-o*n*d+e*a*d)*R,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*p-e*a*p)*R,t[12]=A*R,t[13]=(h*_*s-g*u*s+g*n*f-e*_*f-h*n*m+e*u*m)*R,t[14]=(g*a*s-o*_*s-g*n*c+e*_*c+o*n*m-e*a*m)*R,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*f+e*a*f)*R,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,p=r*h,g=r*u,_=o*h,m=o*u,d=a*u,M=c*l,x=c*h,v=c*u,A=n.x,w=n.y,R=n.z;return s[0]=(1-(_+d))*A,s[1]=(p+v)*A,s[2]=(g-x)*A,s[3]=0,s[4]=(p-v)*w,s[5]=(1-(f+d))*w,s[6]=(m+M)*w,s[7]=0,s[8]=(g+x)*R,s[9]=(m-M)*R,s[10]=(1-(f+_))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=vi.set(s[0],s[1],s[2]).length();const o=vi.set(s[4],s[5],s[6]).length(),a=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],$e.copy(this);const l=1/r,h=1/o,u=1/a;return $e.elements[0]*=l,$e.elements[1]*=l,$e.elements[2]*=l,$e.elements[4]*=h,$e.elements[5]*=h,$e.elements[6]*=h,$e.elements[8]*=u,$e.elements[9]*=u,$e.elements[10]*=u,e.setFromRotationMatrix($e),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=xn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let p,g;if(a===xn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===nr)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=xn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(o-r),f=(e+t)*l,p=(n+s)*h;let g,_;if(a===xn)g=(o+r)*u,_=-2*u;else if(a===nr)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const vi=new L,$e=new ie,Yu=new L(0,0,0),ju=new L(1,1,1),Cn=new L,ws=new L,ze=new L,tc=new ie,ec=new ui;class mr{constructor(t=0,e=0,n=0,s=mr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ie(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ie(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return tc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(tc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ec.setFromEuler(this),this.setFromQuaternion(ec,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}mr.DEFAULT_ORDER="XYZ";class Bo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let $u=0;const nc=new L,Mi=new ui,fn=new ie,Rs=new L,es=new L,Ku=new L,Zu=new ui,ic=new L(1,0,0),sc=new L(0,1,0),rc=new L(0,0,1),Ju={type:"added"},Qu={type:"removed"};class Ee extends Xi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=ps(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ee.DEFAULT_UP.clone();const t=new L,e=new mr,n=new ui,s=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ie},normalMatrix:{value:new Gt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=Ee.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.premultiply(Mi),this}rotateX(t){return this.rotateOnAxis(ic,t)}rotateY(t){return this.rotateOnAxis(sc,t)}rotateZ(t){return this.rotateOnAxis(rc,t)}translateOnAxis(t,e){return nc.copy(t).applyQuaternion(this.quaternion),this.position.add(nc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ic,t)}translateY(t){return this.translateOnAxis(sc,t)}translateZ(t){return this.translateOnAxis(rc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Rs.copy(t):Rs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),es.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(es,Rs,this.up):fn.lookAt(Rs,es,this.up),this.quaternion.setFromRotationMatrix(fn),s&&(fn.extractRotation(s.matrixWorld),Mi.setFromRotationMatrix(fn),this.quaternion.premultiply(Mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Ju)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Qu)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(fn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,t,Ku),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,Zu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ee.DEFAULT_UP=new L(0,1,0);Ee.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ke=new L,dn=new L,Vr=new L,pn=new L,Si=new L,Ei=new L,oc=new L,Wr=new L,Xr=new L,qr=new L;let Cs=!1;class Ze{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ke.subVectors(t,e),s.cross(Ke);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ke.subVectors(s,e),dn.subVectors(n,e),Vr.subVectors(t,e);const o=Ke.dot(Ke),a=Ke.dot(dn),c=Ke.dot(Vr),l=dn.dot(dn),h=dn.dot(Vr),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(l*c-a*h)*f,g=(o*h-a*c)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getUV(t,e,n,s,r,o,a,c){return Cs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Cs=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,pn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,pn.x),c.addScaledVector(o,pn.y),c.addScaledVector(a,pn.z),c)}static isFrontFacing(t,e,n,s){return Ke.subVectors(n,e),dn.subVectors(t,e),Ke.cross(dn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ke.subVectors(this.c,this.b),dn.subVectors(this.a,this.b),Ke.cross(dn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ze.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ze.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Cs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Cs=!0),Ze.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return Ze.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Ze.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ze.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Si.subVectors(s,n),Ei.subVectors(r,n),Wr.subVectors(t,n);const c=Si.dot(Wr),l=Ei.dot(Wr);if(c<=0&&l<=0)return e.copy(n);Xr.subVectors(t,s);const h=Si.dot(Xr),u=Ei.dot(Xr);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Si,o);qr.subVectors(t,r);const p=Si.dot(qr),g=Ei.dot(qr);if(g>=0&&p<=g)return e.copy(r);const _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Ei,a);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return oc.subVectors(r,s),a=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(oc,a);const d=1/(m+_+f);return o=_*d,a=f*d,e.copy(n).addScaledVector(Si,o).addScaledVector(Ei,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const vl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pn={h:0,s:0,l:0},Ps={h:0,s:0,l:0};function Yr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class kt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=fe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Jt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Jt.workingColorSpace){if(t=Bu(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Yr(o,r,t+1/3),this.g=Yr(o,r,t),this.b=Yr(o,r,t-1/3)}return Jt.toWorkingColorSpace(this,s),this}setStyle(t,e=fe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=fe){const n=vl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}copyLinearToSRGB(t){return this.r=Nr(t.r),this.g=Nr(t.g),this.b=Nr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=fe){return Jt.fromWorkingColorSpace(Te.copy(this),t),Math.round(Ie(Te.r*255,0,255))*65536+Math.round(Ie(Te.g*255,0,255))*256+Math.round(Ie(Te.b*255,0,255))}getHexString(t=fe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Jt.workingColorSpace){Jt.fromWorkingColorSpace(Te.copy(this),e);const n=Te.r,s=Te.g,r=Te.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Jt.workingColorSpace){return Jt.fromWorkingColorSpace(Te.copy(this),e),t.r=Te.r,t.g=Te.g,t.b=Te.b,t}getStyle(t=fe){Jt.fromWorkingColorSpace(Te.copy(this),t);const e=Te.r,n=Te.g,s=Te.b;return t!==fe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Pn),this.setHSL(Pn.h+t,Pn.s+e,Pn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Pn),t.getHSL(Ps);const n=Ur(Pn.h,Ps.h,e),s=Ur(Pn.s,Ps.s,e),r=Ur(Pn.l,Ps.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Te=new kt;kt.NAMES=vl;let tf=0;class Yi extends Xi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:tf++}),this.uuid=ps(),this.name="",this.type="Material",this.blending=Ni,this.side=Sn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fo,this.blendDst=po,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new kt(0,0,0),this.blendAlpha=0,this.depthFunc=Js,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qa,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ni&&(n.blending=this.blending),this.side!==Sn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==fo&&(n.blendSrc=this.blendSrc),this.blendDst!==po&&(n.blendDst=this.blendDst),this.blendEquation!==ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Js&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qa&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class oi extends Yi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=No,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ue=new L,Ls=new Wt;class de{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ya,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Fn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ls.fromBufferAttribute(this,e),Ls.applyMatrix3(t),this.setXY(e,Ls.x,Ls.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ue.fromBufferAttribute(this,e),ue.applyMatrix3(t),this.setXYZ(e,ue.x,ue.y,ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ue.fromBufferAttribute(this,e),ue.applyMatrix4(t),this.setXYZ(e,ue.x,ue.y,ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ue.fromBufferAttribute(this,e),ue.applyNormalMatrix(t),this.setXYZ(e,ue.x,ue.y,ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ue.fromBufferAttribute(this,e),ue.transformDirection(t),this.setXYZ(e,ue.x,ue.y,ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ji(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ue(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ji(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ji(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ji(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ji(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array),r=Ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ya&&(t.usage=this.usage),t}}class Ml extends de{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Sl extends de{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class pe extends de{constructor(t,e,n){super(new Float32Array(t),e,n)}}let ef=0;const ke=new ie,jr=new Ee,yi=new L,Be=new fi,ns=new fi,ve=new L;class ae extends Xi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ef++}),this.uuid=ps(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ml(t)?Sl:Ml)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Gt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ke.makeRotationFromQuaternion(t),this.applyMatrix4(ke),this}rotateX(t){return ke.makeRotationX(t),this.applyMatrix4(ke),this}rotateY(t){return ke.makeRotationY(t),this.applyMatrix4(ke),this}rotateZ(t){return ke.makeRotationZ(t),this.applyMatrix4(ke),this}translate(t,e,n){return ke.makeTranslation(t,e,n),this.applyMatrix4(ke),this}scale(t,e,n){return ke.makeScale(t,e,n),this.applyMatrix4(ke),this}lookAt(t){return jr.lookAt(t),jr.updateMatrix(),this.applyMatrix4(jr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yi).negate(),this.translate(yi.x,yi.y,yi.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new pe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Be.setFromBufferAttribute(r),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,Be.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,Be.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(Be.min),this.boundingBox.expandByPoint(Be.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(Be.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];ns.setFromBufferAttribute(a),this.morphTargetsRelative?(ve.addVectors(Be.min,ns.min),Be.expandByPoint(ve),ve.addVectors(Be.max,ns.max),Be.expandByPoint(ve)):(Be.expandByPoint(ns.min),Be.expandByPoint(ns.max))}Be.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ve.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)ve.fromBufferAttribute(a,l),c&&(yi.fromBufferAttribute(t,l),ve.add(yi)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new de(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let y=0;y<a;y++)l[y]=new L,h[y]=new L;const u=new L,f=new L,p=new L,g=new Wt,_=new Wt,m=new Wt,d=new L,M=new L;function x(y,I,N){u.fromArray(s,y*3),f.fromArray(s,I*3),p.fromArray(s,N*3),g.fromArray(o,y*2),_.fromArray(o,I*2),m.fromArray(o,N*2),f.sub(u),p.sub(u),_.sub(g),m.sub(g);const Z=1/(_.x*m.y-m.x*_.y);isFinite(Z)&&(d.copy(f).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(Z),M.copy(p).multiplyScalar(_.x).addScaledVector(f,-m.x).multiplyScalar(Z),l[y].add(d),l[I].add(d),l[N].add(d),h[y].add(M),h[I].add(M),h[N].add(M))}let v=this.groups;v.length===0&&(v=[{start:0,count:n.length}]);for(let y=0,I=v.length;y<I;++y){const N=v[y],Z=N.start,P=N.count;for(let G=Z,V=Z+P;G<V;G+=3)x(n[G+0],n[G+1],n[G+2])}const A=new L,w=new L,R=new L,U=new L;function S(y){R.fromArray(r,y*3),U.copy(R);const I=l[y];A.copy(I),A.sub(R.multiplyScalar(R.dot(I))).normalize(),w.crossVectors(U,I);const Z=w.dot(h[y])<0?-1:1;c[y*4]=A.x,c[y*4+1]=A.y,c[y*4+2]=A.z,c[y*4+3]=Z}for(let y=0,I=v.length;y<I;++y){const N=v[y],Z=N.start,P=N.count;for(let G=Z,V=Z+P;G<V;G+=3)S(n[G+0]),S(n[G+1]),S(n[G+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new de(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new L,r=new L,o=new L,a=new L,c=new L,l=new L,h=new L,u=new L;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let p=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*h;for(let d=0;d<h;d++)f[g++]=l[p++]}return new de(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ae,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],p=t(f,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ac=new ie,Zn=new zo,Ds=new qi,cc=new L,bi=new L,Ti=new L,Ai=new L,$r=new L,Us=new L,Is=new Wt,Ns=new Wt,Fs=new Wt,lc=new L,hc=new L,uc=new L,Os=new L,zs=new L;class se extends Ee{constructor(t=new ae,e=new oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Us.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&($r.fromBufferAttribute(u,t),o?Us.addScaledVector($r,h):Us.addScaledVector($r.sub(e),h))}e.add(Us)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ds.copy(n.boundingSphere),Ds.applyMatrix4(r),Zn.copy(t.ray).recast(t.near),!(Ds.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(Ds,cc)===null||Zn.origin.distanceToSquared(cc)>(t.far-t.near)**2))&&(ac.copy(r).invert(),Zn.copy(t.ray).applyMatrix4(ac),!(n.boundingBox!==null&&Zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Zn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=o[m.materialIndex],M=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let v=M,A=x;v<A;v+=3){const w=a.getX(v),R=a.getX(v+1),U=a.getX(v+2);s=Bs(this,d,t,n,l,h,u,w,R,U),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const M=a.getX(m),x=a.getX(m+1),v=a.getX(m+2);s=Bs(this,o,t,n,l,h,u,M,x,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=o[m.materialIndex],M=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let v=M,A=x;v<A;v+=3){const w=v,R=v+1,U=v+2;s=Bs(this,d,t,n,l,h,u,w,R,U),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const M=m,x=m+1,v=m+2;s=Bs(this,o,t,n,l,h,u,M,x,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function nf(i,t,e,n,s,r,o,a){let c;if(t.side===Ne?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Sn,a),c===null)return null;zs.copy(a),zs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(zs);return l<e.near||l>e.far?null:{distance:l,point:zs.clone(),object:i}}function Bs(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,bi),i.getVertexPosition(c,Ti),i.getVertexPosition(l,Ai);const h=nf(i,t,e,n,bi,Ti,Ai,Os);if(h){s&&(Is.fromBufferAttribute(s,a),Ns.fromBufferAttribute(s,c),Fs.fromBufferAttribute(s,l),h.uv=Ze.getInterpolation(Os,bi,Ti,Ai,Is,Ns,Fs,new Wt)),r&&(Is.fromBufferAttribute(r,a),Ns.fromBufferAttribute(r,c),Fs.fromBufferAttribute(r,l),h.uv1=Ze.getInterpolation(Os,bi,Ti,Ai,Is,Ns,Fs,new Wt),h.uv2=h.uv1),o&&(lc.fromBufferAttribute(o,a),hc.fromBufferAttribute(o,c),uc.fromBufferAttribute(o,l),h.normal=Ze.getInterpolation(Os,bi,Ti,Ai,lc,hc,uc,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new L,materialIndex:0};Ze.getNormal(bi,Ti,Ai,u.normal),h.face=u}return h}class yn extends ae{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new pe(l,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(u,2));function g(_,m,d,M,x,v,A,w,R,U,S){const y=v/R,I=A/U,N=v/2,Z=A/2,P=w/2,G=R+1,V=U+1;let q=0,W=0;const X=new L;for(let Y=0;Y<V;Y++){const tt=Y*I-Z;for(let nt=0;nt<G;nt++){const k=nt*y-N;X[_]=k*M,X[m]=tt*x,X[d]=P,l.push(X.x,X.y,X.z),X[_]=0,X[m]=0,X[d]=w>0?1:-1,h.push(X.x,X.y,X.z),u.push(nt/R),u.push(1-Y/U),q+=1}}for(let Y=0;Y<U;Y++)for(let tt=0;tt<R;tt++){const nt=f+tt+G*Y,k=f+tt+G*(Y+1),j=f+(tt+1)+G*(Y+1),at=f+(tt+1)+G*Y;c.push(nt,k,at),c.push(k,j,at),W+=6}a.addGroup(p,W,S),p+=W,f+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ce(i){const t={};for(let e=0;e<i.length;e++){const n=Hi(i[e]);for(const s in n)t[s]=n[s]}return t}function sf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function El(i){return i.getRenderTarget()===null?i.outputColorSpace:Jt.workingColorSpace}const yl={clone:Hi,merge:Ce};var rf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,of=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends Yi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rf,this.fragmentShader=of,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hi(t.uniforms),this.uniformsGroups=sf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class bl extends Ee{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=xn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class We extends bl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Mo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Dr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Mo*2*Math.atan(Math.tan(Dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Dr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const wi=-90,Ri=1;class af extends Ee{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new We(wi,Ri,t,e);s.layers=this.layers,this.add(s);const r=new We(wi,Ri,t,e);r.layers=this.layers,this.add(r);const o=new We(wi,Ri,t,e);o.layers=this.layers,this.add(o);const a=new We(wi,Ri,t,e);a.layers=this.layers,this.add(a);const c=new We(wi,Ri,t,e);c.layers=this.layers,this.add(c);const l=new We(wi,Ri,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===nr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Tl extends Fe{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:zi,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class cf extends ci{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(os("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ri?fe:Xe),this.texture=new Tl(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ve}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new yn(5,5,5),r=new Vn({name:"CubemapFromEquirect",uniforms:Hi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ne,blending:zn});r.uniforms.tEquirect.value=e;const o=new se(s,r),a=e.minFilter;return e.minFilter===fs&&(e.minFilter=Ve),new af(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Kr=new L,lf=new L,hf=new Gt;class Ln{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Kr.subVectors(n,e).cross(lf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Kr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||hf.getNormalMatrix(t),s=this.coplanarPoint(Kr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jn=new qi,Gs=new L;class Go{constructor(t=new Ln,e=new Ln,n=new Ln,s=new Ln,r=new Ln,o=new Ln){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=xn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],p=s[8],g=s[9],_=s[10],m=s[11],d=s[12],M=s[13],x=s[14],v=s[15];if(n[0].setComponents(c-r,f-l,m-p,v-d).normalize(),n[1].setComponents(c+r,f+l,m+p,v+d).normalize(),n[2].setComponents(c+o,f+h,m+g,v+M).normalize(),n[3].setComponents(c-o,f-h,m-g,v-M).normalize(),n[4].setComponents(c-a,f-u,m-_,v-x).normalize(),e===xn)n[5].setComponents(c+a,f+u,m+_,v+x).normalize();else if(e===nr)n[5].setComponents(a,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Jn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Jn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Jn)}intersectsSprite(t){return Jn.center.set(0,0,0),Jn.radius=.7071067811865476,Jn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Jn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Gs.x=s.normal.x>0?t.max.x:t.min.x,Gs.y=s.normal.y>0?t.max.y:t.min.y,Gs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Gs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Al(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function uf(i,t){const e=t.isWebGL2,n=new WeakMap;function s(l,h){const u=l.array,f=l.usage,p=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,f),l.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function r(l,h,u){const f=h.array,p=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),p.count===-1&&g.length===0&&i.bufferSubData(u,0,f),g.length!==0){for(let _=0,m=g.length;_<m;_++){const d=g[_];e?i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}h.clearUpdateRanges()}p.count!==-1&&(e?i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}class Ho extends ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,p=[],g=[],_=[],m=[];for(let d=0;d<h;d++){const M=d*f-o;for(let x=0;x<l;x++){const v=x*u-r;g.push(v,-M,0),_.push(0,0,1),m.push(x/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let M=0;M<a;M++){const x=M+l*d,v=M+l*(d+1),A=M+1+l*(d+1),w=M+1+l*d;p.push(x,v,w),p.push(v,A,w)}this.setIndex(p),this.setAttribute("position",new pe(g,3)),this.setAttribute("normal",new pe(_,3)),this.setAttribute("uv",new pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ho(t.width,t.height,t.widthSegments,t.heightSegments)}}var ff=`#ifdef USE_ALPHAHASH
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
#endif`,xf=`#ifdef USE_AOMAP
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
#endif`,vf=`#ifdef USE_AOMAP
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
#endif`,Sf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ef=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Tf=`#ifdef USE_IRIDESCENCE
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
#endif`,Af=`#ifdef USE_BUMPMAP
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
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Df=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Uf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,If=`#if defined( USE_COLOR_ALPHA )
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
} // validated`,Ff=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Of=`vec3 transformedNormal = objectNormal;
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
#endif`,Bf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,kf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vf=`
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
}`,td=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,ed=`#ifdef USE_LIGHTMAP
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
#endif`,od=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ad=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,cd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ld=`varying vec3 vViewPosition;
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
#endif`,xd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,vd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Md=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ed=`#if defined( USE_POINTS_UV )
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
#endif`,yd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Td=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ad=`#ifdef USE_MORPHNORMALS
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
#endif`,wd=`#ifdef USE_MORPHTARGETS
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
#endif`,Dd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ud=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Id=`#ifdef USE_NORMALMAP
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
#endif`,Fd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Od=`#ifdef USE_CLEARCOATMAP
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
#endif`,Bd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Hd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,kd=`vec4 mvPosition = vec4( transformed, 1.0 );
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
#endif`,tp=`#ifdef USE_SKINNING
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
#endif`,ep=`float specularStrength;
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
#endif`,op=`#ifdef USE_TRANSMISSION
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
#endif`,ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
}`,xp=`#if DEPTH_PACKING == 3200
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
}`,vp=`#define DISTANCE
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
}`,Sp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ep=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`uniform float scale;
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
}`,bp=`uniform vec3 diffuse;
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
}`,Tp=`#include <common>
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
}`,Ap=`uniform vec3 diffuse;
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
}`,wp=`#define LAMBERT
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
}`,Dp=`#define NORMAL
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
}`,Up=`#define PHONG
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
}`,Ip=`#define PHONG
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
}`,Fp=`#define STANDARD
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
}`,Op=`#define TOON
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
}`,Bp=`uniform float size;
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
}`,Gp=`uniform vec3 diffuse;
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
}`,Hp=`#include <common>
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
}`,kp=`uniform vec3 color;
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
}`,It={alphahash_fragment:ff,alphahash_pars_fragment:df,alphamap_fragment:pf,alphamap_pars_fragment:mf,alphatest_fragment:gf,alphatest_pars_fragment:_f,aomap_fragment:xf,aomap_pars_fragment:vf,batching_pars_vertex:Mf,batching_vertex:Sf,begin_vertex:Ef,beginnormal_vertex:yf,bsdfs:bf,iridescence_fragment:Tf,bumpmap_pars_fragment:Af,clipping_planes_fragment:wf,clipping_planes_pars_fragment:Rf,clipping_planes_pars_vertex:Cf,clipping_planes_vertex:Pf,color_fragment:Lf,color_pars_fragment:Df,color_pars_vertex:Uf,color_vertex:If,common:Nf,cube_uv_reflection_fragment:Ff,defaultnormal_vertex:Of,displacementmap_pars_vertex:zf,displacementmap_vertex:Bf,emissivemap_fragment:Gf,emissivemap_pars_fragment:Hf,colorspace_fragment:kf,colorspace_pars_fragment:Vf,envmap_fragment:Wf,envmap_common_pars_fragment:Xf,envmap_pars_fragment:qf,envmap_pars_vertex:Yf,envmap_physical_pars_fragment:rd,envmap_vertex:jf,fog_vertex:$f,fog_pars_vertex:Kf,fog_fragment:Zf,fog_pars_fragment:Jf,gradientmap_pars_fragment:Qf,lightmap_fragment:td,lightmap_pars_fragment:ed,lights_lambert_fragment:nd,lights_lambert_pars_fragment:id,lights_pars_begin:sd,lights_toon_fragment:od,lights_toon_pars_fragment:ad,lights_phong_fragment:cd,lights_phong_pars_fragment:ld,lights_physical_fragment:hd,lights_physical_pars_fragment:ud,lights_fragment_begin:fd,lights_fragment_maps:dd,lights_fragment_end:pd,logdepthbuf_fragment:md,logdepthbuf_pars_fragment:gd,logdepthbuf_pars_vertex:_d,logdepthbuf_vertex:xd,map_fragment:vd,map_pars_fragment:Md,map_particle_fragment:Sd,map_particle_pars_fragment:Ed,metalnessmap_fragment:yd,metalnessmap_pars_fragment:bd,morphcolor_vertex:Td,morphnormal_vertex:Ad,morphtarget_pars_vertex:wd,morphtarget_vertex:Rd,normal_fragment_begin:Cd,normal_fragment_maps:Pd,normal_pars_fragment:Ld,normal_pars_vertex:Dd,normal_vertex:Ud,normalmap_pars_fragment:Id,clearcoat_normal_fragment_begin:Nd,clearcoat_normal_fragment_maps:Fd,clearcoat_pars_fragment:Od,iridescence_pars_fragment:zd,opaque_fragment:Bd,packing:Gd,premultiplied_alpha_fragment:Hd,project_vertex:kd,dithering_fragment:Vd,dithering_pars_fragment:Wd,roughnessmap_fragment:Xd,roughnessmap_pars_fragment:qd,shadowmap_pars_fragment:Yd,shadowmap_pars_vertex:jd,shadowmap_vertex:$d,shadowmask_pars_fragment:Kd,skinbase_vertex:Zd,skinning_pars_vertex:Jd,skinning_vertex:Qd,skinnormal_vertex:tp,specularmap_fragment:ep,specularmap_pars_fragment:np,tonemapping_fragment:ip,tonemapping_pars_fragment:sp,transmission_fragment:rp,transmission_pars_fragment:op,uv_pars_fragment:ap,uv_pars_vertex:cp,uv_vertex:lp,worldpos_vertex:hp,background_vert:up,background_frag:fp,backgroundCube_vert:dp,backgroundCube_frag:pp,cube_vert:mp,cube_frag:gp,depth_vert:_p,depth_frag:xp,distanceRGBA_vert:vp,distanceRGBA_frag:Mp,equirect_vert:Sp,equirect_frag:Ep,linedashed_vert:yp,linedashed_frag:bp,meshbasic_vert:Tp,meshbasic_frag:Ap,meshlambert_vert:wp,meshlambert_frag:Rp,meshmatcap_vert:Cp,meshmatcap_frag:Pp,meshnormal_vert:Lp,meshnormal_frag:Dp,meshphong_vert:Up,meshphong_frag:Ip,meshphysical_vert:Np,meshphysical_frag:Fp,meshtoon_vert:Op,meshtoon_frag:zp,points_vert:Bp,points_frag:Gp,shadow_vert:Hp,shadow_frag:kp,sprite_vert:Vp,sprite_frag:Wp},et={common:{diffuse:{value:new kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new kt(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},rn={basic:{uniforms:Ce([et.common,et.specularmap,et.envmap,et.aomap,et.lightmap,et.fog]),vertexShader:It.meshbasic_vert,fragmentShader:It.meshbasic_frag},lambert:{uniforms:Ce([et.common,et.specularmap,et.envmap,et.aomap,et.lightmap,et.emissivemap,et.bumpmap,et.normalmap,et.displacementmap,et.fog,et.lights,{emissive:{value:new kt(0)}}]),vertexShader:It.meshlambert_vert,fragmentShader:It.meshlambert_frag},phong:{uniforms:Ce([et.common,et.specularmap,et.envmap,et.aomap,et.lightmap,et.emissivemap,et.bumpmap,et.normalmap,et.displacementmap,et.fog,et.lights,{emissive:{value:new kt(0)},specular:{value:new kt(1118481)},shininess:{value:30}}]),vertexShader:It.meshphong_vert,fragmentShader:It.meshphong_frag},standard:{uniforms:Ce([et.common,et.envmap,et.aomap,et.lightmap,et.emissivemap,et.bumpmap,et.normalmap,et.displacementmap,et.roughnessmap,et.metalnessmap,et.fog,et.lights,{emissive:{value:new kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:It.meshphysical_vert,fragmentShader:It.meshphysical_frag},toon:{uniforms:Ce([et.common,et.aomap,et.lightmap,et.emissivemap,et.bumpmap,et.normalmap,et.displacementmap,et.gradientmap,et.fog,et.lights,{emissive:{value:new kt(0)}}]),vertexShader:It.meshtoon_vert,fragmentShader:It.meshtoon_frag},matcap:{uniforms:Ce([et.common,et.bumpmap,et.normalmap,et.displacementmap,et.fog,{matcap:{value:null}}]),vertexShader:It.meshmatcap_vert,fragmentShader:It.meshmatcap_frag},points:{uniforms:Ce([et.points,et.fog]),vertexShader:It.points_vert,fragmentShader:It.points_frag},dashed:{uniforms:Ce([et.common,et.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:It.linedashed_vert,fragmentShader:It.linedashed_frag},depth:{uniforms:Ce([et.common,et.displacementmap]),vertexShader:It.depth_vert,fragmentShader:It.depth_frag},normal:{uniforms:Ce([et.common,et.bumpmap,et.normalmap,et.displacementmap,{opacity:{value:1}}]),vertexShader:It.meshnormal_vert,fragmentShader:It.meshnormal_frag},sprite:{uniforms:Ce([et.sprite,et.fog]),vertexShader:It.sprite_vert,fragmentShader:It.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:It.background_vert,fragmentShader:It.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:It.backgroundCube_vert,fragmentShader:It.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:It.cube_vert,fragmentShader:It.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:It.equirect_vert,fragmentShader:It.equirect_frag},distanceRGBA:{uniforms:Ce([et.common,et.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:It.distanceRGBA_vert,fragmentShader:It.distanceRGBA_frag},shadow:{uniforms:Ce([et.lights,et.fog,{color:{value:new kt(0)},opacity:{value:1}}]),vertexShader:It.shadow_vert,fragmentShader:It.shadow_frag}};rn.physical={uniforms:Ce([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new kt(0)},specularColor:{value:new kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:It.meshphysical_vert,fragmentShader:It.meshphysical_frag};const Hs={r:0,b:0,g:0};function Xp(i,t,e,n,s,r,o){const a=new kt(0);let c=r===!0?0:1,l,h,u=null,f=0,p=null;function g(m,d){let M=!1,x=d.isScene===!0?d.background:null;x&&x.isTexture&&(x=(d.backgroundBlurriness>0?e:t).get(x)),x===null?_(a,c):x&&x.isColor&&(_(x,1),M=!0);const v=i.xr.getEnvironmentBlendMode();v==="additive"?n.buffers.color.setClear(0,0,0,1,o):v==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===dr)?(h===void 0&&(h=new se(new yn(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:Hi(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Ne,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=Jt.getTransfer(x.colorSpace)!==ne,(u!==x||f!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new se(new Ho(2,2),new Vn({name:"BackgroundMaterial",uniforms:Hi(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=Jt.getTransfer(x.colorSpace)!==ne,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function _(m,d){m.getRGB(Hs,El(i)),n.buffers.color.setClear(Hs.r,Hs.g,Hs.b,d,o)}return{getClearColor:function(){return a},setClearColor:function(m,d=1){a.set(m),c=d,_(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(a,c)},render:g}}function qp(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null);let l=c,h=!1;function u(P,G,V,q,W){let X=!1;if(o){const Y=_(q,V,G);l!==Y&&(l=Y,p(l.object)),X=d(P,q,V,W),X&&M(P,q,V,W)}else{const Y=G.wireframe===!0;(l.geometry!==q.id||l.program!==V.id||l.wireframe!==Y)&&(l.geometry=q.id,l.program=V.id,l.wireframe=Y,X=!0)}W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(X||h)&&(h=!1,U(P,G,V,q),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(P){return n.isWebGL2?i.bindVertexArray(P):r.bindVertexArrayOES(P)}function g(P){return n.isWebGL2?i.deleteVertexArray(P):r.deleteVertexArrayOES(P)}function _(P,G,V){const q=V.wireframe===!0;let W=a[P.id];W===void 0&&(W={},a[P.id]=W);let X=W[G.id];X===void 0&&(X={},W[G.id]=X);let Y=X[q];return Y===void 0&&(Y=m(f()),X[q]=Y),Y}function m(P){const G=[],V=[],q=[];for(let W=0;W<s;W++)G[W]=0,V[W]=0,q[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:V,attributeDivisors:q,object:P,attributes:{},index:null}}function d(P,G,V,q){const W=l.attributes,X=G.attributes;let Y=0;const tt=V.getAttributes();for(const nt in tt)if(tt[nt].location>=0){const j=W[nt];let at=X[nt];if(at===void 0&&(nt==="instanceMatrix"&&P.instanceMatrix&&(at=P.instanceMatrix),nt==="instanceColor"&&P.instanceColor&&(at=P.instanceColor)),j===void 0||j.attribute!==at||at&&j.data!==at.data)return!0;Y++}return l.attributesNum!==Y||l.index!==q}function M(P,G,V,q){const W={},X=G.attributes;let Y=0;const tt=V.getAttributes();for(const nt in tt)if(tt[nt].location>=0){let j=X[nt];j===void 0&&(nt==="instanceMatrix"&&P.instanceMatrix&&(j=P.instanceMatrix),nt==="instanceColor"&&P.instanceColor&&(j=P.instanceColor));const at={};at.attribute=j,j&&j.data&&(at.data=j.data),W[nt]=at,Y++}l.attributes=W,l.attributesNum=Y,l.index=q}function x(){const P=l.newAttributes;for(let G=0,V=P.length;G<V;G++)P[G]=0}function v(P){A(P,0)}function A(P,G){const V=l.newAttributes,q=l.enabledAttributes,W=l.attributeDivisors;V[P]=1,q[P]===0&&(i.enableVertexAttribArray(P),q[P]=1),W[P]!==G&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,G),W[P]=G)}function w(){const P=l.newAttributes,G=l.enabledAttributes;for(let V=0,q=G.length;V<q;V++)G[V]!==P[V]&&(i.disableVertexAttribArray(V),G[V]=0)}function R(P,G,V,q,W,X,Y){Y===!0?i.vertexAttribIPointer(P,G,V,W,X):i.vertexAttribPointer(P,G,V,q,W,X)}function U(P,G,V,q){if(n.isWebGL2===!1&&(P.isInstancedMesh||q.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const W=q.attributes,X=V.getAttributes(),Y=G.defaultAttributeValues;for(const tt in X){const nt=X[tt];if(nt.location>=0){let k=W[tt];if(k===void 0&&(tt==="instanceMatrix"&&P.instanceMatrix&&(k=P.instanceMatrix),tt==="instanceColor"&&P.instanceColor&&(k=P.instanceColor)),k!==void 0){const j=k.normalized,at=k.itemSize,gt=e.get(k);if(gt===void 0)continue;const mt=gt.buffer,Ct=gt.type,Dt=gt.bytesPerElement,Et=n.isWebGL2===!0&&(Ct===i.INT||Ct===i.UNSIGNED_INT||k.gpuType===sl);if(k.isInterleavedBufferAttribute){const Yt=k.data,F=Yt.stride,Ae=k.offset;if(Yt.isInstancedInterleavedBuffer){for(let xt=0;xt<nt.locationSize;xt++)A(nt.location+xt,Yt.meshPerAttribute);P.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=Yt.meshPerAttribute*Yt.count)}else for(let xt=0;xt<nt.locationSize;xt++)v(nt.location+xt);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let xt=0;xt<nt.locationSize;xt++)R(nt.location+xt,at/nt.locationSize,Ct,j,F*Dt,(Ae+at/nt.locationSize*xt)*Dt,Et)}else{if(k.isInstancedBufferAttribute){for(let Yt=0;Yt<nt.locationSize;Yt++)A(nt.location+Yt,k.meshPerAttribute);P.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let Yt=0;Yt<nt.locationSize;Yt++)v(nt.location+Yt);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let Yt=0;Yt<nt.locationSize;Yt++)R(nt.location+Yt,at/nt.locationSize,Ct,j,at*Dt,at/nt.locationSize*Yt*Dt,Et)}}else if(Y!==void 0){const j=Y[tt];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(nt.location,j);break;case 3:i.vertexAttrib3fv(nt.location,j);break;case 4:i.vertexAttrib4fv(nt.location,j);break;default:i.vertexAttrib1fv(nt.location,j)}}}}w()}function S(){N();for(const P in a){const G=a[P];for(const V in G){const q=G[V];for(const W in q)g(q[W].object),delete q[W];delete G[V]}delete a[P]}}function y(P){if(a[P.id]===void 0)return;const G=a[P.id];for(const V in G){const q=G[V];for(const W in q)g(q[W].object),delete q[W];delete G[V]}delete a[P.id]}function I(P){for(const G in a){const V=a[G];if(V[P.id]===void 0)continue;const q=V[P.id];for(const W in q)g(q[W].object),delete q[W];delete V[P.id]}}function N(){Z(),h=!0,l!==c&&(l=c,p(l.object))}function Z(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:N,resetDefaultState:Z,dispose:S,releaseStatesOfGeometry:y,releaseStatesOfProgram:I,initAttributes:x,enableAttribute:v,disableUnusedAttributes:w}}function Yp(i,t,e,n){const s=n.isWebGL2;let r;function o(h){r=h}function a(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,f){if(f===0)return;let p,g;if(s)p=i,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,h,u,f),e.update(u,r,f)}function l(h,u,f){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(r,h,0,u,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function jp(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,v=o||t.has("OES_texture_float"),A=x&&v,w=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:M,vertexTextures:x,floatFragmentTextures:v,floatVertexTextures:A,maxSamples:w}}function $p(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Ln,a=new Gt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const M=r?0:n,x=M*4;let v=d.clippingState||null;c.value=v,v=h(g,f,x,p);for(let A=0;A!==x;++A)v[A]=e[A];d.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,p,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const d=p+_*4,M=f.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<d)&&(m=new Float32Array(d));for(let x=0,v=p;x!==_;++x,v+=4)o.copy(u[x]).applyMatrix4(M,a),o.normal.toArray(m,v),m[v+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Kp(i){let t=new WeakMap;function e(o,a){return a===mo?o.mapping=zi:a===go&&(o.mapping=Bi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===mo||a===go)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new cf(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class wl extends bl{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ui=4,fc=[.125,.215,.35,.446,.526,.582],ni=20,Zr=new wl,dc=new kt;let Jr=null,Qr=0,to=0;const ti=(1+Math.sqrt(5))/2,Ci=1/ti,pc=[new L(1,1,1),new L(-1,1,1),new L(1,1,-1),new L(-1,1,-1),new L(0,ti,Ci),new L(0,ti,-Ci),new L(Ci,0,ti),new L(-Ci,0,ti),new L(ti,Ci,0),new L(-ti,Ci,0)];class mc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Jr=this._renderer.getRenderTarget(),Qr=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_c(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Jr,Qr,to),t.scissorTest=!1,ks(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===Bi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Jr=this._renderer.getRenderTarget(),Qr=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ve,minFilter:Ve,generateMipmaps:!1,type:ds,format:tn,colorSpace:En,depthBuffer:!1},s=gc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zp(r)),this._blurMaterial=Jp(r,t,e)}return s}_compileMaterial(t){const e=new se(this._lodPlanes[0],t);this._renderer.compile(e,Zr)}_sceneToCubeUV(t,e,n,s){const a=new We(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(dc),h.toneMapping=Bn,h.autoClear=!1;const p=new oi({name:"PMREM.Background",side:Ne,depthWrite:!1,depthTest:!1}),g=new se(new yn,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(dc),_=!0);for(let d=0;d<6;d++){const M=d%3;M===0?(a.up.set(0,c[d],0),a.lookAt(l[d],0,0)):M===1?(a.up.set(0,0,c[d]),a.lookAt(0,l[d],0)):(a.up.set(0,c[d],0),a.lookAt(0,0,l[d]));const x=this._cubeSize;ks(s,M*x,d>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===zi||t.mapping===Bi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=xc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_c());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new se(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;ks(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Zr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=pc[(s-1)%pc.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new se(this._lodPlanes[s],l),f=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ni-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):ni;m>ni&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ni}`);const d=[];let M=0;for(let R=0;R<ni;++R){const U=R/_,S=Math.exp(-U*U/2);d.push(S),R===0?M+=S:R<m&&(M+=2*S)}for(let R=0;R<d.length;R++)d[R]=d[R]/M;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=g,f.mipInt.value=x-n;const v=this._sizeLods[s],A=3*v*(s>x-Ui?s-x+Ui:0),w=4*(this._cubeSize-v);ks(e,A,w,3*v,2*v),c.setRenderTarget(e),c.render(u,Zr)}}function Zp(i){const t=[],e=[],n=[];let s=i;const r=i-Ui+1+fc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Ui?c=fc[o-i+Ui-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,d=1,M=new Float32Array(_*g*p),x=new Float32Array(m*g*p),v=new Float32Array(d*g*p);for(let w=0;w<p;w++){const R=w%3*2/3-1,U=w>2?0:-1,S=[R,U,0,R+2/3,U,0,R+2/3,U+1,0,R,U,0,R+2/3,U+1,0,R,U+1,0];M.set(S,_*g*w),x.set(f,m*g*w);const y=[w,w,w,w,w,w];v.set(y,d*g*w)}const A=new ae;A.setAttribute("position",new de(M,_)),A.setAttribute("uv",new de(x,m)),A.setAttribute("faceIndex",new de(v,d)),t.push(A),s>Ui&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function gc(i,t,e){const n=new ci(i,t,e);return n.texture.mapping=dr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ks(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Jp(i,t,e){const n=new Float32Array(ni),s=new L(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:ni,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ko(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function _c(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ko(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function xc(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ko(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ko(){return`

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
	`}function Qp(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===mo||c===go,h=c===zi||c===Bi;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new mc(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new mc(i));const f=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function tm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function em(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,d=_.length;m<d;m++)t.remove(_[m])}f.removeEventListener("dispose",o),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const _=p[g];for(let m=0,d=_.length;m<d;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(u){const f=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const M=p.array;_=p.version;for(let x=0,v=M.length;x<v;x+=3){const A=M[x+0],w=M[x+1],R=M[x+2];f.push(A,w,w,R,R,A)}}else if(g!==void 0){const M=g.array;_=g.version;for(let x=0,v=M.length/3-1;x<v;x+=3){const A=x+0,w=x+1,R=x+2;f.push(A,w,w,R,R,A)}}else return;const m=new(ml(f)?Sl:Ml)(f,1);m.version=_;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function h(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function nm(i,t,e,n){const s=n.isWebGL2;let r;function o(p){r=p}let a,c;function l(p){a=p.type,c=p.bytesPerElement}function h(p,g){i.drawElements(r,g,a,p*c),e.update(g,r,1)}function u(p,g,_){if(_===0)return;let m,d;if(s)m=i,d="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](r,g,a,p*c,_),e.update(g,r,_)}function f(p,g,_){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<_;d++)this.render(p[d]/c,g[d]);else{m.multiDrawElementsWEBGL(r,g,0,a,p,0,_);let d=0;for(let M=0;M<_;M++)d+=g[M];e.update(d,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function im(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function sm(i,t){return i[0]-t[0]}function rm(i,t){return Math.abs(t[1])-Math.abs(i[1])}function om(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,o=new Se,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){const f=l.morphTargetInfluences;if(t.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let m=r.get(h);if(m===void 0||m.count!==_){let G=function(){Z.dispose(),r.delete(h),h.removeEventListener("dispose",G)};var p=G;m!==void 0&&m.texture.dispose();const x=h.morphAttributes.position!==void 0,v=h.morphAttributes.normal!==void 0,A=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],R=h.morphAttributes.normal||[],U=h.morphAttributes.color||[];let S=0;x===!0&&(S=1),v===!0&&(S=2),A===!0&&(S=3);let y=h.attributes.position.count*S,I=1;y>t.maxTextureSize&&(I=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const N=new Float32Array(y*I*4*_),Z=new xl(N,y,I,_);Z.type=Fn,Z.needsUpdate=!0;const P=S*4;for(let V=0;V<_;V++){const q=w[V],W=R[V],X=U[V],Y=y*I*4*V;for(let tt=0;tt<q.count;tt++){const nt=tt*P;x===!0&&(o.fromBufferAttribute(q,tt),N[Y+nt+0]=o.x,N[Y+nt+1]=o.y,N[Y+nt+2]=o.z,N[Y+nt+3]=0),v===!0&&(o.fromBufferAttribute(W,tt),N[Y+nt+4]=o.x,N[Y+nt+5]=o.y,N[Y+nt+6]=o.z,N[Y+nt+7]=0),A===!0&&(o.fromBufferAttribute(X,tt),N[Y+nt+8]=o.x,N[Y+nt+9]=o.y,N[Y+nt+10]=o.z,N[Y+nt+11]=X.itemSize===4?o.w:1)}}m={count:_,texture:Z,size:new Wt(y,I)},r.set(h,m),h.addEventListener("dispose",G)}let d=0;for(let x=0;x<f.length;x++)d+=f[x];const M=h.morphTargetsRelative?1:1-d;u.getUniforms().setValue(i,"morphTargetBaseInfluence",M),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const g=f===void 0?0:f.length;let _=n[h.id];if(_===void 0||_.length!==g){_=[];for(let v=0;v<g;v++)_[v]=[v,0];n[h.id]=_}for(let v=0;v<g;v++){const A=_[v];A[0]=v,A[1]=f[v]}_.sort(rm);for(let v=0;v<8;v++)v<g&&_[v][1]?(a[v][0]=_[v][0],a[v][1]=_[v][1]):(a[v][0]=Number.MAX_SAFE_INTEGER,a[v][1]=0);a.sort(sm);const m=h.morphAttributes.position,d=h.morphAttributes.normal;let M=0;for(let v=0;v<8;v++){const A=a[v],w=A[0],R=A[1];w!==Number.MAX_SAFE_INTEGER&&R?(m&&h.getAttribute("morphTarget"+v)!==m[w]&&h.setAttribute("morphTarget"+v,m[w]),d&&h.getAttribute("morphNormal"+v)!==d[w]&&h.setAttribute("morphNormal"+v,d[w]),s[v]=R,M+=R):(m&&h.hasAttribute("morphTarget"+v)===!0&&h.deleteAttribute("morphTarget"+v),d&&h.hasAttribute("morphNormal"+v)===!0&&h.deleteAttribute("morphNormal"+v),s[v]=0)}const x=h.morphTargetsRelative?1:1-M;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function am(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class Rl extends Fe{constructor(t,e,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:si,h!==si&&h!==Gi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===si&&(n=Nn),n===void 0&&h===Gi&&(n=ii),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Le,this.minFilter=c!==void 0?c:Le,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Cl=new Fe,Pl=new Rl(1,1);Pl.compareFunction=dl;const Ll=new xl,Dl=new Xu,Ul=new Tl,vc=[],Mc=[],Sc=new Float32Array(16),Ec=new Float32Array(9),yc=new Float32Array(4);function ji(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=vc[s];if(r===void 0&&(r=new Float32Array(s),vc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function gr(i,t){let e=Mc[t];e===void 0&&(e=new Int32Array(t),Mc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function cm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2fv(this.addr,t),ge(e,t)}}function hm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(me(e,t))return;i.uniform3fv(this.addr,t),ge(e,t)}}function um(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4fv(this.addr,t),ge(e,t)}}function fm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;yc.set(n),i.uniformMatrix2fv(this.addr,!1,yc),ge(e,n)}}function dm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Ec.set(n),i.uniformMatrix3fv(this.addr,!1,Ec),ge(e,n)}}function pm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Sc.set(n),i.uniformMatrix4fv(this.addr,!1,Sc),ge(e,n)}}function mm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2iv(this.addr,t),ge(e,t)}}function _m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3iv(this.addr,t),ge(e,t)}}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4iv(this.addr,t),ge(e,t)}}function vm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2uiv(this.addr,t),ge(e,t)}}function Sm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3uiv(this.addr,t),ge(e,t)}}function Em(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4uiv(this.addr,t),ge(e,t)}}function ym(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Pl:Cl;e.setTexture2D(t||r,s)}function bm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Dl,s)}function Tm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ul,s)}function Am(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ll,s)}function wm(i){switch(i){case 5126:return cm;case 35664:return lm;case 35665:return hm;case 35666:return um;case 35674:return fm;case 35675:return dm;case 35676:return pm;case 5124:case 35670:return mm;case 35667:case 35671:return gm;case 35668:case 35672:return _m;case 35669:case 35673:return xm;case 5125:return vm;case 36294:return Mm;case 36295:return Sm;case 36296:return Em;case 35678:case 36198:case 36298:case 36306:case 35682:return ym;case 35679:case 36299:case 36307:return bm;case 35680:case 36300:case 36308:case 36293:return Tm;case 36289:case 36303:case 36311:case 36292:return Am}}function Rm(i,t){i.uniform1fv(this.addr,t)}function Cm(i,t){const e=ji(t,this.size,2);i.uniform2fv(this.addr,e)}function Pm(i,t){const e=ji(t,this.size,3);i.uniform3fv(this.addr,e)}function Lm(i,t){const e=ji(t,this.size,4);i.uniform4fv(this.addr,e)}function Dm(i,t){const e=ji(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Um(i,t){const e=ji(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Im(i,t){const e=ji(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Nm(i,t){i.uniform1iv(this.addr,t)}function Fm(i,t){i.uniform2iv(this.addr,t)}function Om(i,t){i.uniform3iv(this.addr,t)}function zm(i,t){i.uniform4iv(this.addr,t)}function Bm(i,t){i.uniform1uiv(this.addr,t)}function Gm(i,t){i.uniform2uiv(this.addr,t)}function Hm(i,t){i.uniform3uiv(this.addr,t)}function km(i,t){i.uniform4uiv(this.addr,t)}function Vm(i,t,e){const n=this.cache,s=t.length,r=gr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Cl,r[o])}function Wm(i,t,e){const n=this.cache,s=t.length,r=gr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Dl,r[o])}function Xm(i,t,e){const n=this.cache,s=t.length,r=gr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ul,r[o])}function qm(i,t,e){const n=this.cache,s=t.length,r=gr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Ll,r[o])}function Ym(i){switch(i){case 5126:return Rm;case 35664:return Cm;case 35665:return Pm;case 35666:return Lm;case 35674:return Dm;case 35675:return Um;case 35676:return Im;case 5124:case 35670:return Nm;case 35667:case 35671:return Fm;case 35668:case 35672:return Om;case 35669:case 35673:return zm;case 5125:return Bm;case 36294:return Gm;case 36295:return Hm;case 36296:return km;case 35678:case 36198:case 36298:case 36306:case 35682:return Vm;case 35679:case 36299:case 36307:return Wm;case 35680:case 36300:case 36308:case 36293:return Xm;case 36289:case 36303:case 36311:case 36292:return qm}}class jm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=wm(e.type)}}class $m{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ym(e.type)}}class Km{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const eo=/(\w+)(\])?(\[|\.)?/g;function bc(i,t){i.seq.push(t),i.map[t.id]=t}function Zm(i,t,e){const n=i.name,s=n.length;for(eo.lastIndex=0;;){const r=eo.exec(n),o=eo.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){bc(e,l===void 0?new jm(a,i,t):new $m(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Km(a),bc(e,u)),e=u}}}class js{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Zm(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Tc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Jm=37297;let Qm=0;function tg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function eg(i){const t=Jt.getPrimaries(Jt.workingColorSpace),e=Jt.getPrimaries(i);let n;switch(t===e?n="":t===er&&e===tr?n="LinearDisplayP3ToLinearSRGB":t===tr&&e===er&&(n="LinearSRGBToLinearDisplayP3"),i){case En:case pr:return[n,"LinearTransferOETF"];case fe:case Oo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Ac(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+tg(i.getShaderSource(t),o)}else return s}function ng(i,t){const e=eg(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function ig(i,t){let e;switch(t){case pu:e="Linear";break;case mu:e="Reinhard";break;case gu:e="OptimizedCineon";break;case _u:e="ACESFilmic";break;case vu:e="AgX";break;case xu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function sg(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ii).join(`
`)}function rg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ii).join(`
`)}function og(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ag(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ii(i){return i!==""}function wc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Rc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const cg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Eo(i){return i.replace(cg,hg)}const lg=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function hg(i,t){let e=It[t];if(e===void 0){const n=lg.get(t);if(n!==void 0)e=It[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Eo(e)}const ug=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Cc(i){return i.replace(ug,fg)}function fg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Pc(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function dg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===el?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===nl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===_n&&(t="SHADOWMAP_TYPE_VSM"),t}function pg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zi:case Bi:t="ENVMAP_TYPE_CUBE";break;case dr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function mg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Bi:t="ENVMAP_MODE_REFRACTION";break}return t}function gg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case No:t="ENVMAP_BLENDING_MULTIPLY";break;case fu:t="ENVMAP_BLENDING_MIX";break;case du:t="ENVMAP_BLENDING_ADD";break}return t}function _g(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function xg(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=dg(e),l=pg(e),h=mg(e),u=gg(e),f=_g(e),p=e.isWebGL2?"":sg(e),g=rg(e),_=og(r),m=s.createProgram();let d,M,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Ii).join(`
`),d.length>0&&(d+=`
`),M=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Ii).join(`
`),M.length>0&&(M+=`
`)):(d=[Pc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ii).join(`
`),M=[p,Pc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Bn?"#define TONE_MAPPING":"",e.toneMapping!==Bn?It.tonemapping_pars_fragment:"",e.toneMapping!==Bn?ig("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",It.colorspace_pars_fragment,ng("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ii).join(`
`)),o=Eo(o),o=wc(o,e),o=Rc(o,e),a=Eo(a),a=wc(a,e),a=Rc(a,e),o=Cc(o),a=Cc(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,M=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===ja?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ja?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);const v=x+d+o,A=x+M+a,w=Tc(s,s.VERTEX_SHADER,v),R=Tc(s,s.FRAGMENT_SHADER,A);s.attachShader(m,w),s.attachShader(m,R),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function U(N){if(i.debug.checkShaderErrors){const Z=s.getProgramInfoLog(m).trim(),P=s.getShaderInfoLog(w).trim(),G=s.getShaderInfoLog(R).trim();let V=!0,q=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,w,R);else{const W=Ac(s,w,"vertex"),X=Ac(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+Z+`
`+W+`
`+X)}else Z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Z):(P===""||G==="")&&(q=!1);q&&(N.diagnostics={runnable:V,programLog:Z,vertexShader:{log:P,prefix:d},fragmentShader:{log:G,prefix:M}})}s.deleteShader(w),s.deleteShader(R),S=new js(s,m),y=ag(s,m)}let S;this.getUniforms=function(){return S===void 0&&U(this),S};let y;this.getAttributes=function(){return y===void 0&&U(this),y};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(m,Jm)),I},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Qm++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=w,this.fragmentShader=R,this}let vg=0;class Mg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Sg(t),e.set(t,n)),n}}class Sg{constructor(t){this.id=vg++,this.code=t,this.usedTimes=0}}function Eg(i,t,e,n,s,r,o){const a=new Bo,c=new Mg,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return S===0?"uv":`uv${S}`}function m(S,y,I,N,Z){const P=N.fog,G=Z.geometry,V=S.isMeshStandardMaterial?N.environment:null,q=(S.isMeshStandardMaterial?e:t).get(S.envMap||V),W=q&&q.mapping===dr?q.image.height:null,X=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const Y=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,tt=Y!==void 0?Y.length:0;let nt=0;G.morphAttributes.position!==void 0&&(nt=1),G.morphAttributes.normal!==void 0&&(nt=2),G.morphAttributes.color!==void 0&&(nt=3);let k,j,at,gt;if(X){const we=rn[X];k=we.vertexShader,j=we.fragmentShader}else k=S.vertexShader,j=S.fragmentShader,c.update(S),at=c.getVertexShaderID(S),gt=c.getFragmentShaderID(S);const mt=i.getRenderTarget(),Ct=Z.isInstancedMesh===!0,Dt=Z.isBatchedMesh===!0,Et=!!S.map,Yt=!!S.matcap,F=!!q,Ae=!!S.aoMap,xt=!!S.lightMap,wt=!!S.bumpMap,ft=!!S.normalMap,re=!!S.displacementMap,Nt=!!S.emissiveMap,T=!!S.metalnessMap,E=!!S.roughnessMap,z=S.anisotropy>0,J=S.clearcoat>0,K=S.iridescence>0,Q=S.sheen>0,dt=S.transmission>0,ot=z&&!!S.anisotropyMap,ht=J&&!!S.clearcoatMap,St=J&&!!S.clearcoatNormalMap,Ft=J&&!!S.clearcoatRoughnessMap,$=K&&!!S.iridescenceMap,Zt=K&&!!S.iridescenceThicknessMap,Ht=Q&&!!S.sheenColorMap,At=Q&&!!S.sheenRoughnessMap,_t=!!S.specularMap,ut=!!S.specularColorMap,Ut=!!S.specularIntensityMap,Kt=dt&&!!S.transmissionMap,ce=dt&&!!S.thicknessMap,zt=!!S.gradientMap,it=!!S.alphaMap,C=S.alphaTest>0,st=!!S.alphaHash,rt=!!S.extensions,yt=!!G.attributes.uv1,vt=!!G.attributes.uv2,Qt=!!G.attributes.uv3;let te=Bn;return S.toneMapped&&(mt===null||mt.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:h,shaderID:X,shaderType:S.type,shaderName:S.name,vertexShader:k,fragmentShader:j,defines:S.defines,customVertexShaderID:at,customFragmentShaderID:gt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Dt,instancing:Ct,instancingColor:Ct&&Z.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:mt===null?i.outputColorSpace:mt.isXRRenderTarget===!0?mt.texture.colorSpace:En,map:Et,matcap:Yt,envMap:F,envMapMode:F&&q.mapping,envMapCubeUVHeight:W,aoMap:Ae,lightMap:xt,bumpMap:wt,normalMap:ft,displacementMap:f&&re,emissiveMap:Nt,normalMapObjectSpace:ft&&S.normalMapType===Lu,normalMapTangentSpace:ft&&S.normalMapType===fl,metalnessMap:T,roughnessMap:E,anisotropy:z,anisotropyMap:ot,clearcoat:J,clearcoatMap:ht,clearcoatNormalMap:St,clearcoatRoughnessMap:Ft,iridescence:K,iridescenceMap:$,iridescenceThicknessMap:Zt,sheen:Q,sheenColorMap:Ht,sheenRoughnessMap:At,specularMap:_t,specularColorMap:ut,specularIntensityMap:Ut,transmission:dt,transmissionMap:Kt,thicknessMap:ce,gradientMap:zt,opaque:S.transparent===!1&&S.blending===Ni,alphaMap:it,alphaTest:C,alphaHash:st,combine:S.combine,mapUv:Et&&_(S.map.channel),aoMapUv:Ae&&_(S.aoMap.channel),lightMapUv:xt&&_(S.lightMap.channel),bumpMapUv:wt&&_(S.bumpMap.channel),normalMapUv:ft&&_(S.normalMap.channel),displacementMapUv:re&&_(S.displacementMap.channel),emissiveMapUv:Nt&&_(S.emissiveMap.channel),metalnessMapUv:T&&_(S.metalnessMap.channel),roughnessMapUv:E&&_(S.roughnessMap.channel),anisotropyMapUv:ot&&_(S.anisotropyMap.channel),clearcoatMapUv:ht&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:St&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ft&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Zt&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ht&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:At&&_(S.sheenRoughnessMap.channel),specularMapUv:_t&&_(S.specularMap.channel),specularColorMapUv:ut&&_(S.specularColorMap.channel),specularIntensityMapUv:Ut&&_(S.specularIntensityMap.channel),transmissionMapUv:Kt&&_(S.transmissionMap.channel),thicknessMapUv:ce&&_(S.thicknessMap.channel),alphaMapUv:it&&_(S.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(ft||z),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,vertexUv1s:yt,vertexUv2s:vt,vertexUv3s:Qt,pointsUvs:Z.isPoints===!0&&!!G.attributes.uv&&(Et||it),fog:!!P,useFog:S.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:Z.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:nt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Et&&S.map.isVideoTexture===!0&&Jt.getTransfer(S.map.colorSpace)===ne,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Je,flipSided:S.side===Ne,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:rt&&S.extensions.derivatives===!0,extensionFragDepth:rt&&S.extensions.fragDepth===!0,extensionDrawBuffers:rt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:rt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:rt&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function d(S){const y=[];if(S.shaderID?y.push(S.shaderID):(y.push(S.customVertexShaderID),y.push(S.customFragmentShaderID)),S.defines!==void 0)for(const I in S.defines)y.push(I),y.push(S.defines[I]);return S.isRawShaderMaterial===!1&&(M(y,S),x(y,S),y.push(i.outputColorSpace)),y.push(S.customProgramCacheKey),y.join()}function M(S,y){S.push(y.precision),S.push(y.outputColorSpace),S.push(y.envMapMode),S.push(y.envMapCubeUVHeight),S.push(y.mapUv),S.push(y.alphaMapUv),S.push(y.lightMapUv),S.push(y.aoMapUv),S.push(y.bumpMapUv),S.push(y.normalMapUv),S.push(y.displacementMapUv),S.push(y.emissiveMapUv),S.push(y.metalnessMapUv),S.push(y.roughnessMapUv),S.push(y.anisotropyMapUv),S.push(y.clearcoatMapUv),S.push(y.clearcoatNormalMapUv),S.push(y.clearcoatRoughnessMapUv),S.push(y.iridescenceMapUv),S.push(y.iridescenceThicknessMapUv),S.push(y.sheenColorMapUv),S.push(y.sheenRoughnessMapUv),S.push(y.specularMapUv),S.push(y.specularColorMapUv),S.push(y.specularIntensityMapUv),S.push(y.transmissionMapUv),S.push(y.thicknessMapUv),S.push(y.combine),S.push(y.fogExp2),S.push(y.sizeAttenuation),S.push(y.morphTargetsCount),S.push(y.morphAttributeCount),S.push(y.numDirLights),S.push(y.numPointLights),S.push(y.numSpotLights),S.push(y.numSpotLightMaps),S.push(y.numHemiLights),S.push(y.numRectAreaLights),S.push(y.numDirLightShadows),S.push(y.numPointLightShadows),S.push(y.numSpotLightShadows),S.push(y.numSpotLightShadowsWithMaps),S.push(y.numLightProbes),S.push(y.shadowMapType),S.push(y.toneMapping),S.push(y.numClippingPlanes),S.push(y.numClipIntersection),S.push(y.depthPacking)}function x(S,y){a.disableAll(),y.isWebGL2&&a.enable(0),y.supportsVertexTextures&&a.enable(1),y.instancing&&a.enable(2),y.instancingColor&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),S.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.useLegacyLights&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function v(S){const y=g[S.type];let I;if(y){const N=rn[y];I=yl.clone(N.uniforms)}else I=S.uniforms;return I}function A(S,y){let I;for(let N=0,Z=l.length;N<Z;N++){const P=l[N];if(P.cacheKey===y){I=P,++I.usedTimes;break}}return I===void 0&&(I=new xg(i,y,S,r),l.push(I)),I}function w(S){if(--S.usedTimes===0){const y=l.indexOf(S);l[y]=l[l.length-1],l.pop(),S.destroy()}}function R(S){c.remove(S)}function U(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:v,acquireProgram:A,releaseProgram:w,releaseShaderCache:R,programs:l,dispose:U}}function yg(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function bg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Lc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Dc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,p,g,_,m){let d=i[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),t++,d}function a(u,f,p,g,_,m){const d=o(u,f,p,g,_,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(u,f,p,g,_,m){const d=o(u,f,p,g,_,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function l(u,f){e.length>1&&e.sort(u||bg),n.length>1&&n.sort(f||Lc),s.length>1&&s.sort(f||Lc)}function h(){for(let u=t,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Tg(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Dc,i.set(n,[o])):s>=r.length?(o=new Dc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Ag(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new kt};break;case"SpotLight":e={position:new L,direction:new L,color:new kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new kt,groundColor:new kt};break;case"RectAreaLight":e={color:new kt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function wg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Rg=0;function Cg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Pg(i,t){const e=new Ag,n=wg(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new L);const r=new L,o=new ie,a=new ie;function c(h,u){let f=0,p=0,g=0;for(let N=0;N<9;N++)s.probe[N].set(0,0,0);let _=0,m=0,d=0,M=0,x=0,v=0,A=0,w=0,R=0,U=0,S=0;h.sort(Cg);const y=u===!0?Math.PI:1;for(let N=0,Z=h.length;N<Z;N++){const P=h[N],G=P.color,V=P.intensity,q=P.distance,W=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)f+=G.r*V*y,p+=G.g*V*y,g+=G.b*V*y;else if(P.isLightProbe){for(let X=0;X<9;X++)s.probe[X].addScaledVector(P.sh.coefficients[X],V);S++}else if(P.isDirectionalLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity*y),P.castShadow){const Y=P.shadow,tt=n.get(P);tt.shadowBias=Y.bias,tt.shadowNormalBias=Y.normalBias,tt.shadowRadius=Y.radius,tt.shadowMapSize=Y.mapSize,s.directionalShadow[_]=tt,s.directionalShadowMap[_]=W,s.directionalShadowMatrix[_]=P.shadow.matrix,v++}s.directional[_]=X,_++}else if(P.isSpotLight){const X=e.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(G).multiplyScalar(V*y),X.distance=q,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,s.spot[d]=X;const Y=P.shadow;if(P.map&&(s.spotLightMap[R]=P.map,R++,Y.updateMatrices(P),P.castShadow&&U++),s.spotLightMatrix[d]=Y.matrix,P.castShadow){const tt=n.get(P);tt.shadowBias=Y.bias,tt.shadowNormalBias=Y.normalBias,tt.shadowRadius=Y.radius,tt.shadowMapSize=Y.mapSize,s.spotShadow[d]=tt,s.spotShadowMap[d]=W,w++}d++}else if(P.isRectAreaLight){const X=e.get(P);X.color.copy(G).multiplyScalar(V),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),s.rectArea[M]=X,M++}else if(P.isPointLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity*y),X.distance=P.distance,X.decay=P.decay,P.castShadow){const Y=P.shadow,tt=n.get(P);tt.shadowBias=Y.bias,tt.shadowNormalBias=Y.normalBias,tt.shadowRadius=Y.radius,tt.shadowMapSize=Y.mapSize,tt.shadowCameraNear=Y.camera.near,tt.shadowCameraFar=Y.camera.far,s.pointShadow[m]=tt,s.pointShadowMap[m]=W,s.pointShadowMatrix[m]=P.shadow.matrix,A++}s.point[m]=X,m++}else if(P.isHemisphereLight){const X=e.get(P);X.skyColor.copy(P.color).multiplyScalar(V*y),X.groundColor.copy(P.groundColor).multiplyScalar(V*y),s.hemi[x]=X,x++}}M>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=et.LTC_FLOAT_1,s.rectAreaLTC2=et.LTC_FLOAT_2):(s.rectAreaLTC1=et.LTC_HALF_1,s.rectAreaLTC2=et.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=et.LTC_FLOAT_1,s.rectAreaLTC2=et.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=et.LTC_HALF_1,s.rectAreaLTC2=et.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=p,s.ambient[2]=g;const I=s.hash;(I.directionalLength!==_||I.pointLength!==m||I.spotLength!==d||I.rectAreaLength!==M||I.hemiLength!==x||I.numDirectionalShadows!==v||I.numPointShadows!==A||I.numSpotShadows!==w||I.numSpotMaps!==R||I.numLightProbes!==S)&&(s.directional.length=_,s.spot.length=d,s.rectArea.length=M,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=v,s.directionalShadowMap.length=v,s.pointShadow.length=A,s.pointShadowMap.length=A,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=v,s.pointShadowMatrix.length=A,s.spotLightMatrix.length=w+R-U,s.spotLightMap.length=R,s.numSpotLightShadowsWithMaps=U,s.numLightProbes=S,I.directionalLength=_,I.pointLength=m,I.spotLength=d,I.rectAreaLength=M,I.hemiLength=x,I.numDirectionalShadows=v,I.numPointShadows=A,I.numSpotShadows=w,I.numSpotMaps=R,I.numLightProbes=S,s.version=Rg++)}function l(h,u){let f=0,p=0,g=0,_=0,m=0;const d=u.matrixWorldInverse;for(let M=0,x=h.length;M<x;M++){const v=h[M];if(v.isDirectionalLight){const A=s.directional[f];A.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(d),f++}else if(v.isSpotLight){const A=s.spot[g];A.position.setFromMatrixPosition(v.matrixWorld),A.position.applyMatrix4(d),A.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(d),g++}else if(v.isRectAreaLight){const A=s.rectArea[_];A.position.setFromMatrixPosition(v.matrixWorld),A.position.applyMatrix4(d),a.identity(),o.copy(v.matrixWorld),o.premultiply(d),a.extractRotation(o),A.halfWidth.set(v.width*.5,0,0),A.halfHeight.set(0,v.height*.5,0),A.halfWidth.applyMatrix4(a),A.halfHeight.applyMatrix4(a),_++}else if(v.isPointLight){const A=s.point[p];A.position.setFromMatrixPosition(v.matrixWorld),A.position.applyMatrix4(d),p++}else if(v.isHemisphereLight){const A=s.hemi[m];A.direction.setFromMatrixPosition(v.matrixWorld),A.direction.transformDirection(d),m++}}}return{setup:c,setupView:l,state:s}}function Uc(i,t){const e=new Pg(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function Lg(i,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let c;return a===void 0?(c=new Uc(i,t),e.set(r,[c])):o>=a.length?(c=new Uc(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class Dg extends Yi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Cu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ug extends Yi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Ig=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ng=`uniform sampler2D shadow_pass;
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
}`;function Fg(i,t,e){let n=new Go;const s=new Wt,r=new Wt,o=new Se,a=new Dg({depthPacking:Pu}),c=new Ug,l={},h=e.maxTextureSize,u={[Sn]:Ne,[Ne]:Sn,[Je]:Je},f=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:Ig,fragmentShader:Ng}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new ae;g.setAttribute("position",new de(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new se(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=el;let d=this.type;this.render=function(w,R,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const S=i.getRenderTarget(),y=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),N=i.state;N.setBlending(zn),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const Z=d!==_n&&this.type===_n,P=d===_n&&this.type!==_n;for(let G=0,V=w.length;G<V;G++){const q=w[G],W=q.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const X=W.getFrameExtents();if(s.multiply(X),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/X.x),s.x=r.x*X.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/X.y),s.y=r.y*X.y,W.mapSize.y=r.y)),W.map===null||Z===!0||P===!0){const tt=this.type!==_n?{minFilter:Le,magFilter:Le}:{};W.map!==null&&W.map.dispose(),W.map=new ci(s.x,s.y,tt),W.map.texture.name=q.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const Y=W.getViewportCount();for(let tt=0;tt<Y;tt++){const nt=W.getViewport(tt);o.set(r.x*nt.x,r.y*nt.y,r.x*nt.z,r.y*nt.w),N.viewport(o),W.updateMatrices(q,tt),n=W.getFrustum(),v(R,U,W.camera,q,this.type)}W.isPointLightShadow!==!0&&this.type===_n&&M(W,U),W.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(S,y,I)};function M(w,R){const U=t.update(_);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ci(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(R,null,U,f,_,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(R,null,U,p,_,null)}function x(w,R,U,S){let y=null;const I=U.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)y=I;else if(y=U.isPointLight===!0?c:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const N=y.uuid,Z=R.uuid;let P=l[N];P===void 0&&(P={},l[N]=P);let G=P[Z];G===void 0&&(G=y.clone(),P[Z]=G,R.addEventListener("dispose",A)),y=G}if(y.visible=R.visible,y.wireframe=R.wireframe,S===_n?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:u[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,U.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const N=i.properties.get(y);N.light=U}return y}function v(w,R,U,S,y){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===_n)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,w.matrixWorld);const Z=t.update(w),P=w.material;if(Array.isArray(P)){const G=Z.groups;for(let V=0,q=G.length;V<q;V++){const W=G[V],X=P[W.materialIndex];if(X&&X.visible){const Y=x(w,X,S,y);w.onBeforeShadow(i,w,R,U,Z,Y,W),i.renderBufferDirect(U,null,Z,Y,w,W),w.onAfterShadow(i,w,R,U,Z,Y,W)}}}else if(P.visible){const G=x(w,P,S,y);w.onBeforeShadow(i,w,R,U,Z,G,null),i.renderBufferDirect(U,null,Z,G,w,null),w.onAfterShadow(i,w,R,U,Z,G,null)}}const N=w.children;for(let Z=0,P=N.length;Z<P;Z++)v(N[Z],R,U,S,y)}function A(w){w.target.removeEventListener("dispose",A);for(const U in l){const S=l[U],y=w.target.uuid;y in S&&(S[y].dispose(),delete S[y])}}}function Og(i,t,e){const n=e.isWebGL2;function s(){let C=!1;const st=new Se;let rt=null;const yt=new Se(0,0,0,0);return{setMask:function(vt){rt!==vt&&!C&&(i.colorMask(vt,vt,vt,vt),rt=vt)},setLocked:function(vt){C=vt},setClear:function(vt,Qt,te,_e,we){we===!0&&(vt*=_e,Qt*=_e,te*=_e),st.set(vt,Qt,te,_e),yt.equals(st)===!1&&(i.clearColor(vt,Qt,te,_e),yt.copy(st))},reset:function(){C=!1,rt=null,yt.set(-1,0,0,0)}}}function r(){let C=!1,st=null,rt=null,yt=null;return{setTest:function(vt){vt?Dt(i.DEPTH_TEST):Et(i.DEPTH_TEST)},setMask:function(vt){st!==vt&&!C&&(i.depthMask(vt),st=vt)},setFunc:function(vt){if(rt!==vt){switch(vt){case ru:i.depthFunc(i.NEVER);break;case ou:i.depthFunc(i.ALWAYS);break;case au:i.depthFunc(i.LESS);break;case Js:i.depthFunc(i.LEQUAL);break;case cu:i.depthFunc(i.EQUAL);break;case lu:i.depthFunc(i.GEQUAL);break;case hu:i.depthFunc(i.GREATER);break;case uu:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}rt=vt}},setLocked:function(vt){C=vt},setClear:function(vt){yt!==vt&&(i.clearDepth(vt),yt=vt)},reset:function(){C=!1,st=null,rt=null,yt=null}}}function o(){let C=!1,st=null,rt=null,yt=null,vt=null,Qt=null,te=null,_e=null,we=null;return{setTest:function(ee){C||(ee?Dt(i.STENCIL_TEST):Et(i.STENCIL_TEST))},setMask:function(ee){st!==ee&&!C&&(i.stencilMask(ee),st=ee)},setFunc:function(ee,Re,sn){(rt!==ee||yt!==Re||vt!==sn)&&(i.stencilFunc(ee,Re,sn),rt=ee,yt=Re,vt=sn)},setOp:function(ee,Re,sn){(Qt!==ee||te!==Re||_e!==sn)&&(i.stencilOp(ee,Re,sn),Qt=ee,te=Re,_e=sn)},setLocked:function(ee){C=ee},setClear:function(ee){we!==ee&&(i.clearStencil(ee),we=ee)},reset:function(){C=!1,st=null,rt=null,yt=null,vt=null,Qt=null,te=null,_e=null,we=null}}}const a=new s,c=new r,l=new o,h=new WeakMap,u=new WeakMap;let f={},p={},g=new WeakMap,_=[],m=null,d=!1,M=null,x=null,v=null,A=null,w=null,R=null,U=null,S=new kt(0,0,0),y=0,I=!1,N=null,Z=null,P=null,G=null,V=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,X=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(Y)[1]),W=X>=1):Y.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),W=X>=2);let tt=null,nt={};const k=i.getParameter(i.SCISSOR_BOX),j=i.getParameter(i.VIEWPORT),at=new Se().fromArray(k),gt=new Se().fromArray(j);function mt(C,st,rt,yt){const vt=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(C,Qt),i.texParameteri(C,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(C,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<rt;te++)n&&(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)?i.texImage3D(st,0,i.RGBA,1,1,yt,0,i.RGBA,i.UNSIGNED_BYTE,vt):i.texImage2D(st+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,vt);return Qt}const Ct={};Ct[i.TEXTURE_2D]=mt(i.TEXTURE_2D,i.TEXTURE_2D,1),Ct[i.TEXTURE_CUBE_MAP]=mt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ct[i.TEXTURE_2D_ARRAY]=mt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ct[i.TEXTURE_3D]=mt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Dt(i.DEPTH_TEST),c.setFunc(Js),Nt(!1),T(ma),Dt(i.CULL_FACE),ft(zn);function Dt(C){f[C]!==!0&&(i.enable(C),f[C]=!0)}function Et(C){f[C]!==!1&&(i.disable(C),f[C]=!1)}function Yt(C,st){return p[C]!==st?(i.bindFramebuffer(C,st),p[C]=st,n&&(C===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=st),C===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=st)),!0):!1}function F(C,st){let rt=_,yt=!1;if(C)if(rt=g.get(st),rt===void 0&&(rt=[],g.set(st,rt)),C.isWebGLMultipleRenderTargets){const vt=C.texture;if(rt.length!==vt.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=vt.length;Qt<te;Qt++)rt[Qt]=i.COLOR_ATTACHMENT0+Qt;rt.length=vt.length,yt=!0}}else rt[0]!==i.COLOR_ATTACHMENT0&&(rt[0]=i.COLOR_ATTACHMENT0,yt=!0);else rt[0]!==i.BACK&&(rt[0]=i.BACK,yt=!0);yt&&(e.isWebGL2?i.drawBuffers(rt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(rt))}function Ae(C){return m!==C?(i.useProgram(C),m=C,!0):!1}const xt={[ei]:i.FUNC_ADD,[Wh]:i.FUNC_SUBTRACT,[Xh]:i.FUNC_REVERSE_SUBTRACT};if(n)xt[xa]=i.MIN,xt[va]=i.MAX;else{const C=t.get("EXT_blend_minmax");C!==null&&(xt[xa]=C.MIN_EXT,xt[va]=C.MAX_EXT)}const wt={[qh]:i.ZERO,[Yh]:i.ONE,[jh]:i.SRC_COLOR,[fo]:i.SRC_ALPHA,[tu]:i.SRC_ALPHA_SATURATE,[Jh]:i.DST_COLOR,[Kh]:i.DST_ALPHA,[$h]:i.ONE_MINUS_SRC_COLOR,[po]:i.ONE_MINUS_SRC_ALPHA,[Qh]:i.ONE_MINUS_DST_COLOR,[Zh]:i.ONE_MINUS_DST_ALPHA,[eu]:i.CONSTANT_COLOR,[nu]:i.ONE_MINUS_CONSTANT_COLOR,[iu]:i.CONSTANT_ALPHA,[su]:i.ONE_MINUS_CONSTANT_ALPHA};function ft(C,st,rt,yt,vt,Qt,te,_e,we,ee){if(C===zn){d===!0&&(Et(i.BLEND),d=!1);return}if(d===!1&&(Dt(i.BLEND),d=!0),C!==Vh){if(C!==M||ee!==I){if((x!==ei||w!==ei)&&(i.blendEquation(i.FUNC_ADD),x=ei,w=ei),ee)switch(C){case Ni:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case us:i.blendFunc(i.ONE,i.ONE);break;case ga:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _a:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case Ni:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case us:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ga:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _a:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}v=null,A=null,R=null,U=null,S.set(0,0,0),y=0,M=C,I=ee}return}vt=vt||st,Qt=Qt||rt,te=te||yt,(st!==x||vt!==w)&&(i.blendEquationSeparate(xt[st],xt[vt]),x=st,w=vt),(rt!==v||yt!==A||Qt!==R||te!==U)&&(i.blendFuncSeparate(wt[rt],wt[yt],wt[Qt],wt[te]),v=rt,A=yt,R=Qt,U=te),(_e.equals(S)===!1||we!==y)&&(i.blendColor(_e.r,_e.g,_e.b,we),S.copy(_e),y=we),M=C,I=!1}function re(C,st){C.side===Je?Et(i.CULL_FACE):Dt(i.CULL_FACE);let rt=C.side===Ne;st&&(rt=!rt),Nt(rt),C.blending===Ni&&C.transparent===!1?ft(zn):ft(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),c.setFunc(C.depthFunc),c.setTest(C.depthTest),c.setMask(C.depthWrite),a.setMask(C.colorWrite);const yt=C.stencilWrite;l.setTest(yt),yt&&(l.setMask(C.stencilWriteMask),l.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),l.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),z(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?Dt(i.SAMPLE_ALPHA_TO_COVERAGE):Et(i.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(C){N!==C&&(C?i.frontFace(i.CW):i.frontFace(i.CCW),N=C)}function T(C){C!==Hh?(Dt(i.CULL_FACE),C!==Z&&(C===ma?i.cullFace(i.BACK):C===kh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Et(i.CULL_FACE),Z=C}function E(C){C!==P&&(W&&i.lineWidth(C),P=C)}function z(C,st,rt){C?(Dt(i.POLYGON_OFFSET_FILL),(G!==st||V!==rt)&&(i.polygonOffset(st,rt),G=st,V=rt)):Et(i.POLYGON_OFFSET_FILL)}function J(C){C?Dt(i.SCISSOR_TEST):Et(i.SCISSOR_TEST)}function K(C){C===void 0&&(C=i.TEXTURE0+q-1),tt!==C&&(i.activeTexture(C),tt=C)}function Q(C,st,rt){rt===void 0&&(tt===null?rt=i.TEXTURE0+q-1:rt=tt);let yt=nt[rt];yt===void 0&&(yt={type:void 0,texture:void 0},nt[rt]=yt),(yt.type!==C||yt.texture!==st)&&(tt!==rt&&(i.activeTexture(rt),tt=rt),i.bindTexture(C,st||Ct[C]),yt.type=C,yt.texture=st)}function dt(){const C=nt[tt];C!==void 0&&C.type!==void 0&&(i.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function ot(){try{i.compressedTexImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ht(){try{i.compressedTexImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function St(){try{i.texSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ft(){try{i.texSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function $(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Zt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ht(){try{i.texStorage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function At(){try{i.texStorage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function _t(){try{i.texImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ut(){try{i.texImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ut(C){at.equals(C)===!1&&(i.scissor(C.x,C.y,C.z,C.w),at.copy(C))}function Kt(C){gt.equals(C)===!1&&(i.viewport(C.x,C.y,C.z,C.w),gt.copy(C))}function ce(C,st){let rt=u.get(st);rt===void 0&&(rt=new WeakMap,u.set(st,rt));let yt=rt.get(C);yt===void 0&&(yt=i.getUniformBlockIndex(st,C.name),rt.set(C,yt))}function zt(C,st){const yt=u.get(st).get(C);h.get(st)!==yt&&(i.uniformBlockBinding(st,yt,C.__bindingPointIndex),h.set(st,yt))}function it(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},tt=null,nt={},p={},g=new WeakMap,_=[],m=null,d=!1,M=null,x=null,v=null,A=null,w=null,R=null,U=null,S=new kt(0,0,0),y=0,I=!1,N=null,Z=null,P=null,G=null,V=null,at.set(0,0,i.canvas.width,i.canvas.height),gt.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:Dt,disable:Et,bindFramebuffer:Yt,drawBuffers:F,useProgram:Ae,setBlending:ft,setMaterial:re,setFlipSided:Nt,setCullFace:T,setLineWidth:E,setPolygonOffset:z,setScissorTest:J,activeTexture:K,bindTexture:Q,unbindTexture:dt,compressedTexImage2D:ot,compressedTexImage3D:ht,texImage2D:_t,texImage3D:ut,updateUBOMapping:ce,uniformBlockBinding:zt,texStorage2D:Ht,texStorage3D:At,texSubImage2D:St,texSubImage3D:Ft,compressedTexSubImage2D:$,compressedTexSubImage3D:Zt,scissor:Ut,viewport:Kt,reset:it}}function zg(i,t,e,n,s,r,o){const a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,E){return p?new OffscreenCanvas(T,E):ir("canvas")}function _(T,E,z,J){let K=1;if((T.width>J||T.height>J)&&(K=J/Math.max(T.width,T.height)),K<1||E===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){const Q=E?So:Math.floor,dt=Q(K*T.width),ot=Q(K*T.height);u===void 0&&(u=g(dt,ot));const ht=z?g(dt,ot):u;return ht.width=dt,ht.height=ot,ht.getContext("2d").drawImage(T,0,0,dt,ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+dt+"x"+ot+")."),ht}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function m(T){return $a(T.width)&&$a(T.height)}function d(T){return a?!1:T.wrapS!==Qe||T.wrapT!==Qe||T.minFilter!==Le&&T.minFilter!==Ve}function M(T,E){return T.generateMipmaps&&E&&T.minFilter!==Le&&T.minFilter!==Ve}function x(T){i.generateMipmap(T)}function v(T,E,z,J,K=!1){if(a===!1)return E;if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Q=E;if(E===i.RED&&(z===i.FLOAT&&(Q=i.R32F),z===i.HALF_FLOAT&&(Q=i.R16F),z===i.UNSIGNED_BYTE&&(Q=i.R8)),E===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(Q=i.R8UI),z===i.UNSIGNED_SHORT&&(Q=i.R16UI),z===i.UNSIGNED_INT&&(Q=i.R32UI),z===i.BYTE&&(Q=i.R8I),z===i.SHORT&&(Q=i.R16I),z===i.INT&&(Q=i.R32I)),E===i.RG&&(z===i.FLOAT&&(Q=i.RG32F),z===i.HALF_FLOAT&&(Q=i.RG16F),z===i.UNSIGNED_BYTE&&(Q=i.RG8)),E===i.RGBA){const dt=K?Qs:Jt.getTransfer(J);z===i.FLOAT&&(Q=i.RGBA32F),z===i.HALF_FLOAT&&(Q=i.RGBA16F),z===i.UNSIGNED_BYTE&&(Q=dt===ne?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function A(T,E,z){return M(T,z)===!0||T.isFramebufferTexture&&T.minFilter!==Le&&T.minFilter!==Ve?Math.log2(Math.max(E.width,E.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?E.mipmaps.length:1}function w(T){return T===Le||T===Ma||T===Ar?i.NEAREST:i.LINEAR}function R(T){const E=T.target;E.removeEventListener("dispose",R),S(E),E.isVideoTexture&&h.delete(E)}function U(T){const E=T.target;E.removeEventListener("dispose",U),I(E)}function S(T){const E=n.get(T);if(E.__webglInit===void 0)return;const z=T.source,J=f.get(z);if(J){const K=J[E.__cacheKey];K.usedTimes--,K.usedTimes===0&&y(T),Object.keys(J).length===0&&f.delete(z)}n.remove(T)}function y(T){const E=n.get(T);i.deleteTexture(E.__webglTexture);const z=T.source,J=f.get(z);delete J[E.__cacheKey],o.memory.textures--}function I(T){const E=T.texture,z=n.get(T),J=n.get(E);if(J.__webglTexture!==void 0&&(i.deleteTexture(J.__webglTexture),o.memory.textures--),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(z.__webglFramebuffer[K]))for(let Q=0;Q<z.__webglFramebuffer[K].length;Q++)i.deleteFramebuffer(z.__webglFramebuffer[K][Q]);else i.deleteFramebuffer(z.__webglFramebuffer[K]);z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer[K])}else{if(Array.isArray(z.__webglFramebuffer))for(let K=0;K<z.__webglFramebuffer.length;K++)i.deleteFramebuffer(z.__webglFramebuffer[K]);else i.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&i.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let K=0;K<z.__webglColorRenderbuffer.length;K++)z.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(z.__webglColorRenderbuffer[K]);z.__webglDepthRenderbuffer&&i.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(T.isWebGLMultipleRenderTargets)for(let K=0,Q=E.length;K<Q;K++){const dt=n.get(E[K]);dt.__webglTexture&&(i.deleteTexture(dt.__webglTexture),o.memory.textures--),n.remove(E[K])}n.remove(E),n.remove(T)}let N=0;function Z(){N=0}function P(){const T=N;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),N+=1,T}function G(T){const E=[];return E.push(T.wrapS),E.push(T.wrapT),E.push(T.wrapR||0),E.push(T.magFilter),E.push(T.minFilter),E.push(T.anisotropy),E.push(T.internalFormat),E.push(T.format),E.push(T.type),E.push(T.generateMipmaps),E.push(T.premultiplyAlpha),E.push(T.flipY),E.push(T.unpackAlignment),E.push(T.colorSpace),E.join()}function V(T,E){const z=n.get(T);if(T.isVideoTexture&&re(T),T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){const J=T.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{at(z,T,E);return}}e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+E)}function q(T,E){const z=n.get(T);if(T.version>0&&z.__version!==T.version){at(z,T,E);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+E)}function W(T,E){const z=n.get(T);if(T.version>0&&z.__version!==T.version){at(z,T,E);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+E)}function X(T,E){const z=n.get(T);if(T.version>0&&z.__version!==T.version){gt(z,T,E);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+E)}const Y={[_o]:i.REPEAT,[Qe]:i.CLAMP_TO_EDGE,[xo]:i.MIRRORED_REPEAT},tt={[Le]:i.NEAREST,[Ma]:i.NEAREST_MIPMAP_NEAREST,[Ar]:i.NEAREST_MIPMAP_LINEAR,[Ve]:i.LINEAR,[Mu]:i.LINEAR_MIPMAP_NEAREST,[fs]:i.LINEAR_MIPMAP_LINEAR},nt={[Du]:i.NEVER,[zu]:i.ALWAYS,[Uu]:i.LESS,[dl]:i.LEQUAL,[Iu]:i.EQUAL,[Ou]:i.GEQUAL,[Nu]:i.GREATER,[Fu]:i.NOTEQUAL};function k(T,E,z){if(z?(i.texParameteri(T,i.TEXTURE_WRAP_S,Y[E.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,Y[E.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,Y[E.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,tt[E.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,tt[E.minFilter])):(i.texParameteri(T,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(T,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(E.wrapS!==Qe||E.wrapT!==Qe)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(T,i.TEXTURE_MAG_FILTER,w(E.magFilter)),i.texParameteri(T,i.TEXTURE_MIN_FILTER,w(E.minFilter)),E.minFilter!==Le&&E.minFilter!==Ve&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,nt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const J=t.get("EXT_texture_filter_anisotropic");if(E.magFilter===Le||E.minFilter!==Ar&&E.minFilter!==fs||E.type===Fn&&t.has("OES_texture_float_linear")===!1||a===!1&&E.type===ds&&t.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(i.texParameterf(T,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function j(T,E){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,E.addEventListener("dispose",R));const J=E.source;let K=f.get(J);K===void 0&&(K={},f.set(J,K));const Q=G(E);if(Q!==T.__cacheKey){K[Q]===void 0&&(K[Q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),K[Q].usedTimes++;const dt=K[T.__cacheKey];dt!==void 0&&(K[T.__cacheKey].usedTimes--,dt.usedTimes===0&&y(E)),T.__cacheKey=Q,T.__webglTexture=K[Q].texture}return z}function at(T,E,z){let J=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(J=i.TEXTURE_3D);const K=j(T,E),Q=E.source;e.bindTexture(J,T.__webglTexture,i.TEXTURE0+z);const dt=n.get(Q);if(Q.version!==dt.__version||K===!0){e.activeTexture(i.TEXTURE0+z);const ot=Jt.getPrimaries(Jt.workingColorSpace),ht=E.colorSpace===Xe?null:Jt.getPrimaries(E.colorSpace),St=E.colorSpace===Xe||ot===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);const Ft=d(E)&&m(E.image)===!1;let $=_(E.image,Ft,!1,s.maxTextureSize);$=Nt(E,$);const Zt=m($)||a,Ht=r.convert(E.format,E.colorSpace);let At=r.convert(E.type),_t=v(E.internalFormat,Ht,At,E.colorSpace,E.isVideoTexture);k(J,E,Zt);let ut;const Ut=E.mipmaps,Kt=a&&E.isVideoTexture!==!0&&_t!==hl,ce=dt.__version===void 0||K===!0,zt=A(E,$,Zt);if(E.isDepthTexture)_t=i.DEPTH_COMPONENT,a?E.type===Fn?_t=i.DEPTH_COMPONENT32F:E.type===Nn?_t=i.DEPTH_COMPONENT24:E.type===ii?_t=i.DEPTH24_STENCIL8:_t=i.DEPTH_COMPONENT16:E.type===Fn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===si&&_t===i.DEPTH_COMPONENT&&E.type!==Fo&&E.type!==Nn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=Nn,At=r.convert(E.type)),E.format===Gi&&_t===i.DEPTH_COMPONENT&&(_t=i.DEPTH_STENCIL,E.type!==ii&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=ii,At=r.convert(E.type))),ce&&(Kt?e.texStorage2D(i.TEXTURE_2D,1,_t,$.width,$.height):e.texImage2D(i.TEXTURE_2D,0,_t,$.width,$.height,0,Ht,At,null));else if(E.isDataTexture)if(Ut.length>0&&Zt){Kt&&ce&&e.texStorage2D(i.TEXTURE_2D,zt,_t,Ut[0].width,Ut[0].height);for(let it=0,C=Ut.length;it<C;it++)ut=Ut[it],Kt?e.texSubImage2D(i.TEXTURE_2D,it,0,0,ut.width,ut.height,Ht,At,ut.data):e.texImage2D(i.TEXTURE_2D,it,_t,ut.width,ut.height,0,Ht,At,ut.data);E.generateMipmaps=!1}else Kt?(ce&&e.texStorage2D(i.TEXTURE_2D,zt,_t,$.width,$.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,$.width,$.height,Ht,At,$.data)):e.texImage2D(i.TEXTURE_2D,0,_t,$.width,$.height,0,Ht,At,$.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Kt&&ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,zt,_t,Ut[0].width,Ut[0].height,$.depth);for(let it=0,C=Ut.length;it<C;it++)ut=Ut[it],E.format!==tn?Ht!==null?Kt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,ut.width,ut.height,$.depth,Ht,ut.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,_t,ut.width,ut.height,$.depth,0,ut.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Kt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,ut.width,ut.height,$.depth,Ht,At,ut.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,_t,ut.width,ut.height,$.depth,0,Ht,At,ut.data)}else{Kt&&ce&&e.texStorage2D(i.TEXTURE_2D,zt,_t,Ut[0].width,Ut[0].height);for(let it=0,C=Ut.length;it<C;it++)ut=Ut[it],E.format!==tn?Ht!==null?Kt?e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,ut.width,ut.height,Ht,ut.data):e.compressedTexImage2D(i.TEXTURE_2D,it,_t,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Kt?e.texSubImage2D(i.TEXTURE_2D,it,0,0,ut.width,ut.height,Ht,At,ut.data):e.texImage2D(i.TEXTURE_2D,it,_t,ut.width,ut.height,0,Ht,At,ut.data)}else if(E.isDataArrayTexture)Kt?(ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,zt,_t,$.width,$.height,$.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,Ht,At,$.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,_t,$.width,$.height,$.depth,0,Ht,At,$.data);else if(E.isData3DTexture)Kt?(ce&&e.texStorage3D(i.TEXTURE_3D,zt,_t,$.width,$.height,$.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,Ht,At,$.data)):e.texImage3D(i.TEXTURE_3D,0,_t,$.width,$.height,$.depth,0,Ht,At,$.data);else if(E.isFramebufferTexture){if(ce)if(Kt)e.texStorage2D(i.TEXTURE_2D,zt,_t,$.width,$.height);else{let it=$.width,C=$.height;for(let st=0;st<zt;st++)e.texImage2D(i.TEXTURE_2D,st,_t,it,C,0,Ht,At,null),it>>=1,C>>=1}}else if(Ut.length>0&&Zt){Kt&&ce&&e.texStorage2D(i.TEXTURE_2D,zt,_t,Ut[0].width,Ut[0].height);for(let it=0,C=Ut.length;it<C;it++)ut=Ut[it],Kt?e.texSubImage2D(i.TEXTURE_2D,it,0,0,Ht,At,ut):e.texImage2D(i.TEXTURE_2D,it,_t,Ht,At,ut);E.generateMipmaps=!1}else Kt?(ce&&e.texStorage2D(i.TEXTURE_2D,zt,_t,$.width,$.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Ht,At,$)):e.texImage2D(i.TEXTURE_2D,0,_t,Ht,At,$);M(E,Zt)&&x(J),dt.__version=Q.version,E.onUpdate&&E.onUpdate(E)}T.__version=E.version}function gt(T,E,z){if(E.image.length!==6)return;const J=j(T,E),K=E.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+z);const Q=n.get(K);if(K.version!==Q.__version||J===!0){e.activeTexture(i.TEXTURE0+z);const dt=Jt.getPrimaries(Jt.workingColorSpace),ot=E.colorSpace===Xe?null:Jt.getPrimaries(E.colorSpace),ht=E.colorSpace===Xe||dt===ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ht);const St=E.isCompressedTexture||E.image[0].isCompressedTexture,Ft=E.image[0]&&E.image[0].isDataTexture,$=[];for(let it=0;it<6;it++)!St&&!Ft?$[it]=_(E.image[it],!1,!0,s.maxCubemapSize):$[it]=Ft?E.image[it].image:E.image[it],$[it]=Nt(E,$[it]);const Zt=$[0],Ht=m(Zt)||a,At=r.convert(E.format,E.colorSpace),_t=r.convert(E.type),ut=v(E.internalFormat,At,_t,E.colorSpace),Ut=a&&E.isVideoTexture!==!0,Kt=Q.__version===void 0||J===!0;let ce=A(E,Zt,Ht);k(i.TEXTURE_CUBE_MAP,E,Ht);let zt;if(St){Ut&&Kt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ce,ut,Zt.width,Zt.height);for(let it=0;it<6;it++){zt=$[it].mipmaps;for(let C=0;C<zt.length;C++){const st=zt[C];E.format!==tn?At!==null?Ut?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,C,0,0,st.width,st.height,At,st.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,C,ut,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,C,0,0,st.width,st.height,At,_t,st.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,C,ut,st.width,st.height,0,At,_t,st.data)}}}else{zt=E.mipmaps,Ut&&Kt&&(zt.length>0&&ce++,e.texStorage2D(i.TEXTURE_CUBE_MAP,ce,ut,$[0].width,$[0].height));for(let it=0;it<6;it++)if(Ft){Ut?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,$[it].width,$[it].height,At,_t,$[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ut,$[it].width,$[it].height,0,At,_t,$[it].data);for(let C=0;C<zt.length;C++){const rt=zt[C].image[it].image;Ut?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,C+1,0,0,rt.width,rt.height,At,_t,rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,C+1,ut,rt.width,rt.height,0,At,_t,rt.data)}}else{Ut?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,At,_t,$[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,ut,At,_t,$[it]);for(let C=0;C<zt.length;C++){const st=zt[C];Ut?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,C+1,0,0,At,_t,st.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,C+1,ut,At,_t,st.image[it])}}}M(E,Ht)&&x(i.TEXTURE_CUBE_MAP),Q.__version=K.version,E.onUpdate&&E.onUpdate(E)}T.__version=E.version}function mt(T,E,z,J,K,Q){const dt=r.convert(z.format,z.colorSpace),ot=r.convert(z.type),ht=v(z.internalFormat,dt,ot,z.colorSpace);if(!n.get(E).__hasExternalTextures){const Ft=Math.max(1,E.width>>Q),$=Math.max(1,E.height>>Q);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,Q,ht,Ft,$,E.depth,0,dt,ot,null):e.texImage2D(K,Q,ht,Ft,$,0,dt,ot,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),ft(E)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,K,n.get(z).__webglTexture,0,wt(E)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,K,n.get(z).__webglTexture,Q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ct(T,E,z){if(i.bindRenderbuffer(i.RENDERBUFFER,T),E.depthBuffer&&!E.stencilBuffer){let J=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(z||ft(E)){const K=E.depthTexture;K&&K.isDepthTexture&&(K.type===Fn?J=i.DEPTH_COMPONENT32F:K.type===Nn&&(J=i.DEPTH_COMPONENT24));const Q=wt(E);ft(E)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Q,J,E.width,E.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,J,E.width,E.height)}else i.renderbufferStorage(i.RENDERBUFFER,J,E.width,E.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,T)}else if(E.depthBuffer&&E.stencilBuffer){const J=wt(E);z&&ft(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,J,i.DEPTH24_STENCIL8,E.width,E.height):ft(E)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,J,i.DEPTH24_STENCIL8,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,T)}else{const J=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let K=0;K<J.length;K++){const Q=J[K],dt=r.convert(Q.format,Q.colorSpace),ot=r.convert(Q.type),ht=v(Q.internalFormat,dt,ot,Q.colorSpace),St=wt(E);z&&ft(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,St,ht,E.width,E.height):ft(E)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,St,ht,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,ht,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(T,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),V(E.depthTexture,0);const J=n.get(E.depthTexture).__webglTexture,K=wt(E);if(E.depthTexture.format===si)ft(E)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(E.depthTexture.format===Gi)ft(E)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Et(T){const E=n.get(T),z=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!E.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Dt(E.__webglFramebuffer,T)}else if(z){E.__webglDepthbuffer=[];for(let J=0;J<6;J++)e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[J]),E.__webglDepthbuffer[J]=i.createRenderbuffer(),Ct(E.__webglDepthbuffer[J],T,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=i.createRenderbuffer(),Ct(E.__webglDepthbuffer,T,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Yt(T,E,z){const J=n.get(T);E!==void 0&&mt(J.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Et(T)}function F(T){const E=T.texture,z=n.get(T),J=n.get(E);T.addEventListener("dispose",U),T.isWebGLMultipleRenderTargets!==!0&&(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=E.version,o.memory.textures++);const K=T.isWebGLCubeRenderTarget===!0,Q=T.isWebGLMultipleRenderTargets===!0,dt=m(T)||a;if(K){z.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(a&&E.mipmaps&&E.mipmaps.length>0){z.__webglFramebuffer[ot]=[];for(let ht=0;ht<E.mipmaps.length;ht++)z.__webglFramebuffer[ot][ht]=i.createFramebuffer()}else z.__webglFramebuffer[ot]=i.createFramebuffer()}else{if(a&&E.mipmaps&&E.mipmaps.length>0){z.__webglFramebuffer=[];for(let ot=0;ot<E.mipmaps.length;ot++)z.__webglFramebuffer[ot]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(Q)if(s.drawBuffers){const ot=T.texture;for(let ht=0,St=ot.length;ht<St;ht++){const Ft=n.get(ot[ht]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&T.samples>0&&ft(T)===!1){const ot=Q?E:[E];z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ht=0;ht<ot.length;ht++){const St=ot[ht];z.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[ht]);const Ft=r.convert(St.format,St.colorSpace),$=r.convert(St.type),Zt=v(St.internalFormat,Ft,$,St.colorSpace,T.isXRRenderTarget===!0),Ht=wt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ht,Zt,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,z.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Ct(z.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),k(i.TEXTURE_CUBE_MAP,E,dt);for(let ot=0;ot<6;ot++)if(a&&E.mipmaps&&E.mipmaps.length>0)for(let ht=0;ht<E.mipmaps.length;ht++)mt(z.__webglFramebuffer[ot][ht],T,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,ht);else mt(z.__webglFramebuffer[ot],T,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);M(E,dt)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Q){const ot=T.texture;for(let ht=0,St=ot.length;ht<St;ht++){const Ft=ot[ht],$=n.get(Ft);e.bindTexture(i.TEXTURE_2D,$.__webglTexture),k(i.TEXTURE_2D,Ft,dt),mt(z.__webglFramebuffer,T,Ft,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,0),M(Ft,dt)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let ot=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(a?ot=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ot,J.__webglTexture),k(ot,E,dt),a&&E.mipmaps&&E.mipmaps.length>0)for(let ht=0;ht<E.mipmaps.length;ht++)mt(z.__webglFramebuffer[ht],T,E,i.COLOR_ATTACHMENT0,ot,ht);else mt(z.__webglFramebuffer,T,E,i.COLOR_ATTACHMENT0,ot,0);M(E,dt)&&x(ot),e.unbindTexture()}T.depthBuffer&&Et(T)}function Ae(T){const E=m(T)||a,z=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let J=0,K=z.length;J<K;J++){const Q=z[J];if(M(Q,E)){const dt=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ot=n.get(Q).__webglTexture;e.bindTexture(dt,ot),x(dt),e.unbindTexture()}}}function xt(T){if(a&&T.samples>0&&ft(T)===!1){const E=T.isWebGLMultipleRenderTargets?T.texture:[T.texture],z=T.width,J=T.height;let K=i.COLOR_BUFFER_BIT;const Q=[],dt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=n.get(T),ht=T.isWebGLMultipleRenderTargets===!0;if(ht)for(let St=0;St<E.length;St++)e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let St=0;St<E.length;St++){Q.push(i.COLOR_ATTACHMENT0+St),T.depthBuffer&&Q.push(dt);const Ft=ot.__ignoreDepthValues!==void 0?ot.__ignoreDepthValues:!1;if(Ft===!1&&(T.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),ht&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ot.__webglColorRenderbuffer[St]),Ft===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[dt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[dt])),ht){const $=n.get(E[St]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$,0)}i.blitFramebuffer(0,0,z,J,0,0,z,J,K,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Q)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let St=0;St<E.length;St++){e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.RENDERBUFFER,ot.__webglColorRenderbuffer[St]);const Ft=n.get(E[St]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.TEXTURE_2D,Ft,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}}function wt(T){return Math.min(s.maxSamples,T.samples)}function ft(T){const E=n.get(T);return a&&T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function re(T){const E=o.render.frame;h.get(T)!==E&&(h.set(T,E),T.update())}function Nt(T,E){const z=T.colorSpace,J=T.format,K=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||T.format===vo||z!==En&&z!==Xe&&(Jt.getTransfer(z)===ne?a===!1?t.has("EXT_sRGB")===!0&&J===tn?(T.format=vo,T.minFilter=Ve,T.generateMipmaps=!1):E=gl.sRGBToLinear(E):(J!==tn||K!==Gn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),E}this.allocateTextureUnit=P,this.resetTextureUnits=Z,this.setTexture2D=V,this.setTexture2DArray=q,this.setTexture3D=W,this.setTextureCube=X,this.rebindTextures=Yt,this.setupRenderTarget=F,this.updateRenderTargetMipmap=Ae,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=ft}function Bg(i,t,e){const n=e.isWebGL2;function s(r,o=Xe){let a;const c=Jt.getTransfer(o);if(r===Gn)return i.UNSIGNED_BYTE;if(r===rl)return i.UNSIGNED_SHORT_4_4_4_4;if(r===ol)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Su)return i.BYTE;if(r===Eu)return i.SHORT;if(r===Fo)return i.UNSIGNED_SHORT;if(r===sl)return i.INT;if(r===Nn)return i.UNSIGNED_INT;if(r===Fn)return i.FLOAT;if(r===ds)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===yu)return i.ALPHA;if(r===tn)return i.RGBA;if(r===bu)return i.LUMINANCE;if(r===Tu)return i.LUMINANCE_ALPHA;if(r===si)return i.DEPTH_COMPONENT;if(r===Gi)return i.DEPTH_STENCIL;if(r===vo)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Au)return i.RED;if(r===al)return i.RED_INTEGER;if(r===wu)return i.RG;if(r===cl)return i.RG_INTEGER;if(r===ll)return i.RGBA_INTEGER;if(r===wr||r===Rr||r===Cr||r===Pr)if(c===ne)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===wr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Rr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Cr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Pr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===wr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Rr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Cr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Pr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Sa||r===Ea||r===ya||r===ba)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Sa)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ea)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===ya)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ba)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===hl)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Ta||r===Aa)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Ta)return c===ne?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Aa)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===wa||r===Ra||r===Ca||r===Pa||r===La||r===Da||r===Ua||r===Ia||r===Na||r===Fa||r===Oa||r===za||r===Ba||r===Ga)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===wa)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Ra)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ca)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Pa)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===La)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Da)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ua)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Ia)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Na)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Fa)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Oa)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===za)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Ba)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ga)return c===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Lr||r===Ha||r===ka)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Lr)return c===ne?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ha)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===ka)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Ru||r===Va||r===Wa||r===Xa)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Lr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Va)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Wa)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Xa)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ii?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class Gg extends We{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class vn extends Ee{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hg={type:"move"};class no{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),d=this._getHandJoint(l,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Hg)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new vn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class kg extends Xi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,p=null,g=null;const _=e.getContextAttributes();let m=null,d=null;const M=[],x=[],v=new Wt;let A=null;const w=new We;w.layers.enable(1),w.viewport=new Se;const R=new We;R.layers.enable(2),R.viewport=new Se;const U=[w,R],S=new Gg;S.layers.enable(1),S.layers.enable(2);let y=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let j=M[k];return j===void 0&&(j=new no,M[k]=j),j.getTargetRaySpace()},this.getControllerGrip=function(k){let j=M[k];return j===void 0&&(j=new no,M[k]=j),j.getGripSpace()},this.getHand=function(k){let j=M[k];return j===void 0&&(j=new no,M[k]=j),j.getHandSpace()};function N(k){const j=x.indexOf(k.inputSource);if(j===-1)return;const at=M[j];at!==void 0&&(at.update(k.inputSource,k.frame,l||o),at.dispatchEvent({type:k.type,data:k.inputSource}))}function Z(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",Z),s.removeEventListener("inputsourceschange",P);for(let k=0;k<M.length;k++){const j=x[k];j!==null&&(x[k]=null,M[k].disconnect(j))}y=null,I=null,t.setRenderTarget(m),p=null,f=null,u=null,s=null,d=null,nt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(v.width,v.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(k){l=k},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(k){if(s=k,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",Z),s.addEventListener("inputsourceschange",P),_.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(v),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const j={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,j),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new ci(p.framebufferWidth,p.framebufferHeight,{format:tn,type:Gn,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let j=null,at=null,gt=null;_.depth&&(gt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=_.stencil?Gi:si,at=_.stencil?ii:Nn);const mt={colorFormat:e.RGBA8,depthFormat:gt,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(mt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),d=new ci(f.textureWidth,f.textureHeight,{format:tn,type:Gn,depthTexture:new Rl(f.textureWidth,f.textureHeight,at,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Ct=t.properties.get(d);Ct.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),nt.setContext(s),nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function P(k){for(let j=0;j<k.removed.length;j++){const at=k.removed[j],gt=x.indexOf(at);gt>=0&&(x[gt]=null,M[gt].disconnect(at))}for(let j=0;j<k.added.length;j++){const at=k.added[j];let gt=x.indexOf(at);if(gt===-1){for(let Ct=0;Ct<M.length;Ct++)if(Ct>=x.length){x.push(at),gt=Ct;break}else if(x[Ct]===null){x[Ct]=at,gt=Ct;break}if(gt===-1)break}const mt=M[gt];mt&&mt.connect(at)}}const G=new L,V=new L;function q(k,j,at){G.setFromMatrixPosition(j.matrixWorld),V.setFromMatrixPosition(at.matrixWorld);const gt=G.distanceTo(V),mt=j.projectionMatrix.elements,Ct=at.projectionMatrix.elements,Dt=mt[14]/(mt[10]-1),Et=mt[14]/(mt[10]+1),Yt=(mt[9]+1)/mt[5],F=(mt[9]-1)/mt[5],Ae=(mt[8]-1)/mt[0],xt=(Ct[8]+1)/Ct[0],wt=Dt*Ae,ft=Dt*xt,re=gt/(-Ae+xt),Nt=re*-Ae;j.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(Nt),k.translateZ(re),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert();const T=Dt+re,E=Et+re,z=wt-Nt,J=ft+(gt-Nt),K=Yt*Et/E*T,Q=F*Et/E*T;k.projectionMatrix.makePerspective(z,J,K,Q,T,E),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}function W(k,j){j===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(j.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(s===null)return;S.near=R.near=w.near=k.near,S.far=R.far=w.far=k.far,(y!==S.near||I!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),y=S.near,I=S.far);const j=k.parent,at=S.cameras;W(S,j);for(let gt=0;gt<at.length;gt++)W(at[gt],j);at.length===2?q(S,w,R):S.projectionMatrix.copy(w.projectionMatrix),X(k,S,j)};function X(k,j,at){at===null?k.matrix.copy(j.matrixWorld):(k.matrix.copy(at.matrixWorld),k.matrix.invert(),k.matrix.multiply(j.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(j.projectionMatrix),k.projectionMatrixInverse.copy(j.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=Mo*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(k){c=k,f!==null&&(f.fixedFoveation=k),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=k)};let Y=null;function tt(k,j){if(h=j.getViewerPose(l||o),g=j,h!==null){const at=h.views;p!==null&&(t.setRenderTargetFramebuffer(d,p.framebuffer),t.setRenderTarget(d));let gt=!1;at.length!==S.cameras.length&&(S.cameras.length=0,gt=!0);for(let mt=0;mt<at.length;mt++){const Ct=at[mt];let Dt=null;if(p!==null)Dt=p.getViewport(Ct);else{const Yt=u.getViewSubImage(f,Ct);Dt=Yt.viewport,mt===0&&(t.setRenderTargetTextures(d,Yt.colorTexture,f.ignoreDepthValues?void 0:Yt.depthStencilTexture),t.setRenderTarget(d))}let Et=U[mt];Et===void 0&&(Et=new We,Et.layers.enable(mt),Et.viewport=new Se,U[mt]=Et),Et.matrix.fromArray(Ct.transform.matrix),Et.matrix.decompose(Et.position,Et.quaternion,Et.scale),Et.projectionMatrix.fromArray(Ct.projectionMatrix),Et.projectionMatrixInverse.copy(Et.projectionMatrix).invert(),Et.viewport.set(Dt.x,Dt.y,Dt.width,Dt.height),mt===0&&(S.matrix.copy(Et.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),gt===!0&&S.cameras.push(Et)}}for(let at=0;at<M.length;at++){const gt=x[at],mt=M[at];gt!==null&&mt!==void 0&&mt.update(gt,j,l||o)}Y&&Y(k,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}const nt=new Al;nt.setAnimationLoop(tt),this.setAnimationLoop=function(k){Y=k},this.dispose=function(){}}}function Vg(i,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,El(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,M,x,v){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,v)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,M,x):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ne&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ne&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const M=t.get(d).envMap;if(M&&(m.envMap.value=M,m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*x,e(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,M,x){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*M,m.scale.value=x*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),t.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,M){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ne&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){const M=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Wg(i,t,e,n){let s={},r={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(M,x){const v=x.program;n.uniformBlockBinding(M,v)}function l(M,x){let v=s[M.id];v===void 0&&(g(M),v=h(M),s[M.id]=v,M.addEventListener("dispose",m));const A=x.program;n.updateUBOMapping(M,A);const w=t.render.frame;r[M.id]!==w&&(f(M),r[M.id]=w)}function h(M){const x=u();M.__bindingPointIndex=x;const v=i.createBuffer(),A=M.__size,w=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,A,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,v),v}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const x=s[M.id],v=M.uniforms,A=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,R=v.length;w<R;w++){const U=Array.isArray(v[w])?v[w]:[v[w]];for(let S=0,y=U.length;S<y;S++){const I=U[S];if(p(I,w,S,A)===!0){const N=I.__offset,Z=Array.isArray(I.value)?I.value:[I.value];let P=0;for(let G=0;G<Z.length;G++){const V=Z[G],q=_(V);typeof V=="number"||typeof V=="boolean"?(I.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,N+P,I.__data)):V.isMatrix3?(I.__data[0]=V.elements[0],I.__data[1]=V.elements[1],I.__data[2]=V.elements[2],I.__data[3]=0,I.__data[4]=V.elements[3],I.__data[5]=V.elements[4],I.__data[6]=V.elements[5],I.__data[7]=0,I.__data[8]=V.elements[6],I.__data[9]=V.elements[7],I.__data[10]=V.elements[8],I.__data[11]=0):(V.toArray(I.__data,P),P+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,x,v,A){const w=M.value,R=x+"_"+v;if(A[R]===void 0)return typeof w=="number"||typeof w=="boolean"?A[R]=w:A[R]=w.clone(),!0;{const U=A[R];if(typeof w=="number"||typeof w=="boolean"){if(U!==w)return A[R]=w,!0}else if(U.equals(w)===!1)return U.copy(w),!0}return!1}function g(M){const x=M.uniforms;let v=0;const A=16;for(let R=0,U=x.length;R<U;R++){const S=Array.isArray(x[R])?x[R]:[x[R]];for(let y=0,I=S.length;y<I;y++){const N=S[y],Z=Array.isArray(N.value)?N.value:[N.value];for(let P=0,G=Z.length;P<G;P++){const V=Z[P],q=_(V),W=v%A;W!==0&&A-W<q.boundary&&(v+=A-W),N.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=v,v+=q.storage}}}const w=v%A;return w>0&&(v+=A-w),M.__size=v,M.__cache={},this}function _(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){const x=M.target;x.removeEventListener("dispose",m);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function d(){for(const M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:c,update:l,dispose:d}}class Il{constructor(t={}){const{canvas:e=Gu(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;const p=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const d=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=fe,this._useLegacyLights=!1,this.toneMapping=Bn,this.toneMappingExposure=1;const x=this;let v=!1,A=0,w=0,R=null,U=-1,S=null;const y=new Se,I=new Se;let N=null;const Z=new kt(0);let P=0,G=e.width,V=e.height,q=1,W=null,X=null;const Y=new Se(0,0,G,V),tt=new Se(0,0,G,V);let nt=!1;const k=new Go;let j=!1,at=!1,gt=null;const mt=new ie,Ct=new Wt,Dt=new L,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Yt(){return R===null?q:1}let F=n;function Ae(b,D){for(let B=0;B<b.length;B++){const H=b[B],O=e.getContext(H,D);if(O!==null)return O}return null}try{const b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Io}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",C,!1),e.addEventListener("webglcontextcreationerror",st,!1),F===null){const D=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&D.shift(),F=Ae(D,b),F===null)throw Ae(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&F instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),F.getShaderPrecisionFormat===void 0&&(F.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let xt,wt,ft,re,Nt,T,E,z,J,K,Q,dt,ot,ht,St,Ft,$,Zt,Ht,At,_t,ut,Ut,Kt;function ce(){xt=new tm(F),wt=new jp(F,xt,t),xt.init(wt),ut=new Bg(F,xt,wt),ft=new Og(F,xt,wt),re=new im(F),Nt=new yg,T=new zg(F,xt,ft,Nt,wt,ut,re),E=new Kp(x),z=new Qp(x),J=new uf(F,wt),Ut=new qp(F,xt,J,wt),K=new em(F,J,re,Ut),Q=new am(F,K,J,re),Ht=new om(F,wt,T),Ft=new $p(Nt),dt=new Eg(x,E,z,xt,wt,Ut,Ft),ot=new Vg(x,Nt),ht=new Tg,St=new Lg(xt,wt),Zt=new Xp(x,E,z,ft,Q,f,c),$=new Fg(x,Q,wt),Kt=new Wg(F,re,wt,ft),At=new Yp(F,xt,re,wt),_t=new nm(F,xt,re,wt),re.programs=dt.programs,x.capabilities=wt,x.extensions=xt,x.properties=Nt,x.renderLists=ht,x.shadowMap=$,x.state=ft,x.info=re}ce();const zt=new kg(x,F);this.xr=zt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const b=xt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=xt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(b){b!==void 0&&(q=b,this.setSize(G,V,!1))},this.getSize=function(b){return b.set(G,V)},this.setSize=function(b,D,B=!0){if(zt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=b,V=D,e.width=Math.floor(b*q),e.height=Math.floor(D*q),B===!0&&(e.style.width=b+"px",e.style.height=D+"px"),this.setViewport(0,0,b,D)},this.getDrawingBufferSize=function(b){return b.set(G*q,V*q).floor()},this.setDrawingBufferSize=function(b,D,B){G=b,V=D,q=B,e.width=Math.floor(b*B),e.height=Math.floor(D*B),this.setViewport(0,0,b,D)},this.getCurrentViewport=function(b){return b.copy(y)},this.getViewport=function(b){return b.copy(Y)},this.setViewport=function(b,D,B,H){b.isVector4?Y.set(b.x,b.y,b.z,b.w):Y.set(b,D,B,H),ft.viewport(y.copy(Y).multiplyScalar(q).floor())},this.getScissor=function(b){return b.copy(tt)},this.setScissor=function(b,D,B,H){b.isVector4?tt.set(b.x,b.y,b.z,b.w):tt.set(b,D,B,H),ft.scissor(I.copy(tt).multiplyScalar(q).floor())},this.getScissorTest=function(){return nt},this.setScissorTest=function(b){ft.setScissorTest(nt=b)},this.setOpaqueSort=function(b){W=b},this.setTransparentSort=function(b){X=b},this.getClearColor=function(b){return b.copy(Zt.getClearColor())},this.setClearColor=function(){Zt.setClearColor.apply(Zt,arguments)},this.getClearAlpha=function(){return Zt.getClearAlpha()},this.setClearAlpha=function(){Zt.setClearAlpha.apply(Zt,arguments)},this.clear=function(b=!0,D=!0,B=!0){let H=0;if(b){let O=!1;if(R!==null){const ct=R.texture.format;O=ct===ll||ct===cl||ct===al}if(O){const ct=R.texture.type,pt=ct===Gn||ct===Nn||ct===Fo||ct===ii||ct===rl||ct===ol,Mt=Zt.getClearColor(),bt=Zt.getClearAlpha(),Ot=Mt.r,Rt=Mt.g,Pt=Mt.b;pt?(p[0]=Ot,p[1]=Rt,p[2]=Pt,p[3]=bt,F.clearBufferuiv(F.COLOR,0,p)):(g[0]=Ot,g[1]=Rt,g[2]=Pt,g[3]=bt,F.clearBufferiv(F.COLOR,0,g))}else H|=F.COLOR_BUFFER_BIT}D&&(H|=F.DEPTH_BUFFER_BIT),B&&(H|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",C,!1),e.removeEventListener("webglcontextcreationerror",st,!1),ht.dispose(),St.dispose(),Nt.dispose(),E.dispose(),z.dispose(),Q.dispose(),Ut.dispose(),Kt.dispose(),dt.dispose(),zt.dispose(),zt.removeEventListener("sessionstart",we),zt.removeEventListener("sessionend",ee),gt&&(gt.dispose(),gt=null),Re.stop()};function it(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),v=!0}function C(){console.log("THREE.WebGLRenderer: Context Restored."),v=!1;const b=re.autoReset,D=$.enabled,B=$.autoUpdate,H=$.needsUpdate,O=$.type;ce(),re.autoReset=b,$.enabled=D,$.autoUpdate=B,$.needsUpdate=H,$.type=O}function st(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function rt(b){const D=b.target;D.removeEventListener("dispose",rt),yt(D)}function yt(b){vt(b),Nt.remove(b)}function vt(b){const D=Nt.get(b).programs;D!==void 0&&(D.forEach(function(B){dt.releaseProgram(B)}),b.isShaderMaterial&&dt.releaseShaderCache(b))}this.renderBufferDirect=function(b,D,B,H,O,ct){D===null&&(D=Et);const pt=O.isMesh&&O.matrixWorld.determinant()<0,Mt=rh(b,D,B,H,O);ft.setMaterial(H,pt);let bt=B.index,Ot=1;if(H.wireframe===!0){if(bt=K.getWireframeAttribute(B),bt===void 0)return;Ot=2}const Rt=B.drawRange,Pt=B.attributes.position;let he=Rt.start*Ot,Oe=(Rt.start+Rt.count)*Ot;ct!==null&&(he=Math.max(he,ct.start*Ot),Oe=Math.min(Oe,(ct.start+ct.count)*Ot)),bt!==null?(he=Math.max(he,0),Oe=Math.min(Oe,bt.count)):Pt!=null&&(he=Math.max(he,0),Oe=Math.min(Oe,Pt.count));const xe=Oe-he;if(xe<0||xe===1/0)return;Ut.setup(O,H,Mt,B,bt);let ln,oe=At;if(bt!==null&&(ln=J.get(bt),oe=_t,oe.setIndex(ln)),O.isMesh)H.wireframe===!0?(ft.setLineWidth(H.wireframeLinewidth*Yt()),oe.setMode(F.LINES)):oe.setMode(F.TRIANGLES);else if(O.isLine){let Bt=H.linewidth;Bt===void 0&&(Bt=1),ft.setLineWidth(Bt*Yt()),O.isLineSegments?oe.setMode(F.LINES):O.isLineLoop?oe.setMode(F.LINE_LOOP):oe.setMode(F.LINE_STRIP)}else O.isPoints?oe.setMode(F.POINTS):O.isSprite&&oe.setMode(F.TRIANGLES);if(O.isBatchedMesh)oe.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else if(O.isInstancedMesh)oe.renderInstances(he,xe,O.count);else if(B.isInstancedBufferGeometry){const Bt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Mr=Math.min(B.instanceCount,Bt);oe.renderInstances(he,xe,Mr)}else oe.render(he,xe)};function Qt(b,D,B){b.transparent===!0&&b.side===Je&&b.forceSinglePass===!1?(b.side=Ne,b.needsUpdate=!0,vs(b,D,B),b.side=Sn,b.needsUpdate=!0,vs(b,D,B),b.side=Je):vs(b,D,B)}this.compile=function(b,D,B=null){B===null&&(B=b),m=St.get(B),m.init(),M.push(m),B.traverseVisible(function(O){O.isLight&&O.layers.test(D.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),b!==B&&b.traverseVisible(function(O){O.isLight&&O.layers.test(D.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights(x._useLegacyLights);const H=new Set;return b.traverse(function(O){const ct=O.material;if(ct)if(Array.isArray(ct))for(let pt=0;pt<ct.length;pt++){const Mt=ct[pt];Qt(Mt,B,O),H.add(Mt)}else Qt(ct,B,O),H.add(ct)}),M.pop(),m=null,H},this.compileAsync=function(b,D,B=null){const H=this.compile(b,D,B);return new Promise(O=>{function ct(){if(H.forEach(function(pt){Nt.get(pt).currentProgram.isReady()&&H.delete(pt)}),H.size===0){O(b);return}setTimeout(ct,10)}xt.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let te=null;function _e(b){te&&te(b)}function we(){Re.stop()}function ee(){Re.start()}const Re=new Al;Re.setAnimationLoop(_e),typeof self<"u"&&Re.setContext(self),this.setAnimationLoop=function(b){te=b,zt.setAnimationLoop(b),b===null?Re.stop():Re.start()},zt.addEventListener("sessionstart",we),zt.addEventListener("sessionend",ee),this.render=function(b,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(v===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),zt.enabled===!0&&zt.isPresenting===!0&&(zt.cameraAutoUpdate===!0&&zt.updateCamera(D),D=zt.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,D,R),m=St.get(b,M.length),m.init(),M.push(m),mt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),k.setFromProjectionMatrix(mt),at=this.localClippingEnabled,j=Ft.init(this.clippingPlanes,at),_=ht.get(b,d.length),_.init(),d.push(_),sn(b,D,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(W,X),this.info.render.frame++,j===!0&&Ft.beginShadows();const B=m.state.shadowsArray;if($.render(B,b,D),j===!0&&Ft.endShadows(),this.info.autoReset===!0&&this.info.reset(),Zt.render(_,b),m.setupLights(x._useLegacyLights),D.isArrayCamera){const H=D.cameras;for(let O=0,ct=H.length;O<ct;O++){const pt=H[O];ea(_,b,pt,pt.viewport)}}else ea(_,b,D);R!==null&&(T.updateMultisampleRenderTarget(R),T.updateRenderTargetMipmap(R)),b.isScene===!0&&b.onAfterRender(x,b,D),Ut.resetDefaultState(),U=-1,S=null,M.pop(),M.length>0?m=M[M.length-1]:m=null,d.pop(),d.length>0?_=d[d.length-1]:_=null};function sn(b,D,B,H){if(b.visible===!1)return;if(b.layers.test(D.layers)){if(b.isGroup)B=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(D);else if(b.isLight)m.pushLight(b),b.castShadow&&m.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||k.intersectsSprite(b)){H&&Dt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(mt);const pt=Q.update(b),Mt=b.material;Mt.visible&&_.push(b,pt,Mt,B,Dt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||k.intersectsObject(b))){const pt=Q.update(b),Mt=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Dt.copy(b.boundingSphere.center)):(pt.boundingSphere===null&&pt.computeBoundingSphere(),Dt.copy(pt.boundingSphere.center)),Dt.applyMatrix4(b.matrixWorld).applyMatrix4(mt)),Array.isArray(Mt)){const bt=pt.groups;for(let Ot=0,Rt=bt.length;Ot<Rt;Ot++){const Pt=bt[Ot],he=Mt[Pt.materialIndex];he&&he.visible&&_.push(b,pt,he,B,Dt.z,Pt)}}else Mt.visible&&_.push(b,pt,Mt,B,Dt.z,null)}}const ct=b.children;for(let pt=0,Mt=ct.length;pt<Mt;pt++)sn(ct[pt],D,B,H)}function ea(b,D,B,H){const O=b.opaque,ct=b.transmissive,pt=b.transparent;m.setupLightsView(B),j===!0&&Ft.setGlobalState(x.clippingPlanes,B),ct.length>0&&sh(O,ct,D,B),H&&ft.viewport(y.copy(H)),O.length>0&&xs(O,D,B),ct.length>0&&xs(ct,D,B),pt.length>0&&xs(pt,D,B),ft.buffers.depth.setTest(!0),ft.buffers.depth.setMask(!0),ft.buffers.color.setMask(!0),ft.setPolygonOffset(!1)}function sh(b,D,B,H){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;const ct=wt.isWebGL2;gt===null&&(gt=new ci(1,1,{generateMipmaps:!0,type:xt.has("EXT_color_buffer_half_float")?ds:Gn,minFilter:fs,samples:ct?4:0})),x.getDrawingBufferSize(Ct),ct?gt.setSize(Ct.x,Ct.y):gt.setSize(So(Ct.x),So(Ct.y));const pt=x.getRenderTarget();x.setRenderTarget(gt),x.getClearColor(Z),P=x.getClearAlpha(),P<1&&x.setClearColor(16777215,.5),x.clear();const Mt=x.toneMapping;x.toneMapping=Bn,xs(b,B,H),T.updateMultisampleRenderTarget(gt),T.updateRenderTargetMipmap(gt);let bt=!1;for(let Ot=0,Rt=D.length;Ot<Rt;Ot++){const Pt=D[Ot],he=Pt.object,Oe=Pt.geometry,xe=Pt.material,ln=Pt.group;if(xe.side===Je&&he.layers.test(H.layers)){const oe=xe.side;xe.side=Ne,xe.needsUpdate=!0,na(he,B,H,Oe,xe,ln),xe.side=oe,xe.needsUpdate=!0,bt=!0}}bt===!0&&(T.updateMultisampleRenderTarget(gt),T.updateRenderTargetMipmap(gt)),x.setRenderTarget(pt),x.setClearColor(Z,P),x.toneMapping=Mt}function xs(b,D,B){const H=D.isScene===!0?D.overrideMaterial:null;for(let O=0,ct=b.length;O<ct;O++){const pt=b[O],Mt=pt.object,bt=pt.geometry,Ot=H===null?pt.material:H,Rt=pt.group;Mt.layers.test(B.layers)&&na(Mt,D,B,bt,Ot,Rt)}}function na(b,D,B,H,O,ct){b.onBeforeRender(x,D,B,H,O,ct),b.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),O.onBeforeRender(x,D,B,H,b,ct),O.transparent===!0&&O.side===Je&&O.forceSinglePass===!1?(O.side=Ne,O.needsUpdate=!0,x.renderBufferDirect(B,D,H,O,b,ct),O.side=Sn,O.needsUpdate=!0,x.renderBufferDirect(B,D,H,O,b,ct),O.side=Je):x.renderBufferDirect(B,D,H,O,b,ct),b.onAfterRender(x,D,B,H,O,ct)}function vs(b,D,B){D.isScene!==!0&&(D=Et);const H=Nt.get(b),O=m.state.lights,ct=m.state.shadowsArray,pt=O.state.version,Mt=dt.getParameters(b,O.state,ct,D,B),bt=dt.getProgramCacheKey(Mt);let Ot=H.programs;H.environment=b.isMeshStandardMaterial?D.environment:null,H.fog=D.fog,H.envMap=(b.isMeshStandardMaterial?z:E).get(b.envMap||H.environment),Ot===void 0&&(b.addEventListener("dispose",rt),Ot=new Map,H.programs=Ot);let Rt=Ot.get(bt);if(Rt!==void 0){if(H.currentProgram===Rt&&H.lightsStateVersion===pt)return sa(b,Mt),Rt}else Mt.uniforms=dt.getUniforms(b),b.onBuild(B,Mt,x),b.onBeforeCompile(Mt,x),Rt=dt.acquireProgram(Mt,bt),Ot.set(bt,Rt),H.uniforms=Mt.uniforms;const Pt=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Pt.clippingPlanes=Ft.uniform),sa(b,Mt),H.needsLights=ah(b),H.lightsStateVersion=pt,H.needsLights&&(Pt.ambientLightColor.value=O.state.ambient,Pt.lightProbe.value=O.state.probe,Pt.directionalLights.value=O.state.directional,Pt.directionalLightShadows.value=O.state.directionalShadow,Pt.spotLights.value=O.state.spot,Pt.spotLightShadows.value=O.state.spotShadow,Pt.rectAreaLights.value=O.state.rectArea,Pt.ltc_1.value=O.state.rectAreaLTC1,Pt.ltc_2.value=O.state.rectAreaLTC2,Pt.pointLights.value=O.state.point,Pt.pointLightShadows.value=O.state.pointShadow,Pt.hemisphereLights.value=O.state.hemi,Pt.directionalShadowMap.value=O.state.directionalShadowMap,Pt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Pt.spotShadowMap.value=O.state.spotShadowMap,Pt.spotLightMatrix.value=O.state.spotLightMatrix,Pt.spotLightMap.value=O.state.spotLightMap,Pt.pointShadowMap.value=O.state.pointShadowMap,Pt.pointShadowMatrix.value=O.state.pointShadowMatrix),H.currentProgram=Rt,H.uniformsList=null,Rt}function ia(b){if(b.uniformsList===null){const D=b.currentProgram.getUniforms();b.uniformsList=js.seqWithValue(D.seq,b.uniforms)}return b.uniformsList}function sa(b,D){const B=Nt.get(b);B.outputColorSpace=D.outputColorSpace,B.batching=D.batching,B.instancing=D.instancing,B.instancingColor=D.instancingColor,B.skinning=D.skinning,B.morphTargets=D.morphTargets,B.morphNormals=D.morphNormals,B.morphColors=D.morphColors,B.morphTargetsCount=D.morphTargetsCount,B.numClippingPlanes=D.numClippingPlanes,B.numIntersection=D.numClipIntersection,B.vertexAlphas=D.vertexAlphas,B.vertexTangents=D.vertexTangents,B.toneMapping=D.toneMapping}function rh(b,D,B,H,O){D.isScene!==!0&&(D=Et),T.resetTextureUnits();const ct=D.fog,pt=H.isMeshStandardMaterial?D.environment:null,Mt=R===null?x.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:En,bt=(H.isMeshStandardMaterial?z:E).get(H.envMap||pt),Ot=H.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Rt=!!B.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Pt=!!B.morphAttributes.position,he=!!B.morphAttributes.normal,Oe=!!B.morphAttributes.color;let xe=Bn;H.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(xe=x.toneMapping);const ln=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,oe=ln!==void 0?ln.length:0,Bt=Nt.get(H),Mr=m.state.lights;if(j===!0&&(at===!0||b!==S)){const He=b===S&&H.id===U;Ft.setState(H,b,He)}let le=!1;H.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==Mr.state.version||Bt.outputColorSpace!==Mt||O.isBatchedMesh&&Bt.batching===!1||!O.isBatchedMesh&&Bt.batching===!0||O.isInstancedMesh&&Bt.instancing===!1||!O.isInstancedMesh&&Bt.instancing===!0||O.isSkinnedMesh&&Bt.skinning===!1||!O.isSkinnedMesh&&Bt.skinning===!0||O.isInstancedMesh&&Bt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Bt.instancingColor===!1&&O.instanceColor!==null||Bt.envMap!==bt||H.fog===!0&&Bt.fog!==ct||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==Ft.numPlanes||Bt.numIntersection!==Ft.numIntersection)||Bt.vertexAlphas!==Ot||Bt.vertexTangents!==Rt||Bt.morphTargets!==Pt||Bt.morphNormals!==he||Bt.morphColors!==Oe||Bt.toneMapping!==xe||wt.isWebGL2===!0&&Bt.morphTargetsCount!==oe)&&(le=!0):(le=!0,Bt.__version=H.version);let Yn=Bt.currentProgram;le===!0&&(Yn=vs(H,D,O));let ra=!1,Zi=!1,Sr=!1;const ye=Yn.getUniforms(),jn=Bt.uniforms;if(ft.useProgram(Yn.program)&&(ra=!0,Zi=!0,Sr=!0),H.id!==U&&(U=H.id,Zi=!0),ra||S!==b){ye.setValue(F,"projectionMatrix",b.projectionMatrix),ye.setValue(F,"viewMatrix",b.matrixWorldInverse);const He=ye.map.cameraPosition;He!==void 0&&He.setValue(F,Dt.setFromMatrixPosition(b.matrixWorld)),wt.logarithmicDepthBuffer&&ye.setValue(F,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ye.setValue(F,"isOrthographic",b.isOrthographicCamera===!0),S!==b&&(S=b,Zi=!0,Sr=!0)}if(O.isSkinnedMesh){ye.setOptional(F,O,"bindMatrix"),ye.setOptional(F,O,"bindMatrixInverse");const He=O.skeleton;He&&(wt.floatVertexTextures?(He.boneTexture===null&&He.computeBoneTexture(),ye.setValue(F,"boneTexture",He.boneTexture,T)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}O.isBatchedMesh&&(ye.setOptional(F,O,"batchingTexture"),ye.setValue(F,"batchingTexture",O._matricesTexture,T));const Er=B.morphAttributes;if((Er.position!==void 0||Er.normal!==void 0||Er.color!==void 0&&wt.isWebGL2===!0)&&Ht.update(O,B,Yn),(Zi||Bt.receiveShadow!==O.receiveShadow)&&(Bt.receiveShadow=O.receiveShadow,ye.setValue(F,"receiveShadow",O.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(jn.envMap.value=bt,jn.flipEnvMap.value=bt.isCubeTexture&&bt.isRenderTargetTexture===!1?-1:1),Zi&&(ye.setValue(F,"toneMappingExposure",x.toneMappingExposure),Bt.needsLights&&oh(jn,Sr),ct&&H.fog===!0&&ot.refreshFogUniforms(jn,ct),ot.refreshMaterialUniforms(jn,H,q,V,gt),js.upload(F,ia(Bt),jn,T)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(js.upload(F,ia(Bt),jn,T),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ye.setValue(F,"center",O.center),ye.setValue(F,"modelViewMatrix",O.modelViewMatrix),ye.setValue(F,"normalMatrix",O.normalMatrix),ye.setValue(F,"modelMatrix",O.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const He=H.uniformsGroups;for(let yr=0,ch=He.length;yr<ch;yr++)if(wt.isWebGL2){const oa=He[yr];Kt.update(oa,Yn),Kt.bind(oa,Yn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Yn}function oh(b,D){b.ambientLightColor.needsUpdate=D,b.lightProbe.needsUpdate=D,b.directionalLights.needsUpdate=D,b.directionalLightShadows.needsUpdate=D,b.pointLights.needsUpdate=D,b.pointLightShadows.needsUpdate=D,b.spotLights.needsUpdate=D,b.spotLightShadows.needsUpdate=D,b.rectAreaLights.needsUpdate=D,b.hemisphereLights.needsUpdate=D}function ah(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(b,D,B){Nt.get(b.texture).__webglTexture=D,Nt.get(b.depthTexture).__webglTexture=B;const H=Nt.get(b);H.__hasExternalTextures=!0,H.__hasExternalTextures&&(H.__autoAllocateDepthBuffer=B===void 0,H.__autoAllocateDepthBuffer||xt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,D){const B=Nt.get(b);B.__webglFramebuffer=D,B.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(b,D=0,B=0){R=b,A=D,w=B;let H=!0,O=null,ct=!1,pt=!1;if(b){const bt=Nt.get(b);bt.__useDefaultFramebuffer!==void 0?(ft.bindFramebuffer(F.FRAMEBUFFER,null),H=!1):bt.__webglFramebuffer===void 0?T.setupRenderTarget(b):bt.__hasExternalTextures&&T.rebindTextures(b,Nt.get(b.texture).__webglTexture,Nt.get(b.depthTexture).__webglTexture);const Ot=b.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(pt=!0);const Rt=Nt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Rt[D])?O=Rt[D][B]:O=Rt[D],ct=!0):wt.isWebGL2&&b.samples>0&&T.useMultisampledRTT(b)===!1?O=Nt.get(b).__webglMultisampledFramebuffer:Array.isArray(Rt)?O=Rt[B]:O=Rt,y.copy(b.viewport),I.copy(b.scissor),N=b.scissorTest}else y.copy(Y).multiplyScalar(q).floor(),I.copy(tt).multiplyScalar(q).floor(),N=nt;if(ft.bindFramebuffer(F.FRAMEBUFFER,O)&&wt.drawBuffers&&H&&ft.drawBuffers(b,O),ft.viewport(y),ft.scissor(I),ft.setScissorTest(N),ct){const bt=Nt.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+D,bt.__webglTexture,B)}else if(pt){const bt=Nt.get(b.texture),Ot=D||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,bt.__webglTexture,B||0,Ot)}U=-1},this.readRenderTargetPixels=function(b,D,B,H,O,ct,pt){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Mt=Nt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&pt!==void 0&&(Mt=Mt[pt]),Mt){ft.bindFramebuffer(F.FRAMEBUFFER,Mt);try{const bt=b.texture,Ot=bt.format,Rt=bt.type;if(Ot!==tn&&ut.convert(Ot)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Pt=Rt===ds&&(xt.has("EXT_color_buffer_half_float")||wt.isWebGL2&&xt.has("EXT_color_buffer_float"));if(Rt!==Gn&&ut.convert(Rt)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Rt===Fn&&(wt.isWebGL2||xt.has("OES_texture_float")||xt.has("WEBGL_color_buffer_float")))&&!Pt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=b.width-H&&B>=0&&B<=b.height-O&&F.readPixels(D,B,H,O,ut.convert(Ot),ut.convert(Rt),ct)}finally{const bt=R!==null?Nt.get(R).__webglFramebuffer:null;ft.bindFramebuffer(F.FRAMEBUFFER,bt)}}},this.copyFramebufferToTexture=function(b,D,B=0){const H=Math.pow(2,-B),O=Math.floor(D.image.width*H),ct=Math.floor(D.image.height*H);T.setTexture2D(D,0),F.copyTexSubImage2D(F.TEXTURE_2D,B,0,0,b.x,b.y,O,ct),ft.unbindTexture()},this.copyTextureToTexture=function(b,D,B,H=0){const O=D.image.width,ct=D.image.height,pt=ut.convert(B.format),Mt=ut.convert(B.type);T.setTexture2D(B,0),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,B.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,B.unpackAlignment),D.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,H,b.x,b.y,O,ct,pt,Mt,D.image.data):D.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,H,b.x,b.y,D.mipmaps[0].width,D.mipmaps[0].height,pt,D.mipmaps[0].data):F.texSubImage2D(F.TEXTURE_2D,H,b.x,b.y,pt,Mt,D.image),H===0&&B.generateMipmaps&&F.generateMipmap(F.TEXTURE_2D),ft.unbindTexture()},this.copyTextureToTexture3D=function(b,D,B,H,O=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ct=b.max.x-b.min.x+1,pt=b.max.y-b.min.y+1,Mt=b.max.z-b.min.z+1,bt=ut.convert(H.format),Ot=ut.convert(H.type);let Rt;if(H.isData3DTexture)T.setTexture3D(H,0),Rt=F.TEXTURE_3D;else if(H.isDataArrayTexture||H.isCompressedArrayTexture)T.setTexture2DArray(H,0),Rt=F.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,H.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,H.unpackAlignment);const Pt=F.getParameter(F.UNPACK_ROW_LENGTH),he=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Oe=F.getParameter(F.UNPACK_SKIP_PIXELS),xe=F.getParameter(F.UNPACK_SKIP_ROWS),ln=F.getParameter(F.UNPACK_SKIP_IMAGES),oe=B.isCompressedTexture?B.mipmaps[O]:B.image;F.pixelStorei(F.UNPACK_ROW_LENGTH,oe.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,oe.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,b.min.x),F.pixelStorei(F.UNPACK_SKIP_ROWS,b.min.y),F.pixelStorei(F.UNPACK_SKIP_IMAGES,b.min.z),B.isDataTexture||B.isData3DTexture?F.texSubImage3D(Rt,O,D.x,D.y,D.z,ct,pt,Mt,bt,Ot,oe.data):B.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),F.compressedTexSubImage3D(Rt,O,D.x,D.y,D.z,ct,pt,Mt,bt,oe.data)):F.texSubImage3D(Rt,O,D.x,D.y,D.z,ct,pt,Mt,bt,Ot,oe),F.pixelStorei(F.UNPACK_ROW_LENGTH,Pt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,he),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Oe),F.pixelStorei(F.UNPACK_SKIP_ROWS,xe),F.pixelStorei(F.UNPACK_SKIP_IMAGES,ln),O===0&&H.generateMipmaps&&F.generateMipmap(Rt),ft.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?T.setTextureCube(b,0):b.isData3DTexture?T.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?T.setTexture2DArray(b,0):T.setTexture2D(b,0),ft.unbindTexture()},this.resetState=function(){A=0,w=0,R=null,ft.reset(),Ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Oo?"display-p3":"srgb",e.unpackColorSpace=Jt.workingColorSpace===pr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===fe?ri:ul}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ri?fe:En}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Xg extends Il{}Xg.prototype.isWebGL1Renderer=!0;class Vo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new kt(t),this.near=e,this.far=n}clone(){return new Vo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class qg extends Ee{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class yo extends de{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Pi=new ie,Ic=new ie,Vs=[],Nc=new fi,Yg=new ie,is=new se,ss=new qi;class Nl extends se{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new yo(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Yg)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new fi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Pi),Nc.copy(t.boundingBox).applyMatrix4(Pi),this.boundingBox.union(Nc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new qi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Pi),ss.copy(t.boundingSphere).applyMatrix4(Pi),this.boundingSphere.union(ss)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(is.geometry=this.geometry,is.material=this.material,is.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ss.copy(this.boundingSphere),ss.applyMatrix4(n),t.ray.intersectsSphere(ss)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Pi),Ic.multiplyMatrices(n,Pi),is.matrixWorld=Ic,is.raycast(t,Vs);for(let o=0,a=Vs.length;o<a;o++){const c=Vs[o];c.instanceId=r,c.object=this,e.push(c)}Vs.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new yo(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Wo extends Yi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new kt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Fc=new ie,bo=new zo,Ws=new qi,Xs=new L;class Fl extends Ee{constructor(t=new ae,e=new Wo){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ws.copy(n.boundingSphere),Ws.applyMatrix4(s),Ws.radius+=r,t.ray.intersectsSphere(Ws)===!1)return;Fc.copy(s).invert(),bo.copy(t.ray).applyMatrix4(Fc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let g=f,_=p;g<_;g++){const m=l.getX(g);Xs.fromBufferAttribute(u,m),Oc(Xs,m,c,s,t,e,this)}}else{const f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=f,_=p;g<_;g++)Xs.fromBufferAttribute(u,g),Oc(Xs,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Oc(i,t,e,n,s,r,o){const a=bo.distanceSqToPoint(i);if(a<e){const c=new L;bo.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}class Xo extends Fe{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class qo extends ae{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new L,h=new Wt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[f]/t+1)/2,h.y=(o[f+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new pe(o,3)),this.setAttribute("normal",new pe(a,3)),this.setAttribute("uv",new pe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class $i extends ae{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],p=[];let g=0;const _=[],m=n/2;let d=0;M(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new pe(u,3)),this.setAttribute("normal",new pe(f,3)),this.setAttribute("uv",new pe(p,2));function M(){const v=new L,A=new L;let w=0;const R=(e-t)/n;for(let U=0;U<=r;U++){const S=[],y=U/r,I=y*(e-t)+t;for(let N=0;N<=s;N++){const Z=N/s,P=Z*c+a,G=Math.sin(P),V=Math.cos(P);A.x=I*G,A.y=-y*n+m,A.z=I*V,u.push(A.x,A.y,A.z),v.set(G,R,V).normalize(),f.push(v.x,v.y,v.z),p.push(Z,1-y),S.push(g++)}_.push(S)}for(let U=0;U<s;U++)for(let S=0;S<r;S++){const y=_[S][U],I=_[S+1][U],N=_[S+1][U+1],Z=_[S][U+1];h.push(y,I,Z),h.push(I,N,Z),w+=6}l.addGroup(d,w,0),d+=w}function x(v){const A=g,w=new Wt,R=new L;let U=0;const S=v===!0?t:e,y=v===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,m*y,0),f.push(0,y,0),p.push(.5,.5),g++;const I=g;for(let N=0;N<=s;N++){const P=N/s*c+a,G=Math.cos(P),V=Math.sin(P);R.x=S*V,R.y=m*y,R.z=S*G,u.push(R.x,R.y,R.z),f.push(0,y,0),w.x=G*.5+.5,w.y=V*.5*y+.5,p.push(w.x,w.y),g++}for(let N=0;N<s;N++){const Z=A+N,P=I+N;v===!0?h.push(P,P+1,Z):h.push(P+1,P,Z),U+=3}l.addGroup(d,U,v===!0?1:2),d+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ms extends $i{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new ms(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Yo extends ae{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new pe(r,3)),this.setAttribute("normal",new pe(r.slice(),3)),this.setAttribute("uv",new pe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){const x=new L,v=new L,A=new L;for(let w=0;w<e.length;w+=3)p(e[w+0],x),p(e[w+1],v),p(e[w+2],A),c(x,v,A,M)}function c(M,x,v,A){const w=A+1,R=[];for(let U=0;U<=w;U++){R[U]=[];const S=M.clone().lerp(v,U/w),y=x.clone().lerp(v,U/w),I=w-U;for(let N=0;N<=I;N++)N===0&&U===w?R[U][N]=S:R[U][N]=S.clone().lerp(y,N/I)}for(let U=0;U<w;U++)for(let S=0;S<2*(w-U)-1;S++){const y=Math.floor(S/2);S%2===0?(f(R[U][y+1]),f(R[U+1][y]),f(R[U][y])):(f(R[U][y+1]),f(R[U+1][y+1]),f(R[U+1][y]))}}function l(M){const x=new L;for(let v=0;v<r.length;v+=3)x.x=r[v+0],x.y=r[v+1],x.z=r[v+2],x.normalize().multiplyScalar(M),r[v+0]=x.x,r[v+1]=x.y,r[v+2]=x.z}function h(){const M=new L;for(let x=0;x<r.length;x+=3){M.x=r[x+0],M.y=r[x+1],M.z=r[x+2];const v=m(M)/2/Math.PI+.5,A=d(M)/Math.PI+.5;o.push(v,1-A)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){const x=o[M+0],v=o[M+2],A=o[M+4],w=Math.max(x,v,A),R=Math.min(x,v,A);w>.9&&R<.1&&(x<.2&&(o[M+0]+=1),v<.2&&(o[M+2]+=1),A<.2&&(o[M+4]+=1))}}function f(M){r.push(M.x,M.y,M.z)}function p(M,x){const v=M*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function g(){const M=new L,x=new L,v=new L,A=new L,w=new Wt,R=new Wt,U=new Wt;for(let S=0,y=0;S<r.length;S+=9,y+=6){M.set(r[S+0],r[S+1],r[S+2]),x.set(r[S+3],r[S+4],r[S+5]),v.set(r[S+6],r[S+7],r[S+8]),w.set(o[y+0],o[y+1]),R.set(o[y+2],o[y+3]),U.set(o[y+4],o[y+5]),A.copy(M).add(x).add(v).divideScalar(3);const I=m(A);_(w,y+0,M,I),_(R,y+2,x,I),_(U,y+4,v,I)}}function _(M,x,v,A){A<0&&M.x===1&&(o[x]=M.x-1),v.x===0&&v.z===0&&(o[x]=A/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function d(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yo(t.vertices,t.indices,t.radius,t.details)}}class qn extends Yo{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new qn(t.radius,t.detail)}}class jo extends ae{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new L,u=new L,f=new L;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const _=g/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,M=(s+1)*p+g;o.push(_,m,M),o.push(m,d,M)}this.setIndex(o),this.setAttribute("position",new pe(a,3)),this.setAttribute("normal",new pe(c,3)),this.setAttribute("uv",new pe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jo(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Mn extends Yi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fl,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=No,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ol extends Ee{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new kt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class jg extends Ol{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.groundColor=new kt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const io=new ie,zc=new L,Bc=new L;class $g{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Go,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new Se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;zc.setFromMatrixPosition(t.matrixWorld),e.position.copy(zc),Bc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Bc),e.updateMatrixWorld(),io.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(io),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(io)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Kg extends $g{constructor(){super(new wl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Zg extends Ol{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.shadow=new Kg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Jg{constructor(t,e,n=0,s=1/0){this.ray=new zo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Bo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return To(t,this,n,e),n.sort(Gc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)To(t[s],this,n,e);return n.sort(Gc),n}}function Gc(i,t){return i.distance-t.distance}function To(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)To(s[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Io}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Io);const Qg=12376296,t_=14477548,e_=8020039,n_=4010280,Tn=[];Tn[nn]={top:12965498,edge:10729058,name:"meadow"};Tn[Wi]={top:5012042,edge:3825468,name:"forest"};Tn[ai]={top:11706465,edge:9667662,name:"hills"};Tn[cn]={top:14207142,edge:11904386,name:"hamlet"};Tn[Xn]={top:9277850,edge:7238267,name:"scree"};const Oi=4151890,zl=10475754,i_=4166334,s_=7304833,r_=5067872,qs=16514559,o_=13031142,rs=[4156223,4881221,3563580,5603141],a_=[12091964,11102772],c_=[15261127,14470578,15787990],l_=[10506044,9192502,11754309,7166540],h_=[9146262,10133670,8159625],u_=16771496,Bl=16773304;function _r(i,t){const e=Math.min(255,Math.round((i>>16&255)*t)),n=Math.min(255,Math.round((i>>8&255)*t)),s=Math.min(255,Math.round((i&255)*t));return e<<16|n<<8|s}function Hc(i,t,e){const n=i>>16&255,s=i>>8&255,r=i&255,o=t>>16&255,a=t>>8&255,c=t&255;return Math.round(n+(o-n)*e)<<16|Math.round(s+(a-s)*e)<<8|Math.round(r+(c-r)*e)}const Gl=(i,t)=>_r(Tn[i].top,.94+t*.12),Hl=(i,t)=>_r(Tn[i].edge,.94+t*.1),so=i=>"#"+i.toString(16).padStart(6,"0"),Lt=.42,kl=.17,sr=.055,as=.092,cs=.004,ls=.011;function Pe(i,t){let e=i*374761393+t*2246822519|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function f_(i,t,e){const n=t[0]-i[0],s=t[1]-i[1],r=Math.hypot(n,s)||1;return[i[0]+-s/r*e,i[1]+n/r*e,n,s]}function d_(i,t){const[e,n,s,r]=i,[o,a,c,l]=t,h=s*l-r*c;if(Math.abs(h)<1e-9)return[e,n];const u=((o-e)*l-(a-n)*c)/h;return[e+s*u,n+r*u]}function Vl(i,t,e){const n=[];for(let r=0;r<4;r++)n.push(f_(i[r],i[(r+1)%4],t[r]?e:0));const s=[];for(let r=0;r<4;r++)s.push(d_(n[(r+3)%4],n[r]));return s}class li{constructor(){this.pos=[],this.nrm=[],this.col=[]}get count(){return this.pos.length/3}tri(t,e,n,s,r,o){const a=e[0]-t[0],c=e[1]-t[1],l=e[2]-t[2],h=n[0]-t[0],u=n[1]-t[1],f=n[2]-t[2];let p=c*f-l*u,g=l*h-a*f,_=a*u-c*h;const m=Math.hypot(p,g,_)||1;p/=m,g/=m,_/=m,this.pos.push(t[0],t[1],t[2],e[0],e[1],e[2],n[0],n[1],n[2]),this.nrm.push(p,g,_,p,g,_,p,g,_),ro(this.col,s),ro(this.col,r??s),ro(this.col,o??s)}quad(t,e,n,s,r,o){this.tri(t,e,n,r,r,o),this.tri(t,n,s,r,o,o)}}const $s=new Float32Array(256);for(let i=0;i<256;i++){const t=i/255;$s[i]=t<.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function ro(i,t){i.push($s[t>>16&255],$s[t>>8&255],$s[t&255])}const kc=.16*Lt;function $o(i,t,e,n,s=10){const r=i[e],o=Xt(r),a=qt(r),c=jt(r),l=In(Un[e],t>=6),{mid:h,nx:u,ny:f}=fh(o,a,c,l),[p,g]=Ye(o,a,c),_=[h[0]*Lt,h[1]*Lt],m=[_[0]+u*kc,_[1]+f*kc],d=[p*Lt,g*Lt],M=[];for(let x=0;x<=s;x++){const v=x/s,A=1-v,w=A*A*A,R=3*A*A*v,U=3*A*v*v,S=v*v*v;M.push([w*_[0]+R*m[0]+U*d[0]+S*n[0],w*_[1]+R*m[1]+U*d[1]+S*n[1]])}return M}function Wn(i){let t=0,e=0;for(const n of i){const[s,r]=Ye(Xt(n),qt(n),jt(n));t+=s,e+=r}return[t/i.length*Lt,e/i.length*Lt]}function rr(i,t,e,n,s,r=1){const o=t.length;if(o<2)return;const a=[];for(let c=0;c<o;c++){const l=t[Math.max(0,c-1)],h=t[Math.min(o-1,c+1)];let u=h[0]-l[0],f=h[1]-l[1];const p=Math.hypot(u,f)||1;u/=p,f/=p;const g=n*(1-(1-r)*(c/(o-1)));a.push([-f*g,u*g])}for(let c=0;c<o-1;c++){const l=t[c],h=t[c+1],u=a[c],f=a[c+1],p=[l[0]+u[0],e,l[1]+u[1]],g=[h[0]+f[0],e,h[1]+f[1]],_=[h[0]-f[0],e,h[1]-f[1]],m=[l[0]-u[0],e,l[1]-u[1]];i.tri(p,g,_,s),i.tri(p,_,m,s)}}const Vc=.3*Lt;function Wc(i,t,e,n,s,r,o=14){const a=c=>n*(.78+.42*Pe(r,c%o*37+5));for(let c=0;c<o;c++){const l=c/o*Math.PI*2,h=(c+1)/o*Math.PI*2,u=a(c),f=a(c+1);i.tri([t[0],e,t[1]],[t[0]+Math.cos(h)*f,e,t[1]+Math.sin(h)*f],[t[0]+Math.cos(l)*u,e,t[1]+Math.sin(l)*u],s)}}function or(i,t,e,n,s,r=10){for(let o=0;o<r;o++){const a=o/r*Math.PI*2,c=(o+1)/r*Math.PI*2;i.tri([t[0],e,t[1]],[t[0]+Math.cos(c)*n,e,t[1]+Math.sin(c)*n],[t[0]+Math.cos(a)*n,e,t[1]+Math.sin(a)*n],s)}}function p_(i,t={}){const e=i.board,n=new li,s=new li,r=[],o=[0,0,0,0],a=[!1,!1,!1,!1],c=[!1,!1,!1,!1];for(const h of e.filled){const u=Xt(h),f=qt(h),p=jt(h),g=e.biome.get(h),_=e.owner.get(h),m=i.jitter.get(h)??.5,M=e.sealed.has(e.find(h))?Math.min(1,m+.5):m,x=Vi(u,f,p).map(([y,I])=>{const[N,Z]=qe(y,I);return[N*Lt,Z*Lt]});De(u,f,p,o);for(let y=0;y<4;y++){const I=o[(y+1)%4],N=e.filled.has(I);a[y]=!(N&&e.owner.get(I)===_),c[y]=!N}const v=Vl(x,a,kl*Lt),A=Gl(g,M),w=Hl(g,M),R=_r(e_,.9+m*.2),U=v.map(y=>[y[0],0,y[1]]);n.tri(U[0],U[2],U[1],A),n.tri(U[0],U[3],U[2],A);let S=!1;for(let y=0;y<4;y++){if(!a[y])continue;S=!0;const I=y,N=(y+1)%4;n.quad([v[I][0],0,v[I][1]],[v[N][0],0,v[N][1]],[x[N][0],-.07,x[N][1]],[x[I][0],-.07,x[I][1]],w,w)}if(S){const y=x.map(I=>[I[0],-.07,I[1]]);n.tri(y[0],y[2],y[1],R),n.tri(y[0],y[3],y[2],R)}for(let y=0;y<4;y++){if(!c[y])continue;const I=y,N=(y+1)%4;n.quad([x[I][0],-.07,x[I][1]],[x[N][0],-.07,x[N][1]],[x[N][0],-.3,x[N][1]],[x[I][0],-.3,x[I][1]],R,n_)}t.noProps||g_(r,h,g,v,m)}const l=[];for(const h of e.tiles){if(h.ports.size===0)continue;const u=Wn(h.cells);for(const f of h.ports){const p=$o(h.cells,h.orient,f,u);l.push(p),rr(n,p,cs,as,Oi),rr(s,p,ls,sr,16777215)}h.ports.size===1?(Wc(n,u,cs,Vc+as*.7,Oi,h.cells[0]),Wc(s,u,ls,Vc,16777215,h.cells[0])):(or(n,u,cs,as,Oi),or(s,u,ls,sr,16777215))}for(const[,h]of e.landmarks){if(!e.filled.has(h))continue;const[u,f]=Ye(Xt(h),qt(h),jt(h));r.push({type:Xl,x:u*Lt,y:0,z:f*Lt,s:1,rot:Pe(h,3)*Math.PI*2,tint:Pe(h,4),biome:e.biome.get(h)})}return{land:n,water:s,props:r,branches:l}}function m_(i,t,e){const n=Pe(t,e*7+1),s=Pe(t,e*7+2),r=Pe(t,e*7+3),o=n<.5?[i[0],i[1],i[2]]:[i[0],i[2],i[3]];let a=s,c=r;a+c>1&&(a=1-a,c=1-c);const l=o[0][0]+(o[1][0]-o[0][0])*a+(o[2][0]-o[0][0])*c,h=o[0][1]+(o[1][1]-o[0][1])*a+(o[2][1]-o[0][1])*c,u=(i[0][0]+i[1][0]+i[2][0]+i[3][0])/4,f=(i[0][1]+i[1][1]+i[2][1]+i[3][1])/4;return[u+(l-u)*.78,f+(h-f)*.78]}const Ao=0,wo=1,Ks=2,Wl=3,Ro=4,Xl=5;function g_(i,t,e,n,s){const r=(o,a,c)=>{const[l,h]=m_(n,t,a);i.push({type:o,key:t,x:l,y:0,z:h,s:c,rot:Pe(t,a*13+5)*Math.PI*2,tint:Pe(t,a*13+6)})};switch(e){case Wi:{const o=3+Math.floor(s*2.6);for(let a=0;a<o;a++){const c=Pe(t,a*31+9)<.3;r(c?wo:Ao,a,.72+Pe(t,a*17)*.5)}break}case nn:{s<.22&&r(wo,0,.7+s),s>.55&&r(Ro,1,.7+Pe(t,3)*.6);break}case ai:{r(Ks,0,.55+Pe(t,19)*.7),s>.45&&r(Ks,1,.55+Pe(t,38)*.7),s>.35&&r(Ro,5,.6+s*.5);break}case cn:{const o=1+(s>.62?1:0);for(let a=0;a<o;a++)r(Wl,a*2,.85+Pe(t,a*23)*.35);s<.4&&r(Ao,6,.6);break}case Xn:{const o=1+Math.floor(s*2.4);for(let a=0;a<o;a++)r(Ks,a,.6+Pe(t,a*19)*.9);break}}}function __(i,t,e){const n=new li,s=new li,r=[],o=[0,0,0,0],a=new Set(i);for(let c=0;c<i.length;c++){const l=i[c],h=Xt(l),u=qt(l),f=jt(l),p=Vi(h,u,f).map(([x,v])=>{const[A,w]=qe(x,v);return[A*Lt,w*Lt]});De(h,u,f,o);const g=[!1,!1,!1,!1];for(let x=0;x<4;x++)g[x]=!a.has(o[(x+1)%4]);const _=Vl(p,g,kl*Lt),m=Gl(t.biomes[c],.55),d=Hl(t.biomes[c],.55),M=_.map(x=>[x[0],0,x[1]]);n.tri(M[0],M[2],M[1],m),n.tri(M[0],M[3],M[2],m);for(let x=0;x<4;x++){if(!g[x])continue;const v=x,A=(x+1)%4;n.quad([_[v][0],0,_[v][1]],[_[A][0],0,_[A][1]],[p[A][0],-.07,p[A][1]],[p[v][0],-.07,p[v][1]],d,d),r.push([p[v],p[A]])}}if(t.ports.size){const c=Wn(i);for(const l of t.ports){const h=$o(i,e,l,c);rr(n,h,cs,as,Oi),rr(s,h,ls,sr,16777215)}or(n,c,cs,as,Oi),or(s,c,ls,sr*(t.ports.size===1?1.5:1),16777215)}return{buf:n,water:s,outline:r}}function x_(i,t,e,n){const s=new li;for(const[r,o]of i){let a=o[0]-r[0],c=o[1]-r[1];const l=Math.hypot(a,c)||1;a/=l,c/=l;const h=[r[0]-c*e,t,r[1]+a*e],u=[o[0]-c*e,t,o[1]+a*e],f=[o[0]+c*e,t,o[1]-a*e],p=[r[0]+c*e,t,r[1]-a*e];s.tri(h,u,f,n),s.tri(h,f,p,n)}return s}const Ge=i=>new kt(i).convertSRGBToLinear();function v_(){const i=new $i(.022,.032,.15,5,1);return i.translate(0,.075,0),i}function M_(){const i=new ms(.115,.42,6,1);return i.translate(0,.33,0),i}function S_(){const i=new qn(.15,0);return i.scale(1,.86,1),i.translate(0,.27,0),i}function E_(){const i=new qn(.1,0);return i.scale(1.25,.72,1),i.translate(0,.05,0),i}function y_(){const i=new qn(.075,0);return i.scale(1.2,.8,1.1),i.translate(0,.05,0),i}function b_(){const i=new yn(.2,.13,.16);return i.translate(0,.065,0),i}function T_(){const i=new ms(.16,.11,4,1);return i.rotateY(Math.PI/4),i.translate(0,.185,0),i}function A_(){const i=new $i(.013,.016,.5,5,1);return i.translate(0,.25,0),i}function w_(){const i=new ae;return i.setAttribute("position",new de(new Float32Array([.013,.5,0,.013,.33,0,.25,.43,.04]),3)),i.computeVertexNormals(),i}function R_(i,t,e){const n=new li,s=17,r=[0,.2,.44,.68,.87,1],o=[1,.83,.62,.4,.19,.035],a=v=>{for(let A=1;A<r.length;A++)if(v<=r[A]){const w=(v-r[A-1])/(r[A]-r[A-1]);return o[A-1]+(o[A]-o[A-1])*w}return o[o.length-1]},c=v=>{const A=Math.sin(v*127.1+311.7)*43758.5453;return A-Math.floor(A)},l=v=>(v%s+s)%s,h=(v,A)=>(.74+.5*c(l(A)))*(.93+.15*c(l(A)+v*17)),u=v=>.55+.26*(c(l(v)+31)-.5),f=4,p=[0,.14,.28,.55,.55,.72,.88,1],g=(v,A)=>v===f-1||v===f?u(A):p[v],_=.62,m=v=>{if(e==null)return 0;let A=l(v)/s*Math.PI*2-e;for(;A>Math.PI;)A-=Math.PI*2;for(;A<-Math.PI;)A+=Math.PI*2;return Math.abs(A)>=_?0:.5+.5*Math.cos(Math.PI*Math.abs(A)/_)},d=(v,A)=>{const w=l(A)/s*Math.PI*2,R=g(v,A),U=m(A)*(1-R),S=R*(1-.4*U),y=i*a(S)*(v===p.length-1?1:h(v,A))*(1-.52*U);return[Math.cos(w)*y,t*S,Math.sin(w)*y]},M=(v,A)=>v>=f?Hc(qs,o_,c(A*3+v)*.5):Hc(r_,s_,c(A*7+v));for(let v=0;v<p.length-1;v++)for(let A=0;A<s;A++){const w=d(v,A),R=d(v,A+1),U=d(v+1,A+1),S=d(v+1,A),y=M(v,A),I=M(v,A+1),N=M(v+1,A+1),Z=M(v+1,A);n.tri(w,U,R,y,N,I),n.tri(w,S,U,y,Z,N)}const x=[0,t*1.03,0];for(let v=0;v<s;v++)n.tri(d(p.length-1,v+1),d(p.length-1,v),x,qs,qs,qs);return n}const C_=13148787,P_=10122054,L_=6121333,D_=15129798;function U_(){const i=new vn,t=new Mn({color:Ge(C_)}),e=new Mn({color:Ge(P_)}),n=.2;for(const a of[-.06,.06]){const c=new se(new jo(n,.018,4,14),t);c.position.z=a,c.castShadow=!0,i.add(c)}const s=new yn(n*1.9,.02,.02);for(let a=0;a<3;a++){const c=new se(s,t);c.rotation.z=a/3*Math.PI,i.add(c)}const r=new yn(.06,.026,.15);for(let a=0;a<8;a++){const c=a/8*Math.PI*2,l=new se(r,e);l.position.set(Math.cos(c)*(n-.015),Math.sin(c)*(n-.015),0),l.rotation.z=c,l.castShadow=!0,i.add(l)}const o=new se(new $i(.018,.018,.19,6),t);return o.rotation.x=Math.PI/2,i.add(o),i}function I_(){const i=new vn,t=new se(new yn(.3,.24,.24),new Mn({color:Ge(D_)}));t.position.y=.12,t.castShadow=!0,i.add(t);const e=new se(new ms(.245,.16,4),new Mn({color:Ge(L_)}));return e.rotation.y=Math.PI/4,e.position.y=.31,e.castShadow=!0,i.add(e),i}class mn{constructor(t,e,n,{shadow:s=!0,side:r}={}){this.geo=e,this.mat=new Mn({color:n??16777215,side:r??Sn}),this.scene=t,this.mesh=null,this.shadow=s,this.cap=0}set(t,e=null){this.list=t;const n=t.length;if(n>this.cap&&(this.mesh&&(this.scene.remove(this.mesh),this.mesh.dispose()),this.cap=Math.max(64,Math.ceil(n*1.6)),this.mesh=new Nl(this.geo,this.mat,this.cap),this.mesh.castShadow=this.shadow,this.mesh.instanceMatrix.setUsage(pl),this.mesh.instanceColor=new yo(new Float32Array(this.cap*3),3),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)),!this.mesh)return;const s=new ie,r=new ui,o=new L,a=new L,c=new kt;for(let l=0;l<n;l++){const h=t[l];o.set(h.x,h.y,h.z),r.setFromAxisAngle(N_,h.rot);const u=e?h.s*e(h):h.s;a.set(u,u,u),s.compose(o,r,a),this.mesh.setMatrixAt(l,s),c.set(h.colour??16777215).convertSRGBToLinear(),this.mesh.instanceColor.setXYZ(l,c.r,c.g,c.b)}this.mesh.count=n,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor.needsUpdate=!0}}const N_=new L(0,1,0),Xc=.34,qc=.22,F_=`
  varying vec3 vPos;
  #include <common>
  #include <fog_pars_vertex>
  void main() {
    vPos = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,O_=`
  uniform float uTime;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  varying vec3 vPos;
  #include <common>
  #include <fog_pars_fragment>
  void main() {
    float w = sin(vPos.x * 4.6 + uTime * 1.3) * 0.5 + sin(vPos.z * 3.9 - uTime * 1.05) * 0.5;
    vec3 c = mix(uDeep, uShallow, 0.45 + 0.32 * w);
    float glint = sin(vPos.x * 26.0 - uTime * 2.6) * sin(vPos.z * 21.0 + uTime * 1.7);
    c += smoothstep(0.9, 1.0, glint) * 0.4;
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;class z_{constructor(t){this.canvas=t,this.renderer=new Il({canvas:t,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)),this.renderer.outputColorSpace=fe,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=nl,this.scene=new qg,this.scene.background=H_(),this.scene.fog=new Vo(Ge(t_),26,62),this.camera=new We(32,1,.5,200),this.scene.add(new jg(Ge(Qg),Ge(7302744),1.3)),this.sun=new Zg(Ge(16774109),2.3),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.bias=-.0012,this.sun.shadow.normalBias=.02,this.scene.add(this.sun),this.scene.add(this.sun.target),this.haze=new se(new qo(1,72),new oi({color:Ge(12571342),transparent:!0,opacity:.9,alphaMap:B_(),depthWrite:!1})),this.haze.rotation.x=-Math.PI/2,this.haze.position.y=-.55,this.scene.add(this.haze),this.landMat=new Mn({vertexColors:!0}),this.land=new se(new ae,this.landMat),this.land.castShadow=!0,this.land.receiveShadow=!0,this.land.frustumCulled=!1,this.scene.add(this.land),this.waterUniforms={...yl.clone(et.fog),uTime:{value:0},uShallow:{value:Ge(zl)},uDeep:{value:Ge(i_)}};const e=new Vn({uniforms:this.waterUniforms,fog:!0,vertexShader:F_,fragmentShader:O_});this.water=new se(new ae,e),this.water.frustumCulled=!1,this.water.renderOrder=2,this.scene.add(this.water),this.mountain=new se(new ae,new Mn({vertexColors:!0})),this.mountain.castShadow=!0,this.mountain.receiveShadow=!0,this.mountain.visible=!1,this.scene.add(this.mountain),this.props={trunk:new mn(this.scene,v_(),6967098),conifer:new mn(this.scene,M_()),broadleaf:new mn(this.scene,S_()),rock:new mn(this.scene,E_()),bush:new mn(this.scene,y_()),houseBody:new mn(this.scene,b_()),houseRoof:new mn(this.scene,T_()),pole:new mn(this.scene,A_(),9072463),pennant:new mn(this.scene,w_(),16777215,{side:Je})},this.ghost=new se(new ae,new Mn({vertexColors:!0})),this.ghost.frustumCulled=!1,this.ghost.renderOrder=3,this.ghost.visible=!1,this.scene.add(this.ghost),this.ghostWater=new se(new ae,e),this.ghostWater.frustumCulled=!1,this.ghostWater.renderOrder=4,this.ghostWater.visible=!1,this.scene.add(this.ghostWater),this.rimMat=new oi({color:Ge(Bl),transparent:!0,opacity:.9,depthWrite:!1}),this.rim=new se(new ae,this.rimMat),this.rim.frustumCulled=!1,this.rim.renderOrder=5,this.rim.visible=!1,this.scene.add(this.rim),this.hintMat=new Wo({color:Ge(u_),size:.5,map:G_(),transparent:!0,opacity:.5,depthWrite:!1,blending:us,sizeAttenuation:!0});const n=new ae;n.setAttribute("position",new de(new Float32Array(3),3)),this.hints=new Fl(n,this.hintMat),this.hints.frustumCulled=!1,this.hints.renderOrder=1,this.scene.add(this.hints),this.flashMat=new oi({color:16777215,transparent:!0,opacity:0,blending:us,depthWrite:!1}),this.flash=new se(new ae,this.flashMat),this.flash.frustumCulled=!1,this.flash.renderOrder=6,this.flash.visible=!1,this.scene.add(this.flash),this.flashT=0,this.target=new L(0,0,0),this.wantTarget=new L(0,0,0),this.dist=22,this.wantDist=22,this.azimuth=-.62,this.polar=.74,this.plane=new Ln(new L(0,1,0),0),this.ray=new Jg,this._v=new L}resize(t,e){var r;const n=devicePixelRatio||1;this.narrow=t<720,this.renderer.setPixelRatio(Math.min(n,this.narrow&&n>=3?1.6:2));const s=this.narrow?1024:2048;this.sun.shadow.mapSize.x!==s&&(this.sun.shadow.mapSize.setScalar(s),(r=this.sun.shadow.map)==null||r.dispose(),this.sun.shadow.map=null),this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.lastBounds&&this.frame(this.lastBounds)}setMountain(t,e,n=null,s=.88,r=1.6){Qn(this.mountain.geometry,R_(s,r,n)),this.mountain.position.set(t,0,e),this.mountain.visible=!0,this.peakY=r*1.03}setSites(t){if(this.siteRoot||(this.siteRoot=new vn,this.scene.add(this.siteRoot)),this._siteSig!==JSON.stringify(t)){this._siteSig=JSON.stringify(t),this.siteRoot.clear(),this.wheels=[];for(const e of t){let n=e.hx-e.x,s=e.hz-e.z;const r=Math.hypot(n,s)||1;n/=r,s/=r;const o=new vn;o.position.set(e.x+n*.3,.15,e.z+s*.3),o.rotation.y=Math.atan2(-s,n);const a=U_();o.add(a),this.siteRoot.add(o),this.wheels.push({wheel:a,running:e.done});const c=I_();c.position.set(e.x+n*.62-s*.3,0,e.z+s*.62+n*.3),c.rotation.y=Math.atan2(n,s),this.siteRoot.add(c)}}}setGarden(t,e){Qn(this.land.geometry,t.land),Qn(this.water.geometry,t.water);const n={trunk:[],conifer:[],broadleaf:[],rock:[],bush:[],houseBody:[],houseRoof:[],pole:[],pennant:[]};for(const s of t.props)switch(s.type){case Ao:n.trunk.push(s),n.conifer.push({...s,colour:rs[Math.floor(s.tint*rs.length)%rs.length]});break;case wo:n.trunk.push(s),n.broadleaf.push({...s,colour:s.tint>.86?a_[s.tint>.94?1:0]:rs[Math.floor(s.tint*4)%4]});break;case Ks:n.rock.push({...s,colour:h_[Math.floor(s.tint*3)%3]});break;case Ro:n.bush.push({...s,colour:rs[Math.floor(s.tint*4)%4]});break;case Wl:n.houseBody.push({...s,colour:c_[Math.floor(s.tint*3)%3]}),n.houseRoof.push({...s,colour:l_[Math.floor(s.tint*4)%4]});break;case Xl:n.pole.push(s),n.pennant.push({...s,colour:_r(Tn[s.biome].top,1.3)});break}this.propLists=n,this._writeProps(),e&&this.fitShadow(e)}growTile(t){this.grown={cells:new Set(t),t:0}}_writeProps(){const t=this.grown,e=t?n=>{if(!t.cells.has(n.key))return 1;const s=Math.max(0,Math.min(1,(t.t-(n.tint??0)*qc)/Xc));return s>=1?1:s*s*(3-2*s)*(1+.16*Math.sin(s*Math.PI))}:null;for(const n of Object.keys(this.propLists))this.props[n].set(this.propLists[n],e)}fitShadow({cx:t,cz:e,r:n}){const s=this.sun.shadow.camera,r=n+3;s.left=-r,s.right=r,s.top=r,s.bottom=-r,s.far=r*4+34,s.updateProjectionMatrix(),this.sunRadius=r,this.haze.position.set(t,-.55,e),this.haze.scale.setScalar(n+7)}setHints(t){const e=new Float32Array(Math.max(1,t.length)*3);for(let n=0;n<t.length;n++)e[n*3]=t[n][0],e[n*3+1]=.16,e[n*3+2]=t[n][1];this.hints.geometry.setAttribute("position",new de(e,3)),this.hints.geometry.setDrawRange(0,t.length),this.hints.geometry.computeBoundingSphere()}setGhost(t){if(!t){this.ghost.visible=!1,this.ghostWater.visible=!1,this.rim.visible=!1;return}Qn(this.ghost.geometry,t.buf),Qn(this.ghostWater.geometry,t.water),Qn(this.rim.geometry,t.rim),this.ghost.visible=!0,this.ghostWater.visible=t.water.count>0,this.rim.visible=!0}playFlash(t){Qn(this.flash.geometry,t),this.flash.visible=!0,this.flashT=1}frame(t,e=!1){const{cx:n,cz:s,r}=t;this.lastBounds=t;const o=Math.PI/2-this.polar,a=Math.tan(this.camera.fov*Math.PI/360),c=this.peakY??1,l=this.narrow?.35:.9,h=r*Math.sin(o)+c*.5*Math.cos(o)+l,u=r+l,f=Math.max(this.narrow?7:9,Math.max(h/a,u/(a*this.camera.aspect))*.96);if(this.userFramed){f>this.wantDist&&(this.wantDist=f);return}this.wantTarget.set(n,c*.22,s),this.wantDist=f,e&&(this.target.copy(this.wantTarget),this.dist=this.wantDist)}releaseCamera(){this.userFramed=!0}resetCamera(){this.userFramed=!1}orbit(t,e){this.azimuth-=t*.006,this.polar=Math.min(1.42,Math.max(.28,this.polar-e*.005))}spin(t){this.azimuth+=t}zoom(t){this.userFramed=!0,this.wantDist=Math.min(90,Math.max(4,this.wantDist*t))}pan(t,e){this.userFramed=!0;const n=this.dist*.0016,s=Math.cos(this.azimuth),r=Math.sin(this.azimuth);this.wantTarget.x+=(-t*s-e*r)*n,this.wantTarget.z+=(t*r-e*s)*n}updateCamera(t){var a;const e=1-Math.pow(.0015,t);this.target.lerp(this.wantTarget,e),this.dist+=(this.wantDist-this.dist)*e;const n=Math.sin(this.polar);this.camera.position.set(this.target.x+this.dist*n*Math.sin(this.azimuth),this.target.y+this.dist*Math.cos(this.polar),this.target.z+this.dist*n*Math.cos(this.azimuth)),this.camera.lookAt(this.target);const s=((a=this.lastBounds)==null?void 0:a.r)??6;this.scene.fog.near=Math.max(3,this.dist-s*.9),this.scene.fog.far=this.scene.fog.near+s*1.9+30;const r=this.sunRadius??10,o=this.azimuth+.84;this.sun.position.set(this.target.x+r*.8*Math.sin(o),this.target.y+r*1.15+5,this.target.z+r*.8*Math.cos(o)),this.sun.target.position.copy(this.target),this.sun.target.updateMatrixWorld()}pick(t,e){this.ray.setFromCamera({x:t,y:e},this.camera),this.plane.constant=0;const n=this.ray.ray.intersectPlane(this.plane,this._v);if(!n)return null;const[s,r,o]=Kc(n.x/Lt,n.z/Lt);return{cell:en(s,r,o),x:n.x,z:n.z}}project(t,e,n){return this._v.set(t,e,n).project(this.camera),this._v}render(t,e){this.waterUniforms.uTime.value=e,this.grown&&(this.grown.t+=t,this.grown.t>Xc+qc&&(this.grown=null),this._writeProps()),this.hintMat.opacity=.34+.2*Math.sin(e*1.6);for(const n of this.wheels??[])n.running&&(n.wheel.rotation.z-=t*1.5);this.rimMat.opacity=.62+.3*Math.sin(e*3.4),this.flashT>0&&(this.flashT=Math.max(0,this.flashT-t*1.15),this.flashMat.opacity=Math.sin(Math.min(1,this.flashT)*Math.PI)*.5,this.flash.visible=this.flashT>0),this.renderer.render(this.scene,this.camera)}}function B_(){const i=document.createElement("canvas");i.width=i.height=128;const t=i.getContext("2d"),e=t.createRadialGradient(64,64,6,64,64,64);return e.addColorStop(0,"#fff"),e.addColorStop(.45,"#fff"),e.addColorStop(1,"#000"),t.fillStyle=e,t.fillRect(0,0,128,128),new Xo(i)}function G_(){const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.18,"rgba(255,246,214,0.85)"),e.addColorStop(.55,"rgba(255,232,168,0.22)"),e.addColorStop(1,"rgba(255,232,168,0)"),t.fillStyle=e,t.fillRect(0,0,64,64);const n=new Xo(i);return n.colorSpace=fe,n}function H_(){const i=document.createElement("canvas");i.width=4,i.height=256;const t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,256);e.addColorStop(0,"#9fc4dc"),e.addColorStop(.45,"#c9dfe8"),e.addColorStop(.78,"#e4eee6"),e.addColorStop(1,"#eef1e4"),t.fillStyle=e,t.fillRect(0,0,4,256);const n=new Xo(i);return n.colorSpace=fe,n}function Qn(i,t){i.setAttribute("position",new de(new Float32Array(t.pos),3)),i.setAttribute("normal",new de(new Float32Array(t.nrm),3)),i.setAttribute("color",new de(new Float32Array(t.col),3)),i.computeBoundingSphere()}const Ys=i=>new kt(i).convertSRGBToLinear();function k_(){const i=new ae,t=new Float32Array([0,0,0,-.16,.05,-.07,-.13,0,.04,0,0,0,.13,0,.04,.16,.05,-.07]);return i.setAttribute("position",new de(t,3)),i.computeVertexNormals(),i}function Li(i,t,e){const n=new qn(1,0);return n.scale(i,t,e),n}function V_(){const i=new qn(1,0);return i.scale(.055,.03,.13),i}class gn{constructor(t,e,n,s){this.mesh=new Nl(e,n,s),this.mesh.frustumCulled=!1,this.mesh.count=0,this.mesh.instanceMatrix.setUsage(pl),t.add(this.mesh),this.m=new ie,this.q=new ui,this.p=new L,this.s=new L,this.n=0}begin(){this.n=0}put(t,e,n,s,r,o,a){this.n>=this.mesh.instanceMatrix.count||(this.p.set(t,e,n),this.q.setFromAxisAngle(W_,s),this.s.set(r,o??r,a??r),this.m.compose(this.p,this.q,this.s),this.mesh.setMatrixAt(this.n++,this.m))}end(){this.mesh.count=this.n,this.mesh.instanceMatrix.needsUpdate=!0}}const W_=new L(0,1,0);function X_(i){const t=r=>`${r[0].toFixed(3)},${r[1].toFixed(3)}`,e=new Map;i.forEach((r,o)=>{for(const a of[r[0],r[r.length-1]]){const c=t(a);e.has(c)||e.set(c,[]),e.get(c).push(o)}});const n=new Set,s=[];for(let r=0;r<i.length;r++){if(n.has(r))continue;n.add(r);let o=i[r].slice();for(let a=0;a<60;a++){const c=t(o[o.length-1]),l=(e.get(c)??[]).find(f=>!n.has(f));if(l===void 0)break;n.add(l);const h=i[l],u=t(h[0])===c?h:h.slice().reverse();o=o.concat(u.slice(1))}o.length>=8&&s.push(o)}return s.sort((r,o)=>o.length-r.length),s}const q_=[{key:"rabbit",on:"meadow",size:[.03,.03,.042],colour:12167315,head:13483432,n:3,cap:4,hop:.05,speed:.5,every:26},{key:"fox",on:"meadow",size:[.032,.03,.075],colour:12873786,head:14191182,n:1,cap:2,hop:.012,speed:.42,every:52},{key:"boar",on:"forest",size:[.05,.045,.09],colour:5523262,head:6969933,n:2,cap:3,hop:.008,speed:.26,every:38},{key:"goat",on:"stone",size:[.036,.04,.058],colour:14999250,head:13287342,n:3,cap:4,hop:.02,speed:.3,every:32},{key:"cow",on:"meadow",size:[.055,.05,.095],colour:14274496,head:9071186,n:2,cap:3,hop:.004,speed:.16,every:44},{key:"duck",on:"water",size:[.022,.02,.036],colour:15788760,head:5073734,n:4,cap:5,hop:.006,speed:.18,every:30}];class Y_{constructor(t){this.root=new vn,t.add(this.root);const e=(r,o={})=>new Mn({color:Ys(r),...o});this.birds=new gn(this.root,k_(),new oi({color:Ys(4871520),side:Je,transparent:!0,opacity:.7}),9),this.deer=new gn(this.root,Li(.05,.045,.1),e(11106379),6),this.deerHead=new gn(this.root,Li(.03,.03,.035),e(12159580),6),this.sheep=new gn(this.root,Li(.05,.045,.062),e(15986660),14),this.kayak=new gn(this.root,V_(),e(14245951),2),this.paddler=new gn(this.root,Li(.032,.045,.032),e(4157324),2),this.smoke=new gn(this.root,new qn(1,0),new oi({color:Ys(15922418),transparent:!0,opacity:.2,depthWrite:!1}),44),this.smoke.mesh.renderOrder=5,this.critters=q_.map(r=>({spec:r,body:new gn(this.root,Li(r.size[0],r.size[1],r.size[2]),e(r.colour),r.cap),head:r.head?new gn(this.root,Li(r.size[0]*.6,r.size[1]*.6,r.size[1]*.7),e(r.head),r.cap):null,party:null,at:5+Math.random()*14}));const n=90,s=new ae;s.setAttribute("position",new de(new Float32Array(n*3),3)),this.motes=new Fl(s,new Wo({color:Ys(16774088),size:.045,transparent:!0,opacity:.55,depthWrite:!1,blending:us})),this.motes.frustumCulled=!1,this.root.add(this.motes),this.moteHome=[],this.moteN=n,this.reset()}reset(){this.flock=null,this.flockAt=6,this.deerParty=null,this.deerAt=9,this.boat=null,this.boatAt=4,this.flocks=[],this.sheepSpots=[],this.chimneys=[],this.rivers=[],this.forest=[],this.grazing=[],this.stone=[],this.meadow=[],this.water=[];for(const t of this.critters??[])t.party=null,t.at=5+Math.random()*14;this.t=0}sync(t,e=[]){const n=t.board,s=r=>{const[o,a]=Ye(Xt(r),qt(r),jt(r));return[o*Lt,0,a*Lt]};this.forest=[],this.grazing=[],this.chimneys=[],this.stone=[],this.meadow=[];for(const r of n.filled){const o=n.biome.get(r);o===Wi?this.forest.push(s(r)):o===nn||o===ai?this.grazing.push(s(r)):o===cn&&this.chimneys.push(s(r)),o===nn?this.meadow.push(s(r)):(o===Xn||o===ai)&&this.stone.push(s(r))}this.rivers=X_(e),this.water=[];for(const r of n.tiles){if(r.ports.size!==1)continue;const[o,a]=Wn(r.cells);this.water.push([o,.02,a])}if(this.grazing.length>3)for(this.sheepSpots=this.sheepSpots.filter(r=>this.grazing.some(o=>Math.abs(o[0]-r.x)<.01&&Math.abs(o[2]-r.z)<.01));this.sheepSpots.length<Math.min(2,Math.floor(this.grazing.length/8));){const r=this.grazing[Math.floor(Math.random()*this.grazing.length)];this.sheepSpots.push({x:r[0],y:r[1],z:r[2],n:3+Math.floor(Math.random()*3),ph:Math.random()*9})}this.moteHome=[];for(let r=0;r<this.moteN;r++){const o=this.forest.length?this.forest[Math.floor(Math.random()*this.forest.length)]:null;this.moteHome.push(o?[o[0],o[1],o[2]]:null)}}celebrate(t){var e;t.joined>0&&(this.boatAt=Math.min(this.boatAt,2)),(e=t.announce)!=null&&e.length&&(this.flockAt=Math.min(this.flockAt,2.5))}update(t,e,n){this.t=e,this._birds(t,e),this._deer(t,e),this._sheep(e),this._boat(t,e),this._critters(t,e),this._smoke(e),this._motes(e)}_birds(t,e){if(this.birds.begin(),this.flock){const n=this.flock,s=2.4;n.x+=n.vx*s*t,n.z+=n.vz*s*t,n.life+=t;const r=Math.atan2(n.vx,n.vz);for(let o=0;o<n.n;o++){const a=o*.55,c=(o%2?1:-1)*Math.ceil(o/2)*.42,l=n.x-n.vx*a+-n.vz*c,h=n.z-n.vz*a+n.vx*c,u=1+Math.sin(e*7+o*1.7)*.35;this.birds.put(l,n.y+Math.sin(e*.7+o)*.12,h,r,1,u,1)}n.life>26&&(this.flock=null)}else if(this.flockAt-=t,this.flockAt<=0){const n=Math.random()*Math.PI*2,s=16+Math.random()*8,r=Math.cos(n)*s,o=Math.sin(n)*s;this.flock={x:r,z:o,y:4.4+Math.random()*2.6,vx:-r/s,vz:-o/s,n:3+Math.floor(Math.random()*4),life:0},this.flockAt=22+Math.random()*26}this.birds.end()}_deer(t,e){if(this.deer.begin(),this.deerHead.begin(),this.deerParty){const n=this.deerParty;n.life+=t;const s=Math.min(1,n.life*2,Math.max(0,(13-n.life)*.7));for(let r=0;r<n.n;r++){const o=Math.sin(e*.5+n.ph+r*2.1),a=Math.cos(n.dir+r*1.9)*(.12+.05*o),c=Math.sin(n.dir+r*1.9)*(.12+.05*o),l=n.dir+o*.5,h=n.y+.055;this.deer.put(n.x+a,h,n.z+c,l,s,s,s),this.deerHead.put(n.x+a+Math.sin(l)*.085,h+.035+Math.sin(e*1.3+n.ph)*.012,n.z+c+Math.cos(l)*.085,l,s,s,s)}n.life>14&&(this.deerParty=null)}else{this.deerAt-=t;const n=this.forest.length?this.forest:this.grazing;if(this.deerAt<=0&&n.length){const s=n[Math.floor(Math.random()*n.length)];this.deerParty={x:s[0],y:s[1],z:s[2],n:1+(Math.random()<.5?1:0),life:0,dir:Math.random()*Math.PI*2,ph:Math.random()*8},this.deerAt=16+Math.random()*22}}this.deer.end(),this.deerHead.end()}_sheep(t){this.sheep.begin();for(const e of this.sheepSpots)for(let n=0;n<e.n;n++){const s=e.ph+n*2.3,r=.11+.05*Math.sin(t*.13+s);this.sheep.put(e.x+Math.cos(s+t*.035)*r,e.y+.045,e.z+Math.sin(s+t*.035)*r,s,1,1,1)}this.sheep.end()}_boat(t,e){if(this.kayak.begin(),this.paddler.begin(),this.boat){const n=this.boat.path;this.boat.u+=t*1.6;const s=Math.floor(this.boat.u);if(s>=n.length-1)this.boat=null;else{const r=this.boat.u-s,o=n[s],a=n[s+1],c=o[0]+(a[0]-o[0])*r,l=o[1]+(a[1]-o[1])*r,h=.03,u=Math.atan2(a[0]-o[0],a[1]-o[1]),f=Math.sin(e*3.1)*.008;this.kayak.put(c,h+f,l,u,1,1,1),this.paddler.put(c,h+.045+f,l,u+Math.sin(e*4.2)*.28,1,1,1)}}else if(this.boatAt-=t,this.boatAt<=0&&this.rivers.length){const n=this.rivers[Math.floor(Math.random()*Math.min(3,this.rivers.length))];this.boat={path:n,u:0},this.boatAt=20+Math.random()*28}this.kayak.end(),this.paddler.end()}_critters(t,e){var n,s;for(const r of this.critters){const o=r.spec;r.body.begin(),(n=r.head)==null||n.begin();const a=this[o.on]??[];if(r.party){const c=r.party;c.life+=t;const l=Math.min(1,c.life*1.6,Math.max(0,(c.span-c.life)*.5));for(const h of c.who){const u=h.a+e*o.speed*h.w,f=c.x+Math.cos(u)*h.r,p=c.z+Math.sin(u)*h.r,g=Math.abs(Math.sin(e*3.4+h.b))*o.hop,_=u+(h.w>0?Math.PI/2:-Math.PI/2);r.body.put(f,c.y+g,p,_,l),r.head&&r.head.put(f+Math.cos(_)*o.size[2]*.85,c.y+g+o.size[1]*.55,p+Math.sin(_)*o.size[2]*.85,_,l)}c.life>c.span&&(r.party=null)}else if(r.at-=t,r.at<=0&&a.length){const c=a[Math.floor(Math.random()*a.length)];r.party={x:c[0],y:c[1],z:c[2],life:0,span:14+Math.random()*12,ph:Math.random()*9,who:Array.from({length:o.n},()=>({a:Math.random()*Math.PI*2,r:.06+Math.random()*.18,w:(Math.random()<.5?-1:1)*(.5+Math.random()),b:Math.random()*7}))},r.at=o.every*(.6+Math.random()*.8)}r.body.end(),(s=r.head)==null||s.end()}}_smoke(t){this.smoke.begin();for(let e=0;e<this.chimneys.length&&e<11;e++){const[n,s,r]=this.chimneys[e];for(let o=0;o<4;o++){const a=(t*.22+o*.25+e*.37)%1,c=a*.75,l=.02+a*.055,h=a*a*.22;this.smoke.put(n+h,s+.24+c,r+h*.4,0,l*(1-a*.35))}}this.smoke.end()}_motes(t){const e=this.motes.geometry.attributes.position.array;let n=0;for(let s=0;s<this.moteN;s++){const r=this.moteHome[s];r&&(e[n*3]=r[0]+Math.sin(t*.6+s*1.7)*.18,e[n*3+1]=r[1]+.22+Math.sin(t*.9+s*2.3)*.1,e[n*3+2]=r[2]+Math.cos(t*.5+s*2.9)*.18,n++)}this.motes.geometry.setDrawRange(0,n),this.motes.geometry.attributes.position.needsUpdate=!0}}const bn=document.getElementById("scene"),Tt=i=>document.getElementById(i),Vt=new z_(bn),gs=new Y_(Vt.scene);matchMedia("(hover: none) and (pointer: coarse)").matches&&document.body.classList.add("touch");let lt,$t=null,hi=null,Ki=!1;function ql(i){let t=1/0,e=-1/0,n=1/0,s=-1/0;for(const c of i.board.filled){const[l,h]=Ye(Xt(c),qt(c),jt(c));l<t&&(t=l),l>e&&(e=l),h<n&&(n=h),h>s&&(s=h)}const r=(t+e)/2*Lt,o=(n+s)/2*Lt,a=Math.max(e-t,s-n)*.5*Lt+.7;return{cx:r,cz:o,r:a}}function xr(){const i=new Set,t=[];for(const e of lt.fits){const[n,s]=Wn(e.cells),r=`${Math.round(n/.55)},${Math.round(s/.55)}`;if(!i.has(r)&&(i.add(r),t.push([n,s]),t.length>=160))break}return t}function vr(i=!1){const t=p_(lt),e=ql(lt);Vt.setGarden(t,e),Vt.frame(e,i),gs.sync(lt,t.branches),Vt.setHints(lt.over?[]:xr()),Vt.setSites(lt.sites.map(n=>({x:n.mid[0]*Lt,z:n.mid[1]*Lt,hx:n.hub[0]*Lt,hz:n.hub[1]*Lt,done:n.done})))}const j_=Tt("tileart").getContext("2d"),$_=Tt("nextart").getContext("2d"),Yl=i=>jl(j_,lt.tile,i,14,2.2);function jl(i,t,e,n,s){const r=i.canvas.width,o=i.canvas.height;if(i.clearRect(0,0,r,o),!t)return;const c=On[e].map(([d,M,x])=>Vi(d,M,x).map(([v,A])=>qe(v,A)));let l=1/0,h=-1/0,u=1/0,f=-1/0;for(const d of c)for(const[M,x]of d)l=Math.min(l,M),h=Math.max(h,M),u=Math.min(u,x),f=Math.max(f,x);const p=Math.min((r-n*2)/(h-l),(o-n*2)/(f-u)),g=(r-(h-l)*p)/2-l*p,_=(o-(f-u)*p)/2+f*p,m=([d,M])=>[g+d*p,_-M*p];i.lineJoin="round",i.lineCap="round";for(let d=0;d<8;d++)i.beginPath(),c[d].forEach((M,x)=>{const[v,A]=m(M);x===0?i.moveTo(v,A):i.lineTo(v,A)}),i.closePath(),i.fillStyle=so(Tn[t.biomes[d]].top),i.fill(),i.strokeStyle="rgba(255,255,255,0.3)",i.lineWidth=1,i.stroke();if(i.beginPath(),ph(e).forEach((d,M)=>{const[x,v]=m(d);M===0?i.moveTo(x,v):i.lineTo(x,v)}),i.closePath(),i.strokeStyle="rgba(34,45,54,0.7)",i.lineWidth=s,i.stroke(),t.ports.size){const d=Me(e,0,0),M=Wn(d);for(const x of[0,1]){i.strokeStyle=so(x===0?Oi:zl),i.lineWidth=(x===0?4.1:2.3)*s;for(const v of t.ports){const A=$o(d,e,v,M);i.beginPath(),A.forEach((w,R)=>{const[U,S]=m([w[0]/Lt,w[1]/Lt]);R===0?i.moveTo(U,S):i.lineTo(U,S)}),i.stroke()}if(t.ports.size===1){const[v,A]=m([M[0]/Lt,M[1]/Lt]);i.beginPath(),i.arc(v,A,(x===0?2.3:1.55)*s,0,Math.PI*2),i.fillStyle=i.strokeStyle,i.fill()}}}}function Co(i){if(!lt||lt.over){Hn();return}if(!i){Hn();return}const t=[i.cell],n=De(Xt(i.cell),qt(i.cell),jt(i.cell)).map(s=>{const[r,o]=Ye(Xt(s),qt(s),jt(s));return{k:s,d:Math.hypot(r*Lt-i.x,o*Lt-i.z)}}).sort((s,r)=>s.d-r.d);for(const s of n)t.push(s.k);for(const s of t){const r=lt.fitsAtCell(s);if(r.length===0)continue;let o=0;if(hi!==null){const a=r.findIndex(c=>c.o===hi);a>=0&&(o=a)}$t={cell:s,fits:r,index:o},Kl();return}Hn()}const K_=()=>Math.max(110,Math.min(innerWidth,innerHeight)*.28);function Z_(i,t){const e=Vt.pick(...Jo(i,t));if(e&&(Co(e),$t))return!0;let n=null,s=1/0;for(const a of lt.fits){const[c,l]=Wn(a.cells),h=Vt.project(c,.02,l),u=Math.hypot((h.x+1)/2*innerWidth-i,(1-h.y)/2*innerHeight-t);u<s&&(s=u,n=a)}if(!n||s>K_())return!1;const[r,o]=Wn(n.cells);return Co({cell:n.cells[0],x:r,z:o}),!!$t}function Hn(){$t=null,Vt.setGhost(null),Tt("fitcount").textContent="",Tt("contact").textContent="",$l(!1)}function $l(i){const t=i&&$t?$t.fits.length:0;Tt("lay").disabled=!i,Tt("prev").disabled=t<2,Tt("next").disabled=t<2}function Kl(){if(!$t)return;const i=$t.fits[$t.index],t=__(i.cells,lt.tile,i.o);t.rim=x_(t.outline,.028,.022,Bl),Vt.setGhost(t),Tt("fitcount").textContent=$t.fits.length>1?`${$t.index+1}/${$t.fits.length}`:"";const e=Tt("contact"),n=[];i.joins>0&&n.push(`${i.joins} stream${i.joins>1?"s":""} carried on`),i.touch===4?n.push("flush ×4 · a mirrored fit"):i.touch===3?n.push("flush ×3 · same hand"):i.touch>0&&n.push(`${i.touch} edge${i.touch>1?"s":""} shared`),e.textContent=n.join(" · "),e.classList.toggle("flush",i.touch>=3||i.joins>0),$l(!0),Yl(i.o)}function ki(i){$t&&($t.index=($t.index+i+$t.fits.length)%$t.fits.length,hi=$t.fits[$t.index].o,Kl())}function Zl(){if(!$t||!lt||lt.over)return;const i=$t.fits[$t.index],t=lt.place(i);vr(),Vt.growTile(t.cells);const e=Yc(i.cells);t.fitScore>0&&Di(e,`+${t.fitScore}`,t.perfect);for(const n of t.announce){const s=lt.board.regionCells(n.root);Vt.playFlash(Po(s)),Di(Yc(s),`${kn[n.biome]} +${n.score}`,!0)}if(t.camp&&Di(e,`${t.camp.title} · +${t.camp.score}`,!0,.2),t.harvest&&lt.works.forEach((n,s)=>{var o;const r=((o=fr.find(a=>a.key===n.resource))==null?void 0:o.glyph)??"·";Di([n.at[0]*Lt,.5,n.at[1]*Lt],`${r}+1`,!1,.1+s*.06)}),t.bonus>0&&Di(e,`+${t.bonus} tiles`,!1,.5),t.quest){const n=t.quest;Di([n.hub[0]*Lt,.9,n.hub[1]*Lt],`${n.title} · +${n.score}`,!0,.25),Vt.playFlash(Po(n.cells??[]))}gs.celebrate(t),Hn(),di(),lt.over&&n0()}function Yc(i){const[t,e]=Wn(i);return[t,.3,e]}function Po(i){const t=new li;for(const e of i){const n=Vi(Xt(e),qt(e),jt(e)).map(([s,r])=>{const[o,a]=qe(s,r);return[o*Lt,.02,a*Lt]});t.tri(n[0],n[2],n[1],16777215),t.tri(n[0],n[3],n[2],16777215)}return t}function Di([i,t,e],n,s=!1,r=0){const o=Vt.project(i,t,e),a=document.createElement("span");a.textContent=n,s||(a.className="small"),a.style.left=`${(o.x+1)/2*innerWidth}px`,a.style.top=`${(1-o.y)/2*innerHeight}px`,a.style.animationDelay=`${r}s`,Tt("pops").appendChild(a),setTimeout(()=>a.remove(),1900+r*1e3)}const J_=tl.map(i=>{const t=document.createElement("button");return t.className="recipe",t.title=i.note,t.innerHTML='<b></b><span class="cost"></span>',t.querySelector("b").textContent=i.title,t.addEventListener("click",()=>{!lt||!lt.craft(i.key)||(hi=null,Hn(),Vt.setHints(xr()),di())}),Tt("recipes").appendChild(t),{r:i,b:t}}),Q_=Object.fromEntries(fr.map(i=>[i.key,i.glyph]));function t0(){const i=Tt("shop");if(!lt.works.length&&!Object.values(lt.res).some(t=>t>0)){i.classList.add("hidden");return}i.classList.remove("hidden"),Tt("purse").textContent=fr.filter(t=>lt.res[t.key]>0).map(t=>`${t.glyph}${lt.res[t.key]}`).join("  ");for(const{r:t,b:e}of J_){const n=lt.costOf(t);e.querySelector(".cost").textContent=Object.entries(n).map(([s,r])=>`${Q_[s]}${r}`).join(" "),e.disabled=lt.over||!lt.affordable(t)}}function di(){t0(),Tt("score").textContent=lt.score.toLocaleString(),Tt("tiles").textContent=Math.max(0,lt.tilesLeft),Tt("sealed").textContent=lt.sealedCount;const i=lt.biggestOpen();Tt("growing").textContent=i&&i.size>2?`${i.size} · ${kn[i.biome]}`:"—",Tt("tilekind").textContent=e0(lt.tile);const t=lt.quest??lt.sites[lt.sites.length-1],e=Tt("quest");t?(e.classList.remove("hidden"),e.classList.toggle("done",!!t.done),Tt("questtitle").textContent=t.done?`${t.title} ✓`:t.title,Tt("questhint").textContent=t.done?t.unlockNote||"Done.":t.hint):e.classList.add("hidden");const n=Tt("swap");lt.canChoose&&!lt.over&&lt.queue[1]?(n.classList.remove("hidden"),jl($_,lt.queue[1],0,8,1.1)):n.classList.add("hidden");const s=Tt("feed");s.textContent="";for(const r of lt.log){const o=document.createElement("div");o.textContent=r,s.appendChild(o)}Yl($t?$t.fits[$t.index].o:0)}function e0(i){if(!i)return"";if(i.camp)return`${i.camp.title} · needs ${kn[i.camp.biome]}`;const t=new Map;for(const s of i.biomes)t.set(s,(t.get(s)??0)+1);const e=[...t.entries()].sort((s,r)=>r[1]-s[1]).map(([s])=>kn[s]),n=i.ports.size?` · ${i.kind==="fitted"?"stream":i.kind}`:"";return e.slice(0,2).join(" + ")+n}function n0(){Tt("finalscore").textContent=lt.score.toLocaleString();const i=lt.sealedCount;Tt("finalnote").textContent=`${lt.placed} hats laid · ${i} region${i===1?"":"s"} sealed`+(lt.best.size?` · largest ${lt.best.size} kites of ${kn[lt.best.biome]}`:"");const t=Tt("finaltally");t.textContent="";for(const e of(lt.openTally??[]).slice(0,8)){const n=document.createElement("li");n.innerHTML=`<span>${e.size} kites of ${kn[e.biome]} · left open</span><b>+${e.score}</b>`,t.appendChild(n)}setTimeout(()=>Tt("gameover").classList.remove("hidden"),900)}const Jl=4,i0=11,on=new Map;let Dn=null,Lo=!1,ar=0,cr=0,lr=0,Ko=0,Zo=Jl;const Jo=(i,t)=>[i/innerWidth*2-1,-(t/innerHeight)*2+1];function Ql(){const[i,t]=[...on.values()];return{gap:Math.max(1,Math.hypot(i.x-t.x,i.y-t.y)),cx:(i.x+t.x)/2,cy:(i.y+t.y)/2,angle:Math.atan2(t.y-i.y,t.x-i.x)}}function th(i,t){try{t?bn.setPointerCapture(i):bn.releasePointerCapture(i)}catch{}}bn.addEventListener("pointerdown",i=>{i.pointerType==="touch"&&document.body.classList.add("touch"),on.set(i.pointerId,{x:i.clientX,y:i.clientY}),th(i.pointerId,!0),on.size===1?(ar=0,Lo=!1,Ko=i.button,Zo=i.pointerType==="mouse"?Jl:i0,cr=i.clientX,lr=i.clientY):(Lo=!0,on.size===2&&(Dn=Ql()))});bn.addEventListener("pointermove",i=>{const t=on.get(i.pointerId);if(t&&(t.x=i.clientX,t.y=i.clientY),on.size>=2){const e=Ql();if(Dn){Vt.zoom(Dn.gap/e.gap),Vt.pan(e.cx-Dn.cx,e.cy-Dn.cy);let n=e.angle-Dn.angle;n>Math.PI?n-=Math.PI*2:n<-Math.PI&&(n+=Math.PI*2),Vt.spin(n)}Dn=e,document.body.classList.add("dragging");return}if(t){const e=i.clientX-cr,n=i.clientY-lr;ar+=Math.abs(e)+Math.abs(n),cr=i.clientX,lr=i.clientY,ar>Zo&&(document.body.classList.add("dragging"),Ko===2||i.shiftKey?Vt.pan(e,n):Vt.orbit(e,n));return}!Ki||i.pointerType==="touch"||Co(Vt.pick(...Jo(i.clientX,i.clientY)))});function eh(i){const t=on.delete(i.pointerId);if(th(i.pointerId,!1),on.size<2&&(Dn=null),on.size>0){const[e]=[...on.values()];cr=e.x,lr=e.y;return}if(document.body.classList.remove("dragging"),!(!t||Lo||ar>Zo||Ko!==0||!Ki)){if(i.pointerType==="touch"){const e=Vt.pick(...Jo(i.clientX,i.clientY));if(!$t||!e||!$t.fits[$t.index].cells.includes(e.cell)){Z_(i.clientX,i.clientY);return}}Zl()}}bn.addEventListener("pointerup",eh);bn.addEventListener("pointercancel",eh);bn.addEventListener("contextmenu",i=>i.preventDefault());const s0=16,r0=400;function o0(i){return i.deltaMode===1?i.deltaY*s0:i.deltaMode===2?i.deltaY*r0:i.deltaY}let jc=0;bn.addEventListener("wheel",i=>{i.preventDefault();const t=o0(i);if(i.shiftKey||i.ctrlKey||!$t){Vt.zoom(Math.exp(Math.max(-120,Math.min(120,t))*.0016));return}const e=performance.now();Math.abs(t)<2||e-jc<110||(jc=e,ki(t>0?1:-1))},{passive:!1});addEventListener("keydown",i=>{if(!Ki)return;const t=i.key.toLowerCase();if(t==="q")ki(-1);else if(t==="e"||t===" ")ki(1);else if(t==="r")nh();else if(t==="+"||t==="=")Vt.zoom(.85);else if(t==="-")Vt.zoom(1.18);else return;i.preventDefault()});function nh(){lt.reroll()&&(hi=null,Hn(),Vt.setHints(xr()),di())}const Qo=()=>Vt.resize(innerWidth,innerHeight);addEventListener("resize",Qo);addEventListener("orientationchange",()=>setTimeout(Qo,250));visualViewport==null||visualViewport.addEventListener("resize",Qo);Tt("top").addEventListener("click",()=>{Vt.resetCamera(),lt&&Vt.frame(ql(lt))});function _s(i){var s;lt=new zh(i),hi=null,Ki=!0,Hn(),gs.reset(),Vt.resetCamera();const[t,e]=qe(Zs[0],Zs[1]),n=(s=lt.headwater)==null?void 0:s.dir;Vt.setMountain(t*Lt,e*Lt,n?Math.atan2(n[1],n[0]):null),vr(!0),di(),Tt("gameover").classList.add("hidden")}Tt("prev").addEventListener("click",()=>ki(-1));Tt("next").addEventListener("click",()=>ki(1));Tt("tileart").addEventListener("click",()=>ki(1));Tt("lay").addEventListener("click",Zl);Tt("toss").addEventListener("click",nh);Tt("swap").addEventListener("click",()=>{lt.swapNext()&&(hi=null,Hn(),Vt.setHints(xr()),di())});Tt("play").addEventListener("click",()=>{Tt("intro").remove(),Tt("startbar").classList.add("hidden"),_s((Math.random()*1e9|0)+1)});Tt("watch").addEventListener("click",()=>{Tt("intro").remove(),Tt("startbar").classList.remove("hidden")});Tt("startbar").addEventListener("click",()=>{Tt("startbar").classList.add("hidden"),_s((Math.random()*1e9|0)+1)});Tt("again").addEventListener("click",()=>_s(Math.random()*1e9|0));let oo=.6;const a0=34;function ta(){if(!lt||lt.over||lt.placed>=a0+3)return;const i=lt.fits;if(!i.length)return;let t=null,e=-1/0;for(const s of i){const r=lt._harmony(s.o,s.cells,lt.tile),o=r.joins*6+r.match*3+r.touch+Math.random()*2;o>e&&(e=o,t=s)}const n=lt.place(t);vr(),Vt.growTile(n.cells);for(const s of n.announce)Vt.playFlash(Po(lt.board.regionCells(s.root)));di()}window.aperiodicGarden={get game(){return lt},get hover(){return $t},get scene(){return Vt},step:ta,restart:_s,get ambience(){return gs},refresh:()=>{vr(),di()}};Vt.resize(innerWidth,innerHeight);_s(1741);Ki=!1;for(let i=0;i<20;i++)ta();let $c=performance.now(),ao=0;function ih(i){const t=Math.min(.05,(i-$c)/1e3);$c=i,ao+=t,Ki||(oo-=t,oo<=0&&(oo=.34,ta())),Vt.updateCamera(t),gs.update(t,ao,lt),Vt.render(t,ao),requestAnimationFrame(ih)}requestAnimationFrame(ih);
