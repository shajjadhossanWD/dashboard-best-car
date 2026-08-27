import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronsLeft, X } from 'lucide-react'
import { Logo } from './Logo'
import { SidebarNav } from './SidebarNav'
import { cn } from '@/lib/cn'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  closeMobileNav,
  selectMobileNavOpen,
  selectSidebarCollapsed,
  toggleSidebar,
} from '@/store/slices/uiSlice'

export function Sidebar() {
  const dispatch = useAppDispatch()
  const collapsed = useAppSelector(selectSidebarCollapsed)
  const mobileOpen = useAppSelector(selectMobileNavOpen)
  const isDesktop = useIsDesktop()
  const location = useLocation()

  useEffect(() => {
    dispatch(closeMobileNav())
  }, [location.pathname, dispatch])

  useEffect(() => {
    if (isDesktop || !mobileOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isDesktop, mobileOpen])

  const isCollapsed = isDesktop && collapsed

  return (
    <>
      {mobileOpen && !isDesktop ? (
        <div
          className="fixed inset-0 z-overlay bg-navy-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => dispatch(closeMobileNav())}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-sidebar flex flex-col border-r border-line bg-surface shadow-rail transition-[width,transform] duration-300 ease-out',
          isCollapsed ? 'w-sidebar-sm' : 'w-sidebar',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Sidebar"
      >
        <div
          className={cn(
            'relative flex h-topbar shrink-0 items-center border-b border-line',
            isCollapsed ? 'justify-center px-2' : 'px-4',
          )}
        >
          <Logo compact={isCollapsed} />

          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-brand-500 text-white shadow-sm transition-colors hover:bg-brand-600 lg:grid"
          >
            <ChevronsLeft size={14} className={cn('transition-transform', collapsed && 'rotate-180')} />
          </button>

          <button
            type="button"
            onClick={() => dispatch(closeMobileNav())}
            aria-label="Close navigation"
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-surface-sunken lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="scrollbar-slim flex-1 overflow-y-auto overscroll-contain pt-3">
          <SidebarNav collapsed={isCollapsed} onNavigate={() => dispatch(closeMobileNav())} />
        </div>
      </aside>
    </>
  )
}
