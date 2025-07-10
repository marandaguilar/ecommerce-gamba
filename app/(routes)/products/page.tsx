"use client";

import { useGetAllProducts } from "@/api/getProducts";
import { ResponseType } from "@/types/response";
import { Separator } from "@/components/ui/separator";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "./components/carousel-products";
import { ProductType } from "@/types/product";

export default function Page() {
  const { result, loading }: ResponseType = useGetAllProducts();

  return (
    <div className="max-m-6xl py-4 mx-auto sm:py-16 sm:px-24">
      {result !== null && !loading && (
        <h1 className="text-3xl font-medium">Todos los productos</h1>
      )}
      <Separator />

      <div className="sm:flex sm:justify-between">
        <div className="grid gap-5 mt-8 sm:grid-cols-2 md:grid-cols-5 md:gap-10">
          {loading && <SkeletonSchema grid={3} />}
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
