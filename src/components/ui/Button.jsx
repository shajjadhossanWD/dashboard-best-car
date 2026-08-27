import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

const VARIANTS = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm',
  dark: 'bg-navy-700 text-white hover:bg-navy-600 active:bg-navy-800 shadow-sm',
  outline: 'border border-line-strong bg-surface text-ink hover:border-brand-500 hover:text-brand-600',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  ghost: 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
  link: 'text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline',
}

const SIZES = {
  xs: 'h-7 gap-1 px-2.5 text-2xs font-semibold',
  sm: 'h-8 gap-1.5 px-3 text-xs font-semibold',
  md: 'h-9 gap-2 px-3.5 text-[0.8125rem] font-semibold',
  lg: 'h-10 gap-2 px-4 text-sm font-semibold',
  icon: 'h-9 w-9 justify-center',
  'icon-sm': 'h-8 w-8 justify-center',
}

export const Button = forwardRef(function Button(
  { as: Tag = 'button', variant = 'primary', size = 'md', className, type, ...props },
  ref,
) {
  return (
    <Tag
      ref={ref}
      type={Tag === 'button' ? type || 'button' : type}
      className={cn(
        'inline-flex select-none items-center whitespace-nowrap rounded-lg transition-colors duration-150',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
})

export const IconButton = forwardRef(function IconButton(
  { label, size = 'icon-sm', variant = 'ghost', className, children, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      aria-label={label}
      title={label}
      className={cn('rounded-lg', className)}
      {...props}
    >
      {children}
    </Button>
  )
})
