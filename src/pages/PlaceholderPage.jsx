import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function PlaceholderPage({ title, section }) {
  return (
    <div className="mx-auto w-full max-w-[110rem]">
      <Card>
        <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Construction size={22} />
          </span>
          {section ? (
            <p className="text-2xs font-bold uppercase tracking-wider text-ink-soft">{section}</p>
          ) : null}
          <h1 className="text-lg font-bold text-ink">{title}</h1>
          <p className="max-w-sm text-xs text-ink-muted">
            This screen is not part of the dashboard build. The route, layout and navigation state
            are wired up and ready for it.
          </p>
        </div>
      </Card>
    </div>
  )
}
