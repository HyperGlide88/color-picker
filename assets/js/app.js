/*
 * app.js
 * ------
 * The brains of Color Quest. It wires the buttons/inputs in index.html to the
 * color math in colors.js, and runs three small "engines":
 *
 *   1. Explore engine  - show 6 colors, tap one, show 6 closer shades, repeat.
 *   2. Search engine    - type a name/hex, get 6 similar-but-unique colors.
 *   3. Result + palette - show the chosen color and let you save favorites.
 *
 * We use ColorKit (from colors.js) for every color calculation.
 */
(function () {
  "use strict";

  const CK = window.ColorKit;
  const EXPLORE_SWATCH_COUNT = 6;
  const MIN_SPAN = { h: 4, s: 4, l: 4 };

  /* ---- tiny DOM helpers ---- */
  const $ = function (id) { return document.getElementById(id); };

  const el = {
    mainContent: document.querySelector(".content"),
    exploreBtn: $("modeExploreBtn"),
    searchBtn: $("modeSearchBtn"),
    palettesBtn: $("modePalettesBtn"),
    explorePanel: $("explorePanel"),
    searchPanel: $("searchPanel"),
    palettesPanel: $("palettesPanel"),
    exploreGrid: $("exploreGrid"),
    searchGrid: $("searchGrid"),
    paletteCategorySelect: $("paletteCategorySelect"),
    paletteLibrary: $("paletteLibrary"),
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
    paletteFilter: "all",
    savedPalettes: [],
  };

  const SAVED_PALETTES_KEY = "colorQuestSavedPalettes";

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
      "lightest: " + hslToHex(lightest) + " · darkest: " + hslToHex(darkest);
  }

  /* ===================================================================
   * Swatch rendering (shared by both modes)
   * =================================================================== */
  function makeSwatch(hsl, onPick) {
    const hex = hsl.hex || CK.hslToHex(hsl.h, hsl.s, hsl.l);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.style.backgroundColor = hex;
    btn.setAttribute("role", "listitem");
    btn.setAttribute("aria-label", "Choose " + (hsl.name || hex));

    const tag = document.createElement("span");
    tag.className = "swatch-hex";
    tag.textContent = hex;
    btn.appendChild(tag);

    btn.addEventListener("click", function () {
      onPick({ h: hsl.h, s: hsl.s, l: hsl.l, hex: hex, name: hsl.name || null });
    });
    return btn;
  }

  function renderGrid(container, hslList, onPick, options) {
    options = options || {};
    const unique = ensureUniqueColors(hslList);
    if (options.showRange) updateExploreRangeHint(unique);
    container.innerHTML = "";
    unique.forEach(function (hsl) {
      container.appendChild(makeSwatch(hsl, onPick));
    });
  }

  /* ===================================================================
   * Explore engine — progressive narrowing
   * =================================================================== */

  // Round 0: six curated basics ordered dark → warm → cool → light.
  const STARTER_COLORS = [
    { hex: "#1a1a1a", name: "black" },
    { hex: "#c84b43", name: "red" },
    { hex: "#d4a843", name: "yellow" },
    { hex: "#3d9a6e", name: "green" },
    { hex: "#4a78c2", name: "blue" },
    { hex: "#f5f3ef", name: "white" },
  ];

  function buildFirstRound() {
    return STARTER_COLORS.map(function (starter) {
      const rgb = CK.hexToRgb(starter.hex);
      const hsl = CK.rgbToHsl(rgb.r, rgb.g, rgb.b);
      return { h: hsl.h, s: hsl.s, l: hsl.l, hex: starter.hex, name: starter.name };
    });
  }

  // After picking a hue, spread six shades across a wide lightness range.
  function buildLightnessVariants(center) {
    const minL = Math.max(0, center.l - 28);
    const maxL = Math.min(100, center.l + 28);
    let lo = minL;
    let hi = maxL;
    if (hi - lo < 32) {
      const mid = center.l;
      lo = Math.max(0, mid - 16);
      hi = Math.min(100, mid + 16);
    }
    const steps = [];
    for (let i = 0; i < EXPLORE_SWATCH_COUNT; i++) {
      const t = i / (EXPLORE_SWATCH_COUNT - 1);
      const satT = t - 0.5;
      steps.push({
        h: center.h,
        s: CK.clamp(center.s + satT * 16, 0, 100),
        l: Math.round(lo + (hi - lo) * t),
      });
    }
    return steps;
  }

  // Later rounds: six variations across current spans; keeps shifting at minimum span.
  function buildVariations(center, spans, roundIndex) {
    const atFloor =
      spans.h <= MIN_SPAN.h && spans.s <= MIN_SPAN.s && spans.l <= MIN_SPAN.l;
    const phase = (roundIndex || 0) * 2.399963;
    const list = [];
    for (let i = 0; i < EXPLORE_SWATCH_COUNT; i++) {
      const t = i / (EXPLORE_SWATCH_COUNT - 1) - 0.5;
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
      el.roundLabel.textContent = "pick the color you like most";
      renderGrid(el.exploreGrid, list, onExplorePick, exploreGridOptions());
      return;
    }
    if (state.explore.round === 1) {
      list = buildLightnessVariants(state.explore.center);
      el.roundLabel.textContent = "fine-tune the lightness — pick your favorite";
      renderGrid(el.exploreGrid, list, onExplorePick, exploreGridOptions());
      return;
    }
    list = buildVariations(state.explore.center, state.explore.spans, state.explore.round);
    el.roundLabel.textContent = "getting closer — pick your favorite shade";
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
    const result = CK.resolveColorQuery(raw);
    return result ? result.hex : null;
  }

  function buildSimilarColors(base, exactHex) {
    const similar = buildVariations(base, { h: 22, s: 26, l: 28 }, 0);
    const filtered = similar.filter(function (hsl) {
      return hslToHex(hsl).toLowerCase() !== exactHex.toLowerCase();
    });
    const unique = ensureUniqueColors(filtered);
    return unique.slice(0, EXPLORE_SWATCH_COUNT - 1);
  }

  function runSearch(raw) {
    const query = raw.trim();
    const resolved = CK.resolveColorQuery(raw);
    if (!resolved) {
      el.searchHint.textContent = "hmm, no match. try a name like \"teal\", \"lavender haze\", or a hex like \"#ff8800\".";
      el.searchGrid.innerHTML = "";
      return;
    }

    const hex = resolved.hex;
    const directRgb = CK.hexToRgb(query);
    const rgb = CK.hexToRgb(hex);
    const base = CK.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const exactName = resolved.label || CK.nearestColorName(hex);
    const exactHsl = { h: base.h, s: base.s, l: base.l, hex: hex, name: exactName };

    if (directRgb) {
      el.searchHint.textContent = "exact match for \"" + query + "\", plus similar shades:";
      const similar = buildSimilarColors(base, hex);
      renderGrid(el.searchGrid, [exactHsl].concat(similar), showResult);
      return;
    }

    el.searchHint.textContent = "colors near \"" + query + "\" — selected: " + exactName;
    const nearby = buildVariations(base, { h: 24, s: 28, l: 30 }, 0).map(function (hsl, index) {
      if (index === 0) return exactHsl;
      return hsl;
    });
    renderGrid(el.searchGrid, nearby, showResult);
  }

  /* ===================================================================
   * Palette library — 100 curated palettes
   * =================================================================== */
  function hexToColorObj(hex, name) {
    const rgb = CK.hexToRgb(hex);
    const hsl = CK.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const color = { h: hsl.h, s: hsl.s, l: hsl.l, hex: hex };
    if (name) color.name = name;
    return color;
  }

  function paletteColorEntries(palette) {
    return palette.colors.map(function (hex, index) {
      return {
        hex: hex,
        name: palette.colorNames && palette.colorNames[index] ? palette.colorNames[index] : null,
      };
    });
  }

  function formatPaletteCopy(palette) {
    if (palette.colorNames && palette.colorNames.length) {
      return palette.colors.map(function (hex, index) {
        const label = palette.colorNames[index] || hex;
        return label + " — " + hex;
      }).join("\n");
    }
    return palette.colors.join("\n");
  }

  function paletteKey(palette) {
    return palette.name + "|" + palette.colors.join(",");
  }

  function isPaletteSaved(palette) {
    const key = paletteKey(palette);
    return state.savedPalettes.some(function (item) {
      return paletteKey(item) === key;
    });
  }

  function loadSavedPalettes() {
    try {
      let raw = null;
      try { raw = localStorage.getItem(SAVED_PALETTES_KEY); } catch (e1) { /* file:// or private mode */ }
      if (!raw) {
        try { raw = sessionStorage.getItem(SAVED_PALETTES_KEY); } catch (e2) { /* ignore */ }
      }
      state.savedPalettes = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(state.savedPalettes)) state.savedPalettes = [];
    } catch (e) {
      state.savedPalettes = [];
    }
  }

  function persistSavedPalettes() {
    const payload = JSON.stringify(state.savedPalettes);
    let stored = false;
    try {
      localStorage.setItem(SAVED_PALETTES_KEY, payload);
      stored = true;
    } catch (e1) { /* ignore */ }
    try {
      sessionStorage.setItem(SAVED_PALETTES_KEY, payload);
      stored = true;
    } catch (e2) { /* ignore */ }
    return stored;
  }

  function setPaletteFilter(category) {
    state.paletteFilter = category;
    if (el.paletteCategorySelect) el.paletteCategorySelect.value = category;
    renderPaletteCategorySelect();
    renderPaletteLibrary();
  }

  function savePalette(palette) {
    if (isPaletteSaved(palette)) {
      toast("already saved");
      setPaletteFilter("my saved");
      return;
    }
    state.savedPalettes.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: palette.name,
      use: palette.use,
      colors: palette.colors.slice(),
      colorNames: palette.colorNames ? palette.colorNames.slice() : null,
    });
    persistSavedPalettes();
    setPaletteFilter("my saved");
    toast("saved " + palette.name);
  }

  function removeSavedPalette(id) {
    state.savedPalettes = state.savedPalettes.filter(function (item) {
      return item.id !== id;
    });
    persistSavedPalettes();
    renderPaletteCategorySelect();
    renderPaletteLibrary();
    toast("removed from saved");
  }

  function renderPaletteCategorySelect() {
    if (!el.paletteCategorySelect || !window.PaletteLibrary) return;
    const current = state.paletteFilter;
    el.paletteCategorySelect.innerHTML = "";
    window.PaletteLibrary.categories.forEach(function (category) {
      const option = document.createElement("option");
      option.value = category;
      if (category === "my saved") {
        option.textContent = "my saved (" + state.savedPalettes.length + ")";
      } else {
        option.textContent = category;
      }
      if (category === current) option.selected = true;
      el.paletteCategorySelect.appendChild(option);
    });
    el.paletteCategorySelect.value = current;
  }

  function buildPaletteCard(palette, options) {
    options = options || {};
    const card = document.createElement("article");
    card.className = "palette-card";
    if (palette.colorNames && palette.colorNames.length) {
      card.classList.add("palette-card--named");
    }
    if (palette.use === "minecraft") {
      card.classList.add("palette-card--minecraft");
    }
    card.setAttribute("role", "listitem");

    const head = document.createElement("div");
    head.className = "palette-card-head";

    const meta = document.createElement("div");
    const name = document.createElement("h3");
    name.className = "palette-card-name";
    name.textContent = palette.name;
    const use = document.createElement("p");
    use.className = "palette-card-use";
    use.textContent = palette.use;
    meta.appendChild(name);
    meta.appendChild(use);

    const actions = document.createElement("div");
    actions.className = "palette-card-actions";

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "palette-card-copy";
    copyBtn.textContent = "copy";
    copyBtn.addEventListener("click", function () {
      copyText(formatPaletteCopy(palette)).then(function () {
        toast("copied " + palette.name);
      });
    });

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "palette-card-save";
    if (options.savedView) {
      saveBtn.textContent = "remove";
      saveBtn.addEventListener("click", function () {
        removeSavedPalette(palette.id);
      });
    } else {
      const saved = isPaletteSaved(palette);
      saveBtn.textContent = saved ? "saved" : "save";
      if (saved) saveBtn.classList.add("is-saved");
      saveBtn.addEventListener("click", function () {
        if (isPaletteSaved(palette)) {
          let match = null;
          state.savedPalettes.forEach(function (item) {
            if (paletteKey(item) === paletteKey(palette)) match = item;
          });
          if (match) removeSavedPalette(match.id);
          else toast("already saved");
        } else {
          savePalette(palette);
        }
      });
    }

    actions.appendChild(copyBtn);
    actions.appendChild(saveBtn);
    head.appendChild(meta);
    head.appendChild(actions);

    const colors = document.createElement("div");
    colors.className = "palette-card-colors";
    paletteColorEntries(palette).forEach(function (entry) {
      const wrap = document.createElement("div");
      wrap.className = "palette-color-wrap";

      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "palette-color";
      swatch.style.backgroundColor = entry.hex;
      swatch.title = entry.name ? entry.name + " — " + entry.hex : entry.hex;
      swatch.setAttribute(
        "aria-label",
        "choose " + (entry.name ? entry.name + " (" + entry.hex + ")" : entry.hex) + " from " + palette.name
      );
      swatch.addEventListener("click", function () {
        showResult(hexToColorObj(entry.hex, entry.name));
      });
      wrap.appendChild(swatch);

      if (entry.name) {
        const label = document.createElement("span");
        label.className = "palette-color-name";
        label.textContent = entry.name;
        wrap.appendChild(label);

        const hexLabel = document.createElement("span");
        hexLabel.className = "palette-color-hex";
        hexLabel.textContent = entry.hex.toLowerCase();
        wrap.appendChild(hexLabel);
      }

      colors.appendChild(wrap);
    });

    card.appendChild(head);
    card.appendChild(colors);
    return card;
  }

  function renderPaletteLibrary() {
    if (!el.paletteLibrary || !window.PaletteLibrary) return;
    let list;
    if (state.paletteFilter === "my saved") {
      list = state.savedPalettes.slice();
    } else {
      list = window.PaletteLibrary.palettes.filter(function (palette) {
        return state.paletteFilter === "all" || palette.use === state.paletteFilter;
      });
    }
    el.paletteLibrary.innerHTML = "";
    if (list.length === 0) {
      const empty = document.createElement("p");
      empty.className = "palette-library-empty";
      empty.textContent = state.paletteFilter === "my saved"
        ? "no saved palettes yet — browse a category and tap save on any palette you like."
        : "no palettes in this category yet.";
      el.paletteLibrary.appendChild(empty);
      return;
    }
    list.forEach(function (palette) {
      el.paletteLibrary.appendChild(buildPaletteCard(palette, {
        savedView: state.paletteFilter === "my saved",
      }));
    });
  }

  /* ===================================================================
   * Result panel
   * =================================================================== */
  function showResult(color) {
    const hex = color.hex || CK.hslToHex(color.h, color.s, color.l);
    state.current = { h: color.h, s: color.s, l: color.l, hex: hex };
    el.resultSwatch.style.backgroundColor = hex;
    el.resultName.textContent = color.name || CK.nearestColorName(hex);
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
      toast("pick a color first!");
      return;
    }
    if (state.palette.indexOf(state.current.hex) !== -1) {
      toast("already in your palette");
      return;
    }
    state.palette.push(state.current.hex);
    renderPalette();
    toast("saved to palette");
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
    const isSearch = mode === "search";
    const isPalettes = mode === "palettes";
    el.explorePanel.classList.toggle("is-hidden", !isExplore);
    el.searchPanel.classList.toggle("is-hidden", !isSearch);
    el.palettesPanel.classList.toggle("is-hidden", !isPalettes);
    if (el.mainContent) {
      el.mainContent.classList.toggle("content--wide", isPalettes);
    }
    el.exploreBtn.classList.toggle("is-active", isExplore);
    el.searchBtn.classList.toggle("is-active", isSearch);
    el.palettesBtn.classList.toggle("is-active", isPalettes);
    el.exploreBtn.setAttribute("aria-pressed", String(isExplore));
    el.searchBtn.setAttribute("aria-pressed", String(isSearch));
    el.palettesBtn.setAttribute("aria-pressed", String(isPalettes));
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
    el.palettesBtn.addEventListener("click", function () { setMode("palettes"); });

    if (el.paletteCategorySelect) {
      el.paletteCategorySelect.addEventListener("change", function () {
        setPaletteFilter(el.paletteCategorySelect.value);
      });
    }

    el.restartBtn.addEventListener("click", restartExplore);
    el.foundBtn.addEventListener("click", function () {
      if (!state.current) { toast("pick a color first!"); return; }
      el.resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    el.searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      runSearch(el.searchInput.value);
    });

    el.copyBtn.addEventListener("click", function () {
      if (!state.current) { toast("pick a color first!"); return; }
      copyText(state.current.hex).then(function () {
        toast("copied " + state.current.hex);
      });
    });

    el.saveBtn.addEventListener("click", saveCurrentToPalette);

    el.copyPaletteBtn.addEventListener("click", function () {
      if (state.palette.length === 0) { toast("palette is empty"); return; }
      copyText(state.palette.join("\n")).then(function () {
        toast("copied " + state.palette.length + " colors");
      });
    });

    el.clearPaletteBtn.addEventListener("click", function () {
      if (state.palette.length === 0) return;
      state.palette = [];
      renderPalette();
      toast("palette cleared");
    });

    loadLastUpdated();
    loadSavedPalettes();
    renderExploreRound();
    renderPalette();
    renderPaletteCategorySelect();
    renderPaletteLibrary();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
