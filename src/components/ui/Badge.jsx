import { cn } from '@/lib/cn'

const TONES = {
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  warning: 'bg-warning-soft text-warning',
  neutral: 'bg-surface-sunken text-ink-muted',
}

export function Badge({ tone = 'neutral', dot = true, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-2xs font-semibold leading-none',
        TONES[tone] ?? TONES.neutral,
        className,
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

export function CountBadge({ count, max = 99, className }) {
  if (!count) return null
  return (
    <span
      className={cn(
        'absolute -right-1 -top-1 grid h-4 min-w-[1rem] place-items-center rounded-full bg-danger px-1 text-[0.5625rem] font-bold text-white ring-2 ring-white',
        className,
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  )
}
