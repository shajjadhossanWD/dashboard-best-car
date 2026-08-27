// Mock data source. Daily metrics are derived from the date itself, so any
// range the user picks returns consistent figures without a large fixture file.
import { createRng, seededInt, seededPick } from './seed'

export const PRODUCTS = [
  { id: 'p-rr', name: 'Range Rover', sku: 'RNG-4421', price: 260, color: '#8E9AAF', body: 'suv', category: 'SUV', weight: 26 },
  { id: 'p-a3', name: 'Audi S3', sku: 'AUD-1189', price: 1474, color: '#D6403B', body: 'sedan', category: 'Sedan', weight: 20 },
  { id: 'p-nis', name: 'Blue Nissan', sku: 'NIS-7730', price: 8784, color: '#1F5FA8', body: 'sedan', category: 'Sedan', weight: 16 },
  { id: 'p-cor', name: 'Toyota Corolla', sku: 'TOY-3310', price: 3240, color: '#9E2B2B', body: 'sedan', category: 'Sedan', weight: 13 },
  { id: 'p-cmp', name: 'Compact car', sku: 'CMP-0092', price: 597, color: '#3A3F47', body: 'hatch', category: 'Hatchback', weight: 11 },

  { id: 'p-red', name: 'Red Toyota', sku: 'TOY-5512', price: 2140, color: '#C6362F', body: 'suv', category: 'SUV', weight: 9 },
  { id: 'p-blk', name: 'Black Mercedes', sku: 'MRC-2214', price: 6120, color: '#22262C', body: 'sedan', category: 'Sedan', weight: 8 },
  { id: 'p-bmw3', name: 'BMW 320i', sku: 'BMW-3201', price: 5480, color: '#2C3E55', body: 'sedan', category: 'Sedan', weight: 8 },
  { id: 'p-cx5', name: 'Mazda CX-5', sku: 'MZD-0512', price: 4310, color: '#7A1F2B', body: 'suv', category: 'SUV', weight: 7 },
  { id: 'p-tuc', name: 'Hyundai Tucson', sku: 'HYU-2280', price: 3890, color: '#4A6E8A', body: 'suv', category: 'SUV', weight: 7 },
  { id: 'p-golf', name: 'VW Golf GTI', sku: 'VWG-7781', price: 3120, color: '#B03A2E', body: 'hatch', category: 'Hatchback', weight: 7 },
  { id: 'p-civ', name: 'Honda Civic', sku: 'HON-1140', price: 2760, color: '#586274', body: 'sedan', category: 'Sedan', weight: 6 },
  { id: 'p-rav', name: 'Toyota RAV4', sku: 'TOY-9902', price: 4620, color: '#3E5A45', body: 'suv', category: 'SUV', weight: 6 },
  { id: 'p-ka', name: 'Kia Sportage', sku: 'KIA-4417', price: 3560, color: '#8C5A2B', body: 'suv', category: 'SUV', weight: 6 },
  { id: 'p-mod3', name: 'Tesla Model 3', sku: 'TSL-0003', price: 9450, color: '#E4E7EB', body: 'sedan', category: 'Electric', weight: 5 },
  { id: 'p-leaf', name: 'Nissan Leaf', sku: 'NIS-0221', price: 2980, color: '#2E8B9E', body: 'hatch', category: 'Electric', weight: 5 },
  { id: 'p-id4', name: 'VW ID.4', sku: 'VWE-0404', price: 6740, color: '#4C6EA8', body: 'suv', category: 'Electric', weight: 5 },
  { id: 'p-f150', name: 'Ford F-150', sku: 'FRD-1500', price: 7320, color: '#1E3A5F', body: 'suv', category: 'Pickup', weight: 5 },
  { id: 'p-hilux', name: 'Toyota Hilux', sku: 'TOY-4410', price: 5910, color: '#6B7280', body: 'suv', category: 'Pickup', weight: 4 },
  { id: 'p-ranger', name: 'Ford Ranger', sku: 'FRD-7712', price: 5240, color: '#2F4858', body: 'suv', category: 'Pickup', weight: 4 },
  { id: 'p-mus', name: 'Ford Mustang', sku: 'FRD-0066', price: 11200, color: '#C0392B', body: 'sedan', category: 'Coupe', weight: 4 },
  { id: 'p-supra', name: 'Toyota Supra', sku: 'TOY-0090', price: 12480, color: '#D35400', body: 'sedan', category: 'Coupe', weight: 3 },
  { id: 'p-cay', name: 'Porsche Cayman', sku: 'POR-9812', price: 18600, color: '#4B5563', body: 'sedan', category: 'Coupe', weight: 3 },
  { id: 'p-tran', name: 'Ford Transit', sku: 'FRD-3300', price: 4870, color: '#95A5A6', body: 'suv', category: 'Van', weight: 3 },
  { id: 'p-vito', name: 'Mercedes Vito', sku: 'MRC-8840', price: 6350, color: '#7F8C8D', body: 'suv', category: 'Van', weight: 3 },
  { id: 'p-part', name: 'Peugeot Partner', sku: 'PEU-2200', price: 2450, color: '#5D6D7E', body: 'suv', category: 'Van', weight: 2 },
  { id: 'p-fies', name: 'Ford Fiesta', sku: 'FRD-0011', price: 1180, color: '#2980B9', body: 'hatch', category: 'Hatchback', weight: 2 },
  { id: 'p-polo', name: 'VW Polo', sku: 'VWP-0055', price: 1640, color: '#A93226', body: 'hatch', category: 'Hatchback', weight: 2 },
  { id: 'p-i10', name: 'Hyundai i10', sku: 'HYU-0110', price: 980, color: '#34495E', body: 'hatch', category: 'Hatchback', weight: 2 },
  { id: 'p-clio', name: 'Renault Clio', sku: 'REN-0440', price: 1390, color: '#E67E22', body: 'hatch', category: 'Hatchback', weight: 1 },
]

export const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

export const PAYMENT_METHODS = [
  { id: 'paypal', label: 'Paypal' },
  { id: 'apple-pay', label: 'Apple Pay' },
  { id: 'stripe', label: 'Stripe' },
  { id: 'payu', label: 'PayU' },
  { id: 'paytm', label: 'Paytm' },
]

export const TRANSACTION_STATUSES = [
  { id: 'success', label: 'Success', tone: 'success', weight: 68 },
  { id: 'pending', label: 'Pending', tone: 'info', weight: 18 },
  { id: 'cancelled', label: 'Cancelled', tone: 'danger', weight: 14 },
]

export const CUSTOMERS = [
  { id: 'c-1', name: 'Aaron Fletcher', email: 'aaron.fletcher@mail.com' },
  { id: 'c-2', name: 'Nadia Karim', email: 'nadia.karim@mail.com' },
  { id: 'c-3', name: 'Devon Ellis', email: 'devon.ellis@mail.com' },
  { id: 'c-4', name: 'Priya Raman', email: 'priya.raman@mail.com' },
  { id: 'c-5', name: 'Marco Bellini', email: 'marco.bellini@mail.com' },
  { id: 'c-6', name: 'Sofia Almeida', email: 'sofia.almeida@mail.com' },
  { id: 'c-7', name: 'Ibrahim Toure', email: 'ibrahim.toure@mail.com' },
  { id: 'c-8', name: 'Hannah Vogt', email: 'hannah.vogt@mail.com' },
]

export const REGIONS = [
  { id: 'africa', name: 'Africa', share: 0.26 },
  { id: 'asia', name: 'Asia', share: 0.24 },
  { id: 'europe', name: 'Europe', share: 0.19 },
  { id: 'north-america', name: 'North America', share: 0.16 },
  { id: 'south-america', name: 'South America', share: 0.09 },
  { id: 'oceania', name: 'Oceania', share: 0.06 },
]

export const LIFETIME = {
  totalSales: 10248,
  purchasedGoods: 842,
}

const FIRST_TRADING_YEAR = 2021
export const AVAILABLE_YEARS = Array.from(
  { length: new Date().getFullYear() - FIRST_TRADING_YEAR + 1 },
  (_, index) => FIRST_TRADING_YEAR + index,
)

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const MONTH_SEASONALITY = [0.62, 0.95, 1.18, 0.78, 0.72, 0.82, 1.52, 0.74, 0.68, 0.9, 1.05, 1.24]

const WEEKDAY_SEASONALITY = [0.72, 1.05, 1.12, 1.08, 1.16, 1.24, 0.86]

const DAILY_REVENUE_BASE = 12400

export const REORDER_LEVEL = 12

export function getProductStock(productId) {
  if (!PRODUCT_BY_ID[productId]) return 0

  const rng = createRng(`stock:${productId}`)
  if (rng() < 0.08) return 0
  return Math.round(4 + rng() * 72)
}

export const getStockStatus = (stock) => {
  if (stock <= 0) return 'out-of-stock'
  if (stock < REORDER_LEVEL) return 'low-stock'
  return 'in-stock'
}

export const STOCK_STATUSES = [
  { id: 'in-stock', label: 'In stock', tone: 'success' },
  { id: 'low-stock', label: 'Low stock', tone: 'warning' },
  { id: 'out-of-stock', label: 'Out of stock', tone: 'danger' },
]

export const PRODUCT_CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))].map((name) => ({
  id: name.toLowerCase(),
  label: name,
}))

export function getDailyStats(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`)
  const rng = createRng(`day:${isoDate}`)

  const seasonal = MONTH_SEASONALITY[date.getMonth()] * WEEKDAY_SEASONALITY[date.getDay()]
  const noise = 0.82 + rng() * 0.42
  const yearGrowth = 1 + (date.getFullYear() - 2021) * 0.11

  const revenue = Math.round(DAILY_REVENUE_BASE * seasonal * noise * yearGrowth * 100) / 100
  const orders = Math.max(1, Math.round((revenue / 2600) * (0.85 + rng() * 0.4)))
  const units = Math.max(1, Math.round(orders * (1.1 + rng() * 0.5)))

  return { date: isoDate, revenue, orders, units }
}

export function getDailyProductUnits(isoDate) {
  const { units } = getDailyStats(isoDate)
  const rng = createRng(`units:${isoDate}`)
  const totalWeight = PRODUCTS.reduce((sum, p) => sum + p.weight, 0)

  return PRODUCTS.map((product) => {
    const share = (product.weight / totalWeight) * (0.75 + rng() * 0.5)
    return { productId: product.id, units: Math.max(0, Math.round(units * share * 12)) }
  })
}

export function getDailyTransactions(isoDate) {
  const { orders } = getDailyStats(isoDate)
  const count = Math.min(8, Math.max(2, Math.round(orders / 2)))
  const statusPool = TRANSACTION_STATUSES.flatMap((s) => Array(Math.round(s.weight / 2)).fill(s.id))

  return Array.from({ length: count }, (_, index) => {
    const seed = `tx:${isoDate}:${index}`
    const rng = createRng(seed)
    const product = weightedProduct(rng())
    const method = seededPick(`${seed}:method`, PAYMENT_METHODS)
    const status = seededPick(`${seed}:status`, statusPool)
    const customer = seededPick(`${seed}:customer`, CUSTOMERS)
    const amount = Math.round(product.price * (0.35 + rng() * 1.9) * 100) / 100
    const minutesAgo = seededInt(`${seed}:time`, 5, 1400)

    return {
      id: `${isoDate}-${index}`,
      reference: `#${seededInt(`${seed}:ref`, 100000000000, 999999999999)}`,
      productId: product.id,
      productName: product.name,
      productColor: product.color,
      productBody: product.body,
      paymentMethod: method.label,
      paymentMethodId: method.id,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      quantity: seededInt(`${seed}:qty`, 1, 3),
      status,
      amount,
      placedAt: new Date(new Date(`${isoDate}T18:00:00`).getTime() - minutesAgo * 60000).toISOString(),
    }
  })
}

function weightedProduct(roll) {
  const total = PRODUCTS.reduce((sum, p) => sum + p.weight, 0)
  let cursor = roll * total
  for (const product of PRODUCTS) {
    cursor -= product.weight
    if (cursor <= 0) return product
  }
  return PRODUCTS[0]
}

export function getMonthlySeries(year) {
  return MONTHS.map((label, monthIndex) => {
    const rng = createRng(`month:${year}:${monthIndex}`)
    const yearGrowth = 1 + (year - 2021) * 0.09
    const value = Math.round(
      DAILY_REVENUE_BASE * 2.6 * MONTH_SEASONALITY[monthIndex] * (0.88 + rng() * 0.28) * yearGrowth,
    )
    return { label, month: monthIndex + 1, value }
  })
}

export function getRegionSales(periodId, offset = 0) {
  const totals = { week: 13280, month: 54600, year: 612400 }
  const total = (totals[periodId] ?? totals.week) * (offset === 0 ? 1 : 0.72)

  return REGIONS.map((region) => {
    const rng = createRng(`region:${region.id}:${periodId}:${offset}`)
    const value = Math.round(total * region.share * (0.86 + rng() * 0.3))
    return { ...region, sales: value }
  }).sort((a, b) => b.sales - a.sales)
}
