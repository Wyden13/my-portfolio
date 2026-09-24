export const PALETTE_FIELDS = [
  ["blobBase", "Blob base"],
  ["blobHighlight", "Blob highlight"],
  ["ring", "Ring"],
  ["floating", "Floating cubes"],
  ["backgroundStart", "Background start"],
  ["backgroundMiddle", "Background middle"],
  ["backgroundEnd", "Background end"],
  ["glowPrimary", "Background glow 1"],
  ["glowSecondary", "Background glow 2"],
] as const;

export type PaletteKey = (typeof PALETTE_FIELDS)[number][0];
export type VisualizerPalette = Record<PaletteKey, string>;
export type PaletteTheme = "light" | "dark";
export type SavedPalettes = Record<PaletteTheme, VisualizerPalette>;
export const PALETTE_STORAGE_KEY = "visualizer-palettes-v1";

export const DEFAULT_PALETTES: SavedPalettes = {
  light: {
    blobBase: "#551d95", blobHighlight: "#c41d7c", ring: "#656f84",
    floating: "#ffe675", backgroundStart: "#f9f6ee", backgroundMiddle: "#f0eafa",
    backgroundEnd: "#e7ecfa", glowPrimary: "#f7b1b6", glowSecondary: "#ffe675",
  },
  dark: {
    blobBase: "#8921f9", blobHighlight: "#ff21b8", ring: "#fbfcff",
    floating: "#ffe675", backgroundStart: "#06040c", backgroundMiddle: "#100a1c",
    backgroundEnd: "#05040a", glowPrimary: "#8214a0", glowSecondary: "#4a2284",
  },
};

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

export function parsePalettes(raw: string | null): SavedPalettes {
  if (!raw) return DEFAULT_PALETTES;
  try {
    const saved = JSON.parse(raw);
    if (saved?.version !== 1) return DEFAULT_PALETTES;
    const result = {} as SavedPalettes;
    for (const theme of ["light", "dark"] as const) {
      result[theme] = { ...DEFAULT_PALETTES[theme] };
      for (const [key] of PALETTE_FIELDS) {
        if (isHexColor(saved[theme]?.[key])) result[theme][key] = saved[theme][key];
      }
    }
    return result;
  } catch {
    return DEFAULT_PALETTES;
  }
}

export function serializePalettes(palettes: SavedPalettes) {
  return JSON.stringify({ version: 1, ...palettes }, null, 2);
}
