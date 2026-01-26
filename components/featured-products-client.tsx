"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductType } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import { Expand, Heart } from "lucide-react";
import IconButton from "./icon-button";
import { useRouter } from "next/navigation";
import ProductCategories from "./shared/product-categories";
import { useLovedProducts } from "@/hooks/use-loved-products";

interface FeaturedProductsClientProps {
  products: ProductType[];
}

export default function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
  const router = useRouter();
  const { addLovedItem } = useLovedProducts();

  return (
    <Carousel>
      <CarouselContent className="ml-1 md:-ml-10">
        {products.map((product: ProductType) => {
          const { id, slug, images, productName, category } = product;

          return (
            <CarouselItem
              key={id}
              className="md:basis-1/2 lg:basis-1/4 xl:basis-1/5 group"
            >
              <div className="p-1">
                <Card className="py-1 border border-gray-200 shadow-none">
                  <CardContent className="relative flex items-center justify-center px-2 py-0">
                    <img
                      src={images?.[0]?.url || ""}
                      className="w-full h-full rounded-lg"
                      alt="image featured"
                      loading="lazy"
                    />
                    <div className="absolute right-2 top-2">
                      <ProductCategories category={category} />
                    </div>
                    <div className="absolute w-full px-6 transition duration-200 sm:opacity-0 sm:group-hover:opacity-100 bottom-1">
                      <div className="flex justify-center gap-x-6">
                        <IconButton
                          onClick={() => router.push(`/product/${slug}`)}
                          icon={<Expand size={28} />}
                          className="text-gray-600"
                        />
                        <IconButton
                          onClick={() => addLovedItem(product)}
                          icon={<Heart size={28} />}
                          className="text-gray-600 transition duration-300 hover:fill-black cursor-pointer"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex justify-between gap-4 px-2 min-w-0 overflow-hidden items-center flex-wrap">
                    <h3 className="ext-lg font-bold truncate whitespace-nowrap overflow-hidden text-ellipsis text-center">
                      {productName}
                    </h3>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4" />
      <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  );
}
