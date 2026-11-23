/**
 * FORMATTING HELPERS
 *   t(text, locale)       -> picks the Arabic or English version of a dashboard text
 *   formatPrice(...)      -> "٤٬٧٩٥ ج.م." in Arabic, "EGP 4,795" in English
 *   formatWeight(...)     -> number with up to 2 decimals
 *   formatDate(...)       -> localized date
 *   fill(template, vals)  -> fills {placeholders} in dictionary texts, e.g. "عيار {karat}"
 *   - Show decimals in prices -> change maximumFractionDigits in formatPrice
 */
import type { Locale, LocalizedText } from "@/types";

/**
 * Digits on Arabic pages (dashboard → Theme & design → Fonts → "Arabic pages" → Digits).
 * Set once from the theme: on the server by lib/site-theme.ts, in the browser by components/common/ArabicDigits.tsx.
 */
let arabicDigits: "latn" | "arab" = "latn";
export const setArabicDigits = (v: "latn" | "arab") => {
  arabicDigits = v === "arab" ? "arab" : "latn";
};

const EASTERN = "٠١٢٣٤٥٦٧٨٩";
/**
 * ONE DIGIT STYLE on Arabic pages: texts typed in the dashboard (and the fixed site texts) may mix "١٤ يوماً" and "14".
 * They are shown in the style chosen in the dashboard ("latn" = 0-9 · "arab" = ٠-٩).
 * Texts with HTML (rich text) are only turned to 0-9, never to ٠-٩ — numbers inside links / sizes must stay 0-9.
 */
export const arDigits = (s: string): string => {
  if (!s) return s;
  if (arabicDigits === "latn") {
    if (!/[٠-٩٬٫٪]/.test(s)) return s;
    return s.replace(/[٠-٩]/g, (d) => String(EASTERN.indexOf(d))).replace(/(\d)٬(?=\d)/g, "$1,").replace(/(\d)٫(?=\d)/g, "$1.").replace(/٪/g, "%");
  }
  if (s.includes("<") || !/[0-9]/.test(s)) return s;
  return s.replace(/[0-9]/g, (d) => EASTERN[Number(d)]);
};

/** Pick the right language from a dashboard text, falling back to the other language (Arabic: one digit style, see arDigits) */
export const t = (text: LocalizedText | undefined, locale: Locale): string => {
  const v = text ? text[locale] || text.ar || text.en || "" : "";
  return locale === "ar" ? arDigits(v) : v;
};

const intlLocale = (locale: Locale) => (locale === "ar" ? (arabicDigits === "arab" ? "ar-EG-u-nu-arab" : "ar-EG-u-nu-latn") : "en-US");

/**
 * ONE PRICE LOOK for the whole website (dashboard → Theme & design → Layout → Prices), e.g. "9,990 LE" / "9,990 ج.م".
 * Set once from the theme, like the digits above (server: lib/site-theme.ts · browser: components/common/ArabicDigits.tsx).
 * No own sign = the normal currency look ("EGP 9,990").
 */
type PriceLook = { symbol: { ar: string; en: string }; position: "before" | "after"; decimals: boolean };
let priceLook: PriceLook = { symbol: { ar: "", en: "" }, position: "after", decimals: false };
export const setPriceFormat = (v: PriceLook | undefined) => {
  if (v) priceLook = v;
};

export const formatPrice = (amount: number, currency: string, locale: Locale): string => {
  const digits = priceLook.decimals ? 2 : 0;
  const sign = (priceLook.symbol[locale] || "").trim();
  if (!sign) {
    return new Intl.NumberFormat(intlLocale(locale), { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
  }
  const n = new Intl.NumberFormat(intlLocale(locale), { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
  return priceLook.position === "before" ? `${sign} ${n}` : `${n} ${sign}`;
};

/**
 * Price on product cards. When the website-wide price look has its own sign (Layout → Prices), cards use it too,
 * so every price on the site looks the same. Otherwise: the cards' older own look (Product cards → sign / piastres).
 */
export const formatCardPrice = (amount: number, currency: string, locale: Locale, symbol: string, decimals: boolean): string => {
  if ((priceLook.symbol[locale] || "").trim()) return formatPrice(amount, currency, locale);
  if (!symbol) {
    return new Intl.NumberFormat(intlLocale(locale), { style: "currency", currency, minimumFractionDigits: decimals ? 2 : 0, maximumFractionDigits: decimals ? 2 : 0 }).format(amount);
  }
  const n = new Intl.NumberFormat(intlLocale(locale), { minimumFractionDigits: decimals ? 2 : 0, maximumFractionDigits: decimals ? 2 : 0 }).format(amount);
  return locale === "ar" ? `${n} ${symbol}` : `${symbol} ${n}`;
};

export const formatWeight = (grams: number, locale: Locale): string =>
  new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 2 }).format(grams);

export const formatDate = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "medium" }).format(new Date(iso));

/** Replace {placeholders} in dictionary strings: fill("عيار {karat}", { karat: 21 }) */
export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
