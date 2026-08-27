import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'

export function SearchField({ value, onChange, placeholder = 'Search', label, className }) {
  return (
    <div
      className={cn(
        'flex h-9 items-center rounded-lg border border-line-strong bg-surface pl-3 pr-2 transition-colors focus-within:border-brand-500',
        className,
      )}
    >
      <Search size={15} className="shrink-0 text-ink-soft" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="h-full w-full bg-transparent px-2 text-xs text-ink outline-none placeholder:text-ink-soft"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="grid h-5 w-5 shrink-0 place-items-center rounded text-ink-soft hover:bg-surface-sunken hover:text-ink"
        >
          <X size={13} />
        </button>
      ) : null}
    </div>
  )
}
