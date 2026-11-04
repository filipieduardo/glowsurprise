import '../original-gift.css'

export type OpeningPhase = 'ready' | 'untie' | 'ribbons' | 'lid' | 'reveal'

type Props = { phase: OpeningPhase; onOpen: () => void; photoUrl?: string }

/**
 * Original GlowSurprise present (first prototype), restored as requested.
 * Only visual change from the original: no right-hand side panel.
 * Existing page scenes, photo editor, and staging remain untouched.
 */
export default function PremiumGiftBox({ phase, onOpen }: Props) {
  const opening = phase !== 'ready'
  return (
    <div className={'gs-first-gift-stage' + (opening ? ' gs-original-unwrapping' : '')} data-phase={phase}>
      <div className="gs-original-aura" aria-hidden="true" />
      <div className="gs-original-orbit gs-original-orbit-one" aria-hidden="true">✧</div>
      <div className="gs-original-orbit gs-original-orbit-two" aria-hidden="true">✦</div>
      <div className="gs-original-orbit gs-original-orbit-three" aria-hidden="true">✧</div>
      <button
        type="button"
        className="gs-original-present-button"
        onClick={onOpen}
        aria-label="Unwrap your Christmas present"
        disabled={opening}
      >
        <div className="gs-original-present">
          <div className="gs-original-present-base">
            <div className="gs-original-present-front">
              <span className="gs-original-ribbon-vertical" />
              <span className="gs-original-ribbon-horizontal" />
              <span className="gs-original-present-crest" aria-hidden="true">✦</span>
            </div>
          </div>
          <div className="gs-original-present-lid">
            <span className="gs-original-lid-face"><span className="gs-original-lid-ribbon" /></span>
            <span className="gs-original-bow gs-original-bow-left" />
            <span className="gs-original-bow gs-original-bow-right" />
            <span className="gs-original-knot" />
          </div>
          <div className="gs-original-present-light" aria-hidden="true" />
        </div>
      </button>
    </div>
  )
}
