'use client'

import { useState } from 'react'
import { Send, X, Sparkles, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NewRequestDialogProps {
  onCreate: (request: any) => void
}

export function NewRequestDialog({ onCreate }: NewRequestDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [channel, setChannel] = useState<'WhatsApp' | 'E-mail' | 'SMS'>('WhatsApp')
  const [loading, setLoading] = useState(false)

  async function handleSendRequest(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return

    setLoading(true)

    // 1. Haal direct de ingelogde user op
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Je bent niet ingelogd.')
      setLoading(false)
      return
    }

    const userId = session.user.id

    // 2. Sla het verzoek direct op in Supabase zodat we een uniek ID krijgen
    const { data: insertedData, error } = await supabase
      .from('review_requests')
      .insert([
        {
          user_id: userId,
          name: name,
          email: email,
          phone: phone,
          channel: channel,
          status: 'pending',
        },
      ])
      .select()
      .single()

    setLoading(false)

    if (error || !insertedData) {
      alert('Fout bij opslaan van reviewverzoek.')
      return
    }

    // 3. Bouw de unieke Reputio Review Shielding link op i.p.v. direct Google
    const requestId = insertedData.id
    const feedbackUrl = `${window.location.origin}/feedback/${requestId}`
    const businessName = typeof window !== 'undefined' ? localStorage.getItem('reputio_business_name') || 'ons bedrijf' : 'ons bedrijf'

    const message = `Beste ${name},\n\nBedankt voor het vertrouwen in ${businessName}! Wij horen graag of alles naar volle tevredenheid is verlopen.\n\nZou je jouw ervaring met ons willen delen via onderstaande link?\n${feedbackUrl}\n\nAlvast hartelijk dank voor je moeite!\n\nVriendelijke groet,\nTeam ${businessName}`

    // 4. Open het gekozen kanaal met de juiste link
    if (channel === 'WhatsApp' && phone) {
      const encoded = encodeURIComponent(message)
      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank')
    } else if (channel === 'E-mail' && email) {
      const subject = encodeURIComponent(`Hoe heeft u ${businessName} ervaren?`)
      const body = encodeURIComponent(message)
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
    } else if (channel === 'SMS') {
      window.open(`sms:${phone}?body=${encodeURIComponent(message)}`, '_blank')
    }

    // 5. Stuur door naar het dashboardoverzicht en sluit de modal
    onCreate({
      id: insertedData.id,
      name: insertedData.name,
      email: insertedData.email || '',
      phone: insertedData.phone || '',
      channel: insertedData.channel,
      sentAt: insertedData.sent_at,
      rating: insertedData.rating,
      status: insertedData.status,
    })

    setName('')
    setEmail('')
    setPhone('')
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
      >
        <Send className="size-4" />
        <span>Nieuw Reviewverzoek</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Sparkles className="size-5" />
              <h3 className="font-semibold text-lg text-white">Reviewverzoek Aanmaken</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Vul de gegevens in om de beveiligde review-link te genereren en direct te versturen.
            </p>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Naam van de klant *</label>
                <input
                  type="text"
                  placeholder="bijv. Sanne de Vries"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">E-mailadres</label>
                <input
                  type="email"
                  placeholder="sanne@domein.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Telefoonnummer (voor WhatsApp)</label>
                <input
                  type="text"
                  placeholder="+31 6 12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Versturen via</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['WhatsApp', 'E-mail', 'SMS'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setChannel(c)}
                      className={`h-9 rounded-lg border text-xs font-medium transition-colors ${
                        channel === c
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-800 text-sm text-zinc-400 hover:text-white"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="size-4" />
                  <span>{loading ? 'Bezig...' : `Verstuur via ${channel}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}