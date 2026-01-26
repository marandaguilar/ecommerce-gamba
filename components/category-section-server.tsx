import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import ProductCard from "@/app/(routes)/category/[categorySlug]/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CategorySectionServerProps {
  category: CategoryType;
  products: ProductType[];
}

export default function CategorySectionServer({
  category,
  products,
}: CategorySectionServerProps) {
  // Show first 10 products or empty state
  const displayedProducts = products.slice(0, 10);

  return (
    <div className="max-w-[1600px] py-10 mx-auto sm:px-8 px-4">
      <Link href={`/category/${category.slug}`}>
        <h3 className="text-3xl font-medium px-6 py-2 hover:underline cursor-pointer">
          {category.categoryName}
        </h3>
      </Link>

      {displayedProducts.length > 0 ? (
        <>
          <div className="grid gap-2 sm:gap-4 mt-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayedProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link href={`/category/${category.slug}`}>
              <Button className="px-8 py-2 text-white rounded-lg transition-colors">
                Ver más productos de {category.categoryName}
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">
            No hay productos disponibles en esta categoría
          </p>
          <Link href="/products">
            <Button variant="outline">Ver todos los productos</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
