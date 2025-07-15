"use client";

import { useMemo } from "react";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import { Filter, Search } from "lucide-react";

interface ProductsFilterProps {
  products: ProductType[] | null;
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export default function ProductsFilter({
  products,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}: ProductsFilterProps) {
  // Extraer categorías únicas de los productos existentes
  const uniqueCategories = useMemo(() => {
    if (!products) return [];

    const categoriesMap = new Map();
    products.forEach((product: ProductType) => {
      if (product.category) {
        categoriesMap.set(product.category.id, product.category);
      }
    });

    return Array.from(categoriesMap.values());
  }, [products]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    if (value === "all") {
      onCategoryChange(null);
    } else {
      onCategoryChange(value);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        <select
          value={selectedCategory || "all"}
          onChange={handleCategoryChange}
          className="w-[210px] pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
        >
          <option value="all">Todas las categorías</option>
          {uniqueCategories.map((category: CategoryType) => (
            <option key={category.id} value={category.id.toString()}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-[280px] pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
