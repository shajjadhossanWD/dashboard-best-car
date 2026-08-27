import { TrendingDown, TrendingUp } from 'lucide-react'
import { ChoroplethLegend, WorldMap } from '@/components/charts/WorldMap'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { SelectMenu } from '@/components/ui/Dropdown'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/StateBlock'
import { cn } from '@/lib/cn'
import { formatNumber, formatPercent } from '@/lib/format'
import { REGION_PERIODS } from '@/store/slices/dashboardSlice'

export function SalesByCountriesCard({ resource, period, onPeriodChange, onRetry, className }) {
  const { data, status, error } = resource
  const loading = status === 'loading' || status === 'idle'
  const positive = (data?.changePercent ?? 0) >= 0
  const TrendIcon = positive ? TrendingUp : TrendingDown

  return (
    <Card className={className}>
      <CardHeader
        title="Sales by Countries"
        actions={
          <SelectMenu
            label="Select period"
            value={period}
            options={REGION_PERIODS}
            onChange={onPeriodChange}
          />
        }
      />

      <CardBody className="flex flex-col gap-4">
        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : loading ? (
          <>
            <Skeleton className="h-[210px] w-full rounded-lg" />
            <Skeleton className="h-3 w-52" />
          </>
        ) : (
          <>
            <WorldMap data={data.regions} formatValue={formatNumber} />

            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3">
              {data.regions.slice(0, 4).map((region) => (
                <li key={region.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-ink-muted">{region.name}</span>
                  <span className="shrink-0 font-semibold text-ink">{formatNumber(region.sales)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p
                className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  positive ? 'text-success' : 'text-danger',
                )}
              >
                <TrendIcon size={13} className="shrink-0" />
                <span className="font-bold">{formatPercent(data.changePercent)}</span>
                <span className="text-ink-muted">
                  {positive ? 'increase' : 'decrease'} compare to {data.comparedTo}
                </span>
              </p>
              <ChoroplethLegend />
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}
