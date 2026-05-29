# Build & Execution Plan

The step-by-step plan for building Color Quest and getting it live on GitHub
Pages. Checkboxes track what is done.

## Phase 0 — Documentation first

- [x] Write and commit `docs/PLAN.md` as the first commit.

## Phase 1 — Scaffold

- [x] Create the folder structure (`assets/css`, `assets/js`, `docs`).
- [x] Create `index.html` (header, mode toggle, swatch grids, result, palette).
- [x] Add `.nojekyll` so GitHub Pages serves files as-is.
- [x] Write `README.md` with run + deploy instructions.

## Phase 2 — Styling

- [x] Create `assets/css/styles.css` with the warm off-white, minimal theme.

## Phase 3 — Color engine

- [x] Create `assets/js/colors.js`: HSL/RGB/hex conversions, named-color list,
      `nearestColorName()`, and `lookupName()`.

## Phase 4 — App logic

- [x] Create `assets/js/app.js`:
  - [x] Explore engine (5 distinct hues -> tap -> 5 closer shades -> repeat).
  - [x] Search engine (name/hex -> 5 similar-but-unique options).
  - [x] Result view (big color, name, hex, Copy).
  - [x] Palette (save, remove, copy all, clear).
  - [x] Mode toggle + toast notifications.

## Phase 5 — Documentation

- [x] `docs/ARCHITECTURE.md` (decisions and data flow).
- [x] `docs/LEARNING.md` (plain-language explanations).
- [x] `docs/BUILD_PLAN.md` (this file).

## Phase 6 — Verify locally

- [ ] Open `index.html` in a browser.
- [ ] Explore: tap through a few rounds; confirm colors get closer each round.
- [ ] Search: try `teal`, `#ff8800`, and a partial like `sky`.
- [ ] Result: confirm name + hex show and Copy works.
- [ ] Palette: save a few, remove one, Copy all, Clear.

## Phase 7 — Deploy to GitHub Pages

- [ ] Commit the full app.
- [ ] Push the repository to GitHub.
- [ ] Settings -> Pages -> Deploy from a branch -> `main` / `root` -> Save.
- [ ] Open `https://<your-username>.github.io/<repo>/` and confirm it works.

## Stretch goals (after v1)

- [ ] Persist palette with `localStorage`.
- [ ] "Random color" button.
- [ ] Show RGB alongside hex.
- [ ] Export palette as CSS variables or an image.
