/*
 * app.js
 * ------
 * The brains of Color Quest. It wires the buttons/inputs in index.html to the
 * color math in colors.js, and runs three small "engines":
 *
 *   1. Explore engine  - show 5 colors, tap one, show 5 closer shades, repeat.
 *   2. Search engine    - type a name/hex, get 5 similar-but-unique colors.
 *   3. Result + palette - show the chosen color and let you save favorites.
 *
 * We use ColorKit (from colors.js) for every color calculation.
 */
(function () {
  "use strict";

  const CK = window.ColorKit;
  const SWATCH_COUNT = 5;
  const MIN_SPAN = { h: 4, s: 4, l: 4 };

  /* ---- tiny DOM helpers ---- */
  const $ = function (id) { return document.getElementById(id); };

  const el = {
    exploreBtn: $("modeExploreBtn"),
    searchBtn: $("modeSearchBtn"),
    explorePanel: $("explorePanel"),
    searchPanel: $("searchPanel"),
    exploreGrid: $("exploreGrid"),
    searchGrid: $("searchGrid"),
    roundLabel: $("roundLabel"),
    exploreRangeHint: $("exploreRangeHint"),
    foundBtn: $("foundBtn"),
    restartBtn: $("restartBtn"),
    searchForm: $("searchForm"),
    searchInput: $("searchInput"),
    searchHint: $("searchHint"),
    resultPanel: $("resultPanel"),
    resultSwatch: $("resultSwatch"),
    resultName: $("resultName"),
    resultHex: $("resultHex"),
    copyBtn: $("copyBtn"),
    saveBtn: $("saveBtn"),
    palettePanel: $("palettePanel"),
    paletteStrip: $("paletteStrip"),
    paletteEmpty: $("paletteEmpty"),
    copyPaletteBtn: $("copyPaletteBtn"),
    clearPaletteBtn: $("clearPaletteBtn"),
    toast: $("toast"),
    lastUpdated: $("lastUpdated"),
  };

  /* ---- app state ---- */
  const state = {
    current: null,            // {h, s, l, hex} the last color the user chose
    explore: { round: 0, center: null, spans: null },
    palette: [],              // array of hex strings
  };

  /* ===================================================================
   * Color list helpers — unique swatches every round
   * =================================================================== */
  function hslToHex(hsl) {
    return hsl.hex || CK.hslToHex(hsl.h, hsl.s, hsl.l);
  }

  function ensureUniqueColors(hslList) {
    const seen = new Set();
    const result = [];
    hslList.forEach(function (hsl, index) {
      let h = hsl.h;
      let s = hsl.s;
      let l = hsl.l;
      let hex = CK.hslToHex(h, s, l);
      let nudge = 0;
      while (seen.has(hex) && nudge < 120) {
        nudge += 1;
        h = CK.wrapHue(h + nudge * 1.7);
        s = CK.clamp(s + (nudge % 4) - 2, 0, 100);
        l = CK.clamp(l + ((nudge + index) % 5) - 2, 0, 100);
        hex = CK.hslToHex(h, s, l);
      }
      seen.add(hex);
      result.push({ h: h, s: s, l: l, hex: hex });
    });
    return result;
  }

  function updateExploreRangeHint(hslList) {
    if (!el.exploreRangeHint || hslList.length === 0) {
      if (el.exploreRangeHint) el.exploreRangeHint.textContent = "";
      return;
    }
    let lightest = hslList[0];
    let darkest = hslList[0];
    let maxLum = -1;
    let minLum = Infinity;
    hslList.forEach(function (hsl) {
      const hex = hslToHex(hsl);
      const lum = CK.luminanceFromHex(hex);
      if (lum > maxLum) {
        maxLum = lum;
        lightest = hsl;
      }
      if (lum < minLum) {
        minLum = lum;
        darkest = hsl;
      }
    });
    el.exploreRangeHint.textContent =
      "Lightest: " + hslToHex(lightest) + " · Darkest: " + hslToHex(darkest);
  }

  /* ===================================================================
   * Swatch rendering (shared by both modes)
   * =================================================================== */
  function makeSwatch(hsl, onPick) {
    const hex = CK.hslToHex(hsl.h, hsl.s, hsl.l);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.style.backgroundColor = hex;
    btn.setAttribute("role", "listitem");
    btn.setAttribute("aria-label", "Choose " + hex);

    const tag = document.createElement("span");
    tag.className = "swatch-hex";
    tag.textContent = hex;
    btn.appendChild(tag);

    btn.addEventListener("click", function () {
      onPick({ h: hsl.h, s: hsl.s, l: hsl.l, hex: hex });
    });
    return btn;
  }

  function renderGrid(container, hslList, onPick, options) {
    options = options || {};
    const unique = ensureUniqueColors(hslList);
    container.classList.toggle("swatch-grid--initial", !!options.initial);
    if (options.showRange) updateExploreRangeHint(unique);
    container.innerHTML = "";
    unique.forEach(function (hsl) {
      container.appendChild(makeSwatch(hsl, onPick));
    });
  }

  /* ===================================================================
   * Explore engine — progressive narrowing
   * =================================================================== */

  // Round 1: five clearly different hues, plus a neutral slot for black/white/gray.
  function buildFirstRound() {
    const offset = Math.floor(Math.random() * 360);
    const neutrals = [
      { h: 0, s: 0, l: 0 },
      { h: 0, s: 0, l: 100 },
      { h: 0, s: 0, l: 50 },
      { h: 0, s: 0, l: 85 },
      { h: 0, s: 0, l: 15 },
    ];
    const neutral = neutrals[Math.floor(Math.random() * neutrals.length)];
    const list = [neutral];
    for (let i = 1; i < SWATCH_COUNT; i++) {
      list.push({ h: CK.wrapHue(offset + (i - 1) * (360 / (SWATCH_COUNT - 1))), s: 72, l: 56 });
    }
    return list;
  }

  // After picking a hue, offer five lightness steps at ±3% intervals.
  function buildLightnessVariants(center) {
    const offsets = [-6, -3, 0, 3, 6];
    return offsets.map(function (delta) {
      return {
        h: center.h,
        s: center.s,
        l: CK.clamp(center.l + delta, 18, 92),
      };
    });
  }

  // Later rounds: five variations across current spans; keeps shifting at minimum span.
  function buildVariations(center, spans, roundIndex) {
    const atFloor =
      spans.h <= MIN_SPAN.h && spans.s <= MIN_SPAN.s && spans.l <= MIN_SPAN.l;
    const phase = (roundIndex || 0) * 2.399963;
    const list = [];
    for (let i = 0; i < SWATCH_COUNT; i++) {
      const t = i / (SWATCH_COUNT - 1) - 0.5;
      let hOff = t * spans.h;
      let sOff = t * spans.s;
      let lOff = -t * spans.l;
      if (atFloor) {
        hOff += Math.sin((i + phase) * 1.7) * MIN_SPAN.h * 1.4;
        sOff += Math.cos((i + phase) * 1.3) * MIN_SPAN.s * 1.4;
        lOff += Math.sin((i + phase) * 2.1) * MIN_SPAN.l * 1.4;
      }
      list.push({
        h: CK.wrapHue(center.h + hOff),
        s: CK.clamp(center.s + sOff, 0, 100),
        l: CK.clamp(center.l + lOff, 0, 100),
      });
    }
    return list;
  }

  function exploreGridOptions(extra) {
    return Object.assign({ showRange: true }, extra || {});
  }

  function renderExploreRound() {
    let list;
    if (state.explore.round === 0) {
      list = buildFirstRound();
      el.roundLabel.textContent = "Pick the color you like most";
      renderGrid(el.exploreGrid, list, onExplorePick, exploreGridOptions({ initial: true }));
      return;
    }
    if (state.explore.round === 1) {
      list = buildLightnessVariants(state.explore.center);
      el.roundLabel.textContent = "Fine-tune the lightness — pick your favorite";
      renderGrid(el.exploreGrid, list, onExplorePick, exploreGridOptions());
      return;
    }
    list = buildVariations(state.explore.center, state.explore.spans, state.explore.round);
    el.roundLabel.textContent = "Getting closer — pick your favorite shade";
    renderGrid(el.exploreGrid, list, onExplorePick, exploreGridOptions());
  }

  function onExplorePick(color) {
    showResult(color);

    if (state.explore.round === 0) {
      state.explore.center = { h: color.h, s: color.s, l: color.l };
      state.explore.round = 1;
      renderExploreRound();
      return;
    }

    if (state.explore.round === 1) {
      state.explore.spans = { h: 40, s: 36, l: 42 };
      state.explore.center = { h: color.h, s: color.s, l: color.l };
      state.explore.round = 2;
      renderExploreRound();
      return;
    }

    // Re-center the search on the chosen color and tighten the ranges so the
    // next round shows shades that are closer together (with a floor so it
    // never stalls on one repeated color).
    state.explore.spans = {
      h: Math.max(MIN_SPAN.h, state.explore.spans.h * 0.55),
      s: Math.max(MIN_SPAN.s, state.explore.spans.s * 0.55),
      l: Math.max(MIN_SPAN.l, state.explore.spans.l * 0.55),
    };
    state.explore.center = { h: color.h, s: color.s, l: color.l };
    state.explore.round += 1;
    renderExploreRound();
  }

  function restartExplore() {
    state.explore = { round: 0, center: null, spans: null };
    if (el.exploreRangeHint) el.exploreRangeHint.textContent = "";
    renderExploreRound();
  }

  /* ===================================================================
   * Search engine
   * =================================================================== */
  function resolveQuery(raw) {
    const query = raw.trim();
    if (!query) return null;

    const asRgb = CK.hexToRgb(query);
    if (asRgb) return CK.rgbToHex(asRgb.r, asRgb.g, asRgb.b);

    const exact = CK.lookupName(query);
    if (exact) return exact;

    return CK.findNamedColor(query);
  }

  function buildSimilarColors(base, exactHex) {
    const similar = buildVariations(base, { h: 22, s: 26, l: 28 }, 0);
    const filtered = similar.filter(function (hsl) {
      return hslToHex(hsl).toLowerCase() !== exactHex.toLowerCase();
    });
    const unique = ensureUniqueColors(filtered);
    return unique.slice(0, SWATCH_COUNT - 1);
  }

  function runSearch(raw) {
    const query = raw.trim();
    const directRgb = CK.hexToRgb(query);
    const hex = resolveQuery(raw);
    if (!hex) {
      el.searchHint.textContent = "Hmm, no match. Try a name like \"teal\", \"lavender haze\", or a hex like \"#ff8800\".";
      el.searchGrid.innerHTML = "";
      return;
    }

    const rgb = CK.hexToRgb(hex);
    const base = CK.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const exactHsl = { h: base.h, s: base.s, l: base.l, hex: hex };

    if (directRgb) {
      el.searchHint.textContent = "Exact match for \"" + query + "\", plus similar shades:";
      const similar = buildSimilarColors(base, hex);
      renderGrid(el.searchGrid, [exactHsl].concat(similar), showResult);
      return;
    }

    el.searchHint.textContent = "Here are 5 colors near \"" + query + "\":";
    renderGrid(el.searchGrid, buildVariations(base, { h: 24, s: 28, l: 30 }, 0), showResult);
  }

  /* ===================================================================
   * Result panel
   * =================================================================== */
  function showResult(color) {
    const hex = color.hex || CK.hslToHex(color.h, color.s, color.l);
    state.current = { h: color.h, s: color.s, l: color.l, hex: hex };
    el.resultSwatch.style.backgroundColor = hex;
    el.resultName.textContent = CK.nearestColorName(hex);
    el.resultHex.textContent = hex;
    el.resultPanel.classList.remove("is-hidden");
  }

  /* ===================================================================
   * Palette
   * =================================================================== */
  function renderPalette() {
    el.paletteStrip.innerHTML = "";
    if (state.palette.length === 0) {
      el.paletteStrip.appendChild(el.paletteEmpty);
      el.paletteEmpty.classList.remove("is-hidden");
      return;
    }
    el.paletteEmpty.classList.add("is-hidden");
    state.palette.forEach(function (hex, index) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "palette-chip";
      chip.style.backgroundColor = hex;
      chip.title = hex + " — click to remove";
      chip.setAttribute("aria-label", "Remove " + hex);
      chip.addEventListener("click", function () {
        state.palette.splice(index, 1);
        renderPalette();
      });
      el.paletteStrip.appendChild(chip);
    });
  }

  function saveCurrentToPalette() {
    if (!state.current) {
      toast("Pick a color first!");
      return;
    }
    if (state.palette.indexOf(state.current.hex) !== -1) {
      toast("Already in your palette");
      return;
    }
    state.palette.push(state.current.hex);
    renderPalette();
    toast("Saved to palette");
  }

  /* ===================================================================
   * Clipboard + toast
   * =================================================================== */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers / non-secure contexts.
    return new Promise(function (resolve) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
      resolve();
    });
  }

  let toastTimer = null;
  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.toast.classList.remove("is-visible");
    }, 1600);
  }

  /* ===================================================================
   * Mode switching
   * =================================================================== */
  function setMode(mode) {
    const isExplore = mode === "explore";
    el.explorePanel.classList.toggle("is-hidden", !isExplore);
    el.searchPanel.classList.toggle("is-hidden", isExplore);
    el.exploreBtn.classList.toggle("is-active", isExplore);
    el.searchBtn.classList.toggle("is-active", !isExplore);
    el.exploreBtn.setAttribute("aria-pressed", String(isExplore));
    el.searchBtn.setAttribute("aria-pressed", String(!isExplore));
  }

  /* ===================================================================
   * Footer — last updated from latest commit
   * =================================================================== */
  function formatLastUpdated(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function setLastUpdated(iso) {
    const label = formatLastUpdated(iso);
    if (!label || !el.lastUpdated) return;
    el.lastUpdated.dateTime = iso;
    el.lastUpdated.textContent = label;
  }

  function loadLastUpdated() {
    const fallback = window.SiteMeta && window.SiteMeta.lastUpdated;
    if (fallback) setLastUpdated(fallback);

    fetch("https://api.github.com/repos/HyperGlide88/color-picker/commits?per_page=1")
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API unavailable");
        return res.json();
      })
      .then(function (commits) {
        const iso = commits[0] && commits[0].commit && commits[0].commit.committer.date;
        if (iso) setLastUpdated(iso);
      })
      .catch(function () { /* keep baked-in fallback */ });
  }

  /* ===================================================================
   * Wire everything up
   * =================================================================== */
  function init() {
    el.exploreBtn.addEventListener("click", function () { setMode("explore"); });
    el.searchBtn.addEventListener("click", function () { setMode("search"); });

    el.restartBtn.addEventListener("click", restartExplore);
    el.foundBtn.addEventListener("click", function () {
      if (!state.current) { toast("Pick a color first!"); return; }
      el.resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    el.searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      runSearch(el.searchInput.value);
    });

    el.copyBtn.addEventListener("click", function () {
      if (!state.current) { toast("Pick a color first!"); return; }
      copyText(state.current.hex).then(function () {
        toast("Copied " + state.current.hex);
      });
    });

    el.saveBtn.addEventListener("click", saveCurrentToPalette);

    el.copyPaletteBtn.addEventListener("click", function () {
      if (state.palette.length === 0) { toast("Palette is empty"); return; }
      copyText(state.palette.join("\n")).then(function () {
        toast("Copied " + state.palette.length + " colors");
      });
    });

    el.clearPaletteBtn.addEventListener("click", function () {
      if (state.palette.length === 0) return;
      state.palette = [];
      renderPalette();
      toast("Palette cleared");
    });

    loadLastUpdated();
    renderExploreRound();
    renderPalette();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
