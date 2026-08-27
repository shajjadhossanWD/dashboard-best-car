import { createSlice } from '@reduxjs/toolkit'
import {
  fetchBestSellers,
  fetchOverview,
  fetchSalesAnalytics,
  fetchSalesByCountry,
  fetchTransactions,
} from '@/api/dashboardApi'
import { DATE_PRESETS, resolvePreset } from '@/lib/date'
import { attachResourceCases, createResource, createResourceThunk } from '../createResource'

export const loadOverview = createResourceThunk('dashboard/overview', fetchOverview)
export const loadBestSellers = createResourceThunk('dashboard/bestSellers', fetchBestSellers)
export const loadTransactions = createResourceThunk('dashboard/transactions', fetchTransactions)
export const loadAnalytics = createResourceThunk('dashboard/analytics', fetchSalesAnalytics)
export const loadRegions = createResourceThunk('dashboard/regions', fetchSalesByCountry)

const DEFAULT_PRESET = 'last-7'

export const REGION_PERIODS = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' },
]

export const TRANSACTION_FILTERS = [
  { id: 'all', label: 'All orders' },
  { id: 'success', label: 'Success' },
  { id: 'pending', label: 'Pending' },
  { id: 'cancelled', label: 'Cancelled' },
]

const initialState = {
  filters: {
    presetId: DEFAULT_PRESET,
    range: resolvePreset(DEFAULT_PRESET),
    analyticsYear: new Date().getFullYear(),
    regionPeriod: 'week',
    transactionStatus: 'all',
    transactionLimit: 5,
    bestSellerLimit: 5,
  },
  overview: createResource(null),
  bestSellers: createResource(null),
  transactions: createResource(null),
  analytics: createResource(null),
  regions: createResource(null),
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange(state, action) {
      const { from, to, presetId = null } = action.payload
      state.filters.range = { from, to }
      state.filters.presetId = presetId
    },
    applyDatePreset(state, action) {
      const preset = DATE_PRESETS.find((p) => p.id === action.payload)
      if (!preset) return
      state.filters.presetId = preset.id
      state.filters.range = preset.resolve()
    },
    setAnalyticsYear(state, action) {
      state.filters.analyticsYear = Number(action.payload)
    },
    setRegionPeriod(state, action) {
      state.filters.regionPeriod = action.payload
    },
    setTransactionStatus(state, action) {
      state.filters.transactionStatus = action.payload
    },
    setTransactionLimit(state, action) {
      state.filters.transactionLimit = Number(action.payload)
    },
    setBestSellerLimit(state, action) {
      state.filters.bestSellerLimit = Number(action.payload)
    },
    resetFilters() {
      return { ...initialState, filters: { ...initialState.filters, range: resolvePreset(DEFAULT_PRESET) } }
    },
  },
  extraReducers: (builder) => {
    attachResourceCases(builder, loadOverview, 'overview')
    attachResourceCases(builder, loadBestSellers, 'bestSellers')
    attachResourceCases(builder, loadTransactions, 'transactions')
    attachResourceCases(builder, loadAnalytics, 'analytics')
    attachResourceCases(builder, loadRegions, 'regions')
  },
})

export const {
  setDateRange,
  applyDatePreset,
  setAnalyticsYear,
  setRegionPeriod,
  setTransactionStatus,
  setTransactionLimit,
  setBestSellerLimit,
  resetFilters,
} = dashboardSlice.actions

export const selectFilters = (state) => state.dashboard.filters
export const selectDateRange = (state) => state.dashboard.filters.range
export const selectPresetId = (state) => state.dashboard.filters.presetId
export const selectAnalyticsYear = (state) => state.dashboard.filters.analyticsYear
export const selectRegionPeriod = (state) => state.dashboard.filters.regionPeriod
export const selectTransactionStatus = (state) => state.dashboard.filters.transactionStatus

export const selectOverview = (state) => state.dashboard.overview
export const selectBestSellers = (state) => state.dashboard.bestSellers
export const selectTransactions = (state) => state.dashboard.transactions
export const selectAnalytics = (state) => state.dashboard.analytics
export const selectRegions = (state) => state.dashboard.regions

export default dashboardSlice.reducer
