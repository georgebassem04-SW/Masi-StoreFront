/**
 * FOOTER — the area at the bottom of every page.
 * ------------------------------------------------------------------
 * Almost everything here is chosen in the dashboard → "Footer" (saved in the theme as `footer`):
 *   arrangement (columns / centred), which parts show and in what order (about · links · contact · social),
 *   text position, spacing, width, logo / name / tagline, which links and contact lines show (as text, icons only,
 *   or both — icons from lib/icon-library.ts — in a column or a row, at the start / centre / end), social icon style,
 *   transparent background,
 *   the last line (own copyright text, "Powered by", position, colour, small links) and the "back to top" button,
 *   own columns (a title + links / a short text, e.g. "Working hours"), contact lines under the logo,
 *   social icons in their own column or in a centred row above the last line, column title size.
 * Defaults (= the original design) and safety checks: lib/theme-chrome.ts
 *
 * Where the CONTENT comes from:
 *   - Store name, tagline, footer logo   -> dashboard → Theme & design → Brand
 *   - Phone, WhatsApp, email, address, hours, social links -> dashboard → Settings → Store details
 *   - Footer colours                     -> dashboard → Theme & design → Colours (and Footer → colours)
 *   - Column titles, "Powered by" (AR/EN) -> i18n/dictionaries/*.json → "footer"
 *   - Page links (FAQ, terms…)           -> dashboard → Site pages → "Show in: footer"
 * Exact sizes behind "compact / normal / spacious" etc. -> the maps below.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { FaFacebookF, FaInstagram, FaSnapchat, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import type { FooterColumn, Locale } from "@/types";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/config";
import { fill, t } from "@/lib/format";
import { getSiteTheme } from "@/lib/site-theme";
import { getStoreContact } from "@/lib/store-contact";
import { getMenuPages, pagePath } from "@/lib/site-pages";
import { cn } from "@/lib/utils";
import { Accent } from "@/components/common/Accent";
import { NewsletterForm } from "./NewsletterForm";
import { iconFor } from "@/lib/icon-library";

const SOCIAL_ICONS = { instagram: FaInstagram, facebook: FaFacebookF, tiktok: FaTiktok, x: FaXTwitter, youtube: FaYoutube, snapchat: FaSnapchat };
const SPACING = { compact: "py-6", normal: "py-8", spacious: "py-14" } as const;
/** Top part (social icons, newsletter, divider): space above and between (Footer → Spacing → "Top part") */
const TOP_SPACE = { compact: "gap-6 pt-10", normal: "gap-8 pt-12", spacious: "gap-10 pt-16 md:pt-20" } as const;
const GRID = ["", "", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-2 lg:grid-cols-4"] as const;
const LOGO_SQUARE = { sm: "size-7", md: "size-8", lg: "size-12" } as const;
const LOGO_WIDE = { sm: "h-9 max-w-[130px]", md: "h-12 max-w-[160px]", lg: "h-16 max-w-[220px]" } as const;
const HEADING_SIZE = { sm: "text-lg", md: "text-xl", lg: "text-xl md:text-2xl" } as const;
const BOTTOM = { start: "justify-start text-start", center: "justify-center text-center", between: "justify-between text-start" } as const;
const digits = (v: string) => v.replace(/\D/g, "");
/** Where the contact lines / icons sit: in a row (justify) or under each other (items) */
const CONTACT_ALIGN = {
  row: { start: "justify-start", center: "justify-center", end: "justify-end" },
  column: { start: "items-start", center: "items-center", end: "items-end" },
} as const;

export async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [{ brand, footer: f }, menuPages, { contact, social }] = await Promise.all([getSiteTheme(), getMenuPages(), getStoreContact()]);
  const p = (path: string) => (path.startsWith("#") ? path : localePath(locale, path));
  const storeName = t(brand.name, locale);
  const centered = f.layout === "centered";
  const center = centered || f.align === "center";
  const wide = brand.logoShape === "wide";
  const line = "1px solid color-mix(in srgb, var(--footer-fg) 20%, transparent)";
  const container = cn("mx-auto px-6", f.width === "full" ? "lg:px-10" : "max-w-7xl");
  const caps = f.headingStyle === "caps";
  const Heading = ({ children }: { children: ReactNode }) => (
    // "caps" (Footer → Column titles): small spaced capitals in the text font, like "INFORMATION"
    <h3 className={cn(caps ? "mb-6 font-sans text-[13px] font-normal uppercase tracking-[0.06em]" : cn("mb-4", HEADING_SIZE[f.headingSize]))} style={{ color: f.headingColor || undefined }}>
      {children}
    </h3>
  );
  const link = "hover:underline";

  const footerLinks = [
    ...(f.links.home ? [{ href: p("/"), label: dict.nav.home }] : []),
    ...(f.links.products ? [{ href: p("/products"), label: dict.nav.products }] : []),
    ...(f.links.contact ? [{ href: p("/contact"), label: dict.nav.contact }] : []),
    // Pages placed in the footer from the dashboard (FAQ, terms, returns, privacy…)
    ...(f.links.pages ? menuPages.filter((m) => m.menu === "footer").map((m) => ({ href: p(pagePath(m.slug)), label: t(m.title, locale) })) : []),
    ...f.links.extra.filter((l) => l.href && t(l.label, locale)).map((l) => ({ href: p(l.href), label: t(l.label, locale) })),
  ];
  // Contact lines that are switched on AND filled in (Settings → Store details)
  const address = contact.address ? t(contact.address, locale) : "";
  const hours = contact.hours ? t(contact.hours, locale) : "";
  const contactItems = [
    f.contact.phone && contact.phone && { key: "phone" as const, name: dict.footer.phone, label: dict.footer.phone, value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}`, ltr: true },
    f.contact.whatsapp && contact.whatsapp && { key: "whatsapp" as const, name: dict.footer.whatsapp, label: dict.footer.whatsapp, value: contact.whatsapp, href: `https://wa.me/${digits(contact.whatsapp)}`, ltr: true, external: true },
    f.contact.email && contact.email && { key: "email" as const, name: dict.footer.email, label: dict.footer.email, value: contact.email, href: `mailto:${contact.email}` },
    // The address opens the map; opening hours are just shown
    f.contact.address && address && { key: "address" as const, name: dict.footer.address, label: "", value: address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, external: true },
    f.contact.hours && hours && { key: "hours" as const, name: dict.footer.hours, label: "", value: hours },
  ].filter(Boolean) as { key: "phone" | "whatsapp" | "email" | "address" | "hours"; name: string; label: string; value: string; href?: string; ltr?: boolean; external?: boolean }[];
  // In a centred footer everything is centred
  const contactAlign = centered ? "center" : f.contactAlign;
  const socialLinks = (Object.entries(social ?? {}) as [keyof typeof SOCIAL_ICONS, string][]).filter(([network, url]) => SOCIAL_ICONS[network] && url);

  /* ----- pieces used by the parts below ----- */
  const contactList = (
    <ul className={cn("flex", f.contactDirection === "row" || f.contactDisplay === "icons" ? "flex-row flex-wrap gap-x-5 gap-y-2" : "flex-col gap-1.5", CONTACT_ALIGN[f.contactDirection === "row" || f.contactDisplay === "icons" ? "row" : "column"][contactAlign])}>
      {contactItems.map((item) => {
        const Icon = iconFor(item.key, f.contactIcons[item.key])!;
        const iconBox = (
          <span className={cn("flex shrink-0 items-center justify-center", f.contactIconStyle === "circle" ? "size-9 rounded-full" : "size-5")} style={f.contactIconStyle === "circle" ? { border: line } : undefined}>
            <Icon className="size-4" />
          </span>
        );
        // "icons" = the icon alone (the detail is still read by screen readers and shown on hover)
        const inner =
          f.contactDisplay === "icons" ? (
            iconBox
          ) : (
            <>
              {f.contactDisplay === "both" ? iconBox : item.label && <span>{item.label}:</span>}
              <span dir={item.ltr ? "ltr" : undefined} className={item.key === "email" ? "break-all" : undefined}>
                {item.value}
              </span>
            </>
          );
        const className = cn("inline-flex items-center gap-2", item.href && (f.contactDisplay === "icons" ? "transition-opacity hover:opacity-70" : link));
        return (
          <li key={item.key}>
            {item.href ? (
              <a href={item.href} className={className} aria-label={`${item.name}: ${item.value}`} title={f.contactDisplay === "icons" ? item.value : undefined} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {inner}
              </a>
            ) : (
              <span className={className} aria-label={`${item.name}: ${item.value}`} title={f.contactDisplay === "icons" ? item.value : undefined}>
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );

  // Social icons: plain · in a circle · in a soft square (Footer → Social)
  const socialIcons = (centerThem: boolean) => (
    <div className={cn("flex flex-wrap gap-2", centerThem && "justify-center")}>
      {socialLinks.map(([network, url]) => {
        const Icon = SOCIAL_ICONS[network];
        return (
          <a
            key={network}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={network}
            className={cn(
              "flex items-center justify-center transition-opacity hover:opacity-70",
              f.socialStyle === "square" ? "size-11 bg-[color-mix(in_srgb,var(--footer-fg)_10%,transparent)]" : "size-9",
              f.socialStyle === "circle" && "rounded-full",
            )}
            style={f.socialStyle === "circle" ? { border: line } : undefined}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );

  const groupColumns = f.groups.map((g, i) => {
    const items = g.links.filter((l) => l.href && t(l.label, locale));
    const text = t(g.text, locale);
    if (!t(g.title, locale) && !items.length && !text) return null;
    const list =
      items.length > 0 ? (
        <ul className={centered ? "flex flex-wrap justify-center gap-x-6 gap-y-2" : caps ? "space-y-3.5 text-[13px]" : "space-y-2"}>
          {items.map((l) => (
            <li key={l.href + t(l.label, locale)}>
              <Link href={p(l.href)} className={cn(link, caps ? "opacity-75 hover:no-underline hover:opacity-100" : "opacity-80 hover:opacity-100")}>
                {t(l.label, locale)}
              </Link>
            </li>
          ))}
        </ul>
      ) : null;
    const body = (
      <>
        {list}
        {text && <p className={cn("whitespace-pre-line opacity-80", items.length > 0 && "mt-3")}>{text}</p>}
      </>
    );
    // Phones (Footer → "Fold the columns on phones"): tap the title to open the column; computers: as usual
    if (f.mobileAccordion && t(g.title, locale)) {
      return (
        <div key={`group-${i}`}>
          <details className="group/acc md:hidden" style={{ borderBottom: line }}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
              <Heading>{t(g.title, locale)}</Heading>
              <span aria-hidden className="text-lg leading-none transition-transform group-open/acc:rotate-45">+</span>
            </summary>
            <div className="pb-5">{body}</div>
          </details>
          <div className="hidden md:block">
            <Heading>{t(g.title, locale)}</Heading>
            {body}
          </div>
        </div>
      );
    }
    return (
      <div key={`group-${i}`}>
        {t(g.title, locale) && <Heading>{t(g.title, locale)}</Heading>}
        {body}
      </div>
    );
  });

  /* ----- the parts (shown in the order chosen in the dashboard) ----- */
  const parts: Record<FooterColumn, ReactNode> = {
    // Logo + name + tagline
    about:
      f.showLogo || f.showName || (f.showTagline && t(brand.tagline, locale)) ? (
        <div>
          {(f.showLogo || f.showName) && (
            <div className={cn("mb-3 flex items-center gap-2", center && "justify-center")}>
              {f.showLogo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logoOnDark || brand.logo} alt={f.showName && !wide ? "" : storeName} className={cn("object-contain", wide ? `w-auto ${LOGO_WIDE[f.logoSize]}` : LOGO_SQUARE[f.logoSize])} />
              )}
              {/* A wide logo already contains the name */}
              {f.showName && !(wide && f.showLogo) && (
                <span className="text-lg font-bold" style={{ color: f.headingColor || undefined }}>
                  {storeName}
                </span>
              )}
            </div>
          )}
          {f.showTagline && <p className="opacity-80">{t(brand.tagline, locale)}</p>}
          {/* Contact lines under the logo (Footer → Contact details → "Under the logo") */}
          {f.contactUnderAbout && contactItems.length > 0 && <div className="mt-5">{contactList}</div>}
        </div>
      ) : null,

    links: footerLinks.length ? (
      <div>
        <Heading>{dict.footer.quickLinks}</Heading>
        <ul className={centered ? "flex flex-wrap justify-center gap-x-6 gap-y-2" : "space-y-2"}>
          {footerLinks.map((l) => (
            <li key={l.href + l.label}>
              <Link href={l.href} className={link}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : null,

    // Dashboard → Settings → Store details. Which lines show, as text / icons / both, and where: Footer → Contact details
    contact:
      contactItems.length && !f.contactUnderAbout ? (
        <div>
          <Heading>{dict.footer.contact}</Heading>
          {contactList}
        </div>
      ) : null,

    // Own columns (Footer → Own columns): a title + links and / or a short text each — one grid column per group
    groups: f.groups.length ? <>{groupColumns}</> : null,

    // Only networks that have a link in Settings → Store details. "In a row" (Footer → Social) → above the last line instead
    social:
      socialLinks.length && f.socialPlacement === "column" ? (
        <div>
          <Heading>{dict.footer.followUs}</Heading>
          {socialIcons(center)}
        </div>
      ) : null,
  };
  // "groups" becomes one column per own column, so they line up with the others
  const shown = f.columns
    .flatMap((key): { key: string; node: ReactNode }[] => (key === "groups" ? groupColumns.map((node, i) => ({ key: `group-${i}`, node })) : [{ key, node: parts[key] }]))
    .filter((x) => x.node);

  // Top part (Footer → Social "At the top" + Newsletter)
  const topSocial = f.socialPlacement === "top" && socialLinks.length > 0;
  const newsletter = f.newsletter.show
    ? {
        placeholder: t(f.newsletter.placeholder, locale) || dict.footer.newsletterPlaceholder,
        button: t(f.newsletter.button, locale) || dict.footer.newsletterButton,
        thanks: t(f.newsletter.thanks, locale) || dict.footer.newsletterThanks,
      }
    : null;
  const endText = t(f.bottom.endText, locale);

  // Last line: own text ({year}, {store}) or the default "© 2026 Store name"
  const year = new Date().getFullYear();
  const copyright = t(f.bottom.text, locale) ? fill(t(f.bottom.text, locale), { year, store: storeName }) : `© ${year} ${storeName}`;

  return (
    // "Transparent" (Footer → Colours): no footer colour, the page background shows through
    <footer className={cn("mt-auto text-footer-foreground", !f.transparent && "bg-footer")} style={{ borderTop: f.borderTop ? line : undefined }}>
      {/* ===== TOP ===== social icons + newsletter + divider picture (Footer → Social "At the top" / Newsletter / Divider) */}
      {(topSocial || newsletter || f.divider) && (
        <div className={cn(container, "flex flex-col items-center", TOP_SPACE[f.topSpace])}>
          {topSocial && socialIcons(true)}
          {newsletter && <NewsletterForm {...newsletter} />}
          {f.divider && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.divider} alt="" loading="lazy" className={cn("w-full mix-blend-multiply", f.topSpace === "spacious" && "mt-6")} style={{ maxWidth: f.dividerWidth }} />
          )}
        </div>
      )}

      {shown.length > 0 && (
        <div className={cn(container, SPACING[f.spacing])}>
          <div className={cn(centered ? "flex flex-col items-center gap-8" : cn("grid", f.mobileAccordion ? "gap-0 md:gap-8" : "gap-8", GRID[Math.min(shown.length, 4)]), center && !f.mobileAccordion && "text-center", center && f.mobileAccordion && "md:text-center")}>
            {shown.map((x) => (
              <div key={x.key} className={centered ? "max-w-2xl" : undefined}>
                {x.node}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== SOCIAL ROW ===== (Footer → Social → "In a row above the last line") */}
      {f.socialPlacement === "row" && socialLinks.length > 0 && (
        <div style={{ borderTop: shown.length ? line : undefined }}>
          <div className={cn(container, "py-6")}>{socialIcons(true)}</div>
        </div>
      )}

      {/* ===== LAST LINE ===== copyright · small links · "Powered by" · back to top */}
      {/* Three parts (copyright · oval mark · own words) when the mark or the end words are on (Footer → Last line) */}
      {f.bottom.show && (f.bottom.mark || endText) && (
        <div style={{ background: f.bottom.background || undefined, color: f.bottom.foreground || undefined }}>
          <div className={cn(container, "grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-7 text-[11px] uppercase tracking-[0.12em]")}>
            <span className="opacity-80">{copyright}</span>
            {f.bottom.mark ? <span aria-hidden className="h-[26px] w-[19px] rounded-[50%] bg-current opacity-80" /> : <span />}
            <span className="text-end opacity-80">
              <Accent text={endText} />
            </span>
          </div>
        </div>
      )}

      {(f.bottom.show || f.backToTop) && !(f.bottom.show && (f.bottom.mark || endText)) && (
        <div style={{ background: f.bottom.background || undefined, color: f.bottom.foreground || undefined, borderTop: shown.length || (f.socialPlacement === "row" && socialLinks.length) ? line : undefined }}>
          <div className={cn(container, "flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-sm", BOTTOM[f.bottom.align])}>
            {f.bottom.show && <span>{copyright}</span>}
            {f.bottom.show &&
              f.bottom.links
                .filter((l) => l.href && t(l.label, locale))
                .map((l) => (
                  <Link key={l.href + t(l.label, locale)} href={p(l.href)} className={link}>
                    {t(l.label, locale)}
                  </Link>
                ))}
            {f.bottom.show && f.bottom.poweredBy && <span className="opacity-80">{dict.footer.poweredBy}</span>}
            {f.backToTop && (
              <a href="#top" className={cn("inline-flex items-center gap-1 hover:underline", f.bottom.align !== "center" && "ms-auto")}>
                <ArrowUp className="size-4" />
                {dict.footer.backToTop}
              </a>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
