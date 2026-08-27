import { cloneElement, useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/cn'

// Nudges the panel back inside the viewport. Applied as a margin, not a
// transform, which the panel animation already owns.
function useEdgeShift(open, panelRef) {
  const [shift, setShift] = useState(0)

  useLayoutEffect(() => {
    if (!open) {
      setShift(0)
      return
    }

    const panel = panelRef.current
    if (!panel) return

    const gap = 8
    const { left, right } = panel.getBoundingClientRect()

    if (right > window.innerWidth - gap) setShift(-(right - (window.innerWidth - gap)))
    else if (left < gap) setShift(gap - left)
  }, [open, panelRef])

  return shift
}

export function Dropdown({ trigger, children, align = 'right', panelClassName, className }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const id = useId()

  const close = useCallback(() => setOpen(false), [])
  useClickOutside([triggerRef, panelRef], close, open)
  const shift = useEdgeShift(open, panelRef)

  return (
    <div className={cn('relative', className)}>
      {cloneElement(trigger({ open, toggle: () => setOpen((v) => !v) }), {
        ref: triggerRef,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
      })}

      {open ? (
        <div
          ref={panelRef}
          id={id}
          role="menu"
          style={align === 'left' ? { marginLeft: shift } : { marginRight: -shift }}
          className={cn(
            'absolute top-[calc(100%+0.375rem)] z-popover min-w-[11rem] animate-fade-in overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-popover',
            align === 'left' ? 'left-0' : 'right-0',
            panelClassName,
          )}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      ) : null}
    </div>
  )
}

export function MenuItem({ selected = false, className, children, ...props }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors',
        selected ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {selected ? <Check size={13} className="shrink-0" /> : null}
    </button>
  )
}

export function MenuLabel({ children }) {
  return <p className="px-2.5 pb-1 pt-1.5 text-2xs font-semibold uppercase tracking-wide text-ink-soft">{children}</p>
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-line" />
}

export function SelectMenu({
  value,
  options,
  onChange,
  icon: Icon,
  label,
  size = 'sm',
  align = 'right',
  className,
}) {
  const active = options.find((option) => option.id === value)

  return (
    <Dropdown
      align={align}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={label}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface font-semibold text-ink-muted transition-colors hover:border-brand-400 hover:text-ink',
            size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3 text-[0.8125rem]',
            open && 'border-brand-500 text-ink',
            className,
          )}
        >
          {Icon ? <Icon size={13} className="shrink-0 text-ink-soft" /> : null}
          <span className="truncate">{active?.label ?? label}</span>
          <ChevronDown
            size={13}
            className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      )}
    >
      {({ close }) =>
        options.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.id === value}
            onClick={() => {
              onChange(option.id)
              close()
            }}
          >
            {option.label}
          </MenuItem>
        ))
      }
    </Dropdown>
  )
}
