'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/reputio/logo'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage('Onjuist e-mailadres of wachtwoord.')
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-4">
          <Logo />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Inloggen bij Reputio
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Beheer je reviews en dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="border border-zinc-800 bg-card/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">E-mailadres</label>
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
              <label className="block text-xs font-medium text-zinc-300 mb-1">Wachtwoord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/80 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <span>{loading ? 'Inloggen...' : 'Inloggen'}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500">
            Nog geen account?{' '}
            <Link href="/registreer" className="text-indigo-400 hover:underline">
              Registreer hier
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}