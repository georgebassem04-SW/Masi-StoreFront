/**
 * SIDE MENU — the ☰ button opens this panel from the side (phones and tablets, and computers when
 * dashboard → Header → Positions → "Side menu button" is on).
 * ------------------------------------------------------------------
 * Two looks, chosen in dashboard → Header → Side menu (theme.header.sideMenu):
 *   "editorial" = large title-font links, small numbers 01–10, quiet row of links at the bottom (MASI)
 *   "utility"   = search, main links, category buttons, account links, language, phone/WhatsApp (original)
 * Tapping a link closes the menu.
 *
 * Where to edit:
 *   - Look, width, links, numbers, size, bottom row, which parts show -> dashboard → Header → Side menu
 *   - Categories            -> come from the dashboard (Categories)
 *   - Fixed texts (AR/EN)   -> i18n/dictionaries/*.json -> "nav" (or dashboard → Theme & design → Texts)
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { MessageCircle, Phone, Search, UserRound } from "lucide-react";
import { DEFAULT_ICONS, iconFor } from "@/lib/icon-library";
import type { Locale, ThemeSideMenu } from "@/types";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

type MenuLink = { href: string; label: string };

/** The side-menu options with the words already in the visitor's language (Header.tsx does that) */
export type SideMenuLook = Omit<ThemeSideMenu, "items" | "bottomLinks" | "note"> & { items: MenuLink[]; bottomLinks: MenuLink[]; note: string };

interface Props {
  locale: Locale;
  storeName: string;
  links: MenuLink[];
  categories: MenuLink[];
  labels: {
    menu: string;
    close: string;
    categories: string;
    search: string;
    searchPlaceholder: string;
    myAccount: string;
    orders: string;
    login: string;
    register: string;
    switchLanguage: string;
    language: string;
  };
  phone: string;
  whatsapp?: string;
  /** The ☰ button's drawing — id from the icon library (dashboard → Header → Icons) */
  menuIcon?: string;
  /** true = the ☰ button also shows on computers (dashboard → Header → Positions → "Side menu button") */
  desktop?: boolean;
  /** Size of the ☰ drawing (Header → Icons → size). Missing = the original size */
  iconClass?: string;
  /** dashboard → Header → Side menu */
  look: SideMenuLook;
}

/** Editorial link sizes: font size / line height in px */
const ITEM_SIZE = { md: [24, 28], lg: [30, 34.5], xl: [36, 41] } as const;

export function MobileMenu({ locale, storeName, links, categories, labels, phone, whatsapp, menuIcon = DEFAULT_ICONS.menu, desktop = false, iconClass = "size-6", look }: Props) {
  const MenuIcon = iconFor("menu", menuIcon)!;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const editorial = look.style === "editorial";

  // Close the menu whenever the page changes
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === `/${locale}` ? pathname === href : pathname.startsWith(href.split("?")[0]));
  const isOutside = (href: string) => /^(https?:|mailto:|tel:)/.test(href);
  // Panel width on computers (phones: 85% of the screen)
  const widthStyle = { "--menu-width": `${look.width}px` } as CSSProperties;

  const trigger = (
    <SheetTrigger asChild>
      <button type="button" aria-label={labels.menu} className={desktop ? "nav-link flex size-10 items-center justify-center" : "flex size-10 items-center justify-center lg:hidden"}>
        <MenuIcon className={iconClass} />
      </button>
    </SheetTrigger>
  );

  /* ===================== EDITORIAL (MASI) ===================== */
  if (editorial) {
    const items = look.items.length ? look.items : links;
    const caps = locale === "ar" ? "" : "uppercase tracking-[0.18em]";
    const [size, lineHeight] = ITEM_SIZE[look.itemSize];
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {trigger}
        <SheetContent
          side="start"
          closeLabel={labels.close}
          style={widthStyle}
          className="w-[88%] max-w-none border-e-0 text-foreground shadow-2xl sm:w-[var(--menu-width)]"
          overlayClassName="bg-black/25 backdrop-blur-[2px]"
          // Round ghost button at the top start (instead of a small × at the end)
          closeClassName="start-6 end-auto top-6 flex size-10 items-center justify-center rounded-full border border-foreground/20 p-0 opacity-100 hover:bg-foreground/5"
        >
          <SheetTitle className="sr-only">{storeName}</SheetTitle>
          <SheetDescription className="sr-only">{labels.menu}</SheetDescription>

          <nav className="flex-1 overflow-y-auto px-8 pb-8 pt-24 sm:px-10">
            <ul className="flex flex-col gap-3">
              {items.map((l, i) => (
                <li key={`${l.href}-${i}`} className="flex items-baseline gap-4">
                  {look.numbered && <span className="w-5 shrink-0 text-[10px] tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>}
                  <SheetClose asChild>
                    <Link
                      href={l.href}
                      {...(isOutside(l.href) && l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="transition-opacity hover:opacity-60"
                      style={{ fontFamily: "var(--font-heading)", fontWeight: 300, fontSize: size, lineHeight: `${lineHeight}px`, letterSpacing: locale === "ar" ? 0 : "0.15px" }}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quiet bottom row: Our Story · Stores · Account · Studio … EST · Cairo · 26 */}
          {(look.bottomLinks.length > 0 || look.note || look.showLanguage) && (
            <div className={cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t px-8 py-6 text-[10px] text-muted-foreground sm:px-10", caps)}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {look.bottomLinks.map((l, i) => (
                  <span key={`${l.href}-${i}`} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>·</span>}
                    <SheetClose asChild>
                      <Link href={l.href} className="transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </SheetClose>
                  </span>
                ))}
                {look.showLanguage && (
                  <span className="flex items-center gap-2">
                    {look.bottomLinks.length > 0 && <span aria-hidden>·</span>}
                    <LanguageSwitcher locale={locale} label={labels.switchLanguage} />
                  </span>
                )}
              </div>
              {look.note && <span dir="auto">{look.note}</span>}
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  /* ===================== UTILITY (original) ===================== */
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger}

      <SheetContent side="start" closeLabel={labels.close} style={widthStyle} className="max-w-none text-foreground sm:w-[var(--menu-width)]">
        <SheetHeader>
          <SheetTitle>{storeName}</SheetTitle>
          <SheetDescription className="sr-only">{labels.menu}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* Search */}
          {look.showSearch && (
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/${locale}/products${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border px-3"
            >
              <Search className="size-4 text-muted-foreground" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={labels.searchPlaceholder}
                aria-label={labels.search}
                className="h-11 flex-1 bg-transparent text-base outline-none"
              />
            </form>
          )}

          {/* Main links (the side menu's own list when set, else the top menu's links) */}
          <nav>
            <ul className="space-y-1">
              {(look.items.length ? look.items : links).map((l, i) => (
                <li key={`${l.href}-${i}`}>
                  <SheetClose asChild>
                    <Link href={l.href} className={cn("block rounded-lg px-3 py-3 text-base font-medium hover:bg-muted", isActive(l.href) && "bg-secondary")}>
                      {l.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          {look.showCategories && categories.length > 0 && (
            <div>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{labels.categories}</p>
              <ul className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <li key={c.href}>
                    <SheetClose asChild>
                      <Link href={c.href} className={cn("block rounded-lg border px-3 py-2.5 text-sm hover:border-primary", isActive(c.href) && "border-primary bg-secondary")}>
                        {c.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Account */}
          {look.showAccount && (
            <div className="space-y-1 border-t pt-4">
              <SheetClose asChild>
                <Link href={`/${locale}/account`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted">
                  <UserRound className="size-5 text-primary" />
                  {labels.myAccount}
                </Link>
              </SheetClose>
              <div className="flex gap-2 px-3 pt-1 text-sm">
                <SheetClose asChild>
                  <Link href={`/${locale}/login`} className="text-primary hover:underline">{labels.login}</Link>
                </SheetClose>
                <span className="text-muted-foreground">·</span>
                <SheetClose asChild>
                  <Link href={`/${locale}/register`} className="text-primary hover:underline">{labels.register}</Link>
                </SheetClose>
              </div>
            </div>
          )}
        </div>

        {/* Bottom: language + contact */}
        {(look.showLanguage || (look.showContact && (phone || whatsapp))) && (
          <div className="space-y-3 border-t p-4 text-sm">
            {look.showLanguage && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{labels.language}</span>
                <span className="rounded-md border px-3 py-1.5">
                  <LanguageSwitcher locale={locale} label={labels.switchLanguage} />
                </span>
              </div>
            )}
            {look.showContact && (phone || whatsapp) && (
              <div className="flex gap-2">
                {phone && (
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="flex flex-1 items-center justify-center gap-2 rounded-md border py-2.5 hover:bg-muted">
                    <Phone className="size-4" /> <bdi dir="ltr">{phone}</bdi>
                  </a>
                )}
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center rounded-md border px-4 text-emerald-600 hover:bg-muted">
                    <MessageCircle className="size-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
