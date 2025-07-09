import IconButton from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { Separator } from "@radix-ui/react-separator";
import { Heart, ShoppingCart } from "lucide-react";
import { useLovedProducts } from "@/hooks/use-loved-products";
import ProductCategories from "@/components/shared/product-categories";

export type InfoProductProps = {
  product: ProductType;
};

const InfoProduct = (props: InfoProductProps) => {
  const { product }: InfoProductProps = props;
  const { addItem } = useCart();
  const { addLovedItem } = useLovedProducts();

  return (
    <div className="px-6">
      <div className="justify-between mb-3 sm:flex">
        <h1 className="textl-2xl">{product.productName}</h1>
        <ProductCategories category={product.category?.categoryName || ""} />
      </div>
      <Separator className="my-4" />
      <div>
        <p className="text-sm text-gray-500">{product.description}</p>
      </div>
      <Separator className="my-4" />
      <div className="flex items-baseline gap-x-2">
        <h4 className="text-lg">Precio menudeo:</h4>
        <p className="text-lg">{formatPrice(product.price)}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <h4 className="text-lg">Precio mayoreo:</h4>
        <p className="text-lg">{formatPrice(product.price_mayoreo)}</p>
      </div>
      <div className="flex items-center gap-5">
        <Button className="w-full" onClick={() => addItem(product)}>
          <ShoppingCart size={20} />
          <span>Comprar</span>
        </Button>
        <IconButton
          onClick={() => addLovedItem(product)}
          icon={<Heart size={20} strokeWidth={1.5} />}
          className="transition duration-300 hover:fill-black cursor-pointer"
        />
      </div>
    </div>
  );
};

export default InfoProduct;
