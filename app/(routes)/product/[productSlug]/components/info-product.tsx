"use client";

import { useState } from "react";
import { Heart, MessageCircle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { getPrimaryPricing } from "@/lib/pricing";
import { getDefaultUnit, getProductUnits, unitLabel } from "@/lib/units";
import { cn } from "@/lib/utils";
import { buildWhatsappUrl, getBaseUrl, openWhatsapp } from "@/lib/whatsapp";
import { ProductType, SaleUnit } from "@/types/product";
import { useLovedProducts } from "@/hooks/use-loved-products";
import { useCart } from "@/hooks/use-cart";
import { useMounted } from "@/hooks/use-mounted";
import ProductCategories from "@/components/shared/product-categories";

export type InfoProductProps = {
  product: ProductType;
};

const InfoProduct = (props: InfoProductProps) => {
  const { product } = props;
  const { addItem } = useCart();
  const { lovedItems, toggleLovedItem } = useLovedProducts();

  // Guard de hydration: el favorito vive en localStorage (persist).
  const mounted = useMounted();
  const isLoved = mounted && lovedItems.some((item) => item.id === product.id);

  const { primaryPrice, primaryLabel, secondaryPrice } =
    getPrimaryPricing(product);

  // Unidades de venta del producto (puede no tener ninguna configurada).
  const units = getProductUnits(product);
  const hasUnits = units.length > 0;
  const [selectedUnit, setSelectedUnit] = useState<SaleUnit | null>(() =>
    getDefaultUnit(product)
  );
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: string) => {
    const parsed = parseInt(value, 10);
    setQuantity(Number.isFinite(parsed) && parsed >= 1 ? parsed : 1);
  };

  const handleAddToCart = () => {
    if (hasUnits) {
      addItem(product, { unidad: selectedUnit, cantidad: quantity });
    } else {
      addItem(product);
    }
  };

  const handleWhatsapp = () => {
    openWhatsapp(buildWhatsappUrl(product, getBaseUrl()));
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

      {/* Selección de unidad y cantidad (solo si el producto tiene unidades) */}
      {hasUnits && (
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Unidad
            </p>
            <RadioGroup
              value={selectedUnit ?? undefined}
              onValueChange={(value) => setSelectedUnit(value as SaleUnit)}
              className="flex flex-wrap gap-2"
            >
              {units.map((unit) => (
                <Label
                  key={unit}
                  htmlFor={`unit-${unit}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm capitalize transition",
                    selectedUnit === unit
                      ? "border-primary bg-primary/5"
                      : "border-input hover:bg-muted"
                  )}
                >
                  <RadioGroupItem id={`unit-${unit}`} value={unit} />
                  {unitLabel(unit, true)}
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Cantidad
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
              >
                <Minus className="size-4" />
              </Button>
              <Input
                type="number"
                min={1}
                inputMode="numeric"
                value={quantity}
                onChange={(event) => handleQuantityChange(event.target.value)}
                className="w-20 text-center"
                aria-label="Cantidad"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar cantidad"
              >
                <Plus className="size-4" />
              </Button>
              {selectedUnit && (
                <span className="text-sm text-muted-foreground">
                  {unitLabel(selectedUnit, quantity !== 1)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTAs de conversión */}
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          onClick={handleWhatsapp}
          className="w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 active:bg-whatsapp/80"
        >
          <MessageCircle className="size-5" />
          Pedir por WhatsApp
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddToCart}
            className="flex-1"
          >
            <Plus className="size-4" />
            Agregar a mi pedido
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => toggleLovedItem(product)}
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
