'use client'

import { useState } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, Leaf, Lock, RotateCcw, Send, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Stage = 'rating' | 'positive' | 'negative' | 'sent'

const ratingLabels = ['Slecht', 'Matig', 'Gemiddeld', 'Goed', 'Uitstekend']

export function ReviewDemo() {
  const [stage, setStage] = useState<Stage>('rating')
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [feedback, setFeedback] = useState('')

  function handleRate(value: number) {
    setRating(value)
    if (value >= 4) {
      setStage('positive')
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!prefersReduced) {
        confetti({
          particleCount: 110,
          spread: 75,
          startVelocity: 38,
          origin: { y: 0.55 },
          colors: ['#6366F1', '#34D399', '#FBBF24', '#FFFFFF'],
          disableForReducedMotion: true,
        })
      }
    } else {
      setStage('negative')
    }
  }

  function reset() {
    setStage('rating')
    setRating(0)
    setHovered(0)
    setFeedback('')
  }

  const display = hovered || rating

  return (
    <div id="demo" className="relative scroll-mt-24">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-300">Ervaar de 5-Sterren Review Motor</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
          Live demo
        </span>
      </div>

      <motion.div
        layout
        transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
        className="glow-card overflow-hidden rounded-2xl border border-zinc-800 bg-card/80 shadow-2xl shadow-black/40 backdrop-blur"
      >
        <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <Leaf className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Hoveniersbedrijf De Groene Hand</p>
            <p className="text-xs text-zinc-500">reputio.nl/r/de-groene-hand</p>
          </div>
        </div>

        <div className="p-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {stage === 'rating' && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <p className="text-lg font-medium text-pretty">
                  Hoe was je ervaring met Hoveniersbedrijf De Groene Hand?
                </p>
                <div
                  role="radiogroup"
                  aria-label="Beoordeling in sterren"
                  className="mt-6 flex justify-center gap-1.5"
                  onMouseLeave={() => setHovered(0)}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={`${value} ${value === 1 ? 'ster' : 'sterren'} — ${ratingLabels[value - 1]}`}
                      onMouseEnter={() => setHovered(value)}
                      onFocus={() => setHovered(value)}
                      onBlur={() => setHovered(0)}
                      onClick={() => handleRate(value)}
                      className="rounded-lg p-1.5 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Star
                        className={cn(
                          'size-9 transition-colors sm:size-10',
                          value <= display ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-zinc-700',
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-3 h-5 text-sm text-zinc-500">
                  {display ? ratingLabels[display - 1] : 'Klik op een ster'}
                </p>
              </motion.div>
            )}

            {stage === 'positive' && (
              <motion.div
                key="positive"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-4 text-lg font-medium">Geweldig! Bedankt voor je vertrouwen.</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Wil je jouw {rating}-sterren ervaring delen met andere klanten?
                </p>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-zinc-200"
                >
                  <GoogleG />
                  Plaats direct op Google Reviews
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </motion.div>
            )}

            {stage === 'negative' && (
              <motion.form
                key="negative"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  if (feedback.trim()) setStage('sent')
                }}
              >
                <p className="text-lg font-medium text-pretty">
                  Wat jammer dat het niet perfect was. Hoe kunnen we dit direct voor je oplossen?
                </p>
                <label htmlFor="private-feedback" className="sr-only">
                  Jouw feedback
                </label>
                <textarea
                  id="private-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  required
                  placeholder="Vertel ons wat er beter kon…"
                  className="mt-4 w-full resize-none rounded-lg border border-zinc-800 bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-zinc-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
                <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Lock className="size-3" aria-hidden="true" />
                  Alleen zichtbaar voor de eigenaar — niet openbaar.
                </p>
                <button
                  type="submit"
                  disabled={!feedback.trim()}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="size-4" aria-hidden="true" />
                  Verstuur Privé Feedback
                </button>
              </motion.form>
            )}

            {stage === 'sent' && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                  <Lock className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-lg font-medium">Bedankt, je feedback is privé ontvangen.</p>
                <p className="mt-1 text-sm text-pretty text-zinc-400">
                  De eigenaar neemt binnen 24 uur contact met je op. Er is niets op Google verschenen.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800 bg-background/40 px-5 py-3 text-xs text-zinc-500">
          <span>
            {stage === 'rating' && '4–5 sterren → Google · 1–3 sterren → privé'}
            {stage === 'positive' && 'Doorgestuurd naar Google'}
            {(stage === 'negative' || stage === 'sent') && 'Opgevangen vóór publicatie'}
          </span>
          {stage !== 'rating' && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded px-1 text-zinc-400 hover:text-foreground"
            >
              <RotateCcw className="size-3" aria-hidden="true" />
              Opnieuw
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  )
}
