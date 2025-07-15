"use client";

import { useState, useMemo } from "react";
import { useGetAllProducts } from "@/api/getProducts";
import { ResponseType } from "@/types/response";
import { Separator } from "@/components/ui/separator";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "./components/carousel-products";
import ProductsFilter from "./components/products-filter";
import { ProductType } from "@/types/product";

export default function Page() {
  const { result: products, loading: productsLoading }: ResponseType =
    useGetAllProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

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
          {filteredProducts !== null &&
            !productsLoading &&
            filteredProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {filteredProducts !== null &&
            !productsLoading &&
            filteredProducts.length === 0 && (
              <p>No hay productos disponibles</p>
            )}
        </div>
      </div>
    </div>
  );
}
