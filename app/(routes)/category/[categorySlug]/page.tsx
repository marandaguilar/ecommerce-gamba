"use client";

import { useState, useMemo, useEffect } from "react";
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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const { result, loading, meta } = useGetCategoryProduct(categorySlug, currentPage, 25);

  useEffect(() => {
    if (result && currentPage === 1) {
      setAllProducts(result);
    } else if (result && currentPage > 1) {
      setAllProducts(prev => [...prev, ...result]);
    }
  }, [result, currentPage]);

  useEffect(() => {
    if (meta) {
      setHasMore(currentPage < meta.pagination.pageCount);
    }
  }, [meta, currentPage]);

  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtrar productos por término de búsqueda
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

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // Reset to first page and reload
    setCurrentPage(1);
    setAllProducts([]);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setCurrentPage(prev => prev + 1);
      // After loading, setLoadingMore(false) in another useEffect or in the hook
    }
  };

  useEffect(() => {
    setLoadingMore(false);
  }, [allProducts]);

  const categoryName = allProducts.length > 0 ? allProducts[0]?.category?.categoryName : '';

  return (
    <div className="max-m-6xl py-4 mx-auto sm:py-16 sm:px-24 mt-8 sm:mt-0">
      {allProducts.length > 0 && !loading && (
        <div className="mb-6 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-medium">
              {categoryName}
            </h1>
            <CategorySearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
      )}
      <Separator />

      <div className="flex justify-center">
        <div className="grid gap-2 mt-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 max-w-md sm:max-w-none mx-auto px-2 sm:px-0">
          {(loading && currentPage === 1) && <SkeletonSchema grid={4} />}
          {filteredProducts.map((product: ProductType) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && !loading && (
            <p>No hay productos que coincidan con la búsqueda</p>
          )}
          {loadingMore && <SkeletonSchema grid={4} />}
        </div>
      </div>

      {/* Botón "Ver más" */}
      {hasMore && !loading && !loadingMore && (
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
        visibleCount={filteredProducts.length}
        totalCount={filteredProducts.length} // Since we load all available, total is what we have
        isLoading={loading || loadingMore}
      />
    </div>
  );
}
