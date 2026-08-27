function niceStep(raw) {
  const exponent = Math.floor(Math.log10(raw))
  const magnitude = 10 ** exponent
  const fraction = raw / magnitude

  if (fraction <= 1) return magnitude
  if (fraction <= 2) return 2 * magnitude
  if (fraction <= 2.5) return 2.5 * magnitude
  if (fraction <= 5) return 5 * magnitude
  return 10 * magnitude
}

export function niceScale(values, { tickCount = 5, zeroBased = false } = {}) {
  const finite = values.filter((v) => Number.isFinite(v))
  if (finite.length === 0) return { min: 0, max: 1, ticks: [0, 1] }

  const dataMin = zeroBased ? 0 : Math.min(...finite)
  const dataMax = Math.max(...finite)

  if (dataMin === dataMax) {
    const pad = Math.abs(dataMin) * 0.1 || 1
    return { min: dataMin - pad, max: dataMax + pad, ticks: [dataMin - pad, dataMin, dataMax + pad] }
  }

  const step = niceStep((dataMax - dataMin) / Math.max(1, tickCount - 1))
  const min = Math.floor(dataMin / step) * step
  const max = Math.ceil(dataMax / step) * step

  const ticks = []
  for (let value = min; value <= max + step / 2; value += step) {
    ticks.push(Math.round(value * 1e6) / 1e6)
  }

  return { min, max, ticks }
}

export function smoothPath(points, tension = 0.32) {
  if (points.length === 0) return ''
  if (points.length < 3) return points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')

  let d = `M${points[0].x},${points[0].y}`

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2

    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }

  return d
}

export function nearestIndex(points, x) {
  let best = 0
  let bestDistance = Infinity

  points.forEach((point, index) => {
    const distance = Math.abs(point.x - x)
    if (distance < bestDistance) {
      bestDistance = distance
      best = index
    }
  })

  return best
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
