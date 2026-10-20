# Magazine portfolio — throwaway prototype

Question: how should a portfolio feel as an arts/fashion magazine, and does a physical page turn make navigation feel natural?

Run the existing `pnpm dev --background --port 4350` command with Node 22.12+ and open:

http://localhost:4350/luis-amrein-portfolio/prototype/magazine/

Three structurally different opening spreads are available at `?variant=A` (Editorial), `?variant=B` (Fashion Issue), and `?variant=C` (Art Journal). Use the floating prototype switcher to compare them without changing the chapter.

- 20 pages: opening, work, about, and one two-page spread for each of the seven existing projects.
- Landscape: two pages on screen. Portrait: the spread stacks into two readable pages.
- Turn using the arrows, keyboard arrows / Page Up / Page Down, or drag an outer page edge. Release early to cancel a drag.
- Contents jumps to any spread. Natural pace / Slow study changes the turn duration.
- Alt + arrow keys, or arrow keys while the prototype switcher has focus, change design directions.
- The system reduced-motion preference skips the 3D turn.

The route is development-only: `getStaticPaths()` returns no pages for production builds. The existing home page, layout, project content, and global stylesheet are untouched. Nothing is published. Real content and images are reused; the short project spreads are layout studies rather than replacements for the full case studies.

Decision pending: choose a visual direction and assess the page motion before implementing the actual portfolio redesign. This code is deliberately disposable; capture the chosen direction separately before promoting an implementation.
