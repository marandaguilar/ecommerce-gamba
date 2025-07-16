import Link from "next/link";
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

type ProductCardProps = {
  product: ProductType;
};

const ProductCard = (props: ProductCardProps) => {
  const { product } = props;
  const router = useRouter();
  const { addLovedItem } = useLovedProducts();

  return (
    <div className="relative p-2 transition-all duration-100 rounded-lg hover:shadow-lg">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {product.images?.map((images: ImageType) => (
            <CarouselItem key={images.id} className="group">
              <img
                src={images.url}
                alt="Image"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute w-full px-6 transition duration-200 opacity-0 group-hover:opacity-100 bottom-5">
                <div className="flex justify-center gap-x-6">
                  <IconButton
                    onClick={() => router.push(`/product/${product.slug}`)}
                    icon={<Expand size={20} className="text-gray-600" />}
                  />
                  {/* <IconButton
                    onClick={() => console.log("product")}
                    icon={<ShoppingCart size={20} className="text-gray-600" />}
                  /> */}
                  <IconButton
                    onClick={() => addLovedItem(product)}
                    icon={<Heart size={20} className="text-gray-600" />}
                    className="transition duration-300 hover:fill-black cursor-pointer"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <p className="text-2xl text-center">{product.productName}</p>
      <div className="flex justify-between items-baseline">
        <p className="text-sm">Menudeo</p>
        <p className="font-bold text-center">{formatPrice(product.price)}</p>
      </div>
      <div className="flex justify-between items-baseline">
        <p className="text-sm">Mayoreo</p>
        <p className="font-bold text-center">
          {formatPrice(product.price_mayoreo)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
