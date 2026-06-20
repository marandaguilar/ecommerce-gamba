/**
 * Construcción centralizada de enlaces de WhatsApp.
 * WhatsApp es el canal de conversión oficial (Spec §4.4): este helper arma
 * el mensaje prellenado por producto, reutilizable desde card y detalle.
 */

/** Número de destino (solo dígitos, formato wa.me). */
export const WHATSAPP_PHONE = "524494056193";

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
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
