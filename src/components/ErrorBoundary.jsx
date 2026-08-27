import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui/Button'

export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('Uncaught render error:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="grid min-h-screen place-items-center bg-surface-sunken p-6">
        <div className="w-full max-w-md rounded-card border border-line bg-surface p-8 text-center shadow-card">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
            <AlertTriangle size={22} />
          </span>
          <h1 className="mt-4 text-base font-bold text-ink">Something broke</h1>
          <p className="mt-1 text-xs text-ink-muted">{this.state.error.message}</p>
          <Button className="mt-5" onClick={() => window.location.reload()}>
            Reload the dashboard
          </Button>
        </div>
      </div>
    )
  }
}
