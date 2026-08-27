import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export function PageHeader({ title, description, breadcrumbs = [], actions, className }) {
  return (
    <header
      className={cn(
        'flex flex-col gap-3 rounded-card border border-line bg-surface px-4 py-3.5 shadow-card sm:px-5 lg:flex-row lg:items-center lg:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {breadcrumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-1">
            <ol className="flex flex-wrap items-center gap-1 text-2xs font-medium text-ink-soft">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {index > 0 ? <ChevronRight size={11} aria-hidden="true" /> : null}
                  {crumb.to ? (
                    <Link to={crumb.to} className="transition-colors hover:text-brand-600">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ink-muted">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <h1 className="text-base font-bold text-ink sm:text-lg">{title}</h1>
        {description ? <p className="mt-0.5 text-xs text-ink-muted">{description}</p> : null}
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}
