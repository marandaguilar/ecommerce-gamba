"use client";

import { useState, useEffect, useMemo } from "react";
import { useGetCategoryProduct } from "@/api/getCategoryProduct";
import ProductCard from "@/app/(routes)/category/[categorySlug]/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CategorySectionProps {
  category: {
    id: string;
    slug: string;
    categoryName: string;
  };
  searchTerm: string;
}

export default function CategorySection({ category, searchTerm }: CategorySectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { result: products, loading: productsLoading } = useGetCategoryProduct(
    category.slug,
    1,
    25,
    100
  );

  const router = useRouter();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (searchTerm.trim() === "") return products.slice(0, isMobile ? 5 : 10);
    const searchLower = searchTerm.toLowerCase();
    return products.filter((product: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
      product.productName.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  }, [products, searchTerm, isMobile]);

  return (
    <div className="max-w-[1600px] py-10 mx-auto sm:px-8 px-4">
      <Link href={`/category/${category.slug}`}>
        <h3 className="text-3xl font-medium px-6 py-2 hover:underline cursor-pointer">
          {category.categoryName}
        </h3>
      </Link>

      <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {productsLoading ? (
          <div>Loading...</div>
        ) : (
          filteredProducts.map((product: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <ProductCard key={product.id} product={product as any} /> // eslint-disable-line @typescript-eslint/no-explicit-any
          ))
        )}
        {!productsLoading && filteredProducts.length === 0 && searchTerm.trim() !== "" && (
          <p>No hay productos que coincidan con la búsqueda</p>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => router.push(`/category/${category.slug}`)}
          className="px-8 py-2 text-white rounded-lg transition-colors"
        >
          Ver más productos de {category.categoryName}
        </Button>
      </div>
    </div>
  );
}