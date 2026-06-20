"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

import { ProductType } from "@/types/product";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatPrice";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { useLovedProducts } from "@/hooks/use-loved-products";
import { Button } from "@/components/ui/button";
import ProductCategories from "@/components/shared/product-categories";

type ProductCardProps = {
  product: ProductType;
  /** Marca la imagen como prioritaria (LCP) para cards above-the-fold. */
  priority?: boolean;
  className?: string;
};

const ProductCard = ({ product, priority = false, className }: ProductCardProps) => {
  const { lovedItems, addLovedItem, removeLovedItem } = useLovedProducts();

  // Evita hydration mismatch: el estado de favorito (persistido en
  // localStorage) solo se refleja después de montar en el cliente.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLoved = mounted && lovedItems.some((item) => item.id === product.id);

  const firstImage = product.images?.[0];
  const productHref = `/product/${product.slug}`;

  // Mayorista-first: el mayoreo es protagonista; si falta, el menudeo lo es.
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
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.isRebaja && (
          <span className="rounded-full bg-offer px-2 py-0.5 text-xs font-bold text-offer-foreground shadow-sm">
            Oferta
          </span>
        )}
      </div>
      {product.category && (
        <div className="absolute right-2 top-2 z-10">
          <ProductCategories category={product.category} />
        </div>
      )}

      {/* Imagen */}
      <Link
        href={productHref}
        className="relative block h-[200px] w-full bg-muted sm:h-[220px]"
      >
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={product.productName}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-4"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={productHref}>
          <h3 className="truncate text-center text-sm font-medium sm:text-base">
            {product.productName}
          </h3>
        </Link>

        {/* Precios — mayoreo protagonista */}
        <div className="text-center">
          {primaryPrice ? (
            <>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {primaryLabel}
              </p>
              <p className="font-display text-xl font-extrabold text-primary">
                {primaryPrice}
              </p>
              {secondaryPrice && (
                <p className="text-xs text-muted-foreground">
                  Menudeo {secondaryPrice}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Consultar precio</p>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-auto flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={openWhatsapp}
            className="flex-1 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 active:bg-whatsapp/80"
          >
            <MessageCircle className="size-4" />
            Pedir
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={toggleLoved}
            aria-pressed={isLoved}
            aria-label={isLoved ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={cn("size-4", isLoved && "fill-current text-primary")} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
