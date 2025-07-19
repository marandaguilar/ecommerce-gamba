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
    <div className="relative p-2 transition-all duration-100 rounded-lg hover:shadow-lg h-[350px] border border-gray-200 dark:border-gray-700 flex flex-col">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm flex-1"
      >
        <CarouselContent>
          {product.images?.map((images: ImageType) => (
            <CarouselItem key={images.id} className="group">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={images.url}
                  alt="Image"
                  className="w-max h-56 object-contain object-center rounded-md"
                  loading="lazy"
                />
              </div>
              <div className="absolute w-full px-6 transition duration-200 opacity-0 group-hover:opacity-100 bottom-2">
                <div className="flex justify-center gap-x-6 items-center">
                  <IconButton
                    onClick={() => router.push(`/product/${product.slug}`)}
                    icon={<Expand size={30} className="text-gray-600" />}
                  />
                  {/* <IconButton
                    onClick={() => console.log("product")}
                    icon={<ShoppingCart size={20} className="text-gray-600" />}
                  /> */}
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
      <div className="flex flex-col justify-between m-2 mt-auto">
        <p className="text-2xl truncate w-full text-center">
          {product.productName}
        </p>
        <div className="flex justify-between">
          <p className="text-sm">Menudeo:</p>
          <p className="text-sm">Mayoreo:</p>
        </div>
        <div className="flex justify-between">
          <p className="font-bold text-center text-lg">
            {formatPrice(product.price_mayoreo)}
          </p>
          <p className="font-bold text-center text-lg">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
