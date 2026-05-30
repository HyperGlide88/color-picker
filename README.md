# Color Quest

**Open source · free to use · live on the web**

Color Quest is a public, open-source color discovery app and palette library.
Anyone on the internet can open it, play with it, and reuse its code or data in
their own projects — no account, no install, no paywall.

**Try it now:** [https://hyperglide88.github.io/color-picker/](https://hyperglide88.github.io/color-picker/)

Licensed under the [MIT License](LICENSE). You may copy, modify, and share this
project for personal or commercial use. Please keep the license notice when you
reuse substantial portions of the code or palette data.

## What it does

1. **Explore** — pick from six starter colors, then keep narrowing into shades
   until you land on the one you love.
2. **Search** — type a color name (like `teal`) or a hex code (like `#3aa1c9`)
   and get similar options with readable labels.
3. **Palettes** — browse hundreds of curated palettes (web UI, branding,
   interiors, brands, Minecraft blocks, and more). Tap a color to select it,
   save palettes you love, and copy hex codes.

When you find a color you like, you see it big with its name and hex code, copy
it with one tap, and save it to your personal palette strip.

Built with plain HTML, CSS, and JavaScript — **no frameworks and no build step**
— so it runs for free on GitHub Pages exactly as written.

## Reuse this project

This repo is meant to be drawn from, not just visited:

- **`assets/js/palettes.js`** — curated and generated palette data exposed as
  `window.PaletteLibrary` (categories, named brand colors, Minecraft sets, and
  more).
- **`assets/js/colors.js`** — color math and naming helpers exposed as
  `window.ColorKit` (HSL/RGB/hex conversion, search, nearest-name lookup).
- **`assets/js/app.js`** — reference UI wiring if you want to see how the modes
  connect.

Copy the files you need, link to the live site, or fork the repo — all allowed
under the MIT license.

## Run it locally

The simplest way: double-click `index.html` to open it in your browser.

Or serve it with a tiny local web server (optional):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. On GitHub, go to **Settings -> Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **`main`** and folder **`/ (root)`**, then **Save**.
5. Wait about a minute, then visit `https://<your-username>.github.io/<repo>/`.

The `.nojekyll` file tells GitHub Pages to serve the files as-is.

## Project structure

```text
color-picker/
├── index.html            # the page (entry point, must be at root)
├── LICENSE               # MIT — open source terms
├── .nojekyll             # serve files as-is on GitHub Pages
├── README.md             # this file
├── assets/
│   ├── css/styles.css    # styling
│   └── js/
│       ├── colors.js     # color math + named-color data (ColorKit)
│       ├── palettes.js   # curated palette library (PaletteLibrary)
│       └── app.js        # app logic + UI wiring
└── docs/                 # documentation you can learn from
    ├── PLAN.md
    ├── ARCHITECTURE.md
    ├── LEARNING.md
    └── BUILD_PLAN.md
```

## Learn how it works

Start with [`docs/LEARNING.md`](docs/LEARNING.md) for plain-language
explanations, then read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the
decisions behind it.
