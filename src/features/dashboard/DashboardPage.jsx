import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Package } from 'lucide-react'
import { BestSellerCard } from './components/BestSellerCard'
import { RecentTransactionsCard } from './components/RecentTransactionsCard'
import { SalesAnalyticsCard } from './components/SalesAnalyticsCard'
import { SalesByCountriesCard } from './components/SalesByCountriesCard'
import { EarningCard, MilestoneCard } from './components/StatCards'
import { WelcomeBanner } from './components/WelcomeBanner'
import { useDashboardData } from './useDashboardData'
import { cn } from '@/lib/cn'
import { daysBetween } from '@/lib/date'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { isPending } from '@/store/createResource'
import {
  selectAnalytics,
  selectAnalyticsYear,
  selectBestSellers,
  selectDateRange,
  selectOverview,
  selectRegionPeriod,
  selectRegions,
  selectTransactionStatus,
  selectTransactions,
  setAnalyticsYear,
  setRegionPeriod,
  setTransactionStatus,
} from '@/store/slices/dashboardSlice'
import { selectKpiExpanded } from '@/store/slices/uiSlice'

function earningTitle(range) {
  const days = daysBetween(range.from, range.to)
  if (days <= 1) return 'Daily Earning'
  if (days <= 7) return 'Weekly Earning'
  if (days <= 31) return 'Monthly Earning'
  if (days <= 92) return 'Quarterly Earning'
  return 'Total Earning'
}

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { refresh } = useDashboardData()

  const range = useAppSelector(selectDateRange)
  const analyticsYear = useAppSelector(selectAnalyticsYear)
  const regionPeriod = useAppSelector(selectRegionPeriod)
  const transactionStatus = useAppSelector(selectTransactionStatus)
  const kpiExpanded = useAppSelector(selectKpiExpanded)

  const overview = useAppSelector(selectOverview)
  const bestSellers = useAppSelector(selectBestSellers)
  const transactions = useAppSelector(selectTransactions)
  const analytics = useAppSelector(selectAnalytics)
  const regions = useAppSelector(selectRegions)

  const [refreshingAll, setRefreshingAll] = useState(false)

  const refreshAll = useCallback(() => {
    setRefreshingAll(true)
    refresh()
    setTimeout(() => setRefreshingAll(false), 700)
  }, [refresh])

  const overviewLoading = isPending(overview) || overview.status === 'idle'
  const title = useMemo(() => earningTitle(range), [range])

  return (
    <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-4">
      <WelcomeBanner onRefresh={refreshAll} refreshing={refreshingAll} />

      <section
        aria-label="Key figures"
        className={cn(
          'grid gap-4 sm:grid-cols-2 xl:grid-cols-4',
          !kpiExpanded && 'hidden',
        )}
      >
        <EarningCard
          resource={overview}
          title={title}
          onRetry={() => refresh('overview')}
          className="sm:col-span-2"
        />
        <MilestoneCard
          tone="brand"
          icon={BarChart3}
          loading={overviewLoading}
          value={overview.data?.totalSales.value}
          label={overview.data?.totalSales.label ?? 'No of Total Sales'}
          onRefresh={() => refresh('overview')}
        />
        <MilestoneCard
          tone="navy"
          icon={Package}
          loading={overviewLoading}
          value={overview.data?.purchasedGoods.value}
          label={overview.data?.purchasedGoods.label ?? 'No of Purchased Goods'}
          onRefresh={() => refresh('overview')}
        />
      </section>

      <section aria-label="Products and orders" className="grid gap-4 xl:grid-cols-3">
        <BestSellerCard
          resource={bestSellers}
          onRetry={() => refresh('bestSellers')}
          onViewAll={() => navigate(`/inventory/products?from=${range.from}&to=${range.to}`)}
        />
        <RecentTransactionsCard
          resource={transactions}
          statusFilter={transactionStatus}
          onStatusChange={(value) => dispatch(setTransactionStatus(value))}
          onRetry={() => refresh('transactions')}
          onViewAll={() => navigate(`/sales?from=${range.from}&to=${range.to}`)}
          className="xl:col-span-2"
        />
      </section>

      <section aria-label="Trends" className="grid gap-4 xl:grid-cols-3">
        <SalesAnalyticsCard
          resource={analytics}
          year={analyticsYear}
          onYearChange={(value) => dispatch(setAnalyticsYear(value))}
          onRetry={() => refresh('analytics')}
          className="xl:col-span-2"
        />
        <SalesByCountriesCard
          resource={regions}
          period={regionPeriod}
          onPeriodChange={(value) => dispatch(setRegionPeriod(value))}
          onRetry={() => refresh('regions')}
        />
      </section>
    </div>
  )
}
