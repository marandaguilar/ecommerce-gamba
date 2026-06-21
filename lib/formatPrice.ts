/**
 * Formatea un precio como moneda. Devuelve `null` cuando el valor no es un
 * número finito (undefined / null / NaN) para que la UI decida cómo mostrar
 * la ausencia (ej. ocultar o "Consultar"), evitando "$NaN".
 */
export function formatPrice(price: number | null | undefined): string | null {
  if (price == null || !Number.isFinite(price)) {
    return null;
  }

  const priceFormated = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return `$${priceFormated}`;
}
