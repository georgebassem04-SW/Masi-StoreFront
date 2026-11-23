/**
 * THEME -> CSS VARIABLES
 * ------------------------------------------------------------------
 * Turns the site theme (lib/site-theme.ts: dashboard values + client defaults) into CSS variables
 * like --primary, which Tailwind classes (bg-primary, text-muted-foreground…) and app/globals.css use.
 * You don't edit colours here — they come from the dashboard (Theme & design) or config/clients/<client>.ts.
 * Adding a NEW theme value: add it to types/theme.ts, lib/site-theme.ts, this list and app/globals.css.
 */
import type { SiteTheme } from "@/types";

/** The colour variables of one palette (normal or dark) */
function colorVars(c: SiteTheme["colors"]): Record<string, string> {
  return {
    "--background": c.background,
    "--foreground": c.foreground,
    "--primary": c.primary,
    "--primary-foreground": c.primaryForeground,
    "--secondary": c.secondary,
    "--secondary-foreground": c.secondaryForeground,
    "--accent": c.accent,
    "--accent-foreground": c.foreground,
    "--muted": c.muted,
    "--muted-foreground": c.mutedForeground,
    "--border": c.border,
    "--input": c.border,
    "--ring": c.primary,
    "--card": c.card,
    "--card-foreground": c.foreground,
    "--popover": c.card,
    "--popover-foreground": c.foreground,
    "--destructive": c.danger,
    "--header-bg": c.headerBackground,
    "--header-fg": c.headerForeground,
    "--footer-bg": c.footerBackground,
    "--footer-fg": c.footerForeground,
  };
}
const css = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([k, v]) => `${k}:${v};`)
    .join("");

/**
 * The brand's own Arabic font (dashboard → Theme & design → Fonts → Arabic pages → Brand Arabic font).
 * One family for all Arabic text and headings. The file addresses were checked in lib/site-theme.ts.
 */
function brandArabicFont(theme: SiteTheme): string {
  const f = theme.typography.arabicBrandFont;
  if (!f.regular) return "";
  const faces = ([["light", 300], ["regular", 400], ["medium", 500], ["bold", 700]] as const)
    .filter(([k]) => f[k])
    .map(([k, w]) => `@font-face{font-family:"Brand Arabic";src:url("${f[k]}");font-weight:${w};font-style:normal;font-display:swap;}`)
    .join("");
  const family = `"Brand Arabic",var(--font-arabic-fallback,system-ui),sans-serif`;
  return `${faces}html[lang="ar"]{--font-arabic:${family};--font-arabic-display:${family};}`;
}

export function themeToCssVars(theme: SiteTheme): string {
  const ty = theme.typography;
  const l = theme.layout;
  const vars: Record<string, string> = {
    ...colorVars(theme.colors),
    "--radius": `${l.radius}px`,
    // Typography (used in app/globals.css)
    "--base-size": `${ty.baseSize}px`,
    "--heading-weight": String(ty.headingWeight),
    "--line-height": String(ty.lineHeight),
    "--heading-tracking": `${ty.headingLetterSpacing}em`,
    // Arabic pages (app/globals.css → "ARABIC TYPE"): line spacing and smallest label size
    "--ar-line-height": String(ty.arabicLineHeight),
    "--ar-small-size": `${ty.arabicSmallSize}px`,
    // Layout: page width (Tailwind's max-w-7xl reads this), products per row, image shape
    "--container-7xl": `${l.containerWidth}px`,
    "--grid-cols": String(l.gridColumns),
    "--product-ratio": l.productImageRatio === "portrait" ? "3 / 4" : "1 / 1",
    // Scroll reveal (app/globals.css → "SCROLL REVEAL")
    "--reveal-distance": `${l.motion.distance}px`,
    "--reveal-duration": `${l.motion.duration}s`,
    "--reveal-stagger": `${l.motion.stagger}s`,
  };
  // DARK MODE (dashboard → Theme & design → Dark mode): the same variables with the dark colours.
  // They apply while <html data-mode="dark"> (set by components/layout/ModeToggle.tsx)
  const dark = theme.darkMode.enabled ? `html[data-mode="dark"]{${css(colorVars(theme.darkMode.colors))}color-scheme:dark;}` : "";
  return `:root{${css(vars)}}${dark}${brandArabicFont(theme)}`;
}
