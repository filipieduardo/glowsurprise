import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CSSProperties, ChangeEvent } from 'react'
import './glowsurprise.css'

type Scene = 'gift' | 'letter' | 'memories' | 'final'
type Photo = { url: string; name: string }
type Memory = { kind: 'image' | 'video'; url: string; label: string }

const snow = Array.from({ length: 31 }, (_, i) => ({
  left: ((i * 37 + 11) % 97) + '%',
  delay: ((i * 13) % 29) / -3 + 's',
  duration: 8 + ((i * 7) % 10) + 's',
  size: 2 + ((i * 11) % 4) + 'px',
  opacity: 0.27 + ((i * 3) % 7) / 14,
}))

const demoMoments = [
  { index: '01', title: 'The little moments', detail: 'that made this year unforgettable' },
  { index: '02', title: 'The stories we share', detail: 'and the ones we carry with us' },
  { index: '03', title: 'More memories to come', detail: 'this Christmas and beyond' },
]

function Sparkle({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1.5c.7 6.6 3.9 9.8 10.5 10.5-6.6.7-9.8 3.9-10.5 10.5C11.3 15.9 8.1 12.7 1.5 12 8.1 11.3 11.3 8.1 12 1.5Z" fill="currentColor"/></svg>
}

function App() {
  const [scene, setScene] = useState<Scene>('gift')
  const [opening, setOpening] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const [recipient, setRecipient] = useState('Someone special')
  const [sender, setSender] = useState('With all my love')
  const [message, setMessage] = useState('Some gifts are wrapped in ribbons. The most precious ones are wrapped in memories. May this Christmas remind you how deeply you are loved.')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [video, setVideo] = useState<Photo | null>(null)
  const [memoryIndex, setMemoryIndex] = useState(0)
  const [formMessage, setFormMessage] = useState('')
  const photoInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)
  const memories: Memory[] = useMemo(() => [
    ...photos.map((p) => ({ kind: 'image' as const, url: p.url, label: p.name })),
    ...(video ? [{ kind: 'video' as const, url: video.url, label: video.name }] : []),
  ], [photos, video])
  const hasMemories = memories.length > 0
  const totalMoments = hasMemories ? memories.length : demoMoments.length
  const activeMoment = ((memoryIndex % totalMoments) + totalMoments) % totalMoments

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url))
      if (video) URL.revokeObjectURL(video.url)
    }
  }, [photos, video])

  const handlePhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    const valid = files.filter((file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024).slice(0, 8)
    if (!valid.length) {
      setFormMessage('Choose images smaller than 10 MB each.')
      return
    }
    setPhotos(valid.map((file) => ({ url: URL.createObjectURL(file), name: file.name })))
    setMemoryIndex(0)
    setFormMessage(valid.length < files.length ? 'Some files were skipped. You can add up to 8 photos, 10 MB each.' : 'Photos loaded in your browser preview.')
    event.target.value = ''
  }

  const handleVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('video/') || file.size > 20 * 1024 * 1024) {
      setFormMessage('Choose a video smaller than 20 MB.')
      return
    }
    setVideo({ url: URL.createObjectURL(file), name: file.name })
    setMemoryIndex(0)
    setFormMessage('Video added to your browser preview.')
    event.target.value = ''
  }

  const unwrap = () => {
    if (opening) return
    setOpening(true)
    window.setTimeout(() => { setScene('letter'); setOpening(false) }, 1500)
  }

  const restart = () => {
    setMemoryIndex(0)
    setOpening(false)
    setScene('gift')
  }

  const navigate = (next: Scene) => {
    setScene(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="gs-app">
      <div className="gs-halo gs-halo-a" aria-hidden="true" />
      <div className="gs-halo gs-halo-b" aria-hidden="true" />
      <div className="gs-stars" aria-hidden="true">
        {snow.map((s, i) => <i key={i} style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration, width: s.size, height: s.size, opacity: s.opacity } as CSSProperties} />)}
      </div>

      <header className="gs-header">
        <button type="button" className="gs-wordmark" onClick={restart} aria-label="GlowSurprise home">
          <span className="gs-mark"><Sparkle size={19} /></span>
          <span>GLOW<span className="gs-wordmark-thin">SURPRISE</span><span className="gs-tm">™</span></span>
        </button>
        <button className="gs-studio-link" onClick={() => setStudioOpen(true)} type="button">
          <span className="gs-studio-link-icon">✦</span> Personalize <span className="gs-studio-arrow">↗</span>
        </button>
      </header>

      <main className="gs-main">
        <div className="gs-side-rule gs-left-rule" aria-hidden="true" />
        <div className="gs-side-rule gs-right-rule" aria-hidden="true" />
        <AnimatePresence mode="wait">
          {scene === 'gift' && (
            <motion.section key="gift" className="gs-scene gs-gift-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.035 }} transition={{ duration: 0.7 }} aria-label="Your Christmas surprise">
              <p className="gs-eyebrow"><span className="gs-line" /> THE ART OF GIVING <span className="gs-line" /></p>
              <h1 className="gs-headline">A little Christmas <em>magic.</em></h1>
              <p className="gs-subhead">An unforgettable surprise, made just for you.</p>

              <div className={'gs-gift-scene-art' + (opening ? ' gs-unwrapping' : '')}>
                <div className="gs-aura" aria-hidden="true" />
                <div className="gs-orbit gs-orbit-one" aria-hidden="true"><Sparkle size={16} /></div>
                <div className="gs-orbit gs-orbit-two" aria-hidden="true"><Sparkle size={10} /></div>
                <div className="gs-orbit gs-orbit-three" aria-hidden="true"><Sparkle size={13} /></div>
                <button type="button" className="gs-present-button" onClick={unwrap} aria-label="Unwrap your Christmas present" disabled={opening}>
                  <div className="gs-present-shadow" />
                  <div className="gs-present">
                    <div className="gs-present-base">
                      <div className="gs-present-side" />
                      <div className="gs-present-front">
                        <span className="gs-ribbon-vertical" />
                        <span className="gs-ribbon-horizontal" />
                        <span className="gs-present-crest"><Sparkle size={27} /></span>
                      </div>
                    </div>
                    <div className="gs-present-lid">
                      <span className="gs-lid-face"><span className="gs-lid-ribbon" /></span>
                      <span className="gs-bow gs-bow-left" />
                      <span className="gs-bow gs-bow-right" />
                      <span className="gs-knot" />
                    </div>
                    <div className="gs-present-light" />
                  </div>
                </button>
                <div className="gs-floor-glow" aria-hidden="true" />
              </div>

              <div className="gs-gift-action">
                <button type="button" className="gs-primary-button" onClick={unwrap} disabled={opening}>{opening ? 'Unwrapping your surprise…' : 'Unwrap your surprise'} <span aria-hidden="true">✧</span></button>
                <p className="gs-tiny-note">A moment made to remember</p>
              </div>
            </motion.section>
          )}
          {scene === 'letter' && (
            <motion.section key="letter" className="gs-scene gs-letter-scene" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.75 }}>
              <p className="gs-eyebrow"><span className="gs-line" /> A NOTE FROM THE HEART <span className="gs-line" /></p>
              <div className="gs-letter-backlight" aria-hidden="true" />
              <div className="gs-letter-sheet">
                <div className="gs-letter-corners" />
                <div className="gs-letter-symbol"><Sparkle size={24} /></div>
                <p className="gs-letter-small">THIS CHRISTMAS, WITH LOVE</p>
                <p className="gs-letter-for">For</p>
                <h2 className="gs-letter-name">{recipient || 'Someone special'}</h2>
                <div className="gs-letter-divider"><span /><Sparkle size={13}/><span /></div>
                <p className="gs-letter-message">{message || 'A Christmas surprise, made with love.'}</p>
                <p className="gs-letter-sign">{sender || 'With love'}</p>
                <div className="gs-letter-bottom">GLOW SURPRISE <span>✦</span> CHRISTMAS EDITION</div>
              </div>
              <button type="button" className="gs-primary-button" onClick={() => navigate('memories')}>Discover your memories <span aria-hidden="true">↗</span></button>
              <button type="button" className="gs-text-button" onClick={() => setStudioOpen(true)}>Edit this message</button>
            </motion.section>
          )}
          {scene === 'memories' && (
            <motion.section key="memories" className="gs-scene gs-memory-scene" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.65 }}>
              <p className="gs-eyebrow"><span className="gs-line" /> OUR MOST TREASURED THINGS <span className="gs-line" /></p>
              <h2 className="gs-memory-title">The moments that <em>glow.</em></h2>
              <p className="gs-memory-intro">{hasMemories ? 'Every memory deserves a little magic.' : 'A beautiful place for your own photos, videos and stories.'}</p>
              <div className="gs-memory-frame">
                <div className="gs-memory-inner">
                  <AnimatePresence mode="wait">
                    {hasMemories ? (
                      <motion.div key={'memory-' + activeMoment} className="gs-memory-real" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                        {memories[activeMoment].kind === 'image' ? <img src={memories[activeMoment].url} alt={'Uploaded memory ' + (activeMoment + 1)} /> : <video controls playsInline preload="metadata" src={memories[activeMoment].url} aria-label="Your uploaded video" />}
                      </motion.div>
                    ) : (
                      <motion.div key={'demo-' + activeMoment} className="gs-memory-placeholder" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                        <div className="gs-memory-ring"><Sparkle size={39}/></div>
                        <span className="gs-moment-number">MOMENT {demoMoments[activeMoment].index}</span>
                        <h3>{demoMoments[activeMoment].title}</h3>
                        <p>{demoMoments[activeMoment].detail}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="gs-frame-label">GLOW SURPRISE · CHRISTMAS 2026</div>
              </div>
              <div className="gs-memory-controls">
                <button type="button" onClick={() => setMemoryIndex((i) => (i - 1 + totalMoments) % totalMoments)} aria-label="Previous memory">←</button>
                <span>{String(activeMoment + 1).padStart(2, '0')} <span className="gs-controls-slash">/</span> {String(totalMoments).padStart(2, '0')}</span>
                <button type="button" onClick={() => setMemoryIndex((i) => (i + 1) % totalMoments)} aria-label="Next memory">→</button>
              </div>
              {!hasMemories && <button type="button" className="gs-text-button" onClick={() => setStudioOpen(true)}>Add your own memories</button>}
              <button type="button" className="gs-primary-button" onClick={() => navigate('final')}>One last little surprise <span aria-hidden="true">✧</span></button>
            </motion.section>
          )}
          {scene === 'final' && (
            <motion.section key="final" className="gs-scene gs-finale-scene" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <div className="gs-finale-wreath" aria-hidden="true"><Sparkle size={60}/></div>
              <p className="gs-eyebrow"><span className="gs-line" /> FROM MY HEART TO YOURS <span className="gs-line" /></p>
              <h2 className="gs-finale-heading">The best gifts <em>stay with us.</em></h2>
              <p className="gs-finale-copy">May the warmth of these memories follow you long after the Christmas lights come down.</p>
              <span className="gs-finale-love">{sender || 'With love'}</span>
              <div className="gs-finale-actions">
                <button type="button" className="gs-primary-button" onClick={restart}>Experience it again <span aria-hidden="true">↺</span></button>
                <button type="button" className="gs-text-button" onClick={() => setStudioOpen(true)}>Make it personal</button>
              </div>
              <p className="gs-demo-note">Demo only · A shareable private link will be available in the full product.</p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="gs-footer">
        <span>GLOW SURPRISE <span className="gs-footer-divider">✦</span> BY GLOWBAUBLE</span>
        <span>CHRISTMAS COLLECTION 2026</span>
      </footer>

      <AnimatePresence>
        {studioOpen && (
          <motion.div className="gs-studio-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setStudioOpen(false) }}>
            <motion.aside className="gs-studio-panel" role="dialog" aria-modal="true" aria-labelledby="gs-studio-title" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 220, damping: 27 }}>
              <div className="gs-studio-header">
                <div><p className="gs-studio-kicker">THE PERSONALIZATION STUDIO</p><h2 id="gs-studio-title">Make it <em>yours.</em></h2></div>
                <button type="button" onClick={() => setStudioOpen(false)} aria-label="Close editor">✕</button>
              </div>
              <p className="gs-studio-description">A few thoughtful details turn a beautiful gesture into something unforgettable.</p>
              <label className="gs-field"><span>WHO IS THIS FOR?</span><input value={recipient} onChange={(e) => setRecipient(e.target.value.slice(0, 45))} placeholder="Their name" maxLength={45}/></label>
              <label className="gs-field"><span>FROM</span><input value={sender} onChange={(e) => setSender(e.target.value.slice(0, 55))} placeholder="Your name" maxLength={55}/></label>
              <label className="gs-field"><span>YOUR PERSONAL MESSAGE</span><textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value.slice(0, 450))} maxLength={450}/><small>{message.length}/450 characters</small></label>
              <div className="gs-studio-upload">
                <p className="gs-field-heading">YOUR FAVOURITE MEMORIES</p>
                <input ref={photoInput} type="file" multiple accept="image/*" onChange={handlePhotos} hidden/>
                <input ref={videoInput} type="file" accept="video/*" onChange={handleVideo} hidden/>
                <button type="button" onClick={() => photoInput.current?.click()}><span>＋</span> {photos.length ? 'Replace photos' : 'Add photos'} <small>Up to 8 · 10 MB each</small></button>
                <button type="button" onClick={() => videoInput.current?.click()}><span>▻</span> {video ? 'Replace video' : 'Add a video'} <small>1 video · 20 MB max</small></button>
                {(photos.length > 0 || video) && <p className="gs-upload-count">{photos.length} photo{photos.length === 1 ? '' : 's'} {video ? '· 1 video' : ''} loaded</p>}
                {formMessage && <p className="gs-upload-notice" role="status">{formMessage}</p>}
              </div>
              <div className="gs-studio-bottom">
                <p>PRIVATE PREVIEW · Files stay in this browser session and are not uploaded or saved.</p>
                <button type="button" className="gs-primary-button" onClick={() => { setStudioOpen(false); restart() }}>Preview my surprise <span aria-hidden="true">↗</span></button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
