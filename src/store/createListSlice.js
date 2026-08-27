import { createSlice } from '@reduxjs/toolkit'
import { attachResourceCases, createResource, createResourceThunk } from './createResource'

// Shared plumbing for the filter/sort/paginate list screens.
export function createListSlice({ name, apiFn, initialFilters }) {
  const load = createResourceThunk(`${name}/load`, apiFn)

  const slice = createSlice({
    name,
    initialState: { filters: { ...initialFilters }, list: createResource(null) },
    reducers: {
      setFilters(state, action) {
        Object.assign(state.filters, action.payload)
        if (!('page' in action.payload)) state.filters.page = 1
      },
      setPage(state, action) {
        state.filters.page = Math.max(1, Number(action.payload) || 1)
      },
      toggleSort(state, action) {
        const { key, direction = 'asc' } = action.payload
        const { sortBy, sortDir } = state.filters

        state.filters.sortBy = key
        state.filters.sortDir = sortBy === key ? (sortDir === 'asc' ? 'desc' : 'asc') : direction
        state.filters.page = 1
      },
      // Clears the toolbar filters only - the date range lives in the page header.
      resetFilters(state) {
        const { range, presetId } = state.filters
        state.filters = { ...initialFilters, range, presetId }
      },
    },
    extraReducers: (builder) => attachResourceCases(builder, load, 'list'),
  })

  const selectFilters = (state) => state[name].filters
  const selectList = (state) => state[name].list

  return {
    load,
    reducer: slice.reducer,
    actions: slice.actions,
    selectors: { selectFilters, selectList },
  }
}
