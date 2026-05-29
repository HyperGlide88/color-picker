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
   * Named colors — searchable palette. Keys are normalized (no spaces/apostrophes).
   * Includes CSS classics plus popular paint/fashion names.
   */
  const NAMED_COLORS = {
    black: "#000000", white: "#ffffff", snow: "#fffafa", ivory: "#fffff0",
    ghostwhite: "#f8f8ff", whitesmoke: "#f5f5f5", seashell: "#fff5ee",
    floralwhite: "#fffaf0", oldlace: "#fdf5e6", linen: "#faf0e6",
    antiquewhite: "#faebd7", papayawhip: "#ffefd5", blanchedalmond: "#ffebcd",
    bisque: "#ffe4c4", cornsilk: "#fff8dc", lemonchiffon: "#fffacd",
    lightyellow: "#ffffe0", beige: "#f5f5dc", mintcream: "#f5fffa",
    azure: "#f0ffff", aliceblue: "#f0f8ff", lavender: "#e6e6fa",
    lavenderhaze: "#d7c4e8", lavenderblush: "#fff0f5", mistyrose: "#ffe4e1",
    gainsboro: "#dcdcdc", lightgray: "#d3d3d3", silver: "#c0c0c0",
    darkgray: "#a9a9a9", gray: "#808080", dimgray: "#696969", slategray: "#708090",
    lightslategray: "#778899", darkslategray: "#2f4f4f", charcoal: "#36454f",
    red: "#ff0000", crimson: "#dc143c", firebrick: "#b22222", darkred: "#8b0000",
    maroon: "#800000", indianred: "#cd5c5c", lightcoral: "#f08080",
    salmon: "#fa8072", darksalmon: "#e9967a", lightsalmon: "#ffa07a",
    tomato: "#ff6347", coral: "#ff7f50", orangered: "#ff4500",
    orange: "#ffa500", darkorange: "#ff8c00", gold: "#ffd700", yellow: "#ffff00",
    lightgoldenrodyellow: "#fafad2", goldenrod: "#daa520", darkgoldenrod: "#b8860b",
    khaki: "#f0e68c", darkkhaki: "#bdb76b", olive: "#808000", olivedrab: "#6b8e23",
    yellowgreen: "#9acd32", greenyellow: "#adff2f", chartreuse: "#7fff00",
    lime: "#00ff00", limegreen: "#32cd32", green: "#008000", forestgreen: "#228b22",
    darkgreen: "#006400", seagreen: "#2e8b57", mediumseagreen: "#3cb371",
    springgreen: "#00ff7f", mediumspringgreen: "#00fa9a", aquamarine: "#7fffd4",
    turquoise: "#40e0d0", lightseagreen: "#20b2aa", teal: "#008080",
    darkcyan: "#008b8b", cyan: "#00ffff", aqua: "#00ffff", robinsEgg: "#96ded1",
    paleturquoise: "#afeeee", lightcyan: "#e0ffff", skyblue: "#87ceeb",
    lightskyblue: "#87cefa", deepskyblue: "#00bfff", dodgerblue: "#1e90ff",
    cornflowerblue: "#6495ed", steelblue: "#4682b4", royalblue: "#4169e1",
    blue: "#0000ff", mediumblue: "#0000cd", darkblue: "#00008b", navy: "#000080",
    midnightblue: "#191970", indigo: "#4b0082", slateblue: "#6a5acd",
    mediumslateblue: "#7b68ee", mediumpurple: "#9370db", blueviolet: "#8a2be2",
    darkviolet: "#9400d3", darkorchid: "#9932cc", darkmagenta: "#8b008b",
    purple: "#800080", mediumorchid: "#ba55d3", thistle: "#d8bfd8", plum: "#dda0dd",
    violet: "#ee82ee", orchid: "#da70d6", magenta: "#ff00ff", fuchsia: "#ff00ff",
    mediumvioletred: "#c71585", deeppink: "#ff1493", hotpink: "#ff69b4",
    palevioletred: "#db7093", pink: "#ffc0cb", lightpink: "#ffb6c1",
    brown: "#a52a2a", sienna: "#a0522d", saddlebrown: "#8b4513", chocolate: "#d2691e",
    peru: "#cd853f", sandybrown: "#f4a460", burlywood: "#deb887", tan: "#d2b48c",
    rosybrown: "#bc8f8f", wheat: "#f5deb3", peachpuff: "#ffdab9", moccasin: "#ffe4b5",
    navajowhite: "#ffdead", paprika: "#8c0034", sage: "#9caf88", terracotta: "#e2725b",
    cerulean: "#007ba7", cobalt: "#0047ab", emerald: "#50c878", ruby: "#e0115f",
    sapphire: "#0f52ba", amber: "#ffbf00", burgundy: "#800020", champagne: "#f7e7ce",
    copper: "#b87333", eggplant: "#614051", honeydew: "#f0fff0",
    jade: "#00a86b", lilac: "#c8a2c8", mauve: "#e0b0ff", mustard: "#ffdb58",
    ochre: "#cc7722", pewter: "#96a8a1", rust: "#b7410e", scarlet: "#ff2400",
    taupe: "#483c32", vermillion: "#e34234", wine: "#722f37",
  };

  // Normalize a search string: lowercase, drop spaces/apostrophes/punctuation.
  function normalizeName(name) {
    return name.trim().toLowerCase().replace(/[''.\-_]/g, "").replace(/\s+/g, "");
  }

  // Pretty-print a normalized key for display (robinsEgg -> robins egg).
  function formatNameKey(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([a-z])(\d)/g, "$1 $2")
      .toLowerCase();
  }

  // Straight-line distance between two colors in RGB space. Smaller = closer.
  function rgbDistance(a, b) {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  // WCAG relative luminance — better "lightest/darkest" than HSL alone.
  function relativeLuminance(r, g, b) {
    const channel = function (c) {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  }

  function luminanceFromHex(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    return relativeLuminance(rgb.r, rgb.g, rgb.b);
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
    const label = formatNameKey(bestName);
    return bestDist < 18 ? label : "shade of " + label;
  }

  // Look up an exact named color (returns hex or null).
  function lookupName(name) {
    if (typeof name !== "string") return null;
    const key = normalizeName(name);
    return NAMED_COLORS[key] || null;
  }

  // Best partial name match (e.g. "robin" -> robinsEgg, "lavender haze" -> lavenderhaze).
  function findNamedColor(query) {
    const key = normalizeName(query);
    if (!key) return null;
    if (NAMED_COLORS[key]) return NAMED_COLORS[key];
    const names = Object.keys(NAMED_COLORS);
    const exactWord = names.find(function (n) { return normalizeName(n) === key; });
    if (exactWord) return NAMED_COLORS[exactWord];
    const contains = names.filter(function (n) { return normalizeName(n).indexOf(key) !== -1; });
    if (contains.length === 1) return NAMED_COLORS[contains[0]];
    if (contains.length > 1) {
      contains.sort(function (a, b) { return a.length - b.length; });
      return NAMED_COLORS[contains[0]];
    }
    const reverse = names.find(function (n) { return key.indexOf(normalizeName(n)) !== -1; });
    return reverse ? NAMED_COLORS[reverse] : null;
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
    findNamedColor: findNamedColor,
    normalizeName: normalizeName,
    luminanceFromHex: luminanceFromHex,
    NAMED_COLORS: NAMED_COLORS,
  };
})(window);
