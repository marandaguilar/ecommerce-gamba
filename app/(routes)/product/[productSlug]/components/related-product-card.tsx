"use client";

import { ProductType } from "@/types/product";
import IconButton from "@/components/icon-button";
import { Expand, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLovedProducts } from "@/hooks/use-loved-products";

type RelatedProductCardProps = {
  product: ProductType;
};

export default function RelatedProductCard({ product }: RelatedProductCardProps) {
  const router = useRouter();
  const { addLovedItem } = useLovedProducts();

  const firstImage = product.images?.[0];

  return (
    <div className="relative transition-all duration-100 rounded-lg hover:shadow-lg border border-gray-200 flex flex-col overflow-hidden bg-white">
      {/* Image container with strict fixed height */}
      <div className="relative h-[200px] w-full bg-gray-50 shrink-0">
        <div className="w-full h-full flex items-center justify-center p-4 group">
          {firstImage && (
            <img
              src={firstImage.url}
              alt={product.productName}
              className="w-full h-full object-contain"
              loading="lazy"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          )}
          <div className="absolute w-full px-6 transition duration-200 sm:opacity-0 sm:group-hover:opacity-100 bottom-4">
            <div className="flex justify-center gap-x-6 items-center">
              <IconButton
                onClick={() => router.push(`/product/${product.slug}`)}
                icon={<Expand size={30} className="text-gray-600" />}
              />
              <IconButton
                onClick={() => addLovedItem(product)}
                icon={<Heart size={30} className="text-gray-600" />}
                className="transition duration-300 hover:fill-black cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product info - anchored at bottom */}
      <div className="flex flex-col gap-2 p-4 mt-auto">
        <p className="text-base font-medium truncate w-full text-center min-h-[24px]">
          {product.productName}
        </p>
      </div>
    </div>
  );
}
