import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// Original, parametric model. Ribbons are wide, two-dimensional fabric surfaces,
// never tubes. No external model, texture, HDRI, or paid asset is required.
export function createGiftRenderer(host: HTMLDivElement, reduced: boolean) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .92
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  host.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 40)
  camera.position.set(0, 3.1, 7.8)
  camera.lookAt(0, .35, 0)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, .05)
  scene.environment = env.texture
  room.dispose(); pmrem.dispose()
  const key = new THREE.DirectionalLight('#ffe2c2', 2.8); key.position.set(-3, 5, 5); scene.add(key)
  key.castShadow=true; key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=4;key.shadow.camera.bottom=-4;key.shadow.normalBias=.012;key.shadow.bias=-.0001;key.shadow.radius=3
  const edge = new THREE.DirectionalLight('#fff2d7', 1.8); edge.position.set(3, 2, -3); scene.add(edge)
  const fill = new THREE.DirectionalLight('#acc8c1', .15); fill.position.set(2, 0, 4); scene.add(fill)
  const root = new THREE.Group(); scene.add(root)
  const textureCanvas=document.createElement('canvas');textureCanvas.width=256;textureCanvas.height=256
  const ctx=textureCanvas.getContext('2d')!;const gradient=ctx.createLinearGradient(0,0,256,210);gradient.addColorStop(0,'#65152c');gradient.addColorStop(.45,'#42091e');gradient.addColorStop(1,'#230711');ctx.fillStyle=gradient;ctx.fillRect(0,0,256,256)
  // Deterministic, subtle paper grain, generated locally.
  let seed=42;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};for(let i=0;i<16000;i++){ctx.fillStyle=i%2?'#ffffff06':'#00000008';ctx.fillRect(random()*256,random()*256,1,1)}
  const paperMap=new THREE.CanvasTexture(textureCanvas);paperMap.colorSpace=THREE.SRGBColorSpace
  const paper = new THREE.MeshPhysicalMaterial({ map:paperMap, roughness: .52, metalness: .08, sheen: .18, sheenColor: new THREE.Color('#70243b'), sheenRoughness: .7, envMapIntensity: .3 })
  const satin = new THREE.MeshPhysicalMaterial({ color: '#cbb482', roughness: .36, metalness: .45, sheen: .7, sheenColor: new THREE.Color('#fff3d1'), sheenRoughness: .3, side: THREE.DoubleSide, envMapIntensity: .75 })
  const interior = new THREE.MeshStandardMaterial({ color: '#30121c', roughness: .85 })
  const geometries: THREE.BufferGeometry[] = []
  function box(w:number,h:number,d:number,mat:THREE.Material,parent:THREE.Group,x=0,y=0,z=0,r=.025) {
    const geo = new RoundedBoxGeometry(w,h,d,3,r); geometries.push(geo)
    const mesh = new THREE.Mesh(geo,mat); mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true; parent.add(mesh); return mesh
  }
  // Square footprint, flush side walls, real rim and hollow interior.
  box(2.2,.10,2.2,paper,root,0,-1,0)
  box(2.2,1.95,.075,paper,root,0,0,1.065)
  box(2.2,1.95,.075,paper,root,0,0,-1.065)
  box(.075,1.95,2.1,paper,root,-1.065,0,0)
  box(.075,1.95,2.1,paper,root,1.065,0,0)
  box(2.06,.03,2.06,interior,root,0,-.9,0)
  const lid = new THREE.Group(); root.add(lid); lid.position.y=1.04
  box(2.3,.22,2.3,paper,lid)
  const bands = new THREE.Group(); root.add(bands)
  box(.31,1.98,.012,satin,bands,0,0,1.108,.004)
  box(.31,1.98,.012,satin,bands,0,0,-1.108,.004)
  box(2.22,.31,.012,satin,bands,0,.02,1.113,.004)
  const lidBands = new THREE.Group(); lid.add(lidBands)
  box(.32,.012,2.31,satin,lidBands,0,.117,0,.004)
  box(2.31,.012,.32,satin,lidBands,0,.122,0,.004)
  box(.32,.23,.012,satin,lidBands,0,0,1.155,.004)
  const bow = new THREE.Group(); lid.add(bow); bow.position.y=.15
  function strip(points:number[][],width:number,twist:number,parent:THREE.Group) {
    const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)), false, 'centripetal')
    const vertices:number[]=[], uv:number[]=[], indices:number[]=[]
    const steps=64, across=8
    for(let i=0;i<=steps;i++) {
      const t=i/steps, p=curve.getPoint(t), tangent=curve.getTangent(t)
      const side=new THREE.Vector3(0,0,1).applyAxisAngle(tangent, .85+Math.sin(t*Math.PI*2)*twist)
      const normal=new THREE.Vector3().crossVectors(tangent,side).normalize()
      for(let j=0;j<=across;j++) {
        const v=j/across-.5
        const fold=Math.cos(v*Math.PI)*.035 + Math.sin(v*Math.PI*6+t*7)*.008
        const pinch=.55+.45*Math.sin(Math.PI*t)
        const q=p.clone().addScaledVector(side,v*width*pinch).addScaledVector(normal,fold)
        vertices.push(q.x,q.y,q.z);uv.push(t,j/across)
        if(i<steps&&j<across){const a=i*(across+1)+j;indices.push(a,a+1,a+across+1,a+1,a+across+2,a+across+1)}
      }
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();geometries.push(geo)
    const mesh=new THREE.Mesh(geo,satin);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh
  }
  const left = new THREE.Group(), right = new THREE.Group(); bow.add(left,right)
  strip([[0,.03,0],[-.42,.1,.03],[-.92,.3,-.04],[-.86,.49,-.10],[-.51,.46,-.08],[-.08,.12,.025]],.36,.35,left)
  strip([[0,.06,0],[.44,.12,.01],[.94,.36,-.12],[.82,.54,-.17],[.43,.43,-.08],[.05,.08,.02]],.37,-.35,right)
  strip([[-.07,.06,.03],[-.36,.1,.43],[-.55,.08,.95],[-.57,-.16,1.42],[-.45,-.76,1.44],[-.64,-1.13,1.38]],.39,.26,left)
  strip([[.07,.04,.02],[.36,.1,.44],[.57,.08,.97],[.69,-.17,1.42],[.87,-.67,1.45],[.7,-.92,1.48]],.38,-.35,right)
  // A broad, folded central band rather than a spherical knot.
  strip([[0,.04,-.17],[0,.21,-.11],[0,.24,.06],[0,.13,.22],[0,.02,.12]],.31,.12,bow)
  const cardMat=new THREE.MeshStandardMaterial({color:'#f3e4c9',roughness:.8})
  const card=box(.95,1.25,.015,cardMat,root,0,.1,.1,.015);card.visible=false
  const glow=new THREE.PointLight('#ffd494',0,5);glow.position.set(0,1.5,.2);root.add(glow)
  let openingAt:number|null=null, frame=0, disposed=false, paused=false
  const smooth=(t:number)=>{const v=THREE.MathUtils.clamp(t,0,1);return v*v*(3-2*v)}
  function render(now:number) {
    if(disposed || paused)return
    const t=openingAt===null?0:(now-openingAt)/1000
    const unbind=smooth(t/1.2), lift=smooth((t-1)/1.5), reveal=smooth((t-1.9)/1.2)
    root.position.y=0
    left.rotation.z=unbind*.32;right.rotation.z=-unbind*.32
    bow.scale.setScalar(1-unbind*.2);bow.position.y=.15+unbind*.12
    bands.visible=t<1.4;bands.scale.x=1+unbind*.15;bands.position.y=-unbind*.35
    lid.position.set(-lift*.2,1.04+lift*1.65,-lift*.65);lid.rotation.x=-lift*.3;lid.rotation.z=-lift*.14
    card.visible=reveal>0;card.position.y=.1+reveal*1.45;card.rotation.y=-.12*reveal;glow.intensity=reveal*2
    camera.position.set(0,3.1+lift*.6,7.8+lift*1.6);camera.lookAt(0,.35+lift*.5,0)
    renderer.render(scene,camera)
    if(openingAt!==null && t<3.6) frame=requestAnimationFrame(render)
  }
  function invalidate(){cancelAnimationFrame(frame);frame=requestAnimationFrame(render)}
  const resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();invalidate()});resize.observe(host)
  const visibility=()=>{paused=document.hidden;if(paused)cancelAnimationFrame(frame);else invalidate()};document.addEventListener('visibilitychange',visibility)
  const lost=(e:Event)=>{e.preventDefault();host.dispatchEvent(new CustomEvent('gift-context-lost'))};renderer.domElement.addEventListener('webglcontextlost',lost)
  invalidate()
  return {
    open(){openingAt=performance.now()-(reduced?3600:0);invalidate()},
    reset(){openingAt=null;invalidate()},
    dispose(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());[paper,satin,interior,cardMat].forEach(m=>m.dispose());paperMap.dispose();env.dispose();renderer.dispose();renderer.domElement.remove()},
  }
}
