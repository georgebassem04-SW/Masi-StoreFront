/**
 * FONTS
 * ------------------------------------------------------------------
 * Every font the designer can pick in the dashboard (Theme & design → Fonts) is declared here,
 * because Next.js must know all fonts at build time. Only the chosen ones are applied, and
 * `preload: false` means unused fonts are never downloaded by visitors.
 *
 * NOTE: next/font needs every option written out in full inside each call (no shared/spread
 * options like `...o`) — it reads this file at build time.
 *
 * Each font is declared twice: once for body text and once for headings (different CSS variables):
 *   --font-arabic / --font-arabic-display    Arabic body / Arabic headings
 *   --font-latin  / --font-display           English body / English headings
 *
 * To add a font (e.g. "Amiri"):
 *   1. import it from "next/font/google" and declare it below (same pattern, both variables)
 *   2. add it to the matching lists at the bottom
 *   3. add its key to ARABIC_FONTS / LATIN_FONTS in types/theme.ts (storefront AND dashboard)
 *      and to the font options in dashboard/config/theme-defaults.ts (with the weights the font really has)
 * Fonts with ONE weight (Marcellus, DM Serif Display) have no bold of their own — the browser thickens them for bold headings.
 */
import {
  Alexandria,
  Almarai,
  Amiri,
  Aref_Ruqaa,
  Bodoni_Moda,
  Cairo,
  Changa,
  Cinzel,
  Cormorant_Garamond,
  DM_Serif_Display,
  EB_Garamond,
  El_Messiri,
  IBM_Plex_Sans_Arabic,
  Inter,
  Jost,
  Lateef,
  Libre_Baskerville,
  Lora,
  Marcellus,
  Markazi_Text,
  Montserrat,
  Noto_Kufi_Arabic,
  Noto_Naskh_Arabic,
  Playfair_Display,
  Poppins,
  Raleway,
  Readex_Pro,
  Reem_Kufi,
  Tajawal,
} from "next/font/google";
import localFont from "next/font/local";
import type { ArabicFont, LatinFont, ThemeTypography } from "@/types";

/*
 * ===== CLIENT'S OWN FONTS (files in public/fonts/<client>/) =====
 * MASI: Helvetica Now Display (text) + ABC Arizona Flare (headings and the italic words).
 *   Every weight is a real file, so bold text uses the real Bold (never a fake, thickened copy):
 *   - Helvetica Now Display: all 10 weights + italics (Hairline 50 · Thin 100 · Extra Light 200 · Light 300 · Regular 400 ·
 *     Medium 500 · Bold 700 · Extra Bold 800 · Black 900 · Extra Black 950). Semi-bold (600) shows the real Bold.
 *   - ABC Arizona Flare: one "variable" file per style that holds every weight from Thin 200 to Bold 700
 *     (made from the client's ABCArizonaFlareVariable-Trial.ttf).
 * LICENCE: both are paid fonts — a web licence is needed before going live (Arizona Flare here is the trial file).
 * next/font/local also needs the paths written out in full in each call.
 */
const helveticaNow = localFont({
  display: "swap",
  preload: false,
  variable: "--font-latin",
  fallback: ["Inter", "system-ui", "sans-serif"],
  src: [
    { path: "../public/fonts/masi/HelveticaNowDisplay-Hairline.woff2", weight: "50", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-HairlineI.woff2", weight: "50", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Thin.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ThinIta.woff2", weight: "100", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtLt.woff2", weight: "200", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtLtIta.woff2", weight: "200", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-LightIta.woff2", weight: "300", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-RegIta.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-MedIta.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-BoldIta.woff2", weight: "700", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtBdIta.woff2", weight: "800", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Black.woff2", weight: "900", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-BlackIta.woff2", weight: "900", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtBlk.woff2", weight: "950", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtBlkIta.woff2", weight: "950", style: "italic" },
  ],
});
const helveticaNowH = localFont({
  display: "swap",
  preload: false,
  variable: "--font-display",
  fallback: ["Inter", "system-ui", "sans-serif"],
  src: [
    { path: "../public/fonts/masi/HelveticaNowDisplay-Hairline.woff2", weight: "50", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-HairlineI.woff2", weight: "50", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Thin.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ThinIta.woff2", weight: "100", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtLt.woff2", weight: "200", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtLtIta.woff2", weight: "200", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-LightIta.woff2", weight: "300", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-RegIta.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-MedIta.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-BoldIta.woff2", weight: "700", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtBdIta.woff2", weight: "800", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-Black.woff2", weight: "900", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-BlackIta.woff2", weight: "900", style: "italic" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtBlk.woff2", weight: "950", style: "normal" },
    { path: "../public/fonts/masi/HelveticaNowDisplay-ExtBlkIta.woff2", weight: "950", style: "italic" },
  ],
});
/*
 * Juana (MASI's chosen serif): 8 weights, each with its italic — Thin 100 · Extra Light 200 · Light 300 · Regular 400 ·
 * Medium 500 · Semi-bold 600 · Bold 700 · Black 900. Bold text uses the real Bold file.
 * Made from the client's "Juana Fixed Files". LICENCE: demo files — a web licence is needed before going live.
 */
const juana = localFont({
  display: "swap",
  preload: false,
  variable: "--font-latin",
  fallback: ["Georgia", "serif"],
  src: [
    { path: "../public/fonts/masi/Juana-Thin.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/masi/Juana-ThinItalic.woff2", weight: "100", style: "italic" },
    { path: "../public/fonts/masi/Juana-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../public/fonts/masi/Juana-ExtraLightItalic.woff2", weight: "200", style: "italic" },
    { path: "../public/fonts/masi/Juana-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/masi/Juana-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "../public/fonts/masi/Juana-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/masi/Juana-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/masi/Juana-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/masi/Juana-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/masi/Juana-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/masi/Juana-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../public/fonts/masi/Juana-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/masi/Juana-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "../public/fonts/masi/Juana-Black.woff2", weight: "900", style: "normal" },
    { path: "../public/fonts/masi/Juana-BlackItalic.woff2", weight: "900", style: "italic" },
  ],
});
const juanaH = localFont({
  display: "swap",
  preload: false,
  variable: "--font-display",
  fallback: ["Georgia", "serif"],
  src: [
    { path: "../public/fonts/masi/Juana-Thin.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/masi/Juana-ThinItalic.woff2", weight: "100", style: "italic" },
    { path: "../public/fonts/masi/Juana-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../public/fonts/masi/Juana-ExtraLightItalic.woff2", weight: "200", style: "italic" },
    { path: "../public/fonts/masi/Juana-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/masi/Juana-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "../public/fonts/masi/Juana-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/masi/Juana-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/masi/Juana-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/masi/Juana-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/masi/Juana-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/masi/Juana-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../public/fonts/masi/Juana-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/masi/Juana-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "../public/fonts/masi/Juana-Black.woff2", weight: "900", style: "normal" },
    { path: "../public/fonts/masi/Juana-BlackItalic.woff2", weight: "900", style: "italic" },
  ],
});
const arizonaFlare = localFont({
  display: "swap",
  preload: false,
  variable: "--font-latin",
  fallback: ["Georgia", "serif"],
  src: [
    { path: "../public/fonts/masi/ArizonaFlare-Variable.woff2", weight: "200 700", style: "normal" },
    { path: "../public/fonts/masi/ArizonaFlare-VariableItalic.woff2", weight: "200 700", style: "italic" },
  ],
});
const arizonaFlareH = localFont({
  display: "swap",
  preload: false,
  variable: "--font-display",
  fallback: ["Georgia", "serif"],
  src: [
    { path: "../public/fonts/masi/ArizonaFlare-Variable.woff2", weight: "200 700", style: "normal" },
    { path: "../public/fonts/masi/ArizonaFlare-VariableItalic.woff2", weight: "200 700", style: "italic" },
  ],
});

/* ===== ARABIC — body ===== */
const cairo = Cairo({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });
const tajawal = Tajawal({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"], variable: "--font-arabic" });
const almarai = Almarai({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["400", "700", "800"], variable: "--font-arabic" });
const ibmPlexArabic = IBM_Plex_Sans_Arabic({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-arabic" });
const notoKufi = Noto_Kufi_Arabic({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });
const elMessiri = El_Messiri({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });
const readexPro = Readex_Pro({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });
// More Arabic fonts: classic naskh / calligraphy for a luxury feel, plus two modern ones
const amiri = Amiri({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-arabic" });
const notoNaskh = Noto_Naskh_Arabic({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });
const markazi = Markazi_Text({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });
const lateef = Lateef({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-arabic" });
const arefRuqaa = Aref_Ruqaa({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-arabic" });
const reemKufi = Reem_Kufi({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });
const alexandria = Alexandria({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });
const changa = Changa({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic" });

/* ===== ARABIC — headings ===== */
const cairoH = Cairo({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });
const tajawalH = Tajawal({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["500", "700", "800"], variable: "--font-arabic-display" });
const almaraiH = Almarai({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["700", "800"], variable: "--font-arabic-display" });
const ibmPlexArabicH = IBM_Plex_Sans_Arabic({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["500", "600", "700"], variable: "--font-arabic-display" });
const notoKufiH = Noto_Kufi_Arabic({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });
const elMessiriH = El_Messiri({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });
const readexProH = Readex_Pro({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });
const amiriH = Amiri({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-arabic-display" });
const notoNaskhH = Noto_Naskh_Arabic({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });
const markaziH = Markazi_Text({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });
const lateefH = Lateef({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["500", "600", "700", "800"], variable: "--font-arabic-display" });
const arefRuqaaH = Aref_Ruqaa({ display: "swap", preload: false, subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-arabic-display" });
const reemKufiH = Reem_Kufi({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });
const alexandriaH = Alexandria({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });
const changaH = Changa({ display: "swap", preload: false, subsets: ["arabic", "latin"], variable: "--font-arabic-display" });

/* ===== ENGLISH — body ===== */
const inter = Inter({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const playfair = Playfair_Display({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
// Cormorant Garamond is now a "variable" font on Google: asking for single weights breaks the build (Turbopack), so it loads all weights in one file
const cormorant = Cormorant_Garamond({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const montserrat = Montserrat({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const lora = Lora({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const poppins = Poppins({ display: "swap", preload: false, subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-latin" });
// More English fonts: luxury serifs (Cinzel, Bodoni, Garamond, Baskerville, Marcellus, DM Serif) and elegant sans (Jost, Raleway)
const cinzel = Cinzel({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const bodoniModa = Bodoni_Moda({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const ebGaramond = EB_Garamond({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const libreBaskerville = Libre_Baskerville({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const marcellus = Marcellus({ display: "swap", preload: false, subsets: ["latin"], weight: ["400"], variable: "--font-latin" });
const dmSerifDisplay = DM_Serif_Display({ display: "swap", preload: false, subsets: ["latin"], weight: ["400"], variable: "--font-latin" });
const jost = Jost({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });
const raleway = Raleway({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-latin" });

/* ===== ENGLISH — headings ===== */
const interH = Inter({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const playfairH = Playfair_Display({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const cormorantH = Cormorant_Garamond({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const montserratH = Montserrat({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const loraH = Lora({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const poppinsH = Poppins({ display: "swap", preload: false, subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display" });
const cinzelH = Cinzel({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const bodoniModaH = Bodoni_Moda({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const ebGaramondH = EB_Garamond({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const libreBaskervilleH = Libre_Baskerville({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const marcellusH = Marcellus({ display: "swap", preload: false, subsets: ["latin"], weight: ["400"], variable: "--font-display" });
const dmSerifDisplayH = DM_Serif_Display({ display: "swap", preload: false, subsets: ["latin"], weight: ["400"], variable: "--font-display" });
const jostH = Jost({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });
const ralewayH = Raleway({ display: "swap", preload: false, subsets: ["latin"], variable: "--font-display" });

type Font = { variable: string };
const arabicBody: Record<ArabicFont, Font> = { cairo, tajawal, almarai, ibmPlexArabic, notoKufi, elMessiri, readexPro, amiri, notoNaskh, markazi, lateef, arefRuqaa, reemKufi, alexandria, changa };
const arabicHeading: Record<ArabicFont, Font> = {
  cairo: cairoH,
  tajawal: tajawalH,
  almarai: almaraiH,
  ibmPlexArabic: ibmPlexArabicH,
  notoKufi: notoKufiH,
  elMessiri: elMessiriH,
  readexPro: readexProH,
  amiri: amiriH,
  notoNaskh: notoNaskhH,
  markazi: markaziH,
  lateef: lateefH,
  arefRuqaa: arefRuqaaH,
  reemKufi: reemKufiH,
  alexandria: alexandriaH,
  changa: changaH,
};
const latinBody: Record<LatinFont, Font> = { inter, playfair, cormorant, montserrat, lora, poppins, cinzel, bodoniModa, ebGaramond, libreBaskerville, marcellus, dmSerifDisplay, jost, raleway, helveticaNow, arizonaFlare, juana };
const latinHeading: Record<LatinFont, Font> = {
  inter: interH,
  playfair: playfairH,
  cormorant: cormorantH,
  montserrat: montserratH,
  lora: loraH,
  poppins: poppinsH,
  cinzel: cinzelH,
  bodoniModa: bodoniModaH,
  ebGaramond: ebGaramondH,
  libreBaskerville: libreBaskervilleH,
  marcellus: marcellusH,
  dmSerifDisplay: dmSerifDisplayH,
  jost: jostH,
  raleway: ralewayH,
  helveticaNow: helveticaNowH,
  arizonaFlare: arizonaFlareH,
  juana: juanaH,
};

/** CSS classes that switch on the 4 chosen fonts (unknown keys fall back to Cairo / Inter / Playfair) */
export function getFontClassNames(t: Pick<ThemeTypography, "arabicFont" | "arabicHeadingFont" | "latinFont" | "latinHeadingFont">): string {
  return [
    (arabicBody[t.arabicFont] ?? cairo).variable,
    (arabicHeading[t.arabicHeadingFont] ?? cairoH).variable,
    (latinBody[t.latinFont] ?? inter).variable,
    (latinHeading[t.latinHeadingFont] ?? playfairH).variable,
  ].join(" ");
}
