type Assets={poster?:string;base?:string;lid?:string;opening?:string}
const embedded=(window as Window&{__GIFT_ASSETS__?:Assets}).__GIFT_ASSETS__
export const giftAssets={poster:embedded?.poster||'./gift-poster.webp',base:embedded?.base||'./gift-base.webp',lid:embedded?.lid||'./gift-lid.webp',opening:embedded?.opening||'./gift-opening.webp'}
let layersPromise:Promise<void>|null=null
export function loadGiftLayers(){
  if(!layersPromise)layersPromise=Promise.all([giftAssets.base,giftAssets.lid].map(src=>{const image=new Image();image.src=src;return image.decode()})).then(()=>{}).catch(error=>{layersPromise=null;throw error})
  return layersPromise
}

let openingPromise:Promise<Blob>|null=null
export function loadGiftOpening(){
  if(!openingPromise)openingPromise=fetch(giftAssets.opening).then(r=>{if(!r.ok)throw new Error('Opening unavailable');return r.blob()}).catch(error=>{openingPromise=null;throw error})
  return openingPromise
}
