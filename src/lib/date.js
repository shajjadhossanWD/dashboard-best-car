import { toISODate } from './format'

export const MS_PER_DAY = 86400000

export const parseISO = (iso) => new Date(`${iso}T00:00:00`)

export const addDays = (iso, days) => toISODate(new Date(parseISO(iso).getTime() + days * MS_PER_DAY))

export const daysBetween = (from, to) =>
  Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / MS_PER_DAY) + 1

export function eachDay(from, to, { max = 400 } = {}) {
  const days = []
  const total = Math.min(daysBetween(from, to), max)
  for (let i = 0; i < total; i += 1) days.push(addDays(from, i))
  return days
}

export function previousRange({ from, to }) {
  const length = daysBetween(from, to)
  return { from: addDays(from, -length), to: addDays(from, -1) }
}

export const startOfWeek = (date = new Date()) => {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  return toISODate(d)
}

export const startOfMonth = (date = new Date()) =>
  toISODate(new Date(date.getFullYear(), date.getMonth(), 1))

export const startOfYear = (date = new Date()) => toISODate(new Date(date.getFullYear(), 0, 1))

export const DATE_PRESETS = [
  {
    id: 'last-7',
    label: 'Last 7 days',
    resolve: () => ({ from: addDays(toISODate(new Date()), -6), to: toISODate(new Date()) }),
  },
  {
    id: 'last-30',
    label: 'Last 30 days',
    resolve: () => ({ from: addDays(toISODate(new Date()), -29), to: toISODate(new Date()) }),
  },
  {
    id: 'this-month',
    label: 'This month',
    resolve: () => ({ from: startOfMonth(), to: toISODate(new Date()) }),
  },
  {
    id: 'this-year',
    label: 'This year',
    resolve: () => ({ from: startOfYear(), to: toISODate(new Date()) }),
  },
  {
    id: 'jan-2024',
    label: '01 Jan 2024 - 07 Jan 2024',
    resolve: () => ({ from: '2024-01-01', to: '2024-01-07' }),
  },
]

export const resolvePreset = (id) => DATE_PRESETS.find((p) => p.id === id)?.resolve() ?? null

export const isSameRange = (a, b) => Boolean(a && b && a.from === b.from && a.to === b.to)
