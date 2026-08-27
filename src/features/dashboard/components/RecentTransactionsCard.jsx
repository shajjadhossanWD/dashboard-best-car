import { useMemo } from 'react'
import { Clock, ListFilter } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { SelectMenu } from '@/components/ui/Dropdown'
import { ProductThumb } from '@/components/ui/ProductThumb'
import { formatCurrency, formatRelativeTime } from '@/lib/format'
import { TRANSACTION_FILTERS } from '@/store/slices/dashboardSlice'

const TONE_BY_STATUS = { success: 'success', pending: 'info', cancelled: 'danger' }

export function RecentTransactionsCard({
  resource,
  statusFilter,
  onStatusChange,
  onRetry,
  onViewAll,
  className,
}) {
  const { data, status, error } = resource
  const loading = status === 'loading' || status === 'idle'
  const rows = data?.rows ?? []
  const statusLabels = useMemo(
    () => Object.fromEntries((data?.statuses ?? []).map((s) => [s.id, s.label])),
    [data],
  )

  const columns = useMemo(
    () => [
      {
        id: 'index',
        header: '#',
        width: '3rem',
        cell: (_row, index) => <span className="font-medium text-ink-muted">{index + 1}</span>,
      },
      {
        id: 'order',
        header: 'Order Details',
        cell: (row) => (
          <div className="flex items-center gap-3">
            <ProductThumb name={row.productName} color={row.productColor} body={row.productBody} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] font-semibold text-ink">{row.productName}</p>
              <p className="mt-0.5 flex items-center gap-1 text-2xs text-ink-muted">
                <Clock size={11} className="shrink-0" />
                {formatRelativeTime(row.placedAt)}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'payment',
        header: 'Payment',
        cell: (row) => (
          <div className="min-w-0">
            <p className="truncate text-[0.8125rem] font-medium text-ink">{row.paymentMethod}</p>
            <a
              href="#top"
              className="mt-0.5 block truncate text-2xs font-medium text-info hover:underline"
            >
              {row.reference}
            </a>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: (row) => (
          <Badge tone={TONE_BY_STATUS[row.status] ?? 'neutral'}>
            {statusLabels[row.status] ?? row.status}
          </Badge>
        ),
      },
      {
        id: 'amount',
        header: 'Amount',
        align: 'right',
        cell: (row) => (
          <span className="font-bold text-ink">{formatCurrency(row.amount)}</span>
        ),
      },
    ],
    [statusLabels],
  )

  return (
    <Card className={className}>
      <CardHeader
        title="Recent Transactions"
        actions={
          <>
            <SelectMenu
              icon={ListFilter}
              label="Filter by status"
              value={statusFilter}
              options={TRANSACTION_FILTERS}
              onChange={onStatusChange}
            />
            <Button variant="outline" size="xs" onClick={onViewAll}>
              View All
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        onRetry={onRetry}
        emptyTitle="No transactions found"
        emptyDescription="No orders match this status in the selected date range."
        renderMobileCard={(row, index) => (
          <div className="flex items-start gap-3">
            <ProductThumb name={row.productName} color={row.productColor} body={row.productBody} size="sm" />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-[0.8125rem] font-semibold text-ink">
                  <span className="mr-1 text-ink-soft">{index + 1}.</span>
                  {row.productName}
                </p>
                <span className="shrink-0 text-[0.8125rem] font-bold text-ink">
                  {formatCurrency(row.amount)}
                </span>
              </div>

              <p className="mt-1 truncate text-2xs text-ink-muted">
                {row.paymentMethod} &middot; <span className="text-info">{row.reference}</span>
              </p>

              <div className="mt-2 flex items-center justify-between gap-2">
                <Badge tone={TONE_BY_STATUS[row.status] ?? 'neutral'}>
                  {statusLabels[row.status] ?? row.status}
                </Badge>
                <span className="flex items-center gap-1 text-2xs text-ink-soft">
                  <Clock size={11} />
                  {formatRelativeTime(row.placedAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </Card>
  )
}
