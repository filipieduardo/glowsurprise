import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ChangeEvent, CSSProperties, TouchEvent } from 'react'
import PremiumGiftBox from './components/PremiumGiftBox'
import type { OpeningPhase } from './components/PremiumGiftBox'
import './glowsurprise-v5.css'
import './glowsurprise-v6.css'
import './glowsurprise-v7.css'

type Scene = 'gift' | 'letter' | 'memories' | 'final'
type Uploaded = { url: string; name: string }
type Memory = { kind: 'image' | 'video'; url: string; name: string }
const demoStories = [
  { title: 'The moments that matter', subtitle: 'Every picture tells a little story.' },
  { title: 'Our favourite chapters', subtitle: 'The laughs, the little things, the love.' },
  { title: 'More magic to come', subtitle: 'A new chapter begins this Christmas.' },
]

const flakes = Array.from({ length: 66 }, (_, i) => ({
  left: ((i * 73 + 17) % 101) + '%',
  delay: (-((i * 41) % 127) / 10) + 's',
  duration: (8 + (i % 11) * 1.25) + 's',
  size: (i % 9 === 0 ? 6 : i % 3 === 0 ? 3.5 : 2) + 'px',
  drift: (((i * 19) % 70) - 35) + 'px',
  opacity: .25 + ((i * 13) % 35) / 65,
  front: i % 7 === 0,
}))

function Star({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 0c.9 7.3 4.7 11.1 12 12-7.3.9-11.1 4.7-12 12C11.1 16.7 7.3 12.9 0 12 7.3 11.1 11.1 7.3 12 0Z" />
  </svg>
}
function Snowfall() {
  return <div className="gs5-snow" aria-hidden="true">
    {flakes.map((f,i) => <span key={i} className={f.front ? 'gs5-snow-near' : 'gs5-snow-far'}
      style={{ left:f.left,animationDelay:f.delay,animationDuration:f.duration,width:f.size,height:f.size,
        opacity:f.opacity,'--drift':f.drift } as CSSProperties}/>)}
  </div>
}

function WinterMemoryArt({ variant = 0 }: { variant?: number }) {
  return <svg className="gs5-memory-art" viewBox="0 0 300 390" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated snowy Christmas evening with a lit cabin and evergreen trees">
    <defs>
      <linearGradient id="gs5-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor={variant===1 ? '#203b55' : '#153e4a'}/><stop offset=".8" stopColor={variant===2?'#674046':'#46646b'}/><stop offset="1" stopColor="#b59a80"/></linearGradient>
      <radialGradient id="gs5-house-light"><stop stopColor="#ffefb7"/><stop offset=".7" stopColor="#d9984b"/><stop offset="1" stopColor="#9d5e35"/></radialGradient>
    </defs>
    <rect width="300" height="390" fill="url(#gs5-sky)" />
    <circle cx="228" cy="78" r="30" fill="#fff0cf" opacity=".85"/>
    <circle cx="228" cy="78" r="48" fill="#fff0cf" opacity=".1"/>
    {[30,62,104,160,203,254,286].map((x,i)=><g key={x} transform={'translate(' + x + ' ' + (204+i%3*12) + ')'}>
      <path d="M0 -112 L-41 0 H41Z" fill={i%2 ? '#122f32' : '#173e3b'}/>
      <path d="M0 -99 L-31 -15 M0 -69 L28 -8" stroke="#e3eeea" strokeWidth="3" opacity=".58"/>
      <path d="M-33 -20 L0 -91 L34 -19" fill="none" stroke="#e8ede6" strokeWidth="2.4" opacity=".75"/>
      <rect x="-5" y="-10" width="10" height="34" fill="#2d2923"/>
    </g>)}
    <path d="M0 235 Q58 205 111 233 Q179 204 300 241V390H0Z" fill="#b4cfca"/>
    <path d="M0 278 Q80 252 161 278 Q235 248 300 278V390H0Z" fill="#edf1e5"/>
    <g transform="translate(88 194)">
      <rect x="0" y="30" width="131" height="110" fill="#6e3430"/>
      <path d="M-17 35 L63 -12 L151 35Z" fill="#423533"/>
      <path d="M-10 34 L63 -10 L144 34" fill="none" stroke="#f3f2e7" strokeWidth="9" strokeLinejoin="round"/>
      <rect x="18" y="57" width="35" height="38" fill="url(#gs5-house-light)"/>
      <rect x="76" y="57" width="36" height="38" fill="url(#gs5-house-light)"/>
      <path d="M35 56V96 M18 75H53 M94 56V96 M76 75H112" stroke="#5e362a" strokeWidth="4"/>
      <rect x="55" y="99" width="26" height="41" fill="#3b2828"/>
      <rect x="103" y="-15" width="14" height="36" fill="#634238"/>
      <path d="M103 -13 L102 -21 L120 -21 L117 -13" fill="#e7e9de"/>
    </g>
    <g transform="translate(35 243)">
      <path d="M0 -98 L-35 -11 H35Z" fill="#173b30"/>
      <path d="M0 -74 L-27 -1 H27Z" fill="#215240"/>
      <path d="M0 -50 L-31 24 H31Z" fill="#1d4b3a"/>
      {[[-2,-51],[8,-29],[-13,-16],[15,7],[-2,3],[5,-70]].map((p,i) =>
        <circle key={i} cx={p[0]} cy={p[1]} r="3.4" fill={i%2?'#e8b65f':'#b52b3f'}/>)}
      <path d="M0 -106 L3 -98 L11 -97 L5 -91 L7 -83 L0 -88 L-7 -83 L-5 -91 L-11 -97 L-3 -98Z" fill="#fce5a8"/>
    </g>
    {Array.from({length:38},(_,i)=><circle key={i} cx={(i*61+13)%300} cy={(i*47+11)%390} r={i%5===0?2:1.1} fill="#fffcf3" opacity={.45+i%4*.12}/>)}
    <path d="M0 350 Q100 316 185 346 Q244 328 300 341V390H0Z" fill="#fbf7ed"/>
  </svg>
}

export default function GlowSurprise() {
  const [scene,setScene] = useState<Scene>('gift')
  const [phase,setPhase] = useState<OpeningPhase>('ready')
  const [editorOpen,setEditorOpen] = useState(false)
  const [recipient,setRecipient] = useState('Someone special')
  const [sender,setSender] = useState('With all my love')
  const [message,setMessage] = useState('Of all the moments this year, my favourites have you in them. Wishing you a Christmas as beautiful as the memories we share.')
  const [photos,setPhotos] = useState<Uploaded[]>([])
  const [video,setVideo] = useState<Uploaded | null>(null)
  const [memoryIndex,setMemoryIndex] = useState(0)
  const [feedback,setFeedback] = useState('')
  const photoInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)
  const mediaUrls = useRef<Set<string>>(new Set())
  const timers = useRef<number[]>([])
  const swipeX = useRef<{x:number;y:number}|null>(null)
  const memories:Memory[] = useMemo(()=>[
    ...photos.map(p=>({kind:'image' as const,url:p.url,name:p.name})),
    ...(video ? [{kind:'video' as const,url:video.url,name:video.name}] : []),
  ],[photos,video])
  const total = memories.length || demoStories.length
  const active = ((memoryIndex%total)+total)%total
  const demo = !memories.length

  useEffect(()=>{
    const urls = mediaUrls.current
    return ()=>{timers.current.forEach(clearTimeout);urls.forEach(URL.revokeObjectURL);urls.clear()}
  },[])

  function newUrl(file:File) {
    const url = URL.createObjectURL(file)
    mediaUrls.current.add(url)
    return url
  }
  function discard(url:string) {
    URL.revokeObjectURL(url)
    mediaUrls.current.delete(url)
  }
  function handlePhotos(event:ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || [])
    if(!selected.length) return
    const valid = selected.filter(f=>f.type.startsWith('image/') && f.size<=10*1024*1024).slice(0,10)
    if(!valid.length) {setFeedback('Please choose photos smaller than 10 MB each.');return}
    photos.forEach(p=>discard(p.url))
    setPhotos(valid.map(f=>({url:newUrl(f),name:f.name})))
    setMemoryIndex(0)
    setFeedback(valid.length < selected.length ? 'Some files were skipped. You can use up to 10 photos.' : 'Your photos are ready to preview.')
    event.target.value=''
  }
  function handleVideo(event:ChangeEvent<HTMLInputElement>) {
    const file=event.target.files?.[0]
    if(!file)return
    if(!file.type.startsWith('video/') || file.size>20*1024*1024){
      setFeedback('Please choose one video under 20 MB.')
      return
    }
    if(video)discard(video.url)
    setVideo({url:newUrl(file),name:file.name})
    setMemoryIndex(0)
    setFeedback('Your video is ready to preview.')
    event.target.value=''
  }
  function unwrap() {
    if(phase!=='ready')return
    timers.current.forEach(clearTimeout)
    timers.current=[]
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if(reduced){setPhase('reveal');return}
    setPhase('untie')
    timers.current.push(window.setTimeout(()=>setPhase('ribbons'),1250))
    timers.current.push(window.setTimeout(()=>setPhase('lid'),2400))
    timers.current.push(window.setTimeout(()=>setPhase('reveal'),3700))
  }
  function restart(){
    timers.current.forEach(clearTimeout);timers.current=[]
    setMemoryIndex(0);setPhase('ready');setScene('gift')
    window.scrollTo({top:0,behavior:'smooth'})
  }
  function go(next:Scene){setScene(next);window.scrollTo({top:0,behavior:'smooth'})}
  function touchStart(e:TouchEvent<HTMLElement>){const t=e.changedTouches[0];if(t)swipeX.current={x:t.clientX,y:t.clientY}}
  function touchEnd(e:TouchEvent<HTMLElement>){
    const t=e.changedTouches[0],p=swipeX.current;swipeX.current=null
    if(!t||!p)return
    const dx=t.clientX-p.x,dy=t.clientY-p.y
    if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.1)return
    setMemoryIndex(x=>(x+(dx<0?1:total-1))%total)
  }

  return <div className="gs5-app">
    <div className="gs5-ambient gs5-ambient-one" aria-hidden="true"/>
    <div className="gs5-ambient gs5-ambient-two" aria-hidden="true"/>
    <Snowfall/>
    <header className="gs5-header">
      <button type="button" onClick={restart} className="gs5-logo" aria-label="GlowSurprise home">
        <span className="gs5-logo-icon"><Star size={16}/></span><span>GLOW<b>SURPRISE</b></span>
      </button>
      <button type="button" className="gs5-top-action" onClick={()=>setEditorOpen(true)}>Personalize <span aria-hidden="true">↗</span></button>
    </header>
    <main className="gs5-main">
      <AnimatePresence mode="wait">
        {scene==='gift' && <motion.section key="gift" className="gs5-experience gs5-opening" initial={{y:25,scale:.98}} animate={{y:0,scale:1}} exit={{y:-40,scale:1.05}} transition={{duration:.6,ease:[.16,.75,.2,1]}}>
          <div className="gs5-world">
            
            <div className="gs5-world-top">
              <p className="gs5-eyebrow">A CHRISTMAS SURPRISE · MADE PERSONAL</p>
              <h1>Unwrap a little<br/><em>Christmas magic.</em></h1>
              <p className="gs5-opening-lead">A Christmas gift that reveals your favourite memories.</p>
            </div>
            <div className="gs5-world-middle">
              <div className="gs5-bauble gs5-bauble-left" aria-hidden="true"/><div className="gs5-bauble gs5-bauble-right" aria-hidden="true"/>
              <PremiumGiftBox phase={phase} onOpen={unwrap} photoUrl={photos[0]?.url}/>
            </div>
            <div className="gs5-world-bottom">
              <div className="gs5-tiny-divider"><span/>✦<span/></div>
              <button type="button" className="gs5-primary" onClick={()=>phase==='reveal'?go('letter'):unwrap()} disabled={phase!=='ready' && phase!=='reveal'}>
                {phase==='ready'?'Unwrap your surprise':phase==='reveal'?'Open your Christmas card':'Unwrapping your present…'}
                <span aria-hidden="true">↗</span>
              </button>
              <p className="gs5-quiet">The gift is only the beginning.</p>
            </div>
          </div>
        </motion.section>}
        {scene==='letter' && <motion.section key="letter" className="gs5-experience gs5-letter-scene" initial={{y:125,rotateX:-14,scale:.88}} animate={{y:0,rotateX:0,scale:1}} exit={{y:-80,scale:.96}} transition={{duration:.9,ease:[.14,.8,.17,1]}}>
          <p className="gs5-eyebrow">A LETTER FROM THE HEART</p>
          <div className="gs5-letter-wrap">
            <div className="gs5-letter-corners"/>
            <Star size={22}/>
            <span className="gs5-letter-edition">CHRISTMAS EDITION · 2026</span>
            <span className="gs5-letter-for">Especially for</span>
            <h2>{recipient.trim()||'Someone special'}</h2>
            <div className="gs5-letter-flourish">✦</div>
            <p className="gs5-letter-message">{message.trim()||'A little Christmas love, made just for you.'}</p>
            <p className="gs5-letter-from">{sender.trim()||'With love'}</p>
            <span className="gs5-letter-mark">GLOW SURPRISE · BY GLOWBAUBLE</span>
          </div>
          <button className="gs5-primary" type="button" onClick={()=>go('memories')}>Discover your memories <span aria-hidden="true">↗</span></button>
          <button className="gs5-subtle-action" type="button" onClick={()=>setEditorOpen(true)}>Personalize this message</button>
        </motion.section>}
        {scene==='memories' && <motion.section key="memories" className="gs5-experience gs5-memories-scene" initial={{y:65,scale:.95}} animate={{y:0,scale:1}} exit={{y:-50,scale:1.03}} transition={{duration:.7,ease:[.16,.75,.2,1]}}>
          <p className="gs5-eyebrow">OUR LITTLE TREASURES</p>
          <h2 className="gs5-section-title">The memories<br/><em>that glow.</em></h2>
          <p className="gs5-section-deck">{demo?'This is where your favourite photos and videos become the gift.':'The little moments that make everything worthwhile.'}</p>
          <div className="gs5-album" onTouchStart={touchStart} onTouchEnd={touchEnd}>
            <div className="gs5-album-back gs5-album-back-one"/>
            <div className="gs5-album-back gs5-album-back-two"/>
            <AnimatePresence mode="wait">
              <motion.div key={demo?'demo'+active:'real'+active} className="gs5-polaroid"
                initial={{x:95,rotate:9,scale:.93}} animate={{x:0,rotate:-2,scale:1}}
                exit={{x:-95,rotate:-9,scale:.93}} transition={{duration:.57,ease:[.2,.72,.2,1]}}>
                <div className="gs5-photo-window">
                  {demo ? <WinterMemoryArt variant={active}/> : memories[active].kind==='image' ? <>
                    <div className="gs5-photo-blur" style={{backgroundImage:'url("'+memories[active].url+'")'}} aria-hidden="true"/>
                    <img src={memories[active].url} alt={'Personal memory '+(active+1)}/>
                  </> : <video src={memories[active].url} controls playsInline preload="metadata" aria-label="Personal memory video"/>}
                  <span className="gs5-photo-counter">{String(active+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
                </div>
                <div className="gs5-polaroid-bottom">
                  <span className="gs5-polaroid-caption">{demo?demoStories[active].title:'A moment worth keeping'}</span>
                  <span className="gs5-polaroid-star">✧</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="gs5-album-controls">
            <button type="button" onClick={()=>setMemoryIndex(i=>(i+total-1)%total)} aria-label="Previous memory">←</button>
            <div className="gs5-progress" aria-label={'Memory '+(active+1)+' of '+total}>{Array.from({length:total},(_,i)=><i key={i} className={i===active?'active':''}/>)}</div>
            <button type="button" onClick={()=>setMemoryIndex(i=>(i+1)%total)} aria-label="Next memory">→</button>
          </div>
          {demo&&<button type="button" className="gs5-subtle-action" onClick={()=>setEditorOpen(true)}>Add your own photos & videos</button>}
          <button type="button" className="gs5-primary" onClick={()=>go('final')}>One last little surprise <span aria-hidden="true">↗</span></button>
        </motion.section>}
        {scene==='final'&&<motion.section key="final" className="gs5-experience gs5-finale" initial={{y:80,scale:.89}} animate={{y:0,scale:1}} exit={{y:-50}} transition={{duration:.85}}>
          
          <div className="gs5-finale-wreath"><span>✧</span></div>
          <p className="gs5-eyebrow">FROM MY HEART TO YOURS</p>
          <h2>The most beautiful gifts<br/><em>stay with us.</em></h2>
          <p>Some memories don't belong in a box. They live in the people we love.</p>
          <span className="gs5-signature">{sender.trim()||'With love'}</span>
          <button type="button" className="gs5-primary" onClick={restart}>Experience the magic again <span aria-hidden="true">↺</span></button>
          <button type="button" className="gs5-subtle-action" onClick={()=>setEditorOpen(true)}>Make yours personal</button>
          <small className="gs5-demo-disclaimer">Demo preview only · Sharing and permanent saving come with the complete product.</small>
        </motion.section>}
      </AnimatePresence>
    </main>
    <footer className="gs5-footer"><span>GLOWSURPRISE · BY GLOWBAUBLE</span><span>CHRISTMAS 2026</span></footer>
    <AnimatePresence>
      {editorOpen&&<motion.div className="gs5-editor-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        onMouseDown={e=>{if(e.currentTarget===e.target)setEditorOpen(false)}}>
        <motion.aside className="gs5-editor" role="dialog" aria-modal="true" aria-labelledby="gs5-editor-title"
          initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',stiffness:240,damping:31}}>
          <div className="gs5-editor-header"><div><span>THE GLOWSURPRISE STUDIO</span><h2 id="gs5-editor-title">Make it <em>personal.</em></h2></div>
            <button type="button" aria-label="Close editor" onClick={()=>setEditorOpen(false)}>✕</button></div>
          <p className="gs5-editor-lead">The best gift is a little piece of your story. Add yours and preview it instantly.</p>
          <label className="gs5-field">For<input maxLength={45} value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="Recipient's name"/></label>
          <label className="gs5-field">From<input maxLength={55} value={sender} onChange={e=>setSender(e.target.value)} placeholder="Your name"/></label>
          <label className="gs5-field">Your Christmas message<textarea rows={5} maxLength={450} value={message} onChange={e=>setMessage(e.target.value)}/><small>{message.length}/450</small></label>
          <div className="gs5-media-picker">
            <p>YOUR FAVOURITE MEMORIES</p>
            <input type="file" accept="image/*" multiple hidden ref={photoInput} onChange={handlePhotos}/>
            <input type="file" accept="video/*" hidden ref={videoInput} onChange={handleVideo}/>
            <button type="button" onClick={()=>photoInput.current?.click()}>＋ <span>{photos.length?'Change photos':'Add photos'} <small>Up to 10 · 10MB each</small></span></button>
            <button type="button" onClick={()=>videoInput.current?.click()}>▷ <span>{video?'Change video':'Add a video'} <small>One video · up to 20MB</small></span></button>
            <p className="gs5-media-summary">{photos.length} photos {video?' · 1 video':''}</p>
            {feedback&&<p className="gs5-feedback" role="status">{feedback}</p>}
          </div>
          <div className="gs5-editor-end">
            <p>Private browser preview. Your files are not uploaded or saved to a server.</p>
            <button type="button" className="gs5-primary" onClick={()=>{setEditorOpen(false);restart()}}>Preview my GlowSurprise <span aria-hidden="true">↗</span></button>
          </div>
        </motion.aside>
      </motion.div>}
    </AnimatePresence>
  </div>
}
