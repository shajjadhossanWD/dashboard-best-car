import { ChevronUp, RotateCcw } from 'lucide-react'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { IconButton } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectDateRange, selectPresetId, setDateRange } from '@/store/slices/dashboardSlice'
import { selectSessionResource, selectUser } from '@/store/slices/sessionSlice'
import { selectKpiExpanded, toggleKpiSection } from '@/store/slices/uiSlice'

export function WelcomeBanner({ onRefresh, refreshing = false }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const range = useAppSelector(selectDateRange)
  const presetId = useAppSelector(selectPresetId)
  const expanded = useAppSelector(selectKpiExpanded)
  const { status } = useAppSelector(selectSessionResource)

  const loading = status === 'loading' || status === 'idle'

  return (
    <section className="flex flex-col gap-3 rounded-card border border-line bg-surface px-4 py-3.5 shadow-card sm:px-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="text-xl leading-none" aria-hidden="true">
          &#128075;
        </span>
        {loading ? (
          <Skeleton className="h-4 w-64 max-w-full" />
        ) : (
          <h1 className="text-sm text-ink-muted sm:truncate sm:text-[0.9375rem]">
            <span className="font-bold text-ink">Hi {user?.name},</span> here&apos;s what&apos;s
            happening with your store today.
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DateRangePicker
          value={range}
          presetId={presetId}
          onChange={(next) => dispatch(setDateRange(next))}
          className="flex-1 lg:flex-none"
        />

        <IconButton
          label="Refresh dashboard"
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RotateCcw size={15} className={cn(refreshing && 'animate-spin')} />
        </IconButton>

        <IconButton
          label={expanded ? 'Collapse statistics' : 'Expand statistics'}
          variant="outline"
          size="icon"
          aria-expanded={expanded}
          onClick={() => dispatch(toggleKpiSection())}
        >
          <ChevronUp size={15} className={cn('transition-transform', !expanded && 'rotate-180')} />
        </IconButton>
      </div>
    </section>
  )
}
