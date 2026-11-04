import {giftAssets} from '../lib/giftAssets'
export type OpeningPhase='ready'|'untie'|'ribbons'|'lid'|'reveal'
type Props={phase:OpeningPhase;onOpen:()=>void;reduced?:boolean;photoUrl?:string;layersReady?:boolean;openingUrl?:string}
/** Original Cycles art in transparent layers. Physical light is baked once;
 * the recipient's device only composites images and the personal memory. */
export default function PremiumGiftBox({phase,onOpen,reduced=false,photoUrl,layersReady=false,openingUrl='' }:Props){
  const opening=phase!=='ready'&&!reduced
  const layered=opening&&!openingUrl&&layersReady
  return <button className={'gift-object baked-gift '+(openingUrl&&opening?'is-baked-opening':layered?'is-unwrapping':'')} type="button" aria-label="Open your Christmas gift" onClick={onOpen} disabled={phase!=='ready'} data-phase={phase}>
    {layered&&<img className="gift-layer gift-base" src={giftAssets.base} alt="" aria-hidden="true" width={720} height={680}/>}
    <img className="gift-poster" src={opening&&openingUrl?openingUrl:giftAssets.poster} alt="" aria-hidden="true" width={720} height={680}/>
    {layered&&<img className="gift-layer gift-lid" src={giftAssets.lid} alt="" aria-hidden="true" width={720} height={680}/>}
    {opening&&(photoUrl||layered)&&<div className="personal-memory-reveal" aria-hidden="true">{photoUrl?<img src={photoUrl} alt=""/>:<div className="reveal-inscription"><span>✧</span><em>For you.</em><small>WITH ALL MY LOVE</small></div>}<span>{photoUrl?'A moment to keep.':'A little love, just for you.'}</span></div>}
  </button>
}
