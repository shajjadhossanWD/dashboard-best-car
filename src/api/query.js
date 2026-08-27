export const sum = (list, pick) => list.reduce((total, item) => total + pick(item), 0)

export const percentChange = (current, previous) => {
  if (!previous) return 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export function matchesSearch(row, term, fields) {
  if (!term) return true
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return fields.some((field) => String(row[field] ?? '').toLowerCase().includes(needle))
}

export function sortRows(rows, key, direction = 'asc') {
  if (!key) return rows
  const factor = direction === 'desc' ? -1 : 1

  return [...rows].sort((a, b) => {
    const left = a[key]
    const right = b[key]

    if (typeof left === 'number' && typeof right === 'number') return (left - right) * factor
    return String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true }) * factor
  })
}

export function paginate(rows, { page = 1, pageSize = 10 } = {}) {
  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const start = (safePage - 1) * pageSize

  return {
    rows: rows.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    pageCount,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
  }
}
