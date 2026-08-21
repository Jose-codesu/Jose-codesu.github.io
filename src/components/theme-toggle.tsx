'use client';

import { useTheme } from 'next-themes';

/**
 * Which icon shows is decided by CSS (`dark:` variants), not by React state.
 *
 * The usual `mounted` flag exists to avoid a hydration mismatch, but it also
 * means the button renders empty on first paint and pops in. Letting the class
 * on <html> — which next-themes sets in a blocking script before paint — drive
 * visibility gets the correct icon in the very first frame with no state at all.
 *
 * No animation on the swap: this is a control people press to compare both
 * themes, and a spin would put a delay in front of every comparison.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Switch between light and dark theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`pressable grid size-9 place-items-center rounded-full border border-line text-muted hover:border-line-strong hover:text-fg ${className ?? ''}`}
    >
      {/* Moon: shown in light mode — it is what you are switching to. */}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden className="dark:hidden">
        <path
          d="M20 14.2A8.2 8.2 0 019.8 4a8.2 8.2 0 1010.2 10.2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Sun: shown in dark mode. */}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        aria-hidden
        className="hidden dark:block"
      >
        <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 2.75v2M12 19.25v2M21.25 12h-2M4.75 12h-2M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42M18.36 18.36l-1.42-1.42M7.06 7.06L5.64 5.64"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
