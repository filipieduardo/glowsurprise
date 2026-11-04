import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, TouchEvent } from 'react'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react'
import PremiumGiftBox from './components/PremiumGiftBox'
import content from './content.json'
import './cinematic.css'

type Scene = 'gift'|'letter'|'memories'|'final'
type Memory = {kind:'image'|'video';url:string;name:string}
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
  const [editor,setEditor]=useState(false),[paused,setPaused]=useState(false)
  const [recipient,setRecipient]=useState(copy.recipient),[sender,setSender]=useState(copy.sender),[message,setMessage]=useState(copy.message)
  const [media,setMedia]=useState<Memory[]>([]),[index,setIndex]=useState(0),[feedback,setFeedback]=useState('')
  const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),title=useRef<HTMLHeadingElement>(null)
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null),urls=useRef(new Set<string>())
  const photoInput=useRef<HTMLInputElement>(null),videoInput=useRef<HTMLInputElement>(null)
  const swipe=useRef<{x:number;y:number}|null>(null)
  const demo=media.length===0,total=demo?copy.demoStories.length:media.length,active=index%total
  const current=media[active]
  useEffect(()=>{const all=urls.current;return()=>{if(timer.current)clearTimeout(timer.current);all.forEach(URL.revokeObjectURL)}},[])
  useEffect(()=>{if(editor){opener.current=document.activeElement as HTMLElement;dialog.current?.showModal()}else if(dialog.current?.open){dialog.current.close();opener.current?.focus()}},[editor])
  useEffect(()=>{if(scene!=='gift')title.current?.focus()},[scene])
  function go(next:Scene){setScene(next);window.scrollTo({top:0,behavior:'instant'})}
  function restart(){if(timer.current)clearTimeout(timer.current);setOpening(false);setIndex(0);go('gift')}
  function unwrap(){if(opening)return;setOpening(true);timer.current=setTimeout(()=>go('letter'),reduced?80:3800)}
  function openEditor(){setEditor(true)}
  function upload(event:ChangeEvent<HTMLInputElement>,kind:Memory['kind']){
    const files=Array.from(event.target.files||[]);event.target.value='';if(!files.length)return
    const cap=kind==='image'?10:1,limit=(kind==='image'?10:20)*1024*1024
    // HEIC is deliberately rejected: acceptance by a picker is not browser decoding support.
    const valid=files.filter(f=>(kind==='image'?/^image\/(jpeg|png|webp|gif|avif)$/:/^video\/(mp4|webm|quicktime)$/).test(f.type)&&f.size<=limit).slice(0,cap)
    if(!valid.length){setFeedback(kind==='image'?'Choose JPG, PNG, WebP, GIF or AVIF photos under 10 MB. Export HEIC photos as JPG first.':'Choose MP4, WebM or MOV under 20 MB. Playback depends on your browser’s video support.');return}
    media.filter(m=>m.kind===kind).forEach(m=>{URL.revokeObjectURL(m.url);urls.current.delete(m.url)})
    const items=valid.map(f=>{const url=URL.createObjectURL(f);urls.current.add(url);return {kind,url,name:f.name}})
    setMedia(old=>[...old.filter(m=>m.kind!==kind),...items].sort((a,b)=>a.kind.localeCompare(b.kind)));setIndex(0)
    setFeedback(valid.length<files.length?'Some files were skipped. Check the formats, sizes and file limit.':'Your memories are ready to preview.')
  }
  function removeMedia(url:string){URL.revokeObjectURL(url);urls.current.delete(url);setMedia(old=>old.filter(m=>m.url!==url));setIndex(0)}
  function move(delta:number){setIndex(i=>(i+delta+total)%total);setFeedback('')}
  function touchStart(e:TouchEvent){const p=e.changedTouches[0];swipe.current={x:p.clientX,y:p.clientY}}
  function touchEnd(e:TouchEvent){const p=e.changedTouches[0],s=swipe.current;swipe.current=null;if(s&&Math.abs(p.clientX-s.x)>50&&Math.abs(p.clientX-s.x)>Math.abs(p.clientY-s.y)*1.3)move(p.clientX<s.x?1:-1)}
  const transition={duration:reduced?0:.8,ease:[.22,1,.36,1] as [number,number,number,number]}
  return <MotionConfig reducedMotion="user"><div className="cinema" data-scene={scene}>
    <Snow paused={paused||reduced||editor}/>
    <header className="masthead"><button className="brand" onClick={restart} aria-label="GlowSurprise home"><Star/><span>glow<span>surprise</span><sup>™</sup></span></button><button className="text-button personalize" onClick={openEditor}>Make it yours <span aria-hidden="true">↗</span></button></header>
    <main id="main">
      <AnimatePresence mode="wait">
        {scene==='gift'&&<motion.section key="gift" className="gift-scene" exit={{opacity:0,filter:reduced?'none':'blur(8px)',scale:reduced?1:1.04}} transition={{duration:reduced?0:.6}}>
          <div className="intro"><div className="edition"><span/>CHRISTMAS, KEPT CLOSE<span/></div><h1>A little wonder.<br/><em>A world of memories.</em></h1><p>For the one who makes ordinary moments<br/>feel extraordinary.</p></div>
          <div className="gift-stage"><div className={'light-bloom '+(opening?'is-opening':'')} aria-hidden="true"/><PremiumGiftBox phase={opening?'untie':'ready'} onOpen={unwrap} reduced={reduced}/></div>
          <div className="gift-action"><p className="gift-whisper" aria-live="polite">{opening?'Something beautiful is waiting inside.':'A Christmas gift. A story only you can tell.'}</p><button className="primary" onClick={unwrap} disabled={opening}>{opening?'Opening your surprise…':'Unwrap your surprise'}<span aria-hidden="true">{opening?'✧':'↗'}</span></button><span className="micro">MADE OF MOMENTS. WRAPPED IN LOVE.</span></div>
          <div className="chapter-index"><span>01</span><i/>THE GIFT</div>
        </motion.section>}
        {scene==='letter'&&<motion.section key="letter" className="letter-scene scene" onAnimationComplete={()=>title.current?.focus({preventScroll:true})} initial={{opacity:0,y:reduced?0:35}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-20}} transition={transition}>
          <div className="edition">02 / A FEW WORDS, JUST FOR YOU</div>
          <article className="letter"><div className="letter-top"><Star/><span>CHRISTMAS {copy.year}</span></div><p className="for-you">Especially for</p><h2 ref={title} tabIndex={-1}>{recipient.trim()||copy.recipient}</h2><div className="ink-rule"/><p className="letter-message">{message.trim()||copy.message}</p><p className="letter-signature">{sender.trim()||copy.sender}</p><div className="letter-bottom">A LITTLE LOVE, TO KEEP FOREVER <Star/></div></article>
          <button className="primary" onClick={()=>go('memories')}>Step inside our memories <span aria-hidden="true">↗</span></button>
        </motion.section>}
        {scene==='memories'&&<motion.section key="memories" className="memories-scene scene" onAnimationComplete={()=>title.current?.focus({preventScroll:true})} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={transition}>
          <div className="memory-heading"><div className="edition">03 / THE MOMENTS THAT MATTER</div><h2 ref={title} tabIndex={-1}>If we could keep<br/><em>a moment.</em></h2><p>{demo?'Imagine your favourite memories here.':'This is what a little forever looks like.'}</p></div>
          <div className="memory-display" onTouchStart={touchStart} onTouchEnd={touchEnd}>
            <div className="memory-sheet" aria-hidden="true"/>
            <AnimatePresence mode="wait"><motion.figure className="memory-frame" key={demo?'demo'+active:current.url} initial={{opacity:0,x:reduced?0:30,rotate:reduced?0:3}} animate={{opacity:1,x:0,rotate:0}} exit={{opacity:0,x:reduced?0:-30,rotate:reduced?0:-3}} transition={{...transition,duration:reduced?0:.55}}>
              <div className="memory-media">{demo?<DemoArt index={active}/>:current.kind==='image'?<img src={current.url} alt={`Your memory ${active+1}`} onError={()=>setFeedback('This photo could not be opened. Please choose another format in Make it yours.')}/>:<video src={current.url} controls playsInline preload="metadata" aria-label="Your personal memory video" onError={()=>setFeedback('This video format could not be played. Try an H.264 MP4 video.')}/>}</div>
              <figcaption><span>{demo?copy.demoStories[active].title:'A moment worth keeping'}</span><Star/></figcaption>
            </motion.figure></AnimatePresence>
          </div>
          <div className="memory-controls"><button className="round-button" onClick={()=>move(-1)} aria-label="Previous memory">←</button><span aria-live="polite">{String(active+1).padStart(2,'0')} <i>/ {String(total).padStart(2,'0')}</i></span><button className="round-button" onClick={()=>move(1)} aria-label="Next memory">→</button></div>
          {feedback&&<p className="feedback" role="status">{feedback}</p>}
          <button className="primary" onClick={()=>go('final')}>And one more thing <span aria-hidden="true">↗</span></button>
          {demo&&<button className="text-button demo-link" onClick={openEditor}>Add your photos & video</button>}
        </motion.section>}
        {scene==='final'&&<motion.section key="final" className="final-scene scene" onAnimationComplete={()=>title.current?.focus({preventScroll:true})} initial={{opacity:0,y:reduced?0:20}} animate={{opacity:1,y:0}} transition={transition}><div className="final-star"><Star/></div><div className="edition">04 / ALWAYS, WITH LOVE</div><h2 ref={title} tabIndex={-1}>The best part<br/>of every memory<br/><em>is you.</em></h2><p>Here’s to all the Christmases to come.<br/>And all the little forevers in between.</p><span className="final-signature">{sender.trim()||copy.sender}</span><button className="primary" onClick={restart}>Feel it all again <span aria-hidden="true">↺</span></button><button className="text-button" onClick={openEditor}>Make a little magic of your own ↗</button></motion.section>}
      </AnimatePresence>
    </main>
    <footer className="footer"><span>A GLOWSURPRISE CHRISTMAS</span><button className="motion-toggle" onClick={()=>setPaused(p=>!p)} aria-pressed={paused||reduced} disabled={reduced}>{paused||reduced?'Snow paused':'Pause snow'}</button><span>{copy.year}</span></footer>
    <dialog ref={dialog} className="editor" aria-labelledby="editor-title" onKeyDown={e=>{if(e.key!=='Tab')return;const items=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([hidden]), textarea'));const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}} onCancel={()=>setEditor(false)} onClick={e=>{if(e.target===e.currentTarget)setEditor(false)}}>
      <div className="editor-inner"><div className="editor-top"><span className="edition">YOUR CHRISTMAS STUDIO</span><button className="round-button" onClick={()=>setEditor(false)} aria-label="Close editor">×</button></div><h2 id="editor-title">Make it <em>personal.</em></h2><p className="editor-deck">A few favourite moments. A few words from the heart. A gift that could only come from you.</p>
      <label className="field">For<input autoComplete="off" maxLength={45} value={recipient} onChange={e=>setRecipient(e.target.value)}/></label><label className="field">From<input autoComplete="off" maxLength={55} value={sender} onChange={e=>setSender(e.target.value)}/></label><label className="field">Your Christmas message<textarea maxLength={450} rows={5} value={message} onChange={e=>setMessage(e.target.value)}/><span>{message.length} / 450</span></label>
      <div className="upload-grid"><input aria-label="Upload photos" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple hidden ref={photoInput} onChange={e=>upload(e,'image')}/><input aria-label="Upload video" type="file" accept="video/mp4,video/webm,video/quicktime" hidden ref={videoInput} onChange={e=>upload(e,'video')}/><button onClick={()=>photoInput.current?.click()}><span>＋</span>Add photos<small>Up to 10 · 10 MB each</small></button><button onClick={()=>videoInput.current?.click()}><span>▷</span>Add a video<small>One video · 20 MB</small></button></div>
      {media.length>0&&<ul className="media-list">{media.map(m=><li key={m.url}><span>{m.name}</span><button onClick={()=>removeMedia(m.url)} aria-label={'Remove '+m.name}>Remove</button></li>)}</ul>}
      <p className="feedback" role="status">{feedback}</p><div className="privacy-note">Only in this browser. Your files stay on your device and are cleared when you reload. Saving and shareable links are not available in this preview.</div><button className="primary" onClick={()=>{setEditor(false);restart()}}>Preview my gift <span aria-hidden="true">↗</span></button></div>
    </dialog>
  </div></MotionConfig>
}
