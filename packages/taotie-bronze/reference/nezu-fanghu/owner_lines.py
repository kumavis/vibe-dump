"""Incised lines on the owner's lower bird: the earlier hand-traced channel lines (dev-low.trace.json), kept only
where they run INSIDE the owner's figure and the photograph shows a dark line under them (each point may slide
sideways up to 0.9 mm onto the line). Output: lines in developed mm (un-warped), for owner_plates.py to warp."""
import json, sys, numpy as np, cv2
sys.path.insert(0, '.')            # run with cwd = .work/r8-fanghu/solve (cam.py / form.py / develop.py)
from cam import project
from form import *
from develop import CAM08
from scipy.ndimage import map_coordinates, gaussian_filter1d
from skimage.filters import sato
ROOT='/home/user/vibe-dump/packages/taotie-bronze/'; REF=ROOT+'reference/nezu-fanghu/'
T=json.load(open(REF+'faces/dev-low.trace.json')); O=[np.array(o) for o in json.load(open(REF+'faces/dev-low.owner-outline.json'))['outlines_dev_mm']]
PP=8; fr=[10,64,134,172]
ss=fr[0]+(np.arange(int((fr[2]-fr[0])*PP))+0.5)/PP; ys=fr[3]-(np.arange(int((fr[3]-fr[1])*PP))+0.5)/PP; S_,Y_=np.meshgrid(ss,ys)
a_=bodyW(Y_); b_=RHO*a_; r_=np.minimum(bodyR(Y_),b_-0.5); x_,z_=rrPoint(0,S_,a_,b_,r_)
P_=project(np.c_[x_.ravel(),Y_.ravel(),z_.ravel()],CAM08)[:,:2].reshape(S_.shape+(2,))
dev=cv2.remap(cv2.imread(REF+'photo-08.jpg'),P_[...,0].astype(np.float32),P_[...,1].astype(np.float32),cv2.INTER_CUBIC)
px=lambda p: np.c_[(np.asarray(p)[:,0]-fr[0])*PP,(fr[3]-np.asarray(p)[:,1])*PP]
mm=lambda q: np.c_[fr[0]+q[:,0]/PP, fr[3]-q[:,1]/PP]
fig=np.zeros(dev.shape[:2],np.uint8); cv2.fillPoly(fig,[px(o).round().astype(np.int32) for o in O],1)
inner=cv2.erode(fig,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(2*int(0.9*PP)+1,)*2))
L=cv2.cvtColor(dev,cv2.COLOR_BGR2LAB)[:,:,0].astype(np.float32); L=L-cv2.GaussianBlur(L,(0,0),5*PP)
R=sato(L,sigmas=[2.2,3.2],black_ridges=True).astype(np.float32); thr=np.percentile(R[inner>0],72)
kept=[]; rows=[]
for i,c in enumerate(T['channels']):
    p=px(c['line']); seg=np.hypot(*np.diff(p,axis=0).T); t=np.arange(0,seg.sum(),2.0); Lc=np.r_[0,np.cumsum(seg)]
    q=np.stack([np.interp(t,Lc,p[:,0]),np.interp(t,Lc,p[:,1])],1)
    if len(q)<6: continue
    tan=np.gradient(q,axis=0); n=np.stack([tan[:,1],-tan[:,0]],1); n/=np.linalg.norm(n,axis=1,keepdims=True)+1e-9
    offs=np.arange(-0.9*PP,0.9*PP+1,1.0); Q=q[:,None,:]+offs[None,:,None]*n[:,None,:]
    resp=map_coordinates(R,[Q[...,1],Q[...,0]],order=1,mode='nearest'); k=resp.argmax(1); best=resp.max(1)
    off=gaussian_filter1d(offs[k],9); q2=q+off[:,None]*n          # 9 samples = 2.2 mm: a line does not wiggle faster than that
    ins=map_coordinates(inner.astype(np.float32),[q2[:,1],q2[:,0]],order=0,mode='constant')>0.5
    ok=ins&(gaussian_filter1d(best,2)>thr)
    rows.append((i,len(q)*2/PP,float(ins.mean()),float((best>thr).mean())))
    a=0
    while a<len(ok):
        if not ok[a]: a+=1; continue
        b=a
        while b<len(ok) and (ok[b] or (b+3<len(ok) and ok[b+1:b+4].any() and ins[b])): b+=1     # bridge gaps of up to 3 samples
        if (b-a)*2/PP>=4.0: kept.append({'from':i,'line':np.round(mm(cv2.approxPolyDP(q2[a:b].astype(np.float32).reshape(-1,1,2),1.2,False)[:,0,:]),2).tolist(),'w':0.8})
        a=b
for r in rows: print('ch %2d  len %5.1f mm  inside %.2f  dark-line %.2f'%r)
json.dump({'what':'incised lines on the lower bird: earlier hand-traced lines kept where inside the owner figure and on a dark line of photo-08; developed mm, un-warped','lines':kept},open(REF+'faces/dev-low.owner-lines.json','w'),separators=(',',':'))
k=2; im=cv2.resize(dev,None,fx=k,fy=k,interpolation=cv2.INTER_CUBIC); v=im.copy()
for o in O: cv2.polylines(v,[(px(o)*k).round().astype(np.int32)],True,(40,40,255),2,cv2.LINE_AA)
for l in kept: cv2.polylines(v,[(px(l['line'])*k).round().astype(np.int32)],False,(0,255,255),3,cv2.LINE_AA)
s=np.hstack([im,v]); f=2100/s.shape[1]; cv2.imwrite(ROOT+'.work/lead/hu/low-lines.jpg',cv2.resize(s,None,fx=f,fy=f,interpolation=cv2.INTER_AREA),[cv2.IMWRITE_JPEG_QUALITY,88]); print(len(kept),'line pieces kept, total %.0f mm'%sum(cv2.arcLength(np.array(l['line'],np.float32).reshape(-1,1,2),False) for l in kept))
