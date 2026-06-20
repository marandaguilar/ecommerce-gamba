"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { ProductType } from "@/types/product";
import { useLovedProducts } from "@/hooks/use-loved-products";
import { useCart } from "@/hooks/use-cart";
import ProductCategories from "@/components/shared/product-categories";

export type InfoProductProps = {
  product: ProductType;
};

const InfoProduct = (props: InfoProductProps) => {
  const { product } = props;
  const { addItem } = useCart();
  const { lovedItems, addLovedItem, removeLovedItem } = useLovedProducts();

  // Guard de hydration: el favorito vive en localStorage (persist).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLoved = mounted && lovedItems.some((item) => item.id === product.id);

  // Mayorista-first (RN-1): el mayoreo es protagonista; si falta, el menudeo.
  const mayoreo = formatPrice(product.price_mayoreo);
  const menudeo = formatPrice(product.price);
  const primaryPrice = mayoreo ?? menudeo;
  const primaryLabel = mayoreo ? "Mayoreo" : "Menudeo";
  const secondaryPrice = mayoreo ? menudeo : null;

  const toggleLoved = () => {
    if (isLoved) {
      removeLovedItem(product);
    } else {
      addLovedItem(product);
    }
  };

  const openWhatsapp = () => {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : undefined;
    window.open(buildWhatsappUrl(product, baseUrl), "_blank");
  };

  return (
    <div className="px-4">
      <div className="justify-between mb-3 sm:flex">
        <h1 className="font-display text-2xl font-bold">
          {product.productName}
        </h1>
        <ProductCategories category={product.category} />
      </div>
      <Separator className="my-2" />
      <div>
        <p className="text-md text-gray-800">{product.description}</p>
      </div>
      <div className="flex items-center gap-2 py-2">
        <span className="text-sm text-gray-500">
          Las imágenes pueden tener ligeras variaciones, únicamente son
          referenciales.
        </span>
      </div>
      <Separator className="my-4" />

      {/* Precios — mayoreo protagonista */}
      <div className="mb-6">
        {primaryPrice ? (
          <>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Precio {primaryLabel}
            </p>
            <p className="font-display text-3xl font-extrabold text-primary">
              {primaryPrice}
            </p>
            {secondaryPrice && (
              <p className="text-sm text-muted-foreground">
                Menudeo {secondaryPrice}
              </p>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">Consultar precio</p>
        )}
      </div>

      {/* CTAs de conversión */}
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          onClick={openWhatsapp}
          className="w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 active:bg-whatsapp/80"
        >
          <MessageCircle className="size-5" />
          Pedir por WhatsApp
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => addItem(product)}
            className="flex-1"
          >
            <Plus className="size-4" />
            Agregar a mi pedido
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={toggleLoved}
            aria-pressed={isLoved}
            aria-label={isLoved ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={cn("size-4", isLoved && "fill-current text-primary")}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoProduct;
