import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, TouchEvent } from 'react'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react'
import PremiumGiftBox from './components/PremiumGiftBox'
import content from './content.json'
import {embeddedGift,preparePhoto,readDraft,writeDraft,exportGift} from './lib/giftFiles'
import type {GiftMemory,Draft} from './lib/giftFiles'
import {loadGiftLayers,loadGiftOpening} from './lib/giftAssets'
import './cinematic.css'

type Scene = 'gift'|'letter'|'memories'|'final'
type Memory = GiftMemory
const copy=content.glowsurprise
const flakes=Array.from({length:32},(_,i)=>({left:`${(i*73+17)%100}%`,delay:`-${i%13}s`,duration:`${12+i%9*2}s`,size:i%8===0?5:i%3===0?2:1,drift:`${(i*17)%65-32}px`}))
function Snow({paused}:{paused:boolean}) {return <div className={'snow '+(paused?'paused':'')} aria-hidden="true">{flakes.map((f,i)=><i key={i} style={{left:f.left,width:f.size,height:f.size,animationDelay:f.delay,animationDuration:f.duration,'--drift':f.drift,opacity:i%8===0?.28:.42} as CSSProperties}/>)}</div>}
function Star(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1 14.3 9.7 23 12l-8.7 2.3L12 23l-2.3-8.7L1 12l8.7-2.3L12 1Z" stroke="currentColor" strokeWidth=".8"/></svg>}
function DemoArt({index}:{index:number}) {
  return <div className={'memory-art art-'+index} role="img" aria-label="Abstract winter landscape, sample artwork"><div className="art-moon"/><div className="art-ridge ridge-back"/><div className="art-ridge ridge-front"/><span className="art-caption">A PLACE FOR<br/><em>your memories.</em></span><small>SAMPLE ARTWORK</small></div>
}
export default function GlowSurprise(){
  const reduced=!!useReducedMotion()
  const [scene,setScene]=useState<Scene>('gift'),[opening,setOpening]=useState(false)
  const [openingUrl,setOpeningUrl]=useState(''),[layersReady,setLayersReady]=useState(false),[preparing,setPreparing]=useState(false)
  const openingRun=useRef(0)
  const [editor,setEditor]=useState(false),[paused,setPaused]=useState(false)
  const [recipient,setRecipient]=useState(embeddedGift?.recipient||copy.recipient),[sender,setSender]=useState(embeddedGift?.sender||copy.sender),[message,setMessage]=useState(embeddedGift?.message||copy.message)
  const [media,setMedia]=useState<Memory[]>(embeddedGift?.media||[]),[index,setIndex]=useState(0),[feedback,setFeedback]=useState('')
  const [busy,setBusy]=useState(false),[savedDraft,setSavedDraft]=useState<Draft|null>(null),[direction,setDirection]=useState(1)
  const received=!!embeddedGift?.received
  const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),title=useRef<HTMLHeadingElement>(null)
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null),urls=useRef(new Set<string>())
  const photoInput=useRef<HTMLInputElement>(null),videoInput=useRef<HTMLInputElement>(null)
  const swipe=useRef<{x:number;y:number}|null>(null)
  const demo=media.length===0,total=demo?copy.demoStories.length:media.length,active=index%total
  const current=media[active]
  useEffect(()=>{const all=urls.current;return()=>{if(timer.current)clearTimeout(timer.current);all.forEach(URL.revokeObjectURL)}},[])
  useEffect(()=>{if(!received)readDraft().then(d=>setSavedDraft(d||null)).catch(()=>{})},[received])
  useEffect(()=>{const before=document.body.style.overflow;if(editor)document.body.style.overflow='hidden';return()=>{document.body.style.overflow=before}},[editor])
  useEffect(()=>{if(editor){opener.current=document.activeElement as HTMLElement;dialog.current?.showModal()}else if(dialog.current?.open){dialog.current.close();opener.current?.focus()}},[editor])
  useEffect(()=>{if(scene!=='gift')title.current?.focus()},[scene])
  function go(next:Scene){setScene(next);window.scrollTo({top:0,behavior:'instant'})}
  function restart(){openingRun.current++;if(openingUrl){URL.revokeObjectURL(openingUrl);urls.current.delete(openingUrl);setOpeningUrl('')}setPreparing(false);if(timer.current)clearTimeout(timer.current);setOpening(false);setIndex(0);go('gift')}
  async function unwrap(){
    if(opening||preparing)return
    const run=++openingRun.current;setPreparing(true)
    if(!reduced){
      let url=''
      try{
        const blob=await loadGiftOpening()
        if(run!==openingRun.current)return
        url=URL.createObjectURL(blob);urls.current.add(url)
        const image=new Image();image.src=url;await image.decode()
        if(run!==openingRun.current){URL.revokeObjectURL(url);urls.current.delete(url);return}
        setOpeningUrl(url)
      }catch{
        if(url){URL.revokeObjectURL(url);urls.current.delete(url)}
        if(run!==openingRun.current)return
        try{await loadGiftLayers();if(run===openingRun.current)setLayersReady(true)}catch{/* The still and letter remain usable if an art asset is unavailable. */}
      }
    }
    if(run!==openingRun.current)return
    setPreparing(false);setOpening(true);timer.current=setTimeout(()=>go('letter'),reduced?80:4600)
  }
  function openEditor(){setEditor(true)}
  async function upload(event:ChangeEvent<HTMLInputElement>,kind:Memory['kind']){
    const files=Array.from(event.target.files||[]);event.target.value='';if(!files.length)return
    const cap=kind==='image'?10-media.filter(m=>m.kind==='image').length:1,limit=(kind==='image'?10:20)*1024*1024
    if(cap===0){setFeedback('Your gift has ten photos. Remove a photo before adding another.');return}
    // HEIC is deliberately rejected: acceptance by a picker is not browser decoding support.
    const valid=files.filter(f=>(kind==='image'?/^image\/(jpeg|png|webp|gif|avif)$/:/^video\/(mp4|webm|quicktime)$/).test(f.type)&&f.size<=limit).slice(0,cap)
    if(!valid.length){setFeedback(kind==='image'?'Choose JPG, PNG, WebP, GIF or AVIF photos under 10 MB. Export HEIC photos as JPG first.':'Choose MP4, WebM or MOV under 20 MB. Playback depends on your browser’s video support.');return}
    const retained=kind==='image'?media:media.filter(m=>m.kind!=='video')
    if(valid.reduce((n,f)=>n+f.size,0)+retained.reduce((n,m)=>n+(m.size||0),0)>35*1024*1024){setFeedback('Please keep the whole gift under 35 MB so it opens comfortably on a phone.');return}
    setBusy(true);setFeedback('Preparing your memories…')
    try{
      const items=await Promise.all(valid.map(async f=>{const source=kind==='image'?await preparePhoto(f):f;return {kind,name:f.name,source,caption:'',size:source.size}}))
      const ready=items.map(m=>{const url=URL.createObjectURL(m.source);urls.current.add(url);return {...m,url}})
      if(kind==='video')media.filter(m=>m.kind==='video').forEach(m=>{if(m.url.startsWith('blob:')){URL.revokeObjectURL(m.url);urls.current.delete(m.url)}})
      setMedia(old=>[...(kind==='image'?old:old.filter(m=>m.kind!=='video')),...ready]);setIndex(0)
      setFeedback(valid.length<files.length?'Some files were skipped. Check the formats, sizes and file limit.':'Your memories are ready. Add a caption or change their order below.')
    }catch{setFeedback('One of these photos could not be opened. Try a JPG or PNG photo.')}finally{setBusy(false)}
  }
  async function saveDraft(){
    setBusy(true)
    try{const draft:Draft={version:1,recipient,sender,message,savedAt:Date.now(),media:await Promise.all(media.map(async m=>({kind:m.kind,name:m.name,caption:m.caption||'',source:m.source||await (await fetch(m.url)).blob()})))};await writeDraft(draft);setSavedDraft(draft);setFeedback('Draft saved on this device. You can come back and restore it here.')}
    catch{setFeedback('This browser could not save the draft. You can still download your gift.')}
    finally{setBusy(false)}
  }
  function restoreDraft(){if(!savedDraft)return;media.forEach(m=>{if(m.url.startsWith('blob:')){URL.revokeObjectURL(m.url);urls.current.delete(m.url)}});setRecipient(savedDraft.recipient);setSender(savedDraft.sender);setMessage(savedDraft.message);setMedia(savedDraft.media.map(m=>{const url=URL.createObjectURL(m.source);urls.current.add(url);return {...m,url,size:m.source.size}}));setIndex(0);setFeedback('Your saved draft is restored.')}
  async function deleteDraft(){try{await writeDraft(null);setSavedDraft(null);setFeedback('Saved draft removed from this device. Your current preview is still open.')}catch{setFeedback('The draft could not be removed. Please try again.')}}
  async function downloadGift(){setBusy(true);setFeedback('Wrapping your gift file…');try{await exportGift({version:1,recipient,sender,message,media});setFeedback('Your gift file is ready. Open it in a browser, or send it privately as a document.')}catch{setFeedback('The gift file could not be created. Please try again.')}finally{setBusy(false)}}
  function reorder(from:number,delta:number){const to=from+delta;if(to<0||to>=media.length)return;setMedia(old=>{const next=[...old];[next[from],next[to]]=[next[to],next[from]];return next});setIndex(0)}
  function removeMedia(url:string){URL.revokeObjectURL(url);urls.current.delete(url);setMedia(old=>old.filter(m=>m.url!==url));setIndex(0)}
  function move(delta:number){setDirection(delta);setIndex(i=>(i+delta+total)%total);setFeedback('')}
  function touchStart(e:TouchEvent){const p=e.changedTouches[0];swipe.current={x:p.clientX,y:p.clientY}}
  function touchEnd(e:TouchEvent){const p=e.changedTouches[0],s=swipe.current;swipe.current=null;if(s&&Math.abs(p.clientX-s.x)>50&&Math.abs(p.clientX-s.x)>Math.abs(p.clientY-s.y)*1.3)move(p.clientX<s.x?1:-1)}
  const transition={duration:reduced?0:.8,ease:[.22,1,.36,1] as [number,number,number,number]}
  return <MotionConfig reducedMotion="user"><div className="cinema" data-scene={scene}>
    <Snow paused={paused||reduced||editor}/>
    <header className="masthead"><button className="brand" onClick={restart} aria-label="GlowSurprise home"><Star/><span>glow<span>surprise</span><sup>™</sup></span></button>{!received&&<button className="text-button personalize" onClick={openEditor}>Make it yours <span aria-hidden="true">↗</span></button>}</header>
    <main id="main">
      <AnimatePresence mode="wait">
        {scene==='gift'&&<motion.section key="gift" className="gift-scene" exit={{opacity:0,filter:reduced?'none':'blur(8px)',scale:reduced?1:1.04}} transition={{duration:reduced?0:.6}}>
          <div className="intro"><div className="edition"><span/>CHRISTMAS, KEPT CLOSE<span/></div><h1>A little wonder.<br/><em>A world of memories.</em></h1><p>{recipient!==copy.recipient?<>A little Christmas wonder, just for<br/><span className="recipient-intro">{recipient}</span></>:<>For the one who makes ordinary moments<br/>feel extraordinary.</>}</p></div>
          <div className="gift-stage"><div className={'light-bloom '+(opening?'is-opening':'')} aria-hidden="true"/><PremiumGiftBox phase={opening?'untie':'ready'} onOpen={unwrap} reduced={reduced} layersReady={layersReady} openingUrl={openingUrl} photoUrl={media.find(m=>m.kind==='image')?.url}/></div>
          <div className="gift-action"><p className="gift-whisper" aria-live="polite">{opening?'Something beautiful is waiting inside.':'A Christmas gift. A story only you can tell.'}</p><button className="primary" onClick={unwrap} disabled={opening||preparing}>{opening?'Opening your surprise…':preparing?'A little magic is on its way…':'Unwrap your surprise'}<span aria-hidden="true">{opening?'✧':'↗'}</span></button><span className="micro">MADE OF MOMENTS. WRAPPED IN LOVE.</span></div>
          <div className="chapter-index"><span>01</span><i/>THE GIFT</div>
        </motion.section>}
        {scene==='letter'&&<motion.section key="letter" className="letter-scene scene" onAnimationComplete={()=>title.current?.focus({preventScroll:true})} initial={{opacity:0,y:reduced?0:35}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-20}} transition={transition}>
          <div className="edition">02 / A FEW WORDS, JUST FOR YOU</div>
          <article className="letter"><div className="letter-top"><Star/><span>CHRISTMAS {copy.year}</span></div><p className="for-you">Especially for</p><h2 ref={title} tabIndex={-1}>{recipient.trim()||copy.recipient}</h2><div className="ink-rule"/><p className="letter-message">{message.trim()||copy.message}</p><p className="letter-signature">{sender.trim()||copy.sender}</p><div className="letter-bottom">A LITTLE LOVE, TO KEEP FOREVER <Star/></div></article>
          <button className="primary" onClick={()=>go('memories')}>Step inside our memories <span aria-hidden="true">↗</span></button>
        </motion.section>}
        {scene==='memories'&&<motion.section key="memories" className="memories-scene scene" onAnimationComplete={()=>title.current?.focus({preventScroll:true})} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={transition}>
          <div className="memory-heading"><div className="edition">03 / THE MOMENTS THAT MATTER</div><h2 ref={title} tabIndex={-1}>If we could keep<br/><em>a moment.</em></h2><p>{demo?'Imagine your favourite memories here.':'This is what a little forever looks like.'}</p></div>
          <div className="memory-display" role="region" aria-label="Your memories" tabIndex={0} onKeyDown={e=>{if((e.target as HTMLElement).closest('video'))return;if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}}} onTouchStart={touchStart} onTouchEnd={touchEnd}>
            <div className="memory-sheet" aria-hidden="true"/>
            <AnimatePresence mode="wait"><motion.figure className="memory-frame" key={demo?'demo'+active:current.url} initial={{opacity:0,x:reduced?0:direction*50,rotate:reduced?0:direction*4}} animate={{opacity:1,x:0,rotate:0}} exit={{opacity:0,x:reduced?0:-direction*50,rotate:reduced?0:-direction*4}} transition={{...transition,duration:reduced?0:.55}}>
              <div className="memory-media">{demo?<DemoArt index={active}/>:current.kind==='image'?<img src={current.url} alt={`Your memory ${active+1}`} onError={()=>setFeedback('This photo could not be opened. Please choose another format in Make it yours.')}/>:<video src={current.url} controls playsInline preload="metadata" aria-label="Your personal memory video" onError={()=>setFeedback('This video format could not be played. Try an H.264 MP4 video.')}/>}</div>
              <figcaption><span>{demo?copy.demoStories[active].title:(current.caption||'A moment worth keeping')}</span><Star/></figcaption>
            </motion.figure></AnimatePresence>
          </div>
          <div className="memory-controls"><button className="round-button" onClick={()=>move(-1)} aria-label="Previous memory">←</button><span aria-live="polite">{String(active+1).padStart(2,'0')} <i>/ {String(total).padStart(2,'0')}</i></span><button className="round-button" onClick={()=>move(1)} aria-label="Next memory">→</button></div>
          {feedback&&<p className="feedback" role="status">{feedback}</p>}
          <button className="primary" onClick={()=>go('final')}>And one more thing <span aria-hidden="true">↗</span></button>
          {demo&&!received&&<button className="text-button demo-link" onClick={openEditor}>Add your photos & video</button>}
        </motion.section>}
        {scene==='final'&&<motion.section key="final" className="final-scene scene" onAnimationComplete={()=>title.current?.focus({preventScroll:true})} initial={{opacity:0,y:reduced?0:20}} animate={{opacity:1,y:0}} transition={transition}><div className="final-star"><Star/></div><div className="edition">04 / ALWAYS, WITH LOVE</div><h2 ref={title} tabIndex={-1}>The best part<br/>of every memory<br/><em>is you.</em></h2><p>Here’s to all the Christmases to come.<br/>And all the little forevers in between.</p><span className="final-signature">{sender.trim()||copy.sender}</span><button className="primary" onClick={restart}>Feel it all again <span aria-hidden="true">↺</span></button>{!received&&<button className="text-button" onClick={openEditor}>Finish & download your gift ↗</button>}</motion.section>}
      </AnimatePresence>
    </main>
    <footer className="footer"><span>A GLOWSURPRISE CHRISTMAS</span><button className="motion-toggle" onClick={()=>setPaused(p=>!p)} aria-pressed={paused||reduced} disabled={reduced}>{paused||reduced?'Snow paused':'Pause snow'}</button><span>{copy.year}</span></footer>
    <dialog ref={dialog} className="editor" aria-labelledby="editor-title" onKeyDown={e=>{if(e.key!=='Tab')return;const items=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([hidden]), textarea'));const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}} onCancel={()=>setEditor(false)} onClick={e=>{if(e.target===e.currentTarget)setEditor(false)}}>
      <div className="editor-inner"><div className="editor-top"><span className="edition">YOUR CHRISTMAS STUDIO</span><button className="round-button" onClick={()=>setEditor(false)} aria-label="Close editor">×</button></div><h2 id="editor-title">Make it <em>personal.</em></h2><p className="editor-deck">A few favourite moments. A few words from the heart. A gift that could only come from you.</p>
      <div className="studio-steps"><span>01 <b>Your words</b></span><span>02 <b>Your memories</b></span><span>03 <b>Your gift</b></span></div>
      {savedDraft&&<div className="draft-banner"><span>A saved draft is waiting on this device.</span><button onClick={restoreDraft} disabled={busy}>Restore draft</button><button onClick={deleteDraft} disabled={busy}>Remove saved draft</button></div>}
      <label className="field">For<input autoComplete="off" maxLength={45} value={recipient} onChange={e=>setRecipient(e.target.value)}/></label><label className="field">From<input autoComplete="off" maxLength={55} value={sender} onChange={e=>setSender(e.target.value)}/></label><label className="field">Your Christmas message<textarea maxLength={450} rows={5} value={message} onChange={e=>setMessage(e.target.value)}/><span>{message.length} / 450</span></label>
      <div className="upload-grid"><input aria-label="Upload photos" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple hidden ref={photoInput} onChange={e=>upload(e,'image')}/><input aria-label="Upload video" type="file" accept="video/mp4,video/webm,video/quicktime" hidden ref={videoInput} onChange={e=>upload(e,'video')}/><button disabled={busy||media.filter(m=>m.kind==='image').length>=10} onClick={()=>photoInput.current?.click()}><span>＋</span>Add photos<small>Up to 10 · 10 MB each</small></button><button disabled={busy} onClick={()=>videoInput.current?.click()}><span>▷</span>Add a video<small>One video · 20 MB</small></button></div>
      {media.length>0&&<><div className="collection-summary">{media.length} {media.length===1?'memory':'memories'} · {(media.reduce((n,m)=>n+(m.size||0),0)/1024/1024).toFixed(1)} MB <span>Your first photo appears in the reveal.</span></div><ol className="memory-editor-list">{media.map((m,i)=><li key={m.url}><div className="memory-editor-thumb">{m.kind==='image'?<img src={m.url} alt=""/>:<span aria-hidden="true">▷</span>}<b>{String(i+1).padStart(2,'0')}</b></div><div className="memory-editor-details"><span className="file-name">{m.name}</span><label>Caption<input maxLength={90} value={m.caption||''} placeholder="What made this moment special?" onChange={e=>setMedia(old=>old.map(item=>item.url===m.url?{...item,caption:e.target.value}:item))}/></label><div className="memory-editor-actions"><button disabled={busy||i===0} onClick={()=>reorder(i,-1)} aria-label={'Move '+m.name+' earlier'}>↑</button><button disabled={busy||i===media.length-1} onClick={()=>reorder(i,1)} aria-label={'Move '+m.name+' later'}>↓</button><button disabled={busy} onClick={()=>removeMedia(m.url)} aria-label={'Remove '+m.name}>Remove</button></div></div></li>)}</ol></>}
      <p className="feedback" role="status">{feedback}</p>
      <div className="studio-finish"><span className="edition">READY TO MAKE SOMEONE SMILE?</span><button className="primary" disabled={busy} onClick={()=>{setEditor(false);restart()}}>Preview my gift <span aria-hidden="true">↗</span></button><button className="download-gift" disabled={busy} onClick={downloadGift}>{busy?'Preparing…':'Download this gift'} <span aria-hidden="true">↓</span></button><button className="text-button save-draft" disabled={busy} onClick={saveDraft}>Save draft on this device</button><div className="privacy-note">Your memories stay on your device. Nothing is uploaded. Download a complete HTML gift to open in a browser or send as a document. Anyone with the file can view it. Mobile file viewers may require “Open in browser”. A shareable web link is not included.</div></div></div>
    </dialog>
  </div></MotionConfig>
}
