import { request } from './client'
import { percentChange, sum } from './query'
import { daysBetween, eachDay, previousRange } from '@/lib/date'
import {
  AVAILABLE_YEARS,
  LIFETIME,
  PRODUCTS,
  PRODUCT_BY_ID,
  TRANSACTION_STATUSES,
  getDailyProductUnits,
  getDailyStats,
  getDailyTransactions,
  getMonthlySeries,
  getRegionSales,
} from '@/mocks/db'

const PERIOD_LABELS = {
  week: 'last week',
  month: 'last month',
  year: 'last year',
}

const comparisonLabel = (range) => {
  const days = daysBetween(range.from, range.to)
  if (days <= 1) return 'yesterday'
  if (days <= 7) return 'last week'
  if (days <= 31) return 'last month'
  return 'the previous period'
}

const aggregateRange = ({ from, to }) => {
  const days = eachDay(from, to).map(getDailyStats)
  return {
    revenue: Math.round(sum(days, (d) => d.revenue) * 100) / 100,
    orders: sum(days, (d) => d.orders),
    units: sum(days, (d) => d.units),
    days,
  }
}

export const fetchOverview = ({ range, signal } = {}) =>
  request(() => {
    const current = aggregateRange(range)
    const previous = aggregateRange(previousRange(range))

    return {
      earning: {
        total: current.revenue,
        changePercent: percentChange(current.revenue, previous.revenue),
        comparedTo: comparisonLabel(range),
        trend: current.days.map((d) => d.revenue),
      },
      totalSales: {
        value: LIFETIME.totalSales + current.orders,
        label: 'No of Total Sales',
      },
      purchasedGoods: {
        value: LIFETIME.purchasedGoods + Math.round(current.units / 4),
        label: 'No of Purchased Goods',
      },
    }
  }, { signal })

export const fetchBestSellers = ({ range, limit = 5, signal } = {}) =>
  request(() => {
    const totals = new Map(PRODUCTS.map((p) => [p.id, 0]))

    for (const day of eachDay(range.from, range.to)) {
      for (const row of getDailyProductUnits(day)) {
        totals.set(row.productId, (totals.get(row.productId) ?? 0) + row.units)
      }
    }

    return [...totals.entries()]
      .map(([productId, units]) => {
        const product = PRODUCT_BY_ID[productId]
        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          color: product.color,
          body: product.body,
          category: product.category,
          sales: units,
        }
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
  }, { signal })

export const fetchTransactions = ({ range, limit = 5, status = 'all', signal } = {}) =>
  request(() => {
    const days = eachDay(range.from, range.to).reverse()
    const rows = []

    for (const day of days) {
      const dayRows = getDailyTransactions(day)
        .filter((tx) => status === 'all' || tx.status === status)
        .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))

      rows.push(...dayRows)
      if (rows.length >= limit) break
    }

    return {
      rows: rows.slice(0, limit),
      total: rows.length,
      statuses: TRANSACTION_STATUSES.map(({ id, label, tone }) => ({ id, label, tone })),
    }
  }, { signal })

export const fetchSalesAnalytics = ({ year, signal } = {}) =>
  request(() => {
    const series = getMonthlySeries(year)
    const total = sum(series, (p) => p.value)
    const previousTotal = sum(getMonthlySeries(year - 1), (p) => p.value)

    return {
      year,
      availableYears: AVAILABLE_YEARS,
      points: series,
      total,
      changePercent: percentChange(total, previousTotal),
      peak: series.reduce((best, p) => (p.value > best.value ? p : best), series[0]),
    }
  }, { signal })

export const fetchSalesByCountry = ({ period, signal } = {}) =>
  request(() => {
    const regions = getRegionSales(period)
    const total = sum(regions, (r) => r.sales)
    const previous = sum(getRegionSales(period, -1), (r) => r.sales)

    return {
      period,
      regions: regions.map((r) => ({ ...r, percentOfTotal: Math.round((r.sales / total) * 1000) / 10 })),
      total,
      changePercent: percentChange(total, previous),
      comparedTo: PERIOD_LABELS[period] ?? 'last week',
      max: Math.max(...regions.map((r) => r.sales)),
    }
  }, { signal })

export const fetchSession = ({ signal } = {}) =>
  request(
    () => ({
      user: {
        id: 'u-1',
        name: 'Mike Witzel',
        role: 'Store Admin',
        email: 'mike.witzel@bestcar.io',
        initials: 'MW',
      },
      stores: [
        { id: 'coming-soon', label: 'Coming Soon' },
        { id: 'main-warehouse', label: 'Main Warehouse' },
        { id: 'downtown', label: 'Downtown Store' },
        { id: 'airport-road', label: 'Airport Road' },
      ],
      notifications: 21,
      messages: 4,
      locale: { code: 'en-US', label: 'English', flag: 'us' },
    }),
    { signal, latency: 120 },
  )
