/**
 * WISHLIST (Zustand) — pieces the visitor marked with the heart on a product page.
 * Kept in the browser (localStorage, key "wishlist-<client id>"). Shown by the heart button
 * (components/product/ProductMaison.tsx). Switch: dashboard → Product page → "Wishlist heart".
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) => set((s) => ({ slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug] })),
    }),
    { name: `wishlist-${process.env.NEXT_PUBLIC_CLIENT_ID ?? "demo"}` },
  ),
);
