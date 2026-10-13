'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, AlertCircle, ShieldCheck, Crown, User, Mail } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { JdBanner } from './jd-banner'
import { supabase } from '@/lib/supabase'

const plans = [
  {
    name: 'Starter (Gratis)',
    price: 0,
    description: 'Voor startende zzp’ers die willen proeven van professioneel reviewbeheer.',
    features: [
      '10 reviewverzoeken per maand',
      'Privé feedbackformulier (Klachtenfilter)',
      'Basis e-mail verzoeken',
      'Handmatig overzicht',
    ],
    cta: 'Gratis beginnen',
    popular: false,
  },
  {
    name: 'Standaard',
    price: 15,
    description: 'Ideaal voor ondernemers om online te groeien met sterren en QR-codes.',
    features: [
      'Onbeperkt reviewverzoeken versturen',
      'Privé klachtenfilter (Voorkom slechte Google reviews)',
      'Gemini AI Antwoordgenerator (15 stijlen)',
      'Eigen downloadbare QR-code voor op de balie',
      'Overzichtelijk verzoekenbeheer',
    ],
    cta: 'Start direct',
    popular: false,
  },
  {
    name: 'Pro VIP',
    price: 39,
    description: 'Voor ondernemers die maximaal willen automatiseren en reviews live op hun website willen tonen.',
    features: [
      'Alles uit het Standaard pakket',
      'Live Website Widget (Automatisch reviews tonen op je site)',
      'Bulk verzoeken selecteren en in één klik opschonen',
      'Onbeperkte toegang tot alle AI-stijlen',
      'Voorrang bij nieuwe updates en support',
    ],
    cta: 'Word Pro VIP',
    popular: true,
  },
]

const priceFormat = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function Pricing() {
  const [yearly, setYearly] = useState(false)
  const [naamInput, setNaamInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [aanvraagBezig, setAanvraagBezig] = useState(false)
  const [aanvraagStatus, setAanvraagStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })

  async function vraagVipAan(e: React.FormEvent) {
    e.preventDefault()
    setAanvraagStatus({ type: null, message: '' })

    if (!naamInput.trim() || !emailInput || !emailInput.includes('@')) {
      setAanvraagStatus({
        type: 'error',
        message: 'Vul zowel je naam als een geldig e-mailadres in.',
      })
      return
    }

    setAanvraagBezig(true)

    // Sla de aanvraag op in Supabase in een tabel genaamd 'vip_requests'
    const { error } = await supabase.from('vip_requests').insert([
      {
        name: naamInput.trim(),
        email: emailInput.trim().toLowerCase(),
        status: 'pending',
      },
    ])

    setAanvraagBezig(false)

    if (error) {
      setAanvraagStatus({
        type: 'error',
        message: 'Er ging iets mis bij het verzenden. Probeer het later opnieuw.',
      })
    } else {
      setAanvraagStatus({
        type: 'success',
        message: 'Je aanvraag voor Pro VIP is succesvol verzonden! Jaël zal je aanvraag beoordelen.',
      })
      setNaamInput('')
      setEmailInput('')
    }
  }

  return (
    <section id="prijzen" className="border-b border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-indigo-400">Prijzen</p>
          <h2 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">Eerlijke prijzen. Maandelijks opzegbaar.</h2>
          <p className="mt-4 text-pretty text-zinc-400">Kristalheldere tarieven voor elk bedrijf. Alle prijzen zijn exclusief btw.</p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-card/60 px-4 py-2 text-sm">
            <span id="billing-monthly" className={cn(!yearly ? 'text-foreground' : 'text-zinc-500')}>
              Maandelijks
            </span>
            <Switch
              checked={yearly}
              onCheckedChange={setYearly}
              aria-label="Jaarlijks factureren"
            />
            <span className={cn(yearly ? 'text-foreground' : 'text-zinc-500')}>
              Jaarlijks <span className="text-emerald-400">(20% korting)</span>
            </span>
          </div>
        </div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const monthly = yearly ? plan.price * 0.8 : plan.price
            return (
              <li
                key={plan.name}
                className={cn(
                  'glow-card relative flex flex-col justify-between rounded-2xl border bg-white/[0.02] p-8 backdrop-blur-xl',
                  plan.popular
                    ? 'border-indigo-500/50 bg-indigo-500/[0.04] shadow-[0_0_0_1px_rgb(99_102_241/0.2),0_20px_60px_-20px_rgb(99_102_241/0.45)]'
                    : 'border-zinc-800',
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-7 rounded-full border border-indigo-400/40 bg-indigo-500 px-3 py-0.5 text-xs font-medium text-white flex items-center gap-1 shadow-md">
                    <Crown className="size-3" /> Meest gekozen
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{plan.description}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-semibold tabular-nums">{priceFormat.format(monthly)}</span>
                    <span className="text-sm text-zinc-500">/mnd</span>
                  </p>
                  <p className="mt-1 h-4 text-xs text-zinc-500">
                    {yearly && plan.price > 0 ? `${priceFormat.format(monthly * 12)} jaarlijks gefactureerd` : ''}
                  </p>

                  <ul className="mt-7 space-y-3.5 border-t border-zinc-800 pt-6 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-zinc-300">
                        <Check className="mt-0.5 size-4 shrink-0 text-indigo-400" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/dashboard"
                  className={cn(
                    'mt-8 inline-flex h-11 items-center justify-center rounded-xl text-sm font-medium transition-all shadow-lg',
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/25'
                      : 'border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800',
                  )}
                >
                  {plan.cta}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* VIP Aanvraag Formulier voor JD Premium Websites klanten */}
        <div className="mt-12 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300 mb-3">
                <Crown className="size-3.5 text-indigo-400" />
                <span>Exclusieve Partner Toegang</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Vraag direct je Pro VIP licentie aan</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Als klant van <strong className="text-zinc-200">JD Premium Websites</strong> kun je hieronder je gegevens achterlaten. Je ontvangt daarna automatisch toegang tot het Pro VIP pakket nadat de aanvraag is goedgekeurd.
              </p>
            </div>

            <form onSubmit={vraagVipAan} className="flex flex-col gap-3 w-full md:w-auto min-w-[320px]">
              <div className="relative">
                <User className="absolute left-3 top-3 size-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Je volledige naam"
                  value={naamInput}
                  onChange={(e) => setNaamInput(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="Je zakelijke e-mailadres"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={aanvraagBezig}
                className="h-10 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="size-4" />
                <span>{aanvraagBezig ? 'Bezig met verzenden...' : 'Vraag Pro VIP Aan'}</span>
              </button>
            </form>
          </div>

          {aanvraagStatus.type && (
            <div
              className={cn(
                'mt-4 flex items-center gap-2 rounded-lg border p-3.5 text-sm',
                aanvraagStatus.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300',
              )}
            >
              {aanvraagStatus.type === 'success' ? (
                <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-rose-400" />
              )}
              <span>{aanvraagStatus.message}</span>
            </div>
          )}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-400">
          Klant bij JD Premium Websites?{' '}
          <span className="text-emerald-400">Vraag je Pro VIP licentie hierboven direct aan.</span>
        </p>
        <JdBanner className="mt-5" />
      </div>
    </section>
  )
}