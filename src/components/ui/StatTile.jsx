import { cn } from '@/lib/cn'
import { Skeleton } from './Skeleton'

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  navy: 'bg-navy-50 text-navy-600',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
}

export function StatTile({ label, value, hint, icon: Icon, tone = 'brand', loading, className }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3.5 shadow-card',
        className,
      )}
    >
      {Icon ? (
        <span className={cn('hidden h-10 w-10 shrink-0 place-items-center rounded-lg xs:grid', TONES[tone])}>
          <Icon size={18} />
        </span>
      ) : null}

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-ink-muted">{label}</p>
        {loading ? (
          <Skeleton className="mt-1.5 h-5 w-20" />
        ) : (
          <p className="mt-0.5 truncate text-lg font-extrabold tracking-tight text-ink">{value}</p>
        )}
        {hint && !loading ? <p className="truncate text-2xs text-ink-soft">{hint}</p> : null}
      </div>
    </div>
  )
}
