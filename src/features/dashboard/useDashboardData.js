import { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadAnalytics,
  loadBestSellers,
  loadOverview,
  loadRegions,
  loadTransactions,
  selectFilters,
} from '@/store/slices/dashboardSlice'

export function useDashboardData() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectFilters)
  const { range, analyticsYear, regionPeriod, transactionStatus, transactionLimit, bestSellerLimit } = filters

  const run = useCallback(
    (thunk, arg) => {
      const promise = dispatch(thunk(arg))
      return () => promise.abort()
    },
    [dispatch],
  )

  useEffect(() => run(loadOverview, { range }), [run, range])

  useEffect(
    () => run(loadBestSellers, { range, limit: bestSellerLimit }),
    [run, range, bestSellerLimit],
  )

  useEffect(
    () => run(loadTransactions, { range, limit: transactionLimit, status: transactionStatus }),
    [run, range, transactionLimit, transactionStatus],
  )

  useEffect(() => run(loadAnalytics, { year: analyticsYear }), [run, analyticsYear])

  useEffect(() => run(loadRegions, { period: regionPeriod }), [run, regionPeriod])

  const filtersRef = useRef(filters)
  filtersRef.current = filters

  const refresh = useCallback(
    (resource) => {
      const current = filtersRef.current
      const byResource = {
        overview: () => dispatch(loadOverview({ range: current.range })),
        bestSellers: () => dispatch(loadBestSellers({ range: current.range, limit: current.bestSellerLimit })),
        transactions: () =>
          dispatch(
            loadTransactions({
              range: current.range,
              limit: current.transactionLimit,
              status: current.transactionStatus,
            }),
          ),
        analytics: () => dispatch(loadAnalytics({ year: current.analyticsYear })),
        regions: () => dispatch(loadRegions({ period: current.regionPeriod })),
      }

      if (resource) return byResource[resource]?.()
      return Object.values(byResource).forEach((fn) => fn())
    },
    [dispatch],
  )

  return { refresh }
}
