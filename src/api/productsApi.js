import { request } from './client'
import { matchesSearch, paginate, sortRows, sum } from './query'
import { eachDay } from '@/lib/date'
import {
  PRODUCTS,
  PRODUCT_BY_ID,
  PRODUCT_CATEGORIES,
  REORDER_LEVEL,
  STOCK_STATUSES,
  getDailyProductUnits,
  getProductStock,
  getStockStatus,
} from '@/mocks/db'

function unitsByProduct(range) {
  const totals = new Map(PRODUCTS.map((product) => [product.id, 0]))

  for (const day of eachDay(range.from, range.to)) {
    for (const row of getDailyProductUnits(day)) {
      totals.set(row.productId, (totals.get(row.productId) ?? 0) + row.units)
    }
  }

  return totals
}

export const fetchProductList = ({
  range,
  search = '',
  category = 'all',
  status = 'all',
  sortBy = 'unitsSold',
  sortDir = 'desc',
  page = 1,
  pageSize = 8,
  signal,
} = {}) =>
  request(() => {
    const units = unitsByProduct(range)

    const catalogue = PRODUCTS.map((product) => {
      const unitsSold = units.get(product.id) ?? 0
      const stock = getProductStock(product.id)

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        color: product.color,
        body: product.body,
        unitsSold,
        revenue: Math.round(unitsSold * product.price * 100) / 100,
        stock,
        stockStatus: getStockStatus(stock),
      }
    })

    const filtered = catalogue
      .filter((row) => category === 'all' || row.category.toLowerCase() === category)
      .filter((row) => status === 'all' || row.stockStatus === status)
      .filter((row) => matchesSearch(row, search, ['name', 'sku', 'category']))

    return {
      ...paginate(sortRows(filtered, sortBy, sortDir), { page, pageSize }),
      categories: [{ id: 'all', label: 'All categories' }, ...PRODUCT_CATEGORIES],
      statuses: [{ id: 'all', label: 'All stock levels' }, ...STOCK_STATUSES],
      reorderLevel: REORDER_LEVEL,
      summary: {
        products: catalogue.length,
        unitsSold: sum(catalogue, (row) => row.unitsSold),
        revenue: Math.round(sum(catalogue, (row) => row.revenue) * 100) / 100,
        lowStock: catalogue.filter((row) => row.stockStatus !== 'in-stock').length,
      },
    }
  }, { signal })

export const fetchProduct = ({ id, signal } = {}) =>
  request(() => {
    const product = PRODUCT_BY_ID[id]
    if (!product) throw new Error(`No product with id "${id}"`)
    const stock = getProductStock(id)
    return { ...product, stock, stockStatus: getStockStatus(stock) }
  }, { signal })
