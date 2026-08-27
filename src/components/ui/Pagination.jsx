import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'

function pageItems(page, pageCount, siblings = 1) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)

  const start = Math.max(2, page - siblings)
  const end = Math.min(pageCount - 1, page + siblings)
  const items = [1]

  if (start > 2) items.push('start-gap')
  for (let i = start; i <= end; i += 1) items.push(i)
  if (end < pageCount - 1) items.push('end-gap')

  items.push(pageCount)
  return items
}

export function Pagination({ page, pageCount, total, from, to, onPageChange, className }) {
  if (!pageCount) return null

  const items = pageItems(page, pageCount)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 sm:flex-row sm:px-5',
        className,
      )}
    >
      <p className="text-xs text-ink-muted">
        Showing <span className="font-semibold text-ink">{formatNumber(from)}</span> to{' '}
        <span className="font-semibold text-ink">{formatNumber(to)}</span> of{' '}
        <span className="font-semibold text-ink">{formatNumber(total)}</span> entries
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <PageButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          label="Previous page"
        >
          <ChevronLeft size={15} />
        </PageButton>

        {items.map((item) =>
          typeof item === 'number' ? (
            <PageButton
              key={item}
              active={item === page}
              onClick={() => onPageChange(item)}
              label={`Page ${item}`}
              current={item === page}
            >
              {item}
            </PageButton>
          ) : (
            <span key={item} className="px-1 text-xs text-ink-soft" aria-hidden="true">
              &hellip;
            </span>
          ),
        )}

        <PageButton onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} label="Next page">
          <ChevronRight size={15} />
        </PageButton>
      </nav>
    </div>
  )
}

function PageButton({ active, current, disabled, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'grid h-8 min-w-[2rem] place-items-center rounded-md px-2 text-xs font-semibold transition-colors',
        active
          ? 'bg-brand-500 text-white'
          : 'border border-line-strong text-ink-muted hover:border-brand-400 hover:text-ink',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {children}
    </button>
  )
}
