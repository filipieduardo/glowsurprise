import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

type FabricOptions={width:number;roll?:number;twist?:number;pinch?:boolean;fold?:number;fork?:boolean}
/** An original folded-sheet model. Width frames are orthogonal to each curve.
 * UV.x follows the fibre, giving anisotropic highlights a physical direction. */
export function createGiftModel(){
  const root=new THREE.Group(),lid=new THREE.Group(),wrap=new THREE.Group(),bow=new THREE.Group()
  const geometries:THREE.BufferGeometry[]=[],materials:THREE.Material[]=[],textures:THREE.Texture[]=[]
  root.name='GiftRoot';lid.name='Lid';wrap.name='Wrap';bow.name='Bow';
  root.add(lid,wrap);lid.add(bow);lid.position.y=1.06;bow.position.y=.155
  let seed=82;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}
  function canvasTexture(w:number,h:number,paint:(ctx:CanvasRenderingContext2D)=>void,color=false){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d')!);const texture=new THREE.CanvasTexture(c);if(color)texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=4;textures.push(texture);return texture}
  const paperColor=canvasTexture(256,256,ctx=>{const g=ctx.createLinearGradient(0,0,256,160);g.addColorStop(0,'#68102c');g.addColorStop(.5,'#510b24');g.addColorStop(1,'#350719');ctx.fillStyle=g;ctx.fillRect(0,0,256,256)},true)
  const paperGrain=canvasTexture(256,256,ctx=>{ctx.fillStyle='#808080';ctx.fillRect(0,0,256,256);for(let i=0;i<40000;i++){const n=100+Math.floor(rand()*56);ctx.fillStyle=`rgb(${n},${n},${n})`;ctx.fillRect(rand()*256,rand()*256,.7,.7)}});paperGrain.repeat.set(3,3)
  const satinWeave=canvasTexture(512,128,ctx=>{ctx.fillStyle='#808080';ctx.fillRect(0,0,512,128);for(let y=0;y<128;y++){ctx.fillStyle=`rgb(${Math.round(128+Math.sin(y*Math.PI/2)*14)},${Math.round(128+Math.sin(y*Math.PI/2)*14)},${Math.round(128+Math.sin(y*Math.PI/2)*14)})`;ctx.fillRect(0,y,512,1)}for(let i=0;i<8000;i++){ctx.fillStyle=i%2?'#ffffff0b':'#00000009';ctx.fillRect(rand()*512,rand()*128,2,.5)}})
  const paper=new THREE.MeshPhysicalMaterial({map:paperColor,bumpMap:paperGrain,bumpScale:.008,roughness:.48,metalness:0,sheen:.16,sheenColor:new THREE.Color('#691d38'),sheenRoughness:.8,envMapIntensity:.45})
  const satin=new THREE.MeshPhysicalMaterial({color:'#d6be8b',metalness:0,roughness:.25,ior:1.46,anisotropy:.92,anisotropyRotation:0,sheen:.55,sheenColor:new THREE.Color('#f1ddae'),sheenRoughness:.35,bumpMap:satinWeave,bumpScale:.002,side:THREE.DoubleSide,envMapIntensity:1.1})
  const selvedge=new THREE.MeshPhysicalMaterial({color:'#cbb280',metalness:0,roughness:.39,anisotropy:.75,sheen:.5,side:THREE.DoubleSide,envMapIntensity:.8})
  const lining=new THREE.MeshStandardMaterial({color:'#240b16',roughness:.88})
  paper.name='Burgundy paper';satin.name='Champagne satin';selvedge.name='Woven edges';lining.name='Dark lining';
  materials.push(paper,satin,selvedge,lining)
  function box(w:number,h:number,d:number,material:THREE.Material,parent:THREE.Group,x=0,y=0,z=0,bevel=.016){const geo=new RoundedBoxGeometry(w,h,d,4,bevel);geometries.push(geo);const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
  const closed=box(2.26,2.06,2.26,paper,root,0,-.025,0,.025)
  closed.name='ClosedBody'
  const walls=new THREE.Group();walls.name='Walls';root.add(walls);walls.visible=false
  box(2.26,.09,2.26,paper,walls,0,-1.01,0)
  box(2.26,2.01,.065,paper,walls,0,0,1.097)
  box(2.26,2.01,.065,paper,walls,0,0,-1.097)
  box(.065,2.01,2.15,paper,walls,1.097,0,0)
  box(.065,2.01,2.15,paper,walls,-1.097,0,0)
  box(2.1,.025,2.1,lining,walls,0,-.94,0)
  // Thin board lid, fitted skirt, and underside inset. No floating side panels.
  box(2.34,.08,2.34,paper,lid,0,.10,0,.018)
  box(2.34,.18,.055,paper,lid,0,0,1.14)
  box(2.34,.18,.055,paper,lid,0,0,-1.14)
  box(.055,.18,2.25,paper,lid,-1.14,0,0)
  box(.055,.18,2.25,paper,lid,1.14,0,0)
  box(2.19,.025,2.19,lining,lid,0,.045,0)

  function sheet(points:number[][],options:FabricOptions,parent:THREE.Group,reference=new THREE.Vector3(0,0,1)){
    const {width,roll=0,twist=0,pinch=false,fold=.012,fork=false}=options
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal')
    const rows=96,cols=12,positions:number[]=[],uv:number[]=[],indices:number[]=[]
    for(let i=0;i<=rows;i++){
      const t=i/rows,p=curve.getPoint(t),tangent=curve.getTangent(t).normalize()
      const side=reference.clone().addScaledVector(tangent,-reference.dot(tangent)).normalize()
      if(side.lengthSq()<.01)side.set(1,0,0).cross(tangent).normalize()
      side.applyAxisAngle(tangent,roll+Math.sin(t*Math.PI*2)*twist)
      const normal=new THREE.Vector3().crossVectors(tangent,side).normalize()
      const gather=pinch?.48+.52*Math.pow(Math.sin(Math.PI*t),.5):1
      for(let j=0;j<=cols;j++){
        const v=j/cols-.5
        // Soft transverse crown; gathered fine folds near the knot, quiet elsewhere.
        const crown=(1-4*v*v)*fold
        const pleat=pinch?Math.sin(v*17+t*3)*.018*Math.pow(Math.abs(t-.5)*2,3):Math.sin(v*11+t*8)*.003
        const notch=fork&&t>.91?(1-Math.abs(v)*2)*.13*Math.pow((t-.91)/.09,2):0
        const q=p.clone().addScaledVector(side,v*width*gather).addScaledVector(normal,crown+pleat).addScaledVector(tangent,-notch)
        positions.push(q.x,q.y,q.z);uv.push(t*3,j/cols)
        if(i<rows&&j<cols){const a=i*(cols+1)+j;indices.push(a,a+1,a+cols+1,a+1,a+cols+2,a+cols+1)}
      }
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();geo.computeTangents();geometries.push(geo)
    const mesh=new THREE.Mesh(geo,satin);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh)
    // Flat woven hems, not piping or tubes. They follow the exact sheet edges.
    for(const sideIndex of [0,cols]){
      const pos:number[]=[],tuv:number[]=[],idx:number[]=[]
      for(let i=0;i<=rows;i++)for(let k=0;k<2;k++){
        const a=(i*(cols+1)+sideIndex)*3,b=(i*(cols+1)+(sideIndex===0?1:cols-1))*3
        const blend=k*.11;pos.push(positions[a]*(1-blend)+positions[b]*blend,positions[a+1]*(1-blend)+positions[b+1]*blend+.0008,positions[a+2]*(1-blend)+positions[b+2]*blend);tuv.push(i/rows,k)
        if(i<rows&&k===0){const n=i*2;idx.push(n,n+1,n+2,n+1,n+3,n+2)}
      }
      const edgeGeo=new THREE.BufferGeometry();edgeGeo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));edgeGeo.setAttribute('uv',new THREE.Float32BufferAttribute(tuv,2));edgeGeo.setIndex(idx);edgeGeo.computeVertexNormals();edgeGeo.computeTangents();geometries.push(edgeGeo);parent.add(new THREE.Mesh(edgeGeo,selvedge))
    }
    return mesh
  }
  // The two wraps cross on the top. They run around the actual package, not
  // an unexplained horizontal bar pasted over the front face.
  const wrapFront=new THREE.Group(),wrapSide=new THREE.Group();wrapFront.name='WrapFront';wrapSide.name='WrapSide';wrap.add(wrapFront,wrapSide)
  sheet([[0,-1.03,1.165],[0,-.8,1.165],[0,-.4,1.165],[0,0,1.165],[0,.4,1.165],[0,.8,1.165],[0,.97,1.20],[0,1.15,1.18],[0,1.212,1.06],[0,1.212,-1.06],[0,1.13,-1.18],[0,.8,-1.143],[0,-1.02,-1.143]],{width:.36,fold:.006},wrapFront,new THREE.Vector3(-1,0,0))
  sheet([[-1.14,-1.02,0],[-1.14,.8,0],[-1.19,1.1,0],[-1.08,1.218,0],[1.08,1.218,0],[1.19,1.1,0],[1.14,.8,0],[1.14,-1.02,0]],{width:.36,fold:.005},wrapSide,new THREE.Vector3(0,0,1))
  const left=new THREE.Group(),right=new THREE.Group();left.name='BowLeft';right.name='BowRight';bow.add(left,right)
  sheet([[-.06,.11,.025],[-.39,.18,-.08],[-.88,.42,-.13],[-1.03,.61,-.04],[-.83,.67,.07],[-.43,.47,.11],[-.04,.12,.08]],{width:.37,roll:.72,twist:.22,pinch:true,fold:.021},left)
  sheet([[.04,.1,-.03],[.45,.14,-.13],[.95,.32,-.19],[1.04,.51,-.12],[.8,.59,.015],[.39,.42,.10],[.04,.13,.1]],{width:.38,roll:.76,twist:-.24,pinch:true,fold:.019},right)
  sheet([[-.06,.10,.11],[-.31,.11,.40],[-.48,.03,.91],[-.55,-.04,1.20],[-.56,-.31,1.39],[-.49,-.74,1.4],[-.72,-1.18,1.43]],{width:.43,roll:0,twist:.28,fold:.016,fork:true},left,new THREE.Vector3(1,0,0))
  sheet([[.07,.09,.08],[.35,.10,.35],[.61,.04,.83],[.75,-.07,1.23],[.77,-.4,1.39],[.87,-.75,1.40],[.64,-1.04,1.47]],{width:.42,roll:0,twist:-.3,fold:.017,fork:true},right,new THREE.Vector3(1,0,0))
  sheet([[0,.04,-.15],[0,.22,-.10],[0,.26,.09],[0,.12,.24],[0,-.01,.13]],{width:.30,roll:0,pinch:false,fold:.018},bow,new THREE.Vector3(1,0,0))

  // Ivory card rises from the hollow box; a real portrait can be applied here.
  const cardGroup=new THREE.Group();cardGroup.name='Card';root.add(cardGroup);cardGroup.visible=false
  const cardMat=new THREE.MeshStandardMaterial({color:'#f7efdd',roughness:.8});materials.push(cardMat)
  box(.88,1.10,.025,cardMat,cardGroup,0,0,0,.012)
  const cardFace=canvasTexture(256,320,ctx=>{ctx.fillStyle='#f6ecda';ctx.fillRect(0,0,256,320);ctx.strokeStyle='#bc9a65';ctx.lineWidth=1;ctx.strokeRect(12,12,232,296);ctx.fillStyle='#476052';ctx.textAlign='center';ctx.font='italic 28px Georgia';ctx.fillText('For you.',128,163);ctx.font='10px Arial';ctx.fillText('WITH ALL MY LOVE',128,195)},true)
  const faceMat=new THREE.MeshBasicMaterial({map:cardFace});materials.push(faceMat)
  const faceGeo=new THREE.PlaneGeometry(.85,1.07);geometries.push(faceGeo);const face=new THREE.Mesh(faceGeo,faceMat);face.position.z=.015;cardGroup.add(face)
  const smooth=(n:number)=>{const t=THREE.MathUtils.clamp(n,0,1);return t*t*(3-2*t)}
  function pose(seconds:number){
    const loosen=smooth(seconds/.95),release=smooth((seconds-.6)/1.1),lift=smooth((seconds-1.45)/1.5),reveal=smooth((seconds-2.4)/1.3)
    closed.visible=lift<.012;walls.visible=!closed.visible
    left.rotation.z=loosen*.15+release*.14;right.rotation.z=-loosen*.18-release*.12
    bow.scale.set(1+loosen*.07,1-loosen*.16,1)
    wrapFront.position.set(-release*.26,-release*1.7,release*.35);wrapFront.rotation.z=-release*.26
    wrapSide.position.set(release*1.2,-release*1.5,0);wrapSide.rotation.z=-release*.35;wrap.visible=release<.98
    lid.position.set(-lift*.23,1.06+lift*1.52,-lift*.6);lid.rotation.set(-lift*.17,0,-lift*.16)
    cardGroup.visible=reveal>0;cardGroup.position.set(0,.1+reveal*1.28,.26);cardGroup.rotation.set(-.07,-reveal*.12,-reveal*.04)
    return {lift,reveal,release}
  }
  function setPhoto(url?:string){if(!url)return;const image=new Image();image.onload=()=>{const c=document.createElement('canvas');c.width=256;c.height=320;const ctx=c.getContext('2d')!;ctx.fillStyle='#f5ecdc';ctx.fillRect(0,0,256,320);const scale=Math.min(232/image.width,264/image.height);ctx.drawImage(image,(256-image.width*scale)/2,12+(264-image.height*scale)/2,image.width*scale,image.height*scale);ctx.fillStyle='#49604e';ctx.font='italic 15px Georgia';ctx.textAlign='center';ctx.fillText('A moment to keep.',128,302);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);faceMat.map=t;faceMat.needsUpdate=true};image.src=url}
  return {root,pose,setPhoto,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose())}}
}
