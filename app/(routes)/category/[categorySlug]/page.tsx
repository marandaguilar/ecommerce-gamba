"use client";

import { useGetCategoryProduct } from "@/api/getCategoryProduct";
import { ResponseType } from "@/types/response";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "./components/product-card";
import { ProductType } from "@/types/product";

export default function Page() {
  const params = useParams();
  const { categorySlug } = params as { categorySlug: string };

  const { result, loading }: ResponseType = useGetCategoryProduct(categorySlug);

  return (
    <div className="max-m-6xl py-4 mx-auto sm:py-16 sm:px-24">
      {result !== null && !loading && (
        <h1 className="text-3xl font-medium">
          {result[0].category.categoryName}
        </h1>
      )}
      <Separator />

      <div className="sm:flex items-center justify-center">
        <div className="grid gap-5 mt-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
          {loading && <SkeletonSchema grid={4} />}
          {result !== null &&
            !loading &&
            result.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {result !== null && !loading && result.length === 0 && (
            <p>No hay productos que coincidan con la búsqueda</p>
          )}
        </div>
      </div>
    </div>
  );
}
