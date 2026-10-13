import { BadgeCheck } from 'lucide-react'

export function FounderBadge() {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-zinc-800 bg-white/[0.02] p-3.5">
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 font-serif text-lg text-indigo-200"
      >
        JD
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-medium text-zinc-100">
          Jaël Dijk
          <BadgeCheck className="size-4 text-indigo-400" aria-label="Geverifieerd" />
        </p>
        <p className="text-xs text-zinc-500">Oprichter & Architect · CEO Reputio</p>
      </div>
    </div>
  )
}
