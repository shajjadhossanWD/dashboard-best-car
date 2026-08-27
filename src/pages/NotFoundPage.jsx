import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function NotFoundPage() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Card>
        <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
          <p className="text-4xl font-extrabold text-brand-500">404</p>
          <h1 className="text-lg font-bold text-ink">Page not found</h1>
          <p className="max-w-sm text-xs text-ink-muted">
            The page you are looking for was moved, removed or never existed.
          </p>
          <Button as={Link} to="/" className="mt-2">
            Back to dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
