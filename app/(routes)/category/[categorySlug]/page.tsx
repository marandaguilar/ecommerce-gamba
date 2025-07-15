"use client";

import { useState, useMemo } from "react";
import { useGetCategoryProduct } from "@/api/getCategoryProduct";
import { ResponseType } from "@/types/response";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "./components/product-card";
import CategorySearch from "./components/search";
import { ProductType } from "@/types/product";

export default function Page() {
  const params = useParams();
  const { categorySlug } = params as { categorySlug: string };

  const { result, loading }: ResponseType = useGetCategoryProduct(categorySlug);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtrar productos por término de búsqueda
  const filteredProducts = useMemo(() => {
    if (!result) return null;

    if (searchTerm.trim() === "") {
      return result;
    }

    const searchLower = searchTerm.toLowerCase();
    return result.filter(
      (product: ProductType) =>
        product.productName.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
    );
  }, [result, searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="max-m-6xl py-4 mx-auto sm:py-16 sm:px-24">
      {result !== null && !loading && (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-medium">
            {result[0].category.categoryName}
          </h1>
          <CategorySearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      )}
      <Separator />

      <div className="sm:flex items-center justify-center">
        <div className="grid gap-5 mt-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
          {loading && <SkeletonSchema grid={4} />}
          {filteredProducts !== null &&
            !loading &&
            filteredProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {filteredProducts !== null &&
            !loading &&
            filteredProducts.length === 0 && (
              <p>No hay productos que coincidan con la búsqueda</p>
            )}
        </div>
      </div>
    </div>
  );
}
