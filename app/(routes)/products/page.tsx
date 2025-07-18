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

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Cargar todos los productos de una vez (sin paginación)
  const { result: allProducts, loading }: ResponseType = useGetAllProducts(
    1,
    1000
  ); // Cargar muchos productos de una vez

  // Filtrar productos por categoría y búsqueda del lado del cliente
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

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

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
            filteredProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {!loading && filteredProducts.length === 0 && (
            <p>No hay productos disponibles</p>
          )}
        </div>
      </div>

      {/* Contador de productos */}
      <ProductsCounter
        visibleCount={filteredProducts.length}
        totalCount={allProducts?.length || 0}
        isLoading={loading}
      />
    </div>
  );
}
