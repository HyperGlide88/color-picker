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
    container.classList.toggle("swatch-grid--initial", !!options.initial);
    container.innerHTML = "";
    hslList.forEach(function (hsl) {
      container.appendChild(makeSwatch(hsl, onPick));
    });
  }

  /* ===================================================================
   * Explore engine — progressive narrowing
   * =================================================================== */

  // Round 1: five clearly different hues spread around the color wheel.
  function buildFirstRound() {
    const offset = Math.floor(Math.random() * 360);
    const list = [];
    for (let i = 0; i < SWATCH_COUNT; i++) {
      list.push({ h: CK.wrapHue(offset + i * (360 / SWATCH_COUNT)), s: 72, l: 56 });
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

  // Later rounds: five variations sampled across the current search ranges,
  // centered on the color the user just picked.
  function buildVariations(center, spans) {
    const list = [];
    for (let i = 0; i < SWATCH_COUNT; i++) {
      const t = i / (SWATCH_COUNT - 1) - 0.5; // -0.5 .. +0.5
      list.push({
        h: CK.wrapHue(center.h + t * spans.h),
        s: CK.clamp(center.s + t * spans.s, 25, 95),
        l: CK.clamp(center.l - t * spans.l, 18, 92),
      });
    }
    return list;
  }

  function renderExploreRound() {
    let list;
    if (state.explore.round === 0) {
      list = buildFirstRound();
      el.roundLabel.textContent = "Pick the color you like most";
      renderGrid(el.exploreGrid, list, onExplorePick, { initial: true });
      return;
    }
    if (state.explore.round === 1) {
      list = buildLightnessVariants(state.explore.center);
      el.roundLabel.textContent = "Fine-tune the lightness — pick your favorite";
      renderGrid(el.exploreGrid, list, onExplorePick);
      return;
    }
    list = buildVariations(state.explore.center, state.explore.spans);
    el.roundLabel.textContent = "Getting closer — pick your favorite shade";
    renderGrid(el.exploreGrid, list, onExplorePick);
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
    // next round shows shades that are closer together.
    state.explore.spans = {
      h: state.explore.spans.h * 0.55,
      s: state.explore.spans.s * 0.55,
      l: state.explore.spans.l * 0.55,
    };
    state.explore.center = { h: color.h, s: color.s, l: color.l };
    state.explore.round += 1;
    renderExploreRound();
  }

  function restartExplore() {
    state.explore = { round: 0, center: null, spans: null };
    renderExploreRound();
  }

  /* ===================================================================
   * Search engine
   * =================================================================== */
  function resolveQuery(raw) {
    const query = raw.trim();
    if (!query) return null;

    // 1) Direct hex?
    const asRgb = CK.hexToRgb(query);
    if (asRgb) return CK.rgbToHex(asRgb.r, asRgb.g, asRgb.b);

    // 2) Exact named color?
    const exact = CK.lookupName(query);
    if (exact) return exact;

    // 3) Partial name match (e.g. "sky" -> "skyblue").
    const key = query.toLowerCase().replace(/\s+/g, "");
    const names = Object.keys(CK.NAMED_COLORS);
    const hit = names.find(function (n) { return n.indexOf(key) !== -1; });
    return hit ? CK.NAMED_COLORS[hit] : null;
  }

  function runSearch(raw) {
    const hex = resolveQuery(raw);
    if (!hex) {
      el.searchHint.textContent = "Hmm, no match. Try a name like \"teal\" or a hex like \"#ff8800\".";
      el.searchGrid.innerHTML = "";
      return;
    }
    el.searchHint.textContent = "Here are 5 colors near \"" + raw.trim() + "\":";

    const rgb = CK.hexToRgb(hex);
    const base = CK.rgbToHsl(rgb.r, rgb.g, rgb.b);
    // Moderate spread so the 5 options are clearly related but each unique.
    const list = buildVariations(base, { h: 24, s: 28, l: 30 });
    renderGrid(el.searchGrid, list, showResult);
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
