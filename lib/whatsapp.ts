/**
 * Construcción centralizada de enlaces de WhatsApp.
 * WhatsApp es el canal de conversión oficial (Spec §4.4): este helper arma
 * el mensaje prellenado por producto, reutilizable desde card y detalle.
 */
import { formatPrice } from "./formatPrice.ts";

/** Número de destino (solo dígitos, formato wa.me). */
export const WHATSAPP_PHONE = "524494056193";

function toWhatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** Campos mínimos que el mensaje necesita de un producto. */
type WhatsappProduct = {
  productName: string;
  slug: string;
};

function buildProductMessage(product: WhatsappProduct, baseUrl?: string): string {
  const link = baseUrl ? `${baseUrl}/product/${product.slug}` : "";
  return `Hola, quiero información sobre: ${product.productName}${
    link ? ` (${link})` : ""
  }`;
}

/**
 * Devuelve la URL `https://wa.me/<phone>?text=...` con el mensaje prellenado
 * para un producto. Si se pasa `baseUrl`, incluye el link al producto.
 */
export function buildWhatsappUrl(
  product: WhatsappProduct,
  baseUrl?: string
): string {
  const message = buildProductMessage(product, baseUrl);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** Mensaje por defecto del canal (FAB / contacto general). */
const DEFAULT_GENERAL_MESSAGE = "Hola, quiero más información sobre sus productos";

/**
 * URL de WhatsApp para contacto general (sin producto). Útil para el FAB
 * y accesos del header.
 */
export function buildGeneralWhatsappUrl(
  message: string = DEFAULT_GENERAL_MESSAGE
): string {
  return toWhatsappUrl(message);
}

/** Ítem mínimo que necesita el mensaje de un pedido/lista multi-producto. */
export type WhatsappOrderItem = {
  productName: string;
  slug: string;
  /** Mayorista-first (RN-1): se muestra el mayoreo y, si falta, el menudeo. */
  price_mayoreo?: number | null;
  price?: number | null;
  /** Reservado para un futuro modelo con cantidades (RF-14 "si aplica"). */
  quantity?: number;
};

type OrderOptions = {
  /** Origen para armar el link a cada producto (`${baseUrl}/product/${slug}`). */
  baseUrl?: string;
  /** Encabezado del mensaje (default: pedido). Favoritos pasa el suyo. */
  intro?: string;
};

const DEFAULT_ORDER_INTRO = "Hola, quiero hacer este pedido:";
const EMPTY_ORDER_MESSAGE =
  "Hola, quiero más información sobre sus productos";

function buildOrderItemLine(item: WhatsappOrderItem, baseUrl?: string): string {
  const priceValue = item.price_mayoreo ?? item.price;
  const price = formatPrice(priceValue);
  const qty = item.quantity && item.quantity > 1 ? ` x${item.quantity}` : "";
  const link = baseUrl ? ` ${baseUrl}/product/${item.slug}` : "";
  return `• ${item.productName}${qty}${price ? ` — ${price}` : ""}${link}`;
}

/**
 * Devuelve un único enlace `wa.me` con todos los ítems en formato legible.
 * Reutilizado por "Mi pedido" (RF-14) y favoritos (RF-13) variando `intro`.
 * Centraliza el formato del mensaje multi-ítem (Spec §8: muchos ítems).
 */
export function buildOrderWhatsappUrl(
  items: WhatsappOrderItem[],
  options: OrderOptions = {}
): string {
  if (items.length === 0) {
    return toWhatsappUrl(EMPTY_ORDER_MESSAGE);
  }

  const intro = options.intro ?? DEFAULT_ORDER_INTRO;
  const lines = items.map((item) => buildOrderItemLine(item, options.baseUrl));
  return toWhatsappUrl(`${intro}\n${lines.join("\n")}`);
}
