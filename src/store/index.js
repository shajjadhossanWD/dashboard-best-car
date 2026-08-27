import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './slices/dashboardSlice'
import productsReducer from './slices/productsSlice'
import salesReducer from './slices/salesSlice'
import sessionReducer from './slices/sessionSlice'
import uiReducer, { persistUi } from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    session: sessionReducer,
    dashboard: dashboardReducer,
    products: productsReducer,
    sales: salesReducer,
  },
  devTools: import.meta.env.DEV,
})

let lastUiState = store.getState().ui
store.subscribe(() => {
  const nextUiState = store.getState().ui
  if (nextUiState !== lastUiState) {
    lastUiState = nextUiState
    persistUi(store.getState())
  }
})

export default store
