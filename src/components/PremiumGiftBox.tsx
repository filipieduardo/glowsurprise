import type { CSSProperties } from 'react'
import { motion } from 'motion/react'

export type OpeningPhase = 'ready' | 'untie' | 'ribbons' | 'lid' | 'reveal'
type Props = { phase: OpeningPhase; onOpen: () => void; photoUrl?: string }

/** A square gift within a portrait experience. Motion is a sequence of
 * loosening loops, travelling silk, lid rotation, light and a rising keepsake. */
export default function PremiumGiftBox({ phase, onOpen, photoUrl }: Props) {
  const opening = phase !== 'ready'
  return (
    <div className="gs5-gift-scene" data-phase={phase}>
      <div className="gs5-gift-halo" aria-hidden="true" />
      <div className="gs5-gift-rings" aria-hidden="true" />
      <div className="gs5-gift-ground" aria-hidden="true" />
      <motion.button type="button" className="gs5-gift-hit"
        aria-label={opening ? 'Your present is opening' : 'Tap to unwrap the Christmas gift'}
        onClick={onOpen} disabled={opening}
        whileTap={!opening ? { scale: .98 } : undefined}
        whileHover={!opening ? { scale: 1.025 } : undefined}>
        <div className="gs5-gift">
          <div className="gs5-gift-inside" aria-hidden="true" />
          <div className="gs5-gift-illumination" aria-hidden="true" />
          <div className="gs5-gift-photo-card" aria-hidden="true">
            {photoUrl ? (
              <div className="gs5-card-photo-preview"><img src={photoUrl} alt="" /></div>
            ) : (
              <div className="gs5-card-emboss"><span>✶</span><i>For someone<br />wonderful</i></div>
            )}
            <div className="gs5-card-foil">WITH LOVE THIS CHRISTMAS</div>
          </div>
          <div className="gs5-box-face">
            <div className="gs5-box-velvet" />
            <div className="gs5-box-panel" />
            <div className="gs5-wrap-vertical" />
            <div className="gs5-wrap-horizontal" />
            <div className="gs5-box-seal"><span className="gs5-box-seal-star">✶</span><span>GLOW<br />SURPRISE</span></div>
            <div className="gs5-box-edge" />
          </div>
          <div className="gs5-gift-lid"><div className="gs5-lid-top" /><div className="gs5-lid-face"><div className="gs5-lid-wrap" /></div></div>
          <div className="gs5-ribbon-bow">
            <svg viewBox="0 0 320 160" fill="none" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="gs5-satin" x1="0.05" y1="0.05" x2="0.9" y2="1">
                  <stop offset="0" stopColor="#8d582c"/><stop offset=".24" stopColor="#fff0c1"/>
                  <stop offset=".44" stopColor="#c19152"/><stop offset=".69" stopColor="#f9e2ae"/>
                  <stop offset="1" stopColor="#986b37"/>
                </linearGradient>
                <linearGradient id="gs5-satin-dark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fbe9b7"/><stop offset=".6" stopColor="#b78b4b"/><stop offset="1" stopColor="#77502a"/>
                </linearGradient>
              </defs>
              <g className="gs5-bow-loose-trails">
                <path className="gs5-unfurl gs5-unfurl-left" d="M157 74 C120 70 112 91 79 105 C52 118 36 110 9 142" stroke="url(#gs5-satin)" strokeWidth="19" strokeLinecap="round"/>
                <path className="gs5-unfurl gs5-unfurl-right" d="M164 74 C203 70 213 92 244 106 C270 118 284 112 312 144" stroke="url(#gs5-satin)" strokeWidth="19" strokeLinecap="round"/>
              </g>
              <g className="gs5-bow-tail-left">
                <path d="M157 77 C139 94 114 133 85 153 L94 123 L66 119 C99 109 127 81 157 77Z" fill="url(#gs5-satin)" stroke="#e8c48b" strokeWidth="1.6"/>
                <path d="M151 85 C129 113 117 126 92 138" stroke="#fff0c0" strokeWidth="2.6" opacity=".7"/>
              </g>
              <g className="gs5-bow-tail-right">
                <path d="M163 77 C183 95 204 135 233 153 L225 123 L253 119 C220 108 193 80 163 77Z" fill="url(#gs5-satin)" stroke="#e8c48b" strokeWidth="1.6"/>
                <path d="M170 85 C191 113 204 126 226 138" stroke="#fff0c0" strokeWidth="2.6" opacity=".7"/>
              </g>
              <g className="gs5-bow-loop-left">
                <path d="M160 75 C123 52 100 15 61 24 C31 32 29 71 52 89 C76 109 127 91 160 75Z" fill="url(#gs5-satin)" stroke="#ffedbe" strokeWidth="2"/>
                <path d="M154 78 C119 64 88 41 60 47" stroke="#fff3c9" strokeWidth="3.5" opacity=".68"/>
                <path d="M64 24 C52 40 47 65 67 83" stroke="#795024" strokeWidth="3" opacity=".4"/>
              </g>
              <g className="gs5-bow-loop-right">
                <path d="M161 75 C198 52 221 15 260 24 C289 33 291 70 268 89 C244 108 195 91 161 75Z" fill="url(#gs5-satin)" stroke="#ffedbe" strokeWidth="2"/>
                <path d="M168 78 C203 64 234 41 261 47" stroke="#fff3c9" strokeWidth="3.5" opacity=".68"/>
                <path d="M257 24 C269 40 274 65 254 83" stroke="#795024" strokeWidth="3" opacity=".4"/>
              </g>
              <g className="gs5-bow-knot">
                <path d="M143 58 Q160 50 177 59 Q186 75 175 89 Q161 99 146 89 Q134 76 143 58Z" fill="url(#gs5-satin-dark)" stroke="#ffe9b2" strokeWidth="2"/>
                <path d="M150 60 C159 70 162 84 156 91" stroke="#fff1c4" strokeWidth="3.8" opacity=".75"/>
              </g>
            </svg>
          </div>
        </div>
      </motion.button>
      <div className="gs5-gift-sparkles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ '--dir': (i * 30) + 'deg', '--dist': (95 + (i % 4) * 20) + 'px', '--delay': ((i % 4) * .075) + 's' } as CSSProperties}>✦</i>
        ))}
      </div>
      <p className="gs5-gift-stage-caption" aria-live="polite">
        {phase === 'untie' ? 'Unravelling a little Christmas magic…' :
         phase === 'ribbons' ? 'Every little detail, with love…' :
         phase === 'lid' ? 'Something wonderful is inside…' :
         phase === 'reveal' ? 'A gift made just for you.' : 'Tap the gift to unwrap'}
      </p>
    </div>
  )
}
