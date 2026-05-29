/*
 * colors.js
 * ---------
 * Pure color helpers. No DOM here, just math and data, so this file is easy to
 * read, test, and reuse. Everything is attached to a single global object,
 * `ColorKit`, so app.js can use it like `ColorKit.hslToHex(...)`.
 *
 * Color models used:
 *   - HSL  = Hue (0-360 degrees), Saturation (0-100%), Lightness (0-100%).
 *            Great for "pick a color, now show me shades of it".
 *   - RGB  = Red, Green, Blue (0-255 each). What screens actually display.
 *   - HEX  = the "#rrggbb" string people copy/paste.
 */
(function (global) {
  "use strict";

  // Keep a number inside a min/max range.
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // Wrap a hue so it always lands in 0..360 (e.g. 370 becomes 10).
  function wrapHue(h) {
    return ((h % 360) + 360) % 360;
  }

  // HSL -> RGB. Standard conversion formula.
  function hslToRgb(h, s, l) {
    h = wrapHue(h) / 360;
    s = clamp(s, 0, 100) / 100;
    l = clamp(l, 0, 100) / 100;

    if (s === 0) {
      const v = Math.round(l * 255);
      return { r: v, g: v, b: v };
    }

    const hue2rgb = function (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
  }

  // RGB -> HSL.
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  // RGB -> "#rrggbb".
  function rgbToHex(r, g, b) {
    const toHex = function (n) {
      return clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }

  // "#rrggbb" (or "rgb"/"#rgb") -> {r,g,b} or null if it can't be parsed.
  function hexToRgb(hex) {
    if (typeof hex !== "string") return null;
    let h = hex.trim().replace(/^#/, "");
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  // Convenience: HSL straight to a hex string.
  function hslToHex(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  /*
   * Named colors. A curated set of the common CSS color names. We use this to:
   *   1. let people search by name, and
   *   2. give any color a friendly label via nearestColorName().
   */
  const NAMED_COLORS = {
    black: "#000000", white: "#ffffff", gray: "#808080", silver: "#c0c0c0",
    red: "#ff0000", crimson: "#dc143c", firebrick: "#b22222", tomato: "#ff6347",
    coral: "#ff7f50", salmon: "#fa8072", orange: "#ffa500", darkorange: "#ff8c00",
    gold: "#ffd700", yellow: "#ffff00", khaki: "#f0e68c", olive: "#808000",
    greenyellow: "#adff2f", lime: "#00ff00", green: "#008000", forestgreen: "#228b22",
    seagreen: "#2e8b57", teal: "#008080", turquoise: "#40e0d0", cyan: "#00ffff",
    skyblue: "#87ceeb", deepskyblue: "#00bfff", dodgerblue: "#1e90ff", blue: "#0000ff",
    navy: "#000080", royalblue: "#4169e1", slateblue: "#6a5acd", indigo: "#4b0082",
    purple: "#800080", violet: "#ee82ee", orchid: "#da70d6", magenta: "#ff00ff",
    plum: "#dda0dd", lavender: "#e6e6fa", pink: "#ffc0cb", hotpink: "#ff69b4",
    deeppink: "#ff1493", brown: "#a52a2a", chocolate: "#d2691e", sienna: "#a0522d",
    peru: "#cd853f", tan: "#d2b48c", beige: "#f5f5dc", wheat: "#f5deb3",
    mintcream: "#f5fffa", ivory: "#fffff0", maroon: "#800000", aquamarine: "#7fffd4",
    steelblue: "#4682b4", cadetblue: "#5f9ea0", mediumseagreen: "#3cb371",
    darkslategray: "#2f4f4f", goldenrod: "#daa520", peachpuff: "#ffdab9",
  };

  // Straight-line distance between two colors in RGB space. Smaller = closer.
  function rgbDistance(a, b) {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  // Find the closest named color for any hex, returning a friendly label.
  function nearestColorName(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return "Mystery color";
    let bestName = null;
    let bestDist = Infinity;
    for (const name in NAMED_COLORS) {
      const dist = rgbDistance(rgb, hexToRgb(NAMED_COLORS[name]));
      if (dist < bestDist) {
        bestDist = dist;
        bestName = name;
      }
    }
    // If it's not basically the named color, call it a "shade of" that color.
    return bestDist < 18 ? bestName : "shade of " + bestName;
  }

  // Look up an exact named color (returns hex or null).
  function lookupName(name) {
    if (typeof name !== "string") return null;
    const key = name.trim().toLowerCase().replace(/\s+/g, "");
    return NAMED_COLORS[key] || null;
  }

  global.ColorKit = {
    clamp: clamp,
    wrapHue: wrapHue,
    hslToRgb: hslToRgb,
    rgbToHsl: rgbToHsl,
    rgbToHex: rgbToHex,
    hexToRgb: hexToRgb,
    hslToHex: hslToHex,
    nearestColorName: nearestColorName,
    lookupName: lookupName,
    NAMED_COLORS: NAMED_COLORS,
  };
})(window);
