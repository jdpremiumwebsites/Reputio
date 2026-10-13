'use client'

import { useState, useEffect } from 'react'
import { Code, Copy, Check, Sparkles, Layout } from 'lucide-react'

export function WidgetGenerator() {
  const [businessName, setBusinessName] = useState('Mijn Bedrijf')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBusiness = localStorage.getItem('reputio_business_name')
      if (savedBusiness) setBusinessName(savedBusiness)
    }
  }, [])

  // De embed code die de klant op zijn website kan plakken
  const embedCode = `<div id="reputio-widget" data-business="${businessName}" data-theme="${theme}"></div>\n<script src="https://reputio.nl/widget.js" async></script>`

  function handleCopy() {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layout className="size-5 text-indigo-400" />
            <h3 className="font-semibold text-sm text-white">Live Website Widget</h3>
          </div>
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-300">
            Pro Feature
          </span>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Toon je live 5-sterren Google score direct op je eigen website om conversie te verhogen.
        </p>

        {/* Live Voorbeeld van de Widget */}
        <div className={`p-4 rounded-xl border mb-6 transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 text-sm mb-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                <span className={`text-xs font-bold ml-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>4.9 / 5.0</span>
              </div>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Gebaseerd op geverifieerde Google reviews van <strong className={theme === 'dark' ? 'text-zinc-200' : 'text-zinc-900'}>{businessName}</strong>
              </p>
            </div>
            <div className="text-[10px] font-medium text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded">
              Reputio
            </div>
          </div>
        </div>

        {/* Instellingen voor de widget */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Thema stijl:</span>
            <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Dark Mode
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${theme === 'light' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Light Mode
              </button>
            </div>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative mb-4">
          <div className="flex items-center justify-between bg-zinc-900 px-3 py-1.5 rounded-t-lg border-t border-x border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <span>HTML Embed Code</span>
            <span>Widget.js</span>
          </div>
          <pre className="p-3 rounded-b-lg border border-zinc-800 bg-zinc-950 text-[11px] font-mono text-indigo-300 overflow-x-auto">
            {embedCode}
          </pre>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="w-full h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-300" />
            <span>Gekopieerd naar Klembord!</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span>Kopieer Embed Code</span>
          </>
        )}
      </button>
    </div>
  )
}