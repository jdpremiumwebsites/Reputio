import { SiteHeader } from '@/components/reputio/site-header'
import { Hero } from '@/components/reputio/hero'
import { Features } from '@/components/reputio/features'
import { RoiCalculator } from '@/components/reputio/roi-calculator'
import { Pricing } from '@/components/reputio/pricing'
import { Faq } from '@/components/reputio/faq'
import { SiteFooter } from '@/components/reputio/site-footer'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <RoiCalculator />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </>
  )
}
