import { fetchSalesList } from '@/api/salesApi'
import { resolvePreset } from '@/lib/date'
import { createListSlice } from '../createListSlice'

const DEFAULT_PRESET = 'last-30'

export const salesList = createListSlice({
  name: 'sales',
  apiFn: fetchSalesList,
  initialFilters: {
    range: resolvePreset(DEFAULT_PRESET),
    presetId: DEFAULT_PRESET,
    search: '',
    status: 'all',
    method: 'all',
    sortBy: 'placedAt',
    sortDir: 'desc',
    page: 1,
    pageSize: 8,
  },
})

export const { load: loadSales, actions: salesActions } = salesList
export const { selectFilters: selectSalesFilters, selectList: selectSalesList } = salesList.selectors

export default salesList.reducer
