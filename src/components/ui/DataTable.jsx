import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Skeleton } from './Skeleton'
import { EmptyState, ErrorState } from './StateBlock'

/**
 * columns: [{ id, header, cell(row, index), align, width, headerClassName,
 *             cellClassName, sortKey, defaultSortDir }]
 *
 * Sorting is controlled - the table reports clicks through `onSort`, so the
 * data owner (here, the API) does the actual sorting.
 *
 * `renderMobileCard` swaps the table for a stacked list below `sm`.
 */
export function DataTable({
  columns,
  rows = [],
  getRowId = (row, index) => row.id ?? index,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription,
  renderMobileCard,
  skeletonRows = 5,
  sortBy,
  sortDir = 'asc',
  onSort,
  className,
}) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (!loading && rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  const align = (value) => (value === 'right' ? 'text-right' : value === 'center' ? 'text-center' : 'text-left')

  return (
    <div className={className}>
      {/* Mobile: stacked cards */}
      {renderMobileCard ? (
        <ul className="divide-y divide-line sm:hidden">
          {loading
            ? Array.from({ length: skeletonRows }, (_, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3.5">
                  <Skeleton className="h-9 w-12 shrink-0 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-2/5" />
                    <Skeleton className="h-2.5 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-14 rounded" />
                </li>
              ))
            : rows.map((row, index) => (
                <li key={getRowId(row, index)} className="px-4 py-3.5">
                  {renderMobileCard(row, index)}
                </li>
              ))}
        </ul>
      ) : null}

      {/* Desktop, and mobile when no card renderer is given */}
      <div className={cn('overflow-x-auto', renderMobileCard && 'hidden sm:block')}>
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <thead>
            <tr className="bg-surface-sunken">
              {columns.map((column) => {
                const sortable = Boolean(column.sortKey && onSort)
                const active = sortable && sortBy === column.sortKey

                return (
                  <th
                    key={column.id}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={cn(
                      'whitespace-nowrap px-4 py-2.5 text-xs font-semibold text-ink first:rounded-l-md last:rounded-r-md',
                      align(column.align),
                      column.headerClassName,
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() =>
                          onSort({ key: column.sortKey, direction: column.defaultSortDir ?? 'asc' })
                        }
                        className={cn(
                          'group inline-flex items-center gap-1 rounded transition-colors hover:text-brand-600',
                          column.align === 'right' && 'flex-row-reverse',
                          active && 'text-brand-600',
                        )}
                      >
                        {column.header}
                        <SortIcon active={active} direction={sortDir} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading
              ? Array.from({ length: skeletonRows }, (_, i) => (
                  <tr key={i}>
                    {columns.map((column) => (
                      <td key={column.id} className="px-4 py-3.5">
                        <Skeleton className="h-3.5 w-full max-w-[8rem]" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row, index) => (
                  <tr key={getRowId(row, index)} className="transition-colors hover:bg-surface-sunken/70">
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'px-4 py-3.5 align-middle text-[0.8125rem] text-ink-muted',
                          align(column.align),
                          column.cellClassName,
                        )}
                      >
                        {column.cell(row, index)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SortIcon({ active, direction }) {
  if (!active) {
    return (
      <ChevronsUpDown
        size={12}
        className="shrink-0 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    )
  }

  const Icon = direction === 'asc' ? ArrowUp : ArrowDown
  return <Icon size={12} className="shrink-0" aria-hidden="true" />
}
