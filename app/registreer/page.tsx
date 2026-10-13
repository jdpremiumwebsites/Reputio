'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, KeyRound, ShieldCheck, ArrowRight, Building2, User, Mail, Link as LinkIcon, Lock } from 'lucide-react'
import { Logo } from '@/components/reputio/logo'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [ownerName, setOwnerName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [googleUrl, setGoogleUrl] = useState('')
  const [vipCode, setVipCode] = useState('')
  const [vipApplied, setVipApplied] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    if (!ownerName || !businessName || !email || !password) {
      setErrorMessage('Vul alle verplichte velden in.')
      setLoading(false)
      return
    }

    let isVipActive = false
    const cleanCode = vipCode.trim().toUpperCase()

    // Als er een code is ingevuld tijdens registratie, verifieer en markeer deze
    if (cleanCode) {
      const { data: codeData } = await supabase
        .from('license_codes')
        .select('*')
        .eq('code', cleanCode)
        .eq('is_used', false)
        .maybeSingle()

      if (codeData) {
        isVipActive = true
      } else {
        setErrorMessage('Ongeldige of reeds gebruikte VIP-code.')
        setLoading(false)
        return
      }
    }

    // 1. Maak de gebruiker aan via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          owner_name: ownerName,
          business_name: businessName,
          google_url: googleUrl,
          is_vip: isVipActive,
        },
      },
    })

    if (authError) {
      setErrorMessage(authError.message)
      setLoading(false)
      return
    }

    // 2. Koppel of update de licentiecode en het profiel in Supabase
    if (authData.user) {
      await supabase.from('profiles').upsert([
        {
          id: authData.user.id,
          owner_name: ownerName,
          business_name: businessName,
          google_url: googleUrl,
          is_vip: isVipActive,
        },
      ])

      if (isVipActive && cleanCode) {
        await supabase
          .from('license_codes')
          .update({
            is_used: true,
            used_by_user_id: authData.user.id,
          })
          .eq('code', cleanCode)
      }
    }

    setLoading(false)
    router.push('/dashboard')
  }

  async function handleCheckVip() {
    setErrorMessage('')
    const cleanCode = vipCode.trim().toUpperCase()

    if (!cleanCode) {
      setErrorMessage('Voer eerst een code in.')
      return
    }

    const { data, error } = await supabase
      .from('license_codes')
      .select('id')
      .eq('code', cleanCode)
      .eq('is_used', false)
      .maybeSingle()

    if (data && !error) {
      setVipApplied(true)
      setErrorMessage('')
    } else {
      setVipApplied(false)
      setErrorMessage('Ongeldige of reeds gebruikte VIP-code.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-4">
          <Logo />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Maak je Reputio Account Aan
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Start direct met het beheren van jouw Google Reviews.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="border border-zinc-800 bg-card/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Jouw Naam *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 size-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Jan de Vries"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/80 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Bedrijfsnaam *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 size-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Hoveniersbedrijf De Groene Hand"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/80 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">E-mailadres *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="jan@uwbedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/80 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Wachtwoord *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="Minimaal 6 tekens"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/80 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Google Review URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 size-4 text-zinc-500" />
                <input
                  type="url"
                  placeholder="https://g.page/r/..."
                  value={googleUrl}
                  onChange={(e) => setGoogleUrl(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/80 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-xs font-medium text-indigo-300 mb-1 flex items-center gap-1">
                <KeyRound className="size-3.5 text-indigo-400" />
                <span>VIP Toegangscode (optioneel)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Voer licentiecode in..."
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-xs font-mono uppercase text-white focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCheckVip}
                  className="px-3 h-10 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-medium shrink-0"
                >
                  Check
                </button>
              </div>
              {vipApplied && (
                <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="size-3.5" />
                  Geverifieerd! Pro-licentie geactiveerd.
                </p>
              )}
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <span>{loading ? 'Account aanmaken...' : 'Account Aanmaken'}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500">
            Al een account?{' '}
            <Link href="/inloggen" className="text-indigo-400 hover:underline">
              Inloggen
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}