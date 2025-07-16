"use client";

import { useState, useMemo } from "react";
import { useGetAllProducts } from "@/api/getProducts";
import { ResponseType } from "@/types/response";
import { Separator } from "@/components/ui/separator";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "./components/carousel-products";
import ProductsFilter from "./components/products-filter";
import { ProductType } from "@/types/product";
import { Button } from "@/components/ui/button";
import ProductsCounter from "@/components/shared/products-counter";

export default function Page() {
  const { result: products, loading: productsLoading }: ResponseType =
    useGetAllProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleProducts, setVisibleProducts] = useState<number>(25);

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    if (!products) return null;

    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (product: ProductType) =>
          product.category?.id.toString() === selectedCategory
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product: ProductType) =>
          product.productName.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Obtener solo los productos visibles
  const visibleFilteredProducts = useMemo(() => {
    if (!filteredProducts) return null;
    return filteredProducts.slice(0, visibleProducts);
  }, [filteredProducts, visibleProducts]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setVisibleProducts(25); // Resetear a 25 productos cuando cambie la categoría
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setVisibleProducts(25); // Resetear a 5 productos cuando cambie la búsqueda
  };

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 25);
  };

  const hasMoreProducts =
    filteredProducts && visibleProducts < filteredProducts.length;

  return (
    <div className="max-m-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-medium mb-4">Todos los productos</h1>

        {/* Filtro de categorías y búsqueda */}
        {products !== null && !productsLoading && (
          <ProductsFilter
            products={products}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        )}
      </div>
      <Separator />

      <div className="sm:flex items-center justify-center">
        <div className="grid gap-5 mt-8 sm:grid-cols-2 md:grid-cols-5 md:gap-10 justify-center items-center">
          {productsLoading && <SkeletonSchema grid={5} />}
          {visibleFilteredProducts !== null &&
            !productsLoading &&
            visibleFilteredProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {visibleFilteredProducts !== null &&
            !productsLoading &&
            visibleFilteredProducts.length === 0 && (
              <p>No hay productos disponibles</p>
            )}
        </div>
      </div>

      {/* Botón "Ver más" */}
      {hasMoreProducts && !productsLoading && (
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
        isLoading={productsLoading}
      />
    </div>
  );
}
