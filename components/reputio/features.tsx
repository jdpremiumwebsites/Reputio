import { BarChart3, Filter, MapPin, MessageCircle, QrCode, Zap } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Eenvoudig verzoeken versturen',
    body: 'Voeg direct vanuit je dashboard een nieuwe klant toe via naam, e-mail of telefoonnummer en verstuur je reviewverzoek in een handomdraai.',
  },
  {
    icon: Filter,
    title: 'Slimme feedbackroute',
    body: 'Tevreden klanten gaan direct naar Google. Minder tevreden klanten komen eerst privé bij jou terecht.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp & SMS links',
    body: 'Bereik klanten waar ze écht zijn. Gemiddeld 3× hogere respons dan e-mail alleen.',
  },
  {
    icon: QrCode,
    title: 'QR-code generator',
    body: 'Print-klare QR-codes met je eigen logo voor de toonbank, factuur of bedrijfsbus.',
  },
  {
    icon: BarChart3,
    title: 'Realtime inzichten',
    body: 'Volg conversie, gemiddelde score en klachten per locatie in één helder dashboard.',
  },
  {
    icon: MapPin,
    title: 'Volledig in eigen beheer',
    body: 'Pas je bedrijfsgegevens en Google Review URL eenvoudig aan. Alles synchroniseert direct met je QR-code en website-widget.',
  },
]

export function Features() {
  return (
    <section id="functies" className="border-b border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo-400">Functies</p>
          <h2 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">
            Alles om je reputatie te laten groeien. Niets wat je afleidt.
          </h2>
          <p className="mt-4 text-pretty text-zinc-400">
            Reputio draait op de achtergrond. Jij levert goed werk, wij zorgen dat de rest van Nederland het ziet.
          </p>
        </div>

        <ul className="mt-14 grid overflow-hidden rounded-2xl border border-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="group relative -mt-px -ml-px border-t border-l border-zinc-800 bg-card/40 p-7 transition-colors hover:bg-card"
            >
              <span className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-background text-zinc-300 transition-colors group-hover:border-indigo-500/40 group-hover:text-indigo-300">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
