## Git workflow

These preferences apply to all work in this repository.

- `main` is the published website. Never implement or commit directly on `main`.
- Before editing, inspect the current branch and working tree. Preserve existing edits;
  never discard unrelated changes or reset the checkout to make it clean.
- Use one branch per coherent change: `feature/`, `fix/`, `chore/` or `experiment/`.
  If already on a suitable task branch, continue it rather than creating duplicates.
- Make descriptive commits at useful checkpoints. Preserve promising or abandoned
  experiments on separate branches instead of mixing them into production changes.
- Before marking an implementation complete, run `pnpm validate`, check visible changes
  in the browser, commit the work, push its branch and open or update a focused pull
  request, unless the user explicitly requests local-only work. Explain the result,
  rationale and validation; include screenshots for visible changes when available.
- Ask the user to review the concrete PR before merging or publishing. A request to
  implement a change is not permission to merge it into `main`.
- Never force-push, rewrite published history, delete checkpoint tags or delete saved
  experiment branches unless explicitly requested. Undo published changes with revert.
- Tag important milestones and push those tags. Files outside this repository and
  uncommitted work are not backed up by pushing this repository.
- The required PR check is `Validate portfolio`; `main` must be up to date before merge.
  Solo work requires a PR and passing checks, but no second-person approval.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
