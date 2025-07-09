"use client";

import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import { ResponseType } from "@/types/response";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import { ProductType } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import { Expand } from "lucide-react";
import IconButton from "./icon-button";
import { useRouter } from "next/navigation";
import ProductCategories from "./shared/product-categories";
import { MessageCircle } from "lucide-react";

const FeaturedProducts = () => {
  const { loading, result }: ResponseType = useGetFeaturedProducts();
  const router = useRouter();

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <h3 className="px-6 text-3xl sm:pb-8">Productos destacados</h3>
      <Carousel>
        <CarouselContent className="ml-2 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}
          {result !== null &&
            result.map((product: ProductType) => {
              const { id, slug, images, productName, category } = product;

              return (
                <CarouselItem
                  key={id}
                  className="md:basis-1/2 lg:basis-1/3 group"
                >
                  <div className="p-1">
                    <Card className="py-4 border border-gray-200 shadow-none">
                      <CardContent className="relative flex items-center justify-center px-6 py-2">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                            images?.[0]?.url || ""
                          }`}
                          alt="image featured"
                        />
                        <div className="absolute w-full px-6 transition duration-200 opacity-0 group-hover:opacity-100 bottom-5">
                          <div className="flex justify-center gap-x-6">
                            <IconButton
                              onClick={() => router.push(`/product/${slug}`)}
                              icon={<Expand size={20} />}
                              className="text-gray-600"
                            />
                            <IconButton
                              onClick={() => console.log("Mensaje")}
                              icon={<MessageCircle size={20} />}
                              className=" bg-green-800 text-white"
                            />
                            {/* <IconButton
                              onClick={() => addItem(product)}
                              icon={<ShoppingCart size={20} />}
                              className="text-gray-600"
                            /> */}
                          </div>
                        </div>
                      </CardContent>
                      <div className="flex justify-between gap-4 px-8 min-w-0 overflow-hidden items-center flex-wrap">
                        <h3 className="text-lg font-bold truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[60%]">
                          {productName}
                        </h3>
                        <div className="flex-shrink-0 flex flex-wrap gap-2">
                          <ProductCategories category={category} />
                        </div>
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
    </div>
  );
};

export default FeaturedProducts;
