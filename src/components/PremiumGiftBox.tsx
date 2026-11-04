import type { CSSProperties } from 'react'
import { motion } from 'motion/react'

export type OpeningPhase = 'idle' | 'untie' | 'ribbons' | 'lift' | 'reveal'

type Props = { phase: OpeningPhase; onOpen: () => void }

const glints = Array.from({ length: 15 }, (_, i) => ({
  x: ((i * 43 + 17) % 91) + 5,
  y: ((i * 31 + 23) % 87) + 4,
  size: 2 + (i % 4),
  delay: ((i * 13) % 17) / 10,
  duration: 3.5 + (i % 5) * 0.8,
}))

const bursts = Array.from({ length: 12 }, (_, i) => ({
  a: i * (360 / 12),
  d: 105 + (i % 5) * 22,
  delay: (i % 6) * 0.06,
}))

/**
 * The tall ruby gift is a full interactive object, not a pre-rendered image:
 * five distinct states animate the silk bow, wrap ribbons, hinged lid,
 * illuminated interior and rising invitation. No external assets or sound.
 */
export default function PremiumGiftBox({ phase, onOpen }: Props) {
  return (
    <div className="gs3-stage" data-phase={phase}>
      <div className="gs3-orbit gs3-orbit-one" aria-hidden="true" />
      <div className="gs3-orbit gs3-orbit-two" aria-hidden="true" />
      <div className="gs3-backlight" aria-hidden="true" />
      <div className="gs3-star-field" aria-hidden="true">
        {glints.map((s, i) => <i key={i} style={{
          left: s.x + '%', top: s.y + '%', width: s.size,
          height: s.size, animationDelay: -s.delay + 's',
          animationDuration: s.duration + 's',
        }} />)}
      </div>
      <div className="gs3-shadow" aria-hidden="true" />
      <motion.button
        type="button"
        className="gs3-gift-button"
        onClick={onOpen}
        disabled={phase !== 'idle'}
        whileHover={phase === 'idle' ? { scale: 1.025 } : undefined}
        whileTap={phase === 'idle' ? { scale: 0.975 } : undefined}
        aria-label={phase === 'idle' ? 'Tap to unwrap the gift' : 'Your gift is opening'}
      >
        <div className="gs3-gift">
          <div className="gs3-box-back" />
          <div className="gs3-box-void" />
          <div className="gs3-box-glow" />

          <div className="gs3-envelope">
            <span className="gs3-envelope-inner">
              <span className="gs3-envelope-star">✦</span>
              <span className="gs3-envelope-small">A PERSONAL NOTE</span>
              <span className="gs3-envelope-title">Just<br/><em>for you.</em></span>
              <span className="gs3-envelope-line" />
              <span className="gs3-envelope-caption">GLOW SURPRISE</span>
            </span>
          </div>

          <div className="gs3-box-body">
            <div className="gs3-box-front">
              <div className="gs3-velvet-shine" />
              <div className="gs3-box-inset" />
              <div className="gs3-band-horizontal" />
              <div className="gs3-band-vertical" />
              <div className="gs3-box-monogram" aria-label="GlowSurprise">
                <span className="gs4-seal-emblem">✦</span>
                <span className="gs4-seal-brand">GLOW<br/>SURPRISE</span>
              </div>
              <div className="gs3-box-lower-edge" />
            </div>
          </div>

          <div className="gs3-lid">
            <div className="gs3-lid-top" />
            <div className="gs3-lid-front">
              <span className="gs3-lid-ribbon" />
              <span className="gs3-lid-edge" />
            </div>

          </div>

          <div className="gs3-bow">
            <svg viewBox="0 0 360 195" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="gs3-silk" x1="0" y1="0" x2="0.8" y2="1">
                  <stop offset="0" stopColor="#8b5a2b" />
                  <stop offset=".17" stopColor="#f6dea1" />
                  <stop offset=".44" stopColor="#d4a75d" />
                  <stop offset=".7" stopColor="#f9e9b8" />
                  <stop offset="1" stopColor="#93652f" />
                </linearGradient>
                <linearGradient id="gs3-silk-edge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffefc4" />
                  <stop offset=".5" stopColor="#c59a55" />
                  <stop offset="1" stopColor="#765025" />
                </linearGradient>
                <linearGradient id="gs4-unfurl-shine" x1="0" y1="0" x2="1" y2=".5">
                  <stop offset="0" stopColor="#8d562a"/>
                  <stop offset=".22" stopColor="#fff0c0"/>
                  <stop offset=".48" stopColor="#cf9851"/>
                  <stop offset=".72" stopColor="#f9dfa4"/>
                  <stop offset="1" stopColor="#93632e"/>
                </linearGradient>
                <filter id="gs3-silk-shadow" x="-30%" y="-40%" width="160%" height="180%">
                  <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#240d0c" floodOpacity=".52"/>
                </filter>
              </defs>
              <g className="gs4-unfurl-ribbons" filter="url(#gs3-silk-shadow)">
                <path className="gs4-silk-trail gs4-silk-trail-left"
                  d="M178 97 C146 95 138 107 125 118 C102 137 71 129 46 143 C20 158 -3 194 -39 217"
                  fill="none" stroke="url(#gs4-unfurl-shine)" strokeWidth="23" strokeLinecap="butt"/>
                <path className="gs4-silk-trail-highlight gs4-silk-trail-left"
                  d="M178 95 C147 93 138 105 125 116 C101 135 69 127 45 141 C19 156 -4 192 -39 215"
                  fill="none" stroke="#ffedb8" strokeWidth="2.4" strokeLinecap="round" opacity=".65"/>
                <path className="gs4-silk-trail gs4-silk-trail-right"
                  d="M182 98 C221 93 240 104 252 120 C269 145 303 132 324 149 C353 171 373 197 408 215"
                  fill="none" stroke="url(#gs4-unfurl-shine)" strokeWidth="23" strokeLinecap="butt"/>
                <path className="gs4-silk-trail-highlight gs4-silk-trail-right"
                  d="M183 95 C222 90 240 102 253 118 C270 142 304 130 325 147 C354 169 374 195 408 213"
                  fill="none" stroke="#ffedb8" strokeWidth="2.4" strokeLinecap="round" opacity=".65"/>
              </g>
              <g className="gs3-bow-loop-left" filter="url(#gs3-silk-shadow)">
                <path d="M178 98 C138 68 112 27 66 33 C33 36 23 74 44 95 C69 120 129 108 178 98Z" fill="url(#gs3-silk)" stroke="#f4d995" strokeWidth="2.2"/>
                <path d="M172 97 C132 80 82 58 57 76 C81 55 125 84 172 97Z" fill="#fff1c1" opacity=".44"/>
                <path d="M66 33 C51 54 57 79 82 99" stroke="#72481f" strokeWidth="3.5" opacity=".5"/>
              </g>
              <g className="gs3-bow-loop-right" filter="url(#gs3-silk-shadow)">
                <path d="M181 98 C229 59 251 25 301 34 C336 39 343 73 322 96 C296 120 228 111 181 98Z" fill="url(#gs3-silk)" stroke="#f4d995" strokeWidth="2.2"/>
                <path d="M187 97 C237 80 286 59 310 77 C286 58 241 83 187 97Z" fill="#fff1c1" opacity=".43"/>
                <path d="M297 35 C310 52 306 83 281 99" stroke="#72481f" strokeWidth="3.5" opacity=".5"/>
              </g>
              <g className="gs3-bow-tail-left" filter="url(#gs3-silk-shadow)">
                <path d="M179 98 C165 130 150 165 95 193 L106 151 L69 142 C125 134 149 107 179 98Z" fill="url(#gs3-silk)" stroke="#e0b973" strokeWidth="2"/>
                <path d="M175 102 C152 135 132 154 105 169" stroke="#ffedba" strokeWidth="3" opacity=".58"/>
              </g>
              <g className="gs3-bow-tail-right" filter="url(#gs3-silk-shadow)">
                <path d="M181 98 C194 132 213 162 266 192 L254 151 L292 143 C238 131 209 107 181 98Z" fill="url(#gs3-silk)" stroke="#e0b973" strokeWidth="2"/>
                <path d="M186 102 C208 136 230 154 258 169" stroke="#ffedba" strokeWidth="3" opacity=".58"/>
              </g>
              <g className="gs3-bow-knot" filter="url(#gs3-silk-shadow)">
                <path d="M158 77 C171 73 189 74 201 78 C210 87 207 105 197 113 C184 120 170 118 159 110 C150 100 149 86 158 77Z" fill="url(#gs3-silk-edge)" stroke="#f8dc9a" strokeWidth="2"/>
                <path d="M161 81 C170 90 174 105 171 115" stroke="#fff0c1" strokeWidth="4" opacity=".65"/>
              </g>
            </svg>
          </div>
        </div>
      </motion.button>
      <div className="gs3-sparks" aria-hidden="true">
        {bursts.map((b, i) => <span key={i} style={{
          '--angle': b.a + 'deg', '--distance': b.d + 'px',
          animationDelay: b.delay + 's',
        } as CSSProperties}>{i % 3 === 0 ? '✧' : '✦'}</span>)}
      </div>
      <p className="gs3-opening-caption" aria-live="polite">
        {phase === 'untie' ? 'A little magic is coming undone…' :
         phase === 'ribbons' ? 'Unwrapping every lovely detail…' :
         phase === 'lift' ? 'Your surprise is opening…' :
         phase === 'reveal' ? 'Made especially for you.' : ' '}
      </p>
    </div>
  )
}
