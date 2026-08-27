import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAppDispatch, useAppSelector } from './hooks'

export function useListPage({ load, actions, selectors, searchDelay = 300 }) {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectors.selectFilters)
  const resource = useAppSelector(selectors.selectList)

  const [searchParams, setSearchParams] = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  useEffect(() => {
    if (!from || !to) return
    dispatch(actions.setFilters({ range: { from, to }, presetId: null }))
    setSearchParams({}, { replace: true })
  }, [from, to, dispatch, actions, setSearchParams])

  const [searchInput, setSearchInput] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(searchInput, searchDelay)

  useEffect(() => {
    dispatch(actions.setFilters({ search: debouncedSearch }))
  }, [debouncedSearch, dispatch, actions])

  useEffect(() => {
    const promise = dispatch(load(filters))
    return () => promise.abort()
  }, [dispatch, load, filters])

  const setFilters = useCallback((patch) => dispatch(actions.setFilters(patch)), [dispatch, actions])
  const setPage = useCallback((page) => dispatch(actions.setPage(page)), [dispatch, actions])
  const toggleSort = useCallback((payload) => dispatch(actions.toggleSort(payload)), [dispatch, actions])
  const refresh = useCallback(() => dispatch(load(filters)), [dispatch, load, filters])

  const reset = useCallback(() => {
    dispatch(actions.resetFilters())
    setSearchInput('')
  }, [dispatch, actions])

  const setDateRange = useCallback(
    ({ from: nextFrom, to: nextTo, presetId }) =>
      setFilters({ range: { from: nextFrom, to: nextTo }, presetId }),
    [setFilters],
  )

  const isFiltered = useMemo(
    () =>
      Boolean(searchInput) ||
      Object.entries(filters).some(
        ([key, value]) => !['range', 'presetId', 'search', 'sortBy', 'sortDir', 'page', 'pageSize'].includes(key) && value !== 'all',
      ),
    [filters, searchInput],
  )

  return {
    filters,
    resource,
    searchInput,
    setSearchInput,
    setFilters,
    setDateRange,
    setPage,
    toggleSort,
    refresh,
    reset,
    isFiltered,
  }
}
