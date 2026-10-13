'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from './logo'
import { AboutDialog } from './about-dialog'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#functies', label: 'Functies' },
  { href: '#demo', label: 'Live Demo' },
  { href: '#rekenmachine', label: 'ROI Rekenmachine' },
  { href: '#prijzen', label: 'Prijzen' },
  { href: '#faq', label: 'FAQ' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Reputio home" className="rounded-md focus-visible:ring-2 focus-visible:ring-ring">
          <Logo />
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <AboutDialog triggerClassName="hidden rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-foreground lg:inline-flex" />
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:text-foreground"
          >
            Inloggen
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-zinc-200"
          >
            Gratis Starten
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn('border-t border-zinc-800 md:hidden', open ? 'block' : 'hidden')}
      >
        <nav aria-label="Mobiele navigatie" className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-800 text-sm text-zinc-200"
            >
              Inloggen
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground text-sm font-medium text-background"
            >
              Gratis Starten
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
