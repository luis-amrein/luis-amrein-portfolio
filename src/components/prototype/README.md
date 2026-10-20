# Magazine portfolio — isolated prototype

Next-session ideas are saved in [NEXT-SESSION.md](./NEXT-SESSION.md).

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
