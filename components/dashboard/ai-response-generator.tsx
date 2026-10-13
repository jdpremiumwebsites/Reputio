'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, Bot, RefreshCw, Edit3 } from 'lucide-react'
import { motion } from 'framer-motion'

export function AiResponseGenerator() {
  const [customerReview, setCustomerReview] = useState('')
  const [tone, setTone] = useState<string>('empathic')
  const [generatedResponse, setGeneratedResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!customerReview.trim()) return

    setIsGenerating(true)
    setError('')

    try {
      const res = await fetch('/api/generate-ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: customerReview.trim(),
          tone: tone,
          businessName: 'Reputio Partner',
        }),
      })

      const data = await res.json()

      if (res.ok && data.response) {
        setGeneratedResponse(data.response)
      } else {
        setError(data.error || 'Er ging iets mis bij het genereren.')
      }
    } catch (err) {
      console.error('API call fout:', err)
      setError('Fout bij verbinden met Gemini AI server.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedResponse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tones = [
    { id: 'empathic', label: 'Empathisch & Warm', desc: 'Meelevend en begripvol' },
    { id: 'professional', label: 'Zakelijk & Formeel', desc: 'Strak en professioneel' },
    { id: 'assertive', label: 'Kordaat & Actief', desc: 'Direct en oplossingsgericht' },
    { id: 'inviting', label: 'Uitnodigend', desc: 'Richt op een gesprek' },
    { id: 'friendly', label: 'Vriendelijk', desc: 'Ontspannen en positief' },
    { id: 'constructive', label: 'Constructief', desc: 'Focus op verbetering' },
    { id: 'apologetic', label: 'Diep Verontschuldigend', desc: 'Erkent fout en herstelt' },
    { id: 'enthusiastic', label: 'Enthousiast & Dankbaar', desc: 'Energiek voor lovende reviews' },
    { id: 'reassuring', label: 'Geruststellend', desc: 'Neemt alle twijfel weg' },
    { id: 'humorous', label: 'Subtiel Humoristisch', desc: 'Voor een lossere sfeer' },
    { id: 'concise', label: 'Ultrakort / Bondig', desc: 'Direct ter zake' },
    { id: 'formal', label: 'U-Vorm Formeel', desc: 'Uiterst correct en chique' },
    { id: 'solution_oriented', label: 'Oplossingsgericht', desc: 'Keihard gefocust op actie' },
    { id: 'de_escalating', label: 'De-escalerend', desc: 'Haalt de angel uit boosheid' },
    { id: 'vip_care', label: 'VIP / Exclusieve Zorg', desc: 'Extra attent en persoonlijk' },
  ]

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Bot className="size-5" />
        </div>
        <div>
          <h3 className="font-semibold text-base text-white">Gemini AI Review Response Generator</h3>
          <p className="text-xs text-zinc-400">Kies een stijl, genereer een antwoord en pas het gerust zelf nog aan.</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Plak de klacht of review van de klant:</label>
          <textarea
            rows={3}
            value={customerReview}
            onChange={(e) => setCustomerReview(e.target.value)}
            placeholder="Bijv: 'De service liet te wensen over en ik moest erg lang wachten...'"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3.5 text-xs text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-2">Kies de toon / stijl ({tones.length} opties):</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  tone === t.id
                    ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-600/15'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span className="text-xs font-semibold block mb-0.5">{t.label}</span>
                <span className="text-[10px] text-zinc-500 leading-tight">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating || !customerReview.trim()}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              <span>Even geduld, Gemini analyseert de review...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>Genereer uniek AI-antwoord</span>
            </>
          )}
        </motion.button>

        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs text-indigo-300 flex items-center gap-2.5"
          >
            <RefreshCw className="size-4 animate-spin text-indigo-400 shrink-0" />
            <span>Het model verwerkt de nuances van de review en past de gekozen stijl toe. Dit kan enkele seconden duren...</span>
          </motion.div>
        )}

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
            {error}
          </p>
        )}

        {generatedResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Edit3 className="size-3" />
                Gegenereerd antwoord (Direct bewerkbaar)
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-700/80 shadow-sm"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'Gekopieerd!' : 'Kopieer aangepaste tekst'}</span>
              </button>
            </div>

            {/* Bewerkbaar tekstveld */}
            <textarea
              rows={4}
              value={generatedResponse}
              onChange={(e) => setGeneratedResponse(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-all leading-relaxed font-sans"
            />
            <p className="text-[10px] text-zinc-500 mt-2">
              Tip: Je kunt deze tekst hier direct bewerken en schaven voordat je hem op Google plaatst.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}