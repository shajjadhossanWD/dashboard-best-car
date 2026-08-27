import { RotateCcw, TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/StateBlock'
import { EarningsIllustration } from '@/components/illustrations/EarningsIllustration'
import { cn } from '@/lib/cn'
import { formatCurrency, formatMilestone, formatPercent } from '@/lib/format'

export function EarningCard({ resource, title, onRetry, className }) {
  const { data, status, error } = resource
  const loading = status === 'loading' || status === 'idle'
  const earning = data?.earning

  return (
    <Card className={cn('justify-center', className)}>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : (
        <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-500">{title}</p>

            {loading ? (
              <div className="mt-3 space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-3 w-52" />
              </div>
            ) : (
              <>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-[1.75rem]">
                  {formatCurrency(earning.total)}
                </p>
                <Delta value={earning.changePercent} comparedTo={earning.comparedTo} />
              </>
            )}
          </div>

          <EarningsIllustration className="hidden h-16 w-20 shrink-0 xs:block sm:h-[4.5rem] sm:w-24" />
        </div>
      )}
    </Card>
  )
}

function Delta({ value, comparedTo }) {
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown

  return (
    <p
      className={cn(
        'mt-2 flex flex-wrap items-center gap-1 text-xs font-medium',
        positive ? 'text-success' : 'text-danger',
      )}
    >
      <Icon size={13} className="shrink-0" />
      <span className="font-bold">{formatPercent(value)}</span>
      <span className="text-ink-muted">
        {positive ? 'increase' : 'decrease'} compare to {comparedTo}
      </span>
    </p>
  )
}

export function MilestoneCard({ value, label, icon: Icon, tone = 'brand', loading, onRefresh, className }) {
  return (
    <Card tone={tone} className={cn('relative', className)}>
      <div className="flex h-full flex-col justify-between gap-6 p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/15">
            <Icon size={20} />
          </span>

          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              aria-label={`Refresh ${label}`}
              className="rounded-md p-1 text-white/75 transition-colors hover:bg-white/15 hover:text-white"
            >
              <RotateCcw size={15} />
            </button>
          ) : null}
        </div>

        <div>
          {loading ? (
            <>
              <Skeleton className="h-7 w-28 bg-white/25" />
              <Skeleton className="mt-2 h-3 w-32 bg-white/25" />
            </>
          ) : (
            <>
              <p className="text-2xl font-extrabold tracking-tight sm:text-[1.75rem]">
                {formatMilestone(value)}
              </p>
              <p className="mt-0.5 text-xs font-medium text-white/80">{label}</p>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
