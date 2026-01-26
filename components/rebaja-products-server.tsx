import { ProductType } from "@/types/product";
import RebajaProductsClient from "./rebaja-products-client";

interface RebajaProductsServerProps {
  products: ProductType[];
}

export default function RebajaProductsServer({ products }: RebajaProductsServerProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl py-10 mx-auto sm:py-16 sm:px-16 px-8">
      <h3 className="px-6 text-3xl sm:pb-8 p-2 font-bold">
        Productos en rebaja
      </h3>

      <RebajaProductsClient products={products} />
    </div>
  );
}
