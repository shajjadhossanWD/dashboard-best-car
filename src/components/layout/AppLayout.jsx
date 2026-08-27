import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { cn } from '@/lib/cn'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadSession } from '@/store/slices/sessionSlice'
import { selectSidebarCollapsed } from '@/store/slices/uiSlice'

export function AppLayout() {
  const dispatch = useAppDispatch()
  const collapsed = useAppSelector(selectSidebarCollapsed)

  useEffect(() => {
    const promise = dispatch(loadSession({}))
    return () => promise.abort()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-surface-sunken" id="top">
      <Sidebar />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300 ease-out',
          collapsed ? 'lg:pl-sidebar-sm' : 'lg:pl-sidebar',
        )}
      >
        <Topbar />

        <main className="flex-1 px-3 py-4 sm:px-5 sm:py-5">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}
