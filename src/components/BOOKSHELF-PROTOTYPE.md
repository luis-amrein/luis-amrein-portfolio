# Bookshelf interaction experiment

Question: can project links feel like physical books pulled out of a shelf, while preserving the existing list, filtering and navigation?

Run `pnpm dev --background` and visit `/luis-amrein-portfolio/work/#case-studies`.

The default is stacked volumes. The development-only bottom switcher and left/right arrow keys compare `?variant=stacked`, `?variant=upright`, and `?variant=covers`. The same collection is on the homepage. The stacked books touch directly with no shelf background. Each book has a stable hit area, a spring-driven frontal pull to the viewport width, cloth grain, raised spine edges, foil lettering and a changing cast shadow. There is no rotation and no exposed page geometry. Keyboard focus also pulls the book forward. Reduced motion disables displacement; touch follows links directly.

Evaluation: pending user review. Keep this experiment on `experiment/bookshelf-interaction`; no design has been selected for publication.

## Cover studies

The previous vintage cover studies were rejected. Five contemporary replacements use `?cover=editions` (minimal color editions), `?cover=type` (large series numbers and bold type), `?cover=art` (art-publishing geometry), `?cover=gallery` (white museum catalogues), and `?cover=spectrum` (soft full-bleed color fields). The development-only controls switch designs; left/right keys cycle covers.

Corrected spine geometry: left and right cut edges are flat. Curved lighting runs horizontally along the upper and lower edges. No upright binding bevel, ornamental frame, tilt or page geometry remains. The frontal spring pull and direct stack are retained.

Design selection remains pending user review.
