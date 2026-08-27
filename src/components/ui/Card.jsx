import { cn } from '@/lib/cn'

// Surfaces are named tones rather than a passed-in bg-* class: two competing
// background utilities on one element are resolved by Tailwind output order.
const TONES = {
  default: 'border-line bg-surface',
  brand: 'border-brand-500 bg-brand-500 text-white',
  navy: 'border-navy-700 bg-navy-700 text-white',
}

export function Card({ as: Tag = 'section', tone = 'default', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'flex flex-col overflow-hidden rounded-card border shadow-card',
        TONES[tone] ?? TONES.default,
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, subtitle, actions, divided = true, className, children }) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5',
        divided && 'border-b border-line',
        className,
      )}
    >
      {children ?? (
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-ink">{title}</h2>
          {subtitle ? <p className="mt-0.5 truncate text-xs text-ink-muted">{subtitle}</p> : null}
        </div>
      )}
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('flex-1 p-4 sm:p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children }) {
  return <div className={cn('border-t border-line px-4 py-3 sm:px-5', className)}>{children}</div>
}
