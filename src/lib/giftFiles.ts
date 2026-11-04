export type GiftMemory={kind:'image'|'video';url:string;name:string;caption?:string;source?:Blob;size?:number}
export type GiftPayload={version:1;recipient:string;sender:string;message:string;media:GiftMemory[];received?:boolean}
export type Draft={version:1;recipient:string;sender:string;message:string;media:{kind:'image'|'video';name:string;caption:string;source:Blob}[];savedAt:number}
export const embeddedGift=(window as Window&{__GLOW_GIFT__?:GiftPayload}).__GLOW_GIFT__

export async function preparePhoto(file:File):Promise<Blob>{
  if(file.type==='image/gif')return file
  const url=URL.createObjectURL(file)
  try{
    const image=new Image();image.src=url;await image.decode()
    const scale=Math.min(1,1800/Math.max(image.width,image.height))
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale))
    const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height)
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not prepare this photo')),'image/jpeg',.89))
    return blob.size<file.size||scale<1?blob:file
  }finally{URL.revokeObjectURL(url)}
}
function openDraftDB():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const request=indexedDB.open('glowsurprise-private-draft',1);request.onupgradeneeded=()=>request.result.createObjectStore('gifts');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
export async function readDraft():Promise<Draft|undefined>{const db=await openDraftDB();try{return await new Promise((resolve,reject)=>{const request=db.transaction('gifts').objectStore('gifts').get('current');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}finally{db.close()}}
export async function writeDraft(draft:Draft|null){const db=await openDraftDB();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('gifts','readwrite');if(draft)tx.objectStore('gifts').put(draft,'current');else tx.objectStore('gifts').delete('current');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
function blobData(blob:Blob):Promise<string>{return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob)})}
export async function exportGift(data:GiftPayload){
  const media=await Promise.all(data.media.map(async m=>({kind:m.kind,name:m.name,caption:m.caption||'',url:m.url.startsWith('data:')?m.url:await blobData(m.source||await (await fetch(m.url)).blob())})))
  const payload={version:1,recipient:data.recipient,sender:data.sender,message:data.message,media,received:true}
  let template:string
  if(location.protocol==='file:'){
    const clone=document.documentElement.cloneNode(true) as HTMLElement
    clone.querySelector('#root')!.innerHTML=''
    clone.querySelectorAll('[data-gift-payload]').forEach(el=>el.remove())
    // The maker's open dialog locks body scroll; that transient state must not
    // travel into the recipient document, especially with a long letter.
    const body=clone.querySelector('body')
    if(body)body.style.overflow=''
    template='<!doctype html>'+clone.outerHTML
  }else{
    const response=await fetch(new URL('./gift-template.html',location.href));if(!response.ok)throw new Error('The gift template is unavailable. Please try again.');template=await response.text()
  }
  // Encode every '<' so even a literal closing-script string stays inert data.
  const json=JSON.stringify(payload).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')
  const tag=`<script data-gift-payload>window.__GLOW_GIFT__=${json};</script>`
  template=template.replace('<head>','<head>'+tag)
  const blob=new Blob([template],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a')
  a.href=url;a.download='GlowSurprise-for-'+(data.recipient.replace(/[^a-zA-Z0-9 -]/g,'').trim().replace(/\s+/g,'-')||'you')+'.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)
  return blob.size
}
