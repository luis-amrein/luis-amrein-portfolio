# Luis Amrein: Product Portfolio

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

- Review dates and wording for all older projects.
- Add shareable screenshots or diagrams where confidentiality allows.
- Confirm metrics and sample details for the MEDWING registration experiments.
- Add final launch evidence to the sustainability marketplace and Persephone cases.
- Replace or add a current CV download if desired.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The deployment workflow builds static assets and deploys them to GitHub Pages. Pull requests and pushes to `main` also run the separate `Validate portfolio` workflow, which runs `pnpm validate`. Manual deployment is restricted to `main`.

The repository must use **GitHub Actions** as its Pages source under **Settings → Pages**. The configured base path is `/luis-amrein-portfolio`.

### Discoverability

- Sitemap: `/sitemap-index.xml`
- Crawler policy: `/robots.txt` (allows search and major AI crawlers)
- Agent map: `/llms.txt` and `/llms-full.txt`
- After deploy, submit the sitemap in [Google Search Console](https://search.google.com/search-console) and request indexing for the homepage.

## Change and publishing workflow

`main` is the published website. Use a short-lived branch for each focused change,
then open a pull request. Pushes to feature and experiment branches back up the work
without publishing it. Merging a PR into `main` triggers the Pages deployment.

1. Start from an up-to-date `main` and create a `feature/`, `fix/` or `chore/` branch.
2. Commit meaningful checkpoints and push the branch to GitHub.
3. Run `pnpm validate` and review visible changes locally.
4. Open a PR describing the change, its purpose and validation. Add screenshots for UI changes.
5. Review the PR, update its branch if needed, and merge only when ready to publish.

The `main` protection rule requires a PR, an up-to-date branch, the
`Validate portfolio` check and resolved review conversations. A second reviewer is
not required for this solo project. Force pushes and branch deletion are disabled,
including for repository administrators. Do not bypass the workflow for routine changes.

### Recoverable versions

Normal commits retain earlier states. Use a new revert commit to undo a published
change. Keep experiments on named `experiment/` branches and push them as backups.
Tag important milestones and push those tags as well.

Initial saved checkpoints:

- `portfolio-live-2026-10-21`: the published version before the PR workflow.
- `checkpoint/navigation-2026-10-21`: navigation typing and erasing on scroll.
- `experiment/magazine-layout`: the saved development-only magazine prototype.

Uncommitted changes, ignored files and experiments saved outside this repository
are not included in its GitHub backup. The separated skills constellation remains
an external archive, not part of the website source.

The magazine prototype includes a cropped black desk lamp base with a keyboard-accessible O/I rocker. It starts in warm light; switching off fades the desk and magazine into cool ambient darkness. State is in memory, and reduced-motion preferences bypass the lighting transition.
