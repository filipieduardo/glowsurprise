import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { createGiftModel } from './GiftModel'

/** Studio renderer: controlled reflections and actual paper/fabric response. */
export function createGiftRenderer(host:HTMLDivElement,reduced:boolean,photoUrl?:string){
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true})
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.94
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap
  host.appendChild(renderer.domElement);RectAreaLightUniformsLib.init()
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(31,1,.1,35)
  const studio=new THREE.Scene();studio.background=new THREE.Color('#0d1012')
  const environmentAssets:{geometry:THREE.BufferGeometry;material:THREE.Material}[]=[]
  function softbox(x:number,y:number,z:number,w:number,h:number,strength:number,color:string){const material=new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(strength),side:THREE.DoubleSide});const geometry=new THREE.PlaneGeometry(w,h);const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.lookAt(0,0,0);studio.add(mesh);environmentAssets.push({geometry,material})}
  softbox(-3.5,3,4,2.3,5,5,'#fff0dc');softbox(4.5,1,1.5,.65,4,3,'#ecf4ff');softbox(0,5,-2,3,2,3.5,'#fff5e5')
  const pmrem=new THREE.PMREMGenerator(renderer),env=pmrem.fromScene(studio,.025,.1,30)
  scene.environment=env.texture;pmrem.dispose();environmentAssets.forEach(o=>{o.geometry.dispose();o.material.dispose()})
  const key=new THREE.RectAreaLight('#fff0dc',10,3,4);key.position.set(-3.5,4,4);key.lookAt(0,.5,0);scene.add(key)
  const rim=new THREE.RectAreaLight('#e4f0ff',3,.7,3);rim.position.set(3,2,-1);rim.lookAt(0,0,0);scene.add(rim)
  const shadowLight=new THREE.DirectionalLight('#ffe7ca',.75);shadowLight.position.set(-3,5,5);shadowLight.castShadow=true;shadowLight.shadow.mapSize.set(1024,1024);Object.assign(shadowLight.shadow.camera,{left:-3,right:3,top:4,bottom:-3,near:.5,far:20});shadowLight.shadow.bias=-.00015;shadowLight.shadow.normalBias=.008;shadowLight.shadow.radius=3;scene.add(shadowLight)
  scene.add(new THREE.HemisphereLight('#f0e4d1','#091a17',.35))
  const model=createGiftModel();scene.add(model.root);model.root.rotation.y=-.055;model.setPhoto(photoUrl)
  const glow=new THREE.PointLight('#ffdc9b',0,4);glow.position.set(0,1.4,.6);scene.add(glow)
  let openingAt:number|null=null,frame=0,disposed=false,paused=false,hover=0,targetHover=0,last=0
  const render=(now:number)=>{
    if(disposed||paused)return
    const t=openingAt===null?0:(now-openingAt)/1000,{lift,reveal}=model.pose(t)
    const dt=last?Math.min((now-last)/1000,.05):.016;last=now
    hover+=(targetHover-hover)*Math.min(1,dt*7)
    model.root.rotation.y=-.055+(reduced?0:hover*.045)
    camera.position.set(.04,2.7+lift*.65,8.25+lift*1.25);camera.lookAt(0,.3+lift*.4,0)
    glow.intensity=reveal*1.6;renderer.render(scene,camera)
    if((openingAt!==null&&t<4.2)||Math.abs(hover-targetHover)>.002)frame=requestAnimationFrame(render)
  }
  const invalidate=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(render)}
  const resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();invalidate()});resize.observe(host)
  const visibility=()=>{paused=document.hidden;if(paused)cancelAnimationFrame(frame);else invalidate()};document.addEventListener('visibilitychange',visibility)
  const lost=(e:Event)=>{e.preventDefault();host.dispatchEvent(new CustomEvent('gift-context-lost'))};renderer.domElement.addEventListener('webglcontextlost',lost)
  const pointer=(e:PointerEvent)=>{if(reduced||openingAt!==null||e.pointerType==='touch')return;const r=host.getBoundingClientRect();targetHover=(e.clientX-r.left)/r.width-.5;invalidate()};const leave=()=>{targetHover=0;invalidate()};host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave)
  invalidate()
  return {open(){openingAt=performance.now()-(reduced?4200:0);invalidate()},reset(){openingAt=null;invalidate()},dispose(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();document.removeEventListener('visibilitychange',visibility);host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);model.dispose();env.dispose();renderer.dispose();renderer.domElement.remove()}}
}
