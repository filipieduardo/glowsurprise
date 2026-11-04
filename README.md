# GlowSurprise — cinematic Christmas preview

A private, mobile-first Christmas gift: a burgundy square 3D present opens into a personal letter, photo/video memories, and a final message. This branch is a reviewable prototype. It does not integrate with Shopify, save gifts to a server, or create shareable gift links.

## Run locally

```sh
npm ci
npm run build
npm run preview
# http://127.0.0.1:4173
```

`npm run dev` runs the Vite development server. Production uses esbuild, as before. All production media, fonts and graphics are local. `npm run build:portable` also produces a self-contained HTML preview; pass a destination to `node scripts/portable.mjs /path/preview.html` when outside the original workspace.

## Design and implementation

- Original square 3D box, hollow interior, beveled lid and broad folded ribbon surfaces; no TubeGeometry, label, medallion, extra side panel or oval ground shadow.
- Three.js loaded separately. Procedural studio environment, original geometry and paper texture; no purchased models or externally hosted HDRIs.
- Warm ivory typography on deep green, quiet layered snow, four chapters. Personal content defaults live in `src/content.json` → `glowsurprise`.
- Local photo/video previews using object URLs, explicit size/type checks, removal controls and URL cleanup. No network upload. Reloading clears personalization.
- Keyboard controls, native modal dialog with focus management, reduced motion and snow pause. Static image fallback if WebGL fails. No automatic video playback.
- Renderer draws on demand at rest, suspends on a hidden tab, caps pixel density at 1.75, and disposes GPU resources between scenes.

## Verification

```sh
npm run typecheck
npm run lint
npm run build
npx playwright install webkit
npm run preview           # leave running in another terminal
npm run test:preview
```

The browser checks currently use installed Chrome at the macOS application path and Playwright WebKit. Adapt `executablePath` for other hosts. Test uploads are generated, non-personal fixtures. Tests cover viewport overflow, WCAG A/AA automated checks, keyboard focus, personalization, photo decoding, video playback, replay, timer cancellation, reduced motion, no-WebGL fallback and the WebKit journey. `scripts/review.mjs` captures all scenes; its output directory can be changed for other workspaces. `scripts/capture.mjs` compares against a baseline served on port 4172.

## Boundaries and limitations

This is original real-time 3D art, not a photoreal offline commercial render. The ribbon is choreographed fabric geometry, not a cloth simulation or physically accurate untying rig. Browser tests at iPhone dimensions and WebKit are not tests on a physical iPhone; battery, thermal behavior, older devices and iOS codecs still need device validation. Sample artwork is explicitly labeled; no personal memories are bundled. Sharing, permanent storage and Shopify integration remain future work.

No deployment workflow was modified or triggered. The Pages workflow is still limited to `main` pushes or manual dispatch; this branch must not be merged/deployed without approval.

## Licenses

The original model, generated textures, sample artwork and new code follow the repository MIT license. Runtime dependency notices are preserved in `public/THIRD-PARTY-NOTICES.txt`. Cormorant Garamond is bundled under SIL OFL 1.1 (`public/fonts/OFL.txt`). All added resources are free for commercial use under their respective licenses. No image generation, stock-media subscription, audio track, paid model or CDN service is required.

Legacy birthday scenes and old styles remain in source for reference; they are not imported by the Christmas entry point or included in its build.
