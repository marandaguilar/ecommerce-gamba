"use client";

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
}

export default function CategorySection({ category }: CategorySectionProps) {
  const { result: products, loading: productsLoading } = useGetCategoryProduct(
    category.slug,
    1,
    25,
    10
  );

  const router = useRouter();

  return (
    <div className="max-w-7xl py-10 mx-auto sm:px-16 px-8">
      <Link href={`/category/${category.slug}`}>
        <h3 className="text-3xl font-medium px-6 py-2 hover:underline cursor-pointer">
          {category.categoryName}
        </h3>
      </Link>

      <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {productsLoading ? (
          <div>Loading...</div>
        ) : (
          products &&
          products.slice(0, 10).map((product: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <ProductCard key={product.id} product={product as any} /> // eslint-disable-line @typescript-eslint/no-explicit-any
          ))
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => router.push(`/category/${category.slug}`)}
          className="px-8 py-2 text-white dark:text-black rounded-lg transition-colors"
        >
          Ver más productos de {category.categoryName}
        </Button>
      </div>
    </div>
  );
}