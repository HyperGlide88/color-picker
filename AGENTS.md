# Working conventions for this repo

These are the workflow rules to follow when building in this project.

## Issues first

- Before building a piece of work, create a GitHub issue describing it
  (`gh issue create`).
- One issue per logical unit of work (a feature, a fix, a doc, a refactor).
- Keep issue titles short and action-oriented (e.g. "Add search-by-name mode").

## Small, focused commits

- Make one commit per logical step. Do NOT bundle unrelated changes.
- Each commit should be independently understandable and, where possible, leave
  the app working.
- Reference the issue it addresses in the commit message, e.g.
  `feat: add explore engine (#4)`. Use `Closes #4` when the commit completes the
  issue.

## Commit message style

- Format: `type: short summary (#issue)` where type is one of
  `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`.
- Use the body to explain the "why" when it is not obvious.

## Documentation

- Keep `docs/` up to date as features land (`ARCHITECTURE.md`, `LEARNING.md`,
  `BUILD_PLAN.md`).
- Prefer documenting decisions as short ADR-style entries.

## Tech constraints

- Static site only: plain HTML/CSS/vanilla JS, no build step, no frameworks, so
  it keeps working on GitHub Pages as-is.
