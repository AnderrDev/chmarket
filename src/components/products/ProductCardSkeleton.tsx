import Skeleton from '../ui/Skeleton'
/** Skeleton para cards de producto en listados. */

export default function ProductCardSkeleton() {
  return (
    <div className="bg-ch-dark-gray rounded-xl border border-ch-gray/20 overflow-hidden flex flex-col h-full">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <Skeleton className="h-4 sm:h-5 w-24 rounded" />
        <Skeleton className="h-3 sm:h-4 w-3/4 rounded flex-1" />
        <Skeleton className="h-2 sm:h-3 w-full rounded" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 rounded" />
          <Skeleton className="h-3 sm:h-4 w-8 sm:w-12 rounded" />
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-0">
        <Skeleton className="h-8 sm:h-10 w-full rounded" />
      </div>
    </div>
  )
}


