'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    q: 'Hoe werkt het privé klachtenfilter (Review Shielding)?',
    a: 'Wanneer een klant via Reputio een beoordeling achterlaat, vragen we eerst hoeveel sterren ze willen geven. Bij 1 tot 3 sterren wordt de feedback direct naar jouw privé dashboard gestuurd in plaats van naar Google. Zo kun je het probleem intern oplossen en voorkom je een openbare negatieve review.',
  },
  {
    q: 'Hoe helpt de Gemini AI Antwoordgenerator mij?',
    a: 'Je plakt een ontvangen review in het dashboard en kiest uit 15 verschillende stijlen (zoals empathisch, zakelijk of kordaat). Onze slimme AI genereert binnen een seconde een menselijk antwoord dat je direct kunt kopiëren of aanpassen.',
  },
  {
    q: 'Wat is de Live Website Widget precies?',
    a: 'Dit is een handig stukje code dat je op je eigen website plaatst (onderdeel van het Pro VIP pakket). Hierdoor verschijnt er automatisch een mooi blok met je beste klantbeoordelingen en sterren, dat zichzelf volledig automatisch bijwerkt zodra je nieuwe reviews krijgt.',
  },
  {
    q: 'Hoe activeer ik mijn gratis Pro VIP licentie als klant van JD Premium Websites?',
    a: 'Als klant van JD Premium Websites kun je onderaan de prijzenpagina je naam en e-mailadres invullen om een Pro VIP aanvraag in te dienen. Nadat de aanvraag is goedgekeurd in het beheerderspaneel, heb je direct onbeperkt toegang tot alle Pro VIP functies.',
  },
  {
    q: 'Kan ik de QR-codes zelf gebruiken en printen?',
    a: 'Zeker. Je genereert direct je eigen bedrijfs-QR-code in het dashboard gekoppeld aan je Google Review URL. Ideaal om te printen voor aan de balie, op facturen of op visitekaartjes.',
  },
  {
    q: 'Zit ik ergens aan vast?',
    a: 'Nee. Alle betaalde abonnementen zijn maandelijks opzegbaar. Je zit nergens langdurig aan vast en kunt op elk moment op- of afschalen.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-b border-zinc-800/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-sm font-medium text-indigo-400">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">Veelgestelde vragen</h2>
          <p className="mt-4 text-pretty text-zinc-400">
            Staat je vraag er niet tussen? Mail ons via{' '}
            <a href="mailto:jdpremiumwebsites@gmail.com" className="text-zinc-200 underline underline-offset-4">
              jdpremiumwebsites@gmail.com
            </a>
            .
          </p>
        </div>
        <Accordion className="rounded-2xl border border-zinc-800 bg-card/40 px-6">
          {faqs.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border-zinc-800">
              <AccordionTrigger className="py-5 text-base hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="pb-5 leading-relaxed text-zinc-400">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}