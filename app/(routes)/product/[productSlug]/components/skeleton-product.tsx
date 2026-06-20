import { Skeleton } from "@/components/ui/skeleton";

const SkeletonProduct = () => {
  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-32 sm:px-24">
      <div className="grid sm:grid-cols-2">
        {/* Galería */}
        <div className="p-8 sm:px-16">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-16 rounded-md" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 sm:px-12">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-6 h-4 w-24" />
          <Skeleton className="mt-2 h-10 w-40" />
          <Skeleton className="mt-6 h-10 w-full" />
          <div className="mt-3 flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="size-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProduct;
