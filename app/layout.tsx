import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google'
import { JsonLd } from '@/components/reputio/json-ld'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://reputio.nl'),
  title: 'Reputio — Automatisch meer 5-sterren Google reviews',
  description:
    'Reputio transformeert tevreden klanten automatisch in 5-sterren Google reviews en vangt negatieve feedback privé op. Bedacht, ontworpen en ontwikkeld door Jaël Dijk.',
  generator: 'v0.app',
  applicationName: 'Reputio',
  authors: [{ name: 'Jaël Dijk', url: 'https://www.jdpremiumwebsites.nl' }],
  creator: 'Jaël Dijk',
  publisher: 'Reputio',
  keywords: ['Google reviews', 'reviewbeheer', 'online reputatie', 'klantfeedback', 'QR-code reviews', 'MKB'],
  openGraph: {
    title: 'Reputio — Onverwoestbare online autoriteit',
    description: 'Transformeer tevreden klanten automatisch in 5-sterren Google reviews.',
    locale: 'nl_NL',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#080C14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${jakarta.variable} ${instrumentSerif.variable} bg-background`}>
      <body className="antialiased">
        <JsonLd />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
