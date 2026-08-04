# Luis Amrein — Product Portfolio

An editorial portfolio focused on product judgment, measurable outcomes, and the person behind the work.

Live site: [luis-amrein.github.io/luis-amrein-portfolio](https://luis-amrein.github.io/luis-amrein-portfolio/)

## Stack

- Astro 7 with static output
- React 19 islands for purposeful interactions
- Tailwind CSS 4 through the Vite plugin
- TypeScript in strict mode
- Astro Content Collections for case studies
- GitHub Actions and GitHub Pages for free hosting

## Local development

Requires Node 22.12 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

The local site runs at `http://localhost:4321/luis-amrein-portfolio/`.

Useful commands:

- `pnpm check` runs Astro and TypeScript diagnostics.
- `pnpm build` creates the static site in `dist/`.
- `pnpm preview` serves the production build locally.
- `pnpm validate` runs diagnostics and the production build.

## Updating content

Case studies live in `src/content/projects/`. Each Markdown file contains validated metadata and the long-form project story. Add a new file there and it will automatically receive a page under `/work/`.

The homepage is in `src/pages/index.astro`; the personal story is in `src/pages/about.astro`. Global design tokens and responsive rules live in `src/styles/global.css`.

Before considering the portfolio final:

- Replace the editorial portrait placeholder with a current photograph.
- Review dates and wording for all older projects.
- Add shareable screenshots or diagrams where confidentiality allows.
- Confirm metrics and sample details for the MEDWING registration experiments.
- Add final launch evidence to the sustainability marketplace and Persephone cases.
- Replace or add a current CV download if desired.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The workflow validates the Astro project, builds static assets, and deploys them to GitHub Pages.

The repository must use **GitHub Actions** as its Pages source under **Settings → Pages**. The configured base path is `/luis-amrein-portfolio`.
