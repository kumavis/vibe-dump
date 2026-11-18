"""Outlines from the library's drawing of the bird (right cartouche): every tan region as a polygon with holes, in the
model's lower-cartouche frame (developed mm), through the affine that best lays its broad figure on the owner's outline."""
import json, numpy as np, cv2
from PIL import Image
R='/home/user/vibe-dump/packages/taotie-bronze/'; W=R+'.work/lead/'
im=np.asarray(Image.open(W+'lit/guoji-filled.webp').convert('RGB')).astype(np.float32); x0,y0,x1,y1=975,205,1845,875
d=(im[:,:,0]-im[:,:,2])[y0:y1,x0:x1]; U=4
m=cv2.resize(cv2.GaussianBlur(d,(0,0),0.6),None,fx=U,fy=U,interpolation=cv2.INTER_CUBIC)>10
fit=json.load(open(W+'lit/fit-low.json')); a,b,tx,ty=fit['a'],fit['b'],fit['tx'],fit['ty']
mm=lambda c: np.c_[tx+a*(c[:,0]+0.5)/U, ty-b*(c[:,1]+0.5)/U]
cs,h=cv2.findContours(m.astype(np.uint8),cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE); out={}
simp=lambda c: [[round(float(x),2),round(float(y),2)] for x,y in mm(cv2.approxPolyDP(c.astype(np.float32),1.6,True)[:,0,:])]
for k,c in enumerate(cs):
    if h[0][k][3]<0 and cv2.contourArea(c)>=40*U*U/4: out[k]={'outer':simp(c),'holes':[]}
for k,c in enumerate(cs):
    p=h[0][k][3]
    if p>=0 and p in out and cv2.contourArea(c)>=12*U*U/4: out[p]['holes'].append(simp(c))
plates=[p for p in out.values() if len(p['outer'])>=3]
allp=np.array([q for p in plates for q in p['outer']]); s0,s1,yy0,yy1=allp[:,0].min(),allp[:,0].max(),allp[:,1].min(),allp[:,1].max()
# the eye: the library draws a ring and a dot; the model sets its own boss there
eye_px=(1258-x0,403-y0); eye=[round(float(tx+a*eye_px[0]),2),round(float(ty-b*eye_px[1]),2)]
mg=0.9; field=[[s0-mg,yy0-mg],[s0-mg,yy1+mg],[s1+mg,yy1+mg],[s1+mg,yy0-mg]]
J={'zone':'low','units':'mm','frame':'developed (s, y): s from the side centre line, y vessel height',
   'what':"The lower bird as a published drawing has it: outlines derived from the pattern drawing of the Guo Ji square hu (虢季铜方壶, Henan Museum) in the 懿品博悟 数字拓纹库 (entry 967), which the owner identified as the same bird. Laid into this vessel's lower cartouche by the affine that best puts its broad figure on the owner's own outline (IoU %.2f: the same scheme, not the same proportions). The source images are not kept."%fit['iou'],
   'field':{'rrect':[round(float(s0-mg),2),round(float(yy0-mg),2),round(float(s1+mg),2),round(float(yy1+mg),2)],'r':9},'rim':0,'plates':plates,'eyes':[{'c':eye,'r':3.4,'recess':4.6}],
   'span':[round(float(s0-mg),2),round(float(s1+mg),2)],'generator':'reference/nezu-fanghu/guoji_fit.py + guoji_outlines.py (they read the source drawing, which is not kept in the repository)'}
json.dump(J,open(R+'reference/nezu-fanghu/faces/dev-low.guoji.json','w'),separators=(',',':'))
import os; print('plates',len(plates),'holes',sum(len(p['holes']) for p in plates),'points',sum(len(p['outer'])+sum(len(x) for x in p['holes']) for p in plates),'bytes',os.path.getsize(R+'reference/nezu-fanghu/faces/dev-low.guoji.json'),'span s %.1f..%.1f y %.1f..%.1f eye %s'%(s0,s1,yy0,yy1,eye))
