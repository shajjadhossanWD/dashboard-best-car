import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProductThumb } from '@/components/ui/ProductThumb'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/StateBlock'
import { formatCurrency, formatNumber } from '@/lib/format'

export function BestSellerCard({ resource, onRetry, onViewAll, className }) {
  const { data, status, error } = resource
  const loading = status === 'loading' || status === 'idle'
  const products = data ?? []

  return (
    <Card className={className}>
      <CardHeader
        title="Best Seller"
        actions={
          <Button variant="outline" size="xs" onClick={onViewAll}>
            View All
          </Button>
        }
      />

      <CardBody className="py-2">
        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : loading ? (
          <SkeletonRows rows={5} className="py-2" />
        ) : products.length === 0 ? (
          <EmptyState title="No sales in this period" description="Try widening the date range." />
        ) : (
          <ul className="divide-y divide-line">
            {products.map((product) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <ProductThumb name={product.name} color={product.color} body={product.body} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-semibold text-ink">{product.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{formatCurrency(product.price)}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-2xs font-medium text-ink-soft">Sales</p>
                  <p className="mt-0.5 text-[0.8125rem] font-bold text-ink">
                    {formatNumber(product.sales)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
