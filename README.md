# Color Quest

A tiny website that helps you find your perfect color two ways:

1. **Explore** — pick 1 of 5 very different colors, then keep going deeper into
   shades until you land on the one you love.
2. **Search** — type a color name (like `teal`) or a hex code (like `#3aa1c9`)
   and get 5 similar-but-unique options.

When you find a color you like, you see it big with its name and hex code, copy
it with one tap, and save it to your palette.

Built with plain HTML, CSS, and JavaScript — **no frameworks and no build step**
— so it runs for free on GitHub Pages exactly as written.

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
├── .nojekyll             # serve files as-is on GitHub Pages
├── README.md             # this file
├── assets/
│   ├── css/styles.css    # styling
│   └── js/
│       ├── colors.js     # color math + named-color data
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
