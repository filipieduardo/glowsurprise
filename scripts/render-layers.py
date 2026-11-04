"""Ray-traced transparent layers: full lighting, tiny runtime cost on phones."""
import bpy,os
root=os.path.abspath(os.environ.get('GIFT_ART_DIR','.gift-art'))
bpy.ops.wm.open_mainfile(filepath=os.path.join(root,'gift-studio.blend'))
scene=bpy.context.scene;scene.cycles.device='CPU';scene.cycles.samples=32;scene.cycles.use_denoising=True;scene.cycles.adaptive_threshold=.06;scene.cycles.use_adaptive_sampling=True
scene.render.resolution_x=720;scene.render.resolution_y=680;scene.render.use_persistent_data=True
objects=bpy.data.objects
# Keep the final camera, materials and color management exactly consistent.
def show(name,on):
 for obj in [objects[name]]+list(objects[name].children_recursive):obj.hide_render=not on
show('ClosedBody',False);show('Walls',True);show('Lid',False);show('Wrap',False);show('Card',False)
scene.render.filepath=os.path.join(root,'renders','gift-base.png');bpy.ops.render.render(write_still=True)
show('Walls',False);show('Lid',True)
scene.render.filepath=os.path.join(root,'renders','gift-lid.png');bpy.ops.render.render(write_still=True)
