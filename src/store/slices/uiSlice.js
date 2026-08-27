import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'bestcar:ui'

const readPersisted = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

const persisted = readPersisted()

const initialState = {
  sidebarCollapsed: persisted.sidebarCollapsed ?? false,
  mobileNavOpen: false,
  openNavGroups: persisted.openNavGroups ?? ['main'],
  kpiExpanded: persisted.kpiExpanded ?? true,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload
    },
    openMobileNav(state) {
      state.mobileNavOpen = true
    },
    closeMobileNav(state) {
      state.mobileNavOpen = false
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen
    },
    toggleNavGroup(state, action) {
      const id = action.payload
      state.openNavGroups = state.openNavGroups.includes(id)
        ? state.openNavGroups.filter((group) => group !== id)
        : [...state.openNavGroups, id]
    },
    toggleKpiSection(state) {
      state.kpiExpanded = !state.kpiExpanded
    },
  },
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  openMobileNav,
  closeMobileNav,
  toggleMobileNav,
  toggleNavGroup,
  toggleKpiSection,
} = uiSlice.actions

export const persistUi = (state) => {
  try {
    const { sidebarCollapsed, openNavGroups, kpiExpanded } = state.ui
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sidebarCollapsed, openNavGroups, kpiExpanded }))
  } catch {
    // storage unavailable
  }
}

export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed
export const selectMobileNavOpen = (state) => state.ui.mobileNavOpen
export const selectOpenNavGroups = (state) => state.ui.openNavGroups
export const selectKpiExpanded = (state) => state.ui.kpiExpanded

export default uiSlice.reducer
