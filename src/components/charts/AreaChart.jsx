import { useCallback, useId, useMemo, useState } from 'react'
import { useElementSize } from '@/hooks/useElementSize'
import { cn } from '@/lib/cn'
import { ChartTooltip } from './ChartTooltip'
import { clamp, nearestIndex, niceScale, smoothPath } from './scale'

const PADDING = { top: 12, right: 12, bottom: 26, left: 46 }

export function AreaChart({
  data,
  height = 260,
  color = '#FF9F43',
  formatValue = (v) => v,
  formatTick = (v) => v,
  valueLabel = 'Value',
  className,
}) {
  const [containerRef, { width }] = useElementSize()
  const [activeIndex, setActiveIndex] = useState(null)
  const gradientId = useId()

  const chart = useMemo(() => {
    if (!width || !data?.length) return null

    const innerWidth = Math.max(0, width - PADDING.left - PADDING.right)
    const innerHeight = Math.max(0, height - PADDING.top - PADDING.bottom)
    const values = data.map((d) => d.value)
    const scale = niceScale(values, { tickCount: 5 })
    const span = scale.max - scale.min || 1

    const toX = (index) =>
      PADDING.left + (data.length === 1 ? innerWidth / 2 : (index / (data.length - 1)) * innerWidth)
    const toY = (value) => PADDING.top + innerHeight * (1 - (value - scale.min) / span)

    const points = data.map((d, index) => ({ ...d, x: toX(index), y: toY(d.value) }))
    const line = smoothPath(points)
    const baseline = PADDING.top + innerHeight

    return {
      points,
      line,
      area: `${line} L${points.at(-1).x},${baseline} L${points[0].x},${baseline} Z`,
      ticks: scale.ticks.map((value) => ({ value, y: toY(value) })),
      baseline,
      innerWidth,
      innerHeight,
      labelStep: Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerWidth / 52)))),
    }
  }, [data, width, height])

  const handlePointer = useCallback(
    (event) => {
      if (!chart) return
      const bounds = event.currentTarget.getBoundingClientRect()
      setActiveIndex(nearestIndex(chart.points, event.clientX - bounds.left))
    },
    [chart],
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (!chart) return
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      setActiveIndex((current) => {
        const next = (current ?? 0) + (event.key === 'ArrowRight' ? 1 : -1)
        return clamp(next, 0, chart.points.length - 1)
      })
    },
    [chart],
  )

  const active = activeIndex != null ? chart?.points[activeIndex] : null

  return (
    <div ref={containerRef} className={cn('relative w-full', className)} style={{ height }}>
      {chart ? (
        <>
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`${valueLabel} by period`}
            tabIndex={0}
            className="block touch-pan-y outline-none"
            onMouseMove={handlePointer}
            onMouseLeave={() => setActiveIndex(null)}
            onPointerDown={handlePointer}
            onKeyDown={handleKeyDown}
            onBlur={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.42" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {chart.ticks.map((tick) => (
              <g key={tick.value}>
                <line
                  x1={PADDING.left}
                  x2={PADDING.left + chart.innerWidth}
                  y1={tick.y}
                  y2={tick.y}
                  stroke="#EDF0F2"
                  strokeWidth="1"
                />
                <text
                  x={PADDING.left - 10}
                  y={tick.y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-ink-soft text-[10px] font-medium"
                >
                  {formatTick(tick.value)}
                </text>
              </g>
            ))}

            <path d={chart.area} fill={`url(#${gradientId})`} />
            <path
              d={chart.line}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chart.points.map((point, index) => (
              <circle
                key={point.label}
                cx={point.x}
                cy={point.y}
                r={activeIndex === index ? 0 : 3}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            ))}

            {chart.points.map((point, index) =>
              index % chart.labelStep === 0 ? (
                <text
                  key={`x-${point.label}`}
                  x={point.x}
                  y={chart.baseline + 16}
                  textAnchor="middle"
                  className={cn(
                    'text-[10px] font-medium',
                    activeIndex === index ? 'fill-ink' : 'fill-ink-soft',
                  )}
                >
                  {point.label}
                </text>
              ) : null,
            )}

            {active ? (
              <g pointerEvents="none">
                <line
                  x1={active.x}
                  x2={active.x}
                  y1={PADDING.top}
                  y2={chart.baseline}
                  stroke={color}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <circle cx={active.x} cy={active.y} r="5" fill={color} stroke="#FFFFFF" strokeWidth="2.5" />
              </g>
            ) : null}
          </svg>

          {active ? (
            <ChartTooltip x={active.x} y={Math.max(28, active.y - 12)} boundsWidth={width}>
              <div className="rounded-lg bg-navy-700 px-2.5 py-1.5 text-center shadow-popover">
                <p className="text-2xs font-medium text-white/70">{active.label}</p>
                <p className="whitespace-nowrap text-xs font-bold text-white">
                  {formatValue(active.value)}
                </p>
              </div>
            </ChartTooltip>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
