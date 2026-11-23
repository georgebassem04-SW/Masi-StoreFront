/**
 * PAGE: /[locale]/stores — Our Stores
 * ------------------------------------------------------------------
 * All content comes from the dashboard page with slug "stores" (dashboard → Site pages → Stores).
 * MASI uses:
 *   page_hero -> "Our Stores" picture with the small line and the intro text
 *   branches  -> look "Store finder": "6 locations", filters, list beside the map, a story per store
 * The stores themselves: dashboard → Settings → Branches.
 */
import type { Locale } from "@/types";
import { ContentPageView, contentPageMetadata, previewToken } from "@/components/common/ContentPageView";

// The page's slug in the dashboard
const SLUG = "stores";

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/stores">) {
  return contentPageMetadata(SLUG, (await params).locale as Locale, previewToken(await searchParams));
}

export default async function StoresPage({ params, searchParams }: PageProps<"/[locale]/stores">) {
  return <ContentPageView slug={SLUG} locale={(await params).locale as Locale} preview={previewToken(await searchParams)} />;
}
