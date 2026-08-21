import { roles } from '@/content/experience';
import { dateRange, duration } from '@/lib/format';
import { Reveal } from './reveal';

export function ExperienceList() {
  return (
    <ol className="mt-4">
      {roles.map((role, index) => (
        <Reveal
          as="li"
          key={`${role.company}-${role.title}-${role.start}`}
          delay={Math.min(index * 40, 160)}
          className="grid gap-x-10 gap-y-3 border-b border-line py-8 sm:grid-cols-[11rem_1fr]"
        >
          <div>
            <p className="font-mono text-[12px] text-faint">{dateRange(role.start, role.end)}</p>
            <p className="mt-1 font-mono text-[11px] text-faint/70">
              {duration(role.start, role.end)}
            </p>
          </div>

          <div>
            <h3 className="text-[17px] font-medium tracking-tight">{role.title}</h3>
            <p className="mt-0.5 text-[14px] text-muted">
              {role.company} · {role.location}
            </p>

            <ul className="mt-4 space-y-2">
              {role.points.map((point) => (
                <li
                  key={point}
                  className="relative max-w-2xl pl-5 text-[15px] leading-relaxed text-muted before:absolute before:top-[0.65em] before:left-0 before:size-1 before:rounded-full before:bg-faint"
                >
                  {point}
                </li>
              ))}
            </ul>

            {role.transfer && (
              <p className="mt-5 max-w-2xl border-l-2 border-accent/40 pl-4 text-[15px] leading-relaxed text-fg/80 italic">
                {role.transfer}
              </p>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
