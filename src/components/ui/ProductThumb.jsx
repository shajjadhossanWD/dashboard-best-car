import { cn } from '@/lib/cn'

const PROFILES = {
  sedan: {
    body: 'M3 21 L5.5 15.5 C6 14.2 7 13.6 8.6 13.6 L15 13.6 L20 7.4 C20.9 6.4 21.9 6 23.4 6 L31 6 C32.6 6 33.6 6.5 34.4 7.6 L38.5 13.6 L43 14.6 C44.4 15 45 15.9 45 17.3 L45 21 Z',
    glass: 'M22.3 8.2 L30.6 8.2 C31.4 8.2 31.9 8.5 32.4 9.2 L35.2 13.3 L22.3 13.3 Z M20.6 8.6 L20.6 13.3 L16.4 13.3 Z',
  },
  suv: {
    body: 'M3 21 L4.8 14.4 C5.3 12.9 6.3 12.2 8 12.2 L14.4 12.2 L18.8 5.6 C19.7 4.4 20.8 4 22.4 4 L32 4 C33.7 4 34.7 4.6 35.4 5.9 L39 12.2 L43.2 13.4 C44.5 13.8 45 14.7 45 16.1 L45 21 Z',
    glass: 'M23.4 6.3 L31.4 6.3 C32.3 6.3 32.8 6.6 33.2 7.4 L35.8 11.9 L23.4 11.9 Z M21.6 6.6 L21.6 11.9 L16.1 11.9 Z',
  },
  hatch: {
    body: 'M4 21 L6 16 C6.5 14.7 7.4 14.1 8.9 14.1 L16 14.1 L20.6 8 C21.5 6.9 22.5 6.5 24 6.5 L30.5 6.5 C32.2 6.5 33.2 7.1 34 8.4 L37.6 14.4 L42.6 15.4 C43.9 15.7 44.5 16.5 44.5 17.8 L44.5 21 Z',
    glass: 'M23.4 8.7 L30 8.7 C30.9 8.7 31.4 9 31.8 9.7 L34.4 13.9 L23.4 13.9 Z M21.6 9 L21.6 13.9 L17.2 13.9 Z',
  },
}

const SIZES = {
  sm: 'h-8 w-10',
  md: 'h-9 w-12',
  lg: 'h-11 w-14',
}

export function ProductThumb({ name, color = '#8E9AAF', body = 'sedan', size = 'md', className }) {
  const profile = PROFILES[body] ?? PROFILES.sedan

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-md bg-surface-sunken ring-1 ring-inset ring-line',
        SIZES[size],
        className,
      )}
    >
      <svg viewBox="0 0 48 28" className="h-full w-full p-0.5" role="img" aria-label={name}>
        <ellipse cx="24" cy="24.4" rx="19" ry="1.6" fill="#0F172A" opacity="0.08" />
        <path d={profile.body} fill={color} />
        <path d={profile.glass} fill="#FFFFFF" opacity="0.82" />
        <g fill="#1F2733">
          <circle cx="14" cy="21" r="4.2" />
          <circle cx="35" cy="21" r="4.2" />
        </g>
        <g fill="#E7EAEE">
          <circle cx="14" cy="21" r="1.7" />
          <circle cx="35" cy="21" r="1.7" />
        </g>
      </svg>
    </span>
  )
}
