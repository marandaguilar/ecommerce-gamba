import { Plus, X } from "lucide-react";

import { useLovedProducts } from "@/hooks/use-loved-products";
import { useCart } from "@/hooks/use-cart";
import { ProductType } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { Button } from "@/components/ui/button";
import ProductCategories from "@/components/shared/product-categories";
import ProductImageMiniature from "@/components/shared/product-image-miniature";

interface LovedItemProductProps {
  product: ProductType;
}

const LovedItemProduct = (props: LovedItemProductProps) => {
  const { product } = props;
  const { removeLovedItem } = useLovedProducts();
  const { addItem } = useCart();

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
      <div className="flex flex-1 flex-col justify-between gap-3 px-4 sm:flex-row sm:px-6">
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

        <div className="flex items-start gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => addItem(product)}
            aria-label={`Agregar ${product.productName} a mi pedido`}
          >
            <Plus className="size-4" />
            Agregar a mi pedido
          </Button>
          <button
            type="button"
            aria-label={`Quitar ${product.productName} de favoritos`}
            onClick={() => removeLovedItem(product)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white shadow-md transition hover:scale-110"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default LovedItemProduct;
