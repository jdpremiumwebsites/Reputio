'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { TrendingUp, Star } from 'lucide-react'

const WEEKS_PER_YEAR = 52
const RESPONSE_RATE = 0.35
const POSITIVE_SHARE = 0.8
const NEW_CUSTOMERS_PER_REVIEW = 0.12
const AVERAGE_ORDER_VALUE = 350

const numberFormat = new Intl.NumberFormat('nl-NL')
const currencyFormat = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function RoiCalculator() {
  const [customers, setCustomers] = useState(25)

  const reviewsPerYear = Math.round(customers * WEEKS_PER_YEAR * RESPONSE_RATE * POSITIVE_SHARE)
  const extraCustomers = Math.round(reviewsPerYear * NEW_CUSTOMERS_PER_REVIEW)
  const revenue = extraCustomers * AVERAGE_ORDER_VALUE

  return (
    <section id="rekenmachine" className="border-b border-zinc-800/80">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-400">Rekenmachine</p>
          <h2 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">Wat levert Reputio jou op?</h2>
          <p className="mt-4 max-w-md text-pretty text-zinc-400">
            Verschuif de slider en zie direct hoeveel extra 5-sterren reviews en omzet je kunt verwachten op basis van
            gemiddelden van onze klanten.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-zinc-500">
            <li>{`${RESPONSE_RATE * 100}% van de klanten reageert op een verzoek`}</li>
            <li>{`${POSITIVE_SHARE * 100}% daarvan geeft 4 of 5 sterren`}</li>
            <li>{`Gemiddelde orderwaarde: ${currencyFormat.format(AVERAGE_ORDER_VALUE)}`}</li>
          </ul>
        </div>

        <div className="glow-card rounded-2xl border border-zinc-800 bg-card/60 p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="customers-slider" className="text-sm font-medium text-zinc-300">
              Aantal klanten per week
            </label>
            <output htmlFor="customers-slider" className="font-heading text-3xl font-semibold tabular-nums">
              {customers}
            </output>
          </div>
          <Slider
            id="customers-slider"
            className="mt-6"
            min={5}
            max={100}
            step={1}
            value={[customers]}
            onValueChange={(value) => setCustomers(Array.isArray(value) ? value[0] : value)}
            aria-label="Aantal klanten per week"
          />
          <div className="mt-2 flex justify-between text-xs text-zinc-600">
            <span>5</span>
            <span>100</span>
          </div>

          <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 sm:grid-cols-2">
            <div className="bg-background/80 p-5">
              <dt className="flex items-center gap-2 text-xs text-zinc-400">
                <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                Extra 5-sterren reviews per jaar
              </dt>
              <dd className="mt-2 font-heading text-3xl font-semibold tabular-nums">
                {`+${numberFormat.format(reviewsPerYear)}`}
              </dd>
            </div>
            <div className="bg-background/80 p-5">
              <dt className="flex items-center gap-2 text-xs text-zinc-400">
                <TrendingUp className="size-3.5 text-emerald-400" aria-hidden="true" />
                Geschatte extra omzet per jaar
              </dt>
              <dd className="mt-2 font-heading text-3xl font-semibold text-emerald-400 tabular-nums">
                {currencyFormat.format(revenue)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-zinc-500">
            {`≈ ${numberFormat.format(extraCustomers)} nieuwe klanten via betere vindbaarheid. Indicatie, geen garantie.`}
          </p>
        </div>
      </div>
    </section>
  )
}
