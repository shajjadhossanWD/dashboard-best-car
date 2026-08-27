import { fetchProductList } from '@/api/productsApi'
import { resolvePreset } from '@/lib/date'
import { createListSlice } from '../createListSlice'

const DEFAULT_PRESET = 'last-30'

export const productsList = createListSlice({
  name: 'products',
  apiFn: fetchProductList,
  initialFilters: {
    range: resolvePreset(DEFAULT_PRESET),
    presetId: DEFAULT_PRESET,
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'unitsSold',
    sortDir: 'desc',
    page: 1,
    pageSize: 8,
  },
})

export const { load: loadProducts, actions: productActions } = productsList
export const { selectFilters: selectProductFilters, selectList: selectProductList } =
  productsList.selectors

export default productsList.reducer
