"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { useSound } from "@/components/providers/SoundProvider";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / insecure contexts: fall back to a hidden textarea.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** Email address as a big copy-to-clipboard button. */
export function CopyEmail({ email }: { email: string }) {
  const { play } = useSound();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const ok = await copyText(email);
    if (!ok) return;
    play("select");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onCopy}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-accent/30 bg-ink-800 p-4 text-left transition-colors hover:border-accent hover:bg-ink-700"
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-mist">
            <span className="sr-only">Copy </span>Email
          </span>
          <span className="mt-0.5 block break-all text-lg font-semibold text-fog sm:text-xl">{email}</span>
        </span>
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            copied ? "bg-accent text-accent-ink" : "bg-white/[0.07] text-fog group-hover:bg-accent group-hover:text-accent-ink"
          }`}
          aria-hidden="true"
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
      <p className="sr-only" role="status">
        {copied ? "Email address copied to clipboard" : ""}
      </p>
    </div>
  );
}
