'use client'

import { ArrowUpRight, BadgeCheck, ShieldCheck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FounderBadge } from './founder-badge'
import { JD_URL } from './jd-banner'

type Props = { triggerClassName?: string }

export function AboutDialog({ triggerClassName }: Props) {
  return (
    <Dialog>
      <DialogTrigger render={<button type="button" className={triggerClassName} />}>Over Reputio</DialogTrigger>
      <DialogContent className="border border-zinc-800 bg-card p-0 ring-0 sm:max-w-lg">
        <div className="border-b border-zinc-800 p-6">
          <DialogHeader>
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Over Reputio
            </p>
            <DialogTitle className="mt-2 font-serif text-3xl leading-tight font-normal">
              Gebouwd voor <em className="text-zinc-400">onverwoestbare</em> autoriteit.
            </DialogTitle>
            <DialogDescription className="mt-2 text-pretty text-zinc-400">
              Reputio is de reputation engine voor het Nederlandse MKB: van hoveniers en rijscholen tot advocaten en
              fotografen. Tevreden klanten worden 5-sterren Google reviews, minpunten worden privé opgevangen.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="grid gap-5 p-6">
          <FounderBadge />
          <blockquote className="border-l border-indigo-500/50 pl-4 text-sm leading-relaxed text-pretty text-zinc-300">
            Reputio is bedacht, ontworpen en ontwikkeld door Jaël Dijk. Gebouwd met de hoogste kwaliteitsnormen voor
            MKB-autoriteit en klantvertrouwen.
          </blockquote>
          <ul className="grid gap-2 text-sm text-zinc-400">
            {['100% AVG-proof, data gehost in de EU', 'In lijn met de Google Review-richtlijnen', 'Nederlandse support'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-emerald-400" aria-hidden="true" />
                  {item}
                </li>
              ),
            )}
          </ul>
          <a
            href={JD_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            Bezoek JD Premium Websites
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
