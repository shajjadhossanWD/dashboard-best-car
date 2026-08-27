import { useMemo } from 'react'
import { AlertTriangle, Boxes, DollarSign, Layers, ListFilter, Package, Plus, RotateCcw } from 'lucide-react'
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
import { formatCurrency, formatNumber } from '@/lib/format'
import { isPending } from '@/store/createResource'
import { loadProducts, productsList } from '@/store/slices/productsSlice'
import { useListPage } from '@/store/useListPage'

const STOCK_TONE = { 'in-stock': 'success', 'low-stock': 'warning', 'out-of-stock': 'danger' }

export default function ProductsPage() {
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
    load: loadProducts,
    actions: productsList.actions,
    selectors: productsList.selectors,
  })

  const { data, error } = resource
  const loading = isPending(resource) || resource.status === 'idle'
  const summary = data?.summary

  const statusLabel = (id) => data?.statuses?.find((status) => status.id === id)?.label ?? id

  const columns = useMemo(
    () => [
      {
        id: 'product',
        header: 'Product',
        sortKey: 'name',
        cell: (row) => (
          <div className="flex items-center gap-3">
            <ProductThumb name={row.name} color={row.color} body={row.body} />
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] font-semibold text-ink">{row.name}</p>
              <p className="mt-0.5 truncate text-2xs text-ink-soft">{row.sku}</p>
            </div>
          </div>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        sortKey: 'category',
        cell: (row) => <span className="text-ink-muted">{row.category}</span>,
      },
      {
        id: 'price',
        header: 'Price',
        align: 'right',
        sortKey: 'price',
        defaultSortDir: 'desc',
        cell: (row) => <span className="font-medium text-ink">{formatCurrency(row.price)}</span>,
      },
      {
        id: 'unitsSold',
        header: 'Units Sold',
        align: 'right',
        sortKey: 'unitsSold',
        defaultSortDir: 'desc',
        cell: (row) => <span className="font-bold text-ink">{formatNumber(row.unitsSold)}</span>,
      },
      {
        id: 'revenue',
        header: 'Revenue',
        align: 'right',
        sortKey: 'revenue',
        defaultSortDir: 'desc',
        cell: (row) => (
          <span className="font-medium text-ink">
            {formatCurrency(row.revenue, { decimals: false })}
          </span>
        ),
      },
      {
        id: 'stock',
        header: 'Stock',
        align: 'right',
        sortKey: 'stock',
        defaultSortDir: 'asc',
        cell: (row) => (
          <span className={cn('font-semibold', row.stock === 0 ? 'text-danger' : 'text-ink')}>
            {formatNumber(row.stock)}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        sortKey: 'stockStatus',
        cell: (row) => (
          <Badge tone={STOCK_TONE[row.stockStatus] ?? 'neutral'}>{statusLabel(row.stockStatus)}</Badge>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.statuses],
  )

  return (
    <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-4">
      <PageHeader
        title="Products"
        description="Every vehicle in the catalogue, with how each one performed over the selected period."
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Inventory' }, { label: 'Products' }]}
        actions={
          <>
            <DateRangePicker value={filters.range} presetId={filters.presetId} onChange={setDateRange} />
            <IconButton label="Refresh products" variant="outline" size="icon" onClick={refresh}>
              <RotateCcw size={15} className={cn(loading && 'animate-spin')} />
            </IconButton>
            <Button size="md">
              <Plus size={14} />
              Add Product
            </Button>
          </>
        }
      />

      <section aria-label="Catalogue summary" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile
          icon={Package}
          tone="brand"
          label="Products"
          loading={loading}
          value={formatNumber(summary?.products ?? 0)}
          hint="in the catalogue"
        />
        <StatTile
          icon={Boxes}
          tone="navy"
          label="Units sold"
          loading={loading}
          value={formatNumber(summary?.unitsSold ?? 0)}
          hint="in the selected period"
        />
        <StatTile
          icon={DollarSign}
          tone="success"
          label="Revenue"
          loading={loading}
          value={formatCurrency(summary?.revenue ?? 0, { decimals: false })}
          hint="in the selected period"
        />
        <StatTile
          icon={AlertTriangle}
          tone="danger"
          label="Needs restock"
          loading={loading}
          value={formatNumber(summary?.lowStock ?? 0)}
          hint={`at or below ${data?.reorderLevel ?? 12} units`}
        />
      </section>

      <Card>
        <CardHeader
          title="All Products"
          subtitle={data ? `${formatNumber(data.total)} matching products` : undefined}
        />

        <TableToolbar>
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search name, SKU or category"
            className="sm:w-64"
          />
          <SelectMenu
            icon={Layers}
            label="Filter by category"
            value={filters.category}
            options={data?.categories ?? [{ id: 'all', label: 'All categories' }]}
            onChange={(value) => setFilters({ category: value })}
            size="md"
          />
          <SelectMenu
            icon={ListFilter}
            label="Filter by stock level"
            value={filters.status}
            options={data?.statuses ?? [{ id: 'all', label: 'All stock levels' }]}
            onChange={(value) => setFilters({ status: value })}
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
          emptyTitle="No products found"
          emptyDescription="Nothing matches these filters. Try clearing the search or widening the date range."
          renderMobileCard={(row) => (
            <div className="flex items-start gap-3">
              <ProductThumb name={row.name} color={row.color} body={row.body} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-[0.8125rem] font-semibold text-ink">{row.name}</p>
                  <span className="shrink-0 text-[0.8125rem] font-bold text-ink">
                    {formatCurrency(row.price)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-2xs text-ink-soft">
                  {row.sku} &middot; {row.category}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <Badge tone={STOCK_TONE[row.stockStatus] ?? 'neutral'}>
                    {formatNumber(row.stock)} in stock
                  </Badge>
                  <span className="text-2xs text-ink-muted">
                    <span className="font-bold text-ink">{formatNumber(row.unitsSold)}</span> sold
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
