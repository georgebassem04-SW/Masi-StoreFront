/**
 * CLIENT SETTINGS — Masi
 * ------------------------------------------------------------------
 * Copied from king-gold.ts. Edit the values here to change how the Masi
 * website looks. Registered in config/clients/index.ts as "masi".
 *
 * Look taken from the Masi Figma file. When the dashboard runs, its Theme & design wins over this file.
 * Lines marked TODO still hold placeholder values — replace them when the
 * client sends the real details.
 */
import type { ClientConfig } from "@/types";

export const masiClient: ClientConfig = {
  // Internal id. Must match the key in config/clients/index.ts
  id: "masi",

  // ===== STORE NAME =====
  name: { ar: "ماسي", en: "Masi" },
  tagline: { ar: "مجوهرات ماسي", en: "Masi Jewelry" }, // TODO: from the Figma file

  // ===== LANGUAGES =====
  locales: ["ar", "en"],
  defaultLocale: "en", // the design is in English; Arabic is the second language

  // ===== MONEY =====
  currency: "EGP",
  vatPercent: 14, // TODO: confirm (Egypt 14, UAE 5, KSA 15)

  // ===== LOGO =====
  // Files live in public/clients/masi/. Swap for an SVG / larger PNG when the client sends one.
  branding: {
    logo: "/clients/masi/logo.svg",
    // Browser tab icon (square). The client can change it: dashboard → Header → Logo → Browser tab icon
    favicon: "/clients/masi/favicon.png",
  },

  // ===== COLOURS, FONTS, CORNERS =====
  theme: {
    colors: {
      // Same as the dashboard's starting theme (dashboard/config/theme-defaults.ts) — from the MASI Figma file
      primary: "#04231E", // deep green: buttons, links, text
      primaryForeground: "#FFFFFF",
      secondary: "#ECECE6",
      secondaryForeground: "#04231E",
      accent: "#B08D57", // soft gold
      background: "#F5F5F2", // warm off-white page
      foreground: "#04231E",
      muted: "#ECECE6",
      mutedForeground: "#4D625D",
      border: "#DCDDD6",
      headerBackground: "#F5F5F2",
      headerForeground: "#04231E",
      footerBackground: "#F5F5F2",
      footerForeground: "#04231E",
    },
    // Only cairo/tajawal/almarai + inter/playfair are allowed here (types/client.ts).
    // MASI's own fonts (Helvetica Now Display + ABC Arizona Flare) are set in the dashboard theme.
    fonts: { arabic: "cairo", latin: "inter", headingLatin: "playfair" },
    radius: "0", // square corners, like the design
  },

  // ===== LAYOUT OPTIONS =====
  layout: {
    header: "centered",
    productCard: "minimal",
    gridColumns: 4,
  },

  // ===== CONTACT DETAILS ===== TODO: placeholders — Marco will send the real ones (also editable in the dashboard)
  contact: {
    email: "info@masi.example",
    phone: "+20 100 000 0000",
    whatsapp: "+201000000000",
    address: { ar: "القاهرة، مصر", en: "Cairo, Egypt" },
    hours: { ar: "السبت – الخميس: ١١ ص – ١٠ م", en: "Sat – Thu: 11am – 10pm" },
  },

  // ===== SOCIAL MEDIA LINKS ===== TODO
  social: {
    instagram: "https://www.instagram.com/",
  },

  // ===== ON/OFF SWITCHES =====
  features: {
    showGoldPrices: false, // their site has no gold price strip
    showWeight: true,
    storePickup: true,
    guestCheckout: true,
  },
};
