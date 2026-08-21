'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { nav, site } from '@/content/site';
import { visibleProjects } from '@/content/projects';

/**
 * ⌘K palette.
 *
 * Deliberately has no open/close animation. This is the highest-frequency
 * surface on the site and it is keyboard-initiated — animating it would add
 * latency to the one interaction that must feel instant. Raycast does the same.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const run = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  const copyEmail = useCallback(() => {
    navigator.clipboard
      .writeText(site.email)
      .then(() => toast.success('Email copied', { description: site.email }))
      .catch(() => toast.error('Could not copy — your browser blocked clipboard access'));
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="pressable hidden h-9 items-center gap-2 rounded-full border border-line pr-2 pl-3.5 text-[13px] text-muted hover:border-line-strong hover:text-fg sm:inline-flex"
      >
        Search
        <kbd className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">
          ⌘K
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        // `className` lands on the cmdk root *inside* the content wrapper —
        // positioning belongs on contentClassName, not here.
        className="flex flex-col"
        overlayClassName="fixed inset-0 z-50 bg-fg/25 backdrop-blur-[2px]"
        contentClassName="fixed top-[18vh] left-1/2 z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-line-strong bg-panel shadow-2xl shadow-fg/10"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden className="text-faint">
            <circle cx="7.25" cy="7.25" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.75 10.75L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <Command.Input
            placeholder="Jump to a project, page or action…"
            className="h-12 w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-faint"
          />
        </div>

        <Command.List className="max-h-[min(420px,55vh)] overflow-y-auto overscroll-contain p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
            Nothing matches that.
          </Command.Empty>

          <Group heading="Pages">
            <Item onSelect={() => run(() => router.push('/'))}>Home</Item>
            {nav.map((item) => (
              <Item key={item.href} onSelect={() => run(() => router.push(item.href))}>
                {item.label}
              </Item>
            ))}
          </Group>

          <Group heading="Work">
            {visibleProjects.map((project) => (
              <Item
                key={project.slug}
                value={`${project.name} ${project.tagline} ${project.stack.join(' ')}`}
                onSelect={() => run(() => router.push(`/work/${project.slug}`))}
              >
                <span>{project.name}</span>
                <span className="ml-auto truncate pl-4 text-[12px] text-faint">{project.tagline}</span>
              </Item>
            ))}
          </Group>

          <Group heading="Actions">
            <Item onSelect={() => run(copyEmail)}>Copy email address</Item>
            <Item onSelect={() => run(() => router.push('/resume'))}>View résumé</Item>
            <Item
              onSelect={() => run(() => window.open(site.resumePath, '_blank', 'noopener,noreferrer'))}
            >
              Download résumé (PDF)
            </Item>
            <Item onSelect={() => run(() => window.open(site.github, '_blank', 'noopener,noreferrer'))}>
              GitHub profile
            </Item>
            <Item
              onSelect={() => run(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))}
            >
              Toggle {resolvedTheme === 'dark' ? 'light' : 'dark'} theme
            </Item>
          </Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  children,
  onSelect,
  value,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  value?: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      value={value}
      className="flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-[14px] text-fg select-none data-[selected=true]:bg-accent-soft data-[selected=true]:text-fg"
    >
      {children}
    </Command.Item>
  );
}
