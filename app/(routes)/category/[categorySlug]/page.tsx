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
import { Button } from "@/components/ui/button";
import ProductsCounter from "@/components/shared/products-counter";

export default function Page() {
  const params = useParams();
  const { categorySlug } = params as { categorySlug: string };

  const { result, loading }: ResponseType = useGetCategoryProduct(categorySlug);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleProducts, setVisibleProducts] = useState<number>(25);

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

  // Obtener solo los productos visibles
  const visibleFilteredProducts = useMemo(() => {
    if (!filteredProducts) return null;
    return filteredProducts.slice(0, visibleProducts);
  }, [filteredProducts, visibleProducts]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setVisibleProducts(25); // Resetear a 25 productos cuando cambie la búsqueda
  };

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 25);
  };

  const hasMoreProducts =
    filteredProducts && visibleProducts < filteredProducts.length;

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
          {visibleFilteredProducts !== null &&
            !loading &&
            visibleFilteredProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {visibleFilteredProducts !== null &&
            !loading &&
            visibleFilteredProducts.length === 0 && (
              <p>No hay productos que coincidan con la búsqueda</p>
            )}
        </div>
      </div>

      {/* Botón "Ver más" */}
      {hasMoreProducts && !loading && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            className="px-8 py-2 text-white dark:text-black rounded-lg transition-colors"
          >
            Ver más
          </Button>
        </div>
      )}

      {/* Contador de productos */}
      <ProductsCounter
        visibleCount={visibleFilteredProducts?.length || 0}
        totalCount={filteredProducts?.length || 0}
        isLoading={loading}
      />
    </div>
  );
}
