"use client";

import { useState, useMemo } from "react";
import { useGetAllProducts } from "@/api/getProducts";
import { ResponseType } from "@/types/response";
import { Separator } from "@/components/ui/separator";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "./components/carousel-products";
import ProductsFilter from "./components/products-filter";
import { ProductType } from "@/types/product";
import ProductsCounter from "@/components/shared/products-counter";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedCount, setDisplayedCount] = useState<number>(25);

  const { result: allProducts, loading }: ResponseType = useGetAllProducts(); // Cargar muchos productos de una vez

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    let filtered = allProducts;

    // Filtrar por búsqueda
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (product: ProductType) =>
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (product: ProductType) =>
          product.category?.id.toString() === selectedCategory
      );
    }

    return filtered;
  }, [allProducts, selectedCategory, searchTerm]);

  // Reset displayed count when filters change
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayedCount);
  }, [filteredProducts, displayedCount]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setDisplayedCount(25); // Reset to initial count
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setDisplayedCount(25); // Reset to initial count
  };

  const handleLoadMore = () => {
    setDisplayedCount((prev) => Math.min(prev + 25, filteredProducts.length));
  };

  const hasMoreProducts = displayedCount < filteredProducts.length;

  return (
    <div className="max-m-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-medium">Todos los productos</h1>

          {/* Filtro de categorías y búsqueda */}
          <ProductsFilter
            products={allProducts || []}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
      <Separator />

      <div className="flex justify-center">
        <div className="grid gap-5 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-5 md:gap-10 max-w-xs sm:max-w-none mx-auto">
          {loading && <SkeletonSchema grid={5} />}
          {!loading &&
            displayedProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {!loading && displayedProducts.length === 0 && (
            <p>No hay productos disponibles</p>
          )}
        </div>
      </div>

      {/* Botón para cargar más productos */}
      {!loading && hasMoreProducts && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="px-8 py-2"
          >
            Cargar más productos
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
