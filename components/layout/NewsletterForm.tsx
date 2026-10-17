/**
 * NEWSLETTER SIGN-UP in the footer (runs in the browser).
 * Shown when dashboard → Footer → Newsletter is on (words of the box, button and thank-you line come from there).
 * TODO (backend): send the address to the shop's mailing list — today it only checks the address and says thank you.
 */
"use client";

import { useState } from "react";

export function NewsletterForm({ placeholder, button, thanks }: { placeholder: string; button: string; thanks: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  if (done) return <p className="text-center text-sm opacity-80">{thanks}</p>;
  return (
    <form
      className="mx-auto flex w-full max-w-[560px] gap-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (/^\S+@\S+\.\S+$/.test(email.trim())) setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-12 min-w-0 flex-1 border border-current/25 bg-transparent px-4 text-[13px] outline-none placeholder:opacity-50 focus:border-current/60"
      />
      <button type="submit" className="h-12 shrink-0 bg-primary px-6 text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 sm:px-10">
        {button}
      </button>
    </form>
  );
}
