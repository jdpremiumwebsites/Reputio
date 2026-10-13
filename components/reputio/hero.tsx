'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Play, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { ReviewDemo } from './review-demo'

const headline = 'Bouw aan onverwoestbare online autoriteit op de automatische piloot.'
const words = headline.split(' ')
const accentFrom = words.indexOf('op')
const serifWords = new Set(['onverwoestbare', 'autoriteit'])

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pt-16 pb-20 sm:px-6 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:pb-28">
        <div>
          <motion.a
            href="#demo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 py-1 pr-3 pl-1 text-xs text-zinc-300 transition-colors hover:border-zinc-700"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="size-3" aria-hidden="true" />
            </span>
            <span className="text-pretty">
              Heb je reviews op orde <span className="text-zinc-500">—</span>{' '}
            </span>
          </motion.a>

          <h1 className="mt-6 text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-[3.5rem]">
            <span className="sr-only">{headline}</span>
            <span aria-hidden="true">
              {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className={`mr-[0.25em] inline-block ${
                    serifWords.has(word)
                      ? 'font-serif text-[1.12em] font-normal italic text-indigo-200'
                      : i >= accentFrom
                        ? 'text-zinc-500'
                        : 'text-foreground'
                  }`}
                  initial={reduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-zinc-400"
          >
            Transformeer tevreden klanten automatisch in geverifieerde 5-sterren Google reviews. Vang minpunten
            discreet privé op vóórdat ze online belanden.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/dashboard"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_rgb(129_140_248/0.5),0_8px_24px_-8px_rgb(99_102_241/0.7)] transition-all hover:scale-[1.01] hover:bg-indigo-400 active:scale-[0.98]"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Start 14 Dagen Gratis
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href="#demo"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
            >
              <Play className="size-3.5" aria-hidden="true" />
              Bekijk Live Demo
            </a>
          </motion.div>

          <motion.dl
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <dt className="sr-only">Beoordeling</dt>
              <span className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <dd>Reviews op orde</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Privacy</dt>
              <ShieldCheck className="size-4 text-emerald-400" aria-hidden="true" />
              <dd>AVG-proof, gehost in de EU</dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ReviewDemo />
        </motion.div>
      </div>
    </section>
  )
}
