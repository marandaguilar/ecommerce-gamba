import SkeletonSchema from "@/components/skeletonSchema";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="max-w-[1600px] py-10 mx-auto sm:px-8 px-4">
      <div className="mb-6 px-2 sm:px-0">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-4" />
      </div>
      <Separator />
      <div className="flex justify-center">
        <div className="grid gap-2 mt-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 max-w-md sm:max-w-none mx-auto px-2 sm:px-0">
          <SkeletonSchema grid={24} />
        </div>
      </div>
    </div>
  );
}
