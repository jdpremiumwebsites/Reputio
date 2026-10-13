import Link from 'next/link'
import { Globe } from 'lucide-react'
import { Logo } from './logo'
import { AboutDialog } from './about-dialog'
import { FounderBadge } from './founder-badge'
import { JdBanner, JD_URL } from './jd-banner'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Functies', href: '#functies' },
      { label: 'Rekenmachine', href: '#rekenmachine' },
      { label: 'Prijzen', href: '#prijzen' },
      { label: 'Live demo', href: '#demo' },
    ],
  },
  {
    title: 'Branches',
    links: [
      { label: 'Hoveniers', href: '#' },
      { label: 'Installateurs', href: '#' },
      { label: 'Kappers & salons', href: '#' },
      { label: 'Tandartsen', href: '#' },
    ],
  },
  {
    title: 'Bedrijf',
    links: [
      { label: 'Over ons', href: '#' },
      { label: 'Contact', href: 'mailto:hallo@reputio.nl' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Juridisch',
    links: [
      { label: 'Privacybeleid', href: '#' },
      { label: 'Algemene Voorwaarden', href: '#' },
      { label: 'Verwerkersovereenkomst', href: '#' },
      { label: 'Cookiebeleid', href: '#' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <JdBanner className="mb-14" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-pretty text-zinc-500">
              High-end reputation management voor het Nederlandse MKB. Meer 5-sterren reviews, minder openbare
              klachten.
            </p>
            <div className="mt-6 max-w-xs">
              <FounderBadge />
            </div>
            <AboutDialog triggerClassName="mt-4 text-sm text-indigo-300 underline-offset-4 transition-colors hover:text-indigo-200 hover:underline" />
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-medium text-zinc-200">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-500 transition-colors hover:text-zinc-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-14 border-t border-zinc-800 pt-8 text-sm text-pretty text-zinc-400">
          Ontwikkeld door <span className="font-medium text-zinc-200">Jaël Dijk</span> — Oprichter van Reputio &
          Eigenaar van{' '}
          <a
            href={JD_URL}
            target="_blank"
            rel="noopener"
            className="text-zinc-200 underline decoration-zinc-700 underline-offset-4 transition-colors hover:decoration-zinc-400"
          >
            JD Premium Websites
          </a>
          .
        </p>
        <div className="mt-6 flex flex-col gap-4 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>
            {`© ${new Date().getFullYear()} Reputio B.V. · KVK 00000000 · BTW NL000000000B01 · Amsterdam, Nederland`}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <Globe className="size-3.5" aria-hidden="true" />
            <span>Nederlands (NL)</span>
            <span aria-hidden="true">·</span>
            <span lang="nl-BE">Ook beschikbaar in België</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
