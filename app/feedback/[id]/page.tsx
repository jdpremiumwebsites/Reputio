'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Star, CheckCircle2, AlertCircle, Loader2, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase'

export default function FeedbackPage() {
  const params = useParams()
  const requestId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [requestData, setRequestData] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function fetchRequest() {
      if (!requestId) return
      
      const { data, error } = await supabase
        .from('review_requests')
        .select('*, profiles(business_name, google_url, owner_name, email)')
        .eq('id', requestId)
        .maybeSingle()

      if (error || !data) {
        setErrorMsg('Dit beoordelingsverzoek kon niet worden gevonden of is verlopen.')
      } else {
        setRequestData(data)
      }
      setLoading(false)
    }
    fetchRequest()
  }, [requestId])

  async function handleRatingSelect(selectedRating: number) {
    setRating(selectedRating)

    if (!requestId) return

    if (selectedRating >= 4) {
      // 4 of 5 sterren: Sla op en stuur direct door naar Google
      await supabase
        .from('review_requests')
        .update({ rating: selectedRating, status: 'google' })
        .eq('id', requestId)

      const googleUrl = requestData?.profiles?.google_url
      if (googleUrl) {
        window.location.href = googleUrl
      } else {
        setSubmitted(true)
      }
    }
  }

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!requestId || !feedbackText.trim()) return

    setSubmitting(true)

    // 1. Sla op in Supabase
    const { error: dbError } = await supabase
      .from('review_requests')
      .update({ 
        rating: rating,
        feedback_text: feedbackText.trim(),
        status: 'complaint'
      })
      .eq('id', requestId)

    if (dbError) {
      alert(`Er ging iets mis bij het opslaan: ${dbError.message}`)
      setSubmitting(false)
      return
    }

    // 2. Verstuur e-mailnotificatie via Resend
    try {
      await fetch('/api/send-complaint-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: requestData?.profiles?.business_name || 'ons bedrijf',
          ownerEmail: requestData?.profiles?.email || '',
          customerName: requestData?.name || 'Onze klant',
          rating: rating,
          feedbackText: feedbackText.trim(),
        }),
      })
    } catch (err) {
      console.error('Fout bij versturen e-mail:', err)
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="size-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium tracking-wide">Beoordelingsomgeving laden...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 backdrop-blur-xl"
        >
          <AlertCircle className="size-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Verzoek niet gevonden</h1>
          <p className="text-sm text-zinc-400">{errorMsg}</p>
        </motion.div>
      </div>
    )
  }

  const businessName = requestData?.profiles?.business_name || 'ons bedrijf'

  return (
    <div className="min-h-dvh bg-zinc-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Subtiele achtergrond glow elementen */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
            <Sparkles className="size-3.5" />
            <span>Klanttevredenheid</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Hoe ervaart u <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">{businessName}</span>?
          </h1>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Uw mening helpt ons om onze dienstverlening continu te verbeteren. Klik op het aantal sterren.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="rating-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sterren selectie */}
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRatingSelect(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-2 transition-colors focus:outline-none"
                  >
                    <Star
                      className={`size-10 transition-colors duration-200 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                          : 'text-zinc-700 hover:text-zinc-500'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Formulier bij 1-3 sterren (Review Shielding actief) */}
              {rating > 0 && rating <= 3 && (
                <motion.form 
                  initial={{ opacity: 0, y: 15, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -15, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleFeedbackSubmit} 
                  className="space-y-5 text-left pt-2 border-t border-zinc-800/80"
                >
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-start gap-3">
                    <ShieldAlert className="size-5 shrink-0 text-rose-400 mt-0.5" />
                    <p className="leading-relaxed">
                      Het spijt ons te horen dat uw ervaring niet volledig naar wens was. Laat hieronder uw opmerking achter; onze directie pakt dit direct persoonlijk op.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                      Uw toelichting of klacht <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Vertel ons wat er misging zodat we dit direct voor u kunnen oplossen..."
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Bezig met verzenden...</span>
                      </>
                    ) : (
                      <>
                        <span>Privé feedback versturen</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="success-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hartelijk dank voor uw feedback!</h3>
              <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
                We hebben uw bericht in goede orde ontvangen en gaan hier direct persoonlijk mee aan de slag.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-8 text-center text-xs text-zinc-600 z-10">
        Beveiligd met <span className="font-semibold text-zinc-500">Reputio Review Shielding</span>
      </div>
    </div>
  )
}