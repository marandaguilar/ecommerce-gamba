import { ProductType } from "@/types/product";
import FeaturedProductsClient from "./featured-products-client";

interface FeaturedProductsServerProps {
  products: ProductType[];
}

export default function FeaturedProductsServer({ products }: FeaturedProductsServerProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl py-10 mx-auto sm:py-16 sm:px-16 px-8">
      <h3 className="px-6 text-3xl sm:pb-8 p-2 font-bold">
        Productos destacados
      </h3>

      <FeaturedProductsClient products={products} />
    </div>
  );
}
