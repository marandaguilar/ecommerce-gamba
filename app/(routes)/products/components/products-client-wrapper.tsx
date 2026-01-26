"use client";

import { useState, useMemo } from "react";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import ProductCard from "./carousel-products";
import ProductsFilter from "./products-filter";
import { Button } from "@/components/ui/button";
import ProductsCounter from "@/components/shared/products-counter";
import { Separator } from "@/components/ui/separator";

interface ProductsClientWrapperProps {
  initialProducts: ProductType[];
  categories: CategoryType[];
}

export default function ProductsClientWrapper({
  initialProducts,
  categories,
}: ProductsClientWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedCount, setDisplayedCount] = useState<number>(24);

  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];

    let filtered = initialProducts;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product: ProductType) =>
          product.productName.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (product: ProductType) =>
          product.category?.id.toString() === selectedCategory
      );
    }

    return filtered;
  }, [initialProducts, selectedCategory, searchTerm]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayedCount);
  }, [filteredProducts, displayedCount]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setDisplayedCount(24); // Reset to initial count
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setDisplayedCount(24); // Reset to initial count
  };

  const handleLoadMore = () => {
    setDisplayedCount((prev) => Math.min(prev + 24, filteredProducts.length));
  };

  const hasMoreProducts = displayedCount < filteredProducts.length;

  return (
    <>
      {/* Title and filters in same row */}
      <div className="mb-6 px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-medium">Todos los productos</h1>
          <ProductsFilter
            products={initialProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>

      <Separator />

      {/* Product grid */}
      <div className="flex justify-center">
        <div className="grid gap-2 mt-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 max-w-md sm:max-w-none mx-auto px-2 sm:px-0">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center py-8">
              No hay productos disponibles
            </p>
          )}
        </div>
      </div>

      {/* Load more button */}
      {hasMoreProducts && (
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

      {/* Product counter */}
      <ProductsCounter
        visibleCount={displayedProducts.length}
        totalCount={filteredProducts.length}
        isLoading={false}
      />
    </>
  );
}
