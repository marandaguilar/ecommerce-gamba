"use client";

import { useState, useMemo } from "react";
import { useGetCategoryProduct } from "@/api/getCategoryProduct";
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

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedCount, setDisplayedCount] = useState<number>(25);

  const { result: allProducts, loading } = useGetCategoryProduct(categorySlug, 1, 100, 100);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    if (searchTerm.trim() === "") {
      return allProducts;
    }

    const searchLower = searchTerm.toLowerCase();
    return allProducts.filter(
      (product: ProductType) =>
        product.productName.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
    );
  }, [allProducts, searchTerm]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayedCount);
  }, [filteredProducts, displayedCount]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setDisplayedCount(25);
  };

  const handleLoadMore = () => {
    setDisplayedCount((prev) => Math.min(prev + 25, filteredProducts.length));
  };

  const hasMoreProducts = displayedCount < filteredProducts.length;

  const categoryName = allProducts && allProducts.length > 0 ? allProducts[0]?.category?.categoryName : '';

  return (
    <div className="max-m-6xl py-10 mx-auto sm:px-16 px-8">
      <div className="mb-6 px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-medium">
            {categoryName || 'Categoría'}
          </h1>
          <CategorySearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
      <Separator />

      <div className="flex justify-center">
        <div className="grid gap-2 mt-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 max-w-md sm:max-w-none mx-auto px-2 sm:px-0">
          {loading && <SkeletonSchema grid={4} />}
          {!loading &&
            displayedProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {!loading && displayedProducts.length === 0 && (
            <p>No hay productos que coincidan con la búsqueda</p>
          )}
        </div>
      </div>

      {/* Botón "Ver más" */}
      {!loading && hasMoreProducts && (
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
        visibleCount={displayedProducts.length}
        totalCount={filteredProducts.length}
        isLoading={loading}
      />
    </div>
  );
}
