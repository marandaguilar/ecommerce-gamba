/**
 * Helpers de unidad de venta (pieza/litro/kg).
 * Centraliza el etiquetado de cantidad + unidad y la elección de la unidad
 * por defecto, reutilizado por el detalle, el carrito y el mensaje de pedido.
 */
import type { ProductType, SaleUnit } from "@/types/product";

/** Singular/plural por unidad para mostrar "1 pieza" / "3 piezas" / "2 litros". */
const UNIT_LABELS: Record<SaleUnit, { one: string; many: string }> = {
  pieza: { one: "pieza", many: "piezas" },
  litro: { one: "litro", many: "litros" },
  kg: { one: "kg", many: "kg" },
};

/** Orden de presentación estable de las unidades en el selector. */
const UNIT_ORDER: SaleUnit[] = ["pieza", "litro", "kg"];

/** Etiqueta legible de una unidad ("pieza", "litros", "kg"). */
export function unitLabel(unit: SaleUnit, plural = false): string {
  const label = UNIT_LABELS[unit];
  return plural ? label.many : label.one;
}

/** Cantidad + unidad ya formateada, ej. "3 kg", "1 pieza"; sin unidad solo el número. */
export function formatUnitQuantity(
  quantity: number,
  unit?: SaleUnit | null
): string {
  const qty = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  if (!unit) return `${qty}`;
  return `${qty} ${unitLabel(unit, qty !== 1)}`;
}

/** Unidades del producto ordenadas; vacío si no tiene ninguna configurada. */
export function getProductUnits(
  product: Pick<ProductType, "unidades">
): SaleUnit[] {
  const unidades = product.unidades ?? [];
  return UNIT_ORDER.filter((u) => unidades.some((item) => item.unidad === u));
}

/** Unidad por defecto: la marcada como `predeterminada`, o la primera disponible. */
export function getDefaultUnit(
  product: Pick<ProductType, "unidades">
): SaleUnit | null {
  const unidades = product.unidades ?? [];
  if (unidades.length === 0) return null;
  const preferred = unidades.find((u) => u.predeterminada) ?? unidades[0];
  return preferred.unidad;
}
