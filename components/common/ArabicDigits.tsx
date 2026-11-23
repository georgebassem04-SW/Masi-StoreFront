/**
 * Tells lib/format.ts, in the browser, which digits to use on Arabic pages and how prices look
 * (the server sets the same in lib/site-theme.ts). Placed once in app/[locale]/layout.tsx, before everything else,
 * so every price on the page looks the same.
 * Settings: dashboard → Theme & design → Fonts → "Arabic pages" → Digits · Layout → Prices.
 */
"use client";

import type { PriceFormat } from "@/types";
import { setArabicDigits, setPriceFormat } from "@/lib/format";

export function ArabicDigits({ value, price }: { value: "latn" | "arab"; price?: PriceFormat }) {
  setArabicDigits(value);
  setPriceFormat(price);
  return null;
}
