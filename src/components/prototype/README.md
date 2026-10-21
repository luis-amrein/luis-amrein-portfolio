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

The landing view hides all surrounding text and controls except the cover and “Open me”. A cropped LP (diameter tied to the magazine scale) spins at 33⅓ rpm. Click its raised tonearm to place the stylus and fade in Kevin MacLeod’s “George Street Shuffle” (CC BY 4.0; credit in the contents overlay); click again to lift and pause. The record remains independent of chapter changes, and reduced motion stops the continuous spin.

Turntable v2 uses photographic vinyl and chrome hardware assets. The LP diameter is now 1.5× the magazine page height in landscape, giving a broader, larger arc. Reflections remain fixed; only the label and reverse-drifting strobe-dot rows animate. This reproduces the visual impression of platter strobe dots without flashing the screen. See TURNTABLE-ASSETS.md for generation provenance.

Dark lighting v2 removes the full-screen grey overlay. The desk alone darkens into walnut shadows with cool ambient light; coral remains saturated, the laminate highlight recedes, the page block and chrome dim separately, and the invitation glows mint. Turning pages uses a cooler, weaker directional light when the lamp is off. Interior paper remains legible, while the contents overlay uses dark green surfaces.

Turntable motion tuning: strobe rows now reverse at 18/22/26 seconds per revolution (much faster than the earlier 7–12 minute drift). Fine scuffs and surface specks rotate at 33⅓ rpm independently of fixed photographed reflections. The record sits slightly higher to reveal its moving label edge. Tonearm v3 removes the visible pivot hardware, cue lever, and side handle.
