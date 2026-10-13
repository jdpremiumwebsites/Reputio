'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Crown, Settings, LogOut, QrCode, ExternalLink, AlertCircle, Loader2, ShieldCheck, UserCheck, HelpCircle, Mail, User } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { Logo } from '@/components/reputio/logo'
import { KpiCards } from './kpi-cards'
import { NewRequestDialog } from './new-request-dialog'
import { RequestsTable } from './requests-table'
import { WidgetGenerator } from '@/components/dashboard/widget-generator'
import { ComplaintsSection } from '@/components/dashboard/complaints-section'
import { AiResponseGenerator } from '@/components/dashboard/ai-response-generator'
import { type ReviewRequest } from './data'
import { supabase } from '@/lib/supabase'

interface VipRequest {
  id: string
  name: string
  email: string
  status: string
  created_at: string
}

export function DashboardView() {
  const router = useRouter()
  const [bezig, setBezig] = useState(true)
  const [gebruikerId, setGebruikerId] = useState<string | null>(null)
  const [bedrijfsnaam, setBedrijfsnaam] = useState('')
  const [eigenaarNaam, setEigenaarNaam] = useState('')
  const [googlePlaatsUrl, setGooglePlaatsUrl] = useState('')
  const [isVip, setIsVip] = useState(false)
  const [isBeheerder, setIsBeheerder] = useState(false)
  const [verzoeken, setVerzoeken] = useState<ReviewRequest[]>([])

  // VIP Aanvragen van website
  const [vipAanvragen, setVipAanvragen] = useState<VipRequest[]>([])

  const [melding, setMelding] = useState<string | null>(null)
  const [vipFout, setVipFout] = useState('')
  const [toonInstellingenModal, setToonInstellingenModal] = useState(false)
  const [toonUitlegWidgetModal, setToonUitlegWidgetModal] = useState(false)

  // Beheerderspaneel handmatig e-mail toevoegen
  const [beheerderEmailInput, setBeheerderEmailInput] = useState('')
  const [beheerderBezig, setBeheerderBezig] = useState(false)
  const [beheerderBericht, setBeheerderBericht] = useState<{ type: 'succes' | 'fout'; tekst: string } | null>(null)

  async function laadGebruikersGegevens() {
    const { data: { session }, error: sessieFout } = await supabase.auth.getSession()

    if (sessieFout || !session) {
      router.push('/inloggen')
      return
    }

    const huidigeGebruikerId = session.user.id
    setGebruikerId(huidigeGebruikerId)

    const gebruikersMetadata = session.user.user_metadata || {}

    // Haal profiel op uit de database
    const { data: profiel } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', huidigeGebruikerId)
      .maybeSingle()

    if (profiel) {
      setEigenaarNaam(profiel.owner_name || gebruikersMetadata.owner_name || '')
      setBedrijfsnaam(profiel.business_name || gebruikersMetadata.business_name || '')
      setGooglePlaatsUrl(profiel.google_url || gebruikersMetadata.google_url || '')
      setIsVip(profiel.is_vip ?? gebruikersMetadata.is_vip ?? false)
      setIsBeheerder(profiel.is_admin || false)

      // Als de gebruiker beheerder is, laad dan ook de inkomende VIP-aanvragen in
      if (profiel.is_admin) {
        laadVipAanvragen()
      }
    } else {
      setEigenaarNaam(gebruikersMetadata.owner_name || '')
      setBedrijfsnaam(gebruikersMetadata.business_name || '')
      setGooglePlaatsUrl(gebruikersMetadata.google_url || '')
      setIsVip(gebruikersMetadata.is_vip || false)
    }

    // Haal reviewverzoeken op uit de database
    const { data: verzoekenData } = await supabase
      .from('review_requests')
      .select('*')
      .eq('user_id', huidigeGebruikerId)
      .order('sent_at', { ascending: false })

    if (verzoekenData) {
      const geformatteerdeVerzoeken: ReviewRequest[] = verzoekenData.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email || '',
        phone: r.phone || '',
        channel: r.channel,
        sentAt: r.sent_at,
        rating: r.rating,
        status: r.status,
        feedback_text: r.feedback_text,
      }))
      setVerzoeken(geformatteerdeVerzoeken)
    }
  }

  async function laadVipAanvragen() {
    const { data, error } = await supabase
      .from('vip_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setVipAanvragen(data)
    }
  }

  async function accepteerVipAanvraag(aanvraagId: string, email: string) {
    // 1. Geef VIP via de RPC functie
    const { data, error } = await supabase.rpc('grant_vip_by_email', {
      target_email: email.trim().toLowerCase(),
    })

    if (error) {
      setMelding(`Fout bij goedkeuren voor ${email}`)
      return
    }

    // 2. Zet de status van de aanvraag in de tabel op 'approved' (of verwijder hem)
    await supabase
      .from('vip_requests')
      .update({ status: 'approved' })
      .eq('id', aanvraagId)

    setMelding(`Pro VIP succesvol goedgekeurd voor ${email}!`)
    setTimeout(() => setMelding(null), 4000)
    laadVipAanvragen()
  }

  useEffect(() => {
    async function init() {
      setBezig(true)
      await laadGebruikersGegevens()
      setBezig(false)
    }
    init()
  }, [router])

  async function logUit() {
    await supabase.auth.signOut()
    router.push('/inloggen')
  }

  async function geefVipAlsBeheerder(e: React.FormEvent) {
    e.preventDefault()
    setBeheerderBericht(null)
    const doelEmail = beheerderEmailInput.trim().toLowerCase()

    if (!doelEmail) return

    setBeheerderBezig(true)

    const { data, error } = await supabase.rpc('grant_vip_by_email', {
      target_email: doelEmail,
    })

    setBeheerderBezig(false)

    if (error) {
      setBeheerderBericht({ type: 'fout', tekst: 'Fout bij toekennen.' })
    } else if (data === true) {
      setBeheerderBericht({ type: 'succes', tekst: `Pro VIP geactiveerd voor ${doelEmail}!` })
      setBeheerderEmailInput('')
    } else {
      setBeheerderBericht({
        type: 'fout',
        tekst: 'E-mailadres niet gevonden in het systeem.',
      })
    }
  }

  async function slaInstellingenOp(e: React.FormEvent) {
    e.preventDefault()
    if (!gebruikerId) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: gebruikerId,
        owner_name: eigenaarNaam,
        business_name: bedrijfsnaam,
        google_url: googlePlaatsUrl,
      })

    if (!error) {
      setToonInstellingenModal(false)
      setMelding('Bedrijfsgegevens succesvol opgeslagen!')
      setTimeout(() => setMelding(null), 3000)
    }
  }

  async function handleCreate(input: Omit<ReviewRequest, 'id' | 'sentAt' | 'rating' | 'status'>) {
    if (!gebruikerId) return

    const { data, error } = await supabase
      .from('review_requests')
      .insert([
        {
          user_id: gebruikerId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          channel: input.channel,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (!error && data) {
      const nieuwVerzoek: ReviewRequest = {
        id: data.id,
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        channel: data.channel,
        sentAt: data.sent_at,
        rating: data.rating,
        status: data.status,
      }
      setVerzoeken([nieuwVerzoek, ...verzoeken])
      setMelding(`Verzoek opgeslagen voor ${input.name}`)
      setTimeout(() => setMelding(null), 3500)
    }
  }

  async function verwijderVerzoek(verzoekId: string) {
    const { error } = await supabase
      .from('review_requests')
      .delete()
      .eq('id', verzoekId)

    if (!error) {
      setVerzoeken((prev) => prev.filter((req) => req.id !== verzoekId))
      setMelding('Reviewverzoek succesvol verwijderd')
      setTimeout(() => setMelding(null), 3000)
    }
  }

  async function verwijderMeerdereVerzoeken(ids: string[]) {
    const { error } = await supabase
      .from('review_requests')
      .delete()
      .in('id', ids)

    if (!error) {
      setVerzoeken((prev) => prev.filter((req) => !ids.includes(req.id)))
      setMelding(`${ids.length} verzoeken succesvol verwijderd`)
      setTimeout(() => setMelding(null), 3000)
    }
  }

  if (bezig) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="size-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm font-medium">Gegevens worden geladen...</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Naar home">
              <Logo />
            </Link>
            <span className="hidden h-5 w-px bg-zinc-800 sm:block" />
            <span className="font-medium text-sm text-zinc-200">{bedrijfsnaam || 'Mijn Bedrijf'}</span>
            
            {isVip && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                <Crown className="size-3 text-emerald-400" />
                Pro VIP (Actief)
              </span>
            )}

            {isBeheerder && (
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
                <ShieldCheck className="size-3 text-indigo-400" />
                Beheerder
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setToonInstellingenModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Settings className="size-3.5" />
              <span>Instellingen</span>
            </button>
            <button
              onClick={logUit}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors"
              title="Uitloggen"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
        
        {/* BEHEERDERSPANEEL: Inkomende VIP aanvragen & handmatig toevoegen */}
        {isBeheerder && (
          <div className="mb-8 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-2 text-indigo-300">
              <UserCheck className="size-5 text-indigo-400" />
              <h3 className="font-semibold text-sm">Beheerderspaneel: Inkomende Pro VIP Aanvragen</h3>
            </div>

            {/* Lijst van inkomende aanvragen via de website */}
            {vipAanvragen.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400">De volgende ondernemers hebben via de website om Pro VIP gevraagd:</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {vipAanvragen.map((aanvraag) => (
                    <div key={aanvraag.id} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-white font-medium text-xs">
                          <User className="size-3.5 text-indigo-400" />
                          <span>{aanvraag.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1">
                          <Mail className="size-3.5 text-zinc-500" />
                          <span>{aanvraag.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => accepteerVipAanvraag(aanvraag.id, aanvraag.email)}
                        className="w-full h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Crown className="size-3" />
                        <span>Accepteer Pro VIP</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400">Geen nieuwe openstaande VIP-aanvragen op dit moment.</p>
            )}

            {/* Handmatig e-mail toevoegen */}
            <div className="pt-4 border-t border-zinc-800/80">
              <p className="text-xs text-zinc-400 mb-2">Of geef handmatig Pro VIP toegang op basis van e-mailadres:</p>
              <form onSubmit={geefVipAlsBeheerder} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                <input
                  type="email"
                  placeholder="klant@bedrijf.nl"
                  value={beheerderEmailInput}
                  onChange={(e) => setBeheerderEmailInput(e.target.value)}
                  className="h-10 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={beheerderBezig}
                  className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {beheerderBezig ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Crown className="size-3.5" />
                      <span>Geef Pro VIP</span>
                    </>
                  )}
                </button>
              </form>

              {beheerderBericht && (
                <p className={`mt-2.5 text-xs font-medium ${beheerderBericht.type === 'succes' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {beheerderBericht.tekst}
                </p>
              )}
            </div>
          </div>
        )}

        {vipFout && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{vipFout}</span>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welkom, {eigenaarNaam || 'Ondernemer'}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Beheer de reviewverzoeken en online reputatie van <strong className="text-zinc-200">{bedrijfsnaam || 'jouw bedrijf'}</strong>.
            </p>
          </div>
          <NewRequestDialog onCreate={handleCreate} />
        </div>

        {/* Overzichtskaarten */}
        <div className="mt-8">
          <KpiCards requests={verzoeken} unreadComplaints={0} />
        </div>

        {/* Privé Klachtenoverzicht */}
        <ComplaintsSection requests={verzoeken} onUpdate={laadGebruikersGegevens} />

        {/* AI Review Antwoordgenerator */}
        <AiResponseGenerator />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Tabel met selectie- en verwijderfunctie */}
          <RequestsTable 
            requests={verzoeken} 
            onDeleteRequest={verwijderVerzoek} 
            onBulkDelete={verwijderMeerdereVerzoeken} 
          />

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-white">Bedrijfs QR-Code</h3>
                  <QrCode className="size-5 text-indigo-400" />
                </div>
                <p className="text-xs text-zinc-400 mb-6">
                  Laat klanten deze code scannen aan de balie of op facturen.
                </p>
                
                <div className="aspect-square w-full rounded-xl bg-white p-6 flex flex-col items-center justify-center mb-4 shadow-inner">
                  {googlePlaatsUrl ? (
                    <div className="flex flex-col items-center">
                      <QRCodeSVG 
                        value={googlePlaatsUrl} 
                        size={140} 
                        level="M"
                        includeMargin={false}
                      />
                      <span className="mt-3 text-[10px] font-bold text-zinc-800 uppercase tracking-wider">Scan & Beoordeel</span>
                    </div>
                  ) : (
                    <div className="text-center text-zinc-600 p-4">
                      <p className="text-xs font-medium text-zinc-700">Geen Google Review URL ingesteld.</p>
                      <button 
                        onClick={() => setToonInstellingenModal(true)} 
                        className="mt-2 text-xs text-indigo-600 underline font-medium"
                      >
                        Voeg toe bij Instellingen
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!googlePlaatsUrl) {
                    alert('Stel eerst je Google Review URL in via Instellingen.')
                    setToonInstellingenModal(true)
                  } else {
                    window.open(googlePlaatsUrl, '_blank')
                  }
                }}
                className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Test Google Review Link</span>
                <ExternalLink className="size-3" />
              </button>
            </div>

            {/* Live Website Widget */}
            <div className="rounded-2xl border border-zinc-800 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-sm text-white pt-1">Live Website Widget</h3>
                <button
                  onClick={() => setToonUitlegWidgetModal(true)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 text-xs font-medium transition-colors"
                >
                  <HelpCircle className="size-3.5" />
                  <span>Wat is dit?</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Toon je positieve reviews automatisch op je eigen website.
              </p>

              {isVip ? (
                <WidgetGenerator />
              ) : (
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                    <Crown className="size-5" />
                  </div>
                  <h4 className="font-semibold text-sm text-white mb-1">Pro VIP Functie</h4>
                  <p className="text-xs text-zinc-400 mb-4 max-w-xs">
                    Upgrade naar Pro VIP om deze review-widget op je website te plaatsen.
                  </p>
                  <button
                    onClick={() => setToonUitlegWidgetModal(true)}
                    className="text-xs text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <HelpCircle className="size-3.5" />
                    <span>Lees hier hoe het werkt</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Uitleg Venster voor de Live Website Widget */}
      {toonUitlegWidgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Crown className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">Wat is een Live Website Widget?</h3>
                <p className="text-xs text-zinc-400">Eenvoudig uitgelegd voor elke ondernemer.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans mb-6">
              <p>
                Een <strong>widget</strong> is een klein stukje moderne software dat je heel eenvoudig kunt toevoegen aan je eigen bedrijfswebsite (bijvoorbeeld op je startpagina of contactpagina).
              </p>
              
              <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-2">
                <p className="font-semibold text-white">🌟 Wat doet het voor jouw bedrijf?</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li>Het toont de positieve sterren en beoordelingen van jouw klanten direct op je website.</li>
                  <li>Bezoekers die jouw website bekijken zien meteen dat andere mensen super tevreden over je zijn. Dit zorgt voor enorm veel extra vertrouwen!</li>
                  <li>Het werkt helemaal automatisch: zodra je een nieuwe positieve review krijgt, past de widget zich op je website vanzelf aan.</li>
                </ul>
              </div>

              <p>
                <strong>Hoe zet je het op je website?</strong><br />
                Je hoeft alleen maar het speciale codeblokje dat hier in het dashboard wordt gegenereerd te kopiëren en te plakken in jouw website-programma (zoals WordPress, Wix of door je webbouwer te laten doen). Vrijwel direct verschijnt dan het prachtige beoordelingen-blok op je site!
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setToonUitlegWidgetModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
              >
                Begrepen, sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instellingen Scherm */}
      {toonInstellingenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="font-semibold text-lg text-white mb-1">Bedrijfsinstellingen</h3>
            <p className="text-xs text-zinc-400 mb-5">
              Pas je bedrijfsgegevens aan. Hiermee worden ook je QR-code en website-widget direct geüpdatet.
            </p>
            <form onSubmit={slaInstellingenOp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Jouw Naam</label>
                <input
                  type="text"
                  value={eigenaarNaam}
                  onChange={(e) => setEigenaarNaam(e.target.value)}
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={bedrijfsnaam}
                  onChange={(e) => setBedrijfsnaam(e.target.value)}
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Google Review Link (URL)</label>
                <input
                  type="url"
                  value={googlePlaatsUrl}
                  onChange={(e) => setGooglePlaatsUrl(e.target.value)}
                  placeholder="https://g.page/r/..."
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setToonInstellingenModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-800 text-sm text-zinc-400 hover:text-white"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meldingen balk onderin */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        <AnimatePresence>
          {melding && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="pointer-events-auto flex items-center gap-2 rounded-lg border border-zinc-800 bg-card px-4 py-3 text-sm shadow-2xl shadow-black/50"
            >
              <CheckCircle2 className="size-4 text-emerald-400" />
              {melding}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}