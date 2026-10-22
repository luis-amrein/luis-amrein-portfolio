> Current motion experiment: fixed, browser-replayed page turns. Each click, wheel gesture or completed swipe triggers one complete preset animation. Drag scrubbing, live WebGL rendering, page rasterization and spring physics are no longer used by the active reader. The earlier `paper-turn.ts` study remains in the experiment for reference.

# Magazine portfolio — isolated prototype

Next-session ideas are saved in [NEXT-SESSION.md](./NEXT-SESSION.md).

The desk material study now uses a generated photographic walnut texture, warm overhead light, a layered page block, stronger contact shadows, and a laminated cover highlight. The moving cover uses a clearcoat material; interior pages remain matte. Texture provenance and the exact generation prompt are saved in [ASSETS.md](./ASSETS.md).

The landing state is a closed magazine: the Art Journal cover on the right and empty space on the left, with a translucent, softly floating ‘Open me’ invitation. Clicking the invitation or cover, scrolling down or horizontally forward, or swiping opens the magazine. The first numbered spread places the full-bleed Fashion Issue portrait on the left and a clickable table of contents on the right. Everything uses Luis's existing coral (#ff5a36), green (#36ffb6), ink (#161714), and paper (#f3f0e8).

Run `pnpm prototype:magazine` (Node 22.12+), then open http://localhost:4352/luis-amrein-portfolio/prototype/magazine/?variant=D . Stop with `pnpm astro dev stop`.

The original directions A, B, and C remain in the bottom switcher. D is the selected hybrid and the default. The unnumbered cover precedes 20 pages containing portrait/contents, work, about, and one spread per existing project, using the real portfolio content and assets.

## Motion study

- Horizontal trackpad scrolling controls the turn directly. Shift + mouse wheel also works; ordinary vertical scrolling remains available.
- Release a gesture to let a damped spring finish or cancel the turn. Momentum is consumed by the current gesture, so one swipe cannot skip multiple chapters.
- Click the cover or invitation to open. The closed cover also accepts vertical scrolling and touch swipes. Once open, drag either outer page edge, use the arrows, or jump through Contents. The previous arrow from pages 01–02 closes the cover again; Home always returns to the cover.
- Natural pace / Slow study changes the spring response. Reduced motion skips the effect. Portrait screens stack the two pages.
- The turning page is a subdivided WebGL surface, with front and reverse print textures, changing curvature, corner twist, dynamic surface normals, faint ink bleed, paper grain, soft cast shadows, and landing flutter. A planar fallback remains available without WebGL.
- Layouts stay as HTML; only the moving sheet is rasterized. GPU resources are released after each turn and the texture cache is bounded.

## Isolation and review

This is throwaway code on `experiment/magazine-physical-paper`. The original checkout was updated externally during development and the prototype files there were removed; this separate checkout preserves the iteration independently.

The Astro route is development-only: `getStaticPaths()` returns no pages in a production build. No home page, global style, project content, or live deployment is changed. The short case-study spreads demonstrate layout rather than replace the original full case studies. The custom preview config gives this checkout a separate Vite cache.

Visual decision captured: Art Journal left + Fashion Issue right, existing brand palette. Motion remains open for review before implementing a production redesign.

Opening flow decision: closed right-hand cover → portrait left / contents right. The translucent invitation uses paper-white light, a mint aura, faint sparkles, and a slow hover; reduced motion keeps it still. Detailed paper-motion tuning is deferred.

The landing view hides all surrounding text and controls except the cover and “Open me”. A cropped LP (diameter tied to the magazine scale) spins at 33⅓ rpm. Click its raised tonearm to place the stylus and fade in Kevin MacLeod’s “Backbay Lounge” (CC BY 4.0; credit in the contents overlay); click again to lift and pause. The record remains independent of chapter changes, and reduced motion stops the continuous spin.

Turntable v2 uses photographic vinyl and chrome hardware assets. The LP diameter is now 1.5× the magazine page height in landscape, giving a broader, larger arc. Reflections remain fixed; only the label and reverse-drifting strobe-dot rows animate. This reproduces the visual impression of platter strobe dots without flashing the screen. See TURNTABLE-ASSETS.md for generation provenance.

Dark lighting v2 removes the full-screen grey overlay. The desk alone darkens into walnut shadows with cool ambient light; coral remains saturated, the laminate highlight recedes, the page block and chrome dim separately, and the invitation glows mint. Turning pages uses a cooler, weaker directional light when the lamp is off. Interior paper remains legible, while the contents overlay uses dark green surfaces.

Turntable motion tuning: strobe rows now reverse at 18/22/26 seconds per revolution (much faster than the earlier 7–12 minute drift). Fine scuffs and surface specks rotate at 33⅓ rpm independently of fixed photographed reflections. The record sits slightly higher to reveal its moving label edge. Tonearm v3 removes the visible pivot hardware, cue lever, and side handle.

Opening camera move: opening the cover simultaneously expands the magazine into an edge-to-edge reader and slides/fades the lamp and vinyl out. The camera uses a 1.45-second eased transform between measured desk and viewport bounds, so the WebGL sheet turns within the same move. Returning to the desk reverses it; cancelled gestures restore their starting view. Portrait uses full-height pages with vertical scrolling. An overlaid corner arrow returns to the desk. Audio continues while the hardware is offscreen, which is inert and hidden from assistive technology. Reduced motion skips the zoom and hardware transitions.

Performance/handoff pass: the destination spread commits synchronously before the rendered sheet is hidden, preventing an outgoing-page flash. Page markup uses render helpers instead of newly defined React component types, preserving existing DOM and decoded images across state updates. One WebGL renderer/context is reused until unmount, with an LRU cache of page canvases and GPU textures. Page snapshots copy only print-related styles and use bounded raster sizes; embedded photos use WebP. The render buffer is capped at 1.8M pixels, the mesh uses 48×12 subdivisions (637 vertices rather than 2,025), front/back share position/normal buffers, and shadows use one 1024px PCF pass instead of 2048px multi-pass VSM. Per-frame CSS shadow updates are removed and offscreen record animation pauses. `paper-scene-host` exposes render pixels and preparation milliseconds as prototype-only DOM diagnostics; these are not FPS benchmarks.

Flips start immediately with the compositor-driven DOM sheet while artwork is prepared. The curved renderer joins only early in a turn; if an uncached image arrives late, that turn keeps the DOM sheet rather than popping between renderers. Stale preparation cannot publish over a newer gesture. Frame mean/p95 values are exposed on the book as development diagnostics.

Wheel/drag painting is coalesced into one scheduled render per animation frame, so high-frequency trackpad events do not submit multiple GPU frames between display refreshes. The record component is memoized so page state changes do not reconcile hundreds of strobe dots.

Depth-artifact fix: the paper camera clips tightly around the sheet instead of using near=1/far=5000. The shadow receiver has a small physical separation, polygon depth offsets are removed, and only one double-sided sheet casts the shadow. This avoids competing coplanar depth/shadow writes as a turned page settles flat, without increasing render resolution or mesh complexity. Add `&motion=slow` to the prototype URL to inspect turns in slow study mode.

Preset playback pass: every turn uses the same 860ms transform/opacity timeline (1.8s in slow study mode), with an atomic handoff to the destination spread. Inputs are locked during playback, and trackpad momentum cannot skip multiple chapters. Swipe direction is evaluated only on release, never used to hold or deform the sheet. Opening/closing retains the camera zoom and waits for both timelines before unlocking navigation. Portrait also uses a fixed full-page turn; reduced motion switches directly.

### Tabletop opening sequence
The cover now turns completely on the desk before a short 220 ms pause and the camera zoom. The landscape book footprint leaves clearance from the lamp and record player; decorations only move away when the zoom starts. The input lock spans both phases. The invitation has rounded, translucent liquid lettering.
