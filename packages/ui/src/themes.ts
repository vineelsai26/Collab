export const VSTACK_THEME_IDS = [
  "ledger",
  "harbor",
  "paper",
  "atelier",
  "signal",
] as const;

export type VstackThemeId = (typeof VSTACK_THEME_IDS)[number];

export type VstackThemeMeta = {
  id: VstackThemeId;
  name: string;
  method: "default" | "legacy" | "no-skill" | "frontend-design-skill";
  summary: string;
  fonts: string[];
  accent: string;
};

export const VSTACK_DEFAULT_THEME: VstackThemeId = "ledger";

export const VSTACK_THEMES: VstackThemeMeta[] = [
  {
    id: "ledger",
    name: "Ledger",
    method: "default",
    summary:
      "Default editorial journal: huge display type, borderless chrome, essay + aside split, soft depth.",
    fonts: ["Bricolage Grotesque", "DM Sans", "JetBrains Mono"],
    accent: "#3730a3",
  },
  {
    id: "harbor",
    name: "Harbor",
    method: "no-skill",
    summary:
      "Product chrome: pill header, soft cards, steel blue actions, three-up feature row.",
    fonts: ["Figtree", "IBM Plex Mono"],
    accent: "#1d4ed8",
  },
  {
    id: "paper",
    name: "Paper",
    method: "legacy",
    summary:
      "Legacy neo-brutalist: hard offsets, thick ink rules, uppercase, accent slab panels.",
    fonts: ["Segoe UI", "Cascadia Code"],
    accent: "#f25c2a",
  },
  {
    id: "atelier",
    name: "Atelier",
    method: "no-skill",
    summary:
      "Centered craft layout: borderless soft panels, circular mark, stone swatches, airy spacing.",
    fonts: ["Manrope", "IBM Plex Mono"],
    accent: "#0f766e",
  },
  {
    id: "signal",
    name: "Signal",
    method: "frontend-design-skill",
    summary:
      "Operator console: flush top bar, sidebar, metric strip, monospace table, visible grid.",
    fonts: ["Syne", "IBM Plex Sans", "IBM Plex Mono"],
    accent: "#2b59ff",
  },
];

export function isVstackThemeId(value: string): value is VstackThemeId {
  return (VSTACK_THEME_IDS as readonly string[]).includes(value);
}
