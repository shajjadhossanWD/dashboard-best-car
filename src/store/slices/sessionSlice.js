import { createSlice } from '@reduxjs/toolkit'
import { fetchSession } from '@/api/dashboardApi'
import { attachResourceCases, createResource, createResourceThunk } from '../createResource'

export const loadSession = createResourceThunk('session/load', fetchSession)

const sessionSlice = createSlice({
  name: 'session',
  initialState: { session: createResource(null) },
  reducers: {},
  extraReducers: (builder) => attachResourceCases(builder, loadSession, 'session'),
})

export const selectSessionResource = (state) => state.session.session
export const selectUser = (state) => state.session.session.data?.user ?? null
export const selectNotificationCount = (state) => state.session.session.data?.notifications ?? 0
export const selectMessageCount = (state) => state.session.session.data?.messages ?? 0
export const selectLocale = (state) => state.session.session.data?.locale ?? null

export default sessionSlice.reducer

export const selectStores = (state) => state.session.session.data?.stores ?? []
