import { BRAND } from '@/constants/brand'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface px-4 py-3.5 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-1 text-xs text-ink-muted sm:flex-row">
        <p>{new Date().getFullYear()} &copy; All Right Reserved</p>
        <p>
          Designed &amp; Developed by{' '}
          <a href="#top" className="font-semibold text-brand-600 hover:underline">
            {BRAND.name}
          </a>
        </p>
      </div>
    </footer>
  )
}
