"use client";

import { useState, useEffect } from "react";
import {
  useGetCategoryProduct,
  useSearchCategoryProducts,
} from "@/api/getCategoryProduct";
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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [lastSearchTerm, setLastSearchTerm] = useState<string>("");

  // Usar búsqueda con paginación del servidor si hay término de búsqueda
  const {
    result: searchResult,
    loading: searchLoading,
    pagination: searchPagination,
  }: ResponseType = useSearchCategoryProducts(
    categorySlug,
    searchTerm,
    currentPage,
    25
  );

  // Usar productos normales si no hay término de búsqueda
  const {
    result: normalResult,
    loading: normalLoading,
    pagination: normalPagination,
  }: ResponseType = useGetCategoryProduct(categorySlug, currentPage, 25);

  // Determinar qué resultado usar
  const isSearching = searchTerm.trim() !== "";
  const result = isSearching ? searchResult : normalResult;
  const loading = isSearching ? searchLoading : normalLoading;
  const pagination = isSearching ? searchPagination : normalPagination;

  // Detectar cambios en el término de búsqueda
  useEffect(() => {
    if (searchTerm !== lastSearchTerm) {
      setLastSearchTerm(searchTerm);
      setCurrentPage(1);
      setAllProducts([]);
      setHasMorePages(true);
    }
  }, [searchTerm, lastSearchTerm]);

  // Actualizar productos acumulados cuando se cargan nuevos
  useEffect(() => {
    if (result) {
      if (currentPage === 1) {
        setAllProducts(result);
      } else {
        // Verificar que no haya duplicados antes de agregar
        const existingIds = new Set(allProducts.map((product) => product.id));
        const newProducts = result.filter(
          (product: ProductType) => !existingIds.has(product.id)
        );
        setAllProducts((prev) => [...prev, ...newProducts]);
      }

      if (pagination) {
        setTotalProducts(pagination.total);
        setHasMorePages(currentPage < pagination.pageCount);
      }
    }
  }, [result, currentPage, pagination, allProducts]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-medium">Categoría: {categorySlug}</h1>

          {/* Búsqueda */}
          <CategorySearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
      <Separator />

      <div className="flex justify-center">
        <div className="grid gap-5 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-5 md:gap-10 max-w-xs sm:max-w-none mx-auto">
          {loading && currentPage === 1 && <SkeletonSchema grid={5} />}
          {allProducts !== null &&
            !loading &&
            allProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {allProducts !== null && !loading && allProducts.length === 0 && (
            <p>No hay productos disponibles</p>
          )}
        </div>
      </div>

      {/* Loading indicator para cargas adicionales */}
      {loading && currentPage > 1 && (
        <div className="flex justify-center mt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Cargando más productos...</p>
          </div>
        </div>
      )}

      {/* Botón "Ver más" */}
      {hasMorePages && !loading && (
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
        visibleCount={allProducts?.length || 0}
        totalCount={totalProducts || 0}
        isLoading={loading}
      />
    </div>
  );
}
