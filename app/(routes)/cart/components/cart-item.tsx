import { X } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import ProductCategories from "@/components/shared/product-categories";
import ProductImageMiniature from "@/components/shared/product-image-miniature";

interface CartItemProps {
  product: ProductType;
}

const CartItem = (props: CartItemProps) => {
  const { product } = props;
  const { removeItem } = useCart();

  // Mayorista-first (RN-1): el mayoreo es protagonista; si falta, el menudeo.
  const mayoreo = formatPrice(product.price_mayoreo);
  const menudeo = formatPrice(product.price);
  const primaryPrice = mayoreo ?? menudeo;
  const primaryLabel = mayoreo ? "Mayoreo" : "Menudeo";
  const secondaryPrice = mayoreo ? menudeo : null;

  return (
    <li className="flex py-6 border-b">
      <ProductImageMiniature
        slug={product.slug || ""}
        url={product.images?.[0]?.url || ""}
      />
      <div className="flex justify-between flex-1 gap-4 px-4 sm:px-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold sm:text-lg">
            {product.productName}
          </h2>
          {primaryPrice ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {primaryLabel}
              </p>
              <p className="font-display text-lg font-extrabold text-primary">
                {primaryPrice}
              </p>
              {secondaryPrice && (
                <p className="text-xs text-muted-foreground">
                  Menudeo {secondaryPrice}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Consultar precio</p>
          )}
          <div className="mt-1">
            <ProductCategories category={product.category} />
          </div>
        </div>
        <button
          type="button"
          aria-label={`Quitar ${product.productName} del pedido`}
          onClick={() => removeItem(product.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white shadow-md transition hover:scale-110"
        >
          <X size={18} />
        </button>
      </div>
    </li>
  );
};

export default CartItem;
