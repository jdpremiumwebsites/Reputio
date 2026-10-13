'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, MessageSquare, Phone, Mail, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ComplaintsSectionProps {
  requests: any[]
  onUpdate: () => void
}

export function ComplaintsSection({ requests, onUpdate }: ComplaintsSectionProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Filter alleen de verzoeken waar een klacht / lage rating (1-3 sterren) is binnengekomen
  const complaints = requests.filter(
    (req) => req.status === 'complaint' || (req.rating && req.rating <= 3)
  )

  async function handleResolve(id: string) {
    setUpdatingId(id)
    const { error } = await supabase
      .from('review_requests')
      .update({ status: 'resolved' })
      .eq('id', id)

    setUpdatingId(null)
    if (!error) {
      onUpdate() // Ververs de data in het dashboard
    } else {
      alert('Fout bij bijwerken van klachtstatus.')
    }
  }

  if (complaints.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-card/60 p-6 backdrop-blur-xl mt-6">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <CheckCircle2 className="size-5" />
          <h3 className="font-semibold text-base text-white">Geen opgevangen klachten</h3>
        </div>
        <p className="text-xs text-zinc-400">
          Super! Er zijn momenteel geen negatieve ervaringen of klachten binnengekomen via het Review Shielding systeem.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-card/60 p-6 backdrop-blur-xl mt-6 shadow-xl shadow-rose-950/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-white">Opgevangen Klachten & Feedback</h3>
            <p className="text-xs text-zinc-400">Deze klanten gaven 1 t/m 3 sterren; hun feedback is privé opgevangen om je openbare Google-score te beschermen.</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-medium text-rose-300">
          {complaints.length} {complaints.length === 1 ? 'klacht' : 'klachten'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        {complaints.map((item) => (
          <div 
            key={item.id} 
            className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
              item.status === 'resolved' 
                ? 'border-zinc-800 bg-zinc-900/30 opacity-70' 
                : 'border-rose-500/30 bg-zinc-950/60 shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-white">{item.name}</span>
                <span className="text-amber-400 text-xs font-bold">
                  {'★'.repeat(item.rating || 0)} <span className="text-zinc-500 font-normal">({item.rating}/5)</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                {item.email && (
                  <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                    <Mail className="size-3.5" />
                    <span>{item.email}</span>
                  </a>
                )}
                {item.phone && (
                  <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                    <Phone className="size-3.5" />
                    <span>{item.phone}</span>
                  </a>
                )}
              </div>

              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-3 text-xs text-zinc-200 mb-4 italic">
                &ldquo;{item.feedback_text || 'Geen geschreven toelichting achtergelaten.'}&rdquo;
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <Clock className="size-3" />
                {new Date(item.sentAt).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>

              {item.status === 'resolved' ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  Afgehandeld
                </span>
              ) : (
                <button
                  onClick={() => handleResolve(item.id)}
                  disabled={updatingId === item.id}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>Zet op Afgehandeld</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}