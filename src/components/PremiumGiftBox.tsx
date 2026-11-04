import { useEffect, useRef, useState } from 'react'
import type { createGiftRenderer } from './GiftRenderer'
export type OpeningPhase = 'ready' | 'untie' | 'ribbons' | 'lid' | 'reveal'
type Props = { phase: OpeningPhase; onOpen: () => void; reduced?: boolean }
export default function PremiumGiftBox({phase,onOpen,reduced=false}:Props) {
  const host=useRef<HTMLDivElement>(null)
  const model=useRef<ReturnType<typeof createGiftRenderer>|null>(null)
  const [ready,setReady]=useState(false)
  const [fallback,setFallback]=useState(false)
  useEffect(()=>{
    let cancelled=false
    const el=host.current!
    const lost=()=>{setFallback(true);model.current?.dispose();model.current=null}
    el.addEventListener('gift-context-lost',lost)
    import('./GiftRenderer').then(({createGiftRenderer})=>{
      if(cancelled)return
      try {model.current=createGiftRenderer(el,reduced);setReady(true)} catch {setFallback(true)}
    }).catch(()=>{if(!cancelled)setFallback(true)})
    return()=>{cancelled=true;el.removeEventListener('gift-context-lost',lost);model.current?.dispose();model.current=null}
  },[reduced])
  useEffect(()=>{if(phase==='ready')model.current?.reset();else model.current?.open()},[phase,ready])
  return <button className={'gift-object '+(fallback?'gift-fallback':'')} type="button" aria-label="Open your Christmas gift" onClick={onOpen} disabled={phase!=='ready'} data-phase={phase}>
    <img className="gift-poster" src={(window as Window & {__GIFT_POSTER__?:string}).__GIFT_POSTER__ || './gift-poster.webp'} alt="" aria-hidden="true" style={{opacity:ready&&!fallback?0:1}}/>
    <div ref={host} className="gift-canvas" aria-hidden="true" style={{opacity:fallback?0:1}}/>
  </button>
}
