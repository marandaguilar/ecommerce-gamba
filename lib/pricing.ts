/**
 * Jerarquía de precios "mayorista-first" (RN-1): el mayoreo es el precio
 * protagonista y, si falta, el menudeo ocupa su lugar. Centraliza la regla
 * que antes vivía duplicada en card, detalle, pedido y favoritos.
 */
import { formatPrice } from "./formatPrice.ts";

type PricedProduct = {
  price_mayoreo?: number | null;
  price?: number | null;
};

export type PrimaryPricing = {
  /** Precio protagonista ya formateado, o `null` si no hay ninguno. */
  primaryPrice: string | null;
  /** Etiqueta del precio protagonista ("Mayoreo" | "Menudeo"). */
  primaryLabel: "Mayoreo" | "Menudeo";
  /** Menudeo formateado como secundario, solo cuando el mayoreo es el primario. */
  secondaryPrice: string | null;
};

export function getPrimaryPricing(product: PricedProduct): PrimaryPricing {
  const mayoreo = formatPrice(product.price_mayoreo);
  const menudeo = formatPrice(product.price);

  return {
    primaryPrice: mayoreo ?? menudeo,
    primaryLabel: mayoreo ? "Mayoreo" : "Menudeo",
    secondaryPrice: mayoreo ? menudeo : null,
  };
}
