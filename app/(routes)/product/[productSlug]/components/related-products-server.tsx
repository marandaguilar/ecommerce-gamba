import { ProductType } from "@/types/product";
import RelatedProductCard from "./related-product-card";

interface RelatedProductsServerProps {
  products: ProductType[];
}

export default function RelatedProductsServer({ products }: RelatedProductsServerProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1600px] py-10 mx-auto sm:px-8 px-4">
      <h3 className="text-3xl font-medium px-6 py-2">
        Podría interesarte
      </h3>

      <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product: ProductType) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
