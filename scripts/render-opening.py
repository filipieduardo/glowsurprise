"""Reproducible Cycles sequence. Run after render-gift.py; all geometry original."""
import bpy,math,os
from mathutils import Vector
root=os.path.abspath(os.environ.get('GIFT_ART_DIR','.gift-art'))
bpy.ops.wm.open_mainfile(filepath=os.path.join(root,'gift-studio.blend'))
scene=bpy.context.scene;scene.render.resolution_x=720;scene.render.resolution_y=680;scene.cycles.samples=32;scene.cycles.use_denoising=True;scene.cycles.use_adaptive_sampling=True;scene.cycles.adaptive_threshold=.045;scene.render.use_persistent_data=True
scene.cycles.device='CPU'
os.makedirs(os.path.join(root,'sequence'),exist_ok=True)
objects=bpy.data.objects
# Local surface deformation gives the tails a soft response as the knot loosens.
for name in ['BowLeft','BowRight']:
 for obj in objects[name].children_recursive:
  if obj.type!='MESH':continue
  obj.shape_key_add(name='Basis');relax=obj.shape_key_add(name='Relax')
  for v in relax.data:
   x,y,z=v.co
   front=max(0,min(1,(-y-.35)/.95));hanging=max(0,min(1,-z))
   v.co.x+=math.sin((-y)*3.2)*.09*front*hanging
   v.co.y-=math.sin((-z)*2.3)*.09*front*hanging
   v.co.z-=.07*front*hanging

def visible(name,on):
 obj=objects[name]
 for child in [obj]+list(obj.children_recursive):child.hide_render=not on

def smooth(n):
 v=max(0,min(1,n));return v*v*(3-2*v)

for f in range(101):
 if os.path.exists(os.path.join(root,'sequence',f'{f:04d}.png')):continue
 t=f/24;loosen=smooth(t/.95);release=smooth((t-.6)/1.1);lift=smooth((t-1.45)/1.5);reveal=smooth((t-2.4)/1.3)
 visible('ClosedBody',lift<.012);visible('Walls',lift>=.012);visible('Wrap',release<.98)
 objects['BowLeft'].rotation_euler.y=-(loosen*.15+release*.14)
 objects['BowRight'].rotation_euler.y=loosen*.18+release*.12
 objects['Bow'].scale=(1+loosen*.07,1,1-loosen*.16)
 objects['WrapFront'].location=(-release*.26,-release*.35,-release*1.7);objects['WrapFront'].rotation_euler.y=release*.26
 objects['WrapSide'].location=(release*1.2,0,-release*1.5);objects['WrapSide'].rotation_euler.y=release*.35
 objects['Lid'].location=(-lift*.23,lift*.6,1.06+lift*1.52);objects['Lid'].rotation_euler=(-lift*.17,lift*.16,0)
 for name in ['BowLeft','BowRight']:
  for obj in objects[name].children_recursive:
   if obj.type=='MESH' and obj.data.shape_keys:obj.data.shape_keys.key_blocks['Relax'].value=loosen
 visible('Card',reveal>0)
 objects['Card'].location=(0,-.26,.1+reveal*1.28);objects['Card'].rotation_euler=(-.07,reveal*.04,-reveal*.12)
 scene.camera.location=(.12,-8.3-lift*1.4,3.4+lift*.65);scene.camera.rotation_euler=(Vector((0,0,.25+lift*.4))-scene.camera.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=os.path.join(root,'sequence',f'{f:04d}.png');bpy.ops.render.render(write_still=True)
 print('FINISHED_FRAME',f,flush=True)
