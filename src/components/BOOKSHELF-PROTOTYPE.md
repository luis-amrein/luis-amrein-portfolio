# Bookshelf interaction experiment

Question: can project links feel like physical books pulled out of a shelf, while preserving the existing list, filtering and navigation?

Run `pnpm dev --background` and visit `/luis-amrein-portfolio/work/#case-studies`.

The default is stacked volumes. The development-only bottom switcher and left/right arrow keys compare `?variant=stacked`, `?variant=upright`, and `?variant=covers`. The same collection is on the homepage. The stacked books touch directly with no shelf background. Each book has a stable hit area, a spring-driven frontal pull to the viewport width, cloth grain, raised spine edges, foil lettering and a changing cast shadow. There is no rotation and no exposed page geometry. Keyboard focus also pulls the book forward. Reduced motion disables displacement; touch follows links directly.

Evaluation: pending user review. Keep this experiment on `experiment/bookshelf-interaction`; no design has been selected for publication.

## Cover studies

Five designs share the same straight pull and touch directly: `?cover=cloth` (foil clothbound), `?cover=swiss` (geometric graphics and bold typography), `?cover=paper` (pasted archival labels), `?cover=blueprint` (drafting grid and monospaced type), and `?cover=black` (satin black and embossed silver). Select in the development-only bottom controls; left/right arrow keys cycle cover styles. The layout arrows still compare the three shelf arrangements.
