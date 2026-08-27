import { createAsyncThunk } from '@reduxjs/toolkit'

export const STATUS = {
  idle: 'idle',
  loading: 'loading',
  refreshing: 'refreshing',
  success: 'success',
  error: 'error',
}

// Every remote value carries its own status and error so widgets load,
// fail and retry independently.
export const createResource = (initialData = null) => ({
  data: initialData,
  status: STATUS.idle,
  error: null,
  receivedAt: null,
})

export const createResourceThunk = (type, apiFn) =>
  createAsyncThunk(type, async (arg, { signal, rejectWithValue }) => {
    try {
      const data = await apiFn({ ...arg, signal })
      return { data, receivedAt: new Date().toISOString() }
    } catch (error) {
      if (error.name === 'AbortError') throw error
      return rejectWithValue(error.message || 'Something went wrong. Please try again.')
    }
  })

export const attachResourceCases = (builder, thunk, key) => {
  builder
    .addCase(thunk.pending, (state) => {
      const resource = state[key]
      resource.status = resource.data ? STATUS.refreshing : STATUS.loading
      resource.error = null
    })
    .addCase(thunk.fulfilled, (state, action) => {
      const resource = state[key]
      resource.data = action.payload.data
      resource.receivedAt = action.payload.receivedAt
      resource.status = STATUS.success
      resource.error = null
    })
    .addCase(thunk.rejected, (state, action) => {
      if (action.meta.aborted) return // superseded by a newer request
      const resource = state[key]
      resource.status = STATUS.error
      resource.error = action.payload || action.error?.message || 'Request failed'
    })
  return builder
}

export const isPending = (resource) =>
  resource.status === STATUS.loading || resource.status === STATUS.refreshing

export const isInitialLoad = (resource) =>
  resource.status === STATUS.loading || resource.status === STATUS.idle
