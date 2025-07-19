export function formatPrice(price: number) {
  const priceFormated = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return `$${priceFormated}`;
}
