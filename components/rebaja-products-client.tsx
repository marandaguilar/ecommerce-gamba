"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductType } from "@/types/product";
import ProductCard from "@/components/shared/product-card";

interface RebajaProductsClientProps {
  products: ProductType[];
}

export default function RebajaProductsClient({
  products,
}: RebajaProductsClientProps) {
  return (
    <Carousel>
      <CarouselContent className="ml-1 md:-ml-10">
        {products.map((product: ProductType) => (
          <CarouselItem
            key={product.id}
            className="basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="p-1">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4" />
      <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  );
}
