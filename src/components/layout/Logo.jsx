import { BRAND } from '@/constants/brand'
import { cn } from '@/lib/cn'

const SWOOSH = (
  <g fill={BRAND.red}>
    <path d="M6,72 C34,52 78,36 132,29 C176,23 216,25 250,32 C214,31 172,33 132,40 C82,49 38,60 6,72 Z" />
    <path d="M138,36 C166,19 190,10 218,9 C252,8 284,16 314,28 C286,20 254,15 220,17 C188,19 162,26 138,36 Z" />
  </g>
)

const HOOK = (
  <path
    d="M44,98 C26,100 14,110 14,120 C14,131 25,140 40,140 C31,133 26,127 26,120 C26,110 33,102 44,98 Z"
    fill={BRAND.blue}
  />
)

const FONT_STACK = "Inter, 'Segoe UI', Helvetica, Arial, sans-serif"

export function Logo({ compact = false, className }) {
  if (compact) {
    return (
      <svg
        viewBox="0 0 96 96"
        className={cn('h-9 w-9 shrink-0', className)}
        role="img"
        aria-label={BRAND.name}
      >
        <g transform="translate(1 12) scale(0.295)">{SWOOSH}</g>
        <text
          x="48"
          y="84"
          textAnchor="middle"
          fontFamily={FONT_STACK}
          fontSize="64"
          fontWeight="800"
          letterSpacing="-2"
          fill={BRAND.blue}
        >
          B
        </text>
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 320 150"
      className={cn('h-11 w-auto shrink-0', className)}
      role="img"
      aria-label={BRAND.name}
    >
      {SWOOSH}
      {HOOK}
      <text x="44" y="138" fontFamily={FONT_STACK} fill={BRAND.blue}>
        <tspan fontSize="76" fontWeight="800" letterSpacing="-3">
          Best
        </tspan>
        <tspan fontSize="34" fontWeight="600" letterSpacing="-0.5">
          Car
        </tspan>
      </text>
    </svg>
  )
}
