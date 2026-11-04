import { motion } from 'motion/react'
import type { CSSProperties } from 'react'

export type OpeningPhase = 'ready' | 'untie' | 'ribbons' | 'lid' | 'reveal'

type Props = { phase: OpeningPhase; onOpen: () => void; photoUrl?: string }

// The bow uses flat, open, folded satin shapes instead of cylindrical strokes.
const sparkles = Array.from({ length: 18 }, (_, i) => ({
  a: (i * 137.51) % 360,
  radius: 100 + (i % 5) * 24,
  delay: (i % 6) * .07,
  size: 4 + (i % 3) * 3,
}))

export default function PremiumGiftBox({ phase, onOpen, photoUrl }: Props) {
  const isReady = phase === 'ready'
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

          <div className="gs6-silk-bow gs7-silk-bow">
            <svg viewBox="0 0 320 200" fill="none" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="gs7-gold-satin" x1="0%" y1="0%" x2="100%" y2="65%">
                  <stop offset="0%" stopColor="#93612f"/>
                  <stop offset="14%" stopColor="#e3bc7a"/>
                  <stop offset="27%" stopColor="#fff4d1"/>
                  <stop offset="39%" stopColor="#d3a460"/>
                  <stop offset="54%" stopColor="#a87337"/>
                  <stop offset="73%" stopColor="#f8e2ab"/>
                  <stop offset="90%" stopColor="#b78240"/>
                  <stop offset="100%" stopColor="#7d512b"/>
                </linearGradient>
                <linearGradient id="gs7-satin-back" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0" stopColor="#f7dc9a"/>
                  <stop offset=".45" stopColor="#a66c36"/>
                  <stop offset=".8" stopColor="#714322"/>
                  <stop offset="1" stopColor="#d7a761"/>
                </linearGradient>
                <linearGradient id="gs7-satin-tail" x1="0%" y1="0%" x2="95%" y2="25%">
                  <stop offset="0%" stopColor="#7f532a"/>
                  <stop offset="20%" stopColor="#e1b97c"/>
                  <stop offset="46%" stopColor="#fff0bd"/>
                  <stop offset="68%" stopColor="#c69455"/>
                  <stop offset="100%" stopColor="#a06c35"/>
                </linearGradient>
              </defs>

              {/* V-cut tails are flat satin with visible fold lines, never thick strokes */}
              <g className="gs7-bow-tail-left">
                <path d="M153 84 C131 102 107 130 63 168 L75 132 L42 139 C90 117 119 92 153 84Z"
                  fill="url(#gs7-satin-tail)" stroke="#f6dba1" strokeWidth="1.2"/>
                <path d="M147 89 C118 116 95 141 62 168" stroke="#fff0c4" strokeWidth="2.3" opacity=".63"/>
                <path d="M75 132 L63 168 L88 140" stroke="#825329" strokeWidth="2" opacity=".54"/>
              </g>
              <g className="gs7-bow-tail-right">
                <path d="M167 84 C189 102 213 130 257 168 L245 132 L278 139 C230 117 201 92 167 84Z"
                  fill="url(#gs7-satin-tail)" stroke="#f6dba1" strokeWidth="1.2"/>
                <path d="M173 89 C202 116 225 141 258 168" stroke="#fff0c4" strokeWidth="2.3" opacity=".63"/>
                <path d="M245 132 L257 168 L232 140" stroke="#825329" strokeWidth="2" opacity=".54"/>
              </g>

              {/* Broad open loops with real negative space. Their cutouts prevent a pipe look. */}
              <g className="gs7-bow-wing-left">
                <path fillRule="evenodd"
                  d="M159 82 C127 44 99 18 59 26 C24 34 22 76 54 98 C89 119 132 101 159 82 Z M135 79 C106 54 80 42 61 50 C47 56 47 73 64 83 C84 94 110 88 135 79 Z"
                  fill="url(#gs7-gold-satin)" stroke="#e9c78b" strokeWidth="1.1"/>
                <path d="M142 81 C117 71 94 54 76 49" stroke="#fff5d3" strokeWidth="3" opacity=".62" strokeLinecap="round"/>
                <path d="M54 31 C42 45 41 73 58 91" stroke="#77471f" strokeWidth="2.5" opacity=".32" strokeLinecap="round"/>
                <path d="M128 72 C133 76 141 82 150 84" stroke="url(#gs7-satin-back)" strokeWidth="9" opacity=".58"/>
              </g>
              <g className="gs7-bow-wing-right">
                <path fillRule="evenodd"
                  d="M161 82 C193 44 221 18 261 26 C296 34 298 76 266 98 C231 119 188 101 161 82 Z M185 79 C214 54 240 42 259 50 C273 56 273 73 256 83 C236 94 210 88 185 79 Z"
                  fill="url(#gs7-gold-satin)" stroke="#e9c78b" strokeWidth="1.1"/>
                <path d="M178 81 C203 71 226 54 244 49" stroke="#fff5d3" strokeWidth="3" opacity=".62" strokeLinecap="round"/>
                <path d="M266 31 C278 45 279 73 262 91" stroke="#77471f" strokeWidth="2.5" opacity=".32" strokeLinecap="round"/>
                <path d="M192 72 C187 76 179 82 170 84" stroke="url(#gs7-satin-back)" strokeWidth="9" opacity=".58"/>
              </g>

              {/* A small folded centre knot, not a thick circular tube */}
              <g className="gs7-bow-centre">
                <path d="M147 66 C155 62 166 62 174 68 L180 81 L172 96 C162 101 152 98 144 90 L140 80 Z"
                  fill="url(#gs7-satin-back)" stroke="#ffeac0" strokeWidth="1.3"/>
                <path d="M149 69 Q162 77 148 93" fill="none" stroke="#fff6d5" strokeWidth="4" opacity=".65"/>
                <path d="M173 69 Q164 79 174 93" fill="none" stroke="#78491f" strokeWidth="2.5" opacity=".46"/>
              </g>
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
