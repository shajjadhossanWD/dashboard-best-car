import { useEffect, useState } from 'react'
import {
  Bell,
  LogOut,
  Mail,
  Maximize,
  Menu,
  Minimize,
  Monitor,
  Plus,
  Search,
  Settings,
  Store,
  UserCircle,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button, IconButton } from '@/components/ui/Button'
import { CountBadge } from '@/components/ui/Badge'
import { Dropdown, MenuItem, MenuSeparator, SelectMenu } from '@/components/ui/Dropdown'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { Skeleton } from '@/components/ui/Skeleton'
import { SearchBar } from './SearchBar'
import { cn } from '@/lib/cn'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleMobileNav } from '@/store/slices/uiSlice'
import {
  selectLocale,
  selectMessageCount,
  selectNotificationCount,
  selectSessionResource,
  selectStores,
  selectUser,
} from '@/store/slices/sessionSlice'

export function Topbar() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const stores = useAppSelector(selectStores)
  const locale = useAppSelector(selectLocale)
  const notifications = useAppSelector(selectNotificationCount)
  const messages = useAppSelector(selectMessageCount)
  const { status } = useAppSelector(selectSessionResource)

  const [storeId, setStoreId] = useState(null)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const isFullscreen = useFullscreen()

  const loading = status === 'loading' || status === 'idle'
  const activeStore = storeId ?? stores[0]?.id

  return (
    <header className="sticky top-0 z-topbar border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex h-topbar items-center gap-2 px-3 sm:gap-3 sm:px-5">
        <IconButton
          label="Open navigation"
          className="lg:hidden"
          onClick={() => dispatch(toggleMobileNav())}
        >
          <Menu size={19} />
        </IconButton>

        <SearchBar className="hidden w-64 md:flex xl:w-80" />

        <IconButton
          label="Search"
          className="md:hidden"
          onClick={() => setMobileSearchOpen((open) => !open)}
        >
          <Search size={18} />
        </IconButton>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {loading ? (
            <Skeleton className="hidden h-8 w-36 rounded-lg sm:block" />
          ) : (
            <SelectMenu
              icon={Store}
              label="Select store"
              value={activeStore}
              options={stores}
              onChange={setStoreId}
              className="hidden sm:inline-flex"
            />
          )}

          <Button size="sm" className="hidden sm:inline-flex">
            <Plus size={14} />
            Add New
          </Button>

          <Button variant="dark" size="sm" className="hidden sm:inline-flex">
            <Monitor size={14} />
            POS
          </Button>

          <span className="mx-1 hidden h-6 w-px bg-line lg:block" />

          <button
            type="button"
            aria-label={`Language: ${locale?.label ?? 'English'}`}
            className="hidden h-8 w-8 place-items-center rounded-lg hover:bg-surface-sunken lg:grid"
          >
            <FlagIcon code={locale?.flag ?? 'us'} className="h-3.5 w-5 rounded-[2px]" />
          </button>

          <IconButton
            label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
            className="hidden lg:inline-flex"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </IconButton>

          <IconButton label={`Messages (${messages})`} className="relative hidden sm:inline-flex">
            <Mail size={17} />
            <CountBadge count={messages} />
          </IconButton>

          <IconButton label={`Notifications (${notifications})`} className="relative">
            <Bell size={17} />
            <CountBadge count={notifications} />
          </IconButton>

          <IconButton label="Settings" className="hidden sm:inline-flex">
            <Settings size={17} />
          </IconButton>

          <Dropdown
            panelClassName="w-52"
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                aria-label="Account menu"
                className="ml-0.5 rounded-full transition-opacity hover:opacity-90"
              >
                {loading ? (
                  <Skeleton className="h-9 w-9 rounded-full" />
                ) : (
                  <Avatar name={user?.name} initials={user?.initials} online />
                )}
              </button>
            )}
          >
            {({ close }) => (
              <>
                <div className="px-2.5 py-2">
                  <p className="truncate text-xs font-semibold text-ink">{user?.name}</p>
                  <p className="truncate text-2xs text-ink-muted">{user?.role}</p>
                </div>
                <MenuSeparator />
                <MenuItem onClick={close}>
                  <span className="flex items-center gap-2">
                    <UserCircle size={14} /> My profile
                  </span>
                </MenuItem>
                <MenuItem onClick={close}>
                  <span className="flex items-center gap-2">
                    <Settings size={14} /> Settings
                  </span>
                </MenuItem>
                <MenuSeparator />
                <MenuItem onClick={close} className="text-danger hover:bg-danger-soft hover:text-danger">
                  <span className="flex items-center gap-2">
                    <LogOut size={14} /> Log out
                  </span>
                </MenuItem>
              </>
            )}
          </Dropdown>
        </div>
      </div>

      <div className={cn('px-3 pb-3 md:hidden', !mobileSearchOpen && 'hidden')}>
        <SearchBar />
      </div>
    </header>
  )
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.()
  else document.documentElement.requestFullscreen?.()
}

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement))

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  return isFullscreen
}
