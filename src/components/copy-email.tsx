'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';

/**
 * Copies the address and morphs the label in place. The label swap is masked
 * with a 2px blur: without it you see two words overlapping mid-crossfade,
 * which reads as a glitch rather than a state change.
 */
export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      toast.success('Email copied', { description: site.email });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Could not copy', { description: site.email });
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'pressable group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[12px] text-muted hover:border-line-strong hover:text-fg',
        className,
      )}
    >
      {/* `key` remounts the label so the swap animation replays on every copy. */}
      <span key={copied ? 'copied' : 'idle'} className="inline-block animate-[label-swap_220ms_ease_out_forwards]">
        {copied ? 'Copied to clipboard' : site.email}
      </span>
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden className="opacity-60">
        {copied ? (
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <rect x="5.75" y="5.75" width="7.5" height="7.5" rx="1.75" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M10.25 3.75A1.5 1.5 0 008.75 2.5h-5A1.25 1.25 0 002.5 3.75v5A1.5 1.5 0 003.75 10.25"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  );
}
