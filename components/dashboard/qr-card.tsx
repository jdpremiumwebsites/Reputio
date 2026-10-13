'use client'

import { useState, useEffect } from 'react'
import { QrCode, Download, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export function QrCard() {
  const [googleUrl, setGoogleUrl] = useState('https://g.page/r/example')
  const [businessName, setBusinessName] = useState('Mijn Bedrijf')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('reputio_google_url')
      const savedBusiness = localStorage.getItem('reputio_business_name')
      if (savedUrl) setGoogleUrl(savedUrl)
      if (savedBusiness) setBusinessName(savedBusiness)
    }
  }, [])

  return (
    <div className="rounded-2xl border border-zinc-800 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-white">Jouw Bedrijfs QR-Code</h3>
          <QrCode className="size-5 text-indigo-400" />
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Gegenereerd voor <strong className="text-zinc-200">{businessName}</strong>. Print deze voor op de balie of factuur.
        </p>

        {/* Live gegenereerde QR-code */}
        <div className="aspect-square w-full rounded-xl bg-white p-6 flex flex-col items-center justify-center mb-4 shadow-inner">
          {googleUrl ? (
            <div className="flex flex-col items-center">
              <QRCodeSVG 
                value={googleUrl} 
                size={140} 
                level="M"
                includeMargin={false}
              />
              <span className="mt-3 text-[10px] font-bold text-zinc-800 uppercase tracking-wider">Scan om te beoordelen</span>
            </div>
          ) : (
            <div className="text-center text-zinc-500 text-xs">
              Stel eerst je Google Review URL in bij Instellingen.
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            if (!googleUrl) alert('Voeg eerst een Google Review URL toe.')
            else window.open(googleUrl, '_blank')
          }}
          className="flex-1 h-9 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Test Link</span>
          <ExternalLink className="size-3" />
        </button>
      </div>
    </div>
  )
}