import { ArrowRight, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

export const JD_URL = 'https://www.jdpremiumwebsites.nl'

type Props = { className?: string; compact?: boolean }

export function JdBanner({ className, compact = false }: Props) {
  return (
    <aside
      aria-label="Exclusief voordeel via JD Premium Websites"
      className={cn(
        'glow-card relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] backdrop-blur-xl',
        compact ? 'p-5' : 'p-6 sm:p-8',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
      />
      <div className={cn('flex flex-col gap-5', !compact && 'md:flex-row md:items-center md:justify-between md:gap-8')}>
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Gift className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-medium tracking-wide text-emerald-400 uppercase">Exclusief Voordeel</p>
            <p className={cn('mt-1.5 text-pretty text-zinc-200', compact ? 'text-sm' : 'text-base')}>
              Een gratis Pro-licentie van Reputio{' '}
              <span className="text-zinc-400">(t.w.v. €228/jaar)</span> is standaard inbegrepen bij alle webdesign- en
              ontwikkelpakketten van JD Premium Websites.
            </p>
          </div>
        </div>
        <a
          href={JD_URL}
          target="_blank"
          rel="noopener"
          className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 text-sm font-medium text-emerald-200 transition-all hover:scale-[1.01] hover:border-emerald-400/70 hover:bg-emerald-500/15 active:scale-[0.98]"
        >
          Bekijk Webdesign Pakketten bij JD Premium Websites
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </aside>
  )
}
