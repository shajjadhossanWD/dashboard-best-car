export const LOCALE = 'en-US'
export const CURRENCY = 'USD'

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const currencyWholeFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
})

const compactFormatter = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat(LOCALE)

export const formatCurrency = (value, { decimals = true } = {}) =>
  (decimals ? currencyFormatter : currencyWholeFormatter).format(Number(value) || 0)

export const formatNumber = (value) => numberFormatter.format(Number(value) || 0)

export const formatCompact = (value) => compactFormatter.format(Number(value) || 0)

export const formatPercent = (value, { withSign = false } = {}) => {
  const n = Number(value) || 0
  const sign = withSign && n > 0 ? '+' : ''
  return `${sign}${Math.abs(n) % 1 === 0 ? n : n.toFixed(1)}%`
}

const dateParts = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const formatDate = (input) => {
  const parts = Object.fromEntries(
    dateParts.formatToParts(toDate(input)).map(({ type, value }) => [type, value]),
  )
  return `${parts.day} ${parts.month} ${parts.year}`
}

export const formatDateRange = (start, end) => `${formatDate(start)} - ${formatDate(end)}`

export const formatRelativeTime = (input, now = Date.now()) => {
  const diffMs = Math.max(0, now - toDate(input).getTime())
  const mins = Math.round(diffMs / 60000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} ${plural(mins, 'Min')}`

  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} ${plural(hours, 'Hour')}`

  const days = Math.round(hours / 24)
  return `${days} ${plural(days, 'Day')}`
}

export const formatMilestone = (value) => `${formatNumber(value)}+`

const plural = (n, word) => (n === 1 ? word : `${word}s`)

function toDate(input) {
  return input instanceof Date ? input : new Date(input)
}

export const toISODate = (input) => {
  const d = toDate(input)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

const timeParts = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false })

export const formatDateTime = (input) => `${formatDate(input)}, ${timeParts.format(toDate(input))}`
