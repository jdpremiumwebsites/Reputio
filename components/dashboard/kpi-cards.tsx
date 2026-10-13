'use client'

import { Star, TrendingUp, Send, ShieldAlert } from 'lucide-react'
import { type ReviewRequest } from './data'

interface KpiCardsProps {
  requests: ReviewRequest[]
  unreadComplaints?: number
}

export function KpiCards({ requests, unreadComplaints = 0 }: KpiCardsProps) {
  const totalRequests = requests.length
  
  // Bereken echte voltooide Google reviews en ratings
  const googleReviews = requests.filter((r) => r.status === 'google')
  const completedCount = googleReviews.length

  // Bereken gemiddelde score uit verzoeken met een rating
  const ratedRequests = requests.filter((r) => typeof r.rating === 'number' && r.rating > 0)
  const averageRating = ratedRequests.length > 0
    ? (ratedRequests.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedRequests.length).toFixed(1)
    : '5.0'

  // Conversiepercentage op basis van echte verzoeken
  const conversionRate = totalRequests > 0 ? Math.round((completedCount / totalRequests) * 100) : 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Kaart 1: Gemiddelde Score */}
      <div className="rounded-2xl border border-zinc-800 bg-card/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Gemiddelde Score</span>
          <Star className="size-4 text-amber-400 fill-amber-400" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{totalRequests > 0 ? averageRating : '—'}</span>
          <span className="text-xs text-zinc-500">/ 5.0</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          Gebaseerd op {ratedRequests.length} {ratedRequests.length === 1 ? 'beoordeling' : 'beoordelingen'}
        </p>
      </div>

      {/* Kaart 2: Google Conversie */}
      <div className="rounded-2xl border border-zinc-800 bg-card/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Google Conversie</span>
          <TrendingUp className="size-4 text-emerald-400" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{conversionRate}%</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          {completedCount} van de {totalRequests} verzoeken omgezet
        </p>
      </div>

      {/* Kaart 3: Totaal Verzonden */}
      <div className="rounded-2xl border border-zinc-800 bg-card/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Totaal Verzonden</span>
          <Send className="size-4 text-indigo-400" />
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white">{totalRequests}</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          Actieve reviewuitnodigingen
        </p>
      </div>

      {/* Kaart 4: Interne Meldingen / Klachten */}
      <div className="rounded-2xl border border-zinc-800 bg-card/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Interne Feedback</span>
          <ShieldAlert className="size-4 text-rose-400" />
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white">{unreadComplaints}</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          Opgevangen voor Google
        </p>
      </div>
    </div>
  )
}