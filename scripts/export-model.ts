import {createGiftModel} from '../src/components/GiftModel'
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js'
const model=createGiftModel()
const exporter=new GLTFExporter()
exporter.parseAsync(model.root,{binary:true,onlyVisible:false}).then(buffer=>{const bytes=new Uint8Array(buffer as ArrayBuffer);let text='';for(let i=0;i<bytes.length;i++)text+=String.fromCharCode(bytes[i]);(window as any).modelBase64=btoa(text);model.dispose()})
