# Learning Notes

Plain-language explanations of the ideas behind Color Quest. No prior experience
needed. Read this top to bottom and you will understand the whole app.

## 1. What are HTML, CSS, and JavaScript?

Think of building a person:

- **HTML** is the *skeleton* — the structure. It says "there is a title here, a
  button there." That's `index.html`.
- **CSS** is the *clothes and style* — colors, spacing, fonts. That's
  `assets/css/styles.css`.
- **JavaScript** is the *brain and muscles* — it makes things happen when you
  click. That's the files in `assets/js/`.

A web browser reads all three and shows you a working page.

## 2. How a computer describes a color

Screens make colors by mixing **R**ed, **G**reen, and **B**lue light. Each goes
from 0 to 255. A **hex code** like `#3aa1c9` is just those three numbers written
in base-16 ("hexadecimal"):

- `3a` = red, `a1` = green, `c9` = blue.

Hex is what you copy and paste into other apps.

## 3. Why we use HSL instead

RGB is how screens *display* color, but it is hard to think in. **HSL** is
friendlier:

- **H**ue (0–360): which color it is, like a position on a rainbow wheel. 0 is
  red, 120 is green, 240 is blue.
- **S**aturation (0–100%): how colorful vs. gray it is.
- **L**ightness (0–100%): how light or dark it is.

The big win: to make "a darker shade of the same color," you just lower the
Lightness and keep the Hue. That is exactly what the Explore mode does.

`colors.js` has the math to convert HSL into the hex the screen needs.

## 4. How "Explore" narrows down to your color

Imagine you are looking for a treasure on a number line and a friend says "warmer
/ colder."

1. **Round 1** shows 5 *very different* colors (spread evenly around the color
   wheel). You tap the closest one.
2. The app then **zooms in**: it remembers your pick as the center and shows 5
   new colors that are close to it (slightly lighter/darker, slightly different).
3. Every time you pick, it zooms in *more* (the spread shrinks to about half).
4. After a few rounds the 5 options are almost identical — you have found your
   color.

In code, "how far we spread out" is stored as `spans` (for hue, saturation,
lightness). Picking multiplies the spans by `0.55`, so we close in fast. See
`buildVariations()` in `app.js`.

## 5. How "Search" works

You type a name (`teal`) or a hex (`#3aa1c9`). The app:

1. Checks if it is a valid hex.
2. If not, looks it up in our list of named colors.
3. If still no exact match, tries a partial match (`sky` finds `skyblue`).

Then it shows 5 colors near that one so you can pick the exact variation you
like.

## 6. How naming any color works

We keep a list of common colors and their hex codes. For any color you land on,
the app measures which named color is *closest* (like finding the nearest town
on a map) and uses that name. If it is very close we use the name directly;
otherwise we say "shade of <name>" to be honest that it is nearby, not exact.

## 7. The palette

When you save a color, its hex is added to a list (an "array") in the app's
memory, and a little chip appears at the bottom. "Copy all" puts every hex on
your clipboard. (In this first version the palette resets if you refresh — a good
future improvement is to remember it.)

## 8. Glossary

- **Static site**: a website made of plain files the server hands over as-is, with
  no server-side processing.
- **Function**: a named recipe of steps, like `hslToHex(...)`.
- **Array**: an ordered list of things, like the palette of hex codes.
- **DOM**: the live, in-memory version of the page that JavaScript can change.
- **Clipboard**: the place your computer stores what you copy.

## Ideas to try next (great practice)

- Make the palette remember itself after refresh (use `localStorage`).
- Add a "random color" button.
- Show the RGB values next to the hex on the result.
- Let the palette export as an image or a CSS snippet.
