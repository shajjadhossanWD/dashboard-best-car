import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'

export function SearchBar({ onSearch, className }) {
  const inputRef = useRef(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch?.(value)
      }}
      className={cn(
        'group relative flex h-9 items-center rounded-lg border border-line-strong bg-surface pl-3 pr-2 transition-colors focus-within:border-brand-500',
        className,
      )}
    >
      <Search size={15} className="shrink-0 text-ink-soft" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search"
        aria-label="Search"
        className="peer h-full w-full bg-transparent px-2 text-xs text-ink outline-none placeholder:text-ink-soft [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            setValue('')
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="grid h-5 w-5 shrink-0 place-items-center rounded text-ink-soft hover:bg-surface-sunken"
        >
          <X size={13} />
        </button>
      ) : (
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-line-strong px-1.5 py-0.5 text-[0.625rem] font-semibold text-ink-soft sm:flex">
          <span className="text-[0.75rem] leading-none">&#8984;</span> K
        </kbd>
      )}
    </form>
  )
}
