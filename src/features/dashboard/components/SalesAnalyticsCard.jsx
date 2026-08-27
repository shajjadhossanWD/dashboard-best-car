import { CalendarDays } from 'lucide-react'
import { AreaChart } from '@/components/charts/AreaChart'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { SelectMenu } from '@/components/ui/Dropdown'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/StateBlock'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { formatCompact, formatCurrency, formatPercent } from '@/lib/format'

export function SalesAnalyticsCard({ resource, year, onYearChange, onRetry, className }) {
  const { data, status, error } = resource
  const loading = status === 'loading' || status === 'idle'
  const isSmall = useMediaQuery('(max-width: 639px)')

  const yearOptions = (data?.availableYears ?? [year]).map((value) => ({
    id: value,
    label: String(value),
  }))

  return (
    <Card className={className}>
      <CardHeader
        title="Sales Analytics"
        subtitle={
          data
            ? `${formatCurrency(data.total, { decimals: false })} total · ${formatPercent(
                data.changePercent,
                { withSign: true },
              )} vs ${data.year - 1}`
            : undefined
        }
        actions={
          <SelectMenu
            icon={CalendarDays}
            label="Select year"
            value={year}
            options={yearOptions}
            onChange={(value) => onYearChange(Number(value))}
          />
        }
      />

      <CardBody className="pt-4">
        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : loading ? (
          <Skeleton className="h-[220px] w-full rounded-lg sm:h-[260px]" />
        ) : (
          <AreaChart
            data={data.points}
            height={isSmall ? 220 : 260}
            valueLabel="Revenue"
            formatValue={(value) => formatCurrency(value, { decimals: false })}
            formatTick={formatCompact}
          />
        )}
      </CardBody>
    </Card>
  )
}
