import{V as lt,G as Xe,F as vo,D as vt,H as Mo,S as ie,a as Ct,C as F,B as yo,M as ht,b as kt,c as z,P as ce,R as St,d as le,N as qe,A as be,e as bo,f as xo,g as Ao,h as Ot,i as So,j as Wt,O as Po,I as Ut,L as Co,k as ko,l as zo,m as To,n as Io,o as Je,T as Ro,p as Ve,q as Do,s as ut,r as Bt,t as _o,u as to,v as Se,w as xe,x as zt,W as Eo,y as Fo,z as Lo,E as Go,J as No,K as Oo,Q as Wo,U as Uo,X as Bo,Y as Ho,Z as jo,_ as Zo}from"./character-C_GYzCNX.js";const eo=200,Vt=175,L=50,C=50,Ht=-150,ue=-eo/2,jt=eo/L,et=Vt/C,T=L+1,pe=64,gt=130,Xo=110,Ye=new lt(-.42,.055,-.9).normalize(),qo=40,rt=6.6,de=new lt(-.8,.4,-.1).normalize(),Vo=40,me=36,Yo="#120a20",$o="#05030b",Ko="#3a1f2e",Qo="#2b1b33",fe="#48e8ff",he=.0235,ge=56,we=320,q=34,ot=1200,wt=2500;function Jo(n,s){const a=xe(n*.017+11.3,s*.017-4.1,4)-.5,o=Se(n*.085-3,s*.085+7.5)-.5;return a*.6+o*.08}function ve(n,s){var a,o;try{return((o=(a=Ro)[n])==null?void 0:o.call(a,s))||{}}catch(w){return console.warn(`[world] ${n} unavailable, falling back to flat colour`,w),{}}}function Pe(n,s,a){const o=document.createElement("canvas");o.width=n,o.height=s,a(o.getContext("2d"),n,s);const w=new _o(o);return w.colorSpace=to,w}const Zt=(n,s,a)=>`rgb(${n|0},${s|0},${a|0})`;function tn(n=512){const s=n,a=n>>1,o=8,w=[[0,[58,32,30]],[.22,[124,66,42]],[.44,[196,122,62]],[.66,[226,174,110]],[.85,[242,219,184]],[1,[250,240,220]]],l=e=>{for(let M=1;M<w.length;M++)if(e<=w[M][0]||M===w.length-1){const[x,A]=w[M-1],[S,y]=w[M],E=ut(x,S,e);return[A[0]+(y[0]-A[0])*E,A[1]+(y[1]-A[1])*E,A[2]+(y[2]-A[2])*E]}return w[0][1]};return Pe(s,a,e=>{const M=e.createImageData(s,a),x=M.data;for(let f=0;f<a;f++){const P=f/(a-1),h=P*2-1,N=1-h*h;for(let I=0;I<s;I++){const k=I/s,Y=(zt(k*o,P*o*.5+3,o,4)-.5)*1.15*N,H=h+Y*.16,yt=(zt(k*o*.5+5,P*o*2,o,3)-.5)*1.6;let j=.5+.5*Math.sin(H*Math.PI*8.5+yt);j=j*.62+(zt(k*o*.25+1,P*o*.75+9,o,3)-.2)*.62,j=j*.9+.05,j+=(zt(k*o*3+2,P*o*3+4,o,3)-.5)*.14*N;const Z=ut(.62,1,Math.abs(h));let[$,bt,pt]=l(Math.max(0,Math.min(1,j)));$+=(96-$)*Z*.65,bt+=(98-bt)*Z*.65,pt+=(118-pt)*Z*.65;const tt=(f*s+I)*4;x[tt]=$,x[tt+1]=bt,x[tt+2]=pt,x[tt+3]=255}}e.putImageData(M,0,0);const A=s*.63,S=a*.62,y=s*.085,E=a*.075;e.save(),e.translate(A,S),e.scale(y,E);for(let f=10;f>=0;f--){const P=f/10,h=e.createRadialGradient(0,0,0,0,0,1);h.addColorStop(0,Zt(232,116,74)),h.addColorStop(.55,Zt(178,74,48)),h.addColorStop(1,Zt(150,92,60)),e.globalAlpha=.1,e.beginPath(),e.ellipse(0,0,P,P,0,0,Math.PI*2),e.fillStyle=h,e.fill()}e.globalAlpha=.5,e.strokeStyle=Zt(246,214,178),e.lineWidth=.06;for(let f=0;f<5;f++)e.beginPath(),e.ellipse(0,0,.35+f*.15,.28+f*.14,f*.22,0,Math.PI*1.7),e.stroke();e.restore()})}function en(n=512){return Pe(n,4,(s,a,o)=>{const w=s.createImageData(a,o),l=w.data;for(let e=0;e<a;e++){const M=e/(a-1);let x=.35+.65*xe(M*26+4.5,2.3,4);x*=ut(0,.08,M)*(1-ut(.86,1,M)),x*=1-.92*Math.exp(-Math.pow((M-.44)*26,2)),x*=1-.6*Math.exp(-Math.pow((M-.72)*34,2));const A=.62+.38*xe(M*12-2,8.1,3);for(let S=0;S<o;S++){const y=(S*a+e)*4;l[y]=206*A,l[y+1]=190*A,l[y+2]=186*A,l[y+3]=Math.max(0,Math.min(1,x))*105}}s.putImageData(w,0,0)})}function on(n=256){return Pe(n,n,(a,o,w)=>{const l=a.createImageData(o,w),e=l.data;for(let M=0;M<w;M++)for(let x=0;x<o;x++){const A=zt(x/o*4,M/w*4,4,5),S=ut(.44,.9,A),y=(M*o+x)*4;e[y]=226,e[y+1]=198,e[y+2]=224,e[y+3]=S*255}a.putImageData(l,0,0)})}function nn(n=91){const s=Je(n),a=6,o=[0,.24,.5,.74,.91,1],w=[1,.97,.93,.88,.82,.72],l=.26,e=-.15,M=[],x=[];let A=0,S=0;for(let h=0;h<o.length;h++){A+=(s()-.5)*.1,S+=(s()-.5)*.1;const N=h===o.length-1;for(let I=0;I<a;I++){const k=I/a*Math.PI*2,Y=w[h]*(.86+.26*Se(Math.cos(k)*2.1+4,Math.sin(k)*2.1+h*.35)),H=N?(Math.cos(k)*l+Math.sin(k)*e)*Y:0;M.push(Math.cos(k)*Y+A*o[h],o[h]+H+(s()-.5)*.03,Math.sin(k)*Y+S*o[h]),x.push(I/a,o[h])}}const y=M.length/3;M.push(A,1,S),x.push(.5,1);const E=[];for(let h=0;h<o.length-1;h++)for(let N=0;N<a;N++){const I=h*a+N,k=h*a+(N+1)%a;E.push(I,I+a,k,k,I+a,k+a)}const f=(o.length-1)*a;for(let h=0;h<a;h++)E.push(f+h,y,f+(h+1)%a);const P=new kt;return P.setAttribute("position",new Ve(M,3)),P.setAttribute("uv",new Ve(x,2)),P.setIndex(E),P.computeVertexNormals(),P}function an(){const n=new Do(.3,0),s=n.attributes.position;for(let a=0;a<s.count;a++){const o=s.getX(a),w=s.getY(a),l=s.getZ(a),e=.72+.6*Se(o*5+2,l*5-w*3);s.setXYZ(a,o*e,w*e*.8,l*e)}return n.computeVertexNormals(),n}const sn=`
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPix;
  uniform float uTwinkle;
  uniform float uAttenuate;
  uniform float uAttenScale;
  uniform float uFog;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * (1.3 + aPhase * 2.7) + aPhase * 6.283));
    float atten = mix(1.0, uAttenScale / max(-mv.z, 0.1), uAttenuate);
    // Clamped, or a mote drifting past the lens balloons into a snowflake.
    gl_PointSize = min(aSize * uPix * atten * mix(1.0, tw, uTwinkle), 26.0 * uPix);
    // Additive points cannot use scene fog (it would ADD murk), so fade them
    // out by hand on the same exponential curve.
    float d = length(mv.xyz) * uFog;
    vAlpha = exp(-d * d) * mix(1.0, tw, uTwinkle);
    vColor = aColor;
    gl_Position = projectionMatrix * mv;
  }
`,rn=`
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uIntensity;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = 1.0 - r;
    a *= a;
    gl_FragColor = vec4(vColor * (a * vAlpha * uIntensity), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;function Me({pix:n=1,twinkle:s=0,attenuate:a=0,attenScale:o=22,fog:w=0,intensity:l=1}){return new Ct({uniforms:{uTime:{value:0},uPix:{value:n},uTwinkle:{value:s},uAttenuate:{value:a},uAttenScale:{value:o},uFog:{value:w},uIntensity:{value:l}},vertexShader:sn,fragmentShader:rn,blending:be,depthWrite:!1,transparent:!1})}function cn({scene:n,renderer:s,quality:a=1}={}){var Nt,Ze;const o=new Xe;o.name="world";const w=[],l=t=>(w.push(t),t),e=Je(20260727),M=s?s.getPixelRatio():1,x=((Ze=(Nt=s==null?void 0:s.capabilities)==null?void 0:Nt.getMaxAnisotropy)==null?void 0:Ze.call(Nt))??1;let A=0,S=0,y=a;const E=Ye.clone().multiplyScalar(qo);E.y=.4,n&&(n.fog=new vo(Qo,he));const f=new vt("#ffb672",1.45);f.position.set(-6.5,5.6,-5.2),f.castShadow=!0,f.shadow.mapSize.set(2048,2048),f.shadow.camera.near=1,f.shadow.camera.far=22,f.shadow.camera.left=-3.2,f.shadow.camera.right=3.2,f.shadow.camera.top=3.4,f.shadow.camera.bottom=-3,f.shadow.bias=-6e-4,f.shadow.normalBias=.02,f.shadow.radius=3,f.target.position.set(0,.9,0),o.add(f,f.target);const P=new vt("#7fe6ff",.85);P.position.set(5,1.9,5.4),P.target.position.set(0,.9,0),o.add(P,P.target);const h=new vt("#b39ad6",.34);h.position.set(-3.4,2.6,4.2),h.target.position.set(0,.9,0),o.add(h,h.target);const N=new Mo("#3a3350","#231b2b",.34);o.add(N);const I=l(new ie(Vo,48,32)),k=l(new Ct({side:yo,depthTest:!1,depthWrite:!1,uniforms:{uHorizon:{value:new F(Yo)},uZenith:{value:new F($o)},uHaze:{value:new F(Ko)},uTo:{value:Ye.clone()}},vertexShader:`
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 uHorizon, uZenith, uHaze, uTo;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float up = pow(clamp(d.y, 0.0, 1.0), 0.55);
          vec3 col = mix(uHorizon, uZenith, up);
          // Warm dust sitting on the horizon, banked up toward the gas giant.
          float band = exp(-pow(max(d.y, -0.06) * 6.5, 2.0));
          float toward = pow(clamp(dot(d, uTo) * 0.5 + 0.5, 0.0, 1.0), 7.0);
          col += uHaze * band * (0.30 + 1.35 * toward);
          col = mix(col, uHorizon * 0.5, smoothstep(0.0, -0.22, d.y));
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `})),Y=new ht(I,k);Y.renderOrder=-40,Y.frustumCulled=!1,o.add(Y);const H=l(new kt);{const t=new Float32Array(wt*3),r=new Float32Array(wt*3),i=new Float32Array(wt),c=new Float32Array(wt),d=new F("#b9d4ff"),u=new F("#ffd2a1"),g=new F;for(let p=0;p<wt;p++){const v=-.12+e()*1.12,W=Math.sqrt(Math.max(0,1-v*v)),m=e()*Math.PI*2;t[p*3]=Math.cos(m)*W*me,t[p*3+1]=v*me,t[p*3+2]=Math.sin(m)*W*me;const b=Math.pow(e(),3.1);i[p]=.9+b*3.4,g.copy(d).lerp(u,e());const Q=.4+b*.75;r[p*3]=g.r*Q,r[p*3+1]=g.g*Q,r[p*3+2]=g.b*Q,c[p]=e()}H.setAttribute("position",new z(t,3)),H.setAttribute("aColor",new z(r,3)),H.setAttribute("aSize",new z(i,1)),H.setAttribute("aPhase",new z(c,1))}const yt=l(Me({pix:M,twinkle:.28,intensity:1.9}));yt.depthTest=!1;const j=new ce(H,yt);j.renderOrder=-30,j.frustumCulled=!1,o.add(j);const Z=new Xe;Z.position.copy(E),Z.rotation.set(.3,0,.32),o.add(Z);const $=l(tn(512));$.wrapS=St,$.wrapT=le,$.colorSpace=qe,$.anisotropy=x;const bt=l(new ie(rt,96,64)),pt=l(new Ct({depthTest:!1,depthWrite:!1,uniforms:{uMap:{value:$},uSpin:{value:0},uLight:{value:de.clone()},uAtmo:{value:new F("#ffb98a")}},vertexShader:`
        varying vec2 vUvw;
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vUvw = uv;
          vN = normalize(mat3(modelMatrix) * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vW = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
        uniform sampler2D uMap;
        uniform float uSpin;
        uniform vec3 uLight;
        uniform vec3 uAtmo;
        varying vec2 vUvw;
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vec3 c = texture2D(uMap, vec2(vUvw.x + uSpin, vUvw.y)).rgb;
          c = mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
          vec3 n = normalize(vN);
          vec3 v = normalize(cameraPosition - vW);
          float lit = smoothstep(-0.88, 0.5, dot(n, uLight));
          float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.2);
          vec3 col = c * (0.02 + 0.62 * lit);
          col *= mix(1.0, 0.45, fres);                 // limb darkening
          col += uAtmo * fres * (0.03 + 0.42 * lit);   // thin atmosphere rim
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `})),tt=new ht(bt,pt);tt.renderOrder=-20,tt.frustumCulled=!1,Z.add(tt);const io=l(new ie(rt*1.05,64,40)),co=l(new Ct({depthTest:!1,depthWrite:!1,transparent:!1,blending:be,uniforms:{uLight:{value:de.clone()},uAtmo:{value:new F("#ff9f6e")}},vertexShader:`
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vN = normalize(mat3(modelMatrix) * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vW = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
        uniform vec3 uLight, uAtmo;
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vec3 n = normalize(vN);
          float fres = pow(1.0 - clamp(dot(n, normalize(cameraPosition - vW)), 0.0, 1.0), 3.2);
          float lit = smoothstep(-0.95, 0.55, dot(n, uLight));
          gl_FragColor = vec4(uAtmo * fres * (0.02 + 0.26 * lit), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `})),Jt=new ht(io,co);Jt.renderOrder=-15,Jt.frustumCulled=!1,Z.add(Jt);const Tt=l(en(512));Tt.wrapS=le,Tt.wrapT=le,Tt.colorSpace=qe;const Te=l(new bo(rt*1.4,rt*2.02,160,1));Te.rotateX(-Math.PI/2);const lo=l(new Ct({side:Ao,depthTest:!1,depthWrite:!1,transparent:!1,blending:xo,uniforms:{uMap:{value:Tt},uInner:{value:rt*1.4},uOuter:{value:rt*2.02},uCenter:{value:E.clone()},uRadius:{value:rt},uLight:{value:de.clone()}},vertexShader:`
        varying float vR;
        varying vec3 vW;
        void main() {
          vR = length(position.xz);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vW = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
        uniform sampler2D uMap;
        uniform float uInner, uOuter, uRadius;
        uniform vec3 uCenter, uLight;
        varying float vR;
        varying vec3 vW;
        void main() {
          // Depth testing is off for the whole sky group, so occlusion by the
          // planet has to be done analytically: ray-vs-sphere against the disc.
          vec3 toC = uCenter - cameraPosition;
          vec3 rd = normalize(vW - cameraPosition);
          float tc = dot(toC, rd);
          float perp = length(toC - rd * tc);
          if (perp < uRadius) {
            float tHit = tc - sqrt(max(uRadius * uRadius - perp * perp, 0.0));
            if (length(vW - cameraPosition) > tHit) discard;
          }
          vec4 s = texture2D(uMap, vec2((vR - uInner) / (uOuter - uInner), 0.5));
          s.rgb = mix(s.rgb / 12.92, pow((s.rgb + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), s.rgb));
          // …and the planet's own shadow falls across the far side of the ring.
          vec3 q = vW - uCenter;
          float along = dot(q, uLight);
          float off = length(q - uLight * along);
          float shade = (along < 0.0 && off < uRadius) ? 0.18 : 1.0;
          gl_FragColor = vec4(s.rgb * shade * 0.52, s.a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `})),te=new ht(Te,lo);te.renderOrder=-10,te.frustumCulled=!1,Z.add(te);const B=new Float32Array(T*(C+1));let It=0,ee=0;const O=l(new kt);{const t=T*(C+1),r=new Float32Array(t*3),i=new Float32Array(t*3),c=new Float32Array(t*2),d=new Uint32Array(L*C*6);let u=0;for(let g=0;g<=C;g++)for(let p=0;p<=L;p++){const v=g*T+p;r[v*3]=ue+p*jt,r[v*3+2]=Ht+g*et,i[v*3+1]=1,c[v*2]=p/L,c[v*2+1]=g/C,p<L&&g<C&&(d[u++]=v,d[u++]=v+T,d[u++]=v+1,d[u++]=v+1,d[u++]=v+T,d[u++]=v+T+1)}O.setAttribute("position",new z(r,3)),O.setAttribute("normal",new z(i,3)),O.setAttribute("uv",new z(c,2)),O.setIndex(new z(d,1)),O.attributes.position.setUsage(Ot),O.attributes.normal.setUsage(Ot),O.boundingSphere=new So(new lt(0,0,Ht+Vt/2),Vt)}const R=ve("makeRegolith",{size:1024,seed:23});for(const t of[R.map,R.normalMap,R.roughnessMap])t&&(t.wrapS=t.wrapT=St,t.repeat.set(pe,pe),t.anisotropy=x,l(t));const oe=l(new Wt({color:R.map?"#57525f":"#3b3043",map:R.map||null,normalMap:R.normalMap||null,roughnessMap:R.roughnessMap||null,roughness:.94,metalness:0}));oe.normalMap&&oe.normalScale.set(1.15,1.15);const Rt=new ht(O,oe);Rt.receiveShadow=!0,Rt.frustumCulled=!1,o.add(Rt);function ne(t){const r=Ht+t*et+It*et,i=t*T;for(let c=0;c<=L;c++)B[i+c]=Jo(ue+c*jt,r)}function Ie(){const t=O.attributes.position.array,r=O.attributes.normal.array;for(let i=0;i<=C;i++){const c=i>0?i-1:0,d=i<C?i+1:C;for(let u=0;u<=L;u++){const g=i*T+u;t[g*3+1]=B[g];const p=u>0?u-1:0,v=u<L?u+1:L,W=(B[i*T+v]-B[i*T+p])/((v-p)*jt),m=(B[d*T+u]-B[c*T+u])/((d-c)*et),b=1/Math.sqrt(W*W+1+m*m);r[g*3]=-W*b,r[g*3+1]=b,r[g*3+2]=-m*b}}O.attributes.position.needsUpdate=!0,O.attributes.normal.needsUpdate=!0}for(let t=0;t<=C;t++)ne(t);Ie();function ae(t,r){let i=(t-ue)/jt,c=(r-ee-Ht)/et;i=i<0?0:i>L?L:i,c=c<0?0:c>C?C:c;const d=Math.min(i|0,L-1),u=Math.min(c|0,C-1),g=i-d,p=c-u,v=B[u*T+d],W=B[u*T+d+1],m=B[(u+1)*T+d],b=B[(u+1)*T+d+1];return(v+(W-v)*g)*(1-p)+(m+(b-m)*g)*p}const xt=new Po,Re=[],De=t=>((t+Bt(A))%gt+gt)%gt-Xo;function Dt(t,r,{sit:i=!0}={}){t.frustumCulled=!1,t.instanceMatrix.setUsage(Ot),l(t.geometry),l(t.material);const c={mesh:t,items:r,sit:i,max:r.length};return Re.push(c),o.add(t),c}function uo(t){const r=t.mesh.count;for(let i=0;i<r;i++){const c=t.items[i],d=De(c.z);xt.position.set(c.x,c.y+(t.sit?ae(c.x,d):0),d),xt.rotation.set(c.rx,c.ry,c.rz),xt.scale.set(c.sx,c.sy,c.sz),xt.updateMatrix(),t.mesh.setMatrixAt(i,xt.matrix)}t.mesh.instanceMatrix.needsUpdate=!0}const _t=R.normalMap?l(R.normalMap.clone()):null;_t&&(_t.repeat.set(2,3),_t.needsUpdate=!0);const se=new Wt({color:"#403a48",normalMap:_t,roughness:.95,metalness:.02,flatShading:!0}),Et=new Ut(nn(),se,ge);Et.castShadow=!0,Et.receiveShadow=!0;{const t=[];for(let r=0;r<ge;r++){const c=(e()<.5?-1:1)*(5.5+Math.pow(e(),.75)*44),d=e()<.34,u=d?.55+e()*.6:.7+e()*.85;t.push({x:c,y:-.3,z:e()*gt,rx:(e()-.5)*(d?.16:.4),ry:e()*Math.PI*2,rz:(e()-.5)*(d?.16:.4),sx:u,sy:d?2.4+Math.pow(e(),1.5)*3.6:.95+e()*1.3,sz:u*(.82+e()*.36)})}Dt(Et,t)}const re=new Ut(an(),se,we);re.receiveShadow=!0;{const t=[];for(let r=0;r<we;r++){const i=e()<.5?-1:1;t.push({x:i*(1.3+Math.pow(e(),1.35)*26),y:-.04,z:e()*gt,rx:e()*Math.PI,ry:e()*Math.PI,rz:e()*Math.PI,sx:.45+e()*.75,sy:.65+e()*.6,sz:.45+e()*.75})}Dt(re,t)}l(se);const X=ve("makeMetal",{size:512,seed:17,base:"#5e6470",rust:.5,scratch:.7});for(const t of[X.map,X.normalMap,X.roughnessMap,X.metalnessMap])t&&(t.wrapS=t.wrapT=St,t.repeat.set(2,1),t.anisotropy=x,l(t));const _e=new Wt({color:X.map?"#8e94a4":"#5c5566",map:X.map||null,normalMap:X.normalMap||null,roughnessMap:X.roughnessMap||null,metalnessMap:X.metalnessMap||null,roughness:.55,metalness:X.metalnessMap?1:.8}),Ee=2.05,po=new Co([[0,0],[.21,0],[.23,.07],[.12,.14],[.095,.5],[.075,1.7],[.125,1.86],[.125,2.24],[.07,2.34],[.055,2.6],[0,2.66]].map(([t,r])=>new ko(t,r)),8),dt=new Ut(po,_e,q);dt.castShadow=!0;const mt=ve("makeEmissivePanel",{size:256,seed:19,color:fe,density:1});for(const t of[mt.map,mt.emissiveMap])t&&(t.anisotropy=x,l(t));const Fe=new Wt({color:mt.map?"#0d1a1e":"#07171b",map:mt.map||null,emissive:new F(fe),emissiveMap:mt.emissiveMap||null,emissiveIntensity:mt.emissiveMap?2.2:1.2,roughness:.45,metalness:.1}),Le=new zo(.135,.135,.34,10,1,!0);Le.translate(0,Ee,0);const Ge=new Ut(Le,Fe,q),Ft=[];for(let t=0;t<q;t++){const r=t%2===0?-1:1,i=gt/(q/2);Ft.push({x:r*(6.4+(e()-.5)*.5),y:-.05,z:Math.floor(t/2)*i+(e()-.5)*.8,rx:(e()-.5)*.13,ry:e()*.6,rz:(e()-.5)*.13,sx:1,sy:.85+e()*.35,sz:1})}Dt(dt,Ft.map(t=>({...t}))),Dt(Ge,Ft.map(t=>({...t}))),l(_e),l(Fe);const st=l(new kt);{const t=new Float32Array(q*3),r=new Float32Array(q*3),i=new Float32Array(q),c=new Float32Array(q),d=new F(fe);for(let u=0;u<q;u++)r[u*3]=d.r,r[u*3+1]=d.g,r[u*3+2]=d.b,i[u]=9+e()*4,c[u]=e();st.setAttribute("position",new z(t,3)),st.setAttribute("aColor",new z(r,3)),st.setAttribute("aSize",new z(i,1)),st.setAttribute("aPhase",new z(c,1))}const mo=l(Me({pix:M,attenuate:1,attenScale:20,fog:he,intensity:1.35})),Ne=new ce(st,mo);Ne.frustumCulled=!1,o.add(Ne);const At=56,K=l(new kt),ft=new Float32Array(ot*3),Lt=new Float32Array(ot*2);{const t=new Float32Array(ot*3),r=new Float32Array(ot*3),i=new Float32Array(ot),c=new Float32Array(ot),d=new F("#ffcf9e"),u=new F("#9fe8ff"),g=new F;for(let p=0;p<ot;p++){ft[p*3]=(e()-.5)*22,ft[p*3+1]=.05+Math.pow(e(),1.9)*5.2,ft[p*3+2]=e()*At,Lt[p*2]=e()*6.283,Lt[p*2+1]=.25+e()*.9,g.copy(d).lerp(u,Math.pow(e(),2));const v=.25+e()*.75;r[p*3]=g.r*v,r[p*3+1]=g.g*v,r[p*3+2]=g.b*v,i[p]=.55+Math.pow(e(),2.8)*2.1,c[p]=e()}K.setAttribute("position",new z(t,3)),K.setAttribute("aColor",new z(r,3)),K.setAttribute("aSize",new z(i,1)),K.setAttribute("aPhase",new z(c,1)),K.attributes.position.setUsage(Ot)}const fo=l(Me({pix:M,attenuate:1,attenScale:26,fog:he*1.15,intensity:.9})),Oe=new ce(K,fo);Oe.frustumCulled=!1,o.add(Oe);const Gt=l(on(256));Gt.wrapS=Gt.wrapT=St;const We=[];for(let t=0;t<2;t++){const r=t===0?Gt:l(Gt.clone());r.wrapS=r.wrapT=St,r.repeat.set(2+t,2.5+t*1.5),r.needsUpdate=!0;const i=l(new To(130,150,24,24));i.rotateX(-Math.PI/2);{const u=i.attributes.position,g=new Float32Array(u.count*3);for(let p=0;p<u.count;p++){const v=Math.abs(u.getX(p))/65,W=Math.abs(u.getZ(p))/75,m=(1-ut(.45,1,v))*(1-ut(.35,1,W));g[p*3]=g[p*3+1]=g[p*3+2]=m}i.setAttribute("color",new z(g,3))}const c=l(new Io({map:r,vertexColors:!0,color:t===0?"#8f5f86":"#5f4270",transparent:!0,opacity:t===0?.62:.42,depthWrite:!1,blending:be,fog:!1})),d=new ht(i,c);d.position.set(0,.16+t*.4,-30),d.renderOrder=5,d.frustumCulled=!1,o.add(d),We.push({tex:r,speed:t===0?1:.55,scroll:2.5+t*1.5,depth:150})}function Ue(t){var i;y=Math.max(0,Math.min(1,t)),Et.count=Math.max(6,Math.round(ge*(.35+.65*y))),re.count=Math.max(20,Math.round(we*(.25+.75*y))),dt.count=Math.max(10,Math.round(q*(.5+.5*y))),Ge.count=dt.count,st.setDrawRange(0,dt.count),K.setDrawRange(0,Math.max(160,Math.round(ot*(.25+.75*y)))),H.setDrawRange(0,Math.max(600,Math.round(wt*(.45+.55*y))));const r=y>.6?2048:y>.3?1024:512;f.shadow.mapSize.width!==r&&(f.shadow.mapSize.set(r,r),(i=f.shadow.map)==null||i.dispose(),f.shadow.map=null)}Ue(a);const Be=st.attributes.position,He=K.attributes.position;function je(t,r){const i=Math.min(Math.max(t||0,0),.05),c=Number.isFinite(r)?r:0;S+=i,A+=c*i;const d=Math.floor(A/et);if(ee=Bt(A-d*et),Rt.position.z=ee,d!==It){const m=d-It;if(It=d,m>0&&m<=C){B.copyWithin(0,m*T);for(let b=C-m+1;b<=C;b++)ne(b)}else for(let b=0;b<=C;b++)ne(b);Ie()}const u=d*et/Vt*pe;R.map&&(R.map.offset.y=u),R.normalMap&&(R.normalMap.offset.y=u),R.roughnessMap&&(R.roughnessMap.offset.y=u);for(const m of Re)uo(m);const g=Be.array,p=dt.count;for(let m=0;m<p;m++){const b=Ft[m],Q=De(b.z);g[m*3]=b.x,g[m*3+1]=b.y+ae(b.x,Q)+Ee*b.sy,g[m*3+2]=Q}Be.needsUpdate=!0;const v=He.array,W=K.drawRange.count;for(let m=0;m<W;m++){const b=Lt[m*2+1],Q=Lt[m*2],go=Bt(A*(.55+b*.6));let wo=((ft[m*3+2]+go)%At+At)%At;v[m*3]=ft[m*3]+Math.sin(S*.6*b+Q)*.85,v[m*3+1]=ft[m*3+1]+Math.cos(S*.45*b+Q*1.7)*.45,v[m*3+2]=wo-At+8}He.needsUpdate=!0;for(const m of We)m.tex.offset.y=Bt(A*m.speed/m.depth)*m.scroll,m.tex.offset.x=Math.sin(S*.03)*.05;yt.uniforms.uTime.value=S,pt.uniforms.uSpin.value=-S*.0045}function ho(){var t,r,i;(t=o.parent)==null||t.remove(o),o.traverse(c=>{c.isInstancedMesh&&c.dispose()});for(const c of w)(r=c.dispose)==null||r.call(c);(i=f.shadow.map)==null||i.dispose(),n&&n.fog&&(n.fog=null)}return n&&n.add(o),je(0,0),{group:o,lights:{key:f,fill:h,rim:P,hemi:N},update:je,groundHeightAt:ae,setQuality:Ue,dispose:ho}}const{clamp:Ce,lerp:oo}=jo,Yt=3.5,J=n=>n*Zo,ln=document.getElementById("app"),$e=document.getElementById("boot"),un=document.getElementById("boot-step"),pn=document.getElementById("boot-fill"),_=new Eo({antialias:!0,powerPreference:"high-performance"});_.setPixelRatio(Math.min(window.devicePixelRatio,2));_.shadowMap.enabled=!0;_.shadowMap.type=Fo;_.toneMapping=Lo;_.toneMappingExposure=1.05;_.outputColorSpace=to;ln.appendChild(_.domElement);const ct=new Go,D=new No(40,1,.05,400);D.position.set(1.62,1.02,1.92);const U=new Oo(D,_.domElement);U.target.set(0,.78,0);U.enableDamping=!0;U.dampingFactor=.07;U.minDistance=.7;U.maxDistance=9;U.maxPolarAngle=Math.PI*.52;U.enablePan=!1;const Xt=(n,s)=>new Promise(a=>{un.textContent=n,pn.style.width=`${Math.round(s*100)}%`,requestAnimationFrame(()=>requestAnimationFrame(a))});let Ae,G,at;function dn(){const n=new vt("#ffe6c8",2.4);n.position.set(2.6,3.1,J(3.4));const s=new vt("#7fd4ff",.95);s.position.set(-3.2,1.4,J(1.8));const a=new vt("#ffb45c",1.7);a.position.set(-1.4,2,J(-3.6));for(const o of[n,s,a])ct.add(o);return{key:n,fill:s,rim:a}}async function mn(){await Xt("raising the flats",.12),ct.environment=Uo(_),Ae=cn({scene:ct,renderer:_,quality:1}),await Xt("sculpting the goblin",.4),G=Bo({renderer:_,quality:1}),ct.add(G.group),dn(),await Xt("hanging the kit",.86),at=new Ho(G.mesh),at.visible=!1,at.material.linewidth=2,ct.add(at),document.getElementById("s-bones").textContent=G.stats.bones,document.getElementById("s-tris").textContent=G.stats.triangles.toLocaleString(),document.getElementById("s-sim").textContent=G.stats.accessories,window.spaceGoblin={scene:ct,camera:D,renderer:_,world:Ae,goblin:G,director:nt},await Xt("ready",1),$e.classList.add("gone"),setTimeout(()=>$e.remove(),700)}const nt={speed:Yt,target:Yt,nextStrike:6.5,clock:0,fighting:!1,strike(){this.fighting||(this.fighting=!0,this.target=0,G.playCombo(),setTimeout(()=>{this.target=Yt,this.fighting=!1,this.nextStrike=this.clock+7+Math.random()*4},1750))},update(n){this.clock+=n,!this.fighting&&this.clock>this.nextStrike&&this.strike();const s=this.target>this.speed?2.6:5.5;this.speed=oo(this.speed,this.target,Ce(n*s,0,1))}},Kt=[{name:"CHASE",pos:[1.62,1.02,J(1.92)],target:[0,.76,0],fov:38,orbit:.05},{name:"LOW",pos:[1.06,.34,J(1.58)],target:[0,.7,J(.04)],fov:44,orbit:.09},{name:"FACE",pos:[.5,1.06,J(.84)],target:[.02,.99,J(.05)],fov:32,orbit:.03},{name:"WIDE",pos:[2.9,1.55,J(3.2)],target:[0,.82,0],fov:40,orbit:.04}];let Qt=0,it=1;const Mt={pos:new lt,target:new lt,fov:40},V={pos:new lt,target:new lt,fov:40};let ke=!1;function ze(n,s=!1){Qt=n;const a=Kt[n];Mt.pos.copy(D.position),Mt.target.copy(U.target),Mt.fov=D.fov,V.pos.fromArray(a.pos),V.target.fromArray(a.target),V.fov=a.fov,it=s?1:0,ke=!1,no.textContent=`CAMERA · ${a.name}`,s&&(D.position.copy(V.pos),U.target.copy(V.target),D.fov=V.fov,D.updateProjectionMatrix())}let Pt=0;function fn(n){if(it<1){it=Ce(it+n*1.5,0,1);const l=it*it*(3-2*it);D.position.lerpVectors(Mt.pos,V.pos,l),U.target.lerpVectors(Mt.target,V.target,l),D.fov=oo(Mt.fov,V.fov,l),D.updateProjectionMatrix();return}if(ke)return;Pt+=n;const s=Kt[Qt],a=Pt*s.orbit,o=V.pos,w=Math.hypot(o.x,o.z);D.position.set(Math.sin(Math.atan2(o.x,o.z)+a)*w+Math.sin(Pt*.8)*.012,o.y+Math.sin(Pt*.55)*.03,Math.cos(Math.atan2(o.x,o.z)+a)*w+Math.cos(Pt*.7)*.012)}U.addEventListener("start",()=>{ke=!0});const hn=document.getElementById("btn-strike"),no=document.getElementById("btn-cam"),Ke=document.getElementById("btn-slow"),Qe=document.getElementById("btn-rig");let $t=!1;hn.addEventListener("click",()=>G&&nt.strike());no.addEventListener("click",()=>ze((Qt+1)%Kt.length));Ke.addEventListener("click",()=>{$t=!$t,Ke.classList.toggle("on",$t)});Qe.addEventListener("click",()=>{at&&(at.visible=!at.visible,Qe.classList.toggle("on",at.visible))});window.addEventListener("keydown",n=>{n.key===" "&&(n.preventDefault(),G&&nt.strike()),n.key==="c"&&ze((Qt+1)%Kt.length)});function ao(){const n=window.innerWidth,s=window.innerHeight;_.setSize(n,s),D.aspect=n/s,D.updateProjectionMatrix()}window.addEventListener("resize",ao);ao();const so=new Wo,gn=document.getElementById("s-fps");let qt=0,ye=0;function ro(){requestAnimationFrame(ro);const n=Math.min(so.getDelta(),1/20),s=$t?n*.22:n;G&&(nt.update(s),G.mixer.timeScale=nt.fighting?1:Ce(nt.speed/Yt,.4,1.15),G.update(s,{speed:nt.speed}),Ae.update(s,nt.speed)),fn(n),U.update(),_.render(ct,D),qt+=n,ye++,qt>.5&&(gn.textContent=Math.round(ye/qt),qt=0,ye=0)}ze(0,!0);mn().then(()=>{so.getDelta(),ro()});
