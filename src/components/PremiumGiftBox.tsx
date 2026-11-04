import { motion } from 'motion/react'
import type { CSSProperties } from 'react'

export type OpeningPhase = 'ready' | 'untie' | 'ribbons' | 'lid' | 'reveal'

type Props = { phase: OpeningPhase; onOpen: () => void; photoUrl?: string }

// Matching SVG paths allow the loops themselves to change shape as the silk is pulled.
// The bow does not just rotate offscreen or vanish in a fade.
const left = {
  ready: 'M159 85 C126 49 94 20 55 34 C27 44 31 88 66 102 C99 116 137 101 159 85 Z',
  untie: 'M159 85 C126 66 96 53 62 63 C29 71 18 112 46 131 C82 154 131 116 159 85 Z',
  loose: 'M159 85 C120 86 91 99 64 122 C36 146 9 175 -15 180 C4 201 49 196 81 173 C115 141 143 103 159 85 Z',
}
const right = {
  ready: 'M161 85 C194 49 226 20 265 34 C293 44 289 88 254 102 C221 116 183 101 161 85 Z',
  untie: 'M161 85 C194 66 224 53 258 63 C291 71 302 112 274 131 C238 154 189 116 161 85 Z',
  loose: 'M161 85 C200 86 229 99 256 122 C284 146 311 175 335 180 C316 201 271 196 239 173 C205 141 177 103 161 85 Z',
}
const leftRidge = {
  ready: 'M150 84 C113 72 77 53 53 66',
  untie: 'M151 87 C107 85 71 90 42 112',
  loose: 'M150 93 C96 117 56 151 3 182',
}
const rightRidge = {
  ready: 'M170 84 C207 72 243 53 267 66',
  untie: 'M169 87 C213 85 249 90 278 112',
  loose: 'M170 93 C224 117 264 151 317 182',
}

const sparkles = Array.from({ length: 18 }, (_, i) => ({
  a: (i * 137.51) % 360,
  radius: 100 + (i % 5) * 24,
  delay: (i % 6) * .07,
  size: 4 + (i % 3) * 3,
}))

const ease: [number, number, number, number] = [.22, .8, .26, 1]

export default function PremiumGiftBox({ phase, onOpen, photoUrl }: Props) {
  const isReady = phase === 'ready'
  const begun = !isReady
  const shape = isReady ? 'ready' : phase === 'untie' ? 'untie' : 'loose'
  const released = phase === 'lid' || phase === 'reveal'

  return (
    <div className="gs5-gift-scene gs6-stage" data-phase={phase}>
      <div className="gs6-aureole" aria-hidden="true" />
      <div className="gs6-distant-bokeh" aria-hidden="true">
        {Array.from({ length: 17 }, (_, i) => (
          <i key={i} style={{
            '--x': ((i * 37 + 9) % 99) + '%',
            '--y': ((i * 53 + 11) % 84) + '%',
            '--sz': (4 + i % 4 * 3) + 'px',
            '--t': ((i % 5) * -.8) + 's',
          } as CSSProperties} />
        ))}
      </div>
      <div className="gs6-floor-light" aria-hidden="true" />
      <motion.button
        type="button"
        className="gs5-gift-hit gs6-hit"
        aria-label={isReady ? 'Unwrap the Christmas gift' : 'The present is opening'}
        onClick={onOpen}
        disabled={!isReady}
        whileHover={isReady ? { scale: 1.025 } : undefined}
        whileTap={isReady ? { scale: .99 } : undefined}
        transition={{ type: 'spring', stiffness: 230, damping: 19 }}
      >
        <div className="gs5-gift gs6-gift">
          <div className="gs6-gift-back" />
          <div className="gs6-inner-wall" />
          <div className="gs6-warm-light" aria-hidden="true" />

          <div className="gs5-gift-photo-card gs6-keepsake-card">
            {photoUrl ? <div className="gs5-card-photo-preview gs6-keepsake-photo"><img src={photoUrl} alt="" /></div> :
              <div className="gs6-keepsake-cover" aria-hidden="true">
                <span className="gs6-keepsake-ornament">✧</span>
                <span className="gs6-keepsake-to">Especially for you</span>
                <span className="gs6-keepsake-script">with love</span>
                <span className="gs6-keepsake-line" />
              </div>}
            <span className="gs6-keepsake-foiledge">A LITTLE CHRISTMAS MAGIC</span>
          </div>

          <div className="gs5-box-face gs6-box-face">
            <div className="gs6-velvet-warp" aria-hidden="true" />
            <div className="gs6-box-emboss" aria-hidden="true" />
            <span className="gs6-cross-ribbon gs6-cross-horizontal" aria-hidden="true" />
            <span className="gs6-cross-ribbon gs6-cross-vertical" aria-hidden="true" />
            <div className="gs6-body-reflections" aria-hidden="true" />
          </div>

          <div className="gs5-gift-lid gs6-lid">
            <div className="gs6-lid-upper" />
            <div className="gs6-lid-front">
              <div className="gs6-lid-front-glow"/>
              <span className="gs6-lid-silk" />
            </div>
            <span className="gs6-lid-lip" />
          </div>

          <div className="gs6-silk-bow">
            <svg viewBox="0 0 320 200" fill="none" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="gs6-silk-face" x1="0%" y1="0%" x2="93%" y2="90%">
                  <stop offset="0" stopColor="#8a552c"/>
                  <stop offset=".13" stopColor="#e5bd7d"/>
                  <stop offset=".26" stopColor="#fff3d0"/>
                  <stop offset=".43" stopColor="#c59454"/>
                  <stop offset=".60" stopColor="#9a6435"/>
                  <stop offset=".78" stopColor="#f2d69e"/>
                  <stop offset="1" stopColor="#8d5a2d"/>
                </linearGradient>
                <linearGradient id="gs6-silk-fold" x1="0%" y1="0%" x2="100%" y2="30%">
                  <stop offset="0" stopColor="#5d3218"/>
                  <stop offset=".28" stopColor="#ae743a"/>
                  <stop offset=".61" stopColor="#fff0bb"/>
                  <stop offset="1" stopColor="#af773c"/>
                </linearGradient>
                <linearGradient id="gs6-silk-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0" stopColor="#885226"/>
                  <stop offset=".22" stopColor="#ffe8b3"/>
                  <stop offset=".49" stopColor="#c59253"/>
                  <stop offset=".7" stopColor="#ffedb9"/>
                  <stop offset="1" stopColor="#785025"/>
                </linearGradient>
                <filter id="gs6-silk-shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#21070d" floodOpacity=".65"/>
                </filter>
              </defs>

              <g className="gs6-unspool-behind" filter="url(#gs6-silk-shadow)">
                <motion.path d="M158 86 C111 100 87 110 49 143 C15 173 -9 182 -42 211"
                  stroke="url(#gs6-silk-ribbon)" strokeWidth="22" strokeLinecap="butt"
                  fill="none" initial={false}
                  animate={{ pathLength: phase === 'ribbons' || released ? 1 : 0, opacity: released ? 0 : begun ? 1 : 0 }}
                  transition={{ duration: 1.05, ease }}/>
                <motion.path d="M162 86 C209 100 233 110 271 143 C305 173 329 182 362 211"
                  stroke="url(#gs6-silk-ribbon)" strokeWidth="22" strokeLinecap="butt"
                  fill="none" initial={false}
                  animate={{ pathLength: phase === 'ribbons' || released ? 1 : 0, opacity: released ? 0 : begun ? 1 : 0 }}
                  transition={{ duration: 1.05, ease }}/>
              </g>

              <g className="gs6-silk-tails" filter="url(#gs6-silk-shadow)">
                <motion.path d="M156 86 C137 109 116 136 65 165 L85 131 L47 135 C99 121 122 100 156 86 Z"
                  fill="url(#gs6-silk-face)" stroke="#f6dfaf" strokeWidth="1.2"
                  initial={false}
                  animate={{ x: isReady ? 0 : phase === 'untie' ? -12 : -62,
                    y: isReady ? 0 : phase === 'untie' ? 10 : 42, rotate: isReady ? 0 : phase === 'untie' ? -7 : -30,
                    opacity: released ? 0 : 1 }}
                  transition={{ duration: phase === 'untie' ? 1.05 : 1.25, ease }}/>
                <motion.path d="M164 86 C183 109 204 136 255 165 L235 131 L273 135 C221 121 198 100 164 86 Z"
                  fill="url(#gs6-silk-face)" stroke="#f6dfaf" strokeWidth="1.2"
                  initial={false}
                  animate={{ x: isReady ? 0 : phase === 'untie' ? 12 : 62,
                    y: isReady ? 0 : phase === 'untie' ? 10 : 42, rotate: isReady ? 0 : phase === 'untie' ? 7 : 30,
                    opacity: released ? 0 : 1 }}
                  transition={{ duration: phase === 'untie' ? 1.05 : 1.25, ease }}/>
              </g>

              <g filter="url(#gs6-silk-shadow)">
                <motion.path
                  d={left.ready} initial={false}
                  animate={{ d: left[shape], opacity: released ? 0 : 1 }}
                  transition={{ d: { duration: phase === 'untie' ? 1.15 : 1.0, ease }, opacity: { duration: .5 } }}
                  fill="url(#gs6-silk-face)" stroke="#f7dba7" strokeWidth="1.5"/>
                <motion.path d={leftRidge.ready} initial={false}
                  animate={{ d: leftRidge[shape], opacity: released ? 0 : .7 }}
                  transition={{ duration: 1.1, ease }}
                  stroke="#fff1ca" strokeWidth="3.6" strokeLinecap="round"/>
                <motion.path d={right.ready} initial={false}
                  animate={{ d: right[shape], opacity: released ? 0 : 1 }}
                  transition={{ d: { duration: phase === 'untie' ? 1.15 : 1.0, ease }, opacity: { duration: .5 } }}
                  fill="url(#gs6-silk-face)" stroke="#f7dba7" strokeWidth="1.5"/>
                <motion.path d={rightRidge.ready} initial={false}
                  animate={{ d: rightRidge[shape], opacity: released ? 0 : .7 }}
                  transition={{ duration: 1.1, ease }}
                  stroke="#fff1ca" strokeWidth="3.6" strokeLinecap="round"/>
              </g>

              <motion.g filter="url(#gs6-silk-shadow)"
                initial={false}
                animate={{ scale: isReady ? 1 : phase === 'untie' ? .94 : .62,
                  x: isReady ? 0 : phase === 'untie' ? 4 : 22, y: isReady ? 0 : phase === 'untie' ? 5 : 27,
                  rotate: isReady ? 0 : phase === 'untie' ? 5 : 22, opacity: released ? 0 : 1 }}
                transition={{ duration: 1.15, ease }} style={{ transformOrigin:'160px 82px' }}>
                <path d="M145 64 Q159 55 176 64 C187 76 184 94 170 101 Q156 108 144 97 C135 86 134 73 145 64 Z"
                  fill="url(#gs6-silk-fold)" stroke="#ffe2ae" strokeWidth="1.7"/>
                <path d="M150 64 C158 72 160 91 156 101" stroke="#fff4d2" strokeWidth="4" opacity=".6"/>
                <path d="M175 68 C172 75 176 88 168 98" stroke="#80502d" strokeWidth="2" opacity=".45"/>
              </motion.g>
            </svg>
          </div>
          <div className="gs6-reveal-dust" aria-hidden="true" />
        </div>
      </motion.button>
      <div className="gs6-gold-sparks" aria-hidden="true">
        {sparkles.map((s, i) => (
          <i key={i} style={{
            '--a': s.a + 'deg', '--r': s.radius + 'px',
            '--d': s.delay + 's', fontSize: s.size + 'px',
          } as CSSProperties}>✧</i>
        ))}
      </div>
      <p className="gs5-gift-stage-caption gs6-gift-caption" aria-live="polite">
        {phase === 'untie' ? 'A little magic is untying…' :
          phase === 'ribbons' ? 'Unwrapping something wonderful…' :
          phase === 'lid' ? 'A Christmas wish is being revealed…' :
          phase === 'reveal' ? 'Made just for you.' : 'Tap the gift to unwrap'}
      </p>
    </div>
  )
}
