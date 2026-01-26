import { ImageType, ProductType } from "@/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import IconButton from "@/components/icon-button";
import { Expand, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import { useLovedProducts } from "@/hooks/use-loved-products";
import ProductCategories from "@/components/shared/product-categories";

type ProductCardProps = {
  product: ProductType;
};

const ProductCard = (props: ProductCardProps) => {
  const { product } = props;
  const router = useRouter();
  const { addLovedItem } = useLovedProducts();

  return (
    <div className="relative transition-all duration-100 rounded-lg hover:shadow-lg border border-gray-200 flex flex-col overflow-hidden bg-white">
      {/* Image container with strict fixed height */}
      <div className="relative h-[240px] w-full bg-gray-50 shrink-0">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {product.images?.map((images: ImageType) => (
              <CarouselItem key={images.id} className="group h-full">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src={images.url}
                    alt={product.productName}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  />
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <ProductCategories category={product.category} />
                </div>
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
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Product info - anchored at bottom */}
      <div className="flex flex-col gap-2 p-4 mt-auto">
        <p className="text-base font-medium truncate w-full text-center min-h-[24px]">
          {product.productName}
        </p>
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1">
            <p className="text-xs text-gray-600 text-center">Mayoreo</p>
            <p className="font-bold text-sm text-center">
              {formatPrice(product.price_mayoreo)}
            </p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 text-center">Menudeo</p>
            <p className="font-bold text-sm text-center">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
