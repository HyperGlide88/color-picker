/*
 * palettes.js
 * -----------
 * 100 curated color palettes for different uses. Each palette has 4–5 colors
 * chosen to work together harmoniously.
 */
(function (global) {
  "use strict";

  const PALETTES = [
    /* web & ui */
    { name: "clean slate", use: "web & ui", colors: ["#f8f9fa", "#dee2e6", "#495057", "#212529", "#0d6efd"] },
    { name: "soft dashboard", use: "web & ui", colors: ["#efeee8", "#d4d2c8", "#383838", "#6b8cae", "#c87f56"] },
    { name: "midnight admin", use: "web & ui", colors: ["#1a1d23", "#2d3340", "#4a5568", "#90cdf4", "#f7fafc"] },
    { name: "mint interface", use: "web & ui", colors: ["#f0fdf4", "#bbf7d0", "#4ade80", "#166534", "#14532d"] },
    { name: "warm app shell", use: "web & ui", colors: ["#faf6f1", "#e8ddd0", "#8b7355", "#4a3f35", "#d4845a"] },
    { name: "cool productivity", use: "web & ui", colors: ["#f0f4f8", "#cbd5e1", "#64748b", "#334155", "#3b82f6"] },
    { name: "accessible contrast", use: "web & ui", colors: ["#ffffff", "#f1f3f5", "#343a40", "#1864ab", "#e67700"] },
    { name: "glass ui", use: "web & ui", colors: ["#e8eef4", "#b8c9d9", "#5b7f9a", "#2c4a62", "#7eb8da"] },
    { name: "neutral saas", use: "web & ui", colors: ["#fafafa", "#e5e5e5", "#737373", "#262626", "#6366f1"] },
    { name: "playful startup", use: "web & ui", colors: ["#fff7ed", "#fed7aa", "#fb923c", "#7c2d12", "#4f46e5"] },

    /* branding & logos */
    { name: "heritage mark", use: "branding", colors: ["#f5f0e6", "#8b6914", "#5c4033", "#2c1810", "#c9a227"] },
    { name: "modern minimal", use: "branding", colors: ["#ffffff", "#f5f5f5", "#383838", "#111111", "#e63946"] },
    { name: "eco brand", use: "branding", colors: ["#f0f7f4", "#a8d5ba", "#2d6a4f", "#1b4332", "#95d5b2"] },
    { name: "luxury house", use: "branding", colors: ["#faf8f5", "#d4c5b0", "#8b7355", "#3d3229", "#b8860b"] },
    { name: "tech forward", use: "branding", colors: ["#0f172a", "#1e293b", "#38bdf8", "#f8fafc", "#818cf8"] },
    { name: "artisan craft", use: "branding", colors: ["#f7f3ee", "#c4a882", "#8b6914", "#4a3728", "#d2691e"] },
    { name: "bold identity", use: "branding", colors: ["#fff1f2", "#fb7185", "#e11d48", "#881337", "#1e1b4b"] },
    { name: "calm wellness", use: "branding", colors: ["#f5f3ff", "#c4b5fd", "#7c3aed", "#4c1d95", "#ddd6fe"] },
    { name: "coastal brand", use: "branding", colors: ["#f0f9ff", "#7dd3fc", "#0284c7", "#0c4a6e", "#fbbf24"] },
    { name: "urban street", use: "branding", colors: ["#fafafa", "#a3a3a3", "#525252", "#171717", "#facc15"] },

    /* interior design */
    { name: "scandinavian living", use: "interior", colors: ["#f9f7f4", "#e8e4de", "#b8b2a7", "#6b6560", "#4a7c59"] },
    { name: "moody library", use: "interior", colors: ["#2c2416", "#4a3f2f", "#8b7355", "#c4a882", "#f5f0e6"] },
    { name: "sunlit kitchen", use: "interior", colors: ["#fffef9", "#f5e6c8", "#e8c49a", "#c9956c", "#8b6914"] },
    { name: "serene bedroom", use: "interior", colors: ["#f8f6f4", "#e8e0d8", "#c9b8a8", "#8b7d6b", "#5c4f42"] },
    { name: "terracotta hearth", use: "interior", colors: ["#faf6f2", "#e8c4b0", "#c4785a", "#8b4513", "#4a2c1a"] },
    { name: "coastal cottage", use: "interior", colors: ["#f5fafa", "#b8d4d4", "#6b9b9b", "#3d6b6b", "#f5e6c8"] },
    { name: "industrial loft", use: "interior", colors: ["#3d3d3d", "#6b6b6b", "#a8a8a8", "#d4d4d4", "#c87f56"] },
    { name: "botanical retreat", use: "interior", colors: ["#f2f7f2", "#c5d9c5", "#6b8f6b", "#3d5c3d", "#8b6914"] },
    { name: "art deco salon", use: "interior", colors: ["#1a1a2e", "#16213e", "#c9a227", "#f5e6c8", "#e8d5b7"] },
    { name: "warm minimal", use: "interior", colors: ["#efeee8", "#d4d0c4", "#a8a296", "#6b675e", "#383838"] },

    /* fashion & beauty */
    { name: "nude elegance", use: "fashion", colors: ["#faf6f2", "#e8d5c4", "#c4a882", "#8b6914", "#4a3728"] },
    { name: "runway noir", use: "fashion", colors: ["#0a0a0a", "#2d2d2d", "#525252", "#a3a3a3", "#dc2626"] },
    { name: "spring collection", use: "fashion", colors: ["#fef3f2", "#fecdd3", "#f9a8d4", "#be185d", "#831843"] },
    { name: "earth tones", use: "fashion", colors: ["#f5f0e8", "#c4a882", "#8b6914", "#5c4033", "#3d2914"] },
    { name: "cool couture", use: "fashion", colors: ["#f8fafc", "#94a3b8", "#475569", "#1e293b", "#cbd5e1"] },
    { name: "berry glam", use: "fashion", colors: ["#fdf2f8", "#f0abfc", "#a21caf", "#701a75", "#1e1b4b"] },
    { name: "desert rose", use: "fashion", colors: ["#faf5f0", "#e8b4a0", "#c4785a", "#8b4513", "#4a2c1a"] },
    { name: "monochrome chic", use: "fashion", colors: ["#ffffff", "#e5e5e5", "#a3a3a3", "#525252", "#171717"] },
    { name: "ocean breeze", use: "fashion", colors: ["#f0fdfa", "#99f6e4", "#14b8a6", "#0f766e", "#134e4a"] },
    { name: "golden hour", use: "fashion", colors: ["#fffbeb", "#fde68a", "#f59e0b", "#b45309", "#78350f"] },

    /* nature & outdoor */
    { name: "forest floor", use: "nature", colors: ["#f5f0e8", "#8fbc8f", "#2d5016", "#1a3009", "#5c4033"] },
    { name: "mountain dawn", use: "nature", colors: ["#fef3c7", "#fcd34d", "#78716c", "#44403c", "#7c3aed"] },
    { name: "ocean depth", use: "ocean & beach", colors: ["#e0f2fe", "#38bdf8", "#0369a1", "#0c4a6e", "#164e63"] },
    { name: "meadow bloom", use: "nature", colors: ["#f0fdf4", "#86efac", "#22c55e", "#15803d", "#fef08a"] },
    { name: "autumn trail", use: "nature", colors: ["#fef3c7", "#fb923c", "#c2410c", "#7c2d12", "#422006"] },
    { name: "desert sunset", use: "sunset", colors: ["#fef3c7", "#f97316", "#c2410c", "#7c2d12", "#581c87"] },
    { name: "arctic light", use: "sky", colors: ["#f0f9ff", "#bae6fd", "#0ea5e9", "#0369a1", "#f8fafc"] },
    { name: "rainforest", use: "nature", colors: ["#ecfdf5", "#6ee7b7", "#059669", "#064e3b", "#854d0e"] },
    { name: "lavender field", use: "nature", colors: ["#faf5ff", "#d8b4fe", "#9333ea", "#581c87", "#4ade80"] },
    { name: "river stone", use: "nature", colors: ["#f5f5f4", "#a8a29e", "#78716c", "#57534e", "#44403c"] },

    /* food & cafe */
    { name: "espresso bar", use: "coffee", colors: ["#faf6f1", "#d4a882", "#6b4423", "#3d2914", "#c87f56"] },
    { name: "fresh bakery", use: "food", colors: ["#fffbeb", "#fde68a", "#d97706", "#92400e", "#fef3c7"] },
    { name: "farm to table", use: "food", colors: ["#f0fdf4", "#86efac", "#166534", "#422006", "#fef08a"] },
    { name: "wine & dine", use: "drinks", colors: ["#faf5f5", "#d4a5a5", "#7f1d1d", "#450a0a", "#c9a227"] },
    { name: "citrus kitchen", use: "food", colors: ["#fff7ed", "#fdba74", "#ea580c", "#9a3412", "#84cc16"] },
    { name: "sushi counter", use: "food", colors: ["#fafafa", "#fca5a5", "#dc2626", "#1c1917", "#2dd4bf"] },
    { name: "ice cream parlor", use: "food", colors: ["#fdf2f8", "#f9a8d4", "#ec4899", "#a855f7", "#fef08a"] },
    { name: "rustic bistro", use: "food", colors: ["#f5f0e8", "#c4a882", "#8b4513", "#4a2c1a", "#2d5016"] },
    { name: "matcha lounge", use: "coffee", colors: ["#f0fdf4", "#bbf7d0", "#4ade80", "#166534", "#fef9c3"] },
    { name: "midnight diner", use: "food", colors: ["#1c1917", "#44403c", "#fbbf24", "#dc2626", "#fafafa"] },

    /* wedding & events */
    { name: "classic ivory", use: "wedding", colors: ["#fffff8", "#f5f0e6", "#d4c5b0", "#8b7355", "#c9a227"] },
    { name: "blush romance", use: "wedding", colors: ["#fdf2f8", "#fbcfe8", "#f472b6", "#be185d", "#fce7f3"] },
    { name: "garden party", use: "wedding", colors: ["#f0fdf4", "#bbf7d0", "#4ade80", "#fef08a", "#fbbf24"] },
    { name: "navy & gold", use: "wedding", colors: ["#f8fafc", "#c9a227", "#1e3a5f", "#0f172a", "#e8d5b7"] },
    { name: "dusty sage", use: "wedding", colors: ["#f5f7f4", "#c5d9c5", "#6b8f6b", "#4a6741", "#d4c5b0"] },
    { name: "sunset vows", use: "sunset", colors: ["#fff1f2", "#fda4af", "#ea580c", "#9f1239", "#312e81"] },
    { name: "winter frost", use: "wedding", colors: ["#f8fafc", "#cbd5e1", "#64748b", "#1e293b", "#e2e8f0"] },
    { name: "bohemian bloom", use: "wedding", colors: ["#faf5f0", "#e8b4a0", "#c4785a", "#854d0e", "#6b8f6b"] },
    { name: "black tie", use: "wedding", colors: ["#0a0a0a", "#262626", "#525252", "#fafafa", "#c9a227"] },
    { name: "lavender lace", use: "wedding", colors: ["#faf5ff", "#e9d5ff", "#a78bfa", "#6b21a8", "#f5f0e6"] },

    /* kids & playful */
    { name: "candy shop", use: "kids", colors: ["#fef08a", "#f472b6", "#38bdf8", "#4ade80", "#fb923c"] },
    { name: "storybook", use: "kids", colors: ["#fef3c7", "#fca5a5", "#93c5fd", "#86efac", "#c4b5fd"] },
    { name: "dino adventure", use: "kids", colors: ["#bbf7d0", "#4ade80", "#166534", "#854d0e", "#fef08a"] },
    { name: "space explorer", use: "kids", colors: ["#1e1b4b", "#6366f1", "#38bdf8", "#fbbf24", "#f8fafc"] },
    { name: "under the sea", use: "kids", colors: ["#e0f2fe", "#38bdf8", "#0284c7", "#fbbf24", "#fb923c"] },
    { name: "rainbow room", use: "kids", colors: ["#fecaca", "#fed7aa", "#fef08a", "#bbf7d0", "#bfdbfe"] },
    { name: "fairy garden", use: "kids", colors: ["#fdf4ff", "#f0abfc", "#c084fc", "#86efac", "#fef08a"] },
    { name: "construction zone", use: "kids", colors: ["#fef3c7", "#fbbf24", "#ea580c", "#78716c", "#1c1917"] },
    { name: "bubble bath", use: "kids", colors: ["#f0f9ff", "#bae6fd", "#f0abfc", "#fef08a", "#ffffff"] },
    { name: "puppet theater", use: "kids", colors: ["#dc2626", "#2563eb", "#eab308", "#16a34a", "#9333ea"] },

    /* dark & moody */
    { name: "noir cinema", use: "dark & moody", colors: ["#0a0a0a", "#1a1a1a", "#383838", "#737373", "#dc2626"] },
    { name: "midnight jazz", use: "dark & moody", colors: ["#0f0f1a", "#1e1e3f", "#4a4a8a", "#c9a227", "#f5f0e6"] },
    { name: "storm cloud", use: "dark & moody", colors: ["#1e293b", "#334155", "#64748b", "#94a3b8", "#cbd5e1"] },
    { name: "ember glow", use: "dark & moody", colors: ["#1c1917", "#44403c", "#ea580c", "#f97316", "#fef3c7"] },
    { name: "deep forest", use: "dark & moody", colors: ["#0a1f0a", "#1a3d1a", "#2d5016", "#4ade80", "#86efac"] },
    { name: "velvet night", use: "dark & moody", colors: ["#1a0a2e", "#3d1a5c", "#7c3aed", "#c4b5fd", "#f5f0e6"] },
    { name: "charcoal studio", use: "dark & moody", colors: ["#171717", "#262626", "#404040", "#737373", "#fafafa"] },
    { name: "ocean abyss", use: "ocean & beach", colors: ["#0c1929", "#1e3a5f", "#0369a1", "#38bdf8", "#e0f2fe"] },
    { name: "gothic rose", use: "dark & moody", colors: ["#1a0a0a", "#450a0a", "#881337", "#fb7185", "#fce7f3"] },
    { name: "copper dusk", use: "dark & moody", colors: ["#1c1917", "#44403c", "#b87333", "#d4845a", "#fef3c7"] },

    /* pastel & soft */
    { name: "cotton candy", use: "pastel", colors: ["#fdf4ff", "#f5d0fe", "#e879f9", "#a855f7", "#38bdf8"] },
    { name: "baby nursery", use: "pastel", colors: ["#f0fdf4", "#bbf7d0", "#86efac", "#fef3c7", "#fde68a"] },
    { name: "spring mist", use: "pastel", colors: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#fef9c3", "#fce7f3"] },
    { name: "peach sorbet", use: "pastel", colors: ["#fff7ed", "#ffedd5", "#fed7aa", "#fecaca", "#fce7f3"] },
    { name: "lilac dream", use: "pastel", colors: ["#eef2ff", "#c7d2fe", "#818cf8", "#4338ca", "#fef08a"] },
    { name: "seafoam soft", use: "ocean & beach", colors: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#fef08a", "#fce7f3"] },
    { name: "vanilla sky", use: "sky", colors: ["#fffef9", "#fef9c3", "#fde68a", "#bae6fd", "#fbcfe8"] },
    { name: "rose water", use: "pastel", colors: ["#fdf2f8", "#f5d0fe", "#c026d3", "#86198f", "#581c87"] },
    { name: "sage whispers", use: "pastel", colors: ["#f5f7f4", "#ecfdf5", "#d1fae5", "#e8e4de", "#fce7f3"] },
    { name: "cloud nine", use: "sky", colors: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#fce7f3", "#e0f2fe"] },

    /* ocean & beach */
    { name: "sandy shore", use: "ocean & beach", colors: ["#faf8f5", "#e8dcc8", "#c4a882", "#6b9b9b", "#0284c7"] },
    { name: "tide pool", use: "ocean & beach", colors: ["#ecfdf5", "#5eead4", "#14b8a6", "#0f766e", "#134e4a"] },
    { name: "coral reef", use: "ocean & beach", colors: ["#fff7ed", "#fb923c", "#ea580c", "#0891b2", "#164e63"] },
    { name: "boardwalk summer", use: "ocean & beach", colors: ["#fef3c7", "#fde68a", "#38bdf8", "#0284c7", "#f472b6"] },

    /* sky */
    { name: "clear morning", use: "sky", colors: ["#f0f9ff", "#7dd3fc", "#38bdf8", "#0284c7", "#ffffff"] },
    { name: "overcast calm", use: "sky", colors: ["#f1f5f9", "#cbd5e1", "#94a3b8", "#64748b", "#475569"] },
    { name: "dusk gradient", use: "sky", colors: ["#e0f2fe", "#93c5fd", "#6366f1", "#a855f7", "#fce7f3"] },

    /* sunset */
    { name: "coral horizon", use: "sunset", colors: ["#fff1f2", "#fda4af", "#fb923c", "#c2410c", "#581c87"] },
    { name: "golden hour glow", use: "sunset", colors: ["#fffbeb", "#fcd34d", "#f97316", "#db2777", "#4c1d95"] },
    { name: "pink afterglow", use: "sunset", colors: ["#fdf2f8", "#f9a8d4", "#fb7185", "#7c3aed", "#1e1b4b"] },

    /* coffee */
    { name: "latte foam", use: "coffee", colors: ["#faf6f1", "#e8ddd0", "#c4a882", "#8b6914", "#4a3728"] },
    { name: "dark roast", use: "coffee", colors: ["#3d2914", "#5c4033", "#8b6914", "#d4a882", "#f5f0e8"] },
    { name: "cappuccino crema", use: "coffee", colors: ["#f5f0e8", "#d4c5b0", "#a0522d", "#6b4423", "#2c1810"] },

    /* drinks */
    { name: "berry smoothie", use: "drinks", colors: ["#fdf2f8", "#f472b6", "#be185d", "#581c87", "#fef08a"] },
    { name: "mint mojito", use: "drinks", colors: ["#ecfdf5", "#6ee7b7", "#059669", "#fef08a", "#f0fdf4"] },
    { name: "citrus spritz", use: "drinks", colors: ["#fff7ed", "#fdba74", "#f97316", "#fef08a", "#ec4899"] },
    { name: "evening cocktail", use: "drinks", colors: ["#1e1b4b", "#7c3aed", "#ec4899", "#fbbf24", "#fafafa"] },
  ];

  /* ---- real-world brand palettes (hex + official-style color names) ---- */
  const BRAND_PALETTES = [
    {
      name: "coca-cola",
      use: "brands",
      colors: ["#F40009", "#FFFFFF", "#000000"],
      colorNames: ["coke red", "white", "black"],
    },
    {
      name: "starbucks",
      use: "brands",
      colors: ["#00704A", "#1E3932", "#D4E9E2", "#FFFFFF"],
      colorNames: ["starbucks green", "house green", "mint frost", "white"],
    },
    {
      name: "mcdonald's",
      use: "brands",
      colors: ["#FFC72C", "#DA291C", "#27251F", "#FFFFFF"],
      colorNames: ["golden arches", "mcd red", "speedee black", "white"],
    },
    {
      name: "google",
      use: "brands",
      colors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
      colorNames: ["google blue", "google red", "google yellow", "google green"],
    },
    {
      name: "apple",
      use: "brands",
      colors: ["#000000", "#A2AAAD", "#F5F5F7", "#FFFFFF"],
      colorNames: ["apple black", "space gray", "silver", "white"],
    },
    {
      name: "netflix",
      use: "brands",
      colors: ["#E50914", "#000000", "#FFFFFF"],
      colorNames: ["netflix red", "black", "white"],
    },
    {
      name: "spotify",
      use: "brands",
      colors: ["#1DB954", "#191414", "#FFFFFF"],
      colorNames: ["spotify green", "spotify black", "white"],
    },
    {
      name: "nike",
      use: "brands",
      colors: ["#111111", "#FFFFFF", "#FF5000"],
      colorNames: ["nike black", "white", "total orange"],
    },
    {
      name: "target",
      use: "brands",
      colors: ["#CC0000", "#FFFFFF", "#333333"],
      colorNames: ["target red", "white", "charcoal"],
    },
    {
      name: "fedex",
      use: "brands",
      colors: ["#4D148C", "#FF6600", "#00A651", "#FFFFFF"],
      colorNames: ["fedex purple", "fedex orange", "fedex green", "white"],
    },
    {
      name: "ups",
      use: "brands",
      colors: ["#351C15", "#FFB500", "#FFFFFF"],
      colorNames: ["ups brown", "ups gold", "white"],
    },
    {
      name: "tiffany & co",
      use: "brands",
      colors: ["#0ABAB5", "#000000", "#FFFFFF", "#F5F5F5"],
      colorNames: ["tiffany blue", "black", "white", "silver mist"],
    },
    {
      name: "instagram",
      use: "brands",
      colors: ["#E1306C", "#F77737", "#FCAF45", "#833AB4", "#405DE6"],
      colorNames: ["instagram pink", "sunset orange", "marigold", "royal purple", "deep blue"],
    },
    {
      name: "amazon",
      use: "brands",
      colors: ["#FF9900", "#232F3E", "#FFFFFF"],
      colorNames: ["smile orange", "squid ink", "white"],
    },
    {
      name: "ibm",
      use: "brands",
      colors: ["#0F62FE", "#393939", "#F2F4F8", "#FFFFFF"],
      colorNames: ["ibm blue", "gray 80", "gray 10", "white"],
    },
    {
      name: "youtube",
      use: "brands",
      colors: ["#FF0000", "#282828", "#FFFFFF"],
      colorNames: ["youtube red", "charcoal", "white"],
    },
    {
      name: "discord",
      use: "brands",
      colors: ["#5865F2", "#23272A", "#FFFFFF"],
      colorNames: ["blurple", "dark mode", "white"],
    },
    {
      name: "snapchat",
      use: "brands",
      colors: ["#FFFC00", "#000000", "#FFFFFF"],
      colorNames: ["snap yellow", "black", "white"],
    },
    {
      name: "mastercard",
      use: "brands",
      colors: ["#EB001B", "#FF5F00", "#F79E1B"],
      colorNames: ["mastercard red", "mastercard orange", "mastercard yellow"],
    },
    {
      name: "visa",
      use: "brands",
      colors: ["#1A1F71", "#F7B600", "#FFFFFF"],
      colorNames: ["visa blue", "visa gold", "white"],
    },
    {
      name: "twitter",
      use: "brands",
      colors: ["#1DA1F2", "#FFFFFF", "#14171A"],
      colorNames: ["twitter blue", "white", "dark gray"],
    },
    {
      name: "facebook",
      use: "brands",
      colors: ["#1877F2", "#FFFFFF", "#E4E6EB"],
      colorNames: ["facebook blue", "white", "light gray"],
    },
    {
      name: "lego",
      use: "brands",
      colors: ["#E3000B", "#FFCF00", "#0055BF", "#237841"],
      colorNames: ["lego red", "lego yellow", "lego blue", "lego green"],
    },
    {
      name: "hermès",
      use: "brands",
      colors: ["#F37021", "#4A2C2A", "#FFFFFF"],
      colorNames: ["hermès orange", "chocolate brown", "white"],
    },
    {
      name: "disney",
      use: "brands",
      colors: ["#113CCF", "#FFFFFF", "#000000", "#FFD700"],
      colorNames: ["disney blue", "white", "black", "magic gold"],
    },
  ];

  /* ---- minecraft palettes (in-game dyes, blocks, biomes) ---- */
  const MINECRAFT_PALETTES = [
    {
      name: "dye colors",
      use: "minecraft",
      colors: [
        "#F9FFFE", "#9D9D97", "#474F52", "#1D1D21", "#835432", "#B02E26",
        "#F9801D", "#FED83D", "#80C71F", "#5E7C16", "#169C9C", "#3AB3DA",
        "#3C44AA", "#8932B8", "#C74EBD", "#F38BAA",
      ],
      colorNames: [
        "white dye", "light gray dye", "gray dye", "black dye", "brown dye", "red dye",
        "orange dye", "yellow dye", "lime dye", "green dye", "cyan dye", "light blue dye",
        "blue dye", "purple dye", "magenta dye", "pink dye",
      ],
    },
    {
      name: "overworld ground",
      use: "minecraft",
      colors: ["#91BD59", "#866043", "#6C5029", "#7F7F7F", "#DBD3A0", "#837F7E"],
      colorNames: ["grass block", "dirt", "podzol", "stone", "sand", "gravel"],
    },
    {
      name: "wood types",
      use: "minecraft",
      colors: ["#B8945F", "#DCC899", "#674F2D", "#B88764", "#A15024", "#423626"],
      colorNames: ["oak planks", "birch planks", "spruce planks", "jungle planks", "acacia planks", "dark oak planks"],
    },
    {
      name: "tree logs",
      use: "minecraft",
      colors: ["#6E5024", "#D7CCB4", "#3B2912", "#554020", "#963430", "#35271A"],
      colorNames: ["oak log", "birch log", "spruce log", "jungle log", "acacia log", "dark oak log"],
    },
    {
      name: "leaf colors",
      use: "minecraft",
      colors: ["#78A030", "#80A755", "#619961", "#59A030", "#6BAA54", "#478024"],
      colorNames: ["oak leaves", "birch leaves", "spruce leaves", "jungle leaves", "azalea leaves", "mangrove leaves"],
    },
    {
      name: "ores & gems",
      use: "minecraft",
      colors: ["#343434", "#D8D8D8", "#FCEE4B", "#AE0707", "#224AAD", "#62EFFD", "#17DD62", "#C06144"],
      colorNames: ["coal ore", "iron block", "gold block", "redstone block", "lapis block", "diamond", "emerald block", "copper block"],
    },
    {
      name: "nether blocks",
      use: "minecraft",
      colors: ["#612626", "#BF0731", "#148A98", "#5C1D25", "#356957", "#AC8523"],
      colorNames: ["netherrack", "crimson nylium", "warped nylium", "crimson stem", "warped stem", "glowstone"],
    },
    {
      name: "nether terrain",
      use: "minecraft",
      colors: ["#5B4326", "#8F250C", "#4C1515", "#2C1810", "#1A0F0F", "#604038"],
      colorNames: ["soul sand", "magma block", "nether bricks", "basalt", "blackstone", "ancient debris"],
    },
    {
      name: "the end",
      use: "minecraft",
      colors: ["#DBDBA3", "#995FA4", "#5E3657", "#141019", "#CC00FA", "#F9F9F9"],
      colorNames: ["end stone", "purpur block", "chorus plant", "obsidian", "ender eye purple", "end crystal white"],
    },
    {
      name: "water & ice",
      use: "minecraft",
      colors: ["#3F76E4", "#91B4FF", "#4A90E2", "#74A7FF", "#F9F9F9", "#FFFFFF"],
      colorNames: ["water", "ice", "deep water", "blue ice", "snow block", "powder snow"],
    },
    {
      name: "lava & fire",
      use: "minecraft",
      colors: ["#FF6A00", "#FF4500", "#FFD700", "#8B0000", "#FF8C00", "#4A0404"],
      colorNames: ["lava", "fire", "torch flame", "campfire ember", "magma orange", "smoker soot"],
    },
    {
      name: "mob colors",
      use: "minecraft",
      colors: ["#50C878", "#557C49", "#C1C1C1", "#161616", "#8B4513", "#FF69B4"],
      colorNames: ["creeper green", "zombie green", "skeleton bone", "enderman black", "villager robe", "pig pink"],
    },
    {
      name: "village & clay",
      use: "minecraft",
      colors: ["#A0A6B1", "#985E45", "#966C4A", "#707070", "#B55239", "#D87F33"],
      colorNames: ["clay block", "terracotta", "bricks", "stone bricks", "orange terracotta", "glazed terracotta"],
    },
    {
      name: "amethyst & deepslate",
      use: "minecraft",
      colors: ["#9966CC", "#4A3264", "#505050", "#383838", "#2E2E2E", "#1A1A1A"],
      colorNames: ["amethyst shard", "amethyst block", "deepslate", "cobbled deepslate", "polished deepslate", "bedrock"],
    },
    {
      name: "cherry & bamboo",
      use: "minecraft",
      colors: ["#E4A4A4", "#D88B8B", "#5C9810", "#E0D050", "#F5DEB3", "#8B6914"],
      colorNames: ["cherry leaves", "cherry log", "bamboo block", "bamboo plank", "scaffolding", "bee nest"],
    },
    {
      name: "sky & weather",
      use: "minecraft",
      colors: ["#78A7FF", "#C0D8FF", "#FFFFFF", "#555555", "#333333", "#1E1E1E"],
      colorNames: ["day sky", "cloud white", "sunlight", "rain gray", "storm sky", "night sky"],
    },
    {
      name: "op loot",
      use: "minecraft",
      colors: [
        "#604038", "#443D3B", "#FFCA28", "#B464FF", "#C5ECF5", "#7B838A",
        "#59C9B3", "#5A5050", "#FFC515", "#E8FCFC", "#00999A", "#2A9FB3",
      ],
      colorNames: [
        "ancient debris", "netherite ingot", "enchanted golden apple", "enchant glint",
        "wind charge", "mace", "spear", "elytra", "totem of undying",
        "nether star", "trident", "heart of the sea",
      ],
    },
  ];

  /* ---- generated palettes: distinct recipes + dedupe ---- */
  function wrapHue(h) {
    return ((h % 360) + 360) % 360;
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function hexFromHsl(h, s, l) {
    if (global.ColorKit) return global.ColorKit.hslToHex(h, s, l);
    return "#888888";
  }

  function hexToRgb(hex) {
    if (global.ColorKit) return global.ColorKit.hexToRgb(hex);
    return null;
  }

  function rgbDist(a, b) {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function buildPalette(name, use, hslRows) {
    return {
      name: name,
      use: use,
      colors: hslRows.map(function (row) {
        return hexFromHsl(row[0], row[1], row[2]);
      }),
    };
  }

  /* Five different harmony structures so palettes don't all look the same. */
  function recipeTriadic(name, use, h) {
    return buildPalette(name, use, [
      [h, 28, 94],
      [h, 55, 68],
      [wrapHue(h + 120), 62, 52],
      [wrapHue(h + 240), 58, 38],
      [wrapHue(h + 120), 35, 18],
    ]);
  }

  function recipeComplement(name, use, h) {
    return buildPalette(name, use, [
      [h, 22, 92],
      [h, 48, 72],
      [h, 72, 50],
      [wrapHue(h + 180), 65, 42],
      [wrapHue(h + 180), 40, 22],
    ]);
  }

  function recipeWideAnalogous(name, use, h) {
    return buildPalette(name, use, [
      [wrapHue(h - 45), 45, 88],
      [wrapHue(h - 18), 58, 68],
      [h, 70, 50],
      [wrapHue(h + 22), 62, 34],
      [wrapHue(h + 55), 38, 16],
    ]);
  }

  function recipeMonochrome(name, use, h) {
    return buildPalette(name, use, [
      [h, 18, 96],
      [h, 35, 78],
      [h, 55, 58],
      [h, 48, 38],
      [h, 30, 18],
    ]);
  }

  function recipeAccentNeutral(name, use, h) {
    return buildPalette(name, use, [
      [h, 12, 95],
      [h, 8, 82],
      [h, 75, 55],
      [h, 65, 35],
      [wrapHue(h + 90), 15, 28],
    ]);
  }

  function recipeSplitComplement(name, use, h) {
    return buildPalette(name, use, [
      [h, 30, 90],
      [h, 60, 62],
      [wrapHue(h + 150), 55, 48],
      [wrapHue(h + 210), 52, 40],
      [h, 25, 20],
    ]);
  }

  function recipeEarthTones(name, use, h) {
    return buildPalette(name, use, [
      [h, 35, 92],
      [wrapHue(h + 12), 42, 72],
      [wrapHue(h + 25), 50, 52],
      [wrapHue(h + 8), 45, 34],
      [wrapHue(h + 18), 38, 16],
    ]);
  }

  function recipeVividContrast(name, use, h) {
    return buildPalette(name, use, [
      [h, 85, 62],
      [wrapHue(h + 60), 78, 55],
      [wrapHue(h + 180), 72, 48],
      [h, 20, 88],
      [wrapHue(h + 180), 30, 22],
    ]);
  }

  const RECIPES = [
    recipeTriadic,
    recipeComplement,
    recipeWideAnalogous,
    recipeMonochrome,
    recipeAccentNeutral,
    recipeSplitComplement,
    recipeVividContrast,
  ];

  const EARTH_RECIPES = [recipeEarthTones, recipeMonochrome, recipeAccentNeutral, recipeComplement, recipeWideAnalogous];

  function spacedHues(anchor, count) {
    const step = 360 / count;
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(wrapHue(anchor + i * step));
    }
    return list;
  }

  function expandCategory(use, prefix, anchorHue, labels, recipeSet) {
    const hues = spacedHues(anchorHue, labels.length);
    const recipes = recipeSet || ((use === "coffee" || use === "food") ? EARTH_RECIPES : RECIPES);
    return labels.map(function (label, i) {
      return recipes[i % recipes.length](prefix + " " + label, use, hues[i]);
    });
  }

  function palettesAreSimilar(a, b, threshold) {
    const fpA = a.colors.map(function (c) { return c.toLowerCase(); }).sort().join("|");
    const fpB = b.colors.map(function (c) { return c.toLowerCase(); }).sort().join("|");
    if (fpA === fpB) return true;

    let total = 0;
    a.colors.forEach(function (hexA) {
      const rgbA = hexToRgb(hexA);
      if (!rgbA) return;
      let best = Infinity;
      b.colors.forEach(function (hexB) {
        const rgbB = hexToRgb(hexB);
        if (rgbB) best = Math.min(best, rgbDist(rgbA, rgbB));
      });
      total += best;
    });
    return (total / a.colors.length) < threshold;
  }

  function dedupePalettes(palettes, threshold) {
    const kept = [];
    palettes.forEach(function (palette) {
      let skip = false;
      for (let i = 0; i < kept.length; i++) {
        if (palettesAreSimilar(palette, kept[i], threshold)) {
          skip = true;
          break;
        }
      }
      if (!skip) kept.push(palette);
    });
    return kept;
  }

  function dedupeWithinCategories(palettes, threshold) {
    const byUse = {};
    palettes.forEach(function (palette) {
      if (!byUse[palette.use]) byUse[palette.use] = [];
      byUse[palette.use].push(palette);
    });
    const merged = [];
    Object.keys(byUse).forEach(function (use) {
      merged.push.apply(merged, dedupePalettes(byUse[use], threshold));
    });
    return merged;
  }

  const GENERATED = [].concat(
    expandCategory("ocean & beach", "shoreline", 192, [
      "aqua drift", "deep lagoon", "sea glass", "coral cove", "moon tide", "kelp forest",
    ]),
    expandCategory("sky", "atmosphere", 208, [
      "high noon", "wispy cirrus", "storm break", "polar light", "starlit blue", "rain wash",
    ]),
    expandCategory("sunset", "glow", 18, [
      "ember sky", "tangerine fade", "magenta rim", "rose dusk", "honey light", "crimson edge",
    ]),
    expandCategory("nature", "wild", 108, [
      "pine ridge", "fern hollow", "clover field", "cedar grove", "emerald glade", "willow brook",
    ]),
    expandCategory("coffee", "brew", 32, [
      "morning cup", "mocha blend", "cold brew", "caramel bean", "hazel roast", "spiced latte",
    ], EARTH_RECIPES),
    expandCategory("food", "kitchen", 24, [
      "tomato basil", "citrus zest", "herb garden", "golden grain", "berry tart", "chili heat",
    ], EARTH_RECIPES),
    expandCategory("drinks", "pour", 312, [
      "rose spritz", "grape fizz", "tropical punch", "ginger ale", "lime cooler", "plum wine",
    ]),
    expandCategory("web & ui", "interface", 228, [
      "blueprint", "violet dash", "green light", "alert warm", "teal action", "amber badge",
    ]),
    expandCategory("branding", "identity", 12, [
      "signal red", "trust blue", "growth green", "creative plum", "future indigo", "earth mark",
    ]),
    expandCategory("interior", "room", 42, [
      "linen loft", "sage studio", "nordic blue", "plum parlor", "copper den", "clay hearth",
    ]),
    expandCategory("fashion", "style", 336, [
      "runway rose", "denim cool", "mustard pop", "lilac luxe", "jade chic", "rust edit",
    ]),
    expandCategory("wedding", "celebration", 348, [
      "blush aisle", "sage table", "champagne dance", "mauve bouquet", "sky vow", "ivory glow",
    ]),
    expandCategory("kids", "play", 6, [
      "crayon box", "dino green", "rocket blue", "sunshine", "bubblegum", "rainbow room",
    ]),
    expandCategory("dark & moody", "shadow", 260, [
      "obsidian", "navy void", "forest night", "plum dusk", "wine cellar", "bronze dark",
    ], [
      function darkTriadic(name, use, h) {
        return buildPalette(name, use, [
          [h, 18, 12],
          [h, 35, 24],
          [wrapHue(h + 120), 40, 36],
          [wrapHue(h + 240), 38, 48],
          [wrapHue(h + 60), 15, 72],
        ]);
      },
      function darkComplement(name, use, h) {
        return buildPalette(name, use, [
          [h, 22, 10],
          [h, 30, 22],
          [h, 45, 38],
          [wrapHue(h + 180), 42, 52],
          [wrapHue(h + 180), 25, 78],
        ]);
      },
      function darkMono(name, use, h) {
        return buildPalette(name, use, [
          [h, 12, 8],
          [h, 18, 18],
          [h, 25, 32],
          [h, 20, 50],
          [h, 10, 76],
        ]);
      },
      recipeSplitComplement,
      recipeWideAnalogous,
    ]),
    expandCategory("pastel", "soft", 330, [
      "blush mist", "baby blue", "mint whisper", "lilac haze", "buttercream", "peach sorbet",
    ], [
      function pastelAnalogous(name, use, h) {
        return buildPalette(name, use, [
          [wrapHue(h - 30), 38, 94],
          [wrapHue(h - 10), 42, 86],
          [h, 45, 78],
          [wrapHue(h + 15), 40, 70],
          [wrapHue(h + 35), 35, 62],
        ]);
      },
      function pastelTriadic(name, use, h) {
        return buildPalette(name, use, [
          [h, 35, 92],
          [wrapHue(h + 120), 32, 84],
          [wrapHue(h + 240), 30, 76],
          [h, 28, 68],
          [wrapHue(h + 120), 25, 60],
        ]);
      },
      recipeAccentNeutral,
      recipeMonochrome,
      recipeComplement,
    ])
  );

  const ALL_PALETTES = dedupeWithinCategories(PALETTES.concat(GENERATED), 26)
    .concat(BRAND_PALETTES)
    .concat(MINECRAFT_PALETTES);

  const CATEGORIES = [
    "all",
    "my saved",
    "brands",
    "minecraft",
    "ocean & beach",
    "sky",
    "sunset",
    "nature",
    "coffee",
    "food",
    "drinks",
    "web & ui",
    "branding",
    "interior",
    "fashion",
    "wedding",
    "kids",
    "dark & moody",
    "pastel",
  ];

  global.PaletteLibrary = {
    palettes: ALL_PALETTES,
    categories: CATEGORIES,
  };
})(window);
