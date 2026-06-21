import ProductGridSkeleton from "@/components/listing/product-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="max-w-[1600px] py-4 mx-auto sm:py-12 sm:px-8 px-4 mt-8 sm:mt-0">
      <Skeleton className="h-9 w-64" />
      <Separator className="my-6" />
      <ProductGridSkeleton count={10} />
    </div>
  );
}
