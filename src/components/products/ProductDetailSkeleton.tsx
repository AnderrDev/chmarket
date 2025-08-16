/** Skeleton para la vista de detalle de producto. */
export default function ProductDetailSkeleton() {
  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative overflow-hidden rounded-2xl">
            <div className="animate-pulse w-full h-96 bg-ch-medium-gray" />
          </div>
          <div className="flex gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-20 rounded-lg bg-ch-medium-gray animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-28 bg-ch-medium-gray rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-ch-medium-gray rounded animate-pulse" />
            <div className="h-4 w-20 bg-ch-medium-gray rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-ch-medium-gray rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-ch-medium-gray rounded animate-pulse" />
            ))}
          </div>
          <div className="h-12 w-full bg-ch-medium-gray rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}


