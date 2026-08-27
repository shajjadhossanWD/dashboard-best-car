import { AlertCircle, Inbox, RotateCcw } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/cn'

function Block({ icon: Icon, title, description, action, tone = 'neutral', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 px-4 py-10 text-center', className)}>
      <span
        className={cn(
          'grid h-10 w-10 place-items-center rounded-full',
          tone === 'danger' ? 'bg-danger-soft text-danger' : 'bg-surface-sunken text-ink-soft',
        )}
      >
        <Icon size={18} />
      </span>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description ? <p className="max-w-xs text-xs text-ink-muted">{description}</p> : null}
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry, className }) {
  return (
    <Block
      icon={AlertCircle}
      tone="danger"
      title="Could not load this data"
      description={message}
      className={className}
      action={
        onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
            <RotateCcw size={13} />
            Try again
          </Button>
        ) : null
      }
    />
  )
}

export function EmptyState({ title = 'Nothing to show', description, action, className }) {
  return <Block icon={Inbox} title={title} description={description} action={action} className={className} />
}
