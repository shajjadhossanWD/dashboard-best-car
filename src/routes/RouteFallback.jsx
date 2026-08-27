import { Skeleton } from '@/components/ui/Skeleton'

export function RouteFallback() {
  return (
    <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-4">
      <Skeleton className="h-16 w-full rounded-card" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-32 rounded-card sm:col-span-2" />
        <Skeleton className="h-32 rounded-card" />
        <Skeleton className="h-32 rounded-card" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-card" />
        <Skeleton className="h-80 rounded-card xl:col-span-2" />
      </div>
    </div>
  )
}
