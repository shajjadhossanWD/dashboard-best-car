import { cn } from '@/lib/cn'

export function TableToolbar({ className, children }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

TableToolbar.Spacer = function Spacer() {
  return <div className="hidden flex-1 sm:block" />
}
