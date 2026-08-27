import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { router } from '@/routes'
import { store } from '@/store'

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  )
}
