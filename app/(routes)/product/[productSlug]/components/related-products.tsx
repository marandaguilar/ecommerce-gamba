"use client";

import { useState, useEffect, useMemo } from "react";
import { useGetCategoryProduct } from "@/api/getCategoryProduct";
import RelatedProductCard from "./related-product-card";
import SkeletonSchema from "@/components/skeletonSchema";
import { ProductType } from "@/types/product";

interface RelatedProductsProps {
  currentProductId: number;
  categorySlug: string;
}

export default function RelatedProducts({ 
  currentProductId, 
  categorySlug 
}: RelatedProductsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { result: categoryProducts, loading: productsLoading } = useGetCategoryProduct(
    categorySlug,
    1,
    25,
    100
  );

  const relatedProducts = useMemo(() => {
    if (!categoryProducts) return [];
    
    const limit = isMobile ? 5 : 10;
    
    return categoryProducts
      .filter((product: ProductType) => product.id !== currentProductId)
      .slice(0, limit);
  }, [categoryProducts, currentProductId, isMobile]);

  if (!categoryProducts || categoryProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1600px] py-10 mx-auto sm:px-8 px-4">
      <h3 className="text-3xl font-medium px-6 py-2">
        Podría interesarte
      </h3>

      <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {productsLoading ? (
          <SkeletonSchema grid={isMobile ? 5 : 10} />
        ) : relatedProducts.length > 0 ? (
          relatedProducts.map((product: ProductType) => (
            <RelatedProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center py-4">
            No hay productos relacionados en esta categoría
          </p>
        )}
      </div>
    </div>
  );
}
