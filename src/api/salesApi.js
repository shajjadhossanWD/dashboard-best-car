import { request } from './client'
import { matchesSearch, paginate, sortRows, sum } from './query'
import { eachDay } from '@/lib/date'
import { PAYMENT_METHODS, TRANSACTION_STATUSES, getDailyTransactions } from '@/mocks/db'

function ordersInRange(range) {
  return eachDay(range.from, range.to)
    .flatMap(getDailyTransactions)
    .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
}

export const fetchSalesList = ({
  range,
  status = 'all',
  method = 'all',
  search = '',
  sortBy = 'placedAt',
  sortDir = 'desc',
  page = 1,
  pageSize = 8,
  signal,
} = {}) =>
  request(() => {
    const orders = ordersInRange(range)

    const filtered = orders
      .filter((row) => status === 'all' || row.status === status)
      .filter((row) => method === 'all' || row.paymentMethodId === method)
      .filter((row) =>
        matchesSearch(row, search, ['reference', 'productName', 'customerName', 'paymentMethod']),
      )

    const sortable = filtered.map((row) => ({ ...row, placedAtValue: new Date(row.placedAt).getTime() }))
    const sortKey = sortBy === 'placedAt' ? 'placedAtValue' : sortBy

    const successful = filtered.filter((row) => row.status === 'success')

    return {
      ...paginate(sortRows(sortable, sortKey, sortDir), { page, pageSize }),
      statuses: [
        { id: 'all', label: 'All statuses' },
        ...TRANSACTION_STATUSES.map(({ id, label, tone }) => ({ id, label, tone })),
      ],
      methods: [{ id: 'all', label: 'All methods' }, ...PAYMENT_METHODS],
      summary: {
        orders: filtered.length,
        revenue: Math.round(sum(successful, (row) => row.amount) * 100) / 100,
        averageOrder: successful.length
          ? Math.round((sum(successful, (row) => row.amount) / successful.length) * 100) / 100
          : 0,
        cancelled: filtered.filter((row) => row.status === 'cancelled').length,
      },
    }
  }, { signal })
