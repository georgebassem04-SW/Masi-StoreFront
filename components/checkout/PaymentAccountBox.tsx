/**
 * INSTAPAY / BANK ACCOUNT BOX (runs in the browser)
 * ------------------------------------------------------------------
 * The account number to send the money to, with a "Copy" button, the account name and an optional "Open InstaPay"
 * button. Shown at checkout under the chosen payment method and on the order page.
 *
 * Where to edit:
 *   - The number / name / InstaPay link -> dashboard → Shipping & payment → the payment method (kind "bank transfer")
 *   - Texts (AR/EN)                     -> i18n/dictionaries/*.json -> "checkout.payAccount"
 */
"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  accountNumber: string;
  accountName?: string;
  appUrl?: string;
  /** Amount to send (order page) */
  amount?: string;
  labels: { payTo: string; accountName: string; amount: string; copy: string; copied: string; openApp: string };
  className?: string;
}

export function PaymentAccountBox({ accountNumber, accountName, appUrl, amount, labels: L, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = accountNumber.replace(/\s+/g, "");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older phones: copy through a hidden text box
      const box = document.createElement("textarea");
      box.value = text;
      box.style.position = "fixed";
      box.style.opacity = "0";
      document.body.appendChild(box);
      box.select();
      document.execCommand("copy");
      box.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className={cn("space-y-3 rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm", className)}>
      {amount && (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted-foreground">{L.amount}</span>
          <strong className="text-lg text-primary">{amount}</strong>
        </div>
      )}
      <div>
        <p className="text-muted-foreground">{L.payTo}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span dir="ltr" className="rounded-md bg-background px-3 py-2 font-mono text-base font-semibold tracking-wider select-all">
            {accountNumber}
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-primary bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            <span aria-live="polite">{copied ? L.copied : L.copy}</span>
          </button>
        </div>
      </div>
      {accountName && (
        <p>
          <span className="text-muted-foreground">{L.accountName}: </span>
          <strong>{accountName}</strong>
        </p>
      )}
      {appUrl && (
        <a href={appUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-md border px-4 font-medium hover:border-primary">
          <ExternalLink className="size-4" />
          {L.openApp}
        </a>
      )}
    </div>
  );
}
