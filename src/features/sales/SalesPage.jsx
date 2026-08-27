import { useMemo } from 'react'
import { CreditCard, Download, ListFilter, Receipt, RotateCcw, TrendingUp, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button, IconButton } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { SelectMenu } from '@/components/ui/Dropdown'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { ProductThumb } from '@/components/ui/ProductThumb'
import { SearchField } from '@/components/ui/SearchField'
import { StatTile } from '@/components/ui/StatTile'
import { TableToolbar } from '@/components/ui/TableToolbar'
import { cn } from '@/lib/cn'
import { formatCurrency, formatDateTime, formatNumber, formatRelativeTime } from '@/lib/format'
import { isPending } from '@/store/createResource'
import { loadSales, salesList } from '@/store/slices/salesSlice'
import { useListPage } from '@/store/useListPage'

const STATUS_TONE = { success: 'success', pending: 'info', cancelled: 'danger' }

export default function SalesPage() {
  const {
    filters,
    resource,
    searchInput,
    setSearchInput,
    setFilters,
    setDateRange,
    setPage,
    toggleSort,
    refresh,
    reset,
    isFiltered,
  } = useListPage({
    load: loadSales,
    actions: salesList.actions,
    selectors: salesList.selectors,
  })

  const { data, error } = resource
  const loading = isPending(resource) || resource.status === 'idle'
  const summary = data?.summary

  const statusLabel = (id) => data?.statuses?.find((status) => status.id === id)?.label ?? id

  const columns = useMemo(
    () => [
      {
        id: 'reference',
        header: 'Order',
        sortKey: 'reference',
        cell: (row) => (
          <div className="min-w-0">
            <a href="#top" className="block truncate text-[0.8125rem] font-semibold text-info hover:underline">
              {row.reference}
            </a>
            <p className="mt-0.5 truncate text-2xs text-ink-soft">
              {formatNumber(row.quantity)} {row.quantity === 1 ? 'item' : 'items'}
            </p>
          </div>
        ),
      },
      {
        id: 'product',
        header: 'Product',
        sortKey: 'productName',
        cell: (row) => (
          <div className="flex items-center gap-3">
            <ProductThumb name={row.productName} color={row.productColor} body={row.productBody} size="sm" />
            <span className="truncate text-[0.8125rem] font-semibold text-ink">{row.productName}</span>
          </div>
        ),
      },
      {
        id: 'customer',
        header: 'Customer',
        sortKey: 'customerName',
        cell: (row) => (
          <div className="min-w-0">
            <p className="truncate text-[0.8125rem] font-medium text-ink">{row.customerName}</p>
            <p className="mt-0.5 truncate text-2xs text-ink-soft">{row.customerEmail}</p>
          </div>
        ),
      },
      {
        id: 'placedAt',
        header: 'Date',
        sortKey: 'placedAt',
        defaultSortDir: 'desc',
        cell: (row) => (
          <div className="min-w-0">
            <p className="whitespace-nowrap text-[0.8125rem] text-ink-muted">
              {formatDateTime(row.placedAt)}
            </p>
            <p className="mt-0.5 text-2xs text-ink-soft">{formatRelativeTime(row.placedAt)} ago</p>
          </div>
        ),
      },
      {
        id: 'payment',
        header: 'Payment',
        sortKey: 'paymentMethod',
        cell: (row) => <span className="whitespace-nowrap text-ink-muted">{row.paymentMethod}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        sortKey: 'status',
        cell: (row) => (
          <Badge tone={STATUS_TONE[row.status] ?? 'neutral'}>{statusLabel(row.status)}</Badge>
        ),
      },
      {
        id: 'amount',
        header: 'Amount',
        align: 'right',
        sortKey: 'amount',
        defaultSortDir: 'desc',
        cell: (row) => (
          <span className="whitespace-nowrap font-bold text-ink">{formatCurrency(row.amount)}</span>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.statuses],
  )

  return (
    <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-4">
      <PageHeader
        title="Sales"
        description="Every order placed in the selected period, across all payment methods."
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Sales' }, { label: 'Sales List' }]}
        actions={
          <>
            <DateRangePicker value={filters.range} presetId={filters.presetId} onChange={setDateRange} />
            <IconButton label="Refresh orders" variant="outline" size="icon" onClick={refresh}>
              <RotateCcw size={15} className={cn(loading && 'animate-spin')} />
            </IconButton>
            <Button variant="dark" size="md">
              <Download size={14} />
              Export
            </Button>
          </>
        }
      />

      <section aria-label="Order summary" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile
          icon={Receipt}
          tone="brand"
          label="Orders"
          loading={loading}
          value={formatNumber(summary?.orders ?? 0)}
          hint="matching the filters"
        />
        <StatTile
          icon={TrendingUp}
          tone="success"
          label="Revenue"
          loading={loading}
          value={formatCurrency(summary?.revenue ?? 0, { decimals: false })}
          hint="from successful orders"
        />
        <StatTile
          icon={CreditCard}
          tone="navy"
          label="Average order"
          loading={loading}
          value={formatCurrency(summary?.averageOrder ?? 0)}
          hint="per successful order"
        />
        <StatTile
          icon={XCircle}
          tone="danger"
          label="Cancelled"
          loading={loading}
          value={formatNumber(summary?.cancelled ?? 0)}
          hint="needs follow-up"
        />
      </section>

      <Card>
        <CardHeader
          title="All Transactions"
          subtitle={data ? `${formatNumber(data.total)} matching orders` : undefined}
        />

        <TableToolbar>
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search reference, product or customer"
            className="sm:w-72"
          />
          <SelectMenu
            icon={ListFilter}
            label="Filter by status"
            value={filters.status}
            options={data?.statuses ?? [{ id: 'all', label: 'All statuses' }]}
            onChange={(value) => setFilters({ status: value })}
            size="md"
          />
          <SelectMenu
            icon={CreditCard}
            label="Filter by payment method"
            value={filters.method}
            options={data?.methods ?? [{ id: 'all', label: 'All methods' }]}
            onChange={(value) => setFilters({ method: value })}
            size="md"
          />
          <TableToolbar.Spacer />
          {isFiltered ? (
            <Button variant="ghost" size="sm" onClick={reset}>
              Clear filters
            </Button>
          ) : null}
        </TableToolbar>

        <DataTable
          columns={columns}
          rows={data?.rows ?? []}
          loading={loading}
          error={error}
          onRetry={refresh}
          skeletonRows={filters.pageSize}
          sortBy={filters.sortBy}
          sortDir={filters.sortDir}
          onSort={toggleSort}
          emptyTitle="No orders found"
          emptyDescription="Nothing matches these filters. Try clearing the search or widening the date range."
          renderMobileCard={(row) => (
            <div className="flex items-start gap-3">
              <ProductThumb name={row.productName} color={row.productColor} body={row.productBody} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-[0.8125rem] font-semibold text-ink">{row.productName}</p>
                  <span className="shrink-0 text-[0.8125rem] font-bold text-ink">
                    {formatCurrency(row.amount)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-2xs text-ink-muted">
                  <span className="text-info">{row.reference}</span> &middot; {row.customerName}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <Badge tone={STATUS_TONE[row.status] ?? 'neutral'}>{statusLabel(row.status)}</Badge>
                  <span className="text-2xs text-ink-soft">
                    {row.paymentMethod} &middot; {formatDateTime(row.placedAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        />

        {data && !error ? (
          <Pagination
            page={data.page}
            pageCount={data.pageCount}
            total={data.total}
            from={data.from}
            to={data.to}
            onPageChange={setPage}
          />
        ) : null}
      </Card>
    </div>
  )
}
