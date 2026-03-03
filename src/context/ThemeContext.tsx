import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ThemeName = "vaporwave" | "matrix" | "miami" | "cyberpunk" | "blizzard" | "solar" | "halloween" | "summerNights";

interface ThemePalette {
  deepPurple: string;
  midPurple: string;
  hotPink: string;
  neonPink: string;
  neonBlue: string;
  cyan: string;
  sunsetOrange: string;
  pastelLavender: string;
  pastelPink: string;
  darkBg: string;
  darkerBg: string;
  sidebarBg: string;
  editorBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  glowPrimary: string;
  glowSecondary: string;
  gradientStart: string;
  gradientEnd: string;
  gridLine: string;
  hoverBg: string;
  errorBg: string;
}

export const THEMES: Record<ThemeName, ThemePalette> = {
  vaporwave: {
    deepPurple: "#300350",
    midPurple: "#4A0E78",
    hotPink: "#E93479",
    neonPink: "#F62E97",
    neonBlue: "#153CB4",
    cyan: "#00D4FF",
    sunsetOrange: "#F9AC53",
    pastelLavender: "#C4A1FF",
    pastelPink: "#FFB3D9",
    darkBg: "#0D0221",
    darkerBg: "#080118",
    sidebarBg: "#120330",
    editorBg: "#0F0225",
    textPrimary: "#E8D5FF",
    textSecondary: "#A88DC8",
    textMuted: "#6B4D8A",
    glowPrimary: "0 0 10px rgba(233, 52, 121, 0.5), 0 0 20px rgba(233, 52, 121, 0.3)",
    glowSecondary: "0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)",
    gradientStart: "#F62E97",
    gradientEnd: "#00D4FF",
    gridLine: "rgba(75, 0, 130, 0.08)",
    hoverBg: "rgba(233, 52, 121, 0.15)",
    errorBg: "rgba(233, 52, 121, 0.9)",
  },
  matrix: {
    deepPurple: "#0a1a0a",
    midPurple: "#0d2b0d",
    hotPink: "#00CC33",
    neonPink: "#00FF41",
    neonBlue: "#005500",
    cyan: "#33FF33",
    sunsetOrange: "#88FF88",
    pastelLavender: "#66FF66",
    pastelPink: "#44DD44",
    darkBg: "#000000",
    darkerBg: "#000000",
    sidebarBg: "#050a05",
    editorBg: "#020502",
    textPrimary: "#00FF41",
    textSecondary: "#00CC33",
    textMuted: "#1a4a1a",
    glowPrimary: "0 0 10px rgba(0, 255, 65, 0.5), 0 0 20px rgba(0, 255, 65, 0.3)",
    glowSecondary: "0 0 10px rgba(51, 255, 51, 0.5), 0 0 20px rgba(51, 255, 51, 0.3)",
    gradientStart: "#00FF41",
    gradientEnd: "#33FF33",
    gridLine: "rgba(0, 255, 65, 0.06)",
    hoverBg: "rgba(0, 255, 65, 0.15)",
    errorBg: "rgba(0, 255, 65, 0.9)",
  },
  miami: {
    deepPurple: "#0E0E24",
    midPurple: "#1A1A3E",
    hotPink: "#F890E7",
    neonPink: "#F890E7",
    neonBlue: "#0B6E6E",
    cyan: "#0BD3D3",
    sunsetOrange: "#FF6B6B",
    pastelLavender: "#B8A9FF",
    pastelPink: "#FFB8F0",
    darkBg: "#0A0A1A",
    darkerBg: "#060614",
    sidebarBg: "#0C0C22",
    editorBg: "#0A0A1A",
    textPrimary: "#F0E6FF",
    textSecondary: "#B8A0D0",
    textMuted: "#4A3A6A",
    glowPrimary: "0 0 10px rgba(248, 144, 231, 0.5), 0 0 20px rgba(248, 144, 231, 0.3)",
    glowSecondary: "0 0 10px rgba(11, 211, 211, 0.5), 0 0 20px rgba(11, 211, 211, 0.3)",
    gradientStart: "#F890E7",
    gradientEnd: "#0BD3D3",
    gridLine: "rgba(11, 211, 211, 0.06)",
    hoverBg: "rgba(248, 144, 231, 0.15)",
    errorBg: "rgba(248, 144, 231, 0.9)",
  },
  cyberpunk: {
    deepPurple: "#1A1A1A",
    midPurple: "#2A2A2A",
    hotPink: "#FF003C",
    neonPink: "#FF003C",
    neonBlue: "#005080",
    cyan: "#00F0FF",
    sunsetOrange: "#FCEE09",
    pastelLavender: "#7DF9FF",
    pastelPink: "#FF5577",
    darkBg: "#0D0D0D",
    darkerBg: "#0A0A0A",
    sidebarBg: "#0F0F0F",
    editorBg: "#0D0D0D",
    textPrimary: "#E0E0E0",
    textSecondary: "#999999",
    textMuted: "#3A3A3A",
    glowPrimary: "0 0 10px rgba(252, 238, 9, 0.5), 0 0 20px rgba(252, 238, 9, 0.3)",
    glowSecondary: "0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)",
    gradientStart: "#FCEE09",
    gradientEnd: "#00F0FF",
    gridLine: "rgba(252, 238, 9, 0.06)",
    hoverBg: "rgba(252, 238, 9, 0.12)",
    errorBg: "rgba(255, 0, 60, 0.9)",
  },
  blizzard: {
    deepPurple: "#0E1E30",
    midPurple: "#1A3050",
    hotPink: "#A8D8EA",
    neonPink: "#A8D8EA",
    neonBlue: "#2A5070",
    cyan: "#62B6CB",
    sunsetOrange: "#F0F8FF",
    pastelLavender: "#88CCE0",
    pastelPink: "#B0E0FF",
    darkBg: "#0B1929",
    darkerBg: "#081420",
    sidebarBg: "#0D1D2F",
    editorBg: "#0B1929",
    textPrimary: "#D0E8F2",
    textSecondary: "#7AACBE",
    textMuted: "#2A4A6A",
    glowPrimary: "0 0 10px rgba(168, 216, 234, 0.5), 0 0 20px rgba(168, 216, 234, 0.3)",
    glowSecondary: "0 0 10px rgba(98, 182, 203, 0.5), 0 0 20px rgba(98, 182, 203, 0.3)",
    gradientStart: "#A8D8EA",
    gradientEnd: "#62B6CB",
    gridLine: "rgba(168, 216, 234, 0.06)",
    hoverBg: "rgba(168, 216, 234, 0.12)",
    errorBg: "rgba(168, 216, 234, 0.9)",
  },
  solar: {
    deepPurple: "#2A1E00",
    midPurple: "#3D2E00",
    hotPink: "#FF6B35",
    neonPink: "#FF6B35",
    neonBlue: "#806020",
    cyan: "#FFB627",
    sunsetOrange: "#FFD866",
    pastelLavender: "#FFCC80",
    pastelPink: "#FFE0A0",
    darkBg: "#1A1200",
    darkerBg: "#120D00",
    sidebarBg: "#1E1600",
    editorBg: "#1A1200",
    textPrimary: "#F5E6C8",
    textSecondary: "#C8A870",
    textMuted: "#5A4520",
    glowPrimary: "0 0 10px rgba(255, 182, 39, 0.5), 0 0 20px rgba(255, 182, 39, 0.3)",
    glowSecondary: "0 0 10px rgba(255, 107, 53, 0.5), 0 0 20px rgba(255, 107, 53, 0.3)",
    gradientStart: "#FFB627",
    gradientEnd: "#FF6B35",
    gridLine: "rgba(255, 182, 39, 0.06)",
    hoverBg: "rgba(255, 182, 39, 0.12)",
    errorBg: "rgba(255, 107, 53, 0.9)",
  },
  halloween: {
    deepPurple: "#1A0A1A",
    midPurple: "#2A1A2A",
    hotPink: "#FF6600",
    neonPink: "#FF6600",
    neonBlue: "#4A0080",
    cyan: "#39FF14",
    sunsetOrange: "#FFB366",
    pastelLavender: "#CC66FF",
    pastelPink: "#FF9944",
    darkBg: "#0A0A0A",
    darkerBg: "#060606",
    sidebarBg: "#0C0A0C",
    editorBg: "#0A0A0A",
    textPrimary: "#E0D0C0",
    textSecondary: "#B8886A",
    textMuted: "#3A2A1A",
    glowPrimary: "0 0 10px rgba(255, 102, 0, 0.5), 0 0 20px rgba(255, 102, 0, 0.3)",
    glowSecondary: "0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3)",
    gradientStart: "#FF6600",
    gradientEnd: "#8B00FF",
    gridLine: "rgba(255, 102, 0, 0.06)",
    hoverBg: "rgba(255, 102, 0, 0.12)",
    errorBg: "rgba(255, 102, 0, 0.9)",
  },
  summerNights: {
    deepPurple: "#1A1030",
    midPurple: "#2A1E40",
    hotPink: "#FF6B6B",
    neonPink: "#FF6B6B",
    neonBlue: "#5A4080",
    cyan: "#FFD700",
    sunsetOrange: "#FF9E64",
    pastelLavender: "#B8A0E0",
    pastelPink: "#FFD0A0",
    darkBg: "#0F0A1E",
    darkerBg: "#0A0716",
    sidebarBg: "#120D24",
    editorBg: "#0F0A1E",
    textPrimary: "#E8D8F0",
    textSecondary: "#9A88B8",
    textMuted: "#3A2E55",
    glowPrimary: "0 0 10px rgba(255, 107, 107, 0.5), 0 0 20px rgba(255, 107, 107, 0.3)",
    glowSecondary: "0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)",
    gradientStart: "#FF6B6B",
    gradientEnd: "#FFD700",
    gridLine: "rgba(255, 107, 107, 0.06)",
    hoverBg: "rgba(255, 107, 107, 0.12)",
    errorBg: "rgba(255, 107, 107, 0.9)",
  },
};

function applyCssVariables(palette: ThemePalette) {
  const root = document.documentElement;
  root.style.setProperty("--color-deep-purple", palette.deepPurple);
  root.style.setProperty("--color-mid-purple", palette.midPurple);
  root.style.setProperty("--color-hot-pink", palette.hotPink);
  root.style.setProperty("--color-neon-pink", palette.neonPink);
  root.style.setProperty("--color-neon-blue", palette.neonBlue);
  root.style.setProperty("--color-cyan", palette.cyan);
  root.style.setProperty("--color-sunset-orange", palette.sunsetOrange);
  root.style.setProperty("--color-pastel-lavender", palette.pastelLavender);
  root.style.setProperty("--color-pastel-pink", palette.pastelPink);
  root.style.setProperty("--color-dark-bg", palette.darkBg);
  root.style.setProperty("--color-darker-bg", palette.darkerBg);
  root.style.setProperty("--color-sidebar-bg", palette.sidebarBg);
  root.style.setProperty("--color-editor-bg", palette.editorBg);
  root.style.setProperty("--color-text-primary", palette.textPrimary);
  root.style.setProperty("--color-text-secondary", palette.textSecondary);
  root.style.setProperty("--color-text-muted", palette.textMuted);
  root.style.setProperty("--glow-pink", palette.glowPrimary);
  root.style.setProperty("--glow-cyan", palette.glowSecondary);
  root.style.setProperty("--color-gradient-start", palette.gradientStart);
  root.style.setProperty("--color-gradient-end", palette.gradientEnd);
  root.style.setProperty("--color-grid-line", palette.gridLine);
  root.style.setProperty("--color-hover-bg", palette.hoverBg);
  root.style.setProperty("--color-error-bg", palette.errorBg);
}

export const FONT_OPTIONS = [
  { id: "share-tech", label: "Share Tech Mono", value: "'Share Tech Mono', monospace" },
  { id: "menlo", label: "Menlo", value: "Menlo, monospace" },
  { id: "monaco", label: "Monaco", value: "Monaco, monospace" },
  { id: "sf-mono", label: "SF Mono", value: "'SF Mono', monospace" },
  { id: "courier", label: "Courier New", value: "'Courier New', monospace" },
  { id: "system", label: "System Mono", value: "ui-monospace, monospace" },
];

export const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  editorFont: string;
  setEditorFont: (font: string) => void;
  editorFontSize: number;
  setEditorFontSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem("vapornotes_theme");
    const valid: ThemeName[] = ["vaporwave", "matrix", "miami", "cyberpunk", "blizzard", "solar", "halloween", "summerNights"];
    if (saved && valid.includes(saved as ThemeName)) return saved as ThemeName;
    return "vaporwave";
  });

  const [editorFont, setEditorFontState] = useState(() => {
    return localStorage.getItem("vapornotes_font") || "'Share Tech Mono', monospace";
  });

  const [editorFontSize, setEditorFontSizeState] = useState(() => {
    const saved = localStorage.getItem("vapornotes_fontSize");
    return saved ? Number(saved) : 15;
  });

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("vapornotes_theme", t);
    applyCssVariables(THEMES[t]);
  }, []);

  const setEditorFont = useCallback((font: string) => {
    setEditorFontState(font);
    localStorage.setItem("vapornotes_font", font);
  }, []);

  const setEditorFontSize = useCallback((size: number) => {
    setEditorFontSizeState(size);
    localStorage.setItem("vapornotes_fontSize", String(size));
  }, []);

  // Apply CSS variables on mount and when theme changes
  useEffect(() => {
    applyCssVariables(THEMES[theme]);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, editorFont, setEditorFont, editorFontSize, setEditorFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
