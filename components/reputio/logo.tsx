import { cn } from '@/lib/utils'

export function LogoMarkShapes() {
  return (
    <>
      <path
        d="M16 2 28 6.5V15c0 7.5-5.2 12.8-12 15C9.2 27.8 4 22.5 4 15V6.5L16 2Z"
        fill="#6366F1"
      />
      <path
        d="M16 2 28 6.5V15c0 7.5-5.2 12.8-12 15C9.2 27.8 4 22.5 4 15V6.5L16 2Z"
        fill="none"
        stroke="#A5B4FC"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <path
        d="M11 22.5V10h4a3.5 3.5 0 0 1 0 7h-4m3.6 0 4.4 5.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 5.25q.55 2.7 3.25 3.25-2.7.55-3.25 3.25-.55-2.7-3.25-3.25 2.7-.55 3.25-3.25Z"
        fill="#34D399"
      />
    </>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-7', className)} aria-hidden="true">
      <LogoMarkShapes />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className="font-heading text-lg font-semibold tracking-tight text-foreground">Reputio</span>
    </span>
  )
}
