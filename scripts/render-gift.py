"""Original GlowSurprise gift: Blender Cycles render, no external assets."""
import bpy, os
from mathutils import Vector
root=os.path.abspath(os.environ.get('GIFT_ART_DIR','.gift-art'))
os.makedirs(os.path.join(root,'renders'),exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=os.path.join(root,'gift.glb'))
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=80;scene.cycles.use_denoising=True
scene.cycles.max_bounces=8;scene.cycles.diffuse_bounces=4;scene.cycles.glossy_bounces=4
# CPU is predictable on low-memory machines; no GPU compilation required.
scene.cycles.device='CPU'
scene.render.resolution_x=720;scene.render.resolution_y=680;scene.render.resolution_percentage=100
scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=0
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.12,.15,.14,1);scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.25
for mat in bpy.data.materials:
 if not mat.use_nodes:continue
 bs=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if not bs:continue
 if 'satin' in mat.name.lower() or 'edges' in mat.name.lower():
  bs.inputs['Metallic'].default_value=0;bs.inputs['Roughness'].default_value=.26;bs.inputs['Anisotropic'].default_value=.85;bs.inputs['Sheen Weight'].default_value=.3;bs.inputs['Sheen Roughness'].default_value=.35;bs.inputs['IOR'].default_value=1.46
 if 'paper' in mat.name.lower():bs.inputs['Roughness'].default_value=.5
# Cycles receives a sparse, physically scaled studio: broad key, narrow rim, fill.
def area(name,position,power,color,size,target=(0,0,.4),ratio=None):
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.color=color;data.shape='RECTANGLE';data.size=size;data.size_y=ratio or size
 obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=position;obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
area('Large silk key',(-3.8,-4.5,5.7),650,(1,.9,.77),3,ratio=4)
area('Cool edge',(3.5,1,3.8),450,(.77,.87,1),1,ratio=3)
area('Top softbox',(-.5,2.8,5.2),450,(1,.93,.84),3,ratio=2)
area('Front bounce',(2,-4,1.8),100,(1,.93,.83),3)
data=bpy.data.cameras.new('Portrait camera');camera=bpy.data.objects.new('Portrait camera',data);scene.collection.objects.link(camera);scene.camera=camera;data.lens=50
camera.location=(.12,-8.3,3.4);camera.rotation_euler=(Vector((0,0,.25))-camera.location).to_track_quat('-Z','Y').to_euler()
print('NODES',[(o.name,tuple(round(v,2) for v in o.location)) for o in bpy.data.objects if o.type=='EMPTY'])
def group_visible(name,visible):
 obj=bpy.data.objects.get(name)
 if obj:
  for o in [obj]+list(obj.children_recursive):o.hide_render=not visible
for n in ['Walls','Card']:group_visible(n,False)
# Gentle three-quarter depth toward the left. No separate right-hand panel.
obj=bpy.data.objects.get('GiftRoot')
if obj:obj.rotation_euler.z=-.07
scene.render.filepath=os.path.join(root,'renders','gift-closed.png')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(root,'gift-studio.blend'))
bpy.ops.render.render(write_still=True)
