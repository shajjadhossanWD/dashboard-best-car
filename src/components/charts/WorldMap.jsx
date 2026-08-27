import { useMemo, useState } from 'react'
import { useElementSize } from '@/hooks/useElementSize'
import { ChartTooltip } from './ChartTooltip'
import { cn } from '@/lib/cn'
import { CHOROPLETH_STEPS, WORLD_REGIONS, WORLD_VIEWBOX, choroplethStep } from './worldGeo'

export function WorldMap({ data = [], height = 210, formatValue = (v) => v, className }) {
  const [containerRef, size] = useElementSize()
  const [hovered, setHovered] = useState(null)

  const byRegion = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.sales ?? 0))
    return Object.fromEntries(
      data.map((region) => [region.id, { ...region, step: choroplethStep(region.sales, max) }]),
    )
  }, [data])

  const active = hovered ? byRegion[hovered.id] : null

  return (
    <div ref={containerRef} className={cn('relative w-full', className)} style={{ height }}>
      <svg
        viewBox={WORLD_VIEWBOX}
        className="h-full w-full"
        role="img"
        aria-label="Sales by region"
        onMouseLeave={() => setHovered(null)}
      >
        {WORLD_REGIONS.map((region) => {
          const metrics = byRegion[region.id]
          const isActive = hovered?.id === region.id

          return (
            <g
              key={region.id}
              tabIndex={metrics ? 0 : -1}
              role={metrics ? 'button' : undefined}
              aria-label={metrics ? `${region.name}: ${formatValue(metrics.sales)}` : region.name}
              className="cursor-pointer outline-none transition-opacity"
              style={{ opacity: hovered && !isActive ? 0.55 : 1 }}
              onMouseEnter={() => metrics && setHovered({ id: region.id, at: region.labelAt })}
              onFocus={() => metrics && setHovered({ id: region.id, at: region.labelAt })}
              onBlur={() => setHovered(null)}
            >
              {region.shapes.map((d) => (
                <path
                  key={d.slice(0, 24)}
                  d={d}
                  fill={CHOROPLETH_STEPS[metrics?.step ?? 0]}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  className="transition-[fill] duration-200"
                />
              ))}
            </g>
          )
        })}
      </svg>

      {active && hovered ? (
        <Tooltip
          region={active}
          at={hovered.at}
          size={size}
          formatValue={formatValue}
        />
      ) : null}
    </div>
  )
}

function Tooltip({ region, at, size, formatValue }) {
  const [vbX, vbY, vbW, vbH] = WORLD_VIEWBOX.split(' ').map(Number)
  const left = ((at.x - vbX) / vbW) * size.width
  const top = ((at.y - vbY) / vbH) * size.height

  return (
    <ChartTooltip x={left} y={Math.max(46, top)} boundsWidth={size.width}>
      <div className="rounded-md bg-brand-500 px-3 py-1.5 text-center shadow-popover">
        <p className="whitespace-nowrap text-xs font-semibold text-white">{region.name}</p>
        <p className="whitespace-nowrap text-2xs font-medium text-white/85">
          {formatValue(region.sales)} Sales
        </p>
      </div>
      <div className="mx-auto h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-brand-500" />
    </ChartTooltip>
  )
}

export function ChoroplethLegend({ className }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-2xs font-medium text-ink-soft">Low</span>
      <div className="flex overflow-hidden rounded">
        {CHOROPLETH_STEPS.slice(1).map((color) => (
          <span key={color} className="h-2 w-5" style={{ backgroundColor: color }} />
        ))}
      </div>
      <span className="text-2xs font-medium text-ink-soft">High</span>
    </div>
  )
}
