import Skeleton from '../ui/Skeleton'
/** Skeleton para cards de producto en listados. */

export default function ProductCardSkeleton() {
  return (
    <div className="bg-ch-dark-gray rounded-xl border border-ch-gray/20 overflow-hidden">
      <Skeleton className="w-full h-64" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-5 w-12 rounded" />
        </div>
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  )
}


