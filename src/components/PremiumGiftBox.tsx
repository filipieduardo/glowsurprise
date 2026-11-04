import { motion } from 'motion/react'

export type OpeningPhase = 'idle' | 'untie' | 'lift' | 'reveal'

type Props = {
  phase: OpeningPhase
  onOpen: () => void
}

const glints = Array.from({ length: 12 }, (_, index) => ({
  x: ((index * 41 + 7) % 95) + '%',
  y: ((index * 29 + 9) % 83) + '%',
  delay: (index % 5) * 0.11 + 's',
  size: 3 + (index % 3) * 2 + 'px',
}))

/**
 * A lightweight, CSS-sculpted 3D gift with a real sequence:
 * silk bow untying, ribbon release, lid lifting, and keepsake reveal.
 * All styling is responsive and respects prefers-reduced-motion.
 */
export default function PremiumGiftBox({ phase, onOpen }: Props) {
  const isIdle = phase === 'idle'

  return (
    <div className="gs2-gift-stage" data-phase={phase}>
      <div className="gs2-stage-halo" aria-hidden="true" />
      <div className="gs2-orbit gs2-orbit-outer" aria-hidden="true" />
      <div className="gs2-orbit gs2-orbit-inner" aria-hidden="true" />
      <div className="gs2-stage-stars" aria-hidden="true">
        {glints.map((glint, i) => (
          <span
            key={i}
            style={{ left: glint.x, top: glint.y, width: glint.size, height: glint.size, animationDelay: glint.delay }}
          />
        ))}
      </div>
      <div className="gs2-gold-mist" aria-hidden="true" />
      <div className="gs2-gift-shadow" aria-hidden="true" />

      <motion.button
        type="button"
        className="gs2-gift-hit"
        onClick={onOpen}
        disabled={!isIdle}
        aria-label={isIdle ? 'Unwrap your Christmas gift' : 'Opening your gift'}
        whileTap={isIdle ? { scale: 0.985 } : undefined}
        whileHover={isIdle ? { scale: 1.025 } : undefined}
        transition={{ type: 'spring', stiffness: 230, damping: 19 }}
      >
        <div className="gs2-gift-object">
          <div className="gs2-gift-interior" aria-hidden="true" />
          <div className="gs2-gift-back" aria-hidden="true" />

          <div className="gs2-keepsake" aria-hidden="true">
            <div className="gs2-keepsake-border">
              <span className="gs2-keepsake-star">✧</span>
              <span className="gs2-keepsake-topline">JUST FOR YOU</span>
              <span className="gs2-keepsake-name">A Christmas<br /><em>to remember</em></span>
              <span className="gs2-keepsake-rule" />
              <span className="gs2-keepsake-bottomline">GLOW SURPRISE</span>
            </div>
          </div>

          <div className="gs2-gift-body">
            <div className="gs2-gift-side" />
            <div className="gs2-gift-front">
              <div className="gs2-gift-grain" />
              <div className="gs2-ribbon-vertical" />
              <div className="gs2-ribbon-horizontal" />
              <div className="gs2-crest"><span>G<span className="gs2-crest-star">✦</span>S</span></div>
              <div className="gs2-gift-bottom-highlight" />
            </div>
          </div>

          <div className="gs2-gift-lid">
            <div className="gs2-lid-top" />
            <div className="gs2-lid-side" />
            <div className="gs2-lid-front">
              <span className="gs2-lid-ribbon" />
            </div>
            <div className="gs2-silk-bow">
              <div className="gs2-bow-left" />
              <div className="gs2-bow-right" />
              <div className="gs2-bow-tail-left" />
              <div className="gs2-bow-tail-right" />
              <div className="gs2-bow-center" />
            </div>
          </div>

          <div className="gs2-opening-light" />
        </div>
      </motion.button>

      <div className="gs2-release-burst" aria-hidden="true">
        {glints.map((glint, i) => (
          <span key={i} style={{ '--p': i, animationDelay: glint.delay } as React.CSSProperties}>✦</span>
        ))}
      </div>
      <div className="gs2-stage-floor" aria-hidden="true" />
      <div className="gs2-gift-status" aria-live="polite">
        {phase === 'untie' ? 'Unfastening the ribbon…' : phase === 'lift' ? 'Opening your gift…' : phase === 'reveal' ? 'A memory, just for you…' : ''}
      </div>
    </div>
  )
}
