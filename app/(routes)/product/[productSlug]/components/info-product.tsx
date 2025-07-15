import IconButton from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { Separator } from "@radix-ui/react-separator";
import { Heart, MessageCircle } from "lucide-react";
import { useLovedProducts } from "@/hooks/use-loved-products";
import ProductCategories from "@/components/shared/product-categories";

export type InfoProductProps = {
  product: ProductType;
};

const InfoProduct = (props: InfoProductProps) => {
  const { product }: InfoProductProps = props;
  // const { addItem } = useCart();
  const { addLovedItem } = useLovedProducts();

  return (
    <div className="px-4">
      <div className="justify-between mb-3 sm:flex">
        <h1 className="text-2xl font-bold">{product.productName}</h1>
        <ProductCategories category={product.category} />
      </div>
      <Separator className="my-2 border-gray-200 border-1" />
      <div>
        <p className="text-md text-gray-800">{product.description}</p>
      </div>
      <Separator className="my-4" />
      <div className="mb-4">
        <div className="flex items-baseline gap-x-2">
          <h4 className="text-lg">Precio menudeo:</h4>
          <p className="text-lg font-bold">{formatPrice(product.price)}</p>
        </div>
        <div className="flex items-baseline gap-x-2">
          <h4 className="text-lg">Precio mayoreo:</h4>
          <p className="text-lg font-bold">
            {formatPrice(product.price_mayoreo)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-5">
        {/* <Button className="w-full" onClick={() => addItem(product)}>
          <ShoppingCart size={20} />
          <span>Comprar</span>
        </Button> */}
        <Button
          className="w-full bg-green-600 text-white text-md hover:bg-green-700"
          onClick={() => {
            const phoneNumber = "+524494056193";
            const message = `Quiero más información de ${product.productName}`;
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
              message
            )}`;
            window.open(whatsappUrl, "_blank");
          }}
        >
          <MessageCircle size={20} />
          <span>Mándanos un mensaje</span>
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
