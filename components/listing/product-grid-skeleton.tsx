import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

/** Skeleton de la grilla de productos; matchea el layout y la forma del card. */
const ProductGridSkeleton = ({ count = 10 }: ProductGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 overflow-hidden rounded-lg border bg-card p-4"
        >
          <Skeleton className="h-[200px] w-full rounded-md" />
          <Skeleton className="mx-auto h-4 w-3/4" />
          <Skeleton className="mx-auto h-6 w-1/2" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
