# GlowSurprise — cinematic Christmas gift

A mobile-first Christmas gift with an original burgundy square box, satin bow, personal letter, photo/video memories and a final message. The gift maker can arrange and caption memories, explicitly save a private draft on the current device, and download a self-contained recipient HTML file. No Shopify integration or server upload is involved.

## Run locally

```sh
npm ci
npm run build
npm run preview
# http://127.0.0.1:4173
```

`npm run dev` starts Vite. Production uses esbuild. `npm run build:portable` produces a self-contained HTML preview, including fonts and animation. For another workspace, use `node scripts/portable.mjs /path/preview.html`. The build also creates `dist/gift-template.html` for personalized downloads; serve it alongside the app.

## Visual design

- Original square box with beveled edges, fitted lid, hollow interior and burgundy paper. Broad satin sheets have asymmetric loops, folded tails, woven hems, microtexture and directional highlights. No tubular ribbon, medallion, name on the box, extra right panel or oval ground shadow.
- The original Three.js geometry is rendered with Blender Cycles studio lights. A transparent still loads first; an optimized animated WebP is fetched on opening. The 101-frame, 24 fps animation moves the ribbon, lid and camera, revealing a card. A personal photo is composited into the reveal when available.
- The phone does not run a WebGL renderer. `GiftModel.ts` and `GiftRenderer.ts` remain authoring sources and are excluded from the production bundle. On animation fetch/decode failure, lightweight image layers preserve the opening and letter. Reduced motion skips the opening.
- Deep green stage, ivory typography, quiet layered snow and four chapters. Snow can be paused. Personal defaults live in `src/content.json` → `glowsurprise`.

## Gift studio and privacy

Up to ten photos and one video; captions, reorder and removal controls. Supported photos are prepared locally at a maximum 1800-pixel edge when needed. GIFs stay intact. Photos are limited to 10 MiB each, video to 20 MiB, and selected files to 35 MiB total. HEIC is rejected with an explanation; video codec playback remains browser-dependent.

Nothing uploads to a server. Saving a draft is explicit and uses IndexedDB on this device/origin, with restore and removal controls. Browser storage can be cleared or evicted. Unsaved changes disappear on reload.

The download contains the gift, media and all app assets. The recipient sees the gift without editing controls and can open it offline in a browser. This is an HTML document, not a hosted share link; messaging apps and iOS Files may preview it without running it, so the recipient may need to open it in a compatible browser. Anyone holding the file can view its contents. Do not commit real personal media to this repository.

## Verification

```sh
npm run typecheck
npm run lint
npm run build
npm run build:portable
npx playwright install webkit
npm run preview            # keep running in another terminal
npm run test:preview
node scripts/test-product.mjs
node scripts/test-opening.mjs
node scripts/test-delivery.mjs
node scripts/review.mjs
```

Tests use installed Chrome on macOS and Playwright WebKit; adapt `executablePath` elsewhere. They cover responsive overflow, automated WCAG A/AA checks, keyboard/modal focus, reduced motion, photos, video playback, captions/order, draft persistence/removal, offline downloads, inert user text, replay, cancellation, actual changing animation frames in both engines and asset-failure fallback. Synthetic test media only. Screenshots and JSON results go to `../../outputs`; adapt for another workspace. The measured requestAnimationFrame rate is a Mac browser observation, not an iPhone hardware benchmark.

## Rebuild the original art (optional)

A normal app build uses the committed WebP assets; Blender is not required. To edit the model or light rig, use free Blender 4.5 and an FFmpeg build with WebP support:

```sh
node scripts/export-model.mjs
blender --background --python scripts/render-gift.py
blender --background --python scripts/render-layers.py
blender --background --python scripts/render-opening.py
ffmpeg -y -i .gift-art/renders/gift-closed.png -c:v libwebp -quality 95 public/gift-poster.webp
ffmpeg -y -i .gift-art/renders/gift-base.png -c:v libwebp -quality 95 public/gift-base.webp
ffmpeg -y -i .gift-art/renders/gift-lid.png -c:v libwebp -quality 95 public/gift-lid.webp
ffmpeg -y -framerate 24 -i .gift-art/sequence/%04d.png -c:v libwebp_anim -quality 82 -loop 1 public/gift-opening.webp
```

`GIFT_ART_DIR` overrides the ignored `.gift-art` folder in all authoring scripts; `CHROME_PATH` overrides the exporter browser. Rendering defaults to CPU to avoid GPU compilation/memory pressure. Existing sequence frames are reused: remove your generated `.gift-art/sequence` before rerendering a changed model. The Blender scene is saved as `.gift-art/gift-studio.blend`.

## Limits and review boundary

The box has physically rendered light/materials, but the ribbon motion is choreographed geometry, not a physically accurate cloth/untying simulation. The animation is 720×680 at 24 fps, deliberately optimized for the small mobile stage; the still is 720×680. There is no live 3D orbit or arbitrary camera view. Physical iPhone/Safari, older hardware, iOS file handoff, thermal behavior and large personal videos still need device testing. Sample artwork is labeled. Hosting, durable server storage and Shopify integration remain future work.

This is a review branch. No deployment workflow was modified or triggered. Pages still runs on `main` pushes or manual dispatch. Do not merge or deploy before approval.

## Licenses

The original models, procedural textures, renders, sample artwork and new code follow the repository MIT license. Runtime notices are preserved in `public/THIRD-PARTY-NOTICES.txt`; Cormorant Garamond uses SIL OFL 1.1 (`public/fonts/OFL.txt`). All added assets are original or free for commercial use under the included licenses. No paid model, stock footage, audio track, image generation or CDN is required. Blender and FFmpeg are authoring tools, not bundled application dependencies.

Legacy birthday scenes remain in source for reference and are excluded from the Christmas production bundle.
