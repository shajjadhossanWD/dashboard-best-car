import { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { NAV_SECTIONS } from '@/constants/navigation'
import { cn } from '@/lib/cn'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectOpenNavGroups, toggleNavGroup } from '@/store/slices/uiSlice'

const itemClasses = (isActive, collapsed) =>
  cn(
    'group relative flex items-center gap-3 rounded-lg py-2.5 text-[0.8125rem] font-medium transition-colors',
    collapsed ? 'justify-center px-2' : 'px-3',
    isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
  )

export function SidebarNav({ collapsed = false, onNavigate }) {
  const dispatch = useAppDispatch()
  const openGroups = useAppSelector(selectOpenNavGroups)

  const toggle = useCallback((id) => dispatch(toggleNavGroup(id)), [dispatch])

  return (
    <nav className="flex flex-col gap-1 px-3 pb-6" aria-label="Main navigation">
      {NAV_SECTIONS.map((section, index) => (
        <div key={section.id} className={cn(index > 0 && 'mt-3 border-t border-line pt-3')}>
          {!collapsed ? (
            <p className="px-3 pb-1.5 pt-1 text-2xs font-bold uppercase tracking-wider text-ink-soft">
              {section.title}
            </p>
          ) : (
            <span className="sr-only">{section.title}</span>
          )}

          <ul className="space-y-0.5">
            {section.items.map((item) =>
              item.children ? (
                <NavGroup
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  open={openGroups.includes(item.id)}
                  onToggle={() => toggle(item.id)}
                  onNavigate={onNavigate}
                />
              ) : (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => itemClasses(isActive, collapsed)}
                  >
                    <item.icon size={17} className="shrink-0" />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function NavGroup({ item, collapsed, open, onToggle, onNavigate }) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        title={collapsed ? item.label : undefined}
        className={cn(itemClasses(false, collapsed), 'w-full')}
      >
        <item.icon size={17} className="shrink-0" />
        {!collapsed ? (
          <>
            <span className="truncate">{item.label}</span>
            <ChevronRight
              size={14}
              className={cn('ml-auto shrink-0 transition-transform duration-200', open && 'rotate-90')}
            />
          </>
        ) : null}
      </button>

      {open && !collapsed ? (
        <ul className="ml-[1.4rem] mt-0.5 space-y-0.5 border-l border-line pl-3">
          {item.children.map((child) => (
            <li key={child.id}>
              <NavLink
                to={child.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'block truncate rounded-md px-3 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
                  )
                }
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}
