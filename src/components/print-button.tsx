'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="pressable inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-line px-5 text-[14px] hover:border-line-strong hover:bg-panel"
    >
      Print / Save as PDF
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden className="opacity-60">
        <path
          d="M4.5 6V2.5h7V6M4.5 11.5h7V14h-7v-2.5zM3 6h10a1.5 1.5 0 011.5 1.5v3H1.5v-3A1.5 1.5 0 013 6z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
