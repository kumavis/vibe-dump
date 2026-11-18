"""Fit the library's tracing (right cartouche) to the Nezu hu's LOWER bird, using the owner's own outline as the target."""
import json, numpy as np, cv2
R='/home/user/vibe-dump/packages/taotie-bronze/'; W=R+'.work/lead/'
T=cv2.imread(W+'lit/guoji-right-mask.png',0)>127
fig=cv2.morphologyEx(T.astype(np.uint8),cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))      # broad figure, no threads
fig=cv2.morphologyEx(fig,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7)))                      # incised lines closed
D=json.load(open(R+'reference/nezu-fanghu/faces/dev-low.owner.json')); PP=8; fr=[10,64,124,172]; Wd=int((fr[2]-fr[0])*PP); H=int((fr[3]-fr[1])*PP)
px=lambda p: np.c_[(np.asarray(p)[:,0]-fr[0])*PP,(fr[3]-np.asarray(p)[:,1])*PP].round().astype(np.int32)
own=np.zeros((H,Wd),np.uint8); cv2.fillPoly(own,[px(p['outer']) for p in D['plates']]+[px(h) for p in D['plates'] for h in p['holes']],1)
def place(mask,a,b,tx,ty,pp=PP):
    M=np.float32([[a*pp,0,(tx-fr[0])*pp],[0,b*pp,(fr[3]-ty)*pp]]); return cv2.warpAffine(mask.astype(np.float32),M,(int((fr[2]-fr[0])*pp),int((fr[3]-fr[1])*pp)),flags=cv2.INTER_AREA)
ys,xs=np.nonzero(fig); bx0,bx1,by0,by1=xs.min(),xs.max(),ys.min(),ys.max(); oy,ox=np.nonzero(own)
s0,s1=fr[0]+ox.min()/PP,fr[0]+ox.max()/PP; y1_,y0_=fr[3]-oy.min()/PP,fr[3]-oy.max()/PP
a0=(s1-s0)/(bx1-bx0); b0=(y1_-y0_)/(by1-by0); best=None
for ka in np.arange(0.9,1.13,0.02):
    for kb in np.arange(0.9,1.13,0.02):
        for dx in np.arange(-5,5.1,1.0):
            for dy in np.arange(-5,5.1,1.0):
                a=a0*ka; b=b0*kb; tx=(s0+s1)/2+dx-a*(bx0+bx1)/2; ty=(y0_+y1_)/2+dy+b*(by0+by1)/2
                m=place(fig,a,b,tx,ty)>0.5; iou=(m&(own>0)).sum()/((m|(own>0)).sum()+1e-6)
                if best is None or iou>best[0]: best=(iou,a,b,tx,ty)
iou,a,b,tx,ty=best; print('IoU %.3f  mm/px %.4f x %.4f  (library aspect %.2f -> on the model %.2f)'%(iou,a,b,(bx1-bx0)/(by1-by0),a*(bx1-bx0)/(b*(by1-by0))))
json.dump({'a':a,'b':b,'tx':tx,'ty':ty,'iou':iou},open(W+'lit/fit-low.json','w'))
m=place(fig,a,b,tx,ty)>0.5; v=np.zeros((H,Wd,3),np.uint8); v[...,1]=own*200; v[...,2]=m*255; v[...,0]=m*60          # green = owner, red = library, yellow = both
full=place(T,a,b,tx,ty,pp=16)>0.5
k=2; e=np.zeros((H*k,Wd*k,3),np.uint8); e[:]=(40,50,60); e[full]=(150,170,140)
for p in D['plates']: cv2.polylines(e,[px(p['outer'])*k],True,(40,40,255),2,cv2.LINE_AA)
s=np.hstack([cv2.resize(v,(Wd*k,H*k),interpolation=cv2.INTER_NEAREST),e]); f=2000/s.shape[1]; cv2.imwrite(W+'lit/fit-low.jpg',cv2.resize(s,None,fx=f,fy=f,interpolation=cv2.INTER_AREA),[cv2.IMWRITE_JPEG_QUALITY,88])
