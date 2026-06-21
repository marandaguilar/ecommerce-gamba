import { ProductType } from "@/types/product";
import ProductCard from "@/components/shared/product-card";

interface RelatedProductsServerProps {
  products: ProductType[];
}

export default function RelatedProductsServer({ products }: RelatedProductsServerProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1600px] py-10 mx-auto sm:px-8 px-4">
      <h3 className="mb-6 font-display text-2xl font-bold sm:text-3xl">
        Podría interesarte
      </h3>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product: ProductType) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
