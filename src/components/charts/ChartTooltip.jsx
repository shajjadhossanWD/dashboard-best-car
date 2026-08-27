import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

export function ChartTooltip({ x, y, boundsWidth, edgeGap = 4, className, children }) {
  const ref = useRef(null)
  const [halfWidth, setHalfWidth] = useState(0)

  useLayoutEffect(() => {
    if (ref.current) setHalfWidth(ref.current.offsetWidth / 2)
  }, [children])

  const min = halfWidth + edgeGap
  const max = Math.max(min, boundsWidth - halfWidth - edgeGap)

  return (
    <div
      ref={ref}
      className={cn('pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full', className)}
      style={{ left: Math.min(Math.max(x, min), max), top: y }}
    >
      {/* The animation sits on an inner element: its keyframes set `transform`,
          which would otherwise cancel the centering above. */}
      <div className="animate-fade-in">{children}</div>
    </div>
  )
}
