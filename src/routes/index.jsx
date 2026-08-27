import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { NAV_ROUTES } from '@/constants/navigation'
import PlaceholderPage from '@/pages/PlaceholderPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { RouteFallback } from './RouteFallback'

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const ProductsPage = lazy(() => import('@/features/products/ProductsPage'))
const SalesPage = lazy(() => import('@/features/sales/SalesPage'))

const lazyRoute = (Component) => (
  <Suspense fallback={<RouteFallback />}>
    <Component />
  </Suspense>
)

const BUILT_ROUTES = [
  { path: '/', element: lazyRoute(DashboardPage), index: true },
  { path: '/inventory/products', element: lazyRoute(ProductsPage) },
  { path: '/sales', element: lazyRoute(SalesPage) },
]

const builtPaths = new Set(BUILT_ROUTES.map((route) => route.path))

const placeholderRoutes = NAV_ROUTES.filter((route) => route.to && !builtPaths.has(route.to)).map(
  (route) => ({
    path: route.to.replace(/^\//, ''),
    element: (
      <PlaceholderPage
        title={route.parent ? `${route.parent} / ${route.label}` : route.label}
        section={route.section}
      />
    ),
  }),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      ...BUILT_ROUTES.map(({ path, element, index }) =>
        index ? { index: true, element } : { path: path.replace(/^\//, ''), element },
      ),
      ...placeholderRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
