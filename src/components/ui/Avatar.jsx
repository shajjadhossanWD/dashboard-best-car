import { cn } from '@/lib/cn'

const SIZES = {
  sm: 'h-7 w-7 text-2xs',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
}

export function Avatar({ name = '', initials, size = 'md', online = false, className }) {
  const fallback =
    initials ||
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'grid place-items-center rounded-full bg-gradient-to-br from-navy-500 to-navy-700 font-bold text-white ring-2 ring-white',
          SIZES[size],
        )}
        aria-hidden={Boolean(name)}
      >
        {fallback || '?'}
      </span>
      {name ? <span className="sr-only">{name}</span> : null}
      {online ? (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-white" />
      ) : null}
    </span>
  )
}
